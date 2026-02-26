import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Marker,
  MarkerClusterer,
  NaverMap,
  NaverMapProvider,
  type AlgorithmContext,
  type Cluster,
  type ClusterAlgorithm,
  type ItemRecord,
  type NaverMapRef
} from "react-naver-maps-kit";

import { DEFAULT_CENTER, NCP_KEY_ID } from "../constants";

type PointData = {
  id: string;
  name: string;
};

type PointItem = {
  id: string;
  position: { lat: number; lng: number };
  data: PointData;
};

const DENSE_POINTS: PointItem[] = [
  { id: "p1", position: { lat: 37.5665, lng: 126.978 }, data: { id: "p1", name: "cityhall" } },
  { id: "p2", position: { lat: 37.567, lng: 126.979 }, data: { id: "p2", name: "north" } },
  { id: "p3", position: { lat: 37.5658, lng: 126.9773 }, data: { id: "p3", name: "west" } },
  { id: "p4", position: { lat: 37.5662, lng: 126.9795 }, data: { id: "p4", name: "east" } },
  { id: "p5", position: { lat: 37.5652, lng: 126.9786 }, data: { id: "p5", name: "south" } }
];

const SPREAD_POINTS: PointItem[] = [
  { id: "s1", position: { lat: 37.5665, lng: 126.978 }, data: { id: "s1", name: "seoul" } },
  { id: "s2", position: { lat: 35.1796, lng: 129.0756 }, data: { id: "s2", name: "busan" } },
  { id: "s3", position: { lat: 33.4996, lng: 126.5312 }, data: { id: "s3", name: "jeju" } }
];

function ScenarioLayout({
  buttons,
  logs,
  map
}: {
  buttons: React.ReactNode;
  logs: React.ReactNode;
  map: React.ReactNode;
}) {
  return (
    <div className="scenario-layout">
      <div className="scenario-actions">{buttons}</div>
      <div className="scenario-body">
        <div className="scenario-logs">{logs}</div>
        <div className="scenario-map">{map}</div>
      </div>
    </div>
  );
}

function summarizeItems<TData>(items: readonly ItemRecord<TData>[]) {
  if (items.length === 0) {
    return null;
  }

  let sumLat = 0;
  let sumLng = 0;
  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;

  for (const item of items) {
    sumLat += item.position.lat;
    sumLng += item.position.lng;

    minLat = Math.min(minLat, item.position.lat);
    maxLat = Math.max(maxLat, item.position.lat);
    minLng = Math.min(minLng, item.position.lng);
    maxLng = Math.max(maxLng, item.position.lng);
  }

  return {
    position: {
      lat: sumLat / items.length,
      lng: sumLng / items.length
    },
    bounds: {
      south: minLat,
      west: minLng,
      north: maxLat,
      east: maxLng
    }
  };
}

function createSingleClusterResult<TData>(
  items: readonly ItemRecord<TData>[],
  clusterId: string
): {
  readonly clusters: readonly Cluster<TData>[];
  readonly points: readonly ItemRecord<TData>[];
} {
  const summary = summarizeItems(items);

  if (!summary) {
    return { clusters: [], points: [] };
  }

  return {
    clusters: [
      {
        id: clusterId,
        position: summary.position,
        count: items.length,
        bounds: summary.bounds,
        items
      }
    ],
    points: []
  };
}

function createAllClusterAlgorithm<TData>(clusterId: string): ClusterAlgorithm<TData> {
  return {
    cluster(items) {
      return createSingleClusterResult(items, clusterId);
    }
  };
}

function readMapCenterText(map: naver.maps.Map | null): string {
  if (!map) {
    return "";
  }

  const center = map.getCenter();
  return JSON.stringify({ lat: center.y, lng: center.x });
}

/* ─── 1. smoke ─── */

