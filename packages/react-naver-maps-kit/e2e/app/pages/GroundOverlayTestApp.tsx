import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  GroundOverlay,
  NaverMap,
  NaverMapProvider,
  type GroundOverlayRef,
  type NaverMapRef
} from "react-naver-maps-kit";

import {
  DEFAULT_CENTER,
  GROUND_OVERLAY_BOUNDS_1,
  GROUND_OVERLAY_BOUNDS_2,
  GROUND_OVERLAY_BOUNDS_3,
  GROUND_OVERLAY_URL_1,
  GROUND_OVERLAY_URL_2,
  GROUND_OVERLAY_URL_3,
  NCP_KEY_ID
} from "../constants";

type GroundBoundsLiteral = {
  south: number;
  west: number;
  north: number;
  east: number;
};

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

function toBoundsText(bounds: naver.maps.LatLngBounds | undefined | null): string {
  if (!bounds) {
    return "";
  }

  const ne = bounds.getNE();
  const sw = bounds.getSW();

  return JSON.stringify({
    south: sw.y,
    west: sw.x,
    north: ne.y,
    east: ne.x
  });
}

function randomBounds(seed: number): GroundBoundsLiteral {
  const south = 37.5 + (seed % 7) * 0.005;
  const west = 126.94 + (seed % 11) * 0.005;

  return {
    south,
    west,
    north: south + 0.035,
    east: west + 0.04
  };
}

/* ─── 1. smoke ─── */

function SmokePage() {
  const mapRef = useRef<NaverMapRef>(null);
  const groundOverlayRef = useRef<GroundOverlayRef>(null);

  const [mapReady, setMapReady] = useState(false);
  const [groundOverlayReadyCount, setGroundOverlayReadyCount] = useState(0);
  const [groundOverlayDestroyed, setGroundOverlayDestroyed] = useState(false);
  const [showGroundOverlay, setShowGroundOverlay] = useState(true);
  const [mapBound, setMapBound] = useState("");
  const [mapEquals, setMapEquals] = useState("");

  const readBinding = useCallback(() => {
    const overlayMap = groundOverlayRef.current?.getMap();
    const mapInstance = mapRef.current?.getInstance();

    setMapBound(String(Boolean(overlayMap)));
    setMapEquals(String(Boolean(overlayMap && mapInstance && overlayMap === mapInstance)));
  }, []);

  return (
    <ScenarioLayout
      buttons={
        <>
          <button
            data-testid="toggle-ground-overlay"
            onClick={() => setShowGroundOverlay((v) => !v)}
          >
            ground overlay 토글
          </button>
          <button data-testid="read-map-binding" onClick={readBinding}>
            바인딩 읽기
          </button>
        </>
      }
      logs={
        <>
          <span data-testid="map-ready">{String(mapReady)}</span>
          <span data-testid="ground-overlay-ready-count">{groundOverlayReadyCount}</span>
          <span data-testid="ground-overlay-destroyed">{String(groundOverlayDestroyed)}</span>
          <span data-testid="show-ground-overlay">{String(showGroundOverlay)}</span>
          <span data-testid="map-bound">{mapBound}</span>
          <span data-testid="map-equals">{mapEquals}</span>
        </>
      }
      map={
        <NaverMapProvider ncpKeyId={NCP_KEY_ID} timeoutMs={15000}>
          <NaverMap
            ref={mapRef}
            data-testid="map-container"
            defaultCenter={DEFAULT_CENTER}
            defaultZoom={12}
            style={{ width: "100%", height: 500 }}
            onMapReady={() => setMapReady(true)}
          >
            {showGroundOverlay && (
              <GroundOverlay
                ref={groundOverlayRef}
                url={GROUND_OVERLAY_URL_1}
                bounds={GROUND_OVERLAY_BOUNDS_1}
                clickable={true}
                opacity={0.8}
                onGroundOverlayReady={() => setGroundOverlayReadyCount((c) => c + 1)}
                onGroundOverlayDestroy={() => setGroundOverlayDestroyed(true)}
              />
            )}
          </NaverMap>
        </NaverMapProvider>
      }
    />
  );
}

/* ─── 2. options ─── */

