import { useState, useCallback } from "react";
import { NaverMap, Marker, MarkerClusterer } from "react-naver-maps-kit";
import { PriceMarker } from "./components/PriceMarker";
import { PropertyCard } from "./components/PropertyCard";
import { PriceFilter } from "./components/PriceFilter";
import { DistrictPolygon } from "./components/DistrictPolygon";
import { usePropertySearch } from "./hooks/usePropertySearch";
import { mockDistricts } from "./data/mockData";
import type { Property, PriceRange } from "./types";

function ClusterBadge({ count }: { count: number }) {
  const size = count < 10 ? 40 : count < 100 ? 48 : 56;
  const bg = count < 10 ? "#4F46E5" : count < 100 ? "#7C3AED" : "#DC2626";

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: size < 44 ? 13 : 15,
        border: "3px solid #fff",
        boxShadow: "0 3px 10px rgba(0,0,0,0.3)",
        cursor: "pointer"
      }}
    >
      {count}
    </div>
  );
}

interface MapContentProps {
  priceRange: PriceRange;
  selectedProperty: Property | null;
  onPropertyClick: (property: Property) => void;
  showDistricts: boolean;
  showSchoolDistricts: boolean;
}

function MapContent({
  priceRange,
  selectedProperty,
  onPropertyClick,
  showDistricts,
  showSchoolDistricts
}: MapContentProps) {
  const { properties, isLoading, error, refetch } = usePropertySearch(priceRange);

  const handleIdle = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <div style={styles.main}>
      <div style={styles.mapContainer}>
        <NaverMap
          center={{ lat: 37.5172, lng: 127.0473 }}
          zoom={14}
          style={{ width: "100%", height: "100%" }}
          onIdle={handleIdle}
        >
          <MarkerClusterer
            algorithm={{ type: "supercluster", radius: 60 }}
            clusterIcon={({ count }) => <ClusterBadge count={count} />}
            onClusterClick={({ cluster, helpers }) => {
              helpers.zoomToCluster(cluster, { padding: 20 });
            }}
          >
            {properties.map((property) => (
              <PriceMarker
                key={property.id}
                property={property}
                isSelected={selectedProperty?.id === property.id}
                onClick={onPropertyClick}
              />
            ))}
          </MarkerClusterer>

          {mockDistricts.map((district) => (
            <DistrictPolygon
              key={district.id}
              district={district}
              isVisible={
                (district.type === "admin" && showDistricts) ||
                (district.type === "school" && showSchoolDistricts)
              }
            />
          ))}

          {selectedProperty && (
            <Marker position={{ lat: selectedProperty.lat, lng: selectedProperty.lng }}>
              <div style={styles.infoWindow}>
                <strong>{selectedProperty.address}</strong>
                <p>클릭하여 상세보기</p>
              </div>
            </Marker>
          )}
        </NaverMap>

        {isLoading && (
          <div style={styles.loadingOverlay}>
            <div style={styles.spinner} />
            <span>매물 검색 중...</span>
          </div>
        )}
      </div>

      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h2>매물 목록 ({properties.length}건)</h2>
          {error && <span style={styles.errorText}>{error.message}</span>}
        </div>
        <div style={styles.propertyList}>
          {properties.length === 0 ? (
            <div style={styles.emptyState}>
              <p>지도를 이동하여 매물을 검색해보세요.</p>
            </div>
          ) : (
            properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                isSelected={selectedProperty?.id === property.id}
                onClick={onPropertyClick}
                onFavoriteToggle={() => {}}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function RealEstateExplorer() {
  const [priceRange, setPriceRange] = useState<PriceRange>({ min: 0, max: 999999 });
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showDistricts, setShowDistricts] = useState(false);
  const [showSchoolDistricts, setShowSchoolDistricts] = useState(true);

  const handlePropertyClick = useCallback((property: Property) => {
    setSelectedProperty(property);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🏢 부동산 매물 탐색</h1>
        <div style={styles.controls}>
          <PriceFilter value={priceRange} onChange={setPriceRange} />
          <div style={styles.toggleGroup}>
            <button
              onClick={() => setShowDistricts(!showDistricts)}
              style={{
                ...styles.toggleButton,
                background: showDistricts ? "#10B981" : "#E5E7EB",
                color: showDistricts ? "#fff" : "#374151"
              }}
            >
              행정구역
            </button>
            <button
              onClick={() => setShowSchoolDistricts(!showSchoolDistricts)}
              style={{
                ...styles.toggleButton,
                background: showSchoolDistricts ? "#3B82F6" : "#E5E7EB",
                color: showSchoolDistricts ? "#fff" : "#374151"
              }}
            >
              학군
            </button>
          </div>
        </div>
      </div>

      <MapContent
        priceRange={priceRange}
        selectedProperty={selectedProperty}
        onPropertyClick={handlePropertyClick}
        showDistricts={showDistricts}
        showSchoolDistricts={showSchoolDistricts}
      />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    background: "#F9FAFB"
  },
  header: {
    padding: "12px 20px",
    background: "#fff",
    borderBottom: "1px solid #E5E7EB",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  title: {
    fontSize: "20px",
    fontWeight: 700,
    margin: 0
  },
  controls: {
    display: "flex",
    gap: "16px",
    alignItems: "center"
  },
  toggleGroup: {
    display: "flex",
    gap: "8px"
  },
  toggleButton: {
    padding: "8px 16px",
    borderRadius: "20px",
    border: "none",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s"
  },
  main: {
    display: "flex",
    flex: 1,
    overflow: "hidden"
  },
  mapContainer: {
    flex: 1,
    position: "relative"
  },
  sidebar: {
    width: "360px",
    background: "#fff",
    borderLeft: "1px solid #E5E7EB",
    display: "flex",
    flexDirection: "column"
  },
  sidebarHeader: {
    padding: "16px",
    borderBottom: "1px solid #E5E7EB"
  },
  propertyList: {
    flex: 1,
    overflow: "auto",
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  loadingOverlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "rgba(255,255,255,0.95)",
    padding: "16px 24px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
  },
  spinner: {
    width: "20px",
    height: "20px",
    border: "2px solid #E5E7EB",
    borderTopColor: "#4F46E5",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  },
  infoWindow: {
    padding: "8px 12px",
    width: "240px",
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    fontSize: "13px"
  },
  emptyState: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "200px",
    color: "#6B7280"
  },
  errorText: {
    color: "#EF4444",
    fontSize: "13px"
  }
};
