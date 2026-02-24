import { memo } from "react";
import type { ColorMetric } from "../types";

interface ControlPanelProps {
  colorMetric: ColorMetric;
  onMetricChange: (metric: ColorMetric) => void;
}

function ControlPanelBase({ colorMetric, onMetricChange }: ControlPanelProps) {
  const metrics: { value: ColorMetric; label: string }[] = [
    { value: "sales", label: "매출" },
    { value: "footTraffic", label: "유동인구" },
    { value: "growth", label: "성장률" }
  ];

  return (
    <div style={styles.panel}>
      <h4 style={styles.title}>색상 기준</h4>
      <div style={styles.buttons}>
        {metrics.map((metric) => (
          <button
            key={metric.value}
            style={{
              ...styles.button,
              background: colorMetric === metric.value ? "#1F2937" : "#F3F4F6",
              color: colorMetric === metric.value ? "#fff" : "#374151"
            }}
            onClick={() => onMetricChange(metric.value)}
          >
            {metric.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  panel: {
    position: "absolute",
    top: 80,
    left: 20,
    background: "#fff",
    borderRadius: 8,
    padding: "12px 16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    zIndex: 100
  },
  title: {
    margin: 0,
    marginBottom: 8,
    fontSize: 12,
    fontWeight: 600,
    color: "#374151"
  },
  buttons: {
    display: "flex",
    gap: 4
  },
  button: {
    padding: "6px 12px",
    border: "none",
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s"
  }
};

export const ControlPanel = memo(ControlPanelBase);
