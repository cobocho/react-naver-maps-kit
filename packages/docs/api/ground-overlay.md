# GroundOverlay

`GroundOverlay`는 `naver.maps.GroundOverlay`를 React 컴포넌트로 감싼 오버레이 API입니다.

## 공개 타입

```ts
interface GroundOverlayOptionProps {
  map?: naver.maps.Map | null;
  url: string;
  bounds: naver.maps.Bounds | naver.maps.BoundsLiteral;
  clickable?: boolean;
  opacity?: number;
}

interface GroundOverlayLifecycleProps {
  onGroundOverlayReady?: (groundOverlay: naver.maps.GroundOverlay) => void;
  onGroundOverlayDestroy?: () => void;
  onGroundOverlayError?: (error: Error) => void;
}

interface GroundOverlayEventProps {
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
  onMapChanged?: (map: naver.maps.Map | null) => void;
  onOpacityChanged?: (opacity: number) => void;
}

export type GroundOverlayProps = GroundOverlayOptionProps &
  GroundOverlayLifecycleProps &
  GroundOverlayEventProps;
```

## 옵션 프로퍼티

| Prop        | Type                                            | Default      | Description                                                     |
| ----------- | ----------------------------------------------- | ------------ | --------------------------------------------------------------- |
| `map`       | `naver.maps.Map \| null`                        | -            | 오버레이를 바인딩할 지도 인스턴스 (미지정 시 Provider map 사용) |
| `url`       | `string`                                        | - (required) | 표시할 지상 오버레이 이미지 URL                                 |
| `bounds`    | `naver.maps.Bounds \| naver.maps.BoundsLiteral` | - (required) | 이미지가 덮일 지리적 경계(bounds)                               |
| `clickable` | `boolean`                                       | -            | 클릭/포인터 이벤트 수신 여부                                    |
| `opacity`   | `number`                                        | -            | 오버레이 투명도                                                 |

## 생명주기 프로퍼티

| Prop                     | Type                                                | Description                |
| ------------------------ | --------------------------------------------------- | -------------------------- |
| `onGroundOverlayReady`   | `(groundOverlay: naver.maps.GroundOverlay) => void` | 인스턴스 생성 완료 시 호출 |
| `onGroundOverlayDestroy` | `() => void`                                        | 인스턴스 정리 완료 시 호출 |
| `onGroundOverlayError`   | `(error: Error) => void`                            | 인스턴스 생성 실패 시 호출 |

## 이벤트 프로퍼티

| Prop                 | Type                                       | Description                             |
| -------------------- | ------------------------------------------ | --------------------------------------- |
| `onClick`            | `(event: naver.maps.PointerEvent) => void` | 오버레이 클릭 시 호출                   |
| `onDblClick`         | `(event: naver.maps.PointerEvent) => void` | 오버레이 더블클릭 시 호출               |
| `onMouseDown`        | `(event: naver.maps.PointerEvent) => void` | 마우스 버튼 다운 시 호출                |
| `onMouseMove`        | `(event: naver.maps.PointerEvent) => void` | 마우스 이동 시 호출                     |
| `onMouseOut`         | `(event: naver.maps.PointerEvent) => void` | 포인터가 오버레이 밖으로 나갈 때 호출   |
| `onMouseOver`        | `(event: naver.maps.PointerEvent) => void` | 포인터가 오버레이 안으로 들어올 때 호출 |
| `onMouseUp`          | `(event: naver.maps.PointerEvent) => void` | 마우스 버튼 업 시 호출                  |
| `onRightClick`       | `(event: naver.maps.PointerEvent) => void` | 우클릭 시 호출                          |
| `onTouchStart`       | `(event: naver.maps.PointerEvent) => void` | 터치 시작 시 호출                       |
| `onTouchMove`        | `(event: naver.maps.PointerEvent) => void` | 터치 이동 시 호출                       |
| `onTouchEnd`         | `(event: naver.maps.PointerEvent) => void` | 터치 종료 시 호출                       |
| `onBoundsChanged`    | `(bounds: naver.maps.Bounds) => void`      | 오버레이 경계(bounds) 변경 시 호출      |
| `onClickableChanged` | `(clickable: boolean) => void`             | 클릭 가능 여부 변경 시 호출             |
| `onMapChanged`       | `(map: naver.maps.Map \| null) => void`    | 바인딩된 map 변경 시 호출               |
| `onOpacityChanged`   | `(opacity: number) => void`                | opacity 변경 시 호출                    |

## Ref 메서드

| Method          | Signature                                                                                                                                | Description                          |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| `getInstance`   | `() => naver.maps.GroundOverlay \| null`                                                                                                 | 내부 `GroundOverlay` 인스턴스를 반환 |
| `getBounds`     | `(...args: Parameters<naver.maps.GroundOverlay["getBounds"]>) => ReturnType<naver.maps.GroundOverlay["getBounds"]> \| undefined`         | 경계(bounds) 조회                    |
| `getMap`        | `(...args: Parameters<naver.maps.GroundOverlay["getMap"]>) => ReturnType<naver.maps.GroundOverlay["getMap"]> \| undefined`               | 바인딩 map 조회                      |
| `getOpacity`    | `(...args: Parameters<naver.maps.GroundOverlay["getOpacity"]>) => ReturnType<naver.maps.GroundOverlay["getOpacity"]> \| undefined`       | opacity 조회                         |
| `getPanes`      | `(...args: Parameters<naver.maps.GroundOverlay["getPanes"]>) => ReturnType<naver.maps.GroundOverlay["getPanes"]> \| undefined`           | panes 조회                           |
| `getProjection` | `(...args: Parameters<naver.maps.GroundOverlay["getProjection"]>) => ReturnType<naver.maps.GroundOverlay["getProjection"]> \| undefined` | projection 조회                      |
| `getUrl`        | `(...args: Parameters<naver.maps.GroundOverlay["getUrl"]>) => ReturnType<naver.maps.GroundOverlay["getUrl"]> \| undefined`               | 이미지 URL 조회                      |
| `setMap`        | `(...args: Parameters<naver.maps.GroundOverlay["setMap"]>) => ReturnType<naver.maps.GroundOverlay["setMap"]> \| undefined`               | map 바인딩/해제                      |
| `setOpacity`    | `(...args: Parameters<naver.maps.GroundOverlay["setOpacity"]>) => ReturnType<naver.maps.GroundOverlay["setOpacity"]> \| undefined`       | opacity 설정                         |
| `setUrl`        | `(url: string) => void \| undefined`                                                                                                     | 이미지 URL 설정                      |

## 동작 규칙

- 컴포넌트 언마운트 시 이벤트 리스너 정리 후 `setMap(null)`을 호출합니다.
- `map` prop을 지정하지 않으면 가장 가까운 `NaverMap` 또는 `Panorama`의 인스턴스를 자동으로 사용합니다.
