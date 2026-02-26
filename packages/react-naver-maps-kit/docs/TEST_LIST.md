# react-naver-maps-kit 테스트 목록

라이브러리에서 의미 있게 커버하면 좋은 테스트를 정리한 목록입니다.  
`✅` = 이미 있음, `⬜` = 추가 권장.

---

## 1. NaverMap (핵심)

### 1.1 Provider / 컨텍스트
| 테스트 | 유형 | 비고 |
|--------|------|------|
| ✅ NaverMap은 NaverMapProvider 밖에서 사용 시 에러 | Vitest | 현재 구현됨 |
| ✅ Provider + Map + useNaverMap으로 map 인스턴스 제공 | Vitest | |
| ⬜ NaverMap만 단독 사용 시 "must be used inside NaverMapProvider" 에러 메시지 검증 | Vitest | 에러 메시지 일치 |

### 1.2 인스턴스 / 라이프사이클
| 테스트 | 유형 | 비고 |
|--------|------|------|
| ✅ 옵션 변경 시 map 인스턴스 재생성 없이 setZoom/setOptions만 호출 | Vitest | |
| ✅ 언마운트 시 이벤트 리스너 해제, clearInstanceListeners 호출 | Vitest | |
| ⬜ onMapReady 콜백이 지도 생성 후 한 번 호출되는지 | Vitest | |
| ⬜ onMapDestroy가 언마운트 시 호출되는지 | Vitest | |
| ⬜ ref.getCenter() / getZoom()이 현재 값 반환하는지 | Vitest | mock에서 setCenter 후 getCenter 검증 |

### 1.3 Controlled / Uncontrolled
| 테스트 | 유형 | 비고 |
|--------|------|------|
| ✅ center/zoom prop 변경 시 setCenter/setZoom 호출 (인스턴스 유지) | Vitest | |
| ⬜ **Controlled**: center prop만 넘긴 경우, center 변경 시 setCenter 호출, zoom은 내부 유지 | Vitest | |
| ⬜ **Controlled**: zoom prop만 넘긴 경우, zoom 변경 시 setZoom 호출, center는 내부 유지 | Vitest | |
| ⬜ **Uncontrolled**: defaultCenter/defaultZoom만 넘긴 경우, 다른 옵션 변경 시 기존 center/zoom 복원 | Vitest | (NaverMap.tsx 옵션 동기화 effect) |
| ⬜ **E2E**: controlled 모드에서 부모 state 변경 시 지도 center/zoom이 prop과 동기화되는지 | Playwright | 버튼으로 state 변경 → DOM/표시값 검증 |

### 1.4 이벤트
| 테스트 | 유형 | 비고 |
|--------|------|------|
| ✅ ref.setCenter 호출 시 onCenterChanged 호출 | Playwright | |
| ✅ ref.setZoom 호출 시 onZoomChanged 호출 | Playwright | |
| ✅ 여러 번 setCenter/setZoom 시 콜백 매번 호출 | Playwright | |
| ⬜ onBoundsChanged가 bounds 변경 시 호출되는지 | Vitest 또는 Playwright | mock에서 panTo 등 후 검증 |
| ⬜ onIdle이 이동/줌 종료 후 호출되는지 | Playwright | 타이밍 이슈 있을 수 있음 |
| ⬜ onClick / onRightClick 등 포인터 이벤트가 DOM 클릭과 연결되는지 | Playwright | mock map에서 click 이벤트 발생 시뮬레이션 |

### 1.5 ref API
| 테스트 | 유형 | 비고 |
|--------|------|------|
| ⬜ ref.panTo 호출 시 지도 이동 | Vitest (mock) | |
| ⬜ ref.fitBounds 호출 시 해당 bounds로 뷰 변경 | Vitest (mock) | |
| ⬜ ref.zoomBy(delta) 호출 시 줌 레벨 변경 | Vitest (mock) | |

---

## 2. NaverMapProvider / 스크립트 로더

### 2.1 loadNaverMapsScript (단위)
| 테스트 | 유형 | 비고 |
|--------|------|------|
| ⬜ window.naver.maps가 이미 있으면 스크립트 요청 없이 즉시 resolve | Vitest | isNaverMapsReady true 시 Promise.resolve |
| ⬜ ncpKeyId 없이 호출 시 에러 (getClientKey throw) | Vitest | |
| ⬜ submodules 지정 시 해당 키가 maps에 있을 때만 ready | Vitest | isNaverMapsReady + submodules |
| ⬜ createScriptUrl이 ncpKeyId 기준으로 올바른 쿼리 생성 | Vitest | |
| ⬜ timeout 초과 시 reject | Vitest | waitForNaverMapsReady mock |

### 2.2 Provider 통합
| 테스트 | 유형 | 비고 |
|--------|------|------|
| ⬜ autoLoad=false면 초기에는 loading, 스크립트 로드 안 함 | Vitest | |
| ⬜ reloadSdk 호출 시 loading → ready/error 전환 | Vitest | |
| ⬜ 인증 실패 시 sdkStatus 'error', onError 호출 | Vitest | navermap_authFailure 시뮬레이션 |

