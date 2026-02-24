import { useState, useCallback } from "react";
import { NaverMap } from "react-naver-maps-kit";
import { AreaPolygon } from "./components/AreaPolygon";
import { InfoPanel } from "./components/InfoPanel";
import { Legend } from "./components/Legend";
import { ControlPanel } from "./components/ControlPanel";
import { commercialAreas, getMetricRange } from "./data/mockData";
import type { CommercialArea, ColorMetric } from "./types";

export default function CommercialAreaAnalysis() {
  const [selectedArea, setSelectedArea] = useState<CommercialArea | null>(null);
  const [hoveredAreaId, setHoveredAreaId] = useState<string | null>(null);
  const [colorMetric, setColorMetric] = useState<ColorMetric>("sales");

  const metricRange = getMetricRange(commercialAreas, colorMetric);

  const handleAreaClick = useCallback((area: CommercialArea) => {
    setSelectedArea((prev) => (prev?.id === area.id ? null : area));
  }, []);

  const handleAreaHover = useCallback((areaId: string | null) => {
    setHoveredAreaId(areaId);
  }, []);

  const handleMetricChange = useCallback((metric: ColorMetric) => {
    setColorMetric(metric);
  }, []);

  const handleClosePanel = useCallback(() => {
    setSelectedArea(null);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📊 상권 분석 지도</h1>
        <span style={styles.subtitle}>강남구 상권 분포</span>
      </div>

      <div style={styles.mapContainer}>
        <NaverMap
          center={{ lat: 37.508, lng: 127.04 }}
          zoom={13}
          style={{ width: "100%", height: "100%" }}
        >
          {commercialAreas.map((area) => (
            <AreaPolygon
              key={area.id}
              area={area}
              colorMetric={colorMetric}
              metricRange={metricRange}
              isSelected={selectedArea?.id === area.id}
              isHovered={hoveredAreaId === area.id}
              hasSelection={selectedArea !== null}
              onClick={handleAreaClick}
              onHover={handleAreaHover}
            />
          ))}
        </NaverMap>

        <ControlPanel colorMetric={colorMetric} onMetricChange={handleMetricChange} />
        <Legend metric={colorMetric} />
        <InfoPanel area={selectedArea} onClose={handleClosePanel} />
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    background: "#F3F4F6"
  },
  header: {
    padding: "12px 20px",
    background: "#1F2937",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    margin: 0,
    color: "#fff"
  },
  subtitle: {
    fontSize: 14,
    color: "#9CA3AF"
  },
  mapContainer: {
    flex: 1,
    position: "relative"
  }
};
