import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";

import { useNaverMap } from "../../react/hooks/useNaverMap";
import { useMapInstance } from "../../react/context/MapInstanceContext";
import { bindOverlayEventListeners, removeOverlayEventListeners } from "../shared/overlayUtils";

type StyleOptions = naver.maps.StyleOptions;
type StylingFunction = naver.maps.StylingFunction;
type GeoJSONData = naver.maps.GeoJSON;

interface GeoJsonOptionProps {
  data: GeoJSONData;
  autoStyle?: boolean;
  style?: StyleOptions | StylingFunction;
}

interface GeoJsonLifecycleProps {
  onDataReady?: (data: naver.maps.Data) => void;
  onDataDestroy?: () => void;
  onDataError?: (error: Error) => void;
  onFeaturesAdded?: (features: naver.maps.Feature[]) => void;
}

interface GeoJsonEventProps {
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

export type GeoJsonProps = GeoJsonOptionProps & GeoJsonLifecycleProps & GeoJsonEventProps;

type DataMethod<K extends keyof naver.maps.Data> = naver.maps.Data[K] extends (
  ...args: infer A
) => infer R
  ? (...args: A) => R | undefined
  : never;

export interface GeoJsonRef {
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

function buildGeoJsonEventBindings(props: GeoJsonProps) {
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

export const GeoJson = forwardRef<GeoJsonRef, GeoJsonProps>(function GeoJsonInner(props, ref) {
  const { sdkStatus } = useNaverMap();
  const mapInstanceContext = useMapInstance();
  const contextMap = mapInstanceContext?.instance as naver.maps.Map | null;

  const dataRef = useRef<naver.maps.Data | null>(null);
  const dataEventListenersRef = useRef<naver.maps.MapEventListener[]>([]);
  const onDataDestroyRef = useRef<GeoJsonProps["onDataDestroy"]>(props.onDataDestroy);
  const prevDataRef = useRef<GeoJSONData | null>(null);

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
    const data = dataRef.current;

    if (!data) {
      return;
    }

    try {
      removeOverlayEventListeners(dataEventListenersRef.current);
      dataEventListenersRef.current = [];
      naver.maps.Event.clearInstanceListeners(data);
    } catch (error) {
      console.error("[react-naver-maps-kit] failed to clear GeoJson data layer listeners", error);
    }

    data.setMap(null);
    dataRef.current = null;
    prevDataRef.current = null;
    onDataDestroyRef.current?.();
  }, []);

  useImperativeHandle(
    ref,
    (): GeoJsonRef => ({
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

      const features = data.addGeoJson(props.data, props.autoStyle ?? true);
      prevDataRef.current = props.data;

      dataRef.current = data;
      bindOverlayEventListeners(data, dataEventListenersRef, buildGeoJsonEventBindings(props));
      props.onDataReady?.(data);
      props.onFeaturesAdded?.(features as unknown as naver.maps.Feature[]);
    } catch (error) {
      const normalizedError =
        error instanceof Error
          ? error
          : new Error("Failed to create naver.maps.Data instance for GeoJson.");

      props.onDataError?.(normalizedError);
    }
  }, [sdkStatus, contextMap]);

  useEffect(() => {
    const data = dataRef.current;

    if (!data || props.data === prevDataRef.current) {
      return;
    }

    try {
      if (prevDataRef.current) {
        data.removeGeoJson(prevDataRef.current);
      }

      const features = data.addGeoJson(props.data, props.autoStyle ?? true);
      prevDataRef.current = props.data;
      props.onFeaturesAdded?.(features as unknown as naver.maps.Feature[]);
    } catch (error) {
      const normalizedError =
        error instanceof Error ? error : new Error("Failed to update GeoJson data.");

      props.onDataError?.(normalizedError);
    }
  }, [props.data, props.autoStyle]);

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

    bindOverlayEventListeners(data, dataEventListenersRef, buildGeoJsonEventBindings(props));

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

GeoJson.displayName = "GeoJson";
