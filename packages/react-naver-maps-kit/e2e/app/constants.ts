export const DEFAULT_CENTER = { lat: 37.5665, lng: 126.978 };
export const TARGET_POSITION = { lat: 37.5172, lng: 127.0473 };
export const NCP_KEY_ID = "jfcrbbeqoh";
export const BUSAN_CENTER = { lat: 35.1796, lng: 129.0756 };
export const JEJU_CENTER = { lat: 33.4996, lng: 126.5312 };

// Marker test positions
export const MARKER_POS_1 = { lat: 37.5665, lng: 126.978 }; // 서울시청
export const MARKER_POS_2 = { lat: 37.4981, lng: 127.0276 }; // 강남역
export const MARKER_POS_3 = { lat: 37.5547, lng: 126.9707 }; // 서울역

// Circle test positions
export const CIRCLE_CENTER_1 = { lat: 37.5665, lng: 126.978 }; // 서울시청
export const CIRCLE_CENTER_2 = { lat: 37.4981, lng: 127.0276 }; // 강남역
export const CIRCLE_CENTER_3 = { lat: 37.5547, lng: 126.9707 }; // 서울역
export const CIRCLE_RADIUS_1 = 500; // 500m
export const CIRCLE_RADIUS_2 = 1000; // 1km
export const CIRCLE_RADIUS_3 = 2000; // 2km

// Ellipse test bounds (south/west/north/east)
export const ELLIPSE_BOUNDS_1 = { south: 37.54, west: 126.95, north: 37.59, east: 127.0 };
export const ELLIPSE_BOUNDS_2 = { south: 37.47, west: 127.0, north: 37.52, east: 127.06 };
export const ELLIPSE_BOUNDS_3 = { south: 37.53, west: 126.94, north: 37.57, east: 126.99 };

// Rectangle test bounds (south/west/north/east)
export const RECTANGLE_BOUNDS_1 = { south: 37.54, west: 126.95, north: 37.59, east: 127.0 };
export const RECTANGLE_BOUNDS_2 = { south: 37.47, west: 127.0, north: 37.52, east: 127.06 };
export const RECTANGLE_BOUNDS_3 = { south: 37.53, west: 126.94, north: 37.57, east: 126.99 };

// Polygon test paths (lat/lng)
export const POLYGON_PATHS_1 = [
  [
    { lat: 37.5705, lng: 126.9655 },
    { lat: 37.5795, lng: 126.979 },
    { lat: 37.5715, lng: 126.995 },
    { lat: 37.558, lng: 126.9915 },
    { lat: 37.5545, lng: 126.974 }
  ]
];

export const POLYGON_PATHS_2 = [
  [
    { lat: 37.507, lng: 127.006 },
    { lat: 37.5165, lng: 127.0215 },
    { lat: 37.5045, lng: 127.037 },
    { lat: 37.4905, lng: 127.03 },
    { lat: 37.492, lng: 127.0125 }
  ]
];

export const POLYGON_PATHS_3 = [
  [
    { lat: 37.5535, lng: 126.946 },
    { lat: 37.5655, lng: 126.9585 },
    { lat: 37.561, lng: 126.9785 },
    { lat: 37.5465, lng: 126.982 },
    { lat: 37.5405, lng: 126.9625 }
  ]
];

// GroundOverlay test bounds (south/west/north/east)
export const GROUND_OVERLAY_BOUNDS_1 = { south: 37.54, west: 126.95, north: 37.59, east: 127.0 };
export const GROUND_OVERLAY_BOUNDS_2 = { south: 37.47, west: 127.0, north: 37.52, east: 127.06 };
export const GROUND_OVERLAY_BOUNDS_3 = { south: 37.53, west: 126.94, north: 37.57, east: 126.99 };

// GroundOverlay test urls
export const GROUND_OVERLAY_URL_1 =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Crect width='32' height='32' fill='%23ef4444'/%3E%3C/svg%3E#go1";
export const GROUND_OVERLAY_URL_2 =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Crect width='32' height='32' fill='%233b82f6'/%3E%3C/svg%3E#go2";
export const GROUND_OVERLAY_URL_3 =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Crect width='32' height='32' fill='%2310b981'/%3E%3C/svg%3E#go3";
