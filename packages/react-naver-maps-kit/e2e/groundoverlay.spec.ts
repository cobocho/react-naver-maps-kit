import { expect, test } from "@playwright/test";

import {
  GROUND_OVERLAY_BOUNDS_1,
  GROUND_OVERLAY_BOUNDS_2,
  GROUND_OVERLAY_BOUNDS_3
} from "./app/constants";

const MAP_LOAD_TIMEOUT = 20_000;

type BoundsLiteral = {
  south: number;
  west: number;
  north: number;
  east: number;
};

function parseJson<T>(text: string | null): T {
  if (!text) {
    throw new Error("Expected JSON text but received empty value");
  }

  return JSON.parse(text) as T;
}

function expectBoundsClose(actual: BoundsLiteral, expected: BoundsLiteral, precision = 2): void {
  expect(actual.south).toBeCloseTo(expected.south, precision);
  expect(actual.west).toBeCloseTo(expected.west, precision);
  expect(actual.north).toBeCloseTo(expected.north, precision);
  expect(actual.east).toBeCloseTo(expected.east, precision);
}

/* ─── 1. 렌더링/생성/정리 (스모크) ─── */

test.describe("1. 렌더링/생성/정리 (스모크)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/ground-overlay/smoke");
  });

  test("G-01: 기본 GroundOverlay 렌더링 + onGroundOverlayReady 호출", async ({ page }) => {
    await expect(page.getByTestId("map-container")).toBeVisible({ timeout: MAP_LOAD_TIMEOUT });

    await expect
      .poll(async () => Number(await page.getByTestId("ground-overlay-ready-count").textContent()))
      .toBeGreaterThanOrEqual(1);
  });

  test("G-02: 언마운트 시 onGroundOverlayDestroy 호출 + 치명 에러 없음", async ({ page }) => {
    await expect(page.getByTestId("map-container")).toBeVisible({ timeout: MAP_LOAD_TIMEOUT });
    await expect
      .poll(async () => Number(await page.getByTestId("ground-overlay-ready-count").textContent()))
      .toBeGreaterThanOrEqual(1);

    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await page.getByTestId("toggle-ground-overlay").click();
    await expect(page.getByTestId("show-ground-overlay")).toHaveText("false");
    await expect(page.getByTestId("ground-overlay-destroyed")).toHaveText("true");

    const criticalErrors = consoleErrors.filter(
      (err) => !err.includes("naver") && !err.includes("favicon")
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test("G-03: map prop 미지정 시 context map에 바인딩된다", async ({ page }) => {
    await expect(page.getByTestId("map-container")).toBeVisible({ timeout: MAP_LOAD_TIMEOUT });
    await expect
      .poll(async () => Number(await page.getByTestId("ground-overlay-ready-count").textContent()))
      .toBeGreaterThanOrEqual(1);

    await page.getByTestId("read-map-binding").click();
    await expect(page.getByTestId("map-bound")).toHaveText("true");
    await expect(page.getByTestId("map-equals")).toHaveText("true");
  });

  test("G-04: 재마운트 시 onGroundOverlayReady 카운트가 증가한다", async ({ page }) => {
    await expect(page.getByTestId("map-container")).toBeVisible({ timeout: MAP_LOAD_TIMEOUT });
    const before = Number(await page.getByTestId("ground-overlay-ready-count").textContent());

    await page.getByTestId("toggle-ground-overlay").click();
    await page.getByTestId("toggle-ground-overlay").click();

    await expect
      .poll(async () => Number(await page.getByTestId("ground-overlay-ready-count").textContent()))
      .toBeGreaterThan(before);
  });
});

/* ─── 2. 옵션/상태/이벤트 ─── */

test.describe("2. 옵션/상태/이벤트", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/ground-overlay/options");
    await expect(page.getByTestId("map-ready")).toHaveText("true", { timeout: MAP_LOAD_TIMEOUT });
    await expect
      .poll(async () => Number(await page.getByTestId("ground-overlay-ready-count").textContent()))
      .toBeGreaterThanOrEqual(1);
  });

  test("G-05: opacity prop 변경이 getOpacity에 반영된다", async ({ page }) => {
    await page.getByTestId("set-opacity-02").click();
    await page.getByTestId("read-state").click();

    expect(Number(await page.getByTestId("opt-opacity").textContent())).toBeCloseTo(0.2, 2);

    await page.getByTestId("set-opacity-09").click();
    await page.getByTestId("read-state").click();

    expect(Number(await page.getByTestId("opt-opacity").textContent())).toBeCloseTo(0.9, 2);
  });

  test("G-06: 빠른 연속 opacity 변경 시 최종 opacity로 수렴한다", async ({ page }) => {
    await page.getByTestId("rapid-opacity").click();

    await expect
      .poll(async () => {
        await page.getByTestId("read-state").click();
        return Number(await page.getByTestId("opt-opacity").textContent());
      })
      .toBeCloseTo(0.9, 2);
  });

  test("G-07: bounds 변경 후 getBounds 값이 반영된다", async ({ page }) => {
    await page.getByTestId("set-bounds-2").click();

    await expect
      .poll(async () => {
        await page.getByTestId("read-state").click();
        const text = await page.getByTestId("opt-bounds").textContent();
        if (!text) return false;

        const bounds = JSON.parse(text) as BoundsLiteral;

        return (
          Math.abs(bounds.south - GROUND_OVERLAY_BOUNDS_2.south) < 0.01 &&
          Math.abs(bounds.west - GROUND_OVERLAY_BOUNDS_2.west) < 0.01 &&
          Math.abs(bounds.north - GROUND_OVERLAY_BOUNDS_2.north) < 0.01 &&
          Math.abs(bounds.east - GROUND_OVERLAY_BOUNDS_2.east) < 0.01
        );
      })
      .toBe(true);
  });

  test("G-08: url 변경 후 getUrl 값이 반영된다", async ({ page }) => {
    await page.getByTestId("set-url-2").click();

    await expect
      .poll(async () => {
        await page.getByTestId("read-state").click();
        const url = await page.getByTestId("opt-url").textContent();
        return (url ?? "").includes("#go2");
      })
      .toBe(true);
  });

  test("G-09: clickable_changed 이벤트가 발생한다", async ({ page }) => {
    const before = Number(await page.getByTestId("evt-clickable-changed-count").textContent());

    await page.getByTestId("toggle-clickable").click();

    await expect
      .poll(async () => Number(await page.getByTestId("evt-clickable-changed-count").textContent()))
      .toBeGreaterThan(before);
  });

  test("G-10: opacity_changed 이벤트가 발생한다", async ({ page }) => {
    const before = Number(await page.getByTestId("evt-opacity-changed-count").textContent());

    await page.getByTestId("set-opacity-06").click();

    await expect
      .poll(async () => Number(await page.getByTestId("evt-opacity-changed-count").textContent()))
      .toBeGreaterThan(before);
  });

  test("G-11: bounds_changed 이벤트가 발생한다", async ({ page }) => {
    const before = Number(await page.getByTestId("evt-bounds-changed-count").textContent());

    await page.getByTestId("trigger-bounds-changed").click();

    await expect
      .poll(async () => Number(await page.getByTestId("evt-bounds-changed-count").textContent()))
      .toBeGreaterThan(before);
  });

  test("G-12: getBounds가 유효한 경계를 반환한다", async ({ page }) => {
    await page.getByTestId("set-bounds-3").click();
    await page.getByTestId("read-state").click();

    const bounds = parseJson<BoundsLiteral>(await page.getByTestId("opt-bounds").textContent());
    expectBoundsClose(bounds, GROUND_OVERLAY_BOUNDS_3);
  });
});

