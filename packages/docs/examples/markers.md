# 마커 표시하기

이 페이지에서는 다양한 마커 사용법을 예제와 함께 설명합니다.

## 기본 마커

가장 간단한 마커 표시 방법입니다:

```tsx
import { NaverMap, Marker, NaverMapProvider } from "react-naver-maps-kit";

function BasicMarker() {
  return (
    <NaverMapProvider ncpKeyId={import.meta.env.VITE_NCP_KEY_ID}>
      <NaverMap
        center={{ lat: 37.5665, lng: 126.978 }}
        zoom={14}
        style={{ width: "100%", height: "500px" }}
      >
        <Marker position={{ lat: 37.5665, lng: 126.978 }} title="서울시청" />
      </NaverMap>
    </NaverMapProvider>
  );
}
```

### 필수 Props

| Prop       | 타입           | 설명             |
| ---------- | -------------- | ---------------- |
| `position` | `{ lat, lng }` | 마커 위치 (필수) |

### 자주 사용하는 Props

```tsx
<Marker
  position={{ lat: 37.5665, lng: 126.978 }}
  title="툴팁 텍스트"
  clickable={true}
  draggable={true}
  visible={true}
  zIndex={100}
/>
```

## 마커 이벤트

마커 클릭, 드래그 등의 이벤트를 처리합니다:

```tsx
import { useState } from "react";
import { NaverMap, Marker, NaverMapProvider } from "react-naver-maps-kit";

function MarkerWithEvents() {
  const [selectedPosition, setSelectedPosition] = useState(null);

  return (
    <div>
      <NaverMapProvider ncpKeyId={import.meta.env.VITE_NCP_KEY_ID}>
        <NaverMap
          center={{ lat: 37.5665, lng: 126.978 }}
          zoom={14}
          style={{ width: "100%", height: "400px" }}
        >
          <Marker
            position={{ lat: 37.5665, lng: 126.978 }}
            draggable
            onClick={(e) => {
              console.log("마커 클릭!", e.coord);
              setSelectedPosition(e.coord);
            }}
            onDragEnd={(e) => {
              console.log("새 위치:", e.coord);
              setSelectedPosition(e.coord);
            }}
          />
        </NaverMap>
      </NaverMapProvider>

      {selectedPosition && (
        <p>
          선택된 위치: {selectedPosition.lat.toFixed(4)}, {selectedPosition.lng.toFixed(4)}
        </p>
      )}
    </div>
  );
}
```

### 사용 가능한 이벤트

| 이벤트                                 | 설명                  |
| -------------------------------------- | --------------------- |
| `onClick`                              | 클릭                  |
| `onDblClick`                           | 더블 클릭             |
| `onRightClick`                         | 우클릭                |
| `onMouseDown` / `onMouseUp`            | 마우스 누름/뗌        |
| `onMouseOver` / `onMouseOut`           | 마우스 오버/아웃      |
| `onDragStart` / `onDrag` / `onDragEnd` | 드래그 시작/진행/종료 |

## 커스텀 마커 (React 컴포넌트)

`children`으로 React 컴포넌트를 마커 아이콘으로 사용합니다:

```tsx
import { NaverMap, Marker, NaverMapProvider } from "react-naver-maps-kit";

function CustomMarkerExample() {
  return (
    <NaverMapProvider ncpKeyId={import.meta.env.VITE_NCP_KEY_ID}>
      <NaverMap
        center={{ lat: 37.5665, lng: 126.978 }}
        zoom={14}
        style={{ width: "100%", height: "500px" }}
      >
        {/* 커스텀 스타일 마커 */}
        <Marker position={{ lat: 37.5665, lng: 126.978 }}>
          <div
            style={{
              padding: "8px 16px",
              background: "#03C75A",
              color: "white",
              borderRadius: "20px",
              fontWeight: "bold",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
            }}
          >
            네이버
          </div>
        </Marker>

        {/* 이모지 마커 */}
        <Marker position={{ lat: 37.568, lng: 126.978 }}>
          <div style={{ fontSize: "32px" }}>📍</div>
        </Marker>

        {/* 이미지 마커 */}
        <Marker position={{ lat: 37.565, lng: 126.978 }}>
          <img src="/marker-icon.png" alt="마커" style={{ width: 40, height: 40 }} />
        </Marker>
      </NaverMap>
    </NaverMapProvider>
  );
}
```

### 앵커 포인트 설정

커스텀 마커의 중심점을 조정합니다:

```tsx
<Marker
  position={{ lat: 37.5665, lng: 126.978 }}
  icon={{
    content: `<div style="font-size: 32px">📍</div>`,
    anchor: new naver.maps.Point(16, 32) // 하단 중앙
  }}
/>
```

## 여러 마커 표시

배열 데이터로 여러 마커를 렌더링합니다:

```tsx
import { useState } from "react";
import { NaverMap, Marker, NaverMapProvider } from "react-naver-maps-kit";

const locations = [
  { id: 1, name: "서울역", lat: 37.5547, lng: 126.9707 },
  { id: 2, name: "강남역", lat: 37.4981, lng: 127.0276 },
  { id: 3, name: "잠실역", lat: 37.5133, lng: 127.1 },
  { id: 4, name: "홍대입구역", lat: 37.5572, lng: 126.9245 },
  { id: 5, name: "신촌역", lat: 37.5551, lng: 126.9368 }
];

function MultipleMarkers() {
  const [selected, setSelected] = useState(null);

  return (
    <div>
      <NaverMapProvider ncpKeyId={import.meta.env.VITE_NCP_KEY_ID}>
        <NaverMap
          center={{ lat: 37.54, lng: 126.98 }}
          zoom={12}
          style={{ width: "100%", height: "500px" }}
        >
          {locations.map((loc) => (
            <Marker
              key={loc.id}
              position={{ lat: loc.lat, lng: loc.lng }}
              title={loc.name}
              onClick={() => setSelected(loc)}
            />
          ))}
        </NaverMap>
      </NaverMapProvider>

      {selected && (
        <div className="info-panel">
          <h3>{selected.name}</h3>
          <p>위도: {selected.lat}</p>
          <p>경도: {selected.lng}</p>
        </div>
      )}
    </div>
  );
}
```

