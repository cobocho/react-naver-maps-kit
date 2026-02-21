import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";

import { useNaverMap } from "../../react/hooks/useNaverMap";
import { bindOverlayEventListeners, removeOverlayEventListeners } from "../shared/overlayUtils";

type PolygonOptions = naver.maps.PolygonOptions;

interface PolygonOptionProps {
  map?: naver.maps.Map | null;
  paths: PolygonOptions["paths"];
  strokeWeight?: PolygonOptions["strokeWeight"];
  strokeOpacity?: PolygonOptions["strokeOpacity"];
  strokeColor?: PolygonOptions["strokeColor"];
  strokeStyle?: PolygonOptions["strokeStyle"];
  strokeLineCap?: PolygonOptions["strokeLineCap"];
  strokeLineJoin?: PolygonOptions["strokeLineJoin"];
  fillColor?: PolygonOptions["fillColor"];
  fillOpacity?: PolygonOptions["fillOpacity"];
  clickable?: PolygonOptions["clickable"];
  visible?: PolygonOptions["visible"];
  zIndex?: PolygonOptions["zIndex"];
}

interface PolygonLifecycleProps {
  onPolygonReady?: (polygon: naver.maps.Polygon) => void;
  onPolygonDestroy?: () => void;
  onPolygonError?: (error: Error) => void;
}

interface PolygonEventProps {
  onClick?: (event: naver.maps.PointerEvent) => void;
  onDblClick?: (event: naver.maps.PointerEvent) => void;
  onMouseDown?: (event: naver.maps.PointerEvent) => void;
  onMouseMove?: (event: naver.maps.PointerEvent) => void;
  onMouseOut?: (event: naver.maps.PointerEvent) => void;
  onMouseOver?: (event: naver.maps.PointerEvent) => void;
  onMouseUp?: (event: naver.maps.PointerEvent) => void;
  onRightClick?: (event: naver.maps.PointerEvent) => void;
  onTouchStart?: (event: naver.maps.PointerEvent) => void;
  onTouchMove?: (event: naver.maps.PointerEvent) => void;
  onTouchEnd?: (event: naver.maps.PointerEvent) => void;
  onClickableChanged?: (clickable: boolean) => void;
  onFillColorChanged?: (fillColor: string) => void;
  onFillOpacityChanged?: (fillOpacity: number) => void;
  onMapChanged?: (map: naver.maps.Map | null) => void;
  onPathChanged?: (
    path: naver.maps.ArrayOfCoords | naver.maps.KVOArrayOfCoords | naver.maps.ArrayOfCoordsLiteral
  ) => void;
  onPathsChanged?: (
    paths:
      | naver.maps.ArrayOfCoords[]
      | naver.maps.KVOArray<naver.maps.KVOArrayOfCoords>
      | naver.maps.ArrayOfCoordsLiteral[]
  ) => void;
  onStrokeColorChanged?: (strokeColor: string) => void;
  onStrokeLineCapChanged?: (strokeLineCap: naver.maps.StrokeLineCapType) => void;
  onStrokeLineJoinChanged?: (strokeLineJoin: naver.maps.StrokeLineJoinType) => void;
  onStrokeOpacityChanged?: (strokeOpacity: number) => void;
  onStrokeStyleChanged?: (strokeStyle: naver.maps.StrokeStyleType) => void;
  onStrokeWeightChanged?: (strokeWeight: number) => void;
  onVisibleChanged?: (visible: boolean) => void;
  onZIndexChanged?: (zIndex: number) => void;
}

export type PolygonProps = PolygonOptionProps & PolygonLifecycleProps & PolygonEventProps;

type PolygonMethod<K extends keyof naver.maps.Polygon> = naver.maps.Polygon[K] extends (
  ...args: infer A
) => infer R
  ? (...args: A) => R | undefined
  : never;

