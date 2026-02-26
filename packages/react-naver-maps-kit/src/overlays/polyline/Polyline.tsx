import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";

import { useNaverMap } from "../../react/hooks/useNaverMap";
import { useMapInstance } from "../../react/context/MapInstanceContext";
import { bindOverlayEventListeners, removeOverlayEventListeners } from "../shared/overlayUtils";

type PolylineOptions = naver.maps.PolylineOptions;

interface PolylineOptionProps {
  map?: naver.maps.Map | null;
  path: PolylineOptions["path"];
  strokeWeight?: PolylineOptions["strokeWeight"];
  strokeOpacity?: PolylineOptions["strokeOpacity"];
  strokeColor?: PolylineOptions["strokeColor"];
  strokeStyle?: PolylineOptions["strokeStyle"];
  strokeLineCap?: PolylineOptions["strokeLineCap"];
  strokeLineJoin?: PolylineOptions["strokeLineJoin"];
  clickable?: PolylineOptions["clickable"];
  visible?: PolylineOptions["visible"];
  zIndex?: PolylineOptions["zIndex"];
  startIcon?: PolylineOptions["startIcon"];
  startIconSize?: PolylineOptions["startIconSize"];
  endIcon?: PolylineOptions["endIcon"];
  endIconSize?: PolylineOptions["endIconSize"];
}

interface PolylineLifecycleProps {
  onPolylineReady?: (polyline: naver.maps.Polyline) => void;
  onPolylineDestroy?: () => void;
  onPolylineError?: (error: Error) => void;
}

interface PolylineEventProps {
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
  onEndIconChanged?: (icon: naver.maps.PointingIcon) => void;
  onEndIconSizeChanged?: (size: number) => void;
  onMapChanged?: (map: naver.maps.Map | null) => void;
  onPathChanged?: (
    path: naver.maps.ArrayOfCoords | naver.maps.KVOArrayOfCoords | naver.maps.ArrayOfCoordsLiteral
  ) => void;
  onStartIconChanged?: (icon: naver.maps.PointingIcon) => void;
  onStartIconSizeChanged?: (size: number) => void;
  onStrokeColorChanged?: (strokeColor: string) => void;
  onStrokeLineCapChanged?: (strokeLineCap: naver.maps.StrokeLineCapType) => void;
  onStrokeLineJoinChanged?: (strokeLineJoin: naver.maps.StrokeLineJoinType) => void;
  onStrokeOpacityChanged?: (strokeOpacity: number) => void;
  onStrokeStyleChanged?: (strokeStyle: naver.maps.StrokeStyleType) => void;
  onStrokeWeightChanged?: (strokeWeight: number) => void;
  onVisibleChanged?: (visible: boolean) => void;
  onZIndexChanged?: (zIndex: number) => void;
}

export type PolylineProps = PolylineOptionProps & PolylineLifecycleProps & PolylineEventProps;

type PolylineMethod<K extends keyof naver.maps.Polyline> = naver.maps.Polyline[K] extends (
  ...args: infer A
) => infer R
  ? (...args: A) => R | undefined
  : never;

export interface PolylineRef {
  getInstance: () => naver.maps.Polyline | null;
  getBounds: PolylineMethod<"getBounds">;
  getClickable: PolylineMethod<"getClickable">;
  getDistance: PolylineMethod<"getDistance">;
  getDrawingRect: PolylineMethod<"getDrawingRect">;
  getElement: PolylineMethod<"getElement">;
  getMap: PolylineMethod<"getMap">;
  getOptions: PolylineMethod<"getOptions">;
  getPanes: PolylineMethod<"getPanes">;
  getPath: PolylineMethod<"getPath">;
  getProjection: PolylineMethod<"getProjection">;
  getStyles: PolylineMethod<"getStyles">;
  getVisible: PolylineMethod<"getVisible">;
  getZIndex: PolylineMethod<"getZIndex">;
  setClickable: PolylineMethod<"setClickable">;
  setMap: PolylineMethod<"setMap">;
  setOptions: PolylineMethod<"setOptions">;
  setPath: PolylineMethod<"setPath">;
  setStyles: PolylineMethod<"setStyles">;
  setVisible: PolylineMethod<"setVisible">;
  setZIndex: PolylineMethod<"setZIndex">;
}

