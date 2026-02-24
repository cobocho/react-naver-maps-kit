# NaverMap

`NaverMap`은 `naver.maps.Map`을 React 컴포넌트로 감싼 API입니다.

## 공개 타입

```ts
interface NaverMapOptionProps {
  background?: string;
  baseTileOpacity?: number;
  bounds?: naver.maps.Bounds | naver.maps.BoundsLiteral;
  center?: naver.maps.Coord | naver.maps.CoordLiteral;
  defaultCenter?: naver.maps.Coord | naver.maps.CoordLiteral;
  zoom?: number;
  defaultZoom?: number;
  disableDoubleClickZoom?: boolean;
  disableDoubleTapZoom?: boolean;
  disableKineticPan?: boolean;
  disableTwoFingerTapZoom?: boolean;
  draggable?: boolean;
  keyboardShortcuts?: boolean;
  logoControl?: boolean;
  logoControlOptions?: naver.maps.LogoControlOptions;
  mapDataControl?: boolean;
  mapDataControlOptions?: naver.maps.MapDataControlOptions;
  mapTypeControl?: boolean;
  mapTypeControlOptions?: naver.maps.MapTypeControlOptions;
  mapTypeId?: naver.maps.MapTypeIdLiteral;
  mapTypes?: naver.maps.MapTypeRegistry;
  maxBounds?: naver.maps.Bounds | naver.maps.BoundsLiteral;
  maxZoom?: number;
  minZoom?: number;
  padding?: naver.maps.padding;
  pinchZoom?: boolean;
  resizeOrigin?: naver.maps.Position;
  scaleControl?: boolean;
  scaleControlOptions?: naver.maps.ScaleControlOptions;
  scrollWheel?: boolean;
  size?: naver.maps.Size | naver.maps.SizeLiteral;
  overlayZoomEffect?: null | string;
  tileSpare?: number;
  tileTransition?: boolean;
  tileDuration?: number;
  zoomControl?: boolean;
  zoomControlOptions?: naver.maps.ZoomControlOptions;
  zoomOrigin?: naver.maps.Coord | naver.maps.CoordLiteral;
  blankTileImage?: null | string;
  gl?: boolean;
  customStyleId?: string;
}

interface NaverMapLifecycleProps {
  children?: React.ReactNode;
  onMapReady?: (map: naver.maps.Map) => void;
  onMapDestroy?: () => void;
  onMapError?: (error: Error) => void;
  retryOnError?: boolean;
  retryDelayMs?: number;
  fallback?: React.ReactNode;
}

interface NaverMapEventProps {
  onAddLayer?: (layer: naver.maps.Layer) => void;
  onBoundsChanged?: (bounds: naver.maps.Bounds) => void;
  onCenterChanged?: (center: naver.maps.Coord) => void;
  onCenterPointChanged?: (centerPoint: naver.maps.Point) => void;
  onClick?: (pointerEvent: naver.maps.PointerEvent) => void;
  onDblClick?: (pointerEvent: naver.maps.PointerEvent) => void;
  onDoubleTap?: (pointerEvent: naver.maps.PointerEvent) => void;
  onDrag?: (pointerEvent: naver.maps.PointerEvent) => void;
  onDragEnd?: (pointerEvent: naver.maps.PointerEvent) => void;
  onDragStart?: (pointerEvent: naver.maps.PointerEvent) => void;
  onIdle?: () => void;
  onInit?: () => void;
  onKeyDown?: (keyboardEvent: KeyboardEvent) => void;
  onKeyUp?: (keyboardEvent: KeyboardEvent) => void;
  onLongTap?: (pointerEvent: naver.maps.PointerEvent) => void;
  onMapTypeChanged?: (mapType: naver.maps.MapType) => void;
  onMapTypeIdChanged?: (mapTypeId: string) => void;
  onMouseDown?: (pointerEvent: naver.maps.PointerEvent) => void;
  onMouseMove?: (pointerEvent: naver.maps.PointerEvent) => void;
  onMouseOut?: (pointerEvent: naver.maps.PointerEvent) => void;
  onMouseOver?: (pointerEvent: naver.maps.PointerEvent) => void;
  onMouseUp?: (pointerEvent: naver.maps.PointerEvent) => void;
  onPanning?: () => void;
  onPinch?: (pointerEvent: naver.maps.PointerEvent) => void;
  onPinchEnd?: (pointerEvent: naver.maps.PointerEvent) => void;
  onPinchStart?: (pointerEvent: naver.maps.PointerEvent) => void;
  onProjectionChanged?: (projection: naver.maps.Projection) => void;
  onRemoveLayer?: (layerName: string) => void;
  onResize?: () => void;
  onRightClick?: (pointerEvent: naver.maps.PointerEvent) => void;
  onSingleTap?: (pointerEvent: naver.maps.PointerEvent) => void;
  onTouchEnd?: (pointerEvent: naver.maps.PointerEvent) => void;
  onTouchMove?: (pointerEvent: naver.maps.PointerEvent) => void;
  onTouchStart?: (pointerEvent: naver.maps.PointerEvent) => void;
  onTwoFingerTap?: (pointerEvent: naver.maps.PointerEvent) => void;
  onWheel?: (pointerEvent: naver.maps.PointerEvent) => void;
  onZoomChanged?: (zoom: number) => void;
  onZooming?: () => void;
  onZoomStart?: () => void;
}

type NaverMapDivProps = Omit<React.ComponentPropsWithoutRef<"div">, "children" | "draggable">;

export type NaverMapProps = NaverMapOptionProps &
  NaverMapLifecycleProps &
  NaverMapEventProps &
  NaverMapDivProps;

export interface NaverMapRef {
  getInstance: () => naver.maps.Map | null;
  addOverlayPane: (name: string, elementOrZIndex: HTMLElement | number) => void;
  addPane: (
    ...args: Parameters<naver.maps.Map["addPane"]>
  ) => ReturnType<naver.maps.Map["addPane"]> | undefined;
  autoResize: (
    ...args: Parameters<naver.maps.Map["autoResize"]>
  ) => ReturnType<naver.maps.Map["autoResize"]> | undefined;
  destroy: (
    ...args: Parameters<naver.maps.Map["destroy"]>
  ) => ReturnType<naver.maps.Map["destroy"]> | undefined;
  fitBounds: (
    ...args: Parameters<naver.maps.Map["fitBounds"]>
  ) => ReturnType<naver.maps.Map["fitBounds"]> | undefined;
  getBounds: (
    ...args: Parameters<naver.maps.Map["getBounds"]>
  ) => ReturnType<naver.maps.Map["getBounds"]> | undefined;
  getCenter: (
    ...args: Parameters<naver.maps.Map["getCenter"]>
  ) => ReturnType<naver.maps.Map["getCenter"]> | undefined;
  getCenterPoint: (
    ...args: Parameters<naver.maps.Map["getCenterPoint"]>
  ) => ReturnType<naver.maps.Map["getCenterPoint"]> | undefined;
  getElement: (
    ...args: Parameters<naver.maps.Map["getElement"]>
  ) => ReturnType<naver.maps.Map["getElement"]> | undefined;
  getMapTypeId: (
    ...args: Parameters<naver.maps.Map["getMapTypeId"]>
  ) => ReturnType<naver.maps.Map["getMapTypeId"]> | undefined;
  getMaxZoom: (
    ...args: Parameters<naver.maps.Map["getMaxZoom"]>
  ) => ReturnType<naver.maps.Map["getMaxZoom"]> | undefined;
  getMinZoom: (
    ...args: Parameters<naver.maps.Map["getMinZoom"]>
  ) => ReturnType<naver.maps.Map["getMinZoom"]> | undefined;
  getOptions: (
    ...args: Parameters<naver.maps.Map["getOptions"]>
  ) => ReturnType<naver.maps.Map["getOptions"]> | undefined;
  getPanes: (
    ...args: Parameters<naver.maps.Map["getPanes"]>
  ) => ReturnType<naver.maps.Map["getPanes"]> | undefined;
  getPrimitiveProjection: (
    ...args: Parameters<naver.maps.Map["getPrimitiveProjection"]>
  ) => ReturnType<naver.maps.Map["getPrimitiveProjection"]> | undefined;
  getProjection: (
    ...args: Parameters<naver.maps.Map["getProjection"]>
  ) => ReturnType<naver.maps.Map["getProjection"]> | undefined;
  getSize: (
    ...args: Parameters<naver.maps.Map["getSize"]>
  ) => ReturnType<naver.maps.Map["getSize"]> | undefined;
  getZoom: (
    ...args: Parameters<naver.maps.Map["getZoom"]>
  ) => ReturnType<naver.maps.Map["getZoom"]> | undefined;
  morph: (
    ...args: Parameters<naver.maps.Map["morph"]>
  ) => ReturnType<naver.maps.Map["morph"]> | undefined;
  panBy: (
    ...args: Parameters<naver.maps.Map["panBy"]>
  ) => ReturnType<naver.maps.Map["panBy"]> | undefined;
  panTo: (
    ...args: Parameters<naver.maps.Map["panTo"]>
  ) => ReturnType<naver.maps.Map["panTo"]> | undefined;
  panToBounds: (
    ...args: Parameters<naver.maps.Map["panToBounds"]>
  ) => ReturnType<naver.maps.Map["panToBounds"]> | undefined;
  refresh: (
    ...args: Parameters<naver.maps.Map["refresh"]>
  ) => ReturnType<naver.maps.Map["refresh"]> | undefined;
  removeOverlayPane: (name: string) => void;
  removePane: (
    ...args: Parameters<naver.maps.Map["removePane"]>
  ) => ReturnType<naver.maps.Map["removePane"]> | undefined;
  setCenter: (
    ...args: Parameters<naver.maps.Map["setCenter"]>
  ) => ReturnType<naver.maps.Map["setCenter"]> | undefined;
  setCenterPoint: (
    ...args: Parameters<naver.maps.Map["setCenterPoint"]>
  ) => ReturnType<naver.maps.Map["setCenterPoint"]> | undefined;
  setMapTypeId: (
    ...args: Parameters<naver.maps.Map["setMapTypeId"]>
  ) => ReturnType<naver.maps.Map["setMapTypeId"]> | undefined;
  setOptions: (
    ...args: Parameters<naver.maps.Map["setOptions"]>
  ) => ReturnType<naver.maps.Map["setOptions"]> | undefined;
  setSize: (
    ...args: Parameters<naver.maps.Map["setSize"]>
  ) => ReturnType<naver.maps.Map["setSize"]> | undefined;
  setZoom: (
    ...args: Parameters<naver.maps.Map["setZoom"]>
  ) => ReturnType<naver.maps.Map["setZoom"]> | undefined;
  stop: (
    ...args: Parameters<naver.maps.Map["stop"]>
  ) => ReturnType<naver.maps.Map["stop"]> | undefined;
  updateBy: (
    ...args: Parameters<naver.maps.Map["updateBy"]>
  ) => ReturnType<naver.maps.Map["updateBy"]> | undefined;
  zoomBy: (
    ...args: Parameters<naver.maps.Map["zoomBy"]>
  ) => ReturnType<naver.maps.Map["zoomBy"]> | undefined;
}
```

