import React, { useRef, useState, useCallback } from "react";
import { NaverMapProvider, NaverMap, Marker, type NaverMapRef, type MarkerRef } from "react-naver-maps-kit";
import { NCP_KEY_ID, DEFAULT_CENTER, MARKER_POS_1, MARKER_POS_2, MARKER_POS_3 } from "../constants";

/* ─── smoke ─── */

function SmokePage() {
  const [markerReadyCount, setMarkerReadyCount] = useState(0);
  const [destroyed, setDestroyed] = useState(false);
  const [showMarker, setShowMarker] = useState(true);
  const [showCustomMarker, setShowCustomMarker] = useState(true);

  return (
    <div>
      <span data-testid="marker-ready-count">{markerReadyCount}</span>
      <span data-testid="marker-destroyed">{String(destroyed)}</span>
      <button data-testid="toggle-marker" onClick={() => setShowMarker((v) => !v)}>
        Toggle Marker
      </button>
      <span data-testid="show-custom-marker">{String(showCustomMarker)}</span>
      <button data-testid="toggle-custom-marker" onClick={() => setShowCustomMarker((v) => !v)}>
        Toggle Custom Marker
      </button>
      <NaverMapProvider ncpKeyId={NCP_KEY_ID} timeoutMs={15000}>
        <NaverMap
          data-testid="map-container"
          defaultCenter={DEFAULT_CENTER}
          defaultZoom={12}
          style={{ width: "100%", height: 500 }}
        >
          {showMarker && (
            <Marker
              position={MARKER_POS_1}
              title="테스트 마커"
              onMarkerReady={() => setMarkerReadyCount((c) => c + 1)}
              onMarkerDestroy={() => setDestroyed(true)}
            />
          )}
          {showCustomMarker && (
            <Marker
              position={MARKER_POS_2}
              onMarkerReady={() => setMarkerReadyCount((c) => c + 1)}
            >
              <div data-testid="custom-marker-content">커스텀</div>
            </Marker>
          )}
        </NaverMap>
      </NaverMapProvider>
    </div>
  );
}

/* ─── position ─── */

function PositionPage() {
  const markerRef = useRef<MarkerRef>(null);
  const [mapReady, setMapReady] = useState(false);
  const [position, setPosition] = useState(MARKER_POS_1);
  const [markerPosition, setMarkerPosition] = useState("");

  const readPosition = useCallback(() => {
    const pos = markerRef.current?.getPosition();
    if (pos) {
      setMarkerPosition(JSON.stringify({ lat: pos.y, lng: pos.x }));
    }
  }, []);

  const rapidMoves = useCallback(() => {
    setPosition(MARKER_POS_1);
    setTimeout(() => setPosition(MARKER_POS_2), 50);
    setTimeout(() => setPosition(MARKER_POS_3), 100);
  }, []);

  return (
    <div>
      <span data-testid="map-ready">{String(mapReady)}</span>
      <span data-testid="marker-position">{markerPosition}</span>
      <button data-testid="move-gangnam" onClick={() => setPosition(MARKER_POS_2)}>
        Move to Gangnam
      </button>
      <button data-testid="rapid-moves" onClick={rapidMoves}>
        Rapid Moves
      </button>
      <button data-testid="read-position" onClick={readPosition}>
        Read Position
      </button>
      <NaverMapProvider ncpKeyId={NCP_KEY_ID} timeoutMs={15000}>
        <NaverMap
          data-testid="map-container"
          defaultCenter={DEFAULT_CENTER}
          defaultZoom={12}
          style={{ width: "100%", height: 500 }}
          onMapReady={() => setMapReady(true)}
        >
          <Marker ref={markerRef} position={position} />
        </NaverMap>
      </NaverMapProvider>
    </div>
  );
}

/* ─── options ─── */

