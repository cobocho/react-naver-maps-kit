import type { ReactNode } from "react";

// ─── Narrow position/bounds types (avoid union ambiguity in naver.maps) ──

/**
 * 위도/경도를 나타내는 순수 객체 타입.
 *
 * `naver.maps.LatLngLiteral`은 `{lat, lng} | PointArrayLiteral` 유니언이라
 * 프로퍼티 접근 시 타입 에러가 발생합니다. 이 타입은 그 문제를 피하기 위해
 * `{lat, lng}` 형태만 허용하는 좁은 타입입니다.
 *
 * @example
 * const pos: LatLngLiteral = { lat: 37.5666, lng: 126.9784 };
 */
export interface LatLngLiteral {
  readonly lat: number;
  readonly lng: number;
}

/**
 * 지도 영역(bounding box)을 나타내는 순수 객체 타입.
 *
 * `naver.maps.LatLngBoundsLiteral`의 유니언 타입 문제를 피하기 위해
 * `{south, west, north, east}` 형태만 허용합니다.
 *
 * @example
 * const bounds: LatLngBoundsLiteral = {
 *   south: 37.56, north: 37.58, west: 126.97, east: 126.99
 * };
 */
export interface LatLngBoundsLiteral {
  readonly south: number;
  readonly west: number;
  readonly north: number;
  readonly east: number;
}

// ─── Item & Cluster ───────────────────────────────────────────────

/**
 * `<Marker>`가 `<MarkerClusterer>` registry에 등록할 때 사용하는 데이터 레코드.
 *
 * `id`는 마커를 식별하는 고유값으로, `<Marker>`의 `clustererItemId` prop에서 옵니다.
 * `data`는 클러스터 이벤트 콜백(`onClusterClick` 등)에서 원본 데이터를 접근할 때 사용합니다.
 *
 * @typeParam TData - 각 마커에 연결된 커스텀 데이터 타입
 *
 * @example
 * // Marker가 클러스터러에 등록되는 레코드 형태
 * const record: ItemRecord<{ name: string }> = {
 *   id: "marker-1",
 *   position: { lat: 37.5, lng: 127.0 },
 *   data: { name: "서울시청" }
 * };
 */
export interface ItemRecord<TData> {
  /** 마커를 식별하는 고유 ID. `<Marker clustererItemId={id}>` 와 대응합니다. */
  readonly id: string | number;
  /** 마커의 위경도 좌표 */
  readonly position: LatLngLiteral;
  /** 마커에 연결된 커스텀 데이터 */
  readonly data: TData;
  /**
   * 단일 포인트로 렌더링될 때 적용할 naver.maps.Marker 옵션.
   * 클러스터링되지 않은 개별 마커에만 적용됩니다.
   */
  readonly markerOptions?: Readonly<Partial<naver.maps.MarkerOptions>>;
}

/**
 * 클러스터링 알고리즘이 생성한 클러스터 단위.
 *
 * `count`개의 마커가 한 위치로 묶인 결과입니다.
 * `items`는 `clusterData.includeItems: true` 일 때만 채워집니다.
 *
 * @typeParam TData - 각 마커에 연결된 커스텀 데이터 타입
 */
export interface Cluster<TData> {
  /** 클러스터 고유 ID. 알고리즘마다 형식이 다릅니다 (예: `"sc-42"`, `"grid-3:7"`). */
  readonly id: string;
  /** 클러스터 대표 위치 (일반적으로 포함 마커들의 중심점) */
  readonly position: LatLngLiteral;
  /** 클러스터에 포함된 마커 수 */
  readonly count: number;
  /**
   * 클러스터에 속한 마커들을 모두 포함하는 최소 영역.
   * `zoomToCluster` 헬퍼에서 `fitBounds` 계산에 사용됩니다.
   */
  readonly bounds?: LatLngBoundsLiteral;
  /**
   * 클러스터에 속한 마커 레코드 목록.
   * `MarkerClustererProps.clusterData.includeItems`가 `true`일 때만 포함됩니다.
   */
  readonly items?: readonly ItemRecord<TData>[];
}

// ─── Algorithm ────────────────────────────────────────────────────

/**
 * 클러스터링 알고리즘이 호출될 때 전달받는 현재 지도 컨텍스트.
 */
