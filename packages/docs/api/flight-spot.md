# FlightSpot

`FlightSpot`은 지도 위에 항공뷰 촬영 위치를 표시하는 컴포넌트입니다.

::: warning 서브모듈 필요
이 컴포넌트는 `panorama` 서브모듈이 필요합니다.

```tsx
<NaverMapProvider ncpKeyId="..." submodules={["panorama"]}>
```
:::

## 기본 사용법

```tsx
import { NaverMap, FlightSpot } from "react-naver-maps-kit";

function MapWithFlightSpot() {
  return (
    <NaverMap defaultCenter={{ lat: 37.5665, lng: 126.978 }} defaultZoom={15}>
      <FlightSpot
        onPoiClicked={(panoId) => {
          console.log("FlightSpot clicked:", panoId);
        }}
      />
    </NaverMap>
  );
}
```

## 공개 타입

```ts
interface FlightSpotProps {
  onPoiClicked?: (panoId: string) => void;
  onFlightSpotReady?: (layer: naver.maps.FlightSpot) => void;
}

interface FlightSpotRef {
  getInstance: () => naver.maps.FlightSpot | null;
  getMap: () => naver.maps.Map | null;
}
```

## 프로퍼티

| Prop | Type | Description |
|------|------|-------------|
| `onPoiClicked` | `(panoId: string) => void` | 항공뷰 POI 클릭 이벤트. 클릭한 위치의 파노라마 ID를 반환합니다. |
| `onFlightSpotReady` | `(layer) => void` | FlightSpot 레이어 생성 완료 콜백 |

## Ref 메서드

| Method | Return Type | Description |
|--------|-------------|-------------|
| `getInstance()` | `naver.maps.FlightSpot` | FlightSpot 인스턴스 |
| `getMap()` | `naver.maps.Map` | 연결된 지도 인스턴스 |

## 활용 예제

### FlightSpot으로 파노라마 진입

```tsx
import { useState } from "react";
import { NaverMap, FlightSpot, Panorama } from "react-naver-maps-kit";

function MapWithFlightSpot() {
  const [showPanorama, setShowPanorama] = useState(false);
  const [panoId, setPanoId] = useState<string | null>(null);

  return (
    <div style={{ display: "flex", gap: "16px" }}>
      <NaverMap
        defaultCenter={{ lat: 37.5665, lng: 126.978 }}
        defaultZoom={15}
        style={{ width: "50%", height: "400px" }}
      >
        <FlightSpot
          onPoiClicked={(id) => {
            setPanoId(id);
            setShowPanorama(true);
          }}
        />
      </NaverMap>

      {showPanorama && panoId && (
        <Panorama
          panoId={panoId}
          style={{ width: "50%", height: "400px" }}
        />
      )}
    </div>
  );
}
```

## 동작 규칙

- `NaverMap` 내부에서만 사용 가능합니다.
- `panorama` 서브모듈이 로드되어야 사용 가능합니다.
- 지도의 줌 레벨이 충분히 높아야 FlightSpot POI가 표시됩니다.
- 언마운트 시 자동으로 정리됩니다.
