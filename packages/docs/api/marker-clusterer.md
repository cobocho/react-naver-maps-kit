# MarkerClusterer

`MarkerClusterer`는 다수의 `<Marker>`를 자동으로 클러스터링해주는 컴포넌트입니다.
내부 registry에 마커 데이터를 등록하고, 지도 이벤트에 따라 재계산된 클러스터를 렌더링합니다.

## 동작 방식

1. `<Marker>`는 `<MarkerClusterer>` 내부에서 직접 마커를 생성하지 않고 내부 registry에 위치·데이터를 등록합니다.
2. `MarkerClusterer`는 지도 이벤트(`idle`, `move`, `zoom`) 발생 시 현재 줌·뷰포트 기준으로 클러스터를 재계산합니다.
3. 클러스터 마커는 `<Marker>` JSX로 렌더링되며, `clusterIcon` prop이 children으로 전달됩니다.
4. 클러스터에 포함되지 않은 단독 포인트는 원래 `<Marker>`의 children(커스텀 오버레이)을 그대로 지도에 표시합니다.

## 공개 타입

```ts
// 위도/경도 순수 객체 (naver.maps.LatLngLiteral 유니언 문제 회피)
interface LatLngLiteral {
  readonly lat: number;
  readonly lng: number;
}

// 지도 영역 순수 객체
interface LatLngBoundsLiteral {
  readonly south: number;
  readonly west: number;
  readonly north: number;
  readonly east: number;
}

// Marker가 클러스터러 registry에 등록하는 데이터 레코드
interface ItemRecord<TData> {
  readonly id: string | number;
  readonly position: LatLngLiteral;
  readonly data: TData;
  readonly markerOptions?: Readonly<Partial<naver.maps.MarkerOptions>>;
}

// 클러스터 단위
interface Cluster<TData> {
  readonly id: string;
  readonly position: LatLngLiteral;
  readonly count: number;
  readonly bounds?: LatLngBoundsLiteral;
  readonly items?: readonly ItemRecord<TData>[];
}

// algorithm.cluster()에 전달되는 현재 지도 컨텍스트
interface AlgorithmContext {
  readonly zoom: number;
  readonly bounds: LatLngBoundsLiteral;
}

// 커스텀 알고리즘 인터페이스
interface ClusterAlgorithm<TData> {
  cluster(
    items: readonly ItemRecord<TData>[],
    ctx: AlgorithmContext
  ): {
    readonly clusters: readonly Cluster<TData>[];
    readonly points: readonly ItemRecord<TData>[];
  };
  setOptions?(options: unknown): void;
  destroy?(): void;
}

// 내장 알고리즘 설정
type BuiltInAlgorithmConfig =
  | { type: "grid"; gridSize?: number; minClusterSize?: number; maxZoom?: number }
  | { type: "radius"; radius?: number; minClusterSize?: number; maxZoom?: number }
  | {
      type: "supercluster";
      radius?: number;
      minZoom?: number;
      maxZoom?: number;
      extent?: number;
      nodeSize?: number;
    };

// 클러스터 아이콘 렌더러
type ClusterIconRenderer<TData> = (args: {
  readonly cluster: Cluster<TData>;
  readonly count: number;
}) => React.ReactNode;

// onClusterClick 콜백에서 제공되는 헬퍼
interface MarkerClustererHelpers<TData> {
  zoomToCluster(
    cluster: Cluster<TData>,
    options?: { readonly padding?: number; readonly maxZoom?: number }
  ): void;
  fitBounds(
    bounds: LatLngBoundsLiteral,
    options?: { readonly padding?: number }
  ): void;
}

interface MarkerClustererProps<TData> {
  algorithm?: BuiltInAlgorithmConfig | ClusterAlgorithm<TData>;
  clusterIcon?: ClusterIconRenderer<TData>;
  onClusterClick?: (args: {
    cluster: Cluster<TData>;
    helpers: MarkerClustererHelpers<TData>;
  }) => void;
  behavior?: {
    recomputeOn?: "idle" | "move" | "zoom";
    debounceMs?: number;
  };
  clusterData?: {
    includeItems?: boolean;
    maxItemsInCluster?: number;
  };
  enabled?: boolean;
  children: React.ReactNode;
}
```

## Props

