import { useRef, useState } from "react";
import { Marker, NaverMap } from "react-naver-maps-kit";
import type { MarkerRef } from "react-naver-maps-kit";

import { useEventLog } from "../useEventLog.ts";
import { EventLog } from "../EventLog.tsx";

const DEFAULT_POS = { lat: 37.5666102, lng: 126.9783881 };

export function MarkerDemo() {
  const { entries, log, clear } = useEventLog();
  const markerRef = useRef<MarkerRef>(null);

  const [clickable, setClickable] = useState(true);
  const [draggable, setDraggable] = useState(true);
  const [visible, setVisible] = useState(true);
  const [useCustomIcon, setUseCustomIcon] = useState(false);
  const [markerCount, setMarkerCount] = useState(1);
  const [position, setPosition] = useState(DEFAULT_POS);

  const extraMarkers = Array.from({ length: markerCount - 1 }, (_, i) => ({
    lat: DEFAULT_POS.lat + (i + 1) * 0.003,
    lng: DEFAULT_POS.lng + (i + 1) * 0.003,
  }));

  return (
    <>
      <h1 className="demo-title">Marker</h1>
      <p className="demo-description">
        마커 생성, 드래그, 이벤트 처리, 커스텀 아이콘(children), imperative ref 메서드를 테스트합니다.
      </p>

      <div className="info-row">
        <span className="info-chip">Markers: {markerCount}</span>
        <span className="info-chip">Position: {position.lat.toFixed(4)}, {position.lng.toFixed(4)}</span>
      </div>

      <div className="map-container">
        <NaverMap defaultCenter={DEFAULT_POS} defaultZoom={14} style={{ width: "100%", height: 500 }}>
          <Marker
            ref={markerRef}
            position={position}
            clickable={clickable}
            draggable={draggable}
            visible={visible}
            onClick={() => log("click")}
            onDblClick={() => log("dblclick")}
            onRightClick={() => log("rightclick")}
            onDragStart={() => log("dragstart")}
            onDrag={() => log("drag")}
            onDragEnd={(e) => {
              const coord = e.coord;
              setPosition({ lat: coord.y, lng: coord.x });
              log(`dragend → ${coord.y.toFixed(4)}, ${coord.x.toFixed(4)}`);
            }}
            onMarkerReady={() => log("marker ready")}
          >
            {useCustomIcon ? (
              <div style={{
                background: "#0071e3",
                color: "#fff",
                padding: "4px 10px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}>
                Custom Icon
              </div>
            ) : undefined}
          </Marker>

          {extraMarkers.map((pos, i) => (
            <Marker
              key={i}
              position={pos}
              onClick={() => log(`extra marker ${i + 2} clicked`)}
            />
          ))}
        </NaverMap>
      </div>

      <div className="controls-panel">
        <div className="controls-title">Controls</div>
        <div className="controls-grid">
          <div className="control-item">
            <input type="checkbox" checked={clickable} onChange={(e) => setClickable(e.target.checked)} />
            <label>Clickable</label>
          </div>
          <div className="control-item">
            <input type="checkbox" checked={draggable} onChange={(e) => setDraggable(e.target.checked)} />
            <label>Draggable</label>
          </div>
          <div className="control-item">
            <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} />
            <label>Visible</label>
          </div>
          <div className="control-item">
            <input type="checkbox" checked={useCustomIcon} onChange={(e) => setUseCustomIcon(e.target.checked)} />
            <label>Custom Icon (children)</label>
          </div>
          <div className="control-item">
            <label>Count</label>
            <input type="number" min={1} max={20} value={markerCount} onChange={(e) => setMarkerCount(Number(e.target.value))} />
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <div className="controls-title">Ref Methods</div>
          <div className="btn-group">
            <button className="btn" onClick={() => {
              const pos = markerRef.current?.getPosition();
              if (pos) log(`getPosition → ${pos.y.toFixed(4)}, ${pos.x.toFixed(4)}`);
            }}>getPosition</button>
            <button className="btn" onClick={() => {
              const v = markerRef.current?.getVisible();
              log(`getVisible → ${v}`);
            }}>getVisible</button>
            <button className="btn" onClick={() => {
              markerRef.current?.setPosition(new naver.maps.LatLng(DEFAULT_POS.lat, DEFAULT_POS.lng));
              setPosition(DEFAULT_POS);
              log("setPosition → reset");
            }}>Reset Position</button>
          </div>
        </div>
      </div>

      <EventLog entries={entries} onClear={clear} />
    </>
  );
}
