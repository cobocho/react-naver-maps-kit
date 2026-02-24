import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from "react";

import { NaverMapContext } from "../../react/provider/NaverMapProvider";
import { MapInstanceContext, type MapInstanceContextValue } from "../../react/context/MapInstanceContext";
import { PanoramaContext } from "./PanoramaContext";

import type { ReactNode } from "react";

type PanoramaOptions = naver.maps.PanoramaOptions;

interface PanoramaOptionProps {
  size?: PanoramaOptions["size"];
  panoId?: PanoramaOptions["panoId"];
  position?: PanoramaOptions["position"];
  defaultPosition?: PanoramaOptions["position"];
  pov?: PanoramaOptions["pov"];
  defaultPov?: PanoramaOptions["pov"];
  visible?: PanoramaOptions["visible"];
  minScale?: PanoramaOptions["minScale"];
  maxScale?: PanoramaOptions["maxScale"];
  minZoom?: PanoramaOptions["minZoom"];
  maxZoom?: PanoramaOptions["maxZoom"];
  flightSpot?: PanoramaOptions["flightSpot"];
  logoControl?: PanoramaOptions["logoControl"];
  logoControlOptions?: PanoramaOptions["logoControlOptions"];
  zoomControl?: PanoramaOptions["zoomControl"];
  zoomControlOptions?: PanoramaOptions["zoomControlOptions"];
  aroundControl?: PanoramaOptions["aroundControl"];
  aroundControlOptions?: PanoramaOptions["aroundControlOptions"];
}

interface PanoramaLifecycleProps {
  children?: ReactNode;
  onPanoramaReady?: (panorama: naver.maps.Panorama) => void;
  onPanoramaDestroy?: () => void;
  onPanoramaError?: (error: Error) => void;
}

interface PanoramaEventProps {
  onInit?: () => void;
  onPanoChanged?: () => void;
  onPanoStatus?: (status: string) => void;
  onPovChanged?: () => void;
}

export type PanoramaProps = PanoramaOptionProps &
  PanoramaLifecycleProps &
  PanoramaEventProps & {
    style?: React.CSSProperties;
    className?: string;
  };

type PanoramaMethod<K extends keyof naver.maps.Panorama> = naver.maps.Panorama[K] extends (
  ...args: infer A
) => infer R
  ? (...args: A) => R | undefined
  : never;

export interface PanoramaRef {
  getInstance: () => naver.maps.Panorama | null;
  getElement: PanoramaMethod<"getElement">;
  getLocation: PanoramaMethod<"getLocation">;
  getMaxScale: PanoramaMethod<"getMaxScale">;
  getMaxZoom: PanoramaMethod<"getMaxZoom">;
  getMinScale: PanoramaMethod<"getMinScale">;
  getMinZoom: PanoramaMethod<"getMinZoom">;
  getOptions: PanoramaMethod<"getOptions">;
  getPanoId: PanoramaMethod<"getPanoId">;
  getPosition: PanoramaMethod<"getPosition">;
  getPov: PanoramaMethod<"getPov">;
  getProjection: PanoramaMethod<"getProjection">;
  getScale: PanoramaMethod<"getScale">;
  getSize: PanoramaMethod<"getSize">;
  getVisible: PanoramaMethod<"getVisible">;
  getZoom: PanoramaMethod<"getZoom">;
  setOptions: PanoramaMethod<"setOptions">;
  setPanoId: PanoramaMethod<"setPanoId">;
  setPanoIdWithPov: PanoramaMethod<"setPanoIdWithPov">;
  setPosition: PanoramaMethod<"setPosition">;
  setPov: PanoramaMethod<"setPov">;
  setScale: PanoramaMethod<"setScale">;
  setSize: PanoramaMethod<"setSize">;
  setVisible: PanoramaMethod<"setVisible">;
  setZoom: PanoramaMethod<"setZoom">;
  zoomIn: PanoramaMethod<"zoomIn">;
  zoomOut: PanoramaMethod<"zoomOut">;
}

interface PanoramaEventBinding {
  eventName: string;
  invoke?: (event: unknown) => void;
}

