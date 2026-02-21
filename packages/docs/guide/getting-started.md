# 시작하기

## 설치

```bash
pnpm add react-naver-maps-kit
```

지원 Peer Dependency:

- `react >= 18`
- `react-dom >= 18`

## 키 설정

기본 인증 키는 `ncpKeyId` 사용을 권장합니다.

```tsx
import { NaverMapProvider } from "react-naver-maps-kit";

function App() {
  return (
    <NaverMapProvider ncpKeyId={import.meta.env.VITE_NCP_KEY_ID} timeoutMs={10000}>
      {/* 지도 컴포넌트 */}
    </NaverMapProvider>
  );
}
```

> 하위 호환을 위해 `ncpClientId`, `govClientId`, `finClientId`를 함께 지원합니다.

## 첫 지도 렌더링

```tsx
import { NaverMap, NaverMapProvider } from "react-naver-maps-kit";

export function FirstMap() {
  return (
    <NaverMapProvider ncpKeyId={import.meta.env.VITE_NCP_KEY_ID}>
      <NaverMap
        center={{ lat: 37.3595704, lng: 127.105399 }}
        zoom={10}
        style={{ width: 480, height: 320 }}
      />
    </NaverMapProvider>
  );
}
```

## 적용 순서

1. `NaverMapProvider`에서 SDK 로딩과 오류 상태를 관리합니다.
2. `NaverMap`에서 지도 옵션을 선언형으로 구성합니다.
3. `useNaverMap`으로 상태 표시 및 예외 흐름을 처리합니다.
