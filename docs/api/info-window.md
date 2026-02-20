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
}

interface InfoWindowLifecycleProps {
  anchor?: naver.maps.Coord | naver.maps.CoordLiteral | naver.maps.Marker;
  visible?: boolean;
  children?: React.ReactNode;
  onInfoWindowReady?: (infoWindow: naver.maps.InfoWindow) => void;
  onInfoWindowDestroy?: () => void;
  onInfoWindowError?: (error: Error) => void;
}

export type InfoWindowProps = InfoWindowOptionProps & InfoWindowLifecycleProps;
```

## 프로퍼티

| Prop                  | Type                                                               | Description               |
| --------------------- | ------------------------------------------------------------------ | ------------------------- |
| `position`            | `naver.maps.Coord \| naver.maps.CoordLiteral`                      | 인포윈도우 기준 좌표      |
| `content`             | `string \| HTMLElement`                                            | 인포윈도우 콘텐츠         |
| `children`            | `React.ReactNode`                                                  | React 기반 콘텐츠         |
| `anchor`              | `naver.maps.Coord \| naver.maps.CoordLiteral \| naver.maps.Marker` | 오픈 기준 앵커            |
| `visible`             | `boolean`                                                          | 표시 여부 (`true` 기본값) |
| `zIndex`              | `number`                                                           | 오버레이 우선순위         |
| `maxWidth`            | `number`                                                           | 최대 너비                 |
| `pixelOffset`         | `naver.maps.Point \| naver.maps.PointLiteral`                      | 앵커 오프셋               |
| `backgroundColor`     | `string`                                                           | 배경색                    |
| `borderColor`         | `string`                                                           | 테두리 색상               |
| `borderWidth`         | `number`                                                           | 테두리 두께               |
| `disableAutoPan`      | `boolean`                                                          | 자동 패닝 비활성화        |
| `disableAnchor`       | `boolean`                                                          | 기본 꼬리 비활성화        |
| `anchorSkew`          | `boolean`                                                          | 꼬리 스큐 효과            |
| `anchorSize`          | `naver.maps.Size \| naver.maps.SizeLiteral`                        | 꼬리 크기                 |
| `anchorColor`         | `string`                                                           | 꼬리 색상                 |
| `onInfoWindowReady`   | `(infoWindow: naver.maps.InfoWindow) => void`                      | 인스턴스 생성 완료 콜백   |
| `onInfoWindowDestroy` | `() => void`                                                       | 인스턴스 정리 완료 콜백   |
| `onInfoWindowError`   | `(error: Error) => void`                                           | 생성 실패 콜백            |

## 동작 규칙

- `children`이 있으면 `content` 대신 React 콘텐츠를 우선 사용합니다.
- `visible`이 `true`일 때 `anchor` 또는 `position` 기준으로 열립니다.
- 언마운트 시 리스너 정리 후 `close()`와 `setMap(null)`을 수행합니다.
