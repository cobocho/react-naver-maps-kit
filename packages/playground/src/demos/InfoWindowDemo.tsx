import { useState } from "react";
import { InfoWindow, Marker, NaverMap } from "react-naver-maps-kit";

import { useEventLog } from "../useEventLog.ts";
import { EventLog } from "../EventLog.tsx";

const DEFAULT_POS = { lat: 37.5666102, lng: 126.9783881 };

export function InfoWindowDemo() {
  const { entries, log, clear } = useEventLog();

  const [visible, setVisible] = useState(true);
  const [maxWidth, setMaxWidth] = useState(300);
  const [borderWidth, setBorderWidth] = useState(1);
  const [anchorSkew, setAnchorSkew] = useState(false);
  const [useRichContent, setUseRichContent] = useState(false);

  return (
    <>
      <h1 className="demo-title">InfoWindow</h1>
      <p className="demo-description">
        정보 창 표시/숨김, 크기 설정, children으로 React 컴포넌트를 렌더링합니다.
      </p>

      <div className="map-container">
        <NaverMap
          defaultCenter={DEFAULT_POS}
          defaultZoom={14}
          style={{ width: "100%", height: 500 }}
        >
          <Marker
            position={DEFAULT_POS}
            onClick={() => {
              setVisible((v) => !v);
              log("marker click → toggle InfoWindow");
            }}
          />

          <InfoWindow
            position={{
              lat: DEFAULT_POS.lat + 0.002,
              lng: DEFAULT_POS.lng
            }}
            visible={visible}
            maxWidth={maxWidth}
            borderWidth={borderWidth}
            anchorSkew={anchorSkew}
            onOpen={() => log("InfoWindow opened")}
            onClose={() => log("InfoWindow closed")}
          >
            {useRichContent ? (
              <div style={{ padding: 12 }}>
                <h3 style={{ margin: "0 0 8px", fontSize: 14 }}>Rich Content</h3>
                <p style={{ margin: 0, fontSize: 12, color: "#666" }}>
                  React 컴포넌트를 InfoWindow children으로 렌더링합니다.
                </p>
                <button
                  style={{
                    marginTop: 8,
                    padding: "4px 12px",
                    fontSize: 12,
                    borderRadius: 4,
                    border: "1px solid #ddd",
                    cursor: "pointer"
                  }}
                  onClick={() => log("InfoWindow button clicked")}
                >
                  Click me
                </button>
              </div>
            ) : (
              <div style={{ padding: 8, fontSize: 12 }}>
                <strong>Seoul City Hall</strong>
                <p style={{ margin: "4px 0 0" }}>37.5666, 126.9784</p>
              </div>
            )}
          </InfoWindow>
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
              checked={useRichContent}
              onChange={(e) => setUseRichContent(e.target.checked)}
            />
            <label>Rich Content</label>
          </div>
          <div className="control-item">
            <input
              type="checkbox"
              checked={anchorSkew}
              onChange={(e) => setAnchorSkew(e.target.checked)}
            />
            <label>Anchor Skew</label>
          </div>
          <div className="control-item">
            <label>MaxWidth</label>
            <input
              type="number"
              min={100}
              max={600}
              value={maxWidth}
              onChange={(e) => setMaxWidth(Number(e.target.value))}
            />
          </div>
          <div className="control-item">
            <label>BorderWidth</label>
            <input
              type="number"
              min={0}
              max={10}
              value={borderWidth}
              onChange={(e) => setBorderWidth(Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      <EventLog entries={entries} onClear={clear} />
    </>
  );
}
