import { createContext, useContext } from "react";

export interface MapInstanceContextValue {
  instance: naver.maps.Map | naver.maps.Panorama | null;
  setInstance: (instance: naver.maps.Map | naver.maps.Panorama | null) => void;
  type: "map" | "panorama";
}

export const MapInstanceContext = createContext<MapInstanceContextValue | null>(null);

export function useMapInstance(): MapInstanceContextValue | null {
  return useContext(MapInstanceContext);
}

export function useMapInstanceRequired(): MapInstanceContextValue {
  const context = useContext(MapInstanceContext);

  if (!context) {
    throw new Error(
      "This component must be used inside NaverMap or Panorama. " +
        "Make sure it is a child of <NaverMap> or <Panorama>."
    );
  }

  return context;
}

export function useMap(): naver.maps.Map | null {
  const context = useContext(MapInstanceContext);
  if (!context || context.type !== "map") return null;
  return context.instance as naver.maps.Map | null;
}

export function usePanoramaInstance(): naver.maps.Panorama | null {
  const context = useContext(MapInstanceContext);
  if (!context || context.type !== "panorama") return null;
  return context.instance as naver.maps.Panorama | null;
}
