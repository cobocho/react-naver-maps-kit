import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Polygon,
  NaverMap,
  NaverMapProvider,
  type PolygonRef,
  type NaverMapRef
} from "react-naver-maps-kit";

import {
  DEFAULT_CENTER,
  POLYGON_PATHS_1,
  POLYGON_PATHS_2,
  POLYGON_PATHS_3,
  NCP_KEY_ID
} from "../constants";

type LatLngLiteral = {
  lat: number;
  lng: number;
};

type PolygonPathLiteral = LatLngLiteral[];
type PolygonPathsLiteral = PolygonPathLiteral[];

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

function toLatLngLiteral(coord: unknown): LatLngLiteral | null {
  if (!coord || typeof coord !== "object") {
    return null;
  }

  const candidate = coord as {
    x?: unknown;
    y?: unknown;
    lat?: unknown;
    lng?: unknown;
  };

  if (typeof candidate.y === "number" && typeof candidate.x === "number") {
    return { lat: candidate.y, lng: candidate.x };
  }

  if (typeof candidate.lat === "number" && typeof candidate.lng === "number") {
    return { lat: candidate.lat, lng: candidate.lng };
  }

  if (typeof candidate.lat === "function" && typeof candidate.lng === "function") {
    const lat = Number((candidate.lat as () => number)());
    const lng = Number((candidate.lng as () => number)());

    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      return { lat, lng };
    }
  }

  return null;
}

function readCollection(collection: unknown): unknown[] {
  if (Array.isArray(collection)) {
    return collection;
  }

  if (!collection || typeof collection !== "object") {
    return [];
  }

  const kvoCollection = collection as {
    getLength?: () => number;
    getAt?: (index: number) => unknown;
  };

  if (typeof kvoCollection.getLength !== "function" || typeof kvoCollection.getAt !== "function") {
    return [];
  }

  const length = kvoCollection.getLength();
  const values: unknown[] = [];

  for (let index = 0; index < length; index += 1) {
    values.push(kvoCollection.getAt(index));
  }

  return values;
}

function toPathLiteral(collection: unknown[]): PolygonPathLiteral {
  return collection
    .map((point) => toLatLngLiteral(point))
    .filter((point): point is LatLngLiteral => point !== null);
}

function normalizePath(path: unknown): PolygonPathLiteral {
  return toPathLiteral(readCollection(path));
}

function normalizePaths(paths: unknown): PolygonPathsLiteral {
  const collection = readCollection(paths);

  if (collection.length === 0) {
    return [];
  }

  if (toLatLngLiteral(collection[0])) {
    return [toPathLiteral(collection)];
  }

  return collection
    .map((path) => normalizePath(path))
    .filter((path) => path.length > 0);
}

function toPathText(path: unknown): string {
  return JSON.stringify(normalizePath(path));
}

function toPathsText(paths: unknown): string {
  return JSON.stringify(normalizePaths(paths));
}

function randomPaths(seed: number): PolygonPathsLiteral {
  const lat = 37.5 + (seed % 7) * 0.005;
  const lng = 126.94 + (seed % 11) * 0.005;

  return [
    [
      { lat: lat + 0.022, lng: lng + 0.012 },
      { lat: lat + 0.032, lng: lng + 0.031 },
      { lat: lat + 0.016, lng: lng + 0.045 },
      { lat: lat + 0.003, lng: lng + 0.029 },
      { lat, lng: lng + 0.01 }
    ]
  ];
}

/* ─── 1. smoke ─── */

