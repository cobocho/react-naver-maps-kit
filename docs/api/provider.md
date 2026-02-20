# NaverMapProvider

SDK 로딩 상태와 지도 인스턴스를 React Context로 제공하는 루트 컴포넌트입니다.

## 타입 정의

```ts
export type NaverMapSdkStatus = "idle" | "loading" | "ready" | "error";

export interface NaverMapContextValue {
  sdkStatus: NaverMapSdkStatus;
  sdkError: Error | null;
  map: naver.maps.Map | null;
  setMap: (map: naver.maps.Map | null) => void;
  reloadSdk: () => Promise<void>;
  retrySdk: () => Promise<void>;
  clearSdkError: () => void;
}

export interface NaverMapProviderProps extends LoadNaverMapsScriptOptions {
  children: React.ReactNode;
  autoLoad?: boolean;
  onReady?: () => void;
  onError?: (error: Error) => void;
}
```

## Props 상세

- `children: React.ReactNode`
  - Provider 하위 트리에 렌더링할 React 노드입니다.
- `autoLoad?: boolean`
  - 기본값 `true`.
  - `true`이면 마운트 시 SDK 로딩을 자동으로 시작합니다.
- `onReady?: () => void`
  - SDK 로딩 완료 후 호출됩니다.
- `onError?: (error: Error) => void`
  - SDK 로딩 실패 또는 인증 실패 시 호출됩니다.
- `LoadNaverMapsScriptOptions`
  - `ncpKeyId`, `submodules`, `timeoutMs`, `nonce` 등 로더 옵션을 그대로 전달합니다.

## Context 값 상세

- `sdkStatus`
  - `idle | loading | ready | error` 상태 머신입니다.
- `sdkError`
  - 마지막 SDK 에러를 보관합니다.
- `map`
  - 현재 `NaverMap`이 등록한 `naver.maps.Map` 인스턴스입니다.
- `setMap(map | null)`
  - 내부적으로 `NaverMap`이 지도 인스턴스를 등록/해제할 때 사용합니다.
- `reloadSdk()`
  - SDK 로딩을 수동으로 다시 실행합니다.
- `retrySdk()`
  - `reloadSdk`의 별칭입니다.
- `clearSdkError()`
  - 에러 상태를 지우고 필요 시 상태를 `idle`로 되돌립니다.
