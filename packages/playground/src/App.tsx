import { useState } from "react";
import { Routes, Route, Navigate, useNavigate, useParams } from "react-router-dom";
import { NaverMapProvider } from "react-naver-maps-kit";

import { NaverMapDemo } from "./demos/NaverMapDemo.tsx";
import { MarkerDemo } from "./demos/MarkerDemo.tsx";
import { InfoWindowDemo } from "./demos/InfoWindowDemo.tsx";
import { CircleDemo } from "./demos/CircleDemo.tsx";
import { PolygonDemo } from "./demos/PolygonDemo.tsx";
import { PolylineDemo } from "./demos/PolylineDemo.tsx";
import { RectangleDemo } from "./demos/RectangleDemo.tsx";
import { EllipseDemo } from "./demos/EllipseDemo.tsx";
import { GroundOverlayDemo } from "./demos/GroundOverlayDemo.tsx";
import { MarkerClustererDemo } from "./demos/MarkerClustererDemo.tsx";
import { GeoJsonDemo } from "./demos/GeoJsonDemo.tsx";
import { GpxDemo } from "./demos/GpxDemo.tsx";
import { KmzDemo } from "./demos/KmzDemo.tsx";

type DemoEntry = { id: string; label: string; component: () => JSX.Element };
type SectionEntry = { section: string };
type SidebarItem = DemoEntry | SectionEntry;

const DEMOS: SidebarItem[] = [
  { section: "Core" },
  { id: "navermap", label: "NaverMap", component: NaverMapDemo },
  { section: "Overlays" },
  { id: "marker", label: "Marker", component: MarkerDemo },
  { id: "infowindow", label: "InfoWindow", component: InfoWindowDemo },
  { id: "circle", label: "Circle", component: CircleDemo },
  { id: "ellipse", label: "Ellipse", component: EllipseDemo },
  { id: "polygon", label: "Polygon", component: PolygonDemo },
  { id: "polyline", label: "Polyline", component: PolylineDemo },
  { id: "rectangle", label: "Rectangle", component: RectangleDemo },
  { id: "groundoverlay", label: "GroundOverlay", component: GroundOverlayDemo },
  { section: "Data" },
  { id: "geojson", label: "GeoJson", component: GeoJsonDemo },
  { id: "gpx", label: "Gpx", component: GpxDemo },
  { id: "kmz", label: "Kmz", component: KmzDemo },
  { section: "Clustering" },
  { id: "clusterer", label: "MarkerClusterer", component: MarkerClustererDemo }
];

function isDemoEntry(item: SidebarItem): item is DemoEntry {
  return "id" in item;
}

function getDemoComponent(id: string) {
  const entry = DEMOS.find((d): d is DemoEntry => isDemoEntry(d) && d.id === id);
  return entry?.component ?? NaverMapDemo;
}

function SetupScreen({ onSetup }: { onSetup: (key: string) => void }) {
  const [inputKey, setInputKey] = useState("");

  return (
    <div className="setup-screen">
      <div className="setup-card">
        <h2>Playground Setup</h2>
        <p>
          NCP Client ID를 입력하세요.
          <br />
          또는 <code>.env</code> 파일에 <code>VITE_NCP_CLIENT_ID</code>를 설정하세요.
        </p>
        <input
          type="text"
          placeholder="NCP Client ID"
          value={inputKey}
          onChange={(e) => setInputKey(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && inputKey.trim()) onSetup(inputKey.trim());
          }}
        />
        <button
          className="btn btn-primary"
          onClick={() => {
            if (inputKey.trim()) onSetup(inputKey.trim());
          }}
        >
          Start
        </button>
      </div>
    </div>
  );
}

function Sidebar() {
  const navigate = useNavigate();
  const { demoId } = useParams<{ demoId: string }>();

  return (
    <nav className="sidebar">
      <div className="sidebar-title">Playground</div>
      {DEMOS.map((item, i) => {
        if (isDemoEntry(item)) {
          return (
            <button
              key={item.id}
              className={`sidebar-btn ${demoId === item.id ? "active" : ""}`}
              onClick={() => navigate(`/demo/${item.id}`)}
            >
              {item.label}
            </button>
          );
        }
        return (
          <div key={i} className="sidebar-section">
            {(item as SectionEntry).section}
          </div>
        );
      })}
    </nav>
  );
}

function DemoLayout() {
  const { demoId } = useParams<{ demoId: string }>();
  const DemoComponent = getDemoComponent(demoId ?? "navermap");

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <DemoComponent />
      </main>
    </div>
  );
}

function App() {
  const [ncpKeyId, setNcpKeyId] = useState(() =>
    String(import.meta.env.VITE_NCP_KEY_ID ?? import.meta.env.VITE_NCP_CLIENT_ID ?? "").trim()
  );

  if (!ncpKeyId) {
    return <SetupScreen onSetup={setNcpKeyId} />;
  }

  return (
    <NaverMapProvider ncpKeyId={ncpKeyId}>
      <Routes>
        <Route path="/" element={<Navigate to="/demo/navermap" replace />} />
        <Route path="/demo/:demoId" element={<DemoLayout />} />
        <Route path="*" element={<Navigate to="/demo/navermap" replace />} />
      </Routes>
    </NaverMapProvider>
  );
}

export default App;
