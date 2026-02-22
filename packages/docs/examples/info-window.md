# 정보 창 띄우기

`InfoWindow` 컴포넌트로 지도 위에 정보 팝업을 표시하는 방법을 설명합니다.

## 기본 InfoWindow

```tsx
import { NaverMap, InfoWindow, NaverMapProvider } from "react-naver-maps-kit";

function BasicInfoWindow() {
  return (
    <NaverMapProvider ncpKeyId={import.meta.env.VITE_NCP_KEY_ID}>
      <NaverMap
        center={{ lat: 37.5665, lng: 126.978 }}
        zoom={14}
        style={{ width: "100%", height: "500px" }}
      >
        <InfoWindow position={{ lat: 37.5665, lng: 126.978 }} visible>
          <div style={{ padding: "10px" }}>
            <strong>서울시청</strong>
            <p>서울특별시 중구 세종대로 110</p>
          </div>
        </InfoWindow>
      </NaverMap>
    </NaverMapProvider>
  );
}
```

## 마커와 연동하기

마커 클릭 시 InfoWindow를 표시하는 일반적인 패턴입니다:

```tsx
import { useState } from "react";
import { NaverMap, Marker, InfoWindow, NaverMapProvider } from "react-naver-maps-kit";

const places = [
  { id: 1, name: "서울역", lat: 37.5547, lng: 126.9707 },
  { id: 2, name: "강남역", lat: 37.4981, lng: 127.0276 },
  { id: 3, name: "잠실역", lat: 37.5133, lng: 127.1 }
];

function MarkerWithPopup() {
  const [selectedId, setSelectedId] = useState(null);
  const selectedPlace = places.find((p) => p.id === selectedId);

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
            onClick={() => setSelectedId(place.id)}
          />
        ))}

        {selectedPlace && (
          <InfoWindow
            position={{ lat: selectedPlace.lat, lng: selectedPlace.lng }}
            visible
            onCloseClick={() => setSelectedId(null)}
          >
            <div style={{ padding: "12px", minWidth: "150px" }}>
              <strong style={{ fontSize: "16px" }}>{selectedPlace.name}</strong>
              <button onClick={() => setSelectedId(null)} style={{ float: "right" }}>
                ✕
              </button>
            </div>
          </InfoWindow>
        )}
      </NaverMap>
    </NaverMapProvider>
  );
}
```

## 커스텀 스타일 InfoWindow

배경색, 테두리, 크기 등을 커스터마이즈합니다:

```tsx
<InfoWindow
  position={{ lat: 37.5665, lng: 126.978 }}
  visible
  backgroundColor="#ffffff"
  borderColor="#03C75A"
  borderWidth={2}
  maxWidth={300}
  disableAutoPan={false}
>
  <div style={{ padding: "16px" }}>
    <h3 style={{ margin: "0 0 8px", color: "#03C75A" }}>커스텀 InfoWindow</h3>
    <p style={{ margin: 0 }}>배경색, 테두리, 최대 너비 등을 조절할 수 있습니다.</p>
  </div>
</InfoWindow>
```

### 스타일 Props

| Prop              | 설명        | 기본값        |
| ----------------- | ----------- | ------------- |
| `backgroundColor` | 배경색      | 흰색          |
| `borderColor`     | 테두리 색상 | 회색          |
| `borderWidth`     | 테두리 두께 | 1             |
| `maxWidth`        | 최대 너비   | 무제한        |
| `disableAnchor`   | 꼬리 숨기기 | false         |
| `anchorColor`     | 꼬리 색상   | 배경색과 동일 |

## 앵커 마커 사용

`anchor` prop으로 특정 마커에 InfoWindow를 고정합니다:

```tsx
import { useRef, useState } from "react";
import {
  NaverMap,
  Marker,
  InfoWindow,
  NaverMapProvider,
  type MarkerRef
} from "react-naver-maps-kit";

function InfoWindowWithAnchor() {
  const markerRef = useRef<MarkerRef>(null);
  const [showInfo, setShowInfo] = useState(false);

  return (
    <NaverMapProvider ncpKeyId={import.meta.env.VITE_NCP_KEY_ID}>
      <NaverMap
        center={{ lat: 37.5665, lng: 126.978 }}
        zoom={14}
        style={{ width: "100%", height: "500px" }}
      >
        <Marker
          ref={markerRef}
          position={{ lat: 37.5665, lng: 126.978 }}
          onClick={() => setShowInfo(!showInfo)}
        />

        <InfoWindow
          anchor={markerRef.current?.getInstance()}
          visible={showInfo}
          pixelOffset={{ x: 0, y: -40 }} // 마커 위로 오프셋
        >
          <div style={{ padding: "12px" }}>마커에 고정된 InfoWindow</div>
        </InfoWindow>
      </NaverMap>
    </NaverMapProvider>
  );
}
```

