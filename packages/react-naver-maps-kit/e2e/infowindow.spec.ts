import { expect, test } from "@playwright/test";

import { DEFAULT_CENTER, MARKER_POS_2 } from "./app/constants";

const MAP_LOAD_TIMEOUT = 20_000;

function parseLatLng(text: string | null): { lat: number; lng: number } {
  if (!text) {
    throw new Error("Expected lat/lng JSON text");
  }

  return JSON.parse(text) as { lat: number; lng: number };
}

function moveDistance(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  return Math.abs(a.lat - b.lat) + Math.abs(a.lng - b.lng);
}

function parsePoint(text: string | null): { x: number; y: number } {
  if (!text) {
    throw new Error("Expected point JSON text");
  }

  return JSON.parse(text) as { x: number; y: number };
}

function parseSize(text: string | null): { width: number; height: number } {
  if (!text) {
    throw new Error("Expected size JSON text");
  }

  return JSON.parse(text) as { width: number; height: number };
}

async function waitForMapReady(page: Parameters<typeof test>[0]["page"]): Promise<void> {
  await expect(page.getByTestId("map-ready")).toHaveText("true", {
    timeout: MAP_LOAD_TIMEOUT
  });
}

/* ─── IW-01, IW-05 ─── */

test.describe("InfoWindow 기본 렌더/우선순위", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/info-window/basic");
    await waitForMapReady(page);
  });

  test("IW-01: 기본 InfoWindow 렌더 + onOpen 호출", async ({ page }) => {
    await expect(page.getByTestId("info-content-node")).toBeVisible({ timeout: MAP_LOAD_TIMEOUT });

    await expect
      .poll(async () => Number(await page.getByTestId("info-open-count").textContent()))
      .toBeGreaterThanOrEqual(1);
  });

  test("IW-05: children이 content보다 우선된다", async ({ page }) => {
    await expect(page.getByTestId("info-content-node")).toContainText("children-first-content");
    await expect(page.getByText("content-should-not-be-shown")).toHaveCount(0);

    await page.getByTestId("read-state").click();
    await expect(page.getByTestId("info-content")).toContainText("children-first-content");
  });
});

/* ─── IW-02 ─── */

test.describe("InfoWindow visible 토글", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/info-window/visibility");
    await waitForMapReady(page);
  });

  test("IW-02: visible true→false→true 전환 및 open/close 카운트 증가", async ({ page }) => {
    const content = page.getByTestId("visibility-content");

    await expect(content).toBeVisible({ timeout: MAP_LOAD_TIMEOUT });

    const initialOpenCount = Number(await page.getByTestId("info-open-count").textContent());
    const initialCloseCount = Number(await page.getByTestId("info-close-count").textContent());

    await page.getByTestId("toggle-visible").click();
    await expect.poll(async () => content.isVisible()).toBe(false);

    await expect
      .poll(async () => Number(await page.getByTestId("info-close-count").textContent()))
      .toBeGreaterThan(initialCloseCount);

    await page.getByTestId("toggle-visible").click();
    await expect(content).toBeVisible({ timeout: MAP_LOAD_TIMEOUT });

    await expect
      .poll(async () => Number(await page.getByTestId("info-open-count").textContent()))
      .toBeGreaterThanOrEqual(initialOpenCount + 1);
  });
});

/* ─── IW-03, IW-04 ─── */

test.describe("InfoWindow marker 연동/anchor", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/info-window/marker-link");
    await waitForMapReady(page);
  });

  test("IW-03: 마커 선택 시 InfoWindow 내용이 해당 장소로 교체된다", async ({ page }) => {
    await expect(page.getByTestId("selected-place-content")).toContainText("서울시청");

    await page.getByTestId("place-marker-2").click();
    await expect(page.getByTestId("selected-place-content")).toContainText("강남역");

    await page.getByTestId("place-marker-3").click();
    await expect(page.getByTestId("selected-place-content")).toContainText("서울역");
  });

  test("IW-04: anchor 기반 InfoWindow가 마커 토글과 동기화된다", async ({ page }) => {
    const anchorInfo = page.getByTestId("anchor-info-content");

    await expect.poll(async () => anchorInfo.isVisible()).toBe(false);

    await page.getByTestId("anchor-marker").click();
    await expect(anchorInfo).toBeVisible({ timeout: MAP_LOAD_TIMEOUT });

    await page.getByTestId("toggle-anchor-info").click();
    await expect.poll(async () => anchorInfo.isVisible()).toBe(false);
  });
});

