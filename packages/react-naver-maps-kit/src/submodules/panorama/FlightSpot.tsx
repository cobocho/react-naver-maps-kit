import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";

import { useNaverMap } from "../../react/hooks/useNaverMap";
import { useMapInstance } from "../../react/context/MapInstanceContext";
import { usePanorama } from "./PanoramaContext";

export interface FlightSpotProps {
  map?: naver.maps.Map | null;
  visible?: boolean;
  onPoiClicked?: (panoId: string) => void;
  onFlightSpotReady?: (flightSpot: naver.maps.FlightSpot) => void;
  onFlightSpotDestroy?: () => void;
  onFlightSpotError?: (error: Error) => void;
}

type FlightSpotMethod<K extends keyof naver.maps.FlightSpot> = naver.maps.FlightSpot[K] extends (
  ...args: infer A
) => infer R
  ? (...args: A) => R | undefined
  : never;

export interface FlightSpotRef {
  getInstance: () => naver.maps.FlightSpot | null;
  getMap: FlightSpotMethod<"getMap">;
  setMap: FlightSpotMethod<"setMap">;
}

export const FlightSpot = forwardRef<FlightSpotRef, FlightSpotProps>(
  function FlightSpotInner(props, ref) {
    const { sdkStatus, submodules } = useNaverMap();
    const mapInstanceContext = useMapInstance();
    const contextMap = mapInstanceContext?.instance as naver.maps.Map | null;

    let panoramaContext: ReturnType<typeof usePanorama> | null = null;
    try {
      panoramaContext = usePanorama();
    } catch {
      // Panorama context not available - normal case when used outside Panorama
    }

    const flightSpotRef = useRef<naver.maps.FlightSpot | null>(null);
    const eventListenersRef = useRef<naver.maps.MapEventListener[]>([]);
    const onFlightSpotDestroyRef = useRef<
      Pick<FlightSpotProps, "onFlightSpotDestroy">["onFlightSpotDestroy"]
    >(props.onFlightSpotDestroy);

    const targetMap = props.map ?? panoramaContext?.panorama ?? contextMap;
    const isInPanorama = panoramaContext !== null;

    const effectiveSubmodules = panoramaContext?.submodules ?? submodules;
    if (sdkStatus === "ready" && effectiveSubmodules && !effectiveSubmodules.includes("panorama")) {
      throw new Error(
        'FlightSpot component requires "panorama" submodule. ' +
          'Add submodules={["panorama"]} to your NaverMapProvider.'
      );
    }

    const propsRef = useRef(props);
    useEffect(() => {
      propsRef.current = props;
    });

    useEffect(() => {
      onFlightSpotDestroyRef.current = props.onFlightSpotDestroy;
    }, [props.onFlightSpotDestroy]);

    const invokeFlightSpotMethod = useCallback(
      <K extends keyof naver.maps.FlightSpot>(
        methodName: K,
        ...args: Parameters<Extract<naver.maps.FlightSpot[K], (...params: never[]) => unknown>>
      ):
        | ReturnType<Extract<naver.maps.FlightSpot[K], (...params: never[]) => unknown>>
        | undefined => {
        const flightSpot = flightSpotRef.current;
        if (!flightSpot) return undefined;

        const method = flightSpot[methodName] as unknown;
        if (typeof method !== "function") return undefined;

        return (method as (...params: unknown[]) => unknown).apply(flightSpot, args) as ReturnType<
          Extract<naver.maps.FlightSpot[K], (...params: never[]) => unknown>
        >;
      },
      []
    );

    const teardownFlightSpot = useCallback(() => {
      const flightSpot = flightSpotRef.current;
      if (!flightSpot) return;

      try {
        if (eventListenersRef.current.length > 0) {
          naver.maps.Event.removeListener(eventListenersRef.current);
          eventListenersRef.current = [];
        }
        naver.maps.Event.clearInstanceListeners(flightSpot);
      } catch (error) {
        console.error("[react-naver-maps-kit] failed to clear flightSpot listeners", error);
      }

      flightSpot.setMap(null);
      flightSpotRef.current = null;
      onFlightSpotDestroyRef.current?.();
    }, []);

    useImperativeHandle(
      ref,
      (): FlightSpotRef => ({
        getInstance: () => flightSpotRef.current,
        getMap: (...args) => invokeFlightSpotMethod("getMap", ...args),
        setMap: (...args) => invokeFlightSpotMethod("setMap", ...args)
      }),
      [invokeFlightSpotMethod]
    );

    useEffect(() => {
      if (sdkStatus !== "ready" || flightSpotRef.current) {
        return;
      }

      if (isInPanorama && !panoramaContext?.panorama) {
        return;
      }

      try {
        const flightSpot = new naver.maps.FlightSpot();
        flightSpotRef.current = flightSpot;

        if (propsRef.current.onPoiClicked) {
          const listener = naver.maps.Event.addListener(
            flightSpot,
            "poi_clicked",
            (panoId: string) => {
              propsRef.current.onPoiClicked?.(panoId);
            }
          );
          eventListenersRef.current.push(listener);
        }

        if (propsRef.current.visible !== false && targetMap) {
          flightSpot.setMap(targetMap as naver.maps.Map);
        }

        propsRef.current.onFlightSpotReady?.(flightSpot);
      } catch (error) {
        const normalizedError =
          error instanceof Error
            ? error
            : new Error("Failed to create naver.maps.FlightSpot instance.");
        propsRef.current.onFlightSpotError?.(normalizedError);
      }
    }, [sdkStatus, isInPanorama, panoramaContext?.panorama, targetMap]);

    useEffect(() => {
      const flightSpot = flightSpotRef.current;
      if (!flightSpot) return;

      if (props.visible === false) {
        flightSpot.setMap(null);
      } else if (targetMap) {
        flightSpot.setMap(targetMap as naver.maps.Map);
      }
    }, [props.visible, targetMap]);

    useEffect(() => {
      return () => {
        teardownFlightSpot();
      };
    }, [teardownFlightSpot]);

    return null;
  }
);

FlightSpot.displayName = "FlightSpot";
