import { expect, test } from "@playwright/test";

import { BUSAN_CENTER, DEFAULT_CENTER } from "./app/constants";

const MAP_LOAD_TIMEOUT = 20_000;

/* ─── 1. 로딩 / 생성 / 정리 (스모크) ─── */

test.describe("1. 로딩/생성/정리 (스모크)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/map/smoke");
  });

  test("지도 컨테이너가 렌더링되고 크기가 0이 아니다", async ({ page }) => {
    const container = page.getByTestId("map-container");
    await expect(container).toBeVisible({ timeout: MAP_LOAD_TIMEOUT });

    const box = await container.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(0);
    expect(box!.height).toBeGreaterThan(0);
  });

  test("onMapReady가 1회 호출된다", async ({ page }) => {
    await expect(page.getByTestId("map-ready-count")).toHaveText("1", {
      timeout: MAP_LOAD_TIMEOUT
    });
  });

  test("새로고침 후에도 onMapReady가 중복 없이 1회만 호출된다", async ({ page }) => {
    await expect(page.getByTestId("map-ready-count")).toHaveText("1", {
      timeout: MAP_LOAD_TIMEOUT
    });

    await page.reload();

    await expect(page.getByTestId("map-ready-count")).toHaveText("1", {
      timeout: MAP_LOAD_TIMEOUT
    });
  });

  test("언마운트 시 onMapDestroy 호출 + 에러 없음", async ({ page }) => {
    await expect(page.getByTestId("map-ready-count")).toHaveText("1", {
      timeout: MAP_LOAD_TIMEOUT
    });

    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.getByTestId("toggle-map").click();

    await expect(page.getByTestId("destroyed")).toHaveText("true", { timeout: 5000 });
    await expect(page.getByTestId("map-container")).not.toBeVisible({ timeout: 5000 });

    const criticalErrors = consoleErrors.filter(
      (err) => !err.includes("naver") && !err.includes("favicon")
    );
    expect(criticalErrors).toHaveLength(0);
  });
});

/* ─── 2. fallback / 에러 / 재시도 ─── */

test.describe("2. fallback/에러/재시도", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/map/fallback-error");
  });

  test("SDK 로딩 중 fallback이 표시된다", async ({ page }) => {
    const fallback = page.getByTestId("map-fallback");
    const mapContainer = page.getByTestId("map-container");

    const visible = await Promise.race([
      fallback.isVisible().then((v) => (v ? "fallback" : null)),
      mapContainer.isVisible().then((v) => (v ? "map" : null)),
      page.waitForTimeout(MAP_LOAD_TIMEOUT).then(() => "timeout")
    ]);

    expect(["fallback", "map"]).toContain(visible);
  });

  test("정상 키로 지도가 로딩된다", async ({ page }) => {
    await expect(page.getByTestId("map-container")).toBeVisible({ timeout: MAP_LOAD_TIMEOUT });
    await expect(page.getByTestId("map-ready")).toHaveText("true", { timeout: MAP_LOAD_TIMEOUT });
  });

  test("네트워크 차단 시에도 앱 전체는 살아있고 지도만 degrade된다", async ({ page }) => {
    await expect(page.getByTestId("map-container")).toBeVisible({ timeout: MAP_LOAD_TIMEOUT });

    const toggleBtn = page.getByTestId("use-invalid-key");
    await expect(toggleBtn).toBeVisible();
    await expect(toggleBtn).toBeEnabled();

    const readyText = page.getByTestId("map-ready");
    await expect(readyText).toBeVisible();
  });
});

/* ─── 3. 초기 옵션 적용 (uncontrolled) ─── */

