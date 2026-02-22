# 마커 클러스터링

수십, 수백 개의 마커를 효율적으로 표시하기 위해 `MarkerClusterer`를 사용하는 방법을 설명합니다.

## 왜 클러스터링이 필요한가요?

마커가 많을 때 발생하는 문제들:

- **성능 저하**: 수백 개의 DOM 요소 생성
- **시각적 혼잡**: 마커가 겹쳐서 보기 어려움
- **사용자 경험 저하**: 개별 마커를 클릭하기 어려움

`MarkerClusterer`는 가까운 마커들을 하나의 클러스터로 그룹화합니다.

## 기본 사용법

```tsx
import { NaverMap, Marker, MarkerClusterer, NaverMapProvider } from "react-naver-maps-kit";

// 샘플 데이터 (100개의 마커)
const generateMarkers = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    lat: 37.5 + Math.random() * 0.15,
    lng: 126.9 + Math.random() * 0.2,
    name: `장소 ${i + 1}`
  }));
};

const markers = generateMarkers(100);

function BasicClusterer() {
  return (
    <NaverMapProvider ncpKeyId={import.meta.env.VITE_NCP_KEY_ID}>
      <NaverMap
        center={{ lat: 37.55, lng: 127.0 }}
        zoom={12}
        style={{ width: "100%", height: "500px" }}
      >
        <MarkerClusterer>
          {markers.map((m) => (
            <Marker
              key={m.id}
              clustererItemId={m.id}
              position={{ lat: m.lat, lng: m.lng }}
              title={m.name}
            />
          ))}
        </MarkerClusterer>
      </NaverMap>
    </NaverMapProvider>
  );
}
```

::: warning 중요
`MarkerClusterer` 내부의 `Marker`에는 `clustererItemId` prop이 **필수**입니다.
:::

## 커스텀 클러스터 아이콘

```tsx
import { NaverMap, Marker, MarkerClusterer, NaverMapProvider } from "react-naver-maps-kit";

function CustomClusterIcon() {
  return (
    <NaverMapProvider ncpKeyId={import.meta.env.VITE_NCP_KEY_ID}>
      <NaverMap
        center={{ lat: 37.55, lng: 127.0 }}
        zoom={12}
        style={{ width: "100%", height: "500px" }}
      >
        <MarkerClusterer
          clusterIcon={({ count }) => (
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                background: count > 50 ? "#EA4335" : count > 20 ? "#FBBC05" : "#03C75A",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: 16,
                boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
              }}
            >
              {count}
            </div>
          )}
        >
          {markers.map((m) => (
            <Marker key={m.id} clustererItemId={m.id} position={{ lat: m.lat, lng: m.lng }} />
          ))}
        </MarkerClusterer>
      </NaverMap>
    </NaverMapProvider>
  );
}
```

## 클러스터 클릭 이벤트

클러스터 클릭 시 해당 영역으로 줌인하거나 정보를 표시합니다:

```tsx
import { useState } from "react";
import { NaverMap, Marker, MarkerClusterer, NaverMapProvider } from "react-naver-maps-kit";

function ClustererWithClick() {
  const [info, setInfo] = useState<string | null>(null);

  return (
    <div>
      <NaverMapProvider ncpKeyId={import.meta.env.VITE_NCP_KEY_ID}>
        <NaverMap
          center={{ lat: 37.55, lng: 127.0 }}
          zoom={12}
          style={{ width: "100%", height: "400px" }}
        >
          <MarkerClusterer
            clusterData={{ includeItems: true }}
            onClusterClick={({ cluster, helpers }) => {
              console.log(`${cluster.count}개의 마커가 포함됨`);

              // 클러스터에 포함된 마커 데이터 확인
              if (cluster.items) {
                setInfo(
                  `${cluster.count}개: ${cluster.items
                    .slice(0, 3)
                    .map((i) => i.data?.name)
                    .join(", ")}...`
                );
              }

              // 클러스터 영역으로 줌인
              helpers.zoomToCluster(cluster, { maxZoom: 16 });
            }}
          >
            {markers.map((m) => (
              <Marker
                key={m.id}
                clustererItemId={m.id}
                position={{ lat: m.lat, lng: m.lng }}
                item={m} // 클러스터에서 접근할 데이터
              />
            ))}
          </MarkerClusterer>
        </NaverMap>
      </NaverMapProvider>

      {info && <p>{info}</p>}
    </div>
  );
}
```

