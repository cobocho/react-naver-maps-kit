import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

import { mapRoutes } from "./pages/MapTestApp";
import { markerRoutes } from "./pages/MarkerTestApp";

const routes: Record<string, React.FC> = {
  ...mapRoutes,
  ...markerRoutes,
};

function App() {
  const [path, setPath] = useState(() => window.location.hash.slice(1) || "/");

  useEffect(() => {
    const onHashChange = () => setPath(window.location.hash.slice(1) || "/");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const Page = routes[path];

  if (!Page) {
    return <div data-testid="not-found">Page not found: {path}</div>;
  }

  return <Page />;
}

const root = document.getElementById("root");

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