export interface PolygonRef {
  getInstance: () => naver.maps.Polygon | null;
  getAreaSize: PolygonMethod<"getAreaSize">;
  getBounds: PolygonMethod<"getBounds">;
  getClickable: PolygonMethod<"getClickable">;
  getDrawingRect: PolygonMethod<"getDrawingRect">;
  getElement: PolygonMethod<"getElement">;
  getMap: PolygonMethod<"getMap">;
  getOptions: PolygonMethod<"getOptions">;
  getPanes: PolygonMethod<"getPanes">;
  getPath: PolygonMethod<"getPath">;
  getPaths: PolygonMethod<"getPaths">;
  getProjection: PolygonMethod<"getProjection">;
  getStyles: PolygonMethod<"getStyles">;
  getVisible: PolygonMethod<"getVisible">;
  getZIndex: PolygonMethod<"getZIndex">;
  setClickable: PolygonMethod<"setClickable">;
  setMap: PolygonMethod<"setMap">;
  setOptions: PolygonMethod<"setOptions">;
  setPath: PolygonMethod<"setPath">;
  setPaths: PolygonMethod<"setPaths">;
  setStyles: PolygonMethod<"setStyles">;
  setVisible: PolygonMethod<"setVisible">;
  setZIndex: PolygonMethod<"setZIndex">;
}

function toPolygonOptions(props: PolygonProps, targetMap: naver.maps.Map | null): PolygonOptions {
  const options: PolygonOptions = {
    paths: props.paths
  };

  if (targetMap) {
    options.map = targetMap;
  }

  if (props.strokeWeight !== undefined) {
    options.strokeWeight = props.strokeWeight;
  }

  if (props.strokeOpacity !== undefined) {
    options.strokeOpacity = props.strokeOpacity;
  }

  if (props.strokeColor !== undefined) {
    options.strokeColor = props.strokeColor;
  }

  if (props.strokeStyle !== undefined) {
    options.strokeStyle = props.strokeStyle;
  }

  if (props.strokeLineCap !== undefined) {
    options.strokeLineCap = props.strokeLineCap;
  }

  if (props.strokeLineJoin !== undefined) {
    options.strokeLineJoin = props.strokeLineJoin;
  }

  if (props.fillColor !== undefined) {
    options.fillColor = props.fillColor;
  }

  if (props.fillOpacity !== undefined) {
    options.fillOpacity = props.fillOpacity;
  }

  if (props.clickable !== undefined) {
    options.clickable = props.clickable;
  }

  if (props.visible !== undefined) {
    options.visible = props.visible;
  }

  if (props.zIndex !== undefined) {
    options.zIndex = props.zIndex;
  }

  return options;
}

