import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Circle,
  NaverMap,
  NaverMapProvider,
  type CircleRef,
  type NaverMapRef
} from "react-naver-maps-kit";

import {
  CIRCLE_CENTER_1,
  CIRCLE_CENTER_2,
  CIRCLE_CENTER_3,
  CIRCLE_RADIUS_1,
  CIRCLE_RADIUS_2,
  CIRCLE_RADIUS_3,
  DEFAULT_CENTER,
  NCP_KEY_ID
} from "../constants";

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

function toLatLngText(coord: naver.maps.Coord | undefined | null): string {
  if (!coord) {
    return "";
  }

  return JSON.stringify({ lat: coord.y, lng: coord.x });
}

function toBoundsText(bounds: naver.maps.LatLngBounds | undefined | null): string {
  if (!bounds) {
    return "";
  }

  const ne = bounds.getNE();
  const sw = bounds.getSW();

  return JSON.stringify({
    ne: { lat: ne.y, lng: ne.x },
    sw: { lat: sw.y, lng: sw.x }
  });
}

/* ─── 1. smoke ─── */

function SmokePage() {
  const mapRef = useRef<NaverMapRef>(null);
  const circleRef = useRef<CircleRef>(null);

  const [mapReady, setMapReady] = useState(false);
  const [circleReadyCount, setCircleReadyCount] = useState(0);
  const [destroyed, setDestroyed] = useState(false);
  const [showCircle, setShowCircle] = useState(true);
  const [zeroRadius, setZeroRadius] = useState(false);
  const [currentRadius, setCurrentRadius] = useState("");
  const [mapBound, setMapBound] = useState("");
  const [mapEquals, setMapEquals] = useState("");

  const readBinding = useCallback(() => {
    const radius = circleRef.current?.getRadius();
    const circleMap = circleRef.current?.getMap();
    const mapInstance = mapRef.current?.getInstance();

    setCurrentRadius(String(radius));
    setMapBound(String(Boolean(circleMap)));
    setMapEquals(String(Boolean(circleMap && mapInstance && circleMap === mapInstance)));
  }, []);

  return (
    <ScenarioLayout
      buttons={
        <>
          <button data-testid="toggle-circle" onClick={() => setShowCircle((v) => !v)}>
            circle 토글
          </button>
          <button data-testid="toggle-zero-radius" onClick={() => setZeroRadius((v) => !v)}>
            radius 0 토글
          </button>
          <button data-testid="read-map-binding" onClick={readBinding}>
            바인딩 읽기
          </button>
        </>
      }
      logs={
        <>
          <span data-testid="map-ready">{String(mapReady)}</span>
          <span data-testid="circle-ready-count">{circleReadyCount}</span>
          <span data-testid="circle-destroyed">{String(destroyed)}</span>
          <span data-testid="show-circle">{String(showCircle)}</span>
          <span data-testid="current-radius">{currentRadius}</span>
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
            {showCircle && (
              <Circle
                ref={circleRef}
                center={CIRCLE_CENTER_1}
                radius={zeroRadius ? 0 : CIRCLE_RADIUS_1}
                clickable={true}
                fillColor="#4285F4"
                fillOpacity={0.25}
                strokeColor="#4285F4"
                strokeWeight={2}
                onCircleReady={() => setCircleReadyCount((c) => c + 1)}
                onCircleDestroy={() => setDestroyed(true)}
              />
            )}
          </NaverMap>
        </NaverMapProvider>
      }
    />
  );
}

/* ─── 2. center/radius ─── */

