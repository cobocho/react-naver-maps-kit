# GeoJson

`GeoJson`은 GeoJSON 데이터를 선언적으로 지도에 렌더링하는 컴포넌트입니다.
`naver.maps.Data`를 내부적으로 생성하고, `data` prop이 변경되면 자동으로 이전 Feature를 제거하고 새 Feature를 추가합니다.

## 공개 타입

```ts
interface GeoJsonOptionProps {
  data: naver.maps.GeoJSON;
  autoStyle?: boolean;
  style?: naver.maps.StyleOptions | naver.maps.StylingFunction;
}

interface GeoJsonLifecycleProps {
  onDataReady?: (data: naver.maps.Data) => void;
  onDataDestroy?: () => void;
  onDataError?: (error: Error) => void;
  onFeaturesAdded?: (features: naver.maps.Feature[]) => void;
}

interface GeoJsonEventProps {
  onAddFeature?: (event: naver.maps.FeatureEvent) => void;
  onRemoveFeature?: (event: naver.maps.FeatureEvent) => void;
  onPropertyChanged?: (event: naver.maps.PropertyEvent) => void;
  onClick?: (event: naver.maps.PointerEvent) => void;
  onDblClick?: (event: naver.maps.PointerEvent) => void;
  onRightClick?: (event: naver.maps.PointerEvent) => void;
  onMouseDown?: (event: naver.maps.PointerEvent) => void;
  onMouseUp?: (event: naver.maps.PointerEvent) => void;
  onMouseOver?: (event: naver.maps.PointerEvent) => void;
  onMouseOut?: (event: naver.maps.PointerEvent) => void;
}

export type GeoJsonProps = GeoJsonOptionProps & GeoJsonLifecycleProps & GeoJsonEventProps;

export interface GeoJsonRef {
  getInstance: () => naver.maps.Data | null;
  getAllFeature: (
    ...args: Parameters<naver.maps.Data["getAllFeature"]>
  ) => ReturnType<naver.maps.Data["getAllFeature"]> | undefined;
  getFeatureById: (
    ...args: Parameters<naver.maps.Data["getFeatureById"]>
  ) => ReturnType<naver.maps.Data["getFeatureById"]> | undefined;
  getMap: (
    ...args: Parameters<naver.maps.Data["getMap"]>
  ) => ReturnType<naver.maps.Data["getMap"]> | undefined;
  getStyle: (
    ...args: Parameters<naver.maps.Data["getStyle"]>
  ) => ReturnType<naver.maps.Data["getStyle"]> | undefined;
  overrideStyle: (
    ...args: Parameters<naver.maps.Data["overrideStyle"]>
  ) => ReturnType<naver.maps.Data["overrideStyle"]> | undefined;
  removeFeature: (
    ...args: Parameters<naver.maps.Data["removeFeature"]>
  ) => ReturnType<naver.maps.Data["removeFeature"]> | undefined;
  revertStyle: (
    ...args: Parameters<naver.maps.Data["revertStyle"]>
  ) => ReturnType<naver.maps.Data["revertStyle"]> | undefined;
  setStyle: (
    ...args: Parameters<naver.maps.Data["setStyle"]>
  ) => ReturnType<naver.maps.Data["setStyle"]> | undefined;
  toGeoJson: (
    ...args: Parameters<naver.maps.Data["toGeoJson"]>
  ) => ReturnType<naver.maps.Data["toGeoJson"]> | undefined;
}
```

## 옵션 프로퍼티

| Prop        | Type                                                   | Default | Description                                              |
| ----------- | ------------------------------------------------------ | ------- | -------------------------------------------------------- |
| `data`      | `naver.maps.GeoJSON`                                   | - (필수) | 렌더링할 GeoJSON 데이터 (Feature 또는 FeatureCollection) |
| `autoStyle` | `boolean`                                              | `true`  | 자동 스타일링 적용 여부                                   |
| `style`     | `naver.maps.StyleOptions \| naver.maps.StylingFunction` | -       | 데이터 레이어의 기본 스타일 또는 Feature별 스타일링 함수 |

### GeoJSON 데이터 형식

`data` prop은 GeoJSON `Feature` 또는 `FeatureCollection` 객체를 받습니다:

```ts
// Feature
{
  type: "Feature",
  properties: { name: "서울시청" },
  geometry: {
    type: "Point",
    coordinates: [126.978, 37.566]
  }
}

// FeatureCollection
{
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [...] } },
    { type: "Feature", properties: {}, geometry: { type: "Point", coordinates: [...] } }
  ]
}
```

지원하는 Geometry 타입: `Point`, `MultiPoint`, `LineString`, `MultiLineString`, `Polygon`, `MultiPolygon`

## 생명주기 프로퍼티

