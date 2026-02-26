import { expect, test } from "@playwright/test";

import { ELLIPSE_BOUNDS_1, ELLIPSE_BOUNDS_2, ELLIPSE_BOUNDS_3 } from "./app/constants";

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

function parseColor(text: string | null): string {
  return (text ?? "").trim().toLowerCase();
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
    await page.goto("/#/ellipse/smoke");
  });

  test("E-01: 기본 Ellipse 렌더링 + onEllipseReady 호출", async ({ page }) => {
    await expect(page.getByTestId("map-container")).toBeVisible({ timeout: MAP_LOAD_TIMEOUT });

    await expect
      .poll(async () => Number(await page.getByTestId("ellipse-ready-count").textContent()))
      .toBeGreaterThanOrEqual(1);
  });

  test("E-02: 언마운트 시 onEllipseDestroy 호출 + 치명 에러 없음", async ({ page }) => {
    await expect(page.getByTestId("map-container")).toBeVisible({ timeout: MAP_LOAD_TIMEOUT });
    await expect
      .poll(async () => Number(await page.getByTestId("ellipse-ready-count").textContent()))
      .toBeGreaterThanOrEqual(1);

    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await page.getByTestId("toggle-ellipse").click();
    await expect(page.getByTestId("show-ellipse")).toHaveText("false");
    await expect(page.getByTestId("ellipse-destroyed")).toHaveText("true");

    const criticalErrors = consoleErrors.filter(
      (err) => !err.includes("naver") && !err.includes("favicon")
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test("E-03: map prop 미지정 시 context map에 바인딩된다", async ({ page }) => {
    await expect(page.getByTestId("map-container")).toBeVisible({ timeout: MAP_LOAD_TIMEOUT });
    await expect
      .poll(async () => Number(await page.getByTestId("ellipse-ready-count").textContent()))
      .toBeGreaterThanOrEqual(1);

    await page.getByTestId("read-map-binding").click();
    await expect(page.getByTestId("map-bound")).toHaveText("true");
    await expect(page.getByTestId("map-equals")).toHaveText("true");
  });

  test("E-04: 재마운트 시 onEllipseReady 카운트가 증가한다", async ({ page }) => {
    await expect(page.getByTestId("map-container")).toBeVisible({ timeout: MAP_LOAD_TIMEOUT });
    const before = Number(await page.getByTestId("ellipse-ready-count").textContent());

    await page.getByTestId("toggle-ellipse").click();
    await page.getByTestId("toggle-ellipse").click();

    await expect
      .poll(async () => Number(await page.getByTestId("ellipse-ready-count").textContent()))
      .toBeGreaterThan(before);
  });
});

/* ─── 2. bounds/options 반영 ─── */

test.describe("2. bounds/options 반영", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/ellipse/bounds-options");
    await expect(page.getByTestId("map-ready")).toHaveText("true", { timeout: MAP_LOAD_TIMEOUT });
  });

  test("E-05: bounds 변경이 getBounds에 반영된다", async ({ page }) => {
    await page.getByTestId("set-bounds-2").click();
    await page.getByTestId("read-state").click();

    const bounds = parseJson<BoundsLiteral>(await page.getByTestId("opt-bounds").textContent());
    expectBoundsClose(bounds, ELLIPSE_BOUNDS_2);
  });

  test("E-06: 빠른 연속 bounds 변경 시 최종 bounds로 수렴한다", async ({ page }) => {
    await page.getByTestId("rapid-bounds").click();

    await expect
      .poll(async () => {
        await page.getByTestId("read-state").click();
        const text = await page.getByTestId("opt-bounds").textContent();
        if (!text) return false;

        const bounds = JSON.parse(text) as BoundsLiteral;

        return (
          Math.abs(bounds.south - ELLIPSE_BOUNDS_3.south) < 0.01 &&
          Math.abs(bounds.west - ELLIPSE_BOUNDS_3.west) < 0.01 &&
          Math.abs(bounds.north - ELLIPSE_BOUNDS_3.north) < 0.01 &&
          Math.abs(bounds.east - ELLIPSE_BOUNDS_3.east) < 0.01
        );
      })
      .toBe(true);
  });

  test("E-07: visible 토글이 반영된다", async ({ page }) => {
    await page.getByTestId("toggle-visible").click();
    await page.getByTestId("read-state").click();
    await expect(page.getByTestId("opt-visible")).toHaveText("false");

    await page.getByTestId("toggle-visible").click();
    await page.getByTestId("read-state").click();
    await expect(page.getByTestId("opt-visible")).toHaveText("true");
  });

  test("E-08: clickable 토글이 반영된다", async ({ page }) => {
    await page.getByTestId("toggle-clickable").click();
    await page.getByTestId("read-state").click();
    await expect(page.getByTestId("opt-clickable")).toHaveText("false");

    await page.getByTestId("toggle-clickable").click();
    await page.getByTestId("read-state").click();
    await expect(page.getByTestId("opt-clickable")).toHaveText("true");
  });

  test("E-09: zIndex 변경이 반영된다", async ({ page }) => {
    await page.getByTestId("set-zindex-999").click();
    await page.getByTestId("read-state").click();
    await expect(page.getByTestId("opt-zindex")).toHaveText("999");

    await page.getByTestId("set-zindex-1").click();
    await page.getByTestId("read-state").click();
    await expect(page.getByTestId("opt-zindex")).toHaveText("1");
  });

  test("E-10: fillColor/fillOpacity 변경이 반영된다", async ({ page }) => {
    await page.getByTestId("set-fill-red").click();
    await page.getByTestId("set-fill-opacity-08").click();
    await page.getByTestId("read-state").click();

    expect(parseColor(await page.getByTestId("opt-fill-color").textContent())).toBe("#ff0000");
    await expect(page.getByTestId("opt-fill-opacity")).toHaveText("0.8");
  });

  test("E-11: strokeColor/strokeOpacity/strokeWeight 변경이 반영된다", async ({ page }) => {
    await page.getByTestId("set-stroke-green").click();
    await page.getByTestId("set-stroke-opacity-04").click();
    await page.getByTestId("set-stroke-weight-6").click();
    await page.getByTestId("read-state").click();

    expect(parseColor(await page.getByTestId("opt-stroke-color").textContent())).toBe("#00aa00");
    await expect(page.getByTestId("opt-stroke-opacity")).toHaveText("0.4");
    await expect(page.getByTestId("opt-stroke-weight")).toHaveText("6");
  });

  test("E-12: strokeStyle/strokeLineCap/strokeLineJoin 변경이 반영된다", async ({ page }) => {
    await page.getByTestId("set-stroke-style-shortdash").click();
    await page.getByTestId("set-linecap-butt").click();
    await page.getByTestId("set-linejoin-bevel").click();
    await page.getByTestId("read-state").click();

    await expect(page.getByTestId("opt-stroke-style")).toContainText("short");
    await expect(page.getByTestId("opt-stroke-linecap")).toContainText("butt");
    await expect(page.getByTestId("opt-stroke-linejoin")).toContainText("bevel");
  });

  test("E-13: bounds/clickable/visible/zIndex changed 이벤트가 발생한다", async ({ page }) => {
    const boundsBefore = Number(await page.getByTestId("evt-bounds-changed-count").textContent());
    const clickableBefore = Number(
      await page.getByTestId("evt-clickable-changed-count").textContent()
    );
    const visibleBefore = Number(await page.getByTestId("evt-visible-changed-count").textContent());
    const zIndexBefore = Number(await page.getByTestId("evt-zindex-changed-count").textContent());

    await page.getByTestId("set-bounds-2").click();
    await page.getByTestId("toggle-clickable").click();
    await page.getByTestId("toggle-visible").click();
    await page.getByTestId("set-zindex-999").click();

    await expect
      .poll(async () => Number(await page.getByTestId("evt-bounds-changed-count").textContent()))
      .toBeGreaterThan(boundsBefore);
    await expect
      .poll(async () => Number(await page.getByTestId("evt-clickable-changed-count").textContent()))
      .toBeGreaterThan(clickableBefore);
    await expect
      .poll(async () => Number(await page.getByTestId("evt-visible-changed-count").textContent()))
      .toBeGreaterThan(visibleBefore);
    await expect
      .poll(async () => Number(await page.getByTestId("evt-zindex-changed-count").textContent()))
      .toBeGreaterThan(zIndexBefore);
  });

  test("E-14: fill/stroke changed 이벤트가 발생한다", async ({ page }) => {
    const fillColorBefore = Number(
      await page.getByTestId("evt-fill-color-changed-count").textContent()
    );
    const fillOpacityBefore = Number(
      await page.getByTestId("evt-fill-opacity-changed-count").textContent()
    );
    const strokeColorBefore = Number(
      await page.getByTestId("evt-stroke-color-changed-count").textContent()
    );
    const strokeOpacityBefore = Number(
      await page.getByTestId("evt-stroke-opacity-changed-count").textContent()
    );
    const strokeWeightBefore = Number(
      await page.getByTestId("evt-stroke-weight-changed-count").textContent()
    );

    await page.getByTestId("set-fill-red").click();
    await page.getByTestId("set-fill-opacity-08").click();
    await page.getByTestId("set-stroke-green").click();
    await page.getByTestId("set-stroke-opacity-04").click();
    await page.getByTestId("set-stroke-weight-6").click();

    await expect
      .poll(async () =>
        Number(await page.getByTestId("evt-fill-color-changed-count").textContent())
      )
      .toBeGreaterThan(fillColorBefore);
    await expect
      .poll(async () =>
        Number(await page.getByTestId("evt-fill-opacity-changed-count").textContent())
      )
      .toBeGreaterThan(fillOpacityBefore);
    await expect
      .poll(async () =>
        Number(await page.getByTestId("evt-stroke-color-changed-count").textContent())
      )
      .toBeGreaterThan(strokeColorBefore);
    await expect
      .poll(async () =>
        Number(await page.getByTestId("evt-stroke-opacity-changed-count").textContent())
      )
      .toBeGreaterThan(strokeOpacityBefore);
    await expect
      .poll(async () =>
        Number(await page.getByTestId("evt-stroke-weight-changed-count").textContent())
      )
      .toBeGreaterThan(strokeWeightBefore);
  });

  test("E-15: strokeLineCap/strokeLineJoin/strokeStyle changed 이벤트가 발생한다", async ({
    page
  }) => {
    const styleBefore = Number(
      await page.getByTestId("evt-stroke-style-changed-count").textContent()
    );
    const lineCapBefore = Number(
      await page.getByTestId("evt-stroke-linecap-changed-count").textContent()
    );
    const lineJoinBefore = Number(
      await page.getByTestId("evt-stroke-linejoin-changed-count").textContent()
    );

    await page.getByTestId("set-stroke-style-shortdash").click();
    await page.getByTestId("set-linecap-butt").click();
    await page.getByTestId("set-linejoin-bevel").click();

    await expect
      .poll(async () =>
        Number(await page.getByTestId("evt-stroke-style-changed-count").textContent())
      )
      .toBeGreaterThan(styleBefore);
    await expect
      .poll(async () =>
        Number(await page.getByTestId("evt-stroke-linecap-changed-count").textContent())
      )
      .toBeGreaterThan(lineCapBefore);
    await expect
      .poll(async () =>
        Number(await page.getByTestId("evt-stroke-linejoin-changed-count").textContent())
      )
      .toBeGreaterThan(lineJoinBefore);
  });

  test("E-16: getAreaSize는 양수를 반환한다", async ({ page }) => {
    await page.getByTestId("read-state").click();

    const areaSize = Number(await page.getByTestId("opt-area-size").textContent());
    expect(areaSize).toBeGreaterThan(0);
  });
});

