import { createContext, useContext } from "react";

import type { ItemRecord } from "./types";

/**
 * `<MarkerClusterer>` 내부에서 `<Marker>`가 사용하는 registry 인터페이스.
 *
 * `<Marker>`는 이 인터페이스를 통해 클러스터러에 자신의 위치·데이터를 등록하고,
 * 언마운트 시 등록을 해제합니다.
 *
 * `enabled`가 `false`이면 `<Marker>`는 registry 대신 직접 `naver.maps.Marker`를 생성합니다.
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
   * 등록 후 클러스터러가 다음 재계산 사이클에서 이 마커를 처리합니다.
   *
   * @param item - 등록할 마커 레코드
   */
  register(item: ItemRecord<TData>): void;

  /**
   * 마커를 registry에서 제거합니다.
   * `<Marker>` 언마운트 시 자동으로 호출됩니다.
   *
   * @param id - 제거할 마커의 ID
   */
  unregister(id: string | number): void;
}

/**
 * `<MarkerClusterer>`가 제공하는 React Context.
 *
 * `<Marker>`는 이 context를 통해 클러스터러에 자신을 등록합니다.
 * `null`이면 클러스터러 밖에 있는 것이므로 일반 마커로 동작합니다.
 *
 * @internal 라이브러리 내부 전용. 직접 사용하지 마세요.
 */
export const ClustererContext = createContext<ClustererRegistry | null>(null);

ClustererContext.displayName = "ClustererContext";

/**
 * `<MarkerClusterer>` context를 읽는 hook.
 *
 * `<MarkerClusterer>` 내부에서만 non-null 값을 반환합니다.
 * 외부에서 호출하면 `null`을 반환합니다.
 *
 * @returns registry 인스턴스 또는 `null`
 *
 * @internal 라이브러리 내부 전용.
 */
export function useClustererContext(): ClustererRegistry | null {
  return useContext(ClustererContext);
}
