# 시작하기

이 가이드에서는 `react-naver-maps-kit`을 설치하고 첫 번째 지도를 만드는 과정을 단계별로 안내합니다.

## 사전 요구사항

- React 18 이상
- Node.js 18 이상
- 네이버 클라우드 플랫폼 계정 (API 키 발급용)

## 1단계: 설치

```bash
# pnpm (권장)
pnpm add react-naver-maps-kit

# npm
npm install react-naver-maps-kit

# yarn
yarn add react-naver-maps-kit
```

### Peer Dependencies

이 라이브러리는 다음 패키지를 peer dependency로 요구합니다:

- `react >= 18`
- `react-dom >= 18`

### TypeScript 지원

이 라이브러리는 TypeScript로 작성되어 **완전한 타입 정의가 포함**되어 있습니다. `naver.maps` 전역 타입을 사용하려면 `@types/navermaps`를 설치하고 tsconfig를 설정해야 합니다.

#### 1. 타입 패키지 설치

```bash
# pnpm
pnpm add -D @types/navermaps

# npm
npm install -D @types/navermaps

# yarn
yarn add -D @types/navermaps
```

#### 2. tsconfig.json 설정

`compilerOptions`에 `types` 배열을 추가하여 `navermaps` 타입을 명시적으로 로드합니다:

```json
{
  "compilerOptions": {
    "types": ["vite/client", "navermaps"]
    // ... 기타 설정
  }
}
```

::: warning types 설정이 필요한 이유
`moduleResolution: "bundler"` 같은 최신 모듈 해석 방식에서는 `@types/*` 패키지가 자동으로 포함되지 않을 수 있습니다. `types` 배열에 `"navermaps"`를 명시적으로 추가해야 `naver` 전역 타입이 인식됩니다.
:::

#### 3. 타입 사용 예시

```tsx
import type { NaverMapRef, MarkerRef } from "react-naver-maps-kit";

// 네이버 지도 SDK 타입 사용
const handleMapReady = (map: naver.maps.Map) => {
  const center = map.getCenter();
  console.log(`지도 중심: ${center.lat()}, ${center.lng()}`);
};
```

::: tip 확장 타입 자동 적용
`react-naver-maps-kit`은 `@types/navermaps`에 누락된 일부 타입을 확장합니다. 라이브러리를 import하면 `map.isReady`, `HeatMap.addData()` 등의 확장 타입이 자동으로 적용됩니다.
:::

## 2단계: API 키 발급

