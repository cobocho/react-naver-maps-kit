import { expect, test, type Page } from "@playwright/test";

const PANORAMA_LOAD_TIMEOUT = 20_000;

type LatLngLiteral = {
  lat: number;
  lng: number;
};

type PovLiteral = {
  pan: number | null;
  tilt: number | null;
  fov: number | null;
};

const POSITION_2 = { lat: 37.4981, lng: 127.0276 };
const POSITION_3 = { lat: 37.5547, lng: 126.9707 };

function expectValidKoreaCoord(pos: LatLngLiteral) {
  expect(Number.isFinite(pos.lat)).toBe(true);
  expect(Number.isFinite(pos.lng)).toBe(true);
  expect(pos.lat).toBeGreaterThan(30);
  expect(pos.lat).toBeLessThan(40);
  expect(pos.lng).toBeGreaterThan(120);
  expect(pos.lng).toBeLessThan(131);
}

async function readNumber(page: Page, testId: string): Promise<number> {
  const text = await page.getByTestId(testId).textContent();
  return Number(text ?? "0");
}

async function readLatLng(page: Page, testId: string): Promise<LatLngLiteral> {
  const text = await page.getByTestId(testId).textContent();
  if (!text) {
    throw new Error(`Missing lat/lng text: ${testId}`);
  }

  return JSON.parse(text) as LatLngLiteral;
}

async function readPov(page: Page, testId: string): Promise<PovLiteral> {
  const text = await page.getByTestId(testId).textContent();
  if (!text) {
    throw new Error(`Missing pov text: ${testId}`);
  }

  return JSON.parse(text) as PovLiteral;
}

/* ─── 1. basic ─── */

test.describe("1. basic", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/panorama/basic");
    await expect
      .poll(async () => readNumber(page, "panorama-ready-count"), {
        timeout: PANORAMA_LOAD_TIMEOUT
      })
      .toBeGreaterThanOrEqual(1);
  });

  test("PANO-01: Panorama 인스턴스 생성 후 ref 인스턴스/element가 존재한다", async ({ page }) => {
    await page.getByTestId("read-state").click();

    await expect(page.getByTestId("instance-exists")).toHaveText("true");
    await expect(page.getByTestId("element-exists")).toHaveText("true");
  });

  test("PANO-02: visible prop 토글이 ref.getVisible에 반영된다", async ({ page }) => {
    await page.getByTestId("toggle-visible-prop").click();
    await expect(page.getByTestId("visible-prop-state")).toHaveText("false");

    await page.getByTestId("read-state").click();
    await expect(page.getByTestId("ref-visible")).toHaveText("false");

    await page.getByTestId("toggle-visible-prop").click();
    await expect(page.getByTestId("visible-prop-state")).toHaveText("true");

    await page.getByTestId("read-state").click();
    await expect(page.getByTestId("ref-visible")).toHaveText("true");
  });
});

/* ─── 2. controlled ─── */

test.describe("2. controlled", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/panorama/controlled");
    await expect
      .poll(async () => readNumber(page, "panorama-ready-count"), {
        timeout: PANORAMA_LOAD_TIMEOUT
      })
      .toBeGreaterThanOrEqual(1);
  });

  test("PANO-03: controlled position 변경 후 Panorama에서 유효 좌표를 반환한다", async ({
    page
  }) => {
    await page.getByTestId("set-position-2").click();
    await page.getByTestId("read-state").click();

    const pos2 = await readLatLng(page, "ref-position");
    expectValidKoreaCoord(pos2);

    await page.getByTestId("set-position-3").click();
    await page.getByTestId("read-state").click();

    const pos3 = await readLatLng(page, "ref-position");
    expectValidKoreaCoord(pos3);

    await expect(page.getByTestId("state-position")).toHaveText(JSON.stringify(POSITION_3));
  });

  test("PANO-04: controlled pov 변경이 Panorama pov에 반영된다", async ({ page }) => {
    await page.getByTestId("set-pov-a").click();
    await page.getByTestId("read-state").click();

    const povA = await readPov(page, "ref-pov");
    expect(povA.pan).toBe(10);
    expect(povA.tilt).toBe(-5);
    expect(povA.fov).toBe(95);

    await page.getByTestId("set-pov-b").click();
    await page.getByTestId("read-state").click();

    const povB = await readPov(page, "ref-pov");
    expect(povB.pan).toBe(35);
    expect(povB.tilt).toBe(2);
    expect(povB.fov).toBe(80);
  });
});

/* ─── 3. ref ─── */