## 알고리즘 선택

세 가지 내장 알고리즘을 제공합니다:

```tsx
// 1. Supercluster (기본값) - 가장 빠르고 정확
<MarkerClusterer
  algorithm={{
    type: "supercluster",
    radius: 60,      // 클러스터 반경 (픽셀)
    maxZoom: 16,     // 이 줌 이상에서는 클러스터링 안 함
  }}
>
  ...
</MarkerClusterer>

// 2. Grid - 격자 기반, 단순함
<MarkerClusterer
  algorithm={{
    type: "grid",
    gridSize: 100,       // 격자 크기 (픽셀)
    minClusterSize: 2,   // 최소 클러스터 크기
    maxZoom: 15,
  }}
>
  ...
</MarkerClusterer>

// 3. Radius - 거리 기반
<MarkerClusterer
  algorithm={{
    type: "radius",
    radius: 80,          // 반경 (픽셀)
    minClusterSize: 2,
  }}
>
  ...
</MarkerClusterer>
```

### 알고리즘 비교

| 알고리즘         | 장점                     | 단점             | 추천 상황            |
| ---------------- | ------------------------ | ---------------- | -------------------- |
| **supercluster** | 빠르고 정확, 메모리 효율 | 설정 복잡        | 대량 데이터 (기본값) |
| **grid**         | 단순, 예측 가능          | 부정확할 수 있음 | 균등 분포 데이터     |
| **radius**       | 직관적                   | 느림             | 소량 데이터          |

## 클러스터링 토글

```tsx
import { useState } from "react";
import { NaverMap, Marker, MarkerClusterer, NaverMapProvider } from "react-naver-maps-kit";

function ToggleableClusterer() {
  const [enabled, setEnabled] = useState(true);

  return (
    <div>
      <button onClick={() => setEnabled(!enabled)}>
        {enabled ? "클러스터링 끄기" : "클러스터링 켜기"}
      </button>

      <NaverMapProvider ncpKeyId={import.meta.env.VITE_NCP_KEY_ID}>
        <NaverMap
          center={{ lat: 37.55, lng: 127.0 }}
          zoom={12}
          style={{ width: "100%", height: "500px" }}
        >
          <MarkerClusterer enabled={enabled}>
            {markers.map((m) => (
              <Marker key={m.id} clustererItemId={m.id} position={{ lat: m.lat, lng: m.lng }} />
            ))}
          </MarkerClusterer>
        </NaverMap>
      </NaverMapProvider>
    </div>
  );
}
```

`enabled={false}`면 각 `Marker`가 개별 렌더링됩니다.

## 동적 데이터 업데이트

마커 데이터가 변경되면 자동으로 재계산됩니다:

```tsx
import { useState, useEffect } from "react";
import { NaverMap, Marker, MarkerClusterer, NaverMapProvider } from "react-naver-maps-kit";

function DynamicClusterer() {
  const [markers, setMarkers] = useState([]);
  const [filter, setFilter] = useState("");

  // 필터링된 마커
  const filteredMarkers = markers.filter((m) =>
    m.name.includes(filter)
  );

  useEffect(() => {
    // 데이터 로드
    fetchMarkers().then(setMarkers);
  }, []);

  return (
    <div>
      <input
        placeholder="검색어 입력"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <p>{filteredMarkers.length}개의 마커</p>

      <NaverMapProvider ncpKeyId={import.meta.env.VITE_NCP_KEY_ID}>
        <NaverMap ...>
          <MarkerClusterer>
            {filteredMarkers.map((m) => (
              <Marker
                key={m.id}
                clustererItemId={m.id}
                position={m.position}
                item={m}
              />
            ))}
          </MarkerClusterer>
        </NaverMap>
      </NaverMapProvider>
    </div>
  );
}
```

