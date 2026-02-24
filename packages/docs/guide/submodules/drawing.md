# Drawing 서브모듈

Drawing 서브모듈은 지도 위에 도형, 마커를 그리는 도구를 제공합니다.

## 개요

Drawing 모듈은 다음 기능을 제공합니다:

- **도형 그리기**: 마커, 원, 사각형, 폴리곤, 폴리라인 그리기
- **편집 모드**: 그린 도형 편집
- **데이터 추출**: 그린 도형을 GeoJSON으로 내보내기

## 서브모듈 로드

`NaverMapProvider`의 `submodules` prop을 통해 로드합니다:

```tsx
import { NaverMapProvider } from "react-naver-maps-kit";

function App() {
  return (
    <NaverMapProvider ncpKeyId={import.meta.env.VITE_NCP_KEY_ID} submodules={["drawing"]}>
      {/* 앱 컴포넌트 */}
    </NaverMapProvider>
  );
}
```

## 주요 클래스

### naver.maps.drawing.DrawingManager

그리기 도구 관리자입니다.

```tsx
const drawingManager = new naver.maps.drawing.DrawingManager({
  map: map,
  drawingMode: [
    naver.maps.drawing.DrawingMode.MARKER,
    naver.maps.drawing.DrawingMode.CIRCLE,
    naver.maps.drawing.DrawingMode.RECTANGLE,
    naver.maps.drawing.DrawingMode.POLYGON,
    naver.maps.drawing.DrawingMode.POLYLINE
  ],
  markerOptions: {
    icon: {
      url: "/img/marker.png",
      size: new naver.maps.Size(24, 36)
    }
  },
  circleOptions: {
    strokeColor: "#03C75A",
    strokeOpacity: 1,
    strokeWeight: 2,
    fillColor: "#03C75A",
    fillOpacity: 0.3
  }
});
```

## 그리기 모드

| 모드        | 설명            |
| ----------- | --------------- |
| `MARKER`    | 마커 그리기     |
| `CIRCLE`    | 원 그리기       |
| `RECTANGLE` | 사각형 그리기   |
| `POLYGON`   | 폴리곤 그리기   |
| `POLYLINE`  | 폴리라인 그리기 |

## 활용 예제

### 기본 그리기 도구

```tsx
import { NaverMap, NaverMapProvider, useNaverMap } from "react-naver-maps-kit";
import { useEffect, useRef, useState } from "react";

function MapWithDrawing() {
  const { sdkStatus, map } = useNaverMap();
  const drawingManagerRef = useRef<naver.maps.drawing.DrawingManager | null>(null);
  const [drawings, setDrawings] = useState<naver.maps.drawing.DrawingOverlay[]>([]);

  useEffect(() => {
    if (sdkStatus !== "ready" || !map) return;

    const drawingManager = new naver.maps.drawing.DrawingManager({
      map: map,
      drawingMode: [
        naver.maps.drawing.DrawingMode.MARKER,
        naver.maps.drawing.DrawingMode.CIRCLE,
        naver.maps.drawing.DrawingMode.RECTANGLE,
        naver.maps.drawing.DrawingMode.POLYGON,
        naver.maps.drawing.DrawingMode.POLYLINE
      ]
    });

    drawingManagerRef.current = drawingManager;

    // 그리기 완료 이벤트
    naver.maps.Event.addListener(drawingManager, "drawend", (overlay) => {
      setDrawings((prev) => [...prev, overlay]);
    });

    return () => {
      drawingManager.destroy();
    };
  }, [sdkStatus, map]);

  const setDrawingMode = (mode: naver.maps.drawing.DrawingMode | null) => {
    drawingManagerRef.current?.setDrawingMode(mode);
  };

  const exportToGeoJSON = () => {
    const data = drawingManagerRef.current?.toGeoJson();
    console.log(JSON.stringify(data, null, 2));
  };

  return (
    <div>
      <div style={{ marginBottom: "8px", display: "flex", gap: "8px" }}>
        <button onClick={() => setDrawingMode(naver.maps.drawing.DrawingMode.MARKER)}>마커</button>
        <button onClick={() => setDrawingMode(naver.maps.drawing.DrawingMode.CIRCLE)}>원</button>
        <button onClick={() => setDrawingMode(naver.maps.drawing.DrawingMode.RECTANGLE)}>
          사각형
        </button>
        <button onClick={() => setDrawingMode(naver.maps.drawing.DrawingMode.POLYGON)}>
          폴리곤
        </button>
        <button onClick={() => setDrawingMode(naver.maps.drawing.DrawingMode.POLYLINE)}>
          폴리라인
        </button>
        <button onClick={() => setDrawingMode(null)}>선택</button>
        <button onClick={exportToGeoJSON}>GeoJSON 내보내기</button>
      </div>

      <NaverMap
        center={{ lat: 37.5665, lng: 126.978 }}
        zoom={12}
        style={{ width: "100%", height: "500px" }}
      />
    </div>
  );
}
```

