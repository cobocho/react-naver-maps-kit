import { useContext, useEffect, useRef } from "react";

import { NaverMapContext } from "../provider/NaverMapProvider";

import type { ComponentPropsWithoutRef } from "react";

type MapOptions = naver.maps.MapOptions;

interface NaverMapCoreProps {
  background?: MapOptions["background"];
  baseTileOpacity?: MapOptions["baseTileOpacity"];
  bounds?: MapOptions["bounds"];
  center?: MapOptions["center"];
  zoom?: MapOptions["zoom"];
  disableDoubleClickZoom?: MapOptions["disableDoubleClickZoom"];
  disableDoubleTapZoom?: MapOptions["disableDoubleTapZoom"];
  disableKineticPan?: MapOptions["disableKineticPan"];
  disableTwoFingerTapZoom?: MapOptions["disableTwoFingerTapZoom"];
  draggable?: MapOptions["draggable"];
  keyboardShortcuts?: MapOptions["keyboardShortcuts"];
  logoControl?: MapOptions["logoControl"];
  logoControlOptions?: MapOptions["logoControlOptions"];
  mapDataControl?: MapOptions["mapDataControl"];
  mapDataControlOptions?: MapOptions["mapDataControlOptions"];
  mapTypeControl?: MapOptions["mapTypeControl"];
  mapTypeControlOptions?: MapOptions["mapTypeControlOptions"];
  mapTypeId?: MapOptions["mapTypeId"];
  mapTypes?: MapOptions["mapTypes"];
  maxBounds?: MapOptions["maxBounds"];
  maxZoom?: MapOptions["maxZoom"];
  minZoom?: MapOptions["minZoom"];
  padding?: MapOptions["padding"];
  pinchZoom?: MapOptions["pinchZoom"];
  resizeOrigin?: MapOptions["resizeOrigin"];
  scaleControl?: MapOptions["scaleControl"];
  scaleControlOptions?: MapOptions["scaleControlOptions"];
  scrollWheel?: MapOptions["scrollWheel"];
  size?: MapOptions["size"];
  overlayZoomEffect?: MapOptions["overlayZoomEffect"];
  tileSpare?: MapOptions["tileSpare"];
  tileTransition?: MapOptions["tileTransition"];
  tileDuration?: MapOptions["tileDuration"];
  zoomControl?: MapOptions["zoomControl"];
  zoomControlOptions?: MapOptions["zoomControlOptions"];
  zoomOrigin?: MapOptions["zoomOrigin"];
  blankTileImage?: MapOptions["blankTileImage"];
  gl?: MapOptions["gl"];
  customStyleId?: MapOptions["customStyleId"];
  onMapReady?: (map: naver.maps.Map) => void;
  onMapDestroy?: () => void;
}

export type NaverMapProps = NaverMapCoreProps &
  Omit<ComponentPropsWithoutRef<"div">, "children" | "draggable">;

function toMapOptions(props: NaverMapProps): naver.maps.MapOptions {
  const raw: naver.maps.MapOptions = {
    background: props.background,
    baseTileOpacity: props.baseTileOpacity,
    bounds: props.bounds,
    center: props.center,
    zoom: props.zoom,
    disableDoubleClickZoom: props.disableDoubleClickZoom,
    disableDoubleTapZoom: props.disableDoubleTapZoom,
    disableKineticPan: props.disableKineticPan,
    disableTwoFingerTapZoom: props.disableTwoFingerTapZoom,
    draggable: props.draggable,
    keyboardShortcuts: props.keyboardShortcuts,
    logoControl: props.logoControl,
    logoControlOptions: props.logoControlOptions,
    mapDataControl: props.mapDataControl,
    mapDataControlOptions: props.mapDataControlOptions,
    mapTypeControl: props.mapTypeControl,
    mapTypeControlOptions: props.mapTypeControlOptions,
    mapTypeId: props.mapTypeId,
    mapTypes: props.mapTypes,
    maxBounds: props.maxBounds,
    maxZoom: props.maxZoom,
    minZoom: props.minZoom,
    padding: props.padding,
    pinchZoom: props.pinchZoom,
    resizeOrigin: props.resizeOrigin,
    scaleControl: props.scaleControl,
    scaleControlOptions: props.scaleControlOptions,
    scrollWheel: props.scrollWheel,
    size: props.size,
    overlayZoomEffect: props.overlayZoomEffect,
    tileSpare: props.tileSpare,
    tileTransition: props.tileTransition,
    tileDuration: props.tileDuration,
    zoomControl: props.zoomControl,
    zoomControlOptions: props.zoomControlOptions,
    zoomOrigin: props.zoomOrigin,
    blankTileImage: props.blankTileImage,
    gl: props.gl,
    customStyleId: props.customStyleId
  };

  const normalizedEntries = Object.entries(raw).filter(([, value]) => value !== undefined);

  return Object.fromEntries(normalizedEntries) as naver.maps.MapOptions;
}