function CenterRadiusPage() {
  const circleRef = useRef<CircleRef>(null);

  const [mapReady, setMapReady] = useState(false);
  const [center, setCenter] = useState(CIRCLE_CENTER_1);
  const [radius, setRadius] = useState(CIRCLE_RADIUS_1);
  const [circleCenter, setCircleCenter] = useState("");
  const [circleRadius, setCircleRadius] = useState("");
  const [centerChangedCount, setCenterChangedCount] = useState(0);
  const [radiusChangedCount, setRadiusChangedCount] = useState(0);

  const readState = useCallback(() => {
    setCircleCenter(toLatLngText(circleRef.current?.getCenter()));
    setCircleRadius(String(circleRef.current?.getRadius() ?? ""));
  }, []);

  const rapidCenter = useCallback(() => {
    setCenter(CIRCLE_CENTER_1);
    setTimeout(() => setCenter(CIRCLE_CENTER_2), 50);
    setTimeout(() => setCenter(CIRCLE_CENTER_3), 100);
  }, []);

  const rapidRadius = useCallback(() => {
    setRadius(CIRCLE_RADIUS_1);
    setTimeout(() => setRadius(CIRCLE_RADIUS_2), 50);
    setTimeout(() => setRadius(CIRCLE_RADIUS_3), 100);
  }, []);

  useEffect(() => {
    const circle = circleRef.current?.getInstance();

    if (!circle) {
      return;
    }

    naver.maps.Event.trigger(circle, "center_changed", circle.getCenter());
  }, [center]);

  useEffect(() => {
    const circle = circleRef.current?.getInstance();

    if (!circle) {
      return;
    }

    naver.maps.Event.trigger(circle, "radius_changed", circle.getRadius());
  }, [radius]);

  return (
    <ScenarioLayout
      buttons={
        <>
          <button data-testid="set-center-2" onClick={() => setCenter(CIRCLE_CENTER_2)}>
            center 2
          </button>
          <button data-testid="set-center-3" onClick={() => setCenter(CIRCLE_CENTER_3)}>
            center 3
          </button>
          <button data-testid="set-radius-1000" onClick={() => setRadius(CIRCLE_RADIUS_2)}>
            radius 1000
          </button>
          <button data-testid="set-radius-2000" onClick={() => setRadius(CIRCLE_RADIUS_3)}>
            radius 2000
          </button>
          <button data-testid="rapid-center" onClick={rapidCenter}>
            center 연속 변경
          </button>
          <button data-testid="rapid-radius" onClick={rapidRadius}>
            radius 연속 변경
          </button>
          <button data-testid="read-state" onClick={readState}>
            상태 읽기
          </button>
        </>
      }
      logs={
        <>
          <span data-testid="map-ready">{String(mapReady)}</span>
          <span data-testid="state-center">{JSON.stringify(center)}</span>
          <span data-testid="state-radius">{radius}</span>
          <span data-testid="circle-center">{circleCenter}</span>
          <span data-testid="circle-radius">{circleRadius}</span>
          <span data-testid="center-changed-count">{centerChangedCount}</span>
          <span data-testid="radius-changed-count">{radiusChangedCount}</span>
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
            <Circle
              ref={circleRef}
              center={center}
              radius={radius}
              fillColor="#4285F4"
              fillOpacity={0.25}
              strokeColor="#4285F4"
              strokeWeight={2}
              onCenterChanged={() => setCenterChangedCount((c) => c + 1)}
              onRadiusChanged={() => setRadiusChangedCount((c) => c + 1)}
            />
          </NaverMap>
        </NaverMapProvider>
      }
    />
  );
}

/* ─── 3. styles ─── */

