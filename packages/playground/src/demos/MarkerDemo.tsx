import { useRef, useState } from "react";
import { Marker, NaverMap } from "react-naver-maps-kit";
import type { MarkerRef } from "react-naver-maps-kit";

import { useEventLog } from "../useEventLog.ts";
import { EventLog } from "../EventLog.tsx";

const DEFAULT_POS = { lat: 37.5666102, lng: 126.9783881 };

type MarkerStyle =
  | "default"
  | "defaultSmall"
  | "defaultLarge"
  | "defaultOpacity"
  | "defaultAnchorBottom"
  | "imageMarker"
  | "imageMarkerResized"
  | "spriteMarker"
  | "badge"
  | "pin"
  | "emoji"
  | "dot"
  | "label"
  | "icon"
  | "pulse";

interface MarkerPreset {
  id: MarkerStyle;
  label: string;
  color: string;
  category: "icon" | "custom";
}

const MARKER_PRESETS: MarkerPreset[] = [
  { id: "default", label: "기본", color: "#333", category: "icon" },
  { id: "defaultSmall", label: "기본(Small)", color: "#666", category: "icon" },
  { id: "defaultLarge", label: "기본(Large)", color: "#333", category: "icon" },
  { id: "defaultOpacity", label: "기본(반투명)", color: "#999", category: "icon" },
  { id: "defaultAnchorBottom", label: "기본(하단앵커)", color: "#444", category: "icon" },
  { id: "imageMarker", label: "이미지", color: "#03C75A", category: "icon" },
  { id: "imageMarkerResized", label: "이미지(리사이즈)", color: "#2196F3", category: "icon" },
  { id: "spriteMarker", label: "스프라이트", color: "#FF9800", category: "icon" },
  { id: "badge", label: "배지", color: "#03C75A", category: "custom" },
  { id: "pin", label: "핀", color: "#EA4335", category: "custom" },
  { id: "emoji", label: "이모지", color: "#FBBC04", category: "custom" },
  { id: "dot", label: "닷", color: "#4285F4", category: "custom" },
  { id: "label", label: "라벨", color: "#9C27B0", category: "custom" },
  { id: "icon", label: "아이콘", color: "#FF5722", category: "custom" },
  { id: "pulse", label: "펄스", color: "#00BCD4", category: "custom" }
];

const LANDSCAPE_IMAGE =
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=80&h=80&fit=crop";
const BEACH_IMAGE =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=80&h=80&fit=crop";
const SPRITE_IMAGE = "https://cdn-icons-png.flaticon.com/512/25/25613.png";

function getIconConfig(style: MarkerStyle): naver.maps.MarkerOptions["icon"] | undefined {
  switch (style) {
    case "default":
      return undefined;

    case "defaultSmall":
      return {
        path: naver.maps.SymbolPath.CIRCLE,
        radius: 6,
        fillColor: "#E74C3C",
        fillOpacity: 1,
        strokeColor: "#fff",
        strokeWeight: 2,
        anchor: new naver.maps.Point(0, 0)
      };

    case "defaultLarge":
      return {
        path: naver.maps.SymbolPath.CIRCLE,
        radius: 20,
        fillColor: "#E74C3C",
        fillOpacity: 1,
        strokeColor: "#fff",
        strokeWeight: 3,
        anchor: naver.maps.Position.CENTER
      };

    case "defaultOpacity":
      return {
        path: naver.maps.SymbolPath.CIRCLE,
        radius: 10,
        fillColor: "#E74C3C",
        fillOpacity: 0.5,
        strokeColor: "#fff",
        strokeWeight: 2,
        strokeOpacity: 0.5,
        anchor: naver.maps.Position.CENTER
      };

    case "defaultAnchorBottom":
      return {
        path: naver.maps.SymbolPath.CIRCLE,
        radius: 10,
        fillColor: "#3498DB",
        fillOpacity: 1,
        strokeColor: "#fff",
        strokeWeight: 2,
        anchor: new naver.maps.Point(0, -10)
      };

    case "imageMarker":
      return {
        url: LANDSCAPE_IMAGE,
        size: new naver.maps.Size(40, 40),
        scaledSize: new naver.maps.Size(40, 40),
        anchor: new naver.maps.Point(20, 40)
      };

    case "imageMarkerResized":
      return {
        url: BEACH_IMAGE,
        size: new naver.maps.Size(60, 40),
        scaledSize: new naver.maps.Size(60, 40),
        anchor: new naver.maps.Point(30, 40)
      };

    case "spriteMarker":
      return {
        url: SPRITE_IMAGE,
        size: new naver.maps.Size(32, 32),
        scaledSize: new naver.maps.Size(32, 32),
        anchor: new naver.maps.Point(16, 32)
      };

    default:
      return undefined;
  }
}

