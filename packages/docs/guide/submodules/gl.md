# GL 서브모듈

GL 서브모듈은 WebGL 기반의 고성능 벡터 지도를 제공합니다.

## 라이브 데모

<DemoEmbed demo="gl" height="550px" />

## 개요

GL 모듈은 다음 기능을 제공합니다:

- **벡터 지도**: WebGL 기반의 부드러운 지도 렌더링
- **Style Editor 연동**: 네이버 Style Editor로 커스텀 스타일 적용
- **고해상도 지원**: 레티나 디스플레이 대응

## 서브모듈 로드

`NaverMapProvider`의 `submodules` prop을 통해 로드합니다:

```tsx
import { NaverMapProvider } from "react-naver-maps-kit";

function App() {
  return (
    <NaverMapProvider ncpKeyId={import.meta.env.VITE_NCP_KEY_ID} submodules={["gl"]}>
      {/* 앱 컴포넌트 */}
    </NaverMapProvider>
  );
}
```

## GL 지도 활성화

`NaverMap` 컴포넌트에서 `gl` prop을 `true`로 설정합니다:

```tsx
import { NaverMap, NaverMapProvider } from "react-naver-maps-kit";

function App() {
  return (
    <NaverMapProvider ncpKeyId={import.meta.env.VITE_NCP_KEY_ID} submodules={["gl"]}>
      <NaverMap
        gl={true}
        center={{ lat: 37.5665, lng: 126.978 }}
        zoom={12}
        style={{ width: "100%", height: "500px" }}
      />
    </NaverMapProvider>
  );
}
```

## Style Editor 연동