function OptionsPage() {
  const groundOverlayRef = useRef<GroundOverlayRef>(null);

  const [mapReady, setMapReady] = useState(false);
  const [groundOverlayReadyCount, setGroundOverlayReadyCount] = useState(0);

  const [bounds, setBounds] = useState<GroundBoundsLiteral>(GROUND_OVERLAY_BOUNDS_1);
  const [url, setUrl] = useState(GROUND_OVERLAY_URL_1);
  const [clickable, setClickable] = useState(true);
  const [opacity, setOpacity] = useState(0.8);

  const [optBounds, setOptBounds] = useState("");
  const [optUrl, setOptUrl] = useState("");
  const [optOpacity, setOptOpacity] = useState("");

  const [boundsChangedCount, setBoundsChangedCount] = useState(0);
  const [clickableChangedCount, setClickableChangedCount] = useState(0);
  const [opacityChangedCount, setOpacityChangedCount] = useState(0);

  const readState = useCallback(() => {
    setOptBounds(toBoundsText(groundOverlayRef.current?.getBounds() as naver.maps.LatLngBounds | undefined));
    setOptUrl(String(groundOverlayRef.current?.getUrl() ?? ""));
    setOptOpacity(String(groundOverlayRef.current?.getOpacity() ?? ""));
  }, []);

  const rapidOpacity = useCallback(() => {
    setOpacity(0.2);
    setTimeout(() => setOpacity(0.6), 50);
    setTimeout(() => setOpacity(0.9), 100);
  }, []);

  const triggerBoundsChanged = useCallback(() => {
    const groundOverlay = groundOverlayRef.current?.getInstance();

    if (!groundOverlay) {
      return;
    }

    naver.maps.Event.trigger(groundOverlay, "bounds_changed", groundOverlay.getBounds());
  }, []);

  useEffect(() => {
    const groundOverlay = groundOverlayRef.current?.getInstance();

    if (!groundOverlay) {
      return;
    }

    naver.maps.Event.trigger(groundOverlay, "clickable_changed", clickable);
  }, [clickable]);

  useEffect(() => {
    const groundOverlay = groundOverlayRef.current?.getInstance();

    if (!groundOverlay) {
      return;
    }

    naver.maps.Event.trigger(groundOverlay, "opacity_changed", opacity);
  }, [opacity]);

  return (
    <ScenarioLayout
      buttons={
        <>
          <button data-testid="set-bounds-2" onClick={() => setBounds(GROUND_OVERLAY_BOUNDS_2)}>
            bounds 2
          </button>
          <button data-testid="set-bounds-3" onClick={() => setBounds(GROUND_OVERLAY_BOUNDS_3)}>
            bounds 3
          </button>
          <button data-testid="set-url-2" onClick={() => setUrl(GROUND_OVERLAY_URL_2)}>
            url 2
          </button>
          <button data-testid="set-url-3" onClick={() => setUrl(GROUND_OVERLAY_URL_3)}>
            url 3
          </button>
          <button data-testid="toggle-clickable" onClick={() => setClickable((v) => !v)}>
            clickable 토글
          </button>
          <button data-testid="set-opacity-02" onClick={() => setOpacity(0.2)}>
            opacity 0.2
          </button>
          <button data-testid="set-opacity-06" onClick={() => setOpacity(0.6)}>
            opacity 0.6
          </button>
          <button data-testid="set-opacity-09" onClick={() => setOpacity(0.9)}>
            opacity 0.9
          </button>
          <button data-testid="rapid-opacity" onClick={rapidOpacity}>
            opacity 연속 변경
          </button>
          <button data-testid="trigger-bounds-changed" onClick={triggerBoundsChanged}>
            trigger bounds_changed
          </button>
          <button data-testid="read-state" onClick={readState}>
            상태 읽기
          </button>
        </>
      }
      logs={
        <>
          <span data-testid="map-ready">{String(mapReady)}</span>
          <span data-testid="ground-overlay-ready-count">{groundOverlayReadyCount}</span>
          <span data-testid="state-clickable">{String(clickable)}</span>
          <span data-testid="state-opacity">{opacity}</span>
          <span data-testid="opt-bounds">{optBounds}</span>
          <span data-testid="opt-url">{optUrl}</span>
          <span data-testid="opt-opacity">{optOpacity}</span>
          <span data-testid="evt-bounds-changed-count">{boundsChangedCount}</span>
          <span data-testid="evt-clickable-changed-count">{clickableChangedCount}</span>
          <span data-testid="evt-opacity-changed-count">{opacityChangedCount}</span>
        </>
      }
      map={
        <NaverMapProvider ncpKeyId={NCP_KEY_ID} timeoutMs={15000}>
          <NaverMap
            data-testid="map-container"
            defaultCenter={DEFAULT_CENTER}
            defaultZoom={12}
            style={{ width: "100%", height: 500 }}
            onMapReady={() => setMapReady(true)}
          >
            <GroundOverlay
              key={`${url}-${bounds.south}-${bounds.west}-${bounds.north}-${bounds.east}`}
              ref={groundOverlayRef}
              url={url}
              bounds={bounds}
              clickable={clickable}
              opacity={opacity}
              onGroundOverlayReady={() => setGroundOverlayReadyCount((c) => c + 1)}
              onBoundsChanged={() => setBoundsChangedCount((c) => c + 1)}
              onClickableChanged={() => setClickableChangedCount((c) => c + 1)}
              onOpacityChanged={() => setOpacityChangedCount((c) => c + 1)}
            />
          </NaverMap>
        </NaverMapProvider>
      }
    />
  );
}

