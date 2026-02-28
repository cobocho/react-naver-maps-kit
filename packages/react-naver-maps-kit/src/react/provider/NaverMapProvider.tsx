import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  loadNaverMapsScript,
  type LoadNaverMapsScriptOptions
} from "../../core/loader/loadNaverMapsScript";
import { throwIfInvalidSubmoduleCombination } from "../../core/errors/NaverMapSubmoduleConfigurationError";

import type { ReactNode } from "react";

type BrowserWindow = Window & {
  navermap_authFailure?: () => void;
};

export type NaverMapSdkStatus = "idle" | "loading" | "ready" | "error";

export type Submodule = "geocoder" | "panorama" | "drawing" | "visualization" | "gl";

export interface NaverMapContextValue {
  sdkStatus: NaverMapSdkStatus;
  sdkError: Error | null;
  reloadSdk: () => Promise<void>;
  retrySdk: () => Promise<void>;
  clearSdkError: () => void;
  submodules: Submodule[];
  /** @deprecated Use useMapInstance() hook instead. Will be removed in future version. */
  map: naver.maps.Map | null;
  /** @deprecated Use MapInstanceContext instead. Will be removed in future version. */
  setMap: (map: naver.maps.Map | null) => void;
}

export interface NaverMapProviderProps extends LoadNaverMapsScriptOptions {
  children: ReactNode;
  autoLoad?: boolean;
  onReady?: () => void;
  onError?: (error: Error) => void;
}

export const NaverMapContext = createContext<NaverMapContextValue | null>(null);

export function NaverMapProvider({
  children,
  autoLoad = true,
  onReady,
  onError,
  ncpKeyId,
  ncpClientId,
  govClientId,
  finClientId,
  submodules,
  timeoutMs,
  nonce
}: NaverMapProviderProps) {
  throwIfInvalidSubmoduleCombination(submodules);

  const [sdkStatus, setSdkStatus] = useState<NaverMapSdkStatus>("idle");
  const [sdkError, setSdkError] = useState<Error | null>(null);
  const [map, setMap] = useState<naver.maps.Map | null>(null);
  const mountedRef = useRef(true);
  const inFlightLoadRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const browserWindow = window as BrowserWindow;
    const previousAuthFailure = browserWindow.navermap_authFailure;

    browserWindow.navermap_authFailure = () => {
      const error = new Error(
        "Naver Maps authentication failed. Check key type (ncpKeyId) and allowed domain settings."
      );

      if (mountedRef.current) {
        setSdkStatus("error");
        setSdkError(error);
      }

      onError?.(error);

      if (previousAuthFailure) {
        previousAuthFailure();
      }
    };

    return () => {
      browserWindow.navermap_authFailure = previousAuthFailure;
    };
  }, [onError]);

  const reloadSdk = useCallback(async () => {
    if (inFlightLoadRef.current) {
      return inFlightLoadRef.current;
    }

    if (mountedRef.current) {
      setSdkStatus("loading");
      setSdkError(null);
    }

    const loadPromise = loadNaverMapsScript({
      ncpKeyId,
      ncpClientId,
      govClientId,
      finClientId,
      submodules,
      timeoutMs,
      nonce
    })
      .then(() => {
        if (mountedRef.current) {
          setSdkStatus("ready");
          setSdkError(null);
        }

        onReady?.();
      })
      .catch((error) => {
        const normalizedError =
          error instanceof Error ? error : new Error("Failed to load Naver Maps SDK.");

        if (mountedRef.current) {
          setSdkStatus("error");
          setSdkError(normalizedError);
        }

        onError?.(normalizedError);
        throw normalizedError;
      })
      .finally(() => {
        inFlightLoadRef.current = null;
      });

    inFlightLoadRef.current = loadPromise;

    return loadPromise;
  }, [
    finClientId,
    govClientId,
    ncpClientId,
    ncpKeyId,
    nonce,
    onError,
    onReady,
    submodules,
    timeoutMs
  ]);

  useEffect(() => {
    if (!autoLoad) {
      return;
    }

    void reloadSdk().catch(() => undefined);
  }, [autoLoad, reloadSdk]);

  const clearSdkError = useCallback(() => {
    if (mountedRef.current) {
      setSdkError(null);
      setSdkStatus((current) => (current === "error" ? "idle" : current));
    }
  }, []);

  const value = useMemo<NaverMapContextValue>(
    () => ({
      sdkStatus,
      sdkError,
      map,
      setMap,
      reloadSdk,
      retrySdk: reloadSdk,
      clearSdkError,
      submodules: submodules ?? []
    }),
    [clearSdkError, map, reloadSdk, sdkError, sdkStatus, submodules]
  );

  return <NaverMapContext.Provider value={value}>{children}</NaverMapContext.Provider>;
}
