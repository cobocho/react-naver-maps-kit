import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { createRoot } from "react-dom/client";

import { useNaverMap } from "../../react/hooks/useNaverMap";
import { ClustererContext } from "./ClustererContext";
import { createAlgorithm, isBuiltInConfig } from "./algorithms/createAlgorithm";

import type { Root } from "react-dom/client";
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

function padBounds(
  bounds: LatLngBoundsLiteral,
  padding: number
): LatLngBoundsLiteral {
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
 * 3. 클러스터 마커는 `createRoot`를 이용해 React 컴포넌트를 HTML 아이콘으로 렌더링합니다.
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
 *         clustererItemId={p.id}
 *         position={p.position}
 *         item={p}
 *       />
 *     ))}
 *   </MarkerClusterer>
 * </NaverMap>
 * ```
 *
 * ## 주의 사항
 *
 * - `<Marker>`에 반드시 `clustererItemId` prop을 지정해야 합니다.
 * - `<MarkerClusterer>`는 반드시 `<NaverMap>` 내부에 위치해야 합니다.
 * - `enabled={false}`로 설정하면 클러스터링이 해제되고 각 `<Marker>`가 개별 마커로 렌더링됩니다.
 *
 * @typeParam TData - children `<Marker>`의 `item` prop 타입
 */
export function MarkerClusterer<TData = unknown>(
  props: MarkerClustererProps<TData>
) {
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

  // ── Marker storage ────────────────────────────────────────────

  const pointMarkersRef = useRef(new Map<string | number, naver.maps.Marker>());
  const clusterMarkersRef = useRef(new Map<string, naver.maps.Marker>());
  const clusterIconRootsRef = useRef(new Map<string, Root>());
  const clusterIconContainersRef = useRef(new Map<string, HTMLDivElement>());

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
          const nextZoom = Math.min(
            map.getZoom() + 1,
            options?.maxZoom ?? 21
          );
          map.setCenter(new naver.maps.LatLng(cluster.position.lat, cluster.position.lng));
          map.setZoom(nextZoom);
        }
      },

      fitBounds(
        bounds: LatLngBoundsLiteral,
        options?: { readonly padding?: number }
      ) {
        const paddedBounds = options?.padding
          ? padBounds(bounds, options.padding)
          : bounds;

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

  // ── clusterIcon ref ───────────────────────────────────────────

  const clusterIconRef = useRef(clusterIcon);
  useEffect(() => {
    clusterIconRef.current = clusterIcon;
  }, [clusterIcon]);

  // ── Recompute ─────────────────────────────────────────────────

  const recompute = useCallback(() => {
    if (!map || sdkStatus !== "ready" || !enabled) return;

    const zoom = map.getZoom();
    const bounds = getMapBounds(map);
    const items = Array.from(registryRef.current.values());

    const { clusters, points } = algorithm.cluster(items, { zoom, bounds });

    // Optionally trim items from cluster data
    const maxItems = clusterData?.maxItemsInCluster;
    const includeItems = clusterData?.includeItems ?? true;

    const processedClusters: readonly Cluster<TData>[] = clusters.map((c) => ({
      ...c,
      items: includeItems
        ? maxItems !== undefined
          ? c.items?.slice(0, maxItems)
          : c.items
        : undefined
    }));

    // ── Diff: single points ───────────────────────────────────

    const nextPointIds = new Set(points.map((p) => p.id));
    const prevPointMarkers = pointMarkersRef.current;

    // Remove old
    for (const [id, marker] of prevPointMarkers) {
      if (!nextPointIds.has(id)) {
        marker.setMap(null);
        prevPointMarkers.delete(id);
      }
    }

    // Add/update
    for (const point of points) {
      const existing = prevPointMarkers.get(point.id);
      if (existing) {
        const pos = new naver.maps.LatLng(point.position.lat, point.position.lng);
        existing.setPosition(pos);
        if (point.markerOptions) {
          existing.setOptions({ ...point.markerOptions } as naver.maps.MarkerOptions);
        }
      } else {
        const opts: naver.maps.MarkerOptions = {
          position: new naver.maps.LatLng(point.position.lat, point.position.lng),
          map
        };
        if (point.markerOptions) {
          Object.assign(opts, point.markerOptions);
        }
        const marker = new naver.maps.Marker(opts);
        prevPointMarkers.set(point.id, marker);
      }
    }

    // ── Diff: clusters ────────────────────────────────────────

    const nextClusterIds = new Set(processedClusters.map((c) => c.id));
    const prevClusterMarkers = clusterMarkersRef.current;
    const prevRoots = clusterIconRootsRef.current;
    const prevContainers = clusterIconContainersRef.current;

    // Remove old clusters
    for (const [id, marker] of prevClusterMarkers) {
      if (!nextClusterIds.has(id)) {
        marker.setMap(null);
        prevClusterMarkers.delete(id);

        const root = prevRoots.get(id);
        if (root) {
          root.unmount();
          prevRoots.delete(id);
        }
        prevContainers.delete(id);
      }
    }

    // Add/update clusters
    for (const cluster of processedClusters) {
      const existingMarker = prevClusterMarkers.get(cluster.id);
      const renderer = clusterIconRef.current;

      const iconNode = renderer
        ? renderer({ cluster, count: cluster.count })
        : DefaultClusterIcon({ count: cluster.count });

      if (existingMarker) {
        // Update position
        existingMarker.setPosition(
          new naver.maps.LatLng(cluster.position.lat, cluster.position.lng)
        );

        // Re-render icon
        const root = prevRoots.get(cluster.id);
        if (root) {
          root.render(iconNode);
        }
      } else {
        // Create container + root
        const container = document.createElement("div");
        container.style.cursor = "pointer";
        const root = createRoot(container);
        root.render(iconNode);

        prevContainers.set(cluster.id, container);
        prevRoots.set(cluster.id, root);

        // Create marker
        const marker = new naver.maps.Marker({
          position: new naver.maps.LatLng(cluster.position.lat, cluster.position.lng),
          map,
          icon: { content: container },
          clickable: true
        });

        // Bind click
        naver.maps.Event.addListener(marker, "click", () => {
          onClusterClickRef.current?.({
            cluster,
            helpers: helpersRef.current
          });
        });

        prevClusterMarkers.set(cluster.id, marker);
      }
    }
  }, [map, sdkStatus, enabled, algorithm, clusterData?.includeItems, clusterData?.maxItemsInCluster]);

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
      listeners.push(
        naver.maps.Event.addListener(map, "idle", debouncedRecompute)
      );
    } else if (recomputeOn === "move") {
      listeners.push(
        naver.maps.Event.addListener(map, "bounds_changed", debouncedRecompute)
      );
    } else if (recomputeOn === "zoom") {
      listeners.push(
        naver.maps.Event.addListener(map, "zoom_changed", debouncedRecompute)
      );
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

  // ── Cleanup on unmount ────────────────────────────────────────

  useEffect(() => {
    return () => {
      // Clean up point markers
      for (const marker of pointMarkersRef.current.values()) {
        marker.setMap(null);
      }
      pointMarkersRef.current.clear();

      // Clean up cluster markers + roots
      for (const marker of clusterMarkersRef.current.values()) {
        marker.setMap(null);
      }
      clusterMarkersRef.current.clear();

      for (const root of clusterIconRootsRef.current.values()) {
        root.unmount();
      }
      clusterIconRootsRef.current.clear();
      clusterIconContainersRef.current.clear();
    };
  }, []);

  // ── Disable: clear everything when enabled becomes false ──────

  useEffect(() => {
    if (enabled) return;

    for (const marker of pointMarkersRef.current.values()) {
      marker.setMap(null);
    }
    pointMarkersRef.current.clear();

    for (const marker of clusterMarkersRef.current.values()) {
      marker.setMap(null);
    }
    clusterMarkersRef.current.clear();

    for (const root of clusterIconRootsRef.current.values()) {
      root.unmount();
    }
    clusterIconRootsRef.current.clear();
    clusterIconContainersRef.current.clear();
  }, [enabled]);

  // ── Render ────────────────────────────────────────────────────

  return (
    <ClustererContext.Provider value={registry as ClustererRegistry}>
      {children}
    </ClustererContext.Provider>
  );
}

MarkerClusterer.displayName = "MarkerClusterer";
