# Visualization 서브모듈

Visualization 서브모듈은 지리 데이터를 시각화하는 도구를 제공합니다.

## 개요

Visualization 모듈은 다음 기능을 제공합니다:

- **열지도 (HeatMap)**: 밀도를 색상으로 표현
- **점지도 (DotMap)**: 개별 위치를 점으로 표현
- **가중치 데이터**: 위치별 가중치 적용

## 서브모듈 로드

`NaverMapProvider`의 `submodules` prop을 통해 로드합니다:

```tsx
import { NaverMapProvider } from "react-naver-maps-kit";

function App() {
  return (
    <NaverMapProvider ncpKeyId={import.meta.env.VITE_NCP_KEY_ID} submodules={["visualization"]}>
      {/* 앱 컴포넌트 */}
    </NaverMapProvider>
  );
}
```

## 주요 클래스

### naver.maps.visualization.HeatMap

열지도를 표시합니다.

```tsx
const heatMap = new naver.maps.visualization.HeatMap({
  map: map,
  data: [
    { location: new naver.maps.LatLng(37.5665, 126.978), weight: 10 },
    { location: new naver.maps.LatLng(37.5666, 126.979), weight: 5 }
  ],
  radius: 20,
  opacity: 0.8
});
```

### naver.maps.visualization.DotMap

점지도를 표시합니다.

```tsx
const dotMap = new naver.maps.visualization.DotMap({
  map: map,
  data: [new naver.maps.LatLng(37.5665, 126.978), new naver.maps.LatLng(37.5666, 126.979)],
  radius: 10,
  color: "#03C75A"
});
```

### naver.maps.visualization.WeightedLocation

가중치가 있는 위치 데이터입니다.

```tsx
const weightedData: naver.maps.visualization.WeightedLocation[] = [
  { location: new naver.maps.LatLng(37.5665, 126.978), weight: 10 },
  { location: new naver.maps.LatLng(37.5666, 126.979), weight: 20 }
];
```

## 활용 예제

### 기본 열지도

```tsx
import { NaverMap, NaverMapProvider, useNaverMap } from "react-naver-maps-kit";
import { useEffect, useRef } from "react";

function MapWithHeatMap() {
  const { sdkStatus, map } = useNaverMap();
  const heatMapRef = useRef<naver.maps.visualization.HeatMap | null>(null);

  useEffect(() => {
    if (sdkStatus !== "ready" || !map) return;

    // 샘플 데이터 생성
    const data: naver.maps.visualization.WeightedLocation[] = [];
    for (let i = 0; i < 100; i++) {
      data.push({
        location: new naver.maps.LatLng(37.5 + Math.random() * 0.2, 126.9 + Math.random() * 0.2),
        weight: Math.random() * 10
      });
    }

    const heatMap = new naver.maps.visualization.HeatMap({
      map: map,
      data: data,
      radius: 30,
      opacity: 0.6
    });

    heatMapRef.current = heatMap;

    return () => {
      heatMap.setMap(null);
    };
  }, [sdkStatus, map]);

  return (
    <NaverMap
      center={{ lat: 37.5665, lng: 126.978 }}
      zoom={12}
      style={{ width: "100%", height: "500px" }}
    />
  );
}
```

### 기본 점지도

```tsx
import { NaverMap, NaverMapProvider, useNaverMap } from "react-naver-maps-kit";
import { useEffect, useRef } from "react";

function MapWithDotMap() {
  const { sdkStatus, map } = useNaverMap();
  const dotMapRef = useRef<naver.maps.visualization.DotMap | null>(null);

  useEffect(() => {
    if (sdkStatus !== "ready" || !map) return;

    // 샘플 데이터 생성
    const data: naver.maps.LatLng[] = [];
    for (let i = 0; i < 100; i++) {
      data.push(new naver.maps.LatLng(37.5 + Math.random() * 0.2, 126.9 + Math.random() * 0.2));
    }

    const dotMap = new naver.maps.visualization.DotMap({
      map: map,
      data: data,
      radius: 8,
      color: "#03C75A"
    });

    dotMapRef.current = dotMap;

    return () => {
      dotMap.setMap(null);
    };
  }, [sdkStatus, map]);

  return (
    <NaverMap
      center={{ lat: 37.5665, lng: 126.978 }}
      zoom={12}
      style={{ width: "100%", height: "500px" }}
    />
  );
}
```

### 커스텀 스펙트럼 열지도

