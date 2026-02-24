import { formatTime } from "../utils/taxi";

interface ControlPanelProps {
  isRealtimeEnabled: boolean;
  onRealtimeToggle: () => void;
  updateInterval: number;
  lastUpdate: Date;
  mapTypeId: string;
  onMapTypeChange: (type: string) => void;
  onMyLocationClick: () => void;
  taxiCount: number;
}

export function ControlPanel({
  isRealtimeEnabled,
  onRealtimeToggle,
  updateInterval,
  lastUpdate,
  mapTypeId,
  onMapTypeChange,
  onMyLocationClick,
  taxiCount
}: ControlPanelProps) {
  return (
    <div style={styles.container}>
      <div style={styles.row}>
        <div style={styles.stat}>
          <span style={styles.statValue}>{taxiCount}</span>
          <span style={styles.statLabel}>운행중</span>
        </div>
      </div>

      <div style={styles.divider} />

      <div style={styles.row}>
        <button
          onClick={onRealtimeToggle}
          style={{
            ...styles.toggle,
            background: isRealtimeEnabled ? "#10B981" : "#6B7280"
          }}
        >
          {isRealtimeEnabled ? "실시간 ON" : "실시간 OFF"}
        </button>
        <span style={styles.interval}>{updateInterval / 1000}s</span>
      </div>

      <div style={styles.row}>
        <span style={styles.lastUpdate}>마지막 업데이트: {formatTime(lastUpdate)}</span>
      </div>

      <div style={styles.divider} />

      <div style={styles.row}>
        <button
          onClick={() => onMapTypeChange("normal")}
          style={{
            ...styles.mapTypeButton,
            background: mapTypeId === "normal" ? "#3B82F6" : "#E5E7EB",
            color: mapTypeId === "normal" ? "#fff" : "#374151"
          }}
        >
          일반
        </button>
        <button
          onClick={() => onMapTypeChange("satellite")}
          style={{
            ...styles.mapTypeButton,
            background: mapTypeId === "satellite" ? "#3B82F6" : "#E5E7EB",
            color: mapTypeId === "satellite" ? "#fff" : "#374151"
          }}
        >
          위성
        </button>
        <button onClick={onMyLocationClick} style={styles.locationButton}>
          📍 내 위치
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: "absolute",
    top: 16,
    left: 16,
    background: "#fff",
    borderRadius: 12,
    padding: 16,
    boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
    zIndex: 100,
    minWidth: 200
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 8
  },
  stat: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  statValue: {
    fontSize: 24,
    fontWeight: 700,
    color: "#1F2937"
  },
  statLabel: {
    fontSize: 11,
    color: "#6B7280"
  },
  divider: {
    height: 1,
    background: "#E5E7EB",
    margin: "12px 0"
  },
  toggle: {
    padding: "8px 16px",
    borderRadius: 20,
    border: "none",
    color: "#fff",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s"
  },
  interval: {
    fontSize: 12,
    color: "#6B7280",
    background: "#F3F4F6",
    padding: "4px 8px",
    borderRadius: 4
  },
  lastUpdate: {
    fontSize: 11,
    color: "#9CA3AF"
  },
  mapTypeButton: {
    padding: "6px 12px",
    borderRadius: 6,
    border: "none",
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s"
  },
  locationButton: {
    padding: "6px 12px",
    borderRadius: 6,
    border: "none",
    background: "#F59E0B",
    color: "#fff",
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s"
  }
};
