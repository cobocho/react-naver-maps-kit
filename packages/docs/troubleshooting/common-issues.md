# 자주 묻는 질문

## 설치 및 설정

### SDK 로딩이 멈춰요 (상태가 `loading`에서 변하지 않음)

**원인**: SDK 스크립트 로딩 실패

**확인 사항**:

1. API 키가 올바른지 확인
2. 현재 도메인이 허용 목록에 등록되어 있는지 확인
3. 브라우저 콘솔에서 네트워크 오류 확인

```tsx
<NaverMapProvider
  ncpKeyId={import.meta.env.VITE_NCP_KEY_ID}
  onError={(error) => console.error("SDK 로딩 실패:", error)}
>
```

**개발 환경 도메인 설정**:

```
http://localhost:5173
http://localhost:3000
http://127.0.0.1:5173
```

### 401 인증 오류가 발생해요

**원인**: API 키 또는 도메인 불일치

**해결 방법**:

1. 네이버 클라우드 플랫폼 콘솔에서 키 타입 확인
2. `ncpKeyId` 사용 권장 (레거시 `ncpClientId` 대신)
3. 도메인에 `http://` 또는 `https://` 프로토콜 포함

### SDK를 다시 로드하고 싶어요

```tsx
function MyComponent() {
  const { reloadSdk } = useNaverMap();

  const handleReload = async () => {
    await reloadSdk();
  };

  return <button onClick={handleReload}>SDK 다시 로드</button>;
}
```

## 지도 표시

### 지도가 화면에 보이지 않아요

**확인 사항**:

1. **높이가 지정되어 있는지 확인**

```tsx
// ❌ 잘못됨 - 높이 없음
<NaverMap center={...} style={{ width: "100%" }} />

// ✅ 올바름 - 높이 지정
<NaverMap center={...} style={{ width: "100%", height: "500px" }} />
```

2. **부모 컨테이너에 높이가 있는지 확인**

```tsx
// 부모에 높이가 있으면 height: 100%도 가능
<div style={{ height: "100vh" }}>
  <NaverMap style={{ width: "100%", height: "100%" }} />
</div>
```

### 지도가 회색으로 표시돼요

**원인**: CSS 충돌 또는 컨테이너 크기 문제

**해결 방법**:

- 지도 컨테이너에 `position: relative` 추가
- 부모 요소의 `overflow: hidden` 제거

## Hook 사용

### "useNaverMap must be used within a NaverMapProvider" 에러

**원인**: Provider 외부에서 Hook 호출

**해결 방법**:

```tsx
// ❌ 잘못됨
function MyComponent() {
  const { map } = useNaverMap(); // Provider 밖
  return <div>...</div>;
}

function App() {
  return <MyComponent />; // Provider로 감싸지 않음
}

// ✅ 올바름
function App() {
  return (
    <NaverMapProvider>
      <MyComponent />
    </NaverMapProvider>
  );
}
```

### map이 null이에요

**원인**: SDK가 아직 준비되지 않음

**해결 방법**:

```tsx
function MyComponent() {
  const { sdkStatus, map } = useNaverMap();

  // SDK 준비 여부 확인
  if (sdkStatus !== "ready") {
    return <div>로딩 중...</div>;
  }

  // map 사용
  return <div>준비 완료!</div>;
}
```

## 마커 및 오버레이

### 마커가 표시되지 않아요

**확인 사항**:

1. **NaverMap 내부에 있는지 확인**

```tsx
// ❌ 잘못됨
<NaverMap />
<Marker position={...} />  // 지도 밖

// ✅ 올바름
<NaverMap>
  <Marker position={...} />
</NaverMap>
```

2. **좌표가 올바른지 확인**

```tsx
// 한국 좌표 범위
// 위도: 33 ~ 39
// 경도: 124 ~ 132
<Marker position={{ lat: 37.5, lng: 127.0 }} />
```

3. **visible prop 확인**

```tsx
<Marker position={...} visible={true} />
```

### 커스텀 마커가 잘려요

**원인**: anchor 포인트 미설정

**해결 방법**:

```tsx
<Marker
  position={...}
  icon={{
    content: '<div style="width:40px;height:40px">📍</div>',
    anchor: new naver.maps.Point(20, 40),  // 하단 중앙
  }}
/>
```

