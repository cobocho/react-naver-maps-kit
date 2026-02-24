<div align="center">

<img src="https://github.com/user-attachments/assets/c2bd5bd6-eb67-4728-9806-1639c1445154" alt="react-naver-maps-kit" width="120" />

# react-naver-maps-kit

[NAVER Maps JavaScript API v3](https://navermaps.github.io/maps.js.ncp/docs/index.html)를 React에 맞게 포팅한 라이브러리입니다.

[![npm](https://img.shields.io/npm/v/react-naver-maps-kit.svg?style=flat-square)](https://www.npmjs.com/package/react-naver-maps-kit)
[![license](https://img.shields.io/npm/l/react-naver-maps-kit.svg?style=flat-square)](https://github.com/cobocho/react-naver-maps-kit/blob/main/LICENSE)
[![docs](https://img.shields.io/badge/docs-available-brightgreen?style=flat-square)](https://react-naver-maps-kit.pages.dev)
[![bundle size](https://img.shields.io/bundlephobia/minzip/react-naver-maps-kit?style=flat-square)](https://bundlephobia.com/package/react-naver-maps-kit)

[공식 문서](https://react-naver-maps-kit.pages.dev) | [Playground](https://react-naver-maps-kit-playground.pages.dev)

</div>

## 설치

```bash
npm install react-naver-maps-kit
```

## 사용법

이 라이브러리를 사용하기 위해서는 [네이버 클라우드 플랫폼](https://www.ncloud.com/)에서 Maps API 키를 발급받아야 합니다.

### 기본 사용법

```tsx
import { NaverMapProvider, NaverMap, Marker } from 'react-naver-maps-kit';

function App() {
  return (
    <NaverMapProvider ncpKeyId="YOUR_NCP_KEY_ID">
      <NaverMap
        defaultCenter={{ lat: 37.3595704, lng: 127.105399 }}
        defaultZoom={15}
        style={{ width: '100%', height: '400px' }}
      >
        <Marker position={{ lat: 37.3595704, lng: 127.105399 }} />
      </NaverMap>
    </NaverMapProvider>
  );
}
```

### 커스텀 마커

React 컴포넌트를 마커로 사용할 수 있습니다.

```tsx
<Marker position={{ lat: 37.3595704, lng: 127.105399 }}>
  <div style={{ padding: '8px 16px', background: '#03C75A', color: 'white', borderRadius: '20px' }}>
    네이버 그린팩토리
  </div>
</Marker>
```

## 컴포넌트

### 지도

| 컴포넌트 | 설명 |
|----------|------|
| `NaverMapProvider` | SDK 로딩 및 인증 관리 |
| `NaverMap` | 지도 컨테이너 |
| `Panorama` | 거리뷰 (`panorama` 서브모듈 필요) |

### 오버레이

| 컴포넌트 | 설명 |
|----------|------|
| `Marker` | 마커 (커스텀 콘텐츠 지원) |
| `InfoWindow` | 정보창 |
| `Polyline` | 선 |
| `Polygon` | 다각형 |
| `Circle` | 원 |
| `Ellipse` | 타원 |
| `Rectangle` | 사각형 |
| `GroundOverlay` | 이미지 오버레이 |

### 서브모듈

필요한 서브모듈만 선택적으로 로드할 수 있습니다.

```tsx
<NaverMapProvider ncpKeyId="YOUR_KEY" submodules={['panorama', 'visualization']}>
  {/* ... */}
</NaverMapProvider>
```

| 서브모듈 | 컴포넌트 |
|----------|----------|
| `panorama` | `Panorama`, `FlightSpot` |
| `visualization` | `HeatMap`, `DotMap` |
| `drawing` | `DrawingManager` |
| `geocoder` | Geocoding 유틸리티 |

## Hooks

```tsx
import { useNaverMap, useMap } from 'react-naver-maps-kit';

// SDK 상태 접근
const { sdkStatus, sdkError } = useNaverMap();

// 지도 인스턴스 접근 (NaverMap 내부에서)
const map = useMap();
```

## TypeScript

`naver` 전역 타입을 사용하려면 `@types/navermaps`를 설치하고 `tsconfig.json`을 설정하세요.

```bash
npm install -D @types/navermaps
```

```json
{
  "compilerOptions": {
    "types": ["navermaps"]
  }
}
```

## 문서

자세한 사용법은 [공식 문서](https://react-naver-maps-kit.pages.dev)를 참고하세요.

- [시작하기](https://react-naver-maps-kit.pages.dev/guide/getting-started)
- [지도 통합](https://react-naver-maps-kit.pages.dev/guide/integration-map)
- [오버레이 가이드](https://react-naver-maps-kit.pages.dev/guide/integration-overlay)
- [API Reference](https://react-naver-maps-kit.pages.dev/api/provider)

## 라이선스

MIT © 2026 [cobocho](https://github.com/cobocho)

---

> **Disclaimer**: 이 라이브러리는 NAVER의 공식 라이브러리가 아닙니다. NAVER Maps API의 서드파티 React 바인딩입니다.
