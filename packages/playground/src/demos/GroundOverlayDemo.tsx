export function GroundOverlayDemo() {
  return (
    <>
      <h1 className="demo-title">GroundOverlay</h1>
      <p className="demo-description">
        GroundOverlay는 이미지 URL과 bounds를 받아 지도 위에 이미지를 렌더링합니다.
        <br />
        외부 이미지 URL이 필요하므로 이 데모에서는 사용 방법만 안내합니다.
      </p>

      <div className="controls-panel">
        <div className="controls-title">Usage</div>
        <pre style={{ fontSize: 12, lineHeight: 1.6, overflow: "auto", padding: 12, background: "#f8f8fa", borderRadius: 8 }}>
{`import { GroundOverlay, NaverMap } from "react-naver-maps-kit";

<NaverMap defaultCenter={{ lat: 37.566, lng: 126.978 }} defaultZoom={14}>
  <GroundOverlay
    url="https://example.com/overlay-image.png"
    bounds={{
      south: 37.560,
      north: 37.572,
      west: 126.970,
      east: 126.986,
    }}
    opacity={0.7}
    clickable
    onClick={() => console.log("ground overlay clicked")}
  />
</NaverMap>`}
        </pre>

        <div style={{ marginTop: 16 }}>
          <div className="controls-title">Props</div>
          <table style={{ fontSize: 12, borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e2e2e5" }}>
                <th style={{ textAlign: "left", padding: "6px 8px" }}>Prop</th>
                <th style={{ textAlign: "left", padding: "6px 8px" }}>Type</th>
                <th style={{ textAlign: "left", padding: "6px 8px" }}>Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["url", "string", "오버레이 이미지 URL (필수)"],
                ["bounds", "BoundsLiteral", "이미지가 표시될 영역 (필수)"],
                ["opacity", "number", "투명도 (0~1)"],
                ["clickable", "boolean", "클릭 가능 여부"],
                ["onClick", "(e) => void", "클릭 이벤트"],
              ].map(([prop, type, desc]) => (
                <tr key={prop} style={{ borderBottom: "1px solid #f0f0f2" }}>
                  <td style={{ padding: "6px 8px", fontWeight: 600 }}>{prop}</td>
                  <td style={{ padding: "6px 8px", color: "#6e6e73" }}>{type}</td>
                  <td style={{ padding: "6px 8px" }}>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