export interface AlgorithmContext {
  /** 현재 지도 줌 레벨 */
  readonly zoom: number;
  /** 현재 지도 뷰포트 영역 */
  readonly bounds: LatLngBoundsLiteral;
}

/**
 * 커스텀 클러스터링 알고리즘을 구현할 때 사용하는 인터페이스.
 *
 * 내장 알고리즘(`grid`, `radius`, `supercluster`) 대신
 * 직접 구현한 알고리즘을 `<MarkerClusterer algorithm={...}>`에 전달할 수 있습니다.
 *
 * @typeParam TData - 각 마커에 연결된 커스텀 데이터 타입
 *
 * @example
 * class MyAlgorithm implements ClusterAlgorithm<MyData> {
 *   cluster(items, ctx) {
 *     // 클러스터/단일 포인트 분류 로직
 *     return { clusters: [...], points: [...] };
 *   }
 * }
 *
 * <MarkerClusterer algorithm={new MyAlgorithm()}>
 *   ...
 * </MarkerClusterer>
 */
export interface ClusterAlgorithm<TData> {
  /**
   * 현재 컨텍스트(줌, 뷰포트)에 맞게 마커들을 클러스터와 단일 포인트로 분류합니다.
   *
   * @param items - 등록된 전체 마커 레코드 목록
   * @param ctx - 현재 지도 줌 및 뷰포트 정보
   * @returns 클러스터 배열과 클러스터링되지 않은 단일 포인트 배열
   */
  cluster(
    items: readonly ItemRecord<TData>[],
    ctx: AlgorithmContext
  ): {
    readonly clusters: readonly Cluster<TData>[];
    readonly points: readonly ItemRecord<TData>[];
  };

  /**
   * 런타임에 알고리즘 옵션을 갱신합니다.
   * 구현은 선택 사항이며, 제공되지 않으면 옵션 변경이 무시됩니다.
   *
   * @param options - 새로운 옵션 (타입은 구현체가 정의)
   */
  setOptions?(options: unknown): void;

  /**
   * 컴포넌트 언마운트 시 내부 리소스를 정리합니다.
   * 구현은 선택 사항입니다.
   */
  destroy?(): void;
}

/**
 * `<MarkerClusterer>`의 `algorithm` prop에 전달할 수 있는 내장 알고리즘 설정.
 *
 * 세 가지 타입(`grid`, `radius`, `supercluster`) 중 하나를 선택하며,
 * 각 타입별 옵션은 선택 사항입니다.
 *
 * @example
 * // Grid 알고리즘 (격자 기반)
 * <MarkerClusterer algorithm={{ type: "grid", gridSize: 80 }}>
 *
 * // Radius 알고리즘 (거리 기반)
 * <MarkerClusterer algorithm={{ type: "radius", radius: 100 }}>
 *
 * // Supercluster 알고리즘 (기본값)
 * <MarkerClusterer algorithm={{ type: "supercluster", radius: 60 }}>
 */
export type BuiltInAlgorithmConfig =
  | {
      /** 격자(grid) 기반 클러스터링. 동일 셀에 속한 마커들을 하나로 묶습니다. */
      readonly type: "grid";
      /** 격자 셀 크기 (픽셀 단위). 기본값: `60` */
      readonly gridSize?: number;
      /** 클러스터로 인정할 최소 마커 수. 기본값: `2` */
      readonly minClusterSize?: number;
      /** 이 줌 레벨 이상에서는 클러스터링을 비활성화합니다. 기본값: `21` */
      readonly maxZoom?: number;
    }
  | {
      /** 거리(radius) 기반 클러스터링. 중심점에서 반경 내 마커들을 하나로 묶습니다. */
      readonly type: "radius";
      /** 클러스터링 반경 (픽셀 단위). 기본값: `60` */
      readonly radius?: number;
      /** 클러스터로 인정할 최소 마커 수. 기본값: `2` */
      readonly minClusterSize?: number;
      /** 이 줌 레벨 이상에서는 클러스터링을 비활성화합니다. 기본값: `21` */
      readonly maxZoom?: number;
    }
  | {
      /**
       * [Supercluster](https://github.com/mapbox/supercluster) 기반 클러스터링 (기본값).
       * 계층적 그리드 기반으로 빠르고 정확한 클러스터링을 제공합니다.
       */
      readonly type: "supercluster";
      /** 클러스터링 반경 (픽셀 단위). 기본값: `60` */
      readonly radius?: number;
      /** 클러스터링을 시작할 최소 줌 레벨. 기본값: `0` */
      readonly minZoom?: number;
      /** 클러스터링을 적용할 최대 줌 레벨. 기본값: `16` */
      readonly maxZoom?: number;
      /** 타일 좌표 범위. 기본값: `512` */
      readonly extent?: number;
      /** KD-Tree 노드 크기. 기본값: `64` */
      readonly nodeSize?: number;
    };

