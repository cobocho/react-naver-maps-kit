# Marker

`Marker`는 `naver.maps.Marker`를 React 컴포넌트로 감싼 오버레이 API입니다.

## 공개 타입

```ts
interface MarkerOverlayProps {
  map?: naver.maps.Map | null;
  position: naver.maps.Coord | naver.maps.CoordLiteral;
  icon?: string | naver.maps.ImageIcon | naver.maps.SymbolIcon | naver.maps.HtmlIcon;
  animation?: naver.maps.Animation;
  shape?: naver.maps.MarkerShape;
  title?: string;
  cursor?: string;
  clickable?: boolean;
  draggable?: boolean;
  visible?: boolean;
  zIndex?: number;
  collisionBehavior?: boolean;
  collisionBoxSize?: naver.maps.Size | naver.maps.SizeLiteral;

  /** MarkerClusterer에서 마커를 식별하는 고유 ID. 생략하면 자동 생성됩니다. */
  clustererItemId?: string | number;
  /** onClusterClick 콜백에서 접근할 커스텀 데이터 */
  item?: unknown;
}

interface MarkerLifecycleProps {
  children?: React.ReactNode;
  onMarkerReady?: (marker: naver.maps.Marker) => void;
  onMarkerDestroy?: () => void;
  onMarkerError?: (error: Error) => void;
}

interface MarkerEventProps {
  onClick?: (event: naver.maps.PointerEvent) => void;
  onDblClick?: (event: naver.maps.PointerEvent) => void;
  onRightClick?: (event: naver.maps.PointerEvent) => void;
  onMouseDown?: (event: naver.maps.PointerEvent) => void;
  onMouseUp?: (event: naver.maps.PointerEvent) => void;
  onTouchStart?: (event: naver.maps.PointerEvent) => void;
  onTouchEnd?: (event: naver.maps.PointerEvent) => void;
  onDragStart?: (event: naver.maps.PointerEvent) => void;
  onDrag?: (event: naver.maps.PointerEvent) => void;
  onDragEnd?: (event: naver.maps.PointerEvent) => void;
  onClickableChanged?: (clickable: boolean) => void;
  onCursorChanged?: (cursor: string) => void;
  onDraggableChanged?: (draggable: boolean) => void;
  onIconChanged?: (
    icon: string | naver.maps.ImageIcon | naver.maps.SymbolIcon | naver.maps.HtmlIcon
  ) => void;
  onIconLoaded?: (marker: naver.maps.Marker) => void;
  onPositionChanged?: (position: naver.maps.Coord) => void;
  onShapeChanged?: (shape: naver.maps.MarkerShape) => void;
  onTitleChanged?: (title: string) => void;
  onVisibleChanged?: (visible: boolean) => void;
  onZIndexChanged?: (zIndex: number) => void;
}

export type MarkerProps = MarkerOverlayProps & MarkerLifecycleProps & MarkerEventProps;

export interface MarkerRef {
  getInstance: () => naver.maps.Marker | null;
  getAnimation: (
    ...args: Parameters<naver.maps.Marker["getAnimation"]>
  ) => ReturnType<naver.maps.Marker["getAnimation"]> | undefined;
  getClickable: (
    ...args: Parameters<naver.maps.Marker["getClickable"]>
  ) => ReturnType<naver.maps.Marker["getClickable"]> | undefined;
  getCursor: (
    ...args: Parameters<naver.maps.Marker["getCursor"]>
  ) => ReturnType<naver.maps.Marker["getCursor"]> | undefined;
  getDraggable: (
    ...args: Parameters<naver.maps.Marker["getDraggable"]>
  ) => ReturnType<naver.maps.Marker["getDraggable"]> | undefined;
  getDrawingRect: (
    ...args: Parameters<naver.maps.Marker["getDrawingRect"]>
  ) => ReturnType<naver.maps.Marker["getDrawingRect"]> | undefined;
  getElement: (
    ...args: Parameters<naver.maps.Marker["getElement"]>
  ) => ReturnType<naver.maps.Marker["getElement"]> | undefined;
  getIcon: (
    ...args: Parameters<naver.maps.Marker["getIcon"]>
  ) => ReturnType<naver.maps.Marker["getIcon"]> | undefined;
  getMap: (
    ...args: Parameters<naver.maps.Marker["getMap"]>
  ) => ReturnType<naver.maps.Marker["getMap"]> | undefined;
  getOptions: (
    ...args: Parameters<naver.maps.Marker["getOptions"]>
  ) => ReturnType<naver.maps.Marker["getOptions"]> | undefined;
  getPanes: (
    ...args: Parameters<naver.maps.Marker["getPanes"]>
  ) => ReturnType<naver.maps.Marker["getPanes"]> | undefined;
  getPosition: (
    ...args: Parameters<naver.maps.Marker["getPosition"]>
  ) => ReturnType<naver.maps.Marker["getPosition"]> | undefined;
  getProjection: (
    ...args: Parameters<naver.maps.Marker["getProjection"]>
  ) => ReturnType<naver.maps.Marker["getProjection"]> | undefined;
  getShape: (
    ...args: Parameters<naver.maps.Marker["getShape"]>
  ) => ReturnType<naver.maps.Marker["getShape"]> | undefined;
  getTitle: (
    ...args: Parameters<naver.maps.Marker["getTitle"]>
  ) => ReturnType<naver.maps.Marker["getTitle"]> | undefined;
  getVisible: (
    ...args: Parameters<naver.maps.Marker["getVisible"]>
  ) => ReturnType<naver.maps.Marker["getVisible"]> | undefined;
  getZIndex: (
    ...args: Parameters<naver.maps.Marker["getZIndex"]>
  ) => ReturnType<naver.maps.Marker["getZIndex"]> | undefined;
  setAnimation: (
    ...args: Parameters<naver.maps.Marker["setAnimation"]>
  ) => ReturnType<naver.maps.Marker["setAnimation"]> | undefined;
  setClickable: (
    ...args: Parameters<naver.maps.Marker["setClickable"]>
  ) => ReturnType<naver.maps.Marker["setClickable"]> | undefined;
  setCursor: (
    ...args: Parameters<naver.maps.Marker["setCursor"]>
  ) => ReturnType<naver.maps.Marker["setCursor"]> | undefined;
  setDraggable: (
    ...args: Parameters<naver.maps.Marker["setDraggable"]>
  ) => ReturnType<naver.maps.Marker["setDraggable"]> | undefined;
  setIcon: (
    ...args: Parameters<naver.maps.Marker["setIcon"]>
  ) => ReturnType<naver.maps.Marker["setIcon"]> | undefined;
  setMap: (
    ...args: Parameters<naver.maps.Marker["setMap"]>
  ) => ReturnType<naver.maps.Marker["setMap"]> | undefined;
  setOptions: (
    ...args: Parameters<naver.maps.Marker["setOptions"]>
  ) => ReturnType<naver.maps.Marker["setOptions"]> | undefined;
  setPosition: (
    ...args: Parameters<naver.maps.Marker["setPosition"]>
  ) => ReturnType<naver.maps.Marker["setPosition"]> | undefined;
  setShape: (
    ...args: Parameters<naver.maps.Marker["setShape"]>
  ) => ReturnType<naver.maps.Marker["setShape"]> | undefined;
  setTitle: (
    ...args: Parameters<naver.maps.Marker["setTitle"]>
  ) => ReturnType<naver.maps.Marker["setTitle"]> | undefined;
  setVisible: (
    ...args: Parameters<naver.maps.Marker["setVisible"]>
  ) => ReturnType<naver.maps.Marker["setVisible"]> | undefined;
  setZIndex: (
    ...args: Parameters<naver.maps.Marker["setZIndex"]>
  ) => ReturnType<naver.maps.Marker["setZIndex"]> | undefined;
}
```

