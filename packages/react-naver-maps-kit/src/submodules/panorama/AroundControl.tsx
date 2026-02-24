import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";

import { usePanorama } from "./PanoramaContext";

export interface AroundControlProps {
  position?: naver.maps.Position;
  visible?: boolean;
  onAroundControlReady?: (aroundControl: naver.maps.AroundControl) => void;
  onAroundControlDestroy?: () => void;
  onAroundControlError?: (error: Error) => void;
}

type AroundControlMethod<K extends keyof naver.maps.AroundControl> =
  naver.maps.AroundControl[K] extends (...args: infer A) => infer R
    ? (...args: A) => R | undefined
    : never;

export interface AroundControlRef {
  getInstance: () => naver.maps.AroundControl | null;
  getElement: AroundControlMethod<"getElement">;
  getMap: AroundControlMethod<"getMap">;
  getOptions: AroundControlMethod<"getOptions">;
  html: AroundControlMethod<"html">;
  setMap: AroundControlMethod<"setMap">;
  setOptions: AroundControlMethod<"setOptions">;
  setPosition: AroundControlMethod<"setPosition">;
}

export const AroundControl = forwardRef<AroundControlRef, AroundControlProps>(
  function AroundControlInner(props, ref) {
    const { panorama, sdkStatus, submodules } = usePanorama();

    if (sdkStatus === "ready" && !submodules.includes("panorama")) {
      throw new Error(
        'AroundControl component requires "panorama" submodule. ' +
          'Add submodules={["panorama"]} to your NaverMapProvider.'
      );
    }

    const aroundControlRef = useRef<naver.maps.AroundControl | null>(null);
    const onAroundControlDestroyRef = useRef<
      Pick<AroundControlProps, "onAroundControlDestroy">["onAroundControlDestroy"]
    >(props.onAroundControlDestroy);

    const propsRef = useRef(props);
    useEffect(() => {
      propsRef.current = props;
    });

    useEffect(() => {
      onAroundControlDestroyRef.current = props.onAroundControlDestroy;
    }, [props.onAroundControlDestroy]);

    const invokeAroundControlMethod = useCallback(
      <K extends keyof naver.maps.AroundControl>(
        methodName: K,
        ...args: Parameters<Extract<naver.maps.AroundControl[K], (...params: never[]) => unknown>>
      ):
        | ReturnType<Extract<naver.maps.AroundControl[K], (...params: never[]) => unknown>>
        | undefined => {
        const aroundControl = aroundControlRef.current;
        if (!aroundControl) return undefined;

        const method = aroundControl[methodName] as unknown;
        if (typeof method !== "function") return undefined;

        return (method as (...params: unknown[]) => unknown).apply(
          aroundControl,
          args
        ) as ReturnType<Extract<naver.maps.AroundControl[K], (...params: never[]) => unknown>>;
      },
      []
    );

    const teardownAroundControl = useCallback(() => {
      const aroundControl = aroundControlRef.current;
      if (!aroundControl) return;

      try {
        naver.maps.Event.clearInstanceListeners(aroundControl);
      } catch (error) {
        console.error("[react-naver-maps-kit] failed to clear aroundControl listeners", error);
      }

      const ctrl = aroundControl as unknown as { setMap: (p: naver.maps.Panorama | null) => void };
      ctrl.setMap(null);
      aroundControlRef.current = null;
      onAroundControlDestroyRef.current?.();
    }, []);

    useImperativeHandle(
      ref,
      (): AroundControlRef => ({
        getInstance: () => aroundControlRef.current,
        getElement: (...args) => invokeAroundControlMethod("getElement", ...args),
        getMap: (...args) => invokeAroundControlMethod("getMap", ...args),
        getOptions: (...args) => invokeAroundControlMethod("getOptions", ...args),
        html: (...args) => invokeAroundControlMethod("html", ...args),
        setMap: (...args) => invokeAroundControlMethod("setMap", ...args),
        setOptions: (...args) => invokeAroundControlMethod("setOptions", ...args),
        setPosition: (...args) => invokeAroundControlMethod("setPosition", ...args)
      }),
      [invokeAroundControlMethod]
    );

    useEffect(() => {
      if (sdkStatus !== "ready" || !panorama || aroundControlRef.current) {
        return;
      }

      try {
        const options: naver.maps.AroundControlOptions = {
          position: propsRef.current.position ?? naver.maps.Position.TOP_RIGHT
        };

        const aroundControl = new naver.maps.AroundControl(options);
        aroundControlRef.current = aroundControl;

        if (propsRef.current.visible !== false) {
          const ctrl = aroundControl as unknown as {
            setMap: (p: naver.maps.Panorama | null) => void;
          };
          ctrl.setMap(panorama);
        }

        propsRef.current.onAroundControlReady?.(aroundControl);
      } catch (error) {
        const normalizedError =
          error instanceof Error
            ? error
            : new Error("Failed to create naver.maps.AroundControl instance.");
        propsRef.current.onAroundControlError?.(normalizedError);
      }
    }, [sdkStatus, panorama]);

    useEffect(() => {
      const aroundControl = aroundControlRef.current;
      if (!aroundControl || !panorama) return;

      const ctrl = aroundControl as unknown as { setMap: (p: naver.maps.Panorama | null) => void };
      if (props.visible === false) {
        ctrl.setMap(null);
      } else {
        ctrl.setMap(panorama);
        if (props.position !== undefined) {
          aroundControl.setPosition(props.position);
        }
      }
    }, [props.visible, props.position, panorama]);

    useEffect(() => {
      return () => {
        teardownAroundControl();
      };
    }, [teardownAroundControl]);

    return null;
  }
);

AroundControl.displayName = "AroundControl";