---

## 3. useNaverMap / useNaverMapInstance

| 테스트 | 유형 | 비고 |
|--------|------|------|
| ✅ Provider 밖에서 useNaverMap 호출 시 에러 | Vitest | |
| ⬜ requireReady: true 이고 sdkStatus !== 'ready'일 때 에러 | Vitest | |
| ⬜ requireMapInstance: true 이고 map이 null일 때 에러 | Vitest | |
| ⬜ useNaverMapInstance()가 context.map 반환하는지 | Vitest | |

---

## 4. MapInstanceContext

| 테스트 | 유형 | 비고 |
|--------|------|------|
| ⬜ NaverMap 자식에서 useMapInstance()가 map 인스턴스 반환 | Vitest | |
| ⬜ useMapInstanceRequired()가 map 없을 때 에러 | Vitest | |
| ⬜ 지도 밖(Provider만 있는 곳)에서 useMapInstance()는 null | Vitest | |

---

## 5. 오버레이: Marker

| 테스트 | 유형 | 비고 |
|--------|------|------|
| ⬜ position prop으로 마커 생성, map에 추가 | Vitest | mock Map + Marker 인스턴스 |
| ⬜ position 변경 시 마커 위치만 업데이트 (인스턴스 유지) | Vitest | |
| ⬜ onClick 핸들러가 naver.maps 이벤트와 연결되는지 | Vitest | Event.addListener 호출 검증 |
| ⬜ ref.getPosition() / setPosition() 동작 | Vitest | |
| ⬜ MarkerClusterer 자식으로 넣었을 때 clustererItemId로 등록되는지 | Vitest | ClustererContext 연동 |

---

## 6. 오버레이: MarkerClusterer

| 테스트 | 유형 | 비고 |
|--------|------|------|
| ⬜ 자식 Marker들이 클러스터링 알고리즘에 등록됨 | Vitest | |
| ⬜ 지도 bounds/zoom 변경 시 클러스터 재계산 (recomputeOn) | Vitest | |
| ⬜ helpers.zoomToCluster 호출 시 해당 클러스터로 이동/줌 | Vitest 또는 Playwright | |
| ⬜ 클러스터 클릭 시 클러스터 확장 또는 콜백 호출 | Playwright | E2E에서 클릭 검증 |

---

## 7. 오버레이: InfoWindow

| 테스트 | 유형 | 비고 |
|--------|------|------|
| ⬜ anchor(마커 등)에 붙어 열림 | Vitest | |
| ⬜ open/close 제어 시 DOM 표시 여부 | Vitest 또는 Playwright | |

---

## 8. 오버레이: Circle / Polygon / Polyline / Rectangle

| 테스트 | 유형 | 비고 |
|--------|------|------|
| ⬜ center + radius (Circle) 또는 path (Polygon 등)로 오버레이 생성 | Vitest | |
| ⬜ prop 변경 시 setOptions 또는 해당 setter만 호출 (재생성 없음) | Vitest | |

---

## 9. 서브모듈 (Panorama, Visualization, Drawing)

| 테스트 | 유형 | 비고 |
|--------|------|------|
| ⬜ submodules에 panorama 없을 때 Panorama 사용 시 에러 메시지 | Vitest | |
| ⬜ submodules에 visualization 없을 때 HeatMap/DotMap 사용 시 에러 메시지 | Vitest | |
| ⬜ DrawingManager가 submodules 'drawing' 없을 때 에러 메시지 | Vitest | |

---

## 10. E2E (Playwright) – 사용자 시나리오

| 테스트 | 비고 |
|--------|------|
| ✅ 지도 이동(버튼) → onCenterChanged 호출, 표시 좌표 갱신 | 구현됨 |
| ✅ 줌 변경(버튼) → onZoomChanged 호출, 표시 줌 갱신 | 구현됨 |
| ⬜ 지도 클릭 → onClick 호출, 클릭 좌표 표시 | |
| ⬜ 마커 클릭 → Marker onClick 또는 InfoWindow 열림 | |
| ⬜ Controlled: 슬라이더/셀렉트로 center 변경 시 지도가 해당 위치로 이동 | |
| ⬜ Uncontrolled: 지도 드래그 후 ref.getCenter()로 현재 중심 확인 | (mock에서 드래그 시뮬 가능 시) |

---

## 우선순위 제안

1. **높음**: NaverMap controlled/uncontrolled 동작, 이벤트(onCenterChanged/onZoomChanged) – 일부 완료.
2. **높음**: Provider/로더 – `window.naver.maps` 이미 있을 때 스크립트 생략, 키/타임아웃 에러.
3. **중간**: useNaverMap / useMapInstance 옵션(requireReady, requireMapInstance) 에러 케이스.
4. **중간**: Marker position/이벤트, MarkerClusterer 등록·helpers.
5. **낮음**: 서브모듈 에러 메시지, Circle/Polygon 등 옵션 동기화.

이 목록을 기준으로 Vitest/Playwright 테스트를 단계적으로 추가하면 라이브러리 품질과 리그레션 방지에 도움이 됩니다.
