import { expect, test } from "@playwright/test";

import { MARKER_POS_1, MARKER_POS_2, MARKER_POS_3 } from "./app/constants";

const MAP_LOAD_TIMEOUT = 20_000;

/* ─── 1. 렌더링/생성/정리 (스모크) ─── */

test.describe("1. 렌더링/생성/정리 (스모크)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/marker/smoke");
  });

  test("기본 마커가 렌더링되고 onMarkerReady가 호출된다", async ({ page }) => {
    await expect(page.getByTestId("map-container")).toBeVisible({ timeout: MAP_LOAD_TIMEOUT });

    // StrictMode에서 effect가 이중 실행될 수 있으므로 최소 보장으로 검증
    await page.waitForTimeout(3000);
    const countText = await page.getByTestId("marker-ready-count").textContent();
    expect(Number(countText)).toBeGreaterThanOrEqual(2);
  });

  test("언마운트 시 onMarkerDestroy 호출 + 에러 없음", async ({ page }) => {
    await expect(page.getByTestId("map-container")).toBeVisible({ timeout: MAP_LOAD_TIMEOUT });
    await page.waitForTimeout(3000);

    const countText = await page.getByTestId("marker-ready-count").textContent();
    expect(Number(countText)).toBeGreaterThanOrEqual(1);

    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.getByTestId("toggle-marker").click();
    await page.waitForTimeout(1000);

    await expect(page.getByTestId("marker-destroyed")).toHaveText("true", { timeout: 5000 });

    const criticalErrors = consoleErrors.filter(
      (err) => !err.includes("naver") && !err.includes("favicon")
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test("children(커스텀 HTML 마커)이 DOM에 렌더링된다", async ({ page }) => {
    await expect(page.getByTestId("map-container")).toBeVisible({ timeout: MAP_LOAD_TIMEOUT });
    await expect(page.getByTestId("custom-marker-content")).toBeVisible({
      timeout: MAP_LOAD_TIMEOUT
    });
  });
});

/* ─── 2. position 업데이트 ─── */

test.describe("2. position 업데이트", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/marker/position");
    await expect(page.getByTestId("map-ready")).toHaveText("true", { timeout: MAP_LOAD_TIMEOUT });
  });

  test("props로 position 변경 → 마커 이동", async ({ page }) => {
    await page.getByTestId("move-gangnam").click();
    await page.waitForTimeout(1000);

    await page.getByTestId("read-position").click();
    await page.waitForTimeout(500);

    const posText = await page.getByTestId("marker-position").textContent();
    expect(posText).toBeTruthy();
    const pos = JSON.parse(posText!);

    expect(pos.lat).toBeCloseTo(MARKER_POS_2.lat, 2);
    expect(pos.lng).toBeCloseTo(MARKER_POS_2.lng, 2);
  });

  test("빠른 연속 position 변경 → 최종 위치로 수렴", async ({ page }) => {
    await page.getByTestId("rapid-moves").click();
    await expect
      .poll(
        async () => {
          await page.getByTestId("read-position").click();
          await page.waitForTimeout(200);

          const posText = await page.getByTestId("marker-position").textContent();
          if (!posText) return false;
          const pos = JSON.parse(posText);

          return (
            Math.abs(pos.lat - MARKER_POS_3.lat) < 0.01 &&
            Math.abs(pos.lng - MARKER_POS_3.lng) < 0.01
          );
        },
        { timeout: 5000 }
      )
      .toBe(true);
  });
});

/* ─── 3. 옵션 prop 반영 ─── */