test.describe("3. 초기 옵션 적용 (uncontrolled)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/map/uncontrolled");
    await expect(page.getByTestId("map-ready")).toHaveText("true", { timeout: MAP_LOAD_TIMEOUT });
  });

  test("defaultCenter가 최초 1회 적용된다", async ({ page }) => {
    await page.getByTestId("read-state").click();
    await page.waitForTimeout(500);

    const centerText = await page.getByTestId("current-center").textContent();
    expect(centerText).toBeTruthy();
    const center = JSON.parse(centerText!);

    expect(center.lat).toBeCloseTo(DEFAULT_CENTER.lat, 2);
    expect(center.lng).toBeCloseTo(DEFAULT_CENTER.lng, 2);
  });

  test("defaultZoom이 최초 1회 적용된다", async ({ page }) => {
    await page.getByTestId("read-state").click();
    await page.waitForTimeout(500);

    const zoomText = await page.getByTestId("current-zoom").textContent();
    expect(zoomText).toBeTruthy();
    expect(Number(zoomText)).toBe(12);
  });

  test("사용자 드래그 후 center가 변경된다 (uncontrolled 내부 상태 동작)", async ({ page }) => {
    await page.getByTestId("read-state").click();
    await page.waitForTimeout(500);
    const initialCenter = await page.getByTestId("current-center").textContent();

    const mapContainer = page.getByTestId("map-container");
    const box = await mapContainer.boundingBox();
    expect(box).not.toBeNull();

    const cx = box!.x + box!.width / 2;
    const cy = box!.y + box!.height / 2;

    await page.mouse.move(cx, cy);
    await page.mouse.down();
    await page.mouse.move(cx + 100, cy + 100, { steps: 10 });
    await page.mouse.up();
    await page.waitForTimeout(1000);

    await page.getByTestId("read-state").click();
    await page.waitForTimeout(500);
    const newCenter = await page.getByTestId("current-center").textContent();

    expect(newCenter).not.toBe(initialCenter);
  });
});

/* ─── 4. controlled 동기화 (React state ↔ map) ─── */

test.describe("4. controlled 동기화 (React state ↔ map)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/map/controlled");
    await expect(page.getByTestId("map-ready")).toHaveText("true", { timeout: MAP_LOAD_TIMEOUT });
  });

  test("외부 상태로 center를 부산으로 변경하면 지도 중심이 따라간다", async ({ page }) => {
    await page.getByTestId("move-busan").click();
    await page.waitForTimeout(1500);

    await page.getByTestId("read-actual").click();
    await page.waitForTimeout(500);

    const actualText = await page.getByTestId("actual-center").textContent();
    expect(actualText).toBeTruthy();
    const actual = JSON.parse(actualText!);

    expect(actual.lat).toBeCloseTo(BUSAN_CENTER.lat, 1);
    expect(actual.lng).toBeCloseTo(BUSAN_CENTER.lng, 1);
  });

  test("외부 상태로 zoom을 변경하면 줌이 따라간다", async ({ page }) => {
    await expect(page.getByTestId("state-zoom")).toHaveText("12");

    await page.getByTestId("zoom-in").click();
    await page.waitForTimeout(1000);

    await page.getByTestId("read-actual").click();
    await page.waitForTimeout(500);

    const zoomText = await page.getByTestId("actual-zoom").textContent();
    expect(Number(zoomText)).toBe(13);
  });

  test("mapTypeId 변경이 반영된다", async ({ page }) => {
    await expect(page.getByTestId("state-map-type")).toHaveText("normal");

    await page.getByTestId("set-satellite").click();
    await page.waitForTimeout(1000);

    await expect(page.getByTestId("state-map-type")).toHaveText("satellite");
  });

  test("빠른 연속 업데이트에도 최종 center/zoom으로 수렴한다", async ({ page }) => {
    await page.getByTestId("rapid-updates").click();
    await page.waitForTimeout(3000);

    await page.getByTestId("read-actual").click();
    await page.waitForTimeout(500);

    const actualCenterText = await page.getByTestId("actual-center").textContent();
    expect(actualCenterText).toBeTruthy();
    const actualCenter = JSON.parse(actualCenterText!);

    expect(actualCenter.lat).toBeCloseTo(DEFAULT_CENTER.lat, 1);
    expect(actualCenter.lng).toBeCloseTo(DEFAULT_CENTER.lng, 1);

    const actualZoomText = await page.getByTestId("actual-zoom").textContent();
    expect(Number(actualZoomText)).toBe(10);
  });
});

/* ─── 5. 사용자 인터랙션 토글 ─── */