### 도형 복원하기

```tsx
import { NaverMap, NaverMapProvider, useNaverMap } from "react-naver-maps-kit";
import { useEffect, useRef } from "react";

function MapWithRestore() {
  const { sdkStatus, map } = useNaverMap();
  const drawingManagerRef = useRef<naver.maps.drawing.DrawingManager | null>(null);

  const geoJsonData = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [126.978, 37.5665]
        },
        properties: {}
      }
    ]
  };

  useEffect(() => {
    if (sdkStatus !== "ready" || !map) return;

    const drawingManager = new naver.maps.drawing.DrawingManager({
      map: map,
      drawingMode: [naver.maps.drawing.DrawingMode.MARKER]
    });

    drawingManagerRef.current = drawingManager;

    // GeoJSON에서 도형 복원
    drawingManager.fromGeoJson(geoJsonData);

    return () => {
      drawingManager.destroy();
    };
  }, [sdkStatus, map]);

  return (
    <NaverMap
      center={{ lat: 37.5665, lng: 126.978 }}
      zoom={12}
      style={{ width: "100%", height: "500px" }}
    />
  );
}
```

### 스타일 커스터마이징

```tsx
import { NaverMap, NaverMapProvider, useNaverMap } from "react-naver-maps-kit";
import { useEffect, useRef } from "react";

function MapWithStyledDrawing() {
  const { sdkStatus, map } = useNaverMap();
  const drawingManagerRef = useRef<naver.maps.drawing.DrawingManager | null>(null);

  useEffect(() => {
    if (sdkStatus !== "ready" || !map) return;

    const drawingManager = new naver.maps.drawing.DrawingManager({
      map: map,
      drawingMode: [naver.maps.drawing.DrawingMode.CIRCLE, naver.maps.drawing.DrawingMode.POLYGON],
      circleOptions: {
        strokeColor: "#FF5722",
        strokeOpacity: 0.8,
        strokeWeight: 3,
        fillColor: "#FF5722",
        fillOpacity: 0.4
      },
      polygonOptions: {
        strokeColor: "#2196F3",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#2196F3",
        fillOpacity: 0.3
      }
    });

    drawingManagerRef.current = drawingManager;

    return () => {
      drawingManager.destroy();
    };
  }, [sdkStatus, map]);

  return (
    <NaverMap
      center={{ lat: 37.5665, lng: 126.978 }}
      zoom={12}
      style={{ width: "100%", height: "500px" }}
    />
  );
}
```

## 주요 메서드

| 메서드                   | 설명                         |
| ------------------------ | ---------------------------- |
| `setDrawingMode(mode)`   | 그리기 모드 설정             |
| `getDrawingMode()`       | 현재 그리기 모드 반환        |
| `toGeoJson()`            | 그린 도형을 GeoJSON으로 변환 |
| `fromGeoJson(geoJson)`   | GeoJSON에서 도형 복원        |
| `getOverlays()`          | 그린 도형 목록 반환          |
| `removeOverlay(overlay)` | 특정 도형 제거               |
| `clearOverlays()`        | 모든 도형 제거               |

## 이벤트

| 이벤트      | 설명           |
| ----------- | -------------- |
| `drawstart` | 그리기 시작    |
| `drawend`   | 그리기 완료    |
| `cancel`    | 그리기 취소    |
| `select`    | 도형 선택      |
| `deselect`  | 도형 선택 해제 |

## 참고

- [공식 Drawing 문서](https://navermaps.github.io/maps.js.ncp/docs/tutorial-Drawing.html)
- [공식 DrawingManager API](https://navermaps.github.io/maps.js.ncp/docs/naver.maps.drawing.DrawingManager.html)
