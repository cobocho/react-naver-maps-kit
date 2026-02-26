import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from "react";
import { createPortal } from "react-dom";

import { useMapInstance } from "../../react/context/MapInstanceContext";
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
  autoPanPadding?: naver.maps.Point | naver.maps.PointLiteral;
}

interface InfoWindowLifecycleProps {
  anchor?: InfoWindowAnchor;
  visible?: boolean;
  children?: ReactNode;
  onInfoWindowReady?: (infoWindow: naver.maps.InfoWindow) => void;
  onInfoWindowDestroy?: () => void;
  onInfoWindowError?: (error: Error) => void;
}

interface InfoWindowEventProps {
  onOpen?: (pointerEvent: naver.maps.PointerEvent) => void;
  onClose?: (pointerEvent: naver.maps.PointerEvent) => void;
  onAnchorColorChanged?: (anchorColor: string) => void;
  onAnchorSizeChanged?: (anchorSize: naver.maps.Size) => void;
  onAnchorSkewChanged?: (anchorSkew: boolean) => void;
  onBackgroundColorChanged?: (backgroundColor: string) => void;
  onBorderColorChanged?: (borderColor: string) => void;
  onBorderWidthChanged?: (borderWidth: number) => void;
  onContentChanged?: (content: string | HTMLElement) => void;
  onDisableAnchorChanged?: (disableAnchor: boolean) => void;
  onDisableAutoPanChanged?: (disableAutoPan: boolean) => void;
  onMaxWidthChanged?: (maxWidth: number) => void;
  onPixelOffsetChanged?: (pixelOffset: naver.maps.Point) => void;
  onPositionChanged?: (position: naver.maps.Coord) => void;
  onZIndexChanged?: (zIndex: number) => void;
}

export type InfoWindowProps = InfoWindowOptionProps &
  InfoWindowLifecycleProps &
  InfoWindowEventProps;

type InfoWindowMethod<K extends keyof naver.maps.InfoWindow> = naver.maps.InfoWindow[K] extends (
  ...args: infer A
) => infer R
  ? (...args: A) => R | undefined
  : never;

export interface InfoWindowRef {
  getInstance: () => naver.maps.InfoWindow | null;
  close: InfoWindowMethod<"close">;
  getContent: InfoWindowMethod<"getContent">;
  getContentElement: InfoWindowMethod<"getContentElement">;
  getMap: InfoWindowMethod<"getMap">;
  getOptions: InfoWindowMethod<"getOptions">;
  getPanes: InfoWindowMethod<"getPanes">;
  getPosition: InfoWindowMethod<"getPosition">;
  getProjection: InfoWindowMethod<"getProjection">;
  getZIndex: InfoWindowMethod<"getZIndex">;
  open: InfoWindowMethod<"open">;
  setContent: InfoWindowMethod<"setContent">;
  setMap: InfoWindowMethod<"setMap">;
  setOptions: InfoWindowMethod<"setOptions">;
  setPosition: InfoWindowMethod<"setPosition">;
  setZIndex: InfoWindowMethod<"setZIndex">;
}

interface InfoWindowEventBinding {
  eventName: string;
  invoke?: (event: unknown) => void;
}

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

  const options: Omit<InfoWindowOptions, "content"> = {};

  if (anchorColor !== undefined) {
    options.anchorColor = anchorColor;
  }

  if (anchorSize !== undefined) {
    options.anchorSize = anchorSize;
  }

  if (anchorSkew !== undefined) {
    options.anchorSkew = anchorSkew;
  }

  if (backgroundColor !== undefined) {
    options.backgroundColor = backgroundColor;
  }

  if (borderColor !== undefined) {
    options.borderColor = borderColor;
  }

  if (borderWidth !== undefined) {
    options.borderWidth = borderWidth;
  }

  if (disableAnchor !== undefined) {
    options.disableAnchor = disableAnchor;
  }

  if (disableAutoPan !== undefined) {
    options.disableAutoPan = disableAutoPan;
  }

  if (maxWidth !== undefined) {
    options.maxWidth = maxWidth;
  }

  if (pixelOffset !== undefined) {
    options.pixelOffset = pixelOffset;
  }

  if (position !== undefined) {
    options.position = position;
  }

  if (zIndex !== undefined) {
    options.zIndex = zIndex;
  }

  return options;
}