function SmokePage() {
  const [mapReady, setMapReady] = useState(false);
  const [clusterClickCount, setClusterClickCount] = useState(0);
  const [lastClusterCount, setLastClusterCount] = useState(0);

  const algorithm = useMemo(() => createAllClusterAlgorithm<PointData>("smoke-cluster"), []);

  return (
    <ScenarioLayout
      buttons={
        <button data-testid="reset-click-log" onClick={() => setClusterClickCount(0)}>
          클릭 카운트 초기화
        </button>
      }
      logs={
        <>
          <span data-testid="map-ready">{String(mapReady)}</span>
          <span data-testid="cluster-click-count">{clusterClickCount}</span>
          <span data-testid="last-cluster-count">{lastClusterCount}</span>
        </>
      }
      map={
        <NaverMapProvider ncpKeyId={NCP_KEY_ID} timeoutMs={15000}>
          <NaverMap
            data-testid="map-container"
            defaultCenter={DEFAULT_CENTER}
            defaultZoom={13}
            style={{ width: "100%", height: 500 }}
            onMapReady={() => setMapReady(true)}
          >
            <MarkerClusterer
              algorithm={algorithm}
              clusterIcon={({ count }) => <div data-testid="smoke-cluster-icon">{count}</div>}
              onClusterClick={({ cluster }) => {
                setClusterClickCount((v) => v + 1);
                setLastClusterCount(cluster.count);
              }}
            >
              {DENSE_POINTS.map((point) => (
                <Marker
                  key={point.id}
                  clustererItemId={point.id}
                  position={point.position}
                  item={point.data}
                />
              ))}
            </MarkerClusterer>
          </NaverMap>
        </NaverMapProvider>
      }
    />
  );
}

/* ─── 2. enabled ─── */

function EnabledPage() {
  const [mapReady, setMapReady] = useState(false);
  const [enabled, setEnabled] = useState(true);

  const algorithm = useMemo(() => createAllClusterAlgorithm<PointData>("enabled-cluster"), []);

  return (
    <ScenarioLayout
      buttons={
        <button data-testid="toggle-enabled" onClick={() => setEnabled((v) => !v)}>
          enabled 토글
        </button>
      }
      logs={
        <>
          <span data-testid="map-ready">{String(mapReady)}</span>
          <span data-testid="enabled-state">{String(enabled)}</span>
        </>
      }
      map={
        <NaverMapProvider ncpKeyId={NCP_KEY_ID} timeoutMs={15000}>
          <NaverMap
            data-testid="map-container"
            defaultCenter={DEFAULT_CENTER}
            defaultZoom={13}
            style={{ width: "100%", height: 500 }}
            onMapReady={() => setMapReady(true)}
          >
            <MarkerClusterer
              algorithm={algorithm}
              enabled={enabled}
              clusterIcon={({ count }) => <div data-testid="enabled-cluster-icon">{count}</div>}
            >
              {SPREAD_POINTS.map((point) => (
                <Marker
                  key={point.id}
                  clustererItemId={point.id}
                  position={point.position}
                  item={point.data}
                >
                  <div data-testid={`point-marker-${point.id}`}>{point.id}</div>
                </Marker>
              ))}
            </MarkerClusterer>
          </NaverMap>
        </NaverMapProvider>
      }
    />
  );
}

/* ─── 3. clusterData ─── */

function ClusterDataPage() {
  const [mapReady, setMapReady] = useState(false);
  const [includeItems, setIncludeItems] = useState(true);
  const [maxItemsInCluster, setMaxItemsInCluster] = useState<number | undefined>(undefined);
  const [clusterClickCount, setClusterClickCount] = useState(0);
  const [clickedItemsLength, setClickedItemsLength] = useState(0);

  const algorithm = useMemo(() => createAllClusterAlgorithm<PointData>("cluster-data"), []);

  return (
    <ScenarioLayout
      buttons={
        <>
          <button data-testid="set-include-items-true" onClick={() => setIncludeItems(true)}>
            includeItems true
          </button>
          <button data-testid="set-include-items-false" onClick={() => setIncludeItems(false)}>
            includeItems false
          </button>
          <button data-testid="set-max-items-2" onClick={() => setMaxItemsInCluster(2)}>
            maxItems 2
          </button>
          <button data-testid="clear-max-items" onClick={() => setMaxItemsInCluster(undefined)}>
            maxItems 해제
          </button>
        </>
      }
      logs={
        <>
          <span data-testid="map-ready">{String(mapReady)}</span>
          <span data-testid="include-items-state">{String(includeItems)}</span>
          <span data-testid="max-items-state">{String(maxItemsInCluster ?? "")}</span>
          <span data-testid="cluster-click-count">{clusterClickCount}</span>
          <span data-testid="clicked-items-length">{clickedItemsLength}</span>
        </>
      }
      map={
        <NaverMapProvider ncpKeyId={NCP_KEY_ID} timeoutMs={15000}>
          <NaverMap
            data-testid="map-container"
            defaultCenter={DEFAULT_CENTER}
            defaultZoom={13}
            style={{ width: "100%", height: 500 }}
            onMapReady={() => setMapReady(true)}
          >
            <MarkerClusterer
              algorithm={algorithm}
              clusterData={{ includeItems, maxItemsInCluster }}
              clusterIcon={({ cluster, count }) => (
                <div data-testid="cluster-data-icon">
                  <span data-testid="cluster-data-count">{count}</span>
                  <span data-testid="cluster-data-items-length">{cluster.items?.length ?? 0}</span>
                  <span data-testid="cluster-data-item-ids">
                    {(cluster.items ?? []).map((item) => String(item.id)).join(",")}
                  </span>
                </div>
              )}
              onClusterClick={({ cluster }) => {
                setClusterClickCount((v) => v + 1);
                setClickedItemsLength(cluster.items?.length ?? 0);
              }}
            >
              {DENSE_POINTS.map((point) => (
                <Marker
                  key={point.id}
                  clustererItemId={point.id}
                  position={point.position}
                  item={point.data}
                />
              ))}
            </MarkerClusterer>
          </NaverMap>
        </NaverMapProvider>
      }
    />
  );
}

