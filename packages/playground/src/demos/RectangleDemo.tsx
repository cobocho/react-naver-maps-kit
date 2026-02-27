import { withDemoNaverMapProvider } from "./withDemoNaverMapProvider.tsx";
import { useState } from "react";
import { NaverMap, Rectangle } from "react-naver-maps-kit";

import { useEventLog } from "../useEventLog.ts";
import { EventLog } from "../EventLog.tsx";

const DEFAULT_CENTER = { lat: 37.5666102, lng: 126.9783881 };

function RectangleDemoBase() {
  const { entries, log, clear } = useEventLog();

  const [spread, setSpread] = useState(0.005);
  const [fillColor, setFillColor] = useState("#9C27B0");
  const [fillOpacity, setFillOpacity] = useState(0.2);
  const [strokeColor, setStrokeColor] = useState("#9C27B0");
  const [strokeWeight, setStrokeWeight] = useState(2);
  const [visible, setVisible] = useState(true);
  const [clickable, setClickable] = useState(true);

  const bounds = {
    south: DEFAULT_CENTER.lat - spread,
    north: DEFAULT_CENTER.lat + spread,
    west: DEFAULT_CENTER.lng - spread * 1.2,
    east: DEFAULT_CENTER.lng + spread * 1.2
  };

  return (
    <>
      <h1 className="demo-title">Rectangle</h1>
      <p className="demo-description">사각형 오버레이의 bounds, 스타일, 이벤트를 제어합니다.</p>

      <div className="map-container">
        <NaverMap
          defaultCenter={DEFAULT_CENTER}
          defaultZoom={15}
          style={{ width: "100%", height: 500 }}
        >
          <Rectangle
            bounds={bounds}
            fillColor={fillColor}
            fillOpacity={fillOpacity}
            strokeColor={strokeColor}
            strokeWeight={strokeWeight}
            visible={visible}
            clickable={clickable}
            onClick={() => log("rectangle click")}
            onMouseOver={() => log("rectangle mouseover")}
            onMouseOut={() => log("rectangle mouseout")}
          />
        </NaverMap>
      </div>

      <div className="controls-panel">
        <div className="controls-title">Controls</div>
        <div className="controls-grid">
          <div className="control-item">
            <label>Size ({spread.toFixed(3)})</label>
            <input
              type="range"
              min={0.001}
              max={0.02}
              step={0.001}
              value={spread}
              onChange={(e) => setSpread(Number(e.target.value))}
            />
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

export const RectangleDemo = withDemoNaverMapProvider(RectangleDemoBase);
