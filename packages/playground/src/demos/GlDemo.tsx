import { useState } from "react";
import { Marker, NaverMap, useNaverMap } from "react-naver-maps-kit";

import { EventLog } from "../EventLog.tsx";
import { useEventLog } from "../useEventLog.ts";
import { withDemoNaverMapProvider } from "./withDemoNaverMapProvider.tsx";

const DEFAULT_CENTER = { lat: 37.5666102, lng: 126.9783881 };
const GL_STYLE_ID = "94230366-adba-4e0e-ac5a-e82a0e137b5e";

function GlDemoBase() {
  const { sdkStatus, sdkError, reloadSdk } = useNaverMap();
  const { entries, log, clear } = useEventLog();

  const [markerVisible, setMarkerVisible] = useState(true);

  return (
    <>
      <h1 className="demo-title">GL</h1>
      <p className="demo-description">
        공식 GL 튜토리얼처럼 <code>submodules=["gl"]</code> + <code>gl=true</code> 조합으로 벡터
        지도를 렌더링합니다.
      </p>

      <div className="info-row">
        <span className="info-chip">SDK: {sdkStatus}</span>
        <span className="info-chip">Style: fixed</span>
        {sdkError && (
          <span className="info-chip" style={{ background: "#ffebee", color: "#d32f2f" }}>
            Error: {sdkError.message}
          </span>
        )}
      </div>

      <div className="map-container">
        <NaverMap
          defaultCenter={DEFAULT_CENTER}
          defaultZoom={14}
          gl={true}
          customStyleId={GL_STYLE_ID}
          style={{ width: "100%", height: 500 }}
          onMapReady={() => {
            log(`map ready (gl=on)`);
          }}
          onMapError={(error) => {
            log(`onMapError -> ${error.message}`);
          }}
          onClick={(event) => {
            const pointerEvent = event as naver.maps.PointerEvent;
            if (!pointerEvent.coord) return;
            log(`click -> ${pointerEvent.coord.y.toFixed(5)}, ${pointerEvent.coord.x.toFixed(5)}`);
          }}
        >
          {markerVisible && (
            <Marker draggable position={DEFAULT_CENTER} title="GL Marker">
              <div
                style={{
                  background: "white",
                  padding: 10,
                  borderRadius: 10,
                  width: 100,
                  height: 100,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                GL Marker
              </div>
            </Marker>
          )}
        </NaverMap>
      </div>

      <div className="controls-panel">
        <div className="controls-title">GL Controls</div>
        <div className="controls-grid">
          <div className="control-item">
            <button className="btn btn-primary" onClick={() => void reloadSdk()}>
              SDK 재시도
            </button>
          </div>

          <div className="control-item">
            <input
              type="checkbox"
              checked={markerVisible}
              onChange={(e) => setMarkerVisible(e.target.checked)}
            />
            <label>Marker</label>
          </div>
        </div>
      </div>

      <EventLog entries={entries} onClear={clear} />
    </>
  );
}

export const GlDemo = withDemoNaverMapProvider(GlDemoBase, { submodules: ["gl"] });
