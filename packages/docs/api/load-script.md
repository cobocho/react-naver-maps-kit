# loadNaverMapsScript

네이버 지도 SDK를 수동으로 로딩할 때 사용하는 유틸 함수입니다.

## 시그니처

```ts
export interface LoadNaverMapsScriptOptions {
  ncpKeyId?: string;
  ncpClientId?: string;
  govClientId?: string;
  finClientId?: string;
  submodules?: string[];
  timeoutMs?: number;
  nonce?: string;
}

export function loadNaverMapsScript(options: LoadNaverMapsScriptOptions): Promise<void>;
```

## 타입 정의 상세

- `ncpKeyId?: string`
  - 기본 권장 키입니다. 있으면 우선 사용됩니다.
- `ncpClientId?: string`
  - 레거시 호환 키입니다.
- `govClientId?: string`
  - 공공용 레거시 호환 키입니다.
- `finClientId?: string`
  - 금융용 레거시 호환 키입니다.
- `submodules?: string[]`
  - `"geocoder"` 등 서브모듈 목록입니다.
- `timeoutMs?: number`
  - 스크립트 로딩/SDK 준비 대기 타임아웃(ms)입니다. 기본값은 `10000`입니다.
- `nonce?: string`
  - CSP 환경에서 script nonce를 지정합니다.

## 동작 규칙

- 브라우저 전용입니다. SSR 환경에서는 reject 됩니다.
- 같은 URL로 동시에 요청하면 내부에서 in-flight Promise를 재사용해 중복 로드를 막습니다.
- `window.navermap_authFailure`를 연결해 인증 실패를 에러로 전환합니다.
- 이미 같은 SDK script가 DOM에 있으면 해당 스크립트의 load/error를 재사용합니다.
