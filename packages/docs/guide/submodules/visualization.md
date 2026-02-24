# Visualization 서브모듈

Visualization 서브모듈은 지리 데이터를 시각화하는 도구를 제공합니다.

## 라이브 데모

<DemoEmbed demo="visualization" height="550px" />

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

## 컴포넌트

### HeatMap

열지도를 표시하는 컴포넌트입니다.

```tsx
import { NaverMap, HeatMap } from "react-naver-maps-kit";

function MapWithHeatMap() {
  const data = [
    { lat: 37.5665, lng: 126.978, weight: 10 },
    { lat: 37.5666, lng: 126.979, weight: 5 },
    { lat: 37.5667, lng: 126.980, weight: 8 }
  ];

  return (
    <NaverMap
      defaultCenter={{ lat: 37.5665, lng: 126.978 }}
      defaultZoom={14}
      style={{ width: "100%", height: "500px" }}
    >
      <HeatMap
        data={data}
        radius={20}
        opacity={0.6}
        colorMap={naver.maps.visualization.SpectrumStyle.RAINBOW}
        colorMapReverse={false}
        onHeatMapReady={(heatMap) => console.log("HeatMap ready", heatMap)}
      />
    </NaverMap>
  );
}
```

#### 타입 정의

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
```

#### Props

| Prop              | 타입                               | 기본값  | 설명                        |
| ----------------- | ---------------------------------- | ------- | --------------------------- |
| `data`            | `LatLng[] \| WeightedLocation[]`   | -       | 시각화 데이터               |
| `radius`          | `number`                           | `20`    | 반경 (픽셀)                 |
| `opacity`         | `number`                           | `0.6`   | 불투명도 (0-1)              |
| `colorMap`        | `SpectrumStyle`                    | -       | 색상 스펙트럼               |
| `colorMapReverse` | `boolean`                          | `false` | 스펙트럼 색상 반전          |
| `onHeatMapReady`  | `(heatMap) => void`                | -       | 인스턴스 생성 완료 콜백     |

#### 지원하는 Data 형식

HeatMap은 다양한 형식의 데이터를 지원합니다:

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
const data3 = [
  new naver.maps.LatLng(37.5665, 126.978),
  new naver.maps.LatLng(37.5666, 126.979)
];

// 4. PointArrayLiteral 배열
const data4 = [
  [37.5665, 126.978],
  [37.5666, 126.979]
];

// 5. WeightedLocation 배열
const data5 = [
  new naver.maps.visualization.WeightedLocation(37.5665, 126.978, 10),
  new naver.maps.visualization.WeightedLocation(37.5666, 126.979, 5)
];
```

#### 색상 스펙트럼 (SpectrumStyle)

사용 가능한 스펙트럼 스타일:

| 스펙트럼   | 설명                     |
| ---------- | ------------------------ |
| `RAINBOW`  | 무지개 색상              |
| `JET`      | Jet 색상                 |
| `HSV`      | HSV 색상 공간            |
| `HOT`      | 뜨거운 색상 (검정→빨강)  |
| `COOL`     | 차가운 색상 (청록→자홍)  |
| `GREYS`    | 회색 계열                |
| `YIGnBu`   | 노랑→초록→파랑           |
| `YIOrRd`   | 노랑→주황→빨강           |
| `RdBu`     | 빨강→파랑                |
| `PORTLAND` | Portland 색상            |
| `OXYGEN`   | Oxygen 색상              |

```tsx
<HeatMap
  data={data}
  colorMap={naver.maps.visualization.SpectrumStyle.JET}
  colorMapReverse={true}
/>
```

#### Ref Methods

```tsx
import { useRef } from "react";
import { NaverMap, HeatMap, type HeatMapRef } from "react-naver-maps-kit";

function HeatMapWithRef() {
  const heatMapRef = useRef<HeatMapRef>(null);

  const addPoint = () => {
    heatMapRef.current?.addData(
      new naver.maps.visualization.WeightedLocation(37.5665, 126.978, 10)
    );
  };

  return (
    <>
      <NaverMap defaultCenter={{ lat: 37.5665, lng: 126.978 }} defaultZoom={14}>
        <HeatMap ref={heatMapRef} data={[]} />
      </NaverMap>
      <button onClick={addPoint}>포인트 추가</button>
    </>
  );
}
```

| 메서드          | 반환 타입                        | 설명                 |
| --------------- | -------------------------------- | -------------------- |
| `getInstance()` | `naver.maps.visualization.HeatMap` | HeatMap 인스턴스   |
| `getMap()`      | `naver.maps.Map`                 | 지도 인스턴스        |
| `setData()`     | `void`                           | 데이터 설정          |
| `addData()`     | `void`                           | 데이터 추가          |
| `redraw()`      | `void`                           | 다시 그리기          |

---

### DotMap

점지도를 표시하는 컴포넌트입니다.

