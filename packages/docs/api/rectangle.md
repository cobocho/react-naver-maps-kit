# Rectangle

`Rectangle`은 `naver.maps.Rectangle`을 React 컴포넌트로 감싼 오버레이 API입니다.

## 공개 타입

```ts
interface RectangleOptionProps {
  map?: naver.maps.Map | null;
  bounds: naver.maps.Bounds | naver.maps.BoundsLiteral;
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

interface RectangleLifecycleProps {
  onRectangleReady?: (rectangle: naver.maps.Rectangle) => void;
  onRectangleDestroy?: () => void;
  onRectangleError?: (error: Error) => void;
}

interface RectangleEventProps {
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
  onBoundsChanged?: (bounds: naver.maps.Bounds) => void;
  onClickableChanged?: (clickable: boolean) => void;
  onFillColorChanged?: (fillColor: string) => void;
  onFillOpacityChanged?: (fillOpacity: number) => void;
  onMapChanged?: (map: naver.maps.Map | null) => void;
  onStrokeColorChanged?: (strokeColor: string) => void;
  onStrokeLineCapChanged?: (strokeLineCap: naver.maps.StrokeLineCapType) => void;
  onStrokeLineJoinChanged?: (strokeLineJoin: naver.maps.StrokeLineJoinType) => void;
  onStrokeOpacityChanged?: (strokeOpacity: number) => void;
  onStrokeStyleChanged?: (strokeStyle: naver.maps.StrokeStyleType) => void;
  onStrokeWeightChanged?: (strokeWeight: number) => void;
  onVisibleChanged?: (visible: boolean) => void;
  onZIndexChanged?: (zIndex: number) => void;
}

export type RectangleProps = RectangleOptionProps & RectangleLifecycleProps & RectangleEventProps;
```

## 옵션 프로퍼티

| Prop             | Type                                            | Default      | Description                                                   |
| ---------------- | ----------------------------------------------- | ------------ | ------------------------------------------------------------- |
| `map`            | `naver.maps.Map \| null`                        | -            | 사각형을 바인딩할 지도 인스턴스 (미지정 시 Provider map 사용) |
| `bounds`         | `naver.maps.Bounds \| naver.maps.BoundsLiteral` | - (required) | 사각형 경계(bounds)                                           |
| `strokeWeight`   | `number`                                        | -            | 외곽선 두께                                                   |
| `strokeOpacity`  | `number`                                        | -            | 외곽선 불투명도 (`0~1`)                                       |
| `strokeColor`    | `string`                                        | -            | 외곽선 색상(CSS color)                                        |
| `strokeStyle`    | `naver.maps.StrokeStyleType`                    | -            | 외곽선 스타일                                                 |
| `strokeLineCap`  | `naver.maps.StrokeLineCapType`                  | -            | 외곽선 끝 마감 스타일                                         |
| `strokeLineJoin` | `naver.maps.StrokeLineJoinType`                 | -            | 외곽선 연결부 마감 스타일                                     |
| `fillColor`      | `string`                                        | -            | 내부 채움 색상(CSS color)                                     |
| `fillOpacity`    | `number`                                        | -            | 내부 채움 불투명도 (`0~1`)                                    |
| `clickable`      | `boolean`                                       | -            | 클릭/포인터 이벤트 수신 여부                                  |
| `visible`        | `boolean`                                       | -            | 노출 여부                                                     |
| `zIndex`         | `number`                                        | -            | 쌓임 순서                                                     |

## 생명주기 프로퍼티

| Prop                 | Type                                        | Description                |
| -------------------- | ------------------------------------------- | -------------------------- |
| `onRectangleReady`   | `(rectangle: naver.maps.Rectangle) => void` | 인스턴스 생성 완료 시 호출 |
| `onRectangleDestroy` | `() => void`                                | 인스턴스 정리 완료 시 호출 |
| `onRectangleError`   | `(error: Error) => void`                    | 인스턴스 생성 실패 시 호출 |

## 이벤트 프로퍼티