/* ─── 3. 포인터 이벤트 ─── */

test.describe("3. 포인터 이벤트", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/ground-overlay/events");
    await expect(page.getByTestId("map-ready")).toHaveText("true", { timeout: MAP_LOAD_TIMEOUT });
    await page.getByTestId("clear-log").click();
  });

  test("G-13: onClick 이벤트가 호출된다", async ({ page }) => {
    await page.getByTestId("trigger-click").click();

    await expect
      .poll(async () => {
        const log = parseJson<string[]>(await page.getByTestId("event-log").textContent());
        return log.includes("click");
      })
      .toBe(true);
  });

  test("G-14: onDblClick/onRightClick 이벤트가 호출된다", async ({ page }) => {
    await page.getByTestId("trigger-dblclick").click();
    await page.getByTestId("trigger-rightclick").click();

    await expect
      .poll(async () => {
        const log = parseJson<string[]>(await page.getByTestId("event-log").textContent());
        return log.includes("dblclick") && log.includes("rightclick");
      })
      .toBe(true);
  });

  test("G-15: onMouseOver/onMouseOut 이벤트가 호출된다", async ({ page }) => {
    await page.getByTestId("trigger-mouseover").click();
    await page.getByTestId("trigger-mouseout").click();

    await expect
      .poll(async () => {
        const log = parseJson<string[]>(await page.getByTestId("event-log").textContent());
        return log.includes("mouseover") && log.includes("mouseout");
      })
      .toBe(true);
  });

  test("G-16: onMouseDown/onMouseMove/onMouseUp 이벤트가 호출된다", async ({ page }) => {
    await page.getByTestId("trigger-mousedown").click();
    await page.getByTestId("trigger-mousemove").click();
    await page.getByTestId("trigger-mouseup").click();

    await expect
      .poll(async () => {
        const log = parseJson<string[]>(await page.getByTestId("event-log").textContent());
        return log.includes("mousedown") && log.includes("mousemove") && log.includes("mouseup");
      })
      .toBe(true);
  });

  test("G-17: onTouchStart/onTouchMove/onTouchEnd 이벤트가 호출된다", async ({ page }) => {
    await page.getByTestId("trigger-touchstart").click();
    await page.getByTestId("trigger-touchmove").click();
    await page.getByTestId("trigger-touchend").click();

    await expect
      .poll(async () => {
        const log = parseJson<string[]>(await page.getByTestId("event-log").textContent());
        return log.includes("touchstart") && log.includes("touchmove") && log.includes("touchend");
      })
      .toBe(true);
  });

  test("G-18: onMapChanged 이벤트가 호출된다", async ({ page }) => {
    await page.getByTestId("trigger-map-changed").click();

    await expect
      .poll(async () => {
        const log = parseJson<string[]>(await page.getByTestId("event-log").textContent());
        return log.includes("mapchanged");
      })
      .toBe(true);
  });
});

