import { expect, test } from "@playwright/test";

import {
  CIRCLE_CENTER_1,
  CIRCLE_CENTER_2,
  CIRCLE_CENTER_3,
  CIRCLE_RADIUS_2,
  CIRCLE_RADIUS_3
} from "./app/constants";

const MAP_LOAD_TIMEOUT = 20_000;

function parseJson<T>(text: string | null): T {
  if (!text) {
    throw new Error("Expected JSON text but received empty value");
  }

  return JSON.parse(text) as T;
}

function parseColor(text: string | null): string {
  return (text ?? "").trim().toLowerCase();
}

/* ─── 1. 렌더링/생성/정리 (스모크) ─── */

test.describe("1. 렌더링/생성/정리 (스모크)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/circle/smoke");
  });

  test("C-01: 기본 Circle 렌더링 + onCircleReady 호출", async ({ page }) => {
    await expect(page.getByTestId("map-container")).toBeVisible({ timeout: MAP_LOAD_TIMEOUT });

    await expect
      .poll(async () => Number(await page.getByTestId("circle-ready-count").textContent()))
      .toBeGreaterThanOrEqual(1);
  });

  test("C-02: 언마운트 시 onCircleDestroy 호출 + 에러 없음", async ({ page }) => {
    await expect(page.getByTestId("map-container")).toBeVisible({ timeout: MAP_LOAD_TIMEOUT });
    await expect
      .poll(async () => Number(await page.getByTestId("circle-ready-count").textContent()))
      .toBeGreaterThanOrEqual(1);

    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await page.getByTestId("toggle-circle").click();
    await expect(page.getByTestId("show-circle")).toHaveText("false");
    await expect(page.getByTestId("circle-destroyed")).toHaveText("true");

    const criticalErrors = consoleErrors.filter(
      (err) => !err.includes("naver") && !err.includes("favicon")
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test("C-03: radius=0인 Circle도 정상 렌더링", async ({ page }) => {
    await expect(page.getByTestId("map-container")).toBeVisible({ timeout: MAP_LOAD_TIMEOUT });

    await page.getByTestId("toggle-zero-radius").click();
    await page.getByTestId("read-map-binding").click();

    await expect(page.getByTestId("current-radius")).toHaveText("0");
  });

  test("C-04: map prop 미지정 시 context map 사용", async ({ page }) => {
    await expect(page.getByTestId("map-container")).toBeVisible({ timeout: MAP_LOAD_TIMEOUT });
    await expect
      .poll(async () => Number(await page.getByTestId("circle-ready-count").textContent()))
      .toBeGreaterThanOrEqual(1);

    await page.getByTestId("read-map-binding").click();

    await expect(page.getByTestId("map-bound")).toHaveText("true");
    await expect(page.getByTestId("map-equals")).toHaveText("true");
  });
});

/* ─── 2. center/radius 업데이트 ─── */

test.describe("2. center/radius 업데이트", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/circle/center-radius");
    await expect(page.getByTestId("map-ready")).toHaveText("true", { timeout: MAP_LOAD_TIMEOUT });
  });

  test("C-05: props로 center 변경 → Circle 이동", async ({ page }) => {
    await page.getByTestId("set-center-2").click();
    await page.getByTestId("read-state").click();

    const center = parseJson<{ lat: number; lng: number }>(
      await page.getByTestId("circle-center").textContent()
    );

    expect(center.lat).toBeCloseTo(CIRCLE_CENTER_2.lat, 2);
    expect(center.lng).toBeCloseTo(CIRCLE_CENTER_2.lng, 2);
  });

  test("C-06: props로 radius 변경 → 원 크기 변경", async ({ page }) => {
    await page.getByTestId("set-radius-1000").click();
    await page.getByTestId("read-state").click();

    await expect(page.getByTestId("circle-radius")).toHaveText(String(CIRCLE_RADIUS_2));
  });

  test("C-07: 빠른 연속 center 변경 → 최종 위치로 수렴", async ({ page }) => {
    await page.getByTestId("rapid-center").click();

    await expect
      .poll(async () => {
        await page.getByTestId("read-state").click();
        const text = await page.getByTestId("circle-center").textContent();
        if (!text) return false;

        const center = JSON.parse(text) as { lat: number; lng: number };

        return (
          Math.abs(center.lat - CIRCLE_CENTER_3.lat) < 0.01 &&
          Math.abs(center.lng - CIRCLE_CENTER_3.lng) < 0.01
        );
      })
      .toBe(true);
  });

  test("C-08: onCenterChanged 이벤트 발생", async ({ page }) => {
    const before = Number(await page.getByTestId("center-changed-count").textContent());

    await page.getByTestId("set-center-3").click();

    await expect
      .poll(async () => Number(await page.getByTestId("center-changed-count").textContent()))
      .toBeGreaterThan(before);
  });

  test("C-09: onRadiusChanged 이벤트 발생", async ({ page }) => {
    const before = Number(await page.getByTestId("radius-changed-count").textContent());

    await page.getByTestId("rapid-radius").click();

    await expect
      .poll(async () => Number(await page.getByTestId("radius-changed-count").textContent()))
      .toBeGreaterThan(before);

    await page.getByTestId("read-state").click();
    await expect(page.getByTestId("circle-radius")).toHaveText(String(CIRCLE_RADIUS_3));
  });
});

