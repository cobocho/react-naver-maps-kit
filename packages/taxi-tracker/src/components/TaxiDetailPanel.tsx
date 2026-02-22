import type { Taxi } from "../types";
import { getVehicleTypeLabel, formatTime, formatSpeed } from "../utils/taxi";

interface TaxiDetailPanelProps {
  taxi: Taxi | null;
  onClose: () => void;
  onFollowToggle: () => void;
  isFollowing: boolean;
}

export function TaxiDetailPanel({
  taxi,
  onClose,
  onFollowToggle,
  isFollowing
}: TaxiDetailPanelProps) {
  if (!taxi) return null;

  return (
    <div style={styles.panel}>
      <div style={styles.header}>
        <div style={styles.plateNumber}>
          <span style={styles.plateText}>{taxi.plateNumber}</span>
        </div>
        <button onClick={onClose} style={styles.closeButton}>
          ✕
        </button>
      </div>

      <div style={styles.content}>
        <div style={styles.row}>
          <span style={styles.label}>택시 번호</span>
          <span style={styles.value}>No. {taxi.taxiNumber}</span>
        </div>

        <div style={styles.row}>
          <span style={styles.label}>기사명</span>
          <span style={styles.value}>{taxi.driverName}</span>
        </div>

        <div style={styles.row}>
          <span style={styles.label}>차량종류</span>
          <span style={styles.value}>{getVehicleTypeLabel(taxi.vehicleType)}</span>
        </div>

        <div style={styles.row}>
          <span style={styles.label}>속도</span>
          <span style={styles.value}>{formatSpeed(taxi.speed)}</span>
        </div>

        <div style={styles.row}>
          <span style={styles.label}>방향</span>
          <span style={styles.value}>{taxi.heading.toFixed(0)}°</span>
        </div>

        <div style={styles.row}>
          <span style={styles.label}>최근 업데이트</span>
          <span style={styles.value}>{formatTime(taxi.lastUpdate)}</span>
        </div>

        <div style={styles.row}>
          <span style={styles.label}>위치</span>
          <span style={styles.value}>
            {taxi.position.lat.toFixed(4)}, {taxi.position.lng.toFixed(4)}
          </span>
        </div>
      </div>

      <button
        onClick={onFollowToggle}
        style={{
          ...styles.followButton,
          background: isFollowing ? "#EF4444" : "#3B82F6"
        }}
      >
        {isFollowing ? "따라가기 중지" : "따라가기"}
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  panel: {
    position: "absolute",
    top: 80,
    right: 16,
    width: 280,
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
    zIndex: 100,
    overflow: "hidden"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    borderBottom: "1px solid #E5E7EB",
    background: "#F9FAFB"
  },
  plateNumber: {
    background: "#FCD34D",
    padding: "8px 16px",
    borderRadius: 6,
    border: "2px solid #1F2937"
  },
  plateText: {
    fontSize: 18,
    fontWeight: 700,
    color: "#1F2937",
    letterSpacing: 1
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    border: "none",
    background: "#E5E7EB",
    cursor: "pointer",
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  content: {
    padding: 16
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
    borderBottom: "1px solid #F3F4F6"
  },
  label: {
    color: "#6B7280",
    fontSize: 13
  },
  value: {
    fontWeight: 500,
    fontSize: 13,
    display: "flex",
    alignItems: "center",
    gap: 6
  },
  followButton: {
    width: "100%",
    padding: 14,
    border: "none",
    color: "#fff",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer"
  }
};
