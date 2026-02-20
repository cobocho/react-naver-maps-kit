# 통합 예제

이 페이지는 `NaverMapProvider`, `NaverMap`, `useNaverMap`을 함께 사용하는 통합 예제를 제공합니다.

## 데모 렌더링

<LiveNaverMapDemo />

## 전체 예시

```tsx
import { useEffect, useState } from "react";
import { NaverMap, NaverMapProvider, useNaverMap } from "react-naver-maps-kit";

function RuntimePanel() {
  const { map, sdkError, sdkStatus } = useNaverMap();
  const [zoom, setZoom] = useState(10);
  const [mapTypeId, setMapTypeId] = useState<naver.maps.MapTypeIdLiteral>("normal");

  useEffect(() => {
    if (!map || sdkStatus !== "ready") {
      return;
    }

    map.setMapTypeId(mapTypeId);
    map.refresh();
  }, [map, mapTypeId, sdkStatus]);

  return (
    <>
      <p>SDK 상태: {sdkStatus}</p>
      {sdkError ? <p>SDK 에러: {sdkError.message}</p> : null}

      <label>
        zoom: {zoom}
        <input
          type="range"
          min={1}
          max={21}
          value={zoom}
          onChange={(event) => setZoom(Number(event.target.value))}
        />
      </label>

      <label>
        mapTypeId
        <select
          value={mapTypeId}
          onChange={(event) => setMapTypeId(event.target.value as naver.maps.MapTypeIdLiteral)}
        >
          <option value="normal">NORMAL</option>
          <option value="terrain">TERRAIN</option>
          <option value="satellite">SATELLITE</option>
          <option value="hybrid">HYBRID</option>
        </select>
      </label>

      <NaverMap
        center={{ lat: 37.3595704, lng: 127.105399 }}
        zoom={zoom}
        mapTypeId={mapTypeId}
        style={{ width: 480, height: 320 }}
      />
    </>
  );
}

export function LiveMapPage() {
  const ncpKeyId = String(import.meta.env.VITE_NCP_KEY_ID ?? "").trim();

  return (
    <NaverMapProvider ncpKeyId={ncpKeyId} timeoutMs={10000}>
      <RuntimePanel />
    </NaverMapProvider>
  );
}
```

## 구성 요약

- `NaverMapProvider`에서 SDK 로딩 및 오류 상태를 관리합니다.
- `useNaverMap`으로 SDK 상태와 map 인스턴스를 조회합니다.
- imperative API 호출과 `NaverMap` 선언형 업데이트를 함께 사용할 수 있습니다.
