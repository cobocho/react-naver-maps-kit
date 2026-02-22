export type ActivityType = "running" | "cycling";

export interface Position {
  lat: number;
  lng: number;
}

export interface RoutePoint {
  position: Position;
  timestamp: Date;
  speed: number;
  heartRate?: number;
  elevation?: number;
  distance: number;
}

export interface Activity {
  id: string;
  type: ActivityType;
  name: string;
  startTime: Date;
  endTime: Date;
  points: RoutePoint[];
  totalDistance: number;
  totalDuration: number;
  averageSpeed: number;
  maxSpeed: number;
  calories: number;
}

export interface ActivityStats {
  distance: number;
  duration: number;
  avgSpeed: number;
  maxSpeed: number;
  avgHeartRate?: number;
  elevation: number;
  calories: number;
}

export type ColorMode = "speed" | "heartRate" | "elevation";