/* ─── 3. 스타일 옵션 prop 반영 ─── */

test.describe("3. 스타일 옵션 prop 반영", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/circle/styles");
    await expect(page.getByTestId("map-ready")).toHaveText("true", { timeout: MAP_LOAD_TIMEOUT });
  });

  test("C-10: visible=false → ref.getVisible()이 false", async ({ page }) => {
    await page.getByTestId("toggle-visible").click();
    await page.getByTestId("read-styles").click();

    await expect(page.getByTestId("opt-visible")).toHaveText("false");
  });

  test("C-11: visible 토글 → 다시 true", async ({ page }) => {
    await page.getByTestId("toggle-visible").click();
    await page.getByTestId("toggle-visible").click();
    await page.getByTestId("read-styles").click();

    await expect(page.getByTestId("opt-visible")).toHaveText("true");
  });

  test("C-12: fillColor 변경 → getStyles() 반영", async ({ page }) => {
    await page.getByTestId("set-fill-red").click();
    await page.getByTestId("read-styles").click();

    const fillColor = parseColor(await page.getByTestId("opt-fill-color").textContent());
    expect(fillColor).toBe("#ff0000");
  });

  test("C-13: strokeColor 변경 → getStyles() 반영", async ({ page }) => {
    await page.getByTestId("set-stroke-green").click();
    await page.getByTestId("read-styles").click();

    const strokeColor = parseColor(await page.getByTestId("opt-stroke-color").textContent());
    expect(strokeColor).toBe("#00aa00");
  });

  test("C-14: strokeWeight 변경 → getStyles() 반영", async ({ page }) => {
    await page.getByTestId("set-stroke-weight-5").click();
    await page.getByTestId("read-styles").click();

    await expect(page.getByTestId("opt-stroke-weight")).toHaveText("5");
  });

  test("C-15: fillOpacity 변경 → getStyles() 반영", async ({ page }) => {
    await page.getByTestId("set-fill-opacity-08").click();
    await page.getByTestId("read-styles").click();

    await expect(page.getByTestId("opt-fill-opacity")).toHaveText("0.8");
  });

  test("C-16: clickable 토글 → false 반영", async ({ page }) => {
    await page.getByTestId("toggle-clickable").click();
    await page.getByTestId("read-styles").click();

    await expect(page.getByTestId("opt-clickable")).toHaveText("false");
  });

  test("C-17: clickable 재토글 → true 반영", async ({ page }) => {
    await page.getByTestId("toggle-clickable").click();
    await page.getByTestId("toggle-clickable").click();
    await page.getByTestId("read-styles").click();

    await expect(page.getByTestId("opt-clickable")).toHaveText("true");
  });

  test("C-18: zIndex 변경 → 999 반영", async ({ page }) => {
    await page.getByTestId("set-zindex-999").click();
    await page.getByTestId("read-styles").click();

    await expect(page.getByTestId("opt-zindex")).toHaveText("999");
  });

  test("C-19: zIndex 재설정 → 1 반영", async ({ page }) => {
    await page.getByTestId("set-zindex-999").click();
    await page.getByTestId("set-zindex-1").click();
    await page.getByTestId("read-styles").click();

    await expect(page.getByTestId("opt-zindex")).toHaveText("1");
  });

  test("C-20: visible 변경 시 onVisibleChanged 이벤트 발생", async ({ page }) => {
    const before = Number(await page.getByTestId("visible-changed-count").textContent());

    await page.getByTestId("toggle-visible").click();

    await expect
      .poll(async () => Number(await page.getByTestId("visible-changed-count").textContent()))
      .toBeGreaterThan(before);
  });

  test("C-21: fillColor/zIndex 변경 이벤트 발생", async ({ page }) => {
    const fillBefore = Number(await page.getByTestId("fill-color-changed-count").textContent());
    const zBefore = Number(await page.getByTestId("zindex-changed-count").textContent());

    await page.getByTestId("set-fill-red").click();
    await page.getByTestId("set-zindex-999").click();

    await expect
      .poll(async () => Number(await page.getByTestId("fill-color-changed-count").textContent()))
      .toBeGreaterThan(fillBefore);

    await expect
      .poll(async () => Number(await page.getByTestId("zindex-changed-count").textContent()))
      .toBeGreaterThan(zBefore);
  });
});

