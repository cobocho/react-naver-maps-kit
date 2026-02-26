# DotMap

`DotMap`은 `naver.maps.visualization.DotMap`을 React 컴포넌트로 감싼 API입니다. 개별 위치를 점으로 표현하는 점지도를 제공합니다.

::: warning 서브모듈 필요
이 컴포넌트는 `visualization` 서브모듈이 필요합니다.

```tsx
<NaverMapProvider ncpKeyId="..." submodules={["visualization"]}>
```

:::

## 기본 사용법

```tsx
import { NaverMap, DotMap } from "react-naver-maps-kit";

function MapWithDotMap() {
  const data = [
    { lat: 37.5665, lng: 126.978 },
    { lat: 37.5666, lng: 126.979 },
    { lat: 37.5667, lng: 126.98 }
  ];

  return (
    <NaverMap
      defaultCenter={{ lat: 37.5665, lng: 126.978 }}
      defaultZoom={14}
      style={{ width: "100%", height: "500px" }}
    >
      <DotMap
        data={data}
        radius={5}
        opacity={0.8}
        fillColor="#03C75A"
        strokeColor="#ffffff"
        strokeWeight={1}
      />
    </NaverMap>
  );
}
```

## 공개 타입

```ts
interface DotMapOptionProps {
  data: naver.maps.LatLng[] | naver.maps.PointArrayLiteral[] | Array<{ lat: number; lng: number }>;
  opacity?: number;
  radius?: number;
  strokeWeight?: number;
  strokeColor?: string;
  strokeLineCap?: "butt" | "round" | "square";
  strokeLineJoin?: "bevel" | "miter" | "round";
  fillColor?: string;
}

interface DotMapProps extends DotMapOptionProps {
  onDotMapReady?: (dotMap: naver.maps.visualization.DotMap) => void;
}

interface DotMapRef {
  getInstance: () => naver.maps.visualization.DotMap | null;
  getMap: () => naver.maps.Map | null;
  setData: (data: naver.maps.LatLng[] | naver.maps.PointArrayLiteral[]) => void;
  addData: (data: naver.maps.LatLng | naver.maps.PointArrayLiteral) => void;
  redraw: () => void;
}
```

## 옵션 프로퍼티

| Prop             | Type                            | Default     | Description             |
| ---------------- | ------------------------------- | ----------- | ----------------------- |
| `data`           | `LatLng[] \| object[]`          | -           | 시각화 데이터 (필수)    |
| `radius`         | `number`                        | `5`         | 점 반경 (픽셀)          |
| `opacity`        | `number`                        | `0.6`       | 불투명도 (0-1)          |
| `fillColor`      | `string`                        | `"#ff0000"` | 채우기 색상             |
| `strokeColor`    | `string`                        | `"#fff"`    | 테두리 색상             |
| `strokeWeight`   | `number`                        | `1`         | 테두리 두께             |
| `strokeLineCap`  | `"butt" \| "round" \| "square"` | `"round"`   | 선 끝 스타일            |
| `strokeLineJoin` | `"bevel" \| "miter" \| "round"` | `"round"`   | 선 연결 스타일          |
| `onDotMapReady`  | `(dotMap) => void`              | -           | 인스턴스 생성 완료 콜백 |

## Ref 메서드

| Method          | Return Type      | Description     |
| --------------- | ---------------- | --------------- |
| `getInstance()` | `DotMap`         | DotMap 인스턴스 |
| `getMap()`      | `naver.maps.Map` | 지도 인스턴스   |
| `setData()`     | `void`           | 데이터 설정     |
| `addData()`     | `void`           | 데이터 추가     |
| `redraw()`      | `void`           | 다시 그리기     |

## 지원하는 Data 형식

```tsx
// 1. 객체 배열 - 가장 편리한 형식
const data1 = [
  { lat: 37.5665, lng: 126.978 },
  { lat: 37.5666, lng: 126.979 }
];

// 2. naver.maps.LatLng 배열
const data2 = [new naver.maps.LatLng(37.5665, 126.978), new naver.maps.LatLng(37.5666, 126.979)];

// 3. PointArrayLiteral 배열
const data3 = [
  [37.5665, 126.978],
  [37.5666, 126.979]
];
```

## 동작 규칙

- `NaverMap` 내부에서만 사용 가능합니다.
- `visualization` 서브모듈이 로드되어야 사용 가능합니다.
- `{ lat, lng }` 형태의 객체 배열은 자동으로 `LatLng`로 변환됩니다.
- Props 변경 시 자동으로 `setData()`, `setOptions()`, `redraw()`가 호출됩니다.
- 언마운트 시 `setMap(null)`로 정리됩니다.