/* ─── 3. 포인터 이벤트 ─── */

test.describe("3. 포인터 이벤트", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/ellipse/events");
    await expect(page.getByTestId("map-ready")).toHaveText("true", { timeout: MAP_LOAD_TIMEOUT });
    await page.getByTestId("clear-log").click();
  });

  test("E-17: onClick 이벤트가 호출된다", async ({ page }) => {
    await page.getByTestId("trigger-click").click();

    await expect
      .poll(async () => {
        const log = parseJson<string[]>(await page.getByTestId("event-log").textContent());
        return log.includes("click");
      })
      .toBe(true);
  });

  test("E-18: onDblClick/onRightClick 이벤트가 호출된다", async ({ page }) => {
    await page.getByTestId("trigger-dblclick").click();
    await page.getByTestId("trigger-rightclick").click();

    await expect
      .poll(async () => {
        const log = parseJson<string[]>(await page.getByTestId("event-log").textContent());
        return log.includes("dblclick") && log.includes("rightclick");
      })
      .toBe(true);
  });

  test("E-19: onMouseOver/onMouseOut 이벤트가 호출된다", async ({ page }) => {
    await page.getByTestId("trigger-mouseover").click();
    await page.getByTestId("trigger-mouseout").click();

    await expect
      .poll(async () => {
        const log = parseJson<string[]>(await page.getByTestId("event-log").textContent());
        return log.includes("mouseover") && log.includes("mouseout");
      })
      .toBe(true);
  });

  test("E-20: onMouseDown/onMouseMove/onMouseUp 이벤트가 호출된다", async ({ page }) => {
    await page.getByTestId("trigger-mousedown").click();
    await page.getByTestId("trigger-mousemove").click();
    await page.getByTestId("trigger-mouseup").click();

    await expect
      .poll(async () => {
        const log = parseJson<string[]>(await page.getByTestId("event-log").textContent());
        const down = log.indexOf("mousedown");
        const move = log.indexOf("mousemove");
        const up = log.indexOf("mouseup");
        return down !== -1 && move !== -1 && up !== -1 && down < up;
      })
      .toBe(true);
  });

  test("E-21: onTouchStart/onTouchMove/onTouchEnd 이벤트가 호출된다", async ({ page }) => {
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

  test("E-22: onMapChanged 이벤트가 호출된다", async ({ page }) => {
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
    await page.goto("/#/ellipse/ref");
    await expect(page.getByTestId("map-ready")).toHaveText("true", { timeout: MAP_LOAD_TIMEOUT });
  });

  test("E-23: ref.setBounds()로 bounds를 변경할 수 있다", async ({ page }) => {
    await page.getByTestId("ref-set-bounds-2").click();
    await page.getByTestId("ref-read-state").click();

    const bounds = parseJson<BoundsLiteral>(await page.getByTestId("ref-bounds").textContent());
    expectBoundsClose(bounds, ELLIPSE_BOUNDS_2);
  });

  test("E-24: ref.setClickable()로 clickable을 변경할 수 있다", async ({ page }) => {
    await page.getByTestId("ref-set-clickable-true").click();
    await page.getByTestId("ref-read-state").click();
    await expect(page.getByTestId("ref-clickable")).toHaveText("true");

    await page.getByTestId("ref-set-clickable-false").click();
    await page.getByTestId("ref-read-state").click();
    await expect(page.getByTestId("ref-clickable")).toHaveText("false");
  });

  test("E-25: ref.setVisible()로 visible을 변경할 수 있다", async ({ page }) => {
    await page.getByTestId("ref-set-visible-false").click();
    await page.getByTestId("ref-read-state").click();
    await expect(page.getByTestId("ref-visible")).toHaveText("false");

    await page.getByTestId("ref-set-visible-true").click();
    await page.getByTestId("ref-read-state").click();
    await expect(page.getByTestId("ref-visible")).toHaveText("true");
  });

  test("E-26: ref.setZIndex()로 zIndex를 변경할 수 있다", async ({ page }) => {
    await page.getByTestId("ref-set-zindex-555").click();
    await page.getByTestId("ref-read-state").click();

    await expect(page.getByTestId("ref-zindex")).toHaveText("555");
  });

  test("E-27: ref.setOptions()로 옵션을 부분 업데이트할 수 있다", async ({ page }) => {
    await page.getByTestId("ref-set-options").click();
    await page.getByTestId("ref-read-state").click();

    await expect(page.getByTestId("ref-zindex")).toHaveText("777");
    await expect(page.getByTestId("ref-clickable")).toHaveText("true");
  });

  test("E-28: ref.setStyles()로 style을 업데이트할 수 있다", async ({ page }) => {
    await page.getByTestId("ref-set-styles").click();
    await page.getByTestId("ref-read-state").click();

    expect(parseColor(await page.getByTestId("ref-fill-color").textContent())).toBe("#ff00ff");
    expect(parseColor(await page.getByTestId("ref-stroke-color").textContent())).toBe("#ff00ff");
  });

  test("E-29: ref.setMap(null/map) 호출 후 map 바인딩이 유지된다", async ({ page }) => {
    await page.getByTestId("ref-set-map-null").click();
    await page.getByTestId("ref-read-state").click();
    await expect(page.getByTestId("ref-map-bound")).toHaveText("true");

    await page.getByTestId("ref-set-map-instance").click();
    await page.getByTestId("ref-read-state").click();
    await expect(page.getByTestId("ref-map-bound")).toHaveText("true");
  });

  test("E-30: ref.getAreaSize/getDrawingRect/getElement/getBounds가 유효값을 반환한다", async ({
    page
  }) => {
    await page.getByTestId("ref-read-state").click();

    expect(Number(await page.getByTestId("ref-area-size").textContent())).toBeGreaterThan(0);
    await expect(page.getByTestId("ref-drawing-rect-exists")).toHaveText("true");
    await expect(page.getByTestId("ref-element-exists")).toHaveText("true");

    const bounds = parseJson<BoundsLiteral>(await page.getByTestId("ref-bounds").textContent());
    expectBoundsClose(bounds, ELLIPSE_BOUNDS_1);
  });

  test("E-31: ref.getOptions/getPanes/getProjection이 유효값을 반환한다", async ({ page }) => {
    await page.getByTestId("ref-read-state").click();

    await expect(page.getByTestId("ref-options-exists")).toHaveText("true");
    await expect(page.getByTestId("ref-panes-exists")).toHaveText("true");
    await expect(page.getByTestId("ref-projection-exists")).toHaveText("true");
  });

  test("E-32: map_changed 이벤트 카운트가 증가한다", async ({ page }) => {
    const before = Number(await page.getByTestId("map-changed-count").textContent());

    await page.getByTestId("ref-trigger-map-changed").click();

    await expect
      .poll(async () => Number(await page.getByTestId("map-changed-count").textContent()))
      .toBeGreaterThan(before);
  });
});

