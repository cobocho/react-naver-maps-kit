import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Ellipse,
  NaverMap,
  NaverMapProvider,
  type EllipseRef,
  type NaverMapRef
} from "react-naver-maps-kit";

import {
  DEFAULT_CENTER,
  ELLIPSE_BOUNDS_1,
  ELLIPSE_BOUNDS_2,
  ELLIPSE_BOUNDS_3,
  NCP_KEY_ID
} from "../constants";

type EllipseBoundsLiteral = {
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

function randomBounds(seed: number): EllipseBoundsLiteral {
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
  const ellipseRef = useRef<EllipseRef>(null);

  const [mapReady, setMapReady] = useState(false);
  const [ellipseReadyCount, setEllipseReadyCount] = useState(0);
  const [ellipseDestroyed, setEllipseDestroyed] = useState(false);
  const [showEllipse, setShowEllipse] = useState(true);
  const [mapBound, setMapBound] = useState("");
  const [mapEquals, setMapEquals] = useState("");

  const readBinding = useCallback(() => {
    const ellipseMap = ellipseRef.current?.getMap();
    const mapInstance = mapRef.current?.getInstance();

    setMapBound(String(Boolean(ellipseMap)));
    setMapEquals(String(Boolean(ellipseMap && mapInstance && ellipseMap === mapInstance)));
  }, []);

  return (
    <ScenarioLayout
      buttons={
        <>
          <button data-testid="toggle-ellipse" onClick={() => setShowEllipse((v) => !v)}>
            ellipse 토글
          </button>
          <button data-testid="read-map-binding" onClick={readBinding}>
            바인딩 읽기
          </button>
        </>
      }
      logs={
        <>
          <span data-testid="map-ready">{String(mapReady)}</span>
          <span data-testid="ellipse-ready-count">{ellipseReadyCount}</span>
          <span data-testid="ellipse-destroyed">{String(ellipseDestroyed)}</span>
          <span data-testid="show-ellipse">{String(showEllipse)}</span>
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
            {showEllipse && (
              <Ellipse
                ref={ellipseRef}
                bounds={ELLIPSE_BOUNDS_1}
                fillColor="#2563eb"
                fillOpacity={0.25}
                strokeColor="#1d4ed8"
                strokeWeight={2}
                clickable={true}
                visible={true}
                onEllipseReady={() => setEllipseReadyCount((c) => c + 1)}
                onEllipseDestroy={() => setEllipseDestroyed(true)}
              />
            )}
          </NaverMap>
        </NaverMapProvider>
      }
    />
  );
}

/* ─── 2. bounds/options ─── */

function BoundsOptionsPage() {
  const ellipseRef = useRef<EllipseRef>(null);

  const [mapReady, setMapReady] = useState(false);
  const [bounds, setBounds] = useState<EllipseBoundsLiteral>(ELLIPSE_BOUNDS_1);
  const [visible, setVisible] = useState(true);
  const [clickable, setClickable] = useState(true);
  const [zIndex, setZIndex] = useState(1);

  const [fillColor, setFillColor] = useState("#2563eb");
  const [fillOpacity, setFillOpacity] = useState(0.25);
  const [strokeColor, setStrokeColor] = useState("#1d4ed8");
  const [strokeOpacity, setStrokeOpacity] = useState(0.9);
  const [strokeWeight, setStrokeWeight] = useState(2);
  const [strokeStyle, setStrokeStyle] = useState<naver.maps.StrokeStyleType>("solid");
  const [strokeLineCap, setStrokeLineCap] = useState<naver.maps.StrokeLineCapType>("round");
  const [strokeLineJoin, setStrokeLineJoin] = useState<naver.maps.StrokeLineJoinType>("round");

  const [optBounds, setOptBounds] = useState("");
  const [optVisible, setOptVisible] = useState("");
  const [optClickable, setOptClickable] = useState("");
  const [optZIndex, setOptZIndex] = useState("");
  const [optAreaSize, setOptAreaSize] = useState("");
  const [optFillColor, setOptFillColor] = useState("");
  const [optFillOpacity, setOptFillOpacity] = useState("");
  const [optStrokeColor, setOptStrokeColor] = useState("");
  const [optStrokeOpacity, setOptStrokeOpacity] = useState("");
  const [optStrokeWeight, setOptStrokeWeight] = useState("");
  const [optStrokeStyle, setOptStrokeStyle] = useState("");
  const [optStrokeLineCap, setOptStrokeLineCap] = useState("");
  const [optStrokeLineJoin, setOptStrokeLineJoin] = useState("");

  const [boundsChangedCount, setBoundsChangedCount] = useState(0);
  const [clickableChangedCount, setClickableChangedCount] = useState(0);
  const [fillColorChangedCount, setFillColorChangedCount] = useState(0);
  const [fillOpacityChangedCount, setFillOpacityChangedCount] = useState(0);
  const [strokeColorChangedCount, setStrokeColorChangedCount] = useState(0);
  const [strokeLineCapChangedCount, setStrokeLineCapChangedCount] = useState(0);
  const [strokeLineJoinChangedCount, setStrokeLineJoinChangedCount] = useState(0);
  const [strokeOpacityChangedCount, setStrokeOpacityChangedCount] = useState(0);
  const [strokeStyleChangedCount, setStrokeStyleChangedCount] = useState(0);
  const [strokeWeightChangedCount, setStrokeWeightChangedCount] = useState(0);
  const [visibleChangedCount, setVisibleChangedCount] = useState(0);
  const [zIndexChangedCount, setZIndexChangedCount] = useState(0);

  const readState = useCallback(() => {
    const styles = (ellipseRef.current?.getStyles() ?? {}) as Record<string, unknown>;
    const strokeStyleValue = ellipseRef.current?.getOptions("strokeStyle");
    const strokeLineCapValue = ellipseRef.current?.getOptions("strokeLineCap");
    const strokeLineJoinValue = ellipseRef.current?.getOptions("strokeLineJoin");

    setOptBounds(toBoundsText(ellipseRef.current?.getBounds() as naver.maps.LatLngBounds | undefined));
    setOptVisible(String(ellipseRef.current?.getVisible()));
    setOptClickable(String(ellipseRef.current?.getClickable()));
    setOptZIndex(String(ellipseRef.current?.getZIndex()));
    setOptAreaSize(String(ellipseRef.current?.getAreaSize() ?? ""));
    setOptFillColor(String(styles.fillColor ?? ""));
    setOptFillOpacity(String(styles.fillOpacity ?? ""));
    setOptStrokeColor(String(styles.strokeColor ?? ""));
    setOptStrokeOpacity(String(styles.strokeOpacity ?? ""));
    setOptStrokeWeight(String(styles.strokeWeight ?? ""));
    setOptStrokeStyle(String(strokeStyleValue ?? styles.strokeStyle ?? ""));
    setOptStrokeLineCap(String(strokeLineCapValue ?? styles.strokeLineCap ?? ""));
    setOptStrokeLineJoin(String(strokeLineJoinValue ?? styles.strokeLineJoin ?? ""));
  }, []);

  const rapidBounds = useCallback(() => {
    setBounds(ELLIPSE_BOUNDS_1);
    setTimeout(() => setBounds(ELLIPSE_BOUNDS_2), 50);
    setTimeout(() => setBounds(ELLIPSE_BOUNDS_3), 100);
  }, []);

  const triggerChanged = useCallback((eventName: string, payload: unknown) => {
    const ellipse = ellipseRef.current?.getInstance();

    if (!ellipse) {
      return;
    }

    naver.maps.Event.trigger(ellipse, eventName, payload);
  }, []);

  useEffect(() => {
    const ellipse = ellipseRef.current?.getInstance();
    if (!ellipse) return;
    naver.maps.Event.trigger(ellipse, "bounds_changed", ellipse.getBounds());
  }, [bounds]);

  useEffect(() => {
    triggerChanged("clickable_changed", clickable);
  }, [clickable, triggerChanged]);

  useEffect(() => {
    triggerChanged("fillColor_changed", fillColor);
  }, [fillColor, triggerChanged]);

  useEffect(() => {
    triggerChanged("fillOpacity_changed", fillOpacity);
  }, [fillOpacity, triggerChanged]);

  useEffect(() => {
    triggerChanged("strokeColor_changed", strokeColor);
  }, [strokeColor, triggerChanged]);

  useEffect(() => {
    triggerChanged("strokeOpacity_changed", strokeOpacity);
  }, [strokeOpacity, triggerChanged]);

  useEffect(() => {
    triggerChanged("strokeWeight_changed", strokeWeight);
  }, [strokeWeight, triggerChanged]);

  useEffect(() => {
    triggerChanged("strokeStyle_changed", strokeStyle);
  }, [strokeStyle, triggerChanged]);

  useEffect(() => {
    triggerChanged("strokeLineCap_changed", strokeLineCap);
  }, [strokeLineCap, triggerChanged]);

  useEffect(() => {
    triggerChanged("strokeLineJoin_changed", strokeLineJoin);
  }, [strokeLineJoin, triggerChanged]);

  useEffect(() => {
    triggerChanged("visible_changed", visible);
  }, [visible, triggerChanged]);

  useEffect(() => {
    triggerChanged("zIndex_changed", zIndex);
  }, [zIndex, triggerChanged]);

  return (
    <ScenarioLayout
      buttons={
        <>
          <button data-testid="set-bounds-2" onClick={() => setBounds(ELLIPSE_BOUNDS_2)}>
            bounds 2
          </button>
          <button data-testid="set-bounds-3" onClick={() => setBounds(ELLIPSE_BOUNDS_3)}>
            bounds 3
          </button>
          <button data-testid="rapid-bounds" onClick={rapidBounds}>
            bounds 연속 변경
          </button>
          <button data-testid="toggle-visible" onClick={() => setVisible((v) => !v)}>
            visible 토글
          </button>
          <button data-testid="toggle-clickable" onClick={() => setClickable((v) => !v)}>
            clickable 토글
          </button>
          <button data-testid="set-zindex-999" onClick={() => setZIndex(999)}>
            zIndex 999
          </button>
          <button data-testid="set-zindex-1" onClick={() => setZIndex(1)}>
            zIndex 1
          </button>
          <button data-testid="set-fill-red" onClick={() => setFillColor("#ff0000")}>
            fill red
          </button>
          <button data-testid="set-fill-opacity-08" onClick={() => setFillOpacity(0.8)}>
            fillOpacity 0.8
          </button>
          <button data-testid="set-stroke-green" onClick={() => setStrokeColor("#00aa00")}>
            stroke green
          </button>
          <button data-testid="set-stroke-opacity-04" onClick={() => setStrokeOpacity(0.4)}>
            strokeOpacity 0.4
          </button>
          <button data-testid="set-stroke-weight-6" onClick={() => setStrokeWeight(6)}>
            strokeWeight 6
          </button>
          <button
            data-testid="set-stroke-style-shortdash"
            onClick={() => setStrokeStyle("shortdash" as naver.maps.StrokeStyleType)}
          >
            style shortdash
          </button>
          <button
            data-testid="set-linecap-butt"
            onClick={() => setStrokeLineCap("butt" as naver.maps.StrokeLineCapType)}
          >
            lineCap butt
          </button>
          <button
            data-testid="set-linejoin-bevel"
            onClick={() => setStrokeLineJoin("bevel" as naver.maps.StrokeLineJoinType)}
          >
            lineJoin bevel
          </button>
          <button data-testid="read-state" onClick={readState}>
            상태 읽기
          </button>
        </>
      }
      logs={
        <>
          <span data-testid="map-ready">{String(mapReady)}</span>
          <span data-testid="opt-bounds">{optBounds}</span>
          <span data-testid="opt-visible">{optVisible}</span>
          <span data-testid="opt-clickable">{optClickable}</span>
          <span data-testid="opt-zindex">{optZIndex}</span>
          <span data-testid="opt-area-size">{optAreaSize}</span>
          <span data-testid="opt-fill-color">{optFillColor}</span>
          <span data-testid="opt-fill-opacity">{optFillOpacity}</span>
          <span data-testid="opt-stroke-color">{optStrokeColor}</span>
          <span data-testid="opt-stroke-opacity">{optStrokeOpacity}</span>
          <span data-testid="opt-stroke-weight">{optStrokeWeight}</span>
          <span data-testid="opt-stroke-style">{optStrokeStyle}</span>
          <span data-testid="opt-stroke-linecap">{optStrokeLineCap}</span>
          <span data-testid="opt-stroke-linejoin">{optStrokeLineJoin}</span>
          <span data-testid="evt-bounds-changed-count">{boundsChangedCount}</span>
          <span data-testid="evt-clickable-changed-count">{clickableChangedCount}</span>
          <span data-testid="evt-fill-color-changed-count">{fillColorChangedCount}</span>
          <span data-testid="evt-fill-opacity-changed-count">{fillOpacityChangedCount}</span>
          <span data-testid="evt-stroke-color-changed-count">{strokeColorChangedCount}</span>
          <span data-testid="evt-stroke-linecap-changed-count">{strokeLineCapChangedCount}</span>
          <span data-testid="evt-stroke-linejoin-changed-count">{strokeLineJoinChangedCount}</span>
          <span data-testid="evt-stroke-opacity-changed-count">{strokeOpacityChangedCount}</span>
          <span data-testid="evt-stroke-style-changed-count">{strokeStyleChangedCount}</span>
          <span data-testid="evt-stroke-weight-changed-count">{strokeWeightChangedCount}</span>
          <span data-testid="evt-visible-changed-count">{visibleChangedCount}</span>
          <span data-testid="evt-zindex-changed-count">{zIndexChangedCount}</span>
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
            <Ellipse
              ref={ellipseRef}
              bounds={bounds}
              visible={visible}
              clickable={clickable}
              zIndex={zIndex}
              fillColor={fillColor}
              fillOpacity={fillOpacity}
              strokeColor={strokeColor}
              strokeOpacity={strokeOpacity}
              strokeWeight={strokeWeight}
              strokeStyle={strokeStyle}
              strokeLineCap={strokeLineCap}
              strokeLineJoin={strokeLineJoin}
              onBoundsChanged={() => setBoundsChangedCount((c) => c + 1)}
              onClickableChanged={() => setClickableChangedCount((c) => c + 1)}
              onFillColorChanged={() => setFillColorChangedCount((c) => c + 1)}
              onFillOpacityChanged={() => setFillOpacityChangedCount((c) => c + 1)}
              onStrokeColorChanged={() => setStrokeColorChangedCount((c) => c + 1)}
              onStrokeLineCapChanged={() => setStrokeLineCapChangedCount((c) => c + 1)}
              onStrokeLineJoinChanged={() => setStrokeLineJoinChangedCount((c) => c + 1)}
              onStrokeOpacityChanged={() => setStrokeOpacityChangedCount((c) => c + 1)}
              onStrokeStyleChanged={() => setStrokeStyleChangedCount((c) => c + 1)}
              onStrokeWeightChanged={() => setStrokeWeightChangedCount((c) => c + 1)}
              onVisibleChanged={() => setVisibleChangedCount((c) => c + 1)}
              onZIndexChanged={() => setZIndexChangedCount((c) => c + 1)}
            />
          </NaverMap>
        </NaverMapProvider>
      }
    />
  );
}

/* ─── 3. pointer events ─── */

function EventsPage() {
  const ellipseRef = useRef<EllipseRef>(null);

  const [mapReady, setMapReady] = useState(false);
  const [eventLog, setEventLog] = useState<string[]>([]);

  const log = useCallback((event: string) => {
    setEventLog((prev) => [...prev, event]);
  }, []);

  const triggerEvent = useCallback((eventName: string) => {
    const ellipse = ellipseRef.current?.getInstance();

    if (!ellipse) {
      return;
    }

    if (eventName === "map_changed") {
      naver.maps.Event.trigger(ellipse, eventName, ellipse.getMap());
      return;
    }

    naver.maps.Event.trigger(ellipse, eventName, {});
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
            <Ellipse
              ref={ellipseRef}
              bounds={ELLIPSE_BOUNDS_1}
              clickable={true}
              fillColor="#2563eb"
              fillOpacity={0.25}
              strokeColor="#1d4ed8"
              strokeWeight={2}
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
  const ellipseRef = useRef<EllipseRef>(null);

  const [mapReady, setMapReady] = useState(false);
  const [mapChangedCount, setMapChangedCount] = useState(0);

  const [refBounds, setRefBounds] = useState("");
  const [refClickable, setRefClickable] = useState("");
  const [refVisible, setRefVisible] = useState("");
  const [refZIndex, setRefZIndex] = useState("");
  const [refAreaSize, setRefAreaSize] = useState("");
  const [refMapBound, setRefMapBound] = useState("");
  const [refElementExists, setRefElementExists] = useState("");
  const [refDrawingRectExists, setRefDrawingRectExists] = useState("");
  const [refOptionsExists, setRefOptionsExists] = useState("");
  const [refPanesExists, setRefPanesExists] = useState("");
  const [refProjectionExists, setRefProjectionExists] = useState("");
  const [refFillColor, setRefFillColor] = useState("");
  const [refStrokeColor, setRefStrokeColor] = useState("");

  const readState = useCallback(() => {
    const styles = (ellipseRef.current?.getStyles() ?? {}) as Record<string, unknown>;
    const drawingRect = ellipseRef.current?.getDrawingRect();

    setRefBounds(toBoundsText(ellipseRef.current?.getBounds() as naver.maps.LatLngBounds | undefined));
    setRefClickable(String(ellipseRef.current?.getClickable()));
    setRefVisible(String(ellipseRef.current?.getVisible()));
    setRefZIndex(String(ellipseRef.current?.getZIndex()));
    setRefAreaSize(String(ellipseRef.current?.getAreaSize() ?? ""));
    setRefMapBound(String(Boolean(ellipseRef.current?.getMap())));
    setRefElementExists(String(Boolean(ellipseRef.current?.getElement())));
    setRefDrawingRectExists(String(Boolean(drawingRect)));
    setRefOptionsExists(String(Boolean(ellipseRef.current?.getOptions())));
    setRefPanesExists(String(Boolean(ellipseRef.current?.getPanes())));
    setRefProjectionExists(String(Boolean(ellipseRef.current?.getProjection())));
    setRefFillColor(String(styles.fillColor ?? ""));
    setRefStrokeColor(String(styles.strokeColor ?? ""));
  }, []);

  const triggerMapChanged = useCallback(() => {
    const ellipse = ellipseRef.current?.getInstance();

    if (!ellipse) {
      return;
    }

    naver.maps.Event.trigger(ellipse, "map_changed", ellipse.getMap());
  }, []);

  return (
    <ScenarioLayout
      buttons={
        <>
          <button data-testid="ref-set-bounds-2" onClick={() => ellipseRef.current?.setBounds(ELLIPSE_BOUNDS_2)}>
            setBounds 2
          </button>
          <button data-testid="ref-set-clickable-true" onClick={() => ellipseRef.current?.setClickable(true)}>
            clickable true
          </button>
          <button data-testid="ref-set-clickable-false" onClick={() => ellipseRef.current?.setClickable(false)}>
            clickable false
          </button>
          <button data-testid="ref-set-visible-false" onClick={() => ellipseRef.current?.setVisible(false)}>
            visible false
          </button>
          <button data-testid="ref-set-visible-true" onClick={() => ellipseRef.current?.setVisible(true)}>
            visible true
          </button>
          <button data-testid="ref-set-zindex-555" onClick={() => ellipseRef.current?.setZIndex(555)}>
            zIndex 555
          </button>
          <button
            data-testid="ref-set-options"
            onClick={() => {
              const optionSetter = ellipseRef.current as EllipseRef & {
                setOptions: (key: string, value: unknown) => void;
              };

              optionSetter?.setOptions("zIndex", 777);
              optionSetter?.setOptions("clickable", true);
              optionSetter?.setOptions("strokeWeight", 6);
            }}
          >
            setOptions
          </button>
          <button
            data-testid="ref-set-styles"
            onClick={() => {
              const styleSetter = ellipseRef.current as EllipseRef & {
                setStyles: (styles: { fillColor?: string; strokeColor?: string }) => void;
              };

              styleSetter?.setStyles({ fillColor: "#ff00ff", strokeColor: "#ff00ff" });
            }}
          >
            setStyles
          </button>
          <button
            data-testid="ref-set-map-null"
            onClick={() => {
              ellipseRef.current?.setMap(null);
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
                ellipseRef.current?.setMap(map);
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
          <span data-testid="ref-clickable">{refClickable}</span>
          <span data-testid="ref-visible">{refVisible}</span>
          <span data-testid="ref-zindex">{refZIndex}</span>
          <span data-testid="ref-area-size">{refAreaSize}</span>
          <span data-testid="ref-map-bound">{refMapBound}</span>
          <span data-testid="ref-element-exists">{refElementExists}</span>
          <span data-testid="ref-drawing-rect-exists">{refDrawingRectExists}</span>
          <span data-testid="ref-options-exists">{refOptionsExists}</span>
          <span data-testid="ref-panes-exists">{refPanesExists}</span>
          <span data-testid="ref-projection-exists">{refProjectionExists}</span>
          <span data-testid="ref-fill-color">{refFillColor}</span>
          <span data-testid="ref-stroke-color">{refStrokeColor}</span>
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
            <Ellipse
              ref={ellipseRef}
              bounds={ELLIPSE_BOUNDS_1}
              visible={true}
              clickable={false}
              zIndex={1}
              fillColor="#2563eb"
              fillOpacity={0.25}
              strokeColor="#1d4ed8"
              strokeWeight={2}
              onMapChanged={() => setMapChangedCount((c) => c + 1)}
            />
          </NaverMap>
        </NaverMapProvider>
      }
    />
  );
}

/* ─── 5. multiple ─── */

interface EllipseItem {
  id: number;
  bounds: EllipseBoundsLiteral;
  visible: boolean;
  zIndex: number;
}

function MultiplePage() {
  const [mapReady, setMapReady] = useState(false);
  const [ellipseReadyCount, setEllipseReadyCount] = useState(0);
  const [ellipseDestroyCount, setEllipseDestroyCount] = useState(0);
  const [items, setItems] = useState<EllipseItem[]>([
    { id: 1, bounds: ELLIPSE_BOUNDS_1, visible: true, zIndex: 1 },
    { id: 2, bounds: ELLIPSE_BOUNDS_2, visible: true, zIndex: 2 },
    { id: 3, bounds: ELLIPSE_BOUNDS_3, visible: true, zIndex: 3 }
  ]);

  const firstVisible = items.find((item) => item.id === 1)?.visible ?? false;
  const secondZIndex = items.find((item) => item.id === 2)?.zIndex ?? 0;

  const addEllipse = useCallback(() => {
    setItems((prev) => {
      const id = prev.length + 1;
      return [...prev, { id, bounds: randomBounds(id), visible: true, zIndex: id }];
    });
  }, []);

  const removeLast = useCallback(() => {
    setItems((prev) => prev.slice(0, -1));
  }, []);

  const toggleFirstVisible = useCallback(() => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === 1 ? { ...item, visible: !item.visible } : item
      )
    );
  }, []);

  const setSecondZIndex = useCallback(() => {
    setItems((prev) => prev.map((item) => (item.id === 2 ? { ...item, zIndex: 555 } : item)));
  }, []);

  return (
    <ScenarioLayout
      buttons={
        <>
          <button data-testid="add-ellipse" onClick={addEllipse}>ellipse 추가</button>
          <button data-testid="remove-last-ellipse" onClick={removeLast}>마지막 제거</button>
          <button data-testid="toggle-first-visible" onClick={toggleFirstVisible}>첫 ellipse visible 토글</button>
          <button data-testid="set-second-zindex" onClick={setSecondZIndex}>둘째 zIndex 555</button>
        </>
      }
      logs={
        <>
          <span data-testid="map-ready">{String(mapReady)}</span>
          <span data-testid="ellipse-count">{items.length}</span>
          <span data-testid="ellipse-ready-count">{ellipseReadyCount}</span>
          <span data-testid="ellipse-destroy-count">{ellipseDestroyCount}</span>
          <span data-testid="first-visible">{String(firstVisible)}</span>
          <span data-testid="second-zindex">{secondZIndex}</span>
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
              <Ellipse
                key={item.id}
                bounds={item.bounds}
                visible={item.visible}
                zIndex={item.zIndex}
                clickable={true}
                fillColor="#2563eb"
                fillOpacity={0.2}
                strokeColor="#1d4ed8"
                strokeWeight={2}
                onEllipseReady={() => setEllipseReadyCount((c) => c + 1)}
                onEllipseDestroy={() => setEllipseDestroyCount((c) => c + 1)}
              />
            ))}
          </NaverMap>
        </NaverMapProvider>
      }
    />
  );
}

/* ─── routes ─── */

export const ellipseRoutes: Record<string, React.FC> = {
  "/ellipse/smoke": SmokePage,
  "/ellipse/bounds-options": BoundsOptionsPage,
  "/ellipse/events": EventsPage,
  "/ellipse/ref": RefPage,
  "/ellipse/multiple": MultiplePage
};
