import { memo } from "react";
import { formatPrice, formatArea, getPropertyTypeLabel } from "../utils/format";
import type { Property } from "../types";

interface PropertyCardProps {
  property: Property;
  isSelected: boolean;
  onClick: (property: Property) => void;
  onFavoriteToggle: (propertyId: string) => void;
}

function PropertyCardBase({ property, isSelected, onClick, onFavoriteToggle }: PropertyCardProps) {
  return (
    <div
      onClick={() => onClick(property)}
      style={{
        display: "flex",
        gap: "12px",
        padding: "12px",
        background: isSelected ? "#EEF2FF" : "#fff",
        borderRadius: "12px",
        cursor: "pointer",
        transition: "background 0.2s",
        border: isSelected ? "2px solid #4F46E5" : "2px solid transparent"
      }}
    >
      <img
        src={property.imageUrl}
        alt={property.address}
        style={{
          width: "100px",
          height: "75px",
          borderRadius: "8px",
          objectFit: "cover"
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <span style={{ fontSize: "16px", fontWeight: 700, color: "#111" }}>
            {formatPrice(property.price)}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle(property.id);
            }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "18px"
            }}
          >
            {property.isFavorite ? "❤️" : "🤍"}
          </button>
        </div>
        <div style={{ fontSize: "13px", color: "#666", marginTop: "4px" }}>
          {getPropertyTypeLabel(property.type)} · {formatArea(property.area)} · {property.rooms}룸
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "#999",
            marginTop: "4px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}
        >
          {property.address}
        </div>
      </div>
    </div>
  );
}

export const PropertyCard = memo(PropertyCardBase);
