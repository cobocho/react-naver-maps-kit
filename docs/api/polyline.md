# Polyline

`Polyline`은 `naver.maps.Polyline`을 React 컴포넌트로 감싼 오버레이 API입니다.

## 공개 타입

```ts
interface PolylineOptionProps {
  map?: naver.maps.Map | null;
  path: naver.maps.ArrayOfCoords | naver.maps.KVOArrayOfCoords | naver.maps.ArrayOfCoordsLiteral;
  strokeWeight?: number;
  strokeOpacity?: number;
  strokeColor?: string;
  strokeStyle?: naver.maps.StrokeStyleType;
  strokeLineCap?: naver.maps.StrokeLineCapType;
  strokeLineJoin?: naver.maps.StrokeLineJoinType;
  clickable?: boolean;
  visible?: boolean;
  zIndex?: number;
  startIcon?: naver.maps.PointingIcon;
  startIconSize?: number;
  endIcon?: naver.maps.PointingIcon;
  endIconSize?: number;
}

interface PolylineLifecycleProps {
  onPolylineReady?: (polyline: naver.maps.Polyline) => void;
  onPolylineDestroy?: () => void;
  onPolylineError?: (error: Error) => void;
}

interface PolylineEventProps {
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
  onClickableChanged?: (clickable: boolean) => void;
  onEndIconChanged?: (icon: naver.maps.PointingIcon) => void;
  onEndIconSizeChanged?: (size: number) => void;
  onMapChanged?: (map: naver.maps.Map | null) => void;
  onPathChanged?: (
    path: naver.maps.ArrayOfCoords | naver.maps.KVOArrayOfCoords | naver.maps.ArrayOfCoordsLiteral
  ) => void;
  onStartIconChanged?: (icon: naver.maps.PointingIcon) => void;
  onStartIconSizeChanged?: (size: number) => void;
  onStrokeColorChanged?: (strokeColor: string) => void;
  onStrokeLineCapChanged?: (strokeLineCap: naver.maps.StrokeLineCapType) => void;
  onStrokeLineJoinChanged?: (strokeLineJoin: naver.maps.StrokeLineJoinType) => void;
  onStrokeOpacityChanged?: (strokeOpacity: number) => void;
  onStrokeStyleChanged?: (strokeStyle: naver.maps.StrokeStyleType) => void;
  onStrokeWeightChanged?: (strokeWeight: number) => void;
  onVisibleChanged?: (visible: boolean) => void;
  onZIndexChanged?: (zIndex: number) => void;
}

export type PolylineProps = PolylineOptionProps & PolylineLifecycleProps & PolylineEventProps;
```

## 옵션 프로퍼티

| Prop             | Type                                                        | Default      | Description                                                     |
| ---------------- | ----------------------------------------------------------- | ------------ | --------------------------------------------------------------- |
| `map`            | `naver.maps.Map \| null`                                    | -            | 폴리라인을 바인딩할 지도 인스턴스 (미지정 시 Provider map 사용) |
| `path`           | `ArrayOfCoords \| KVOArrayOfCoords \| ArrayOfCoordsLiteral` | - (required) | 폴리라인 경로 좌표                                              |
| `strokeWeight`   | `number`                                                    | -            | 외곽선 두께                                                     |
| `strokeOpacity`  | `number`                                                    | -            | 외곽선 불투명도 (`0~1`)                                         |
| `strokeColor`    | `string`                                                    | -            | 외곽선 색상(CSS color)                                          |
| `strokeStyle`    | `naver.maps.StrokeStyleType`                                | -            | 외곽선 스타일                                                   |
| `strokeLineCap`  | `naver.maps.StrokeLineCapType`                              | -            | 외곽선 끝 마감 스타일                                           |
| `strokeLineJoin` | `naver.maps.StrokeLineJoinType`                             | -            | 외곽선 연결부 마감 스타일                                       |
| `clickable`      | `boolean`                                                   | -            | 클릭/포인터 이벤트 수신 여부                                    |
| `visible`        | `boolean`                                                   | -            | 노출 여부                                                       |
| `zIndex`         | `number`                                                    | -            | 쌓임 순서                                                       |
| `startIcon`      | `naver.maps.PointingIcon`                                   | -            | 선 시작점 아이콘                                                |
| `startIconSize`  | `number`                                                    | -            | 시작점 아이콘 크기                                              |
| `endIcon`        | `naver.maps.PointingIcon`                                   | -            | 선 끝점 아이콘                                                  |
| `endIconSize`    | `number`                                                    | -            | 끝점 아이콘 크기                                                |

## 생명주기 프로퍼티

