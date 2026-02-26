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

export interface MapInstanceContextValue {
  instance: naver.maps.Map | naver.maps.Panorama | null;
  setInstance: (instance: naver.maps.Map | naver.maps.Panorama | null) => void;
  type: "map" | "panorama";
}

export function useMapInstance(): MapInstanceContextValue | null;

export function useMapInstanceRequired(): MapInstanceContextValue;

export function useMap(): naver.maps.Map | null;

export function usePanoramaInstance(): naver.maps.Panorama | null;
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

## useMapInstance

가장 가까운 `NaverMap` 또는 `Panorama`의 인스턴스 context를 가져옵니다.

- 반환 타입: `MapInstanceContextValue | null`
- `NaverMap` 또는 `Panorama` 내부에서만 값을 반환합니다.
- `type` 필드로 현재 인스턴스가 map인지 panorama인지 구분할 수 있습니다.

```tsx
function MyOverlay() {
  const context = useMapInstance();

  if (!context) return null;

  if (context.type === "map") {
    const map = context.instance as naver.maps.Map;
    // map 전용 로직
  } else {
    const panorama = context.instance as naver.maps.Panorama;
    // panorama 전용 로직
  }
}
```

## useMapInstanceRequired

`useMapInstance`와 동일하지만, context가 없으면 예외를 던집니다.

- 반환 타입: `MapInstanceContextValue`
- `NaverMap` 또는 `Panorama` 바깥에서 호출하면 예외 발생

```tsx
function MyOverlay() {
  const { instance, type } = useMapInstanceRequired();
  // instance는 항상 존재 (없으면 예외)
}
```

## useMap

가장 가까운 `NaverMap`의 지도 인스턴스만 가져옵니다.

- 반환 타입: `naver.maps.Map | null`
- `Panorama` 내부에서는 `null` 반환
- `NaverMap` 내부에서만 map 인스턴스 반환

```tsx
function MapOnlyOverlay() {
  const map = useMap();

  if (!map) return null;

  // map 전용 로직
}
```

## usePanoramaInstance

가장 가까운 `Panorama`의 파노라마 인스턴스만 가져옵니다.

- 반환 타입: `naver.maps.Panorama | null`
- `NaverMap` 내부에서는 `null` 반환
- `Panorama` 내부에서만 panorama 인스턴스 반환

```tsx
function PanoramaOnlyOverlay() {
  const panorama = usePanoramaInstance();

  if (!panorama) return null;

  // panorama 전용 로직
}
```

## 훅 선택 가이드

| 용도                       | 권장 훅                 |
| -------------------------- | ----------------------- |
| SDK 상태 확인              | `useNaverMap()`         |
| map/panorama 공통 오버레이 | `useMapInstance()`      |
| map 전용 컴포넌트          | `useMap()`              |
| panorama 전용 컴포넌트     | `usePanoramaInstance()` |
| 레거시 코드 유지           | `useNaverMapInstance()` |