function resolveInfoWindowContent(
  content: InfoWindowOptions["content"] | undefined,
  childrenContainer: HTMLElement | null,
  hasChildren: boolean
): string | HTMLElement {
  if (hasChildren && childrenContainer) {
    return childrenContainer;
  }

  if (content !== undefined) {
    return content;
  }

  return "";
}

function buildInfoWindowEventBindings(props: InfoWindowProps): InfoWindowEventBinding[] {
  return [
    {
      eventName: "open",
      invoke: props.onOpen ? (event) => props.onOpen?.(event as naver.maps.PointerEvent) : undefined
    },
    {
      eventName: "close",
      invoke: props.onClose
        ? (event) => props.onClose?.(event as naver.maps.PointerEvent)
        : undefined
    },
    {
      eventName: "anchorColor_changed",
      invoke: props.onAnchorColorChanged
        ? (event) => props.onAnchorColorChanged?.(event as string)
        : undefined
    },
    {
      eventName: "anchorSize_changed",
      invoke: props.onAnchorSizeChanged
        ? (event) => props.onAnchorSizeChanged?.(event as naver.maps.Size)
        : undefined
    },
    {
      eventName: "anchorSkew_changed",
      invoke: props.onAnchorSkewChanged
        ? (event) => props.onAnchorSkewChanged?.(event as boolean)
        : undefined
    },
    {
      eventName: "backgroundColor_changed",
      invoke: props.onBackgroundColorChanged
        ? (event) => props.onBackgroundColorChanged?.(event as string)
        : undefined
    },
    {
      eventName: "borderColor_changed",
      invoke: props.onBorderColorChanged
        ? (event) => props.onBorderColorChanged?.(event as string)
        : undefined
    },
    {
      eventName: "borderWidth_changed",
      invoke: props.onBorderWidthChanged
        ? (event) => props.onBorderWidthChanged?.(event as number)
        : undefined
    },
    {
      eventName: "content_changed",
      invoke: props.onContentChanged
        ? (event) => props.onContentChanged?.(event as string | HTMLElement)
        : undefined
    },
    {
      eventName: "disableAnchor_changed",
      invoke: props.onDisableAnchorChanged
        ? (event) => props.onDisableAnchorChanged?.(event as boolean)
        : undefined
    },
    {
      eventName: "disableAutoPan_changed",
      invoke: props.onDisableAutoPanChanged
        ? (event) => props.onDisableAutoPanChanged?.(event as boolean)
        : undefined
    },
    {
      eventName: "maxWidth_changed",
      invoke: props.onMaxWidthChanged
        ? (event) => props.onMaxWidthChanged?.(event as number)
        : undefined
    },
    {
      eventName: "pixelOffset_changed",
      invoke: props.onPixelOffsetChanged
        ? (event) => props.onPixelOffsetChanged?.(event as naver.maps.Point)
        : undefined
    },
    {
      eventName: "position_changed",
      invoke: props.onPositionChanged
        ? (event) => props.onPositionChanged?.(event as naver.maps.Coord)
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

function bindInfoWindowEventListeners(
  infoWindow: naver.maps.InfoWindow,
  listenersRef: { current: naver.maps.MapEventListener[] },
  bindings: InfoWindowEventBinding[]
): void {
  if (listenersRef.current.length > 0) {
    naver.maps.Event.removeListener(listenersRef.current);
    listenersRef.current = [];
  }

  listenersRef.current = bindings
    .filter((binding) => typeof binding.invoke === "function")
    .map((binding) =>
      naver.maps.Event.addListener(infoWindow, binding.eventName, (event: unknown) => {
        binding.invoke?.(event);
      })
    );
}

function setInfoWindowOptionByKey(
  infoWindow: naver.maps.InfoWindow,
  key: string,
  value: unknown
): void {
  const optionSettable = infoWindow as naver.maps.InfoWindow & {
    setOptions: (key: string, value: unknown) => void;
  };

  optionSettable.setOptions(key, value);
}

export const InfoWindow = forwardRef<InfoWindowRef, InfoWindowProps>(
  function InfoWindowInner(props, ref): ReactPortal | null {
    const { sdkStatus } = useNaverMap();
    const mapInstanceContext = useMapInstance();
    const map = mapInstanceContext?.instance as naver.maps.Map | null;

    const infoWindowRef = useRef<naver.maps.InfoWindow | null>(null);
    const infoWindowEventListenersRef = useRef<naver.maps.MapEventListener[]>([]);
    const lastOpenAnchorRef = useRef<InfoWindowAnchor | undefined>(undefined);
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
    const lastVisibleRef = useRef<boolean>(visible);
    const hasChildren = props.children !== undefined && props.children !== null;
    const optionSnapshot = useMemo(
      () => toInfoWindowOptions(props),
      [
        props.anchorColor,
        props.anchorSize,
        props.anchorSkew,
        props.backgroundColor,
        props.borderColor,
        props.borderWidth,
        props.disableAnchor,
        props.disableAutoPan,
        props.maxWidth,
        props.pixelOffset,
        props.position,
        props.zIndex
      ]
    );

    useEffect(() => {
      onInfoWindowDestroyRef.current = props.onInfoWindowDestroy;
    }, [props.onInfoWindowDestroy]);

    const invokeInfoWindowMethod = useCallback(
      <K extends keyof naver.maps.InfoWindow>(
        methodName: K,
        ...args: Parameters<Extract<naver.maps.InfoWindow[K], (...params: never[]) => unknown>>
      ):
        | ReturnType<Extract<naver.maps.InfoWindow[K], (...params: never[]) => unknown>>
        | undefined => {
        const infoWindow = infoWindowRef.current;

        if (!infoWindow) {
          return undefined;
        }

        const method = infoWindow[methodName] as unknown;

        if (typeof method !== "function") {
          return undefined;
        }

        return (method as (...params: unknown[]) => unknown).apply(infoWindow, args) as ReturnType<
          Extract<naver.maps.InfoWindow[K], (...params: never[]) => unknown>
        >;
      },
      []
    );

    const teardownInfoWindow = useCallback(() => {
      const infoWindow = infoWindowRef.current;

      if (!infoWindow) {
        return;
      }

      try {
        if (infoWindowEventListenersRef.current.length > 0) {
          naver.maps.Event.removeListener(infoWindowEventListenersRef.current);
          infoWindowEventListenersRef.current = [];
        }

        naver.maps.Event.clearInstanceListeners(infoWindow);
      } catch (error) {
        console.error("[react-naver-maps-kit] failed to clear infoWindow listeners", error);
      }

      infoWindow.close();
      infoWindow.setMap(null);
      infoWindowRef.current = null;
      onInfoWindowDestroyRef.current?.();
    }, []);

    useImperativeHandle(
      ref,
      (): InfoWindowRef => ({
        getInstance: () => infoWindowRef.current,
        close: (...args) => invokeInfoWindowMethod("close", ...args),
        getContent: (...args) => invokeInfoWindowMethod("getContent", ...args),
        getContentElement: (...args) => invokeInfoWindowMethod("getContentElement", ...args),
        getMap: (...args) => invokeInfoWindowMethod("getMap", ...args),
        getOptions: (...args) => invokeInfoWindowMethod("getOptions", ...args),
        getPanes: (...args) => invokeInfoWindowMethod("getPanes", ...args),
        getPosition: (...args) => invokeInfoWindowMethod("getPosition", ...args),
        getProjection: (...args) => invokeInfoWindowMethod("getProjection", ...args),
        getZIndex: (...args) => invokeInfoWindowMethod("getZIndex", ...args),
        open: (...args) => invokeInfoWindowMethod("open", ...args),
        setContent: (...args) => invokeInfoWindowMethod("setContent", ...args),
        setMap: (...args) => invokeInfoWindowMethod("setMap", ...args),
        setOptions: (...args) => invokeInfoWindowMethod("setOptions", ...args),
        setPosition: (...args) => invokeInfoWindowMethod("setPosition", ...args),
        setZIndex: (...args) => invokeInfoWindowMethod("setZIndex", ...args)
      }),
      [invokeInfoWindowMethod]
    );

    useEffect(() => {
      if (sdkStatus !== "ready" || !map || infoWindowRef.current) {
        return;
      }

      try {
        const infoWindow = new naver.maps.InfoWindow({
          ...optionSnapshot,
          content: resolveInfoWindowContent(props.content, childrenContainer, hasChildren)
        });

        if (props.autoPanPadding !== undefined) {
          setInfoWindowOptionByKey(infoWindow, "autoPanPadding", props.autoPanPadding);
        }

        infoWindowRef.current = infoWindow;
        bindInfoWindowEventListeners(
          infoWindow,
          infoWindowEventListenersRef,
          buildInfoWindowEventBindings(props)
        );
        props.onInfoWindowReady?.(infoWindow);
      } catch (error) {
        const normalizedError =
          error instanceof Error
            ? error
            : new Error("Failed to create naver.maps.InfoWindow instance.");

        props.onInfoWindowError?.(normalizedError);
      }
    }, [
      childrenContainer,
      hasChildren,
      map,
      optionSnapshot,
      props.autoPanPadding,
      props.content,
      props.onInfoWindowReady,
      props.onInfoWindowError,
      sdkStatus
    ]);

    useEffect(() => {
      const infoWindow = infoWindowRef.current;

      if (!infoWindow) {
        return;
      }

      const resolvedContent = resolveInfoWindowContent(
        props.content,
        childrenContainer,
        hasChildren
      );

      infoWindow.setOptions({
        ...optionSnapshot,
        content: resolvedContent
      });
      infoWindow.setContent(resolvedContent);

      if (props.autoPanPadding !== undefined) {
        setInfoWindowOptionByKey(infoWindow, "autoPanPadding", props.autoPanPadding);
      }

      if (props.position) {
        infoWindow.setPosition(props.position);
      }
    }, [
      childrenContainer,
      hasChildren,
      optionSnapshot,
      props.content,
      props.position,
      props.autoPanPadding,
      visible
    ]);

    useEffect(() => {
      const infoWindow = infoWindowRef.current;

      if (!infoWindow) {
        return;
      }

      if (!map || !visible) {
        if (infoWindow.getMap()) {
          infoWindow.close();
        }
        lastOpenAnchorRef.current = undefined;
        lastVisibleRef.current = visible;
        return;
      }

      const isBoundToCurrentMap = infoWindow.getMap() === map;
      const becameVisible = !lastVisibleRef.current && visible;

      if (props.anchor) {
        const anchorChanged = lastOpenAnchorRef.current !== props.anchor;

        if (!isBoundToCurrentMap || anchorChanged || becameVisible) {
          infoWindow.open(map, props.anchor);
        }

        lastOpenAnchorRef.current = props.anchor;
        lastVisibleRef.current = visible;
        return;
      }

      const hadAnchor = lastOpenAnchorRef.current !== undefined;

      if (!isBoundToCurrentMap || hadAnchor || becameVisible) {
        if (props.position) {
          infoWindow.open(map, props.position);
        } else {
          infoWindow.open(map);
        }
      }

      lastOpenAnchorRef.current = undefined;
      lastVisibleRef.current = visible;
    }, [map, visible, props.anchor, props.position]);

    useEffect(() => {
      const infoWindow = infoWindowRef.current;

      if (!infoWindow) {
        return;
      }

      bindInfoWindowEventListeners(
        infoWindow,
        infoWindowEventListenersRef,
        buildInfoWindowEventBindings(props)
      );
    }, [props]);

    useEffect(() => {
      return () => {
        teardownInfoWindow();
      };
    }, [teardownInfoWindow]);

    if (!hasChildren || !childrenContainer) {
      return null;
    }

    return createPortal(props.children, childrenContainer);
  }
);

InfoWindow.displayName = "InfoWindow";
