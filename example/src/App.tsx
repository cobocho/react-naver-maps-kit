import { NaverMapContext, NaverMapProvider } from "react-naver-maps-kit";

import "./App.css";

function App() {
  const ncpClientId = String(import.meta.env.VITE_NCP_CLIENT_ID ?? "").trim();

  return (
    <NaverMapProvider autoLoad={true} ncpClientId={ncpClientId} timeoutMs={10000}>
      <h1>react-naver-maps-kit example</h1>
      <div className="card">
        <NaverMapContext.Consumer>
          {(context) => {
            if (!context) {
              throw new Error(
                "NaverMapContext is not available. Wrap the app with NaverMapProvider."
              );
            }

            const { sdkError, sdkStatus } = context;
            const message =
              sdkStatus === "idle"
                ? "초기 상태입니다."
                : sdkStatus === "loading"
                  ? "Naver Maps SDK 자동 로딩 중..."
                  : sdkStatus === "ready"
                    ? "SDK 로드 완료: window.naver.maps를 사용할 수 있습니다."
                    : (sdkError?.message ?? "알 수 없는 오류로 로드에 실패했습니다.");

            return (
              <>
                <p>
                  ncpClientId: <code>{ncpClientId || "(비어 있음)"}</code>
                </p>
                <p>
                  상태: <strong>{sdkStatus}</strong>
                </p>
                <p>{message}</p>
              </>
            );
          }}
        </NaverMapContext.Consumer>
      </div>
      <p className="read-the-docs">
        앱 시작 시 <code>NaverMapProvider</code>가 SDK를 자동으로 로딩합니다.
      </p>
    </NaverMapProvider>
  );
}

export default App;