/* ─── IW-06 ─── */

test.describe("InfoWindow ref 제어", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/info-window/ref");
    await waitForMapReady(page);
  });

  test("IW-06: setContent/close/open이 동작한다", async ({ page }) => {
    await expect(page.getByTestId("ref-content")).toBeVisible({ timeout: MAP_LOAD_TIMEOUT });

    await page.getByTestId("ref-set-content").click();
    await expect(page.getByText("updated-by-ref-content")).toBeVisible({ timeout: MAP_LOAD_TIMEOUT });

    await page.getByTestId("ref-close").click();
    await expect(page.getByTestId("visible-state")).toHaveText("false");
    await expect.poll(async () => page.getByTestId("ref-content").isVisible()).toBe(false);

    await page.getByTestId("ref-open").click();
    await expect(page.getByTestId("visible-state")).toHaveText("true");
    await expect(page.getByTestId("ref-content")).toBeVisible({ timeout: MAP_LOAD_TIMEOUT });
  });

  test("누락 ref API: setPosition/setZIndex/setOptions 반영", async ({ page }) => {
    await page.getByTestId("ref-set-position-2").click();
    await page.getByTestId("ref-set-zindex-321").click();
    await page.getByTestId("ref-set-options-batch").click();
    await expect
      .poll(async () => {
        await page.getByTestId("read-state").click();
        const positionText = await page.getByTestId("info-position").textContent();
        const pos = parseLatLng(positionText);
        return (
          Math.abs(pos.lat - MARKER_POS_2.lat) < 0.01 &&
          Math.abs(pos.lng - MARKER_POS_2.lng) < 0.01
        );
      })
      .toBe(true);

    await expect(page.getByTestId("ref-zindex")).toHaveText("321");
    await expect(page.getByTestId("ref-opt-max-width")).toHaveText("360");
    await expect(page.getByTestId("ref-opt-disable-anchor")).toHaveText("true");
  });

  test("누락 ref API: getContentElement/getMap/getPanes/getProjection", async ({ page }) => {
    await page.getByTestId("read-state").click();

    await expect(page.getByTestId("ref-content-element-exists")).toHaveText("true");
    await expect(page.getByTestId("ref-map-bound")).toHaveText("true");
    await expect(page.getByTestId("ref-panes-exists")).toHaveText("true");
    await expect(page.getByTestId("ref-projection-exists")).toHaveText("true");
  });

  test("누락 ref API: setMap(null)/setMap(map) 전환", async ({ page }) => {
    await page.getByTestId("ref-set-map-null").click();
    await page.getByTestId("read-state").click();
    await expect(page.getByTestId("ref-map-bound")).toHaveText("false");

    await page.getByTestId("ref-set-map-instance").click();
    await page.getByTestId("read-state").click();
    await expect(page.getByTestId("ref-map-bound")).toHaveText("true");
    await expect(page.getByTestId("ref-content")).toBeVisible({ timeout: MAP_LOAD_TIMEOUT });
  });
});

/* ─── IW-07 ─── */

test.describe("InfoWindow 라이프사이클", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/info-window/lifecycle");
    await waitForMapReady(page);
  });

  test("IW-07: onInfoWindowReady/Destroy 호출 + 치명 에러 없음", async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await expect
      .poll(async () => Number(await page.getByTestId("info-ready-count").textContent()))
      .toBeGreaterThanOrEqual(1);

    await page.getByTestId("toggle-infowindow").click();
    await expect(page.getByTestId("show-infowindow")).toHaveText("false");
    await expect(page.getByTestId("info-destroyed")).toHaveText("true");

    const criticalErrors = consoleErrors.filter(
      (err) => !err.includes("naver") && !err.includes("favicon")
    );
    expect(criticalErrors).toHaveLength(0);
  });
});

/* ─── IW-08, IW-09, IW-10 ─── */