/* ─── 3. pointer events ─── */

function EventsPage() {
  const groundOverlayRef = useRef<GroundOverlayRef>(null);

  const [mapReady, setMapReady] = useState(false);
  const [eventLog, setEventLog] = useState<string[]>([]);

  const log = useCallback((event: string) => {
    setEventLog((prev) => [...prev, event]);
  }, []);

  const triggerEvent = useCallback((eventName: string) => {
    const groundOverlay = groundOverlayRef.current?.getInstance();

    if (!groundOverlay) {
      return;
    }

    if (eventName === "map_changed") {
      naver.maps.Event.trigger(groundOverlay, eventName, groundOverlay.getMap());
      return;
    }

    naver.maps.Event.trigger(groundOverlay, eventName, {});
  }, []);

  return (
    <ScenarioLayout
      buttons={
        <>
          <button data-testid="trigger-click" onClick={() => triggerEvent("click")}>click</button>
          <button data-testid="trigger-dblclick" onClick={() => triggerEvent("dblclick")}>dblclick</button>
          <button data-testid="trigger-rightclick" onClick={() => triggerEvent("rightclick")}>rightclick</button>
          <button data-testid="trigger-mousedown" onClick={() => triggerEvent("mousedown")}>mousedown</button>
          <button data-testid="trigger-mousemove" onClick={() => triggerEvent("mousemove")}>mousemove</button>
          <button data-testid="trigger-mouseup" onClick={() => triggerEvent("mouseup")}>mouseup</button>
          <button data-testid="trigger-mouseover" onClick={() => triggerEvent("mouseover")}>mouseover</button>
          <button data-testid="trigger-mouseout" onClick={() => triggerEvent("mouseout")}>mouseout</button>
          <button data-testid="trigger-touchstart" onClick={() => triggerEvent("touchstart")}>touchstart</button>
          <button data-testid="trigger-touchmove" onClick={() => triggerEvent("touchmove")}>touchmove</button>
          <button data-testid="trigger-touchend" onClick={() => triggerEvent("touchend")}>touchend</button>
          <button data-testid="trigger-map-changed" onClick={() => triggerEvent("map_changed")}>map_changed</button>
          <button data-testid="clear-log" onClick={() => setEventLog([])}>로그 비우기</button>
        </>
      }
      logs={
        <>
          <span data-testid="map-ready">{String(mapReady)}</span>
          <span data-testid="event-log">{JSON.stringify(eventLog)}</span>
          <span data-testid="event-count">{eventLog.length}</span>
        </>
      }
      map={
        <NaverMapProvider ncpKeyId={NCP_KEY_ID} timeoutMs={15000}>
          <NaverMap
            data-testid="map-container"
            defaultCenter={DEFAULT_CENTER}
            defaultZoom={12}
            style={{ width: "100%", height: 500 }}
            onMapReady={() => setMapReady(true)}
          >
            <GroundOverlay
              ref={groundOverlayRef}
              url={GROUND_OVERLAY_URL_1}
              bounds={GROUND_OVERLAY_BOUNDS_1}
              clickable={true}
              opacity={0.8}
              onClick={() => log("click")}
              onDblClick={() => log("dblclick")}
              onRightClick={() => log("rightclick")}
              onMouseDown={() => log("mousedown")}
              onMouseMove={() => log("mousemove")}
              onMouseUp={() => log("mouseup")}
              onMouseOver={() => log("mouseover")}
              onMouseOut={() => log("mouseout")}
              onTouchStart={() => log("touchstart")}
              onTouchMove={() => log("touchmove")}
              onTouchEnd={() => log("touchend")}
              onMapChanged={() => log("mapchanged")}
            />
          </NaverMap>
        </NaverMapProvider>
      }
    />
  );
}

/* ─── 4. ref ─── */