function isIconStyle(style: MarkerStyle): boolean {
  const preset = MARKER_PRESETS.find((p) => p.id === style);
  return preset?.category === "icon";
}

function CustomMarkerIcon({ style, label }: { style: MarkerStyle; label: string }) {
  const preset = MARKER_PRESETS.find((p) => p.id === style) ?? MARKER_PRESETS[0];

  switch (style) {
    case "badge":
      return (
        <div
          style={{
            background: `linear-gradient(135deg, ${preset.color} 0%, ${preset.color}dd 100%)`,
            color: "#fff",
            padding: "6px 14px",
            borderRadius: 20,
            fontSize: 13,
            fontWeight: 600,
            whiteSpace: "nowrap",
            boxShadow: "0 3px 8px rgba(0,0,0,0.25)",
            border: "2px solid #fff"
          }}
        >
          {label || "Badge"}
        </div>
      );

    case "pin":
      return (
        <div
          style={{
            position: "relative",
            width: 36,
            height: 44
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50% 50% 50% 0",
              background: preset.color,
              transform: "rotate(-45deg)",
              boxShadow: "0 3px 8px rgba(0,0,0,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: "#fff",
                transform: "rotate(45deg)"
              }}
            />
          </div>
        </div>
      );

    case "emoji":
      return (
        <div
          style={{
            fontSize: 32,
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
          }}
        >
          📍
        </div>
      );

    case "dot":
      return (
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: preset.color,
            border: "3px solid #fff",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
          }}
        />
      );

    case "label":
      return (
        <div
          style={{
            background: preset.color,
            color: "#fff",
            padding: "8px 12px",
            borderRadius: 4,
            fontSize: 12,
            fontWeight: 700,
            whiteSpace: "nowrap",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            position: "relative"
          }}
        >
          {label || "Label"}
          <div
            style={{
              position: "absolute",
              bottom: -6,
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: `6px solid ${preset.color}`
            }}
          />
        </div>
      );

    case "icon":
      return (
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            background: `linear-gradient(135deg, ${preset.color} 0%, ${preset.color}cc 100%)`,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            boxShadow: "0 3px 8px rgba(0,0,0,0.25)",
            border: "2px solid #fff"
          }}
        >
          ★
        </div>
      );

    case "pulse":
      return (
        <div style={{ position: "relative", width: 20, height: 20 }}>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: preset.color,
              opacity: 0.3,
              animation: "pulse 1.5s ease-out infinite"
            }}
          />
          <div
            style={{
              position: "relative",
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: preset.color,
              border: "2px solid #fff",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
              zIndex: 1
            }}
          />
          <style>{`
            @keyframes pulse {
              0% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
              100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
            }
          `}</style>
        </div>
      );

    default:
      return undefined;
  }
}

