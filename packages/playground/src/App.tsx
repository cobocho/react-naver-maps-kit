import { type JSX, type ReactNode, useState, lazy, Suspense } from "react";
import { Routes, Route, Navigate, useNavigate, useParams, useLocation } from "react-router-dom";

import { NaverMapDemo } from "./demos/NaverMapDemo.tsx";
import { SuspenseDemo } from "./demos/SuspenseDemo.tsx";
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
import { PanoramaDemo } from "./demos/PanoramaDemo.tsx";
import { VisualizationDemo } from "./demos/VisualizationDemo.tsx";
import { DrawingDemo } from "./demos/DrawingDemo.tsx";
import { GlDemo } from "./demos/GlDemo.tsx";

const ActivityTracker = lazy(() => import("./projects/activity-tracker/App.tsx"));
const TaxiTracker = lazy(() => import("./projects/taxi-tracker/App.tsx"));
const RealEstateExplorer = lazy(() => import("./projects/real-estate-explorer/App.tsx"));
const CommercialAreaAnalysis = lazy(() => import("./projects/commercial-area-analysis/App.tsx"));

type DemoComponentProps = { ncpKeyId: string };
type ProjectComponentProps = { ncpKeyId: string };
type DemoEntry = {
  id: string;
  label: string;
  component: (props: DemoComponentProps) => JSX.Element;
};
type ProjectEntry = {
  id: string;
  label: string;
  component: (props: ProjectComponentProps) => ReactNode;
};
type SectionEntry = { section: string };
type SidebarItem = DemoEntry | SectionEntry;

const DEMOS: SidebarItem[] = [
  { section: "Core" },
  { id: "navermap", label: "NaverMap", component: NaverMapDemo },
  { id: "core-suspense", label: "Suspense", component: SuspenseDemo },
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
  { id: "clusterer", label: "MarkerClusterer", component: MarkerClustererDemo },
  { section: "Submodules" },
  { id: "panorama", label: "Panorama", component: PanoramaDemo },
  { id: "visualization", label: "Visualization", component: VisualizationDemo },
  { id: "drawing", label: "Drawing", component: DrawingDemo },
  { id: "gl", label: "GL", component: GlDemo }
];

const PROJECTS: ProjectEntry[] = [
  { id: "activity-tracker", label: "운동 기록 트래커", component: ActivityTracker },
  { id: "taxi-tracker", label: "실시간 택시 추적", component: TaxiTracker },
  { id: "real-estate-explorer", label: "부동산 매물 탐색", component: RealEstateExplorer },
  { id: "commercial-area-analysis", label: "상권 분석 지도", component: CommercialAreaAnalysis }
];

function isDemoEntry(item: SidebarItem): item is DemoEntry {
  return "id" in item;
}

function getDemoComponent(id: string) {
  const entry = DEMOS.find((d): d is DemoEntry => isDemoEntry(d) && d.id === id);
  return entry?.component ?? NaverMapDemo;
}

function getProjectComponent(id: string) {
  const entry = PROJECTS.find((p) => p.id === id);
  return entry?.component ?? ActivityTracker;
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
  const location = useLocation();
  const { demoId } = useParams<{ demoId: string }>();
  const { projectId } = useParams<{ projectId: string }>();

  const isProjectsSection = location.pathname.startsWith("/projects");

  return (
    <nav className="sidebar">
      <div className="sidebar-title">Playground</div>

      {DEMOS.map((item, i) => {
        if (isDemoEntry(item)) {
          return (
            <button
              key={item.id}
              className={`sidebar-btn ${!isProjectsSection && demoId === item.id ? "active" : ""}`}
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

      <div className="sidebar-section">Projects</div>
      {PROJECTS.map((project) => (
        <button
          key={project.id}
          className={`sidebar-btn ${isProjectsSection && projectId === project.id ? "active" : ""}`}
          onClick={() => navigate(`/projects/${project.id}`)}
        >
          {project.label}
        </button>
      ))}
    </nav>
  );
}

function DemoLayout({ ncpKeyId }: DemoComponentProps) {
  const { demoId } = useParams<{ demoId: string }>();
  const DemoComponent = getDemoComponent(demoId ?? "navermap");

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <DemoComponent ncpKeyId={ncpKeyId} />
      </main>
    </div>
  );
}

function ProjectLayout({ ncpKeyId }: ProjectComponentProps) {
  const { projectId } = useParams<{ projectId: string }>();
  const ProjectComponent = getProjectComponent(projectId ?? "activity-tracker");

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content project-content">
        <Suspense fallback={<div className="loading">로딩 중...</div>}>
          <ProjectComponent ncpKeyId={ncpKeyId} />
        </Suspense>
      </main>
    </div>
  );
}

function EmbedLayout({ ncpKeyId }: DemoComponentProps) {
  const { demoId } = useParams<{ demoId: string }>();
  const DemoComponent = getDemoComponent(demoId ?? "navermap");

  return (
    <div className="embed-layout">
      <DemoComponent ncpKeyId={ncpKeyId} />
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
    <Routes>
      <Route path="/" element={<Navigate to="/demo/navermap" replace />} />
      <Route path="/demo/:demoId" element={<DemoLayout ncpKeyId={ncpKeyId} />} />
      <Route path="/projects/:projectId" element={<ProjectLayout ncpKeyId={ncpKeyId} />} />
      <Route path="/embed/:demoId" element={<EmbedLayout ncpKeyId={ncpKeyId} />} />
      <Route path="*" element={<Navigate to="/demo/navermap" replace />} />
    </Routes>
  );
}

export default App;
