import { useContext } from "react";

import { NaverMapContext } from "../provider/NaverMapProvider";

import type { NaverMapContextValue } from "../provider/NaverMapProvider";

export interface UseNaverMapOptions {
  requireReady?: boolean;
  requireMapInstance?: boolean;
}

export function useNaverMap(options: UseNaverMapOptions = {}): NaverMapContextValue {
  const context = useContext(NaverMapContext);

  if (!context) {
    throw new Error("useNaverMap must be used within NaverMapProvider.");
  }

  if (options.requireReady && context.sdkStatus !== "ready") {
    throw new Error(`Naver Maps SDK is not ready. Current status: ${context.sdkStatus}.`);
  }

  if (options.requireMapInstance && !context.map) {
    throw new Error("Naver map instance is not available yet.");
  }

  return context;
}

export function useNaverMapInstance(
  options: { requireReady?: boolean } = {}
): naver.maps.Map | null {
  const context = useNaverMap({
    requireReady: options.requireReady,
    requireMapInstance: false
  });

  return context.map;
}
