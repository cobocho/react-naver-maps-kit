import { useState } from "react";
import { NaverMap, Polyline } from "react-naver-maps-kit";

import { useEventLog } from "../useEventLog.ts";
import { EventLog } from "../EventLog.tsx";

const ROUTES = {
  straight: {
    label: "Straight",
    path: [
      { lat: 37.566, lng: 126.970 },
      { lat: 37.566, lng: 126.990 },
    ],
  },
  zigzag: {
    label: "Zigzag",
    path: [
      { lat: 37.570, lng: 126.970 },
      { lat: 37.565, lng: 126.975 },
      { lat: 37.570, lng: 126.980 },
      { lat: 37.565, lng: 126.985 },
      { lat: 37.570, lng: 126.990 },
    ],
  },
  curve: {
    label: "Curve (approx)",
    path: Array.from({ length: 20 }, (_, i) => ({
      lat: 37.566 + 0.004 * Math.sin((i / 19) * Math.PI * 2),
      lng: 126.970 + i * 0.001,
    })),
  },
};

type RouteKey = keyof typeof ROUTES;

export function PolylineDemo() {
  const { entries, log, clear } = useEventLog();

  const [route, setRoute] = useState<RouteKey>("zigzag");
  const [strokeColor, setStrokeColor] = useState("#FBBC04");
  const [strokeWeight, setStrokeWeight] = useState(4);
  const [strokeOpacity, setStrokeOpacity] = useState(0.9);
  const [strokeStyle, setStrokeStyle] = useState<"solid" | "shortdash" | "longdash" | "dot">("solid");
  const [visible, setVisible] = useState(true);
  const [clickable, setClickable] = useState(true);

  return (
    <>
      <h1 className="demo-title">Polyline</h1>
      <p className="demo-description">
        경로 라인의 스타일, 선 패턴, 이벤트를 제어합니다.
      </p>

      <div className="map-container">
        <NaverMap defaultCenter={{ lat: 37.567, lng: 126.980 }} defaultZoom={15} style={{ width: "100%", height: 500 }}>
          <Polyline
            path={ROUTES[route].path}
            strokeColor={strokeColor}
            strokeWeight={strokeWeight}
            strokeOpacity={strokeOpacity}
            strokeStyle={strokeStyle}
            visible={visible}
            clickable={clickable}
            onClick={() => log("polyline click")}
            onMouseOver={() => log("polyline mouseover")}
            onMouseOut={() => log("polyline mouseout")}
          />
        </NaverMap>
      </div>

      <div className="controls-panel">
        <div className="controls-title">Controls</div>
        <div className="controls-grid">
          <div className="control-item">
            <label>Route</label>
            <select value={route} onChange={(e) => setRoute(e.target.value as RouteKey)}>
              {Object.entries(ROUTES).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>
          <div className="control-item">
            <label>Color</label>
            <input type="color" value={strokeColor} onChange={(e) => setStrokeColor(e.target.value)} />
          </div>
          <div className="control-item">
            <label>Weight ({strokeWeight})</label>
            <input type="range" min={1} max={15} value={strokeWeight} onChange={(e) => setStrokeWeight(Number(e.target.value))} />
          </div>
          <div className="control-item">
            <label>Opacity ({strokeOpacity})</label>
            <input type="range" min={0} max={1} step={0.05} value={strokeOpacity} onChange={(e) => setStrokeOpacity(Number(e.target.value))} />
          </div>
          <div className="control-item">
            <label>Style</label>
            <select value={strokeStyle} onChange={(e) => setStrokeStyle(e.target.value as typeof strokeStyle)}>
              <option value="solid">Solid</option>
              <option value="shortdash">Short Dash</option>
              <option value="longdash">Long Dash</option>
              <option value="dot">Dot</option>
            </select>
          </div>
          <div className="control-item">
            <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} />
            <label>Visible</label>
          </div>
          <div className="control-item">
            <input type="checkbox" checked={clickable} onChange={(e) => setClickable(e.target.checked)} />
            <label>Clickable</label>
          </div>
        </div>
      </div>

      <EventLog entries={entries} onClear={clear} />
    </>
  );
}
