import { useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";

import { useNaverMap } from "../../react/hooks/useNaverMap";

import type { ReactNode, ReactPortal } from "react";

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

export function InfoWindow(props: InfoWindowProps): ReactPortal | null {
  const { map, sdkStatus } = useNaverMap();
  const infoWindowRef = useRef<naver.maps.InfoWindow | null>(null);
  const onInfoWindowDestroyRef = useRef<InfoWindowProps["onInfoWindowDestroy"]>(
    props.onInfoWindowDestroy
  );
  const childrenContainer = useMemo<HTMLElement | null>(() => {
    if (typeof document === "undefined") {
      return null;
    }

    return document.createElement("div");
  }, []);
  const visible = props.visible ?? true;
  const optionSnapshot = useMemo(() => toInfoWindowOptions(props), [props]);

  useEffect(() => {
    onInfoWindowDestroyRef.current = props.onInfoWindowDestroy;
  }, [props.onInfoWindowDestroy]);

  useEffect(() => {
    if (!props.children) {
      const infoWindow = infoWindowRef.current;

      if (infoWindow) {
        infoWindow.setContent(resolveInfoWindowContent(props.content, null));
      }

      return;
    }

    const infoWindow = infoWindowRef.current;

    if (infoWindow) {
      infoWindow.setContent(resolveInfoWindowContent(props.content, childrenContainer));
    }
  }, [childrenContainer, props.children, props.content]);

  useEffect(() => {
    if (sdkStatus !== "ready" || !map || infoWindowRef.current) {
      return;
    }

    try {
      const infoWindow = new naver.maps.InfoWindow({
        ...optionSnapshot,
        content: resolveInfoWindowContent(props.content, childrenContainer)
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
  }, [childrenContainer, map, optionSnapshot, props, sdkStatus]);

  useEffect(() => {
    const infoWindow = infoWindowRef.current;

    if (!infoWindow) {
      return;
    }

    const resolvedContent = resolveInfoWindowContent(props.content, childrenContainer);

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
  }, [
    childrenContainer,
    map,
    optionSnapshot,
    props.anchor,
    props.content,
    props.position,
    visible
  ]);

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
      onInfoWindowDestroyRef.current?.();
    };
  }, []);

  if (!props.children || !childrenContainer) {
    return null;
  }

  return createPortal(props.children, childrenContainer);
}
