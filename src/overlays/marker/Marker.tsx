import { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

import { useNaverMap } from "../../react/hooks/useNaverMap";

import type { ReactNode } from "react";
import type { Root } from "react-dom/client";

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
}

export type MarkerProps = MarkerOverlayProps & MarkerLifecycleProps;

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

export function Marker(props: MarkerProps): null {
  const { map, sdkStatus } = useNaverMap();
  const markerRef = useRef<naver.maps.Marker | null>(null);
  const childrenContainerRef = useRef<HTMLElement | null>(null);
  const childrenRootRef = useRef<Root | null>(null);

  useEffect(() => {
    if (!props.children) {
      childrenRootRef.current?.unmount();
      childrenRootRef.current = null;
      childrenContainerRef.current = null;

      if (markerRef.current) {
        const fallbackIcon = resolveMarkerIcon(props.icon, null);

        if (fallbackIcon) {
          markerRef.current.setIcon(fallbackIcon);
        }
      }

      return;
    }

    if (!childrenContainerRef.current) {
      childrenContainerRef.current = document.createElement("div");
    }

    if (!childrenRootRef.current) {
      childrenRootRef.current = createRoot(childrenContainerRef.current);
    }

    childrenRootRef.current.render(props.children);

    if (markerRef.current) {
      const resolvedIcon = resolveMarkerIcon(props.icon, childrenContainerRef.current);

      if (resolvedIcon) {
        markerRef.current.setIcon(resolvedIcon);
      }
    }
  }, [props.children, props.icon]);

  useEffect(() => {
    if (sdkStatus !== "ready" || !map || markerRef.current) {
      return;
    }

    try {
      const marker = new naver.maps.Marker({
        ...toMarkerOptions(props),
        icon: resolveMarkerIcon(props.icon, childrenContainerRef.current),
        map
      });

      markerRef.current = marker;
      props.onMarkerReady?.(marker);
    } catch (error) {
      const normalizedError =
        error instanceof Error ? error : new Error("Failed to create naver.maps.Marker instance.");

      props.onMarkerError?.(normalizedError);
    }
  }, [map, props, sdkStatus]);

  useEffect(() => {
    const marker = markerRef.current;

    if (!marker) {
      return;
    }

    marker.setOptions({
      ...toMarkerOptions(props),
      icon: resolveMarkerIcon(props.icon, childrenContainerRef.current)
    });
  }, [props]);

  useEffect(() => {
    return () => {
      const marker = markerRef.current;

      if (!marker) {
        return;
      }

      try {
        naver.maps.Event.clearInstanceListeners(marker);
      } catch (error) {
        console.error("[react-naver-maps-kit] failed to clear marker listeners", error);
      }

      marker.setMap(null);
      markerRef.current = null;
      props.onMarkerDestroy?.();

      childrenRootRef.current?.unmount();
      childrenRootRef.current = null;
      childrenContainerRef.current = null;
    };
  }, [props]);

  return null;
}