| Prop           | Type                                              | Default                               | Description                                       |
| -------------- | ------------------------------------------------- | ------------------------------------- | ------------------------------------------------- |
| `algorithm`    | `BuiltInAlgorithmConfig \| ClusterAlgorithm<T>`   | `{ type: "supercluster", radius: 60 }` | 클러스터링 알고리즘                               |
| `clusterIcon`  | `ClusterIconRenderer<T>`                          | 파란 원형 기본 아이콘                 | 클러스터 마커 아이콘 렌더러                       |
| `onClusterClick` | `(args) => void`                                | —                                     | 클러스터 마커 클릭 콜백                           |
| `behavior`     | `{ recomputeOn?, debounceMs? }`                  | `{ recomputeOn: "idle", debounceMs: 200 }` | 재계산 트리거 및 디바운스 설정             |
| `clusterData`  | `{ includeItems?, maxItemsInCluster? }`          | `{ includeItems: true }`              | cluster 객체에 포함할 데이터 옵션                 |
| `enabled`      | `boolean`                                         | `true`                                | `false`이면 클러스터링 해제, 개별 마커로 렌더링   |
| `children`     | `React.ReactNode`                                 | —                                     | 클러스터러에 등록할 `<Marker>` 컴포넌트들 (필수) |

### `algorithm` — 내장 알고리즘 옵션