function toLatLng(
  position: PanoramaOptions["position"]
): naver.maps.LatLng | PanoramaOptions["position"] {
  if (!position) return position;
  const pos = position as { lat?: number; lng?: number };
  if (typeof pos.lat === "number" && typeof pos.lng === "number") {
    return new naver.maps.LatLng(pos.lat, pos.lng);
  }
  return position;
}

function toPanoramaOptions(
  props: PanoramaProps,
  convertLatLng = false,
  excludeControlled = false
): PanoramaOptions {
  const options: PanoramaOptions = {};

  if (props.size !== undefined) options.size = props.size;
  if (props.panoId !== undefined) options.panoId = props.panoId;
  if (!excludeControlled && props.position !== undefined) {
    options.position = convertLatLng ? toLatLng(props.position) : props.position;
  }
  if (!excludeControlled && props.pov !== undefined) options.pov = props.pov;
  if (props.visible !== undefined) options.visible = props.visible;
  if (props.minScale !== undefined) options.minScale = props.minScale;
  if (props.maxScale !== undefined) options.maxScale = props.maxScale;
  if (props.minZoom !== undefined) options.minZoom = props.minZoom;
  if (props.maxZoom !== undefined) options.maxZoom = props.maxZoom;
  if (props.flightSpot !== undefined) options.flightSpot = props.flightSpot;
  if (props.logoControl !== undefined) options.logoControl = props.logoControl;
  if (props.logoControlOptions !== undefined) options.logoControlOptions = props.logoControlOptions;
  if (props.zoomControl !== undefined) options.zoomControl = props.zoomControl;
  if (props.zoomControlOptions !== undefined) options.zoomControlOptions = props.zoomControlOptions;
  if (props.aroundControl !== undefined) options.aroundControl = props.aroundControl;
  if (props.aroundControlOptions !== undefined)
    options.aroundControlOptions = props.aroundControlOptions;

  return options;
}

function buildPanoramaEventBindings(props: PanoramaProps): PanoramaEventBinding[] {
  return [
    {
      eventName: "init",
      invoke: props.onInit ? () => props.onInit?.() : undefined
    },
    {
      eventName: "pano_changed",
      invoke: props.onPanoChanged ? () => props.onPanoChanged?.() : undefined
    },
    {
      eventName: "pano_status",
      invoke: props.onPanoStatus ? (event) => props.onPanoStatus?.(event as string) : undefined
    },
    {
      eventName: "pov_changed",
      invoke: props.onPovChanged ? () => props.onPovChanged?.() : undefined
    }
  ];
}

function bindPanoramaEventListeners(
  panorama: naver.maps.Panorama,
  listenersRef: { current: naver.maps.MapEventListener[] },
  bindings: PanoramaEventBinding[]
): void {
  if (listenersRef.current.length > 0) {
    naver.maps.Event.removeListener(listenersRef.current);
    listenersRef.current = [];
  }

  listenersRef.current = bindings
    .filter((binding) => typeof binding.invoke === "function")
    .map((binding) =>
      naver.maps.Event.addListener(panorama, binding.eventName, (event: unknown) => {
        binding.invoke?.(event);
      })
    );
}

