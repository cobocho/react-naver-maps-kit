import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";

import { useNaverMap } from "../../react/hooks/useNaverMap";
import { useMapInstance } from "../../react/context/MapInstanceContext";
import { bindOverlayEventListeners, removeOverlayEventListeners } from "../shared/overlayUtils";

type GroundOverlayOptions = naver.maps.GroundOverlayOptions;

interface GroundOverlayOptionProps {
  map?: naver.maps.Map | null;
  url: string;
  bounds: naver.maps.Bounds | naver.maps.BoundsLiteral;
  clickable?: GroundOverlayOptions["clickable"];
  opacity?: GroundOverlayOptions["opacity"];
}

interface GroundOverlayLifecycleProps {
  onGroundOverlayReady?: (groundOverlay: naver.maps.GroundOverlay) => void;
  onGroundOverlayDestroy?: () => void;
  onGroundOverlayError?: (error: Error) => void;
}

interface GroundOverlayEventProps {
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
  onMapChanged?: (map: naver.maps.Map | null) => void;
  onOpacityChanged?: (opacity: number) => void;
}

export type GroundOverlayProps = GroundOverlayOptionProps &
  GroundOverlayLifecycleProps &
  GroundOverlayEventProps;

type GroundOverlayMethod<K extends keyof naver.maps.GroundOverlay> =
  naver.maps.GroundOverlay[K] extends (...args: infer A) => infer R
    ? (...args: A) => R | undefined
    : never;

export interface GroundOverlayRef {
  getInstance: () => naver.maps.GroundOverlay | null;
  getBounds: GroundOverlayMethod<"getBounds">;
  getMap: GroundOverlayMethod<"getMap">;
  getOpacity: GroundOverlayMethod<"getOpacity">;
  getPanes: GroundOverlayMethod<"getPanes">;
  getProjection: GroundOverlayMethod<"getProjection">;
  getUrl: GroundOverlayMethod<"getUrl">;
  setMap: GroundOverlayMethod<"setMap">;
  setOpacity: GroundOverlayMethod<"setOpacity">;
  setUrl: (url: string) => void | undefined;
}

function toGroundOverlayOptions(
  props: GroundOverlayProps,
  targetMap: naver.maps.Map | null
): GroundOverlayOptions {
  const options: GroundOverlayOptions = {};

  if (targetMap) {
    options.map = targetMap;
  }

  if (props.clickable !== undefined) {
    options.clickable = props.clickable;
  }

  if (props.opacity !== undefined) {
    options.opacity = props.opacity;
  }

  return options;
}

function buildGroundOverlayEventBindings(props: GroundOverlayProps) {
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
      eventName: "map_changed",
      invoke: props.onMapChanged
        ? (event: unknown) => props.onMapChanged?.(event as naver.maps.Map | null)
        : undefined
    },
    {
      eventName: "opacity_changed",
      invoke: props.onOpacityChanged
        ? (event: unknown) => props.onOpacityChanged?.(event as number)
        : undefined
    }
  ];
}