function OptionsPage() {
  const markerRef = useRef<MarkerRef>(null);
  const [mapReady, setMapReady] = useState(false);
  const [visible, setVisible] = useState(true);
  const [draggable, setDraggable] = useState(false);
  const [clickable, setClickable] = useState(true);
  const [title, setTitle] = useState("테스트");
  const [zIndex, setZIndex] = useState(1);
  const [clickLog, setClickLog] = useState<string[]>([]);

  const [optVisible, setOptVisible] = useState("");
  const [optDraggable, setOptDraggable] = useState("");
  const [optClickable, setOptClickable] = useState("");
  const [optTitle, setOptTitle] = useState("");
  const [optZIndex, setOptZIndex] = useState("");

  const readOptions = useCallback(() => {
    const v = markerRef.current?.getVisible();
    const d = markerRef.current?.getDraggable();
    const c = markerRef.current?.getClickable();
    const t = markerRef.current?.getTitle();
    const z = markerRef.current?.getZIndex();

    setOptVisible(String(v));
    setOptDraggable(String(d));
    setOptClickable(String(c));
    setOptTitle(String(t));
    setOptZIndex(String(z));
  }, []);

  return (
    <div>
      <span data-testid="map-ready">{String(mapReady)}</span>
      <span data-testid="opt-visible">{optVisible}</span>
      <span data-testid="opt-draggable">{optDraggable}</span>
      <span data-testid="opt-clickable">{optClickable}</span>
      <span data-testid="opt-title">{optTitle}</span>
      <span data-testid="opt-zindex">{optZIndex}</span>
      <span data-testid="click-log">{JSON.stringify(clickLog)}</span>

      <button data-testid="toggle-visible" onClick={() => setVisible((v) => !v)}>
        Toggle Visible
      </button>
      <button data-testid="toggle-draggable" onClick={() => setDraggable((v) => !v)}>
        Toggle Draggable
      </button>
      <button data-testid="toggle-clickable" onClick={() => setClickable((v) => !v)}>
        Toggle Clickable
      </button>
      <button data-testid="change-title" onClick={() => setTitle("변경된 타이틀")}>
        Change Title
      </button>
      <button data-testid="change-zindex" onClick={() => setZIndex(999)}>
        Change ZIndex
      </button>
      <button data-testid="read-options" onClick={readOptions}>
        Read Options
      </button>

      <NaverMapProvider ncpKeyId={NCP_KEY_ID} timeoutMs={15000}>
        <NaverMap
          data-testid="map-container"
          defaultCenter={MARKER_POS_1}
          defaultZoom={14}
          style={{ width: "100%", height: 500 }}
          onMapReady={() => setMapReady(true)}
        >
          <Marker
            ref={markerRef}
            position={MARKER_POS_1}
            visible={visible}
            draggable={draggable}
            clickable={clickable}
            title={title}
            zIndex={zIndex}
            onClick={() => setClickLog((prev) => [...prev, "click"])}
          />
        </NaverMap>
      </NaverMapProvider>
    </div>
  );
}

/* ─── events ─── */

function EventsPage() {
  const [mapReady, setMapReady] = useState(false);
  const [eventLog, setEventLog] = useState<string[]>([]);

  const log = useCallback((event: string) => {
    setEventLog((prev) => [...prev, event]);
  }, []);

  return (
    <div>
      <span data-testid="map-ready">{String(mapReady)}</span>
      <span data-testid="event-log">{JSON.stringify(eventLog)}</span>
      <button data-testid="clear-log" onClick={() => setEventLog([])}>
        Clear Log
      </button>

      <NaverMapProvider ncpKeyId={NCP_KEY_ID} timeoutMs={15000}>
        <NaverMap
          data-testid="map-container"
          defaultCenter={MARKER_POS_1}
          defaultZoom={14}
          style={{ width: "100%", height: 500 }}
          onMapReady={() => setMapReady(true)}
        >
          <Marker
            position={MARKER_POS_1}
            draggable={true}
            onClick={() => log("click")}
            onDragStart={() => log("dragstart")}
            onDrag={() => log("drag")}
            onDragEnd={() => log("dragend")}
            onPositionChanged={() => log("positionchanged")}
          >
            <div data-testid="marker-element" style={{ width: 40, height: 40, background: "red", cursor: "pointer" }}>M</div>
          </Marker>
        </NaverMap>
      </NaverMapProvider>
    </div>
  );
}

/* ─── ref ─── */

