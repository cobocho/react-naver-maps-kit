import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";

import { useNaverMap } from "../../react/hooks/useNaverMap";
import { bindOverlayEventListeners, removeOverlayEventListeners } from "../shared/overlayUtils";

type RectangleOptions = naver.maps.RectangleOptions;

interface RectangleOptionProps {
  map?: naver.maps.Map | null;
  bounds: RectangleOptions["bounds"];
  strokeWeight?: RectangleOptions["strokeWeight"];
  strokeOpacity?: RectangleOptions["strokeOpacity"];
  strokeColor?: RectangleOptions["strokeColor"];
  strokeStyle?: RectangleOptions["strokeStyle"];
  strokeLineCap?: RectangleOptions["strokeLineCap"];
  strokeLineJoin?: RectangleOptions["strokeLineJoin"];
  fillColor?: RectangleOptions["fillColor"];
  fillOpacity?: RectangleOptions["fillOpacity"];
  clickable?: RectangleOptions["clickable"];
  visible?: RectangleOptions["visible"];
  zIndex?: RectangleOptions["zIndex"];
}

interface RectangleLifecycleProps {
  onRectangleReady?: (rectangle: naver.maps.Rectangle) => void;
  onRectangleDestroy?: () => void;
  onRectangleError?: (error: Error) => void;
}

interface RectangleEventProps {
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
  onBoundsChanged?: (bounds: naver.maps.Bounds) => void;
  onClickableChanged?: (clickable: boolean) => void;
  onFillColorChanged?: (fillColor: string) => void;
  onFillOpacityChanged?: (fillOpacity: number) => void;
  onMapChanged?: (map: naver.maps.Map | null) => void;
  onStrokeColorChanged?: (strokeColor: string) => void;
  onStrokeLineCapChanged?: (strokeLineCap: naver.maps.StrokeLineCapType) => void;
  onStrokeLineJoinChanged?: (strokeLineJoin: naver.maps.StrokeLineJoinType) => void;
  onStrokeOpacityChanged?: (strokeOpacity: number) => void;
  onStrokeStyleChanged?: (strokeStyle: naver.maps.StrokeStyleType) => void;
  onStrokeWeightChanged?: (strokeWeight: number) => void;
  onVisibleChanged?: (visible: boolean) => void;
  onZIndexChanged?: (zIndex: number) => void;
}

export type RectangleProps = RectangleOptionProps & RectangleLifecycleProps & RectangleEventProps;

type RectangleMethod<K extends keyof naver.maps.Rectangle> = naver.maps.Rectangle[K] extends (
  ...args: infer A
) => infer R
  ? (...args: A) => R | undefined
  : never;

export interface RectangleRef {
  getInstance: () => naver.maps.Rectangle | null;
  getAreaSize: RectangleMethod<"getAreaSize">;
  getBounds: RectangleMethod<"getBounds">;
  getClickable: RectangleMethod<"getClickable">;
  getDrawingRect: RectangleMethod<"getDrawingRect">;
  getElement: RectangleMethod<"getElement">;
  getMap: RectangleMethod<"getMap">;
  getOptions: RectangleMethod<"getOptions">;
  getPanes: RectangleMethod<"getPanes">;
  getProjection: RectangleMethod<"getProjection">;
  getStyles: RectangleMethod<"getStyles">;
  getVisible: RectangleMethod<"getVisible">;
  getZIndex: RectangleMethod<"getZIndex">;
  setBounds: RectangleMethod<"setBounds">;
  setClickable: RectangleMethod<"setClickable">;
  setMap: RectangleMethod<"setMap">;
  setOptions: RectangleMethod<"setOptions">;
  setStyles: RectangleMethod<"setStyles">;
  setVisible: RectangleMethod<"setVisible">;
  setZIndex: RectangleMethod<"setZIndex">;
}

