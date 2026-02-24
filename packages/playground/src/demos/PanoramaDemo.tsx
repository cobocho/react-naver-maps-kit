import { useRef, useState } from "react";
import { renderToString } from "react-dom/server";
import { Panorama, FlightSpot, NaverMap, Marker, type PanoramaRef } from "react-naver-maps-kit";

import { useEventLog } from "../useEventLog.ts";
import { EventLog } from "../EventLog.tsx";

const DEFAULT_POS = { lat: 37.3595704, lng: 127.105399 };

const CameraIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}
  >
    <circle cx="12" cy="12" r="11" fill="#03C75A" />
    <path
      d="M7 9.5C7 8.67 7.67 8 8.5 8H9.5L10.5 7H13.5L14.5 8H15.5C16.33 8 17 8.67 17 9.5V15C17 15.83 16.33 16.5 15.5 16.5H8.5C7.67 16.5 7 15.83 7 15V9.5Z"
      fill="white"
    />
    <circle cx="12" cy="12" r="2.5" fill="#03C75A" />
  </svg>
);

const SAMPLE_MARKERS = [
  { id: 1, position: { lat: 37.3595704, lng: 127.105399 }, title: "네이버 본사" },
  { id: 2, position: { lat: 37.36, lng: 127.1048 }, title: "정자역" },
  { id: 3, position: { lat: 37.359, lng: 127.106 }, title: "카페" }
];

export function PanoramaDemo() {
  const { entries, log, clear } = useEventLog();
  const panoramaRef = useRef<PanoramaRef>(null);

  const [position, setPosition] = useState(DEFAULT_POS);
  const [showFlightSpot, setShowFlightSpot] = useState(true);
  const [showMarkers, setShowMarkers] = useState(true);
  const [aroundControl, setAroundControl] = useState(true);
  const [pov, setPov] = useState({ pan: 0, tilt: 0, fov: 100 });

  const handleMarkerClick = (marker: (typeof SAMPLE_MARKERS)[number]) => {
    setPosition(marker.position);
    log(`마커 클릭: ${marker.title}`);
  };

  const handleCameraDragEnd = (e: { coord: naver.maps.Coord }) => {
    const newPos = { lat: e.coord.y, lng: e.coord.x };
    setPosition(newPos);
    log(`카메라 이동: ${newPos.lat.toFixed(5)}, ${newPos.lng.toFixed(5)}`);
  };

  return (
    <>
      <h1 className="demo-title">Panorama</h1>
      <p className="demo-description">
        파노라마(거리뷰/항공뷰) 컴포넌트와 지도 연동, FlightSpot, 마커 표시를 테스트합니다.
      </p>

      <div className="info-row">
        <span className="info-chip">
          Position: {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
        </span>
        <span className="info-chip">
          POV: pan={pov.pan}°, tilt={pov.tilt}°
        </span>
      </div>

      <div className="map-container" style={{ display: "flex", gap: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>
            지도 (카메라 마커를 드래그하여 파노라마 위치 변경)
          </div>
          <NaverMap
            defaultCenter={DEFAULT_POS}
            defaultZoom={15}
            style={{ width: "100%", height: 400 }}
          >
            <Marker
              position={position}
              draggable={true}
              icon={{
                content: `<div style="cursor: grab;">${renderToString(<CameraIcon />)}</div>`,
                anchor: { x: 20, y: 20 }
              }}
              onDragEnd={handleCameraDragEnd}
            />
            {showMarkers &&
              SAMPLE_MARKERS.map((marker) => (
                <Marker
                  key={marker.id}
                  position={marker.position}
                  onClick={() => handleMarkerClick(marker)}
                >
                  <div
                    style={{
                      background: "#03C75A",
                      color: "#fff",
                      padding: "4px 10px",
                      borderRadius: 16,
                      fontSize: 11,
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                      border: "2px solid #fff"
                    }}
                  >
                    {marker.title}
                  </div>
                </Marker>
              ))}
            {showFlightSpot && (
              <FlightSpot
                onPoiClicked={(panoId) => {
                  log(`FlightSpot 클릭: ${panoId}`);
                }}
              />
            )}
          </NaverMap>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>파노라마 뷰</div>
          <Panorama
            ref={panoramaRef}
            position={position}
            pov={pov}
            flightSpot={showFlightSpot}
            aroundControl={aroundControl}
            style={{ width: "100%", height: 400 }}
            onInit={() => log("panorama init")}
            onPanoChanged={() => log("panorama pano_changed")}
            onPovChanged={() => {
              const currentPov = panoramaRef.current?.getPov();
              if (currentPov) {
                setPov({
                  pan: Math.round(currentPov.pan ?? 0),
                  tilt: Math.round(currentPov.tilt ?? 0),
                  fov: Math.round(currentPov.fov ?? 100)
                });
              }
              log("panorama pov_changed");
            }}
          >
            {showMarkers &&
              SAMPLE_MARKERS.map((marker) => (
                <Marker key={marker.id} position={marker.position} title={marker.title}>
                  <div
                    style={{
                      background: "#FF5722",
                      color: "#fff",
                      padding: "4px 10px",
                      borderRadius: 16,
                      fontSize: 11,
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                      border: "2px solid #fff"
                    }}
                  >
                    {marker.title}
                  </div>
                </Marker>
              ))}
          </Panorama>
        </div>
      </div>

      <div className="controls-panel">
        <div className="controls-title">Controls</div>
        <div className="controls-grid">
          <div className="control-item">
            <input
              type="checkbox"
              checked={showFlightSpot}
              onChange={(e) => setShowFlightSpot(e.target.checked)}
            />
            <label>FlightSpot 표시</label>
          </div>
          <div className="control-item">
            <input
              type="checkbox"
              checked={showMarkers}
              onChange={(e) => setShowMarkers(e.target.checked)}
            />
            <label>마커 표시</label>
          </div>
          <div className="control-item">
            <input
              type="checkbox"
              checked={aroundControl}
              onChange={(e) => setAroundControl(e.target.checked)}
            />
            <label>AroundControl</label>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <div className="controls-title">Ref Methods</div>
          <div className="btn-group">
            <button
              className="btn"
              onClick={() => {
                const pos = panoramaRef.current?.getPosition();
                if (pos) log(`getPosition → ${pos.lat()?.toFixed(5)}, ${pos.lng()?.toFixed(5)}`);
              }}
            >
              getPosition
            </button>
            <button
              className="btn"
              onClick={() => {
                const currentPov = panoramaRef.current?.getPov();
                if (currentPov) {
                  log(
                    `getPov → pan: ${currentPov.pan?.toFixed(1)}, tilt: ${currentPov.tilt?.toFixed(1)}, fov: ${currentPov.fov?.toFixed(1)}`
                  );
                }
              }}
            >
              getPov
            </button>
            <button
              className="btn"
              onClick={() => {
                setPosition(DEFAULT_POS);
                log("setPosition → reset");
              }}
            >
              Reset Position
            </button>
            <button
              className="btn"
              onClick={() => {
                setPov({ pan: 0, tilt: 0, fov: 100 });
                log("setPov → reset");
              }}
            >
              Reset POV
            </button>
          </div>
        </div>
      </div>

      <EventLog entries={entries} onClear={clear} />
    </>
  );
}