## 지도 옵션 프로퍼티

| Prop                      | Type                                            | Description                    |
| ------------------------- | ----------------------------------------------- | ------------------------------ |
| `background`              | `string`                                        | 지도 배경 색상/이미지 URL      |
| `baseTileOpacity`         | `number`                                        | 기본 타일 레이어 불투명도(0~1) |
| `bounds`                  | `naver.maps.Bounds \| naver.maps.BoundsLiteral` | 초기 표시 경계                 |
| `center`                  | `naver.maps.Coord \| naver.maps.CoordLiteral`   | 지도 중심 좌표 (controlled)    |
| `defaultCenter`           | `naver.maps.Coord \| naver.maps.CoordLiteral`   | 초기 중심 좌표 (uncontrolled)  |
| `zoom`                    | `number`                                        | 지도 줌 레벨 (controlled)      |
| `defaultZoom`             | `number`                                        | 초기 줌 레벨 (uncontrolled)    |
| `disableDoubleClickZoom`  | `boolean`                                       | 더블클릭 확대 비활성화         |
| `disableDoubleTapZoom`    | `boolean`                                       | 더블탭 확대 비활성화           |
| `disableKineticPan`       | `boolean`                                       | 관성 스크롤 비활성화           |
| `disableTwoFingerTapZoom` | `boolean`                                       | 두 손가락 탭 확대 비활성화     |
| `draggable`               | `boolean`                                       | 지도 드래그 가능 여부          |
| `keyboardShortcuts`       | `boolean`                                       | 키보드 단축키 허용 여부        |
| `logoControl`             | `boolean`                                       | 로고 컨트롤 노출 여부          |
| `logoControlOptions`      | `naver.maps.LogoControlOptions`                 | 로고 컨트롤 세부 옵션          |
| `mapDataControl`          | `boolean`                                       | 지도 데이터 컨트롤 노출 여부   |
| `mapDataControlOptions`   | `naver.maps.MapDataControlOptions`              | 지도 데이터 컨트롤 세부 옵션   |
| `mapTypeControl`          | `boolean`                                       | 지도 타입 컨트롤 노출 여부     |
| `mapTypeControlOptions`   | `naver.maps.MapTypeControlOptions`              | 지도 타입 컨트롤 세부 옵션     |
| `mapTypeId`               | `naver.maps.MapTypeIdLiteral`                   | 지도 타입 ID                   |
| `mapTypes`                | `naver.maps.MapTypeRegistry`                    | 사용 가능한 지도 타입 집합     |
| `maxBounds`               | `naver.maps.Bounds \| naver.maps.BoundsLiteral` | 이동 가능한 최대 경계          |
| `maxZoom`                 | `number`                                        | 허용 최대 줌                   |
| `minZoom`                 | `number`                                        | 허용 최소 줌                   |
| `padding`                 | `naver.maps.padding`                            | 뷰포트 내부 여백               |
| `pinchZoom`               | `boolean`                                       | 핀치 줌 허용 여부              |
| `resizeOrigin`            | `naver.maps.Position`                           | 리사이즈 기준점                |
| `scaleControl`            | `boolean`                                       | 축척 컨트롤 노출 여부          |
| `scaleControlOptions`     | `naver.maps.ScaleControlOptions`                | 축척 컨트롤 세부 옵션          |
| `scrollWheel`             | `boolean`                                       | 마우스 휠 줌 허용 여부         |
| `size`                    | `naver.maps.Size \| naver.maps.SizeLiteral`     | 지도 크기 지정                 |
| `overlayZoomEffect`       | `null \| string`                                | 오버레이 줌 효과 타입          |
| `tileSpare`               | `number`                                        | 타일 렌더 여유 영역            |
| `tileTransition`          | `boolean`                                       | 타일 전환 애니메이션 사용 여부 |
| `tileDuration`            | `number`                                        | 타일 전환 애니메이션 시간      |
| `zoomControl`             | `boolean`                                       | 줌 컨트롤 노출 여부            |
| `zoomControlOptions`      | `naver.maps.ZoomControlOptions`                 | 줌 컨트롤 세부 옵션            |
| `zoomOrigin`              | `naver.maps.Coord \| naver.maps.CoordLiteral`   | 줌 동작 기준 좌표              |
| `blankTileImage`          | `null \| string`                                | 타일 공백 이미지 URL           |
| `gl`                      | `boolean`                                       | GL 서브모듈 벡터맵 활성화 여부 |
| `customStyleId`           | `string`                                        | Style Editor 발행 스타일 ID    |

