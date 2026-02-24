# 지도 컨트롤

지도의 줌, 타입, 스케일 등 컨트롤을 설정하는 방법을 설명합니다.

## 라이브 데모

<DemoEmbed demo="navermap" height="450px" />

## 줌 컨트롤

줌 인/아웃 버튼을 표시합니다:

```tsx
import { NaverMap, NaverMapProvider } from "react-naver-maps-kit";

function ZoomControlExample() {
  return (
    <NaverMapProvider ncpKeyId={import.meta.env.VITE_NCP_KEY_ID}>
      <NaverMap
        center={{ lat: 37.5665, lng: 126.978 }}
        zoom={12}
        zoomControl
        zoomControlOptions={{
          position: naver.maps.Position.TOP_RIGHT,
          style: naver.maps.ZoomControlStyle.SMALL
        }}
        style={{ width: "100%", height: "500px" }}
      />
    </NaverMapProvider>
  );
}
```

### 줌 컨트롤 옵션

| 옵션       | 설명                             |
| ---------- | -------------------------------- |
| `position` | 컨트롤 위치                      |
| `style`    | 컨트롤 스타일 (`SMALL`, `LARGE`) |

### 줌 범위 제한

```tsx
<NaverMap minZoom={6} maxZoom={18} zoomControl />
```

## 지도 타입 컨트롤

일반 지도, 위성 지도, 하이브리드 전환:

```tsx
import { NaverMap, NaverMapProvider } from "react-naver-maps-kit";

function MapTypeControlExample() {
  return (
    <NaverMapProvider ncpKeyId={import.meta.env.VITE_NCP_KEY_ID}>
      <NaverMap
        center={{ lat: 37.5665, lng: 126.978 }}
        zoom={12}
        mapTypeControl
        mapTypeControlOptions={{
          position: naver.maps.Position.TOP_RIGHT,
          mapTypeIds: [
            naver.maps.MapTypeId.NORMAL,
            naver.maps.MapTypeId.TERRAIN,
            naver.maps.MapTypeId.SATELLITE,
            naver.maps.MapTypeId.HYBRID
          ]
        }}
        style={{ width: "100%", height: "500px" }}
      />
    </NaverMapProvider>
  );
}
```

### 지도 타입

| 타입        | 설명               |
| ----------- | ------------------ |
| `NORMAL`    | 일반 지도 (기본값) |
| `TERRAIN`   | 지형도             |
| `SATELLITE` | 위성 지도          |
| `HYBRID`    | 위성 + 지도 정보   |

## 스케일 컨트롤

지도 축척 표시:

```tsx
<NaverMap
  scaleControl
  scaleControlOptions={{
    position: naver.maps.Position.BOTTOM_LEFT
  }}
/>
```

## 로고 컨트롤

네이버 로고 표시 여부:

```tsx
<NaverMap
  logoControl
  logoControlOptions={{
    position: naver.maps.Position.BOTTOM_RIGHT
  }}
/>
```

## 지도 데이터 컨트롤

지도 데이터(도로명, 건물명 등) 표시:

```tsx
<NaverMap
  mapDataControl
  mapDataControlOptions={{
    position: naver.maps.Position.BOTTOM_LEFT
  }}
/>
```

## 인터랙션 제어

사용자 입력 제어:

```tsx
import { NaverMap, NaverMapProvider } from "react-naver-maps-kit";

function InteractionControlExample() {
  return (
    <NaverMapProvider ncpKeyId={import.meta.env.VITE_NCP_KEY_ID}>
      <NaverMap
        center={{ lat: 37.5665, lng: 126.978 }}
        zoom={12}
        style={{ width: "100%", height: "500px" }}
        // 드래그
        draggable={true}
        // 스크롤 휠 줌
        scrollWheel={true}
        // 핀치 줌 (모바일)
        pinchZoom={true}
        // 키보드 단축키
        keyboardShortcuts={false}
        // 더블클릭 줌 비활성화
        disableDoubleClickZoom={true}
        // 더블탭 줌 비활성화 (모바일)
        disableDoubleTapZoom={false}
        // 관성 스크롤 비활성화
        disableKineticPan={false}
      />
    </NaverMapProvider>
  );
}
```

