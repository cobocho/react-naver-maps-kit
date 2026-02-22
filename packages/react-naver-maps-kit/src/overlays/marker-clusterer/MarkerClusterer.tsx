import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useNaverMap } from "../../react/hooks/useNaverMap";
import { Marker } from "../marker/Marker";

import { createAlgorithm, isBuiltInConfig } from "./algorithms/createAlgorithm";
import { ClustererContext, ClustererVisibilityContext } from "./ClustererContext";

import type { ClustererRegistry } from "./ClustererContext";
import type {
  Cluster,
  ClusterAlgorithm,
  ItemRecord,
  LatLngBoundsLiteral,
  MarkerClustererHelpers,
  MarkerClustererProps
} from "./types";

// ─── Default cluster icon (simple circle with count) ─────────────

function DefaultClusterIcon({ count }: { count: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 40,
        height: 40,
        borderRadius: "50%",
        backgroundColor: "rgba(0, 100, 255, 0.7)",
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14,
        border: "2px solid rgba(0, 100, 255, 0.9)"
      }}
    >
      {count}
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────

function getMapBounds(map: naver.maps.Map): LatLngBoundsLiteral {
  const bounds = map.getBounds();

  if (bounds instanceof naver.maps.LatLngBounds) {
    const sw = bounds.getSW();
    const ne = bounds.getNE();
    return {
      south: sw.lat(),
      west: sw.lng(),
      north: ne.lat(),
      east: ne.lng()
    };
  }

  // bounds may be a PointBoundsLiteral — extract manually
  const b = bounds as unknown as Record<string, unknown>;
  if ("south" in b && "north" in b && "west" in b && "east" in b) {
    return {
      south: b.south as number,
      north: b.north as number,
      west: b.west as number,
      east: b.east as number
    };
  }

  // Fallback: return a large bounds
  return { south: -90, north: 90, west: -180, east: 180 };
}

function padBounds(bounds: LatLngBoundsLiteral, padding: number): LatLngBoundsLiteral {
  const latPad = (bounds.north - bounds.south) * padding * 0.01;
  const lngPad = (bounds.east - bounds.west) * padding * 0.01;
  return {
    south: bounds.south - latPad,
    north: bounds.north + latPad,
    west: bounds.west - lngPad,
    east: bounds.east + lngPad
  };
}

// ─── Component ────────────────────────────────────────────────────

/**
 * 다수의 `<Marker>`를 자동으로 클러스터링해주는 컴포넌트.
 *
 * ## 동작 방식
 *
 * 1. `<Marker>`는 `<MarkerClusterer>` 내부에서 직접 마커를 생성하지 않고
 *    내부 registry에 위치·데이터를 등록합니다.
 * 2. `MarkerClusterer`는 지도 이벤트(`idle`, `move`, `zoom`) 발생 시
 *    현재 줌·뷰포트 기준으로 클러스터를 재계산합니다.
 * 3. 클러스터 마커는 `<Marker>` JSX로 렌더링되며, children으로 클러스터 아이콘이 전달됩니다.
 * 4. 클러스터에 포함되지 않은 단독 포인트는 원래 `<Marker>` children을 그대로 표시합니다.
 *
 * ## 기본 사용법
 *
 * ```tsx
 * <NaverMap ...>
 *   <MarkerClusterer
 *     algorithm={{ type: "supercluster", radius: 60 }}
 *     clusterIcon={({ count }) => <ClusterBadge count={count} />}
 *     onClusterClick={({ cluster, helpers }) =>
 *       helpers.zoomToCluster(cluster, { maxZoom: 16 })
 *     }
 *   >
 *     {points.map(p => (
 *       <Marker
 *         key={p.id}
 *         position={p.position}
 *         item={p}
 *       >
 *         <CustomPin />
 *       </Marker>
 *     ))}
 *   </MarkerClusterer>
 * </NaverMap>
 * ```
 *
 * ## 주의 사항
 *
 * - `<MarkerClusterer>`는 반드시 `<NaverMap>` 내부에 위치해야 합니다.
 * - `enabled={false}`로 설정하면 클러스터링이 해제되고 각 `<Marker>`가 개별 마커로 렌더링됩니다.
 *
 * @typeParam TData - children `<Marker>`의 `item` prop 타입
 */
