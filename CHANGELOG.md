# Changelog

## Unreleased

## 1.4.0 (2026-02-28)

### Added
- `NaverMap`에 `suspense` 옵션을 추가해 SDK 로딩을 React `Suspense`/Error Boundary로 위임할 수 있도록 지원했습니다.
- GL 서브모듈 설정 검증을 강화하고 `NaverMapSubmoduleConfigurationError` 및 한글 진단 로그를 추가했습니다.
- Playground에 `Suspense` 데모(SDK 재로딩 컨트롤 포함)와 GL 데모/토글을 추가했습니다.
- Map/Marker/InfoWindow/Panorama/Shape/Data Layer 전반에 대한 Playwright E2E 테스트 시나리오와 전용 테스트 앱 라우트를 확장했습니다.

### Fixed
- Playground 빌드 실패 이슈를 수정했습니다.
- GL 데모의 미사용 코드를 정리해 빌드 오류를 해결했습니다.
- 테스트 코드에서 `window` 전역 캐스팅 타입 오류를 수정하고, `vitest`가 E2E 스펙을 수집하지 않도록 범위를 보정했습니다.

### Changed
- 프로젝트별 `NaverMapProvider` 구성을 분리해 데모/예제 구성을 정리했습니다.
- GL 로딩/폴백 동작을 개선하고 fallback 우선순위 검증을 보강했습니다.

### CI
- 라이브러리/Docs/Playground 빌드 검증과 `vitest` 검증을 CI에 통합했습니다.
- E2E 워크플로우 및 트리거 조건을 정비했습니다.