/* ─── 4. helpers ─── */

function HelpersPage() {
  const mapRef = useRef<NaverMapRef>(null);
  const [mapReady, setMapReady] = useState(false);
  const [actionMode, setActionMode] = useState<"zoom" | "fit">("zoom");
  const [clusterClickCount, setClusterClickCount] = useState(0);
  const [mapCenter, setMapCenter] = useState("");
  const [mapZoom, setMapZoom] = useState("");

  const algorithm = useMemo(() => createAllClusterAlgorithm<PointData>("helper-cluster"), []);

  const readMapState = useCallback(() => {
    const map = mapRef.current?.getInstance() ?? null;

    setMapCenter(readMapCenterText(map));
    setMapZoom(String(map?.getZoom() ?? ""));
  }, []);

  const resetMap = useCallback(() => {
    const map = mapRef.current?.getInstance();

    if (!map) {
      return;
    }

    map.setCenter(DEFAULT_CENTER);
    map.setZoom(7);
  }, []);

  return (
    <ScenarioLayout
      buttons={
        <>
          <button data-testid="mode-zoom" onClick={() => setActionMode("zoom")}>
            zoomToCluster 모드
          </button>
          <button data-testid="mode-fit" onClick={() => setActionMode("fit")}>
            fitBounds 모드
          </button>
          <button data-testid="reset-map" onClick={resetMap}>
            지도 초기화
          </button>
          <button data-testid="read-map-state" onClick={readMapState}>
            지도 상태 읽기
          </button>
        </>
      }
      logs={
        <>
          <span data-testid="map-ready">{String(mapReady)}</span>
          <span data-testid="action-mode">{actionMode}</span>
          <span data-testid="cluster-click-count">{clusterClickCount}</span>
          <span data-testid="map-center">{mapCenter}</span>
          <span data-testid="map-zoom">{mapZoom}</span>
        </>
      }
      map={
        <NaverMapProvider ncpKeyId={NCP_KEY_ID} timeoutMs={15000}>
          <NaverMap
            ref={mapRef}
            data-testid="map-container"
            defaultCenter={DEFAULT_CENTER}
            defaultZoom={12}
            style={{ width: "100%", height: 500 }}
            onMapReady={() => setMapReady(true)}
          >
            <MarkerClusterer
              algorithm={algorithm}
              clusterIcon={({ count }) => <div data-testid="helpers-cluster-icon">{count}</div>}
              onClusterClick={({ cluster, helpers }) => {
                setClusterClickCount((v) => v + 1);

                if (actionMode === "zoom") {
                  helpers.zoomToCluster(cluster, { padding: 10, maxZoom: 14 });
                  return;
                }

                if (cluster.bounds) {
                  helpers.fitBounds(cluster.bounds, { padding: 10 });
                }
              }}
            >
              {DENSE_POINTS.map((point) => (
                <Marker
                  key={point.id}
                  clustererItemId={point.id}
                  position={point.position}
                  item={point.data}
                />
              ))}
            </MarkerClusterer>
          </NaverMap>
        </NaverMapProvider>
      }
    />
  );
}

/* ─── 5. behavior ─── */