function RefPage() {
  const markerRef = useRef<MarkerRef>(null);
  const [mapReady, setMapReady] = useState(false);
  const [refPosition, setRefPosition] = useState("");
  const [refVisible, setRefVisible] = useState("");
  const [refDraggable, setRefDraggable] = useState("");

  const readState = useCallback(() => {
    const pos = markerRef.current?.getPosition();
    const vis = markerRef.current?.getVisible();
    const drag = markerRef.current?.getDraggable();

    if (pos) {
      setRefPosition(JSON.stringify({ lat: pos.y, lng: pos.x }));
    }
    setRefVisible(String(vis));
    setRefDraggable(String(drag));
  }, []);

  return (
    <div>
      <span data-testid="map-ready">{String(mapReady)}</span>
      <span data-testid="ref-position">{refPosition}</span>
      <span data-testid="ref-visible">{refVisible}</span>
      <span data-testid="ref-draggable">{refDraggable}</span>

      <button data-testid="ref-set-position" onClick={() => markerRef.current?.setPosition(MARKER_POS_2)}>
        Set Position
      </button>
      <button data-testid="ref-set-visible-false" onClick={() => markerRef.current?.setVisible(false)}>
        Set Visible False
      </button>
      <button data-testid="ref-set-visible-true" onClick={() => markerRef.current?.setVisible(true)}>
        Set Visible True
      </button>
      <button data-testid="ref-set-draggable" onClick={() => markerRef.current?.setDraggable(true)}>
        Set Draggable
      </button>
      <button data-testid="ref-read-state" onClick={readState}>
        Read State
      </button>

      <NaverMapProvider ncpKeyId={NCP_KEY_ID} timeoutMs={15000}>
        <NaverMap
          data-testid="map-container"
          defaultCenter={MARKER_POS_1}
          defaultZoom={14}
          style={{ width: "100%", height: 500 }}
          onMapReady={() => setMapReady(true)}
        >
          <Marker
            ref={markerRef}
            position={MARKER_POS_1}
            visible={true}
            draggable={false}
          />
        </NaverMap>
      </NaverMapProvider>
    </div>
  );
}

/* ─── multiple ─── */

function MultiplePage() {
  const [mapReady, setMapReady] = useState(false);
  const [markers, setMarkers] = useState([MARKER_POS_1, MARKER_POS_2, MARKER_POS_3]);
  const [markerReadyCount, setMarkerReadyCount] = useState(0);
  const [markerDestroyCount, setMarkerDestroyCount] = useState(0);

  const addMarker = useCallback(() => {
    setMarkers((prev) => [...prev, { lat: 37.5 + Math.random() * 0.1, lng: 127.0 + Math.random() * 0.1 }]);
  }, []);

  const removeLast = useCallback(() => {
    setMarkers((prev) => prev.slice(0, -1));
  }, []);

  return (
    <div>
      <span data-testid="map-ready">{String(mapReady)}</span>
      <span data-testid="marker-count">{markers.length}</span>
      <span data-testid="marker-ready-count">{markerReadyCount}</span>
      <span data-testid="marker-destroy-count">{markerDestroyCount}</span>

      <button data-testid="add-marker" onClick={addMarker}>
        Add Marker
      </button>
      <button data-testid="remove-last" onClick={removeLast}>
        Remove Last
      </button>

      <NaverMapProvider ncpKeyId={NCP_KEY_ID} timeoutMs={15000}>
        <NaverMap
          data-testid="map-container"
          defaultCenter={DEFAULT_CENTER}
          defaultZoom={12}
          style={{ width: "100%", height: 500 }}
          onMapReady={() => setMapReady(true)}
        >
          {markers.map((pos, idx) => (
            <Marker
              key={idx}
              position={pos}
              onMarkerReady={() => setMarkerReadyCount((c) => c + 1)}
              onMarkerDestroy={() => setMarkerDestroyCount((c) => c + 1)}
            />
          ))}
        </NaverMap>
      </NaverMapProvider>
    </div>
  );
}

/* ─── 라우트 export ─── */

export const markerRoutes: Record<string, React.FC> = {
  "/marker/smoke": SmokePage,
  "/marker/position": PositionPage,
  "/marker/options": OptionsPage,
  "/marker/events": EventsPage,
  "/marker/ref": RefPage,
  "/marker/multiple": MultiplePage,
};
