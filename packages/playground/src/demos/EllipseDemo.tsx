import { withDemoNaverMapProvider } from "./withDemoNaverMapProvider.tsx";
import { useState } from "react";
import { Ellipse, NaverMap } from "react-naver-maps-kit";

import { useEventLog } from "../useEventLog.ts";
import { EventLog } from "../EventLog.tsx";

const DEFAULT_CENTER = { lat: 37.5666102, lng: 126.9783881 };

function EllipseDemoBase() {
  const { entries, log, clear } = useEventLog();

  const [boundsSpread, setBoundsSpread] = useState(0.01);
  const [fillColor, setFillColor] = useState("#EA4335");
  const [fillOpacity, setFillOpacity] = useState(0.25);
  const [strokeColor, setStrokeColor] = useState("#EA4335");
  const [strokeWeight, setStrokeWeight] = useState(2);
  const [visible, setVisible] = useState(true);
  const [clickable, setClickable] = useState(true);

  const bounds = {
    south: DEFAULT_CENTER.lat - boundsSpread,
    north: DEFAULT_CENTER.lat + boundsSpread,
    west: DEFAULT_CENTER.lng - boundsSpread * 1.5,
    east: DEFAULT_CENTER.lng + boundsSpread * 1.5
  };

  return (
    <>
      <h1 className="demo-title">Ellipse</h1>
      <p className="demo-description">타원형 오버레이의 bounds, 스타일, 이벤트를 제어합니다.</p>

      <div className="map-container">
        <NaverMap
          defaultCenter={DEFAULT_CENTER}
          defaultZoom={14}
          style={{ width: "100%", height: 500 }}
        >
          <Ellipse
            bounds={bounds}
            fillColor={fillColor}
            fillOpacity={fillOpacity}
            strokeColor={strokeColor}
            strokeWeight={strokeWeight}
            visible={visible}
            clickable={clickable}
            onClick={() => log("ellipse click")}
          />
        </NaverMap>
      </div>

      <div className="controls-panel">
        <div className="controls-title">Controls</div>
        <div className="controls-grid">
          <div className="control-item">
            <label>Size ({boundsSpread.toFixed(3)})</label>
            <input
              type="range"
              min={0.002}
              max={0.05}
              step={0.001}
              value={boundsSpread}
              onChange={(e) => setBoundsSpread(Number(e.target.value))}
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

export const EllipseDemo = withDemoNaverMapProvider(EllipseDemoBase);
