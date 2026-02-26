import { expect, test } from "@playwright/test";

const MAP_LOAD_TIMEOUT = 20_000;

type CenterLiteral = {
  lat: number;
  lng: number;
};

function parseJson<T>(text: string | null): T {
  if (!text) {
    throw new Error("Expected JSON text but received empty value");
  }

  return JSON.parse(text) as T;
}

/* ─── 1. smoke ─── */

test.describe("1. Smoke", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/marker-clusterer/smoke");
    await expect(page.getByTestId("map-container")).toBeVisible({ timeout: MAP_LOAD_TIMEOUT });
    await expect(page.getByTestId("map-ready")).toHaveText("true", { timeout: MAP_LOAD_TIMEOUT });
  });

  test("MC-01: 클러스터 아이콘이 렌더링되고 count를 표시한다", async ({ page }) => {
    await expect(page.getByTestId("smoke-cluster-icon")).toBeVisible();
    await expect(page.getByTestId("smoke-cluster-icon")).toHaveText("5");
  });

  test("MC-02: 클러스터 클릭 시 onClusterClick이 호출된다", async ({ page }) => {
    await page.getByTestId("smoke-cluster-icon").click();

    await expect(page.getByTestId("cluster-click-count")).toHaveText("1");
    await expect(page.getByTestId("last-cluster-count")).toHaveText("5");
  });
});

/* ─── 2. enabled ─── */

test.describe("2. enabled", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/marker-clusterer/enabled");
    await expect(page.getByTestId("map-container")).toBeVisible({ timeout: MAP_LOAD_TIMEOUT });
    await expect(page.getByTestId("map-ready")).toHaveText("true", { timeout: MAP_LOAD_TIMEOUT });
  });

  test("MC-03: enabled=true면 클러스터 아이콘이 보이고 개별 포인트는 숨겨진다", async ({
    page
  }) => {
    await expect(page.getByTestId("enabled-state")).toHaveText("true");
    await expect(page.getByTestId("enabled-cluster-icon")).toBeVisible();

    await expect.poll(async () => page.getByTestId("point-marker-s1").isVisible()).toBe(false);
  });

  test("MC-04: enabled=false면 클러스터가 사라지고 개별 포인트가 표시된다", async ({ page }) => {
    await page.getByTestId("toggle-enabled").click();

    await expect(page.getByTestId("enabled-state")).toHaveText("false");
    await expect.poll(async () => page.getByTestId("enabled-cluster-icon").isVisible()).toBe(false);
    await expect(page.getByTestId("point-marker-s1")).toBeVisible();
    await expect(page.getByTestId("point-marker-s2")).toBeVisible();
    await expect(page.getByTestId("point-marker-s3")).toBeVisible();
  });

  test("MC-05: enabled를 다시 true로 바꾸면 클러스터링이 재적용된다", async ({ page }) => {
    await page.getByTestId("toggle-enabled").click();
    await page.getByTestId("toggle-enabled").click();

    await expect(page.getByTestId("enabled-state")).toHaveText("true");
    await expect(page.getByTestId("enabled-cluster-icon")).toBeVisible();
    await expect.poll(async () => page.getByTestId("point-marker-s1").isVisible()).toBe(false);
  });
});

/* ─── 3. clusterData ─── */