| Prop                      | Type                                                      | Description                           |
| ------------------------- | --------------------------------------------------------- | ------------------------------------- |
| `onClick`                 | `(event: naver.maps.PointerEvent) => void`                | 사각형 클릭 시 호출                   |
| `onDblClick`              | `(event: naver.maps.PointerEvent) => void`                | 사각형 더블클릭 시 호출               |
| `onMouseDown`             | `(event: naver.maps.PointerEvent) => void`                | 마우스 버튼 다운 시 호출              |
| `onMouseMove`             | `(event: naver.maps.PointerEvent) => void`                | 마우스 이동 시 호출                   |
| `onMouseOut`              | `(event: naver.maps.PointerEvent) => void`                | 포인터가 사각형 밖으로 나갈 때 호출   |
| `onMouseOver`             | `(event: naver.maps.PointerEvent) => void`                | 포인터가 사각형 안으로 들어올 때 호출 |
| `onMouseUp`               | `(event: naver.maps.PointerEvent) => void`                | 마우스 버튼 업 시 호출                |
| `onRightClick`            | `(event: naver.maps.PointerEvent) => void`                | 우클릭 시 호출                        |
| `onTouchStart`            | `(event: naver.maps.PointerEvent) => void`                | 터치 시작 시 호출                     |
| `onTouchMove`             | `(event: naver.maps.PointerEvent) => void`                | 터치 이동 시 호출                     |
| `onTouchEnd`              | `(event: naver.maps.PointerEvent) => void`                | 터치 종료 시 호출                     |
| `onBoundsChanged`         | `(bounds: naver.maps.Bounds) => void`                     | 경계(bounds) 변경 시 호출             |
| `onClickableChanged`      | `(clickable: boolean) => void`                            | 클릭 가능 여부 변경 시 호출           |
| `onFillColorChanged`      | `(fillColor: string) => void`                             | 채움 색상 변경 시 호출                |
| `onFillOpacityChanged`    | `(fillOpacity: number) => void`                           | 채움 불투명도 변경 시 호출            |
| `onMapChanged`            | `(map: naver.maps.Map \| null) => void`                   | 바인딩된 map 변경 시 호출             |
| `onStrokeColorChanged`    | `(strokeColor: string) => void`                           | 외곽선 색상 변경 시 호출              |
| `onStrokeLineCapChanged`  | `(strokeLineCap: naver.maps.StrokeLineCapType) => void`   | 외곽선 끝 마감 변경 시 호출           |
| `onStrokeLineJoinChanged` | `(strokeLineJoin: naver.maps.StrokeLineJoinType) => void` | 외곽선 연결부 마감 변경 시 호출       |
| `onStrokeOpacityChanged`  | `(strokeOpacity: number) => void`                         | 외곽선 불투명도 변경 시 호출          |
| `onStrokeStyleChanged`    | `(strokeStyle: naver.maps.StrokeStyleType) => void`       | 외곽선 스타일 변경 시 호출            |
| `onStrokeWeightChanged`   | `(strokeWeight: number) => void`                          | 외곽선 두께 변경 시 호출              |
| `onVisibleChanged`        | `(visible: boolean) => void`                              | 노출 여부 변경 시 호출                |
| `onZIndexChanged`         | `(zIndex: number) => void`                                | 쌓임 순서 변경 시 호출                |

## Ref 메서드

