import { Marker } from "react-naver-maps-kit";
import { memo } from "react";
import type { Position } from "../types";

interface StartEndMarkersProps {
  startPoint: Position;
  endPoint: Position;
}

function StartEndMarkersBase({ startPoint, endPoint }: StartEndMarkersProps) {
  return (
    <>
      <Marker position={{ lat: startPoint.lat, lng: startPoint.lng }}>
        <div style={styles.startMarker}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" fill="#10B981" stroke="#fff" strokeWidth="2" />
            <path
              d="M10 16L14 20L22 12"
              stroke="#fff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span style={styles.startLabel}>START</span>
        </div>
      </Marker>

      <Marker position={{ lat: endPoint.lat, lng: endPoint.lng }}>
        <div style={styles.endMarker}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" fill="#EF4444" stroke="#fff" strokeWidth="2" />
            <rect x="10" y="10" width="12" height="12" fill="#fff" rx="2" />
          </svg>
          <span style={styles.endLabel}>FINISH</span>
        </div>
      </Marker>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  startMarker: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    transform: "translate(-50%, -50%)"
  },
  endMarker: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    transform: "translate(-50%, -50%)"
  },
  startLabel: {
    marginTop: 2,
    padding: "2px 6px",
    background: "#10B981",
    color: "#fff",
    fontSize: 9,
    fontWeight: 700,
    borderRadius: 3,
    whiteSpace: "nowrap"
  },
  endLabel: {
    marginTop: 2,
    padding: "2px 6px",
    background: "#EF4444",
    color: "#fff",
    fontSize: 9,
    fontWeight: 700,
    borderRadius: 3,
    whiteSpace: "nowrap"
  }
};

export const StartEndMarkers = memo(StartEndMarkersBase);