| Prop                     | 기본값  | 설명                 |
| ------------------------ | ------- | -------------------- |
| `draggable`              | `true`  | 드래그로 이동        |
| `scrollWheel`            | `true`  | 휠로 줌              |
| `pinchZoom`              | `true`  | 핀치로 줌            |
| `keyboardShortcuts`      | `true`  | 키보드 이동          |
| `disableDoubleClickZoom` | `false` | 더블클릭 줌 비활성화 |

## 이동 범위 제한

지도 이동을 특정 영역으로 제한:

```tsx
<NaverMap
  maxBounds={{
    south: 33.0, // 대한민국 영역
    west: 124.0,
    north: 39.0,
    east: 132.0
  }}
/>
```

## 커스텀 컨트롤 (Ref 사용)

직접 컨트롤 버튼을 만들어 지도를 제어:

```tsx
import { useRef, useState } from "react";
import { NaverMap, NaverMapProvider, type NaverMapRef } from "react-naver-maps-kit";

function CustomControls() {
  const mapRef = useRef<NaverMapRef>(null);
  const [mapType, setMapType] = useState("normal");

  const zoomIn = () => {
    const currentZoom = mapRef.current?.getZoom() ?? 12;
    mapRef.current?.setZoom(currentZoom + 1);
  };

  const zoomOut = () => {
    const currentZoom = mapRef.current?.getZoom() ?? 12;
    mapRef.current?.setZoom(currentZoom - 1);
  };

  const changeMapType = (type: string) => {
    mapRef.current?.setMapTypeId(type);
    setMapType(type);
  };

  const goToSeoul = () => {
    mapRef.current?.panTo({ lat: 37.5665, lng: 126.978 });
  };

  return (
    <div>
      <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}>
        <button onClick={zoomIn}>+</button>
        <button onClick={zoomOut}>-</button>
        <button onClick={goToSeoul}>서울로 이동</button>
        <button onClick={() => changeMapType("normal")}>일반</button>
        <button onClick={() => changeMapType("satellite")}>위성</button>
        <button onClick={() => changeMapType("terrain")}>지형</button>
      </div>

      <NaverMapProvider ncpKeyId={import.meta.env.VITE_NCP_KEY_ID}>
        <NaverMap
          ref={mapRef}
          center={{ lat: 37.5665, lng: 126.978 }}
          zoom={12}
          style={{ width: "100%", height: "400px" }}
        />
      </NaverMapProvider>

      <p>현재 지도 타입: {mapType}</p>
    </div>
  );
}
```

## 완전한 컨트롤 예제

```tsx
import { useRef, useState } from "react";
import { NaverMap, NaverMapProvider, type NaverMapRef } from "react-naver-maps-kit";

function FullControlExample() {
  const mapRef = useRef<NaverMapRef>(null);
  const [center, setCenter] = useState({ lat: 37.5665, lng: 126.978 });
  const [zoom, setZoom] = useState(12);

  return (
    <div>
      <NaverMapProvider ncpKeyId={import.meta.env.VITE_NCP_KEY_ID}>
        <NaverMap
          ref={mapRef}
          center={center}
          zoom={zoom}
          onCenterChanged={setCenter}
          onZoomChanged={setZoom}
          minZoom={6}
          maxZoom={18}
          zoomControl
          mapTypeControl
          scaleControl
          style={{ width: "100%", height: "500px" }}
        />
      </NaverMapProvider>

      <div style={{ marginTop: "1rem" }}>
        <p>
          중심 좌표: {center.lat.toFixed(4)}, {center.lng.toFixed(4)}
        </p>
        <p>줌 레벨: {zoom}</p>
      </div>
    </div>
  );
}
```

## 다음 단계

- [NaverMap API](/api/map) - 전체 Props 목록
- [Ref API](/api/map#ref-메서드) - 지도 제어 메서드
