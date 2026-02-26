import { expect, test, type Page } from "@playwright/test";

const MAP_LOAD_TIMEOUT = 30_000;

async function readNumber(page: Page, testId: string) {
  const text = await page.getByTestId(testId).textContent();
  return Number(text ?? "0");
}

async function waitForMapReady(page: Page) {
  await expect(page.getByTestId("map-container")).toBeVisible({ timeout: MAP_LOAD_TIMEOUT });
  await expect(page.getByTestId("map-ready")).toHaveText("true", { timeout: MAP_LOAD_TIMEOUT });
}

/* ─── 1. basic ─── */

test.describe("1. basic", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/geojson/basic");
    await waitForMapReady(page);
    await expect(page.getByTestId("loading")).toHaveText("false", { timeout: MAP_LOAD_TIMEOUT });
  });

  test("GEO-01: playground seoul.geojson 로드 후 Data 인스턴스/feature를 조회할 수 있다", async ({ page }) => {
    await expect(page.getByTestId("fetch-error")).toHaveText("");
    await expect.poll(async () => readNumber(page, "data-ready-count")).toBeGreaterThanOrEqual(1);
    await expect.poll(async () => readNumber(page, "features-added-count")).toBeGreaterThanOrEqual(1);

    await page.getByTestId("read-state").click();

    await expect.poll(async () => readNumber(page, "feature-count")).toBeGreaterThan(10);
    await expect(page.getByTestId("map-bound")).toHaveText("true");
    await expect(page.getByTestId("geojson-type")).toHaveText("FeatureCollection");
    await expect(page.getByTestId("last-error")).toHaveText("");
  });

  test("GEO-02: style 변경 시 getStyle 결과(strokeColor)가 갱신된다", async ({ page }) => {
    await page.getByTestId("set-stroke-red").click();
    await page.getByTestId("read-state").click();

    await expect(page.getByTestId("style-stroke-color")).toHaveText("#ef4444");
  });
});

/* ─── 2. data switch ─── */

test.describe("2. data switch", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/geojson/data-switch");
    await waitForMapReady(page);
    await expect(page.getByTestId("loading")).toHaveText("false", { timeout: MAP_LOAD_TIMEOUT });
  });

  test("GEO-03: 초기 데이터는 seoul.geojson이며 feature 수를 읽을 수 있다", async ({ page }) => {
    await expect(page.getByTestId("data-state")).toHaveText("seoul");

    await page.getByTestId("read-state").click();

    await expect.poll(async () => readNumber(page, "feature-count")).toBeGreaterThan(10);
    await expect.poll(async () => readNumber(page, "geojson-feature-count")).toBeGreaterThan(10);
  });

  test("GEO-04: inline 데이터로 전환하면 feature 수가 새 데이터 기준으로 바뀐다", async ({ page }) => {
    const beforeAdded = await readNumber(page, "features-added-count");

    await page.getByTestId("set-data-inline-b").click();
    await expect(page.getByTestId("data-state")).toHaveText("inline-b");
    await expect.poll(async () => readNumber(page, "features-added-count")).toBeGreaterThan(beforeAdded);

    await page.getByTestId("read-state").click();

    await expect(page.getByTestId("feature-count")).toHaveText("1");
    await expect.poll(async () => readNumber(page, "geojson-feature-count")).toBeGreaterThan(0);
  });

  test("GEO-05: seoul 데이터로 복귀하면 다시 대용량 feature가 렌더링된다", async ({ page }) => {
    await page.getByTestId("set-data-inline-b").click();
    const beforeAdded = await readNumber(page, "features-added-count");

    await page.getByTestId("set-data-seoul").click();

    await expect(page.getByTestId("data-state")).toHaveText("seoul");
    await expect.poll(async () => readNumber(page, "features-added-count")).toBeGreaterThan(beforeAdded);

    await page.getByTestId("read-state").click();

    await expect.poll(async () => readNumber(page, "feature-count")).toBeGreaterThan(10);
    await expect(page.getByTestId("error-count")).toHaveText("0");
  });
});