| type            | 옵션                                                         | 설명                               |
| --------------- | ------------------------------------------------------------ | ---------------------------------- |
| `"supercluster"` | `radius`, `minZoom`, `maxZoom`, `extent`, `nodeSize`        | [Supercluster](https://github.com/mapbox/supercluster) 기반 (기본값) |
| `"grid"`         | `gridSize`, `minClusterSize`, `maxZoom`                     | 격자 셀 기반                       |
| `"radius"`       | `radius`, `minClusterSize`, `maxZoom`                       | 중심점-거리 기반                   |

### `behavior` 옵션

| 옵션           | 기본값   | 설명                                                              |
| -------------- | -------- | ----------------------------------------------------------------- |
| `recomputeOn`  | `"idle"` | `"idle"` / `"move"` / `"zoom"` — 재계산을 트리거할 지도 이벤트  |
| `debounceMs`   | `200`    | 재계산 디바운스 지연 시간 (ms)                                    |

### `clusterData` 옵션

| 옵션                 | 기본값 | 설명                                                                   |
| -------------------- | ------ | ---------------------------------------------------------------------- |
| `includeItems`       | `true` | `cluster.items`에 마커 레코드 배열을 포함할지 여부                    |
| `maxItemsInCluster`  | 없음   | `cluster.items`에 포함할 최대 마커 수. 생략하면 전체 포함             |

## 헬퍼 메서드

`onClusterClick` 콜백의 두 번째 인자 `helpers`에서 사용할 수 있습니다.

| 메서드                                      | 설명                                                                                   |
| ------------------------------------------- | -------------------------------------------------------------------------------------- |
| `zoomToCluster(cluster, options?)`          | 클러스터의 마커들이 모두 보이도록 지도 뷰포트를 조정합니다.                           |
| `fitBounds(bounds, options?)`               | 지정한 영역이 화면에 맞도록 지도 뷰포트를 조정합니다.                                 |

`zoomToCluster` 옵션:

| 옵션       | 설명                                                        |
| ---------- | ----------------------------------------------------------- |
| `padding`  | bounds 패딩 (퍼센트)                                       |
| `maxZoom`  | fitBounds 후 이 줌보다 크면 줌을 제한합니다                |

## 사용 예시

### 기본 사용법

```tsx
import { NaverMap, Marker, MarkerClusterer } from "react-naver-maps-kit";

const points = [
  { id: 1, lat: 37.5666, lng: 126.9784 },
  { id: 2, lat: 37.5700, lng: 126.9820 },
  // ...
];

function MyMap() {
  return (
    <NaverMap defaultCenter={{ lat: 37.5666, lng: 126.9784 }} defaultZoom={12}>
      <MarkerClusterer>
        {points.map((p) => (
          <Marker
            key={p.id}
            position={{ lat: p.lat, lng: p.lng }}
          />
        ))}
      </MarkerClusterer>
    </NaverMap>
  );
}
```

### 커스텀 클러스터 아이콘

```tsx
<MarkerClusterer
  clusterIcon={({ count }) => (
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        background: "#EA4335",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
      }}
    >
      {count}
    </div>
  )}
>
  ...
</MarkerClusterer>
```

### 클러스터 클릭 핸들러

```tsx
<MarkerClusterer
  clusterData={{ includeItems: true }}
  onClusterClick={({ cluster, helpers }) => {
    console.log("클러스터 마커 수:", cluster.count);
    console.log("포함된 아이템:", cluster.items);

    // 클러스터 영역으로 줌인 (최대 줌 16 제한)
    helpers.zoomToCluster(cluster, { maxZoom: 16 });
  }}
>
  ...
</MarkerClusterer>
```

### 알고리즘 변경

```tsx
// Grid 알고리즘
<MarkerClusterer algorithm={{ type: "grid", gridSize: 80 }}>
  ...
</MarkerClusterer>

// Radius 알고리즘
<MarkerClusterer algorithm={{ type: "radius", radius: 100, minClusterSize: 3 }}>
  ...
</MarkerClusterer>

// Supercluster (상세 설정)
<MarkerClusterer algorithm={{ type: "supercluster", radius: 40, maxZoom: 14 }}>
  ...
</MarkerClusterer>
```

### 커스텀 알고리즘

`ClusterAlgorithm<TData>` 인터페이스를 구현해 직접 알고리즘을 주입할 수 있습니다.

```tsx
import type { ClusterAlgorithm, AlgorithmContext, ItemRecord, Cluster } from "react-naver-maps-kit";

class MyAlgorithm<TData> implements ClusterAlgorithm<TData> {
  cluster(items: readonly ItemRecord<TData>[], ctx: AlgorithmContext) {
    // 커스텀 클러스터링 로직
    return { clusters: [] as Cluster<TData>[], points: [...items] };
  }
}

<MarkerClusterer algorithm={new MyAlgorithm()}>
  ...
</MarkerClusterer>
```

### 커스텀 마커 아이콘 (children)

단독 포인트에 커스텀 HTML 오버레이를 사용할 수 있습니다. 클러스터에 포함되지 않은 마커는 children을 그대로 표시합니다.

```tsx
<MarkerClusterer
  clusterIcon={({ count }) => (
    <div style={{ /* 클러스터 스타일 */ }}>
      {count}
    </div>
  )}
>
  {points.map((p) => (
    <Marker key={p.id} position={p.position}>
      {/* 단독 포인트일 때 표시할 커스텀 마커 */}
      <div style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        background: "#03C75A",
        border: "2px solid white",
        boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
      }} />
    </Marker>
  ))}
</MarkerClusterer>
```

### 클러스터링 토글 (`enabled`)

```tsx
const [clustering, setClustering] = useState(true);

<>
  <button onClick={() => setClustering((v) => !v)}>
    {clustering ? "클러스터링 끄기" : "클러스터링 켜기"}
  </button>

  <NaverMap ...>
    <MarkerClusterer enabled={clustering}>
      {points.map((p) => (
        <Marker key={p.id} position={p.position} />
      ))}
    </MarkerClusterer>
  </NaverMap>
</>
```

`enabled={false}`이면 클러스터링이 해제되고 각 `<Marker>`가 개별 `naver.maps.Marker`로 렌더링됩니다.

## Marker에서 클러스터러 연동

`<Marker>`가 `<MarkerClusterer>` 내부에서 동작할 때 사용하는 추가 props입니다.

| Prop               | Type               | Description                                                                             |
| ------------------ | ------------------ | --------------------------------------------------------------------------------------- |
| `clustererItemId`  | `string \| number` | 마커를 식별하는 고유 ID. 생략하면 React `useId()`로 자동 생성됩니다.                   |
| `item`             | `TData`            | 클러스터 콜백(`onClusterClick`)에서 접근할 커스텀 데이터                                |

## 동작 규칙

- `<MarkerClusterer>`는 반드시 `<NaverMap>` 내부에 위치해야 합니다.
- `<Marker>`에 `clustererItemId`를 지정하지 않으면 `useId()`로 자동 생성된 ID가 사용됩니다.
- 클러스터에 포함된 `<Marker>`는 지도에서 숨겨지고, 단독 포인트는 children(커스텀 오버레이)과 함께 표시됩니다.
- `enabled={false}`로 전환하면 클러스터링이 해제되고 모든 `<Marker>`가 개별 마커로 렌더링됩니다.