```tsx
import { NaverMap, NaverMapProvider, useNaverMap } from "react-naver-maps-kit";
import { useEffect, useRef } from "react";

function MapWithCustomHeatMap() {
  const { sdkStatus, map } = useNaverMap();
  const heatMapRef = useRef<naver.maps.visualization.HeatMap | null>(null);

  useEffect(() => {
    if (sdkStatus !== "ready" || !map) return;

    const data: naver.maps.visualization.WeightedLocation[] = [];
    for (let i = 0; i < 50; i++) {
      data.push({
        location: new naver.maps.LatLng(37.5 + Math.random() * 0.2, 126.9 + Math.random() * 0.2),
        weight: Math.random() * 10
      });
    }

    const heatMap = new naver.maps.visualization.HeatMap({
      map: map,
      data: data,
      radius: 25,
      opacity: 0.7,
      // 커스텀 색상 스펙트럼
      color: [
        { stop: 0.0, color: "rgba(0, 255, 255, 0)" }, // 투명
        { stop: 0.2, color: "rgba(0, 255, 255, 1)" }, // 청록
        { stop: 0.4, color: "rgba(0, 255, 0, 1)" }, // 녹색
        { stop: 0.6, color: "rgba(255, 255, 0, 1)" }, // 노랑
        { stop: 0.8, color: "rgba(255, 128, 0, 1)" }, // 주황
        { stop: 1.0, color: "rgba(255, 0, 0, 1)" } // 빨강
      ]
    });

    heatMapRef.current = heatMap;

    return () => {
      heatMap.setMap(null);
    };
  }, [sdkStatus, map]);

  return (
    <NaverMap
      center={{ lat: 37.5665, lng: 126.978 }}
      zoom={12}
      style={{ width: "100%", height: "500px" }}
    />
  );
}
```

### 데이터 동적 업데이트

```tsx
import { NaverMap, NaverMapProvider, useNaverMap } from "react-naver-maps-kit";
import { useEffect, useRef, useState } from "react";

function MapWithDynamicVisualization() {
  const { sdkStatus, map } = useNaverMap();
  const heatMapRef = useRef<naver.maps.visualization.HeatMap | null>(null);
  const [intensity, setIntensity] = useState(1);

  useEffect(() => {
    if (sdkStatus !== "ready" || !map) return;

    const heatMap = new naver.maps.visualization.HeatMap({
      map: map,
      data: [],
      radius: 30
    });

    heatMapRef.current = heatMap;

    return () => {
      heatMap.setMap(null);
    };
  }, [sdkStatus, map]);

  const updateData = () => {
    if (!heatMapRef.current) return;

    const data: naver.maps.visualization.WeightedLocation[] = [];
    for (let i = 0; i < 50; i++) {
      data.push({
        location: new naver.maps.LatLng(37.5 + Math.random() * 0.2, 126.9 + Math.random() * 0.2),
        weight: Math.random() * intensity
      });
    }

    heatMapRef.current.setData(data);
  };

  return (
    <div>
      <div style={{ marginBottom: "8px", display: "flex", gap: "8px", alignItems: "center" }}>
        <label>
          강도:
          <input
            type="range"
            min="1"
            max="20"
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
          />
          {intensity}
        </label>
        <button onClick={updateData}>데이터 갱신</button>
      </div>

      <NaverMap
        center={{ lat: 37.5665, lng: 126.978 }}
        zoom={12}
        style={{ width: "100%", height: "500px" }}
      />
    </div>
  );
}
```

## 주요 옵션

### HeatMap

| 옵션           | 타입                 | 기본값 | 설명           |
| -------------- | -------------------- | ------ | -------------- |
| `data`         | `WeightedLocation[]` | `[]`   | 데이터 배열    |
| `radius`       | `number`             | `20`   | 반경 (픽셀)    |
| `opacity`      | `number`             | `0.8`  | 불투명도 (0-1) |
| `color`        | `SpectrumStyle`      | -      | 색상 스펙트럼  |
| `minIntensity` | `number`             | -      | 최소 강도      |
| `maxIntensity` | `number`             | -      | 최대 강도      |
| `resolution`   | `number`             | `1`    | 해상도 배율    |

### DotMap

| 옵션           | 타입                             | 기본값      | 설명           |
| -------------- | -------------------------------- | ----------- | -------------- |
| `data`         | `LatLng[] \| WeightedLocation[]` | `[]`        | 데이터 배열    |
| `radius`       | `number`                         | `5`         | 점 반경 (픽셀) |
| `color`        | `string`                         | `"#FF0000"` | 점 색상        |
| `strokeWeight` | `number`                         | `0`         | 테두리 두께    |
| `strokeColor`  | `string`                         | -           | 테두리 색상    |

## 참고

- [공식 Visualization 문서](https://navermaps.github.io/maps.js.ncp/docs/tutorial-Visualization.html)
- [공식 HeatMap API](https://navermaps.github.io/maps.js.ncp/docs/naver.maps.visualization.HeatMap.html)
- [공식 DotMap API](https://navermaps.github.io/maps.js.ncp/docs/naver.maps.visualization.DotMap.html)
