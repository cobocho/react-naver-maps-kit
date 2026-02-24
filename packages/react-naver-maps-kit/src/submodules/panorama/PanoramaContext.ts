import { createContext, useContext } from "react";

import type { Submodule } from "../../react/provider/NaverMapProvider";

export interface PanoramaContextValue {
  panorama: naver.maps.Panorama | null;
  setPanorama: (panorama: naver.maps.Panorama | null) => void;
  sdkStatus: "idle" | "loading" | "ready" | "error";
  submodules: Submodule[];
}

export const PanoramaContext = createContext<PanoramaContextValue | null>(null);

export function usePanorama(): PanoramaContextValue {
  const value = useContext(PanoramaContext);

  if (!value) {
    throw new Error(
      "usePanorama must be used within a Panorama component. " +
        "Make sure you wrap your panorama-dependent components with <Panorama>."
    );
  }

  return value;
}
