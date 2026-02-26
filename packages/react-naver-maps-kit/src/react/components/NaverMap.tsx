import {
  forwardRef,
  memo,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from "react";

import { MapInstanceContext, type MapInstanceContextValue } from "../context/MapInstanceContext";
import { NaverMapContext } from "../provider/NaverMapProvider";

import type { ComponentPropsWithoutRef, ReactNode } from "react";

type MapOptions = naver.maps.MapOptions;

interface NaverMapOptionProps {
  background?: MapOptions["background"];
  baseTileOpacity?: MapOptions["baseTileOpacity"];
  bounds?: MapOptions["bounds"];
  center?: MapOptions["center"];
  defaultCenter?: MapOptions["center"];
  zoom?: MapOptions["zoom"];
  defaultZoom?: MapOptions["zoom"];
  disableDoubleClickZoom?: MapOptions["disableDoubleClickZoom"];
  disableDoubleTapZoom?: MapOptions["disableDoubleTapZoom"];
  disableKineticPan?: MapOptions["disableKineticPan"];
  disableTwoFingerTapZoom?: MapOptions["disableTwoFingerTapZoom"];
  draggable?: MapOptions["draggable"];
  keyboardShortcuts?: MapOptions["keyboardShortcuts"];
  logoControl?: MapOptions["logoControl"];
  logoControlOptions?: MapOptions["logoControlOptions"];
  mapDataControl?: MapOptions["mapDataControl"];
  mapDataControlOptions?: MapOptions["mapDataControlOptions"];
  mapTypeControl?: MapOptions["mapTypeControl"];
  mapTypeControlOptions?: MapOptions["mapTypeControlOptions"];
  mapTypeId?: MapOptions["mapTypeId"];
  mapTypes?: MapOptions["mapTypes"];
  maxBounds?: MapOptions["maxBounds"];
  maxZoom?: MapOptions["maxZoom"];
  minZoom?: MapOptions["minZoom"];
  padding?: MapOptions["padding"];
  pinchZoom?: MapOptions["pinchZoom"];
  resizeOrigin?: MapOptions["resizeOrigin"];
  scaleControl?: MapOptions["scaleControl"];
  scaleControlOptions?: MapOptions["scaleControlOptions"];
  scrollWheel?: MapOptions["scrollWheel"];
  size?: MapOptions["size"];
  overlayZoomEffect?: MapOptions["overlayZoomEffect"];
  tileSpare?: MapOptions["tileSpare"];
  tileTransition?: MapOptions["tileTransition"];
  tileDuration?: MapOptions["tileDuration"];
  zoomControl?: MapOptions["zoomControl"];
  zoomControlOptions?: MapOptions["zoomControlOptions"];
  zoomOrigin?: MapOptions["zoomOrigin"];
  blankTileImage?: MapOptions["blankTileImage"];
  gl?: MapOptions["gl"];
  customStyleId?: MapOptions["customStyleId"];
}

interface NaverMapLifecycleProps {
  children?: ReactNode;
  onMapReady?: (map: naver.maps.Map) => void;
  onMapDestroy?: () => void;
  onMapError?: (error: Error) => void;
  retryOnError?: boolean;
  retryDelayMs?: number;
  fallback?: ReactNode;
}

interface NaverMapEventProps {
  onAddLayer?: (layer: naver.maps.Layer) => void;
  onBoundsChanged?: (bounds: naver.maps.Bounds) => void;
  onCenterChanged?: (center: naver.maps.Coord) => void;
  onCenterPointChanged?: (centerPoint: naver.maps.Point) => void;
  onClick?: (pointerEvent: naver.maps.PointerEvent) => void;
  onDblClick?: (pointerEvent: naver.maps.PointerEvent) => void;
  onDoubleTap?: (pointerEvent: naver.maps.PointerEvent) => void;
  onDrag?: (pointerEvent: naver.maps.PointerEvent) => void;
  onDragEnd?: (pointerEvent: naver.maps.PointerEvent) => void;
  onDragStart?: (pointerEvent: naver.maps.PointerEvent) => void;
  onIdle?: () => void;
  onInit?: () => void;
  onKeyDown?: (keyboardEvent: KeyboardEvent) => void;
  onKeyUp?: (keyboardEvent: KeyboardEvent) => void;
  onLongTap?: (pointerEvent: naver.maps.PointerEvent) => void;
  onMapTypeChanged?: (mapType: naver.maps.MapType) => void;
  onMapTypeIdChanged?: (mapTypeId: string) => void;
  onMouseDown?: (pointerEvent: naver.maps.PointerEvent) => void;
  onMouseMove?: (pointerEvent: naver.maps.PointerEvent) => void;
  onMouseOut?: (pointerEvent: naver.maps.PointerEvent) => void;
  onMouseOver?: (pointerEvent: naver.maps.PointerEvent) => void;
  onMouseUp?: (pointerEvent: naver.maps.PointerEvent) => void;
  onPanning?: () => void;
  onPinch?: (pointerEvent: naver.maps.PointerEvent) => void;
  onPinchEnd?: (pointerEvent: naver.maps.PointerEvent) => void;
  onPinchStart?: (pointerEvent: naver.maps.PointerEvent) => void;
  onProjectionChanged?: (projection: naver.maps.Projection) => void;
  onRemoveLayer?: (layerName: string) => void;
  onResize?: () => void;
  onRightClick?: (pointerEvent: naver.maps.PointerEvent) => void;
  onSingleTap?: (pointerEvent: naver.maps.PointerEvent) => void;
  onTouchEnd?: (pointerEvent: naver.maps.PointerEvent) => void;
  onTouchMove?: (pointerEvent: naver.maps.PointerEvent) => void;
  onTouchStart?: (pointerEvent: naver.maps.PointerEvent) => void;
  onTwoFingerTap?: (pointerEvent: naver.maps.PointerEvent) => void;
  onWheel?: (pointerEvent: naver.maps.PointerEvent) => void;
  onZoomChanged?: (zoom: number) => void;
  onZooming?: () => void;
  onZoomStart?: () => void;
}

type NaverMapDivProps = Omit<ComponentPropsWithoutRef<"div">, "draggable">;

export type NaverMapProps = NaverMapOptionProps &
  NaverMapLifecycleProps &
  NaverMapEventProps &
  NaverMapDivProps;

type NaverMapMethod<K extends keyof naver.maps.Map> = naver.maps.Map[K] extends (
  ...args: infer A
) => infer R
  ? (...args: A) => R | undefined
  : never;

export interface NaverMapRef {
  getInstance: () => naver.maps.Map | null;
  addOverlayPane: (name: string, elementOrZIndex: HTMLElement | number) => void;
  addPane: NaverMapMethod<"addPane">;
  autoResize: NaverMapMethod<"autoResize">;
  destroy: NaverMapMethod<"destroy">;
  fitBounds: NaverMapMethod<"fitBounds">;
  getBounds: NaverMapMethod<"getBounds">;
  getCenter: NaverMapMethod<"getCenter">;
  getCenterPoint: NaverMapMethod<"getCenterPoint">;
  getElement: NaverMapMethod<"getElement">;
  getMapTypeId: NaverMapMethod<"getMapTypeId">;
  getMaxZoom: NaverMapMethod<"getMaxZoom">;
  getMinZoom: NaverMapMethod<"getMinZoom">;
  getOptions: NaverMapMethod<"getOptions">;
  getPanes: NaverMapMethod<"getPanes">;
  getPrimitiveProjection: NaverMapMethod<"getPrimitiveProjection">;
  getProjection: NaverMapMethod<"getProjection">;
  getSize: NaverMapMethod<"getSize">;
  getZoom: NaverMapMethod<"getZoom">;
  morph: NaverMapMethod<"morph">;
  panBy: NaverMapMethod<"panBy">;
  panTo: NaverMapMethod<"panTo">;
  panToBounds: NaverMapMethod<"panToBounds">;
  refresh: NaverMapMethod<"refresh">;
  removeOverlayPane: (name: string) => void;
  removePane: NaverMapMethod<"removePane">;
  setCenter: NaverMapMethod<"setCenter">;
  setCenterPoint: NaverMapMethod<"setCenterPoint">;
  setMapTypeId: NaverMapMethod<"setMapTypeId">;
  setOptions: NaverMapMethod<"setOptions">;
  setSize: NaverMapMethod<"setSize">;
  setZoom: NaverMapMethod<"setZoom">;
  stop: NaverMapMethod<"stop">;
  updateBy: NaverMapMethod<"updateBy">;
  zoomBy: NaverMapMethod<"zoomBy">;
}

/* ─── 상수 ─── */

const MAP_OPTION_KEYS = [
  "background",
  "baseTileOpacity",
  "bounds",
  "center",
  "zoom",
  "disableDoubleClickZoom",
  "disableDoubleTapZoom",
  "disableKineticPan",
  "disableTwoFingerTapZoom",
  "draggable",
  "keyboardShortcuts",
  "logoControl",
  "logoControlOptions",
  "mapDataControl",
  "mapDataControlOptions",
  "mapTypeControl",
  "mapTypeControlOptions",
  "mapTypeId",
  "mapTypes",
  "maxBounds",
  "maxZoom",
  "minZoom",
  "padding",
  "pinchZoom",
  "resizeOrigin",
  "scaleControl",
  "scaleControlOptions",
  "scrollWheel",
  "size",
  "overlayZoomEffect",
  "tileSpare",
  "tileTransition",
  "tileDuration",
  "zoomControl",
  "zoomControlOptions",
  "zoomOrigin",
  "blankTileImage",
  "gl",
  "customStyleId"
] as const satisfies readonly (keyof NaverMapOptionProps)[];

const MAP_OPTION_KEY_SET = new Set<string>(MAP_OPTION_KEYS as readonly string[]);

const MAP_EVENT_PROP_KEYS = [
  "onAddLayer",
  "onBoundsChanged",
  "onCenterChanged",
  "onCenterPointChanged",
  "onClick",
  "onDblClick",
  "onDoubleTap",
  "onDrag",
  "onDragEnd",
  "onDragStart",
  "onIdle",
  "onInit",
  "onKeyDown",
  "onKeyUp",
  "onLongTap",
  "onMapTypeChanged",
  "onMapTypeIdChanged",
  "onMouseDown",
  "onMouseMove",
  "onMouseOut",
  "onMouseOver",
  "onMouseUp",
  "onPanning",
  "onPinch",
  "onPinchEnd",
  "onPinchStart",
  "onProjectionChanged",
  "onRemoveLayer",
  "onResize",
  "onRightClick",
  "onSingleTap",
  "onTouchEnd",
  "onTouchMove",
  "onTouchStart",
  "onTwoFingerTap",
  "onWheel",
  "onZoomChanged",
  "onZooming",
  "onZoomStart"
] as const satisfies readonly (keyof NaverMapEventProps)[];

const MAP_EVENT_PROP_KEY_SET = new Set<string>(MAP_EVENT_PROP_KEYS as readonly string[]);

type MapEventBinding = {
  prop: keyof NaverMapEventProps;
  eventName: string;
  hasPayload: boolean;
};

const MAP_EVENT_BINDINGS: readonly MapEventBinding[] = [
  { prop: "onAddLayer", eventName: "addLayer", hasPayload: true },
  { prop: "onBoundsChanged", eventName: "bounds_changed", hasPayload: true },
  { prop: "onCenterChanged", eventName: "center_changed", hasPayload: true },
  { prop: "onCenterPointChanged", eventName: "centerPoint_changed", hasPayload: true },
  { prop: "onClick", eventName: "click", hasPayload: true },
  { prop: "onDblClick", eventName: "dblclick", hasPayload: true },
  { prop: "onDoubleTap", eventName: "doubletap", hasPayload: true },
  { prop: "onDrag", eventName: "drag", hasPayload: true },
  { prop: "onDragEnd", eventName: "dragend", hasPayload: true },
  { prop: "onDragStart", eventName: "dragstart", hasPayload: true },
  { prop: "onIdle", eventName: "idle", hasPayload: false },
  { prop: "onInit", eventName: "init", hasPayload: false },
  { prop: "onKeyDown", eventName: "keydown", hasPayload: true },
  { prop: "onKeyUp", eventName: "keyup", hasPayload: true },
  { prop: "onLongTap", eventName: "longtap", hasPayload: true },
  { prop: "onMapTypeChanged", eventName: "mapType_changed", hasPayload: true },
  { prop: "onMapTypeIdChanged", eventName: "mapTypeId_changed", hasPayload: true },
  { prop: "onMouseDown", eventName: "mousedown", hasPayload: true },
  { prop: "onMouseMove", eventName: "mousemove", hasPayload: true },
  { prop: "onMouseOut", eventName: "mouseout", hasPayload: true },
  { prop: "onMouseOver", eventName: "mouseover", hasPayload: true },
  { prop: "onMouseUp", eventName: "mouseup", hasPayload: true },
  { prop: "onPanning", eventName: "panning", hasPayload: false },
  { prop: "onPinch", eventName: "pinch", hasPayload: true },
  { prop: "onPinchEnd", eventName: "pinchend", hasPayload: true },
  { prop: "onPinchStart", eventName: "pinchstart", hasPayload: true },
  { prop: "onProjectionChanged", eventName: "projection_changed", hasPayload: true },
  { prop: "onRemoveLayer", eventName: "removeLayer", hasPayload: true },
  { prop: "onResize", eventName: "resize", hasPayload: false },
  { prop: "onRightClick", eventName: "rightclick", hasPayload: true },
  { prop: "onSingleTap", eventName: "singletap", hasPayload: true },
  { prop: "onTouchEnd", eventName: "touchend", hasPayload: true },
  { prop: "onTouchMove", eventName: "touchmove", hasPayload: true },
  { prop: "onTouchStart", eventName: "touchstart", hasPayload: true },
  { prop: "onTwoFingerTap", eventName: "twofingertap", hasPayload: true },
  { prop: "onWheel", eventName: "wheel", hasPayload: true },
  { prop: "onZoomChanged", eventName: "zoom_changed", hasPayload: true },
  { prop: "onZooming", eventName: "zooming", hasPayload: false },
  { prop: "onZoomStart", eventName: "zoomstart", hasPayload: false }
];

const NON_DIV_KEYS = new Set([
  "onMapReady",
  "onMapDestroy",
  "onMapError",
  "retryOnError",
  "retryDelayMs",
  "fallback",
  "defaultCenter",
  "defaultZoom",
  "children"
]);

/* ─── 유틸 ─── */

function toCenterSignature(center: MapOptions["center"] | undefined): string {
  if (!center) {
    return "";
  }

  if (typeof center === "object") {
    const candidate = center as unknown as Record<string, unknown>;
    const rawLat = candidate.lat;
    const rawLng = candidate.lng;
    const lat = typeof rawLat === "function" ? (rawLat as () => number)() : rawLat;
    const lng = typeof rawLng === "function" ? (rawLng as () => number)() : rawLng;

    if (typeof lat === "number" && typeof lng === "number") {
      return `latlng:${lat},${lng}`;
    }

    const rawX = candidate.x;
    const rawY = candidate.y;
    const x = typeof rawX === "function" ? (rawX as () => number)() : rawX;
    const y = typeof rawY === "function" ? (rawY as () => number)() : rawY;

    if (typeof x === "number" && typeof y === "number") {
      return `xy:${x},${y}`;
    }
  }

  return String(center);
}

function areValuesEqual(left: unknown, right: unknown): boolean {
  if (left === right) {
    return true;
  }

  if (left === null || right === null || left === undefined || right === undefined) {
    return false;
  }

  if (typeof left === "object" && typeof right === "object") {
    const leftCenter = toCenterSignature(left as MapOptions["center"]);
    const rightCenter = toCenterSignature(right as MapOptions["center"]);

    if (leftCenter !== "" && rightCenter !== "") {
      return leftCenter === rightCenter;
    }

    return JSON.stringify(left) === JSON.stringify(right);
  }

  return false;
}

function getChangedOptions(
  previous: naver.maps.MapOptions,
  next: naver.maps.MapOptions
): Partial<naver.maps.MapOptions> {
  const keys = new Set([...Object.keys(previous), ...Object.keys(next)]);
  const changed: Array<[string, unknown]> = [];

  for (const key of keys) {
    const typedKey = key as keyof naver.maps.MapOptions;
    const previousValue = previous[typedKey];
    const nextValue = next[typedKey];

    if (!areValuesEqual(previousValue, nextValue) && nextValue !== undefined) {
      changed.push([key, nextValue]);
    }
  }

  return Object.fromEntries(changed) as Partial<naver.maps.MapOptions>;
}

function getDivProps(props: NaverMapProps): NaverMapDivProps {
  const entries: Array<[string, unknown]> = [];
  for (const [key, value] of Object.entries(props)) {
    if (NON_DIV_KEYS.has(key) || MAP_OPTION_KEY_SET.has(key) || MAP_EVENT_PROP_KEY_SET.has(key)) {
      continue;
    }
    entries.push([key, value]);
  }
  return Object.fromEntries(entries) as NaverMapDivProps;
}

/**
 * memo 비교: children과 함수(콜백)는 skip.
 * - children: React element는 JSON.stringify 불가
 * - 함수: ref를 통해 항상 최신 값을 읽으므로 비교 불필요
 */
function areNaverMapPropsEqual(previousProps: NaverMapProps, nextProps: NaverMapProps): boolean {
  const keys = new Set([...Object.keys(previousProps), ...Object.keys(nextProps)]);

  for (const key of keys) {
    if (key === "children") {
      if (previousProps.children !== nextProps.children) {
        return false;
      }
      continue;
    }

    const previousValue = previousProps[key as keyof NaverMapProps];
    const nextValue = nextProps[key as keyof NaverMapProps];

    if (typeof previousValue === "function" && typeof nextValue === "function") {
      continue;
    }

    if (!areValuesEqual(previousValue, nextValue)) {
      return false;
    }
  }

  return true;
}

/* ─── 컴포넌트 ─── */

const NaverMapBase = forwardRef<NaverMapRef, NaverMapProps>(function NaverMapInner(props, ref) {
  const context = useContext(NaverMapContext);

  if (!context) {
    throw new Error("NaverMap must be used inside NaverMapProvider.");
  }

  const { sdkStatus, setMap, reloadSdk } = context;

  // ─── mapReady state: children 렌더 트리거 ───
  const [mapReady, setMapReady] = useState(false);
  const [localMapInstance, setLocalMapInstance] = useState<naver.maps.Map | null>(null);

  // ─── 콜백/이벤트 핸들러를 ref로 관리 (effect 재실행 방지) ───
  const propsRef = useRef(props);
  useEffect(() => {
    propsRef.current = props;
  });

  // ─── 초기값 (최초 1회만 캡처) ───
  const initialCenterRef = useRef(props.center ?? props.defaultCenter);
  const initialZoomRef = useRef(props.zoom ?? props.defaultZoom);

  // ─── controlled 여부 ───
  const isControlledCenter = props.center !== undefined;
  const isControlledZoom = props.zoom !== undefined;

  // ─── map options (개별 prop 의존성, defaultCenter/defaultZoom 제외) ───
  const mapOptions = useMemo(() => {
    const entries: Array<[string, unknown]> = [];
    for (const key of MAP_OPTION_KEYS) {
      const value = props[key];
      if (value !== undefined) {
        entries.push([key, value]);
      }
    }
    return Object.fromEntries(entries) as naver.maps.MapOptions;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    props.background,
    props.baseTileOpacity,
    props.bounds,
    props.center,
    props.zoom,
    props.disableDoubleClickZoom,
    props.disableDoubleTapZoom,
    props.disableKineticPan,
    props.disableTwoFingerTapZoom,
    props.draggable,
    props.keyboardShortcuts,
    props.logoControl,
    props.logoControlOptions,
    props.mapDataControl,
    props.mapDataControlOptions,
    props.mapTypeControl,
    props.mapTypeControlOptions,
    props.mapTypeId,
    props.mapTypes,
    props.maxBounds,
    props.maxZoom,
    props.minZoom,
    props.padding,
    props.pinchZoom,
    props.resizeOrigin,
    props.scaleControl,
    props.scaleControlOptions,
    props.scrollWheel,
    props.size,
    props.overlayZoomEffect,
    props.tileSpare,
    props.tileTransition,
    props.tileDuration,
    props.zoomControl,
    props.zoomControlOptions,
    props.zoomOrigin,
    props.blankTileImage,
    props.gl,
    props.customStyleId
  ]);

  // ─── div props ───
  const divProps = useMemo(() => getDivProps(props), [props]);

  // ─── 내부 refs ───
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<naver.maps.Map | null>(null);
  const appliedOptionsRef = useRef<naver.maps.MapOptions>({});
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mapOptionsRef = useRef(mapOptions);
  mapOptionsRef.current = mapOptions;

  // ─── invokeMapMethod (안정적 ref) ───
  const invokeMapMethod = useCallback(
    <K extends keyof naver.maps.Map>(
      methodName: K,
      ...args: Parameters<Extract<naver.maps.Map[K], (...params: never[]) => unknown>>
    ): ReturnType<Extract<naver.maps.Map[K], (...params: never[]) => unknown>> | undefined => {
      const mapInstance = mapRef.current;

      if (!mapInstance) {
        return undefined;
      }

      const method = mapInstance[methodName] as unknown;

      if (typeof method !== "function") {
        return undefined;
      }

      return (method as (...params: unknown[]) => unknown).apply(mapInstance, args) as ReturnType<
        Extract<naver.maps.Map[K], (...params: never[]) => unknown>
      >;
    },
    []
  );

  // ─── imperative handle ───
  useImperativeHandle(
    ref,
    (): NaverMapRef => ({
      getInstance: () => mapRef.current,
      addOverlayPane: (name, elementOrZIndex) => {
        const mapInstance = mapRef.current as naver.maps.Map & {
          addOverlayPane?: (paneName: string, elementOrIndex: HTMLElement | number) => void;
        };
        mapInstance?.addOverlayPane?.(name, elementOrZIndex);
      },
      addPane: (...args) => invokeMapMethod("addPane", ...args),
      autoResize: (...args) => invokeMapMethod("autoResize", ...args),
      destroy: (...args) => {
        const mapInstance = mapRef.current as naver.maps.Map & { destroy?: () => void };

        if (!mapInstance) {
          return undefined;
        }

        try {
          return mapInstance.destroy?.(...args);
        } catch {
          return undefined;
        }
      },
      fitBounds: (...args) => invokeMapMethod("fitBounds", ...args),
      getBounds: (...args) => invokeMapMethod("getBounds", ...args),
      getCenter: (...args) => invokeMapMethod("getCenter", ...args),
      getCenterPoint: (...args) => invokeMapMethod("getCenterPoint", ...args),
      getElement: (...args) => invokeMapMethod("getElement", ...args),
      getMapTypeId: (...args) => invokeMapMethod("getMapTypeId", ...args),
      getMaxZoom: (...args) => invokeMapMethod("getMaxZoom", ...args),
      getMinZoom: (...args) => invokeMapMethod("getMinZoom", ...args),
      getOptions: (...args) => invokeMapMethod("getOptions", ...args),
      getPanes: (...args) => invokeMapMethod("getPanes", ...args),
      getPrimitiveProjection: (...args) => invokeMapMethod("getPrimitiveProjection", ...args),
      getProjection: (...args) => invokeMapMethod("getProjection", ...args),
      getSize: (...args) => invokeMapMethod("getSize", ...args),
      getZoom: (...args) => invokeMapMethod("getZoom", ...args),
      morph: (...args) => invokeMapMethod("morph", ...args),
      panBy: (...args) => invokeMapMethod("panBy", ...args),
      panTo: (...args) => invokeMapMethod("panTo", ...args),
      panToBounds: (...args) => invokeMapMethod("panToBounds", ...args),
      refresh: (...args) => invokeMapMethod("refresh", ...args),
      removeOverlayPane: (name) => {
        const mapInstance = mapRef.current as naver.maps.Map & {
          removeOverlayPane?: (paneName: string) => void;
        };
        mapInstance?.removeOverlayPane?.(name);
      },
      removePane: (...args) => invokeMapMethod("removePane", ...args),
      setCenter: (...args) => invokeMapMethod("setCenter", ...args),
      setCenterPoint: (...args) => invokeMapMethod("setCenterPoint", ...args),
      setMapTypeId: (...args) => invokeMapMethod("setMapTypeId", ...args),
      setOptions: (...args) => invokeMapMethod("setOptions", ...args),
      setSize: (...args) => invokeMapMethod("setSize", ...args),
      setZoom: (...args) => invokeMapMethod("setZoom", ...args),
      stop: (...args) => invokeMapMethod("stop", ...args),
      updateBy: (...args) => invokeMapMethod("updateBy", ...args),
      zoomBy: (...args) => invokeMapMethod("zoomBy", ...args)
    }),
    [invokeMapMethod]
  );

  // ─── 지도 생성 + 이벤트 바인딩 (sdkStatus만 의존) ───
  useEffect(() => {
    if (sdkStatus !== "ready" || !containerRef.current) {
      return;
    }

    const container = containerRef.current;

    // 생성 시점의 옵션 스냅샷
    const initOptions = { ...mapOptionsRef.current };
    if (initOptions.center === undefined && initialCenterRef.current !== undefined) {
      initOptions.center = initialCenterRef.current;
    }
    if (initOptions.zoom === undefined && initialZoomRef.current !== undefined) {
      initOptions.zoom = initialZoomRef.current;
    }

    let mapInstance: naver.maps.Map;
    try {
      mapInstance = new naver.maps.Map(container, initOptions);
    } catch (error) {
      const normalizedError =
        error instanceof Error ? error : new Error("Failed to create naver.maps.Map instance.");
      propsRef.current.onMapError?.(normalizedError);

      if (propsRef.current.retryOnError) {
        retryTimerRef.current = setTimeout(() => {
          void reloadSdk().catch(() => undefined);
        }, propsRef.current.retryDelayMs ?? 1000);
      }

      return () => {
        if (retryTimerRef.current) {
          clearTimeout(retryTimerRef.current);
          retryTimerRef.current = null;
        }
      };
    }

    mapRef.current = mapInstance;
    appliedOptionsRef.current = initOptions;
    setMap(mapInstance);
    setLocalMapInstance(mapInstance);
    setMapReady(true);
    propsRef.current.onMapReady?.(mapInstance);

    // 이벤트 리스너 — ref를 통해 항상 최신 핸들러를 읽으므로 1회만 바인딩
    const listeners = MAP_EVENT_BINDINGS.map((binding) =>
      naver.maps.Event.addListener(mapInstance, binding.eventName, (event: unknown) => {
        const handler = propsRef.current[binding.prop];
        if (typeof handler !== "function") {
          return;
        }
        if (binding.hasPayload) {
          (handler as (payload: unknown) => void)(event);
        } else {
          (handler as () => void)();
        }
      })
    );

    return () => {
      // 이벤트 해제
      try {
        naver.maps.Event.removeListener(listeners);
        naver.maps.Event.clearInstanceListeners(mapInstance);
      } catch {
        // 이미 해제된 경우 무시
      }

      // 타이머 정리
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }

      // DOM 정리
      container.innerHTML = "";

      // 상태 초기화
      mapRef.current = null;
      appliedOptionsRef.current = {};
      setMap(null);
      setLocalMapInstance(null);
      setMapReady(false);
      propsRef.current.onMapDestroy?.();
    };
  }, [sdkStatus, setMap, reloadSdk]);

  // ─── 옵션 동기화 (controlled prop만 지도에 반영) ───
  useEffect(() => {
    const mapInstance = mapRef.current;
    if (!mapInstance) {
      return;
    }

    const changed = getChangedOptions(appliedOptionsRef.current, mapOptions);
    if (Object.keys(changed).length === 0) {
      appliedOptionsRef.current = mapOptions;
      return;
    }

    const {
      center: changedCenter,
      zoom: changedZoom,
      mapTypeId: changedMapTypeId,
      ...otherChanged
    } = changed;

    // uncontrolled 상태 보존: setOptions/setMapTypeId 등이
    // 내부적으로 center/zoom을 리셋할 수 있으므로 미리 저장
    const savedCenter = !isControlledCenter ? mapInstance.getCenter() : null;
    const savedZoom = !isControlledZoom ? mapInstance.getZoom() : null;

    // center/zoom/mapTypeId 이외 옵션 → setOptions
    if (Object.keys(otherChanged).length > 0) {
      mapInstance.setOptions(otherChanged);
    }

    // mapTypeId 동기화
    if (changedMapTypeId !== undefined && mapOptions.mapTypeId !== undefined) {
      mapInstance.setMapTypeId(mapOptions.mapTypeId);
    }

    // controlled center 동기화
    if (isControlledCenter && changedCenter !== undefined) {
      mapInstance.setCenter(changedCenter as naver.maps.Coord);
    }

    // controlled zoom 동기화
    if (isControlledZoom && changedZoom !== undefined && mapOptions.zoom !== undefined) {
      mapInstance.setZoom(mapOptions.zoom);
    }

    // uncontrolled center/zoom 복원: 다른 옵션 변경으로 리셋됐을 수 있음
    if (savedCenter) {
      mapInstance.setCenter(savedCenter);
    }
    if (savedZoom !== null) {
      mapInstance.setZoom(savedZoom);
    }

    appliedOptionsRef.current = mapOptions;
  }, [mapOptions, isControlledCenter, isControlledZoom]);

  // ─── MapInstanceContext value ───
  const mapInstanceContextValue = useMemo<MapInstanceContextValue>(
    () => ({
      instance: localMapInstance,
      setInstance: setLocalMapInstance as (
        instance: naver.maps.Map | naver.maps.Panorama | null
      ) => void,
      type: "map"
    }),
    [localMapInstance]
  );

  // ─── 렌더 ───
  if (sdkStatus === "error") {
    return <>{props.fallback ?? <div {...divProps}>지도를 불러올 수 없습니다.</div>}</>;
  }

  if (sdkStatus === "loading") {
    return <>{props.fallback ?? <div {...divProps} />}</>;
  }

  return (
    <MapInstanceContext.Provider value={mapInstanceContextValue}>
      <div ref={containerRef} {...divProps}>
        {mapReady ? props.children : null}
      </div>
    </MapInstanceContext.Provider>
  );
});

NaverMapBase.displayName = "NaverMap";

export const NaverMap = memo(NaverMapBase, areNaverMapPropsEqual);
