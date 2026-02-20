import { NaverMap, NaverMapProvider, useNaverMap } from "react-naver-maps-kit";

import "./App.css";

function MapStatusPanel({ ncpKeyId }: { ncpKeyId: string }) {
  const { sdkError, sdkStatus } = useNaverMap();

  return (
    <>
      <p>
        ncpKeyId: <code>{ncpKeyId || "(empty)"}</code>
      </p>
      <p>
        status: <strong>{sdkStatus}</strong>
      </p>
      {sdkError ? <p style={{ color: "crimson" }}>error: {sdkError.message}</p> : null}
      <NaverMap
        center={{ lat: 37.3595704, lng: 127.105399 }}
        zoom={10}
        draggable={true}
        scrollWheel={true}
        zoomControl={true}
        mapTypeControl={true}
        style={{ width: 360, height: 360 }}
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
