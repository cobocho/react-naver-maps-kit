import { memo } from "react";
import type { CommercialArea } from "../types";
import { formatCurrency, formatNumber } from "../types";

interface InfoPanelProps {
  area: CommercialArea | null;
  onClose: () => void;
}

function InfoPanelBase({ area, onClose }: InfoPanelProps) {
  if (!area) return null;

  const categoryLabels: Record<string, string> = {
    shopping: "쇼핑",
    dining: "요식업",
    entertainment: "유흥",
    mixed: "복합"
  };

  return (
    <div style={styles.panel}>
      <div style={styles.header}>
        <h3 style={styles.title}>{area.name}</h3>
        <button style={styles.closeButton} onClick={onClose}>
          ×
        </button>
      </div>

      <div style={styles.category}>{categoryLabels[area.category]}</div>

      <div style={styles.stats}>
        <div style={styles.statRow}>
          <span style={styles.statLabel}>월 매출</span>
          <span style={{ ...styles.statValue, color: "#E53935" }}>
            {formatCurrency(area.stats.monthlySales)}원
          </span>
        </div>
        <div style={styles.statRow}>
          <span style={styles.statLabel}>일일 유동인구</span>
          <span style={styles.statValue}>{formatNumber(area.stats.dailyFootTraffic)}명</span>
        </div>
        <div style={styles.statRow}>
          <span style={styles.statLabel}>점포 수</span>
          <span style={styles.statValue}>{area.stats.storeCount}개</span>
        </div>
        <div style={styles.statRow}>
          <span style={styles.statLabel}>평균 임대료</span>
          <span style={styles.statValue}>{formatCurrency(area.stats.avgRent)}원/㎡</span>
        </div>
        <div style={styles.statRow}>
          <span style={styles.statLabel}>성장률</span>
          <span
            style={{
              ...styles.statValue,
              color: area.stats.growthRate >= 0 ? "#4CAF50" : "#F44336"
            }}
          >
            {area.stats.growthRate >= 0 ? "+" : ""}
            {area.stats.growthRate}%
          </span>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  panel: {
    position: "absolute",
    top: 80,
    right: 20,
    width: 280,
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
    overflow: "hidden",
    zIndex: 100
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    background: "#1F2937"
  },
  title: {
    margin: 0,
    fontSize: 18,
    fontWeight: 700,
    color: "#fff"
  },
  closeButton: {
    background: "transparent",
    border: "none",
    color: "#9CA3AF",
    fontSize: 24,
    cursor: "pointer",
    padding: 0,
    lineHeight: 1
  },
  category: {
    padding: "8px 20px",
    background: "#F3F4F6",
    fontSize: 13,
    color: "#6B7280",
    fontWeight: 500
  },
  stats: {
    padding: "16px 20px"
  },
  statRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px solid #F3F4F6"
  },
  statLabel: {
    fontSize: 14,
    color: "#6B7280"
  },
  statValue: {
    fontSize: 14,
    fontWeight: 600,
    color: "#1F2937"
  }
};

export const InfoPanel = memo(InfoPanelBase);
