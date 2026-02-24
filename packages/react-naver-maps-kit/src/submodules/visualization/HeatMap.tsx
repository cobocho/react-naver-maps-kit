import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import { useMap } from "../../react/context/MapInstanceContext";

export interface HeatMapOptionProps {
  data:
    | naver.maps.LatLng[]
    | naver.maps.PointArrayLiteral[]
    | naver.maps.visualization.WeightedLocation[]
    | Array<{ lat: number; lng: number; weight?: number }>;
  opacity?: number;
  radius?: number;
  colorMap?: naver.maps.visualization.SpectrumStyle;
  colorMapReverse?: boolean;
}

export interface HeatMapProps extends HeatMapOptionProps {
  onHeatMapReady?: (heatMap: naver.maps.visualization.HeatMap) => void;
}

export interface HeatMapRef {
  getInstance: () => naver.maps.visualization.HeatMap | null;
  getMap: () => naver.maps.Map | null;
  setData: (
    data:
      | naver.maps.LatLng[]
      | naver.maps.PointArrayLiteral[]
      | naver.maps.visualization.WeightedLocation[]
  ) => void;
  addData: (
    data:
      | naver.maps.LatLng
      | naver.maps.PointArrayLiteral
      | naver.maps.visualization.WeightedLocation
  ) => void;
  redraw: () => void;
}

export const HeatMap = forwardRef<HeatMapRef, HeatMapProps>(function HeatMap(
  { data, opacity, radius, colorMap, colorMapReverse, onHeatMapReady },
  ref
) {
  const map = useMap();
  const heatMapRef = useRef<naver.maps.visualization.HeatMap | null>(null);
  const onHeatMapReadyRef = useRef(onHeatMapReady);
  onHeatMapReadyRef.current = onHeatMapReady;

  const normalizeData = useCallback(
    (
      inputData: HeatMapOptionProps["data"]
    ):
      | naver.maps.LatLng[]
      | naver.maps.PointArrayLiteral[]
      | naver.maps.visualization.WeightedLocation[] => {
      if (!inputData || inputData.length === 0) return [] as naver.maps.LatLng[];

      const first = inputData[0];
      if (first instanceof naver.maps.LatLng) {
        return inputData as naver.maps.LatLng[];
      }
      if (first instanceof naver.maps.visualization.WeightedLocation) {
        return inputData as naver.maps.visualization.WeightedLocation[];
      }
      if (Array.isArray(first)) {
        return inputData as naver.maps.PointArrayLiteral[];
      }
      if (typeof first === "object" && "lat" in first && "lng" in first) {
        const items = inputData as Array<{ lat: number; lng: number; weight?: number }>;
        const hasWeight = items.some((item) => item.weight !== undefined);
        if (hasWeight) {
          return items.map(
            (item) =>
              new naver.maps.visualization.WeightedLocation(item.lat, item.lng, item.weight ?? 1)
          );
        }
        return items.map((item) => new naver.maps.LatLng(item.lat, item.lng));
      }
      return inputData as naver.maps.LatLng[];
    },
    []
  );

  useImperativeHandle(
    ref,
    () => ({
      getInstance: () => heatMapRef.current,
      getMap: () => heatMapRef.current?.getMap() ?? null,
      setData: (
        newData:
          | naver.maps.LatLng[]
          | naver.maps.PointArrayLiteral[]
          | naver.maps.visualization.WeightedLocation[]
      ) => {
        heatMapRef.current?.setData(newData);
      },
      addData: (
        newData:
          | naver.maps.LatLng
          | naver.maps.PointArrayLiteral
          | naver.maps.visualization.WeightedLocation
      ) => {
        heatMapRef.current?.addData(newData);
      },
      redraw: () => {
        heatMapRef.current?.redraw();
      }
    }),
    []
  );

  useEffect(() => {
    if (!map) return;
    if (typeof naver.maps.visualization?.HeatMap !== "function") {
      console.warn(
        "[HeatMap] visualization 서브모듈이 로드되지 않았습니다. NaverMapProvider에 submodules={['visualization']}을 추가하세요."
      );
      return;
    }

    let heatMap: naver.maps.visualization.HeatMap | null = null;
    let listener: naver.maps.MapEventListener | null = null;

    const createHeatMap = () => {
      if (heatMapRef.current) return;

      const normalizedData = normalizeData(data);

      heatMap = new naver.maps.visualization.HeatMap({
        map,
        data: normalizedData,
        opacity: opacity ?? 0.6,
        radius: radius ?? 20,
        colorMap: colorMap,
        colorMapReverse: colorMapReverse ?? false
      });

      heatMapRef.current = heatMap;
      onHeatMapReadyRef.current?.(heatMap);
    };

    if (map.isReady) {
      createHeatMap();
    } else {
      listener = naver.maps.Event.addListener(map, "init", createHeatMap);
    }

    return () => {
      if (listener) {
        naver.maps.Event.removeListener(listener);
      }
      if (heatMap) {
        heatMap.setMap(null);
      }
      heatMapRef.current = null;
    };
  }, [map]);

  useEffect(() => {
    if (!heatMapRef.current) return;
    const normalizedData = normalizeData(data);
    heatMapRef.current.setData(normalizedData);
    heatMapRef.current.redraw();
  }, [data, normalizeData]);

  useEffect(() => {
    if (!heatMapRef.current || opacity === undefined) return;
    heatMapRef.current.setOptions({ opacity });
    heatMapRef.current.redraw();
  }, [opacity]);

  useEffect(() => {
    if (!heatMapRef.current || radius === undefined) return;
    heatMapRef.current.setOptions({ radius });
    heatMapRef.current.redraw();
  }, [radius]);

  useEffect(() => {
    if (!heatMapRef.current || colorMap === undefined) return;
    heatMapRef.current.setOptions({ colorMap, colorMapReverse: colorMapReverse ?? false });
    heatMapRef.current.redraw();
  }, [colorMap, colorMapReverse]);

  return null;
});