## 성능 최적화

### 1. `recomputeOn` 조정

```tsx
<MarkerClusterer
  behavior={{
    recomputeOn: "idle",    // "idle" | "move" | "zoom"
    debounceMs: 300,        // 디바운스 (기본 200ms)
  }}
>
```

- `idle`: 지도 이동 완료 후 재계산 (기본, 권장)
- `zoom`: 줌 변경 시에만 재계산
- `move`: 모든 이동에 재계산 (성능 주의)

### 2. `clusterData` 최적화

```tsx
<MarkerClusterer
  clusterData={{
    includeItems: false,        // items 배열 제외 (메모리 절약)
    maxItemsInCluster: 10,      // 최대 아이템 수 제한
  }}
>
```

### 3. 마커 메모이제이션

```tsx
const markerElements = useMemo(
  () =>
    markers.map((m) => <Marker key={m.id} clustererItemId={m.id} position={m.position} item={m} />),
  [markers]
);

<MarkerClusterer>{markerElements}</MarkerClusterer>;
```

## 커스텀 알고리즘

`ClusterAlgorithm` 인터페이스를 구현하여 직접 알고리즘을 만들 수 있습니다:

```tsx
import type { ClusterAlgorithm, AlgorithmContext, ItemRecord, Cluster } from "react-naver-maps-kit";

class SimpleDistanceAlgorithm<TData> implements ClusterAlgorithm<TData> {
  private threshold: number;

  constructor(threshold = 0.01) {
    this.threshold = threshold;
  }

  cluster(items: readonly ItemRecord<TData>[], ctx: AlgorithmContext) {
    const clusters: Cluster<TData>[] = [];
    const visited = new Set<string>();

    items.forEach((item) => {
      if (visited.has(String(item.id))) return;

      const nearby: ItemRecord<TData>[] = [item];
      visited.add(String(item.id));

      items.forEach((other) => {
        if (visited.has(String(other.id))) return;

        const distance = Math.sqrt(
          Math.pow(item.position.lat - other.position.lat, 2) +
            Math.pow(item.position.lng - other.position.lng, 2)
        );

        if (distance < this.threshold) {
          nearby.push(other);
          visited.add(String(other.id));
        }
      });

      if (nearby.length > 1) {
        clusters.push({
          id: `cluster-${item.id}`,
          position: {
            lat: nearby.reduce((sum, i) => sum + i.position.lat, 0) / nearby.length,
            lng: nearby.reduce((sum, i) => sum + i.position.lng, 0) / nearby.length
          },
          count: nearby.length,
          items: nearby
        });
      }
    });

    return { clusters, points: [] };
  }
}

<MarkerClusterer algorithm={new SimpleDistanceAlgorithm()}>...</MarkerClusterer>;
```

## Props 요약

| Prop             | 타입                                   | 기본값                                     | 설명                   |
| ---------------- | -------------------------------------- | ------------------------------------------ | ---------------------- |
| `algorithm`      | `BuiltInAlgorithm \| ClusterAlgorithm` | `{ type: "supercluster", radius: 60 }`     | 클러스터링 알고리즘    |
| `clusterIcon`    | `(args) => ReactNode`                  | 기본 파란 원                               | 클러스터 아이콘 렌더러 |
| `onClusterClick` | `(args) => void`                       | -                                          | 클러스터 클릭 핸들러   |
| `behavior`       | `{ recomputeOn, debounceMs }`          | `{ recomputeOn: "idle", debounceMs: 200 }` | 동작 설정              |
| `clusterData`    | `{ includeItems, maxItemsInCluster }`  | `{ includeItems: true }`                   | 데이터 포함 설정       |
| `enabled`        | `boolean`                              | `true`                                     | 클러스터링 활성화      |

## 다음 단계

- [MarkerClusterer API](/api/marker-clusterer) - 전체 Props 목록
- [마커 예제](/examples/markers) - 기본 마커 사용법
