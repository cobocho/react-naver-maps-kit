import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

import { mapRoutes } from "./pages/MapTestApp";
import { markerRoutes } from "./pages/MarkerTestApp";
import { infoWindowRoutes } from "./pages/InfoWindowTestApp";
import "./styles.css";

const routes: Record<string, React.FC> = {
  ...mapRoutes,
  ...markerRoutes,
  ...infoWindowRoutes,
};

function App() {
  const [path, setPath] = useState(() => window.location.hash.slice(1) || "/");

  useEffect(() => {
    const onHashChange = () => setPath(window.location.hash.slice(1) || "/");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const Page = routes[path];
  const routeList = Object.keys(routes).sort();

  if (!Page) {
    return <div data-testid="not-found">Page not found: {path}</div>;
  }

  return (
    <div className="e2e-shell">
      <header className="e2e-header">
        <p className="e2e-eyebrow">React Naver Maps Kit</p>
        <h1>E2E Visual Lab</h1>
        <p className="e2e-path">{path}</p>
      </header>

      <nav className="e2e-nav" aria-label="E2E routes">
        {routeList.map((route) => (
          <a
            key={route}
            href={`#${route}`}
            className={route === path ? "e2e-nav-item is-active" : "e2e-nav-item"}
          >
            {route}
          </a>
        ))}
      </nav>

      <main className="e2e-stage">
        <section className="e2e-scene">
          <div className="e2e-scene-layout">
            <Page />
          </div>
        </section>
      </main>
    </div>
  );
}

const root = document.getElementById("root");

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
