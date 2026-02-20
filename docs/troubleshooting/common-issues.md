# 문제 해결

## 1. SDK 상태가 `loading`에서 멈추는 경우

확인 항목:

- 키가 유효한지 (`ncpKeyId` 권장)
- 현재 개발 URL이 허용 도메인에 등록되어 있는지
- 로컬 패키지 갱신 후 Vite 캐시를 비웠는지

```bash
rm -rf example/node_modules/.vite
pnpm --dir example dev --force
```

## 2. 네이버 인증 엔드포인트에서 401이 발생하는 경우

대부분 키/도메인 불일치 문제입니다.

- NCP 콘솔에서 키 타입 확인
- 필요 시 `http://localhost:5173`, `http://127.0.0.1:5173` 모두 허용 도메인에 등록

## 3. Hook 사용 시 Provider 관련 에러가 나는 경우

`useNaverMap`과 `useNaverMapInstance`는 반드시 `NaverMapProvider` 하위에서 호출해야 합니다.