export function MarkerClusterer<TData = unknown>(props: MarkerClustererProps<TData>) {
  const {
    algorithm: algorithmProp,
    clusterIcon,
    onClusterClick,
    behavior,
    clusterData,
    enabled = true,
    children
  } = props;

  const { map, sdkStatus } = useNaverMap();

  // ── Registry ──────────────────────────────────────────────────

  const registryRef = useRef(new Map<string | number, ItemRecord<TData>>());
  const [registryVersion, setRegistryVersion] = useState(0);

  const registry: ClustererRegistry<TData> = useMemo(
    () => ({
      enabled,
      register(item: ItemRecord<TData>) {
        registryRef.current.set(item.id, item);
        setRegistryVersion((v) => v + 1);
      },
      unregister(id: string | number) {
        registryRef.current.delete(id);
        setRegistryVersion((v) => v + 1);
      }
    }),
    [enabled]
  );

  // ── Algorithm ─────────────────────────────────────────────────

  const algorithmRef = useRef<ClusterAlgorithm<TData> | null>(null);

  const algorithm = useMemo<ClusterAlgorithm<TData>>(() => {
    if (algorithmProp && !isBuiltInConfig(algorithmProp)) {
      return algorithmProp as ClusterAlgorithm<TData>;
    }
    const config = algorithmProp ?? { type: "supercluster" as const, radius: 60 };
    if (!isBuiltInConfig(config)) {
      return config as ClusterAlgorithm<TData>;
    }
    return createAlgorithm<TData>(config);
  }, [algorithmProp]);

  useEffect(() => {
    const prev = algorithmRef.current;
    algorithmRef.current = algorithm;
    return () => {
      if (prev && prev !== algorithm) {
        prev.destroy?.();
      }
    };
  }, [algorithm]);

  // ── Computed cluster state ─────────────────────────────────────

  const [clusters, setClusters] = useState<readonly Cluster<TData>[]>([]);
  const [visibleIds, setVisibleIds] = useState<ReadonlySet<string | number>>(new Set());

  // ── Helpers ───────────────────────────────────────────────────

  const helpersRef = useRef<MarkerClustererHelpers<TData>>({
    zoomToCluster: () => {},
    fitBounds: () => {}
  });

  useEffect(() => {
    if (!map) return;

    helpersRef.current = {
      zoomToCluster(
        cluster: Cluster<TData>,
        options?: { readonly padding?: number; readonly maxZoom?: number }
      ) {
        if (cluster.bounds) {
          const bounds = options?.padding
            ? padBounds(cluster.bounds, options.padding)
            : cluster.bounds;

          const latLngBounds = new naver.maps.LatLngBounds(
            new naver.maps.LatLng(bounds.south, bounds.west),
            new naver.maps.LatLng(bounds.north, bounds.east)
          );

          map.fitBounds(latLngBounds);

          if (options?.maxZoom !== undefined) {
            const currentZoom = map.getZoom();
            if (currentZoom > options.maxZoom) {
              map.setZoom(options.maxZoom);
            }
          }
        } else {
          const nextZoom = Math.min(map.getZoom() + 1, options?.maxZoom ?? 21);
          map.setCenter(new naver.maps.LatLng(cluster.position.lat, cluster.position.lng));
          map.setZoom(nextZoom);
        }
      },

      fitBounds(bounds: LatLngBoundsLiteral, options?: { readonly padding?: number }) {
        const paddedBounds = options?.padding ? padBounds(bounds, options.padding) : bounds;

        const latLngBounds = new naver.maps.LatLngBounds(
          new naver.maps.LatLng(paddedBounds.south, paddedBounds.west),
          new naver.maps.LatLng(paddedBounds.north, paddedBounds.east)
        );

        map.fitBounds(latLngBounds);
      }
    };
  }, [map]);

  // ── onClusterClick ref ────────────────────────────────────────

  const onClusterClickRef = useRef(onClusterClick);
  useEffect(() => {
    onClusterClickRef.current = onClusterClick;
  }, [onClusterClick]);

  // ── Recompute ─────────────────────────────────────────────────

  const recompute = useCallback(() => {
    if (!map || sdkStatus !== "ready" || !enabled) return;

    const zoom = map.getZoom();
    const bounds = getMapBounds(map);
    const items = Array.from(registryRef.current.values());

    const { clusters: rawClusters, points } = algorithm.cluster(items, { zoom, bounds });

    // Optionally trim items from cluster data
    const maxItems = clusterData?.maxItemsInCluster;
    const includeItems = clusterData?.includeItems ?? true;

    const processedClusters: readonly Cluster<TData>[] = rawClusters.map((c) => ({
      ...c,
      items: includeItems
        ? maxItems !== undefined
          ? c.items?.slice(0, maxItems)
          : c.items
        : undefined
    }));

    setClusters(processedClusters);
    setVisibleIds(new Set(points.map((p) => p.id)));
  }, [
    map,
    sdkStatus,
    enabled,
    algorithm,
    clusterData?.includeItems,
    clusterData?.maxItemsInCluster
  ]);

  // ── Trigger recompute on registry change ──────────────────────

  useEffect(() => {
    recompute();
  }, [recompute, registryVersion]);

  // ── Map event listeners for recompute ─────────────────────────

  useEffect(() => {
    if (!map || sdkStatus !== "ready" || !enabled) return;

    const recomputeOn = behavior?.recomputeOn ?? "idle";
    const debounceMs = behavior?.debounceMs ?? 200;

    let timerId: ReturnType<typeof setTimeout> | null = null;
    const listeners: naver.maps.MapEventListener[] = [];

    const debouncedRecompute = () => {
      if (timerId !== null) {
        clearTimeout(timerId);
      }
      timerId = setTimeout(() => {
        recompute();
        timerId = null;
      }, debounceMs);
    };

    if (recomputeOn === "idle") {
      listeners.push(naver.maps.Event.addListener(map, "idle", debouncedRecompute));
    } else if (recomputeOn === "move") {
      listeners.push(naver.maps.Event.addListener(map, "bounds_changed", debouncedRecompute));
    } else if (recomputeOn === "zoom") {
      listeners.push(naver.maps.Event.addListener(map, "zoom_changed", debouncedRecompute));
    }

    // Initial compute
    recompute();

    return () => {
      if (timerId !== null) {
        clearTimeout(timerId);
      }
      if (listeners.length > 0) {
        naver.maps.Event.removeListener(listeners);
      }
    };
  }, [map, sdkStatus, enabled, behavior?.recomputeOn, behavior?.debounceMs, recompute]);

  // ── Disable: clear cluster state when enabled becomes false ───

  useEffect(() => {
    if (enabled) return;
    setClusters([]);
    setVisibleIds(new Set());
  }, [enabled]);

  // ── Render ────────────────────────────────────────────────────

  return (
    <>
      <ClustererContext.Provider value={registry as ClustererRegistry}>
        <ClustererVisibilityContext.Provider value={visibleIds}>
          {children}
        </ClustererVisibilityContext.Provider>
      </ClustererContext.Provider>
      {enabled &&
        clusters.map((cluster) => (
          <Marker
            key={cluster.id}
            position={cluster.position}
            clickable
            onClick={() => {
              onClusterClickRef.current?.({ cluster, helpers: helpersRef.current });
            }}
          >
            {clusterIcon ? (
              clusterIcon({ cluster, count: cluster.count })
            ) : (
              <DefaultClusterIcon count={cluster.count} />
            )}
          </Marker>
        ))}
    </>
  );
}

MarkerClusterer.displayName = "MarkerClusterer";
