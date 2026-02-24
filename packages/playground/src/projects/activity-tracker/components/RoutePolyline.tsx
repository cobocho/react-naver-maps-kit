import { memo } from "react";
import { Polyline } from "react-naver-maps-kit";
import type { RoutePoint, ColorMode } from "../types";
import { getSegmentColor } from "../utils/activity";

interface RoutePolylineProps {
  points: RoutePoint[];
  colorMode: ColorMode;
  activityType: "running" | "cycling";
  highlightedSegment?: number;
}

function RoutePolylineBase({
  points,
  colorMode,
  activityType,
  highlightedSegment
}: RoutePolylineProps) {
  if (points.length < 2) return null;

  const segments: Array<{
    start: RoutePoint;
    end: RoutePoint;
    color: string;
    index: number;
  }> = [];

  for (let i = 0; i < points.length - 1; i++) {
    const start = points[i];
    const end = points[i + 1];
    const value =
      colorMode === "speed"
        ? (start.speed + end.speed) / 2
        : colorMode === "heartRate"
          ? ((start.heartRate || 120) + (end.heartRate || 120)) / 2
          : ((start.elevation || 10) + (end.elevation || 10)) / 2;

    segments.push({
      start,
      end,
      color: getSegmentColor(value, colorMode, activityType),
      index: i
    });
  }

  return (
    <>
      {segments.map((segment) => {
        const isHighlighted = highlightedSegment === segment.index;
        return (
          <Polyline
            key={segment.index}
            path={[
              { lat: segment.start.position.lat, lng: segment.start.position.lng },
              { lat: segment.end.position.lat, lng: segment.end.position.lng }
            ]}
            strokeColor={segment.color}
            strokeWeight={isHighlighted ? 8 : 4}
            strokeOpacity={isHighlighted ? 1 : 0.8}
          />
        );
      })}
    </>
  );
}

export const RoutePolyline = memo(RoutePolylineBase);
