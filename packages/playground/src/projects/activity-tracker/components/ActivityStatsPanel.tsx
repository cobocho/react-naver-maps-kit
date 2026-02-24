import type { Activity } from "../types";
import { formatDistance, formatDuration, formatPace } from "../data/mockData";
import { getActivityIcon } from "../utils/activity";

interface ActivityStatsPanelProps {
  activity: Activity | null;
}

export function ActivityStatsPanel({ activity }: ActivityStatsPanelProps) {
  if (!activity) return null;

  return (
    <div style={styles.panel}>
      <div style={styles.header}>
        <span style={styles.icon}>{getActivityIcon(activity.type)}</span>
        <div>
          <h3 style={styles.title}>{activity.name}</h3>
          <span style={styles.date}>
            {activity.startTime.toLocaleDateString("ko-KR", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            })}
          </span>
        </div>
      </div>

      <div style={styles.stats}>
        <div style={styles.statItem}>
          <span style={styles.statValue}>{formatDistance(activity.totalDistance)}</span>
          <span style={styles.statLabel}>거리</span>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statValue}>{formatDuration(activity.totalDuration)}</span>
          <span style={styles.statLabel}>시간</span>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statValue}>{formatPace(activity.averageSpeed)}</span>
          <span style={styles.statLabel}>평균 페이스</span>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statValue}>{activity.calories}</span>
          <span style={styles.statLabel}>칼로리</span>
        </div>
      </div>

      <div style={styles.detail}>
        <div style={styles.detailRow}>
          <span style={styles.detailLabel}>최고 속도</span>
          <span style={styles.detailValue}>{activity.maxSpeed.toFixed(1)} km/h</span>
        </div>
        <div style={styles.detailRow}>
          <span style={styles.detailLabel}>평균 속도</span>
          <span style={styles.detailValue}>{activity.averageSpeed.toFixed(1)} km/h</span>
        </div>
        <div style={styles.detailRow}>
          <span style={styles.detailLabel}>기록 포인트</span>
          <span style={styles.detailValue}>{activity.points.length}개</span>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  panel: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
    overflow: "hidden"
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "16px 20px",
    background: "#1F2937"
  },
  icon: {
    fontSize: 32
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    color: "#fff",
    margin: 0
  },
  date: {
    fontSize: 12,
    color: "#9CA3AF"
  },
  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    padding: "16px 20px",
    borderBottom: "1px solid #E5E7EB"
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  statValue: {
    fontSize: 20,
    fontWeight: 700,
    color: "#1F2937"
  },
  statLabel: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 2
  },
  detail: {
    padding: "12px 20px"
  },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "6px 0"
  },
  detailLabel: {
    fontSize: 13,
    color: "#6B7280"
  },
  detailValue: {
    fontSize: 13,
    fontWeight: 600,
    color: "#1F2937"
  }
};
