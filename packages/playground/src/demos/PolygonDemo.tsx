import { useState } from "react";
import { NaverMap, Polygon } from "react-naver-maps-kit";

import { useEventLog } from "../useEventLog.ts";
import { EventLog } from "../EventLog.tsx";

const PRESETS = {
  triangle: {
    label: "Triangle",
    paths: [
      { lat: 37.57, lng: 126.975 },
      { lat: 37.56, lng: 126.985 },
      { lat: 37.56, lng: 126.965 }
    ]
  },
  rectangle: {
    label: "Rectangle",
    paths: [
      { lat: 37.57, lng: 126.97 },
      { lat: 37.57, lng: 126.985 },
      { lat: 37.56, lng: 126.985 },
      { lat: 37.56, lng: 126.97 }
    ]
  },
  star: {
    label: "Star (5-point)",
    paths: (() => {
      const cx = 126.978,
        cy = 37.566,
        r1 = 0.008,
        r2 = 0.003;
      return Array.from({ length: 10 }, (_, i) => {
        const angle = Math.PI / 2 + (i * Math.PI) / 5;
        const r = i % 2 === 0 ? r1 : r2;
        return { lat: cy + r * Math.sin(angle), lng: cx + r * Math.cos(angle) };
      });
    })()
  }
};

type PresetKey = keyof typeof PRESETS;

export function PolygonDemo() {
  const { entries, log, clear } = useEventLog();

  const [preset, setPreset] = useState<PresetKey>("triangle");
  const [fillColor, setFillColor] = useState("#34A853");
  const [fillOpacity, setFillOpacity] = useState(0.3);
  const [strokeColor, setStrokeColor] = useState("#34A853");
  const [strokeWeight, setStrokeWeight] = useState(2);
  const [visible, setVisible] = useState(true);
  const [clickable, setClickable] = useState(true);

  const paths = [...PRESETS[preset].paths];

  return (
    <>
      <h1 className="demo-title">Polygon</h1>
      <p className="demo-description">
        다각형 오버레이의 경로 프리셋, 스타일, 이벤트를 제어합니다.
      </p>

      <div className="map-container">
        <NaverMap
          defaultCenter={{ lat: 37.566, lng: 126.978 }}
          defaultZoom={15}
          style={{ width: "100%", height: 500 }}
        >
          <Polygon
            paths={[paths]}
            fillColor={fillColor}
            fillOpacity={fillOpacity}
            strokeColor={strokeColor}
            strokeWeight={strokeWeight}
            visible={visible}
            clickable={clickable}
            onClick={() => log("polygon click")}
            onMouseOver={() => log("polygon mouseover")}
            onMouseOut={() => log("polygon mouseout")}
          />
        </NaverMap>
      </div>

      <div className="controls-panel">
        <div className="controls-title">Controls</div>
        <div className="controls-grid">
          <div className="control-item">
            <label>Shape</label>
            <select value={preset} onChange={(e) => setPreset(e.target.value as PresetKey)}>
              {Object.entries(PRESETS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>
          <div className="control-item">
            <label>Fill</label>
            <input type="color" value={fillColor} onChange={(e) => setFillColor(e.target.value)} />
          </div>
          <div className="control-item">
            <label>FillOpacity ({fillOpacity})</label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={fillOpacity}
              onChange={(e) => setFillOpacity(Number(e.target.value))}
            />
          </div>
          <div className="control-item">
            <label>Stroke</label>
            <input
              type="color"
              value={strokeColor}
              onChange={(e) => setStrokeColor(e.target.value)}
            />
          </div>
          <div className="control-item">
            <label>StrokeWeight ({strokeWeight})</label>
            <input
              type="range"
              min={0}
              max={10}
              value={strokeWeight}
              onChange={(e) => setStrokeWeight(Number(e.target.value))}
            />
          </div>
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
      </div>

      <EventLog entries={entries} onClear={clear} />
    </>
  );
}
