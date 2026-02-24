import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";

import { useMapInstance } from "../../react/context/MapInstanceContext";
import { useNaverMap } from "../../react/hooks/useNaverMap";
import { bindOverlayEventListeners, removeOverlayEventListeners } from "../shared/overlayUtils";

type CircleOptions = naver.maps.CircleOptions;

interface CircleOptionProps {
  map?: naver.maps.Map | null;
  center: CircleOptions["center"];
  radius?: CircleOptions["radius"];
  strokeWeight?: CircleOptions["strokeWeight"];
  strokeOpacity?: CircleOptions["strokeOpacity"];
  strokeColor?: CircleOptions["strokeColor"];
  strokeStyle?: CircleOptions["strokeStyle"];
  strokeLineCap?: CircleOptions["strokeLineCap"];
  strokeLineJoin?: CircleOptions["strokeLineJoin"];
  fillColor?: CircleOptions["fillColor"];
  fillOpacity?: CircleOptions["fillOpacity"];
  clickable?: CircleOptions["clickable"];
  visible?: CircleOptions["visible"];
  zIndex?: CircleOptions["zIndex"];
}

interface CircleLifecycleProps {
  onCircleReady?: (circle: naver.maps.Circle) => void;
  onCircleDestroy?: () => void;
  onCircleError?: (error: Error) => void;
}

interface CircleEventProps {
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
  onCenterChanged?: (center: naver.maps.Coord) => void;
  onClickableChanged?: (clickable: boolean) => void;
  onFillColorChanged?: (fillColor: string) => void;
  onFillOpacityChanged?: (fillOpacity: number) => void;
  onMapChanged?: (map: naver.maps.Map | null) => void;
  onRadiusChanged?: (radius: number) => void;
  onStrokeColorChanged?: (strokeColor: string) => void;
  onStrokeLineCapChanged?: (strokeLineCap: naver.maps.StrokeLineCapType) => void;
  onStrokeLineJoinChanged?: (strokeLineJoin: naver.maps.StrokeLineJoinType) => void;
  onStrokeOpacityChanged?: (strokeOpacity: number) => void;
  onStrokeStyleChanged?: (strokeStyle: naver.maps.StrokeStyleType) => void;
  onStrokeWeightChanged?: (strokeWeight: number) => void;
  onVisibleChanged?: (visible: boolean) => void;
  onZIndexChanged?: (zIndex: number) => void;
}

export type CircleProps = CircleOptionProps & CircleLifecycleProps & CircleEventProps;

type CircleMethod<K extends keyof naver.maps.Circle> = naver.maps.Circle[K] extends (
  ...args: infer A
) => infer R
  ? (...args: A) => R | undefined
  : never;

export interface CircleRef {
  getInstance: () => naver.maps.Circle | null;
  getAreaSize: CircleMethod<"getAreaSize">;
  getBounds: CircleMethod<"getBounds">;
  getCenter: CircleMethod<"getCenter">;
  getClickable: CircleMethod<"getClickable">;
  getDrawingRect: CircleMethod<"getDrawingRect">;
  getElement: CircleMethod<"getElement">;
  getMap: CircleMethod<"getMap">;
  getOptions: CircleMethod<"getOptions">;
  getPanes: CircleMethod<"getPanes">;
  getProjection: CircleMethod<"getProjection">;
  getRadius: CircleMethod<"getRadius">;
  getStyles: CircleMethod<"getStyles">;
  getVisible: CircleMethod<"getVisible">;
  getZIndex: CircleMethod<"getZIndex">;
  setCenter: CircleMethod<"setCenter">;
  setClickable: CircleMethod<"setClickable">;
  setMap: CircleMethod<"setMap">;
  setOptions: CircleMethod<"setOptions">;
  setRadius: CircleMethod<"setRadius">;
  setStyles: CircleMethod<"setStyles">;
  setVisible: CircleMethod<"setVisible">;
  setZIndex: CircleMethod<"setZIndex">;
}