test.describe("3. ref", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/panorama/ref");
    await expect
      .poll(async () => readNumber(page, "panorama-ready-count"), {
        timeout: PANORAMA_LOAD_TIMEOUT
      })
      .toBeGreaterThanOrEqual(1);
  });

  test("PANO-05: ref setPosition/setPov가 동작한다", async ({ page }) => {
    await page.getByTestId("ref-set-position-2").click();
    await page.getByTestId("ref-set-pov-b").click();
    await page.getByTestId("read-state").click();

    const pos = await readLatLng(page, "ref-position");
    expectValidKoreaCoord(pos);

    const pov = await readPov(page, "ref-pov");
    expect(pov.pan).toBe(35);
    expect(pov.tilt).toBe(2);
    expect(pov.fov).toBe(80);
  });

  test("PANO-06: ref setZoom/zoomIn/zoomOut이 반영된다", async ({ page }) => {
    await page.getByTestId("ref-set-zoom-2").click();
    await page.getByTestId("read-state").click();

    const zoomBase = await readNumber(page, "ref-zoom");

    await page.getByTestId("ref-zoom-in").click();
    await page.getByTestId("read-state").click();
    const zoomIn = await readNumber(page, "ref-zoom");

    await page.getByTestId("ref-zoom-out").click();
    await page.getByTestId("read-state").click();
    const zoomOut = await readNumber(page, "ref-zoom");

    expect(zoomIn).toBeGreaterThanOrEqual(zoomBase);
    expect(zoomOut).toBeLessThanOrEqual(zoomIn);
  });

  test("PANO-07: ref setVisible false/true 전환이 동작한다", async ({ page }) => {
    await page.getByTestId("ref-set-visible-false").click();
    await page.getByTestId("read-state").click();
    await expect(page.getByTestId("ref-visible")).toHaveText("false");

    await page.getByTestId("ref-set-visible-true").click();
    await page.getByTestId("read-state").click();
    await expect(page.getByTestId("ref-visible")).toHaveText("true");
  });

  test("PANO-08: ref setOptions(min/max zoom)과 projection 조회가 동작한다", async ({ page }) => {
    await page.getByTestId("ref-set-options-batch").click();
    await page.getByTestId("read-state").click();

    await expect(page.getByTestId("ref-min-zoom")).toHaveText("1");
    await expect(page.getByTestId("ref-max-zoom")).toHaveText("5");
    await expect(page.getByTestId("ref-projection-exists")).toHaveText("true");
  });
});

/* ─── 4. events ─── */

test.describe("4. events", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/panorama/events");
    await expect
      .poll(async () => readNumber(page, "panorama-ready-count"), {
        timeout: PANORAMA_LOAD_TIMEOUT
      })
      .toBeGreaterThanOrEqual(1);
  });

  test("PANO-09: init/pano_changed/pov_changed 이벤트 핸들러가 호출된다", async ({ page }) => {
    const beforeInit = await readNumber(page, "evt-init-count");
    const beforePano = await readNumber(page, "evt-pano-changed-count");
    const beforePov = await readNumber(page, "evt-pov-changed-count");

    await page.getByTestId("trigger-init").click();
    await page.getByTestId("trigger-pano-changed").click();
    await page.getByTestId("trigger-pov-changed").click();

    await expect.poll(async () => readNumber(page, "evt-init-count")).toBeGreaterThan(beforeInit);
    await expect
      .poll(async () => readNumber(page, "evt-pano-changed-count"))
      .toBeGreaterThan(beforePano);
    await expect
      .poll(async () => readNumber(page, "evt-pov-changed-count"))
      .toBeGreaterThan(beforePov);
  });

  test("PANO-10: pano_status 이벤트 payload가 전달된다", async ({ page }) => {
    const before = await readNumber(page, "evt-pano-status-count");

    await page.getByTestId("trigger-pano-status").click();

    await expect
      .poll(async () => readNumber(page, "evt-pano-status-count"))
      .toBeGreaterThan(before);
    await expect(page.getByTestId("evt-last-pano-status")).toHaveText("OK");
  });
});

/* ─── 5. lifecycle ─── */

test.describe("5. lifecycle", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/panorama/lifecycle");
    await expect
      .poll(async () => readNumber(page, "panorama-ready-count"), {
        timeout: PANORAMA_LOAD_TIMEOUT
      })
      .toBeGreaterThanOrEqual(1);
  });

  test("PANO-11: 언마운트 시 onPanoramaDestroy 호출 + instance 해제", async ({ page }) => {
    const beforeDestroy = await readNumber(page, "panorama-destroy-count");

    await page.getByTestId("toggle-panorama").click();
    await expect(page.getByTestId("show-panorama")).toHaveText("false");

    await expect
      .poll(async () => readNumber(page, "panorama-destroy-count"))
      .toBeGreaterThanOrEqual(beforeDestroy + 1);

    await page.getByTestId("read-state").click();
    await expect(page.getByTestId("instance-exists")).toHaveText("false");
  });

  test("PANO-12: 재마운트 시 onPanoramaReady 카운트가 증가한다", async ({ page }) => {
    const beforeReady = await readNumber(page, "panorama-ready-count");

    await page.getByTestId("toggle-panorama").click();
    await page.getByTestId("toggle-panorama").click();
    await expect(page.getByTestId("show-panorama")).toHaveText("true");

    await expect
      .poll(async () => readNumber(page, "panorama-ready-count"))
      .toBeGreaterThan(beforeReady);
  });
});