export const GroundOverlay = forwardRef<GroundOverlayRef, GroundOverlayProps>(
  function GroundOverlayInner(props, ref) {
    const { sdkStatus } = useNaverMap();
    const mapInstanceContext = useMapInstance();
    const contextMap = mapInstanceContext?.instance as naver.maps.Map | null;
    
    const groundOverlayRef = useRef<naver.maps.GroundOverlay | null>(null);
    const groundOverlayEventListenersRef = useRef<naver.maps.MapEventListener[]>([]);
    const onGroundOverlayDestroyRef = useRef<GroundOverlayProps["onGroundOverlayDestroy"]>(
      props.onGroundOverlayDestroy
    );
    const targetMap = props.map ?? contextMap;

    useEffect(() => {
      onGroundOverlayDestroyRef.current = props.onGroundOverlayDestroy;
    }, [props.onGroundOverlayDestroy]);

    const invokeGroundOverlayMethod = useCallback(
      <K extends keyof naver.maps.GroundOverlay>(
        methodName: K,
        ...args: Parameters<Extract<naver.maps.GroundOverlay[K], (...params: never[]) => unknown>>
      ):
        | ReturnType<Extract<naver.maps.GroundOverlay[K], (...params: never[]) => unknown>>
        | undefined => {
        const groundOverlay = groundOverlayRef.current;

        if (!groundOverlay) {
          return undefined;
        }

        const method = groundOverlay[methodName] as unknown;

        if (typeof method !== "function") {
          return undefined;
        }

        return (method as (...params: unknown[]) => unknown).apply(
          groundOverlay,
          args
        ) as ReturnType<Extract<naver.maps.GroundOverlay[K], (...params: never[]) => unknown>>;
      },
      []
    );

    const teardownGroundOverlay = useCallback(() => {
      const groundOverlay = groundOverlayRef.current;

      if (!groundOverlay) {
        return;
      }

      try {
        removeOverlayEventListeners(groundOverlayEventListenersRef.current);
        groundOverlayEventListenersRef.current = [];
        naver.maps.Event.clearInstanceListeners(groundOverlay);
      } catch (error) {
        console.error("[react-naver-maps-kit] failed to clear ground overlay listeners", error);
      }

      groundOverlay.setMap(null);
      groundOverlayRef.current = null;
      onGroundOverlayDestroyRef.current?.();
    }, []);

    useImperativeHandle(
      ref,
      (): GroundOverlayRef => ({
        getInstance: () => groundOverlayRef.current,
        getBounds: (...args) => invokeGroundOverlayMethod("getBounds", ...args),
        getMap: (...args) => invokeGroundOverlayMethod("getMap", ...args),
        getOpacity: (...args) => invokeGroundOverlayMethod("getOpacity", ...args),
        getPanes: (...args) => invokeGroundOverlayMethod("getPanes", ...args),
        getProjection: (...args) => invokeGroundOverlayMethod("getProjection", ...args),
        getUrl: (...args) => invokeGroundOverlayMethod("getUrl", ...args),
        setMap: (...args) => invokeGroundOverlayMethod("setMap", ...args),
        setOpacity: (...args) => invokeGroundOverlayMethod("setOpacity", ...args),
        setUrl: (url: string) => {
          const groundOverlay = groundOverlayRef.current;
          if (!groundOverlay) return undefined;
          // setUrl exists in the official API but may not be in TypeScript types
          const overlay = groundOverlay as naver.maps.GroundOverlay & {
            setUrl?: (url: string) => void;
          };
          overlay.setUrl?.(url);
        }
      }),
      [invokeGroundOverlayMethod]
    );

    useEffect(() => {
      if (sdkStatus !== "ready" || !targetMap || groundOverlayRef.current) {
        return;
      }

      try {
        const groundOverlay = new naver.maps.GroundOverlay(
          props.url,
          props.bounds,
          toGroundOverlayOptions(props, targetMap)
        );

        groundOverlayRef.current = groundOverlay;
        bindOverlayEventListeners(
          groundOverlay,
          groundOverlayEventListenersRef,
          buildGroundOverlayEventBindings(props)
        );
        props.onGroundOverlayReady?.(groundOverlay);
      } catch (error) {
        const normalizedError =
          error instanceof Error
            ? error
            : new Error("Failed to create naver.maps.GroundOverlay instance.");

        props.onGroundOverlayError?.(normalizedError);
      }
    }, [props, sdkStatus, targetMap]);

    useEffect(() => {
      const groundOverlay = groundOverlayRef.current;

      if (!groundOverlay || !targetMap) {
        return;
      }

      groundOverlay.setMap(targetMap);

      if (props.opacity !== undefined) {
        groundOverlay.setOpacity(props.opacity);
      }

      const optionsSettable = groundOverlay as naver.maps.GroundOverlay & {
        setOptions?: (options: GroundOverlayOptions) => void;
      };

      optionsSettable.setOptions?.(toGroundOverlayOptions(props, targetMap));
    }, [props, targetMap]);

    useEffect(() => {
      const groundOverlay = groundOverlayRef.current;

      if (!groundOverlay) {
        return;
      }

      bindOverlayEventListeners(
        groundOverlay,
        groundOverlayEventListenersRef,
        buildGroundOverlayEventBindings(props)
      );

      return () => {
        removeOverlayEventListeners(groundOverlayEventListenersRef.current);
        groundOverlayEventListenersRef.current = [];
      };
    }, [props]);

    useEffect(() => {
      return () => {
        teardownGroundOverlay();
      };
    }, [teardownGroundOverlay]);

    return null;
  }
);

GroundOverlay.displayName = "GroundOverlay";
