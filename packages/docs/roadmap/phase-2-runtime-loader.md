# Phase 2: Runtime Loader

## 목적

브라우저 환경에서 안정적인 SDK 로더를 구축합니다.

## 작업 범주

- `ncpKeyId` 우선 로딩
- legacy key 하위호환(`ncpClientId`, `govClientId`, `finClientId`)
- Promise dedupe
- timeout/error 표준화
- SSR-safe 가드

## 완료 기준

- 중복 호출 시 단일 in-flight Promise 재사용
- 인증 실패/타임아웃 에러 처리 일관성 확보
