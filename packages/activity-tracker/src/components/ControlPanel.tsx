import type { ColorMode, ActivityType } from "../types";
import { getActivityTypeLabel } from "../utils/activity";

interface ControlPanelProps {
  activityType: ActivityType;
  onActivityTypeChange: (type: ActivityType) => void;
  colorMode: ColorMode;
  onColorModeChange: (mode: ColorMode) => void;
  onGenerateNew: () => void;
}

export function ControlPanel({
  activityType,
  onActivityTypeChange,
  colorMode,
  onColorModeChange,
  onGenerateNew
}: ControlPanelProps) {
  return (
    <div style={styles.panel}>
      <div style={styles.section}>
        <span style={styles.sectionLabel}>활동 유형</span>
        <div style={styles.buttonGroup}>
          <button
            onClick={() => onActivityTypeChange("running")}
            style={{
              ...styles.typeButton,
              background: activityType === "running" ? "#10B981" : "#E5E7EB",
              color: activityType === "running" ? "#fff" : "#374151"
            }}
          >
            🏃 {getActivityTypeLabel("running")}
          </button>
          <button
            onClick={() => onActivityTypeChange("cycling")}
            style={{
              ...styles.typeButton,
              background: activityType === "cycling" ? "#3B82F6" : "#E5E7EB",
              color: activityType === "cycling" ? "#fff" : "#374151"
            }}
          >
            🚴 {getActivityTypeLabel("cycling")}
          </button>
        </div>
      </div>

      <div style={styles.divider} />

      <div style={styles.section}>
        <span style={styles.sectionLabel}>색상 기준</span>
        <div style={styles.buttonGroup}>
          <button
            onClick={() => onColorModeChange("speed")}
            style={{
              ...styles.colorButton,
              background: colorMode === "speed" ? "#8B5CF6" : "#E5E7EB",
              color: colorMode === "speed" ? "#fff" : "#374151"
            }}
          >
            속도
          </button>
          <button
            onClick={() => onColorModeChange("heartRate")}
            style={{
              ...styles.colorButton,
              background: colorMode === "heartRate" ? "#EF4444" : "#E5E7EB",
              color: colorMode === "heartRate" ? "#fff" : "#374151"
            }}
          >
            심박수
          </button>
          <button
            onClick={() => onColorModeChange("elevation")}
            style={{
              ...styles.colorButton,
              background: colorMode === "elevation" ? "#F59E0B" : "#E5E7EB",
              color: colorMode === "elevation" ? "#fff" : "#374151"
            }}
          >
            고도
          </button>
        </div>
      </div>

      <div style={styles.divider} />

      <button onClick={onGenerateNew} style={styles.generateButton}>
        🔄 새 경로 생성
      </button>

      <div style={styles.legend}>
        <span style={styles.legendTitle}>속도 범례</span>
        <div style={styles.legendBar}>
          <div style={{ ...styles.legendSegment, background: "#3B82F6" }} />
          <div style={{ ...styles.legendSegment, background: "#10B981" }} />
          <div style={{ ...styles.legendSegment, background: "#84CC16" }} />
          <div style={{ ...styles.legendSegment, background: "#F59E0B" }} />
          <div style={{ ...styles.legendSegment, background: "#EF4444" }} />
        </div>
        <div style={styles.legendLabels}>
          <span>느림</span>
          <span>보통</span>
          <span>빠름</span>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  panel: {
    position: "absolute",
    top: 20,
    left: 20,
    width: 200,
    background: "#fff",
    borderRadius: 12,
    padding: 16,
    boxShadow: "0 2px 12px rgba(0,0,0,0.1)"
  },
  section: {
    marginBottom: 8
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: "#6B7280",
    marginBottom: 8,
    display: "block"
  },
  buttonGroup: {
    display: "flex",
    gap: 6
  },
  typeButton: {
    flex: 1,
    padding: "8px 10px",
    borderRadius: 8,
    border: "none",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s"
  },
  colorButton: {
    flex: 1,
    padding: "6px 8px",
    borderRadius: 6,
    border: "none",
    fontSize: 11,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s"
  },
  divider: {
    height: 1,
    background: "#E5E7EB",
    margin: "12px 0"
  },
  generateButton: {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    border: "none",
    background: "#1F2937",
    color: "#fff",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s"
  },
  legend: {
    marginTop: 12,
    paddingTop: 12,
    borderTop: "1px solid #E5E7EB"
  },
  legendTitle: {
    fontSize: 10,
    fontWeight: 600,
    color: "#6B7280",
    marginBottom: 6,
    display: "block"
  },
  legendBar: {
    display: "flex",
    height: 8,
    borderRadius: 4,
    overflow: "hidden"
  },
  legendSegment: {
    flex: 1
  },
  legendLabels: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 4,
    fontSize: 9,
    color: "#9CA3AF"
  }
};
