export interface Property {
  id: string;
  lat: number;
  lng: number;
  price: number;
  type: "apartment" | "villa" | "officetel" | "house";
  area: number; // 평수
  rooms: number;
  bathrooms: number;
  floor: number;
  address: string;
  imageUrl: string;
  isFavorite: boolean;
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface SearchParams {
  bounds: {
    sw: { lat: number; lng: number };
    ne: { lat: number; lng: number };
  };
  priceRange: PriceRange;
  propertyTypes: Property["type"][];
}

export interface District {
  id: string;
  name: string;
  paths: Array<{ lat: number; lng: number }>;
  type: "school" | "admin";
}
