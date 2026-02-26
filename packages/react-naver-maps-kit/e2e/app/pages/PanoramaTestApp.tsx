import React, { useCallback, useRef, useState } from "react";
import { NaverMapProvider, Panorama, type PanoramaRef } from "react-naver-maps-kit";

import { DEFAULT_CENTER, MARKER_POS_2, MARKER_POS_3, NCP_KEY_ID } from "../constants";

function ScenarioLayout({
  buttons,
  logs,
  map
}: {
  buttons: React.ReactNode;
  logs: React.ReactNode;
  map: React.ReactNode;
}) {
  return (
    <div className="scenario-layout">
      <div className="scenario-actions">{buttons}</div>
      <div className="scenario-body">
        <div className="scenario-logs">{logs}</div>
        <div className="scenario-map">{map}</div>
      </div>
    </div>
  );
}

function readCoordText(coord: naver.maps.LatLng | naver.maps.Coord | null | undefined): string {
  if (!coord) {
    return "";
  }

  const target = coord as unknown as {
    lat?: () => number;
    lng?: () => number;
    x?: number;
    y?: number;
  };

  const lat =
    typeof target.lat === "function"
      ? target.lat()
      : typeof target.y === "number"
        ? target.y
        : undefined;

  const lng =
    typeof target.lng === "function"
      ? target.lng()
      : typeof target.x === "number"
        ? target.x
        : undefined;

  if (typeof lat === "number" && typeof lng === "number") {
    return JSON.stringify({ lat, lng });
  }

  return "";
}

function readPovText(pov: naver.maps.PanoramaPov | undefined): string {
  if (!pov) {
    return "";
  }

  return JSON.stringify({
    pan: pov.pan ?? null,
    tilt: pov.tilt ?? null,
    fov: pov.fov ?? null
  });
}

/* ─── 1. basic ─── */

function BasicPage() {
  const panoramaRef = useRef<PanoramaRef>(null);

  const [visible, setVisible] = useState(true);
  const [readyCount, setReadyCount] = useState(0);
  const [destroyCount, setDestroyCount] = useState(0);
  const [instanceExists, setInstanceExists] = useState("false");
  const [elementExists, setElementExists] = useState("false");
  const [refVisible, setRefVisible] = useState("");

  const readState = useCallback(() => {
    setInstanceExists(String(Boolean(panoramaRef.current?.getInstance())));
    setElementExists(String(Boolean(panoramaRef.current?.getElement())));
    setRefVisible(String(panoramaRef.current?.getVisible() ?? ""));
  }, []);

  return (
    <ScenarioLayout
      buttons={
        <>
          <button data-testid="toggle-visible-prop" onClick={() => setVisible((v) => !v)}>
            visible prop 토글
          </button>
          <button data-testid="read-state" onClick={readState}>
            상태 읽기
          </button>
        </>
      }
      logs={
        <>
          <span data-testid="visible-prop-state">{String(visible)}</span>
          <span data-testid="panorama-ready-count">{readyCount}</span>
          <span data-testid="panorama-destroy-count">{destroyCount}</span>
          <span data-testid="instance-exists">{instanceExists}</span>
          <span data-testid="element-exists">{elementExists}</span>
          <span data-testid="ref-visible">{refVisible}</span>
        </>
      }
      map={
        <NaverMapProvider ncpKeyId={NCP_KEY_ID} submodules={["panorama"]} timeoutMs={15000}>
          <Panorama
            ref={panoramaRef}
            defaultPosition={DEFAULT_CENTER}
            defaultPov={{ pan: 0, tilt: 0, fov: 100 }}
            visible={visible}
            style={{ width: "100%", height: 500 }}
            onPanoramaReady={() => setReadyCount((v) => v + 1)}
            onPanoramaDestroy={() => setDestroyCount((v) => v + 1)}
          />
        </NaverMapProvider>
      }
    />
  );
}

/* ─── 2. controlled ─── */

