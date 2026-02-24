# Panorama 서브모듈

Panorama 서브모듈은 거리뷰(Street View)와 항공뷰(Aerial View)를 제공합니다.

## 개요

Panorama 모듈은 다음 기능을 제공합니다:

- **거리뷰**: 360도 파노라마 이미지로 거리를 탐색
- **항공뷰**: 항공에서 촬영한 파노라마 이미지
- **지도 연동**: 지도와 파노라마 간 위치 동기화
- **마커 지원**: 파노라마 내부에 Marker 컴포넌트 사용 가능

## 서브모듈 로드

`NaverMapProvider`의 `submodules` prop을 통해 로드합니다:

```tsx
import { NaverMapProvider } from "react-naver-maps-kit";

function App() {
  return (
    <NaverMapProvider ncpKeyId={import.meta.env.VITE_NCP_KEY_ID} submodules={["panorama"]}>
      {/* 앱 컴포넌트 */}
    </NaverMapProvider>
  );
}
```

## 컴포넌트

### Panorama

파노라마 뷰어 컴포넌트입니다.

```tsx
import { Panorama } from "react-naver-maps-kit";

function PanoramaView() {
  return (
    <Panorama
      defaultPosition={{ lat: 37.3595704, lng: 127.105399 }}
      defaultPov={{ pan: 0, tilt: 0, fov: 100 }}
      flightSpot={true}
      aroundControl={true}
      style={{ width: "100%", height: "500px" }}
      onInit={() => console.log("Panorama initialized")}
      onPanoChanged={() => console.log("Panorama changed")}
      onPovChanged={() => console.log("POV changed")}
    />
  );
}
```

#### 타입 정의

```ts
interface PanoramaOptionProps {
  size?: naver.maps.Size | naver.maps.SizeLiteral;
  panoId?: string;
  position?: { lat: number; lng: number } | naver.maps.LatLng;
  defaultPosition?: { lat: number; lng: number } | naver.maps.LatLng;
  pov?: { pan?: number; tilt?: number; fov?: number };
  defaultPov?: { pan?: number; tilt?: number; fov?: number };
  visible?: boolean;
  minScale?: number;
  maxScale?: number;
  minZoom?: number;
  maxZoom?: number;
  flightSpot?: boolean;
  logoControl?: boolean;
  logoControlOptions?: naver.maps.LogoControlOptions;
  zoomControl?: boolean;
  zoomControlOptions?: naver.maps.ZoomControlOptions;
  aroundControl?: boolean;
  aroundControlOptions?: naver.maps.AroundControlOptions;
}

interface PanoramaLifecycleProps {
  children?: React.ReactNode;
  onPanoramaReady?: (panorama: naver.maps.Panorama) => void;
  onPanoramaDestroy?: () => void;
  onPanoramaError?: (error: Error) => void;
}

interface PanoramaEventProps {
  onInit?: () => void;
  onPanoChanged?: () => void;
  onPanoStatus?: (status: string) => void;
  onPovChanged?: () => void;
}

type PanoramaProps = PanoramaOptionProps &
  PanoramaLifecycleProps &
  PanoramaEventProps & {
    style?: React.CSSProperties;
    className?: string;
  };

interface PanoramaRef {
  getInstance: () => naver.maps.Panorama | null;
  getElement: () => HTMLElement | undefined;
  getLocation: () => naver.maps.PanoramaLocation | undefined;
  getMaxScale: () => number | undefined;
  getMaxZoom: () => number | undefined;
  getMinScale: () => number | undefined;
  getMinZoom: () => number | undefined;
  getOptions: (key?: string) => unknown;
  getPanoId: () => string | undefined;
  getPosition: () => naver.maps.LatLng | undefined;
  getPov: () => { pan?: number; tilt?: number; fov?: number } | undefined;
  getProjection: () => naver.maps.PanoramaProjection | undefined;
  getScale: () => number | undefined;
  getSize: () => naver.maps.Size | undefined;
  getVisible: () => boolean | undefined;
  getZoom: () => number | undefined;
  setOptions: (options: naver.maps.PanoramaOptions) => void;
  setPanoId: (panoId: string) => void;
  setPanoIdWithPov: (panoId: string, pov: { pan?: number; tilt?: number; fov?: number }) => void;
  setPosition: (position: naver.maps.LatLng) => void;
  setPov: (pov: { pan?: number; tilt?: number; fov?: number }) => void;
  setScale: (scale: number) => void;
  setSize: (size: naver.maps.Size) => void;
  setVisible: (visible: boolean) => void;
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
}
```

#### Props