| Prop              | Type                                     | Description                              |
| ----------------- | ---------------------------------------- | ---------------------------------------- |
| `onDataReady`     | `(data: naver.maps.Data) => void`        | 내부 Data 인스턴스 생성 완료 시 호출     |
| `onDataDestroy`   | `() => void`                             | 인스턴스 정리 완료 시 호출               |
| `onDataError`     | `(error: Error) => void`                 | 인스턴스 생성 또는 데이터 추가 실패 시 호출 |
| `onFeaturesAdded` | `(features: naver.maps.Feature[]) => void` | GeoJSON에서 Feature 추가 완료 시 호출    |

## 이벤트 프로퍼티

| Prop                | Type                                           | Description                           |
| ------------------- | ---------------------------------------------- | ------------------------------------- |
| `onAddFeature`      | `(event: naver.maps.FeatureEvent) => void`     | Feature 추가 시 호출                  |
| `onRemoveFeature`   | `(event: naver.maps.FeatureEvent) => void`     | Feature 제거 시 호출                  |
| `onPropertyChanged` | `(event: naver.maps.PropertyEvent) => void`    | Feature 속성 변경 시 호출             |
| `onClick`           | `(event: naver.maps.PointerEvent) => void`     | Feature 클릭 시 호출                  |
| `onDblClick`        | `(event: naver.maps.PointerEvent) => void`     | Feature 더블클릭 시 호출              |
| `onRightClick`      | `(event: naver.maps.PointerEvent) => void`     | 우클릭 시 호출                        |
| `onMouseDown`       | `(event: naver.maps.PointerEvent) => void`     | 마우스 버튼 다운 시 호출              |
| `onMouseUp`         | `(event: naver.maps.PointerEvent) => void`     | 마우스 버튼 업 시 호출                |
| `onMouseOver`       | `(event: naver.maps.PointerEvent) => void`     | 포인터가 Feature 안으로 들어올 때 호출 |
| `onMouseOut`        | `(event: naver.maps.PointerEvent) => void`     | 포인터가 Feature 밖으로 나갈 때 호출  |

## Ref 메서드

| Method           | Signature                                                                                                                    | Description                    |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| `getInstance`    | `() => naver.maps.Data \| null`                                                                                              | 내부 `Data` 인스턴스를 반환    |
| `getAllFeature`   | `(...args: Parameters<naver.maps.Data["getAllFeature"]>) => ReturnType<naver.maps.Data["getAllFeature"]> \| undefined`         | 모든 Feature 조회              |
| `getFeatureById` | `(...args: Parameters<naver.maps.Data["getFeatureById"]>) => ReturnType<naver.maps.Data["getFeatureById"]> \| undefined`     | ID로 Feature 조회              |
| `getMap`         | `(...args: Parameters<naver.maps.Data["getMap"]>) => ReturnType<naver.maps.Data["getMap"]> \| undefined`                     | 바인딩 map 조회                |
| `getStyle`       | `(...args: Parameters<naver.maps.Data["getStyle"]>) => ReturnType<naver.maps.Data["getStyle"]> \| undefined`                 | 현재 스타일 조회               |
| `overrideStyle`  | `(...args: Parameters<naver.maps.Data["overrideStyle"]>) => ReturnType<naver.maps.Data["overrideStyle"]> \| undefined`       | 특정 Feature 스타일 덮어쓰기  |
| `removeFeature`  | `(...args: Parameters<naver.maps.Data["removeFeature"]>) => ReturnType<naver.maps.Data["removeFeature"]> \| undefined`       | Feature 제거                   |
| `revertStyle`    | `(...args: Parameters<naver.maps.Data["revertStyle"]>) => ReturnType<naver.maps.Data["revertStyle"]> \| undefined`           | 스타일 되돌리기                |
| `setStyle`       | `(...args: Parameters<naver.maps.Data["setStyle"]>) => ReturnType<naver.maps.Data["setStyle"]> \| undefined`                 | 스타일 설정                    |
| `toGeoJson`      | `(...args: Parameters<naver.maps.Data["toGeoJson"]>) => ReturnType<naver.maps.Data["toGeoJson"]> \| undefined`               | 전체 데이터를 GeoJSON으로 내보내기 |

## 동작 규칙

- `data` prop이 변경되면 이전 GeoJSON Feature를 자동으로 제거하고 새 데이터를 추가합니다.
- 컴포넌트 언마운트 시 이벤트 리스너 정리 후 `setMap(null)`을 호출합니다.
- `map` prop을 지정하지 않으면 가장 가까운 `NaverMap` 또는 `Panorama`의 인스턴스를 자동으로 사용합니다.
- `data` prop의 참조가 동일하면 업데이트를 건너뜁니다. 데이터를 갱신하려면 새 객체를 전달하세요.
- 명령적 제어가 필요하면 ref를 통해 `getInstance()`로 내부 `naver.maps.Data` 인스턴스에 직접 접근할 수 있습니다.
