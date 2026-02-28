export class NaverMapSubmoduleConfigurationError extends Error {
  readonly code = "INVALID_SUBMODULE_COMBINATION";
  readonly submodules: string[];

  constructor(submodules: string[]) {
    super('submodules 설정 오류: "gl"은 다른 서브모듈과 함께 사용할 수 없습니다.');
    this.name = "NaverMapSubmoduleConfigurationError";
    this.submodules = submodules;
  }
}

export function throwIfInvalidSubmoduleCombination(submodules?: string[]): void {
  if (!submodules || submodules.length <= 1) {
    return;
  }

  if (submodules.includes("gl")) {
    const error = new NaverMapSubmoduleConfigurationError([...submodules]);
    console.error(`[react-naver-maps-kit] ${error.message} 입력값: [${submodules.join(", ")}]`);
    throw error;
  }
}
