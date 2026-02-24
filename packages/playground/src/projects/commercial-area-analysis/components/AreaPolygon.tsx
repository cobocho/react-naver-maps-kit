import { memo, useCallback } from "react";
import { Polygon } from "react-naver-maps-kit";
import type { CommercialArea, ColorMetric } from "../types";
import { getColorForMetric } from "../types";

interface AreaPolygonProps {
  area: CommercialArea;
  colorMetric: ColorMetric;
  metricRange: { min: number; max: number };
  isSelected: boolean;
  isHovered: boolean;
  hasSelection: boolean;
  onClick: (area: CommercialArea) => void;
  onHover: (areaId: string | null) => void;
}

function AreaPolygonBase({
  area,
  colorMetric,
  metricRange,
  isSelected,
  isHovered,
  hasSelection,
  onClick,
  onHover
}: AreaPolygonProps) {
  const metricValue = getMetricValue(area, colorMetric);
  const baseColor = getColorForMetric(colorMetric, metricValue, metricRange.min, metricRange.max);

  const handleClick = useCallback(() => {
    onClick(area);
  }, [area, onClick]);

  const handleMouseOver = useCallback(() => {
    onHover(area.id);
  }, [area.id, onHover]);

  const handleMouseOut = useCallback(() => {
    onHover(null);
  }, [onHover]);

  const fillOpacity = getFillOpacity(isSelected, isHovered, hasSelection);
  const strokeWeight = isSelected ? 3 : isHovered ? 2 : 1;
  const strokeColor = isSelected ? "#1F2937" : isHovered ? "#374151" : "#6B7280";

  return (
    <Polygon
      paths={[area.paths as naver.maps.ArrayOfCoordsLiteral]}
      fillColor={baseColor}
      fillOpacity={fillOpacity}
      strokeColor={strokeColor}
      strokeWeight={strokeWeight}
      clickable={true}
      onClick={handleClick}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    />
  );
}

function getMetricValue(area: CommercialArea, metric: ColorMetric): number {
  switch (metric) {
    case "sales":
      return area.stats.monthlySales;
    case "footTraffic":
      return area.stats.dailyFootTraffic;
    case "growth":
      return area.stats.growthRate;
  }
}

function getFillOpacity(isSelected: boolean, isHovered: boolean, hasSelection: boolean): number {
  if (isSelected) return 0.7;
  if (isHovered) return 0.6;
  if (hasSelection) return 0.2;
  return 0.5;
}

export const AreaPolygon = memo(AreaPolygonBase);