export function MarkerDemo() {
  const { entries, log, clear } = useEventLog();
  const markerRef = useRef<MarkerRef>(null);

  const [clickable, setClickable] = useState(true);
  const [draggable, setDraggable] = useState(true);
  const [visible, setVisible] = useState(true);
  const [markerStyle, setMarkerStyle] = useState<MarkerStyle>("default");
  const [markerCount, setMarkerCount] = useState(1);
  const [position, setPosition] = useState(DEFAULT_POS);
  const [label, setLabel] = useState("마커");
  const [multiStyleMode, setMultiStyleMode] = useState(false);

  const extraMarkers = Array.from({ length: markerCount - 1 }, (_, i) => ({
    lat: DEFAULT_POS.lat + (i + 1) * 0.003,
    lng: DEFAULT_POS.lng + (i + 1) * 0.003,
    style: MARKER_PRESETS[(i + 1) % MARKER_PRESETS.length].id as MarkerStyle
  }));

  const presetMarkers = [
    {
      lat: DEFAULT_POS.lat - 0.006,
      lng: DEFAULT_POS.lng - 0.01,
      style: "default" as MarkerStyle,
      label: "기본"
    },
    {
      lat: DEFAULT_POS.lat - 0.006,
      lng: DEFAULT_POS.lng - 0.003,
      style: "defaultSmall" as MarkerStyle,
      label: "Small"
    },
    {
      lat: DEFAULT_POS.lat - 0.006,
      lng: DEFAULT_POS.lng + 0.003,
      style: "defaultLarge" as MarkerStyle,
      label: "Large"
    },
    {
      lat: DEFAULT_POS.lat - 0.006,
      lng: DEFAULT_POS.lng + 0.01,
      style: "defaultOpacity" as MarkerStyle,
      label: "반투명"
    },
    {
      lat: DEFAULT_POS.lat - 0.002,
      lng: DEFAULT_POS.lng - 0.01,
      style: "defaultAnchorBottom" as MarkerStyle,
      label: "하단앵커"
    },
    {
      lat: DEFAULT_POS.lat - 0.002,
      lng: DEFAULT_POS.lng - 0.003,
      style: "imageMarker" as MarkerStyle,
      label: "이미지"
    },
    {
      lat: DEFAULT_POS.lat - 0.002,
      lng: DEFAULT_POS.lng + 0.003,
      style: "imageMarkerResized" as MarkerStyle,
      label: "리사이즈"
    },
    {
      lat: DEFAULT_POS.lat - 0.002,
      lng: DEFAULT_POS.lng + 0.01,
      style: "spriteMarker" as MarkerStyle,
      label: "스프라이트"
    },
    {
      lat: DEFAULT_POS.lat + 0.002,
      lng: DEFAULT_POS.lng - 0.01,
      style: "badge" as MarkerStyle,
      label: "카페"
    },
    {
      lat: DEFAULT_POS.lat + 0.002,
      lng: DEFAULT_POS.lng - 0.003,
      style: "pin" as MarkerStyle,
      label: "핀"
    },
    {
      lat: DEFAULT_POS.lat + 0.002,
      lng: DEFAULT_POS.lng + 0.003,
      style: "emoji" as MarkerStyle,
      label: "이모지"
    },
    {
      lat: DEFAULT_POS.lat + 0.002,
      lng: DEFAULT_POS.lng + 0.01,
      style: "dot" as MarkerStyle,
      label: "닷"
    },
    {
      lat: DEFAULT_POS.lat + 0.006,
      lng: DEFAULT_POS.lng - 0.01,
      style: "label" as MarkerStyle,
      label: "라벨"
    },
    {
      lat: DEFAULT_POS.lat + 0.006,
      lng: DEFAULT_POS.lng - 0.003,
      style: "icon" as MarkerStyle,
      label: "아이콘"
    },
    {
      lat: DEFAULT_POS.lat + 0.006,
      lng: DEFAULT_POS.lng + 0.003,
      style: "pulse" as MarkerStyle,
      label: "펄스"
    }
  ];

  function renderMarkerContent(style: MarkerStyle, label: string) {
    if (isIconStyle(style)) {
      return undefined;
    }
    return <CustomMarkerIcon style={style} label={label} />;
  }

  return (
    <>
      <h1 className="demo-title">Marker</h1>
      <p className="demo-description">
        마커 생성, 드래그, 이벤트 처리, 다양한 커스텀 아이콘 스타일, imperative ref 메서드를
        테스트합니다.
      </p>

      <div className="info-row">
        <span className="info-chip">
          Markers: {multiStyleMode ? presetMarkers.length : markerCount}
        </span>
        <span className="info-chip">
          Style: {MARKER_PRESETS.find((p) => p.id === markerStyle)?.label}
        </span>
        <span className="info-chip">
          Position: {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
        </span>
      </div>

      <div className="map-container">
        <NaverMap
          defaultCenter={DEFAULT_POS}
          defaultZoom={multiStyleMode ? 13 : 14}
          style={{ width: "100%", height: 500 }}
        >
          {multiStyleMode ? (
            presetMarkers.map((m, i) => (
              <Marker
                key={i}
                position={{ lat: m.lat, lng: m.lng }}
                clickable={clickable}
                draggable={false}
                visible={visible}
                icon={isIconStyle(m.style) ? getIconConfig(m.style) : undefined}
                onClick={() => log(`${m.label} 클릭`)}
              >
                {renderMarkerContent(m.style, m.label)}
              </Marker>
            ))
          ) : (
            <>
              <Marker
                ref={markerRef}
                position={position}
                clickable={clickable}
                draggable={draggable}
                visible={visible}
                icon={isIconStyle(markerStyle) ? getIconConfig(markerStyle) : undefined}
                onClick={() => log("click")}
                onDblClick={() => log("dblclick")}
                onRightClick={() => log("rightclick")}
                onDragStart={() => log("dragstart")}
                onDrag={() => log("drag")}
                onDragEnd={(e) => {
                  const coord = e.coord;
                  setPosition({ lat: coord.y, lng: coord.x });
                  log(`dragend → ${coord.y.toFixed(4)}, ${coord.x.toFixed(4)}`);
                }}
                onMarkerReady={() => log("marker ready")}
              >
                {renderMarkerContent(markerStyle, label)}
              </Marker>

              {extraMarkers.map((pos, i) => (
                <Marker
                  key={i}
                  position={pos}
                  clickable={clickable}
                  visible={visible}
                  icon={isIconStyle(pos.style) ? getIconConfig(pos.style) : undefined}
                  onClick={() => log(`extra marker ${i + 2} clicked`)}
                >
                  {renderMarkerContent(pos.style, `${i + 2}`)}
                </Marker>
              ))}
            </>
          )}
        </NaverMap>
      </div>

      <div className="controls-panel">
        <div className="controls-title">Controls</div>
        <div className="controls-grid">
          <div className="control-item">
            <input
              type="checkbox"
              checked={clickable}
              onChange={(e) => setClickable(e.target.checked)}
            />
            <label>Clickable</label>
          </div>
          <div className="control-item">
            <input
              type="checkbox"
              checked={draggable}
              onChange={(e) => setDraggable(e.target.checked)}
            />
            <label>Draggable</label>
          </div>
          <div className="control-item">
            <input
              type="checkbox"
              checked={visible}
              onChange={(e) => setVisible(e.target.checked)}
            />
            <label>Visible</label>
          </div>
          <div className="control-item">
            <input
              type="checkbox"
              checked={multiStyleMode}
              onChange={(e) => setMultiStyleMode(e.target.checked)}
            />
            <label>멀티 스타일 모드</label>
          </div>
        </div>

        <div className="controls-grid" style={{ marginTop: 12 }}>
          <div className="control-item">
            <label>라벨</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              disabled={multiStyleMode}
              placeholder="마커 라벨"
            />
          </div>
          <div className="control-item">
            <label>마커 수</label>
            <input
              type="number"
              min={1}
              max={20}
              value={markerCount}
              onChange={(e) => setMarkerCount(Number(e.target.value))}
              disabled={multiStyleMode}
            />
          </div>
        </div>

        <div style={{ marginTop: 16, padding: 12, background: "#f5f5f5", borderRadius: 8 }}>
          <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>
            Icon 스타일 (icon prop 사용)
          </div>
          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              alignItems: "center",
              marginBottom: 16
            }}
          >
            {MARKER_PRESETS.filter((p) => p.category === "icon").map((p) => (
              <div
                key={p.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  cursor: "pointer",
                  padding: "8px 12px",
                  borderRadius: 6,
                  background: markerStyle === p.id ? "#fff" : "transparent",
                  boxShadow: markerStyle === p.id ? "0 2px 6px rgba(0,0,0,0.1)" : "none",
                  transition: "all 0.2s"
                }}
                onClick={() => !multiStyleMode && setMarkerStyle(p.id)}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: p.id.includes("image") || p.id === "spriteMarker" ? 4 : "50%",
                    background: p.color,
                    border: "2px solid #fff",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                  }}
                />
                <span style={{ fontSize: 10, color: "#666" }}>{p.label}</span>
              </div>
            ))}
          </div>

          <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>
            Custom 스타일 (children 사용)
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
            {MARKER_PRESETS.filter((p) => p.category === "custom").map((p) => (
              <div
                key={p.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  cursor: "pointer",
                  opacity: markerStyle === p.id ? 1 : 0.6,
                  transform: markerStyle === p.id ? "scale(1.1)" : "scale(1)",
                  transition: "all 0.2s"
                }}
                onClick={() => !multiStyleMode && setMarkerStyle(p.id)}
              >
                <CustomMarkerIcon style={p.id} label={p.label} />
                <span style={{ fontSize: 10, color: "#888" }}>{p.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <div className="controls-title">Ref Methods</div>
          <div className="btn-group">
            <button
              className="btn"
              onClick={() => {
                const pos = markerRef.current?.getPosition();
                if (pos) log(`getPosition → ${pos.y.toFixed(4)}, ${pos.x.toFixed(4)}`);
              }}
            >
              getPosition
            </button>
            <button
              className="btn"
              onClick={() => {
                const v = markerRef.current?.getVisible();
                log(`getVisible → ${v}`);
              }}
            >
              getVisible
            </button>
            <button
              className="btn"
              onClick={() => {
                markerRef.current?.setPosition(
                  new naver.maps.LatLng(DEFAULT_POS.lat, DEFAULT_POS.lng)
                );
                setPosition(DEFAULT_POS);
                log("setPosition → reset");
              }}
            >
              Reset Position
            </button>
          </div>
        </div>
      </div>

      <EventLog entries={entries} onClear={clear} />
    </>
  );
}
