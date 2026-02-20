# 기본 구성

`react-naver-maps-kit`의 기본 구성은 `NaverMapProvider`, `NaverMap`, `useNaverMap` 조합을 기준으로 합니다.

## 권장 구성

```tsx
import { NaverMap, NaverMapProvider, useNaverMap } from "react-naver-maps-kit";

function StatusPanel() {
  const { sdkStatus, sdkError } = useNaverMap();

  return (
    <p>
      status: {sdkStatus}
      {sdkError ? `, error: ${sdkError.message}` : ""}
    </p>
  );
}

export function MapPage() {
  return (
    <NaverMapProvider ncpKeyId={import.meta.env.VITE_NCP_KEY_ID}>
      <StatusPanel />
      <NaverMap zoom={10} style={{ width: 480, height: 320 }} />
    </NaverMapProvider>
  );
}
```

## 안전 가드 동작

- `useNaverMap()`은 `NaverMapProvider` 밖에서 호출하면 즉시 예외를 던집니다.
- `useNaverMap({ requireReady: true })`는 SDK 준비 전 상태에서 예외를 던집니다.
- `useNaverMap({ requireMapInstance: true })`는 지도 인스턴스 생성 전 상태에서 예외를 던집니다.

## 구성 목적

- `NaverMapProvider`는 SDK 로딩, 실패, 재시도 흐름을 단일 컨텍스트로 관리합니다.
- `NaverMap`은 생성/업데이트/정리 생명주기를 자동 처리합니다.
- `useNaverMap`은 상태 조회와 예외 가드 적용을 위한 표준 접근점을 제공합니다.