/* ─── 4. Ref 기반 imperative 동작 ─── */

test.describe("4. Ref 기반 imperative 동작", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/ground-overlay/ref");
    await expect(page.getByTestId("map-ready")).toHaveText("true", { timeout: MAP_LOAD_TIMEOUT });
  });

  test("G-19: ref.setOpacity()로 opacity를 변경할 수 있다", async ({ page }) => {
    await page.getByTestId("ref-set-opacity-03").click();
    await page.getByTestId("ref-read-state").click();
    expect(Number(await page.getByTestId("ref-opacity").textContent())).toBeCloseTo(0.3, 2);

    await page.getByTestId("ref-set-opacity-08").click();
    await page.getByTestId("ref-read-state").click();
    expect(Number(await page.getByTestId("ref-opacity").textContent())).toBeCloseTo(0.8, 2);
  });

  test("G-20: ref.setUrl() 호출 후 URL 값이 유효하게 유지된다", async ({ page }) => {
    await page.getByTestId("ref-read-state").click();

    const beforeUrl = (await page.getByTestId("ref-url").textContent()) ?? "";
    const setUrlSupported = (await page.getByTestId("ref-seturl-supported").textContent()) === "true";

    await page.getByTestId("ref-set-url-2").click();
    await page.getByTestId("ref-read-state").click();

    const afterUrl = (await page.getByTestId("ref-url").textContent()) ?? "";

    if (setUrlSupported && afterUrl !== beforeUrl) {
      expect(afterUrl).toContain("#go2");
    } else {
      expect(afterUrl).toBe(beforeUrl);
    }

    expect(afterUrl.length).toBeGreaterThan(0);
  });

  test("G-21: ref.setMap(null/map) 호출 후 map 바인딩이 유지된다", async ({ page }) => {
    await page.getByTestId("ref-set-map-null").click();
    await page.getByTestId("ref-read-state").click();
    await expect(page.getByTestId("ref-map-bound")).toHaveText("true");

    await page.getByTestId("ref-set-map-instance").click();
    await page.getByTestId("ref-read-state").click();
    await expect(page.getByTestId("ref-map-bound")).toHaveText("true");
  });

  test("G-22: ref.getBounds/getOpacity/getUrl이 유효값을 반환한다", async ({ page }) => {
    await page.getByTestId("ref-read-state").click();

    const bounds = parseJson<BoundsLiteral>(await page.getByTestId("ref-bounds").textContent());
    const opacity = Number(await page.getByTestId("ref-opacity").textContent());
    const url = (await page.getByTestId("ref-url").textContent()) ?? "";

    expectBoundsClose(bounds, GROUND_OVERLAY_BOUNDS_1);
    expect(opacity).toBeGreaterThan(0);
    expect(opacity).toBeLessThanOrEqual(1);
    expect(url.length).toBeGreaterThan(0);
  });

  test("G-23: ref.getPanes/getProjection이 유효값을 반환한다", async ({ page }) => {
    await page.getByTestId("ref-read-state").click();

    await expect(page.getByTestId("ref-panes-exists")).toHaveText("true");
    await expect(page.getByTestId("ref-projection-exists")).toHaveText("true");
  });

  test("G-24: map_changed 이벤트 카운트가 증가한다", async ({ page }) => {
    const before = Number(await page.getByTestId("map-changed-count").textContent());

    await page.getByTestId("ref-trigger-map-changed").click();

    await expect
      .poll(async () => Number(await page.getByTestId("map-changed-count").textContent()))
      .toBeGreaterThan(before);
  });
});

