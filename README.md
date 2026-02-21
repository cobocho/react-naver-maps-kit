# react-naver-maps-kit

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/react-naver-maps-kit.svg)](https://www.npmjs.com/package/react-naver-maps-kit)

네이버 지도 SDK를 React에서 안전하고 직관적으로 사용할 수 있는 모던 툴킷입니다.

## 특징

- **선언형 API**: React props로 지도와 오버레이를 선언형으로 제어
- **완전한 TypeScript 지원**: 네이버 지도 SDK 타입 정의 포함
- **안전한 생명주기 관리**: 지도 및 오버레이 생성/업데이트/정리 자동 처리
- **Context 기반 상태 관리**: SDK 로딩 상태, 에러, 지도 인스턴스를 컨텍스트로 관리
- **Custom React Hooks**: Provider 안전 가드가 포함된 편리한 훅 제공
- **오버레이 컴포넌트**: Marker, InfoWindow, Circle, Polygon 등 다양한 오버레이 지원

## 설치

```bash
# pnpm
pnpm add react-naver-maps-kit

# npm
npm install react-naver-maps-kit

# yarn
yarn add react-naver-maps-kit
```

### Peer Dependencies

- `react >= 18`
- `react-dom >= 18`

## 빠른 시작

### 1. API 키 발급

[네이버 클라우드 플랫폼](https://www.ncloud.com/)에서 Maps API 서비스를 신청하고 API 키를 발급받으세요.

### 2. 기본 사용법

```tsx
import { NaverMap, NaverMapProvider } from "react-naver-maps-kit";

function App() {
  return (
    <NaverMapProvider ncpKeyId={import.meta.env.VITE_NCP_KEY_ID}>
      <NaverMap
        center={{ lat: 37.3595704, lng: 127.105399 }}
        zoom={10}
        style={{ width: "100%", height: "400px" }}
      />
    </NaverMapProvider>
  );
}
```

### 3. 마커 추가하기

```tsx
import { NaverMap, NaverMapProvider, Marker } from "react-naver-maps-kit";

function MapWithMarker() {
  return (
    <NaverMapProvider ncpKeyId={import.meta.env.VITE_NCP_KEY_ID}>
      <NaverMap
        center={{ lat: 37.3595704, lng: 127.105399 }}
        zoom={12}
        style={{ width: "100%", height: "400px" }}
      >
        <Marker
          position={{ lat: 37.3595704, lng: 127.105399 }}
          title="네이버 그린팩토리"
          onClick={(e) => console.log("Marker clicked!", e)}
        />
      </NaverMap>
    </NaverMapProvider>
  );
}
```

### 4. 커스텀 마커 (React 컴포넌트)

```tsx
import { NaverMap, NaverMapProvider, Marker } from "react-naver-maps-kit";

function CustomMarker() {
  return (
    <Marker position={{ lat: 37.3595704, lng: 127.105399 }}>
      <div
        style={{
          padding: "8px 16px",
          background: "#03C75A",
          color: "white",
          borderRadius: "20px",
          fontWeight: "bold",
          whiteSpace: "nowrap"
        }}
      >
        네이버
      </div>
    </Marker>
  );
}
```

## API 개요

### Provider

#### `NaverMapProvider`

SDK 로딩과 상태를 관리하는 최상위 컴포넌트입니다.

```tsx
interface NaverMapProviderProps {
  children: ReactNode;
  ncpKeyId?: string; // 권장: NCP API Key ID
  ncpClientId?: string; // 레거시: NCP Client ID
  govClientId?: string; // 공공기관용 Client ID
  finClientId?: string; // 금융기관용 Client ID
  submodules?: Array<"geocoder" | "panorama" | "drawing" | "visualization">;
  timeoutMs?: number; // 로딩 타임아웃 (기본: 10000ms)
  nonce?: string; // CSP nonce
  autoLoad?: boolean; // 자동 로딩 (기본: true)
  onReady?: () => void; // SDK 로딩 완료 콜백
  onError?: (error: Error) => void; // 에러 콜백
}
```

### Components

#### `NaverMap`

지도를 렌더링하는 메인 컴포넌트입니다.

```tsx
interface NaverMapProps {
  // 지도 옵션
  center?: naver.maps.Coord | naver.maps.CoordLiteral;
  defaultCenter?: naver.maps.Coord | naver.maps.CoordLiteral;
  zoom?: number;
  defaultZoom?: number;
  mapTypeId?: string;
  minZoom?: number;
  maxZoom?: number;
  bounds?: naver.maps.Bounds | naver.maps.BoundsLiteral;
  maxBounds?: naver.maps.Bounds | naver.maps.BoundsLiteral;

  // 컨트롤 옵션
  zoomControl?: boolean;
  zoomControlOptions?: naver.maps.ZoomControlOptions;
  mapTypeControl?: boolean;
  mapTypeControlOptions?: naver.maps.MapTypeControlOptions;
  scaleControl?: boolean;
  logoControl?: boolean;

  // 인터랙션 옵션
  draggable?: boolean;
  scrollWheel?: boolean;
  keyboardShortcuts?: boolean;
  disableDoubleClickZoom?: boolean;
  pinchZoom?: boolean;

  // 생명주기 콜백
  onMapReady?: (map: naver.maps.Map) => void;
  onMapDestroy?: () => void;
  onMapError?: (error: Error) => void;

  // 이벤트 핸들러
  onClick?: (pointerEvent: naver.maps.PointerEvent) => void;
  onCenterChanged?: (center: naver.maps.Coord) => void;
  onZoomChanged?: (zoom: number) => void;
  onBoundsChanged?: (bounds: naver.maps.Bounds) => void;
  // ... 더 많은 이벤트 지원
}
```

#### Overlay Components

모든 오버레이 컴포넌트는 `NaverMap` 내부에서 사용해야 합니다.

| 컴포넌트        | 설명                   |
| --------------- | ---------------------- |
| `Marker`        | 지도 위 마커 표시      |
| `InfoWindow`    | 정보 창 표시           |
| `Circle`        | 원형 오버레이          |
| `Ellipse`       | 타원형 오버레이        |
| `Rectangle`     | 사각형 오버레이        |
| `Polygon`       | 다각형 오버레이        |
| `Polyline`      | 선형 오버레이          |
| `GroundOverlay` | 지상 오버레이 (이미지) |

```tsx
// 오버레이 예시
<NaverMap center={{ lat: 37.5665, lng: 126.978 }} zoom={12}>
  <Marker position={{ lat: 37.5665, lng: 126.978 }} />
  <Circle
    center={{ lat: 37.5665, lng: 126.978 }}
    radius={1000}
    strokeColor="#03C75A"
    fillColor="#03C75A"
    fillOpacity={0.3}
  />
  <Polygon
    paths={[
      { lat: 37.56, lng: 126.97 },
      { lat: 37.57, lng: 126.98 },
      { lat: 37.58, lng: 126.97 }
    ]}
    fillColor="#FF0000"
  />
</NaverMap>
```

### Hooks

#### `useNaverMap`

Provider 컨텍스트에 접근하기 위한 훅입니다.

```tsx
import { useNaverMap } from "react-naver-maps-kit";

function MyComponent() {
  const { sdkStatus, sdkError, map, reloadSdk } = useNaverMap();

  if (sdkStatus === "loading") return <div>로딩 중...</div>;
  if (sdkStatus === "error") return <div>에러: {sdkError?.message}</div>;

  return <div>지도 준비 완료!</div>;
}
```

#### `useNaverMapInstance`

지도 인스턴스에 직접 접근하기 위한 훅입니다.

```tsx
import { useNaverMapInstance } from "react-naver-maps-kit";

function MapController() {
  const map = useNaverMapInstance();

  const handlePanTo = () => {
    map?.panTo(new naver.maps.LatLng(37.5665, 126.978));
  };

  return <button onClick={handlePanTo}>서울시청으로 이동</button>;
}
```

### Utilities

#### `loadNaverMapsScript`

SDK를 수동으로 로딩하기 위한 유틸리티 함수입니다.

```tsx
import { loadNaverMapsScript } from "react-naver-maps-kit";

// 수동 로딩
await loadNaverMapsScript({
  ncpKeyId: "YOUR_KEY",
  submodules: ["geocoder"],
  timeoutMs: 15000
});
```

## Ref API

모든 컴포넌트는 `ref`를 통해 네이버 지도 SDK 인스턴스 메서드에 접근할 수 있습니다.

```tsx
import { useRef } from "react";
import { NaverMap, Marker, type NaverMapRef, type MarkerRef } from "react-naver-maps-kit";

function MapWithRef() {
  const mapRef = useRef<NaverMapRef>(null);
  const markerRef = useRef<MarkerRef>(null);

  const handleGetCenter = () => {
    const center = mapRef.current?.getCenter();
    console.log("Center:", center);
  };

  const handleMoveMarker = () => {
    markerRef.current?.setPosition({ lat: 37.5, lng: 127.0 });
  };

  return (
    <NaverMap ref={mapRef} center={{ lat: 37.3595704, lng: 127.105399 }} zoom={10}>
      <Marker ref={markerRef} position={{ lat: 37.3595704, lng: 127.105399 }} />
    </NaverMap>
  );
}
```

## Controlled vs Uncontrolled

`center`/`defaultCenter`, `zoom`/`defaultZoom`을 통해 제어 모드를 선택할 수 있습니다.

```tsx
// Controlled: React 상태로 관리
<NaverMap
  center={center}
  zoom={zoom}
  onCenterChanged={setCenter}
  onZoomChanged={setZoom}
/>

// Uncontrolled: 내부 상태로 관리
<NaverMap
  defaultCenter={{ lat: 37.3595704, lng: 127.105399 }}
  defaultZoom={10}
/>
```

## 문서

- [시작하기](/docs/guide/getting-started.md)
- [Provider & Hook](/docs/guide/provider-map-hook.md)
- [지도 통합](/docs/guide/integration-map.md)
- [오버레이 통합](/docs/guide/integration-overlay.md)
- [문제 해결](/docs/troubleshooting/common-issues.md)

## 라이선스

MIT License
