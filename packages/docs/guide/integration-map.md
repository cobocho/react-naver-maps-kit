# 지도 통합 예제

이 페이지는 `NaverMapProvider`, `NaverMap`, `useNaverMap` 구성만 다룹니다.

## 데모 렌더링

<LiveNaverMapDemo />

## 예시 코드

```tsx
import { useState } from "react";
import { NaverMap, NaverMapProvider } from "react-naver-maps-kit";

function MapExample() {
  const [zoom, setZoom] = useState(10);
  const center = { lat: 37.3595704, lng: 127.105399 };

  return (
    <NaverMapProvider ncpKeyId={import.meta.env.VITE_NCP_KEY_ID}>
      <NaverMap
        center={center}
        zoom={zoom}
        mapTypeControl
        zoomControl
        style={{ width: 480, height: 320 }}
      />
      <input
        type="range"
        min={1}
        max={21}
        value={zoom}
        onChange={(event) => setZoom(Number(event.target.value))}
      />
    </NaverMapProvider>
  );
}
```