## 생명주기 및 오류 처리 프로퍼티

| Prop           | Type                            | Description                     |
| -------------- | ------------------------------- | ------------------------------- |
| `children`     | `React.ReactNode`               | 지도 내부에 렌더링할 자식 요소  |
| `onMapReady`   | `(map: naver.maps.Map) => void` | 지도 인스턴스 생성 완료 콜백    |
| `onMapDestroy` | `() => void`                    | 지도 인스턴스 정리 완료 콜백    |
| `onMapError`   | `(error: Error) => void`        | 생성/업데이트 실패 콜백         |
| `retryOnError` | `boolean`                       | 에러 시 SDK 재시도 여부         |
| `retryDelayMs` | `number`                        | 재시도 지연(ms)                 |
| `fallback`     | `React.ReactNode`               | SDK 로딩/에러 시 표시할 대체 UI |

## 지도 이벤트 프로퍼티

| Prop                   | Type                                              | Description                |
| ---------------------- | ------------------------------------------------- | -------------------------- |
| `onAddLayer`           | `(layer: naver.maps.Layer) => void`               | 레이어 추가 이벤트         |
| `onBoundsChanged`      | `(bounds: naver.maps.Bounds) => void`             | 좌표 경계 변경 이벤트      |
| `onCenterChanged`      | `(center: naver.maps.Coord) => void`              | 중심 좌표 변경 이벤트      |
| `onCenterPointChanged` | `(centerPoint: naver.maps.Point) => void`         | 중심 세계 좌표 변경 이벤트 |
| `onClick`              | `(pointerEvent: naver.maps.PointerEvent) => void` | 지도 클릭 이벤트           |
| `onDblClick`           | `(pointerEvent: naver.maps.PointerEvent) => void` | 지도 더블 클릭 이벤트      |
| `onDoubleTap`          | `(pointerEvent: naver.maps.PointerEvent) => void` | 더블 탭 이벤트             |
| `onDrag`               | `(pointerEvent: naver.maps.PointerEvent) => void` | 드래그 이벤트              |
| `onDragEnd`            | `(pointerEvent: naver.maps.PointerEvent) => void` | 드래그 종료 이벤트         |
| `onDragStart`          | `(pointerEvent: naver.maps.PointerEvent) => void` | 드래그 시작 이벤트         |
| `onIdle`               | `() => void`                                      | 지도 유휴 상태 이벤트      |
| `onInit`               | `() => void`                                      | 지도 초기화 이벤트         |
| `onKeyDown`            | `(keyboardEvent: KeyboardEvent) => void`          | 키 다운 이벤트             |
| `onKeyUp`              | `(keyboardEvent: KeyboardEvent) => void`          | 키 업 이벤트               |
| `onLongTap`            | `(pointerEvent: naver.maps.PointerEvent) => void` | 롱탭 이벤트                |
| `onMapTypeChanged`     | `(mapType: naver.maps.MapType) => void`           | 지도 타입 객체 변경 이벤트 |
| `onMapTypeIdChanged`   | `(mapTypeId: string) => void`                     | 지도 타입 ID 변경 이벤트   |
| `onMouseDown`          | `(pointerEvent: naver.maps.PointerEvent) => void` | 마우스 다운 이벤트         |
| `onMouseMove`          | `(pointerEvent: naver.maps.PointerEvent) => void` | 마우스 이동 이벤트         |
| `onMouseOut`           | `(pointerEvent: naver.maps.PointerEvent) => void` | 마우스 아웃 이벤트         |
| `onMouseOver`          | `(pointerEvent: naver.maps.PointerEvent) => void` | 마우스 오버 이벤트         |
| `onMouseUp`            | `(pointerEvent: naver.maps.PointerEvent) => void` | 마우스 업 이벤트           |
| `onPanning`            | `() => void`                                      | 패닝 시작 이벤트           |
| `onPinch`              | `(pointerEvent: naver.maps.PointerEvent) => void` | 핀치 이벤트                |
| `onPinchEnd`           | `(pointerEvent: naver.maps.PointerEvent) => void` | 핀치 종료 이벤트           |
| `onPinchStart`         | `(pointerEvent: naver.maps.PointerEvent) => void` | 핀치 시작 이벤트           |
| `onProjectionChanged`  | `(projection: naver.maps.Projection) => void`     | 지도 투영 변경 이벤트      |
| `onRemoveLayer`        | `(layerName: string) => void`                     | 레이어 제거 이벤트         |
| `onResize`             | `() => void`                                      | 지도 리사이즈 이벤트       |
| `onRightClick`         | `(pointerEvent: naver.maps.PointerEvent) => void` | 우클릭 이벤트              |
| `onSingleTap`          | `(pointerEvent: naver.maps.PointerEvent) => void` | 싱글 탭 이벤트             |
| `onTouchEnd`           | `(pointerEvent: naver.maps.PointerEvent) => void` | 터치 종료 이벤트           |
| `onTouchMove`          | `(pointerEvent: naver.maps.PointerEvent) => void` | 터치 이동 이벤트           |
| `onTouchStart`         | `(pointerEvent: naver.maps.PointerEvent) => void` | 터치 시작 이벤트           |
| `onTwoFingerTap`       | `(pointerEvent: naver.maps.PointerEvent) => void` | 두 손가락 탭 이벤트        |
| `onWheel`              | `(pointerEvent: naver.maps.PointerEvent) => void` | 휠 이벤트                  |
| `onZoomChanged`        | `(zoom: number) => void`                          | 줌 레벨 변경 이벤트        |
| `onZooming`            | `() => void`                                      | 줌 애니메이션 진행 이벤트  |
| `onZoomStart`          | `() => void`                                      | 줌 애니메이션 시작 이벤트  |

