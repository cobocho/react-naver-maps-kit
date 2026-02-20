import { useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";

import { useNaverMap } from "../../react/hooks/useNaverMap";

import type { ReactNode, ReactPortal } from "react";

type MarkerOptions = naver.maps.MarkerOptions;
type MarkerIcon = NonNullable<MarkerOptions["icon"]>;
type MarkerIconObject = Exclude<MarkerIcon, string>;

interface MarkerOverlayProps {
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
}

interface MarkerLifecycleProps {
  children?: ReactNode;
  onMarkerReady?: (marker: naver.maps.Marker) => void;
  onMarkerDestroy?: () => void;
  onMarkerError?: (error: Error) => void;
  onClick?: (event: naver.maps.PointerEvent) => void;
  onDoubleClick?: (event: naver.maps.PointerEvent) => void;
  onRightClick?: (event: naver.maps.PointerEvent) => void;
  onMouseDown?: (event: naver.maps.PointerEvent) => void;
  onMouseUp?: (event: naver.maps.PointerEvent) => void;
  onMouseOver?: (event: naver.maps.PointerEvent) => void;
  onMouseOut?: (event: naver.maps.PointerEvent) => void;
  onDragStart?: (event: naver.maps.PointerEvent) => void;
  onDrag?: (event: naver.maps.PointerEvent) => void;
  onDragEnd?: (event: naver.maps.PointerEvent) => void;
}

export type MarkerProps = MarkerOverlayProps & MarkerLifecycleProps;

interface MarkerEventHandlers {
  onClick?: (event: naver.maps.PointerEvent) => void;
  onDoubleClick?: (event: naver.maps.PointerEvent) => void;
  onRightClick?: (event: naver.maps.PointerEvent) => void;
  onMouseDown?: (event: naver.maps.PointerEvent) => void;
  onMouseUp?: (event: naver.maps.PointerEvent) => void;
  onMouseOver?: (event: naver.maps.PointerEvent) => void;
  onMouseOut?: (event: naver.maps.PointerEvent) => void;
  onDragStart?: (event: naver.maps.PointerEvent) => void;
  onDrag?: (event: naver.maps.PointerEvent) => void;
  onDragEnd?: (event: naver.maps.PointerEvent) => void;
}

function bindMarkerEventListeners(
  marker: naver.maps.Marker,
  listenersRef: { current: naver.maps.MapEventListener[] },
  handlers: MarkerEventHandlers
): void {
  if (listenersRef.current.length > 0) {
    naver.maps.Event.removeListener(listenersRef.current);
    listenersRef.current = [];
  }

  const eventEntries: Array<[string, ((event: naver.maps.PointerEvent) => void) | undefined]> = [
    ["click", handlers.onClick],
    ["dblclick", handlers.onDoubleClick],
    ["rightclick", handlers.onRightClick],
    ["mousedown", handlers.onMouseDown],
    ["mouseup", handlers.onMouseUp],
    ["mouseover", handlers.onMouseOver],
    ["mouseout", handlers.onMouseOut],
    ["dragstart", handlers.onDragStart],
    ["drag", handlers.onDrag],
    ["dragend", handlers.onDragEnd]
  ];

  listenersRef.current = eventEntries
    .filter(([, handler]) => typeof handler === "function")
    .map(([eventName, handler]) =>
      naver.maps.Event.addListener(marker, eventName, (event: naver.maps.PointerEvent) => {
        handler?.(event);
      })
    );
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
  childrenContainer: HTMLElement | null
): MarkerOptions["icon"] {
  if (!childrenContainer) {
    return icon;
  }

  const iconObject = typeof icon === "object" && icon !== null ? icon : undefined;

  return {
    content: childrenContainer,
    anchor: iconObject ? pickHtmlIconAnchor(iconObject) : undefined,
    size: iconObject ? pickHtmlIconSize(iconObject) : undefined
  };
}

function toMarkerOptions(props: MarkerProps): Omit<MarkerOptions, "map"> {
  const { position, icon, animation, shape, title, cursor, clickable, draggable, visible, zIndex } =
    props;

  return {
    animation,
    clickable,
    cursor,
    draggable,
    icon,
    position,
    shape,
    title,
    visible,
    zIndex
  };
}

export function Marker(props: MarkerProps): ReactPortal | null {
  const { map, sdkStatus } = useNaverMap();
  const markerRef = useRef<naver.maps.Marker | null>(null);
  const childrenContainer = useMemo<HTMLElement | null>(() => {
    if (typeof document === "undefined") {
      return null;
    }

    return document.createElement("div");
  }, []);
  const markerEventListenersRef = useRef<naver.maps.MapEventListener[]>([]);
  const onMarkerDestroyRef = useRef<MarkerProps["onMarkerDestroy"]>(props.onMarkerDestroy);

  useEffect(() => {
    onMarkerDestroyRef.current = props.onMarkerDestroy;
  }, [props.onMarkerDestroy]);

  useEffect(() => {
    if (!props.children) {
      if (markerRef.current) {
        const fallbackIcon = resolveMarkerIcon(props.icon, null);

        if (fallbackIcon) {
          markerRef.current.setIcon(fallbackIcon);
        }
      }

      return;
    }

    if (markerRef.current) {
      const resolvedIcon = resolveMarkerIcon(props.icon, childrenContainer);

      if (resolvedIcon) {
        markerRef.current.setIcon(resolvedIcon);
      }
    }
  }, [childrenContainer, props.children, props.icon]);

  useEffect(() => {
    if (sdkStatus !== "ready" || !map || markerRef.current) {
      return;
    }

    try {
      const marker = new naver.maps.Marker({
        ...toMarkerOptions(props),
        icon: resolveMarkerIcon(props.icon, childrenContainer),
        map
      });

      markerRef.current = marker;
      bindMarkerEventListeners(marker, markerEventListenersRef, {
        onClick: props.onClick,
        onDoubleClick: props.onDoubleClick,
        onRightClick: props.onRightClick,
        onMouseDown: props.onMouseDown,
        onMouseUp: props.onMouseUp,
        onMouseOver: props.onMouseOver,
        onMouseOut: props.onMouseOut,
        onDragStart: props.onDragStart,
        onDrag: props.onDrag,
        onDragEnd: props.onDragEnd
      });
      props.onMarkerReady?.(marker);
    } catch (error) {
      const normalizedError =
        error instanceof Error ? error : new Error("Failed to create naver.maps.Marker instance.");

      props.onMarkerError?.(normalizedError);
    }
  }, [childrenContainer, map, props, sdkStatus]);

  useEffect(() => {
    const marker = markerRef.current;

    if (!marker) {
      return;
    }

    marker.setOptions({
      ...toMarkerOptions(props),
      icon: resolveMarkerIcon(props.icon, childrenContainer)
    });
  }, [childrenContainer, props]);

  useEffect(() => {
    const marker = markerRef.current;

    if (!marker) {
      return;
    }

    bindMarkerEventListeners(marker, markerEventListenersRef, {
      onClick: props.onClick,
      onDoubleClick: props.onDoubleClick,
      onRightClick: props.onRightClick,
      onMouseDown: props.onMouseDown,
      onMouseUp: props.onMouseUp,
      onMouseOver: props.onMouseOver,
      onMouseOut: props.onMouseOut,
      onDragStart: props.onDragStart,
      onDrag: props.onDrag,
      onDragEnd: props.onDragEnd
    });

    return () => {
      if (markerEventListenersRef.current.length > 0) {
        naver.maps.Event.removeListener(markerEventListenersRef.current);
        markerEventListenersRef.current = [];
      }
    };
  }, [
    props.onClick,
    props.onDoubleClick,
    props.onRightClick,
    props.onMouseDown,
    props.onMouseUp,
    props.onMouseOver,
    props.onMouseOut,
    props.onDragStart,
    props.onDrag,
    props.onDragEnd
  ]);

  useEffect(() => {
    return () => {
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
    };
  }, []);

  if (!props.children || !childrenContainer) {
    return null;
  }

  return createPortal(props.children, childrenContainer);
}
