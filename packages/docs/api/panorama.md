# Panorama

`Panorama`는 `naver.maps.Panorama`를 React 컴포넌트로 감싼 API입니다. 거리뷰(Street View)와 항공뷰(Aerial View)를 제공합니다.

::: warning 서브모듈 필요
이 컴포넌트는 `panorama` 서브모듈이 필요합니다.

```tsx
<NaverMapProvider ncpKeyId="..." submodules={["panorama"]}>
```

:::

## 기본 사용법

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
    />
  );
}
```

## 공개 타입

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
  getPosition: () => naver.maps.LatLng | undefined;
  setPosition: (position: naver.maps.LatLng) => void;
  getPov: () => { pan?: number; tilt?: number; fov?: number } | undefined;
  setPov: (pov: { pan?: number; tilt?: number; fov?: number }) => void;
  getPanoId: () => string | undefined;
  setPanoId: (panoId: string) => void;
  setPanoIdWithPov: (panoId: string, pov: { pan?: number; tilt?: number; fov?: number }) => void;
  getZoom: () => number | undefined;
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  getScale: () => number | undefined;
  setScale: (scale: number) => void;
  getMinScale: () => number | undefined;
  getMaxScale: () => number | undefined;
  getMinZoom: () => number | undefined;
  getMaxZoom: () => number | undefined;
  getSize: () => naver.maps.Size | undefined;
  setSize: (size: naver.maps.Size) => void;
  getVisible: () => boolean | undefined;
  setVisible: (visible: boolean) => void;
  getOptions: (key?: string) => unknown;
  setOptions: (options: naver.maps.PanoramaOptions) => void;
  getProjection: () => naver.maps.PanoramaProjection | undefined;
}
```

## 옵션 프로퍼티

| Prop                   | Type                           | Description                       |
| ---------------------- | ------------------------------ | --------------------------------- |
| `position`             | `{ lat: number; lng: number }` | 파노라마 위치 (controlled)        |
| `defaultPosition`      | `{ lat: number; lng: number }` | 초기 파노라마 위치 (uncontrolled) |
| `panoId`               | `string`                       | 파노라마 ID                       |
| `pov`                  | `{ pan, tilt, fov }`           | 시점 (controlled)                 |
| `defaultPov`           | `{ pan, tilt, fov }`           | 초기 시점 (uncontrolled)          |
| `visible`              | `boolean`                      | 표시 여부                         |
| `size`                 | `naver.maps.Size`              | 파노라마 크기                     |
| `minScale`             | `number`                       | 최소 스케일                       |
| `maxScale`             | `number`                       | 최대 스케일                       |
| `minZoom`              | `number`                       | 최소 줌 레벨                      |
| `maxZoom`              | `number`                       | 최대 줌 레벨                      |
| `flightSpot`           | `boolean`                      | 항공뷰 전환 버튼 표시             |
| `aroundControl`        | `boolean`                      | 주변 보기 컨트롤 표시             |
| `aroundControlOptions` | `AroundControlOptions`         | 주변 보기 컨트롤 옵션             |
| `zoomControl`          | `boolean`                      | 줌 컨트롤 표시                    |
| `zoomControlOptions`   | `ZoomControlOptions`           | 줌 컨트롤 옵션                    |
| `logoControl`          | `boolean`                      | 로고 컨트롤 표시                  |
| `logoControlOptions`   | `LogoControlOptions`           | 로고 컨트롤 옵션                  |
| `style`                | `CSSProperties`                | 컨테이너 스타일                   |
| `className`            | `string`                       | 컨테이너 클래스명                 |
| `children`             | `ReactNode`                    | 내부 마커 등 자식 컴포넌트        |

## 생명주기 프로퍼티

| Prop                | Type                     | Description             |
| ------------------- | ------------------------ | ----------------------- |
| `onPanoramaReady`   | `(panorama) => void`     | 인스턴스 생성 완료 콜백 |
| `onPanoramaDestroy` | `() => void`             | 인스턴스 정리 완료 콜백 |
| `onPanoramaError`   | `(error: Error) => void` | 생성 실패 콜백          |

## 이벤트 프로퍼티

| Prop            | Type                       | Description               |
| --------------- | -------------------------- | ------------------------- |
| `onInit`        | `() => void`               | 초기화 완료 이벤트        |
| `onPanoChanged` | `() => void`               | 파노라마 변경 이벤트      |
| `onPovChanged`  | `() => void`               | 시점 변경 이벤트          |
| `onPanoStatus`  | `(status: string) => void` | 파노라마 상태 변경 이벤트 |

## Ref 메서드

| Method               | Return Type           | Description         |
| -------------------- | --------------------- | ------------------- |
| `getInstance()`      | `naver.maps.Panorama` | 파노라마 인스턴스   |
| `getElement()`       | `HTMLElement`         | 컨테이너 DOM 요소   |
| `getLocation()`      | `PanoramaLocation`    | 현재 위치 정보      |
| `getPosition()`      | `naver.maps.LatLng`   | 현재 위치           |
| `setPosition()`      | `void`                | 위치 설정           |
| `getPov()`           | `{ pan, tilt, fov }`  | 현재 시점           |
| `setPov()`           | `void`                | 시점 설정           |
| `getPanoId()`        | `string`              | 현재 파노라마 ID    |
| `setPanoId()`        | `void`                | 파노라마 ID 설정    |
| `setPanoIdWithPov()` | `void`                | ID와 시점 동시 설정 |
| `getZoom()`          | `number`              | 현재 줌 레벨        |
| `setZoom()`          | `void`                | 줌 레벨 설정        |
| `zoomIn()`           | `void`                | 줌 인               |
| `zoomOut()`          | `void`                | 줌 아웃             |
| `getScale()`         | `number`              | 현재 스케일         |
| `setScale()`         | `void`                | 스케일 설정         |

## Controlled vs Uncontrolled

`position`과 `pov`는 controlled/uncontrolled 패턴을 지원합니다:

```tsx
// Uncontrolled: 초기값만 설정
<Panorama
  defaultPosition={{ lat: 37.5665, lng: 126.978 }}
  defaultPov={{ pan: 0, tilt: 0, fov: 100 }}
/>;

// Controlled: React 상태와 동기화
const [position, setPosition] = useState({ lat: 37.5665, lng: 126.978 });
const [pov, setPov] = useState({ pan: 0, tilt: 0, fov: 100 });

<Panorama
  position={position}
  pov={pov}
  onPovChanged={() => {
    // pov 상태 업데이트
  }}
/>;
```

## 파노라마 내부 마커

`Panorama` 컴포넌트 내부에서 `Marker`를 사용할 수 있습니다:

```tsx
import { Panorama, Marker } from "react-naver-maps-kit";

function PanoramaWithMarkers() {
  return (
    <Panorama defaultPosition={{ lat: 37.3595704, lng: 127.105399 }}>
      <Marker position={{ lat: 37.3595704, lng: 127.105399 }}>
        <div
          style={{
            background: "#FF5722",
            color: "white",
            padding: "4px 10px",
            borderRadius: 16
          }}
        >
          네이버 본사
        </div>
      </Marker>
    </Panorama>
  );
}
```

## 동작 규칙

- `panorama` 서브모듈이 로드되어야 사용 가능합니다.
- `children`으로 `Marker` 컴포넌트를 전달하면 파노라마 내부에 마커가 표시됩니다.
- 언마운트 시 파노라마 인스턴스가 자동으로 정리됩니다.