/* ─── 5. 복수 Ellipse / 동적 추가·제거 ─── */

test.describe("5. 복수 Ellipse / 동적 추가·제거", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/ellipse/multiple");
    await expect(page.getByTestId("map-ready")).toHaveText("true", { timeout: MAP_LOAD_TIMEOUT });
  });

  test("E-33: Ellipse 3개가 기본 렌더링된다", async ({ page }) => {
    await expect(page.getByTestId("ellipse-count")).toHaveText("3");

    await expect
      .poll(async () => Number(await page.getByTestId("ellipse-ready-count").textContent()))
      .toBeGreaterThanOrEqual(3);
  });

  test("E-34: Ellipse 동적 추가 시 카운트가 증가한다", async ({ page }) => {
    const before = Number(await page.getByTestId("ellipse-ready-count").textContent());

    await page.getByTestId("add-ellipse").click();
    await expect(page.getByTestId("ellipse-count")).toHaveText("4");

    await expect
      .poll(async () => Number(await page.getByTestId("ellipse-ready-count").textContent()))
      .toBeGreaterThan(before);
  });

  test("E-35: Ellipse 동적 제거 시 destroy 콜백이 발생한다", async ({ page }) => {
    await page.getByTestId("remove-last-ellipse").click();
    await expect(page.getByTestId("ellipse-count")).toHaveText("2");

    await expect
      .poll(async () => Number(await page.getByTestId("ellipse-destroy-count").textContent()))
      .toBeGreaterThanOrEqual(1);
  });

  test("E-36: 첫 Ellipse visible 토글이 반영된다", async ({ page }) => {
    await expect(page.getByTestId("first-visible")).toHaveText("true");

    await page.getByTestId("toggle-first-visible").click();
    await expect(page.getByTestId("first-visible")).toHaveText("false");
  });

  test("E-37: 둘째 Ellipse zIndex 변경이 반영된다", async ({ page }) => {
    await expect(page.getByTestId("second-zindex")).toHaveText("2");

    await page.getByTestId("set-second-zindex").click();
    await expect(page.getByTestId("second-zindex")).toHaveText("555");
  });
});