### InfoWindow가 닫히지 않아요

```tsx
function MyComponent() {
  const infoRef = useRef<InfoWindowRef>(null);

  const closeInfo = () => {
    infoRef.current?.close();
  };

  return (
    <InfoWindow ref={infoRef} visible>
      <button onClick={closeInfo}>닫기</button>
    </InfoWindow>
  );
}
```

## 클러스터링

### MarkerClusterer가 작동하지 않아요

**확인 사항**:

1. **clustererItemId가 있는지 확인** (필수!)

```tsx
<MarkerClusterer>
  {markers.map((m) => (
    <Marker
      key={m.id}
      clustererItemId={m.id} // ← 필수!
      position={m.position}
    />
  ))}
</MarkerClusterer>
```

2. **NaverMap 내부에 있는지 확인**

```tsx
<NaverMap>
  <MarkerClusterer>...</MarkerClusterer>
</NaverMap>
```

### 클러스터 아이콘이 깨져요

**원인**: CSS 스타일 충돌

**해결 방법**:

```tsx
<MarkerClusterer
  clusterIcon={({ count }) => (
    <div
      style={{
        width: 50,
        height: 50,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // box-sizing 명시
        boxSizing: "border-box",
      }}
    >
      {count}
    </div>
  )}
>
```

## TypeScript

### "Cannot find namespace 'naver'" 에러

**원인**: 네이버 지도 타입 정의 없음

**해결 방법**:

```bash
pnpm add -D @types/naver-maps
```

또는 `global.d.ts`에 추가:

```ts
declare namespace naver {
  namespace maps {
    // ...
  }
}
```

### Props 타입 에러

```tsx
import type { NaverMapProps, MarkerProps, NaverMapRef, MarkerRef } from "react-naver-maps-kit";

const mapRef = useRef<NaverMapRef>(null);
const markerProps: MarkerProps = {
  position: { lat: 37.5, lng: 127.0 }
};
```

## 성능

### 마커가 많을 때 느려요

**해결 방법**:

1. **MarkerClusterer 사용**

```tsx
<MarkerClusterer>
  {markers.map(...)}
</MarkerClusterer>
```

2. **마커 메모이제이션**

```tsx
const markerElements = useMemo(
  () => markers.map((m) => <Marker key={m.id} position={m.position} />),
  [markers]
);
```

3. **불필요한 리렌더링 방지**

```tsx
const handleMarkerClick = useCallback((e) => {
  console.log(e.coord);
}, []); // 의존성 최소화
```

### 메모리 누수가 발생해요

**확인 사항**:

- 컴포넌트 언마운트 시 이벤트 리스너 자동 해제됨
- Ref로 저장한 인스턴스는 직접 정리 필요 없음
- `MarkerClusterer`는 언마운트 시 자동 정리됨

## 기타

### Next.js에서 사용할 때 에러가 나요

**원인**: SSR에서 window 객체 접근

**해결 방법**:

```tsx
// dynamic import 사용
import dynamic from "next/dynamic";

const NaverMap = dynamic(() => import("react-naver-maps-kit").then((mod) => mod.NaverMap), {
  ssr: false
});
```

### 환경 변수가 인식되지 않아요

**Vite**:

```env
VITE_NCP_KEY_ID=your-key
```

```tsx
ncpKeyId={import.meta.env.VITE_NCP_KEY_ID}
```

**Create React App**:

```env
REACT_APP_NCP_KEY_ID=your-key
```

```tsx
ncpKeyId={process.env.REACT_APP_NCP_KEY_ID}
```

**Next.js**:

```env
NEXT_PUBLIC_NCP_KEY_ID=your-key
```

```tsx
ncpKeyId={process.env.NEXT_PUBLIC_NCP_KEY_ID}
```

## 문제가 해결되지 않으세요?

[GitHub Issues](https://github.com/cobocho/react-naver-maps-kit/issues)에 문제를 등록해 주세요. 다음 정보를 포함하면 빠른 해결에 도움이 됩니다:

- 사용 중인 버전 (`react-naver-maps-kit`, `react`)
- 브라우저 및 버전
- 재현 가능한 최소 예제
- 콘솔 에러 메시지
