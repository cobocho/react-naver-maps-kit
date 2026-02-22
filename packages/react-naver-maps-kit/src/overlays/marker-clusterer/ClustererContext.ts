import { createContext, useContext } from "react";

import type { ItemRecord } from "./types";

/**
 * `<MarkerClusterer>` 내부에서 `<Marker>`가 사용하는 registry 인터페이스.
 *
 * `enabled`가 `false`이면 `<Marker>`는 직접 `naver.maps.Marker`를 생성합니다.
 *
 * @typeParam TData - `<Marker item={...}>`의 데이터 타입
 */
export interface ClustererRegistry<TData = unknown> {
  /**
   * 클러스터링 활성화 여부.
   * `false`이면 `<Marker>`가 개별 마커로 직접 렌더링됩니다.
   */
  readonly enabled: boolean;

  /**
   * 마커를 registry에 등록합니다.
   *
   * @param item - 등록할 마커 레코드
   */
  register(item: ItemRecord<TData>): void;

  /**
   * 마커를 registry에서 제거합니다.
   *
   * @param id - 제거할 마커의 ID
   */
  unregister(id: string | number): void;
}

/**
 * `<MarkerClusterer>`가 제공하는 registry Context.
 * register/unregister/enabled만 포함하며, enabled가 바뀔 때만 갱신됩니다.
 *
 * @internal
 */
export const ClustererContext = createContext<ClustererRegistry | null>(null);

ClustererContext.displayName = "ClustererContext";

/**
 * `<MarkerClusterer>`가 제공하는 visibility Context.
 * 재계산 시마다 갱신되며, 클러스터링 안 된 마커 ID 집합을 담습니다.
 *
 * `<Marker>`는 이 context를 읽어 자신이 보여야 할지 판단합니다.
 *
 * @internal
 */
export const ClustererVisibilityContext = createContext<ReadonlySet<string | number>>(new Set());

ClustererVisibilityContext.displayName = "ClustererVisibilityContext";

/** @internal */
export function useClustererContext(): ClustererRegistry | null {
  return useContext(ClustererContext);
}