function SmokePage() {
  const mapRef = useRef<NaverMapRef>(null);
  const polygonRef = useRef<PolygonRef>(null);

  const [mapReady, setMapReady] = useState(false);
  const [polygonReadyCount, setPolygonReadyCount] = useState(0);
  const [polygonDestroyed, setPolygonDestroyed] = useState(false);
  const [showPolygon, setShowPolygon] = useState(true);
  const [mapBound, setMapBound] = useState("");
  const [mapEquals, setMapEquals] = useState("");

  const readBinding = useCallback(() => {
    const polygonMap = polygonRef.current?.getMap();
    const mapInstance = mapRef.current?.getInstance();

    setMapBound(String(Boolean(polygonMap)));
    setMapEquals(String(Boolean(polygonMap && mapInstance && polygonMap === mapInstance)));
  }, []);

  return (
    <ScenarioLayout
      buttons={
        <>
          <button data-testid="toggle-polygon" onClick={() => setShowPolygon((v) => !v)}>
            polygon 토글
          </button>
          <button data-testid="read-map-binding" onClick={readBinding}>
            바인딩 읽기
          </button>
        </>
      }
      logs={
        <>
          <span data-testid="map-ready">{String(mapReady)}</span>
          <span data-testid="polygon-ready-count">{polygonReadyCount}</span>
          <span data-testid="polygon-destroyed">{String(polygonDestroyed)}</span>
          <span data-testid="show-polygon">{String(showPolygon)}</span>
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
            {showPolygon && (
              <Polygon
                ref={polygonRef}
                paths={POLYGON_PATHS_1}
                fillColor="#2563eb"
                fillOpacity={0.25}
                strokeColor="#1d4ed8"
                strokeWeight={2}
                clickable={true}
                visible={true}
                onPolygonReady={() => setPolygonReadyCount((c) => c + 1)}
                onPolygonDestroy={() => setPolygonDestroyed(true)}
              />
            )}
          </NaverMap>
        </NaverMapProvider>
      }
    />
  );
}

/* ─── 2. paths/options ─── */