/* ─── 3. events ─── */

test.describe("3. events", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/geojson/events");
    await waitForMapReady(page);
  });

  test("GEO-06: pointer 이벤트 핸들러들이 Data 이벤트와 연결된다", async ({ page }) => {
    await page.getByTestId("clear-log").click();

    await page.getByTestId("trigger-click").click();
    await page.getByTestId("trigger-dblclick").click();
    await page.getByTestId("trigger-rightclick").click();
    await page.getByTestId("trigger-mousedown").click();
    await page.getByTestId("trigger-mouseup").click();
    await page.getByTestId("trigger-mouseover").click();
    await page.getByTestId("trigger-mouseout").click();

    await expect(page.getByTestId("event-log")).toContainText("click");
    await expect(page.getByTestId("event-log")).toContainText("dblclick");
    await expect(page.getByTestId("event-log")).toContainText("rightclick");
    await expect(page.getByTestId("event-log")).toContainText("mousedown");
    await expect(page.getByTestId("event-log")).toContainText("mouseup");
    await expect(page.getByTestId("event-log")).toContainText("mouseover");
    await expect(page.getByTestId("event-log")).toContainText("mouseout");
  });

  test("GEO-07: add/remove/property_changed 이벤트 핸들러가 호출된다", async ({ page }) => {
    await page.getByTestId("clear-log").click();

    await page.getByTestId("trigger-addfeature").click();
    await page.getByTestId("trigger-property-changed").click();
    await page.getByTestId("trigger-removefeature").click();

    await expect(page.getByTestId("event-log")).toContainText("addfeature");
    await expect(page.getByTestId("event-log")).toContainText("property_changed");
    await expect(page.getByTestId("event-log")).toContainText("removefeature");

    await page.getByTestId("read-state").click();
    await expect.poll(async () => readNumber(page, "feature-count")).toBeGreaterThan(0);
  });
});

/* ─── 4. ref ─── */

test.describe("4. ref", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/geojson/ref");
    await waitForMapReady(page);
    await page.getByTestId("ref-read-state").click();
  });

  test("GEO-08: ref로 map binding/getAllFeature/toGeoJson을 조회할 수 있다", async ({ page }) => {
    await expect(page.getByTestId("map-bound")).toHaveText("true");
    await expect.poll(async () => readNumber(page, "feature-count")).toBeGreaterThan(0);
    await expect(page.getByTestId("geojson-type")).toHaveText("FeatureCollection");
  });

  test("GEO-09: ref.setStyle 후 getStyle 결과가 갱신된다", async ({ page }) => {
    await page.getByTestId("ref-set-style-green").click();
    await page.getByTestId("ref-read-state").click();

    await expect(page.getByTestId("style-stroke-color")).toHaveText("#16a34a");
  });

  test("GEO-10: ref.getFeatureById로 특정 feature를 찾을 수 있다", async ({ page }) => {
    await page.getByTestId("ref-find-feature-by-id").click();
    await expect(page.getByTestId("feature-by-id-found")).toHaveText("true");
  });

  test("GEO-11: ref.removeFeature 호출 시 feature count가 감소한다", async ({ page }) => {
    const before = await readNumber(page, "feature-count");

    await page.getByTestId("ref-remove-first").click();
    await page.getByTestId("ref-read-state").click();

    await expect.poll(async () => readNumber(page, "feature-count")).toBeLessThan(before);
  });

  test("GEO-12: ref.overrideStyle/revertStyle 호출 후에도 Data 인스턴스는 정상 상태다", async ({ page }) => {
    await page.getByTestId("ref-override-first").click();
    await page.getByTestId("ref-revert-first").click();
    await page.getByTestId("ref-read-state").click();

    await expect(page.getByTestId("map-bound")).toHaveText("true");
    await expect(page.getByTestId("geojson-type")).toHaveText("FeatureCollection");
  });
});

/* ─── 5. lifecycle ─── */