test.describe("3. 옵션 prop 반영", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/marker/options");
    await expect(page.getByTestId("map-ready")).toHaveText("true", { timeout: MAP_LOAD_TIMEOUT });
  });

  test("visible=false → ref.getVisible()이 false", async ({ page }) => {
    await page.getByTestId("toggle-visible").click();
    await page.waitForTimeout(500);

    await page.getByTestId("read-options").click();
    await page.waitForTimeout(500);

    await expect(page.getByTestId("opt-visible")).toHaveText("false");
  });

  test("visible 토글 → 다시 true", async ({ page }) => {
    await page.getByTestId("toggle-visible").click();
    await page.waitForTimeout(500);
    await page.getByTestId("toggle-visible").click();
    await page.waitForTimeout(500);

    await page.getByTestId("read-options").click();
    await page.waitForTimeout(500);

    await expect(page.getByTestId("opt-visible")).toHaveText("true");
  });

  test("draggable 토글 → ref.getDraggable() 변경", async ({ page }) => {
    await page.getByTestId("toggle-draggable").click();
    await page.waitForTimeout(500);

    await page.getByTestId("read-options").click();
    await page.waitForTimeout(500);

    await expect(page.getByTestId("opt-draggable")).toHaveText("true");
  });

  test("clickable=false → onClick 미호출", async ({ page }) => {
    await page.getByTestId("toggle-clickable").click();
    await page.waitForTimeout(500);

    const mapContainer = page.getByTestId("map-container");
    const box = await mapContainer.boundingBox();
    expect(box).not.toBeNull();

    await page.mouse.click(box!.x + box!.width / 2, box!.y + box!.height / 2);
    await page.waitForTimeout(1000);

    const clickLogText = await page.getByTestId("click-log").textContent();
    const clickLog: string[] = JSON.parse(clickLogText!);

    expect(clickLog).toHaveLength(0);
  });

  test("title 변경 → ref.getTitle() 반영", async ({ page }) => {
    await page.getByTestId("change-title").click();
    await page.waitForTimeout(500);

    await page.getByTestId("read-options").click();
    await page.waitForTimeout(500);

    await expect(page.getByTestId("opt-title")).toHaveText("변경된 타이틀");
  });

  test("zIndex 변경 → ref.getZIndex() 반영", async ({ page }) => {
    await page.getByTestId("change-zindex").click();
    await page.waitForTimeout(500);

    await page.getByTestId("read-options").click();
    await page.waitForTimeout(500);

    await expect(page.getByTestId("opt-zindex")).toHaveText("999");
  });

  test("cursor 변경 → ref.getCursor() 반영", async ({ page }) => {
    await page.getByTestId("change-cursor").click();
    await page.waitForTimeout(500);

    await page.getByTestId("read-options").click();
    await page.waitForTimeout(500);

    await expect(page.getByTestId("opt-cursor")).toHaveText("crosshair");
  });

  test("icon 변경 → ref.getIcon() 반영", async ({ page }) => {
    await page.getByTestId("change-icon").click();
    await page.waitForTimeout(500);

    await page.getByTestId("read-options").click();
    await page.waitForTimeout(500);

    await expect(page.getByTestId("opt-icon-kind")).toHaveText("icon-b");
  });

  test("shape 변경 → ref.getShape() 반영", async ({ page }) => {
    await page.getByTestId("change-shape").click();
    await page.waitForTimeout(500);

    await page.getByTestId("read-options").click();
    await page.waitForTimeout(500);

    await expect(page.getByTestId("opt-shape-kind")).toHaveText("poly:8");
  });

  test("title/visible/zIndex/cursor/icon/shape 변경 이벤트가 발생한다", async ({ page }) => {
    const titleBefore = Number(await page.getByTestId("evt-title-changed").textContent());
    const visibleBefore = Number(await page.getByTestId("evt-visible-changed").textContent());
    const zIndexBefore = Number(await page.getByTestId("evt-zindex-changed").textContent());
    const cursorBefore = Number(await page.getByTestId("evt-cursor-changed").textContent());
    const iconBefore = Number(await page.getByTestId("evt-icon-changed").textContent());
    const shapeBefore = Number(await page.getByTestId("evt-shape-changed").textContent());

    await page.getByTestId("change-title").click();
    await page.getByTestId("toggle-visible").click();
    await page.getByTestId("change-zindex").click();
    await page.getByTestId("change-cursor").click();
    await page.getByTestId("change-icon").click();
    await page.getByTestId("change-shape").click();

    await expect
      .poll(async () => Number(await page.getByTestId("evt-title-changed").textContent()))
      .toBeGreaterThan(titleBefore);

    await expect
      .poll(async () => Number(await page.getByTestId("evt-visible-changed").textContent()))
      .toBeGreaterThan(visibleBefore);

    await expect
      .poll(async () => Number(await page.getByTestId("evt-zindex-changed").textContent()))
      .toBeGreaterThan(zIndexBefore);

    await expect
      .poll(async () => Number(await page.getByTestId("evt-cursor-changed").textContent()))
      .toBeGreaterThan(cursorBefore);

    await expect
      .poll(async () => Number(await page.getByTestId("evt-icon-changed").textContent()))
      .toBeGreaterThan(iconBefore);

    await expect
      .poll(async () => Number(await page.getByTestId("evt-shape-changed").textContent()))
      .toBeGreaterThan(shapeBefore);
  });
});

