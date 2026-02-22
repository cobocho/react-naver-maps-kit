# 핵심 개념

이 페이지에서는 `react-naver-maps-kit`의 핵심 아키텍처와 동작 방식을 설명합니다.

## 아키텍처 개요

```
┌─────────────────────────────────────────────────────────┐
│                    NaverMapProvider                      │
│  ┌─────────────────────────────────────────────────┐    │
│  │              SDK Loading State                    │    │
│  │   idle → loading → ready                         │    │
│  │                  ↘ error                         │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │                  NaverMap                        │    │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐            │    │
│  │  │ Marker  │ │ Circle  │ │ InfoWindow │ ...     │    │
│  │  └─────────┘ └─────────┘ └─────────┘            │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

## Provider 패턴

### 왜 Provider가 필요한가요?

네이버 지도 SDK는 외부 JavaScript 라이브러리입니다. React 앱에서 사용하려면:

1. **SDK 스크립트 로딩** - 동적으로 `<script>` 태그 삽입
2. **로딩 상태 관리** - 언제 SDK가 준비되는지 추적
3. **에러 처리** - 네트워크 오류, 인증 실패 대응
4. **지도 인스턴스 공유** - 여러 컴포넌트에서 동일한 지도 접근

`NaverMapProvider`가 이 모든 것을 한 곳에서 관리합니다.

### 상태 머신

SDK 로딩은 다음 상태를 거칩니다:

```
idle → loading → ready
             ↘ error
```

| 상태      | 설명                             |
| --------- | -------------------------------- |
| `idle`    | 초기 상태 (아직 로딩 시작 안 함) |
| `loading` | SDK 스크립트 로딩 중             |
| `ready`   | SDK 준비 완료, 지도 생성 가능    |
| `error`   | 로딩 실패 또는 인증 오류         |

### Context 값

`useNaverMap()` 훅으로 접근할 수 있는 값:

```tsx
interface NaverMapContextValue {
  sdkStatus: "idle" | "loading" | "ready" | "error";
  sdkError: Error | null;
  map: naver.maps.Map | null;
  reloadSdk: () => Promise<void>;
  retrySdk: () => Promise<void>;
  clearSdkError: () => void;
}
```

## 지도 생명주기

### NaverMap 컴포넌트 동작

```tsx
// 1. 마운트 시
// - SDK 준비 대기 (Provider 상태 확인)
// - naver.maps.Map 인스턴스 생성
// - 이벤트 리스너 등록
// - Provider에 map 인스턴스 등록

// 2. 업데이트 시
// - 변경된 props만 감지
// - 지도 메서드 호출로 업데이트 (setCenter, setZoom 등)

// 3. 언마운트 시
// - 이벤트 리스너 해제
// - map.destroy() 호출
// - Provider에서 map 인스턴스 제거
```

### Controlled vs Uncontrolled

`center`/`defaultCenter`, `zoom`/`defaultZoom`으로 제어 모드를 선택합니다:

```tsx
// Controlled: React 상태로 완전히 제어
const [center, setCenter] = useState({ lat: 37.5, lng: 127.0 });

<NaverMap
  center={center}
  onCenterChanged={setCenter}
/>

// Uncontrolled: 지도 내부 상태 사용
<NaverMap
  defaultCenter={{ lat: 37.5, lng: 127.0 }}
  defaultZoom={12}
/>
```

| Prop            | 동작                                 |
| --------------- | ------------------------------------ |
| `center`        | React 상태로 제어, 변경 시 지도 이동 |
| `defaultCenter` | 초기값만 설정, 이후 지도 내부 상태   |
| `zoom`          | React 상태로 제어                    |
| `defaultZoom`   | 초기값만 설정                        |

## 오버레이 시스템

### 오버레이 컴포넌트 구조

모든 오버레이 컴포넌트는 동일한 패턴을 따릅니다:

```tsx
interface OverlayProps {
  // 1. 지도 옵션
  position?: Coord;
  visible?: boolean;
  zIndex?: number;
  // ...

  // 2. 생명주기 콜백
  onOverlayReady?: (instance) => void;
  onOverlayDestroy?: () => void;

  // 3. 이벤트 핸들러
  onClick?: (event) => void;
  // ...

  // 4. React 특화
  children?: React.ReactNode; // 커스텀 렌더링용
}
```

### 오버레이 Context 연동

오버레이는 `NaverMap` 내부에서만 동작합니다:

```tsx
// ✅ 올바른 사용
<NaverMap>
  <Marker position={...} />
