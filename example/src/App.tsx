import { useEffect, useState } from "react";
import { NaverMap, NaverMapProvider, useNaverMap } from "react-naver-maps-kit";

import "./App.css";

function MapStatusPanel({ ncpKeyId }: { ncpKeyId: string }) {
  const { map, sdkError, sdkStatus } = useNaverMap();
  const [zoom, setZoom] = useState(10);
  const [draggable, setDraggable] = useState(true);
  const [scrollWheel, setScrollWheel] = useState(true);
  const [zoomControl, setZoomControl] = useState(true);
  const [mapTypeControl, setMapTypeControl] = useState(true);
  const [mapTypeId, setMapTypeId] = useState<naver.maps.MapTypeIdLiteral>("normal");
  const [appliedMapTypeId, setAppliedMapTypeId] = useState<string>("-");
  const [centerKey, setCenterKey] = useState<"greenFactory" | "cityHall" | "busanStation">(
    "greenFactory"
  );

  const centerByKey: Record<typeof centerKey, { lat: number; lng: number }> = {
    greenFactory: { lat: 37.3595704, lng: 127.105399 },
    cityHall: { lat: 37.5666102, lng: 126.9783881 },
    busanStation: { lat: 35.115225, lng: 129.041704 }
  };

  const center = centerByKey[centerKey];

  useEffect(() => {
    if (!map || sdkStatus !== "ready") {
      return;
    }

    map.setMapTypeId(mapTypeId);
    map.refresh();
    setAppliedMapTypeId(map.getMapTypeId());
  }, [map, mapTypeId, sdkStatus]);

  return (
    <>
      <p>
        ncpKeyId: <code>{ncpKeyId || "(empty)"}</code>
      </p>
      <p>
        status: <strong>{sdkStatus}</strong>
      </p>
      <p>
        applied mapTypeId: <strong>{appliedMapTypeId}</strong>
      </p>
      <p>
        selected mapTypeId: <strong>{mapTypeId}</strong>
      </p>
      {sdkError ? <p style={{ color: "crimson" }}>error: {sdkError.message}</p> : null}
      <div
        style={{
          display: "grid",
          gap: 8,
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          marginBottom: 12,
          maxWidth: 520
        }}
      >
        <label>
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

        <label>
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

        <label>
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

        <label>
          <input
            checked={draggable}
            onChange={(event) => setDraggable(event.target.checked)}
            type="checkbox"
          />{" "}
          draggable
        </label>

        <label>
          <input
            checked={scrollWheel}
            onChange={(event) => setScrollWheel(event.target.checked)}
            type="checkbox"
          />{" "}
          scrollWheel
        </label>

        <label>
          <input
            checked={zoomControl}
            onChange={(event) => setZoomControl(event.target.checked)}
            type="checkbox"
          />{" "}
          zoomControl
        </label>

        <label>
          <input
            checked={mapTypeControl}
            onChange={(event) => setMapTypeControl(event.target.checked)}
            type="checkbox"
          />{" "}
          mapTypeControl
        </label>
      </div>

      <NaverMap
        center={center}
        draggable={draggable}
        mapTypeId={mapTypeId}
        mapTypeControl={mapTypeControl}
        scrollWheel={scrollWheel}
        style={{ width: 360, height: 360 }}
        zoom={zoom}
        zoomControl={zoomControl}
      />
    </>
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
