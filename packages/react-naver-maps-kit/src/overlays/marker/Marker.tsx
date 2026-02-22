import {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import { createPortal } from "react-dom";

import { useNaverMap } from "../../react/hooks/useNaverMap";
import { ClustererContext } from "../marker-clusterer/ClustererContext";

import type { ReactNode, ReactPortal } from "react";

type MarkerOptions = naver.maps.MarkerOptions;
type MarkerIcon = NonNullable<MarkerOptions["icon"]>;
type MarkerIconObject = Exclude<MarkerIcon, string>;

interface MarkerOverlayProps {
  map?: naver.maps.Map | null;
  position: MarkerOptions["position"];
  icon?: MarkerOptions["icon"];
  animation?: MarkerOptions["animation"];
  shape?: MarkerOptions["shape"];
  title?: MarkerOptions["title"];
  cursor?: MarkerOptions["cursor"];
  clickable?: MarkerOptions["clickable"];
  draggable?: MarkerOptions["draggable"];
  visible?: MarkerOptions["visible"];
  zIndex?: MarkerOptions["zIndex"];
  collisionBehavior?: boolean;
  collisionBoxSize?: naver.maps.Size | naver.maps.SizeLiteral;

  /** Used by MarkerClusterer to identify this marker. Falls back to React key if not provided. */
  clustererItemId?: string | number;
  /** Data object passed to MarkerClusterer's algorithm via registry. */
  item?: unknown;
}

interface MarkerLifecycleProps {
  children?: ReactNode;
  onMarkerReady?: (marker: naver.maps.Marker) => void;
  onMarkerDestroy?: () => void;
  onMarkerError?: (error: Error) => void;
}

interface MarkerEventProps {
  onClick?: (event: naver.maps.PointerEvent) => void;
  onDblClick?: (event: naver.maps.PointerEvent) => void;
  onRightClick?: (event: naver.maps.PointerEvent) => void;
  onMouseDown?: (event: naver.maps.PointerEvent) => void;
  onMouseUp?: (event: naver.maps.PointerEvent) => void;
  onTouchStart?: (event: naver.maps.PointerEvent) => void;
  onTouchEnd?: (event: naver.maps.PointerEvent) => void;
  onDragStart?: (event: naver.maps.PointerEvent) => void;
  onDrag?: (event: naver.maps.PointerEvent) => void;
  onDragEnd?: (event: naver.maps.PointerEvent) => void;
  onClickableChanged?: (clickable: boolean) => void;
  onCursorChanged?: (cursor: string) => void;
  onDraggableChanged?: (draggable: boolean) => void;
  onIconChanged?: (
    icon: string | naver.maps.ImageIcon | naver.maps.SymbolIcon | naver.maps.HtmlIcon
  ) => void;
  onIconLoaded?: (marker: naver.maps.Marker) => void;
  onPositionChanged?: (position: naver.maps.Coord) => void;
  onShapeChanged?: (shape: naver.maps.MarkerShape) => void;
  onTitleChanged?: (title: string) => void;
  onVisibleChanged?: (visible: boolean) => void;
  onZIndexChanged?: (zIndex: number) => void;
}

export type MarkerProps = MarkerOverlayProps & MarkerLifecycleProps & MarkerEventProps;

type MarkerMethod<K extends keyof naver.maps.Marker> = naver.maps.Marker[K] extends (
  ...args: infer A
) => infer R
  ? (...args: A) => R | undefined
  : never;

export interface MarkerRef {
  getInstance: () => naver.maps.Marker | null;
  getAnimation: MarkerMethod<"getAnimation">;
  getClickable: MarkerMethod<"getClickable">;
  getCursor: MarkerMethod<"getCursor">;
  getDraggable: MarkerMethod<"getDraggable">;
  getDrawingRect: MarkerMethod<"getDrawingRect">;
  getElement: MarkerMethod<"getElement">;
  getIcon: MarkerMethod<"getIcon">;
  getMap: MarkerMethod<"getMap">;
  getOptions: MarkerMethod<"getOptions">;
  getPanes: MarkerMethod<"getPanes">;
  getPosition: MarkerMethod<"getPosition">;
  getProjection: MarkerMethod<"getProjection">;
  getShape: MarkerMethod<"getShape">;
  getTitle: MarkerMethod<"getTitle">;
  getVisible: MarkerMethod<"getVisible">;
  getZIndex: MarkerMethod<"getZIndex">;
  setAnimation: MarkerMethod<"setAnimation">;
  setClickable: MarkerMethod<"setClickable">;
  setCursor: MarkerMethod<"setCursor">;
  setDraggable: MarkerMethod<"setDraggable">;
  setIcon: MarkerMethod<"setIcon">;
  setMap: MarkerMethod<"setMap">;
  setOptions: MarkerMethod<"setOptions">;
  setPosition: MarkerMethod<"setPosition">;
  setShape: MarkerMethod<"setShape">;
  setTitle: MarkerMethod<"setTitle">;
  setVisible: MarkerMethod<"setVisible">;
  setZIndex: MarkerMethod<"setZIndex">;
}

interface MarkerEventBinding {
  eventName: string;
  invoke?: (event: unknown) => void;
}

function pickHtmlIconAnchor(icon: MarkerIconObject): naver.maps.HtmlIcon["anchor"] | undefined {
  if ("anchor" in icon) {
    return icon.anchor;
  }

  return undefined;
}

function pickHtmlIconSize(icon: MarkerIconObject): naver.maps.HtmlIcon["size"] | undefined {
  if ("size" in icon) {
    return icon.size;
  }

  return undefined;
}

function resolveMarkerIcon(
  icon: MarkerOptions["icon"],
  childrenContainer: HTMLDivElement | null,
  hasChildren: boolean
): MarkerOptions["icon"] {
  if (!hasChildren || !childrenContainer) {
    return icon;
  }

  const iconObject = typeof icon === "object" && icon !== null ? icon : undefined;

  return {
    content: childrenContainer,
    anchor: iconObject ? pickHtmlIconAnchor(iconObject) : undefined,
    size: iconObject ? pickHtmlIconSize(iconObject) : undefined
  };
}

function toMarkerOptions(
  props: MarkerProps,
  targetMap: naver.maps.Map | null,
  icon: MarkerOptions["icon"]
): MarkerOptions {
  const options: MarkerOptions = {
    position: props.position,
    icon
  };

  if (targetMap) {
    options.map = targetMap;
  }

  if (props.animation !== undefined) {
    options.animation = props.animation;
  }

  if (props.shape !== undefined) {
    options.shape = props.shape;
  }

  if (props.title !== undefined) {
    options.title = props.title;
  }

  if (props.cursor !== undefined) {
    options.cursor = props.cursor;
  }

  if (props.clickable !== undefined) {
    options.clickable = props.clickable;
  }

  if (props.draggable !== undefined) {
    options.draggable = props.draggable;
  }

  if (props.visible !== undefined) {
    options.visible = props.visible;
  }

  if (props.zIndex !== undefined) {
    options.zIndex = props.zIndex;
  }

  return options;
}

function buildMarkerEventBindings(props: MarkerProps): MarkerEventBinding[] {
  return [
    {
      eventName: "click",
      invoke: props.onClick
        ? (event) => props.onClick?.(event as naver.maps.PointerEvent)
        : undefined
    },
    {
      eventName: "dblclick",
      invoke: props.onDblClick
        ? (event) => props.onDblClick?.(event as naver.maps.PointerEvent)
        : undefined
    },
    {
      eventName: "rightclick",
      invoke: props.onRightClick
        ? (event) => props.onRightClick?.(event as naver.maps.PointerEvent)
        : undefined
    },
    {
      eventName: "mousedown",
      invoke: props.onMouseDown
        ? (event) => props.onMouseDown?.(event as naver.maps.PointerEvent)
        : undefined
    },
    {
      eventName: "mouseup",
      invoke: props.onMouseUp
        ? (event) => props.onMouseUp?.(event as naver.maps.PointerEvent)
        : undefined
    },
    {
      eventName: "touchstart",
      invoke: props.onTouchStart
        ? (event) => props.onTouchStart?.(event as naver.maps.PointerEvent)
        : undefined
    },
    {
      eventName: "touchend",
      invoke: props.onTouchEnd
        ? (event) => props.onTouchEnd?.(event as naver.maps.PointerEvent)
        : undefined
    },
    {
      eventName: "dragstart",
      invoke: props.onDragStart
        ? (event) => props.onDragStart?.(event as naver.maps.PointerEvent)
        : undefined
    },
    {
      eventName: "drag",
      invoke: props.onDrag ? (event) => props.onDrag?.(event as naver.maps.PointerEvent) : undefined
    },
    {
      eventName: "dragend",
      invoke: props.onDragEnd
        ? (event) => props.onDragEnd?.(event as naver.maps.PointerEvent)
        : undefined
    },
    {
      eventName: "clickable_changed",
      invoke: props.onClickableChanged
        ? (event) => props.onClickableChanged?.(event as boolean)
        : undefined
    },
    {
      eventName: "cursor_changed",
      invoke: props.onCursorChanged
        ? (event) => props.onCursorChanged?.(event as string)
        : undefined
    },
    {
      eventName: "draggable_changed",
      invoke: props.onDraggableChanged
        ? (event) => props.onDraggableChanged?.(event as boolean)
        : undefined
    },
    {
      eventName: "icon_changed",
      invoke: props.onIconChanged
        ? (event) =>
            props.onIconChanged?.(
              event as string | naver.maps.ImageIcon | naver.maps.SymbolIcon | naver.maps.HtmlIcon
            )
        : undefined
    },
    {
      eventName: "icon_loaded",
      invoke: props.onIconLoaded
        ? (event) => props.onIconLoaded?.(event as naver.maps.Marker)
        : undefined
    },
    {
      eventName: "position_changed",
      invoke: props.onPositionChanged
        ? (event) => props.onPositionChanged?.(event as naver.maps.Coord)
        : undefined
    },
    {
      eventName: "shape_changed",
      invoke: props.onShapeChanged
        ? (event) => props.onShapeChanged?.(event as naver.maps.MarkerShape)
        : undefined
    },
    {
      eventName: "title_changed",
      invoke: props.onTitleChanged ? (event) => props.onTitleChanged?.(event as string) : undefined
    },
    {
      eventName: "visible_changed",
      invoke: props.onVisibleChanged
        ? (event) => props.onVisibleChanged?.(event as boolean)
        : undefined
    },
    {
      eventName: "zIndex_changed",
      invoke: props.onZIndexChanged
        ? (event) => props.onZIndexChanged?.(event as number)
        : undefined
    }
  ];
}

function bindMarkerEventListeners(
  marker: naver.maps.Marker,
  listenersRef: { current: naver.maps.MapEventListener[] },
  bindings: MarkerEventBinding[]
): void {
  if (listenersRef.current.length > 0) {
    naver.maps.Event.removeListener(listenersRef.current);
    listenersRef.current = [];
  }

  listenersRef.current = bindings
    .filter((binding) => typeof binding.invoke === "function")
    .map((binding) =>
      naver.maps.Event.addListener(marker, binding.eventName, (event: unknown) => {
        binding.invoke?.(event);
      })
    );
}

// ─── Resolve position to LatLngLiteral for registry ───────────────

function toLatLngLiteral(
  position: MarkerOptions["position"]
): { lat: number; lng: number } | null {
  if (!position) return null;

  if (typeof position === "object" && "lat" in position && "lng" in position) {
    if (typeof position.lat === "number" && typeof position.lng === "number") {
      return { lat: position.lat, lng: position.lng };
    }
    if (typeof position.lat === "function" && typeof position.lng === "function") {
      return { lat: (position as naver.maps.LatLng).lat(), lng: (position as naver.maps.LatLng).lng() };
    }
  }

  if (typeof position === "object" && "x" in position && "y" in position) {
    const p = position as naver.maps.Point;
    if (typeof p.x === "number" && typeof p.y === "number") {
      return { lat: p.y, lng: p.x };
    }
  }

  return null;
}

export const Marker = forwardRef<MarkerRef, MarkerProps>(
  function MarkerInner(props, ref): ReactPortal | null {
    const { map: contextMap, sdkStatus } = useNaverMap();
    const clustererRegistry = useContext(ClustererContext);
    const isInsideClusterer = clustererRegistry !== null && clustererRegistry.enabled;
    const markerRef = useRef<naver.maps.Marker | null>(null);
    const markerEventListenersRef = useRef<naver.maps.MapEventListener[]>([]);
    const onMarkerDestroyRef = useRef<MarkerProps["onMarkerDestroy"]>(props.onMarkerDestroy);
    const [markerDiv, setMarkerDiv] = useState<HTMLDivElement | null>(null);
    const [portalReady, setPortalReady] = useState(false);
    const hasChildren = props.children !== undefined && props.children !== null;
    const targetMap = props.map ?? contextMap;

    // ── Clusterer registry mode ───────────────────────────────

    useEffect(() => {
      if (!clustererRegistry) return;

      const id = props.clustererItemId;
      if (id === undefined || id === null) return;

      const latLng = toLatLngLiteral(props.position);
      if (!latLng) return;

      clustererRegistry.register({
        id,
        position: latLng,
        data: props.item ?? null,
        markerOptions: props.icon !== undefined ? { icon: props.icon } : undefined
      });

      return () => {
        clustererRegistry.unregister(id);
      };
    }, [clustererRegistry, props.clustererItemId, props.position, props.item, props.icon]);

    // ── Normal marker mode hooks (always called, but guarded) ─

    useEffect(() => {
      if (isInsideClusterer) return;
      onMarkerDestroyRef.current = props.onMarkerDestroy;
    }, [isInsideClusterer, props.onMarkerDestroy]);

    useEffect(() => {
      if (isInsideClusterer) return;
      if (typeof document === "undefined") {
        return;
      }

      setMarkerDiv(document.createElement("div"));
    }, [isInsideClusterer]);

    useEffect(() => {
      if (isInsideClusterer) return;
      if (!hasChildren || !markerDiv) {
        setPortalReady(false);
        return;
      }

      const updateReadyState = () => {
        setPortalReady(markerDiv.childNodes.length > 0);
      };

      updateReadyState();

      const observer = new MutationObserver(updateReadyState);
      observer.observe(markerDiv, {
        childList: true,
        subtree: true
      });

      return () => {
        observer.disconnect();
      };
    }, [isInsideClusterer, hasChildren, markerDiv]);

    const invokeMarkerMethod = useCallback(
      <K extends keyof naver.maps.Marker>(
        methodName: K,
        ...args: Parameters<Extract<naver.maps.Marker[K], (...params: never[]) => unknown>>
      ): ReturnType<Extract<naver.maps.Marker[K], (...params: never[]) => unknown>> | undefined => {
        const marker = markerRef.current;

        if (!marker) {
          return undefined;
        }

        const method = marker[methodName] as unknown;

        if (typeof method !== "function") {
          return undefined;
        }

        return (method as (...params: unknown[]) => unknown).apply(marker, args) as ReturnType<
          Extract<naver.maps.Marker[K], (...params: never[]) => unknown>
        >;
      },
      []
    );

    const teardownMarker = useCallback(() => {
      const marker = markerRef.current;

      if (!marker) {
        return;
      }

      try {
        if (markerEventListenersRef.current.length > 0) {
          naver.maps.Event.removeListener(markerEventListenersRef.current);
          markerEventListenersRef.current = [];
        }

        naver.maps.Event.clearInstanceListeners(marker);
      } catch (error) {
        console.error("[react-naver-maps-kit] failed to clear marker listeners", error);
      }

      marker.setMap(null);
      markerRef.current = null;
      onMarkerDestroyRef.current?.();
    }, []);

    useImperativeHandle(
      ref,
      (): MarkerRef => ({
        getInstance: () => markerRef.current,
        getAnimation: (...args) => invokeMarkerMethod("getAnimation", ...args),
        getClickable: (...args) => invokeMarkerMethod("getClickable", ...args),
        getCursor: (...args) => invokeMarkerMethod("getCursor", ...args),
        getDraggable: (...args) => invokeMarkerMethod("getDraggable", ...args),
        getDrawingRect: (...args) => invokeMarkerMethod("getDrawingRect", ...args),
        getElement: (...args) => invokeMarkerMethod("getElement", ...args),
        getIcon: (...args) => invokeMarkerMethod("getIcon", ...args),
        getMap: (...args) => invokeMarkerMethod("getMap", ...args),
        getOptions: (...args) => invokeMarkerMethod("getOptions", ...args),
        getPanes: (...args) => invokeMarkerMethod("getPanes", ...args),
        getPosition: (...args) => invokeMarkerMethod("getPosition", ...args),
        getProjection: (...args) => invokeMarkerMethod("getProjection", ...args),
        getShape: (...args) => invokeMarkerMethod("getShape", ...args),
        getTitle: (...args) => invokeMarkerMethod("getTitle", ...args),
        getVisible: (...args) => invokeMarkerMethod("getVisible", ...args),
        getZIndex: (...args) => invokeMarkerMethod("getZIndex", ...args),
        setAnimation: (...args) => invokeMarkerMethod("setAnimation", ...args),
        setClickable: (...args) => invokeMarkerMethod("setClickable", ...args),
        setCursor: (...args) => invokeMarkerMethod("setCursor", ...args),
        setDraggable: (...args) => invokeMarkerMethod("setDraggable", ...args),
        setIcon: (...args) => invokeMarkerMethod("setIcon", ...args),
        setMap: (...args) => invokeMarkerMethod("setMap", ...args),
        setOptions: (...args) => invokeMarkerMethod("setOptions", ...args),
        setPosition: (...args) => invokeMarkerMethod("setPosition", ...args),
        setShape: (...args) => invokeMarkerMethod("setShape", ...args),
        setTitle: (...args) => invokeMarkerMethod("setTitle", ...args),
        setVisible: (...args) => invokeMarkerMethod("setVisible", ...args),
        setZIndex: (...args) => invokeMarkerMethod("setZIndex", ...args)
      }),
      [invokeMarkerMethod]
    );

    useEffect(() => {
      if (isInsideClusterer) return;
      if (sdkStatus !== "ready" || !targetMap || markerRef.current) {
        return;
      }

      if (hasChildren && !portalReady) {
        return;
      }

      try {
        const resolvedIcon = resolveMarkerIcon(props.icon, markerDiv, hasChildren);
        const marker = new naver.maps.Marker(toMarkerOptions(props, targetMap, resolvedIcon));

        markerRef.current = marker;

        if (props.collisionBehavior !== undefined) {
          marker.setOptions("collisionBehavior", props.collisionBehavior);
        }

        if (props.collisionBoxSize !== undefined) {
          marker.setOptions("collisionBoxSize", props.collisionBoxSize);
        }

        bindMarkerEventListeners(marker, markerEventListenersRef, buildMarkerEventBindings(props));
        props.onMarkerReady?.(marker);
      } catch (error) {
        const normalizedError =
          error instanceof Error
            ? error
            : new Error("Failed to create naver.maps.Marker instance.");

        props.onMarkerError?.(normalizedError);
      }
    }, [isInsideClusterer, hasChildren, markerDiv, portalReady, props, sdkStatus, targetMap]);

    useLayoutEffect(() => {
      if (isInsideClusterer) return;
      const marker = markerRef.current;

      if (!marker || !targetMap) {
        return;
      }

      const rafId = requestAnimationFrame(() => {
        const resolvedIcon =
          hasChildren && portalReady
            ? resolveMarkerIcon(props.icon, markerDiv, hasChildren)
            : props.icon;
        const nextOptions = toMarkerOptions(props, targetMap, resolvedIcon);

        marker.setOptions(nextOptions);

        if (props.collisionBehavior !== undefined) {
          marker.setOptions("collisionBehavior", props.collisionBehavior);
        }

        if (props.collisionBoxSize !== undefined) {
          marker.setOptions("collisionBoxSize", props.collisionBoxSize);
        }
      });

      return () => {
        cancelAnimationFrame(rafId);
      };
    }, [isInsideClusterer, hasChildren, markerDiv, portalReady, props, targetMap]);

    useEffect(() => {
      if (isInsideClusterer) return;
      const marker = markerRef.current;

      if (!marker) {
        return;
      }

      bindMarkerEventListeners(marker, markerEventListenersRef, buildMarkerEventBindings(props));

      return () => {
        if (markerEventListenersRef.current.length > 0) {
          naver.maps.Event.removeListener(markerEventListenersRef.current);
          markerEventListenersRef.current = [];
        }
      };
    }, [isInsideClusterer, props]);

    useEffect(() => {
      if (isInsideClusterer) return;
      return () => {
        teardownMarker();
      };
    }, [isInsideClusterer, teardownMarker]);

    // If inside a clusterer, render nothing (data registered via effect above)
    if (isInsideClusterer) {
      return null;
    }

    if (!hasChildren || !markerDiv) {
      return null;
    }

    return createPortal(props.children, markerDiv);
  }
);

Marker.displayName = "Marker";
