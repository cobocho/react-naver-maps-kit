import { withDemoNaverMapProvider } from "./withDemoNaverMapProvider.tsx";
import { useState } from "react";
import { NaverMap, useNaverMap } from "react-naver-maps-kit";

import { useEventLog } from "../useEventLog.ts";
import { EventLog } from "../EventLog.tsx";

const CENTERS = {
  greenFactory: { lat: 37.3595704, lng: 127.105399, label: "Green Factory" },
  cityHall: { lat: 37.5666102, lng: 126.9783881, label: "Seoul City Hall" },
  busanStation: { lat: 35.115225, lng: 129.041704, label: "Busan Station" }
} as const;

type CenterKey = keyof typeof CENTERS;

function MapContent() {
  const { sdkStatus, sdkError } = useNaverMap();
  const { entries, log, clear } = useEventLog();

  const [zoom, setZoom] = useState(12);
  const [centerKey, setCenterKey] = useState<CenterKey>("greenFactory");
  const [draggable, setDraggable] = useState(true);
  const [scrollWheel, setScrollWheel] = useState(true);
  const [zoomControl, setZoomControl] = useState(true);
  const [mapTypeControl, setMapTypeControl] = useState(true);
  const [mapTypeId, setMapTypeId] = useState<naver.maps.MapTypeIdLiteral>("normal");
  const [minZoom, setMinZoom] = useState(1);
  const [maxZoom, setMaxZoom] = useState(21);

  const center = CENTERS[centerKey];

  return (
    <>
      <h1 className="demo-title">NaverMap</h1>
      <p className="demo-description">
        지도 렌더링 및 기본 옵션을 제어합니다. zoom, center, mapTypeId, 드래그/스크롤 등을 동적으로
        변경할 수 있습니다.
      </p>

      <div className="info-row">
        <span className="info-chip">SDK: {sdkStatus}</span>
        <span className="info-chip">Zoom: {zoom}</span>
        <span className="info-chip">Center: {center.label}</span>
        {sdkError && (
          <span className="info-chip" style={{ background: "#ffebee", color: "#d32f2f" }}>
            Error: {sdkError.message}
          </span>
        )}
      </div>

      <div className="map-container">
        <NaverMap
          center={center}
          zoom={zoom}
          draggable={draggable}
          scrollWheel={scrollWheel}
          zoomControl={zoomControl}
          mapTypeControl={mapTypeControl}
          mapTypeId={mapTypeId}
          minZoom={minZoom}
          maxZoom={maxZoom}
          style={{ width: "100%", height: 500 }}
          onZoomChanged={(z) => {
            setZoom(z);
            log(`zoom_changed → ${z}`);
          }}
          onCenterChanged={(coord) => {
            log(`center_changed → ${coord.y.toFixed(4)}, ${coord.x.toFixed(4)}`);
          }}
          onClick={(e) => {
            const pe = e as naver.maps.PointerEvent;
            if (pe.coord) log(`click → ${pe.coord.y.toFixed(4)}, ${pe.coord.x.toFixed(4)}`);
          }}
          onIdle={() => log("idle")}
          onDragStart={() => log("dragstart")}
          onDragEnd={() => log("dragend")}
          onMapTypeIdChanged={(id) => {
            setMapTypeId(id as naver.maps.MapTypeIdLiteral);
            log(`mapTypeId_changed → ${id}`);
          }}
        />
      </div>

      <div className="controls-panel">
        <div className="controls-title">Controls</div>
        <div className="controls-grid">
          <div className="control-item">
            <label>Zoom ({zoom})</label>
            <input
              type="range"
              min={1}
              max={21}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
            />
          </div>
          <div className="control-item">
            <label>Center</label>
            <select value={centerKey} onChange={(e) => setCenterKey(e.target.value as CenterKey)}>
              {Object.entries(CENTERS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>
          <div className="control-item">
            <label>MapType</label>
            <select
              value={mapTypeId}
              onChange={(e) => setMapTypeId(e.target.value as naver.maps.MapTypeIdLiteral)}
            >
              <option value="normal">NORMAL</option>
              <option value="terrain">TERRAIN</option>
              <option value="satellite">SATELLITE</option>
              <option value="hybrid">HYBRID</option>
            </select>
          </div>
          <div className="control-item">
            <label>MinZoom</label>
            <input
              type="number"
              min={1}
              max={21}
              value={minZoom}
              onChange={(e) => setMinZoom(Number(e.target.value))}
            />
          </div>
          <div className="control-item">
            <label>MaxZoom</label>
            <input
              type="number"
              min={1}
              max={21}
              value={maxZoom}
              onChange={(e) => setMaxZoom(Number(e.target.value))}
            />
          </div>
          <div className="control-item">
            <input
              type="checkbox"
              checked={draggable}
              onChange={(e) => setDraggable(e.target.checked)}
            />
            <label>Draggable</label>
          </div>
          <div className="control-item">
            <input
              type="checkbox"
              checked={scrollWheel}
              onChange={(e) => setScrollWheel(e.target.checked)}
            />
            <label>ScrollWheel</label>
          </div>
          <div className="control-item">
            <input
              type="checkbox"
              checked={zoomControl}
              onChange={(e) => setZoomControl(e.target.checked)}
            />
            <label>ZoomControl</label>
          </div>
          <div className="control-item">
            <input
              type="checkbox"
              checked={mapTypeControl}
              onChange={(e) => setMapTypeControl(e.target.checked)}
            />
            <label>MapTypeControl</label>
          </div>
        </div>
      </div>

      <EventLog entries={entries} onClear={clear} />
    </>
  );
}

function NaverMapDemoBase() {
  return <MapContent />;
}

export const NaverMapDemo = withDemoNaverMapProvider(NaverMapDemoBase);
