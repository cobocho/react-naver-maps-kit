import { useState } from "react";
import { InfoWindow, Marker, NaverMap, NaverMapProvider, useNaverMap } from "react-naver-maps-kit";

import "./App.css";

function MapStatusPanel({ ncpKeyId }: { ncpKeyId: string }) {
  const { sdkError } = useNaverMap();
  const [zoom, setZoom] = useState(10);
  const [draggable, setDraggable] = useState(true);
  const [scrollWheel, setScrollWheel] = useState(true);
  const [zoomControl, setZoomControl] = useState(true);
  const [mapTypeControl, setMapTypeControl] = useState(true);
  const [showInfoWindow, setShowInfoWindow] = useState(true);
  const [markerEventText, setMarkerEventText] = useState("-");
  const [mapTypeId, setMapTypeId] = useState<naver.maps.MapTypeIdLiteral>("normal");
  const [centerKey, setCenterKey] = useState<"greenFactory" | "cityHall" | "busanStation">(
    "greenFactory"
  );

  const centerByKey: Record<typeof centerKey, { lat: number; lng: number }> = {
    greenFactory: { lat: 37.3595704, lng: 127.105399 },
    cityHall: { lat: 37.5666102, lng: 126.9783881 },
    busanStation: { lat: 35.115225, lng: 129.041704 }
  };

  const center = centerByKey[centerKey];

  return (
    <section className="demo-card">
      <header className="demo-header">
        <h1>react-naver-maps-kit</h1>
        <p>실시간 상태 확인 + 옵션 제어 예제</p>
      </header>

      <div className="status-grid">
        <p>
          ncpKeyId: <code>{ncpKeyId || "(empty)"}</code>
        </p>
        <p>
          selected mapTypeId: <strong>{mapTypeId}</strong>
        </p>
        <p>
          marker event: <strong>{markerEventText}</strong>
        </p>
      </div>

      {sdkError ? <p className="error-text">error: {sdkError.message}</p> : null}

      <div className="control-grid">
        <label className="control-item">
          zoom: <strong>{zoom}</strong>
          <input
            max={21}
            min={1}
            onChange={(event) => setZoom(Number(event.target.value))}
            style={{ width: "100%" }}
            type="range"
            value={zoom}
          />
        </label>

        <label className="control-item">
          center
          <select
            onChange={(event) => setCenterKey(event.target.value as typeof centerKey)}
            style={{ marginLeft: 8 }}
            value={centerKey}
          >
            <option value="greenFactory">Green Factory</option>
            <option value="cityHall">Seoul City Hall</option>
            <option value="busanStation">Busan Station</option>
          </select>
        </label>

        <label className="control-item">
          mapTypeId
          <select
            onChange={(event) => setMapTypeId(event.target.value as naver.maps.MapTypeIdLiteral)}
            style={{ marginLeft: 8 }}
            value={mapTypeId}
          >
            <option value="normal">NORMAL</option>
            <option value="terrain">TERRAIN</option>
            <option value="satellite">SATELLITE</option>
            <option value="hybrid">HYBRID</option>
          </select>
        </label>

        <label className="control-item checkbox-item">
          <input
            checked={draggable}
            onChange={(event) => setDraggable(event.target.checked)}
            type="checkbox"
          />{" "}
          draggable
        </label>

        <label className="control-item checkbox-item">
          <input
            checked={scrollWheel}
            onChange={(event) => setScrollWheel(event.target.checked)}
            type="checkbox"
          />{" "}
          scrollWheel
        </label>

        <label className="control-item checkbox-item">
          <input
            checked={zoomControl}
            onChange={(event) => setZoomControl(event.target.checked)}
            type="checkbox"
          />{" "}
          zoomControl
        </label>

        <label className="control-item checkbox-item">
          <input
            checked={mapTypeControl}
            onChange={(event) => setMapTypeControl(event.target.checked)}
            type="checkbox"
          />{" "}
          mapTypeControl
        </label>

        <label className="control-item checkbox-item">
          <input
            checked={showInfoWindow}
            onChange={(event) => setShowInfoWindow(event.target.checked)}
            type="checkbox"
          />{" "}
          infoWindow
        </label>
      </div>

      <div className="map-wrap">
        <NaverMap
          center={center}
          draggable={draggable}
          mapTypeId={mapTypeId}
          mapTypeControl={mapTypeControl}
          scrollWheel={scrollWheel}
          style={{ width: "100%", height: 420 }}
          zoom={zoom}
          zoomControl={zoomControl}
        />
        <Marker
          position={center}
          onClick={() => {
            alert("click");
          }}
          onDragEnd={() => {
            setMarkerEventText(`dragend @ ${new Date().toLocaleTimeString()}`);
          }}
        >
          <div className="marker-chip" style={{ color: "red", width: "40px", height: "40px" }}>
            KIT
          </div>
        </Marker>
        <InfoWindow
          position={{
            lat: center.lat + 0.15,
            lng: center.lng + 0.15
          }}
          visible={showInfoWindow}
        >
          <div className="info-window-box">
            <strong>react-naver-maps-kit</strong>
            <p>
              center: {center.lat.toFixed(4)}, {center.lng.toFixed(4)}
            </p>
          </div>
        </InfoWindow>
      </div>
    </section>
  );
}

function App() {
  const ncpKeyId = String(
    import.meta.env.VITE_NCP_KEY_ID ?? import.meta.env.VITE_NCP_CLIENT_ID ?? ""
  ).trim();

  return (
    <NaverMapProvider
      ncpKeyId={ncpKeyId}
      timeoutMs={2000}
      onReady={() => {
        console.info("[react-naver-maps-kit] SDK ready");
      }}
      onError={(error) => {
        console.error("[react-naver-maps-kit] SDK load error", error);
      }}
    >
      <MapStatusPanel ncpKeyId={ncpKeyId} />
    </NaverMapProvider>
  );
}

export default App;
