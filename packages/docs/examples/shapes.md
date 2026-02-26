# 도형 그리기

`Circle`, `Polygon`, `Polyline` 등 도형 오버레이로 지도에 영역을 표시하는 방법을 설명합니다.

## 라이브 데모

### Circle

<DemoEmbed demo="circle" height="400px" />

### Polygon

<DemoEmbed demo="polygon" height="400px" />

### Polyline

<DemoEmbed demo="polyline" height="400px" />

## 원형 (Circle)

특정 위치를 중심으로 반경을 표시합니다:

```tsx
import { NaverMap, Circle, NaverMapProvider } from "react-naver-maps-kit";

function CircleExample() {
  return (
    <NaverMapProvider ncpKeyId={import.meta.env.VITE_NCP_KEY_ID}>
      <NaverMap
        center={{ lat: 37.5665, lng: 126.978 }}
        zoom={12}
        style={{ width: "100%", height: "500px" }}
      >
        <Circle
          center={{ lat: 37.5665, lng: 126.978 }}
          radius={1000} // 미터 단위
          strokeColor="#03C75A"
          strokeWeight={2}
          strokeOpacity={0.8}
          fillColor="#03C75A"
          fillOpacity={0.2}
        />
      </NaverMap>
    </NaverMapProvider>
  );
}
```

### Circle Props

| Prop            | 타입                       | 기본값    | 설명                  |
| --------------- | -------------------------- | --------- | --------------------- |
| `center`        | `{ lat, lng }`             | -         | 원의 중심 (필수)      |
| `radius`        | `number`                   | `0`       | 반경 (미터)           |
| `strokeColor`   | `string`                   | `#007EEA` | 외곽선 색상           |
| `strokeWeight`  | `number`                   | `1`       | 외곽선 두께           |
| `strokeOpacity` | `number`                   | `1`       | 외곽선 불투명도 (0~1) |
| `strokeStyle`   | `solid` \| `dash` \| `dot` | `solid`   | 외곽선 스타일         |
| `fillColor`     | `string`                   | -         | 채우기 색상           |
| `fillOpacity`   | `number`                   | `1`       | 채우기 불투명도 (0~1) |

## 폴리곤 (Polygon)

다각형 영역을 표시합니다:

```tsx
import { NaverMap, Polygon, NaverMapProvider } from "react-naver-maps-kit";

function PolygonExample() {
  const path = [
    { lat: 37.56, lng: 126.97 },
    { lat: 37.57, lng: 126.97 },
    { lat: 37.575, lng: 126.985 },
    { lat: 37.57, lng: 127.0 },
    { lat: 37.56, lng: 127.0 }
  ];

  return (
    <NaverMapProvider ncpKeyId={import.meta.env.VITE_NCP_KEY_ID}>
      <NaverMap
        center={{ lat: 37.565, lng: 126.985 }}
        zoom={12}
        style={{ width: "100%", height: "500px" }}
      >
        <Polygon
          paths={path}
          strokeColor="#FF6B6B"
          strokeWeight={3}
          fillColor="#FF6B6B"
          fillOpacity={0.3}
          clickable
          onClick={(e) => console.log("폴리곤 클릭", e.coord)}
        />
      </NaverMap>
    </NaverMapProvider>
  );
}
```

### 다중 폴리곤 (구멍 뚫기)

여러 경로로 구멍이 뚫린 폴리곤을 만들 수 있습니다:

```tsx
const outerPath = [
  { lat: 37.58, lng: 126.95 },
  { lat: 37.58, lng: 127.0 },
  { lat: 37.55, lng: 127.0 },
  { lat: 37.55, lng: 126.95 }
];

const innerPath = [
  { lat: 37.57, lng: 126.96 },
  { lat: 37.57, lng: 126.99 },
  { lat: 37.56, lng: 126.99 },
  { lat: 37.56, lng: 126.96 }
];

<Polygon
  paths={[outerPath, innerPath]} // 외부 + 내부 경로
  fillColor="#4CAF50"
  fillOpacity={0.4}
/>;
```

## 폴리라인 (Polyline)

경로나 선을 표시합니다:

```tsx
import { NaverMap, Polyline, NaverMapProvider } from "react-naver-maps-kit";

function PolylineExample() {
  const path = [
    { lat: 37.5547, lng: 126.9707 }, // 서울역
    { lat: 37.4981, lng: 127.0276 }, // 강남역
    { lat: 37.5133, lng: 127.1 } // 잠실역
  ];

  return (
    <NaverMapProvider ncpKeyId={import.meta.env.VITE_NCP_KEY_ID}>
      <NaverMap
        center={{ lat: 37.52, lng: 127.0 }}
        zoom={12}
        style={{ width: "100%", height: "500px" }}
      >
        <Polyline
          path={path}
          strokeColor="#2196F3"
          strokeWeight={5}
          strokeOpacity={0.8}
          strokeLineCap="round"
          strokeLineJoin="round"
        />
      </NaverMap>
    </NaverMapProvider>
  );
}
```

### Polyline 스타일

```tsx
<Polyline
  path={path}
  strokeColor="#E91E63"
  strokeWeight={4}
  strokeStyle="dash" // 실선: solid, 점선: dash, 점: dot
  strokeLineCap="round" // 끝 모양: butt, round, square
  strokeLineJoin="round" // 연결부: miter, round, bevel
/>
```

## 사각형 (Rectangle)

