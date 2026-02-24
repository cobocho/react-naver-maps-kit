import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import { useMap } from "../../react/context/MapInstanceContext";

export interface DotMapOptionProps {
  data: naver.maps.LatLng[] | naver.maps.PointArrayLiteral[] | Array<{ lat: number; lng: number }>;
  opacity?: number;
  radius?: number;
  strokeWeight?: number;
  strokeColor?: string;
  strokeLineCap?: "butt" | "round" | "square";
  strokeLineJoin?: "bevel" | "miter" | "round";
  fillColor?: string;
}

export interface DotMapProps extends DotMapOptionProps {
  onDotMapReady?: (dotMap: naver.maps.visualization.DotMap) => void;
}

export interface DotMapRef {
  getInstance: () => naver.maps.visualization.DotMap | null;
  getMap: () => naver.maps.Map | null;
  setData: (data: naver.maps.LatLng[] | naver.maps.PointArrayLiteral[]) => void;
  addData: (data: naver.maps.LatLng | naver.maps.PointArrayLiteral) => void;
  redraw: () => void;
}

export const DotMap = forwardRef<DotMapRef, DotMapProps>(function DotMap(
  {
    data,
    opacity,
    radius,
    strokeWeight,
    strokeColor,
    strokeLineCap,
    strokeLineJoin,
    fillColor,
    onDotMapReady
  },
  ref
) {
  const map = useMap();
  const dotMapRef = useRef<naver.maps.visualization.DotMap | null>(null);
  const onDotMapReadyRef = useRef(onDotMapReady);
  onDotMapReadyRef.current = onDotMapReady;

  const normalizeData = useCallback(
    (
      inputData: DotMapOptionProps["data"]
    ): naver.maps.LatLng[] | naver.maps.PointArrayLiteral[] => {
      if (!inputData || inputData.length === 0) return [] as naver.maps.LatLng[];

      const first = inputData[0];
      if (first instanceof naver.maps.LatLng) {
        return inputData as naver.maps.LatLng[];
      }
      if (Array.isArray(first)) {
        return inputData as naver.maps.PointArrayLiteral[];
      }
      if (typeof first === "object" && "lat" in first && "lng" in first) {
        const items = inputData as Array<{ lat: number; lng: number }>;
        return items.map((item) => new naver.maps.LatLng(item.lat, item.lng));
      }
      return inputData as naver.maps.LatLng[];
    },
    []
  );

  useImperativeHandle(
    ref,
    () => ({
      getInstance: () => dotMapRef.current,
      getMap: () => dotMapRef.current?.getMap() ?? null,
      setData: (newData: naver.maps.LatLng[] | naver.maps.PointArrayLiteral[]) => {
        dotMapRef.current?.setData(newData);
      },
      addData: (newData: naver.maps.LatLng | naver.maps.PointArrayLiteral) => {
        dotMapRef.current?.addData(newData);
      },
      redraw: () => {
        dotMapRef.current?.redraw();
      }
    }),
    []
  );

  useEffect(() => {
    if (!map) return;
    if (typeof naver.maps.visualization?.DotMap !== "function") {
      console.warn(
        "[DotMap] visualization 서브모듈이 로드되지 않았습니다. NaverMapProvider에 submodules={['visualization']}을 추가하세요."
      );
      return;
    }

    let dotMap: naver.maps.visualization.DotMap | null = null;
    let listener: naver.maps.MapEventListener | null = null;

    const createDotMap = () => {
      if (dotMapRef.current) return;

      const normalizedData = normalizeData(data);
      dotMap = new naver.maps.visualization.DotMap({
        map,
        data: normalizedData,
        opacity: opacity ?? 0.6,
        radius: radius ?? 5,
        strokeWeight: strokeWeight ?? 1,
        strokeColor: strokeColor ?? "#fff",
        strokeLineCap: strokeLineCap ?? "round",
        strokeLineJoin: strokeLineJoin ?? "round",
        fillColor: fillColor ?? "#ff0000"
      });

      dotMapRef.current = dotMap;
      onDotMapReadyRef.current?.(dotMap);
    };

    if (map.isReady) {
      createDotMap();
    } else {
      listener = naver.maps.Event.addListener(map, "init", createDotMap);
    }

    return () => {
      if (listener) {
        naver.maps.Event.removeListener(listener);
      }
      if (dotMap) {
        dotMap.setMap(null);
      }
      dotMapRef.current = null;
    };
  }, [map]);

  useEffect(() => {
    if (!dotMapRef.current) return;
    const normalizedData = normalizeData(data);
    dotMapRef.current.setData(normalizedData);
    dotMapRef.current.redraw();
  }, [data, normalizeData]);

  useEffect(() => {
    if (!dotMapRef.current || opacity === undefined) return;
    dotMapRef.current.setOptions({ opacity });
    dotMapRef.current.redraw();
  }, [opacity]);

  useEffect(() => {
    if (!dotMapRef.current || radius === undefined) return;
    dotMapRef.current.setOptions({ radius });
    dotMapRef.current.redraw();
  }, [radius]);

  useEffect(() => {
    if (!dotMapRef.current) return;
    dotMapRef.current.setOptions({
      strokeWeight,
      strokeColor,
      strokeLineCap,
      strokeLineJoin,
      fillColor
    });
    dotMapRef.current.redraw();
  }, [strokeWeight, strokeColor, strokeLineCap, strokeLineJoin, fillColor]);

  return null;
});
