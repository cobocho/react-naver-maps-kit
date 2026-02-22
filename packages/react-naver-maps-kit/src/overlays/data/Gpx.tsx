import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";

import { useNaverMap } from "../../react/hooks/useNaverMap";
import { bindOverlayEventListeners, removeOverlayEventListeners } from "../shared/overlayUtils";

type StyleOptions = naver.maps.StyleOptions;
type StylingFunction = naver.maps.StylingFunction;

interface GpxOptionProps {
  url: string;
  autoStyle?: boolean;
  style?: StyleOptions | StylingFunction;
}

interface GpxLifecycleProps {
  onDataReady?: (data: naver.maps.Data) => void;
  onDataDestroy?: () => void;
  onDataError?: (error: Error) => void;
  onFeaturesAdded?: (features: naver.maps.Feature[]) => void;
}

interface GpxEventProps {
  onAddFeature?: (event: naver.maps.FeatureEvent) => void;
  onRemoveFeature?: (event: naver.maps.FeatureEvent) => void;
  onPropertyChanged?: (event: naver.maps.PropertyEvent) => void;
  onClick?: (event: naver.maps.PointerEvent) => void;
  onDblClick?: (event: naver.maps.PointerEvent) => void;
  onRightClick?: (event: naver.maps.PointerEvent) => void;
  onMouseDown?: (event: naver.maps.PointerEvent) => void;
  onMouseUp?: (event: naver.maps.PointerEvent) => void;
  onMouseOver?: (event: naver.maps.PointerEvent) => void;
  onMouseOut?: (event: naver.maps.PointerEvent) => void;
}

export type GpxProps = GpxOptionProps & GpxLifecycleProps & GpxEventProps;

type DataMethod<K extends keyof naver.maps.Data> = naver.maps.Data[K] extends (
  ...args: infer A
) => infer R
  ? (...args: A) => R | undefined
  : never;

export interface GpxRef {
  getInstance: () => naver.maps.Data | null;
  getAllFeature: DataMethod<"getAllFeature">;
  getFeatureById: DataMethod<"getFeatureById">;
  getMap: DataMethod<"getMap">;
  getStyle: DataMethod<"getStyle">;
  overrideStyle: DataMethod<"overrideStyle">;
  removeFeature: DataMethod<"removeFeature">;
  revertStyle: DataMethod<"revertStyle">;
  setStyle: DataMethod<"setStyle">;
  toGeoJson: DataMethod<"toGeoJson">;
}

function buildGpxEventBindings(props: GpxProps) {
  return [
    {
      eventName: "addfeature",
      invoke: props.onAddFeature
        ? (event: unknown) => props.onAddFeature?.(event as naver.maps.FeatureEvent)
        : undefined
    },
    {
      eventName: "removefeature",
      invoke: props.onRemoveFeature
        ? (event: unknown) => props.onRemoveFeature?.(event as naver.maps.FeatureEvent)
        : undefined
    },
    {
      eventName: "property_changed",
      invoke: props.onPropertyChanged
        ? (event: unknown) => props.onPropertyChanged?.(event as naver.maps.PropertyEvent)
        : undefined
    },
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
      eventName: "rightclick",
      invoke: props.onRightClick
        ? (event: unknown) => props.onRightClick?.(event as naver.maps.PointerEvent)
        : undefined
    },
    {
      eventName: "mousedown",
      invoke: props.onMouseDown
        ? (event: unknown) => props.onMouseDown?.(event as naver.maps.PointerEvent)
        : undefined
    },
    {
      eventName: "mouseup",
      invoke: props.onMouseUp
        ? (event: unknown) => props.onMouseUp?.(event as naver.maps.PointerEvent)
        : undefined
    },
    {
      eventName: "mouseover",
      invoke: props.onMouseOver
        ? (event: unknown) => props.onMouseOver?.(event as naver.maps.PointerEvent)
        : undefined
    },
    {
      eventName: "mouseout",
      invoke: props.onMouseOut
        ? (event: unknown) => props.onMouseOut?.(event as naver.maps.PointerEvent)
        : undefined
    }
  ];
}

function parseXml(xmlString: string): Document {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, "application/xml");
  const parseError = doc.querySelector("parsererror");

  if (parseError) {
    throw new Error(`XML parse error: ${parseError.textContent}`);
  }

  return doc;
}