// ─── Cluster Icon ─────────────────────────────────────────────────

/**
 * 클러스터 마커의 아이콘을 React 컴포넌트로 렌더링하는 함수 타입.
 *
 * 반환한 ReactNode는 `createRoot`로 DOM 요소에 마운트되어
 * `naver.maps.Marker`의 HTML 아이콘으로 사용됩니다.
 *
 * @typeParam TData - 각 마커에 연결된 커스텀 데이터 타입
 *
 * @example
 * const clusterIcon: ClusterIconRenderer<MyData> = ({ cluster, count }) => (
 *   <div className="cluster-badge">{count}</div>
 * );
 *
 * <MarkerClusterer clusterIcon={clusterIcon}>
 *   ...
 * </MarkerClusterer>
 */
export type ClusterIconRenderer<TData> = (args: {
  /** 해당 클러스터 객체 */
  readonly cluster: Cluster<TData>;
  /** 클러스터에 포함된 마커 수 (`cluster.count`와 동일) */
  readonly count: number;
}) => ReactNode;

// ─── Helpers ──────────────────────────────────────────────────────

/**
 * `onClusterClick` 콜백에서 제공되는 헬퍼 메서드 모음.
 *
 * 클러스터 클릭 시 지도 조작(줌인, fitBounds 등)을 쉽게 구현할 수 있습니다.
 *
 * @typeParam TData - 각 마커에 연결된 커스텀 데이터 타입
 */
export interface MarkerClustererHelpers<TData> {
  /**
   * 클러스터의 마커들이 모두 보이도록 지도 뷰포트를 조정합니다.
   *
   * `cluster.bounds`가 있으면 `fitBounds`로 이동하고,
   * 없으면 클러스터 위치로 이동 후 줌을 1단계 올립니다.
   *
   * @param cluster - 이동할 대상 클러스터
   * @param options.padding - bounds 패딩 (퍼센트). 기본값: 없음
   * @param options.maxZoom - fitBounds 후 이 줌보다 크면 줌을 제한합니다
   *
   * @example
   * onClusterClick={({ cluster, helpers }) => {
   *   helpers.zoomToCluster(cluster, { padding: 10, maxZoom: 16 });
   * }}
   */
  zoomToCluster(
    cluster: Cluster<TData>,
    options?: { readonly padding?: number; readonly maxZoom?: number }
  ): void;

  /**
   * 지정한 영역이 화면에 맞도록 지도 뷰포트를 조정합니다.
   *
   * @param bounds - 화면에 맞출 영역
   * @param options.padding - bounds 패딩 (퍼센트). 기본값: 없음
   *
   * @example
   * helpers.fitBounds({ south: 37.5, north: 37.6, west: 126.9, east: 127.0 });
   */
  fitBounds(
    bounds: LatLngBoundsLiteral,
    options?: { readonly padding?: number }
  ): void;
}

// ─── MarkerClusterer Props ────────────────────────────────────────

/**
 * `<MarkerClusterer>` 컴포넌트의 props 타입.
 *
 * @typeParam TData - children `<Marker>`의 `item` prop 타입. 클러스터 콜백에서 사용됩니다.
 *
 * @example
 * // 기본 사용 (supercluster, 기본 아이콘)
 * <MarkerClusterer>
 *   {points.map(p => (
 *     <Marker key={p.id} clustererItemId={p.id} position={p.position} item={p} />
 *   ))}
 * </MarkerClusterer>
 *
 * @example
 * // 커스텀 아이콘 + 클릭 핸들러
 * <MarkerClusterer
 *   clusterIcon={({ count }) => <ClusterBadge count={count} />}
 *   onClusterClick={({ cluster, helpers }) => helpers.zoomToCluster(cluster)}
 * >
 *   ...
 * </MarkerClusterer>
 */