/* ─── 4. 이벤트 흐름 ─── */

test.describe("4. 이벤트 흐름", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/marker/events");
    // 마커 DOM이 렌더될 때까지 대기
    await expect(page.getByTestId("marker-element")).toBeVisible({ timeout: MAP_LOAD_TIMEOUT });
    await expect(page.getByTestId("map-ready")).toHaveText("true");
    await page.getByTestId("clear-log").click();
    await page.waitForTimeout(500);
  });

  test("마커 클릭 → onClick 호출", async ({ page }) => {
    const markerEl = page.getByTestId("marker-element");
    const box = await markerEl.boundingBox();
    expect(box).not.toBeNull();

    await page.mouse.click(box!.x + box!.width / 2, box!.y + box!.height / 2);
    await page.waitForTimeout(1000);

    const logText = await page.getByTestId("event-log").textContent();
    const log: string[] = JSON.parse(logText!);

    expect(log).toContain("click");
  });

  test("마커 더블클릭/우클릭 이벤트가 호출된다", async ({ page }) => {
    await page.getByTestId("trigger-dblclick").click();
    await page.getByTestId("trigger-rightclick").click();
    await page.waitForTimeout(500);

    const logText = await page.getByTestId("event-log").textContent();
    const log: string[] = JSON.parse(logText!);

    expect(log).toContain("dblclick");
    expect(log).toContain("rightclick");
  });

  test("마커 mousedown → mouseup 순서가 보장된다", async ({ page }) => {
    const markerEl = page.getByTestId("marker-element");
    const box = await markerEl.boundingBox();
    expect(box).not.toBeNull();

    const cx = box!.x + box!.width / 2;
    const cy = box!.y + box!.height / 2;

    await page.mouse.move(cx, cy);
    await page.mouse.down();
    await page.waitForTimeout(100);
    await page.mouse.up();
    await page.waitForTimeout(800);

    const logText = await page.getByTestId("event-log").textContent();
    const log: string[] = JSON.parse(logText!);

    expect(log).toContain("mousedown");
    expect(log).toContain("mouseup");

    const downIdx = log.indexOf("mousedown");
    const upIdx = log.indexOf("mouseup");
    expect(downIdx).toBeLessThan(upIdx);
  });

  test("마커 touchstart/touchend 이벤트가 호출된다", async ({ page }) => {
    await page.getByTestId("trigger-touchstart").click();
    await page.getByTestId("trigger-touchend").click();
    await page.waitForTimeout(500);

    const logText = await page.getByTestId("event-log").textContent();
    const log: string[] = JSON.parse(logText!);

    expect(log).toContain("touchstart");
    expect(log).toContain("touchend");
  });

  test("마커 드래그 → onDragStart → onDragEnd 순서 보장", async ({ page }) => {
    const markerEl = page.getByTestId("marker-element");
    const box = await markerEl.boundingBox();
    expect(box).not.toBeNull();

    const cx = box!.x + box!.width / 2;
    const cy = box!.y + box!.height / 2;

    await page.mouse.move(cx, cy);
    await page.mouse.down();
    await page.mouse.move(cx + 100, cy + 100, { steps: 15 });
    await page.mouse.up();
    await page.waitForTimeout(1500);

    const logText = await page.getByTestId("event-log").textContent();
    const log: string[] = JSON.parse(logText!);

    expect(log).toContain("dragstart");
    expect(log).toContain("dragend");

    const dragStartIdx = log.indexOf("dragstart");
    const dragEndIdx = log.indexOf("dragend");
    expect(dragStartIdx).toBeLessThan(dragEndIdx);
  });

  test("드래그 후 onPositionChanged 호출", async ({ page }) => {
    const markerEl = page.getByTestId("marker-element");
    const box = await markerEl.boundingBox();
    expect(box).not.toBeNull();

    const cx = box!.x + box!.width / 2;
    const cy = box!.y + box!.height / 2;

    await page.mouse.move(cx, cy);
    await page.mouse.down();
    await page.mouse.move(cx + 80, cy + 80, { steps: 10 });
    await page.mouse.up();
    await page.waitForTimeout(1500);

    const logText = await page.getByTestId("event-log").textContent();
    const log: string[] = JSON.parse(logText!);

    expect(log).toContain("positionchanged");
  });
});

