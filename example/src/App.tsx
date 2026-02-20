import { useState } from "react";

import { loadNaverMapsScript } from "react-naver-maps-kit";

import "./App.css";

function App() {
  const [ncpKeyId, setNcpKeyId] = useState(import.meta.env.VITE_NCP_CLIENT_ID);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("아직 로딩하지 않았습니다.");

  const handleLoad = async () => {
    if (!ncpKeyId.trim()) {
      setStatus("error");
      setMessage("ncpKeyId를 입력해 주세요.");
      return;
    }

    setStatus("loading");
    setMessage("Naver Maps SDK 로딩 중...");

    try {
      await loadNaverMapsScript({
        ncpKeyId: ncpKeyId.trim(),
        timeoutMs: 10000
      });

      setStatus("success");
      setMessage("SDK 로드 완료: window.naver.maps를 사용할 수 있습니다.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "알 수 없는 오류로 로드에 실패했습니다.");
    }
  };

  return (
    <>
      <h1>react-naver-maps-kit example</h1>
      <div className="card">
        <input
          value={ncpKeyId}
          onChange={(event) => setNcpKeyId(event.target.value)}
          placeholder="ncpKeyId를 입력하세요"
          style={{ width: "100%", padding: "0.7rem", marginBottom: "0.8rem" }}
        />
        <button type="button" onClick={handleLoad} disabled={status === "loading"}>
          {status === "loading" ? "로딩 중..." : "loadNaverMapsScript 호출"}
        </button>
        <p style={{ marginTop: "0.8rem" }}>
          상태: <strong>{status}</strong>
        </p>
        <p>{message}</p>
      </div>
      <p className="read-the-docs">
        기본 기준은 <code>ncpKeyId</code>입니다. 필요하면 라이브러리에서 legacy 키도 하위호환
        지원합니다.
      </p>
    </>
  );
}

export default App;
