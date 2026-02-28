import { withDemoNaverMapProvider } from "./withDemoNaverMapProvider.tsx";
import { useState } from "react";
import { Circle, NaverMap } from "react-naver-maps-kit";

import { useEventLog } from "../useEventLog.ts";
import { EventLog } from "../EventLog.tsx";

const DEFAULT_POS = { lat: 37.5666102, lng: 126.9783881 };

function CircleDemoBase() {
  const { entries, log, clear } = useEventLog();

  const [radius, setRadius] = useState(500);
  const [fillColor, setFillColor] = useState("#4285F4");
  const [fillOpacity, setFillOpacity] = useState(0.3);
  const [strokeColor, setStrokeColor] = useState("#4285F4");
  const [strokeWeight, setStrokeWeight] = useState(2);
  const [strokeOpacity, setStrokeOpacity] = useState(0.8);
  const [visible, setVisible] = useState(true);
  const [clickable, setClickable] = useState(true);

  return (
    <>
      <h1 className="demo-title">Circle</h1>
      <p className="demo-description">
        원형 오버레이의 반지름, 색상, 투명도, 클릭 이벤트를 제어합니다.
      </p>

      <div className="map-container">
        <NaverMap
          defaultCenter={DEFAULT_POS}
          defaultZoom={14}
          style={{ width: "100%", height: 500 }}
        >
          <Circle
            center={DEFAULT_POS}
            radius={radius}
            fillColor={fillColor}
            fillOpacity={fillOpacity}
            strokeColor={strokeColor}
            strokeWeight={strokeWeight}
            strokeOpacity={strokeOpacity}
            visible={visible}
            clickable={clickable}
            onClick={() => log("circle click")}
            onMouseOver={() => log("circle mouseover")}
            onMouseOut={() => log("circle mouseout")}
          />
        </NaverMap>
      </div>

      <div className="controls-panel">
        <div className="controls-title">Controls</div>
        <div className="controls-grid">
          <div className="control-item">
            <label>Radius ({radius}m)</label>
            <input
              type="range"
              min={100}
              max={5000}
              step={100}
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
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
            <label>StrokeOpacity ({strokeOpacity})</label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={strokeOpacity}
              onChange={(e) => setStrokeOpacity(Number(e.target.value))}
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

export const CircleDemo = withDemoNaverMapProvider(CircleDemoBase);
