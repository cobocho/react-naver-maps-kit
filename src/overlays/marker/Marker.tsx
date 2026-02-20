import { useEffect, useLayoutEffect, useRef, useState } from "react";
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

function toMarkerOptions(props: MarkerProps): Omit<MarkerOptions, "map"> {
  const { position, icon, animation, shape, title, cursor, clickable, draggable, visible, zIndex } =
    props;

  const options: Omit<MarkerOptions, "map"> = {
    position
  };

  if (animation !== undefined) {
    options.animation = animation;
  }

  if (clickable !== undefined) {
    options.clickable = clickable;
  }

  if (cursor !== undefined) {
    options.cursor = cursor;
  }

  if (draggable !== undefined) {
    options.draggable = draggable;
  }

  if (icon !== undefined) {
    options.icon = icon;
  }

  if (shape !== undefined) {
    options.shape = shape;
  }

  if (title !== undefined) {
    options.title = title;
  }

  if (visible !== undefined) {
    options.visible = visible;
  }

  if (zIndex !== undefined) {
    options.zIndex = zIndex;
  }

  return options;
}

export function Marker(props: MarkerProps): ReactPortal | null {
  const { map, sdkStatus } = useNaverMap();
  const markerRef = useRef<naver.maps.Marker | null>(null);
  const markerEventListenersRef = useRef<naver.maps.MapEventListener[]>([]);
  const onMarkerDestroyRef = useRef<MarkerProps["onMarkerDestroy"]>(props.onMarkerDestroy);
  const [markerDiv, setMarkerDiv] = useState<HTMLDivElement | null>(null);
  const [portalReady, setPortalReady] = useState(false);
  const hasChildren = props.children !== undefined && props.children !== null;

  useEffect(() => {
    onMarkerDestroyRef.current = props.onMarkerDestroy;
  }, [props.onMarkerDestroy]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    setMarkerDiv(document.createElement("div"));
  }, []);

  useEffect(() => {
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
  }, [hasChildren, markerDiv]);

  useEffect(() => {
    if (sdkStatus !== "ready" || !map || markerRef.current) {
      return;
    }

    if (hasChildren && !portalReady) {
      return;
    }

    try {
      const marker = new naver.maps.Marker({
        ...toMarkerOptions(props),
        icon: resolveMarkerIcon(props.icon, markerDiv, hasChildren),
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
  }, [hasChildren, map, markerDiv, portalReady, props, sdkStatus]);

  useLayoutEffect(() => {
    const marker = markerRef.current;

    if (!marker) {
      return;
    }

    const rafId = requestAnimationFrame(() => {
      const nextOptions = toMarkerOptions(props);

      if (hasChildren) {
        if (portalReady) {
          const resolvedIcon = resolveMarkerIcon(props.icon, markerDiv, hasChildren);

          if (resolvedIcon !== undefined) {
            nextOptions.icon = resolvedIcon;
          }
        } else {
          delete nextOptions.icon;
        }
      }

      marker.setOptions(nextOptions);
    });

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [hasChildren, markerDiv, portalReady, props]);

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

  if (!hasChildren || !markerDiv) {
    return null;
  }

  return createPortal(props.children, markerDiv);
}