test.describe("InfoWindow 옵션/이벤트", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/info-window/options");
    await waitForMapReady(page);
  });

  test("IW-08: maxWidth/borderWidth/anchorSkew 옵션 반영", async ({ page }) => {
    await page.getByTestId("set-max-width-320").click();
    await page.getByTestId("set-border-width-4").click();
    await page.getByTestId("toggle-anchor-skew").click();

    await page.getByTestId("read-state").click();

    await expect(page.getByTestId("opt-max-width")).toHaveText("320");
    await expect(page.getByTestId("opt-border-width")).toHaveText("4");
    await expect(page.getByTestId("opt-anchor-skew")).toHaveText("true");
  });

  test("IW-09: position 갱신 + onPositionChanged 이벤트", async ({ page }) => {
    await page.getByTestId("move-position-2").click();
    await page.getByTestId("read-state").click();

    await expect
      .poll(async () => Number(await page.getByTestId("evt-position-changed-count").textContent()))
      .toBeGreaterThanOrEqual(1);

    const positionText = await page.getByTestId("opt-position").textContent();
    const pos = parseLatLng(positionText);

    expect(pos.lat).toBeCloseTo(MARKER_POS_2.lat, 2);
    expect(pos.lng).toBeCloseTo(MARKER_POS_2.lng, 2);
  });

  test("IW-10: content/zIndex 변경 시 onContentChanged/onZIndexChanged 이벤트", async ({ page }) => {
    await page.getByTestId("set-content-2").click();
    await page.getByTestId("set-zindex-777").click();
    await page.getByTestId("read-state").click();

    await expect
      .poll(async () => Number(await page.getByTestId("evt-content-changed-count").textContent()))
      .toBeGreaterThanOrEqual(1);

    await expect
      .poll(async () => Number(await page.getByTestId("evt-zindex-changed-count").textContent()))
      .toBeGreaterThanOrEqual(1);

    await expect(page.getByTestId("info-content")).toContainText("option-content-2");
  });

  test("누락 옵션 이벤트: anchor/background/border/disable/pixelOffset 변경 이벤트", async ({
    page
  }) => {
    await page.getByTestId("set-anchor-color-red").click();
    await page.getByTestId("set-anchor-size-large").click();
    await page.getByTestId("set-background-dark").click();
    await page.getByTestId("set-border-color-blue").click();
    await page.getByTestId("toggle-disable-anchor").click();
    await page.getByTestId("toggle-disable-autopan").click();
    await page.getByTestId("set-pixel-offset-30").click();

    await expect
      .poll(async () => Number(await page.getByTestId("evt-anchor-color-changed-count").textContent()))
      .toBeGreaterThanOrEqual(1);
    await expect
      .poll(async () => Number(await page.getByTestId("evt-anchor-size-changed-count").textContent()))
      .toBeGreaterThanOrEqual(1);
    await expect
      .poll(async () => Number(await page.getByTestId("evt-background-color-changed-count").textContent()))
      .toBeGreaterThanOrEqual(1);
    await expect
      .poll(async () => Number(await page.getByTestId("evt-border-color-changed-count").textContent()))
      .toBeGreaterThanOrEqual(1);
    await expect
      .poll(async () => Number(await page.getByTestId("evt-disable-anchor-changed-count").textContent()))
      .toBeGreaterThanOrEqual(1);
    await expect
      .poll(async () => Number(await page.getByTestId("evt-disable-autopan-changed-count").textContent()))
      .toBeGreaterThanOrEqual(1);
    await expect
      .poll(async () => Number(await page.getByTestId("evt-pixel-offset-changed-count").textContent()))
      .toBeGreaterThanOrEqual(1);
  });

  test("누락 옵션 getter: anchorColor/anchorSize/background/border/disable/pixelOffset", async ({
    page
  }) => {
    await page.getByTestId("set-anchor-color-red").click();
    await page.getByTestId("set-anchor-size-large").click();
    await page.getByTestId("set-background-dark").click();
    await page.getByTestId("set-border-color-blue").click();
    await page.getByTestId("toggle-disable-anchor").click();
    await page.getByTestId("toggle-disable-autopan").click();
    await page.getByTestId("set-pixel-offset-30").click();
    await page.getByTestId("read-state").click();

    await expect(page.getByTestId("opt-anchor-color")).toHaveText("#ff0000");
    await expect(page.getByTestId("opt-background-color")).toHaveText("#111111");
    await expect(page.getByTestId("opt-border-color")).toHaveText("#1d4ed8");
    await expect(page.getByTestId("opt-disable-anchor")).toHaveText("true");
    await expect(page.getByTestId("opt-disable-autopan")).toHaveText("true");

    const anchorSize = parseSize(await page.getByTestId("opt-anchor-size").textContent());
    expect(anchorSize.width).toBe(28);
    expect(anchorSize.height).toBe(16);

    const pixelOffset = parsePoint(await page.getByTestId("opt-pixel-offset").textContent());
    expect(pixelOffset.x).toBe(30);
    expect(pixelOffset.y).toBe(-30);
  });

  test("옵션 변경 후 map center 로그가 유효 좌표를 유지한다", async ({ page }) => {
    await page.getByTestId("read-state").click();
    const before = parseLatLng(await page.getByTestId("map-center").textContent());

    await page.getByTestId("set-max-width-320").click();
    await page.getByTestId("set-content-2").click();
    await page.getByTestId("read-state").click();

    const after = parseLatLng(await page.getByTestId("map-center").textContent());

    expect(before.lat).toBeCloseTo(DEFAULT_CENTER.lat, 1);
    expect(before.lng).toBeCloseTo(DEFAULT_CENTER.lng, 1);
    expect(after.lat).toBeCloseTo(before.lat, 1);
    expect(after.lng).toBeCloseTo(before.lng, 1);
  });
});