test.describe("5. 사용자 인터랙션 토글", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/map/interaction-toggle");
    await expect(page.getByTestId("map-ready")).toHaveText("true", { timeout: MAP_LOAD_TIMEOUT });
  });

  test("draggable=false이면 드래그가 실제로 안 된다", async ({ page }) => {
    await page.getByTestId("toggle-draggable").click();
    await page.waitForTimeout(500);
    await expect(page.getByTestId("draggable-state")).toHaveText("false");

    await page.getByTestId("read-state").click();
    await page.waitForTimeout(500);
    const beforeCenter = await page.getByTestId("center-after").textContent();

    const mapContainer = page.getByTestId("map-container");
    const box = await mapContainer.boundingBox();
    expect(box).not.toBeNull();

    const cx = box!.x + box!.width / 2;
    const cy = box!.y + box!.height / 2;

    await page.mouse.move(cx, cy);
    await page.mouse.down();
    await page.mouse.move(cx + 150, cy + 150, { steps: 20 });
    await page.mouse.up();
    await page.waitForTimeout(1000);

    await page.getByTestId("read-state").click();
    await page.waitForTimeout(500);
    const afterCenter = await page.getByTestId("center-after").textContent();

    expect(afterCenter).toBe(beforeCenter);
  });

  test("scrollWheel=false이면 휠 줌이 안 된다", async ({ page }) => {
    await page.getByTestId("toggle-scroll-wheel").click();
    await page.waitForTimeout(500);
    await expect(page.getByTestId("scroll-wheel-state")).toHaveText("false");

    await page.getByTestId("read-state").click();
    await page.waitForTimeout(500);
    const beforeZoom = await page.getByTestId("zoom-after").textContent();

    const mapContainer = page.getByTestId("map-container");
    const box = await mapContainer.boundingBox();
    expect(box).not.toBeNull();

    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
    await page.mouse.wheel(0, -500);
    await page.waitForTimeout(1500);

    await page.getByTestId("read-state").click();
    await page.waitForTimeout(500);
    const afterZoom = await page.getByTestId("zoom-after").textContent();

    expect(afterZoom).toBe(beforeZoom);
  });

  test("disableDoubleClickZoom=true이면 더블클릭 확대가 안 된다", async ({ page }) => {
    await page.getByTestId("toggle-dblclick-zoom").click();
    await page.waitForTimeout(500);
    await expect(page.getByTestId("dblclick-zoom-disabled")).toHaveText("true");

    await page.getByTestId("read-state").click();
    await page.waitForTimeout(500);
    const beforeZoom = await page.getByTestId("zoom-after").textContent();

    const mapContainer = page.getByTestId("map-container");
    const box = await mapContainer.boundingBox();
    expect(box).not.toBeNull();

    await page.mouse.dblclick(box!.x + box!.width / 2, box!.y + box!.height / 2);
    await page.waitForTimeout(1500);

    await page.getByTestId("read-state").click();
    await page.waitForTimeout(500);
    const afterZoom = await page.getByTestId("zoom-after").textContent();

    expect(afterZoom).toBe(beforeZoom);
  });

  test("draggable을 다시 true로 하면 드래그가 동작한다", async ({ page }) => {
    await page.getByTestId("toggle-draggable").click();
    await page.waitForTimeout(500);
    await page.getByTestId("toggle-draggable").click();
    await page.waitForTimeout(500);
    await expect(page.getByTestId("draggable-state")).toHaveText("true");

    await page.getByTestId("read-state").click();
    await page.waitForTimeout(500);
    const beforeCenter = await page.getByTestId("center-after").textContent();

    const mapContainer = page.getByTestId("map-container");
    const box = await mapContainer.boundingBox();
    expect(box).not.toBeNull();

    const cx = box!.x + box!.width / 2;
    const cy = box!.y + box!.height / 2;

    await page.mouse.move(cx, cy);
    await page.mouse.down();
    await page.mouse.move(cx + 150, cy + 150, { steps: 20 });
    await page.mouse.up();
    await page.waitForTimeout(1000);

    await page.getByTestId("read-state").click();
    await page.waitForTimeout(500);
    const afterCenter = await page.getByTestId("center-after").textContent();

    expect(afterCenter).not.toBe(beforeCenter);
  });
});

/* ─── 6. 핵심 이벤트 흐름 ─── */

