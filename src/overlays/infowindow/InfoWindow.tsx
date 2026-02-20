import { useEffect, useMemo, useRef } from "react";
import { createRoot } from "react-dom/client";

import { useNaverMap } from "../../react/hooks/useNaverMap";

import type { ReactNode } from "react";
import type { Root } from "react-dom/client";

type InfoWindowOptions = naver.maps.InfoWindowOptions;
type InfoWindowAnchor = naver.maps.Coord | naver.maps.CoordLiteral | naver.maps.Marker;

interface InfoWindowOptionProps {
  position?: InfoWindowOptions["position"];
  content?: InfoWindowOptions["content"];
  zIndex?: InfoWindowOptions["zIndex"];
  maxWidth?: InfoWindowOptions["maxWidth"];
  pixelOffset?: InfoWindowOptions["pixelOffset"];
  backgroundColor?: InfoWindowOptions["backgroundColor"];
  borderColor?: InfoWindowOptions["borderColor"];
  borderWidth?: InfoWindowOptions["borderWidth"];
  disableAutoPan?: InfoWindowOptions["disableAutoPan"];
  disableAnchor?: InfoWindowOptions["disableAnchor"];
  anchorSkew?: InfoWindowOptions["anchorSkew"];
  anchorSize?: InfoWindowOptions["anchorSize"];
  anchorColor?: InfoWindowOptions["anchorColor"];
}

interface InfoWindowLifecycleProps {
  anchor?: InfoWindowAnchor;
  visible?: boolean;
  children?: ReactNode;
  onInfoWindowReady?: (infoWindow: naver.maps.InfoWindow) => void;
  onInfoWindowDestroy?: () => void;
  onInfoWindowError?: (error: Error) => void;
}

export type InfoWindowProps = InfoWindowOptionProps & InfoWindowLifecycleProps;

function toInfoWindowOptions(props: InfoWindowProps): Omit<InfoWindowOptions, "content"> {
  const {
    anchorColor,
    anchorSize,
    anchorSkew,
    backgroundColor,
    borderColor,
    borderWidth,
    disableAnchor,
    disableAutoPan,
    maxWidth,
    pixelOffset,
    position,
    zIndex
  } = props;

  return {
    anchorColor,
    anchorSize,
    anchorSkew,
    backgroundColor,
    borderColor,
    borderWidth,
    disableAnchor,
    disableAutoPan,
    maxWidth,
    pixelOffset,
    position,
    zIndex
  };
}

function resolveInfoWindowContent(
  content: InfoWindowOptions["content"] | undefined,
  childrenContainer: HTMLElement | null
): string | HTMLElement {
  if (childrenContainer) {
    return childrenContainer;
  }

  if (content) {
    return content;
  }

  return "";
}

export function InfoWindow(props: InfoWindowProps): null {
  const { map, sdkStatus } = useNaverMap();
  const infoWindowRef = useRef<naver.maps.InfoWindow | null>(null);
  const childrenContainerRef = useRef<HTMLElement | null>(null);
  const childrenRootRef = useRef<Root | null>(null);
  const visible = props.visible ?? true;
  const optionSnapshot = useMemo(() => toInfoWindowOptions(props), [props]);

  useEffect(() => {
    if (!props.children) {
      childrenRootRef.current?.unmount();
      childrenRootRef.current = null;
      childrenContainerRef.current = null;

      const infoWindow = infoWindowRef.current;

      if (infoWindow) {
        infoWindow.setContent(resolveInfoWindowContent(props.content, null));
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

    const infoWindow = infoWindowRef.current;

    if (infoWindow) {
      infoWindow.setContent(resolveInfoWindowContent(props.content, childrenContainerRef.current));
    }
  }, [props.children, props.content]);

  useEffect(() => {
    if (sdkStatus !== "ready" || !map || infoWindowRef.current) {
      return;
    }

    try {
      const infoWindow = new naver.maps.InfoWindow({
        ...optionSnapshot,
        content: resolveInfoWindowContent(props.content, childrenContainerRef.current)
      });

      infoWindowRef.current = infoWindow;
      props.onInfoWindowReady?.(infoWindow);
    } catch (error) {
      const normalizedError =
        error instanceof Error
          ? error
          : new Error("Failed to create naver.maps.InfoWindow instance.");

      props.onInfoWindowError?.(normalizedError);
    }
  }, [map, optionSnapshot, props, sdkStatus]);

  useEffect(() => {
    const infoWindow = infoWindowRef.current;

    if (!infoWindow) {
      return;
    }

    const resolvedContent = resolveInfoWindowContent(props.content, childrenContainerRef.current);

    infoWindow.setOptions({
      ...optionSnapshot,
      content: resolvedContent
    });
    infoWindow.setContent(resolvedContent);

    if (props.position) {
      infoWindow.setPosition(props.position);
    }

    if (!map || !visible) {
      infoWindow.close();
      return;
    }

    if (props.anchor) {
      infoWindow.open(map, props.anchor);
      return;
    }

    if (props.position) {
      infoWindow.open(map, props.position);
      return;
    }

    infoWindow.open(map);
  }, [map, optionSnapshot, props.anchor, props.content, props.position, visible]);

  useEffect(() => {
    return () => {
      const infoWindow = infoWindowRef.current;

      if (!infoWindow) {
        return;
      }

      try {
        naver.maps.Event.clearInstanceListeners(infoWindow);
      } catch (error) {
        console.error("[react-naver-maps-kit] failed to clear infoWindow listeners", error);
      }

      infoWindow.close();
      infoWindow.setMap(null);
      infoWindowRef.current = null;
      props.onInfoWindowDestroy?.();

      childrenRootRef.current?.unmount();
      childrenRootRef.current = null;
      childrenContainerRef.current = null;
    };
  }, [props]);

  return null;
}