## Ref 메서드

```tsx
import { useRef } from "react";
import { NaverMap, type NaverMapRef } from "react-naver-maps-kit";

function RefExample() {
  const mapRef = useRef<NaverMapRef>(null);

  return (
    <>
      <button onClick={() => mapRef.current?.panTo({ lat: 37.5666, lng: 126.9784 })}>
        서울시청으로 이동
      </button>
      <NaverMap ref={mapRef} zoom={10} style={{ width: 480, height: 320 }} />
    </>
  );
}
```

### Ref 메서드 상세

| Method                   | Signature                                                                                                                              | Description                             |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| `getInstance`            | `() => naver.maps.Map \| null`                                                                                                         | 내부 지도 인스턴스를 반환합니다.        |
| `addOverlayPane`         | `(name: string, elementOrZIndex: HTMLElement \| number) => void`                                                                       | 오버레이 pane을 추가합니다.             |
| `addPane`                | `(...args: Parameters<naver.maps.Map["addPane"]>) => ReturnType<naver.maps.Map["addPane"]> \| undefined`                               | 사용자 정의 pane을 추가합니다.          |
| `removeOverlayPane`      | `(name: string) => void`                                                                                                               | 오버레이 pane을 제거합니다.             |
| `removePane`             | `(...args: Parameters<naver.maps.Map["removePane"]>) => ReturnType<naver.maps.Map["removePane"]> \| undefined`                         | 사용자 정의 pane을 제거합니다.          |
| `autoResize`             | `(...args: Parameters<naver.maps.Map["autoResize"]>) => ReturnType<naver.maps.Map["autoResize"]> \| undefined`                         | 지도 크기를 자동 재조정합니다.          |
| `destroy`                | `(...args: Parameters<naver.maps.Map["destroy"]>) => ReturnType<naver.maps.Map["destroy"]> \| undefined`                               | 지도 인스턴스를 정리합니다.             |
| `refresh`                | `(...args: Parameters<naver.maps.Map["refresh"]>) => ReturnType<naver.maps.Map["refresh"]> \| undefined`                               | 타일/렌더 상태를 새로 고칩니다.         |
| `stop`                   | `(...args: Parameters<naver.maps.Map["stop"]>) => ReturnType<naver.maps.Map["stop"]> \| undefined`                                     | 진행 중인 지도 애니메이션을 중지합니다. |
| `getBounds`              | `(...args: Parameters<naver.maps.Map["getBounds"]>) => ReturnType<naver.maps.Map["getBounds"]> \| undefined`                           | 현재 지도 경계를 반환합니다.            |
| `getCenter`              | `(...args: Parameters<naver.maps.Map["getCenter"]>) => ReturnType<naver.maps.Map["getCenter"]> \| undefined`                           | 현재 중심 좌표를 반환합니다.            |
| `getCenterPoint`         | `(...args: Parameters<naver.maps.Map["getCenterPoint"]>) => ReturnType<naver.maps.Map["getCenterPoint"]> \| undefined`                 | 현재 중심 세계 좌표를 반환합니다.       |
| `getElement`             | `(...args: Parameters<naver.maps.Map["getElement"]>) => ReturnType<naver.maps.Map["getElement"]> \| undefined`                         | 지도 컨테이너 DOM 요소를 반환합니다.    |
| `getMapTypeId`           | `(...args: Parameters<naver.maps.Map["getMapTypeId"]>) => ReturnType<naver.maps.Map["getMapTypeId"]> \| undefined`                     | 현재 지도 타입 ID를 반환합니다.         |
| `getMaxZoom`             | `(...args: Parameters<naver.maps.Map["getMaxZoom"]>) => ReturnType<naver.maps.Map["getMaxZoom"]> \| undefined`                         | 최대 줌 레벨을 반환합니다.              |
| `getMinZoom`             | `(...args: Parameters<naver.maps.Map["getMinZoom"]>) => ReturnType<naver.maps.Map["getMinZoom"]> \| undefined`                         | 최소 줌 레벨을 반환합니다.              |
| `getOptions`             | `(...args: Parameters<naver.maps.Map["getOptions"]>) => ReturnType<naver.maps.Map["getOptions"]> \| undefined`                         | 지도 옵션을 조회합니다.                 |
| `getPanes`               | `(...args: Parameters<naver.maps.Map["getPanes"]>) => ReturnType<naver.maps.Map["getPanes"]> \| undefined`                             | pane 집합을 반환합니다.                 |
| `getPrimitiveProjection` | `(...args: Parameters<naver.maps.Map["getPrimitiveProjection"]>) => ReturnType<naver.maps.Map["getPrimitiveProjection"]> \| undefined` | 원본 projection을 반환합니다.           |
| `getProjection`          | `(...args: Parameters<naver.maps.Map["getProjection"]>) => ReturnType<naver.maps.Map["getProjection"]> \| undefined`                   | 지도 projection을 반환합니다.           |
| `getSize`                | `(...args: Parameters<naver.maps.Map["getSize"]>) => ReturnType<naver.maps.Map["getSize"]> \| undefined`                               | 지도 크기를 반환합니다.                 |
| `getZoom`                | `(...args: Parameters<naver.maps.Map["getZoom"]>) => ReturnType<naver.maps.Map["getZoom"]> \| undefined`                               | 현재 줌 레벨을 반환합니다.              |
| `fitBounds`              | `(...args: Parameters<naver.maps.Map["fitBounds"]>) => ReturnType<naver.maps.Map["fitBounds"]> \| undefined`                           | 지정 경계에 맞춰 지도를 이동합니다.     |
| `panBy`                  | `(...args: Parameters<naver.maps.Map["panBy"]>) => ReturnType<naver.maps.Map["panBy"]> \| undefined`                                   | 픽셀 오프셋 기준으로 지도를 이동합니다. |
| `panTo`                  | `(...args: Parameters<naver.maps.Map["panTo"]>) => ReturnType<naver.maps.Map["panTo"]> \| undefined`                                   | 지정 좌표로 부드럽게 이동합니다.        |
| `panToBounds`            | `(...args: Parameters<naver.maps.Map["panToBounds"]>) => ReturnType<naver.maps.Map["panToBounds"]> \| undefined`                       | 경계에 맞춰 부드럽게 이동합니다.        |
| `morph`                  | `(...args: Parameters<naver.maps.Map["morph"]>) => ReturnType<naver.maps.Map["morph"]> \| undefined`                                   | 좌표/줌 조합으로 전환 이동합니다.       |
| `updateBy`               | `(...args: Parameters<naver.maps.Map["updateBy"]>) => ReturnType<naver.maps.Map["updateBy"]> \| undefined`                             | 좌표/줌으로 즉시 이동합니다.            |
| `zoomBy`                 | `(...args: Parameters<naver.maps.Map["zoomBy"]>) => ReturnType<naver.maps.Map["zoomBy"]> \| undefined`                                 | 상대 줌 레벨로 변경합니다.              |
| `setCenter`              | `(...args: Parameters<naver.maps.Map["setCenter"]>) => ReturnType<naver.maps.Map["setCenter"]> \| undefined`                           | 중심 좌표를 설정합니다.                 |
| `setCenterPoint`         | `(...args: Parameters<naver.maps.Map["setCenterPoint"]>) => ReturnType<naver.maps.Map["setCenterPoint"]> \| undefined`                 | 중심 세계 좌표를 설정합니다.            |
| `setMapTypeId`           | `(...args: Parameters<naver.maps.Map["setMapTypeId"]>) => ReturnType<naver.maps.Map["setMapTypeId"]> \| undefined`                     | 지도 타입 ID를 설정합니다.              |
| `setOptions`             | `(...args: Parameters<naver.maps.Map["setOptions"]>) => ReturnType<naver.maps.Map["setOptions"]> \| undefined`                         | 지도 옵션을 설정합니다.                 |
| `setSize`                | `(...args: Parameters<naver.maps.Map["setSize"]>) => ReturnType<naver.maps.Map["setSize"]> \| undefined`                               | 지도 크기를 설정합니다.                 |
| `setZoom`                | `(...args: Parameters<naver.maps.Map["setZoom"]>) => ReturnType<naver.maps.Map["setZoom"]> \| undefined`                               | 줌 레벨을 설정합니다.                   |

## DOM 프로퍼티

| Prop               | Type                                    | Description                                                                  |
| ------------------ | --------------------------------------- | ---------------------------------------------------------------------------- |
| 컨테이너 공통 속성 | `React.ComponentPropsWithoutRef<"div">` | `id`, `className`, `style`, `role`, `tabIndex`, `data-*`, `aria-*` 사용 가능 |
| 제외 속성          | `children`, `draggable`                 | `children`은 제외, `draggable`은 지도 옵션과 이름 충돌 방지                  |

## 동작 규칙

- 마운트 시 지도 인스턴스를 생성하며, 중복 생성은 방지합니다.
- 변경된 옵션만 diff 계산 후 반영합니다.
- `center`, `zoom`, `mapTypeId`는 imperative API로 정확히 적용합니다.
- 언마운트 시 이벤트 리스너 정리, destroy 호출, 컨테이너 초기화까지 수행합니다.
- `defaultCenter`/`defaultZoom`은 uncontrolled 모드로, 초기값만 설정하고 이후 내부 상태로 관리합니다.
- `center`/`zoom`은 controlled 모드로, React 상태와 동기화합니다.
- `fallback`은 SDK 로딩 중(`loading`) 또는 에러 발생 시(`error`) 표시됩니다.