function toRectangleOptions(
  props: RectangleProps,
  targetMap: naver.maps.Map | null
): RectangleOptions {
  const options: RectangleOptions = {
    bounds: props.bounds
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

function buildRectangleEventBindings(props: RectangleProps) {
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
      eventName: "bounds_changed",
      invoke: props.onBoundsChanged
        ? (event: unknown) => props.onBoundsChanged?.(event as naver.maps.Bounds)
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

export const Rectangle = forwardRef<RectangleRef, RectangleProps>(
  function RectangleInner(props, ref) {
    const { map: contextMap, sdkStatus } = useNaverMap();
    const rectangleRef = useRef<naver.maps.Rectangle | null>(null);
    const rectangleEventListenersRef = useRef<naver.maps.MapEventListener[]>([]);
    const onRectangleDestroyRef = useRef<RectangleProps["onRectangleDestroy"]>(
      props.onRectangleDestroy
    );
    const targetMap = props.map ?? contextMap;

    useEffect(() => {
      onRectangleDestroyRef.current = props.onRectangleDestroy;
    }, [props.onRectangleDestroy]);

    const invokeRectangleMethod = useCallback(
      <K extends keyof naver.maps.Rectangle>(
        methodName: K,
        ...args: Parameters<Extract<naver.maps.Rectangle[K], (...params: never[]) => unknown>>
      ):
        | ReturnType<Extract<naver.maps.Rectangle[K], (...params: never[]) => unknown>>
        | undefined => {
        const rectangle = rectangleRef.current;

        if (!rectangle) {
          return undefined;
        }

        const method = rectangle[methodName] as unknown;

        if (typeof method !== "function") {
          return undefined;
        }

        return (method as (...params: unknown[]) => unknown).apply(rectangle, args) as ReturnType<
          Extract<naver.maps.Rectangle[K], (...params: never[]) => unknown>
        >;
      },
      []
    );

    const teardownRectangle = useCallback(() => {
      const rectangle = rectangleRef.current;

      if (!rectangle) {
        return;
      }

      try {
        removeOverlayEventListeners(rectangleEventListenersRef.current);
        rectangleEventListenersRef.current = [];
        naver.maps.Event.clearInstanceListeners(rectangle);
      } catch (error) {
        console.error("[react-naver-maps-kit] failed to clear rectangle listeners", error);
      }

      rectangle.setMap(null);
      rectangleRef.current = null;
      onRectangleDestroyRef.current?.();
    }, []);

    useImperativeHandle(
      ref,
      (): RectangleRef => ({
        getInstance: () => rectangleRef.current,
        getAreaSize: (...args) => invokeRectangleMethod("getAreaSize", ...args),
        getBounds: (...args) => invokeRectangleMethod("getBounds", ...args),
        getClickable: (...args) => invokeRectangleMethod("getClickable", ...args),
        getDrawingRect: (...args) => invokeRectangleMethod("getDrawingRect", ...args),
        getElement: (...args) => invokeRectangleMethod("getElement", ...args),
        getMap: (...args) => invokeRectangleMethod("getMap", ...args),
        getOptions: (...args) => invokeRectangleMethod("getOptions", ...args),
        getPanes: (...args) => invokeRectangleMethod("getPanes", ...args),
        getProjection: (...args) => invokeRectangleMethod("getProjection", ...args),
        getStyles: (...args) => invokeRectangleMethod("getStyles", ...args),
        getVisible: (...args) => invokeRectangleMethod("getVisible", ...args),
        getZIndex: (...args) => invokeRectangleMethod("getZIndex", ...args),
        setBounds: (...args) => invokeRectangleMethod("setBounds", ...args),
        setClickable: (...args) => invokeRectangleMethod("setClickable", ...args),
        setMap: (...args) => invokeRectangleMethod("setMap", ...args),
        setOptions: (...args) => invokeRectangleMethod("setOptions", ...args),
        setStyles: (...args) => invokeRectangleMethod("setStyles", ...args),
        setVisible: (...args) => invokeRectangleMethod("setVisible", ...args),
        setZIndex: (...args) => invokeRectangleMethod("setZIndex", ...args)
      }),
      [invokeRectangleMethod]
    );

    useEffect(() => {
      if (sdkStatus !== "ready" || !targetMap || rectangleRef.current) {
        return;
      }

      try {
        const rectangle = new naver.maps.Rectangle(toRectangleOptions(props, targetMap));

        rectangleRef.current = rectangle;
        bindOverlayEventListeners(
          rectangle,
          rectangleEventListenersRef,
          buildRectangleEventBindings(props)
        );
        props.onRectangleReady?.(rectangle);
      } catch (error) {
        const normalizedError =
          error instanceof Error
            ? error
            : new Error("Failed to create naver.maps.Rectangle instance.");

        props.onRectangleError?.(normalizedError);
      }
    }, [props, sdkStatus, targetMap]);

    useEffect(() => {
      const rectangle = rectangleRef.current;

      if (!rectangle || !targetMap) {
        return;
      }

      rectangle.setOptions(toRectangleOptions(props, targetMap));
    }, [props, targetMap]);

    useEffect(() => {
      const rectangle = rectangleRef.current;

      if (!rectangle) {
        return;
      }

      bindOverlayEventListeners(
        rectangle,
        rectangleEventListenersRef,
        buildRectangleEventBindings(props)
      );

      return () => {
        removeOverlayEventListeners(rectangleEventListenersRef.current);
        rectangleEventListenersRef.current = [];
      };
    }, [props]);

    useEffect(() => {
      return () => {
        teardownRectangle();
      };
    }, [teardownRectangle]);

    return null;
  }
);

Rectangle.displayName = "Rectangle";
