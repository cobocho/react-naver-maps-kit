import { render, screen, waitFor } from "@testing-library/react";
import { Suspense } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useNaverMap } from "../hooks/useNaverMap";
import {
  NaverMapContext,
  NaverMapProvider,
  type NaverMapContextValue
} from "../provider/NaverMapProvider";

import { NaverMap } from "./NaverMap";

type MockMapInstance = {
  destroy: ReturnType<typeof vi.fn>;
  refresh: ReturnType<typeof vi.fn>;
  setCenter: ReturnType<typeof vi.fn>;
  setMapTypeId: ReturnType<typeof vi.fn>;
  setOptions: ReturnType<typeof vi.fn>;
  setZoom: ReturnType<typeof vi.fn>;
};

function createMockMapInstance(): MockMapInstance {
  return {
    destroy: vi.fn(),
    refresh: vi.fn(),
    setCenter: vi.fn(),
    setMapTypeId: vi.fn(),
    setOptions: vi.fn(),
    setZoom: vi.fn()
  };
}

function createMockContextValue(
  overrides: Partial<NaverMapContextValue> = {}
): NaverMapContextValue {
  const reloadSdk = overrides.reloadSdk ?? vi.fn(async () => undefined);

  return {
    sdkStatus: "ready",
    sdkError: null,
    reloadSdk,
    retrySdk: overrides.retrySdk ?? reloadSdk,
    clearSdkError: vi.fn(),
    submodules: [],
    map: null,
    setMap: vi.fn(),
    ...overrides
  };
}

function HookProbe({
  onContext
}: {
  onContext: (context: ReturnType<typeof useNaverMap>) => void;
}) {
  const context = useNaverMap();
  onContext(context);
  return null;
}

function OutsideProviderProbe() {
  useNaverMap();
  return null;
}

describe("NaverMap + Provider + Hook integration", () => {
  let clearInstanceListenersMock: ReturnType<typeof vi.fn>;
  let mapConstructorMock: ReturnType<typeof vi.fn>;

  let addListenerMock: ReturnType<typeof vi.fn>;
  let removeListenerMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    clearInstanceListenersMock = vi.fn();
    addListenerMock = vi.fn(() => ({}));
    removeListenerMock = vi.fn();
    mapConstructorMock = vi.fn(() => createMockMapInstance());

    (window as Window & { naver?: unknown }).naver = {
      maps: {
        Event: {
          addListener: addListenerMock,
          removeListener: removeListenerMock,
          clearInstanceListeners: clearInstanceListenersMock
        },
        Map: mapConstructorMock
      }
    };
  });

  afterEach(() => {
    delete (window as Window & { naver?: unknown }).naver;
  });

  it("provides map instance via Provider + Map + Hook", async () => {
    let latestContext: ReturnType<typeof useNaverMap> | null = null;

    render(
      <NaverMapProvider ncpKeyId="test-key" timeoutMs={1000}>
        <HookProbe onContext={(context) => (latestContext = context)} />
        <NaverMap style={{ height: 100, width: 100 }} />
      </NaverMapProvider>
    );

    await waitFor(() => {
      expect(latestContext?.sdkStatus).toBe("ready");
      expect(latestContext?.map).toBeTruthy();
    });

    expect(mapConstructorMock).toHaveBeenCalledTimes(1);
  });

  it("cleans map resources on unmount", async () => {
    const { unmount } = render(
      <NaverMapProvider ncpKeyId="test-key" timeoutMs={1000}>
        <NaverMap style={{ height: 100, width: 100 }} />
      </NaverMapProvider>
    );

    await waitFor(() => {
      expect(mapConstructorMock).toHaveBeenCalledTimes(1);
    });

    const createdMap = mapConstructorMock.mock.results[0]?.value as MockMapInstance;
    unmount();

    expect(clearInstanceListenersMock).toHaveBeenCalledTimes(1);
    expect(createdMap.destroy).toHaveBeenCalledTimes(0);
  });

  it("updates changed props without recreating map instance", async () => {
    const { rerender } = render(
      <NaverMapProvider ncpKeyId="test-key" timeoutMs={1000}>
        <NaverMap
          center={{ lat: 37.5, lng: 127.0 }}
          draggable={true}
          zoom={10}
          style={{ height: 100, width: 100 }}
        />
      </NaverMapProvider>
    );

    await waitFor(() => {
      expect(mapConstructorMock).toHaveBeenCalledTimes(1);
    });

    const createdMap = mapConstructorMock.mock.results[0]?.value as MockMapInstance;

    rerender(
      <NaverMapProvider ncpKeyId="test-key" timeoutMs={1000}>
        <NaverMap
          center={{ lat: 37.5, lng: 127.0 }}
          draggable={false}
          zoom={12}
          style={{ height: 100, width: 100 }}
        />
      </NaverMapProvider>
    );

    await waitFor(() => {
      expect(createdMap.setZoom).toHaveBeenCalledWith(12);
      expect(createdMap.setOptions).toHaveBeenCalled();
    });

    expect(mapConstructorMock).toHaveBeenCalledTimes(1);
    expect(createdMap.setCenter).not.toHaveBeenCalled();
  });

  it("suspends when suspense is enabled and sdk is not ready", async () => {
    const reloadSdk = vi.fn(() => new Promise<void>(() => undefined));

    render(
      <NaverMapContext.Provider
        value={createMockContextValue({
          sdkStatus: "idle",
          sdkError: null,
          reloadSdk
        })}
      >
        <Suspense fallback={<div data-testid="suspense-fallback">loading</div>}>
          <NaverMap suspense style={{ height: 100, width: 100 }} />
        </Suspense>
      </NaverMapContext.Provider>
    );

    expect(screen.getByTestId("suspense-fallback")).toBeTruthy();

    await waitFor(() => {
      expect(reloadSdk).toHaveBeenCalled();
    });
  });

  it("throws sdkError when suspense is enabled and sdkStatus is error", () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const sdkError = new Error("suspense failed");

    expect(() =>
      render(
        <NaverMapContext.Provider
          value={createMockContextValue({
            sdkStatus: "error",
            sdkError
          })}
        >
          <NaverMap suspense style={{ height: 100, width: 100 }} />
        </NaverMapContext.Provider>
      )
    ).toThrow("suspense failed");

    consoleErrorSpy.mockRestore();
  });

  it("keeps fallback rendering when suspense is disabled", () => {
    const reloadSdk = vi.fn(() => Promise.resolve());

    render(
      <NaverMapContext.Provider
        value={createMockContextValue({
          sdkStatus: "loading",
          sdkError: null,
          reloadSdk
        })}
      >
        <NaverMap
          suspense={false}
          fallback={<div data-testid="map-fallback">map fallback</div>}
          style={{ height: 100, width: 100 }}
        />
      </NaverMapContext.Provider>
    );

    expect(screen.getByTestId("map-fallback")).toBeTruthy();
    expect(reloadSdk).toHaveBeenCalledTimes(0);
  });

  it("throws clear error when useNaverMap is used outside provider", () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);

    expect(() => render(<OutsideProviderProbe />)).toThrow(
      "useNaverMap must be used within NaverMapProvider."
    );

    consoleErrorSpy.mockRestore();
  });
});