function ControlledPage() {
  const panoramaRef = useRef<PanoramaRef>(null);

  const [readyCount, setReadyCount] = useState(0);
  const [position, setPosition] = useState(DEFAULT_CENTER);
  const [pov, setPov] = useState<naver.maps.PanoramaPov>({ pan: 0, tilt: 0, fov: 100 });

  const [refPosition, setRefPosition] = useState("");
  const [refPov, setRefPov] = useState("");

  const readState = useCallback(() => {
    setRefPosition(readCoordText(panoramaRef.current?.getPosition()));
    setRefPov(readPovText(panoramaRef.current?.getPov()));
  }, []);

  return (
    <ScenarioLayout
      buttons={
        <>
          <button data-testid="set-position-2" onClick={() => setPosition(MARKER_POS_2)}>
            position 2
          </button>
          <button data-testid="set-position-3" onClick={() => setPosition(MARKER_POS_3)}>
            position 3
          </button>
          <button data-testid="set-pov-a" onClick={() => setPov({ pan: 10, tilt: -5, fov: 95 })}>
            pov A
          </button>
          <button data-testid="set-pov-b" onClick={() => setPov({ pan: 35, tilt: 2, fov: 80 })}>
            pov B
          </button>
          <button data-testid="read-state" onClick={readState}>
            상태 읽기
          </button>
        </>
      }
      logs={
        <>
          <span data-testid="panorama-ready-count">{readyCount}</span>
          <span data-testid="state-position">{JSON.stringify(position)}</span>
          <span data-testid="state-pov">{JSON.stringify(pov)}</span>
          <span data-testid="ref-position">{refPosition}</span>
          <span data-testid="ref-pov">{refPov}</span>
        </>
      }
      map={
        <NaverMapProvider ncpKeyId={NCP_KEY_ID} submodules={["panorama"]} timeoutMs={15000}>
          <Panorama
            ref={panoramaRef}
            position={position}
            pov={pov}
            style={{ width: "100%", height: 500 }}
            onPanoramaReady={() => setReadyCount((v) => v + 1)}
          />
        </NaverMapProvider>
      }
    />
  );
}

/* ─── 3. ref ─── */

function RefPage() {
  const panoramaRef = useRef<PanoramaRef>(null);

  const [readyCount, setReadyCount] = useState(0);

  const [refPosition, setRefPosition] = useState("");
  const [refPov, setRefPov] = useState("");
  const [refZoom, setRefZoom] = useState("");
  const [refVisible, setRefVisible] = useState("");
  const [refMinZoom, setRefMinZoom] = useState("");
  const [refMaxZoom, setRefMaxZoom] = useState("");
  const [refProjectionExists, setRefProjectionExists] = useState("");
  const [refLocationExists, setRefLocationExists] = useState("");

  const readState = useCallback(() => {
    setRefPosition(readCoordText(panoramaRef.current?.getPosition()));
    setRefPov(readPovText(panoramaRef.current?.getPov()));
    setRefZoom(String(panoramaRef.current?.getZoom() ?? ""));
    setRefVisible(String(panoramaRef.current?.getVisible() ?? ""));
    setRefMinZoom(String(panoramaRef.current?.getMinZoom() ?? ""));
    setRefMaxZoom(String(panoramaRef.current?.getMaxZoom() ?? ""));
    setRefProjectionExists(String(Boolean(panoramaRef.current?.getProjection())));

    try {
      setRefLocationExists(String(Boolean(panoramaRef.current?.getLocation())));
    } catch {
      setRefLocationExists("false");
    }
  }, []);

  return (
    <ScenarioLayout
      buttons={
        <>
          <button data-testid="ref-set-position-2" onClick={() => panoramaRef.current?.setPosition(MARKER_POS_2)}>
            setPosition 2
          </button>
          <button data-testid="ref-set-pov-b" onClick={() => panoramaRef.current?.setPov({ pan: 35, tilt: 2, fov: 80 })}>
            setPov B
          </button>
          <button data-testid="ref-set-zoom-2" onClick={() => panoramaRef.current?.setZoom(2)}>
            setZoom 2
          </button>
          <button data-testid="ref-zoom-in" onClick={() => panoramaRef.current?.zoomIn()}>
            zoomIn
          </button>
          <button data-testid="ref-zoom-out" onClick={() => panoramaRef.current?.zoomOut()}>
            zoomOut
          </button>
          <button data-testid="ref-set-visible-false" onClick={() => panoramaRef.current?.setVisible(false)}>
            visible false
          </button>
          <button data-testid="ref-set-visible-true" onClick={() => panoramaRef.current?.setVisible(true)}>
            visible true
          </button>
          <button
            data-testid="ref-set-options-batch"
            onClick={() => panoramaRef.current?.setOptions({ minZoom: 1, maxZoom: 5 })}
          >
            setOptions
          </button>
          <button data-testid="read-state" onClick={readState}>
            상태 읽기
          </button>
        </>
      }
      logs={
        <>
          <span data-testid="panorama-ready-count">{readyCount}</span>
          <span data-testid="ref-position">{refPosition}</span>
          <span data-testid="ref-pov">{refPov}</span>
          <span data-testid="ref-zoom">{refZoom}</span>
          <span data-testid="ref-visible">{refVisible}</span>
          <span data-testid="ref-min-zoom">{refMinZoom}</span>
          <span data-testid="ref-max-zoom">{refMaxZoom}</span>
          <span data-testid="ref-projection-exists">{refProjectionExists}</span>
          <span data-testid="ref-location-exists">{refLocationExists}</span>
        </>
      }
      map={
        <NaverMapProvider ncpKeyId={NCP_KEY_ID} submodules={["panorama"]} timeoutMs={15000}>
          <Panorama
            ref={panoramaRef}
            defaultPosition={DEFAULT_CENTER}
            defaultPov={{ pan: 0, tilt: 0, fov: 100 }}
            style={{ width: "100%", height: 500 }}
            onPanoramaReady={() => setReadyCount((v) => v + 1)}
          />
        </NaverMapProvider>
      }
    />
  );
}