## 자동 패닝 제어

InfoWindow가 열릴 때 지도가 자동으로 이동하는 것을 제어합니다:

```tsx
<InfoWindow
  position={{ lat: 37.5665, lng: 126.978 }}
  visible
  disableAutoPan={true} // 자동 패닝 비활성화
  autoPanPadding={{ x: 50, y: 50 }} // 패닝 여백
>
  <div>자동 패닝이 비활성화된 InfoWindow</div>
</InfoWindow>
```

## 이벤트 처리

InfoWindow 열림/닫힘 이벤트를 처리합니다:

```tsx
import { useState } from "react";
import { NaverMap, InfoWindow, NaverMapProvider } from "react-naver-maps-kit";

function InfoWindowEvents() {
  const [visible, setVisible] = useState(true);

  return (
    <div>
      <NaverMapProvider ncpKeyId={import.meta.env.VITE_NCP_KEY_ID}>
        <NaverMap
          center={{ lat: 37.5665, lng: 126.978 }}
          zoom={14}
          style={{ width: "100%", height: "400px" }}
        >
          <InfoWindow
            position={{ lat: 37.5665, lng: 126.978 }}
            visible={visible}
            onOpen={() => console.log("InfoWindow 열림")}
            onClose={() => console.log("InfoWindow 닫힘")}
          >
            <div style={{ padding: "10px" }}>
              <button onClick={() => setVisible(false)}>닫기</button>
            </div>
          </InfoWindow>
        </NaverMap>
      </NaverMapProvider>

      {!visible && <button onClick={() => setVisible(true)}>InfoWindow 열기</button>}
    </div>
  );
}
```

## Ref로 제어하기

Ref를 통해 InfoWindow를 직접 제어합니다:

```tsx
import { useRef } from "react";
import { NaverMap, InfoWindow, NaverMapProvider, type InfoWindowRef } from "react-naver-maps-kit";

function InfoWindowWithRef() {
  const infoRef = useRef<InfoWindowRef>(null);

  const updateContent = () => {
    infoRef.current?.setContent("새로운 내용으로 변경!");
  };

  const closeWindow = () => {
    infoRef.current?.close();
  };

  return (
    <div>
      <NaverMapProvider ncpKeyId={import.meta.env.VITE_NCP_KEY_ID}>
        <NaverMap
          center={{ lat: 37.5665, lng: 126.978 }}
          zoom={14}
          style={{ width: "100%", height: "400px" }}
        >
          <InfoWindow ref={infoRef} position={{ lat: 37.5665, lng: 126.978 }} visible>
            <div style={{ padding: "10px" }}>초기 내용</div>
          </InfoWindow>
        </NaverMap>
      </NaverMapProvider>

      <div style={{ marginTop: "1rem" }}>
        <button onClick={updateContent}>내용 변경</button>
        <button onClick={closeWindow}>닫기</button>
      </div>
    </div>
  );
}
```

## 꿀팁

### 1. 여러 InfoWindow 관리

한 번에 하나의 InfoWindow만 표시하려면:

```tsx
function SingleInfoWindow() {
  const [openId, setOpenId] = useState(null);

  return (
    <>
      {markers.map((m) => (
        <Marker
          key={m.id}
          position={m.position}
          onClick={() => setOpenId(m.id)} // 다른 InfoWindow는 자동으로 닫힘
        />
      ))}

      {openId && (
        <InfoWindow position={getMarkerPosition(openId)} visible>
          {/* 내용 */}
        </InfoWindow>
      )}
    </>
  );
}
```

### 2. React Portal 없이 순수 HTML 사용

`content` prop으로 HTML 문자열을 직접 전달할 수도 있습니다:

```tsx
<InfoWindow
  position={{ lat: 37.5665, lng: 126.978 }}
  content="<div style='padding:10px'><strong>HTML 내용</strong></div>"
  visible
/>
```

### 3. 성능 최적화

InfoWindow 내용이 복잡하면 메모이제이션을 사용하세요:

```tsx
const infoContent = useMemo(
  () => (
    <div>
      <h3>{place.name}</h3>
      <p>{place.description}</p>
    </div>
  ),
  [place]
);

<InfoWindow visible>{infoContent}</InfoWindow>;
```

## 다음 단계

- [도형 그리기](/examples/shapes) - Circle, Polygon 사용법
- [InfoWindow API](/api/info-window) - 전체 Props 목록