export interface MarkerClustererProps<TData> {
  /**
   * 사용할 클러스터링 알고리즘.
   *
   * - `BuiltInAlgorithmConfig` 객체를 전달하면 내장 알고리즘(`grid`, `radius`, `supercluster`)을 사용합니다.
   * - `ClusterAlgorithm<TData>` 인스턴스를 전달하면 커스텀 알고리즘을 사용합니다.
   * - 생략하면 `supercluster` 알고리즘이 기본으로 사용됩니다.
   *
   * @default { type: "supercluster", radius: 60 }
   */
  readonly algorithm?: BuiltInAlgorithmConfig | ClusterAlgorithm<TData>;

  /**
   * 클러스터 마커 아이콘을 렌더링하는 함수.
   *
   * 반환값은 React 컴포넌트로 `naver.maps.Marker`의 HTML 아이콘으로 사용됩니다.
   * 생략하면 파란 원형 기본 아이콘이 표시됩니다.
   *
   * @example
   * clusterIcon={({ count }) => (
   *   <div style={{ background: "red", borderRadius: "50%", padding: 8 }}>{count}</div>
   * )}
   */
  readonly clusterIcon?: ClusterIconRenderer<TData>;

  /**
   * 클러스터 마커 클릭 시 호출되는 콜백.
   *
   * `cluster` 객체와 지도 조작을 위한 `helpers`를 함께 제공합니다.
   *
   * @example
   * onClusterClick={({ cluster, helpers }) => {
   *   console.log(`${cluster.count}개 마커 클릭`);
   *   helpers.zoomToCluster(cluster, { maxZoom: 16 });
   * }}
   */
  readonly onClusterClick?: (args: {
    readonly cluster: Cluster<TData>;
    readonly helpers: MarkerClustererHelpers<TData>;
  }) => void;

  /**
   * 재계산 트리거와 디바운스 설정.
   */
  readonly behavior?: {
    /**
     * 클러스터 재계산을 트리거할 지도 이벤트.
     *
     * - `"idle"`: 지도 이동/줌 완료 후 (기본값, 성능 최적화)
     * - `"move"`: 지도가 이동하는 동안 실시간으로
     * - `"zoom"`: 줌 레벨 변경 시
     *
     * @default "idle"
     */
    readonly recomputeOn?: "idle" | "move" | "zoom";
    /**
     * 재계산 디바운스 지연 시간 (ms).
     * 짧게 설정할수록 반응성이 높아지지만 성능 비용이 증가합니다.
     *
     * @default 200
     */
    readonly debounceMs?: number;
  };

  /**
   * 클러스터 객체에 포함할 데이터 옵션.
   */
  readonly clusterData?: {
    /**
     * `cluster.items`에 개별 마커 레코드 목록을 포함할지 여부.
     *
     * `true`로 설정하면 `onClusterClick` 콜백에서 `cluster.items`로
     * 해당 클러스터의 모든 마커 데이터에 접근할 수 있습니다.
     *
     * @default true
     */
    readonly includeItems?: boolean;
    /**
     * `cluster.items`에 포함할 최대 마커 수.
     * `includeItems`가 `true`일 때만 적용됩니다.
     * 생략하면 모든 마커가 포함됩니다.
     */
    readonly maxItemsInCluster?: number;
  };

  /**
   * 클러스터링 활성화 여부.
   *
   * `false`로 설정하면 클러스터링이 해제되고 각 `<Marker>`가 개별 마커로 렌더링됩니다.
   * 다시 `true`로 전환하면 클러스터링이 재개됩니다.
   *
   * @default true
   */
  readonly enabled?: boolean;

  /**
   * 클러스터러에 등록할 `<Marker>` 컴포넌트들.
   *
   * `<MarkerClusterer>` 내부의 `<Marker>`는 직접 지도에 마커를 생성하지 않고
   * 클러스터러 registry에 데이터를 등록합니다.
   * `<Marker>`에 반드시 `clustererItemId` prop을 지정해야 합니다.
   */
  readonly children: React.ReactNode;
}
