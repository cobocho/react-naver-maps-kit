# DrawingManager

`DrawingManager`는 `naver.maps.drawing.DrawingManager`를 React 컴포넌트로 감싼 API입니다. 사용자가 지도에 도형을 그리고 편집할 수 있는 그래픽 인터페이스를 제공합니다.

::: warning 서브모듈 필요
이 컴포넌트는 `drawing` 서브모듈이 필요합니다.

```tsx
<NaverMapProvider ncpKeyId="..." submodules={["drawing"]}>
```

:::

## 기본 사용법

```tsx
import { NaverMap, DrawingManager } from "react-naver-maps-kit";

function MyMap() {
  return (
    <NaverMap defaultCenter={{ lat: 37.5666, lng: 126.9784 }} defaultZoom={14}>
      <DrawingManager
        drawingControl={[
          naver.maps.drawing.DrawingMode.RECTANGLE,
          naver.maps.drawing.DrawingMode.ELLIPSE,
          naver.maps.drawing.DrawingMode.POLYLINE,
          naver.maps.drawing.DrawingMode.POLYGON,
          naver.maps.drawing.DrawingMode.MARKER
        ]}
      />
    </NaverMap>
  );
}
```

## 공개 타입

```ts
interface DrawingManagerOptionProps {
  drawingControl?: DrawingMode[] | null;
  drawingControlOptions?: DrawingControlOptions;
  drawingMode?: DrawingMode;
  controlPointOptions?: DrawingControlPointOptions;
  rectangleOptions?: RectangleOptions;
  ellipseOptions?: EllipseOptions;
  polylineOptions?: PolylineOptions;
  arrowlineOptions?: PolylineOptions;
  polygonOptions?: PolygonOptions;
  markerOptions?: MarkerOptions;
}

interface DrawingManagerEventProps {
  onDrawingAdded?: (overlay: DrawingOverlay) => void;
  onDrawingRemoved?: (overlay: DrawingOverlay) => void;
  onDrawingSelect?: (overlay: DrawingOverlay) => void;
  onDrawingStart?: (overlay: DrawingOverlay) => void;
  onDrawingCanceled?: (overlay: DrawingOverlay) => void;
  onDrawingManagerReady?: (manager: DrawingManager) => void;
}

interface DrawingManagerRef {
  getInstance: () => DrawingManager | null;
  getMap: () => Map | null;
  getDrawings: () => Record<string, DrawingOverlay>;
  getDrawing: (id: string) => DrawingOverlay | undefined;
  addDrawing: (overlay: DrawingOverlay, mode: DrawingMode, id?: string) => void;
  removeDrawing: (overlayOrId: DrawingOverlay | string) => void;
  toGeoJson: () => object;
  setDrawingMode: (mode: DrawingMode) => void;
  getDrawingMode: () => DrawingMode | undefined;
}
```

## 옵션 프로퍼티

| Prop                    | Type                         | Default   | Description                                      |
| ----------------------- | ---------------------------- | --------- | ------------------------------------------------ |
| `drawingControl`        | `DrawingMode[] \| null`      | 모든 도구 | 표시할 그리기 도구 목록. `null`이면 도구 UI 숨김 |
| `drawingControlOptions` | `DrawingControlOptions`      | -         | 그리기 도구 컨트롤의 위치와 스타일               |
| `drawingMode`           | `DrawingMode`                | `HAND`    | 초기 그리기 모드                                 |
| `controlPointOptions`   | `DrawingControlPointOptions` | -         | 편집 제어점 옵션                                 |
| `rectangleOptions`      | `RectangleOptions`           | -         | 사각형 도형 옵션                                 |
| `ellipseOptions`        | `EllipseOptions`             | -         | 타원 도형 옵션                                   |
| `polylineOptions`       | `PolylineOptions`            | -         | 폴리라인 도형 옵션                               |
| `arrowlineOptions`      | `PolylineOptions`            | -         | 화살표 폴리라인 옵션                             |
| `polygonOptions`        | `PolygonOptions`             | -         | 폴리곤 도형 옵션                                 |
| `markerOptions`         | `MarkerOptions`              | -         | 마커 옵션                                        |

## 이벤트 프로퍼티

| Prop                    | Type                | Description           |
| ----------------------- | ------------------- | --------------------- |
| `onDrawingAdded`        | `(overlay) => void` | 도형이 추가될 때      |
| `onDrawingRemoved`      | `(overlay) => void` | 도형이 삭제될 때      |
| `onDrawingSelect`       | `(overlay) => void` | 도형이 선택될 때      |
| `onDrawingStart`        | `(overlay) => void` | 그리기가 시작될 때    |
| `onDrawingCanceled`     | `(overlay) => void` | 그리기가 취소될 때    |
| `onDrawingManagerReady` | `(manager) => void` | 매니저 초기화 완료 시 |