| Prop                | Type                                      | Description                |
| ------------------- | ----------------------------------------- | -------------------------- |
| `onPolylineReady`   | `(polyline: naver.maps.Polyline) => void` | 인스턴스 생성 완료 시 호출 |
| `onPolylineDestroy` | `() => void`                              | 인스턴스 정리 완료 시 호출 |
| `onPolylineError`   | `(error: Error) => void`                  | 인스턴스 생성 실패 시 호출 |

## 이벤트 프로퍼티

| Prop                      | Type                                                                                                         | Description                             |
| ------------------------- | ------------------------------------------------------------------------------------------------------------ | --------------------------------------- |
| `onClick`                 | `(event: naver.maps.PointerEvent) => void`                                                                   | 폴리라인 클릭 시 호출                   |
| `onDblClick`              | `(event: naver.maps.PointerEvent) => void`                                                                   | 폴리라인 더블클릭 시 호출               |
| `onMouseDown`             | `(event: naver.maps.PointerEvent) => void`                                                                   | 마우스 버튼 다운 시 호출                |
| `onMouseMove`             | `(event: naver.maps.PointerEvent) => void`                                                                   | 마우스 이동 시 호출                     |
| `onMouseOut`              | `(event: naver.maps.PointerEvent) => void`                                                                   | 포인터가 폴리라인 밖으로 나갈 때 호출   |
| `onMouseOver`             | `(event: naver.maps.PointerEvent) => void`                                                                   | 포인터가 폴리라인 안으로 들어올 때 호출 |
| `onMouseUp`               | `(event: naver.maps.PointerEvent) => void`                                                                   | 마우스 버튼 업 시 호출                  |
| `onRightClick`            | `(event: naver.maps.PointerEvent) => void`                                                                   | 우클릭 시 호출                          |
| `onTouchStart`            | `(event: naver.maps.PointerEvent) => void`                                                                   | 터치 시작 시 호출                       |
| `onTouchMove`             | `(event: naver.maps.PointerEvent) => void`                                                                   | 터치 이동 시 호출                       |
| `onTouchEnd`              | `(event: naver.maps.PointerEvent) => void`                                                                   | 터치 종료 시 호출                       |
| `onClickableChanged`      | `(clickable: boolean) => void`                                                                               | 클릭 가능 여부 변경 시 호출             |
| `onEndIconChanged`        | `(icon: naver.maps.PointingIcon) => void`                                                                    | 끝 아이콘 변경 시 호출                  |
| `onEndIconSizeChanged`    | `(size: number) => void`                                                                                     | 끝 아이콘 크기 변경 시 호출             |
| `onMapChanged`            | `(map: naver.maps.Map \| null) => void`                                                                      | 바인딩된 map 변경 시 호출               |
| `onPathChanged`           | `(path: naver.maps.ArrayOfCoords \| naver.maps.KVOArrayOfCoords \| naver.maps.ArrayOfCoordsLiteral) => void` | path 변경 시 호출                       |
| `onStartIconChanged`      | `(icon: naver.maps.PointingIcon) => void`                                                                    | 시작 아이콘 변경 시 호출                |
| `onStartIconSizeChanged`  | `(size: number) => void`                                                                                     | 시작 아이콘 크기 변경 시 호출           |
| `onStrokeColorChanged`    | `(strokeColor: string) => void`                                                                              | 외곽선 색상 변경 시 호출                |
| `onStrokeLineCapChanged`  | `(strokeLineCap: naver.maps.StrokeLineCapType) => void`                                                      | 외곽선 끝 마감 변경 시 호출             |
| `onStrokeLineJoinChanged` | `(strokeLineJoin: naver.maps.StrokeLineJoinType) => void`                                                    | 외곽선 연결부 마감 변경 시 호출         |
| `onStrokeOpacityChanged`  | `(strokeOpacity: number) => void`                                                                            | 외곽선 불투명도 변경 시 호출            |
| `onStrokeStyleChanged`    | `(strokeStyle: naver.maps.StrokeStyleType) => void`                                                          | 외곽선 스타일 변경 시 호출              |
| `onStrokeWeightChanged`   | `(strokeWeight: number) => void`                                                                             | 외곽선 두께 변경 시 호출                |
| `onVisibleChanged`        | `(visible: boolean) => void`                                                                                 | 노출 여부 변경 시 호출                  |
| `onZIndexChanged`         | `(zIndex: number) => void`                                                                                   | 쌓임 순서 변경 시 호출                  |

## Ref 메서드