function PathsOptionsPage() {
  const polygonRef = useRef<PolygonRef>(null);

  const [mapReady, setMapReady] = useState(false);
  const [paths, setPaths] = useState<PolygonPathsLiteral>(POLYGON_PATHS_1);
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

  const [optPath, setOptPath] = useState("");
  const [optPaths, setOptPaths] = useState("");
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

  const [pathChangedCount, setPathChangedCount] = useState(0);
  const [pathsChangedCount, setPathsChangedCount] = useState(0);
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
    const styles = (polygonRef.current?.getStyles() ?? {}) as Record<string, unknown>;
    const strokeStyleValue = polygonRef.current?.getOptions("strokeStyle");
    const strokeLineCapValue = polygonRef.current?.getOptions("strokeLineCap");
    const strokeLineJoinValue = polygonRef.current?.getOptions("strokeLineJoin");

    setOptPath(toPathText(polygonRef.current?.getPath()));
    setOptPaths(toPathsText(polygonRef.current?.getPaths()));
    setOptVisible(String(polygonRef.current?.getVisible()));
    setOptClickable(String(polygonRef.current?.getClickable()));
    setOptZIndex(String(polygonRef.current?.getZIndex()));
    setOptAreaSize(String(polygonRef.current?.getAreaSize() ?? ""));
    setOptFillColor(String(styles.fillColor ?? ""));
    setOptFillOpacity(String(styles.fillOpacity ?? ""));
    setOptStrokeColor(String(styles.strokeColor ?? ""));
    setOptStrokeOpacity(String(styles.strokeOpacity ?? ""));
    setOptStrokeWeight(String(styles.strokeWeight ?? ""));
    setOptStrokeStyle(String(strokeStyleValue ?? styles.strokeStyle ?? ""));
    setOptStrokeLineCap(String(strokeLineCapValue ?? styles.strokeLineCap ?? ""));
    setOptStrokeLineJoin(String(strokeLineJoinValue ?? styles.strokeLineJoin ?? ""));
  }, []);

  const rapidPaths = useCallback(() => {
    setPaths(POLYGON_PATHS_1);
    setTimeout(() => setPaths(POLYGON_PATHS_2), 50);
    setTimeout(() => setPaths(POLYGON_PATHS_3), 100);
  }, []);

  const triggerChanged = useCallback((eventName: string, payload: unknown) => {
    const polygon = polygonRef.current?.getInstance();

    if (!polygon) {
      return;
    }

    naver.maps.Event.trigger(polygon, eventName, payload);
  }, []);

  useEffect(() => {
    const polygon = polygonRef.current?.getInstance();
    if (!polygon) return;

    naver.maps.Event.trigger(polygon, "path_changed", polygon.getPath());
    naver.maps.Event.trigger(polygon, "paths_changed", polygon.getPaths());
  }, [paths]);

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
          <button data-testid="set-paths-2" onClick={() => setPaths(POLYGON_PATHS_2)}>
            paths 2
          </button>
          <button data-testid="set-paths-3" onClick={() => setPaths(POLYGON_PATHS_3)}>
            paths 3
          </button>
          <button data-testid="rapid-paths" onClick={rapidPaths}>
            paths 연속 변경
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
          <span data-testid="opt-path">{optPath}</span>
          <span data-testid="opt-paths">{optPaths}</span>
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
          <span data-testid="evt-path-changed-count">{pathChangedCount}</span>
          <span data-testid="evt-paths-changed-count">{pathsChangedCount}</span>
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
            <Polygon
              ref={polygonRef}
              paths={paths}
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
              onPathChanged={() => setPathChangedCount((c) => c + 1)}
              onPathsChanged={() => setPathsChangedCount((c) => c + 1)}
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
  const polygonRef = useRef<PolygonRef>(null);

  const [mapReady, setMapReady] = useState(false);
  const [eventLog, setEventLog] = useState<string[]>([]);

  const log = useCallback((event: string) => {
    setEventLog((prev) => [...prev, event]);
  }, []);

  const triggerEvent = useCallback((eventName: string) => {
    const polygon = polygonRef.current?.getInstance();

    if (!polygon) {
      return;
    }

    if (eventName === "map_changed") {
      naver.maps.Event.trigger(polygon, eventName, polygon.getMap());
      return;
    }

    naver.maps.Event.trigger(polygon, eventName, {});
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
            <Polygon
              ref={polygonRef}
              paths={POLYGON_PATHS_1}
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
  const polygonRef = useRef<PolygonRef>(null);

  const [mapReady, setMapReady] = useState(false);
  const [mapChangedCount, setMapChangedCount] = useState(0);

  const [refPath, setRefPath] = useState("");
  const [refPaths, setRefPaths] = useState("");
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
    const styles = (polygonRef.current?.getStyles() ?? {}) as Record<string, unknown>;
    const drawingRect = polygonRef.current?.getDrawingRect();

    setRefPath(toPathText(polygonRef.current?.getPath()));
    setRefPaths(toPathsText(polygonRef.current?.getPaths()));
    setRefBounds(toBoundsText(polygonRef.current?.getBounds() as naver.maps.LatLngBounds | undefined));
    setRefClickable(String(polygonRef.current?.getClickable()));
    setRefVisible(String(polygonRef.current?.getVisible()));
    setRefZIndex(String(polygonRef.current?.getZIndex()));
    setRefAreaSize(String(polygonRef.current?.getAreaSize() ?? ""));
    setRefMapBound(String(Boolean(polygonRef.current?.getMap())));
    setRefElementExists(String(Boolean(polygonRef.current?.getElement())));
    setRefDrawingRectExists(String(Boolean(drawingRect)));
    setRefOptionsExists(String(Boolean(polygonRef.current?.getOptions())));
    setRefPanesExists(String(Boolean(polygonRef.current?.getPanes())));
    setRefProjectionExists(String(Boolean(polygonRef.current?.getProjection())));
    setRefFillColor(String(styles.fillColor ?? ""));
    setRefStrokeColor(String(styles.strokeColor ?? ""));
  }, []);

  const triggerMapChanged = useCallback(() => {
    const polygon = polygonRef.current?.getInstance();

    if (!polygon) {
      return;
    }

    naver.maps.Event.trigger(polygon, "map_changed", polygon.getMap());
  }, []);

  return (
    <ScenarioLayout
      buttons={
        <>
          <button
            data-testid="ref-set-path-2"
            onClick={() => polygonRef.current?.setPath(POLYGON_PATHS_2[0] as naver.maps.ArrayOfCoordsLiteral)}
          >
            setPath 2
          </button>
          <button
            data-testid="ref-set-paths-3"
            onClick={() => polygonRef.current?.setPaths(POLYGON_PATHS_3 as naver.maps.ArrayOfCoordsLiteral[])}
          >
            setPaths 3
          </button>
          <button data-testid="ref-set-clickable-true" onClick={() => polygonRef.current?.setClickable(true)}>
            clickable true
          </button>
          <button data-testid="ref-set-clickable-false" onClick={() => polygonRef.current?.setClickable(false)}>
            clickable false
          </button>
          <button data-testid="ref-set-visible-false" onClick={() => polygonRef.current?.setVisible(false)}>
            visible false
          </button>
          <button data-testid="ref-set-visible-true" onClick={() => polygonRef.current?.setVisible(true)}>
            visible true
          </button>
          <button data-testid="ref-set-zindex-555" onClick={() => polygonRef.current?.setZIndex(555)}>
            zIndex 555
          </button>
          <button
            data-testid="ref-set-options"
            onClick={() => {
              const optionSetter = polygonRef.current as PolygonRef & {
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
              const styleSetter = polygonRef.current as PolygonRef & {
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
              polygonRef.current?.setMap(null);
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
                polygonRef.current?.setMap(map);
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
          <span data-testid="ref-path">{refPath}</span>
          <span data-testid="ref-paths">{refPaths}</span>
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
            <Polygon
              ref={polygonRef}
              paths={POLYGON_PATHS_1}
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

interface PolygonItem {
  id: number;
  paths: PolygonPathsLiteral;
  visible: boolean;
  zIndex: number;
}

function MultiplePage() {
  const [mapReady, setMapReady] = useState(false);
  const [polygonReadyCount, setPolygonReadyCount] = useState(0);
  const [polygonDestroyCount, setPolygonDestroyCount] = useState(0);
  const [items, setItems] = useState<PolygonItem[]>([
    { id: 1, paths: POLYGON_PATHS_1, visible: true, zIndex: 1 },
    { id: 2, paths: POLYGON_PATHS_2, visible: true, zIndex: 2 },
    { id: 3, paths: POLYGON_PATHS_3, visible: true, zIndex: 3 }
  ]);

  const firstVisible = items.find((item) => item.id === 1)?.visible ?? false;
  const secondZIndex = items.find((item) => item.id === 2)?.zIndex ?? 0;

  const addPolygon = useCallback(() => {
    setItems((prev) => {
      const id = prev.length + 1;
      return [...prev, { id, paths: randomPaths(id), visible: true, zIndex: id }];
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
          <button data-testid="add-polygon" onClick={addPolygon}>polygon 추가</button>
          <button data-testid="remove-last-polygon" onClick={removeLast}>마지막 제거</button>
          <button data-testid="toggle-first-visible" onClick={toggleFirstVisible}>첫 polygon visible 토글</button>
          <button data-testid="set-second-zindex" onClick={setSecondZIndex}>둘째 zIndex 555</button>
        </>
      }
      logs={
        <>
          <span data-testid="map-ready">{String(mapReady)}</span>
          <span data-testid="polygon-count">{items.length}</span>
          <span data-testid="polygon-ready-count">{polygonReadyCount}</span>
          <span data-testid="polygon-destroy-count">{polygonDestroyCount}</span>
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
              <Polygon
                key={item.id}
                paths={item.paths}
                visible={item.visible}
                zIndex={item.zIndex}
                clickable={true}
                fillColor="#2563eb"
                fillOpacity={0.2}
                strokeColor="#1d4ed8"
                strokeWeight={2}
                onPolygonReady={() => setPolygonReadyCount((c) => c + 1)}
                onPolygonDestroy={() => setPolygonDestroyCount((c) => c + 1)}
              />
            ))}
          </NaverMap>
        </NaverMapProvider>
      }
    />
  );
}

/* ─── routes ─── */

export const polygonRoutes: Record<string, React.FC> = {
  "/polygon/smoke": SmokePage,
  "/polygon/paths-options": PathsOptionsPage,
  "/polygon/events": EventsPage,
  "/polygon/ref": RefPage,
  "/polygon/multiple": MultiplePage
};
