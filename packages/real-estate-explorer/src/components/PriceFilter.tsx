import { memo } from "react";
import type { PriceRange } from "../types";

interface PriceFilterProps {
  value: PriceRange;
  onChange: (range: PriceRange) => void;
}

const PRICE_PRESETS = [
  { label: "전체", min: 0, max: 999999 },
  { label: "1~3억", min: 10000, max: 30000 },
  { label: "3~5억", min: 30000, max: 50000 },
  { label: "5~15억", min: 50000, max: 150000 },
  { label: "15억+", min: 150000, max: 999999 }
];

function PriceFilterBase({ value, onChange }: PriceFilterProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        padding: "8px 12px",
        background: "#fff",
        borderRadius: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}
    >
      {PRICE_PRESETS.map((preset) => {
        const isActive = value.min === preset.min && value.max === preset.max;
        return (
          <button
            key={preset.label}
            onClick={() => onChange({ min: preset.min, max: preset.max })}
            style={{
              padding: "6px 12px",
              borderRadius: "16px",
              border: "none",
              background: isActive ? "#4F46E5" : "#F3F4F6",
              color: isActive ? "#fff" : "#374151",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            {preset.label}
          </button>
        );
      })}
    </div>
  );
}

export const PriceFilter = memo(PriceFilterBase);
