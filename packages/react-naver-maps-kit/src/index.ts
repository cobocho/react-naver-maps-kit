/// <reference path="./types/naver-maps-extensions.d.ts" />

export type NaverMapKitVersion = "1.3.0";

export const version: NaverMapKitVersion = "1.3.0";

export { loadNaverMapsScript } from "./core/loader/loadNaverMapsScript";
export type { LoadNaverMapsScriptOptions } from "./core/loader/loadNaverMapsScript";
export { NaverMapProvider, NaverMapContext } from "./react/provider/NaverMapProvider";
export { NaverMap } from "./react/components/NaverMap";
export { Marker } from "./overlays/marker/Marker";
export { MarkerClusterer } from "./overlays/marker-clusterer/MarkerClusterer";
export { ClustererContext } from "./overlays/marker-clusterer/ClustererContext";
export { InfoWindow } from "./overlays/infowindow/InfoWindow";
export { Circle } from "./overlays/circle/Circle";
export { Ellipse } from "./overlays/ellipse/Ellipse";
export { GroundOverlay } from "./overlays/ground-overlay/GroundOverlay";
export { Polygon } from "./overlays/polygon/Polygon";
export { Polyline } from "./overlays/polyline/Polyline";
export { Rectangle } from "./overlays/rectangle/Rectangle";
export { GeoJson } from "./overlays/data/GeoJson";
export { Gpx } from "./overlays/data/Gpx";
export { Kmz } from "./overlays/data/Kmz";
export { useNaverMap, useNaverMapInstance } from "./react/hooks/useNaverMap";
export {
  MapInstanceContext,
  useMapInstance,
  useMapInstanceRequired,
  useMap,
  usePanoramaInstance
} from "./react/context/MapInstanceContext";

export {
  Panorama,
  FlightSpot,
  AroundControl,
  PanoramaContext,
  usePanorama
} from "./submodules/panorama";
export type { PanoramaProps, PanoramaRef } from "./submodules/panorama";
export type { FlightSpotProps, FlightSpotRef } from "./submodules/panorama";
export type { AroundControlProps, AroundControlRef } from "./submodules/panorama";
export type { PanoramaContextValue } from "./submodules/panorama";

export { HeatMap, DotMap } from "./submodules/visualization";
export type {
  HeatMapProps,
  HeatMapRef,
  HeatMapOptionProps,
  DotMapProps,
  DotMapRef,
  DotMapOptionProps
} from "./submodules/visualization";

export { DrawingManager } from "./submodules/drawing";
export type {
  DrawingManagerProps,
  DrawingManagerRef,
  DrawingManagerOptionProps,
  DrawingManagerEventProps,
  DrawingControlOptions,
  DrawingControlPointOptions
} from "./submodules/drawing";

export type {
  NaverMapContextValue,
  NaverMapProviderProps,
  NaverMapSdkStatus,
  Submodule
} from "./react/provider/NaverMapProvider";
export type { NaverMapProps } from "./react/components/NaverMap";
export type { NaverMapRef } from "./react/components/NaverMap";
export type { MarkerProps } from "./overlays/marker/Marker";
export type { MarkerRef } from "./overlays/marker/Marker";
export type {
  ItemRecord,
  Cluster,
  AlgorithmContext,
  ClusterAlgorithm,
  BuiltInAlgorithmConfig,
  ClusterIconRenderer,
  MarkerClustererHelpers,
  MarkerClustererProps
} from "./overlays/marker-clusterer/types";
export type { ClustererRegistry } from "./overlays/marker-clusterer/ClustererContext";
export type { InfoWindowProps } from "./overlays/infowindow/InfoWindow";
export type { InfoWindowRef } from "./overlays/infowindow/InfoWindow";
export type { CircleProps } from "./overlays/circle/Circle";
export type { CircleRef } from "./overlays/circle/Circle";
export type { EllipseProps } from "./overlays/ellipse/Ellipse";
export type { EllipseRef } from "./overlays/ellipse/Ellipse";
export type { GroundOverlayProps } from "./overlays/ground-overlay/GroundOverlay";
export type { GroundOverlayRef } from "./overlays/ground-overlay/GroundOverlay";
export type { PolygonProps } from "./overlays/polygon/Polygon";
export type { PolygonRef } from "./overlays/polygon/Polygon";
export type { PolylineProps } from "./overlays/polyline/Polyline";
export type { PolylineRef } from "./overlays/polyline/Polyline";
export type { RectangleProps } from "./overlays/rectangle/Rectangle";
export type { RectangleRef } from "./overlays/rectangle/Rectangle";
export type { GeoJsonProps } from "./overlays/data/GeoJson";
export type { GeoJsonRef } from "./overlays/data/GeoJson";
export type { GpxProps } from "./overlays/data/Gpx";
export type { GpxRef } from "./overlays/data/Gpx";
export type { KmzProps } from "./overlays/data/Kmz";
export type { KmzRef } from "./overlays/data/Kmz";
export type { UseNaverMapOptions } from "./react/hooks/useNaverMap";
export type { MapInstanceContextValue } from "./react/context/MapInstanceContext";