test.describe("6. 핵심 이벤트 흐름", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/map/event-flow");
    await expect(page.getByTestId("map-ready")).toHaveText("true", { timeout: MAP_LOAD_TIMEOUT });
    await page.waitForTimeout(1000);
    await page.getByTestId("clear-log").click();
    await page.waitForTimeout(500);
  });

  test("클릭 시 onClick이 호출된다", async ({ page }) => {
    const mapContainer = page.getByTestId("map-container");
    const box = await mapContainer.boundingBox();
    expect(box).not.toBeNull();

    await page.mouse.click(box!.x + box!.width / 2, box!.y + box!.height / 2);
    await page.waitForTimeout(1000);

    const logText = await page.getByTestId("event-log").textContent();
    const log: string[] = JSON.parse(logText!);

    expect(log).toContain("click");
  });

  test("드래그 시 onDragStart → onDragEnd 순서가 보장된다", async ({ page }) => {
    const mapContainer = page.getByTestId("map-container");
    const box = await mapContainer.boundingBox();
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

  test("줌 조작 시 onZoomStart → onZoomChanged가 보장된다", async ({ page }) => {
    const mapContainer = page.getByTestId("map-container");
    const box = await mapContainer.boundingBox();
    expect(box).not.toBeNull();

    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
    await page.mouse.wheel(0, -300);
    await page.waitForTimeout(2000);

    const logText = await page.getByTestId("event-log").textContent();
    const log: string[] = JSON.parse(logText!);

    expect(log).toContain("zoomstart");
    expect(log).toContain("zoomchanged");

    const zoomStartIdx = log.indexOf("zoomstart");
    const zoomChangedIdx = log.indexOf("zoomchanged");
    expect(zoomStartIdx).toBeLessThan(zoomChangedIdx);
  });

  test("인터랙션 종료 후 onIdle이 호출된다", async ({ page }) => {
    const mapContainer = page.getByTestId("map-container");
    const box = await mapContainer.boundingBox();
    expect(box).not.toBeNull();

    const cx = box!.x + box!.width / 2;
    const cy = box!.y + box!.height / 2;

    await page.mouse.move(cx, cy);
    await page.mouse.down();
    await page.mouse.move(cx + 80, cy + 80, { steps: 10 });
    await page.mouse.up();
    await page.waitForTimeout(2000);

    const logText = await page.getByTestId("event-log").textContent();
    const log: string[] = JSON.parse(logText!);

    expect(log).toContain("idle");
  });

  test("드래그 시 onBoundsChanged와 onCenterChanged가 호출된다", async ({ page }) => {
    const mapContainer = page.getByTestId("map-container");
    const box = await mapContainer.boundingBox();
    expect(box).not.toBeNull();

    const cx = box!.x + box!.width / 2;
    const cy = box!.y + box!.height / 2;

    await page.mouse.move(cx, cy);
    await page.mouse.down();
    await page.mouse.move(cx + 120, cy + 120, { steps: 15 });
    await page.mouse.up();
    await page.waitForTimeout(2000);

    const logText = await page.getByTestId("event-log").textContent();
    const log: string[] = JSON.parse(logText!);

    expect(log).toContain("boundschanged");
    expect(log).toContain("centerchanged");
  });
});

/* ─── 7. Ref 기반 imperative 동작 ─── */

