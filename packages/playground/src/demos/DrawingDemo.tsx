import { withDemoNaverMapProvider } from "./withDemoNaverMapProvider.tsx";
import { useRef, useState, useMemo } from "react";
import { NaverMap, DrawingManager, type DrawingManagerRef } from "react-naver-maps-kit";

const SEOUL_CENTER = { lat: 37.5666, lng: 126.9784 };

function DrawingManagerContent({
  drawingManagerRef,
  updateDrawingsList,
  setSelectedId
}: {
  drawingManagerRef: React.RefObject<DrawingManagerRef | null>;
  updateDrawingsList: () => void;
  setSelectedId: (id: string | null) => void;
}) {
  const drawingControl = useMemo(
    () => [
      naver.maps.drawing.DrawingMode.RECTANGLE,
      naver.maps.drawing.DrawingMode.ELLIPSE,
      naver.maps.drawing.DrawingMode.POLYLINE,
      naver.maps.drawing.DrawingMode.ARROWLINE,
      naver.maps.drawing.DrawingMode.POLYGON,
      naver.maps.drawing.DrawingMode.MARKER
    ],
    []
  );

  const drawingControlOptions = useMemo(
    () => ({
      position: naver.maps.Position.TOP_CENTER,
      style: naver.maps.drawing.DrawingStyle.HORIZONTAL
    }),
    []
  );

  return (
    <DrawingManager
      ref={drawingManagerRef}
      drawingControl={drawingControl}
      drawingControlOptions={drawingControlOptions}
      rectangleOptions={{
        fillColor: "#ff0000",
        fillOpacity: 0.3,
        strokeWeight: 2,
        strokeColor: "#ff0000"
      }}
      ellipseOptions={{
        fillColor: "#00ff00",
        fillOpacity: 0.3,
        strokeWeight: 2,
        strokeColor: "#00ff00"
      }}
      polylineOptions={{
        strokeColor: "#0000ff",
        strokeWeight: 3
      }}
      arrowlineOptions={{
        strokeColor: "#ff00ff",
        strokeWeight: 3
      }}
      polygonOptions={{
        fillColor: "#ffff00",
        fillOpacity: 0.3,
        strokeWeight: 2,
        strokeColor: "#ffd100"
      }}
      onDrawingAdded={(overlay) => {
        console.log("Drawing added:", overlay);
        updateDrawingsList();
      }}
      onDrawingRemoved={(overlay) => {
        console.log("Drawing removed:", overlay);
        updateDrawingsList();
      }}
      onDrawingSelect={(overlay) => {
        console.log("Drawing selected:", overlay);
        setSelectedId((overlay as { id?: string }).id ?? null);
      }}
      onDrawingManagerReady={(manager) => {
        console.log("DrawingManager ready:", manager);
      }}
    />
  );
}

function DrawingDemoBase() {
  const drawingManagerRef = useRef<DrawingManagerRef>(null);
  const [drawings, setDrawings] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [geoJson, setGeoJson] = useState<string>("");

  const updateDrawingsList = () => {
    const manager = drawingManagerRef.current;
    if (!manager) return;
    const drawingsObj = manager.getDrawings();
    setDrawings(Object.keys(drawingsObj));
  };

  const handleExportGeoJson = () => {
    const manager = drawingManagerRef.current;
    if (!manager) return;
    const json = manager.toGeoJson();
    setGeoJson(JSON.stringify(json, null, 2));
  };

  const handleRemoveSelected = () => {
    if (!selectedId) return;
    const manager = drawingManagerRef.current;
    if (!manager) return;
    manager.removeDrawing(selectedId);
    setSelectedId(null);
    updateDrawingsList();
  };

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
        <h2 style={{ margin: "0 0 16px" }}>Drawing Demo</h2>

        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
            지도 위의 그리기 도구를 사용하여 도형을 그려보세요.
            <br />
            왼쪽 클릭으로 편집, 오른쪽 클릭으로 삭제할 수 있습니다.
          </p>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
            그려진 도형 ({drawings.length}개)
          </label>
          <div
            style={{
              maxHeight: 150,
              overflowY: "auto",
              border: "1px solid #ddd",
              borderRadius: 4,
              background: "#fff"
            }}
          >
            {drawings.length === 0 ? (
              <div style={{ padding: 12, color: "#999", fontSize: 13 }}>
                그려진 도형이 없습니다.
              </div>
            ) : (
              drawings.map((id) => (
                <div
                  key={id}
                  onClick={() => setSelectedId(id)}
                  style={{
                    padding: "8px 12px",
                    cursor: "pointer",
                    background: selectedId === id ? "#e3f2fd" : "transparent",
                    borderBottom: "1px solid #eee",
                    fontSize: 13
                  }}
                >
                  {id}
                </div>
              ))
            )}
          </div>
        </div>

        <div style={{ marginBottom: 16, display: "flex", gap: 8 }}>
          <button
            onClick={handleRemoveSelected}
            disabled={!selectedId}
            style={{
              flex: 1,
              padding: "8px 16px",
              border: "1px solid #ccc",
              borderRadius: 4,
              cursor: selectedId ? "pointer" : "not-allowed",
              background: selectedId ? "#fff" : "#f5f5f5"
            }}
          >
            선택 삭제
          </button>
          <button
            onClick={handleExportGeoJson}
            style={{
              flex: 1,
              padding: "8px 16px",
              border: "1px solid #ccc",
              borderRadius: 4,
              cursor: "pointer",
              background: "#fff"
            }}
          >
            GeoJSON 내보내기
          </button>
        </div>

        {geoJson && (
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
              GeoJSON 결과
            </label>
            <textarea
              readOnly
              value={geoJson}
              style={{
                width: "100%",
                height: 200,
                fontFamily: "monospace",
                fontSize: 11,
                padding: 8,
                borderRadius: 4,
                border: "1px solid #ddd",
                resize: "vertical"
              }}
            />
          </div>
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
          <strong>사용 가능한 도구</strong>
          <br />
          - 사각형 (Rectangle)
          <br />
          - 타원 (Ellipse)
          <br />
          - 폴리라인 (Polyline)
          <br />
          - 화살표 (Arrowline)
          <br />
          - 폴리곤 (Polygon)
          <br />- 마커 (Marker)
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <NaverMap
          defaultCenter={SEOUL_CENTER}
          defaultZoom={14}
          style={{ width: "100%", height: "100%" }}
        >
          <DrawingManagerContent
            drawingManagerRef={drawingManagerRef}
            updateDrawingsList={updateDrawingsList}
            setSelectedId={setSelectedId}
          />
        </NaverMap>
      </div>
    </div>
  );
}

export const DrawingDemo = withDemoNaverMapProvider(DrawingDemoBase);
