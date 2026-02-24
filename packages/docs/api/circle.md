# Circle

`Circle`는 `naver.maps.Circle`를 React 컴포넌트로 감싼 도형 오버레이 API입니다.

## 공개 타입

```ts
interface CircleOptionProps {
  map?: naver.maps.Map | null;
  center: naver.maps.Coord | naver.maps.CoordLiteral;
  radius?: number;
  strokeWeight?: number;
  strokeOpacity?: number;
  strokeColor?: string;
  strokeStyle?: naver.maps.StrokeStyleType;
  strokeLineCap?: naver.maps.StrokeLineCapType;
  strokeLineJoin?: naver.maps.StrokeLineJoinType;
  fillColor?: string;
  fillOpacity?: number;
  clickable?: boolean;
  visible?: boolean;
  zIndex?: number;
}

interface CircleLifecycleProps {
  onCircleReady?: (circle: naver.maps.Circle) => void;
  onCircleDestroy?: () => void;
  onCircleError?: (error: Error) => void;
}

interface CircleEventProps {
  onClick?: (event: naver.maps.PointerEvent) => void;
  onDblClick?: (event: naver.maps.PointerEvent) => void;
  onMouseDown?: (event: naver.maps.PointerEvent) => void;
  onMouseMove?: (event: naver.maps.PointerEvent) => void;
  onMouseOut?: (event: naver.maps.PointerEvent) => void;
  onMouseOver?: (event: naver.maps.PointerEvent) => void;
  onMouseUp?: (event: naver.maps.PointerEvent) => void;
  onRightClick?: (event: naver.maps.PointerEvent) => void;
  onTouchStart?: (event: naver.maps.PointerEvent) => void;
  onTouchMove?: (event: naver.maps.PointerEvent) => void;
  onTouchEnd?: (event: naver.maps.PointerEvent) => void;
  onCenterChanged?: (center: naver.maps.Coord) => void;
  onClickableChanged?: (clickable: boolean) => void;
  onFillColorChanged?: (fillColor: string) => void;
  onFillOpacityChanged?: (fillOpacity: number) => void;
  onMapChanged?: (map: naver.maps.Map | null) => void;
  onRadiusChanged?: (radius: number) => void;
  onStrokeColorChanged?: (strokeColor: string) => void;
  onStrokeLineCapChanged?: (strokeLineCap: naver.maps.StrokeLineCapType) => void;
  onStrokeLineJoinChanged?: (strokeLineJoin: naver.maps.StrokeLineJoinType) => void;
  onStrokeOpacityChanged?: (strokeOpacity: number) => void;
  onStrokeStyleChanged?: (strokeStyle: naver.maps.StrokeStyleType) => void;
  onStrokeWeightChanged?: (strokeWeight: number) => void;
  onVisibleChanged?: (visible: boolean) => void;
  onZIndexChanged?: (zIndex: number) => void;
}

export type CircleProps = CircleOptionProps & CircleLifecycleProps & CircleEventProps;

export interface CircleRef {
  getInstance: () => naver.maps.Circle | null;
  getAreaSize: (
    ...args: Parameters<naver.maps.Circle["getAreaSize"]>
  ) => ReturnType<naver.maps.Circle["getAreaSize"]> | undefined;
  getBounds: (
    ...args: Parameters<naver.maps.Circle["getBounds"]>
  ) => ReturnType<naver.maps.Circle["getBounds"]> | undefined;
  getCenter: (
    ...args: Parameters<naver.maps.Circle["getCenter"]>
  ) => ReturnType<naver.maps.Circle["getCenter"]> | undefined;
  getClickable: (
    ...args: Parameters<naver.maps.Circle["getClickable"]>
  ) => ReturnType<naver.maps.Circle["getClickable"]> | undefined;
  getDrawingRect: (
    ...args: Parameters<naver.maps.Circle["getDrawingRect"]>
  ) => ReturnType<naver.maps.Circle["getDrawingRect"]> | undefined;
  getElement: (
    ...args: Parameters<naver.maps.Circle["getElement"]>
  ) => ReturnType<naver.maps.Circle["getElement"]> | undefined;
  getMap: (
    ...args: Parameters<naver.maps.Circle["getMap"]>
  ) => ReturnType<naver.maps.Circle["getMap"]> | undefined;
  getOptions: (
    ...args: Parameters<naver.maps.Circle["getOptions"]>
  ) => ReturnType<naver.maps.Circle["getOptions"]> | undefined;
  getPanes: (
    ...args: Parameters<naver.maps.Circle["getPanes"]>
  ) => ReturnType<naver.maps.Circle["getPanes"]> | undefined;
  getProjection: (
    ...args: Parameters<naver.maps.Circle["getProjection"]>
  ) => ReturnType<naver.maps.Circle["getProjection"]> | undefined;
  getRadius: (
    ...args: Parameters<naver.maps.Circle["getRadius"]>
  ) => ReturnType<naver.maps.Circle["getRadius"]> | undefined;
  getStyles: (
    ...args: Parameters<naver.maps.Circle["getStyles"]>
  ) => ReturnType<naver.maps.Circle["getStyles"]> | undefined;
  getVisible: (
    ...args: Parameters<naver.maps.Circle["getVisible"]>
  ) => ReturnType<naver.maps.Circle["getVisible"]> | undefined;
  getZIndex: (
    ...args: Parameters<naver.maps.Circle["getZIndex"]>
  ) => ReturnType<naver.maps.Circle["getZIndex"]> | undefined;
  setCenter: (
    ...args: Parameters<naver.maps.Circle["setCenter"]>
  ) => ReturnType<naver.maps.Circle["setCenter"]> | undefined;
  setClickable: (
    ...args: Parameters<naver.maps.Circle["setClickable"]>
  ) => ReturnType<naver.maps.Circle["setClickable"]> | undefined;
  setMap: (
    ...args: Parameters<naver.maps.Circle["setMap"]>
  ) => ReturnType<naver.maps.Circle["setMap"]> | undefined;
  setOptions: (
    ...args: Parameters<naver.maps.Circle["setOptions"]>
  ) => ReturnType<naver.maps.Circle["setOptions"]> | undefined;
  setRadius: (
    ...args: Parameters<naver.maps.Circle["setRadius"]>
  ) => ReturnType<naver.maps.Circle["setRadius"]> | undefined;
  setStyles: (
    ...args: Parameters<naver.maps.Circle["setStyles"]>
  ) => ReturnType<naver.maps.Circle["setStyles"]> | undefined;
  setVisible: (
    ...args: Parameters<naver.maps.Circle["setVisible"]>
  ) => ReturnType<naver.maps.Circle["setVisible"]> | undefined;
  setZIndex: (
    ...args: Parameters<naver.maps.Circle["setZIndex"]>
  ) => ReturnType<naver.maps.Circle["setZIndex"]> | undefined;
}
```

