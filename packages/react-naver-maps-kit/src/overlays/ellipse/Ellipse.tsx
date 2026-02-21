import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";

import { useNaverMap } from "../../react/hooks/useNaverMap";
import { bindOverlayEventListeners, removeOverlayEventListeners } from "../shared/overlayUtils";

type EllipseOptions = naver.maps.EllipseOptions;

interface EllipseOptionProps {
  map?: naver.maps.Map | null;
  bounds: EllipseOptions["bounds"];
  strokeWeight?: EllipseOptions["strokeWeight"];
  strokeOpacity?: EllipseOptions["strokeOpacity"];
  strokeColor?: EllipseOptions["strokeColor"];
  strokeStyle?: EllipseOptions["strokeStyle"];
  strokeLineCap?: EllipseOptions["strokeLineCap"];
  strokeLineJoin?: EllipseOptions["strokeLineJoin"];
  fillColor?: EllipseOptions["fillColor"];
  fillOpacity?: EllipseOptions["fillOpacity"];
  clickable?: EllipseOptions["clickable"];
  visible?: EllipseOptions["visible"];
  zIndex?: EllipseOptions["zIndex"];
}

interface EllipseLifecycleProps {
  onEllipseReady?: (ellipse: naver.maps.Ellipse) => void;
  onEllipseDestroy?: () => void;
  onEllipseError?: (error: Error) => void;
}