/* ─── 4. events ─── */

function EventsPage() {
  const panoramaRef = useRef<PanoramaRef>(null);

  const [readyCount, setReadyCount] = useState(0);
  const [initCount, setInitCount] = useState(0);
  const [panoChangedCount, setPanoChangedCount] = useState(0);
  const [povChangedCount, setPovChangedCount] = useState(0);
  const [panoStatusCount, setPanoStatusCount] = useState(0);
  const [lastPanoStatus, setLastPanoStatus] = useState("");

  const triggerEvent = useCallback(
    (eventName: "init" | "pano_changed" | "pov_changed" | "pano_status") => {
      const panorama = panoramaRef.current?.getInstance();

      if (!panorama) {
        return;
      }

      if (eventName === "pano_status") {
        naver.maps.Event.trigger(panorama, eventName, "OK");
        return;
      }

      naver.maps.Event.trigger(panorama, eventName);
    },
    []
  );

  return (
    <ScenarioLayout
      buttons={
        <>
          <button data-testid="trigger-init" onClick={() => triggerEvent("init")}>init</button>
          <button data-testid="trigger-pano-changed" onClick={() => triggerEvent("pano_changed")}>pano_changed</button>
          <button data-testid="trigger-pov-changed" onClick={() => triggerEvent("pov_changed")}>pov_changed</button>
          <button data-testid="trigger-pano-status" onClick={() => triggerEvent("pano_status")}>pano_status</button>
        </>
      }
      logs={
        <>
          <span data-testid="panorama-ready-count">{readyCount}</span>
          <span data-testid="evt-init-count">{initCount}</span>
          <span data-testid="evt-pano-changed-count">{panoChangedCount}</span>
          <span data-testid="evt-pov-changed-count">{povChangedCount}</span>
          <span data-testid="evt-pano-status-count">{panoStatusCount}</span>
          <span data-testid="evt-last-pano-status">{lastPanoStatus}</span>
        </>
      }
      map={
        <NaverMapProvider ncpKeyId={NCP_KEY_ID} submodules={["panorama"]} timeoutMs={15000}>
          <Panorama
            ref={panoramaRef}
            defaultPosition={DEFAULT_CENTER}
            defaultPov={{ pan: 0, tilt: 0, fov: 100 }}
            style={{ width: "100%", height: 500 }}
            onPanoramaReady={() => setReadyCount((v) => v + 1)}
            onInit={() => setInitCount((v) => v + 1)}
            onPanoChanged={() => setPanoChangedCount((v) => v + 1)}
            onPovChanged={() => setPovChangedCount((v) => v + 1)}
            onPanoStatus={(status) => {
              setPanoStatusCount((v) => v + 1);
              setLastPanoStatus(status);
            }}
          />
        </NaverMapProvider>
      }
    />
  );
}

/* ─── 5. lifecycle ─── */

function LifecyclePage() {
  const panoramaRef = useRef<PanoramaRef>(null);

  const [showPanorama, setShowPanorama] = useState(true);
  const [readyCount, setReadyCount] = useState(0);
  const [destroyCount, setDestroyCount] = useState(0);
  const [instanceExists, setInstanceExists] = useState("false");

  const readState = useCallback(() => {
    setInstanceExists(String(Boolean(panoramaRef.current?.getInstance())));
  }, []);

  return (
    <ScenarioLayout
      buttons={
        <>
          <button data-testid="toggle-panorama" onClick={() => setShowPanorama((v) => !v)}>
            panorama 토글
          </button>
          <button data-testid="read-state" onClick={readState}>
            상태 읽기
          </button>
        </>
      }
      logs={
        <>
          <span data-testid="show-panorama">{String(showPanorama)}</span>
          <span data-testid="panorama-ready-count">{readyCount}</span>
          <span data-testid="panorama-destroy-count">{destroyCount}</span>
          <span data-testid="instance-exists">{instanceExists}</span>
        </>
      }
      map={
        <NaverMapProvider ncpKeyId={NCP_KEY_ID} submodules={["panorama"]} timeoutMs={15000}>
          {showPanorama && (
            <Panorama
              ref={panoramaRef}
              defaultPosition={DEFAULT_CENTER}
              defaultPov={{ pan: 0, tilt: 0, fov: 100 }}
              style={{ width: "100%", height: 500 }}
              onPanoramaReady={() => setReadyCount((v) => v + 1)}
              onPanoramaDestroy={() => setDestroyCount((v) => v + 1)}
            />
          )}
        </NaverMapProvider>
      }
    />
  );
}

export const panoramaRoutes: Record<string, React.FC> = {
  "/panorama/basic": BasicPage,
  "/panorama/controlled": ControlledPage,
  "/panorama/ref": RefPage,
  "/panorama/events": EventsPage,
  "/panorama/lifecycle": LifecyclePage
};