| Method           | Signature                                                                                                                        | Description                     |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| `getInstance`    | `() => naver.maps.Polyline \| null`                                                                                              | 내부 `Polyline` 인스턴스를 반환 |
| `getBounds`      | `(...args: Parameters<naver.maps.Polyline["getBounds"]>) => ReturnType<naver.maps.Polyline["getBounds"]> \| undefined`           | 좌표 경계 조회                  |
| `getClickable`   | `(...args: Parameters<naver.maps.Polyline["getClickable"]>) => ReturnType<naver.maps.Polyline["getClickable"]> \| undefined`     | 클릭 가능 여부 조회             |
| `getDistance`    | `(...args: Parameters<naver.maps.Polyline["getDistance"]>) => ReturnType<naver.maps.Polyline["getDistance"]> \| undefined`       | 거리(미터) 조회                 |
| `getDrawingRect` | `(...args: Parameters<naver.maps.Polyline["getDrawingRect"]>) => ReturnType<naver.maps.Polyline["getDrawingRect"]> \| undefined` | 렌더링 경계 조회                |
| `getElement`     | `(...args: Parameters<naver.maps.Polyline["getElement"]>) => ReturnType<naver.maps.Polyline["getElement"]> \| undefined`         | DOM 요소 조회                   |
| `getMap`         | `(...args: Parameters<naver.maps.Polyline["getMap"]>) => ReturnType<naver.maps.Polyline["getMap"]> \| undefined`                 | 바인딩 map 조회                 |
| `getOptions`     | `(...args: Parameters<naver.maps.Polyline["getOptions"]>) => ReturnType<naver.maps.Polyline["getOptions"]> \| undefined`         | 옵션 조회                       |
| `getPanes`       | `(...args: Parameters<naver.maps.Polyline["getPanes"]>) => ReturnType<naver.maps.Polyline["getPanes"]> \| undefined`             | panes 조회                      |
| `getPath`        | `(...args: Parameters<naver.maps.Polyline["getPath"]>) => ReturnType<naver.maps.Polyline["getPath"]> \| undefined`               | path 조회                       |
| `getProjection`  | `(...args: Parameters<naver.maps.Polyline["getProjection"]>) => ReturnType<naver.maps.Polyline["getProjection"]> \| undefined`   | projection 조회                 |
| `getStyles`      | `(...args: Parameters<naver.maps.Polyline["getStyles"]>) => ReturnType<naver.maps.Polyline["getStyles"]> \| undefined`           | 스타일 조회                     |
| `getVisible`     | `(...args: Parameters<naver.maps.Polyline["getVisible"]>) => ReturnType<naver.maps.Polyline["getVisible"]> \| undefined`         | 노출 여부 조회                  |
| `getZIndex`      | `(...args: Parameters<naver.maps.Polyline["getZIndex"]>) => ReturnType<naver.maps.Polyline["getZIndex"]> \| undefined`           | zIndex 조회                     |
| `setClickable`   | `(...args: Parameters<naver.maps.Polyline["setClickable"]>) => ReturnType<naver.maps.Polyline["setClickable"]> \| undefined`     | 클릭 가능 여부 설정             |
| `setMap`         | `(...args: Parameters<naver.maps.Polyline["setMap"]>) => ReturnType<naver.maps.Polyline["setMap"]> \| undefined`                 | map 바인딩/해제                 |
| `setOptions`     | `(...args: Parameters<naver.maps.Polyline["setOptions"]>) => ReturnType<naver.maps.Polyline["setOptions"]> \| undefined`         | 옵션 일괄/부분 설정             |
| `setPath`        | `(...args: Parameters<naver.maps.Polyline["setPath"]>) => ReturnType<naver.maps.Polyline["setPath"]> \| undefined`               | path 설정                       |
| `setStyles`      | `(...args: Parameters<naver.maps.Polyline["setStyles"]>) => ReturnType<naver.maps.Polyline["setStyles"]> \| undefined`           | 스타일 일괄/부분 설정           |
| `setVisible`     | `(...args: Parameters<naver.maps.Polyline["setVisible"]>) => ReturnType<naver.maps.Polyline["setVisible"]> \| undefined`         | 노출 여부 설정                  |
| `setZIndex`      | `(...args: Parameters<naver.maps.Polyline["setZIndex"]>) => ReturnType<naver.maps.Polyline["setZIndex"]> \| undefined`           | zIndex 설정                     |

## 동작 규칙

- 컴포넌트 언마운트 시 이벤트 리스너 정리 후 `setMap(null)`을 호출합니다.
- `map` prop을 지정하지 않으면 `NaverMapProvider` 컨텍스트의 map 인스턴스를 사용합니다.
