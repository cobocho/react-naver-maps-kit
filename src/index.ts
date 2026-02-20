export type NaverMapKitVersion = "0.0.1";

export const version: NaverMapKitVersion = "0.0.1";

export { loadNaverMapsScript } from "./core/loader/loadNaverMapsScript";
export type { LoadNaverMapsScriptOptions } from "./core/loader/loadNaverMapsScript";
export { NaverMapProvider, NaverMapContext } from "./react/provider/NaverMapProvider";
export type {
  NaverMapContextValue,
  NaverMapProviderProps,
  NaverMapSdkStatus
} from "./react/provider/NaverMapProvider";