네이버 [Style Editor](https://navermaps.github.io/maps.js.ncp/docs/tutorial-2-Style-Editor.html)에서 생성한 커스텀 스타일을 적용할 수 있습니다.

### 스타일 ID 적용

```tsx
import { NaverMap, NaverMapProvider } from "react-naver-maps-kit";

function MapWithCustomStyle() {
  return (
    <NaverMapProvider ncpKeyId={import.meta.env.VITE_NCP_KEY_ID} submodules={["gl"]}>
      <NaverMap
        gl={true}
        customStyleId="STYLE_ID_FROM_STYLE_EDITOR"
        center={{ lat: 37.5665, lng: 126.978 }}
        zoom={12}
        style={{ width: "100%", height: "500px" }}
      />
    </NaverMapProvider>
  );
}
```

### 스타일 ID 발급 방법

1. [네이버 클라우드 플랫폼 콘솔](https://www.ncloud.com/) 접속
2. **Maps** → **Style Editor** 메뉴로 이동
3. 새 스타일 생성 후 **발급** 버튼 클릭
4. 발급된 스타일 ID 복사

## 활용 예제

### GL 지도 기본

```tsx
import { NaverMap, Marker, NaverMapProvider } from "react-naver-maps-kit";

function GlMap() {
  return (
    <NaverMapProvider ncpKeyId={import.meta.env.VITE_NCP_KEY_ID} submodules={["gl"]}>
      <NaverMap
        gl={true}
        center={{ lat: 37.5665, lng: 126.978 }}
        zoom={15}
        style={{ width: "100%", height: "500px" }}
      >
        <Marker position={{ lat: 37.5665, lng: 126.978 }} />
      </NaverMap>
    </NaverMapProvider>
  );
}
```

### 다크 테마 스타일

```tsx
import { NaverMap, NaverMapProvider } from "react-naver-maps-kit";

function DarkThemeMap() {
  return (
    <NaverMapProvider ncpKeyId={import.meta.env.VITE_NCP_KEY_ID} submodules={["gl"]}>
      <NaverMap
        gl={true}
        customStyleId="YOUR_DARK_THEME_STYLE_ID"
        center={{ lat: 37.5665, lng: 126.978 }}
        zoom={14}
        style={{ width: "100%", height: "500px" }}
      />
    </NaverMapProvider>
  );
}
```

### 레이어 조합

GL 지도에서는 다양한 레이어를 조합할 수 있습니다:

```tsx
import { NaverMap, Marker, NaverMapProvider, useNaverMap } from "react-naver-maps-kit";
import { useEffect } from "react";

function GlMapWithLayers() {
  const { sdkStatus, map } = useNaverMap();

  useEffect(() => {
    if (sdkStatus !== "ready" || !map) return;

    // 실시간 교통 레이어 추가
    const trafficLayer = new naver.maps.TrafficLayer({
      map: map
    });

    return () => {
      trafficLayer.setMap(null);
    };
  }, [sdkStatus, map]);

  return (
    <NaverMap
      gl={true}
      center={{ lat: 37.5665, lng: 126.978 }}
      zoom={12}
      style={{ width: "100%", height: "500px" }}
    />
  );
}
```

### 줌 레벨별 스타일 전환

```tsx
import { NaverMap, NaverMapProvider, useNaverMap } from "react-naver-maps-kit";
import { useEffect, useState } from "react";

function AdaptiveStyleMap() {
  const { sdkStatus, map } = useNaverMap();
  const [currentZoom, setCurrentZoom] = useState(12);

  useEffect(() => {
    if (sdkStatus !== "ready" || !map) return;

    const listener = naver.maps.Event.addListener(map, "zoom_changed", (zoom) => {
      setCurrentZoom(zoom);
    });

    return () => {
      naver.maps.Event.removeListener(listener);
    };
  }, [sdkStatus, map]);

  const getStyleId = (zoom: number): string => {
    if (zoom < 10) return "STYLE_ID_FOR_LOW_ZOOM";
    if (zoom < 15) return "STYLE_ID_FOR_MEDIUM_ZOOM";
    return "STYLE_ID_FOR_HIGH_ZOOM";
  };

  return (
    <div>
      <p>현재 줌 레벨: {currentZoom}</p>
      <NaverMap
        gl={true}
        customStyleId={getStyleId(currentZoom)}
        center={{ lat: 37.5665, lng: 126.978 }}
        zoom={currentZoom}
        style={{ width: "100%", height: "500px" }}
      />
    </div>
  );
}
```

## GL vs 일반 지도 비교

| 특성                | 일반 지도     | GL 지도                  |
| ------------------- | ------------- | ------------------------ |
| 렌더링              | Canvas        | WebGL                    |
| 줌 애니메이션       | 타일 교체     | 부드러운 벡터 확대       |
| 스타일 커스터마이징 | 제한적        | Style Editor로 완전 제어 |
| 성능                | 일반          | 고성능 (대량 데이터)     |
| 지원 환경           | 모든 브라우저 | WebGL 지원 브라우저      |

## 주의사항

### WebGL 지원 확인

```tsx
import { NaverMap, NaverMapProvider, useNaverMap } from "react-naver-maps-kit";
import { useEffect, useState } from "react";

function SafeGlMap() {
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    setWebglSupported(!!gl);
  }, []);

  if (!webglSupported) {
    return <div>이 브라우저는 WebGL을 지원하지 않습니다.</div>;
  }

  return (
    <NaverMapProvider ncpKeyId={import.meta.env.VITE_NCP_KEY_ID} submodules={["gl"]}>
      <NaverMap
        gl={true}
        center={{ lat: 37.5665, lng: 126.978 }}
        zoom={12}
        style={{ width: "100%", height: "500px" }}
      />
    </NaverMapProvider>
  );
}
```

### GL 지도 폴백

```tsx
import { NaverMap, NaverMapProvider } from "react-naver-maps-kit";
import { useState, useEffect } from "react";

function MapWithFallback() {
  const [useGl, setUseGl] = useState(true);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.warn("WebGL not supported, falling back to regular map");
      setUseGl(false);
    }
  }, []);

  return (
    <NaverMapProvider ncpKeyId={import.meta.env.VITE_NCP_KEY_ID} submodules={useGl ? ["gl"] : []}>
      <NaverMap
        gl={useGl}
        center={{ lat: 37.5665, lng: 126.978 }}
        zoom={12}
        style={{ width: "100%", height: "500px" }}
      />
    </NaverMapProvider>
  );
}
```

## 참고

- [공식 GL 문서](https://navermaps.github.io/maps.js.ncp/docs/tutorial-1-GL.html)
- [공식 Style Editor 연동 가이드](https://navermaps.github.io/maps.js.ncp/docs/tutorial-2-Style-Editor.html)
- [신규 맵 타일 소개](https://navermaps.github.io/maps.js.ncp/docs/tutorial-StyleMap-1.html)