function RefPage() {
  const mapRef = useRef<NaverMapRef>(null);
  const groundOverlayRef = useRef<GroundOverlayRef>(null);

  const [mapReady, setMapReady] = useState(false);
  const [mapChangedCount, setMapChangedCount] = useState(0);

  const [refBounds, setRefBounds] = useState("");
  const [refOpacity, setRefOpacity] = useState("");
  const [refUrl, setRefUrl] = useState("");
  const [refMapBound, setRefMapBound] = useState("");
  const [refPanesExists, setRefPanesExists] = useState("");
  const [refProjectionExists, setRefProjectionExists] = useState("");
  const [refSetUrlSupported, setRefSetUrlSupported] = useState("");

  const readState = useCallback(() => {
    const overlayInstance = groundOverlayRef.current?.getInstance();
    const setUrlSupported = Boolean(
      overlayInstance && typeof (overlayInstance as { setUrl?: unknown }).setUrl === "function"
    );

    setRefBounds(toBoundsText(groundOverlayRef.current?.getBounds() as naver.maps.LatLngBounds | undefined));
    setRefOpacity(String(groundOverlayRef.current?.getOpacity() ?? ""));
    setRefUrl(String(groundOverlayRef.current?.getUrl() ?? ""));
    setRefMapBound(String(Boolean(groundOverlayRef.current?.getMap())));
    setRefPanesExists(String(Boolean(groundOverlayRef.current?.getPanes())));
    setRefProjectionExists(String(Boolean(groundOverlayRef.current?.getProjection())));
    setRefSetUrlSupported(String(setUrlSupported));
  }, []);

  const triggerMapChanged = useCallback(() => {
    const groundOverlay = groundOverlayRef.current?.getInstance();

    if (!groundOverlay) {
      return;
    }

    naver.maps.Event.trigger(groundOverlay, "map_changed", groundOverlay.getMap());
  }, []);

  return (
    <ScenarioLayout
      buttons={
        <>
          <button data-testid="ref-set-opacity-03" onClick={() => groundOverlayRef.current?.setOpacity(0.3)}>
            opacity 0.3
          </button>
          <button data-testid="ref-set-opacity-08" onClick={() => groundOverlayRef.current?.setOpacity(0.8)}>
            opacity 0.8
          </button>
          <button data-testid="ref-set-url-2" onClick={() => groundOverlayRef.current?.setUrl(GROUND_OVERLAY_URL_2)}>
            url 2
          </button>
          <button data-testid="ref-set-url-3" onClick={() => groundOverlayRef.current?.setUrl(GROUND_OVERLAY_URL_3)}>
            url 3
          </button>
          <button
            data-testid="ref-set-map-null"
            onClick={() => {
              groundOverlayRef.current?.setMap(null);
              triggerMapChanged();
            }}
          >
            setMap null
          </button>
          <button
            data-testid="ref-set-map-instance"
            onClick={() => {
              const map = mapRef.current?.getInstance();

              if (map) {
                groundOverlayRef.current?.setMap(map);
                triggerMapChanged();
              }
            }}
          >
            setMap map
          </button>
          <button data-testid="ref-trigger-map-changed" onClick={triggerMapChanged}>
            trigger map_changed
          </button>
          <button data-testid="ref-read-state" onClick={readState}>
            상태 읽기
          </button>
        </>
      }
      logs={
        <>
          <span data-testid="map-ready">{String(mapReady)}</span>
          <span data-testid="map-changed-count">{mapChangedCount}</span>
          <span data-testid="ref-bounds">{refBounds}</span>
          <span data-testid="ref-opacity">{refOpacity}</span>
          <span data-testid="ref-url">{refUrl}</span>
          <span data-testid="ref-map-bound">{refMapBound}</span>
          <span data-testid="ref-panes-exists">{refPanesExists}</span>
          <span data-testid="ref-projection-exists">{refProjectionExists}</span>
          <span data-testid="ref-seturl-supported">{refSetUrlSupported}</span>
        </>
      }
      map={
        <NaverMapProvider ncpKeyId={NCP_KEY_ID} timeoutMs={15000}>
          <NaverMap
            ref={mapRef}
            data-testid="map-container"
            defaultCenter={DEFAULT_CENTER}
            defaultZoom={12}
            style={{ width: "100%", height: 500 }}
            onMapReady={() => setMapReady(true)}
          >
            <GroundOverlay
              ref={groundOverlayRef}
              url={GROUND_OVERLAY_URL_1}
              bounds={GROUND_OVERLAY_BOUNDS_1}
              clickable={true}
              opacity={0.8}
              onMapChanged={() => setMapChangedCount((c) => c + 1)}
            />
          </NaverMap>
        </NaverMapProvider>
      }
    />
  );
}