function toPolylineOptions(
  props: PolylineProps,
  targetMap: naver.maps.Map | null
): PolylineOptions {
  const options: PolylineOptions = {
    path: props.path
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

  if (props.clickable !== undefined) {
    options.clickable = props.clickable;
  }

  if (props.visible !== undefined) {
    options.visible = props.visible;
  }

  if (props.zIndex !== undefined) {
    options.zIndex = props.zIndex;
  }

  if (props.startIcon !== undefined) {
    options.startIcon = props.startIcon;
  }

  if (props.startIconSize !== undefined) {
    options.startIconSize = props.startIconSize;
  }

  if (props.endIcon !== undefined) {
    options.endIcon = props.endIcon;
  }

  if (props.endIconSize !== undefined) {
    options.endIconSize = props.endIconSize;
  }

  return options;
}

function buildPolylineEventBindings(props: PolylineProps) {
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
      eventName: "endIcon_changed",
      invoke: props.onEndIconChanged
        ? (event: unknown) => props.onEndIconChanged?.(event as naver.maps.PointingIcon)
        : undefined
    },
    {
      eventName: "endIconSize_changed",
      invoke: props.onEndIconSizeChanged
        ? (event: unknown) => props.onEndIconSizeChanged?.(event as number)
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
      eventName: "startIcon_changed",
      invoke: props.onStartIconChanged
        ? (event: unknown) => props.onStartIconChanged?.(event as naver.maps.PointingIcon)
        : undefined
    },
    {
      eventName: "startIconSize_changed",
      invoke: props.onStartIconSizeChanged
        ? (event: unknown) => props.onStartIconSizeChanged?.(event as number)
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

export const Polyline = forwardRef<PolylineRef, PolylineProps>(function PolylineInner(props, ref) {
  const { sdkStatus } = useNaverMap();
  const mapInstanceContext = useMapInstance();
  const contextMap = mapInstanceContext?.instance as naver.maps.Map | null;

  const polylineRef = useRef<naver.maps.Polyline | null>(null);
  const polylineEventListenersRef = useRef<naver.maps.MapEventListener[]>([]);
  const onPolylineDestroyRef = useRef<PolylineProps["onPolylineDestroy"]>(props.onPolylineDestroy);
  const targetMap = props.map ?? contextMap;

  useEffect(() => {
    onPolylineDestroyRef.current = props.onPolylineDestroy;
  }, [props.onPolylineDestroy]);

  const invokePolylineMethod = useCallback(
    <K extends keyof naver.maps.Polyline>(
      methodName: K,
      ...args: Parameters<Extract<naver.maps.Polyline[K], (...params: never[]) => unknown>>
    ): ReturnType<Extract<naver.maps.Polyline[K], (...params: never[]) => unknown>> | undefined => {
      const polyline = polylineRef.current;

      if (!polyline) {
        return undefined;
      }

      const method = polyline[methodName] as unknown;

      if (typeof method !== "function") {
        return undefined;
      }

      return (method as (...params: unknown[]) => unknown).apply(polyline, args) as ReturnType<
        Extract<naver.maps.Polyline[K], (...params: never[]) => unknown>
      >;
    },
    []
  );

  const teardownPolyline = useCallback(() => {
    const polyline = polylineRef.current;

    if (!polyline) {
      return;
    }

    try {
      removeOverlayEventListeners(polylineEventListenersRef.current);
      polylineEventListenersRef.current = [];
      naver.maps.Event.clearInstanceListeners(polyline);
    } catch (error) {
      console.error("[react-naver-maps-kit] failed to clear polyline listeners", error);
    }

    polyline.setMap(null);
    polylineRef.current = null;
    onPolylineDestroyRef.current?.();
  }, []);

  useImperativeHandle(
    ref,
    (): PolylineRef => ({
      getInstance: () => polylineRef.current,
      getBounds: (...args) => invokePolylineMethod("getBounds", ...args),
      getClickable: (...args) => invokePolylineMethod("getClickable", ...args),
      getDistance: (...args) => invokePolylineMethod("getDistance", ...args),
      getDrawingRect: (...args) => invokePolylineMethod("getDrawingRect", ...args),
      getElement: (...args) => invokePolylineMethod("getElement", ...args),
      getMap: (...args) => invokePolylineMethod("getMap", ...args),
      getOptions: (...args) => invokePolylineMethod("getOptions", ...args),
      getPanes: (...args) => invokePolylineMethod("getPanes", ...args),
      getPath: (...args) => invokePolylineMethod("getPath", ...args),
      getProjection: (...args) => invokePolylineMethod("getProjection", ...args),
      getStyles: (...args) => invokePolylineMethod("getStyles", ...args),
      getVisible: (...args) => invokePolylineMethod("getVisible", ...args),
      getZIndex: (...args) => invokePolylineMethod("getZIndex", ...args),
      setClickable: (...args) => invokePolylineMethod("setClickable", ...args),
      setMap: (...args) => invokePolylineMethod("setMap", ...args),
      setOptions: (...args) => invokePolylineMethod("setOptions", ...args),
      setPath: (...args) => invokePolylineMethod("setPath", ...args),
      setStyles: (...args) => invokePolylineMethod("setStyles", ...args),
      setVisible: (...args) => invokePolylineMethod("setVisible", ...args),
      setZIndex: (...args) => invokePolylineMethod("setZIndex", ...args)
    }),
    [invokePolylineMethod]
  );

  useEffect(() => {
    if (sdkStatus !== "ready" || !targetMap || polylineRef.current) {
      return;
    }

    try {
      const polyline = new naver.maps.Polyline(toPolylineOptions(props, targetMap));

      polylineRef.current = polyline;
      bindOverlayEventListeners(
        polyline,
        polylineEventListenersRef,
        buildPolylineEventBindings(props)
      );
      props.onPolylineReady?.(polyline);
    } catch (error) {
      const normalizedError =
        error instanceof Error
          ? error
          : new Error("Failed to create naver.maps.Polyline instance.");

      props.onPolylineError?.(normalizedError);
    }
  }, [props, sdkStatus, targetMap]);

  useEffect(() => {
    const polyline = polylineRef.current;

    if (!polyline || !targetMap) {
      return;
    }

    polyline.setOptions(toPolylineOptions(props, targetMap));
  }, [props, targetMap]);

  useEffect(() => {
    const polyline = polylineRef.current;

    if (!polyline) {
      return;
    }

    bindOverlayEventListeners(
      polyline,
      polylineEventListenersRef,
      buildPolylineEventBindings(props)
    );

    return () => {
      removeOverlayEventListeners(polylineEventListenersRef.current);
      polylineEventListenersRef.current = [];
    };
  }, [props]);

  useEffect(() => {
    return () => {
      teardownPolyline();
    };
  }, [teardownPolyline]);

  return null;
});

Polyline.displayName = "Polyline";