## Ref 메서드

| Method             | Return Type                      | Description               |
| ------------------ | -------------------------------- | ------------------------- |
| `getInstance()`    | `DrawingManager`                 | 네이티브 인스턴스         |
| `getMap()`         | `Map`                            | 연결된 Map 인스턴스       |
| `getDrawings()`    | `Record<string, DrawingOverlay>` | 그려진 모든 도형 객체     |
| `getDrawing(id)`   | `DrawingOverlay`                 | 특정 ID의 도형 객체       |
| `addDrawing()`     | `void`                           | 도형 추가                 |
| `removeDrawing()`  | `void`                           | 도형 삭제                 |
| `toGeoJson()`      | `object`                         | GeoJSON 형식으로 내보내기 |
| `setDrawingMode()` | `void`                           | 그리기 모드 변경          |
| `getDrawingMode()` | `DrawingMode`                    | 현재 그리기 모드          |

## DrawingMode

```tsx
naver.maps.drawing.DrawingMode.HAND; // 기본 모드 (그리기 비활성)
naver.maps.drawing.DrawingMode.RECTANGLE; // 사각형
naver.maps.drawing.DrawingMode.ELLIPSE; // 타원
naver.maps.drawing.DrawingMode.POLYLINE; // 폴리라인
naver.maps.drawing.DrawingMode.ARROWLINE; // 화살표 폴리라인
naver.maps.drawing.DrawingMode.POLYGON; // 폴리곤
naver.maps.drawing.DrawingMode.MARKER; // 마커
```

## DrawingControlOptions

```tsx
interface DrawingControlOptions {
  position?: naver.maps.Position;
  style?: naver.maps.drawing.DrawingStyle;
}
```

### 위치 옵션

```tsx
naver.maps.Position.TOP_LEFT;
naver.maps.Position.TOP_CENTER;
naver.maps.Position.TOP_RIGHT;
naver.maps.Position.LEFT_CENTER;
naver.maps.Position.RIGHT_CENTER;
naver.maps.Position.BOTTOM_LEFT;
naver.maps.Position.BOTTOM_CENTER;
naver.maps.Position.BOTTOM_RIGHT;
```

### 스타일 옵션

```tsx
naver.maps.drawing.DrawingStyle.HORIZONTAL;
naver.maps.drawing.DrawingStyle.HORIZONTAL_2;
naver.maps.drawing.DrawingStyle.VERTICAL;
naver.maps.drawing.DrawingStyle.VERTICAL_2;
```

## 도형 스타일 커스터마이징

```tsx
<DrawingManager
  rectangleOptions={{
    fillColor: "#ff0000",
    fillOpacity: 0.3,
    strokeWeight: 2,
    strokeColor: "#ff0000"
  }}
  ellipseOptions={{
    fillColor: "#00ff00",
    fillOpacity: 0.3,
    strokeWeight: 2,
    strokeColor: "#00ff00"
  }}
  polylineOptions={{
    strokeColor: "#0000ff",
    strokeWeight: 3
  }}
  polygonOptions={{
    fillColor: "#ffff00",
    fillOpacity: 0.3,
    strokeWeight: 2,
    strokeColor: "#ffd100"
  }}
/>
```

## GeoJSON 내보내기

```tsx
import { useRef } from "react";
import { DrawingManager, type DrawingManagerRef } from "react-naver-maps-kit";

function MyMap() {
  const drawingRef = useRef<DrawingManagerRef>(null);

  const handleExport = () => {
    const geoJson = drawingRef.current?.toGeoJson();
    console.log(JSON.stringify(geoJson, null, 2));
  };

  return (
    <>
      <DrawingManager ref={drawingRef} />
      <button onClick={handleExport}>GeoJSON 내보내기</button>
    </>
  );
}
```

## 동작 규칙

- `NaverMap` 내부에서만 사용 가능합니다.
- `drawing` 서브모듈이 로드되어야 사용 가능합니다.
- **마우스 왼쪽 클릭**: 도형 선택 및 편집
- **마우스 오른쪽 클릭**: 도형 삭제
- **HAND 모드**: 그리기 비활성화, 지도 기본 조작만 가능
- **폴리라인/폴리곤**: 클릭으로 점 추가, 더블클릭으로 완료
- 원(Circle)은 타원(Ellipse)으로 대체됩니다.