## 옵션 프로퍼티

| Prop             | Type                                          | Default      | Description                                                 |
| ---------------- | --------------------------------------------- | ------------ | ----------------------------------------------------------- |
| `map`            | `naver.maps.Map \| null`                      | -            | 도형을 바인딩할 지도 인스턴스 (미지정 시 Provider map 사용) |
| `center`         | `naver.maps.Coord \| naver.maps.CoordLiteral` | - (required) | 원의 중심 좌표                                              |
| `radius`         | `number`                                      | `0`          | 원의 반경(미터)                                             |
| `strokeWeight`   | `number`                                      | `1`          | 도형 외곽선 두께                                            |
| `strokeOpacity`  | `number`                                      | `1`          | 외곽선 불투명도 (`0~1`)                                     |
| `strokeColor`    | `string`                                      | `#007EEA`    | 외곽선 색상(CSS color)                                      |
| `strokeStyle`    | `naver.maps.StrokeStyleType`                  | `solid`      | 외곽선 스타일                                               |
| `strokeLineCap`  | `naver.maps.StrokeLineCapType`                | `butt`       | 외곽선 끝 마감 스타일                                       |
| `strokeLineJoin` | `naver.maps.StrokeLineJoinType`               | `miter`      | 외곽선 연결부 마감 스타일                                   |
| `fillColor`      | `string`                                      | `none`       | 내부 채움 색상(CSS color)                                   |
| `fillOpacity`    | `number`                                      | `1`          | 내부 채움 불투명도 (`0~1`)                                  |
| `clickable`      | `boolean`                                     | `false`      | 클릭/포인터 이벤트 수신 여부                                |
| `visible`        | `boolean`                                     | `true`       | 도형 노출 여부                                              |
| `zIndex`         | `number`                                      | `0`          | 도형 쌓임 순서                                              |

## 생명주기 프로퍼티