export const Gpx = forwardRef<GpxRef, GpxProps>(function GpxInner(props, ref) {
  const { map: contextMap, sdkStatus } = useNaverMap();
  const dataRef = useRef<naver.maps.Data | null>(null);
  const dataEventListenersRef = useRef<naver.maps.MapEventListener[]>([]);
  const onDataDestroyRef = useRef<GpxProps["onDataDestroy"]>(props.onDataDestroy);
  const prevUrlRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    onDataDestroyRef.current = props.onDataDestroy;
  }, [props.onDataDestroy]);

  const invokeDataMethod = useCallback(
    <K extends keyof naver.maps.Data>(
      methodName: K,
      ...args: Parameters<Extract<naver.maps.Data[K], (...params: never[]) => unknown>>
    ): ReturnType<Extract<naver.maps.Data[K], (...params: never[]) => unknown>> | undefined => {
      const data = dataRef.current;

      if (!data) {
        return undefined;
      }

      const method = data[methodName] as unknown;

      if (typeof method !== "function") {
        return undefined;
      }

      return (method as (...params: unknown[]) => unknown).apply(data, args) as ReturnType<
        Extract<naver.maps.Data[K], (...params: never[]) => unknown>
      >;
    },
    []
  );

  const teardownData = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;

    const data = dataRef.current;

    if (!data) {
      return;
    }

    try {
      removeOverlayEventListeners(dataEventListenersRef.current);
      dataEventListenersRef.current = [];
      naver.maps.Event.clearInstanceListeners(data);
    } catch (error) {
      console.error("[react-naver-maps-kit] failed to clear GPX data layer listeners", error);
    }

    data.setMap(null);
    dataRef.current = null;
    prevUrlRef.current = null;
    onDataDestroyRef.current?.();
  }, []);

  useImperativeHandle(
    ref,
    (): GpxRef => ({
      getInstance: () => dataRef.current,
      getAllFeature: (...args) => invokeDataMethod("getAllFeature", ...args),
      getFeatureById: (...args) => invokeDataMethod("getFeatureById", ...args),
      getMap: (...args) => invokeDataMethod("getMap", ...args),
      getStyle: (...args) => invokeDataMethod("getStyle", ...args),
      overrideStyle: (...args) => invokeDataMethod("overrideStyle", ...args),
      removeFeature: (...args) => invokeDataMethod("removeFeature", ...args),
      revertStyle: (...args) => invokeDataMethod("revertStyle", ...args),
      setStyle: (...args) => invokeDataMethod("setStyle", ...args),
      toGeoJson: (...args) => invokeDataMethod("toGeoJson", ...args)
    }),
    [invokeDataMethod]
  );

  const loadAndAddGpx = useCallback(
    async (data: naver.maps.Data, url: string, isInitial: boolean) => {
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const response = await fetch(url, { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`Failed to fetch GPX: ${response.status} ${response.statusText}`);
        }

        const xmlString = await response.text();
        const xmlDoc = parseXml(xmlString);

        if (controller.signal.aborted) {
          return;
        }

        if (!isInitial) {
          const existingFeatures = data.getAllFeature();
          existingFeatures.forEach((feature) => data.removeFeature(feature));
        }

        const features = data.addGpx(xmlDoc, props.autoStyle ?? true);
        prevUrlRef.current = url;
        props.onFeaturesAdded?.(features as unknown as naver.maps.Feature[]);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        const normalizedError =
          error instanceof Error ? error : new Error("Failed to load GPX data.");

        props.onDataError?.(normalizedError);
      }
    },
    [props.autoStyle, props.onFeaturesAdded, props.onDataError]
  );

  useEffect(() => {
    if (sdkStatus !== "ready" || !contextMap || dataRef.current) {
      return;
    }

    try {
      const data = new naver.maps.Data();
      data.setMap(contextMap);

      if (props.style) {
        data.setStyle(props.style);
      }

      dataRef.current = data;
      bindOverlayEventListeners(data, dataEventListenersRef, buildGpxEventBindings(props));
      props.onDataReady?.(data);
      loadAndAddGpx(data, props.url, true);
    } catch (error) {
      const normalizedError =
        error instanceof Error ? error : new Error("Failed to create naver.maps.Data instance.");

      props.onDataError?.(normalizedError);
    }
  }, [sdkStatus, contextMap]);

  useEffect(() => {
    const data = dataRef.current;

    if (!data || props.url === prevUrlRef.current) {
      return;
    }

    abortRef.current?.abort();
    loadAndAddGpx(data, props.url, false);
  }, [props.url, loadAndAddGpx]);

  useEffect(() => {
    const data = dataRef.current;

    if (!data) {
      return;
    }

    if (props.style) {
      data.setStyle(props.style);
    }
  }, [props.style]);

  useEffect(() => {
    const data = dataRef.current;

    if (!data) {
      return;
    }

    bindOverlayEventListeners(data, dataEventListenersRef, buildGpxEventBindings(props));

    return () => {
      removeOverlayEventListeners(dataEventListenersRef.current);
      dataEventListenersRef.current = [];
    };
  }, [props]);

  useEffect(() => {
    return () => {
      teardownData();
    };
  }, [teardownData]);

  return null;
});

Gpx.displayName = "Gpx";
