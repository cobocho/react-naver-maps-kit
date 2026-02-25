import React, { useRef, useState, useCallback } from "react";
import { NaverMapProvider, NaverMap, type NaverMapRef } from "react-naver-maps-kit";
import { DEFAULT_CENTER, TARGET_POSITION, BUSAN_CENTER, JEJU_CENTER, NCP_KEY_ID } from "../constants";

function ScenarioLayout({
  buttons,
  logs,
  map,
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

/* ─── smoke ─── */

function SmokePage() {
  const mapRef = useRef<NaverMapRef>(null);
  const [mapReadyCount, setMapReadyCount] = useState(0);
  const [destroyed, setDestroyed] = useState(false);
  const [showMap, setShowMap] = useState(true);

  return (
    <ScenarioLayout
      buttons={
        <button data-testid="toggle-map" onClick={() => setShowMap((v) => !v)}>
          Toggle Map
        </button>
      }
      logs={
        <>
          <span data-testid="map-ready-count">{mapReadyCount}</span>
          <span data-testid="destroyed">{String(destroyed)}</span>
        </>
      }
      map={
        <NaverMapProvider ncpKeyId={NCP_KEY_ID} timeoutMs={15000}>
          {showMap && (
            <NaverMap
              ref={mapRef}
              data-testid="map-container"
              defaultCenter={DEFAULT_CENTER}
              defaultZoom={12}
              style={{ width: "100%", height: 500 }}
              onMapReady={() => setMapReadyCount((c) => c + 1)}
              onMapDestroy={() => setDestroyed(true)}
            />
          )}
        </NaverMapProvider>
      }
    />
  );
}

/* ─── fallback / error ─── */

function FallbackErrorPage() {
  const mapRef = useRef<NaverMapRef>(null);
  const [useInvalidKey, setUseInvalidKey] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [retryEnabled, setRetryEnabled] = useState(false);
  const [providerError, setProviderError] = useState<string | null>(null);

  const key = useInvalidKey ? "INVALID_KEY_FOR_TEST" : NCP_KEY_ID;

  return (
    <ScenarioLayout
      buttons={
        <>
          <button data-testid="use-invalid-key" onClick={() => {
            setUseInvalidKey(true);
            setMapReady(false);
            setMapError(null);
            setProviderError(null);
          }}>
            Use Invalid Key
          </button>
          <button data-testid="use-valid-key" onClick={() => {
            setUseInvalidKey(false);
            setMapReady(false);
            setMapError(null);
            setProviderError(null);
          }}>
            Use Valid Key
          </button>
          <button data-testid="toggle-retry" onClick={() => setRetryEnabled((v) => !v)}>
            Toggle Retry
          </button>
        </>
      }
      logs={
        <>
          <span data-testid="map-error">{mapError ?? ""}</span>
          <span data-testid="provider-error">{providerError ?? ""}</span>
          <span data-testid="map-ready">{String(mapReady)}</span>
          <span data-testid="retry-enabled">{String(retryEnabled)}</span>
        </>
      }
      map={
        <NaverMapProvider
          key={key}
          ncpKeyId={key}
          timeoutMs={10000}
          onError={(err) => setProviderError(err.message)}
          onReady={() => setMapReady(true)}
        >
          <NaverMap
            ref={mapRef}
            data-testid="map-container"
            defaultCenter={DEFAULT_CENTER}
            defaultZoom={12}
            style={{ width: "100%", height: 500 }}
            onMapReady={() => setMapReady(true)}
            onMapError={(err) => setMapError(err.message)}
            retryOnError={retryEnabled}
            retryDelayMs={1000}
            fallback={
              <div data-testid="map-fallback" style={{ width: "100%", height: 500, background: "#eee" }}>
                지도 로딩 중...
              </div>
            }
          />
        </NaverMapProvider>
      }
    />
  );
}

/* ─── uncontrolled ─── */

function UncontrolledPage() {
  const mapRef = useRef<NaverMapRef>(null);
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [zoom, setZoom] = useState<number | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const readState = useCallback(() => {
    const c = mapRef.current?.getCenter();
    const z = mapRef.current?.getZoom();
    if (c) setCenter({ lat: c.y, lng: c.x });
    if (z !== undefined) setZoom(z ?? null);
  }, []);

  return (
    <ScenarioLayout
      buttons={<button data-testid="read-state" onClick={readState}>상태 읽기</button>}
      logs={
        <>
          <span data-testid="map-ready">{String(mapReady)}</span>
          <span data-testid="current-center">{center ? JSON.stringify(center) : ""}</span>
          <span data-testid="current-zoom">{zoom !== null ? zoom : ""}</span>
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
          />
        </NaverMapProvider>
      }
    />
  );
}

/* ─── controlled ─── */

function ControlledPage() {
  const mapRef = useRef<NaverMapRef>(null);
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [zoom, setZoom] = useState(12);
  const [mapTypeId, setMapTypeId] = useState<"normal" | "terrain" | "satellite" | "hybrid">("normal");
  const [mapReady, setMapReady] = useState(false);
  const [actualCenter, setActualCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [actualZoom, setActualZoom] = useState<number | null>(null);

  const readActualState = useCallback(() => {
    const c = mapRef.current?.getCenter();
    const z = mapRef.current?.getZoom();
    if (c) setActualCenter({ lat: c.y, lng: c.x });
    if (z !== undefined) setActualZoom(z ?? null);
  }, []);

  return (
    <ScenarioLayout
      buttons={
        <>
          <button data-testid="move-busan" onClick={() => setCenter(BUSAN_CENTER)}>부산으로 이동</button>
          <button data-testid="move-jeju" onClick={() => setCenter(JEJU_CENTER)}>제주로 이동</button>
          <button data-testid="zoom-in" onClick={() => setZoom((z) => Math.min(z + 1, 21))}>확대</button>
          <button data-testid="zoom-out" onClick={() => setZoom((z) => Math.max(z - 1, 1))}>축소</button>
          <button data-testid="set-satellite" onClick={() => setMapTypeId("satellite")}>위성지도</button>
          <button data-testid="set-normal" onClick={() => setMapTypeId("normal")}>일반지도</button>
          <button data-testid="read-actual" onClick={readActualState}>실제값 읽기</button>
          <button data-testid="rapid-updates" onClick={() => {
            setCenter(BUSAN_CENTER);
            setTimeout(() => setCenter(JEJU_CENTER), 50);
            setTimeout(() => setCenter(DEFAULT_CENTER), 100);
            setTimeout(() => setZoom(15), 50);
            setTimeout(() => setZoom(10), 100);
          }}>빠른 업데이트</button>
        </>
      }
      logs={
        <>
          <span data-testid="map-ready">{String(mapReady)}</span>
          <span data-testid="state-center">{JSON.stringify(center)}</span>
          <span data-testid="state-zoom">{zoom}</span>
          <span data-testid="state-map-type">{mapTypeId}</span>
          <span data-testid="actual-center">{actualCenter ? JSON.stringify(actualCenter) : ""}</span>
          <span data-testid="actual-zoom">{actualZoom !== null ? actualZoom : ""}</span>
        </>
      }
      map={
        <NaverMapProvider ncpKeyId={NCP_KEY_ID} timeoutMs={15000}>
          <NaverMap
            ref={mapRef}
            data-testid="map-container"
            center={center}
            zoom={zoom}
            mapTypeId={mapTypeId}
            style={{ width: "100%", height: 500 }}
            onMapReady={() => setMapReady(true)}
          />
        </NaverMapProvider>
      }
    />
  );
}

/* ─── interaction toggle ─── */

function InteractionTogglePage() {
  const mapRef = useRef<NaverMapRef>(null);
  const [draggable, setDraggable] = useState(true);
  const [scrollWheel, setScrollWheel] = useState(true);
  const [disableDoubleClickZoom, setDisableDoubleClickZoom] = useState(false);
  const [pinchZoom, setPinchZoom] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const [centerAfterInteraction, setCenterAfterInteraction] = useState("");
  const [zoomAfterInteraction, setZoomAfterInteraction] = useState("");

  const readState = () => {
    const c = mapRef.current?.getCenter();
    const z = mapRef.current?.getZoom();
    if (c) setCenterAfterInteraction(JSON.stringify({ lat: c.y, lng: c.x }));
    if (z !== undefined) setZoomAfterInteraction(String(z));
  };

  return (
    <ScenarioLayout
      buttons={
        <>
          <button data-testid="toggle-draggable" onClick={() => setDraggable((v) => !v)}>드래그 전환</button>
          <button data-testid="toggle-scroll-wheel" onClick={() => setScrollWheel((v) => !v)}>스크롤휠 전환</button>
          <button data-testid="toggle-dblclick-zoom" onClick={() => setDisableDoubleClickZoom((v) => !v)}>더블클릭 줌 전환</button>
          <button data-testid="toggle-pinch-zoom" onClick={() => setPinchZoom((v) => !v)}>핀치줌 전환</button>
          <button data-testid="read-state" onClick={readState}>상태 읽기</button>
        </>
      }
      logs={
        <>
          <span data-testid="map-ready">{String(mapReady)}</span>
          <span data-testid="draggable-state">{String(draggable)}</span>
          <span data-testid="scroll-wheel-state">{String(scrollWheel)}</span>
          <span data-testid="dblclick-zoom-disabled">{String(disableDoubleClickZoom)}</span>
          <span data-testid="pinch-zoom-state">{String(pinchZoom)}</span>
          <span data-testid="center-after">{centerAfterInteraction}</span>
          <span data-testid="zoom-after">{zoomAfterInteraction}</span>
        </>
      }
      map={
        <NaverMapProvider ncpKeyId={NCP_KEY_ID} timeoutMs={15000}>
          <NaverMap
            ref={mapRef}
            data-testid="map-container"
            defaultCenter={DEFAULT_CENTER}
            defaultZoom={12}
            draggable={draggable}
            scrollWheel={scrollWheel}
            disableDoubleClickZoom={disableDoubleClickZoom}
            pinchZoom={pinchZoom}
            style={{ width: "100%", height: 500 }}
            onMapReady={() => setMapReady(true)}
          />
        </NaverMapProvider>
      }
    />
  );
}

/* ─── event flow ─── */

function EventFlowPage() {
  const mapRef = useRef<NaverMapRef>(null);
  const [mapReady, setMapReady] = useState(false);
  const [eventLog, setEventLog] = useState<string[]>([]);

  const log = useCallback((event: string) => {
    setEventLog((prev) => [...prev, event]);
  }, []);

  return (
    <ScenarioLayout
      buttons={
        <button data-testid="clear-log" onClick={() => setEventLog([])}>로그 비우기</button>
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
            ref={mapRef}
            data-testid="map-container"
            defaultCenter={DEFAULT_CENTER}
            defaultZoom={12}
            style={{ width: "100%", height: 500 }}
            onMapReady={() => setMapReady(true)}
            onClick={() => log("click")}
            onDragStart={() => log("dragstart")}
            onDrag={() => log("drag")}
            onDragEnd={() => log("dragend")}
            onZoomStart={() => log("zoomstart")}
            onZoomChanged={() => log("zoomchanged")}
            onIdle={() => log("idle")}
            onBoundsChanged={() => log("boundschanged")}
            onCenterChanged={() => log("centerchanged")}
          />
        </NaverMapProvider>
      }
    />
  );
}

/* ─── ref imperative ─── */

function RefImperativePage() {
  const mapRef = useRef<NaverMapRef>(null);
  const [mapReady, setMapReady] = useState(false);
  const [center, setCenter] = useState("");
  const [zoom, setZoom] = useState("");
  const [bounds, setBounds] = useState("");

  const readState = useCallback(() => {
    const c = mapRef.current?.getCenter();
    const z = mapRef.current?.getZoom();
    const b = mapRef.current?.getBounds();
    if (c) setCenter(JSON.stringify({ lat: c.y, lng: c.x }));
    if (z !== undefined) setZoom(String(z));
    if (b) {
      const ne = (b as naver.maps.LatLngBounds).getNE();
      const sw = (b as naver.maps.LatLngBounds).getSW();
      setBounds(JSON.stringify({ ne: { lat: ne.y, lng: ne.x }, sw: { lat: sw.y, lng: sw.x } }));
    }
  }, []);

  return (
    <ScenarioLayout
      buttons={
        <>
          <button data-testid="btn-pan-to" onClick={() => mapRef.current?.panTo(BUSAN_CENTER)}>부산으로 팬</button>
          <button data-testid="btn-fit-bounds" onClick={() => {
            const sw = { lat: 33.0, lng: 125.0 };
            const ne = { lat: 38.0, lng: 132.0 };
            mapRef.current?.fitBounds(new naver.maps.LatLngBounds(
              new naver.maps.LatLng(sw.lat, sw.lng),
              new naver.maps.LatLng(ne.lat, ne.lng)
            ));
          }}>대한민국 범위 맞춤</button>
          <button data-testid="btn-set-zoom-15" onClick={() => mapRef.current?.setZoom(15)}>줌 15로 설정</button>
          <button data-testid="btn-zoom-by-2" onClick={() => mapRef.current?.zoomBy(2)}>줌 +2</button>
          <button data-testid="btn-zoom-by-minus-1" onClick={() => mapRef.current?.zoomBy(-1)}>줌 -1</button>
          <button data-testid="btn-set-options-no-drag" onClick={() => mapRef.current?.setOptions({ draggable: false })}>드래그 비활성화</button>
          <button data-testid="btn-read-state" onClick={readState}>상태 읽기</button>
        </>
      }
      logs={
        <>
          <span data-testid="map-ready">{String(mapReady)}</span>
          <span data-testid="ref-center">{center}</span>
          <span data-testid="ref-zoom">{zoom}</span>
          <span data-testid="ref-bounds">{bounds}</span>
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
          />
        </NaverMapProvider>
      }
    />
  );
}

/* ─── 라우트 export ─── */

export const mapRoutes: Record<string, React.FC> = {
  "/map/smoke": SmokePage,
  "/map/fallback-error": FallbackErrorPage,
  "/map/uncontrolled": UncontrolledPage,
  "/map/controlled": ControlledPage,
  "/map/interaction-toggle": InteractionTogglePage,
  "/map/event-flow": EventFlowPage,
  "/map/ref-imperative": RefImperativePage,
};