function buildPolygonEventBindings(props: PolygonProps) {
  return [
    {
      eventName: "click",
      invoke: props.onClick
        ? (event: unknown) => props.onClick?.(event as naver.maps.PointerEvent)
        : undefined
    },
    {
      eventName: "dblclick",
      invoke: props.onDblClick
        ? (event: unknown) => props.onDblClick?.(event as naver.maps.PointerEvent)
        : undefined
    },
    {
      eventName: "mousedown",
      invoke: props.onMouseDown
        ? (event: unknown) => props.onMouseDown?.(event as naver.maps.PointerEvent)
        : undefined
    },
    {
      eventName: "mousemove",
      invoke: props.onMouseMove
        ? (event: unknown) => props.onMouseMove?.(event as naver.maps.PointerEvent)
        : undefined
    },
    {
      eventName: "mouseout",
      invoke: props.onMouseOut
        ? (event: unknown) => props.onMouseOut?.(event as naver.maps.PointerEvent)
        : undefined
    },
    {
      eventName: "mouseover",
      invoke: props.onMouseOver
        ? (event: unknown) => props.onMouseOver?.(event as naver.maps.PointerEvent)
        : undefined
    },
    {
      eventName: "mouseup",
      invoke: props.onMouseUp
        ? (event: unknown) => props.onMouseUp?.(event as naver.maps.PointerEvent)
        : undefined
    },
    {
      eventName: "rightclick",
      invoke: props.onRightClick
        ? (event: unknown) => props.onRightClick?.(event as naver.maps.PointerEvent)
        : undefined
    },
    {
      eventName: "touchstart",
      invoke: props.onTouchStart
        ? (event: unknown) => props.onTouchStart?.(event as naver.maps.PointerEvent)
        : undefined
    },
    {
      eventName: "touchmove",
      invoke: props.onTouchMove
        ? (event: unknown) => props.onTouchMove?.(event as naver.maps.PointerEvent)
        : undefined
    },
    {
      eventName: "touchend",
      invoke: props.onTouchEnd
        ? (event: unknown) => props.onTouchEnd?.(event as naver.maps.PointerEvent)
        : undefined
    },
    {
      eventName: "clickable_changed",
      invoke: props.onClickableChanged
        ? (event: unknown) => props.onClickableChanged?.(event as boolean)
        : undefined
    },
    {
      eventName: "fillColor_changed",
      invoke: props.onFillColorChanged
        ? (event: unknown) => props.onFillColorChanged?.(event as string)
        : undefined
    },
    {
      eventName: "fillOpacity_changed",
      invoke: props.onFillOpacityChanged
        ? (event: unknown) => props.onFillOpacityChanged?.(event as number)
        : undefined
    },
    {
      eventName: "map_changed",
      invoke: props.onMapChanged
        ? (event: unknown) => props.onMapChanged?.(event as naver.maps.Map | null)
        : undefined
    },
    {
      eventName: "path_changed",
      invoke: props.onPathChanged
        ? (event: unknown) =>
            props.onPathChanged?.(
              event as
                | naver.maps.ArrayOfCoords
                | naver.maps.KVOArrayOfCoords
                | naver.maps.ArrayOfCoordsLiteral
            )
        : undefined
    },
    {
      eventName: "paths_changed",
      invoke: props.onPathsChanged
        ? (event: unknown) =>
            props.onPathsChanged?.(
              event as
                | naver.maps.ArrayOfCoords[]
                | naver.maps.KVOArray<naver.maps.KVOArrayOfCoords>
                | naver.maps.ArrayOfCoordsLiteral[]
            )
        : undefined
    },
    {
      eventName: "strokeColor_changed",
      invoke: props.onStrokeColorChanged
        ? (event: unknown) => props.onStrokeColorChanged?.(event as string)
        : undefined
    },
    {
      eventName: "strokeLineCap_changed",
      invoke: props.onStrokeLineCapChanged
        ? (event: unknown) => props.onStrokeLineCapChanged?.(event as naver.maps.StrokeLineCapType)
        : undefined
    },
    {
      eventName: "strokeLineJoin_changed",
      invoke: props.onStrokeLineJoinChanged
        ? (event: unknown) =>
            props.onStrokeLineJoinChanged?.(event as naver.maps.StrokeLineJoinType)
        : undefined
    },
    {
      eventName: "strokeOpacity_changed",
      invoke: props.onStrokeOpacityChanged
        ? (event: unknown) => props.onStrokeOpacityChanged?.(event as number)
        : undefined
    },
    {
      eventName: "strokeStyle_changed",
      invoke: props.onStrokeStyleChanged
        ? (event: unknown) => props.onStrokeStyleChanged?.(event as naver.maps.StrokeStyleType)
        : undefined
    },
    {
      eventName: "strokeWeight_changed",
      invoke: props.onStrokeWeightChanged
        ? (event: unknown) => props.onStrokeWeightChanged?.(event as number)
        : undefined
    },
    {
      eventName: "visible_changed",
      invoke: props.onVisibleChanged
        ? (event: unknown) => props.onVisibleChanged?.(event as boolean)
        : undefined
    },
    {
      eventName: "zIndex_changed",
      invoke: props.onZIndexChanged
        ? (event: unknown) => props.onZIndexChanged?.(event as number)
        : undefined
    }
  ];
}

