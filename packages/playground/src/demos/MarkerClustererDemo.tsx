import { useMemo, useState } from "react";
import { Marker, MarkerClusterer, NaverMap } from "react-naver-maps-kit";
import type { BuiltInAlgorithmConfig, Cluster } from "react-naver-maps-kit";

import { useEventLog } from "../useEventLog.ts";
import { EventLog } from "../EventLog.tsx";

const SEOUL_CENTER = { lat: 37.5666102, lng: 126.9783881 };

interface PointData {
  name: string;
  category: string;
}

function generateRandomPoints(
  count: number
): Array<{ id: number; lat: number; lng: number; data: PointData }> {
  const categories = ["cafe", "restaurant", "shop", "park", "office"];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    lat: SEOUL_CENTER.lat + (Math.random() - 0.5) * 0.08,
    lng: SEOUL_CENTER.lng + (Math.random() - 0.5) * 0.1,
    data: {
      name: `Point ${i + 1}`,
      category: categories[i % categories.length]
    }
  }));
}

function ClusterBadge({ count }: { count: number }) {
  const size = count < 10 ? 36 : count < 100 ? 44 : 52;
  const bg = count < 10 ? "#4285F4" : count < 100 ? "#FBBC04" : "#EA4335";

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: size < 40 ? 12 : 14,
        border: "2px solid #fff",
        boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        cursor: "pointer"
      }}
    >
      {count}
    </div>
  );
}

export function MarkerClustererDemo() {
  const { entries, log, clear } = useEventLog();

  const [pointCount, setPointCount] = useState(200);
  const [algorithmType, setAlgorithmType] = useState<"supercluster" | "grid" | "radius">(
    "supercluster"
  );
  const [radius, setRadius] = useState(60);
  const [enabled, setEnabled] = useState(true);
  const [includeItems, setIncludeItems] = useState(true);
  const [recomputeOn, setRecomputeOn] = useState<"idle" | "move" | "zoom">("idle");
  const [seed, setSeed] = useState(0);

  const points = useMemo(() => generateRandomPoints(pointCount), [pointCount, seed]);

  const algorithm: BuiltInAlgorithmConfig = useMemo(() => {
    switch (algorithmType) {
      case "grid":
        return { type: "grid", gridSize: radius, minClusterSize: 2 };
      case "radius":
        return { type: "radius", radius, minClusterSize: 2 };
      case "supercluster":
        return { type: "supercluster", radius };
    }
  }, [algorithmType, radius]);

  return (
    <>
      <h1 className="demo-title">MarkerClusterer</h1>
      <p className="demo-description">
        대량의 마커를 클러스터링합니다. 알고리즘 타입, 반지름, 포인트 수, 커스텀 클러스터 아이콘,
        클릭 이벤트를 테스트합니다.
      </p>

      <div className="info-row">
        <span className="info-chip">Points: {pointCount}</span>
        <span className="info-chip">Algorithm: {algorithmType}</span>
        <span className="info-chip">Radius: {radius}</span>
        <span className="info-chip">Enabled: {enabled ? "Yes" : "No"}</span>
      </div>

      <div className="map-container">
        <NaverMap
          defaultCenter={SEOUL_CENTER}
          defaultZoom={12}
          style={{ width: "100%", height: 500 }}
        >
          <MarkerClusterer
            algorithm={algorithm}
            enabled={enabled}
            clusterIcon={({ count }) => <ClusterBadge count={count} />}
            onClusterClick={({ cluster, helpers }) => {
              log(`cluster click → id=${cluster.id}, count=${cluster.count}`);
              helpers.zoomToCluster(cluster, { padding: 10 });
            }}
            behavior={{ recomputeOn, debounceMs: 150 }}
            clusterData={{ includeItems }}
          >
            {points.map((p) => (
              <Marker
                key={p.id}
                clustererItemId={p.id}
                item={p.data}
                position={{ lat: p.lat, lng: p.lng }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    background: "red",
                    borderRadius: "50%",
                    border: "2px solid #fff",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
                  }}
                />
              </Marker>
            ))}
          </MarkerClusterer>
        </NaverMap>
      </div>

      <div className="controls-panel">
        <div className="controls-title">Controls</div>
        <div className="controls-grid">
          <div className="control-item">
            <label>Points ({pointCount})</label>
            <input
              type="range"
              min={10}
              max={2000}
              step={10}
              value={pointCount}
              onChange={(e) => setPointCount(Number(e.target.value))}
            />
          </div>
          <div className="control-item">
            <label>Algorithm</label>
            <select
              value={algorithmType}
              onChange={(e) => setAlgorithmType(e.target.value as typeof algorithmType)}
            >
              <option value="supercluster">Supercluster</option>
              <option value="grid">Grid</option>
              <option value="radius">Radius</option>
            </select>
          </div>
          <div className="control-item">
            <label>Radius ({radius})</label>
            <input
              type="range"
              min={20}
              max={200}
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
            />
          </div>
          <div className="control-item">
            <label>RecomputeOn</label>
            <select
              value={recomputeOn}
              onChange={(e) => setRecomputeOn(e.target.value as typeof recomputeOn)}
            >
              <option value="idle">idle</option>
              <option value="move">move</option>
              <option value="zoom">zoom</option>
            </select>
          </div>
          <div className="control-item">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
            />
            <label>Enabled</label>
          </div>
          <div className="control-item">
            <input
              type="checkbox"
              checked={includeItems}
              onChange={(e) => setIncludeItems(e.target.checked)}
            />
            <label>Include Items</label>
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <button className="btn" onClick={() => setSeed((s) => s + 1)}>
            Regenerate Points
          </button>
        </div>
      </div>

      <EventLog entries={entries} onClear={clear} />
    </>
  );
}