| Prop              | Type                                  | Description                |
| ----------------- | ------------------------------------- | -------------------------- |
| `onCircleReady`   | `(circle: naver.maps.Circle) => void` | 인스턴스 생성 완료 시 호출 |
| `onCircleDestroy` | `() => void`                          | 인스턴스 정리 완료 시 호출 |
| `onCircleError`   | `(error: Error) => void`              | 인스턴스 생성 실패 시 호출 |

## 이벤트 프로퍼티

| Prop                      | Type                                                      | Description                       |
| ------------------------- | --------------------------------------------------------- | --------------------------------- |
| `onClick`                 | `(event: naver.maps.PointerEvent) => void`                | 원 클릭 시 호출                   |
| `onDblClick`              | `(event: naver.maps.PointerEvent) => void`                | 원 더블클릭 시 호출               |
| `onMouseDown`             | `(event: naver.maps.PointerEvent) => void`                | 마우스 버튼 다운 시 호출          |
| `onMouseMove`             | `(event: naver.maps.PointerEvent) => void`                | 마우스 이동 시 호출               |
| `onMouseOut`              | `(event: naver.maps.PointerEvent) => void`                | 포인터가 원 밖으로 나갈 때 호출   |
| `onMouseOver`             | `(event: naver.maps.PointerEvent) => void`                | 포인터가 원 안으로 들어올 때 호출 |
| `onMouseUp`               | `(event: naver.maps.PointerEvent) => void`                | 마우스 버튼 업 시 호출            |
| `onRightClick`            | `(event: naver.maps.PointerEvent) => void`                | 우클릭 시 호출                    |
| `onTouchStart`            | `(event: naver.maps.PointerEvent) => void`                | 터치 시작 시 호출                 |
| `onTouchMove`             | `(event: naver.maps.PointerEvent) => void`                | 터치 이동 시 호출                 |
| `onTouchEnd`              | `(event: naver.maps.PointerEvent) => void`                | 터치 종료 시 호출                 |
| `onCenterChanged`         | `(center: naver.maps.Coord) => void`                      | 중심 좌표 변경 시 호출            |
| `onClickableChanged`      | `(clickable: boolean) => void`                            | 클릭 가능 여부 변경 시 호출       |
| `onFillColorChanged`      | `(fillColor: string) => void`                             | 채움 색상 변경 시 호출            |
| `onFillOpacityChanged`    | `(fillOpacity: number) => void`                           | 채움 불투명도 변경 시 호출        |
| `onMapChanged`            | `(map: naver.maps.Map \| null) => void`                   | 바인딩된 map 변경 시 호출         |
| `onRadiusChanged`         | `(radius: number) => void`                                | 반경 변경 시 호출                 |
| `onStrokeColorChanged`    | `(strokeColor: string) => void`                           | 외곽선 색상 변경 시 호출          |
| `onStrokeLineCapChanged`  | `(strokeLineCap: naver.maps.StrokeLineCapType) => void`   | 외곽선 끝 마감 변경 시 호출       |
| `onStrokeLineJoinChanged` | `(strokeLineJoin: naver.maps.StrokeLineJoinType) => void` | 외곽선 연결부 마감 변경 시 호출   |
| `onStrokeOpacityChanged`  | `(strokeOpacity: number) => void`                         | 외곽선 불투명도 변경 시 호출      |
| `onStrokeStyleChanged`    | `(strokeStyle: naver.maps.StrokeStyleType) => void`       | 외곽선 스타일 변경 시 호출        |
| `onStrokeWeightChanged`   | `(strokeWeight: number) => void`                          | 외곽선 두께 변경 시 호출          |
| `onVisibleChanged`        | `(visible: boolean) => void`                              | 노출 여부 변경 시 호출            |
| `onZIndexChanged`         | `(zIndex: number) => void`                                | 쌓임 순서 변경 시 호출            |

## Ref 메서드