test.describe("3. clusterData", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/marker-clusterer/cluster-data");
    await expect(page.getByTestId("map-container")).toBeVisible({ timeout: MAP_LOAD_TIMEOUT });
    await expect(page.getByTestId("map-ready")).toHaveText("true", { timeout: MAP_LOAD_TIMEOUT });
    await expect(page.getByTestId("cluster-data-icon")).toBeVisible();
  });

  test("MC-06: includeItems=true이면 cluster.items가 포함된다", async ({ page }) => {
    await expect(page.getByTestId("include-items-state")).toHaveText("true");
    await expect(page.getByTestId("cluster-data-items-length")).toHaveText("5");
  });

  test("MC-07: includeItems=false이면 cluster.items가 비워진다", async ({ page }) => {
    await page.getByTestId("set-include-items-false").click();

    await expect(page.getByTestId("include-items-state")).toHaveText("false");
    await expect(page.getByTestId("cluster-data-items-length")).toHaveText("0");

    await page.getByTestId("cluster-data-icon").click();
    await expect(page.getByTestId("clicked-items-length")).toHaveText("0");
  });

  test("MC-08: maxItemsInCluster=2면 cluster.items 길이가 제한된다", async ({ page }) => {
    await page.getByTestId("set-max-items-2").click();

    await expect(page.getByTestId("max-items-state")).toHaveText("2");
    await expect(page.getByTestId("cluster-data-items-length")).toHaveText("2");

    await page.getByTestId("cluster-data-icon").click();
    await expect(page.getByTestId("clicked-items-length")).toHaveText("2");
  });

  test("MC-09: maxItemsInCluster 해제 시 전체 아이템이 복원된다", async ({ page }) => {
    await page.getByTestId("set-max-items-2").click();
    await page.getByTestId("clear-max-items").click();

    await expect(page.getByTestId("max-items-state")).toHaveText("");
    await expect(page.getByTestId("cluster-data-items-length")).toHaveText("5");
  });

  test("MC-10: 클러스터 클릭 시 카운트가 증가한다", async ({ page }) => {
    const before = Number(await page.getByTestId("cluster-click-count").textContent());

    await page.getByTestId("cluster-data-icon").click();

    await expect
      .poll(async () => Number(await page.getByTestId("cluster-click-count").textContent()))
      .toBeGreaterThan(before);
  });
});

/* ─── 4. helpers ─── */

test.describe("4. helpers", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/marker-clusterer/helpers");
    await expect(page.getByTestId("map-container")).toBeVisible({ timeout: MAP_LOAD_TIMEOUT });
    await expect(page.getByTestId("map-ready")).toHaveText("true", { timeout: MAP_LOAD_TIMEOUT });
    await expect(page.getByTestId("helpers-cluster-icon")).toBeVisible();
  });

  test("MC-11: zoomToCluster helper 호출 시 center가 이동하고 zoom이 제한된다", async ({
    page
  }) => {
    await page.getByTestId("reset-map").click();
    await page.getByTestId("read-map-state").click();

    const beforeZoom = Number(await page.getByTestId("map-zoom").textContent());
    const beforeClickCount = Number(await page.getByTestId("cluster-click-count").textContent());

    await page.getByTestId("mode-zoom").click();
    await page.getByTestId("helpers-cluster-icon").click();

    await expect
      .poll(async () => Number(await page.getByTestId("cluster-click-count").textContent()))
      .toBeGreaterThan(beforeClickCount);

    await expect
      .poll(async () => {
        await page.getByTestId("read-map-state").click();
        return Number(await page.getByTestId("map-zoom").textContent());
      })
      .toBeGreaterThan(beforeZoom);

    const afterZoom = Number(await page.getByTestId("map-zoom").textContent());
    expect(afterZoom).toBeLessThanOrEqual(14);
  });

  test("MC-12: fitBounds helper 호출 시 center가 이동한다", async ({ page }) => {
    await page.getByTestId("reset-map").click();
    await page.getByTestId("read-map-state").click();

    const beforeZoom = Number(await page.getByTestId("map-zoom").textContent());
    const beforeClickCount = Number(await page.getByTestId("cluster-click-count").textContent());

    await page.getByTestId("mode-fit").click();
    await page.getByTestId("helpers-cluster-icon").click();

    await expect
      .poll(async () => {
        await page.getByTestId("read-map-state").click();
        return Number(await page.getByTestId("cluster-click-count").textContent());
      })
      .toBeGreaterThan(beforeClickCount);

    await expect
      .poll(async () => {
        await page.getByTestId("read-map-state").click();
        return Number(await page.getByTestId("map-zoom").textContent());
      })
      .toBeGreaterThan(beforeZoom);
  });

  test("MC-13: helpers 페이지에서 onClusterClick 카운트가 증가한다", async ({ page }) => {
    const before = Number(await page.getByTestId("cluster-click-count").textContent());

    await page.getByTestId("helpers-cluster-icon").click();

    await expect
      .poll(async () => Number(await page.getByTestId("cluster-click-count").textContent()))
      .toBeGreaterThan(before);
  });
});

/* ─── 5. behavior ─── */