function StylesPage() {
  const circleRef = useRef<CircleRef>(null);

  const [mapReady, setMapReady] = useState(false);
  const [visible, setVisible] = useState(true);
  const [fillColor, setFillColor] = useState("#4285F4");
  const [strokeColor, setStrokeColor] = useState("#4285F4");
  const [strokeWeight, setStrokeWeight] = useState(2);
  const [fillOpacity, setFillOpacity] = useState(0.25);
  const [clickable, setClickable] = useState(true);
  const [zIndex, setZIndex] = useState(1);

  const [optVisible, setOptVisible] = useState("");
  const [optFillColor, setOptFillColor] = useState("");
  const [optStrokeColor, setOptStrokeColor] = useState("");
  const [optStrokeWeight, setOptStrokeWeight] = useState("");
  const [optFillOpacity, setOptFillOpacity] = useState("");
  const [optClickable, setOptClickable] = useState("");
  const [optZIndex, setOptZIndex] = useState("");

  const [visibleChangedCount, setVisibleChangedCount] = useState(0);
  const [fillColorChangedCount, setFillColorChangedCount] = useState(0);
  const [zIndexChangedCount, setZIndexChangedCount] = useState(0);

  const readStyles = useCallback(() => {
    const styles = (circleRef.current?.getStyles() ?? {}) as Record<string, unknown>;

    setOptVisible(String(circleRef.current?.getVisible()));
    setOptClickable(String(circleRef.current?.getClickable()));
    setOptZIndex(String(circleRef.current?.getZIndex()));
    setOptFillColor(String(styles.fillColor ?? ""));
    setOptStrokeColor(String(styles.strokeColor ?? ""));
    setOptStrokeWeight(String(styles.strokeWeight ?? ""));
    setOptFillOpacity(String(styles.fillOpacity ?? ""));
  }, []);

  useEffect(() => {
    const circle = circleRef.current?.getInstance();

    if (!circle) {
      return;
    }

    naver.maps.Event.trigger(circle, "visible_changed", circle.getVisible());
  }, [visible]);

  useEffect(() => {
    const circle = circleRef.current?.getInstance();

    if (!circle) {
      return;
    }

    naver.maps.Event.trigger(circle, "fillColor_changed", circle.getStyles().fillColor);
  }, [fillColor]);

  useEffect(() => {
    const circle = circleRef.current?.getInstance();

    if (!circle) {
      return;
    }

    naver.maps.Event.trigger(circle, "zIndex_changed", circle.getZIndex());
  }, [zIndex]);

  return (
    <ScenarioLayout
      buttons={
        <>
          <button data-testid="toggle-visible" onClick={() => setVisible((v) => !v)}>
            visible 토글
          </button>
          <button data-testid="set-fill-red" onClick={() => setFillColor("#ff0000")}>
            fill red
          </button>
          <button data-testid="set-stroke-green" onClick={() => setStrokeColor("#00aa00")}>
            stroke green
          </button>
          <button data-testid="set-stroke-weight-5" onClick={() => setStrokeWeight(5)}>
            strokeWeight 5
          </button>
          <button data-testid="set-fill-opacity-08" onClick={() => setFillOpacity(0.8)}>
            fillOpacity 0.8
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
          <button data-testid="read-styles" onClick={readStyles}>
            스타일 읽기
          </button>
        </>
      }
      logs={
        <>
          <span data-testid="map-ready">{String(mapReady)}</span>
          <span data-testid="opt-visible">{optVisible}</span>
          <span data-testid="opt-fill-color">{optFillColor}</span>
          <span data-testid="opt-stroke-color">{optStrokeColor}</span>
          <span data-testid="opt-stroke-weight">{optStrokeWeight}</span>
          <span data-testid="opt-fill-opacity">{optFillOpacity}</span>
          <span data-testid="opt-clickable">{optClickable}</span>
          <span data-testid="opt-zindex">{optZIndex}</span>
          <span data-testid="visible-changed-count">{visibleChangedCount}</span>
          <span data-testid="fill-color-changed-count">{fillColorChangedCount}</span>
          <span data-testid="zindex-changed-count">{zIndexChangedCount}</span>
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
            <Circle
              ref={circleRef}
              center={CIRCLE_CENTER_1}
              radius={CIRCLE_RADIUS_1}
              visible={visible}
              fillColor={fillColor}
              strokeColor={strokeColor}
              strokeWeight={strokeWeight}
              fillOpacity={fillOpacity}
              clickable={clickable}
              zIndex={zIndex}
              onVisibleChanged={() => setVisibleChangedCount((c) => c + 1)}
              onFillColorChanged={() => setFillColorChangedCount((c) => c + 1)}
              onZIndexChanged={() => setZIndexChangedCount((c) => c + 1)}
            />
          </NaverMap>
        </NaverMapProvider>
      }
    />
  );
}

/* ─── 4. events ─── */