## 옵션 프로퍼티

| Prop                | Type                                                                             | Description                                                      |
| ------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `map`               | `naver.maps.Map \| null`                                                         | 마커를 바인딩할 지도 인스턴스(지정하지 않으면 Provider map 사용) |
| `position`          | `naver.maps.Coord \| naver.maps.CoordLiteral`                                    | 마커 좌표(필수)                                                  |
| `icon`              | `string \| naver.maps.ImageIcon \| naver.maps.SymbolIcon \| naver.maps.HtmlIcon` | 마커 아이콘                                                      |
| `children`          | `React.ReactNode`                                                                | HTML 기반 커스텀 마커 콘텐츠                                     |
| `animation`         | `naver.maps.Animation`                                                           | 마커 애니메이션                                                  |
| `shape`             | `naver.maps.MarkerShape`                                                         | 마커 인터랙션 영역                                               |
| `title`             | `string`                                                                         | 마커 툴팁 텍스트                                                 |
| `cursor`            | `string`                                                                         | 마우스 오버 커서                                                 |
| `clickable`         | `boolean`                                                                        | 클릭 가능 여부                                                   |
| `draggable`         | `boolean`                                                                        | 드래그 가능 여부                                                 |
| `visible`           | `boolean`                                                                        | 표시 여부                                                        |
| `zIndex`            | `number`                                                                         | 마커 z-index                                                     |
| `collisionBehavior` | `boolean`                                                                        | GL 환경 마커 충돌 처리 여부                                      |
| `collisionBoxSize`  | `naver.maps.Size \| naver.maps.SizeLiteral`                                      | GL 환경 충돌 처리 박스 크기                                      |
| `clustererItemId`   | `string \| number`                                                               | `MarkerClusterer` 사용 시 마커 식별 ID. 생략하면 자동 생성       |
| `item`              | `unknown`                                                                        | `onClusterClick` 콜백에서 접근할 커스텀 데이터                   |