| Method           | Signature                                                                                                                    | Description                   |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| `getInstance`    | `() => naver.maps.Circle \| null`                                                                                            | 내부 `Circle` 인스턴스를 반환 |
| `getAreaSize`    | `(...args: Parameters<naver.maps.Circle["getAreaSize"]>) => ReturnType<naver.maps.Circle["getAreaSize"]> \| undefined`       | 면적(제곱미터) 조회           |
| `getBounds`      | `(...args: Parameters<naver.maps.Circle["getBounds"]>) => ReturnType<naver.maps.Circle["getBounds"]> \| undefined`           | 좌표 경계 조회                |
| `getCenter`      | `(...args: Parameters<naver.maps.Circle["getCenter"]>) => ReturnType<naver.maps.Circle["getCenter"]> \| undefined`           | 중심 좌표 조회                |
| `getClickable`   | `(...args: Parameters<naver.maps.Circle["getClickable"]>) => ReturnType<naver.maps.Circle["getClickable"]> \| undefined`     | 클릭 가능 여부 조회           |
| `getDrawingRect` | `(...args: Parameters<naver.maps.Circle["getDrawingRect"]>) => ReturnType<naver.maps.Circle["getDrawingRect"]> \| undefined` | 렌더링 경계 조회              |
| `getElement`     | `(...args: Parameters<naver.maps.Circle["getElement"]>) => ReturnType<naver.maps.Circle["getElement"]> \| undefined`         | DOM 요소 조회                 |
| `getMap`         | `(...args: Parameters<naver.maps.Circle["getMap"]>) => ReturnType<naver.maps.Circle["getMap"]> \| undefined`                 | 바인딩 map 조회               |
| `getOptions`     | `(...args: Parameters<naver.maps.Circle["getOptions"]>) => ReturnType<naver.maps.Circle["getOptions"]> \| undefined`         | 옵션 조회                     |
| `getPanes`       | `(...args: Parameters<naver.maps.Circle["getPanes"]>) => ReturnType<naver.maps.Circle["getPanes"]> \| undefined`             | panes 조회                    |
| `getProjection`  | `(...args: Parameters<naver.maps.Circle["getProjection"]>) => ReturnType<naver.maps.Circle["getProjection"]> \| undefined`   | projection 조회               |
| `getRadius`      | `(...args: Parameters<naver.maps.Circle["getRadius"]>) => ReturnType<naver.maps.Circle["getRadius"]> \| undefined`           | 반경 조회                     |
| `getStyles`      | `(...args: Parameters<naver.maps.Circle["getStyles"]>) => ReturnType<naver.maps.Circle["getStyles"]> \| undefined`           | 스타일 조회                   |
| `getVisible`     | `(...args: Parameters<naver.maps.Circle["getVisible"]>) => ReturnType<naver.maps.Circle["getVisible"]> \| undefined`         | 노출 여부 조회                |
| `getZIndex`      | `(...args: Parameters<naver.maps.Circle["getZIndex"]>) => ReturnType<naver.maps.Circle["getZIndex"]> \| undefined`           | zIndex 조회                   |
| `setCenter`      | `(...args: Parameters<naver.maps.Circle["setCenter"]>) => ReturnType<naver.maps.Circle["setCenter"]> \| undefined`           | 중심 좌표 설정                |
| `setClickable`   | `(...args: Parameters<naver.maps.Circle["setClickable"]>) => ReturnType<naver.maps.Circle["setClickable"]> \| undefined`     | 클릭 가능 여부 설정           |
| `setMap`         | `(...args: Parameters<naver.maps.Circle["setMap"]>) => ReturnType<naver.maps.Circle["setMap"]> \| undefined`                 | map 바인딩/해제               |
| `setOptions`     | `(...args: Parameters<naver.maps.Circle["setOptions"]>) => ReturnType<naver.maps.Circle["setOptions"]> \| undefined`         | 옵션 일괄/부분 설정           |
| `setRadius`      | `(...args: Parameters<naver.maps.Circle["setRadius"]>) => ReturnType<naver.maps.Circle["setRadius"]> \| undefined`           | 반경 설정                     |
| `setStyles`      | `(...args: Parameters<naver.maps.Circle["setStyles"]>) => ReturnType<naver.maps.Circle["setStyles"]> \| undefined`           | 스타일 일괄/부분 설정         |
| `setVisible`     | `(...args: Parameters<naver.maps.Circle["setVisible"]>) => ReturnType<naver.maps.Circle["setVisible"]> \| undefined`         | 노출 여부 설정                |
| `setZIndex`      | `(...args: Parameters<naver.maps.Circle["setZIndex"]>) => ReturnType<naver.maps.Circle["setZIndex"]> \| undefined`           | zIndex 설정                   |

## 동작 규칙

- 컴포넌트 언마운트 시 이벤트 리스너 정리 후 `setMap(null)`을 호출합니다.
- `map` prop을 지정하지 않으면 가장 가까운 `NaverMap` 또는 `Panorama`의 인스턴스를 자동으로 사용합니다.
