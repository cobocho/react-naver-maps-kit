export interface Position {
  lat: number;
  lng: number;
}

export interface Taxi {
  id: string;
  taxiNumber: number;
  plateNumber: string;
  position: Position;
  heading: number;
  speed: number;
  driverName: string;
  vehicleType: "standard" | "deluxe" | "van";
  lastUpdate: Date;
}

export interface TaxiState extends Taxi {
  targetPosition: Position;
  animationProgress: number;
}

export interface TaxiUpdate {
  id: string;
  position: Position;
  heading?: number;
  speed?: number;
  timestamp: Date;
}
