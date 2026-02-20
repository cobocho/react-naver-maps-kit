# NaverMap

`NaverMap`은 `naver.maps.Map`을 React 컴포넌트로 감싼 API입니다.

## 공개 타입

```ts
interface NaverMapOptionProps {
  background?: string;
  baseTileOpacity?: number;
  bounds?: naver.maps.Bounds | naver.maps.BoundsLiteral;
  center?: naver.maps.Coord | naver.maps.CoordLiteral;
  zoom?: number;
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
  onMapReady?: (map: naver.maps.Map) => void;
  onMapDestroy?: () => void;
  onMapError?: (error: Error) => void;
  retryOnError?: boolean;
  retryDelayMs?: number;
}

type NaverMapDivProps = Omit<React.ComponentPropsWithoutRef<"div">, "children" | "draggable">;

export type NaverMapProps = NaverMapOptionProps & NaverMapLifecycleProps & NaverMapDivProps;
```

## 지도 옵션 프로퍼티

| Prop                      | Type                                            | Description                    |
| ------------------------- | ----------------------------------------------- | ------------------------------ |
| `background`              | `string`                                        | 지도 배경 색상/이미지 URL      |
| `baseTileOpacity`         | `number`                                        | 기본 타일 레이어 불투명도(0~1) |
| `bounds`                  | `naver.maps.Bounds \| naver.maps.BoundsLiteral` | 초기 표시 경계                 |
| `center`                  | `naver.maps.Coord \| naver.maps.CoordLiteral`   | 지도 중심 좌표                 |
| `zoom`                    | `number`                                        | 지도 줌 레벨                   |
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

| Prop           | Type                            | Description                  |
| -------------- | ------------------------------- | ---------------------------- |
| `onMapReady`   | `(map: naver.maps.Map) => void` | 지도 인스턴스 생성 완료 콜백 |
| `onMapDestroy` | `() => void`                    | 지도 인스턴스 정리 완료 콜백 |
| `onMapError`   | `(error: Error) => void`        | 생성/업데이트 실패 콜백      |
| `retryOnError` | `boolean`                       | 에러 시 SDK 재시도 여부      |
| `retryDelayMs` | `number`                        | 재시도 지연(ms)              |

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
