import { useState, useCallback, useMemo } from "react";
import { NaverMap, NaverMapProvider } from "react-naver-maps-kit";
import { RoutePolyline } from "./components/RoutePolyline";
import { StartEndMarkers } from "./components/StartEndMarkers";
import { ActivityStatsPanel } from "./components/ActivityStatsPanel";
import { ControlPanel } from "./components/ControlPanel";
import { generateActivity } from "./data/mockData";
import type { Activity, ActivityType, ColorMode } from "./types";

type ActivityTrackerProps = {
  ncpKeyId: string;
};

function ActivityTrackerBase() {
  const [activityType, setActivityType] = useState<ActivityType>("running");
  const [colorMode, setColorMode] = useState<ColorMode>("speed");
  const [activity, setActivity] = useState<Activity | null>(null);

  const generateNewActivity = useCallback(() => {
    const newActivity = generateActivity(activityType, 80);
    setActivity(newActivity);
  }, [activityType]);

  useMemo(() => {
    generateNewActivity();
  }, [generateNewActivity]);

  const handleActivityTypeChange = useCallback((type: ActivityType) => {
    setActivityType(type);
  }, []);

  const handleColorModeChange = useCallback((mode: ColorMode) => {
    setColorMode(mode);
  }, []);

  const startPoint = activity?.points[0]?.position;
  const endPoint = activity?.points[activity.points.length - 1]?.position;
  const center = startPoint || { lat: 37.5207, lng: 126.9932 };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🏃 운동 기록 트래커</h1>
      </div>

      <div style={styles.mapContainer}>
        <NaverMap center={center} zoom={15} style={{ width: "100%", height: "100%" }}>
          {activity && activity.points.length > 1 && (
            <>
              <RoutePolyline
                points={activity.points}
                colorMode={colorMode}
                activityType={activity.type}
              />
              {startPoint && endPoint && (
                <StartEndMarkers startPoint={startPoint} endPoint={endPoint} />
              )}
            </>
          )}
        </NaverMap>

        <ControlPanel
          activityType={activityType}
          onActivityTypeChange={handleActivityTypeChange}
          colorMode={colorMode}
          onColorModeChange={handleColorModeChange}
          onGenerateNew={generateNewActivity}
        />

        <ActivityStatsPanel activity={activity} />
      </div>
    </div>
  );
}

export default function ActivityTracker({ ncpKeyId }: ActivityTrackerProps) {
  return (
    <NaverMapProvider ncpKeyId={ncpKeyId}>
      <ActivityTrackerBase />
    </NaverMapProvider>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    background: "#F3F4F6"
  },
  header: {
    padding: "12px 20px",
    background: "#1F2937",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    margin: 0,
    color: "#fff"
  },
  mapContainer: {
    flex: 1,
    position: "relative"
  }
};