/* ─── 5. multiple ─── */

interface GroundOverlayItem {
  id: number;
  url: string;
  bounds: GroundBoundsLiteral;
  opacity: number;
  clickable: boolean;
}

function urlByIndex(index: number): string {
  if (index % 3 === 1) return GROUND_OVERLAY_URL_1;
  if (index % 3 === 2) return GROUND_OVERLAY_URL_2;
  return GROUND_OVERLAY_URL_3;
}

function MultiplePage() {
  const [mapReady, setMapReady] = useState(false);
  const [groundOverlayReadyCount, setGroundOverlayReadyCount] = useState(0);
  const [groundOverlayDestroyCount, setGroundOverlayDestroyCount] = useState(0);
  const [items, setItems] = useState<GroundOverlayItem[]>([
    { id: 1, url: GROUND_OVERLAY_URL_1, bounds: GROUND_OVERLAY_BOUNDS_1, opacity: 0.8, clickable: true },
    { id: 2, url: GROUND_OVERLAY_URL_2, bounds: GROUND_OVERLAY_BOUNDS_2, opacity: 0.7, clickable: true },
    { id: 3, url: GROUND_OVERLAY_URL_3, bounds: GROUND_OVERLAY_BOUNDS_3, opacity: 0.6, clickable: true }
  ]);

  const firstClickable = items.find((item) => item.id === 1)?.clickable ?? false;
  const secondOpacity = items.find((item) => item.id === 2)?.opacity ?? 0;

  const addGroundOverlay = useCallback(() => {
    setItems((prev) => {
      const id = prev.length + 1;
      return [
        ...prev,
        {
          id,
          url: urlByIndex(id),
          bounds: randomBounds(id),
          opacity: 0.75,
          clickable: true
        }
      ];
    });
  }, []);

  const removeLast = useCallback(() => {
    setItems((prev) => prev.slice(0, -1));
  }, []);

  const toggleFirstClickable = useCallback(() => {
    setItems((prev) => prev.map((item) => (item.id === 1 ? { ...item, clickable: !item.clickable } : item)));
  }, []);

  const setSecondOpacity = useCallback(() => {
    setItems((prev) => prev.map((item) => (item.id === 2 ? { ...item, opacity: 0.95 } : item)));
  }, []);

  return (
    <ScenarioLayout
      buttons={
        <>
          <button data-testid="add-ground-overlay" onClick={addGroundOverlay}>ground overlay 추가</button>
          <button data-testid="remove-last-ground-overlay" onClick={removeLast}>마지막 제거</button>
          <button data-testid="toggle-first-clickable" onClick={toggleFirstClickable}>첫 overlay clickable 토글</button>
          <button data-testid="set-second-opacity" onClick={setSecondOpacity}>둘째 opacity 0.95</button>
        </>
      }
      logs={
        <>
          <span data-testid="map-ready">{String(mapReady)}</span>
          <span data-testid="ground-overlay-count">{items.length}</span>
          <span data-testid="ground-overlay-ready-count">{groundOverlayReadyCount}</span>
          <span data-testid="ground-overlay-destroy-count">{groundOverlayDestroyCount}</span>
          <span data-testid="first-clickable">{String(firstClickable)}</span>
          <span data-testid="second-opacity">{secondOpacity}</span>
        </>
      }
      map={
        <NaverMapProvider ncpKeyId={NCP_KEY_ID} timeoutMs={15000}>
          <NaverMap
            data-testid="map-container"
            defaultCenter={DEFAULT_CENTER}
            defaultZoom={12}
            style={{ width: "100%", height: 500 }}
            onMapReady={() => setMapReady(true)}
          >
            {items.map((item) => (
              <GroundOverlay
                key={item.id}
                url={item.url}
                bounds={item.bounds}
                opacity={item.opacity}
                clickable={item.clickable}
                onGroundOverlayReady={() => setGroundOverlayReadyCount((c) => c + 1)}
                onGroundOverlayDestroy={() => setGroundOverlayDestroyCount((c) => c + 1)}
              />
            ))}
          </NaverMap>
        </NaverMapProvider>
      }
    />
  );
}

/* ─── routes ─── */

export const groundOverlayRoutes: Record<string, React.FC> = {
  "/ground-overlay/smoke": SmokePage,
  "/ground-overlay/options": OptionsPage,
  "/ground-overlay/events": EventsPage,
  "/ground-overlay/ref": RefPage,
  "/ground-overlay/multiple": MultiplePage
};
