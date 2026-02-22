import { useRef, useState, useMemo } from "react";
import { NaverMap, Gpx } from "react-naver-maps-kit";
import type { GpxRef } from "react-naver-maps-kit";

import { useEventLog } from "../useEventLog.ts";
import { EventLog } from "../EventLog.tsx";

export function GpxDemo() {
  const { entries, log, clear } = useEventLog();
  const gpxRef = useRef<GpxRef>(null);

  const [strokeColor, setStrokeColor] = useState("#FF5722");
  const [fillColor, setFillColor] = useState("#FF5722");
  const [fillOpacity, setFillOpacity] = useState(0.3);
  const [strokeWeight, setStrokeWeight] = useState(3);

  const style = useMemo(
    () => ({
      strokeColor,
      fillColor,
      fillOpacity,
      strokeWeight,
      strokeOpacity: 0.9
    }),
    [strokeColor, fillColor, fillOpacity, strokeWeight]
  );

  const handleExport = () => {
    const exported = gpxRef.current?.toGeoJson();
    if (exported) {
      log(`toGeoJson: ${JSON.stringify(exported).slice(0, 200)}...`);
    }
  };

  const handleCountFeatures = () => {
    const features = gpxRef.current?.getAllFeature();
    if (features) {
      log(`Total features: ${features.length}`);
    }
  };

  return (
    <>
      <h1 className="demo-title">Gpx</h1>
      <p className="demo-description">
        <code>public/seoul.gpx</code> 파일을 로드하여 자전거 경로를 지도에 렌더링합니다.
      </p>

      <div className="map-container">
        <NaverMap
          defaultCenter={{ lat: 37.55, lng: 127.0 }}
          defaultZoom={11}
          style={{ width: "100%", height: 500 }}
        >
          <Gpx
            ref={gpxRef}
            url="/seoul.gpx"
            style={style}
            onDataReady={() => log("data ready")}
            onFeaturesAdded={(features) => log(`features added: ${features.length}`)}
            onClick={() => log("click")}
            onMouseOver={() => log("mouseover")}
            onMouseOut={() => log("mouseout")}
            onDataError={(err) => log(`error: ${err.message}`)}
          />
        </NaverMap>
      </div>

      <div className="controls-panel">
        <div className="controls-title">Controls</div>
        <div className="controls-grid">
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
              min={1}
              max={10}
              value={strokeWeight}
              onChange={(e) => setStrokeWeight(Number(e.target.value))}
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
            <button className="btn btn-primary" onClick={handleCountFeatures}>
              Count Features
            </button>
          </div>
          <div className="control-item">
            <button className="btn btn-primary" onClick={handleExport}>
              Export GeoJSON
            </button>
          </div>
        </div>
      </div>

      <EventLog entries={entries} onClear={clear} />
    </>
  );
}