## 마커 애니메이션

마커에 애니메이션을 적용합니다:

```tsx
import { NaverMap, Marker, NaverMapProvider } from "react-naver-maps-kit";

function AnimatedMarker() {
  return (
    <NaverMapProvider ncpKeyId={import.meta.env.VITE_NCP_KEY_ID}>
      <NaverMap
        center={{ lat: 37.5665, lng: 126.978 }}
        zoom={14}
        style={{ width: "100%", height: "500px" }}
      >
        <Marker position={{ lat: 37.5665, lng: 126.978 }} animation={naver.maps.Animation.BOUNCE} />

        <Marker position={{ lat: 37.568, lng: 126.978 }} animation={naver.maps.Animation.DROP} />
      </NaverMap>
    </NaverMapProvider>
  );
}
```

### 애니메이션 타입

| 애니메이션 | 설명                |
| ---------- | ------------------- |
| `BOUNCE`   | 계속 통통 튐        |
| `DROP`     | 위에서 떨어짐 (1회) |

## Ref로 마커 제어

Ref를 통해 마커를 직접 제어합니다:

```tsx
import { useRef, useState } from "react";
import { NaverMap, Marker, NaverMapProvider, type MarkerRef } from "react-naver-maps-kit";

function MarkerWithRef() {
  const markerRef = useRef<MarkerRef>(null);
  const [position, setPosition] = useState({ lat: 37.5665, lng: 126.978 });

  const moveMarker = () => {
    const newPos = {
      lat: 37.5665 + (Math.random() - 0.5) * 0.01,
      lng: 126.978 + (Math.random() - 0.5) * 0.01
    };
    markerRef.current?.setPosition(newPos);
    setPosition(newPos);
  };

  const getMarkerInfo = () => {
    const pos = markerRef.current?.getPosition();
    console.log("현재 위치:", pos);
  };

  return (
    <div>
      <NaverMapProvider ncpKeyId={import.meta.env.VITE_NCP_KEY_ID}>
        <NaverMap center={position} zoom={14} style={{ width: "100%", height: "400px" }}>
          <Marker ref={markerRef} position={position} draggable />
        </NaverMap>
      </NaverMapProvider>

      <div style={{ marginTop: "1rem" }}>
        <button onClick={moveMarker}>랜덤 이동</button>
        <button onClick={getMarkerInfo}>위치 확인</button>
      </div>
    </div>
  );
}
```

## 대량 마커와 클러스터링

수십 개 이상의 마커는 `MarkerClusterer`를 사용하세요. 자세한 내용은 [마커 클러스터링](/examples/clustering)을 참조하세요.

```tsx
import { NaverMap, Marker, MarkerClusterer, NaverMapProvider } from "react-naver-maps-kit";

// 100개의 랜덤 마커
const markers = Array.from({ length: 100 }, (_, i) => ({
  id: i,
  lat: 37.5 + Math.random() * 0.1,
  lng: 126.9 + Math.random() * 0.1
}));

function ClusteredMarkers() {
  return (
    <NaverMapProvider ncpKeyId={import.meta.env.VITE_NCP_KEY_ID}>
      <NaverMap
        center={{ lat: 37.55, lng: 126.95 }}
        zoom={12}
        style={{ width: "100%", height: "500px" }}
      >
        <MarkerClusterer>
          {markers.map((m) => (
            <Marker key={m.id} clustererItemId={m.id} position={{ lat: m.lat, lng: m.lng }} />
          ))}
        </MarkerClusterer>
      </NaverMap>
    </NaverMapProvider>
  );
}
```

## 마커와 InfoWindow 연동

마커 클릭 시 정보 창을 표시합니다:

```tsx
import { useState } from "react";
import { NaverMap, Marker, InfoWindow, NaverMapProvider } from "react-naver-maps-kit";

const places = [
  { id: 1, name: "서울역", lat: 37.5547, lng: 126.9707, desc: "서울의 중심 역" },
  { id: 2, name: "강남역", lat: 37.4981, lng: 127.0276, desc: "유동인구 최다 역" }
];

function MarkerWithInfoWindow() {
  const [selected, setSelected] = useState(null);

  return (
    <NaverMapProvider ncpKeyId={import.meta.env.VITE_NCP_KEY_ID}>
      <NaverMap
        center={{ lat: 37.52, lng: 127.0 }}
        zoom={12}
        style={{ width: "100%", height: "500px" }}
      >
        {places.map((place) => (
          <Marker
            key={place.id}
            position={{ lat: place.lat, lng: place.lng }}
            onClick={() => setSelected(place)}
          />
        ))}

        {selected && (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            visible
            onCloseClick={() => setSelected(null)}
          >
            <div style={{ padding: "10px" }}>
              <strong>{selected.name}</strong>
              <p>{selected.desc}</p>
            </div>
          </InfoWindow>
        )}
      </NaverMap>
    </NaverMapProvider>
  );
}
```

## 다음 단계

- [정보 창 띄우기](/examples/info-window) - InfoWindow 상세 사용법
- [마커 클러스터링](/examples/clustering) - 대량 마커 처리
- [Marker API](/api/marker) - 전체 Props 목록