## 생명주기 프로퍼티

| Prop              | Type                                  | Description             |
| ----------------- | ------------------------------------- | ----------------------- |
| `onMarkerReady`   | `(marker: naver.maps.Marker) => void` | 인스턴스 생성 완료 콜백 |
| `onMarkerDestroy` | `() => void`                          | 인스턴스 정리 완료 콜백 |
| `onMarkerError`   | `(error: Error) => void`              | 생성 실패 콜백          |

## 이벤트 프로퍼티

| Prop                 | Type                                                                                             | Description                  |
| -------------------- | ------------------------------------------------------------------------------------------------ | ---------------------------- |
| `onClick`            | `(event: naver.maps.PointerEvent) => void`                                                       | 클릭 이벤트                  |
| `onDblClick`         | `(event: naver.maps.PointerEvent) => void`                                                       | 더블 클릭 이벤트             |
| `onRightClick`       | `(event: naver.maps.PointerEvent) => void`                                                       | 우클릭 이벤트                |
| `onMouseDown`        | `(event: naver.maps.PointerEvent) => void`                                                       | 마우스 다운 이벤트           |
| `onMouseUp`          | `(event: naver.maps.PointerEvent) => void`                                                       | 마우스 업 이벤트             |
| `onTouchStart`       | `(event: naver.maps.PointerEvent) => void`                                                       | 터치 시작 이벤트             |
| `onTouchEnd`         | `(event: naver.maps.PointerEvent) => void`                                                       | 터치 종료 이벤트             |
| `onDragStart`        | `(event: naver.maps.PointerEvent) => void`                                                       | 드래그 시작 이벤트           |
| `onDrag`             | `(event: naver.maps.PointerEvent) => void`                                                       | 드래그 이벤트                |
| `onDragEnd`          | `(event: naver.maps.PointerEvent) => void`                                                       | 드래그 종료 이벤트           |
| `onClickableChanged` | `(clickable: boolean) => void`                                                                   | clickable 변경 이벤트        |
| `onCursorChanged`    | `(cursor: string) => void`                                                                       | cursor 변경 이벤트           |
| `onDraggableChanged` | `(draggable: boolean) => void`                                                                   | draggable 변경 이벤트        |
| `onIconChanged`      | `(icon: string \| naver.maps.ImageIcon \| naver.maps.SymbolIcon \| naver.maps.HtmlIcon) => void` | icon 변경 이벤트             |
| `onIconLoaded`       | `(marker: naver.maps.Marker) => void`                                                            | 이미지 icon 로드 완료 이벤트 |
| `onPositionChanged`  | `(position: naver.maps.Coord) => void`                                                           | position 변경 이벤트         |
| `onShapeChanged`     | `(shape: naver.maps.MarkerShape) => void`                                                        | shape 변경 이벤트            |
| `onTitleChanged`     | `(title: string) => void`                                                                        | title 변경 이벤트            |
| `onVisibleChanged`   | `(visible: boolean) => void`                                                                     | visible 변경 이벤트          |
| `onZIndexChanged`    | `(zIndex: number) => void`                                                                       | zIndex 변경 이벤트           |