1. [네이버 클라우드 플랫폼](https://www.ncloud.com/)에 로그인
2. 콘솔에서 **Maps** 서비스 신청
3. **Application 등록** 후 API 키 발급

### 키 타입 선택

| 키 타입           | Prop          | 용도           |
| ----------------- | ------------- | -------------- |
| NCP Key ID (권장) | `ncpKeyId`    | 일반 웹 서비스 |
| NCP Client ID     | `ncpClientId` | 레거시 호환    |
| Gov Client ID     | `govClientId` | 공공기관용     |
| Fin Client ID     | `finClientId` | 금융기관용     |

### 도메인 등록

개발 환경에서는 다음 도메인을 허용 목록에 추가하세요:

```
http://localhost:5173
http://localhost:3000
http://127.0.0.1:5173
```

## 3단계: 환경 변수 설정

Vite를 사용하는 경우 `.env.local` 파일을 생성합니다:

```env
VITE_NCP_KEY_ID=your-ncp-key-id-here
```

::: warning 주의
API 키는 공개 저장소에 커밋하지 마세요. `.gitignore`에 `.env.local`을 추가하세요.
:::

## 4단계: Provider 설정

앱의 최상위에서 `NaverMapProvider`로 감쌉니다:

```tsx
// App.tsx
import { NaverMapProvider } from "react-naver-maps-kit";

function App() {
  return (
    <NaverMapProvider
      ncpKeyId={import.meta.env.VITE_NCP_KEY_ID}
      onReady={() => console.log("지도 SDK 준비 완료!")}
      onError={(error) => console.error("SDK 로딩 실패:", error)}
    >
      {/* 지도 컴포넌트들이 여기에 들어갑니다 */}
    </NaverMapProvider>
  );
}

export default App;
```

### Provider 옵션

| Prop         | 기본값  | 설명                                                                     |
| ------------ | ------- | ------------------------------------------------------------------------ |
| `ncpKeyId`   | -       | NCP API Key ID                                                           |
| `submodules` | `[]`    | 추가 서브모듈 (`geocoder`, `panorama`, `drawing`, `visualization`, `gl`) |
| `timeoutMs`  | `10000` | SDK 로딩 타임아웃 (ms)                                                   |
| `autoLoad`   | `true`  | 마운트 시 자동 로딩 여부                                                 |
| `onReady`    | -       | SDK 로딩 완료 콜백                                                       |
| `onError`    | -       | 에러 발생 콜백                                                           |

::: tip 서브모듈 가이드
서브모듈 사용법은 각 가이드를 참조하세요:

- [Geocoder](/guide/submodules/geocoder) - 주소 검색, 좌표 변환
- [Panorama](/guide/submodules/panorama) - 거리뷰, 항공뷰
- [Drawing](/guide/submodules/drawing) - 그리기 도구
- [Visualization](/guide/submodules/visualization) - 열지도, 점지도
- [GL](/guide/submodules/gl) - WebGL 벡터 지도
  :::

## 5단계: 지도 렌더링

`NaverMap` 컴포넌트로 지도를 표시합니다:

```tsx
// components/Map.tsx
import { NaverMap } from "react-naver-maps-kit";

function Map() {
  return (
    <NaverMap
      center={{ lat: 37.5665, lng: 126.978 }} // 서울시청
      zoom={12}
      style={{ width: "100%", height: "500px" }}
    />
  );
}

export default Map;
```

### 필수 Props

- `center`: 지도 중심 좌표 (`{ lat: number, lng: number }`)
- `zoom`: 줌 레벨 (1~21)
- `style`: 지도 컨테이너 크기 (CSS 스타일)

::: tip
지도 높이는 반드시 지정해야 합니다. `height: 100%`만으로는 작동하지 않습니다.
:::

## 6단계: 마커 추가

`Marker` 컴포넌트로 지도 위에 위치를 표시합니다:

```tsx
import { NaverMap, Marker } from "react-naver-maps-kit";

function MapWithMarker() {
  return (
    <NaverMap
      center={{ lat: 37.5665, lng: 126.978 }}
      zoom={14}
      style={{ width: "100%", height: "500px" }}
    >
      <Marker
        position={{ lat: 37.5665, lng: 126.978 }}
        title="서울시청"
        onClick={(e) => {
          console.log("마커 클릭!", e.coord);
        }}
      />
    </NaverMap>
  );
}
```

## 7단계: 로딩 상태 처리

SDK 로딩 상태를 표시하고 에러를 처리합니다:

```tsx
import { NaverMap, NaverMapProvider, useNaverMap } from "react-naver-maps-kit";

function MapContainer() {
  const { sdkStatus, sdkError, reloadSdk } = useNaverMap();

  if (sdkStatus === "loading") {
    return <div>지도 로딩 중...</div>;
  }

  if (sdkStatus === "error") {
    return (
      <div>
        <p>지도 로딩 실패: {sdkError?.message}</p>
        <button onClick={reloadSdk}>다시 시도</button>
      </div>
    );
  }

  return (
    <NaverMap
      center={{ lat: 37.5665, lng: 126.978 }}
      zoom={12}
      style={{ width: "100%", height: "500px" }}
    />
  );
}

function App() {
  return (
    <NaverMapProvider ncpKeyId={import.meta.env.VITE_NCP_KEY_ID}>
      <MapContainer />
    </NaverMapProvider>
  );
}
```

## 다음 단계

- [핵심 개념](/guide/core-concepts) - Provider, Map, Hook 동작 원리 이해하기
- [서브모듈](/guide/submodules/geocoder) - Geocoder, Panorama, Drawing, Visualization, GL 모듈 사용법
- [마커 예제](/examples/markers) - 다양한 마커 사용법
- [API Reference](/api/provider) - 전체 API 문서

## 문제 해결

지도가 표시되지 않나요? [자주 묻는 질문](/troubleshooting/common-issues)을 확인하세요.
