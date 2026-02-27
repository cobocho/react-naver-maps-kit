import { Suspense, useCallback, useState } from "react";
import { NaverMap, useNaverMap } from "react-naver-maps-kit";

import { EventLog } from "../EventLog.tsx";
import { useEventLog } from "../useEventLog.ts";

type BrowserWindow = Window & {
  naver?: unknown;
};

const NAVER_SDK_SCRIPT_SELECTOR =
  'script[data-react-naver-maps-kit="true"], script[src*="oapi.map.naver.com/openapi/v3/maps.js"]';

function resetSdkRuntime(): number {
  const scriptNodes = document.querySelectorAll<HTMLScriptElement>(NAVER_SDK_SCRIPT_SELECTOR);
  scriptNodes.forEach((node) => node.remove());

  const browserWindow = window as BrowserWindow;
  browserWindow.naver = undefined;

  try {
    delete (browserWindow as BrowserWindow & { naver?: unknown }).naver;
  } catch {
    // ignore delete failure
  }

  return scriptNodes.length;
}

export function SuspenseDemo() {
  const { sdkStatus, sdkError, reloadSdk } = useNaverMap();
  const { entries, log, clear } = useEventLog();

  const [_, setResetKey] = useState(0);

  const loadingFallbackStyle = {
    width: "100%",
    height: 500,
    display: "grid",
    placeItems: "center",
    border: "1px dashed #d0d7de",
    background: "#f6f8fa",
    color: "#57606a",
    fontWeight: 600
  } as const;

  const handleRetrySdk = useCallback(() => {
    const removedScriptCount = resetSdkRuntime();
    log(`Removed ${removedScriptCount} SDK script(s). Re-requesting SDK via reloadSdk().`);

    void reloadSdk()
      .then(() => {
        log("reloadSdk resolved.");
      })
      .catch((error) => {
        const message = error instanceof Error ? error.message : String(error);
        log(`reloadSdk rejected: ${message}`);
      })
      .finally(() => {
        setResetKey((prev) => prev + 1);
      });
  }, [log, reloadSdk]);

  return (
    <>
      <h1 className="demo-title">suspense</h1>
      <p className="demo-description">
        <code>NaverMap suspense</code>를 <code>Suspense</code>로 처리하는 기본 예제입니다.
      </p>

      <div className="info-row">
        <span className="info-chip">SDK: {sdkStatus}</span>
        <span className="info-chip">Mode: suspense</span>
        {sdkError && (
          <span className="info-chip" style={{ background: "#ffebee", color: "#d32f2f" }}>
            Error: {sdkError.message}
          </span>
        )}
      </div>

      <div className="controls-panel" style={{ marginBottom: 16 }}>
        <div className="controls-title">SDK Controls</div>
        <div className="btn-group">
          <button className="btn" onClick={handleRetrySdk}>
            SDK 재시도
          </button>
        </div>
      </div>

      <div className="map-container">
        <Suspense fallback={<div style={loadingFallbackStyle}>Suspense로 SDK 로딩 중...</div>}>
          <NaverMap
            suspense={sdkStatus !== "error"}
            defaultCenter={{ lat: 37.5666102, lng: 126.9783881 }}
            defaultZoom={12}
            style={{ width: "100%", height: 500 }}
            fallback={
              <div style={loadingFallbackStyle}>
                {sdkStatus === "error" ? "SDK 로딩 에러가 발생했습니다." : "SDK 로딩 중..."}
              </div>
            }
            onMapReady={() => log("map ready")}
            onMapError={(error) => log(`onMapError: ${error.message}`)}
          />
        </Suspense>
      </div>

      <EventLog entries={entries} onClear={clear} />
    </>
  );
}