interface EllipseEventProps {
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

export type EllipseProps = EllipseOptionProps & EllipseLifecycleProps & EllipseEventProps;

type EllipseMethod<K extends keyof naver.maps.Ellipse> = naver.maps.Ellipse[K] extends (
  ...args: infer A
) => infer R
  ? (...args: A) => R | undefined
  : never;

export interface EllipseRef {
  getInstance: () => naver.maps.Ellipse | null;
  getAreaSize: EllipseMethod<"getAreaSize">;
  getBounds: EllipseMethod<"getBounds">;
  getClickable: EllipseMethod<"getClickable">;
  getDrawingRect: EllipseMethod<"getDrawingRect">;
  getElement: EllipseMethod<"getElement">;
  getMap: EllipseMethod<"getMap">;
  getOptions: EllipseMethod<"getOptions">;
  getPanes: EllipseMethod<"getPanes">;
  getProjection: EllipseMethod<"getProjection">;
  getStyles: EllipseMethod<"getStyles">;
  getVisible: EllipseMethod<"getVisible">;
  getZIndex: EllipseMethod<"getZIndex">;
  setBounds: EllipseMethod<"setBounds">;
  setClickable: EllipseMethod<"setClickable">;
  setMap: EllipseMethod<"setMap">;
  setOptions: EllipseMethod<"setOptions">;
  setStyles: EllipseMethod<"setStyles">;
  setVisible: EllipseMethod<"setVisible">;
  setZIndex: EllipseMethod<"setZIndex">;
}

function toEllipseOptions(props: EllipseProps, targetMap: naver.maps.Map | null): EllipseOptions {
  const options: EllipseOptions = {
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

function buildEllipseEventBindings(props: EllipseProps) {
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

export const Ellipse = forwardRef<EllipseRef, EllipseProps>(function EllipseInner(props, ref) {
  const { map: contextMap, sdkStatus } = useNaverMap();
  const ellipseRef = useRef<naver.maps.Ellipse | null>(null);
  const ellipseEventListenersRef = useRef<naver.maps.MapEventListener[]>([]);
  const onEllipseDestroyRef = useRef<EllipseProps["onEllipseDestroy"]>(props.onEllipseDestroy);
  const targetMap = props.map ?? contextMap;

  useEffect(() => {
    onEllipseDestroyRef.current = props.onEllipseDestroy;
  }, [props.onEllipseDestroy]);

  const invokeEllipseMethod = useCallback(
    <K extends keyof naver.maps.Ellipse>(
      methodName: K,
      ...args: Parameters<Extract<naver.maps.Ellipse[K], (...params: never[]) => unknown>>
    ): ReturnType<Extract<naver.maps.Ellipse[K], (...params: never[]) => unknown>> | undefined => {
      const ellipse = ellipseRef.current;

      if (!ellipse) {
        return undefined;
      }

      const method = ellipse[methodName] as unknown;

      if (typeof method !== "function") {
        return undefined;
      }

      return (method as (...params: unknown[]) => unknown).apply(ellipse, args) as ReturnType<
        Extract<naver.maps.Ellipse[K], (...params: never[]) => unknown>
      >;
    },
    []
  );

  const teardownEllipse = useCallback(() => {
    const ellipse = ellipseRef.current;

    if (!ellipse) {
      return;
    }

    try {
      removeOverlayEventListeners(ellipseEventListenersRef.current);
      ellipseEventListenersRef.current = [];
      naver.maps.Event.clearInstanceListeners(ellipse);
    } catch (error) {
      console.error("[react-naver-maps-kit] failed to clear ellipse listeners", error);
    }

    ellipse.setMap(null);
    ellipseRef.current = null;
    onEllipseDestroyRef.current?.();
  }, []);

  useImperativeHandle(
    ref,
    (): EllipseRef => ({
      getInstance: () => ellipseRef.current,
      getAreaSize: (...args) => invokeEllipseMethod("getAreaSize", ...args),
      getBounds: (...args) => invokeEllipseMethod("getBounds", ...args),
      getClickable: (...args) => invokeEllipseMethod("getClickable", ...args),
      getDrawingRect: (...args) => invokeEllipseMethod("getDrawingRect", ...args),
      getElement: (...args) => invokeEllipseMethod("getElement", ...args),
      getMap: (...args) => invokeEllipseMethod("getMap", ...args),
      getOptions: (...args) => invokeEllipseMethod("getOptions", ...args),
      getPanes: (...args) => invokeEllipseMethod("getPanes", ...args),
      getProjection: (...args) => invokeEllipseMethod("getProjection", ...args),
      getStyles: (...args) => invokeEllipseMethod("getStyles", ...args),
      getVisible: (...args) => invokeEllipseMethod("getVisible", ...args),
      getZIndex: (...args) => invokeEllipseMethod("getZIndex", ...args),
      setBounds: (...args) => invokeEllipseMethod("setBounds", ...args),
      setClickable: (...args) => invokeEllipseMethod("setClickable", ...args),
      setMap: (...args) => invokeEllipseMethod("setMap", ...args),
      setOptions: (...args) => invokeEllipseMethod("setOptions", ...args),
      setStyles: (...args) => invokeEllipseMethod("setStyles", ...args),
      setVisible: (...args) => invokeEllipseMethod("setVisible", ...args),
      setZIndex: (...args) => invokeEllipseMethod("setZIndex", ...args)
    }),
    [invokeEllipseMethod]
  );

  useEffect(() => {
    if (sdkStatus !== "ready" || !targetMap || ellipseRef.current) {
      return;
    }

    try {
      const ellipse = new naver.maps.Ellipse(toEllipseOptions(props, targetMap));

      ellipseRef.current = ellipse;
      bindOverlayEventListeners(
        ellipse,
        ellipseEventListenersRef,
        buildEllipseEventBindings(props)
      );
      props.onEllipseReady?.(ellipse);
    } catch (error) {
      const normalizedError =
        error instanceof Error ? error : new Error("Failed to create naver.maps.Ellipse instance.");

      props.onEllipseError?.(normalizedError);
    }
  }, [props, sdkStatus, targetMap]);

  useEffect(() => {
    const ellipse = ellipseRef.current;

    if (!ellipse || !targetMap) {
      return;
    }

    ellipse.setOptions(toEllipseOptions(props, targetMap));
  }, [props, targetMap]);

  useEffect(() => {
    const ellipse = ellipseRef.current;

    if (!ellipse) {
      return;
    }

    bindOverlayEventListeners(ellipse, ellipseEventListenersRef, buildEllipseEventBindings(props));

    return () => {
      removeOverlayEventListeners(ellipseEventListenersRef.current);
      ellipseEventListenersRef.current = [];
    };
  }, [props]);

  useEffect(() => {
    return () => {
      teardownEllipse();
    };
  }, [teardownEllipse]);

  return null;
});

Ellipse.displayName = "Ellipse";
