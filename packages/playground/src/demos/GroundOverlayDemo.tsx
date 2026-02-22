import { useState } from "react";
import { GroundOverlay, NaverMap } from "react-naver-maps-kit";

import { useEventLog } from "../useEventLog.ts";
import { EventLog } from "../EventLog.tsx";

const SEOUL_CENTER = { lat: 37.5666102, lng: 126.9783881 };

const OVERLAY_PRESETS = [
  {
    id: "satellite",
    label: "위성 지도",
    url: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&h=400&fit=crop",
    bounds: { south: 37.56, north: 37.573, west: 126.97, east: 126.986 },
    opacity: 0.8
  },
  {
    id: "map",
    label: "지도 이미지",
    url: "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=600&h=400&fit=crop",
    bounds: { south: 37.558, north: 37.575, west: 126.965, east: 126.992 },
    opacity: 0.7
  },
  {
    id: "terrain",
    label: "지형도",
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop",
    bounds: { south: 37.562, north: 37.571, west: 126.972, east: 126.985 },
    opacity: 0.6
  },
  {
    id: "aerial",
    label: "항공 사진",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
    bounds: { south: 37.565, north: 37.568, west: 126.976, east: 126.981 },
    opacity: 0.75
  }
];

export function GroundOverlayDemo() {
  const { entries, log, clear } = useEventLog();

  const [selectedPreset, setSelectedPreset] = useState(OVERLAY_PRESETS[0]);
  const [opacity, setOpacity] = useState(0.8);
  const [clickable, setClickable] = useState(true);

  return (
    <>
      <h1 className="demo-title">GroundOverlay</h1>
      <p className="demo-description">
        지도 위에 이미지를 오버레이로 표시합니다. bounds 영역에 맞춰 이미지가 늘어납니다.
      </p>

      <div className="info-row">
        <span className="info-chip">선택: {selectedPreset.label}</span>
        <span className="info-chip">투명도: {opacity}</span>
        <span className="info-chip">클릭: {clickable ? "가능" : "불가"}</span>
      </div>

      <div className="map-container">
        <NaverMap
          defaultCenter={SEOUL_CENTER}
          defaultZoom={13}
          style={{ width: "100%", height: 500 }}
        >
          <GroundOverlay
            key={selectedPreset.id}
            url={selectedPreset.url}
            bounds={selectedPreset.bounds}
            opacity={opacity}
            clickable={clickable}
            onClick={() => log("ground overlay 클릭")}
          />
        </NaverMap>
      </div>

      <div className="controls-panel">
        <div className="controls-title">Controls</div>
        <div className="controls-grid">
          <div className="control-item">
            <input
              type="checkbox"
              checked={visible}
              onChange={(e) => setVisible(e.target.checked)}
            />
            <label>Visible</label>
          </div>
          <div className="control-item">
            <input
              type="checkbox"
              checked={clickable}
              onChange={(e) => setClickable(e.target.checked)}
            />
            <label>Clickable</label>
          </div>
        </div>

        <div className="controls-grid" style={{ marginTop: 12 }}>
          <div className="control-item">
            <label>투명도 ({opacity})</label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
            />
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <div className="controls-title">오버레이 프리셋</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
            {OVERLAY_PRESETS.map((preset) => (
              <button
                key={preset.id}
                className={`btn ${selectedPreset.id === preset.id ? "btn-primary" : ""}`}
                onClick={() => {
                  setSelectedPreset(preset);
                  setOpacity(preset.opacity);
                  log(`${preset.label} 선택`);
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <div className="controls-title">Bounds 정보</div>
          <pre
            style={{
              fontSize: 11,
              lineHeight: 1.5,
              overflow: "auto",
              padding: 8,
              background: "#f8f8fa",
              borderRadius: 6
            }}
          >
            {`bounds: {
  south: ${selectedPreset.bounds.south},
  north: ${selectedPreset.bounds.north},
  west:  ${selectedPreset.bounds.west},
  east:  ${selectedPreset.bounds.east}
}`}
          </pre>
        </div>
      </div>

      <EventLog entries={entries} onClear={clear} />
    </>
  );
}
