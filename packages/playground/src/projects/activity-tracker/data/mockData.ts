import type { Position, RoutePoint, Activity, ActivityType } from "../types";

// 서초동 일대 (한강 남쪽, 육지 위)
const ROUTE_CENTER: Position = { lat: 37.483, lng: 127.015 };

function generateLoopRoute(pointCount: number): Position[] {
  const positions: Position[] = [];

  const loopRadiusLat = 0.004;
  const loopRadiusLng = 0.008;

  const startAngle = Math.random() * Math.PI * 2;
  const loops = 1 + Math.random() * 0.5;
  const totalAngle = loops * Math.PI * 2;

  for (let i = 0; i < pointCount; i++) {
    const progress = i / (pointCount - 1);
    const angle = startAngle + progress * totalAngle;

    const wobble = Math.sin(progress * Math.PI * 8) * 0.0003;

    const lat = ROUTE_CENTER.lat + Math.sin(angle) * loopRadiusLat + wobble;
    const lng =
      ROUTE_CENTER.lng +
      Math.cos(angle) * loopRadiusLng +
      Math.cos(progress * Math.PI * 4) * 0.0002;

    positions.push({ lat, lng });
  }

  return positions;
}

function getSpeedProfile(progress: number, activityType: ActivityType): number {
  const baseSpeed = activityType === "running" ? 9 : 20;
  const maxSpeed = activityType === "running" ? 12 : 25;
  const minSpeed = activityType === "running" ? 6 : 15;

  let speedMultiplier: number;

  if (progress < 0.1) {
    speedMultiplier = 0.7 + progress * 3;
  } else if (progress < 0.3) {
    speedMultiplier = 1.0 + (progress - 0.1) * 0.5;
  } else if (progress < 0.7) {
    speedMultiplier = 1.1 + Math.sin((progress - 0.3) * Math.PI * 5) * 0.1;
  } else if (progress < 0.9) {
    speedMultiplier = 1.0 - (progress - 0.7) * 0.3;
  } else {
    speedMultiplier = 0.85 - (progress - 0.9) * 0.5;
  }

  const variation = (Math.random() - 0.5) * 0.15;
  const speed = baseSpeed * speedMultiplier + baseSpeed * variation;

  return Math.max(minSpeed, Math.min(maxSpeed, speed));
}

function getHeartRateProfile(progress: number, activityType: ActivityType, speed: number): number {
  const baseHR = activityType === "running" ? 145 : 110;
  const maxHR = activityType === "running" ? 175 : 140;

  const intensity = (speed - 6) / 6;
  const hr = baseHR + intensity * 20 + (Math.random() - 0.5) * 8;

  if (progress < 0.1) {
    return Math.min(hr, baseHR + 10);
  }

  return Math.min(maxHR, Math.max(baseHR - 15, hr));
}

function getElevationProfile(progress: number): number {
  let elevation = 10;

  const bridgePoints = [0.2, 0.5, 0.8];
  for (const bp of bridgePoints) {
    const dist = Math.abs(progress - bp);
    if (dist < 0.05) {
      elevation += (0.05 - dist) * 40;
    }
  }

  elevation += Math.sin(progress * Math.PI * 10) * 0.5;
  elevation += (Math.random() - 0.5) * 0.5;

  return Math.max(5, elevation);
}

function calculateDistanceMeters(from: Position, to: Position): number {
  const R = 6371000;
  const dLat = ((to.lat - from.lat) * Math.PI) / 180;
  const dLng = ((to.lng - from.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((from.lat * Math.PI) / 180) *
      Math.cos((to.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function generateActivity(type: ActivityType, pointCount: number = 100): Activity {
  const routePositions = generateLoopRoute(pointCount);
  const points: RoutePoint[] = [];
  let cumulativeDistance = 0;

  for (let i = 0; i < routePositions.length; i++) {
    const progress = i / (routePositions.length - 1);
    const speed = getSpeedProfile(progress, type);

    if (i > 0) {
      const segmentDistance = calculateDistanceMeters(routePositions[i - 1], routePositions[i]);
      cumulativeDistance += segmentDistance;
    }

    const heartRate = getHeartRateProfile(progress, type, speed);
    const elevation = getElevationProfile(progress);

    points.push({
      position: routePositions[i],
      timestamp: new Date(Date.now() + i * 3000),
      speed,
      heartRate: Math.round(heartRate),
      elevation,
      distance: cumulativeDistance
    });
  }

  const totalDistanceKm = cumulativeDistance / 1000;
  const speeds = points.map((p) => p.speed);
  const totalDuration = pointCount * 3;

  const activityNames: Record<ActivityType, string[]> = {
    running: ["여의도 공원 러닝", "한강 조깅", "여의도 루프 코스", "아침 러닝"],
    cycling: ["여의도 자전거 라이딩", "한강 자전거 코스", "공원 라이딩"]
  };

  const names = activityNames[type];
  const name = names[Math.floor(Math.random() * names.length)];

  const caloriesPerKm = type === "running" ? 70 : 35;
  const calories = Math.floor(totalDistanceKm * caloriesPerKm);

  return {
    id: `activity-${Date.now()}`,
    type,
    name,
    startTime: points[0]?.timestamp || new Date(),
    endTime: points[points.length - 1]?.timestamp || new Date(),
    points,
    totalDistance: totalDistanceKm,
    totalDuration,
    averageSpeed: speeds.reduce((a, b) => a + b, 0) / speeds.length,
    maxSpeed: Math.max(...speeds),
    calories
  };
}

export function formatDistance(km: number): string {
  if (km >= 1) {
    return `${km.toFixed(2)} km`;
  }
  return `${(km * 1000).toFixed(0)} m`;
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

export function formatPace(speedKmh: number): string {
  if (speedKmh === 0) return "-'--\"";
  const minutesPerKm = 60 / speedKmh;
  const mins = Math.floor(minutesPerKm);
  const secs = Math.floor((minutesPerKm - mins) * 60);
  return `${mins}'${String(secs).padStart(2, "0")}"`;
}
