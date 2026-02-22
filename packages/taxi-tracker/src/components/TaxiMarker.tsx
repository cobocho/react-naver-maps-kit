import { Marker } from "react-naver-maps-kit";
import { memo } from "react";
import type { Taxi } from "../types";

interface TaxiMarkerProps {
  taxi: Taxi;
  isSelected: boolean;
  onClick: (taxi: Taxi) => void;
}

function TaxiMarkerBase({ taxi, isSelected, onClick }: TaxiMarkerProps) {
  const size = isSelected ? 52 : 44;

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
        <svg
          fill="#000000"
          height={size}
          width={size}
          version="1.1"
          id="Capa_1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 47.032 47.032"
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <g>
              <path
                fill="#e69028"
                d="M29.395,0H17.636c-3.117,0-5.643,3.467-5.643,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759 c3.116,0,5.644-2.527,5.644-5.644V6.584C35.037,3.467,32.511,0,29.395,0z M34.05,14.188v11.665l-2.729,0.351v-4.806L34.05,14.188z M32.618,10.773c-1.016,3.9-2.219,8.51-2.219,8.51H16.631l-2.222-8.51C14.41,10.773,23.293,7.755,32.618,10.773z M15.741,21.713 v4.492l-2.73-0.349V14.502L15.741,21.713z M13.011,37.938V27.579l2.73,0.343v8.196L13.011,37.938z M14.568,40.882l2.218-3.336 h13.771l2.219,3.336H14.568z M31.321,35.805v-7.872l2.729-0.355v10.048L31.321,35.805z"
              ></path>
            </g>
          </g>
        </svg>
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
