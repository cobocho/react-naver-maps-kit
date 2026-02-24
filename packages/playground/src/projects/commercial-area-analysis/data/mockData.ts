import type { CommercialArea } from "../types";

function createArea(
  id: string,
  name: string,
  category: CommercialArea["category"],
  center: { lat: number; lng: number },
  size: { lat: number; lng: number },
  stats: CommercialArea["stats"]
): CommercialArea {
  const halfLat = size.lat / 2;
  const halfLng = size.lng / 2;

  return {
    id,
    name,
    category,
    paths: [
      { lat: center.lat - halfLat, lng: center.lng - halfLng },
      { lat: center.lat - halfLat, lng: center.lng + halfLng },
      { lat: center.lat + halfLat, lng: center.lng + halfLng },
      { lat: center.lat + halfLat, lng: center.lng - halfLng }
    ],
    center,
    stats
  };
}

export const commercialAreas: CommercialArea[] = [
  createArea(
    "area-1",
    "강남역 상권",
    "mixed",
    { lat: 37.498, lng: 127.028 },
    { lat: 0.006, lng: 0.01 },
    {
      monthlySales: 2850000000,
      dailyFootTraffic: 125000,
      storeCount: 342,
      avgRent: 850000,
      growthRate: 12.5
    }
  ),
  createArea(
    "area-2",
    "역삼역 상권",
    "dining",
    { lat: 37.5, lng: 127.036 },
    { lat: 0.005, lng: 0.008 },
    {
      monthlySales: 1820000000,
      dailyFootTraffic: 85000,
      storeCount: 186,
      avgRent: 720000,
      growthRate: 8.3
    }
  ),
  createArea(
    "area-3",
    "선릉역 상권",
    "shopping",
    { lat: 37.504, lng: 127.048 },
    { lat: 0.005, lng: 0.008 },
    {
      monthlySales: 1560000000,
      dailyFootTraffic: 72000,
      storeCount: 158,
      avgRent: 680000,
      growthRate: 5.7
    }
  ),
  createArea(
    "area-4",
    "삼성역 상권",
    "entertainment",
    { lat: 37.509, lng: 127.063 },
    { lat: 0.004, lng: 0.008 },
    {
      monthlySales: 2340000000,
      dailyFootTraffic: 98000,
      storeCount: 224,
      avgRent: 780000,
      growthRate: 15.2
    }
  ),
  createArea(
    "area-5",
    "청담동 명품거리",
    "shopping",
    { lat: 37.524, lng: 127.053 },
    { lat: 0.004, lng: 0.012 },
    {
      monthlySales: 4200000000,
      dailyFootTraffic: 45000,
      storeCount: 89,
      avgRent: 1500000,
      growthRate: -2.1
    }
  ),
  createArea(
    "area-6",
    "압구정로데오",
    "mixed",
    { lat: 37.528, lng: 127.041 },
    { lat: 0.004, lng: 0.01 },
    {
      monthlySales: 3100000000,
      dailyFootTraffic: 68000,
      storeCount: 167,
      avgRent: 1200000,
      growthRate: 3.8
    }
  ),
  createArea(
    "area-7",
    "테헤란로 IT밸리",
    "mixed",
    { lat: 37.501, lng: 127.038 },
    { lat: 0.003, lng: 0.02 },
    {
      monthlySales: 1980000000,
      dailyFootTraffic: 110000,
      storeCount: 245,
      avgRent: 920000,
      growthRate: 18.9
    }
  ),
  createArea(
    "area-8",
    "논현동 카페거리",
    "dining",
    { lat: 37.511, lng: 127.02 },
    { lat: 0.004, lng: 0.008 },
    {
      monthlySales: 1250000000,
      dailyFootTraffic: 52000,
      storeCount: 98,
      avgRent: 650000,
      growthRate: 22.4
    }
  )
];

export function getMetricRange(
  areas: CommercialArea[],
  metric: "sales" | "footTraffic" | "growth"
): { min: number; max: number } {
  const values = areas.map((area) => {
    switch (metric) {
      case "sales":
        return area.stats.monthlySales;
      case "footTraffic":
        return area.stats.dailyFootTraffic;
      case "growth":
        return area.stats.growthRate;
    }
  });

  return {
    min: Math.min(...values),
    max: Math.max(...values)
  };
}
