# react-naver-maps-kit

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/cobocho/react-naver-maps-kit/blob/main/LICENSE)
[![npm version](https://img.shields.io/npm/v/react-naver-maps-kit.svg)](https://www.npmjs.com/package/react-naver-maps-kit)

**네이버 지도 SDK를 React처럼 사용하세요.**

`react-naver-maps-kit`은 네이버 지도 JavaScript SDK를 React 컴포넌트와 Hook으로 감싼 모던 툴킷입니다. 선언형 API와 자동 생명주기 관리로 복잡한 지도 연동을 단순화합니다.

## 왜 이 라이브러리인가요?

### 🎯 선언형 API

```tsx
// 기존 네이버 지도 SDK
const map = new naver.maps.Map("map", { center: ... });
const marker = new naver.maps.Marker({ position: ..., map });
marker.setPosition(new naver.maps.LatLng(lat, lng));

// react-naver-maps-kit
<NaverMap center={{ lat, lng }} zoom={12}>
  <Marker position={{ lat, lng }} />
</NaverMap>
```

React props로 지도를 제어하세요. 상태가 바뀌면 지도도 자동으로 업데이트됩니다.

### ⚡ 자동 생명주기 관리

- 지도 인스턴스 생성/업데이트/정리 자동 처리
- 오버레이 이벤트 리스너 자동 등록/해제
- 언마운트 시 메모리 누수 없이 완전 정리

### 🔒 안전한 Context 기반 상태

- SDK 로딩 상태 추적 (`loading` → `ready` / `error`)
- 에러 발생 시 재시도 API 제공
- Provider 외부 접근 시 명확한 에러 메시지

### 📦 TypeScript 완전 지원

- 네이버 지도 SDK 타입 정의 포함
- 모든 컴포넌트 Props, Ref 타입 제공
- IDE 자동완성으로 생산성 향상

## 빠른 시작

### 1. 설치

```bash
pnpm add react-naver-maps-kit
```

### 2. API 키 발급

[네이버 클라우드 플랫폼](https://www.ncloud.com/)에서 Maps API 서비스를 신청하고 API 키를 발급받으세요.

### 3. 첫 번째 지도

```tsx
import { NaverMap, NaverMapProvider } from "react-naver-maps-kit";

function App() {
  return (
    <NaverMapProvider ncpKeyId={import.meta.env.VITE_NCP_KEY_ID}>
      <NaverMap
        center={{ lat: 37.5665, lng: 126.978 }}
        zoom={12}
        style={{ width: "100%", height: "500px" }}
      />
    </NaverMapProvider>
  );
}
```

### 4. 마커 추가

```tsx
<NaverMap center={{ lat: 37.5665, lng: 126.978 }} zoom={14}>
  <Marker
    position={{ lat: 37.5665, lng: 126.978 }}
    title="서울시청"
    onClick={(e) => console.log("클릭!", e.coord)}
  />
</NaverMap>
```

### 5. 커스텀 마커 (React 컴포넌트)

```tsx
<Marker position={{ lat: 37.5665, lng: 126.978 }}>
  <div className="custom-marker">📍 내 위치</div>
</Marker>
```

## 주요 기능

### 지도 컨트롤

줌, 지도 타입, 스케일 등 모든 컨트롤을 props로 제어합니다.

```tsx
<NaverMap
  zoomControl
  zoomControlOptions={{ position: naver.maps.Position.TOP_RIGHT }}
  mapTypeControl
  scaleControl={false}
/>
```

### 오버레이

8가지 오버레이 컴포넌트를 제공합니다.

| 컴포넌트          | 용도              |
| ----------------- | ----------------- |
| `Marker`          | 지도 위 위치 표시 |
| `InfoWindow`      | 정보 팝업         |
| `Circle`          | 반경 표시         |
| `Polygon`         | 영역 표시         |
| `Polyline`        | 경로 표시         |
| `Rectangle`       | 사각 영역         |
| `Ellipse`         | 타원 영역         |
| `GroundOverlay`   | 지도 위 이미지    |
| `MarkerClusterer` | 마커 클러스터링   |

### 이벤트 핸들링

모든 지도/오버레이 이벤트를 `on*` props로 처리합니다.

```tsx
<NaverMap
  onClick={(e) => setSelectedLocation(e.coord)}
  onZoomChanged={(zoom) => console.log("줌:", zoom)}
>
  <Marker draggable onDragEnd={(e) => updatePosition(e.coord)} />
</NaverMap>
```

### Ref로 명령형 접근

필요할 때 SDK 인스턴스에 직접 접근할 수 있습니다.

```tsx
const mapRef = useRef<NaverMapRef>(null);

const goToSeoul = () => {
  mapRef.current?.panTo({ lat: 37.5665, lng: 126.978 });
};

<NaverMap ref={mapRef} ... />
```

## 문서 구성

### 시작하기

- [설치 및 설정](/guide/getting-started) - 프로젝트 설정부터 첫 지도까지
- [핵심 개념](/guide/core-concepts) - Provider, Map, Hook 이해하기

### 예제

- [마커 표시하기](/examples/markers) - 기본 마커, 커스텀 마커
- [정보 창 띄우기](/examples/info-window) - InfoWindow 사용법
- [도형 그리기](/examples/shapes) - Circle, Polygon, Polyline
- [마커 클러스터링](/examples/clustering) - 대량 마커 처리
- [지도 컨트롤](/examples/controls) - 줌, 타입, 스케일 컨트롤

### API Reference

- [NaverMapProvider](/api/provider) - SDK 로딩 및 상태 관리
- [NaverMap](/api/map) - 지도 컴포넌트
- [Marker](/api/marker) - 마커 오버레이
- [InfoWindow](/api/info-window) - 정보 창
- [MarkerClusterer](/api/marker-clusterer) - 클러스터링
- [그 외 오버레이](/api/circle) - Circle, Polygon, Polyline 등
- [Hooks](/api/hooks) - useNaverMap, useNaverMapInstance

### 문제 해결

- [자주 묻는 질문](/troubleshooting/common-issues) - 일반적인 문제 해결

## 라이선스

MIT License © [cobocho](https://github.com/cobocho)
