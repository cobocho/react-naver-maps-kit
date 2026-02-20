# InfoWindow

`InfoWindow`는 `naver.maps.InfoWindow`를 React 컴포넌트로 감싼 오버레이 API입니다.

## 공개 타입

```ts
interface InfoWindowOptionProps {
  position?: naver.maps.Coord | naver.maps.CoordLiteral;
  content?: string | HTMLElement;
  zIndex?: number;
  maxWidth?: number;
  pixelOffset?: naver.maps.Point | naver.maps.PointLiteral;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  disableAutoPan?: boolean;
  disableAnchor?: boolean;
  anchorSkew?: boolean;
  anchorSize?: naver.maps.Size | naver.maps.SizeLiteral;
  anchorColor?: string;
  autoPanPadding?: naver.maps.Point | naver.maps.PointLiteral;
}

interface InfoWindowLifecycleProps {
  anchor?: naver.maps.Coord | naver.maps.CoordLiteral | naver.maps.Marker;
  visible?: boolean;
  children?: React.ReactNode;
  onInfoWindowReady?: (infoWindow: naver.maps.InfoWindow) => void;
  onInfoWindowDestroy?: () => void;
  onInfoWindowError?: (error: Error) => void;
}

interface InfoWindowEventProps {
  onOpen?: (pointerEvent: naver.maps.PointerEvent) => void;
  onClose?: (pointerEvent: naver.maps.PointerEvent) => void;
  onAnchorColorChanged?: (anchorColor: string) => void;
  onAnchorSizeChanged?: (anchorSize: naver.maps.Size) => void;
  onAnchorSkewChanged?: (anchorSkew: boolean) => void;
  onBackgroundColorChanged?: (backgroundColor: string) => void;
  onBorderColorChanged?: (borderColor: string) => void;
  onBorderWidthChanged?: (borderWidth: number) => void;
  onContentChanged?: (content: string | HTMLElement) => void;
  onDisableAnchorChanged?: (disableAnchor: boolean) => void;
  onDisableAutoPanChanged?: (disableAutoPan: boolean) => void;
  onMaxWidthChanged?: (maxWidth: number) => void;
  onPixelOffsetChanged?: (pixelOffset: naver.maps.Point) => void;
  onPositionChanged?: (position: naver.maps.Coord) => void;
  onZIndexChanged?: (zIndex: number) => void;
}

export type InfoWindowProps = InfoWindowOptionProps &
  InfoWindowLifecycleProps &
  InfoWindowEventProps;

export interface InfoWindowRef {
  getInstance: () => naver.maps.InfoWindow | null;
  close: (
    ...args: Parameters<naver.maps.InfoWindow["close"]>
  ) => ReturnType<naver.maps.InfoWindow["close"]> | undefined;
  getContent: (
    ...args: Parameters<naver.maps.InfoWindow["getContent"]>
  ) => ReturnType<naver.maps.InfoWindow["getContent"]> | undefined;
  getContentElement: (
    ...args: Parameters<naver.maps.InfoWindow["getContentElement"]>
  ) => ReturnType<naver.maps.InfoWindow["getContentElement"]> | undefined;
  getMap: (
    ...args: Parameters<naver.maps.InfoWindow["getMap"]>
  ) => ReturnType<naver.maps.InfoWindow["getMap"]> | undefined;
  getOptions: (
    ...args: Parameters<naver.maps.InfoWindow["getOptions"]>
  ) => ReturnType<naver.maps.InfoWindow["getOptions"]> | undefined;
  getPanes: (
    ...args: Parameters<naver.maps.InfoWindow["getPanes"]>
  ) => ReturnType<naver.maps.InfoWindow["getPanes"]> | undefined;
  getPosition: (
    ...args: Parameters<naver.maps.InfoWindow["getPosition"]>
  ) => ReturnType<naver.maps.InfoWindow["getPosition"]> | undefined;
  getProjection: (
    ...args: Parameters<naver.maps.InfoWindow["getProjection"]>
  ) => ReturnType<naver.maps.InfoWindow["getProjection"]> | undefined;
  getZIndex: (
    ...args: Parameters<naver.maps.InfoWindow["getZIndex"]>
  ) => ReturnType<naver.maps.InfoWindow["getZIndex"]> | undefined;
  open: (
    ...args: Parameters<naver.maps.InfoWindow["open"]>
  ) => ReturnType<naver.maps.InfoWindow["open"]> | undefined;
  setContent: (
    ...args: Parameters<naver.maps.InfoWindow["setContent"]>
  ) => ReturnType<naver.maps.InfoWindow["setContent"]> | undefined;
  setMap: (
    ...args: Parameters<naver.maps.InfoWindow["setMap"]>
  ) => ReturnType<naver.maps.InfoWindow["setMap"]> | undefined;
  setOptions: (
    ...args: Parameters<naver.maps.InfoWindow["setOptions"]>
  ) => ReturnType<naver.maps.InfoWindow["setOptions"]> | undefined;
  setPosition: (
    ...args: Parameters<naver.maps.InfoWindow["setPosition"]>
  ) => ReturnType<naver.maps.InfoWindow["setPosition"]> | undefined;
  setZIndex: (
    ...args: Parameters<naver.maps.InfoWindow["setZIndex"]>
  ) => ReturnType<naver.maps.InfoWindow["setZIndex"]> | undefined;
}
```

