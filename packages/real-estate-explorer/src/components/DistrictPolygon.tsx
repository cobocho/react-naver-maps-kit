import { memo } from "react";
import { Polygon } from "react-naver-maps-kit";
import type { District } from "../types";

interface DistrictPolygonProps {
  district: District;
  isVisible: boolean;
}

function DistrictPolygonBase({ district, isVisible }: DistrictPolygonProps) {
  if (!isVisible) return null;

  const fillColor = district.type === "school" ? "#3B82F6" : "#10B981";
  const strokeColor = district.type === "school" ? "#1D4ED8" : "#059669";

  return (
    <Polygon
      paths={district.paths}
      fillColor={fillColor}
      fillOpacity={0.15}
      strokeColor={strokeColor}
      strokeOpacity={0.8}
      strokeWeight={2}
    />
  );
}

export const DistrictPolygon = memo(DistrictPolygonBase);