| Prop                   | 타입                                  | 설명                              |
| ---------------------- | ------------------------------------- | --------------------------------- |
| `position`             | `{ lat: number; lng: number }`        | 파노라마 위치 (controlled)        |
| `defaultPosition`      | `{ lat: number; lng: number }`        | 초기 파노라마 위치 (uncontrolled) |
| `panoId`               | `string`                              | 파노라마 ID                       |
| `pov`                  | `{ pan, tilt, fov }`                  | 시점 (controlled)                 |
| `defaultPov`           | `{ pan, tilt, fov }`                  | 초기 시점 (uncontrolled)          |
| `visible`              | `boolean`                             | 표시 여부                         |
| `size`                 | `naver.maps.Size`                     | 파노라마 크기                     |
| `minScale`             | `number`                              | 최소 스케일                       |
| `maxScale`             | `number`                              | 최대 스케일                       |
| `minZoom`              | `number`                              | 최소 줌 레벨                      |
| `maxZoom`              | `number`                              | 최대 줌 레벨                      |
| `flightSpot`           | `boolean`                             | 항공뷰 전환 버튼 표시             |
| `aroundControl`        | `boolean`                             | 주변 보기 컨트롤 표시             |
| `aroundControlOptions` | `naver.maps.AroundControlOptions`     | 주변 보기 컨트롤 옵션             |
| `zoomControl`          | `boolean`                             | 줌 컨트롤 표시                    |
| `zoomControlOptions`   | `naver.maps.ZoomControlOptions`       | 줌 컨트롤 옵션                    |
| `logoControl`          | `boolean`                             | 로고 컨트롤 표시                  |
| `logoControlOptions`   | `naver.maps.LogoControlOptions`       | 로고 컨트롤 옵션                  |
| `style`                | `CSSProperties`                       | 컨테이너 스타일                   |
| `className`            | `string`                              | 컨테이너 클래스명                 |
| `children`             | `ReactNode`                           | 내부 마커 등 자식 컴포넌트        |
| `onPanoramaReady`      | `(panorama) => void`                  | 인스턴스 생성 완료 콜백           |
| `onPanoramaDestroy`    | `() => void`                          | 인스턴스 정리 완료 콜백           |
| `onPanoramaError`      | `(error: Error) => void`              | 생성 실패 콜백                    |
| `onInit`               | `() => void`                          | 초기화 완료 이벤트                |
| `onPanoChanged`        | `() => void`                          | 파노라마 변경 이벤트              |
| `onPovChanged`         | `() => void`                          | 시점 변경 이벤트                  |
| `onPanoStatus`         | `(status: string) => void`            | 파노라마 상태 변경 이벤트         |

#### Controlled vs Uncontrolled

`position`과 `pov`는 controlled/uncontrolled 패턴을 지원합니다:

```tsx
// Uncontrolled: 초기값만 설정, 이후 내부 상태로 관리
<Panorama
  defaultPosition={{ lat: 37.5665, lng: 126.978 }}
  defaultPov={{ pan: 0, tilt: 0, fov: 100 }}
/>

// Controlled: React 상태와 동기화
const [position, setPosition] = useState({ lat: 37.5665, lng: 126.978 });
const [pov, setPov] = useState({ pan: 0, tilt: 0, fov: 100 });

<Panorama
  position={position}
  pov={pov}
  onPovChanged={() => {
    // pov 상태 업데이트
  }}
/>
```

#### Ref Methods

```tsx
import { useRef } from "react";
import { Panorama, type PanoramaRef } from "react-naver-maps-kit";

function PanoramaWithRef() {
  const panoramaRef = useRef<PanoramaRef>(null);

  return (
    <>
      <Panorama ref={panoramaRef} defaultPosition={{ lat: 37.5665, lng: 126.978 }} />
      <button onClick={() => {
        const pos = panoramaRef.current?.getPosition();
        console.log(pos?.lat(), pos?.lng());
      }}>
        Get Position
      </button>
    </>
  );
}
```