## 옵션 프로퍼티

| Prop              | Type                                                               | Description               |
| ----------------- | ------------------------------------------------------------------ | ------------------------- |
| `position`        | `naver.maps.Coord \| naver.maps.CoordLiteral`                      | 정보 창 위치              |
| `content`         | `string \| HTMLElement`                                            | 정보 창 콘텐츠            |
| `children`        | `React.ReactNode`                                                  | React 기반 콘텐츠         |
| `anchor`          | `naver.maps.Coord \| naver.maps.CoordLiteral \| naver.maps.Marker` | 정보 창 앵커              |
| `visible`         | `boolean`                                                          | 표시 여부 (`true` 기본값) |
| `zIndex`          | `number`                                                           | 쌓임 순서                 |
| `maxWidth`        | `number`                                                           | 최대 너비(px)             |
| `pixelOffset`     | `naver.maps.Point \| naver.maps.PointLiteral`                      | 꼬리 오프셋               |
| `backgroundColor` | `string`                                                           | 배경색                    |
| `borderColor`     | `string`                                                           | 테두리 색상               |
| `borderWidth`     | `number`                                                           | 테두리 두께               |
| `disableAutoPan`  | `boolean`                                                          | 자동 패닝 비활성화        |
| `disableAnchor`   | `boolean`                                                          | 꼬리 비활성화             |
| `anchorSkew`      | `boolean`                                                          | 꼬리 기울임 활성화        |
| `anchorSize`      | `naver.maps.Size \| naver.maps.SizeLiteral`                        | 꼬리 크기                 |
| `anchorColor`     | `string`                                                           | 꼬리 색상                 |
| `autoPanPadding`  | `naver.maps.Point \| naver.maps.PointLiteral`                      | 자동 패닝 여백            |

## 생명주기 프로퍼티

| Prop                  | Type                                          | Description             |
| --------------------- | --------------------------------------------- | ----------------------- |
| `onInfoWindowReady`   | `(infoWindow: naver.maps.InfoWindow) => void` | 인스턴스 생성 완료 콜백 |
| `onInfoWindowDestroy` | `() => void`                                  | 인스턴스 정리 완료 콜백 |
| `onInfoWindowError`   | `(error: Error) => void`                      | 생성 실패 콜백          |

## 이벤트 프로퍼티

| Prop                       | Type                                              | Description                  |
| -------------------------- | ------------------------------------------------- | ---------------------------- |
| `onOpen`                   | `(pointerEvent: naver.maps.PointerEvent) => void` | 정보 창 열림 이벤트          |
| `onClose`                  | `(pointerEvent: naver.maps.PointerEvent) => void` | 정보 창 닫힘 이벤트          |
| `onAnchorColorChanged`     | `(anchorColor: string) => void`                   | 꼬리 색상 변경 이벤트        |
| `onAnchorSizeChanged`      | `(anchorSize: naver.maps.Size) => void`           | 꼬리 크기 변경 이벤트        |
| `onAnchorSkewChanged`      | `(anchorSkew: boolean) => void`                   | 꼬리 기울임 옵션 변경 이벤트 |
| `onBackgroundColorChanged` | `(backgroundColor: string) => void`               | 배경색 변경 이벤트           |
| `onBorderColorChanged`     | `(borderColor: string) => void`                   | 테두리 색상 변경 이벤트      |
| `onBorderWidthChanged`     | `(borderWidth: number) => void`                   | 테두리 두께 변경 이벤트      |
| `onContentChanged`         | `(content: string \| HTMLElement) => void`        | 콘텐츠 변경 이벤트           |
| `onDisableAnchorChanged`   | `(disableAnchor: boolean) => void`                | 꼬리 사용 옵션 변경 이벤트   |
| `onDisableAutoPanChanged`  | `(disableAutoPan: boolean) => void`               | 자동 패닝 옵션 변경 이벤트   |
| `onMaxWidthChanged`        | `(maxWidth: number) => void`                      | 최대 너비 변경 이벤트        |
| `onPixelOffsetChanged`     | `(pixelOffset: naver.maps.Point) => void`         | 픽셀 오프셋 변경 이벤트      |
| `onPositionChanged`        | `(position: naver.maps.Coord) => void`            | 위치 변경 이벤트             |
| `onZIndexChanged`          | `(zIndex: number) => void`                        | zIndex 변경 이벤트           |