test.describe("5. lifecycle", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/geojson/lifecycle");
    await waitForMapReady(page);
  });

  test("GEO-13: 마운트 시 onDataReady, 언마운트 시 onDataDestroy가 호출된다", async ({ page }) => {
    await expect.poll(async () => readNumber(page, "data-ready-count")).toBeGreaterThanOrEqual(1);

    await page.getByTestId("toggle-geojson").click();

    await expect(page.getByTestId("show-geojson")).toHaveText("false");
    await expect.poll(async () => readNumber(page, "data-destroy-count")).toBeGreaterThanOrEqual(1);

    await page.getByTestId("read-state").click();
    await expect(page.getByTestId("instance-exists")).toHaveText("false");
  });

  test("GEO-14: 다시 마운트하면 onDataReady 카운트가 증가한다", async ({ page }) => {
    const beforeReady = await readNumber(page, "data-ready-count");

    await page.getByTestId("toggle-geojson").click();
    await page.getByTestId("toggle-geojson").click();

    await expect(page.getByTestId("show-geojson")).toHaveText("true");
    await expect.poll(async () => readNumber(page, "data-ready-count")).toBeGreaterThan(beforeReady);
  });
});

/* ─── 6. error ─── */

test.describe("6. error", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/geojson/error");
    await waitForMapReady(page);
  });

  test("GEO-15: 잘못된 data 전달 시 onDataError가 호출된다", async ({ page }) => {
    const beforeErrorCount = await readNumber(page, "error-count");

    await page.getByTestId("patch-add-geojson-error").click();
    await expect(page.getByTestId("patched-error")).toHaveText("true");
    await page.getByTestId("set-data-b").click();
    await expect(page.getByTestId("data-state")).toHaveText("b");

    await expect.poll(async () => readNumber(page, "error-count")).toBeGreaterThan(beforeErrorCount);
    await expect(page.getByTestId("last-error")).toContainText("Forced addGeoJson error for e2e");
  });

  test("GEO-16: 에러 이후 valid data로 복귀하면 feature를 다시 조회할 수 있다", async ({ page }) => {
    await page.getByTestId("patch-add-geojson-error").click();
    await page.getByTestId("set-data-b").click();
    await expect.poll(async () => readNumber(page, "error-count")).toBeGreaterThan(0);

    await page.getByTestId("restore-add-geojson-error").click();
    await expect(page.getByTestId("patched-error")).toHaveText("false");
    await page.getByTestId("set-data-a").click();
    await page.getByTestId("set-data-b").click();
    await page.getByTestId("read-state").click();

    await expect.poll(async () => readNumber(page, "feature-count")).toBeGreaterThan(0);
  });
});

/* ─── 7. district click ─── */

test.describe("7. district click", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/geojson/district-click");
    await waitForMapReady(page);
    await expect(page.getByTestId("loading")).toHaveText("false", { timeout: MAP_LOAD_TIMEOUT });
    await expect(page.getByTestId("fetch-error")).toHaveText("");
    await page.getByTestId("read-state").click();
    await expect.poll(async () => readNumber(page, "feature-count")).toBeGreaterThan(10);
  });

  test("GEO-17: 종로구 클릭 시 clicked-gu가 종로구로 기록된다", async ({ page }) => {
    const beforeClickCount = await readNumber(page, "click-count");

    await page.getByTestId("trigger-gu-jongno").click();

    await expect.poll(async () => readNumber(page, "click-count")).toBeGreaterThan(beforeClickCount);
    await expect(page.getByTestId("clicked-gu")).toHaveText("종로구");
  });

  test("GEO-18: 강남구 클릭 시 clicked-gu가 강남구로 기록된다", async ({ page }) => {
    const beforeClickCount = await readNumber(page, "click-count");

    await page.getByTestId("trigger-gu-gangnam").click();

    await expect.poll(async () => readNumber(page, "click-count")).toBeGreaterThan(beforeClickCount);
    await expect(page.getByTestId("clicked-gu")).toHaveText("강남구");
  });
});