/* ─── 4. 이벤트 흐름 ─── */

test.describe("4. 이벤트 흐름", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/circle/events");
    await expect(page.getByTestId("map-ready")).toHaveText("true", { timeout: MAP_LOAD_TIMEOUT });
    await page.getByTestId("clear-log").click();
  });

  test("C-22: Circle 클릭 → onClick 호출", async ({ page }) => {
    await page.getByTestId("trigger-click").click();

    await expect
      .poll(async () => {
        const logText = await page.getByTestId("event-log").textContent();
        const log = parseJson<string[]>(logText);
        return log.includes("click");
      })
      .toBe(true);
  });

  test("C-23: Circle 더블클릭 → onDblClick 호출", async ({ page }) => {
    await page.getByTestId("trigger-dblclick").click();

    await expect
      .poll(async () => {
        const log = parseJson<string[]>(await page.getByTestId("event-log").textContent());
        return log.includes("dblclick");
      })
      .toBe(true);
  });

  test("C-24: Circle 우클릭 → onRightClick 호출", async ({ page }) => {
    await page.getByTestId("trigger-rightclick").click();

    await expect
      .poll(async () => {
        const log = parseJson<string[]>(await page.getByTestId("event-log").textContent());
        return log.includes("rightclick");
      })
      .toBe(true);
  });

  test("C-25: mouseover/mouseout 이벤트가 호출된다", async ({ page }) => {
    await page.getByTestId("trigger-mouseover").click();
    await page.getByTestId("trigger-mouseout").click();

    await expect
      .poll(async () => parseJson<string[]>(await page.getByTestId("event-log").textContent()))
      .toContainEqual("mouseover");

    const logText = await page.getByTestId("event-log").textContent();
    const parsed = parseJson<string[]>(logText);
    expect(parsed).toContain("mouseout");
  });

  test("C-26: mousedown/mouseup 이벤트 순서 보장", async ({ page }) => {
    await page.getByTestId("trigger-mousedown").click();
    await page.getByTestId("trigger-mouseup").click();

    await expect
      .poll(async () => {
        const log = parseJson<string[]>(await page.getByTestId("event-log").textContent());
        const down = log.indexOf("mousedown");
        const up = log.indexOf("mouseup");
        return down !== -1 && up !== -1 && down < up;
      })
      .toBe(true);
  });

  test("C-27: center 변경 시 onCenterChanged 호출", async ({ page }) => {
    await page.getByTestId("change-center").click();

    await expect
      .poll(async () => {
        const log = parseJson<string[]>(await page.getByTestId("event-log").textContent());
        return log.includes("centerchanged");
      })
      .toBe(true);
  });

  test("C-28: radius/visible/zIndex 변경 이벤트가 호출된다", async ({ page }) => {
    await page.getByTestId("change-radius").click();
    await page.getByTestId("toggle-visible").click();
    await page.getByTestId("change-zindex").click();

    await expect
      .poll(async () => {
        const log = parseJson<string[]>(await page.getByTestId("event-log").textContent());
        return (
          log.includes("radiuschanged") &&
          log.includes("visiblechanged") &&
          log.includes("zindexchanged")
        );
      })
      .toBe(true);
  });
});

/* ─── 5. Ref 기반 imperative 동작 ─── */

