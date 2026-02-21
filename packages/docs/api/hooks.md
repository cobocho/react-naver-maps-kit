# Hooks

## 타입 정의

```ts
export interface UseNaverMapOptions {
  requireReady?: boolean;
  requireMapInstance?: boolean;
}

export function useNaverMap(options: UseNaverMapOptions = {}): NaverMapContextValue;

export function useNaverMapInstance(
  options: { requireReady?: boolean } = {}
): naver.maps.Map | null;
```

## useNaverMap

Provider의 전체 context 값을 가져옵니다.

- `requireReady?: boolean`
  - `true`이고 `sdkStatus !== "ready"`이면 예외를 던집니다.
- `requireMapInstance?: boolean`
  - `true`이고 `map`이 없으면 예외를 던집니다.

예외 케이스:

- `NaverMapProvider` 바깥에서 호출
- `requireReady` 조건 불충족
- `requireMapInstance` 조건 불충족

## useNaverMapInstance

지도 인스턴스만 필요할 때 사용하는 편의 훅입니다.

- 반환 타입: `naver.maps.Map | null`
- `requireReady`가 `true`이면 SDK 준비 전 상태에서 예외를 던집니다.