test.describe("5. behavior", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/marker-clusterer/behavior");
    await expect(page.getByTestId("map-container")).toBeVisible({ timeout: MAP_LOAD_TIMEOUT });
    await expect(page.getByTestId("map-ready")).toHaveText("true", { timeout: MAP_LOAD_TIMEOUT });
    await page.getByTestId("read-metrics").click();
  });

  test("MC-14: recomputeOn=idle일 때 idle 트리거에서 재계산된다", async ({ page }) => {
    await page.getByTestId("set-recompute-idle").click();
    await page.getByTestId("set-debounce-0").click();
    await page.getByTestId("read-metrics").click();

    const baseline = Number(await page.getByTestId("cluster-call-count").textContent());

    await page.getByTestId("trigger-move").click();
    await page.getByTestId("read-metrics").click();
    const afterMove = Number(await page.getByTestId("cluster-call-count").textContent());

    await page.getByTestId("trigger-idle").click();
    await expect
      .poll(async () => {
        await page.getByTestId("read-metrics").click();
        return Number(await page.getByTestId("cluster-call-count").textContent());
      })
      .toBeGreaterThan(afterMove);

    expect(afterMove).toBeGreaterThanOrEqual(baseline);
  });

  test("MC-15: recomputeOn=move일 때 bounds_changed 트리거에서 재계산된다", async ({ page }) => {
    await page.getByTestId("set-recompute-move").click();
    await page.getByTestId("set-debounce-0").click();
    await page.getByTestId("read-metrics").click();

    const baseline = Number(await page.getByTestId("cluster-call-count").textContent());

    await page.getByTestId("trigger-move").click();

    await expect
      .poll(async () => {
        await page.getByTestId("read-metrics").click();
        return Number(await page.getByTestId("cluster-call-count").textContent());
      })
      .toBeGreaterThan(baseline);
  });

  test("MC-16: recomputeOn=zoom일 때 zoom_changed 트리거에서 재계산된다", async ({ page }) => {
    await page.getByTestId("set-recompute-zoom").click();
    await page.getByTestId("set-debounce-0").click();
    await page.getByTestId("read-metrics").click();

    const baseline = Number(await page.getByTestId("cluster-call-count").textContent());

    await page.getByTestId("trigger-zoom").click();

    await expect
      .poll(async () => {
        await page.getByTestId("read-metrics").click();
        return Number(await page.getByTestId("cluster-call-count").textContent());
      })
      .toBeGreaterThan(baseline);
  });

  test("MC-17: debounceMs=200이면 연속 idle 이벤트가 1회로 합쳐진다", async ({ page }) => {
    await page.getByTestId("set-recompute-idle").click();
    await page.getByTestId("set-debounce-200").click();
    await page.getByTestId("read-metrics").click();

    const baseline = Number(await page.getByTestId("cluster-call-count").textContent());

    await page.getByTestId("trigger-idle-triple").click();

    await expect
      .poll(async () => {
        await page.getByTestId("read-metrics").click();
        return Number(await page.getByTestId("cluster-call-count").textContent()) - baseline;
      })
      .toBe(1);
  });

  test("MC-18: debounceMs=0이면 연속 idle 이벤트를 순차적으로 모두 반영한다", async ({ page }) => {
    await page.getByTestId("set-recompute-idle").click();
    await page.getByTestId("set-debounce-0").click();
    await page.getByTestId("read-metrics").click();

    const baseline = Number(await page.getByTestId("cluster-call-count").textContent());

    await page.getByTestId("trigger-idle").click();
    await expect
      .poll(async () => {
        await page.getByTestId("read-metrics").click();
        return Number(await page.getByTestId("cluster-call-count").textContent()) - baseline;
      })
      .toBeGreaterThanOrEqual(1);

    await page.getByTestId("trigger-idle").click();
    await expect
      .poll(async () => {
        await page.getByTestId("read-metrics").click();
        return Number(await page.getByTestId("cluster-call-count").textContent()) - baseline;
      })
      .toBeGreaterThanOrEqual(2);
  });

  test("MC-19: zoom 변경 시 알고리즘 context.zoom 값이 갱신된다", async ({ page }) => {
    await page.getByTestId("set-recompute-zoom").click();
    await page.getByTestId("set-debounce-0").click();

    await page.getByTestId("set-map-zoom-15").click();

    await expect
      .poll(async () => {
        await page.getByTestId("read-metrics").click();
        return Number(await page.getByTestId("last-context-zoom").textContent());
      })
      .toBe(15);
  });
});

