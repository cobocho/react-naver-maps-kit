export type NaverMapKitVersion = "0.0.1";

export const version: NaverMapKitVersion = "0.0.1";

export { loadNaverMapsScript } from "./core/loader/loadNaverMapsScript";
export type { LoadNaverMapsScriptOptions } from "./core/loader/loadNaverMapsScript";
export { NaverMapProvider, NaverMapContext } from "./react/provider/NaverMapProvider";
export { NaverMap } from "./react/components/NaverMap";
export { Marker } from "./overlays/marker/Marker";
export { InfoWindow } from "./overlays/infowindow/InfoWindow";
export { useNaverMap, useNaverMapInstance } from "./react/hooks/useNaverMap";
export type {
  NaverMapContextValue,
  NaverMapProviderProps,
  NaverMapSdkStatus
} from "./react/provider/NaverMapProvider";
export type { NaverMapProps } from "./react/components/NaverMap";
export type { NaverMapRef } from "./react/components/NaverMap";
export type { MarkerProps } from "./overlays/marker/Marker";
export type { MarkerRef } from "./overlays/marker/Marker";
export type { InfoWindowProps } from "./overlays/infowindow/InfoWindow";
export type { InfoWindowRef } from "./overlays/infowindow/InfoWindow";
export type { UseNaverMapOptions } from "./react/hooks/useNaverMap";