export const Polygon = forwardRef<PolygonRef, PolygonProps>(function PolygonInner(props, ref) {
  const { map: contextMap, sdkStatus } = useNaverMap();
  const polygonRef = useRef<naver.maps.Polygon | null>(null);
  const polygonEventListenersRef = useRef<naver.maps.MapEventListener[]>([]);
  const onPolygonDestroyRef = useRef<PolygonProps["onPolygonDestroy"]>(props.onPolygonDestroy);
  const targetMap = props.map ?? contextMap;

  useEffect(() => {
    onPolygonDestroyRef.current = props.onPolygonDestroy;
  }, [props.onPolygonDestroy]);

  const invokePolygonMethod = useCallback(
    <K extends keyof naver.maps.Polygon>(
      methodName: K,
      ...args: Parameters<Extract<naver.maps.Polygon[K], (...params: never[]) => unknown>>
    ): ReturnType<Extract<naver.maps.Polygon[K], (...params: never[]) => unknown>> | undefined => {
      const polygon = polygonRef.current;

      if (!polygon) {
        return undefined;
      }

      const method = polygon[methodName] as unknown;

      if (typeof method !== "function") {
        return undefined;
      }

      return (method as (...params: unknown[]) => unknown).apply(polygon, args) as ReturnType<
        Extract<naver.maps.Polygon[K], (...params: never[]) => unknown>
      >;
    },
    []
  );

  const teardownPolygon = useCallback(() => {
    const polygon = polygonRef.current;

    if (!polygon) {
      return;
    }

    try {
      removeOverlayEventListeners(polygonEventListenersRef.current);
      polygonEventListenersRef.current = [];
      naver.maps.Event.clearInstanceListeners(polygon);
    } catch (error) {
      console.error("[react-naver-maps-kit] failed to clear polygon listeners", error);
    }

    polygon.setMap(null);
    polygonRef.current = null;
    onPolygonDestroyRef.current?.();
  }, []);

  useImperativeHandle(
    ref,
    (): PolygonRef => ({
      getInstance: () => polygonRef.current,
      getAreaSize: (...args) => invokePolygonMethod("getAreaSize", ...args),
      getBounds: (...args) => invokePolygonMethod("getBounds", ...args),
      getClickable: (...args) => invokePolygonMethod("getClickable", ...args),
      getDrawingRect: (...args) => invokePolygonMethod("getDrawingRect", ...args),
      getElement: (...args) => invokePolygonMethod("getElement", ...args),
      getMap: (...args) => invokePolygonMethod("getMap", ...args),
      getOptions: (...args) => invokePolygonMethod("getOptions", ...args),
      getPanes: (...args) => invokePolygonMethod("getPanes", ...args),
      getPath: (...args) => invokePolygonMethod("getPath", ...args),
      getPaths: (...args) => invokePolygonMethod("getPaths", ...args),
      getProjection: (...args) => invokePolygonMethod("getProjection", ...args),
      getStyles: (...args) => invokePolygonMethod("getStyles", ...args),
      getVisible: (...args) => invokePolygonMethod("getVisible", ...args),
      getZIndex: (...args) => invokePolygonMethod("getZIndex", ...args),
      setClickable: (...args) => invokePolygonMethod("setClickable", ...args),
      setMap: (...args) => invokePolygonMethod("setMap", ...args),
      setOptions: (...args) => invokePolygonMethod("setOptions", ...args),
      setPath: (...args) => invokePolygonMethod("setPath", ...args),
      setPaths: (...args) => invokePolygonMethod("setPaths", ...args),
      setStyles: (...args) => invokePolygonMethod("setStyles", ...args),
      setVisible: (...args) => invokePolygonMethod("setVisible", ...args),
      setZIndex: (...args) => invokePolygonMethod("setZIndex", ...args)
    }),
    [invokePolygonMethod]
  );

  useEffect(() => {
    if (sdkStatus !== "ready" || !targetMap || polygonRef.current) {
      return;
    }

    try {
      const polygon = new naver.maps.Polygon(toPolygonOptions(props, targetMap));

      polygonRef.current = polygon;
      bindOverlayEventListeners(
        polygon,
        polygonEventListenersRef,
        buildPolygonEventBindings(props)
      );
      props.onPolygonReady?.(polygon);
    } catch (error) {
      const normalizedError =
        error instanceof Error ? error : new Error("Failed to create naver.maps.Polygon instance.");

      props.onPolygonError?.(normalizedError);
    }
  }, [props, sdkStatus, targetMap]);

  useEffect(() => {
    const polygon = polygonRef.current;

    if (!polygon || !targetMap) {
      return;
    }

    polygon.setOptions(toPolygonOptions(props, targetMap));
  }, [props, targetMap]);

  useEffect(() => {
    const polygon = polygonRef.current;

    if (!polygon) {
      return;
    }

    bindOverlayEventListeners(polygon, polygonEventListenersRef, buildPolygonEventBindings(props));

    return () => {
      removeOverlayEventListeners(polygonEventListenersRef.current);
      polygonEventListenersRef.current = [];
    };
  }, [props]);

  useEffect(() => {
    return () => {
      teardownPolygon();
    };
  }, [teardownPolygon]);

  return null;
});

Polygon.displayName = "Polygon";
