import { useState } from "react";
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
  { section: "Clustering" },
  { id: "clusterer", label: "MarkerClusterer", component: MarkerClustererDemo },
];

function isDemoEntry(item: SidebarItem): item is DemoEntry {
  return "id" in item;
}

function App() {
  const [ncpKeyId, setNcpKeyId] = useState(
    () =>
      String(import.meta.env.VITE_NCP_KEY_ID ?? import.meta.env.VITE_NCP_CLIENT_ID ?? "").trim()
  );
  const [inputKey, setInputKey] = useState(ncpKeyId);
  const [activeDemo, setActiveDemo] = useState("navermap");

  if (!ncpKeyId) {
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
              if (e.key === "Enter" && inputKey.trim()) setNcpKeyId(inputKey.trim());
            }}
          />
          <button
            className="btn btn-primary"
            onClick={() => {
              if (inputKey.trim()) setNcpKeyId(inputKey.trim());
            }}
          >
            Start
          </button>
        </div>
      </div>
    );
  }

  const activeEntry = DEMOS.find((d): d is DemoEntry => isDemoEntry(d) && d.id === activeDemo);
  const ActiveComponent = activeEntry?.component ?? NaverMapDemo;

  return (
    <NaverMapProvider ncpKeyId={ncpKeyId}>
      <div className="app-layout">
        <nav className="sidebar">
          <div className="sidebar-title">Playground</div>
          {DEMOS.map((item, i) => {
            if (isDemoEntry(item)) {
              return (
                <button
                  key={item.id}
                  className={`sidebar-btn ${activeDemo === item.id ? "active" : ""}`}
                  onClick={() => setActiveDemo(item.id)}
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

        <main className="main-content">
          <ActiveComponent />
        </main>
      </div>
    </NaverMapProvider>
  );
}

export default App;
