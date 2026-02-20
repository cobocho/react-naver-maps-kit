import {
  forwardRef,
  memo,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef
} from "react";

import { NaverMapContext } from "../provider/NaverMapProvider";

import type { ComponentPropsWithoutRef } from "react";

type MapOptions = naver.maps.MapOptions;

interface NaverMapOptionProps {
  background?: MapOptions["background"];
  baseTileOpacity?: MapOptions["baseTileOpacity"];
  bounds?: MapOptions["bounds"];
  center?: MapOptions["center"];
  zoom?: MapOptions["zoom"];
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
  onMapReady?: (map: naver.maps.Map) => void;
  onMapDestroy?: () => void;
  onMapError?: (error: Error) => void;
  retryOnError?: boolean;
  retryDelayMs?: number;
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

type NaverMapDivProps = Omit<ComponentPropsWithoutRef<"div">, "children" | "draggable">;

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

function toCenterSignature(center: MapOptions["center"] | undefined): string {
  if (!center) {
    return "";
  }

  if (typeof center === "object") {
    const maybeCenter = center as { lat?: number; lng?: number; x?: number; y?: number };

    if (typeof maybeCenter.lat === "number" && typeof maybeCenter.lng === "number") {
      return `latlng:${maybeCenter.lat},${maybeCenter.lng}`;
    }

    if (typeof maybeCenter.x === "number" && typeof maybeCenter.y === "number") {
      return `xy:${maybeCenter.x},${maybeCenter.y}`;
    }
  }

  return String(center);
}

function areValuesEqual(left: unknown, right: unknown): boolean {
  if (left === right) {
    return true;
  }

  if (left === undefined || right === undefined || left === null || right === null) {
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

function splitNaverMapProps(props: NaverMapProps): {
  mapOptions: naver.maps.MapOptions;
  divProps: NaverMapDivProps;
  onMapReady?: (map: naver.maps.Map) => void;
  onMapDestroy?: () => void;
  onMapError?: (error: Error) => void;
  retryOnError?: boolean;
  retryDelayMs?: number;
} {
  const mapOptionEntries: Array<[string, unknown]> = [];
  const divPropEntries: Array<[string, unknown]> = [];

  for (const [key, value] of Object.entries(props)) {
    if (key === "onMapReady" || key === "onMapDestroy") {
      continue;
    }

    if (key === "onMapError" || key === "retryOnError" || key === "retryDelayMs") {
      continue;
    }

    if (MAP_EVENT_PROP_KEY_SET.has(key)) {
      continue;
    }

    if (MAP_OPTION_KEY_SET.has(key)) {
      if (value !== undefined) {
        mapOptionEntries.push([key, value]);
      }
      continue;
    }

    divPropEntries.push([key, value]);
  }

  return {
    mapOptions: Object.fromEntries(mapOptionEntries) as naver.maps.MapOptions,
    divProps: Object.fromEntries(divPropEntries) as NaverMapDivProps,
    onMapReady: props.onMapReady,
    onMapDestroy: props.onMapDestroy,
    onMapError: props.onMapError,
    retryOnError: props.retryOnError,
    retryDelayMs: props.retryDelayMs
  };
}

function getChangedOptions(
  previous: naver.maps.MapOptions,
  next: naver.maps.MapOptions
): Partial<naver.maps.MapOptions> {
  const changedEntries: Array<[string, unknown]> = [];
  const keys = new Set([...Object.keys(previous), ...Object.keys(next)]);

  keys.forEach((key) => {
    const optionKey = key as keyof naver.maps.MapOptions;
    const previousValue = previous[optionKey];
    const nextValue = next[optionKey];

    if (!areValuesEqual(previousValue, nextValue) && nextValue !== undefined) {
      changedEntries.push([key, nextValue]);
    }
  });

  return Object.fromEntries(changedEntries) as Partial<naver.maps.MapOptions>;
}

function applyChangedMapOptions(
  mapInstance: naver.maps.Map,
  previousOptionsRef: { current: naver.maps.MapOptions },
  nextOptions: naver.maps.MapOptions,
  previousCenterSignatureRef: { current: string },
  previousZoomRef: { current: MapOptions["zoom"] | undefined },
  previousMapTypeIdRef: { current: MapOptions["mapTypeId"] | undefined }
): void {
  const changedOptions = getChangedOptions(previousOptionsRef.current, nextOptions);
  const {
    center: changedCenter,
    zoom: changedZoom,
    mapTypeId: changedMapTypeId,
    ...restChangedOptions
  } = changedOptions;
  const nextCenter = nextOptions.center;
  const nextZoom = nextOptions.zoom;
  const nextMapTypeId = nextOptions.mapTypeId;
  const nextCenterSignature = toCenterSignature(nextCenter);

  if (Object.keys(restChangedOptions).length > 0) {
    mapInstance.setOptions(restChangedOptions);
  }

  if (
    changedCenter !== undefined &&
    nextCenter !== undefined &&
    nextCenterSignature !== previousCenterSignatureRef.current
  ) {
    mapInstance.setCenter(nextCenter);
    previousCenterSignatureRef.current = nextCenterSignature;
  }

  if (changedZoom !== undefined && nextZoom !== undefined && nextZoom !== previousZoomRef.current) {
    mapInstance.setZoom(nextZoom);
    previousZoomRef.current = nextZoom;
  }

  if (
    changedMapTypeId !== undefined &&
    nextMapTypeId !== undefined &&
    nextMapTypeId !== previousMapTypeIdRef.current
  ) {
    mapInstance.setMapTypeId(nextMapTypeId);
    previousMapTypeIdRef.current = nextMapTypeId;
  }

  previousOptionsRef.current = nextOptions;
}

function areNaverMapPropsEqual(previousProps: NaverMapProps, nextProps: NaverMapProps): boolean {
  const keys = new Set([...Object.keys(previousProps), ...Object.keys(nextProps)]);

  for (const key of keys) {
    const previousValue = previousProps[key as keyof NaverMapProps];
    const nextValue = nextProps[key as keyof NaverMapProps];

    if (!areValuesEqual(previousValue, nextValue)) {
      return false;
    }
  }

  return true;
}

const NaverMapBase = forwardRef<NaverMapRef, NaverMapProps>(function NaverMapInner(props, ref) {
  const context = useContext(NaverMapContext);

  if (!context) {
    throw new Error("NaverMap must be used inside NaverMapProvider.");
  }

  const { mapOptions, divProps, onMapReady, onMapDestroy, onMapError, retryOnError, retryDelayMs } =
    splitNaverMapProps(props);
  const { reloadSdk, sdkStatus, setMap } = context;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<naver.maps.Map | null>(null);
  const isCreatingRef = useRef(false);
  const isUnmountedRef = useRef(false);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const appliedOptionsRef = useRef<naver.maps.MapOptions>({});
  const mapEventListenersRef = useRef<naver.maps.MapEventListener[]>([]);
  const onMapDestroyRef = useRef<NaverMapProps["onMapDestroy"]>(onMapDestroy);
  const previousCenterSignatureRef = useRef<string>("");
  const previousZoomRef = useRef<MapOptions["zoom"] | undefined>(undefined);
  const previousMapTypeIdRef = useRef<MapOptions["mapTypeId"] | undefined>(undefined);
  const latestMapOptionsRef = useRef<naver.maps.MapOptions>(mapOptions);

  latestMapOptionsRef.current = mapOptions;

  useEffect(() => {
    onMapDestroyRef.current = onMapDestroy;
  }, [onMapDestroy]);

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

  const teardownMapInstance = useCallback(() => {
    const mapInstance = mapRef.current;
    const containerElement = containerRef.current;

    if (!mapInstance) {
      return;
    }

    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }

    try {
      if (mapEventListenersRef.current.length > 0) {
        naver.maps.Event.removeListener(mapEventListenersRef.current);
        mapEventListenersRef.current = [];
      }

      naver.maps.Event.clearInstanceListeners(mapInstance);
    } catch (error) {
      console.error("[react-naver-maps-kit] failed to clear map listeners", error);
    }

    if (containerElement) {
      containerElement.innerHTML = "";
    }

    mapRef.current = null;
    isCreatingRef.current = false;
    appliedOptionsRef.current = {};
    previousCenterSignatureRef.current = "";
    previousZoomRef.current = undefined;
    previousMapTypeIdRef.current = undefined;
    setMap(null);
    onMapDestroyRef.current?.();
  }, [setMap]);

  useImperativeHandle(
    ref,
    (): NaverMapRef => ({
      getInstance: () => mapRef.current,
      addOverlayPane: (name, elementOrZIndex) => {
        const mapInstance = mapRef.current as naver.maps.Map & {
          addOverlayPane?: (name: string, elementOrZIndex: HTMLElement | number) => void;
        };

        mapInstance.addOverlayPane?.(name, elementOrZIndex);
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
        } finally {
          teardownMapInstance();
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
          removeOverlayPane?: (name: string) => void;
        };

        mapInstance.removeOverlayPane?.(name);
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
    [invokeMapMethod, teardownMapInstance]
  );

  useEffect(() => {
    isUnmountedRef.current = false;

    return () => {
      isUnmountedRef.current = true;
    };
  }, []);

  useEffect(() => {
    if (sdkStatus !== "ready" || !containerRef.current || mapRef.current || isCreatingRef.current) {
      return;
    }

    isCreatingRef.current = true;

    try {
      const mapInstance = new naver.maps.Map(containerRef.current, latestMapOptionsRef.current);
      mapRef.current = mapInstance;
      setMap(mapInstance);
      appliedOptionsRef.current = latestMapOptionsRef.current;
      previousCenterSignatureRef.current = toCenterSignature(latestMapOptionsRef.current.center);
      previousZoomRef.current = latestMapOptionsRef.current.zoom;
      previousMapTypeIdRef.current = latestMapOptionsRef.current.mapTypeId;
      onMapReady?.(mapInstance);
    } catch (error) {
      const normalizedError =
        error instanceof Error ? error : new Error("Failed to create naver.maps.Map instance.");

      console.error("[react-naver-maps-kit] failed to create naver.maps.Map", normalizedError);
      onMapError?.(normalizedError);

      if (retryOnError && !isUnmountedRef.current) {
        const retryDelay = retryDelayMs ?? 1000;

        if (retryTimerRef.current) {
          clearTimeout(retryTimerRef.current);
        }

        retryTimerRef.current = setTimeout(() => {
          void reloadSdk().catch(() => undefined);
        }, retryDelay);
      }
    } finally {
      isCreatingRef.current = false;
    }
  }, [onMapError, onMapReady, reloadSdk, retryDelayMs, retryOnError, sdkStatus, setMap]);

  useEffect(() => {
    const mapInstance = mapRef.current;

    if (!mapInstance) {
      return;
    }

    try {
      applyChangedMapOptions(
        mapInstance,
        appliedOptionsRef,
        latestMapOptionsRef.current,
        previousCenterSignatureRef,
        previousZoomRef,
        previousMapTypeIdRef
      );
    } catch (error) {
      console.error("[react-naver-maps-kit] failed to update map options", error);
    }
  });

  useEffect(() => {
    const mapInstance = mapRef.current;

    if (!mapInstance) {
      return;
    }

    if (mapEventListenersRef.current.length > 0) {
      naver.maps.Event.removeListener(mapEventListenersRef.current);
      mapEventListenersRef.current = [];
    }

    mapEventListenersRef.current = MAP_EVENT_BINDINGS.map((binding) => {
      const handler = props[binding.prop];

      if (typeof handler !== "function") {
        return null;
      }

      return naver.maps.Event.addListener(mapInstance, binding.eventName, (event: unknown) => {
        if (binding.hasPayload) {
          (handler as (event: unknown) => void)(event);
          return;
        }

        (handler as () => void)();
      });
    }).filter((listener): listener is naver.maps.MapEventListener => listener !== null);

    return () => {
      if (mapEventListenersRef.current.length > 0) {
        naver.maps.Event.removeListener(mapEventListenersRef.current);
        mapEventListenersRef.current = [];
      }
    };
  }, [props]);

  useEffect(() => {
    return () => {
      teardownMapInstance();
    };
  }, [teardownMapInstance]);

  return <div ref={containerRef} {...divProps} />;
});

NaverMapBase.displayName = "NaverMap";

export const NaverMap = memo(NaverMapBase, areNaverMapPropsEqual);