function BehaviorPage() {
  const mapRef = useRef<NaverMapRef>(null);

  const callCountRef = useRef(0);
  const lastContextRef = useRef<AlgorithmContext | null>(null);

  const [mapReady, setMapReady] = useState(false);
  const [recomputeOn, setRecomputeOn] = useState<"idle" | "move" | "zoom">("idle");
  const [debounceMs, setDebounceMs] = useState(200);

  const [clusterCallCount, setClusterCallCount] = useState(0);
  const [lastContextZoom, setLastContextZoom] = useState("");

  const algorithm = useMemo<ClusterAlgorithm<PointData>>(
    () => ({
      cluster(items, ctx) {
        callCountRef.current += 1;
        lastContextRef.current = ctx;
        return createSingleClusterResult(items, "behavior-cluster");
      }
    }),
    []
  );

  const readMetrics = useCallback(() => {
    setClusterCallCount(callCountRef.current);
    setLastContextZoom(String(lastContextRef.current?.zoom ?? ""));
  }, []);

  const triggerMapEvent = useCallback((eventName: "idle" | "bounds_changed" | "zoom_changed") => {
    const map = mapRef.current?.getInstance();

    if (!map) {
      return;
    }

    naver.maps.Event.trigger(map, eventName);
  }, []);

  const triggerIdleTriple = useCallback(() => {
    const map = mapRef.current?.getInstance();

    if (!map) {
      return;
    }

    naver.maps.Event.trigger(map, "idle");
    naver.maps.Event.trigger(map, "idle");
    naver.maps.Event.trigger(map, "idle");
  }, []);

  const setZoom15 = useCallback(() => {
    const map = mapRef.current?.getInstance();

    if (!map) {
      return;
    }

    map.setZoom(15);
  }, []);

  return (
    <ScenarioLayout
      buttons={
        <>
          <button data-testid="set-recompute-idle" onClick={() => setRecomputeOn("idle")}>
            idle
          </button>
          <button data-testid="set-recompute-move" onClick={() => setRecomputeOn("move")}>
            move
          </button>
          <button data-testid="set-recompute-zoom" onClick={() => setRecomputeOn("zoom")}>
            zoom
          </button>
          <button data-testid="set-debounce-0" onClick={() => setDebounceMs(0)}>
            debounce 0
          </button>
          <button data-testid="set-debounce-200" onClick={() => setDebounceMs(200)}>
            debounce 200
          </button>
          <button data-testid="trigger-idle" onClick={() => triggerMapEvent("idle")}>
            trigger idle
          </button>
          <button data-testid="trigger-move" onClick={() => triggerMapEvent("bounds_changed")}>
            trigger move
          </button>
          <button data-testid="trigger-zoom" onClick={() => triggerMapEvent("zoom_changed")}>
            trigger zoom
          </button>
          <button data-testid="trigger-idle-triple" onClick={triggerIdleTriple}>
            trigger idle x3
          </button>
          <button data-testid="set-map-zoom-15" onClick={setZoom15}>
            map zoom 15
          </button>
          <button data-testid="read-metrics" onClick={readMetrics}>
            메트릭 읽기
          </button>
        </>
      }
      logs={
        <>
          <span data-testid="map-ready">{String(mapReady)}</span>
          <span data-testid="recompute-on">{recomputeOn}</span>
          <span data-testid="debounce-ms">{debounceMs}</span>
          <span data-testid="cluster-call-count">{clusterCallCount}</span>
          <span data-testid="last-context-zoom">{lastContextZoom}</span>
        </>
      }
      map={
        <NaverMapProvider ncpKeyId={NCP_KEY_ID} timeoutMs={15000}>
          <NaverMap
            ref={mapRef}
            data-testid="map-container"
            defaultCenter={DEFAULT_CENTER}
            defaultZoom={12}
            style={{ width: "100%", height: 500 }}
            onMapReady={() => setMapReady(true)}
          >
            <MarkerClusterer
              algorithm={algorithm}
              behavior={{ recomputeOn, debounceMs }}
              clusterIcon={({ count }) => <div data-testid="behavior-cluster-icon">{count}</div>}
            >
              {DENSE_POINTS.map((point) => (
                <Marker
                  key={point.id}
                  clustererItemId={point.id}
                  position={point.position}
                  item={point.data}
                />
              ))}
            </MarkerClusterer>
          </NaverMap>
        </NaverMapProvider>
      }
    />
  );
}

/* ─── 6. algorithm switch ─── */