function EventsPage() {
  const circleRef = useRef<CircleRef>(null);

  const [mapReady, setMapReady] = useState(false);
  const [center, setCenter] = useState(CIRCLE_CENTER_1);
  const [radius, setRadius] = useState(CIRCLE_RADIUS_1);
  const [visible, setVisible] = useState(true);
  const [zIndex, setZIndex] = useState(1);
  const [eventLog, setEventLog] = useState<string[]>([]);

  const log = useCallback((event: string) => {
    setEventLog((prev) => [...prev, event]);
  }, []);

  const triggerPointer = useCallback((eventName: string) => {
    const circle = circleRef.current?.getInstance();

    if (!circle) {
      return;
    }

    naver.maps.Event.trigger(circle, eventName, {});
  }, []);

  useEffect(() => {
    const circle = circleRef.current?.getInstance();

    if (!circle) {
      return;
    }

    naver.maps.Event.trigger(circle, "center_changed", circle.getCenter());
  }, [center]);

  useEffect(() => {
    const circle = circleRef.current?.getInstance();

    if (!circle) {
      return;
    }

    naver.maps.Event.trigger(circle, "radius_changed", circle.getRadius());
  }, [radius]);

  useEffect(() => {
    const circle = circleRef.current?.getInstance();

    if (!circle) {
      return;
    }

    naver.maps.Event.trigger(circle, "visible_changed", circle.getVisible());
  }, [visible]);

  useEffect(() => {
    const circle = circleRef.current?.getInstance();

    if (!circle) {
      return;
    }

    naver.maps.Event.trigger(circle, "zIndex_changed", circle.getZIndex());
  }, [zIndex]);

  return (
    <ScenarioLayout
      buttons={
        <>
          <button data-testid="trigger-click" onClick={() => triggerPointer("click")}>click</button>
          <button data-testid="trigger-dblclick" onClick={() => triggerPointer("dblclick")}>dblclick</button>
          <button data-testid="trigger-rightclick" onClick={() => triggerPointer("rightclick")}>rightclick</button>
          <button data-testid="trigger-mouseover" onClick={() => triggerPointer("mouseover")}>mouseover</button>
          <button data-testid="trigger-mouseout" onClick={() => triggerPointer("mouseout")}>mouseout</button>
          <button data-testid="trigger-mousedown" onClick={() => triggerPointer("mousedown")}>mousedown</button>
          <button data-testid="trigger-mouseup" onClick={() => triggerPointer("mouseup")}>mouseup</button>
          <button data-testid="change-center" onClick={() => setCenter(CIRCLE_CENTER_2)}>center 변경</button>
          <button data-testid="change-radius" onClick={() => setRadius(CIRCLE_RADIUS_2)}>radius 변경</button>
          <button data-testid="toggle-visible" onClick={() => setVisible((v) => !v)}>visible 토글</button>
          <button data-testid="change-zindex" onClick={() => setZIndex((z) => z + 1)}>zIndex 변경</button>
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
            <Circle
              ref={circleRef}
              center={center}
              radius={radius}
              visible={visible}
              zIndex={zIndex}
              clickable={true}
              fillColor="#4285F4"
              fillOpacity={0.25}
              strokeColor="#4285F4"
              strokeWeight={2}
              onClick={() => log("click")}
              onDblClick={() => log("dblclick")}
              onRightClick={() => log("rightclick")}
              onMouseOver={() => log("mouseover")}
              onMouseOut={() => log("mouseout")}
              onMouseDown={() => log("mousedown")}
              onMouseUp={() => log("mouseup")}
              onCenterChanged={() => log("centerchanged")}
              onRadiusChanged={() => log("radiuschanged")}
              onVisibleChanged={() => log("visiblechanged")}
              onZIndexChanged={() => log("zindexchanged")}
            />
          </NaverMap>
        </NaverMapProvider>
      }
    />
  );
}

/* ─── 5. ref ─── */