export const Panorama = forwardRef<PanoramaRef, PanoramaProps>(function PanoramaInner(props, ref) {
  const naverMapContext = NaverMapContext as unknown as React.Context<
    NonNullable<React.ContextType<typeof NaverMapContext>>
  >;
  const context = React.useContext(naverMapContext);

  if (!context) {
    throw new Error("Panorama must be used inside NaverMapProvider.");
  }

  const { sdkStatus, submodules } = context;

  // 서브모듈 검증
  if (sdkStatus === "ready" && !submodules.includes("panorama")) {
    throw new Error(
      'Panorama component requires "panorama" submodule. ' +
        'Add submodules={["panorama"]} to your NaverMapProvider.'
    );
  }

  const containerRef = useRef<HTMLDivElement | null>(null);
  const panoramaRef = useRef<naver.maps.Panorama | null>(null);
  const eventListenersRef = useRef<naver.maps.MapEventListener[]>([]);
  const onPanoramaDestroyRef = useRef<PanoramaProps["onPanoramaDestroy"]>(props.onPanoramaDestroy);
  const [panoramaInstance, setPanoramaInstance] = useState<naver.maps.Panorama | null>(null);
  const [panoramaReady, setPanoramaReady] = useState(false);

  const propsRef = useRef(props);
  useEffect(() => {
    propsRef.current = props;
  });

  useEffect(() => {
    onPanoramaDestroyRef.current = props.onPanoramaDestroy;
  }, [props.onPanoramaDestroy]);

  // 초기값 (최초 1회만 캡처)
  const initialPositionRef = useRef(props.position ?? props.defaultPosition);
  const initialPovRef = useRef(props.pov ?? props.defaultPov);

  // controlled 여부
  const isControlledPosition = props.position !== undefined;
  const isControlledPov = props.pov !== undefined;

  const optionsSnapshot = useMemo(
    () => toPanoramaOptions(props, false, true),
    [
      props.size,
      props.panoId,
      props.visible,
      props.minScale,
      props.maxScale,
      props.minZoom,
      props.maxZoom,
      props.flightSpot,
      props.logoControl,
      props.logoControlOptions,
      props.zoomControl,
      props.zoomControlOptions,
      props.aroundControl,
      props.aroundControlOptions
    ]
  );

  const invokePanoramaMethod = useCallback(
    <K extends keyof naver.maps.Panorama>(
      methodName: K,
      ...args: Parameters<Extract<naver.maps.Panorama[K], (...params: never[]) => unknown>>
    ): ReturnType<Extract<naver.maps.Panorama[K], (...params: never[]) => unknown>> | undefined => {
      const panorama = panoramaRef.current;
      if (!panorama) return undefined;

      const method = panorama[methodName] as unknown;
      if (typeof method !== "function") return undefined;

      return (method as (...params: unknown[]) => unknown).apply(panorama, args) as ReturnType<
        Extract<naver.maps.Panorama[K], (...params: never[]) => unknown>
      >;
    },
    []
  );

  useImperativeHandle(
    ref,
    (): PanoramaRef => ({
      getInstance: () => panoramaRef.current,
      getElement: (...args) => invokePanoramaMethod("getElement", ...args),
      getLocation: (...args) => invokePanoramaMethod("getLocation", ...args),
      getMaxScale: (...args) => invokePanoramaMethod("getMaxScale", ...args),
      getMaxZoom: (...args) => invokePanoramaMethod("getMaxZoom", ...args),
      getMinScale: (...args) => invokePanoramaMethod("getMinScale", ...args),
      getMinZoom: (...args) => invokePanoramaMethod("getMinZoom", ...args),
      getOptions: (...args) => invokePanoramaMethod("getOptions", ...args),
      getPanoId: (...args) => invokePanoramaMethod("getPanoId", ...args),
      getPosition: (...args) => invokePanoramaMethod("getPosition", ...args),
      getPov: (...args) => invokePanoramaMethod("getPov", ...args),
      getProjection: (...args) => invokePanoramaMethod("getProjection", ...args),
      getScale: (...args) => invokePanoramaMethod("getScale", ...args),
      getSize: (...args) => invokePanoramaMethod("getSize", ...args),
      getVisible: (...args) => invokePanoramaMethod("getVisible", ...args),
      getZoom: (...args) => invokePanoramaMethod("getZoom", ...args),
      setOptions: (...args) => invokePanoramaMethod("setOptions", ...args),
      setPanoId: (...args) => invokePanoramaMethod("setPanoId", ...args),
      setPanoIdWithPov: (...args) => invokePanoramaMethod("setPanoIdWithPov", ...args),
      setPosition: (...args) => invokePanoramaMethod("setPosition", ...args),
      setPov: (...args) => invokePanoramaMethod("setPov", ...args),
      setScale: (...args) => invokePanoramaMethod("setScale", ...args),
      setSize: (...args) => invokePanoramaMethod("setSize", ...args),
      setVisible: (...args) => invokePanoramaMethod("setVisible", ...args),
      setZoom: (...args) => invokePanoramaMethod("setZoom", ...args),
      zoomIn: (...args) => invokePanoramaMethod("zoomIn", ...args),
      zoomOut: (...args) => invokePanoramaMethod("zoomOut", ...args)
    }),
    [invokePanoramaMethod]
  );

  useEffect(() => {
    if (sdkStatus !== "ready" || !containerRef.current || panoramaRef.current) {
      return;
    }

    const container = containerRef.current;

    try {
      // 생성 시점의 옵션 스냅샷 (controlled/default 값 포함)
      const initOpts = toPanoramaOptions(propsRef.current, true, true);
      if (initialPositionRef.current !== undefined) {
        initOpts.position = toLatLng(initialPositionRef.current);
      }
      if (initialPovRef.current !== undefined) {
        initOpts.pov = initialPovRef.current;
      }

      const panorama = new naver.maps.Panorama(container, initOpts);

      panoramaRef.current = panorama;
      setPanoramaInstance(panorama);
      setPanoramaReady(true);

      bindPanoramaEventListeners(
        panorama,
        eventListenersRef,
        buildPanoramaEventBindings(propsRef.current)
      );

      propsRef.current.onPanoramaReady?.(panorama);
    } catch (error) {
      console.error("[Panorama] Failed to create panorama:", error);
      const normalizedError =
        error instanceof Error
          ? error
          : new Error("Failed to create naver.maps.Panorama instance.");
      propsRef.current.onPanoramaError?.(normalizedError);
    }
  }, [sdkStatus]);

  useEffect(() => {
    return () => {
      const container = containerRef.current;

      try {
        if (eventListenersRef.current.length > 0) {
          naver.maps.Event.removeListener(eventListenersRef.current);
          eventListenersRef.current = [];
        }
        if (panoramaRef.current) {
          naver.maps.Event.clearInstanceListeners(panoramaRef.current);
        }
      } catch (error) {
        console.error("[react-naver-maps-kit] failed to clear panorama listeners", error);
      }

      if (container) {
        container.innerHTML = "";
      }
      panoramaRef.current = null;
      setPanoramaInstance(null);
      setPanoramaReady(false);
      onPanoramaDestroyRef.current?.();
    };
  }, []);

  // 옵션 동기화 (position/pov 제외)
  useEffect(() => {
    const panorama = panoramaRef.current;
    if (!panorama) return;

    if (Object.keys(optionsSnapshot).length > 0) {
      panorama.setOptions(optionsSnapshot);
    }
  }, [optionsSnapshot]);

  // controlled position 동기화
  useEffect(() => {
    const panorama = panoramaRef.current;
    if (!panorama || !isControlledPosition || props.position === undefined) return;

    panorama.setPosition(toLatLng(props.position) as naver.maps.LatLng);
  }, [isControlledPosition, props.position]);

  // controlled pov 동기화
  useEffect(() => {
    const panorama = panoramaRef.current;
    if (!panorama || !isControlledPov || props.pov === undefined) return;

    panorama.setPov(props.pov);
  }, [isControlledPov, props.pov]);

  const panoramaContextValue = useMemo(
    () => ({
      panorama: panoramaInstance,
      setPanorama: setPanoramaInstance,
      sdkStatus,
      submodules
    }),
    [panoramaInstance, sdkStatus, submodules]
  );

  // MapInstanceContext for Marker etc.
  const mapInstanceContextValue = useMemo<MapInstanceContextValue>(
    () => ({
      instance: panoramaInstance,
      setInstance: setPanoramaInstance as (instance: naver.maps.Map | naver.maps.Panorama | null) => void,
      type: "panorama"
    }),
    [panoramaInstance]
  );

  // @deprecated: NaverMapContext override for backward compatibility
  const naverMapContextValue = useMemo(
    () => ({
      ...context,
      map: panoramaInstance as unknown as naver.maps.Map | null,
      setMap: setPanoramaInstance as unknown as (map: naver.maps.Map | null) => void
    }),
    [context, panoramaInstance]
  );

  return (
    <NaverMapContext.Provider value={naverMapContextValue}>
      <MapInstanceContext.Provider value={mapInstanceContextValue}>
        <PanoramaContext.Provider value={panoramaContextValue}>
          <div ref={containerRef} style={props.style} className={props.className}>
            {panoramaReady ? props.children : null}
          </div>
        </PanoramaContext.Provider>
      </MapInstanceContext.Provider>
    </NaverMapContext.Provider>
  );
});

Panorama.displayName = "Panorama";