```tsx
import { NaverMap, DotMap } from "react-naver-maps-kit";

function MapWithDotMap() {
  const data = [
    { lat: 37.5665, lng: 126.978 },
    { lat: 37.5666, lng: 126.979 },
    { lat: 37.5667, lng: 126.980 }
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
        onDotMapReady={(dotMap) => console.log("DotMap ready", dotMap)}
      />
    </NaverMap>
  );
}
```

#### 타입 정의

```ts
interface DotMapOptionProps {
  data:
    | naver.maps.LatLng[]
    | naver.maps.PointArrayLiteral[]
    | Array<{ lat: number; lng: number }>;
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

#### Props

| Prop             | 타입                       | 기본값      | 설명                    |
| ---------------- | -------------------------- | ----------- | ----------------------- |
| `data`           | `LatLng[] \| object[]`     | -           | 시각화 데이터           |
| `radius`         | `number`                   | `5`         | 점 반경 (픽셀)          |
| `opacity`        | `number`                   | `0.6`       | 불투명도 (0-1)          |
| `fillColor`      | `string`                   | `"#ff0000"` | 채우기 색상             |
| `strokeColor`    | `string`                   | `"#fff"`    | 테두리 색상             |
| `strokeWeight`   | `number`                   | `1`         | 테두리 두께             |
| `strokeLineCap`  | `"butt" \| "round" \| "square"` | `"round"` | 선 끝 스타일       |
| `strokeLineJoin` | `"bevel" \| "miter" \| "round"` | `"round"` | 선 연결 스타일     |
| `onDotMapReady`  | `(dotMap) => void`         | -           | 인스턴스 생성 완료 콜백 |

#### Ref Methods

| 메서드          | 반환 타입                        | 설명                |
| --------------- | -------------------------------- | ------------------- |
| `getInstance()` | `naver.maps.visualization.DotMap` | DotMap 인스턴스   |
| `getMap()`      | `naver.maps.Map`                 | 지도 인스턴스       |
| `setData()`     | `void`                           | 데이터 설정         |
| `addData()`     | `void`                           | 데이터 추가         |
| `redraw()`      | `void`                           | 다시 그리기         |

---

## 활용 예제

### 기본 열지도

```tsx
import { NaverMap, HeatMap } from "react-naver-maps-kit";
import { useMemo } from "react";

function generateRandomPoints(count: number) {
  const points = [];
  for (let i = 0; i < count; i++) {
    points.push({
      lat: 37.5 + Math.random() * 0.1,
      lng: 126.9 + Math.random() * 0.1,
      weight: Math.floor(Math.random() * 10) + 1
    });
  }
  return points;
}

function BasicHeatMap() {
  const data = useMemo(() => generateRandomPoints(200), []);

  return (
    <NaverMap
      defaultCenter={{ lat: 37.55, lng: 126.95 }}
      defaultZoom={13}
      style={{ width: "100%", height: "500px" }}
    >
      <HeatMap data={data} radius={25} opacity={0.7} />
    </NaverMap>
  );
}
```

### 기본 점지도

```tsx
import { NaverMap, DotMap } from "react-naver-maps-kit";
import { useMemo } from "react";

function generateRandomPoints(count: number) {
  const points = [];
  for (let i = 0; i < count; i++) {
    points.push({
      lat: 37.5 + Math.random() * 0.1,
      lng: 126.9 + Math.random() * 0.1
    });
  }
  return points;
}

function BasicDotMap() {
  const data = useMemo(() => generateRandomPoints(100), []);

  return (
    <NaverMap
      defaultCenter={{ lat: 37.55, lng: 126.95 }}
      defaultZoom={13}
      style={{ width: "100%", height: "500px" }}
    >
      <DotMap
        data={data}
        radius={6}
        opacity={0.8}
        fillColor="#03C75A"
        strokeColor="#ffffff"
        strokeWeight={1}
      />
    </NaverMap>
  );
}
```

### 데이터 동적 업데이트

```tsx
import { useState, useMemo } from "react";
import { NaverMap, HeatMap } from "react-naver-maps-kit";

function generateRandomPoints(count: number) {
  const points = [];
  for (let i = 0; i < count; i++) {
    points.push({
      lat: 37.5 + Math.random() * 0.1,
      lng: 126.9 + Math.random() * 0.1,
      weight: Math.floor(Math.random() * 10) + 1
    });
  }
  return points;
}

function DynamicHeatMap() {
  const [pointCount, setPointCount] = useState(100);
  const [radius, setRadius] = useState(20);
  const [opacity, setOpacity] = useState(0.6);

  const data = useMemo(() => generateRandomPoints(pointCount), [pointCount]);

  return (
    <div>
      <div style={{ marginBottom: 16, display: "flex", gap: 16 }}>
        <label>
          포인트 수: {pointCount}
          <input
            type="range"
            min={50}
            max={500}
            value={pointCount}
            onChange={(e) => setPointCount(Number(e.target.value))}
          />
        </label>
        <label>
          반지름: {radius}px
          <input
            type="range"
            min={5}
            max={50}
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
          />
        </label>
        <label>
          투명도: {opacity.toFixed(1)}
          <input
            type="range"
            min={0}
            max={100}
            value={opacity * 100}
            onChange={(e) => setOpacity(Number(e.target.value) / 100)}
          />
        </label>
      </div>

      <NaverMap
        defaultCenter={{ lat: 37.55, lng: 126.95 }}
        defaultZoom={13}
        style={{ width: "100%", height: "500px" }}
      >
        <HeatMap data={data} radius={radius} opacity={opacity} />
      </NaverMap>
    </div>
  );
}
```

### 스펙트럼 변경

```tsx
import { useState } from "react";
import { NaverMap, HeatMap } from "react-naver-maps-kit";