test.describe("5. Ref 기반 imperative 동작", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/circle/ref");
    await expect(page.getByTestId("map-ready")).toHaveText("true", { timeout: MAP_LOAD_TIMEOUT });
  });

  test("C-29: ref.setCenter() → 위치 변경", async ({ page }) => {
    await page.getByTestId("ref-set-center-2").click();
    await page.getByTestId("ref-read-state").click();

    const center = parseJson<{ lat: number; lng: number }>(
      await page.getByTestId("ref-center").textContent()
    );

    expect(center.lat).toBeCloseTo(CIRCLE_CENTER_2.lat, 2);
    expect(center.lng).toBeCloseTo(CIRCLE_CENTER_2.lng, 2);
  });

  test("C-30: ref.setRadius() → 반경 변경", async ({ page }) => {
    await page.getByTestId("ref-set-radius-2000").click();
    await page.getByTestId("ref-read-state").click();

    await expect(page.getByTestId("ref-radius")).toHaveText(String(CIRCLE_RADIUS_3));
  });

  test("C-31: ref.setVisible(false) → 비가시화", async ({ page }) => {
    await page.getByTestId("ref-set-visible-false").click();
    await page.getByTestId("ref-read-state").click();

    await expect(page.getByTestId("ref-visible")).toHaveText("false");
  });

  test("C-32: ref.setVisible(true) → 재표시", async ({ page }) => {
    await page.getByTestId("ref-set-visible-false").click();
    await page.getByTestId("ref-set-visible-true").click();
    await page.getByTestId("ref-read-state").click();

    await expect(page.getByTestId("ref-visible")).toHaveText("true");
  });

  test("C-33: ref.setZIndex() → zIndex 변경", async ({ page }) => {
    await page.getByTestId("ref-set-zindex-555").click();
    await page.getByTestId("ref-read-state").click();

    await expect(page.getByTestId("ref-zindex")).toHaveText("555");
  });

  test("C-34: ref.getAreaSize()가 양수 반환", async ({ page }) => {
    await page.getByTestId("ref-read-state").click();

    const areaSize = Number(await page.getByTestId("ref-area-size").textContent());
    expect(areaSize).toBeGreaterThan(0);
  });

  test("C-35: ref.getBounds()가 중심 좌표를 포함", async ({ page }) => {
    await page.getByTestId("ref-read-state").click();

    const bounds = parseJson<{
      ne: { lat: number; lng: number };
      sw: { lat: number; lng: number };
    }>(await page.getByTestId("ref-bounds").textContent());

    expect(bounds.sw.lat).toBeLessThanOrEqual(CIRCLE_CENTER_1.lat);
    expect(bounds.ne.lat).toBeGreaterThanOrEqual(CIRCLE_CENTER_1.lat);
    expect(bounds.sw.lng).toBeLessThanOrEqual(CIRCLE_CENTER_1.lng);
    expect(bounds.ne.lng).toBeGreaterThanOrEqual(CIRCLE_CENTER_1.lng);
  });

  test("C-36: ref.getElement()가 DOM 요소를 반환", async ({ page }) => {
    await page.getByTestId("ref-read-state").click();
    await expect(page.getByTestId("ref-element-exists")).toHaveText("true");
  });

  test("C-37: ref.setClickable(true) → 클릭 가능 변경", async ({ page }) => {
    await page.getByTestId("ref-set-clickable-true").click();
    await page.getByTestId("ref-read-state").click();

    await expect(page.getByTestId("ref-clickable")).toHaveText("true");
  });

  test("C-38: ref.setStyles() → fillColor 변경", async ({ page }) => {
    await page.getByTestId("ref-set-styles").click();
    await page.getByTestId("ref-read-state").click();

    const fillColor = parseColor(await page.getByTestId("ref-fill-color").textContent());
    expect(fillColor).toBe("#ff00ff");
  });

  test("C-39: ref.setOptions() → radius/zIndex 동시 변경", async ({ page }) => {
    await page.getByTestId("ref-set-options").click();
    await page.getByTestId("ref-read-state").click();

    await expect(page.getByTestId("ref-radius")).toHaveText(String(CIRCLE_RADIUS_2));
    await expect(page.getByTestId("ref-zindex")).toHaveText("777");
  });
});

/* ─── 6. 복수 Circle / 동적 추가·제거 ─── */

test.describe("6. 복수 Circle / 동적 추가·제거", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/circle/multiple");
    await expect(page.getByTestId("map-ready")).toHaveText("true", { timeout: MAP_LOAD_TIMEOUT });
  });

  test("C-40: Circle 3개 동시 렌더링", async ({ page }) => {
    await expect(page.getByTestId("circle-count")).toHaveText("3");

    await expect
      .poll(async () => Number(await page.getByTestId("circle-ready-count").textContent()))
      .toBeGreaterThanOrEqual(3);
  });

  test("C-41: Circle 동적 추가 → 카운트 증가", async ({ page }) => {
    const before = Number(await page.getByTestId("circle-ready-count").textContent());

    await page.getByTestId("add-circle").click();
    await expect(page.getByTestId("circle-count")).toHaveText("4");

    await expect
      .poll(async () => Number(await page.getByTestId("circle-ready-count").textContent()))
      .toBeGreaterThan(before);
  });

  test("C-42: Circle 동적 제거 → destroy 콜백 발생", async ({ page }) => {
    await page.getByTestId("remove-last-circle").click();
    await expect(page.getByTestId("circle-count")).toHaveText("2");

    await expect
      .poll(async () => Number(await page.getByTestId("circle-destroy-count").textContent()))
      .toBeGreaterThanOrEqual(1);
  });

  test("C-43: 첫 Circle visible 토글 반영", async ({ page }) => {
    await expect(page.getByTestId("first-visible")).toHaveText("true");

    await page.getByTestId("toggle-first-visible").click();
    await expect(page.getByTestId("first-visible")).toHaveText("false");
  });

  test("C-44: 둘째 Circle zIndex 변경 반영", async ({ page }) => {
    await expect(page.getByTestId("second-zindex")).toHaveText("2");

    await page.getByTestId("set-second-zindex").click();
    await expect(page.getByTestId("second-zindex")).toHaveText("555");
  });
});
