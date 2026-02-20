# Marker

`Marker`는 `naver.maps.Marker`를 React 컴포넌트로 감싼 오버레이 API입니다.

## 공개 타입

```ts
interface MarkerOverlayProps {
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
}

interface MarkerLifecycleProps {
  children?: React.ReactNode;
  onMarkerReady?: (marker: naver.maps.Marker) => void;
  onMarkerDestroy?: () => void;
  onMarkerError?: (error: Error) => void;
}

export type MarkerProps = MarkerOverlayProps & MarkerLifecycleProps;
```

## 프로퍼티

| Prop              | Type                                                                             | Description                  |
| ----------------- | -------------------------------------------------------------------------------- | ---------------------------- |
| `position`        | `naver.maps.Coord \| naver.maps.CoordLiteral`                                    | 마커 좌표(필수)              |
| `icon`            | `string \| naver.maps.ImageIcon \| naver.maps.SymbolIcon \| naver.maps.HtmlIcon` | 마커 아이콘                  |
| `children`        | `React.ReactNode`                                                                | HTML 기반 커스텀 마커 콘텐츠 |
| `animation`       | `naver.maps.Animation`                                                           | 마커 애니메이션              |
| `shape`           | `naver.maps.MarkerShape`                                                         | 마커 인터랙션 영역           |
| `title`           | `string`                                                                         | 마커 툴팁 텍스트             |
| `cursor`          | `string`                                                                         | 마우스 오버 커서             |
| `clickable`       | `boolean`                                                                        | 클릭 가능 여부               |
| `draggable`       | `boolean`                                                                        | 드래그 가능 여부             |
| `visible`         | `boolean`                                                                        | 표시 여부                    |
| `zIndex`          | `number`                                                                         | 오버레이 우선순위            |
| `onMarkerReady`   | `(marker: naver.maps.Marker) => void`                                            | 인스턴스 생성 완료 콜백      |
| `onMarkerDestroy` | `() => void`                                                                     | 인스턴스 정리 완료 콜백      |
| `onMarkerError`   | `(error: Error) => void`                                                         | 생성 실패 콜백               |

## 동작 규칙

- `children`이 있으면 HTML 아이콘으로 렌더링합니다.
- `icon`과 `children`이 동시에 전달되면, 콘텐츠는 `children` 기준으로 렌더링하고 아이콘 객체의 `anchor`/`size`를 함께 반영합니다.
- 언마운트 시 마커 리스너 정리 및 `setMap(null)`을 수행합니다.