/* ─── 5. Ref 기반 imperative 동작 ─── */

test.describe("5. Ref 기반 imperative 동작", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/marker/ref");
    await expect(page.getByTestId("map-ready")).toHaveText("true", { timeout: MAP_LOAD_TIMEOUT });
    await page.waitForTimeout(1000);
  });

  test("ref.setPosition() → 위치 변경", async ({ page }) => {
    await page.getByTestId("ref-set-position").click();
    await page.waitForTimeout(1000);

    await page.getByTestId("ref-read-state").click();
    await page.waitForTimeout(500);

    const posText = await page.getByTestId("ref-position").textContent();
    expect(posText).toBeTruthy();
    const pos = JSON.parse(posText!);

    expect(pos.lat).toBeCloseTo(MARKER_POS_2.lat, 2);
    expect(pos.lng).toBeCloseTo(MARKER_POS_2.lng, 2);
  });

  test("ref.setVisible(false/true) → 가시성 토글", async ({ page }) => {
    await page.getByTestId("ref-set-visible-false").click();
    await page.waitForTimeout(500);

    await page.getByTestId("ref-read-state").click();
    await page.waitForTimeout(500);

    await expect(page.getByTestId("ref-visible")).toHaveText("false");

    await page.getByTestId("ref-set-visible-true").click();
    await page.waitForTimeout(500);

    await page.getByTestId("ref-read-state").click();
    await page.waitForTimeout(500);

    await expect(page.getByTestId("ref-visible")).toHaveText("true");
  });

  test("ref.setDraggable() → 즉시 반영", async ({ page }) => {
    await page.getByTestId("ref-set-draggable").click();
    await page.waitForTimeout(500);

    await page.getByTestId("ref-read-state").click();
    await page.waitForTimeout(500);

    await expect(page.getByTestId("ref-draggable")).toHaveText("true");
  });

  test("ref.setClickable/setTitle/setCursor/setZIndex 반영", async ({ page }) => {
    await page.getByTestId("ref-set-clickable").click();
    await page.getByTestId("ref-set-title").click();
    await page.getByTestId("ref-set-cursor").click();
    await page.getByTestId("ref-set-zindex").click();
    await page.waitForTimeout(500);

    await page.getByTestId("ref-read-state").click();
    await page.waitForTimeout(500);

    await expect(page.getByTestId("ref-clickable")).toHaveText("true");
    await expect(page.getByTestId("ref-title")).toHaveText("ref-title");
    await expect(page.getByTestId("ref-cursor")).toHaveText("crosshair");
    await expect(page.getByTestId("ref-zindex")).toHaveText("777");
  });

  test("ref.setIcon/setShape 반영", async ({ page }) => {
    await page.getByTestId("ref-set-icon").click();
    await page.getByTestId("ref-set-shape").click();
    await page.waitForTimeout(500);

    await page.getByTestId("ref-read-state").click();
    await page.waitForTimeout(500);

    await expect(page.getByTestId("ref-icon-kind")).toHaveText("icon-b");
    await expect(page.getByTestId("ref-shape-kind")).toHaveText("poly:8");
  });

  test("ref.setOptions로 title/cursor를 동시 변경", async ({ page }) => {
    await page.getByTestId("ref-set-options").click();
    await page.waitForTimeout(500);

    await page.getByTestId("ref-read-state").click();
    await page.waitForTimeout(500);

    await expect(page.getByTestId("ref-title")).toHaveText("options-title");
    await expect(page.getByTestId("ref-cursor")).toHaveText("pointer");
  });

  test("ref.getMap/getElement/getDrawingRect/getOptions 값을 읽을 수 있다", async ({ page }) => {
    await page.getByTestId("ref-read-state").click();
    await page.waitForTimeout(500);

    await expect(page.getByTestId("ref-map-bound")).toHaveText("true");
    await expect(page.getByTestId("ref-element-exists")).toHaveText("true");
    await expect(page.getByTestId("ref-drawing-rect-exists")).toHaveText("true");
    await expect(page.getByTestId("ref-options-exists")).toHaveText("true");
  });

  test("ref 초기 상태값이 props와 일치", async ({ page }) => {
    await page.getByTestId("ref-read-state").click();
    await page.waitForTimeout(500);

    const posText = await page.getByTestId("ref-position").textContent();
    expect(posText).toBeTruthy();
    const pos = JSON.parse(posText!);

    expect(pos.lat).toBeCloseTo(MARKER_POS_1.lat, 2);
    expect(pos.lng).toBeCloseTo(MARKER_POS_1.lng, 2);

    await expect(page.getByTestId("ref-visible")).toHaveText("true");
    await expect(page.getByTestId("ref-draggable")).toHaveText("false");
    await expect(page.getByTestId("ref-clickable")).toHaveText("false");
    await expect(page.getByTestId("ref-title")).toHaveText("초기 타이틀");
  });
});

