import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  loadNaverMapsScript,
  type LoadNaverMapsScriptOptions
} from "../../core/loader/loadNaverMapsScript";

import type { ReactNode } from "react";


export type NaverMapSdkStatus = "idle" | "loading" | "ready" | "error";

export interface NaverMapContextValue {
  sdkStatus: NaverMapSdkStatus;
  sdkError: Error | null;
  map: unknown | null;
  setMap: (map: unknown | null) => void;
  reloadSdk: () => Promise<void>;
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
  const [sdkStatus, setSdkStatus] = useState<NaverMapSdkStatus>("idle");
  const [sdkError, setSdkError] = useState<Error | null>(null);
  const [map, setMap] = useState<unknown | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const reloadSdk = useCallback(async () => {
    if (mountedRef.current) {
      setSdkStatus("loading");
      setSdkError(null);
    }

    try {
      await loadNaverMapsScript({
        ncpKeyId,
        ncpClientId,
        govClientId,
        finClientId,
        submodules,
        timeoutMs,
        nonce
      });

      if (mountedRef.current) {
        setSdkStatus("ready");
        setSdkError(null);
      }

      onReady?.();
    } catch (error) {
      const normalizedError =
        error instanceof Error ? error : new Error("Failed to load Naver Maps SDK.");

      if (mountedRef.current) {
        setSdkStatus("error");
        setSdkError(normalizedError);
      }

      onError?.(normalizedError);
      throw normalizedError;
    }
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

    void reloadSdk();
  }, [autoLoad, reloadSdk]);

  const value = useMemo<NaverMapContextValue>(
    () => ({
      sdkStatus,
      sdkError,
      map,
      setMap,
      reloadSdk
    }),
    [map, reloadSdk, sdkError, sdkStatus]
  );

  return <NaverMapContext.Provider value={value}>{children}</NaverMapContext.Provider>;
}