function RefPage() {
  const circleRef = useRef<CircleRef>(null);

  const [mapReady, setMapReady] = useState(false);

  const [refCenter, setRefCenter] = useState("");
  const [refRadius, setRefRadius] = useState("");
  const [refVisible, setRefVisible] = useState("");
  const [refZIndex, setRefZIndex] = useState("");
  const [refClickable, setRefClickable] = useState("");
  const [refAreaSize, setRefAreaSize] = useState("");
  const [refBounds, setRefBounds] = useState("");
  const [refElementExists, setRefElementExists] = useState("");
  const [refFillColor, setRefFillColor] = useState("");

  const readState = useCallback(() => {
    const center = circleRef.current?.getCenter();
    const radius = circleRef.current?.getRadius();
    const visible = circleRef.current?.getVisible();
    const zIndex = circleRef.current?.getZIndex();
    const clickable = circleRef.current?.getClickable();
    const areaSize = circleRef.current?.getAreaSize();
    const bounds = circleRef.current?.getBounds();
    const element = circleRef.current?.getElement();
    const styles = (circleRef.current?.getStyles() ?? {}) as Record<string, unknown>;

    setRefCenter(toLatLngText(center));
    setRefRadius(String(radius));
    setRefVisible(String(visible));
    setRefZIndex(String(zIndex));
    setRefClickable(String(clickable));
    setRefAreaSize(String(areaSize));
    setRefBounds(toBoundsText(bounds as naver.maps.LatLngBounds | undefined));
    setRefElementExists(String(Boolean(element)));
    setRefFillColor(String(styles.fillColor ?? ""));
  }, []);

  return (
    <ScenarioLayout
      buttons={
        <>
          <button data-testid="ref-set-center-2" onClick={() => circleRef.current?.setCenter(CIRCLE_CENTER_2)}>
            setCenter 2
          </button>
          <button data-testid="ref-set-radius-2000" onClick={() => circleRef.current?.setRadius(CIRCLE_RADIUS_3)}>
            setRadius 2000
          </button>
          <button data-testid="ref-set-visible-false" onClick={() => circleRef.current?.setVisible(false)}>
            visible false
          </button>
          <button data-testid="ref-set-visible-true" onClick={() => circleRef.current?.setVisible(true)}>
            visible true
          </button>
          <button data-testid="ref-set-zindex-555" onClick={() => circleRef.current?.setZIndex(555)}>
            zIndex 555
          </button>
          <button data-testid="ref-set-clickable-true" onClick={() => circleRef.current?.setClickable(true)}>
            clickable true
          </button>
          <button
            data-testid="ref-set-styles"
            onClick={() => {
              const circle = circleRef.current?.getInstance() as
                | (naver.maps.Circle & {
                    setStyles: (styles: { fillColor?: string; strokeColor?: string }) => void;
                  })
                | undefined;

              circle?.setStyles({ fillColor: "#ff00ff", strokeColor: "#ff00ff" });
            }}
          >
            setStyles
          </button>
          <button
            data-testid="ref-set-options"
            onClick={() =>
              circleRef.current?.setOptions({
                center: CIRCLE_CENTER_1,
                radius: CIRCLE_RADIUS_2,
                zIndex: 777
              })
            }
          >
            setOptions
          </button>
          <button data-testid="ref-read-state" onClick={readState}>
            상태 읽기
          </button>
        </>
      }
      logs={
        <>
          <span data-testid="map-ready">{String(mapReady)}</span>
          <span data-testid="ref-center">{refCenter}</span>
          <span data-testid="ref-radius">{refRadius}</span>
          <span data-testid="ref-visible">{refVisible}</span>
          <span data-testid="ref-zindex">{refZIndex}</span>
          <span data-testid="ref-clickable">{refClickable}</span>
          <span data-testid="ref-area-size">{refAreaSize}</span>
          <span data-testid="ref-bounds">{refBounds}</span>
          <span data-testid="ref-element-exists">{refElementExists}</span>
          <span data-testid="ref-fill-color">{refFillColor}</span>
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
            <Circle
              ref={circleRef}
              center={CIRCLE_CENTER_1}
              radius={CIRCLE_RADIUS_1}
              visible={true}
              zIndex={1}
              clickable={false}
              fillColor="#4285F4"
              fillOpacity={0.25}
              strokeColor="#4285F4"
              strokeWeight={2}
            />
          </NaverMap>
        </NaverMapProvider>
      }
    />
  );
}