## Ref 메서드

| Method           | Signature                                                                                                                    | Description                         |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| `getInstance`    | `() => naver.maps.Marker \| null`                                                                                            | 내부 마커 인스턴스를 반환합니다.    |
| `getAnimation`   | `(...args: Parameters<naver.maps.Marker["getAnimation"]>) => ReturnType<naver.maps.Marker["getAnimation"]> \| undefined`     | 현재 애니메이션을 반환합니다.       |
| `getClickable`   | `(...args: Parameters<naver.maps.Marker["getClickable"]>) => ReturnType<naver.maps.Marker["getClickable"]> \| undefined`     | clickable 상태를 반환합니다.        |
| `getCursor`      | `(...args: Parameters<naver.maps.Marker["getCursor"]>) => ReturnType<naver.maps.Marker["getCursor"]> \| undefined`           | 커서 설정값을 반환합니다.           |
| `getDraggable`   | `(...args: Parameters<naver.maps.Marker["getDraggable"]>) => ReturnType<naver.maps.Marker["getDraggable"]> \| undefined`     | draggable 상태를 반환합니다.        |
| `getDrawingRect` | `(...args: Parameters<naver.maps.Marker["getDrawingRect"]>) => ReturnType<naver.maps.Marker["getDrawingRect"]> \| undefined` | 마커 그리기 경계 영역을 반환합니다. |
| `getElement`     | `(...args: Parameters<naver.maps.Marker["getElement"]>) => ReturnType<naver.maps.Marker["getElement"]> \| undefined`         | 마커 DOM 요소를 반환합니다.         |
| `getIcon`        | `(...args: Parameters<naver.maps.Marker["getIcon"]>) => ReturnType<naver.maps.Marker["getIcon"]> \| undefined`               | icon 설정을 반환합니다.             |
| `getMap`         | `(...args: Parameters<naver.maps.Marker["getMap"]>) => ReturnType<naver.maps.Marker["getMap"]> \| undefined`                 | 바인딩된 map을 반환합니다.          |
| `getOptions`     | `(...args: Parameters<naver.maps.Marker["getOptions"]>) => ReturnType<naver.maps.Marker["getOptions"]> \| undefined`         | marker 옵션을 반환합니다.           |
| `getPanes`       | `(...args: Parameters<naver.maps.Marker["getPanes"]>) => ReturnType<naver.maps.Marker["getPanes"]> \| undefined`             | map panes를 반환합니다.             |
| `getPosition`    | `(...args: Parameters<naver.maps.Marker["getPosition"]>) => ReturnType<naver.maps.Marker["getPosition"]> \| undefined`       | 좌표를 반환합니다.                  |
| `getProjection`  | `(...args: Parameters<naver.maps.Marker["getProjection"]>) => ReturnType<naver.maps.Marker["getProjection"]> \| undefined`   | projection을 반환합니다.            |
| `getShape`       | `(...args: Parameters<naver.maps.Marker["getShape"]>) => ReturnType<naver.maps.Marker["getShape"]> \| undefined`             | shape를 반환합니다.                 |
| `getTitle`       | `(...args: Parameters<naver.maps.Marker["getTitle"]>) => ReturnType<naver.maps.Marker["getTitle"]> \| undefined`             | title을 반환합니다.                 |
| `getVisible`     | `(...args: Parameters<naver.maps.Marker["getVisible"]>) => ReturnType<naver.maps.Marker["getVisible"]> \| undefined`         | visible 상태를 반환합니다.          |
| `getZIndex`      | `(...args: Parameters<naver.maps.Marker["getZIndex"]>) => ReturnType<naver.maps.Marker["getZIndex"]> \| undefined`           | zIndex를 반환합니다.                |
| `setAnimation`   | `(...args: Parameters<naver.maps.Marker["setAnimation"]>) => ReturnType<naver.maps.Marker["setAnimation"]> \| undefined`     | animation을 설정합니다.             |
| `setClickable`   | `(...args: Parameters<naver.maps.Marker["setClickable"]>) => ReturnType<naver.maps.Marker["setClickable"]> \| undefined`     | clickable을 설정합니다.             |
| `setCursor`      | `(...args: Parameters<naver.maps.Marker["setCursor"]>) => ReturnType<naver.maps.Marker["setCursor"]> \| undefined`           | cursor를 설정합니다.                |
| `setDraggable`   | `(...args: Parameters<naver.maps.Marker["setDraggable"]>) => ReturnType<naver.maps.Marker["setDraggable"]> \| undefined`     | draggable을 설정합니다.             |
| `setIcon`        | `(...args: Parameters<naver.maps.Marker["setIcon"]>) => ReturnType<naver.maps.Marker["setIcon"]> \| undefined`               | icon을 설정합니다.                  |
| `setMap`         | `(...args: Parameters<naver.maps.Marker["setMap"]>) => ReturnType<naver.maps.Marker["setMap"]> \| undefined`                 | map 바인딩을 설정합니다.            |
| `setOptions`     | `(...args: Parameters<naver.maps.Marker["setOptions"]>) => ReturnType<naver.maps.Marker["setOptions"]> \| undefined`         | marker 옵션을 설정합니다.           |
| `setPosition`    | `(...args: Parameters<naver.maps.Marker["setPosition"]>) => ReturnType<naver.maps.Marker["setPosition"]> \| undefined`       | 좌표를 설정합니다.                  |
| `setShape`       | `(...args: Parameters<naver.maps.Marker["setShape"]>) => ReturnType<naver.maps.Marker["setShape"]> \| undefined`             | shape를 설정합니다.                 |
| `setTitle`       | `(...args: Parameters<naver.maps.Marker["setTitle"]>) => ReturnType<naver.maps.Marker["setTitle"]> \| undefined`             | title을 설정합니다.                 |
| `setVisible`     | `(...args: Parameters<naver.maps.Marker["setVisible"]>) => ReturnType<naver.maps.Marker["setVisible"]> \| undefined`         | visible을 설정합니다.               |
| `setZIndex`      | `(...args: Parameters<naver.maps.Marker["setZIndex"]>) => ReturnType<naver.maps.Marker["setZIndex"]> \| undefined`           | zIndex를 설정합니다.                |

## 동작 규칙

- `children`이 있으면 HTML 아이콘(`content`)으로 렌더링합니다.
- `icon`과 `children`이 동시에 전달되면 `children` 콘텐츠를 우선 사용하고 `icon`의 `anchor`/`size`를 반영합니다.
- 언마운트 시 마커 리스너 정리 및 `setMap(null)`을 수행합니다.
