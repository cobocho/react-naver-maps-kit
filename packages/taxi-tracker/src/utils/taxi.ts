import { format } from "./format";

export function getVehicleTypeLabel(type: string): string {
  switch (type) {
    case "standard":
      return "일반";
    case "deluxe":
      return "모범";
    case "van":
      return "밴";
    default:
      return "기타";
  }
}

export function formatTime(date: Date): string {
  return format(date, "HH:mm:ss");
}

export function formatSpeed(speed: number): string {
  return `${speed.toFixed(0)} km/h`;
}