## Ref 메서드

| Method              | Signature                                                                                                                                  | Description        |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------ |
| `getInstance`       | `() => naver.maps.InfoWindow \| null`                                                                                                      | 내부 인스턴스 반환 |
| `close`             | `(...args: Parameters<naver.maps.InfoWindow["close"]>) => ReturnType<naver.maps.InfoWindow["close"]> \| undefined`                         | 정보 창 닫기       |
| `getContent`        | `(...args: Parameters<naver.maps.InfoWindow["getContent"]>) => ReturnType<naver.maps.InfoWindow["getContent"]> \| undefined`               | 콘텐츠 조회        |
| `getContentElement` | `(...args: Parameters<naver.maps.InfoWindow["getContentElement"]>) => ReturnType<naver.maps.InfoWindow["getContentElement"]> \| undefined` | 콘텐츠 DOM 조회    |
| `getMap`            | `(...args: Parameters<naver.maps.InfoWindow["getMap"]>) => ReturnType<naver.maps.InfoWindow["getMap"]> \| undefined`                       | map 조회           |
| `getOptions`        | `(...args: Parameters<naver.maps.InfoWindow["getOptions"]>) => ReturnType<naver.maps.InfoWindow["getOptions"]> \| undefined`               | 옵션 조회          |
| `getPanes`          | `(...args: Parameters<naver.maps.InfoWindow["getPanes"]>) => ReturnType<naver.maps.InfoWindow["getPanes"]> \| undefined`                   | panes 조회         |
| `getPosition`       | `(...args: Parameters<naver.maps.InfoWindow["getPosition"]>) => ReturnType<naver.maps.InfoWindow["getPosition"]> \| undefined`             | 위치 조회          |
| `getProjection`     | `(...args: Parameters<naver.maps.InfoWindow["getProjection"]>) => ReturnType<naver.maps.InfoWindow["getProjection"]> \| undefined`         | projection 조회    |
| `getZIndex`         | `(...args: Parameters<naver.maps.InfoWindow["getZIndex"]>) => ReturnType<naver.maps.InfoWindow["getZIndex"]> \| undefined`                 | zIndex 조회        |
| `open`              | `(...args: Parameters<naver.maps.InfoWindow["open"]>) => ReturnType<naver.maps.InfoWindow["open"]> \| undefined`                           | 정보 창 열기       |
| `setContent`        | `(...args: Parameters<naver.maps.InfoWindow["setContent"]>) => ReturnType<naver.maps.InfoWindow["setContent"]> \| undefined`               | 콘텐츠 설정        |
| `setMap`            | `(...args: Parameters<naver.maps.InfoWindow["setMap"]>) => ReturnType<naver.maps.InfoWindow["setMap"]> \| undefined`                       | map 설정           |
| `setOptions`        | `(...args: Parameters<naver.maps.InfoWindow["setOptions"]>) => ReturnType<naver.maps.InfoWindow["setOptions"]> \| undefined`               | 옵션 설정          |
| `setPosition`       | `(...args: Parameters<naver.maps.InfoWindow["setPosition"]>) => ReturnType<naver.maps.InfoWindow["setPosition"]> \| undefined`             | 위치 설정          |
| `setZIndex`         | `(...args: Parameters<naver.maps.InfoWindow["setZIndex"]>) => ReturnType<naver.maps.InfoWindow["setZIndex"]> \| undefined`                 | zIndex 설정        |

## 동작 규칙

- `children`이 있으면 `content` 대신 React 콘텐츠를 우선 사용합니다.
- `visible`이 `true`일 때 `anchor` 또는 `position` 기준으로 열립니다.
- 언마운트 시 리스너 정리 후 `close()`와 `setMap(null)`을 수행합니다.
