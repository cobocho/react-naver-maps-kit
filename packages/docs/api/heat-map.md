# HeatMap

`HeatMap`은 `naver.maps.visualization.HeatMap`을 React 컴포넌트로 감싼 API입니다. 밀도를 색상으로 표현하는 열지도를 제공합니다.

::: warning 서브모듈 필요
이 컴포넌트는 `visualization` 서브모듈이 필요합니다.

```tsx
<NaverMapProvider ncpKeyId="..." submodules={["visualization"]}>
```

:::

## 기본 사용법

```tsx
import { NaverMap, HeatMap } from "react-naver-maps-kit";

function MapWithHeatMap() {
  const data = [
    { lat: 37.5665, lng: 126.978, weight: 10 },
    { lat: 37.5666, lng: 126.979, weight: 5 },
    { lat: 37.5667, lng: 126.98, weight: 8 }
  ];

  return (
    <NaverMap
      defaultCenter={{ lat: 37.5665, lng: 126.978 }}
      defaultZoom={14}
      style={{ width: "100%", height: "500px" }}
    >
      <HeatMap data={data} radius={20} opacity={0.6} />
    </NaverMap>
  );
}
```

## 공개 타입

```ts
interface HeatMapOptionProps {
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

interface HeatMapProps extends HeatMapOptionProps {
  onHeatMapReady?: (heatMap: naver.maps.visualization.HeatMap) => void;
}

interface HeatMapRef {
  getInstance: () => naver.maps.visualization.HeatMap | null;
  getMap: () => naver.maps.Map | null;
  setData: (data: LatLng[] | PointArrayLiteral[] | WeightedLocation[]) => void;
  addData: (data: LatLng | PointArrayLiteral | WeightedLocation) => void;
  redraw: () => void;
}
```

## 옵션 프로퍼티

| Prop              | Type                             | Default | Description             |
| ----------------- | -------------------------------- | ------- | ----------------------- |
| `data`            | `LatLng[] \| WeightedLocation[]` | -       | 시각화 데이터 (필수)    |
| `radius`          | `number`                         | `20`    | 반경 (픽셀)             |
| `opacity`         | `number`                         | `0.6`   | 불투명도 (0-1)          |
| `colorMap`        | `SpectrumStyle`                  | -       | 색상 스펙트럼           |
| `colorMapReverse` | `boolean`                        | `false` | 스펙트럼 색상 반전      |
| `onHeatMapReady`  | `(heatMap) => void`              | -       | 인스턴스 생성 완료 콜백 |

## Ref 메서드

| Method          | Return Type      | Description      |
| --------------- | ---------------- | ---------------- |
| `getInstance()` | `HeatMap`        | HeatMap 인스턴스 |
| `getMap()`      | `naver.maps.Map` | 지도 인스턴스    |
| `setData()`     | `void`           | 데이터 설정      |
| `addData()`     | `void`           | 데이터 추가      |
| `redraw()`      | `void`           | 다시 그리기      |

## 지원하는 Data 형식

```tsx
// 1. 객체 배열 (weight 포함) - 가장 편리한 형식
const data1 = [
  { lat: 37.5665, lng: 126.978, weight: 10 },
  { lat: 37.5666, lng: 126.979, weight: 5 }
];

// 2. 객체 배열 (weight 없음)
const data2 = [
  { lat: 37.5665, lng: 126.978 },
  { lat: 37.5666, lng: 126.979 }
];

// 3. naver.maps.LatLng 배열
const data3 = [new naver.maps.LatLng(37.5665, 126.978), new naver.maps.LatLng(37.5666, 126.979)];

// 4. WeightedLocation 배열
const data4 = [
  new naver.maps.visualization.WeightedLocation(37.5665, 126.978, 10),
  new naver.maps.visualization.WeightedLocation(37.5666, 126.979, 5)
];
```

## 색상 스펙트럼 (SpectrumStyle)

| 스펙트럼   | 설명                    |
| ---------- | ----------------------- |
| `RAINBOW`  | 무지개 색상             |
| `JET`      | Jet 색상                |
| `HSV`      | HSV 색상 공간           |
| `HOT`      | 뜨거운 색상 (검정→빨강) |
| `COOL`     | 차가운 색상 (청록→자홍) |
| `GREYS`    | 회색 계열               |
| `YIGnBu`   | 노랑→초록→파랑          |
| `YIOrRd`   | 노랑→주황→빨강          |
| `RdBu`     | 빨강→파랑               |
| `PORTLAND` | Portland 색상           |
| `OXYGEN`   | Oxygen 색상             |

```tsx
<HeatMap data={data} colorMap={naver.maps.visualization.SpectrumStyle.JET} colorMapReverse={true} />
```

## 동작 규칙

- `NaverMap` 내부에서만 사용 가능합니다.
- `visualization` 서브모듈이 로드되어야 사용 가능합니다.
- `{ lat, lng, weight }` 형태의 객체 배열은 자동으로 `WeightedLocation`으로 변환됩니다.
- Props 변경 시 자동으로 `setData()`, `setOptions()`, `redraw()`가 호출됩니다.
- 언마운트 시 `setMap(null)`로 정리됩니다.
