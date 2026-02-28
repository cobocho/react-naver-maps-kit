# NaverMapProvider

SDK 로딩 상태를 React Context로 제공하는 루트 컴포넌트입니다.

## 타입 정의

```ts
export type NaverMapSdkStatus = "idle" | "loading" | "ready" | "error";

export type Submodule = "geocoder" | "panorama" | "drawing" | "visualization" | "gl";

export interface NaverMapContextValue {
  sdkStatus: NaverMapSdkStatus;
  sdkError: Error | null;
  reloadSdk: () => Promise<void>;
  retrySdk: () => Promise<void>;
  clearSdkError: () => void;
  submodules: Submodule[];
  /** @deprecated Use useMapInstance() hook instead. Will be removed in future version. */
  map: naver.maps.Map | null;
  /** @deprecated Use MapInstanceContext instead. Will be removed in future version. */
  setMap: (map: naver.maps.Map | null) => void;
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
- `submodules?: Submodule[]`
  - 로드할 서브모듈 목록입니다.
  - `"geocoder"`, `"panorama"`, `"drawing"`, `"visualization"`, `"gl"` 중 선택합니다.
  - `"gl"`은 다른 서브모듈과 함께 사용할 수 없습니다.
- `LoadNaverMapsScriptOptions`
  - `ncpKeyId`, `timeoutMs`, `nonce` 등 로더 옵션을 그대로 전달합니다.

## Context 값 상세

- `sdkStatus`
  - `idle | loading | ready | error` 상태 머신입니다.
- `sdkError`
  - 마지막 SDK 에러를 보관합니다.
- `reloadSdk()`
  - SDK 로딩을 수동으로 다시 실행합니다.
- `retrySdk()`
  - `reloadSdk`의 별칭입니다.
- `clearSdkError()`
  - 에러 상태를 지우고 필요 시 상태를 `idle`로 되돌립니다.
- `submodules`
  - 로드된 서브모듈 목록입니다.
- `map` _(deprecated)_
  - 하위 호환성을 위해 유지됩니다. `useMapInstance()` 훅 사용을 권장합니다.
- `setMap` _(deprecated)_
  - 하위 호환성을 위해 유지됩니다. `MapInstanceContext` 사용을 권장합니다.

## 아키텍처

`NaverMapProvider`는 SDK 로딩과 인증만 담당합니다. 지도/파노라마 인스턴스는 각각 `NaverMap`, `Panorama` 컴포넌트가 `MapInstanceContext.Provider`로 제공합니다.

```
NaverMapProvider (SDK 로딩/인증)
├── NaverMap (MapInstanceContext.Provider)
│   ├── Marker (useMapInstance로 map 인스턴스 사용)
│   └── Polyline
└── Panorama (MapInstanceContext.Provider)
    └── Marker (useMapInstance로 panorama 인스턴스 사용)
```
