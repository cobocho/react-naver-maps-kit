# Changelog

## Unreleased (2026-02-26)

### Fixed
- `InfoWindow`에서 `visible/anchor/position` 제어 시 불필요한 재오픈과 상태 루프를 줄이도록 동기화 로직을 분리했습니다.
- `Panorama`의 controlled `visible` 동기화가 `setOptions` 경로에만 의존하지 않도록 보완했습니다.
