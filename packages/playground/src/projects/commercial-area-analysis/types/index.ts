export interface Position {
  lat: number;
  lng: number;
}

export interface CommercialAreaStats {
  monthlySales: number;
  dailyFootTraffic: number;
  storeCount: number;
  avgRent: number;
  growthRate: number;
}

export interface CommercialArea {
  id: string;
  name: string;
  category: "shopping" | "dining" | "entertainment" | "mixed";
  paths: Position[];
  center: Position;
  stats: CommercialAreaStats;
}

export type ColorMetric = "sales" | "footTraffic" | "growth";

export function getColorForMetric(
  metric: ColorMetric,
  value: number,
  min: number,
  max: number
): string {
  const ratio = (value - min) / (max - min || 1);

  if (metric === "sales" || metric === "footTraffic") {
    if (ratio < 0.25) return "#FFE5E5";
    if (ratio < 0.5) return "#FFB4B4";
    if (ratio < 0.75) return "#FF6B6B";
    return "#E53935";
  }

  if (ratio < 0.25) return "#E5F5E5";
  if (ratio < 0.5) return "#A8E6A3";
  if (ratio < 0.75) return "#4CAF50";
  return "#2E7D32";
}

export function formatCurrency(value: number): string {
  if (value >= 100000000) {
    return `${(value / 100000000).toFixed(1)}억`;
  }
  if (value >= 10000) {
    return `${(value / 10000).toFixed(0)}만`;
  }
  return value.toLocaleString();
}

export function formatNumber(value: number): string {
  if (value >= 10000) {
    return `${(value / 10000).toFixed(1)}만`;
  }
  return value.toLocaleString();
}
