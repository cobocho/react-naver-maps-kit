import type { Position, Taxi, TaxiUpdate } from "../types";

const SEOUL_CITY_HALL: Position = { lat: 37.5665, lng: 126.978 };

function generateRandomPosition(center: Position, radiusKm: number): Position {
  const radiusLat = radiusKm / 111;
  const radiusLng = radiusKm / (111 * Math.cos((center.lat * Math.PI) / 180));

  return {
    lat: center.lat + (Math.random() - 0.5) * 2 * radiusLat,
    lng: center.lng + (Math.random() - 0.5) * 2 * radiusLng
  };
}

export function calculateBearing(from: Position, to: Position): number {
  const lat1 = (from.lat * Math.PI) / 180;
  const lat2 = (to.lat * Math.PI) / 180;
  const dLng = ((to.lng - from.lng) * Math.PI) / 180;

  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

  let bearing = (Math.atan2(y, x) * 180) / Math.PI;
  return (bearing + 360) % 360;
}

function generatePlateNumber(): string {
  const prefix = String(Math.floor(Math.random() * 90) + 10);
  const suffix = String(Math.floor(Math.random() * 9000) + 1000);
  const taxiLetters = ["바", "아", "자", "사", "배"];
  const letter = taxiLetters[Math.floor(Math.random() * taxiLetters.length)];
  return `${prefix}${letter} ${suffix}`;
}

const DRIVER_NAMES = [
  "김민수",
  "이준혁",
  "박성현",
  "최영호",
  "정대현",
  "강지훈",
  "윤성민",
  "임재현",
  "한승우",
  "조현준",
  "장동현",
  "신우진",
  "권태호",
  "황민규",
  "서준혁",
  "배성민",
  "유현우",
  "하준호",
  "진태현",
  "안성준"
];

const VEHICLE_TYPES: Array<"standard" | "deluxe" | "van"> = ["standard", "deluxe", "van"];

export function generateInitialTaxis(count: number = 20): Taxi[] {
  const taxis: Taxi[] = [];

  for (let i = 0; i < count; i++) {
    const position = generateRandomPosition(SEOUL_CITY_HALL, 1);
    const heading = Math.random() * 360;

    taxis.push({
      id: `taxi-${i + 1}`,
      taxiNumber: i + 1,
      plateNumber: generatePlateNumber(),
      position,
      heading,
      speed: 40 + Math.floor(Math.random() * 30),
      driverName: DRIVER_NAMES[i % DRIVER_NAMES.length],
      vehicleType: VEHICLE_TYPES[Math.floor(Math.random() * VEHICLE_TYPES.length)],
      lastUpdate: new Date()
    });
  }

  return taxis;
}

function generateSmallMovement(
  currentPosition: Position,
  currentHeading: number,
  speedKmh: number
): Position {
  const speedMs = speedKmh / 3.6;
  const moveDistanceDeg = speedMs * 0.000015;

  const headingVariation = (Math.random() - 0.5) * 20;
  const effectiveHeading = currentHeading + headingVariation;
  const headingRad = (effectiveHeading * Math.PI) / 180;

  return {
    lat: currentPosition.lat + Math.cos(headingRad) * moveDistanceDeg,
    lng: currentPosition.lng + Math.sin(headingRad) * moveDistanceDeg
  };
}

export function generateTaxiUpdate(taxi: Taxi): TaxiUpdate {
  const newPosition = generateSmallMovement(taxi.position, taxi.heading, taxi.speed);
  const newHeading = calculateBearing(taxi.position, newPosition);
  const newSpeed = Math.max(30, Math.min(80, taxi.speed + (Math.random() - 0.5) * 15));

  return {
    id: taxi.id,
    position: newPosition,
    heading: newHeading,
    speed: newSpeed,
    timestamp: new Date()
  };
}

export function generateBatchUpdates(taxis: Taxi[]): TaxiUpdate[] {
  return taxis.map((taxi) => generateTaxiUpdate(taxi));
}
