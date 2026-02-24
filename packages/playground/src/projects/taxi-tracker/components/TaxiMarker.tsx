import { Marker } from "react-naver-maps-kit";
import { memo } from "react";
import type { Taxi } from "../types";

interface TaxiMarkerProps {
  taxi: Taxi;
  isSelected: boolean;
  onClick: (taxi: Taxi) => void;
}

function TaxiMarkerBase({ taxi, isSelected, onClick }: TaxiMarkerProps) {
  const size = isSelected ? 64 : 56;

  return (
    <Marker
      position={{ lat: taxi.position.lat, lng: taxi.position.lng }}
      item={taxi}
      zIndex={isSelected ? 100 : 1}
      onClick={() => onClick(taxi)}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `rotate(${taxi.heading}deg)`,
          transition: "transform 0.3s ease-out",
          cursor: "pointer"
        }}
      >
        <img
          src="/taxi.png"
          alt="taxi"
          width={size}
          height={size}
          style={{ objectFit: "contain" }}
        />
        {isSelected && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%) rotate(${-taxi.heading}deg)`,
              width: size + 28,
              height: size + 28,
              borderRadius: "50%",
              border: "3px solid #FCD34D",
              opacity: 0.6,
              animation: "pulse 1.5s ease-in-out infinite",
              pointerEvents: "none"
            }}
          />
        )}
      </div>
    </Marker>
  );
}

export const TaxiMarker = memo(TaxiMarkerBase);