/* ─── 6. 복수 마커 / 동적 추가·제거 ─── */

test.describe("6. 복수 마커 / 동적 추가·제거", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/marker/multiple");
    await expect(page.getByTestId("map-ready")).toHaveText("true", { timeout: MAP_LOAD_TIMEOUT });
    await page.waitForTimeout(2000);
  });

  test("마커 3개 동시 렌더링 → onMarkerReady가 최소 3회 호출된다", async ({ page }) => {
    // StrictMode에서 effect 이중 실행으로 카운트가 N보다 클 수 있음
    const countText = await page.getByTestId("marker-ready-count").textContent();
    expect(Number(countText)).toBeGreaterThanOrEqual(3);
    await expect(page.getByTestId("marker-count")).toHaveText("3");
  });

  test("마커 동적 추가 → 카운트 증가", async ({ page }) => {
    const beforeText = await page.getByTestId("marker-ready-count").textContent();
    const beforeCount = Number(beforeText);

    await page.getByTestId("add-marker").click();
    await page.waitForTimeout(1000);

    await expect(page.getByTestId("marker-count")).toHaveText("4");

    const afterText = await page.getByTestId("marker-ready-count").textContent();
    const afterCount = Number(afterText);
    expect(afterCount).toBeGreaterThan(beforeCount);
  });

  test("마커 동적 제거 → onMarkerDestroy 호출", async ({ page }) => {
    await page.getByTestId("remove-last").click();
    await page.waitForTimeout(1000);

    await expect(page.getByTestId("marker-count")).toHaveText("2");

    const destroyCountText = await page.getByTestId("marker-destroy-count").textContent();
    expect(Number(destroyCountText)).toBeGreaterThanOrEqual(1);
  });
});
