# Drawing 서브모듈

Drawing 서브모듈은 사용자가 지도에 사각형, 타원, 폴리라인, 화살표가 있는 폴리라인, 폴리곤, 마커를 그릴 수 있는 그래픽 인터페이스를 제공합니다.

## 라이브 데모

<DemoEmbed demo="drawing" height="550px" />

## 설치 및 설정

Drawing 서브모듈을 사용하려면 `NaverMapProvider`에 `submodules` prop을 설정해야 합니다.

```tsx
import { NaverMapProvider, NaverMap, DrawingManager } from "react-naver-maps-kit";

function App() {
  return (
    <NaverMapProvider 
      ncpKeyId="YOUR_NCP_KEY_ID" 
      submodules={["drawing"]}
    >
      <NaverMap>
        <DrawingManager />
      </NaverMap>
    </NaverMapProvider>
  );
}
```

## DrawingManager

`DrawingManager` 컴포넌트는 지도에 그리기 도구 UI를 제공하고, 사용자가 도형을 그리고 편집할 수 있게 합니다.

### 기본 사용법

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

### Props

#### 옵션 Props

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `drawingControl` | `DrawingMode[] \| null` | 모든 도구 | 표시할 그리기 도구 목록. `null`이면 도구 UI 숨김 |
| `drawingControlOptions` | `DrawingControlOptions` | - | 그리기 도구 컨트롤의 위치와 스타일 |
| `drawingMode` | `DrawingMode` | `HAND` | 초기 그리기 모드 |
| `controlPointOptions` | `DrawingControlPointOptions` | - | 편집 제어점 옵션 |
| `rectangleOptions` | `RectangleOptions` | - | 사각형 도형 옵션 |
| `ellipseOptions` | `EllipseOptions` | - | 타원 도형 옵션 |
| `polylineOptions` | `PolylineOptions` | - | 폴리라인 도형 옵션 |
| `arrowlineOptions` | `PolylineOptions` | - | 화살표 폴리라인 옵션 |
| `polygonOptions` | `PolygonOptions` | - | 폴리곤 도형 옵션 |
| `markerOptions` | `MarkerOptions` | - | 마커 옵션 |

#### 이벤트 Props

| Prop | 타입 | 설명 |
|------|------|------|
| `onDrawingAdded` | `(overlay: DrawingOverlay) => void` | 도형이 추가될 때 |
| `onDrawingRemoved` | `(overlay: DrawingOverlay) => void` | 도형이 삭제될 때 |
| `onDrawingSelect` | `(overlay: DrawingOverlay) => void` | 도형이 선택될 때 |
| `onDrawingStart` | `(overlay: DrawingOverlay) => void` | 그리기가 시작될 때 |
| `onDrawingCanceled` | `(overlay: DrawingOverlay) => void` | 그리기가 취소될 때 |
| `onDrawingManagerReady` | `(manager: DrawingManager) => void` | 매니저 초기화 완료 시 |

### DrawingMode

사용 가능한 그리기 모드입니다.

```tsx
naver.maps.drawing.DrawingMode.HAND       // 기본 모드 (그리기 비활성)
naver.maps.drawing.DrawingMode.RECTANGLE  // 사각형
naver.maps.drawing.DrawingMode.ELLIPSE    // 타원
naver.maps.drawing.DrawingMode.POLYLINE   // 폴리라인
naver.maps.drawing.DrawingMode.ARROWLINE  // 화살표 폴리라인
naver.maps.drawing.DrawingMode.POLYGON    // 폴리곤
naver.maps.drawing.DrawingMode.MARKER     // 마커
```

### DrawingControlOptions

그리기 도구 컨트롤의 위치와 스타일을 설정합니다.

```tsx
interface DrawingControlOptions {
  position?: naver.maps.Position;       // 컨트롤 위치
  style?: naver.maps.drawing.DrawingStyle;  // 컨트롤 스타일
}
```

#### 위치 옵션

```tsx
naver.maps.Position.TOP_LEFT
naver.maps.Position.TOP_CENTER
naver.maps.Position.TOP_RIGHT
naver.maps.Position.LEFT_CENTER
naver.maps.Position.RIGHT_CENTER
naver.maps.Position.BOTTOM_LEFT
naver.maps.Position.BOTTOM_CENTER
naver.maps.Position.BOTTOM_RIGHT
```

#### 스타일 옵션

```tsx
naver.maps.drawing.DrawingStyle.HORIZONTAL    // 수평 배열
naver.maps.drawing.DrawingStyle.HORIZONTAL_2  // 수평 배열 (스타일 2)
naver.maps.drawing.DrawingStyle.VERTICAL      // 수직 배열
naver.maps.drawing.DrawingStyle.VERTICAL_2    // 수직 배열 (스타일 2)
```

### 도형 스타일 커스터마이징

