# Playwright 기반 E2E 테스트 목록

react-naver-maps-kit에서 **Playwright**로 검증하면 좋은 테스트만 정리한 목록입니다.  
`✅` = 구현됨, `⬜` = 추가 권장.

**실제 네이버 지도 API 사용** (mock 없음). API 키가 필요합니다:
- `VITE_NAVER_MAP_NCP_KEY_ID` 또는 `NAVER_MAP_NCP_KEY_ID` 환경 변수
- 또는 `e2e/app/.env.e2e`에 `VITE_NAVER_MAP_NCP_KEY_ID=your_key` 설정 후 `--mode e2e`로 실행

---

## 1. 지도 이벤트 (center / zoom)

| # | 테스트 | 상태 | 비고 |
|---|--------|------|------|
| 1 | ref.setCenter 호출 시 onCenterChanged가 호출된다 | ✅ | 버튼 클릭 → 표시 좌표/호출 횟수 검증 |
| 2 | ref.setZoom 호출 시 onZoomChanged가 호출된다 | ✅ | 버튼 클릭 → 표시 줌/호출 횟수 검증 |
| 3 | 여러 번 setCenter 호출 시 onCenterChanged가 매번 호출된다 | ✅ | 호출 횟수 2회 검증 |
| 4 | 여러 번 setZoom 호출 시 onZoomChanged가 매번 호출된다 | ✅ | 호출 횟수 2회 검증 |

---

## 2. Controlled / Uncontrolled

| # | 테스트 | 상태 | 비고 |
|---|--------|------|------|
| 5 | **Controlled**: 슬라이더/셀렉트로 center 변경 시 지도가 해당 위치로 이동한다 | ⬜ | 부모 state → center prop → 지도 이동 여부 |
| 6 | **Controlled**: zoom prop 변경 시 지도 줌 레벨이 해당 값으로 바뀐다 | ⬜ | 부모 state → zoom prop → 표시/ref.getZoom() |
| 7 | **Uncontrolled**: ref.setCenter 호출 후 ref.getCenter()로 현재 중심을 읽을 수 있다 | ⬜ | 버튼으로 setCenter → getCenter 표시 영역 검증 |
| 8 | **Uncontrolled**: ref.setZoom 호출 후 ref.getZoom()으로 현재 줌을 읽을 수 있다 | ⬜ | 버튼으로 setZoom → getZoom 표시 검증 |

---

## 3. 지도 포인터 이벤트

| # | 테스트 | 상태 | 비고 |
|---|--------|------|------|
| 9 | 지도 클릭 시 onClick이 호출되고 클릭 좌표가 표시된다 | ⬜ | mock에서 click 이벤트 발생 시뮬레이션 필요 |
| 10 | 지도 우클릭 시 onRightClick이 호출된다 | ⬜ | rightclick 이벤트 |
| 11 | onBoundsChanged가 pan/zoom 후 호출된다 | ⬜ | ref.panTo / setZoom 후 bounds 표시 검증 (mock) |
| 12 | 이동/줌 종료 후 onIdle이 호출된다 | ⬜ | 타이밍 이슈 가능, 필요 시 mock에서 idle 발생 |

---

## 4. ref API (프로그래매틱 이동/줌)

| # | 테스트 | 상태 | 비고 |
|---|--------|------|------|
| 13 | ref.panTo 호출 시 지도가 해당 좌표로 이동한다 | ✅ | panTo 후 표시 center 또는 onCenterChanged 검증 |
| 14 | ref.fitBounds 호출 시 뷰가 해당 bounds로 변경된다 | ✅ | fitBounds 후 center 변경 검증 |
| 15 | ref.zoomBy(delta) 호출 시 줌 레벨이 변경된다 | ✅ | zoomBy 후 onZoomChanged 또는 표시 줌 검증 |

---

## 5. 오버레이: Marker

| # | 테스트 | 상태 | 비고 |
|---|--------|------|------|
| 16 | 마커 클릭 시 Marker onClick이 호출된다 | ✅ | 마커 DOM 클릭 → 콜백 호출 횟수/표시 검증 |
| 17 | 마커 클릭 시 연결된 InfoWindow가 열린다 | ✅ | 마커 클릭 → InfoWindow 내용/표시 여부 검증 |
| 18 | ref.setPosition 호출 시 마커 위치가 바뀌고 onPositionChanged가 호출된다 | ✅ | 버튼으로 setPosition → 표시 좌표 검증 |

---

## 6. 오버레이: MarkerClusterer

| # | 테스트 | 상태 | 비고 |
|---|--------|------|------|
| 19 | 클러스터 클릭 시 확장 또는 콜백이 호출된다 | ⬜ | 클러스터 영역 클릭 → 클러스터 해제/콜백 검증 |
| 20 | helpers.zoomToCluster 호출 시 해당 클러스터로 이동/줌된다 | ⬜ | 버튼으로 zoomToCluster → center/zoom 표시 검증 |

---

## 7. 오버레이: InfoWindow

| # | 테스트 | 상태 | 비고 |
|---|--------|------|------|
| 21 | open 호출 시 InfoWindow가 DOM에 표시된다 | ⬜ | open 버튼 → 내용/가시성 검증 |
| 22 | close 호출 시 InfoWindow가 사라진다 | ⬜ | open 후 close → 비표시 검증 |

---

## 8. 로딩 / 에러 (선택)

| # | 테스트 | 상태 | 비고 |
|---|--------|------|------|
| 23 | SDK 로딩 전에는 지도 영역이 로딩 상태(또는 fallback)로 보인다 | ⬜ | mock 지연 시 loading UI 검증 |
| 24 | ncpKeyId 없이 Provider 사용 시 에러 fallback이 보인다 | ⬜ | 에러 메시지 또는 fallback 노출 검증 |

---

## 구현 현황 요약

| 구분 | 개수 |
|------|------|
| 구현됨 (✅) | 4 |
| 추가 권장 (⬜) | 20 |

---

## 실행 방법

1. **API 키 설정** (필수): 네이버 클라우드 플랫폼에서 지도 API 키 발급 후 아래 중 하나로 설정.
   - 셸: `export NAVER_MAP_NCP_KEY_ID=your_key` 또는 `export VITE_NAVER_MAP_NCP_KEY_ID=your_key`
   - 또는 `e2e/app/.env.e2e` 생성 후 `VITE_NAVER_MAP_NCP_KEY_ID=your_key` 입력 (프로젝트에서 `.env.e2e` gitignore 권장)

2. **실행**
```bash
cd packages/react-naver-maps-kit
pnpm run e2e:install   # 최초 1회: Chromium 설치
pnpm run e2e           # 테스트 실행
pnpm run e2e:ui        # UI 모드
```

E2E는 **실제 네이버 지도 API**를 사용합니다. API 키가 없으면 테스트 앱에 안내 메시지가 뜨고, 해당 시나리오는 스킵됩니다.
