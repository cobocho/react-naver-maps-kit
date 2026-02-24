import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import { unzipSync } from "fflate";

import { useNaverMap } from "../../react/hooks/useNaverMap";
import { useMapInstance } from "../../react/context/MapInstanceContext";
import { bindOverlayEventListeners, removeOverlayEventListeners } from "../shared/overlayUtils";

type StyleOptions = naver.maps.StyleOptions;
type StylingFunction = naver.maps.StylingFunction;

interface KmzOptionProps {
  url: string;
  autoStyle?: boolean;
  style?: StyleOptions | StylingFunction;
}

interface KmzLifecycleProps {
  onDataReady?: (data: naver.maps.Data) => void;
  onDataDestroy?: () => void;
  onDataError?: (error: Error) => void;
  onFeaturesAdded?: (features: naver.maps.Feature[]) => void;
}

interface KmzEventProps {
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

export type KmzProps = KmzOptionProps & KmzLifecycleProps & KmzEventProps;

type DataMethod<K extends keyof naver.maps.Data> = naver.maps.Data[K] extends (
  ...args: infer A
) => infer R
  ? (...args: A) => R | undefined
  : never;

export interface KmzRef {
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

function buildKmzEventBindings(props: KmzProps) {
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

function extractKmlFromKmz(arrayBuffer: ArrayBuffer): Document {
  const uint8 = new Uint8Array(arrayBuffer);
  const files = unzipSync(uint8);

  const kmlFileName = Object.keys(files).find(
    (name) => name.endsWith(".kml") || name === "doc.kml"
  );

  if (!kmlFileName) {
    throw new Error("No KML file found in KMZ archive.");
  }

  const kmlBytes = files[kmlFileName];
  const decoder = new TextDecoder("utf-8");
  const kmlString = decoder.decode(kmlBytes);

  const parser = new DOMParser();
  const doc = parser.parseFromString(kmlString, "application/xml");
  const parseError = doc.querySelector("parsererror");

  if (parseError) {
    throw new Error(`KML parse error: ${parseError.textContent}`);
  }

  return doc;
}

export const Kmz = forwardRef<KmzRef, KmzProps>(function KmzInner(props, ref) {
  const { sdkStatus } = useNaverMap();
  const mapInstanceContext = useMapInstance();
  const contextMap = mapInstanceContext?.instance as naver.maps.Map | null;
  
  const dataRef = useRef<naver.maps.Data | null>(null);
  const dataEventListenersRef = useRef<naver.maps.MapEventListener[]>([]);
  const onDataDestroyRef = useRef<KmzProps["onDataDestroy"]>(props.onDataDestroy);
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
      console.error("[react-naver-maps-kit] failed to clear KMZ data layer listeners", error);
    }

    data.setMap(null);
    dataRef.current = null;
    prevUrlRef.current = null;
    onDataDestroyRef.current?.();
  }, []);

  useImperativeHandle(
    ref,
    (): KmzRef => ({
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

  const loadAndAddKmz = useCallback(
    async (data: naver.maps.Data, url: string, isInitial: boolean) => {
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const response = await fetch(url, { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`Failed to fetch KMZ: ${response.status} ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();

        if (controller.signal.aborted) {
          return;
        }

        const kmlDoc = extractKmlFromKmz(arrayBuffer);

        if (!isInitial) {
          const existingFeatures = data.getAllFeature();
          existingFeatures.forEach((feature) => data.removeFeature(feature));
        }

        const features = data.addKml(kmlDoc, props.autoStyle ?? true);
        prevUrlRef.current = url;
        props.onFeaturesAdded?.(features as unknown as naver.maps.Feature[]);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        const normalizedError =
          error instanceof Error ? error : new Error("Failed to load KMZ data.");

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
      bindOverlayEventListeners(data, dataEventListenersRef, buildKmzEventBindings(props));
      props.onDataReady?.(data);
      loadAndAddKmz(data, props.url, true);
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
    loadAndAddKmz(data, props.url, false);
  }, [props.url, loadAndAddKmz]);

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

    bindOverlayEventListeners(data, dataEventListenersRef, buildKmzEventBindings(props));

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

Kmz.displayName = "Kmz";