각 도형의 스타일을 개별적으로 설정할 수 있습니다.

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
  arrowlineOptions={{
    strokeColor: "#ff00ff",
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

### 편집 제어점 커스터마이징

도형 편집 시 표시되는 제어점의 스타일을 설정할 수 있습니다.

```tsx
<DrawingManager
  controlPointOptions={{
    anchorPointOptions: {
      radius: 10,
      fillColor: "#ff0000",
      strokeColor: "#0000ff",
      strokeWeight: 2
    },
    midPointOptions: {
      radius: 8,
      fillColor: "#00ff00",
      strokeColor: "#0000ff",
      strokeWeight: 2,
      fillOpacity: 0.5
    }
  }}
/>
```

### Ref 메서드

`DrawingManagerRef`를 통해 프로그래매틱하게 컨트롤할 수 있습니다.

```tsx
import { useRef } from "react";
import { DrawingManager, type DrawingManagerRef } from "react-naver-maps-kit";

function MyMap() {
  const drawingRef = useRef<DrawingManagerRef>(null);

  const handleExport = () => {
    const geoJson = drawingRef.current?.toGeoJson();
    console.log(geoJson);
  };

  return (
    <>
      <DrawingManager ref={drawingRef} />
      <button onClick={handleExport}>GeoJSON 내보내기</button>
    </>
  );
}
```

#### 사용 가능한 메서드

| 메서드 | 반환 타입 | 설명 |
|--------|----------|------|
| `getInstance()` | `DrawingManager \| null` | 네이티브 DrawingManager 인스턴스 |
| `getMap()` | `Map \| null` | 연결된 Map 인스턴스 |
| `getDrawings()` | `Record<string, DrawingOverlay>` | 그려진 모든 도형 객체 |
| `getDrawing(id)` | `DrawingOverlay \| undefined` | 특정 ID의 도형 객체 |
| `addDrawing(overlay, mode, id?)` | `void` | 도형 추가 |
| `removeDrawing(overlayOrId)` | `void` | 도형 삭제 |
| `toGeoJson()` | `object` | GeoJSON 형식으로 내보내기 |
| `setDrawingMode(mode)` | `void` | 그리기 모드 변경 |
| `getDrawingMode()` | `DrawingMode \| undefined` | 현재 그리기 모드 |

### 전체 예제

```tsx
import { useRef, useState } from "react";
import { NaverMap, DrawingManager, type DrawingManagerRef } from "react-naver-maps-kit";

function DrawingDemo() {
  const drawingRef = useRef<DrawingManagerRef>(null);
  const [drawings, setDrawings] = useState<string[]>([]);

  const updateDrawingsList = () => {
    const manager = drawingRef.current;
    if (!manager) return;
    const drawingsObj = manager.getDrawings();
    setDrawings(Object.keys(drawingsObj));
  };

  const handleExportGeoJson = () => {
    const json = drawingRef.current?.toGeoJson();
    console.log(JSON.stringify(json, null, 2));
  };

  return (
    <div>
      <div>
        <p>그려진 도형: {drawings.length}개</p>
        <button onClick={handleExportGeoJson}>GeoJSON 내보내기</button>
      </div>
      
      <NaverMap 
        defaultCenter={{ lat: 37.5666, lng: 126.9784 }} 
        defaultZoom={14}
        style={{ width: "100%", height: 500 }}
      >
        <DrawingManager
          ref={drawingRef}
          drawingControl={[
            naver.maps.drawing.DrawingMode.RECTANGLE,
            naver.maps.drawing.DrawingMode.ELLIPSE,
            naver.maps.drawing.DrawingMode.POLYLINE,
            naver.maps.drawing.DrawingMode.ARROWLINE,
            naver.maps.drawing.DrawingMode.POLYGON,
            naver.maps.drawing.DrawingMode.MARKER
          ]}
          drawingControlOptions={{
            position: naver.maps.Position.TOP_CENTER,
            style: naver.maps.drawing.DrawingStyle.HORIZONTAL
          }}
          rectangleOptions={{
            fillColor: "#ff0000",
            fillOpacity: 0.3,
            strokeWeight: 2,
            strokeColor: "#ff0000"
          }}
          onDrawingAdded={(overlay) => {
            console.log("추가됨:", overlay);
            updateDrawingsList();
          }}
          onDrawingRemoved={() => {
            updateDrawingsList();
          }}
        />
      </NaverMap>
    </div>
  );
}
```

## 동작 규칙

- **마우스 왼쪽 클릭**: 그려진 도형 선택 및 편집
- **마우스 오른쪽 클릭**: 그려진 도형 삭제
- **HAND 모드**: 그리기 비활성화, 지도 기본 조작만 가능
- **도형 그리기**: 해당 모드 선택 후 지도에서 클릭/드래그
- **폴리라인/폴리곤**: 클릭으로 점 추가, 더블클릭으로 완료

## 참고

- 원(Circle)은 타원(Ellipse)으로 대체됩니다.
- `arrowlineOptions`에서 `startIcon`이나 `endIcon`을 정의하지 않으면 기본적으로 `endIcon`이 표시됩니다.
- `polylineOptions`에서 `startIcon`, `endIcon` 옵션은 무시됩니다.