/* ─── IW-11, IW-12 ─── */

test.describe("InfoWindow 자동 패닝", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/info-window/autopan");
    await waitForMapReady(page);
  });

  test("IW-11: disableAutoPan=true면 중심 변화가 최소, false면 중심이 이동한다", async ({
    page
  }) => {
    await page.getByTestId("reset-center").click();
    await page.getByTestId("read-state").click();
    const baseCenter = parseLatLng(await page.getByTestId("map-center").textContent());

    await page.getByTestId("disable-autopan-true").click();
    await page.getByTestId("open-info").click();
    await expect(page.getByTestId("autopan-content")).toBeVisible({ timeout: MAP_LOAD_TIMEOUT });
    await page.getByTestId("read-state").click();
    const noPanCenter = parseLatLng(await page.getByTestId("map-center").textContent());
    const noPanDistance = moveDistance(baseCenter, noPanCenter);

    await page.getByTestId("close-info").click();
    await page.getByTestId("reset-center").click();
    await page.getByTestId("disable-autopan-false").click();
    await page.getByTestId("open-info").click();
    await expect(page.getByTestId("autopan-content")).toBeVisible({ timeout: MAP_LOAD_TIMEOUT });
    await page.getByTestId("read-state").click();
    const panCenter = parseLatLng(await page.getByTestId("map-center").textContent());
    const panDistance = moveDistance(baseCenter, panCenter);

    expect(noPanDistance).toBeLessThan(0.01);
    expect(panDistance).toBeGreaterThan(noPanDistance + 0.002);
  });

  test("IW-12: autoPanPadding 값에 따라 중심 이동량이 달라진다", async ({ page }) => {
    await page.getByTestId("disable-autopan-false").click();
    await page.getByTestId("reset-center").click();
    await page.getByTestId("read-state").click();
    const baseCenter = parseLatLng(await page.getByTestId("map-center").textContent());

    await page.getByTestId("set-padding-20").click();
    await page.getByTestId("open-info").click();
    await expect(page.getByTestId("autopan-content")).toBeVisible({ timeout: MAP_LOAD_TIMEOUT });
    await page.getByTestId("read-state").click();
    const padding20Center = parseLatLng(await page.getByTestId("map-center").textContent());
    const padding20Distance = moveDistance(baseCenter, padding20Center);

    await page.getByTestId("close-info").click();
    await page.getByTestId("reset-center").click();
    await page.getByTestId("set-padding-140").click();
    await page.getByTestId("open-info").click();
    await expect(page.getByTestId("autopan-content")).toBeVisible({ timeout: MAP_LOAD_TIMEOUT });
    await page.getByTestId("read-state").click();
    const padding140Center = parseLatLng(await page.getByTestId("map-center").textContent());
    const padding140Distance = moveDistance(baseCenter, padding140Center);

    expect(padding20Distance).toBeGreaterThan(0.001);
    expect(Math.abs(padding140Distance - padding20Distance)).toBeGreaterThan(0.0005);
  });
});