</NaverMap>

// ❌ 잘못된 사용 - Provider 밖에서 직접 사용
<Marker position={...} />  // 에러: map 인스턴스 없음
```

### 생명주기 자동 관리

```tsx
// 이 코드를 직접 작성할 필요가 없습니다
useEffect(() => {
  const marker = new naver.maps.Marker({ position, map });

  // 이벤트 리스너 등록
  const listener = naver.maps.Event.addListener(marker, "click", onClick);

  return () => {
    // 정리
    naver.maps.Event.removeListener(listener);
    marker.setMap(null);
  };
}, [position, onClick]);

// 대신 이렇게 사용하세요
<Marker position={position} onClick={onClick} />;
```

## Hook 사용법

### useNaverMap

Provider 컨텍스트 전체에 접근:

```tsx
function MapController() {
  const { sdkStatus, map, reloadSdk } = useNaverMap();

  // SDK 준비 여부 확인
  if (sdkStatus !== "ready") return null;

  // map 인스턴스 활용
  const handlePanToSeoul = () => {
    map?.panTo(new naver.maps.LatLng(37.5665, 126.978));
  };

  return <button onClick={handlePanToSeoul}>서울로 이동</button>;
}
```

### useNaverMapInstance

지도 인스턴스만 필요할 때:

```tsx
function MapInfo() {
  const map = useNaverMapInstance();

  const zoom = map?.getZoom();
  const center = map?.getCenter();

  return (
    <div>
      줌: {zoom}, 중심: {center?.toString()}
    </div>
  );
}
```

### 안전 가드 옵션

```tsx
// SDK 준비되지 않았으면 에러 throw
const { map } = useNaverMap({ requireReady: true });

// map 인스턴스 없으면 에러 throw
const map = useNaverMapInstance({ requireMapInstance: true });
```

## Ref로 명령형 접근

선언형 API로 해결되지 않는 경우, Ref로 SDK 인스턴스에 직접 접근합니다:

```tsx
function AdvancedMap() {
  const mapRef = useRef<NaverMapRef>(null);
  const markerRef = useRef<MarkerRef>(null);

  // 지도 메서드 호출
  const fitToMarkers = () => {
    const bounds = new naver.maps.LatLngBounds();
    bounds.extend(markerRef.current?.getPosition());
    mapRef.current?.fitBounds(bounds);
  };

  return (
    <>
      <button onClick={fitToMarkers}>마커에 맞추기</button>
      <NaverMap ref={mapRef} ...>
        <Marker ref={markerRef} position={...} />
      </NaverMap>
    </>
  );
}
```

## 모범 사례

### 1. Provider 위치

앱의 최상위에 배치하세요:

```tsx
// ✅ 좋음: 최상위
function App() {
  return (
    <NaverMapProvider ncpKeyId={...}>
      <Router>
        <Routes />
      </Router>
    </NaverMapProvider>
  );
}

// ⚠️ 주의: 페이지마다 Provider를 만들면 SDK 재로딩 발생
```

### 2. 로딩 상태 표시

항상 로딩/에러 상태를 처리하세요:

```tsx
function MapPage() {
  const { sdkStatus, sdkError, reloadSdk } = useNaverMap();

  switch (sdkStatus) {
    case "loading":
      return <LoadingSpinner />;
    case "error":
      return <ErrorDisplay error={sdkError} onRetry={reloadSdk} />;
    default:
      return <NaverMap ... />;
  }
}
```

### 3. 대량 마커 처리

수백 개 이상의 마커는 `MarkerClusterer`를 사용하세요:

```tsx
// ❌ 성능 문제
{
  markers.map((m) => <Marker key={m.id} position={m.pos} />);
}

// ✅ 클러스터링 사용
<MarkerClusterer>
  {markers.map((m) => (
    <Marker key={m.id} clustererItemId={m.id} position={m.pos} />
  ))}
</MarkerClusterer>;
```

### 4. 메모이제이션

불필요한 리렌더링을 방지하세요:

```tsx
// 이벤트 핸들러 메모이제이션
const handleMarkerClick = useCallback((e) => {
  console.log(e.coord);
}, []);

// 좌표 객체 메모이제이션
const center = useMemo(() => ({ lat: 37.5, lng: 127 }), []);

<Marker position={center} onClick={handleMarkerClick} />;
```

## 다음 단계

- [마커 예제](/examples/markers) - 실제 코드로 배우기
- [API Reference](/api/map) - 전체 Props 목록