/* ─── 5. 복수 GroundOverlay / 동적 추가·제거 ─── */

test.describe("5. 복수 GroundOverlay / 동적 추가·제거", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/ground-overlay/multiple");
    await expect(page.getByTestId("map-ready")).toHaveText("true", { timeout: MAP_LOAD_TIMEOUT });
  });

  test("G-25: GroundOverlay 3개가 기본 렌더링된다", async ({ page }) => {
    await expect(page.getByTestId("ground-overlay-count")).toHaveText("3");

    await expect
      .poll(async () => Number(await page.getByTestId("ground-overlay-ready-count").textContent()))
      .toBeGreaterThanOrEqual(3);
  });

  test("G-26: GroundOverlay 동적 추가 시 카운트가 증가한다", async ({ page }) => {
    const before = Number(await page.getByTestId("ground-overlay-ready-count").textContent());

    await page.getByTestId("add-ground-overlay").click();
    await expect(page.getByTestId("ground-overlay-count")).toHaveText("4");

    await expect
      .poll(async () => Number(await page.getByTestId("ground-overlay-ready-count").textContent()))
      .toBeGreaterThan(before);
  });

  test("G-27: GroundOverlay 동적 제거 시 destroy 콜백이 발생한다", async ({ page }) => {
    await page.getByTestId("remove-last-ground-overlay").click();
    await expect(page.getByTestId("ground-overlay-count")).toHaveText("2");

    await expect
      .poll(async () => Number(await page.getByTestId("ground-overlay-destroy-count").textContent()))
      .toBeGreaterThanOrEqual(1);
  });

  test("G-28: 첫 GroundOverlay clickable 토글이 반영된다", async ({ page }) => {
    await expect(page.getByTestId("first-clickable")).toHaveText("true");

    await page.getByTestId("toggle-first-clickable").click();
    await expect(page.getByTestId("first-clickable")).toHaveText("false");
  });

  test("G-29: 둘째 GroundOverlay opacity 변경이 반영된다", async ({ page }) => {
    await expect(page.getByTestId("second-opacity")).toHaveText("0.7");

    await page.getByTestId("set-second-opacity").click();
    await expect(page.getByTestId("second-opacity")).toHaveText("0.95");
  });
});