const spectrumOptions = [
  "RAINBOW", "JET", "HSV", "HOT", "COOL",
  "GREYS", "YIGnBu", "YIOrRd", "RdBu", "PORTLAND", "OXYGEN"
];

function HeatMapWithSpectrum() {
  const [spectrum, setSpectrum] = useState("RAINBOW");
  const [reverse, setReverse] = useState(false);

  const data = [
    { lat: 37.5665, lng: 126.978, weight: 10 },
    { lat: 37.5670, lng: 126.980, weight: 8 },
    { lat: 37.5660, lng: 126.975, weight: 6 }
  ];

  const colorMap = naver.maps.visualization.SpectrumStyle[
    spectrum as keyof typeof naver.maps.visualization.SpectrumStyle
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: "flex", gap: 16 }}>
        <select value={spectrum} onChange={(e) => setSpectrum(e.target.value)}>
          {spectrumOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <label>
          <input
            type="checkbox"
            checked={reverse}
            onChange={(e) => setReverse(e.target.checked)}
          />
          스펙트럼 반전
        </label>
      </div>

      <NaverMap
        defaultCenter={{ lat: 37.5665, lng: 126.978 }}
        defaultZoom={15}
        style={{ width: "100%", height: "500px" }}
      >
        <HeatMap
          data={data}
          radius={30}
          opacity={0.7}
          colorMap={colorMap}
          colorMapReverse={reverse}
        />
      </NaverMap>
    </div>
  );
}
```

### HeatMap과 DotMap 전환

```tsx
import { useState, useMemo } from "react";
import { NaverMap, HeatMap, DotMap } from "react-naver-maps-kit";

function generateRandomPoints(count: number) {
  const points = [];
  for (let i = 0; i < count; i++) {
    points.push({
      lat: 37.5 + Math.random() * 0.1,
      lng: 126.9 + Math.random() * 0.1,
      weight: Math.floor(Math.random() * 10) + 1
    });
  }
  return points;
}

function VisualizationToggle() {
  const [type, setType] = useState<"heatmap" | "dotmap">("heatmap");
  const data = useMemo(() => generateRandomPoints(150), []);

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <button
          onClick={() => setType("heatmap")}
          style={{ fontWeight: type === "heatmap" ? "bold" : "normal" }}
        >
          HeatMap
        </button>
        <button
          onClick={() => setType("dotmap")}
          style={{ fontWeight: type === "dotmap" ? "bold" : "normal" }}
        >
          DotMap
        </button>
      </div>

      <NaverMap
        defaultCenter={{ lat: 37.55, lng: 126.95 }}
        defaultZoom={13}
        style={{ width: "100%", height: "500px" }}
      >
        {type === "heatmap" && (
          <HeatMap data={data} radius={20} opacity={0.6} />
        )}
        {type === "dotmap" && (
          <DotMap
            data={data}
            radius={5}
            fillColor="#EA4335"
            strokeColor="#fff"
          />
        )}
      </NaverMap>
    </div>
  );
}
```

## 동작 규칙

1. **인스턴스 생성**: `NaverMap` 내부에서만 사용 가능합니다.
2. **맵 인스턴스 해결**: `MapInstanceContext`를 통해 부모 `NaverMap`의 인스턴스를 자동으로 사용합니다.
3. **초기화 타이밍**: 지도가 완전히 초기화된 후(`map.isReady === true`) HeatMap/DotMap이 생성됩니다.
4. **Props 변경 반영**: `data`, `radius`, `opacity` 등 props 변경 시 자동으로 `setData()`, `setOptions()`, `redraw()`가 호출됩니다.
5. **데이터 정규화**: `{ lat, lng, weight }` 형태의 객체 배열은 자동으로 `WeightedLocation`으로 변환됩니다.
6. **클린업**: 컴포넌트 언마운트 시 `setMap(null)`로 정리됩니다.

## 참고

- [공식 Visualization 문서](https://navermaps.github.io/maps.js.ncp/docs/tutorial-Visualization.html)
- [공식 HeatMap API](https://navermaps.github.io/maps.js.ncp/docs/naver.maps.visualization.HeatMap.html)
- [공식 DotMap API](https://navermaps.github.io/maps.js.ncp/docs/naver.maps.visualization.DotMap.html)
- [공식 WeightedLocation API](https://navermaps.github.io/maps.js.ncp/docs/naver.maps.visualization.WeightedLocation.html)
- [공식 SpectrumStyle API](https://navermaps.github.io/maps.js.ncp/docs/naver.maps.visualization.SpectrumStyle.html)
