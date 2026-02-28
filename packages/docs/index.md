---
layout: home

hero:
  name: React Naver Maps KIT
  text: 네이버 지도를 위한 React 바인딩
  tagline: 선언적 API, 자동 생명주기 관리, 완전한 TypeScript 지원
  image:
    src: /logo.png
    alt: react-naver-maps-kit
  actions:
    - theme: brand
      text: 시작하기
      link: /guide/getting-started
    - theme: alt
      text: Playground
      link: https://react-naver-maps-kit-playground.pages.dev
    - theme: alt
      text: GitHub
      link: https://github.com/cobocho/react-naver-maps-kit

features:
  - icon: 🎯
    title: 선언형 API
    details: React props로 지도와 오버레이를 제어합니다. 상태가 바뀌면 지도도 자동으로 업데이트됩니다.
  - icon: ⚡
    title: 자동 생명주기 관리
    details: 지도 인스턴스 생성/정리, 이벤트 리스너 등록/해제를 자동으로 처리합니다.
  - icon: 🎨
    title: 커스텀 마커
    details: React 컴포넌트를 마커로 사용할 수 있습니다. 복잡한 HTML 마커도 JSX로 간단하게.
  - icon: 📦
    title: TypeScript 완전 지원
    details: 모든 컴포넌트와 Props에 대한 타입 정의를 제공합니다.
  - icon: 🔌
    title: 서브모듈 지원
    details: Panorama, Drawing, Visualization 등 필요한 기능만 선택적으로 로드합니다.
  - icon: 🛡️
    title: 안전한 Context 기반
    details: SDK 로딩 상태 추적, 에러 처리, 재시도 API를 제공합니다.
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #03C75A 30%, #1ec800);
  --vp-home-hero-image-background-image: linear-gradient(-45deg, #03C75A50 50%, #1ec80050 50%);
  --vp-home-hero-image-filter: blur(44px);
}

.VPHero .text {
  font-size: 24px !important;
  line-height: 1.3 !important;
}

.VPHero .image-bg {
  transition: filter 0.3s ease;
}

@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px);
  }
  .VPHero .text {
    font-size: 28px !important;
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(68px);
  }
  .VPHero .text {
    font-size: 32px !important;
  }
}
</style>

## 빠른 시작

### 설치

::: code-group

```bash [pnpm]
pnpm add react-naver-maps-kit
```

```bash [npm]
npm install react-naver-maps-kit
```

```bash [yarn]
yarn add react-naver-maps-kit
```

:::

### 첫 번째 지도

```tsx
import { NaverMapProvider, NaverMap, Marker } from "react-naver-maps-kit";

function App() {
  return (
    <NaverMapProvider ncpKeyId="your-client-id">
      <NaverMap
        defaultCenter={{ lat: 37.5665, lng: 126.978 }}
        defaultZoom={14}
        style={{ width: "100%", height: "400px" }}
      >
        <Marker position={{ lat: 37.5665, lng: 126.978 }} />
      </NaverMap>
    </NaverMapProvider>
  );
}
```

### 커스텀 마커

```tsx
<Marker position={{ lat: 37.5665, lng: 126.978 }}>
  <div
    style={{
      padding: "8px 16px",
      background: "#03C75A",
      color: "white",
      borderRadius: "20px",
      fontWeight: "bold"
    }}
  >
    서울시청
  </div>
</Marker>
```

## 컴포넌트

### 지도

| 컴포넌트                                 | 설명                  |
| ---------------------------------------- | --------------------- |
| [`NaverMapProvider`](/api/provider)      | SDK 로딩 및 인증 관리 |
| [`NaverMap`](/api/map)                   | 지도 컨테이너         |
| [`Panorama`](/guide/submodules/panorama) | 거리뷰                |

### 오버레이

| 컴포넌트                                   | 설명                      |
| ------------------------------------------ | ------------------------- |
| [`Marker`](/api/marker)                    | 마커 (커스텀 콘텐츠 지원) |
| [`MarkerClusterer`](/api/marker-clusterer) | 마커 클러스터링           |
| [`InfoWindow`](/api/info-window)           | 정보창                    |
| [`Polyline`](/api/polyline)                | 선                        |
| [`Polygon`](/api/polygon)                  | 다각형                    |
| [`Circle`](/api/circle)                    | 원                        |
| [`Rectangle`](/api/rectangle)              | 사각형                    |

### 서브모듈

| 서브모듈                                           | 컴포넌트             |
| -------------------------------------------------- | -------------------- |
| [`panorama`](/guide/submodules/panorama)           | Panorama, FlightSpot |
| [`visualization`](/guide/submodules/visualization) | HeatMap, DotMap      |
| [`drawing`](/guide/submodules/drawing)             | DrawingManager       |
| [`gl`](/guide/submodules/gl)                       | GL 벡터 지도         |

---

> **Disclaimer**: 이 라이브러리는 NAVER의 공식 라이브러리가 아닙니다.
