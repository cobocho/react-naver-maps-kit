import { Marker } from "react-naver-maps-kit";
import { formatPrice, getPriceColor } from "../utils/format";
import type { Property } from "../types";
import { memo } from "react";

interface PriceMarkerProps {
  property: Property;
  isSelected: boolean;
  onClick: (property: Property) => void;
}

function PriceMarkerBase({ property, isSelected, onClick }: PriceMarkerProps) {
  const color = getPriceColor(property.price);
  const displayPrice = formatPrice(property.price);

  return (
    <Marker
      position={{ lat: property.lat, lng: property.lng }}
      item={property}
      onClick={() => onClick(property)}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "4px 10px",
          background: color,
          color: "white",
          fontSize: "12px",
          fontWeight: 600,
          borderRadius: "20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          whiteSpace: "nowrap",
          transform: isSelected ? "scale(1.15)" : "scale(1)",
          border: isSelected ? "3px solid #fff" : "none",
          transition: "transform 0.2s ease"
        }}
      >
        {displayPrice}
      </div>
    </Marker>
  );
}

export const PriceMarker = memo(PriceMarkerBase);
