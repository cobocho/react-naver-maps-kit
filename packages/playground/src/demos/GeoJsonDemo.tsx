import { withDemoNaverMapProvider } from "./withDemoNaverMapProvider.tsx";
import { useState, useRef, useMemo, useEffect } from "react";
import { NaverMap, GeoJson } from "react-naver-maps-kit";
import type { GeoJsonRef, GeoJsonProps } from "react-naver-maps-kit";

import { useEventLog } from "../useEventLog.ts";
import { EventLog } from "../EventLog.tsx";

function GeoJsonDemoBase() {
  const { entries, log, clear } = useEventLog();
  const geoJsonRef = useRef<GeoJsonRef>(null);

  const [geoJsonData, setGeoJsonData] = useState<GeoJsonProps["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [strokeColor, setStrokeColor] = useState("#4285F4");
  const [fillColor, setFillColor] = useState("#4285F4");
  const [fillOpacity, setFillOpacity] = useState(0.3);
  const [strokeWeight, setStrokeWeight] = useState(2);

  useEffect(() => {
    fetch("/seoul.geojson")
      .then((res) => res.json())
      .then((data) => {
        setGeoJsonData(data);
        setLoading(false);
        log("seoul.geojson loaded");
      })
      .catch((err) => {
        log(`fetch error: ${err.message}`);
        setLoading(false);
      });
  }, []);

  const style = useMemo(
    () => ({
      strokeColor,
      fillColor,
      fillOpacity,
      strokeWeight,
      strokeOpacity: 0.8
    }),
    [strokeColor, fillColor, fillOpacity, strokeWeight]
  );

  const handleExportGeoJson = () => {
    const exported = geoJsonRef.current?.toGeoJson();
    if (exported) {
      log(`toGeoJson: ${JSON.stringify(exported).slice(0, 200)}...`);
    }
  };

  return (
    <>
      <h1 className="demo-title">GeoJson</h1>
      <p className="demo-description">
        <code>public/seoul.geojson</code> 파일을 로드하여 서울시 행정구역을 지도에 렌더링합니다.
      </p>

      <div className="map-container">
        <NaverMap
          defaultCenter={{ lat: 37.566, lng: 126.978 }}
          defaultZoom={11}
          style={{ width: "100%", height: 500 }}
        >
          {geoJsonData && (
            <GeoJson
              ref={geoJsonRef}
              data={geoJsonData}
              style={style}
              onDataReady={() => log("data ready")}
              onFeaturesAdded={(features) => log(`features added: ${features.length}`)}
              onClick={() => log("click")}
              onMouseOver={() => log("mouseover")}
              onMouseOut={() => log("mouseout")}
            />
          )}
        </NaverMap>
      </div>

      {loading && <p>Loading seoul.geojson...</p>}

      <div className="controls-panel">
        <div className="controls-title">Controls</div>
        <div className="controls-grid">
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
            <button className="btn btn-primary" onClick={handleExportGeoJson}>
              Export GeoJSON
            </button>
          </div>
        </div>
      </div>

      <EventLog entries={entries} onClear={clear} />
    </>
  );
}

export const GeoJsonDemo = withDemoNaverMapProvider(GeoJsonDemoBase);