export function NaverMap({
  background,
  baseTileOpacity,
  bounds,
  center,
  zoom,
  disableDoubleClickZoom,
  disableDoubleTapZoom,
  disableKineticPan,
  disableTwoFingerTapZoom,
  draggable,
  keyboardShortcuts,
  logoControl,
  logoControlOptions,
  mapDataControl,
  mapDataControlOptions,
  mapTypeControl,
  mapTypeControlOptions,
  mapTypeId,
  mapTypes,
  maxBounds,
  maxZoom,
  minZoom,
  padding,
  pinchZoom,
  resizeOrigin,
  scaleControl,
  scaleControlOptions,
  scrollWheel,
  size,
  overlayZoomEffect,
  tileSpare,
  tileTransition,
  tileDuration,
  zoomControl,
  zoomControlOptions,
  zoomOrigin,
  blankTileImage,
  gl,
  customStyleId,
  onMapReady,
  onMapDestroy,
  ...divProps
}: NaverMapProps) {
  const context = useContext(NaverMapContext);

  if (!context) {
    throw new Error("NaverMap must be used inside NaverMapProvider.");
  }

  const { sdkStatus, setMap } = context;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<naver.maps.Map | null>(null);
  const latestMapPropsRef = useRef<NaverMapProps>({
    background,
    baseTileOpacity,
    bounds,
    center,
    zoom,
    disableDoubleClickZoom,
    disableDoubleTapZoom,
    disableKineticPan,
    disableTwoFingerTapZoom,
    draggable,
    keyboardShortcuts,
    logoControl,
    logoControlOptions,
    mapDataControl,
    mapDataControlOptions,
    mapTypeControl,
    mapTypeControlOptions,
    mapTypeId,
    mapTypes,
    maxBounds,
    maxZoom,
    minZoom,
    padding,
    pinchZoom,
    resizeOrigin,
    scaleControl,
    scaleControlOptions,
    scrollWheel,
    size,
    overlayZoomEffect,
    tileSpare,
    tileTransition,
    tileDuration,
    zoomControl,
    zoomControlOptions,
    zoomOrigin,
    blankTileImage,
    gl,
    customStyleId,
    onMapReady,
    onMapDestroy,
    ...divProps
  });

  latestMapPropsRef.current = {
    background,
    baseTileOpacity,
    bounds,
    center,
    zoom,
    disableDoubleClickZoom,
    disableDoubleTapZoom,
    disableKineticPan,
    disableTwoFingerTapZoom,
    draggable,
    keyboardShortcuts,
    logoControl,
    logoControlOptions,
    mapDataControl,
    mapDataControlOptions,
    mapTypeControl,
    mapTypeControlOptions,
    mapTypeId,
    mapTypes,
    maxBounds,
    maxZoom,
    minZoom,
    padding,
    pinchZoom,
    resizeOrigin,
    scaleControl,
    scaleControlOptions,
    scrollWheel,
    size,
    overlayZoomEffect,
    tileSpare,
    tileTransition,
    tileDuration,
    zoomControl,
    zoomControlOptions,
    zoomOrigin,
    blankTileImage,
    gl,
    customStyleId,
    onMapReady,
    onMapDestroy,
    ...divProps
  };

  useEffect(() => {
    if (sdkStatus !== "ready" || !containerRef.current || mapRef.current) {
      return;
    }

    try {
      const mapInstance = new naver.maps.Map(
        containerRef.current,
        toMapOptions(latestMapPropsRef.current)
      );
      mapRef.current = mapInstance;
      setMap(mapInstance);
      onMapReady?.(mapInstance);
    } catch (error) {
      console.error("[react-naver-maps-kit] failed to create naver.maps.Map", error);
    }
  }, [onMapReady, sdkStatus, setMap]);

  useEffect(() => {
    const mapInstance = mapRef.current;

    if (!mapInstance) {
      return;
    }

    try {
      mapInstance.setOptions(toMapOptions(latestMapPropsRef.current));
    } catch (error) {
      console.error("[react-naver-maps-kit] failed to update map options", error);
    }
  });

  useEffect(() => {
    const containerElement = containerRef.current;

    return () => {
      const mapInstance = mapRef.current;

      if (!mapInstance) {
        return;
      }

      try {
        naver.maps.Event.clearInstanceListeners(mapInstance);
      } catch (error) {
        console.error("[react-naver-maps-kit] failed to clear map listeners", error);
      }

      try {
        const destroyableMap = mapInstance as naver.maps.Map & { destroy?: () => void };
        destroyableMap.destroy?.();
      } catch (error) {
        console.error("[react-naver-maps-kit] failed to destroy map instance", error);
      }

      if (containerElement) {
        containerElement.innerHTML = "";
      }

      mapRef.current = null;
      setMap(null);
      onMapDestroy?.();
    };
  }, [onMapDestroy, setMap]);

  return <div ref={containerRef} {...divProps} />;
}
