# 오버레이 통합 예제

이 페이지는 `Marker`, `InfoWindow` 오버레이 조합을 다룹니다.

## 데모 렌더링

<LiveNaverMapDemo />

## 예시 코드

```tsx
import { InfoWindow, Marker, NaverMap, NaverMapProvider } from "react-naver-maps-kit";

function OverlayExample() {
  const position = { lat: 37.3595704, lng: 127.105399 };

  return (
    <NaverMapProvider ncpKeyId={import.meta.env.VITE_NCP_KEY_ID}>
      <NaverMap center={position} zoom={10} style={{ width: 480, height: 320 }} />

      <Marker position={position}>
        <span>KIT</span>
      </Marker>

      <InfoWindow position={position} visible>
        <div>Overlay API Example</div>
      </InfoWindow>
    </NaverMapProvider>
  );
}
```