```tsx
import { NaverMap, Rectangle, NaverMapProvider } from "react-naver-maps-kit";

function RectangleExample() {
  const bounds = {
    south: 37.55,
    west: 126.95,
    north: 37.58,
    east: 127.0
  };

  return (
    <NaverMapProvider ncpKeyId={import.meta.env.VITE_NCP_KEY_ID}>
      <NaverMap
        center={{ lat: 37.565, lng: 126.975 }}
        zoom={12}
        style={{ width: "100%", height: "500px" }}
      >
        <Rectangle
          bounds={bounds}
          strokeColor="#9C27B0"
          strokeWeight={2}
          fillColor="#9C27B0"
          fillOpacity={0.2}
        />
      </NaverMap>
    </NaverMapProvider>
  );
}
```

## 타원 (Ellipse)

```tsx
import { NaverMap, Ellipse, NaverMapProvider } from "react-naver-maps-kit";

function EllipseExample() {
  return (
    <NaverMapProvider ncpKeyId={import.meta.env.VITE_NCP_KEY_ID}>
      <NaverMap
        center={{ lat: 37.5665, lng: 126.978 }}
        zoom={12}
        style={{ width: "100%", height: "500px" }}
      >
        <Ellipse
          bounds={{
            south: 37.56,
            west: 126.97,
            north: 37.57,
            east: 126.99
          }}
          strokeColor="#FF9800"
          fillColor="#FF9800"
          fillOpacity={0.3}
        />
      </NaverMap>
    </NaverMapProvider>
  );
}
```

## 실전 예제: 지도 위에 영역 표시

```tsx
import { useState } from "react";
import {
  NaverMap,
  Circle,
  Polygon,
  Polyline,
  Marker,
  NaverMapProvider
} from "react-naver-maps-kit";

function AreaDisplay() {
  const [mode, setMode] = useState<"circle" | "polygon" | "polyline">("circle");

  // 서비스 가능 반경
  const serviceAreas = [
    { center: { lat: 37.5665, lng: 126.978 }, radius: 2000 },
    { center: { lat: 37.4981, lng: 127.0276 }, radius: 1500 }
  ];

  // 배달 경로
  const deliveryPath = [
    { lat: 37.5547, lng: 126.9707 },
    { lat: 37.56, lng: 126.98 },
    { lat: 37.5665, lng: 126.978 }
  ];

  // 서비스 구역
  const serviceZone = [
    { lat: 37.56, lng: 126.96 },
    { lat: 37.58, lng: 126.96 },
    { lat: 37.58, lng: 127.0 },
    { lat: 37.56, lng: 127.0 }
  ];

  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => setMode("circle")}>서비스 반경</button>
        <button onClick={() => setMode("polygon")}>서비스 구역</button>
        <button onClick={() => setMode("polyline")}>배달 경로</button>
      </div>

      <NaverMapProvider ncpKeyId={import.meta.env.VITE_NCP_KEY_ID}>
        <NaverMap
          center={{ lat: 37.565, lng: 126.98 }}
          zoom={12}
          style={{ width: "100%", height: "500px" }}
        >
          {mode === "circle" &&
            serviceAreas.map((area, i) => (
              <Circle
                key={i}
                center={area.center}
                radius={area.radius}
                strokeColor="#03C75A"
                strokeWeight={2}
                fillColor="#03C75A"
                fillOpacity={0.15}
              />
            ))}

          {mode === "polygon" && (
            <Polygon
              paths={serviceZone}
              strokeColor="#2196F3"
              strokeWeight={3}
              fillColor="#2196F3"
              fillOpacity={0.2}
            />
          )}

          {mode === "polyline" && (
            <>
              <Polyline path={deliveryPath} strokeColor="#FF5722" strokeWeight={4} />
              {deliveryPath.map((point, i) => (
                <Marker key={i} position={point} />
              ))}
            </>
          )}
        </NaverMap>
      </NaverMapProvider>
    </div>
  );
}
```

## Ref로 도형 제어

```tsx
import { useRef } from "react";
import { NaverMap, Circle, NaverMapProvider, type CircleRef } from "react-naver-maps-kit";

function ControlledCircle() {
  const circleRef = useRef<CircleRef>(null);
  const [radius, setRadius] = useState(1000);

  const getArea = () => {
    const area = circleRef.current?.getAreaSize();
    console.log(`면적: ${area?.toFixed(0)} m²`);
  };

  const getBounds = () => {
    const bounds = circleRef.current?.getBounds();
    console.log("경계:", bounds);
  };

  return (
    <div>
      <NaverMapProvider ncpKeyId={import.meta.env.VITE_NCP_KEY_ID}>
        <NaverMap
          center={{ lat: 37.5665, lng: 126.978 }}
          zoom={13}
          style={{ width: "100%", height: "400px" }}
        >
          <Circle
            ref={circleRef}
            center={{ lat: 37.5665, lng: 126.978 }}
            radius={radius}
            fillColor="#03C75A"
            fillOpacity={0.3}
          />
        </NaverMap>
      </NaverMapProvider>

      <div style={{ marginTop: "1rem" }}>
        <label>
          반경: {radius}m
          <input
            type="range"
            min={500}
            max={5000}
            step={100}
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
          />
        </label>
        <button onClick={getArea}>면적 계산</button>
        <button onClick={getBounds}>경계 조회</button>
      </div>
    </div>
  );
}
```

## 다음 단계

- [마커 클러스터링](/examples/clustering) - 대량 마커 처리
- [Circle API](/api/circle) - Circle 전체 Props
- [Polygon API](/api/polygon) - Polygon 전체 Props
- [Polyline API](/api/polyline) - Polyline 전체 Props
