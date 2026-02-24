import { memo } from "react";
import type { ColorMetric } from "../types";

interface LegendProps {
  metric: ColorMetric;
}

function LegendBase({ metric }: LegendProps) {
  const { title, labels, colors } = getLegendConfig(metric);

  return (
    <div style={styles.legend}>
      <h4 style={styles.title}>{title}</h4>
      <div style={styles.scale}>
        {colors.map((color, index) => (
          <div
            key={index}
            style={{
              ...styles.colorBox,
              background: color
            }}
          />
        ))}
      </div>
      <div style={styles.labels}>
        {labels.map((label, index) => (
          <span key={index} style={styles.label}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function getLegendConfig(metric: ColorMetric) {
  switch (metric) {
    case "sales":
      return {
        title: "월 매출",
        labels: ["낮음", "보통", "높음", "매우높음"],
        colors: ["#FFE5E5", "#FFB4B4", "#FF6B6B", "#E53935"]
      };
    case "footTraffic":
      return {
        title: "유동인구",
        labels: ["낮음", "보통", "높음", "매우높음"],
        colors: ["#FFE5E5", "#FFB4B4", "#FF6B6B", "#E53935"]
      };
    case "growth":
      return {
        title: "성장률",
        labels: ["저성장", "보통", "양호", "고성장"],
        colors: ["#E5F5E5", "#A8E6A3", "#4CAF50", "#2E7D32"]
      };
  }
}

const styles: Record<string, React.CSSProperties> = {
  legend: {
    position: "absolute",
    bottom: 20,
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
  scale: {
    display: "flex",
    gap: 2
  },
  colorBox: {
    width: 40,
    height: 16,
    borderRadius: 2
  },
  labels: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 4
  },
  label: {
    fontSize: 10,
    color: "#6B7280",
    width: 40,
    textAlign: "center"
  }
};

export const Legend = memo(LegendBase);