/* ─── 6. algorithm switch ─── */

test.describe("6. algorithm switch", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/marker-clusterer/algorithm-switch");
    await expect(page.getByTestId("map-container")).toBeVisible({ timeout: MAP_LOAD_TIMEOUT });
    await expect(page.getByTestId("map-ready")).toHaveText("true", { timeout: MAP_LOAD_TIMEOUT });
    await expect(page.getByTestId("algorithm-cluster-icon")).toBeVisible();
  });

  test("MC-20: 초기 알고리즘 A가 적용된다", async ({ page }) => {
    await expect(page.getByTestId("algorithm-mode")).toHaveText("A");
    await expect(page.getByTestId("algorithm-cluster-id")).toHaveText("algo-a");
    await expect(page.getByTestId("algorithm-cluster-count")).toHaveText("5");
  });

  test("MC-21: B로 변경 시 클러스터 ID가 바뀐다", async ({ page }) => {
    await page.getByTestId("use-algorithm-b").click();

    await expect(page.getByTestId("algorithm-mode")).toHaveText("B");
    await expect(page.getByTestId("algorithm-cluster-id")).toHaveText("algo-b");
  });

  test("MC-22: A로 복귀 시 이전 알고리즘 destroy가 호출된다", async ({ page }) => {
    await page.getByTestId("use-algorithm-b").click();
    await page.getByTestId("use-algorithm-a").click();

    await expect(page.getByTestId("algorithm-mode")).toHaveText("A");
    await expect(page.getByTestId("algorithm-cluster-id")).toHaveText("algo-a");

    await page.getByTestId("read-destroy-count").click();
    await expect(page.getByTestId("destroy-count")).toHaveText("1");
  });

  test("MC-23: 클러스터 클릭 시 현재 클러스터 ID가 콜백으로 전달된다", async ({ page }) => {
    await page.getByTestId("algorithm-cluster-icon").click();

    await expect(page.getByTestId("cluster-click-count")).toHaveText("1");
    await expect(page.getByTestId("last-clicked-cluster-id")).toHaveText("algo-a");
  });
});

/* ─── 7. dynamic ─── */

test.describe("7. dynamic", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/marker-clusterer/dynamic");
    await expect(page.getByTestId("map-container")).toBeVisible({ timeout: MAP_LOAD_TIMEOUT });
    await expect(page.getByTestId("map-ready")).toHaveText("true", { timeout: MAP_LOAD_TIMEOUT });
  });

  test("MC-24: 초기 포인트 수와 클러스터 count가 일치한다", async ({ page }) => {
    await expect(page.getByTestId("point-count")).toHaveText("3");
    await expect(page.getByTestId("dynamic-cluster-icon")).toHaveText("3");
  });

  test("MC-25: 포인트 추가 시 클러스터 count가 증가한다", async ({ page }) => {
    await page.getByTestId("add-point").click();

    await expect(page.getByTestId("point-count")).toHaveText("4");
    await expect(page.getByTestId("dynamic-cluster-icon")).toHaveText("4");
  });

  test("MC-26: 포인트 제거 시 클러스터 count가 감소한다", async ({ page }) => {
    await page.getByTestId("remove-point").click();

    await expect(page.getByTestId("point-count")).toHaveText("2");
    await expect(page.getByTestId("dynamic-cluster-icon")).toHaveText("2");
  });

  test("MC-27: 포인트가 0개가 되면 클러스터 아이콘이 사라진다", async ({ page }) => {
    await page.getByTestId("remove-point").click();
    await page.getByTestId("remove-point").click();
    await page.getByTestId("remove-point").click();

    await expect(page.getByTestId("point-count")).toHaveText("0");
    await expect.poll(async () => page.getByTestId("dynamic-cluster-icon").isVisible()).toBe(false);
  });

  test("MC-28: 0개 상태에서 다시 추가하면 클러스터가 복구된다", async ({ page }) => {
    await page.getByTestId("remove-point").click();
    await page.getByTestId("remove-point").click();
    await page.getByTestId("remove-point").click();

    await expect(page.getByTestId("point-count")).toHaveText("0");

    await page.getByTestId("add-point").click();

    await expect(page.getByTestId("point-count")).toHaveText("1");
    await expect(page.getByTestId("dynamic-cluster-icon")).toHaveText("1");
  });
});