| Method           | Signature                                                                                                                          | Description                      |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| `getInstance`    | `() => naver.maps.Rectangle \| null`                                                                                               | 내부 `Rectangle` 인스턴스를 반환 |
| `getAreaSize`    | `(...args: Parameters<naver.maps.Rectangle["getAreaSize"]>) => ReturnType<naver.maps.Rectangle["getAreaSize"]> \| undefined`       | 면적(제곱미터) 조회              |
| `getBounds`      | `(...args: Parameters<naver.maps.Rectangle["getBounds"]>) => ReturnType<naver.maps.Rectangle["getBounds"]> \| undefined`           | 좌표 경계 조회                   |
| `getClickable`   | `(...args: Parameters<naver.maps.Rectangle["getClickable"]>) => ReturnType<naver.maps.Rectangle["getClickable"]> \| undefined`     | 클릭 가능 여부 조회              |
| `getDrawingRect` | `(...args: Parameters<naver.maps.Rectangle["getDrawingRect"]>) => ReturnType<naver.maps.Rectangle["getDrawingRect"]> \| undefined` | 렌더링 경계 조회                 |
| `getElement`     | `(...args: Parameters<naver.maps.Rectangle["getElement"]>) => ReturnType<naver.maps.Rectangle["getElement"]> \| undefined`         | DOM 요소 조회                    |
| `getMap`         | `(...args: Parameters<naver.maps.Rectangle["getMap"]>) => ReturnType<naver.maps.Rectangle["getMap"]> \| undefined`                 | 바인딩 map 조회                  |
| `getOptions`     | `(...args: Parameters<naver.maps.Rectangle["getOptions"]>) => ReturnType<naver.maps.Rectangle["getOptions"]> \| undefined`         | 옵션 조회                        |
| `getPanes`       | `(...args: Parameters<naver.maps.Rectangle["getPanes"]>) => ReturnType<naver.maps.Rectangle["getPanes"]> \| undefined`             | panes 조회                       |
| `getProjection`  | `(...args: Parameters<naver.maps.Rectangle["getProjection"]>) => ReturnType<naver.maps.Rectangle["getProjection"]> \| undefined`   | projection 조회                  |
| `getStyles`      | `(...args: Parameters<naver.maps.Rectangle["getStyles"]>) => ReturnType<naver.maps.Rectangle["getStyles"]> \| undefined`           | 스타일 조회                      |
| `getVisible`     | `(...args: Parameters<naver.maps.Rectangle["getVisible"]>) => ReturnType<naver.maps.Rectangle["getVisible"]> \| undefined`         | 노출 여부 조회                   |
| `getZIndex`      | `(...args: Parameters<naver.maps.Rectangle["getZIndex"]>) => ReturnType<naver.maps.Rectangle["getZIndex"]> \| undefined`           | zIndex 조회                      |
| `setBounds`      | `(...args: Parameters<naver.maps.Rectangle["setBounds"]>) => ReturnType<naver.maps.Rectangle["setBounds"]> \| undefined`           | 경계(bounds) 설정                |
| `setClickable`   | `(...args: Parameters<naver.maps.Rectangle["setClickable"]>) => ReturnType<naver.maps.Rectangle["setClickable"]> \| undefined`     | 클릭 가능 여부 설정              |
| `setMap`         | `(...args: Parameters<naver.maps.Rectangle["setMap"]>) => ReturnType<naver.maps.Rectangle["setMap"]> \| undefined`                 | map 바인딩/해제                  |
| `setOptions`     | `(...args: Parameters<naver.maps.Rectangle["setOptions"]>) => ReturnType<naver.maps.Rectangle["setOptions"]> \| undefined`         | 옵션 일괄/부분 설정              |
| `setStyles`      | `(...args: Parameters<naver.maps.Rectangle["setStyles"]>) => ReturnType<naver.maps.Rectangle["setStyles"]> \| undefined`           | 스타일 일괄/부분 설정            |
| `setVisible`     | `(...args: Parameters<naver.maps.Rectangle["setVisible"]>) => ReturnType<naver.maps.Rectangle["setVisible"]> \| undefined`         | 노출 여부 설정                   |
| `setZIndex`      | `(...args: Parameters<naver.maps.Rectangle["setZIndex"]>) => ReturnType<naver.maps.Rectangle["setZIndex"]> \| undefined`           | zIndex 설정                      |

## 동작 규칙

- 컴포넌트 언마운트 시 이벤트 리스너 정리 후 `setMap(null)`을 호출합니다.
- `map` prop을 지정하지 않으면 `NaverMapProvider` 컨텍스트의 map 인스턴스를 사용합니다.
