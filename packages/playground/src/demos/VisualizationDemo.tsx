import { useMemo, useState } from "react";
import { NaverMap, HeatMap, DotMap } from "react-naver-maps-kit";

const SEOUL_CENTER = { lat: 37.5666, lng: 126.9784 };

function generateRandomPoints(
  center: { lat: number; lng: number },
  count: number,
  radius: number
): Array<{ lat: number; lng: number; weight: number }> {
  const points: Array<{ lat: number; lng: number; weight: number }> = [];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * radius;
    const lat = center.lat + distance * Math.cos(angle);
    const lng = center.lng + distance * Math.sin(angle) * 1.2;
    const weight = Math.floor(Math.random() * 10) + 1;
    points.push({ lat, lng, weight });
  }
  return points;
}

const spectrumOptions = [
  { label: "RAINBOW", value: "RAINBOW" },
  { label: "JET", value: "JET" },
  { label: "HSV", value: "HSV" },
  { label: "HOT", value: "HOT" },
  { label: "COOL", value: "COOL" },
  { label: "GREYS", value: "GREYS" },
  { label: "YIGnBu", value: "YIGnBu" },
  { label: "YIOrRd", value: "YIOrRd" },
  { label: "RdBu", value: "RdBu" },
  { label: "PORTLAND", value: "PORTLAND" },
  { label: "OXYGEN", value: "OXYGEN" }
] as const;

export function VisualizationDemo() {
  const [visualizationType, setVisualizationType] = useState<"heatmap" | "dotmap">("heatmap");
  const [pointCount, setPointCount] = useState(200);
  const [radius, setRadius] = useState(20);
  const [opacity, setOpacity] = useState(0.6);
  const [spectrum, setSpectrum] = useState<string>("RAINBOW");
  const [spectrumReverse, setSpectrumReverse] = useState(false);
  const [fillColor, setFillColor] = useState("#EA4335");
  const [strokeColor, setStrokeColor] = useState("#ffffff");
  const [strokeWeight, setStrokeWeight] = useState(1);

  const data = useMemo(() => generateRandomPoints(SEOUL_CENTER, pointCount, 0.05), [pointCount]);

  const colorMap = useMemo(() => {
    if (typeof naver === "undefined" || !naver.maps.visualization?.SpectrumStyle) {
      return undefined;
    }
    return naver.maps.visualization.SpectrumStyle[
      spectrum as keyof typeof naver.maps.visualization.SpectrumStyle
    ];
  }, [spectrum]);

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <div
        style={{
          width: 320,
          padding: 16,
          background: "#f5f5f5",
          overflowY: "auto",
          borderRight: "1px solid #ddd"
        }}
      >
        <h2 style={{ margin: "0 0 16px" }}>Visualization Demo</h2>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>시각화 유형</label>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setVisualizationType("heatmap")}
              style={{
                flex: 1,
                padding: "8px 16px",
                border: "1px solid #ccc",
                borderRadius: 4,
                cursor: "pointer",
                background: visualizationType === "heatmap" ? "#03C75A" : "#fff",
                color: visualizationType === "heatmap" ? "#fff" : "#333"
              }}
            >
              HeatMap
            </button>
            <button
              onClick={() => setVisualizationType("dotmap")}
              style={{
                flex: 1,
                padding: "8px 16px",
                border: "1px solid #ccc",
                borderRadius: 4,
                cursor: "pointer",
                background: visualizationType === "dotmap" ? "#03C75A" : "#fff",
                color: visualizationType === "dotmap" ? "#fff" : "#333"
              }}
            >
              DotMap
            </button>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
            데이터 포인트 수: {pointCount}
          </label>
          <input
            type="range"
            min={50}
            max={500}
            value={pointCount}
            onChange={(e) => setPointCount(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
            반지름: {radius}px
          </label>
          <input
            type="range"
            min={5}
            max={50}
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
            불투명도: {opacity.toFixed(1)}
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={opacity * 100}
            onChange={(e) => setOpacity(Number(e.target.value) / 100)}
            style={{ width: "100%" }}
          />
        </div>

        {visualizationType === "heatmap" && (
          <>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
                색상 스펙트럼
              </label>
              <select
                value={spectrum}
                onChange={(e) => setSpectrum(e.target.value)}
                style={{ width: "100%", padding: 8, borderRadius: 4 }}
              >
                {spectrumOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="checkbox"
                  checked={spectrumReverse}
                  onChange={(e) => setSpectrumReverse(e.target.checked)}
                />
                <span>스펙트럼 반전</span>
              </label>
            </div>
          </>
        )}

        {visualizationType === "dotmap" && (
          <>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
                채우기 색상
              </label>
              <input
                type="color"
                value={fillColor}
                onChange={(e) => setFillColor(e.target.value)}
                style={{ width: "100%", height: 40, padding: 0, border: "none" }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>선 색상</label>
              <input
                type="color"
                value={strokeColor}
                onChange={(e) => setStrokeColor(e.target.value)}
                style={{ width: "100%", height: 40, padding: 0, border: "none" }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
                선 두께: {strokeWeight}px
              </label>
              <input
                type="range"
                min={0}
                max={5}
                value={strokeWeight}
                onChange={(e) => setStrokeWeight(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>
          </>
        )}

        <div
          style={{
            marginTop: 24,
            padding: 12,
            background: "#fff",
            borderRadius: 8,
            fontSize: 12,
            lineHeight: 1.6
          }}
        >
          <strong>데이터 정보</strong>
          <br />총 {data.length}개 포인트
          <br />
          가중치 범위: 1 ~ 10
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <NaverMap
          defaultCenter={SEOUL_CENTER}
          defaultZoom={14}
          style={{ width: "100%", height: "100%" }}
        >
          {visualizationType === "heatmap" && (
            <HeatMap
              data={data}
              radius={radius}
              opacity={opacity}
              colorMap={colorMap}
              colorMapReverse={spectrumReverse}
            />
          )}

          {visualizationType === "dotmap" && (
            <DotMap
              data={data}
              radius={radius}
              opacity={opacity}
              fillColor={fillColor}
              strokeColor={strokeColor}
              strokeWeight={strokeWeight}
            />
          )}
        </NaverMap>
      </div>
    </div>
  );
}
