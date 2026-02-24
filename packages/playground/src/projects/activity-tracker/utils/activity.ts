import type { ColorMode } from "../types";

export function getSpeedColor(speed: number, type: "running" | "cycling"): string {
  const thresholds = type === "running" ? [6, 8, 10, 12, 14] : [15, 20, 25, 30, 35];

  const colors = ["#3B82F6", "#10B981", "#84CC16", "#F59E0B", "#EF4444"];

  for (let i = 0; i < thresholds.length; i++) {
    if (speed < thresholds[i]) return colors[i];
  }
  return colors[colors.length - 1];
}

export function getHeartRateColor(heartRate: number): string {
  if (heartRate < 120) return "#10B981";
  if (heartRate < 140) return "#84CC16";
  if (heartRate < 160) return "#F59E0B";
  if (heartRate < 180) return "#EF4444";
  return "#DC2626";
}

export function getElevationColor(elevation: number): string {
  if (elevation < 5) return "#3B82F6";
  if (elevation < 15) return "#10B981";
  if (elevation < 30) return "#F59E0B";
  return "#EF4444";
}

export function getSegmentColor(
  value: number,
  mode: ColorMode,
  activityType: "running" | "cycling"
): string {
  switch (mode) {
    case "speed":
      return getSpeedColor(value, activityType);
    case "heartRate":
      return getHeartRateColor(value);
    case "elevation":
      return getElevationColor(value);
    default:
      return "#3B82F6";
  }
}

export function getActivityTypeLabel(type: string): string {
  switch (type) {
    case "running":
      return "러닝";
    case "cycling":
      return "자전거";
    default:
      return "기타";
  }
}

export function getActivityIcon(type: string): string {
  switch (type) {
    case "running":
      return "🏃";
    case "cycling":
      return "🚴";
    default:
      return "📍";
  }
}
