import React, { useRef, useState, useCallback } from "react";
import { NaverMapProvider, NaverMap, Marker, type MarkerRef } from "react-naver-maps-kit";

import { NCP_KEY_ID, DEFAULT_CENTER, MARKER_POS_1, MARKER_POS_2, MARKER_POS_3 } from "../constants";

const HTML_ICON_A = {
  content:
    '<div data-testid="html-icon-a" style="width:24px;height:24px;border-radius:12px;background:#2563eb;color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;">A</div>',
  anchor: { x: 12, y: 12 },
  size: { width: 24, height: 24 }
};

const HTML_ICON_B = {
  content:
    '<div data-testid="html-icon-b" style="width:24px;height:24px;border-radius:12px;background:#dc2626;color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;">B</div>',
  anchor: { x: 12, y: 12 },
  size: { width: 24, height: 24 }
};

const POLY_SHAPE = {
  type: "poly",
  coords: [0, 0, 24, 0, 24, 24, 0, 24]
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

/* ─── smoke ─── */

function SmokePage() {
  const [markerReadyCount, setMarkerReadyCount] = useState(0);
  const [destroyed, setDestroyed] = useState(false);
  const [showMarker, setShowMarker] = useState(true);
  const [showCustomMarker, setShowCustomMarker] = useState(true);

  return (
    <ScenarioLayout
      buttons={
        <>
          <button data-testid="toggle-marker" onClick={() => setShowMarker((v) => !v)}>
            마커 표시 전환
          </button>
          <button data-testid="toggle-custom-marker" onClick={() => setShowCustomMarker((v) => !v)}>
            커스텀 마커 전환
          </button>
        </>
      }
      logs={
        <>
          <span data-testid="marker-ready-count">{markerReadyCount}</span>
          <span data-testid="marker-destroyed">{String(destroyed)}</span>
          <span data-testid="show-custom-marker">{String(showCustomMarker)}</span>
        </>
      }
      map={
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
      }
    />
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
    <ScenarioLayout
      buttons={
        <>
          <button data-testid="move-gangnam" onClick={() => setPosition(MARKER_POS_2)}>
            강남으로 이동
          </button>
          <button data-testid="rapid-moves" onClick={rapidMoves}>
            빠른 이동
          </button>
          <button data-testid="read-position" onClick={readPosition}>
            위치 읽기
          </button>
        </>
      }
      logs={
        <>
          <span data-testid="map-ready">{String(mapReady)}</span>
          <span data-testid="marker-position">{markerPosition}</span>
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
            <Marker ref={markerRef} position={position} />
          </NaverMap>
        </NaverMapProvider>
      }
    />
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
  const [cursor, setCursor] = useState("default");
  const [icon, setIcon] = useState<typeof HTML_ICON_A | undefined>(HTML_ICON_A);
  const [shape, setShape] = useState<typeof POLY_SHAPE | undefined>(undefined);
  const [clickLog, setClickLog] = useState<string[]>([]);

  const [optVisible, setOptVisible] = useState("");
  const [optDraggable, setOptDraggable] = useState("");
  const [optClickable, setOptClickable] = useState("");
  const [optTitle, setOptTitle] = useState("");
  const [optZIndex, setOptZIndex] = useState("");
  const [optCursor, setOptCursor] = useState("");
  const [optIconKind, setOptIconKind] = useState("");
  const [optShapeKind, setOptShapeKind] = useState("");

  const [evtTitleChanged, setEvtTitleChanged] = useState(0);
  const [evtVisibleChanged, setEvtVisibleChanged] = useState(0);
  const [evtZIndexChanged, setEvtZIndexChanged] = useState(0);
  const [evtCursorChanged, setEvtCursorChanged] = useState(0);
  const [evtIconChanged, setEvtIconChanged] = useState(0);
  const [evtShapeChanged, setEvtShapeChanged] = useState(0);

  const readOptions = useCallback(() => {
    const v = markerRef.current?.getVisible();
    const d = markerRef.current?.getDraggable();
    const c = markerRef.current?.getClickable();
    const t = markerRef.current?.getTitle();
    const z = markerRef.current?.getZIndex();
    const cur = markerRef.current?.getCursor();
    const iconValue = markerRef.current?.getIcon();
    const shapeValue = markerRef.current?.getShape() as
      | { type?: string; coords?: number[] }
      | undefined;

    setOptVisible(String(v));
    setOptDraggable(String(d));
    setOptClickable(String(c));
    setOptTitle(String(t));
    setOptZIndex(String(z));
    setOptCursor(String(cur));

    if (typeof iconValue === "string") {
      setOptIconKind("string");
    } else if (iconValue && typeof iconValue === "object" && "content" in iconValue) {
      const content = String((iconValue as { content?: unknown }).content ?? "");
      if (content.includes("icon-b")) {
        setOptIconKind("icon-b");
      } else if (content.includes("icon-a")) {
        setOptIconKind("icon-a");
      } else {
        setOptIconKind("html");
      }
    } else {
      setOptIconKind("none");
    }

    if (!shapeValue) {
      setOptShapeKind("none");
    } else {
      setOptShapeKind(`${String(shapeValue.type ?? "")}:${shapeValue.coords?.length ?? 0}`);
    }
  }, []);

  return (
    <ScenarioLayout
      buttons={
        <>
          <button data-testid="toggle-visible" onClick={() => setVisible((v) => !v)}>
            표시 전환
          </button>
          <button data-testid="toggle-draggable" onClick={() => setDraggable((v) => !v)}>
            드래그 전환
          </button>
          <button data-testid="toggle-clickable" onClick={() => setClickable((v) => !v)}>
            클릭 가능 전환
          </button>
          <button data-testid="change-title" onClick={() => setTitle("변경된 타이틀")}>
            타이틀 변경
          </button>
          <button data-testid="change-zindex" onClick={() => setZIndex(999)}>
            Z인덱스 변경
          </button>
          <button data-testid="change-cursor" onClick={() => setCursor("crosshair")}>
            커서 변경
          </button>
          <button data-testid="change-icon" onClick={() => setIcon(HTML_ICON_B)}>
            아이콘 변경
          </button>
          <button data-testid="change-shape" onClick={() => setShape(POLY_SHAPE)}>
            shape 변경
          </button>
          <button data-testid="read-options" onClick={readOptions}>
            옵션 읽기
          </button>
        </>
      }
      logs={
        <>
          <span data-testid="map-ready">{String(mapReady)}</span>
          <span data-testid="opt-visible">{optVisible}</span>
          <span data-testid="opt-draggable">{optDraggable}</span>
          <span data-testid="opt-clickable">{optClickable}</span>
          <span data-testid="opt-title">{optTitle}</span>
          <span data-testid="opt-zindex">{optZIndex}</span>
          <span data-testid="opt-cursor">{optCursor}</span>
          <span data-testid="opt-icon-kind">{optIconKind}</span>
          <span data-testid="opt-shape-kind">{optShapeKind}</span>
          <span data-testid="evt-title-changed">{evtTitleChanged}</span>
          <span data-testid="evt-visible-changed">{evtVisibleChanged}</span>
          <span data-testid="evt-zindex-changed">{evtZIndexChanged}</span>
          <span data-testid="evt-cursor-changed">{evtCursorChanged}</span>
          <span data-testid="evt-icon-changed">{evtIconChanged}</span>
          <span data-testid="evt-shape-changed">{evtShapeChanged}</span>
          <span data-testid="click-log">{JSON.stringify(clickLog)}</span>
        </>
      }
      map={
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
              cursor={cursor}
              icon={icon}
              shape={shape}
              onClick={() => setClickLog((prev) => [...prev, "click"])}
              onTitleChanged={() => setEvtTitleChanged((v) => v + 1)}
              onVisibleChanged={() => setEvtVisibleChanged((v) => v + 1)}
              onZIndexChanged={() => setEvtZIndexChanged((v) => v + 1)}
              onCursorChanged={() => setEvtCursorChanged((v) => v + 1)}
              onIconChanged={() => setEvtIconChanged((v) => v + 1)}
              onShapeChanged={() => setEvtShapeChanged((v) => v + 1)}
            />
          </NaverMap>
        </NaverMapProvider>
      }
    />
  );
}

/* ─── events ─── */

function EventsPage() {
  const markerRef = useRef<MarkerRef>(null);
  const [mapReady, setMapReady] = useState(false);
  const [eventLog, setEventLog] = useState<string[]>([]);

  const log = useCallback((event: string) => {
    setEventLog((prev) => [...prev, event]);
  }, []);

  const triggerEvent = useCallback((eventName: string) => {
    const marker = markerRef.current?.getInstance();

    if (!marker) {
      return;
    }

    naver.maps.Event.trigger(marker, eventName, {});
  }, []);

  return (
    <ScenarioLayout
      buttons={
        <>
          <button data-testid="clear-log" onClick={() => setEventLog([])}>
            로그 비우기
          </button>
          <button data-testid="trigger-dblclick" onClick={() => triggerEvent("dblclick")}>
            dblclick 트리거
          </button>
          <button data-testid="trigger-rightclick" onClick={() => triggerEvent("rightclick")}>
            rightclick 트리거
          </button>
          <button data-testid="trigger-mousedown" onClick={() => triggerEvent("mousedown")}>
            mousedown 트리거
          </button>
          <button data-testid="trigger-mouseup" onClick={() => triggerEvent("mouseup")}>
            mouseup 트리거
          </button>
          <button data-testid="trigger-touchstart" onClick={() => triggerEvent("touchstart")}>
            touchstart 트리거
          </button>
          <button data-testid="trigger-touchend" onClick={() => triggerEvent("touchend")}>
            touchend 트리거
          </button>
        </>
      }
      logs={
        <>
          <span data-testid="map-ready">{String(mapReady)}</span>
          <span data-testid="event-log">{JSON.stringify(eventLog)}</span>
        </>
      }
      map={
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
              draggable={true}
              onClick={() => log("click")}
              onDblClick={() => log("dblclick")}
              onRightClick={() => log("rightclick")}
              onMouseDown={() => log("mousedown")}
              onMouseUp={() => log("mouseup")}
              onTouchStart={() => log("touchstart")}
              onTouchEnd={() => log("touchend")}
              onDragStart={() => log("dragstart")}
              onDrag={() => log("drag")}
              onDragEnd={() => log("dragend")}
              onPositionChanged={() => log("positionchanged")}
            >
              <div
                data-testid="marker-element"
                style={{ width: 40, height: 40, background: "red", cursor: "pointer" }}
              >
                M
              </div>
            </Marker>
          </NaverMap>
        </NaverMapProvider>
      }
    />
  );
}

/* ─── ref ─── */

function RefPage() {
  const markerRef = useRef<MarkerRef>(null);
  const [mapReady, setMapReady] = useState(false);
  const [refPosition, setRefPosition] = useState("");
  const [refVisible, setRefVisible] = useState("");
  const [refDraggable, setRefDraggable] = useState("");
  const [refClickable, setRefClickable] = useState("");
  const [refTitle, setRefTitle] = useState("");
  const [refCursor, setRefCursor] = useState("");
  const [refZIndex, setRefZIndex] = useState("");
  const [refIconKind, setRefIconKind] = useState("");
  const [refShapeKind, setRefShapeKind] = useState("");
  const [refMapBound, setRefMapBound] = useState("");
  const [refElementExists, setRefElementExists] = useState("");
  const [refDrawingRectExists, setRefDrawingRectExists] = useState("");
  const [refOptionsExists, setRefOptionsExists] = useState("");

  const readState = useCallback(() => {
    const pos = markerRef.current?.getPosition();
    const vis = markerRef.current?.getVisible();
    const drag = markerRef.current?.getDraggable();
    const clickable = markerRef.current?.getClickable();
    const title = markerRef.current?.getTitle();
    const cursor = markerRef.current?.getCursor();
    const zIndex = markerRef.current?.getZIndex();
    const icon = markerRef.current?.getIcon();
    const shape = markerRef.current?.getShape() as { type?: string; coords?: number[] } | undefined;
    const map = markerRef.current?.getMap();
    const element = markerRef.current?.getElement();
    const drawingRect = markerRef.current?.getDrawingRect();
    const options = markerRef.current?.getOptions();

    if (pos) {
      setRefPosition(JSON.stringify({ lat: pos.y, lng: pos.x }));
    }

    setRefVisible(String(vis));
    setRefDraggable(String(drag));
    setRefClickable(String(clickable));
    setRefTitle(String(title));
    setRefCursor(String(cursor));
    setRefZIndex(String(zIndex));
    setRefMapBound(String(Boolean(map)));
    setRefElementExists(String(Boolean(element)));
    setRefDrawingRectExists(String(Boolean(drawingRect)));
    setRefOptionsExists(String(Boolean(options)));

    if (typeof icon === "string") {
      setRefIconKind("string");
    } else if (icon && typeof icon === "object" && "content" in icon) {
      const content = String((icon as { content?: unknown }).content ?? "");
      if (content.includes("icon-b")) {
        setRefIconKind("icon-b");
      } else if (content.includes("icon-a")) {
        setRefIconKind("icon-a");
      } else {
        setRefIconKind("html");
      }
    } else {
      setRefIconKind("none");
    }

    if (!shape) {
      setRefShapeKind("none");
    } else {
      setRefShapeKind(`${String(shape.type ?? "")}:${shape.coords?.length ?? 0}`);
    }
  }, []);

  return (
    <ScenarioLayout
      buttons={
        <>
          <button
            data-testid="ref-set-position"
            onClick={() => markerRef.current?.setPosition(MARKER_POS_2)}
          >
            위치 설정
          </button>
          <button
            data-testid="ref-set-visible-false"
            onClick={() => markerRef.current?.setVisible(false)}
          >
            표시 끔
          </button>
          <button
            data-testid="ref-set-visible-true"
            onClick={() => markerRef.current?.setVisible(true)}
          >
            표시 켬
          </button>
          <button
            data-testid="ref-set-draggable"
            onClick={() => markerRef.current?.setDraggable(true)}
          >
            드래그 가능 설정
          </button>
          <button
            data-testid="ref-set-clickable"
            onClick={() => markerRef.current?.setClickable(true)}
          >
            클릭 가능 설정
          </button>
          <button
            data-testid="ref-set-title"
            onClick={() => markerRef.current?.setTitle("ref-title")}
          >
            타이틀 설정
          </button>
          <button
            data-testid="ref-set-cursor"
            onClick={() => markerRef.current?.setCursor("crosshair")}
          >
            커서 설정
          </button>
          <button data-testid="ref-set-zindex" onClick={() => markerRef.current?.setZIndex(777)}>
            zIndex 설정
          </button>
          <button
            data-testid="ref-set-icon"
            onClick={() => markerRef.current?.setIcon(HTML_ICON_B)}
          >
            icon 설정
          </button>
          <button
            data-testid="ref-set-shape"
            onClick={() => markerRef.current?.setShape(POLY_SHAPE)}
          >
            shape 설정
          </button>
          <button
            data-testid="ref-set-options"
            onClick={() => {
              const optionSetter = markerRef.current as MarkerRef & {
                setOptions: (key: string, value: unknown) => void;
              };

              optionSetter?.setOptions("title", "options-title");
              optionSetter?.setOptions("cursor", "pointer");
            }}
          >
            options 설정
          </button>
          <button data-testid="ref-read-state" onClick={readState}>
            상태 읽기
          </button>
        </>
      }
      logs={
        <>
          <span data-testid="map-ready">{String(mapReady)}</span>
          <span data-testid="ref-position">{refPosition}</span>
          <span data-testid="ref-visible">{refVisible}</span>
          <span data-testid="ref-draggable">{refDraggable}</span>
          <span data-testid="ref-clickable">{refClickable}</span>
          <span data-testid="ref-title">{refTitle}</span>
          <span data-testid="ref-cursor">{refCursor}</span>
          <span data-testid="ref-zindex">{refZIndex}</span>
          <span data-testid="ref-icon-kind">{refIconKind}</span>
          <span data-testid="ref-shape-kind">{refShapeKind}</span>
          <span data-testid="ref-map-bound">{refMapBound}</span>
          <span data-testid="ref-element-exists">{refElementExists}</span>
          <span data-testid="ref-drawing-rect-exists">{refDrawingRectExists}</span>
          <span data-testid="ref-options-exists">{refOptionsExists}</span>
        </>
      }
      map={
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
              clickable={false}
              title="초기 타이틀"
              cursor="default"
              zIndex={1}
              icon={HTML_ICON_A}
            />
          </NaverMap>
        </NaverMapProvider>
      }
    />
  );
}

/* ─── multiple ─── */

function MultiplePage() {
  const [mapReady, setMapReady] = useState(false);
  const [markers, setMarkers] = useState([MARKER_POS_1, MARKER_POS_2, MARKER_POS_3]);
  const [markerReadyCount, setMarkerReadyCount] = useState(0);
  const [markerDestroyCount, setMarkerDestroyCount] = useState(0);

  const addMarker = useCallback(() => {
    setMarkers((prev) => [
      ...prev,
      { lat: 37.5 + Math.random() * 0.1, lng: 127.0 + Math.random() * 0.1 }
    ]);
  }, []);

  const removeLast = useCallback(() => {
    setMarkers((prev) => prev.slice(0, -1));
  }, []);

  return (
    <ScenarioLayout
      buttons={
        <>
          <button data-testid="add-marker" onClick={addMarker}>
            마커 추가
          </button>
          <button data-testid="remove-last" onClick={removeLast}>
            마지막 제거
          </button>
        </>
      }
      logs={
        <>
          <span data-testid="map-ready">{String(mapReady)}</span>
          <span data-testid="marker-count">{markers.length}</span>
          <span data-testid="marker-ready-count">{markerReadyCount}</span>
          <span data-testid="marker-destroy-count">{markerDestroyCount}</span>
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
      }
    />
  );
}

/* ─── 라우트 export ─── */

export const markerRoutes: Record<string, React.FC> = {
  "/marker/smoke": SmokePage,
  "/marker/position": PositionPage,
  "/marker/options": OptionsPage,
  "/marker/events": EventsPage,
  "/marker/ref": RefPage,
  "/marker/multiple": MultiplePage
};