function toCircleOptions(props: CircleProps, targetMap: naver.maps.Map | null): CircleOptions {
  const options: CircleOptions = {
    center: props.center
  };

  if (targetMap) {
    options.map = targetMap;
  }

  if (props.radius !== undefined) {
    options.radius = props.radius;
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

function buildCircleEventBindings(props: CircleProps) {
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
      eventName: "center_changed",
      invoke: props.onCenterChanged
        ? (event: unknown) => props.onCenterChanged?.(event as naver.maps.Coord)
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
      eventName: "radius_changed",
      invoke: props.onRadiusChanged
        ? (event: unknown) => props.onRadiusChanged?.(event as number)
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

export const Circle = forwardRef<CircleRef, CircleProps>(function CircleInner(props, ref) {
  const { sdkStatus } = useNaverMap();
  const mapInstanceContext = useMapInstance();
  const contextMap = mapInstanceContext?.instance as naver.maps.Map | null;

  const circleRef = useRef<naver.maps.Circle | null>(null);
  const circleEventListenersRef = useRef<naver.maps.MapEventListener[]>([]);
  const onCircleDestroyRef = useRef<CircleProps["onCircleDestroy"]>(props.onCircleDestroy);
  const targetMap = props.map ?? contextMap;

  useEffect(() => {
    onCircleDestroyRef.current = props.onCircleDestroy;
  }, [props.onCircleDestroy]);

  const invokeCircleMethod = useCallback(
    <K extends keyof naver.maps.Circle>(
      methodName: K,
      ...args: Parameters<Extract<naver.maps.Circle[K], (...params: never[]) => unknown>>
    ): ReturnType<Extract<naver.maps.Circle[K], (...params: never[]) => unknown>> | undefined => {
      const circle = circleRef.current;

      if (!circle) {
        return undefined;
      }

      const method = circle[methodName] as unknown;

      if (typeof method !== "function") {
        return undefined;
      }

      return (method as (...params: unknown[]) => unknown).apply(circle, args) as ReturnType<
        Extract<naver.maps.Circle[K], (...params: never[]) => unknown>
      >;
    },
    []
  );

  const teardownCircle = useCallback(() => {
    const circle = circleRef.current;

    if (!circle) {
      return;
    }

    try {
      removeOverlayEventListeners(circleEventListenersRef.current);
      circleEventListenersRef.current = [];
      naver.maps.Event.clearInstanceListeners(circle);
    } catch (error) {
      console.error("[react-naver-maps-kit] failed to clear circle listeners", error);
    }

    circle.setMap(null);
    circleRef.current = null;
    onCircleDestroyRef.current?.();
  }, []);

  useImperativeHandle(
    ref,
    (): CircleRef => ({
      getInstance: () => circleRef.current,
      getAreaSize: (...args) => invokeCircleMethod("getAreaSize", ...args),
      getBounds: (...args) => invokeCircleMethod("getBounds", ...args),
      getCenter: (...args) => invokeCircleMethod("getCenter", ...args),
      getClickable: (...args) => invokeCircleMethod("getClickable", ...args),
      getDrawingRect: (...args) => invokeCircleMethod("getDrawingRect", ...args),
      getElement: (...args) => invokeCircleMethod("getElement", ...args),
      getMap: (...args) => invokeCircleMethod("getMap", ...args),
      getOptions: (...args) => invokeCircleMethod("getOptions", ...args),
      getPanes: (...args) => invokeCircleMethod("getPanes", ...args),
      getProjection: (...args) => invokeCircleMethod("getProjection", ...args),
      getRadius: (...args) => invokeCircleMethod("getRadius", ...args),
      getStyles: (...args) => invokeCircleMethod("getStyles", ...args),
      getVisible: (...args) => invokeCircleMethod("getVisible", ...args),
      getZIndex: (...args) => invokeCircleMethod("getZIndex", ...args),
      setCenter: (...args) => invokeCircleMethod("setCenter", ...args),
      setClickable: (...args) => invokeCircleMethod("setClickable", ...args),
      setMap: (...args) => invokeCircleMethod("setMap", ...args),
      setOptions: (...args) => invokeCircleMethod("setOptions", ...args),
      setRadius: (...args) => invokeCircleMethod("setRadius", ...args),
      setStyles: (...args) => invokeCircleMethod("setStyles", ...args),
      setVisible: (...args) => invokeCircleMethod("setVisible", ...args),
      setZIndex: (...args) => invokeCircleMethod("setZIndex", ...args)
    }),
    [invokeCircleMethod]
  );

  useEffect(() => {
    if (sdkStatus !== "ready" || !targetMap || circleRef.current) {
      return;
    }

    try {
      const circle = new naver.maps.Circle(toCircleOptions(props, targetMap));

      circleRef.current = circle;
      bindOverlayEventListeners(circle, circleEventListenersRef, buildCircleEventBindings(props));
      props.onCircleReady?.(circle);
    } catch (error) {
      const normalizedError =
        error instanceof Error ? error : new Error("Failed to create naver.maps.Circle instance.");

      props.onCircleError?.(normalizedError);
    }
  }, [props, sdkStatus, targetMap]);

  useEffect(() => {
    const circle = circleRef.current;

    if (!circle || !targetMap) {
      return;
    }

    circle.setOptions(toCircleOptions(props, targetMap));
  }, [props, targetMap]);

  useEffect(() => {
    const circle = circleRef.current;

    if (!circle) {
      return;
    }

    bindOverlayEventListeners(circle, circleEventListenersRef, buildCircleEventBindings(props));

    return () => {
      removeOverlayEventListeners(circleEventListenersRef.current);
      circleEventListenersRef.current = [];
    };
  }, [props]);

  useEffect(() => {
    return () => {
      teardownCircle();
    };
  }, [teardownCircle]);

  return null;
});

Circle.displayName = "Circle";
