import { useState, useCallback, useRef, useEffect } from "react";
import { NaverMap, NaverMapProvider } from "react-naver-maps-kit";
import type { Submodule } from "react-naver-maps-kit";
import { TaxiMarker } from "./components/TaxiMarker";
import { TaxiDetailPanel } from "./components/TaxiDetailPanel";
import { ControlPanel } from "./components/ControlPanel";
import { useTaxiSimulation } from "./hooks/useTaxiSimulation";
import type { Taxi } from "./types";

const UPDATE_INTERVAL = 1000;
const TAXI_SUBMODULES: Submodule[] = ["gl"];

type TaxiTrackerProps = {
  ncpKeyId: string;
};

function TaxiTrackerBase() {
  const [isRealtimeEnabled, setIsRealtimeEnabled] = useState(true);
  const [selectedTaxi, setSelectedTaxi] = useState<Taxi | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [mapTypeId, setMapTypeId] = useState("normal");
  const mapInstanceRef = useRef<naver.maps.Map | null>(null);

  const { taxis, lastUpdate, reset } = useTaxiSimulation({
    updateInterval: UPDATE_INTERVAL,
    enabled: isRealtimeEnabled
  });

  const handleTaxiClick = useCallback((taxi: Taxi) => {
    setSelectedTaxi((prev) => (prev?.id === taxi.id ? null : taxi));
  }, []);

  const handleRealtimeToggle = useCallback(() => {
    setIsRealtimeEnabled((prev) => !prev);
  }, []);

  const handleMapTypeChange = useCallback((type: string) => {
    setMapTypeId(type);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setMapTypeId(type as naver.maps.MapTypeId);
    }
  }, []);

  const handleMapReady = useCallback((map: naver.maps.Map) => {
    mapInstanceRef.current = map;
  }, []);

  const handleMyLocationClick = useCallback(() => {
    if (!mapInstanceRef.current || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        mapInstanceRef.current?.panTo(new naver.maps.LatLng(latitude, longitude));
      },
      (error) => {
        console.error("Geolocation error:", error);
      }
    );
  }, []);

  const handleFollowToggle = useCallback(() => {
    setIsFollowing((prev) => !prev);
  }, []);

  const handleClosePanel = useCallback(() => {
    setSelectedTaxi(null);
    setIsFollowing(false);
  }, []);

  useEffect(() => {
    if (isFollowing && selectedTaxi && mapInstanceRef.current) {
      mapInstanceRef.current.panTo(
        new naver.maps.LatLng(selectedTaxi.position.lat, selectedTaxi.position.lng)
      );
    }
  }, [isFollowing, selectedTaxi?.position]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🚕 실시간 택시 추적</h1>
        <button onClick={reset} style={styles.resetButton}>
          초기화
        </button>
      </div>

      <div style={styles.mapContainer}>
        <NaverMap
          center={{ lat: 37.5665, lng: 126.978 }}
          zoom={15}
          style={{ width: "100%", height: "100%" }}
          mapTypeId={mapTypeId as naver.maps.MapTypeId}
          onMapReady={handleMapReady}
          gl
        >
          {taxis.map((taxi) => (
            <TaxiMarker
              key={taxi.id}
              taxi={taxi}
              isSelected={selectedTaxi?.id === taxi.id}
              onClick={handleTaxiClick}
            />
          ))}
        </NaverMap>

        <ControlPanel
          isRealtimeEnabled={isRealtimeEnabled}
          onRealtimeToggle={handleRealtimeToggle}
          updateInterval={UPDATE_INTERVAL}
          lastUpdate={lastUpdate}
          mapTypeId={mapTypeId}
          onMapTypeChange={handleMapTypeChange}
          onMyLocationClick={handleMyLocationClick}
          taxiCount={taxis.length}
        />

        {selectedTaxi && (
          <TaxiDetailPanel
            taxi={selectedTaxi}
            onClose={handleClosePanel}
            onFollowToggle={handleFollowToggle}
            isFollowing={isFollowing}
          />
        )}
      </div>
    </div>
  );
}

export default function TaxiTracker({ ncpKeyId }: TaxiTrackerProps) {
  return (
    <NaverMapProvider ncpKeyId={ncpKeyId} submodules={TAXI_SUBMODULES}>
      <TaxiTrackerBase />
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
  resetButton: {
    padding: "8px 16px",
    borderRadius: 6,
    border: "none",
    background: "#374151",
    color: "#fff",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer"
  },
  mapContainer: {
    flex: 1,
    position: "relative"
  }
};