function AlgorithmSwitchPage() {
  const destroyCountRef = useRef(0);

  const [mapReady, setMapReady] = useState(false);
  const [useAlgorithmB, setUseAlgorithmB] = useState(false);
  const [destroyCount, setDestroyCount] = useState(0);
  const [clusterClickCount, setClusterClickCount] = useState(0);
  const [lastClickedClusterId, setLastClickedClusterId] = useState("");

  const algorithm = useMemo<ClusterAlgorithm<PointData>>(() => {
    const clusterId = useAlgorithmB ? "algo-b" : "algo-a";

    return {
      cluster(items) {
        return createSingleClusterResult(items, clusterId);
      },
      destroy() {
        destroyCountRef.current += 1;
      }
    };
  }, [useAlgorithmB]);

  const readDestroyCount = useCallback(() => {
    setDestroyCount(destroyCountRef.current);
  }, []);

  return (
    <ScenarioLayout
      buttons={
        <>
          <button data-testid="use-algorithm-a" onClick={() => setUseAlgorithmB(false)}>
            algorithm A
          </button>
          <button data-testid="use-algorithm-b" onClick={() => setUseAlgorithmB(true)}>
            algorithm B
          </button>
          <button data-testid="read-destroy-count" onClick={readDestroyCount}>
            destroy 읽기
          </button>
        </>
      }
      logs={
        <>
          <span data-testid="map-ready">{String(mapReady)}</span>
          <span data-testid="algorithm-mode">{useAlgorithmB ? "B" : "A"}</span>
          <span data-testid="destroy-count">{destroyCount}</span>
          <span data-testid="cluster-click-count">{clusterClickCount}</span>
          <span data-testid="last-clicked-cluster-id">{lastClickedClusterId}</span>
        </>
      }
      map={
        <NaverMapProvider ncpKeyId={NCP_KEY_ID} timeoutMs={15000}>
          <NaverMap
            data-testid="map-container"
            defaultCenter={DEFAULT_CENTER}
            defaultZoom={13}
            style={{ width: "100%", height: 500 }}
            onMapReady={() => setMapReady(true)}
          >
            <MarkerClusterer
              algorithm={algorithm}
              clusterIcon={({ cluster, count }) => (
                <div data-testid="algorithm-cluster-icon">
                  <span data-testid="algorithm-cluster-id">{cluster.id}</span>
                  <span data-testid="algorithm-cluster-count">{count}</span>
                </div>
              )}
              onClusterClick={({ cluster }) => {
                setClusterClickCount((v) => v + 1);
                setLastClickedClusterId(cluster.id);
              }}
            >
              {DENSE_POINTS.map((point) => (
                <Marker
                  key={point.id}
                  clustererItemId={point.id}
                  position={point.position}
                  item={point.data}
                />
              ))}
            </MarkerClusterer>
          </NaverMap>
        </NaverMapProvider>
      }
    />
  );
}

/* ─── 7. dynamic ─── */

function DynamicPage() {
  const [mapReady, setMapReady] = useState(false);
  const [items, setItems] = useState<PointItem[]>(SPREAD_POINTS);

  const algorithm = useMemo(() => createAllClusterAlgorithm<PointData>("dynamic-cluster"), []);

  const addPoint = useCallback(() => {
    setItems((prev) => {
      const id = `d${prev.length + 1}`;
      return [
        ...prev,
        {
          id,
          position: {
            lat: 37.55 + (prev.length % 5) * 0.01,
            lng: 126.95 + (prev.length % 7) * 0.01
          },
          data: { id, name: id }
        }
      ];
    });
  }, []);

  const removeLast = useCallback(() => {
    setItems((prev) => prev.slice(0, -1));
  }, []);

  return (
    <ScenarioLayout
      buttons={
        <>
          <button data-testid="add-point" onClick={addPoint}>
            포인트 추가
          </button>
          <button data-testid="remove-point" onClick={removeLast}>
            포인트 제거
          </button>
        </>
      }
      logs={
        <>
          <span data-testid="map-ready">{String(mapReady)}</span>
          <span data-testid="point-count">{items.length}</span>
        </>
      }
      map={
        <NaverMapProvider ncpKeyId={NCP_KEY_ID} timeoutMs={15000}>
          <NaverMap
            data-testid="map-container"
            defaultCenter={DEFAULT_CENTER}
            defaultZoom={12}
            style={{ width: "100%", height: 500 }}
            onMapReady={() => setMapReady(true)}
          >
            <MarkerClusterer
              algorithm={algorithm}
              clusterIcon={({ count }) => <div data-testid="dynamic-cluster-icon">{count}</div>}
            >
              {items.map((point) => (
                <Marker
                  key={point.id}
                  clustererItemId={point.id}
                  position={point.position}
                  item={point.data}
                />
              ))}
            </MarkerClusterer>
          </NaverMap>
        </NaverMapProvider>
      }
    />
  );
}

/* ─── routes ─── */

export const markerClustererRoutes: Record<string, React.FC> = {
  "/marker-clusterer/smoke": SmokePage,
  "/marker-clusterer/enabled": EnabledPage,
  "/marker-clusterer/cluster-data": ClusterDataPage,
  "/marker-clusterer/helpers": HelpersPage,
  "/marker-clusterer/behavior": BehaviorPage,
  "/marker-clusterer/algorithm-switch": AlgorithmSwitchPage,
  "/marker-clusterer/dynamic": DynamicPage
};