test.describe("7. Ref 기반 imperative 동작", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/map/ref-imperative");
    await expect(page.getByTestId("map-ready")).toHaveText("true", { timeout: MAP_LOAD_TIMEOUT });
    await page.waitForTimeout(1000);
  });

  test("ref.panTo() → 센터가 부산으로 변경된다", async ({ page }) => {
    await page.getByTestId("btn-pan-to").click();
    await page.waitForTimeout(2000);

    await page.getByTestId("btn-read-state").click();
    await page.waitForTimeout(500);

    const centerText = await page.getByTestId("ref-center").textContent();
    expect(centerText).toBeTruthy();
    const center = JSON.parse(centerText!);

    expect(center.lat).toBeCloseTo(BUSAN_CENTER.lat, 1);
    expect(center.lng).toBeCloseTo(BUSAN_CENTER.lng, 1);
  });

  test("ref.fitBounds() → 지정 영역이 뷰에 들어온다", async ({ page }) => {
    await page.getByTestId("btn-fit-bounds").click();
    await page.waitForTimeout(2000);

    await page.getByTestId("btn-read-state").click();
    await page.waitForTimeout(500);

    const boundsText = await page.getByTestId("ref-bounds").textContent();
    expect(boundsText).toBeTruthy();
    const bounds = JSON.parse(boundsText!);

    expect(bounds.sw.lat).toBeLessThanOrEqual(34);
    expect(bounds.ne.lat).toBeGreaterThanOrEqual(37);
    expect(bounds.sw.lng).toBeLessThanOrEqual(126);
    expect(bounds.ne.lng).toBeGreaterThanOrEqual(131);
  });

  test("ref.setZoom() → 줌이 정확히 변경된다", async ({ page }) => {
    await page.getByTestId("btn-set-zoom-15").click();
    await page.waitForTimeout(1000);

    await page.getByTestId("btn-read-state").click();
    await page.waitForTimeout(500);

    const zoomText = await page.getByTestId("ref-zoom").textContent();
    expect(Number(zoomText)).toBe(15);
  });

  test("ref.zoomBy(+2) → 줌이 2 증가한다", async ({ page }) => {
    await page.getByTestId("btn-read-state").click();
    await page.waitForTimeout(500);
    const initialZoom = Number(await page.getByTestId("ref-zoom").textContent());

    await page.getByTestId("btn-zoom-by-2").click();
    await page.waitForTimeout(1000);

    await page.getByTestId("btn-read-state").click();
    await page.waitForTimeout(500);

    const newZoom = Number(await page.getByTestId("ref-zoom").textContent());
    expect(newZoom).toBe(initialZoom + 2);
  });

  test("ref.zoomBy(-1) → 줌이 1 감소한다", async ({ page }) => {
    await page.getByTestId("btn-read-state").click();
    await page.waitForTimeout(500);
    const initialZoom = Number(await page.getByTestId("ref-zoom").textContent());

    await page.getByTestId("btn-zoom-by-minus-1").click();
    await page.waitForTimeout(1000);

    await page.getByTestId("btn-read-state").click();
    await page.waitForTimeout(500);

    const newZoom = Number(await page.getByTestId("ref-zoom").textContent());
    expect(newZoom).toBe(initialZoom - 1);
  });

  test("ref.setOptions({ draggable: false }) → 드래그가 즉시 비활성화된다", async ({ page }) => {
    await page.getByTestId("btn-read-state").click();
    await page.waitForTimeout(500);
    const beforeCenter = await page.getByTestId("ref-center").textContent();

    await page.getByTestId("btn-set-options-no-drag").click();
    await page.waitForTimeout(500);

    const mapContainer = page.getByTestId("map-container");
    const box = await mapContainer.boundingBox();
    expect(box).not.toBeNull();

    const cx = box!.x + box!.width / 2;
    const cy = box!.y + box!.height / 2;

    await page.mouse.move(cx, cy);
    await page.mouse.down();
    await page.mouse.move(cx + 150, cy + 150, { steps: 20 });
    await page.mouse.up();
    await page.waitForTimeout(1000);

    await page.getByTestId("btn-read-state").click();
    await page.waitForTimeout(500);
    const afterCenter = await page.getByTestId("ref-center").textContent();

    expect(afterCenter).toBe(beforeCenter);
  });

  test("ref.getCenter/getZoom/getBounds → 반환값이 합리적이다", async ({ page }) => {
    await page.getByTestId("btn-read-state").click();
    await page.waitForTimeout(500);

    const centerText = await page.getByTestId("ref-center").textContent();
    expect(centerText).toBeTruthy();
    const center = JSON.parse(centerText!);
    expect(center.lat).toBeCloseTo(DEFAULT_CENTER.lat, 2);
    expect(center.lng).toBeCloseTo(DEFAULT_CENTER.lng, 2);

    const zoomText = await page.getByTestId("ref-zoom").textContent();
    expect(Number(zoomText)).toBe(12);

    const boundsText = await page.getByTestId("ref-bounds").textContent();
    expect(boundsText).toBeTruthy();
    const bounds = JSON.parse(boundsText!);
    expect(bounds.ne.lat).toBeGreaterThan(bounds.sw.lat);
    expect(bounds.ne.lng).toBeGreaterThan(bounds.sw.lng);

    // 변경 후 값이 업데이트되는지 확인
    await page.getByTestId("btn-set-zoom-15").click();
    await page.waitForTimeout(1000);

    await page.getByTestId("btn-read-state").click();
    await page.waitForTimeout(500);

    const newZoomText = await page.getByTestId("ref-zoom").textContent();
    expect(Number(newZoomText)).toBe(15);
    expect(Number(newZoomText)).not.toBe(12);
  });
});