| 메서드             | 반환 타입                    | 설명                   |
| ------------------ | ---------------------------- | ---------------------- |
| `getInstance()`    | `naver.maps.Panorama`        | 파노라마 인스턴스      |
| `getElement()`     | `HTMLElement`                | 컨테이너 DOM 요소      |
| `getLocation()`    | `naver.maps.PanoramaLocation`| 현재 위치 정보         |
| `getPosition()`    | `naver.maps.LatLng`          | 현재 위치              |
| `setPosition()`    | `void`                       | 위치 설정              |
| `getPov()`         | `{ pan, tilt, fov }`         | 현재 시점              |
| `setPov()`         | `void`                       | 시점 설정              |
| `getPanoId()`      | `string`                     | 현재 파노라마 ID       |
| `setPanoId()`      | `void`                       | 파노라마 ID 설정       |
| `setPanoIdWithPov()`| `void`                      | ID와 시점 동시 설정    |
| `getZoom()`        | `number`                     | 현재 줌 레벨           |
| `setZoom()`        | `void`                       | 줌 레벨 설정           |
| `zoomIn()`         | `void`                       | 줌 인                  |
| `zoomOut()`        | `void`                       | 줌 아웃                |
| `getScale()`       | `number`                     | 현재 스케일            |
| `setScale()`       | `void`                       | 스케일 설정            |
| `getMinScale()`    | `number`                     | 최소 스케일            |
| `getMaxScale()`    | `number`                     | 최대 스케일            |
| `getMinZoom()`     | `number`                     | 최소 줌 레벨           |
| `getMaxZoom()`     | `number`                     | 최대 줌 레벨           |
| `getSize()`        | `naver.maps.Size`            | 파노라마 크기          |
| `setSize()`        | `void`                       | 크기 설정              |
| `getVisible()`     | `boolean`                    | 표시 여부              |
| `setVisible()`     | `void`                       | 표시 여부 설정         |
| `getOptions()`     | `unknown`                    | 옵션 조회              |
| `setOptions()`     | `void`                       | 옵션 설정              |
| `getProjection()`  | `naver.maps.PanoramaProjection` | 투영 객체           |

### FlightSpot

지도 위에 항공뷰 위치를 표시하는 컴포넌트입니다.

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

### 파노라마 내부 마커

`Panorama` 컴포넌트 내부에서 `Marker`를 사용할 수 있습니다:

```tsx
import { Panorama, Marker } from "react-naver-maps-kit";

function PanoramaWithMarkers() {
  return (
    <Panorama defaultPosition={{ lat: 37.3595704, lng: 127.105399 }}>
      <Marker position={{ lat: 37.3595704, lng: 127.105399 }}>
        <div style={{
          background: "#FF5722",
          color: "white",
          padding: "4px 10px",
          borderRadius: 16
        }}>
          네이버 본사
        </div>
      </Marker>
    </Panorama>
  );
}
```

## 활용 예제

### 지도와 파노라마 연동 (Controlled)

```tsx
import { useState } from "react";
import { NaverMap, Marker, Panorama, FlightSpot } from "react-naver-maps-kit";

function MapWithPanorama() {
  const [position, setPosition] = useState({ lat: 37.3595704, lng: 127.105399 });
  const [pov, setPov] = useState({ pan: 0, tilt: 0, fov: 100 });

  return (
    <div style={{ display: "flex", gap: "16px" }}>
      <NaverMap
        center={position}
        zoom={15}
        style={{ width: "50%", height: "400px" }}
      >
        <Marker
          position={position}
          draggable={true}
          onDragEnd={(e) => {
            setPosition({ lat: e.coord.y, lng: e.coord.x });
          }}
        />
        <FlightSpot />
      </NaverMap>
      <Panorama
        position={position}
        pov={pov}
        onPovChanged={() => {
          // POV 변경 시 필요한 로직
        }}
        style={{ width: "50%", height: "400px" }}
      />
    </div>
  );
}
```

### FlightSpot으로 항공뷰 진입

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

### POV (시점) 제어

```tsx
import { useState } from "react";
import { Panorama } from "react-naver-maps-kit";

function PanoramaControls() {
  const [pov, setPov] = useState({ pan: 0, tilt: 0, fov: 100 });

  const rotateLeft = () => {
    setPov(prev => ({ ...prev, pan: prev.pan - 45 }));
  };

  const rotateRight = () => {
    setPov(prev => ({ ...prev, pan: prev.pan + 45 }));
  };

  return (
    <div>
      <Panorama
        defaultPosition={{ lat: 37.5665, lng: 126.978 }}
        pov={pov}
        style={{ width: "100%", height: "400px" }}
      />
      <div style={{ marginTop: 8 }}>
        <button onClick={rotateLeft}>← 왼쪽 회전</button>
        <button onClick={rotateRight}>오른쪽 회전 →</button>
      </div>
    </div>
  );
}
```

## 이벤트

| 이벤트         | 설명               |
| -------------- | ------------------ |
| `init`         | 초기화 완료        |
| `pano_changed` | 파노라마 ID 변경   |
| `pov_changed`  | 시점 변경          |
| `pano_status`  | 파노라마 상태 변경 |

## 참고

- [공식 Panorama 문서](https://navermaps.github.io/maps.js.ncp/docs/tutorial-Panorama.html)
- [공식 Panorama API](https://navermaps.github.io/maps.js.ncp/docs/naver.maps.Panorama.html)
