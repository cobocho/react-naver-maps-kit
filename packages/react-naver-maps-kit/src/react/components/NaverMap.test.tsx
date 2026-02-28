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

const GL_CREATION_AVAILABLE_KEY = "__reactNaverMapsKitGlCreationAvailable";
const GL_FALLBACK_WARNED_KEY = "__reactNaverMapsKitGlFallbackWarned";

function getTestWindow(): Window & { naver?: unknown } & Record<string, unknown> {
  return window as unknown as Window & { naver?: unknown } & Record<string, unknown>;
}

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
    const testWindow = getTestWindow();
    clearInstanceListenersMock = vi.fn();
    addListenerMock = vi.fn(() => ({}));
    removeListenerMock = vi.fn();
    mapConstructorMock = vi.fn(() => createMockMapInstance());

    testWindow.naver = {
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
    const testWindow = getTestWindow();
    delete testWindow.naver;
    delete testWindow[GL_CREATION_AVAILABLE_KEY];
    delete testWindow[GL_FALLBACK_WARNED_KEY];
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

  it("falls back to regular map when GL map creation fails", async () => {
    const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const getContextSpy = vi
      .spyOn(HTMLCanvasElement.prototype, "getContext")
      .mockImplementation((contextId: string) =>
        contextId === "webgl" || contextId === "experimental-webgl"
          ? ({} as unknown as RenderingContext)
          : null
      );

    mapConstructorMock.mockImplementation((_container, options: naver.maps.MapOptions) => {
      if (options.gl) {
        throw new Error("GL init failed");
      }
      return createMockMapInstance();
    });

    render(
      <NaverMapProvider ncpKeyId="test-key" timeoutMs={1000}>
        <NaverMap
          gl
          customStyleId="test-style-id"
          defaultCenter={{ lat: 37.5, lng: 127.0 }}
          defaultZoom={12}
          style={{ height: 100, width: 100 }}
        />
      </NaverMapProvider>
    );

    await waitFor(() => {
      expect(mapConstructorMock).toHaveBeenCalledTimes(2);
    });

    const firstOptions = mapConstructorMock.mock.calls[0]?.[1] as naver.maps.MapOptions;
    const secondOptions = mapConstructorMock.mock.calls[1]?.[1] as naver.maps.MapOptions;

    expect(firstOptions.gl).toBe(true);
    expect(firstOptions.customStyleId).toBe("test-style-id");
    expect(secondOptions.gl).toBe(false);
    expect(secondOptions.customStyleId).toBeUndefined();
    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    expect(getTestWindow()[GL_CREATION_AVAILABLE_KEY]).toBe(false);

    getContextSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  it("uses cached GL availability to render regular map without retrying GL creation", async () => {
    getTestWindow()[GL_CREATION_AVAILABLE_KEY] = false;
    const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    render(
      <NaverMapProvider ncpKeyId="test-key" timeoutMs={1000}>
        <NaverMap
          gl
          customStyleId="test-style-id"
          defaultCenter={{ lat: 37.5, lng: 127.0 }}
          defaultZoom={12}
          style={{ height: 100, width: 100 }}
        />
      </NaverMapProvider>
    );

    await waitFor(() => {
      expect(mapConstructorMock).toHaveBeenCalledTimes(1);
    });

    const options = mapConstructorMock.mock.calls[0]?.[1] as naver.maps.MapOptions;
    expect(options.gl).toBe(false);
    expect(options.customStyleId).toBeUndefined();
    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);

    consoleWarnSpy.mockRestore();
  });
});