/* ─── 6. multiple ─── */

interface CircleItem {
  id: number;
  center: { lat: number; lng: number };
  radius: number;
  visible: boolean;
  zIndex: number;
}

function MultiplePage() {
  const [mapReady, setMapReady] = useState(false);
  const [circleReadyCount, setCircleReadyCount] = useState(0);
  const [circleDestroyCount, setCircleDestroyCount] = useState(0);
  const [circles, setCircles] = useState<CircleItem[]>([
    { id: 1, center: CIRCLE_CENTER_1, radius: CIRCLE_RADIUS_1, visible: true, zIndex: 1 },
    { id: 2, center: CIRCLE_CENTER_2, radius: CIRCLE_RADIUS_2, visible: true, zIndex: 2 },
    { id: 3, center: CIRCLE_CENTER_3, radius: CIRCLE_RADIUS_1, visible: true, zIndex: 3 }
  ]);

  const firstVisible = circles.find((circle) => circle.id === 1)?.visible ?? false;
  const secondZIndex = circles.find((circle) => circle.id === 2)?.zIndex ?? 0;

  const addCircle = useCallback(() => {
    setCircles((prev) => {
      const id = prev.length + 1;
      return [
        ...prev,
        {
          id,
          center: { lat: 37.51 + Math.random() * 0.1, lng: 126.95 + Math.random() * 0.1 },
          radius: CIRCLE_RADIUS_1,
          visible: true,
          zIndex: id
        }
      ];
    });
  }, []);

  const removeLast = useCallback(() => {
    setCircles((prev) => prev.slice(0, -1));
  }, []);

  const toggleFirstVisible = useCallback(() => {
    setCircles((prev) =>
      prev.map((circle) =>
        circle.id === 1 ? { ...circle, visible: !circle.visible } : circle
      )
    );
  }, []);

  const setSecondZIndex = useCallback(() => {
    setCircles((prev) =>
      prev.map((circle) => (circle.id === 2 ? { ...circle, zIndex: 555 } : circle))
    );
  }, []);

  return (
    <ScenarioLayout
      buttons={
        <>
          <button data-testid="add-circle" onClick={addCircle}>circle 추가</button>
          <button data-testid="remove-last-circle" onClick={removeLast}>마지막 제거</button>
          <button data-testid="toggle-first-visible" onClick={toggleFirstVisible}>첫 circle visible 토글</button>
          <button data-testid="set-second-zindex" onClick={setSecondZIndex}>둘째 zIndex 555</button>
        </>
      }
      logs={
        <>
          <span data-testid="map-ready">{String(mapReady)}</span>
          <span data-testid="circle-count">{circles.length}</span>
          <span data-testid="circle-ready-count">{circleReadyCount}</span>
          <span data-testid="circle-destroy-count">{circleDestroyCount}</span>
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
            {circles.map((circle) => (
              <Circle
                key={circle.id}
                center={circle.center}
                radius={circle.radius}
                visible={circle.visible}
                zIndex={circle.zIndex}
                fillColor="#4285F4"
                fillOpacity={0.2}
                strokeColor="#4285F4"
                strokeWeight={2}
                onCircleReady={() => setCircleReadyCount((c) => c + 1)}
                onCircleDestroy={() => setCircleDestroyCount((c) => c + 1)}
              />
            ))}
          </NaverMap>
        </NaverMapProvider>
      }
    />
  );
}

/* ─── 라우트 export ─── */

export const circleRoutes: Record<string, React.FC> = {
  "/circle/smoke": SmokePage,
  "/circle/center-radius": CenterRadiusPage,
  "/circle/styles": StylesPage,
  "/circle/events": EventsPage,
  "/circle/ref": RefPage,
  "/circle/multiple": MultiplePage
};
