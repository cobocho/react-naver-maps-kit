import { expect, test, type Page } from "@playwright/test";

const MAP_LOAD_TIMEOUT = 20_000;

async function readNumber(page: Page, testId: string) {
  const text = await page.getByTestId(testId).textContent();
  return Number(text ?? "0");
}

/* ─── 1. basic ─── */

test.describe("1. basic", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/gpx/basic");
    await expect(page.getByTestId("map-container")).toBeVisible({ timeout: MAP_LOAD_TIMEOUT });
    await expect(page.getByTestId("map-ready")).toHaveText("true", { timeout: MAP_LOAD_TIMEOUT });
  });

  test("GPX-01: 기본 URL 로드 시 data ready/features added 후 feature를 조회할 수 있다", async ({
    page
  }) => {
    await expect.poll(async () => readNumber(page, "data-ready-count")).toBeGreaterThanOrEqual(1);
    await expect
      .poll(async () => readNumber(page, "features-added-count"))
      .toBeGreaterThanOrEqual(1);

    await page.getByTestId("read-state").click();

    await expect.poll(async () => readNumber(page, "feature-count")).toBeGreaterThan(0);
    await expect(page.getByTestId("geojson-type")).toHaveText("FeatureCollection");
  });

  test("GPX-02: style 변경 시 setStyle 반영 결과를 getStyle로 읽을 수 있다", async ({ page }) => {
    await page.getByTestId("set-stroke-blue").click();
    await page.getByTestId("read-state").click();

    await expect(page.getByTestId("style-stroke-color")).toHaveText("#2563eb");
  });
});

/* ─── 2. url switch ─── */

test.describe("2. url switch", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/gpx/url-switch");
    await expect(page.getByTestId("map-container")).toBeVisible({ timeout: MAP_LOAD_TIMEOUT });
    await expect(page.getByTestId("map-ready")).toHaveText("true", { timeout: MAP_LOAD_TIMEOUT });
  });

  test("GPX-03: 초기 URL(a) 로드 후 feature count를 읽을 수 있다", async ({ page }) => {
    await page.getByTestId("read-state").click();

    await expect.poll(async () => readNumber(page, "feature-count")).toBeGreaterThan(0);
    await expect(page.getByTestId("url-state")).toHaveText("/gpx-a.gpx");
  });

  test("GPX-04: URL을 b로 변경하면 features가 재로드되고 count가 변경된다", async ({ page }) => {
    await page.getByTestId("read-state").click();
    const beforeAddedCount = await readNumber(page, "features-added-count");
    const beforeGeoCount = await readNumber(page, "geojson-feature-count");

    await page.getByTestId("set-url-b").click();

    await expect(page.getByTestId("url-state")).toHaveText("/gpx-b.gpx");
    await expect
      .poll(async () => readNumber(page, "features-added-count"))
      .toBeGreaterThan(beforeAddedCount);

    await page.getByTestId("read-state").click();
    await expect
      .poll(async () => readNumber(page, "geojson-feature-count"))
      .not.toBe(beforeGeoCount);
  });

  test("GPX-05: URL 전환 과정에서 정상 케이스는 error가 증가하지 않는다", async ({ page }) => {
    await page.getByTestId("set-url-b").click();
    await page.getByTestId("set-url-a").click();

    await expect(page.getByTestId("error-count")).toHaveText("0");
  });
});

/* ─── 3. events ─── */

test.describe("3. events", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/gpx/events");
    await expect(page.getByTestId("map-container")).toBeVisible({ timeout: MAP_LOAD_TIMEOUT });
    await expect(page.getByTestId("map-ready")).toHaveText("true", { timeout: MAP_LOAD_TIMEOUT });
  });

  test("GPX-06: pointer 이벤트 핸들러들이 Data 이벤트와 연결된다", async ({ page }) => {
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

  test("GPX-07: add/remove/property_changed 이벤트 핸들러가 호출된다", async ({ page }) => {
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
    await page.goto("/#/gpx/ref");
    await expect(page.getByTestId("map-container")).toBeVisible({ timeout: MAP_LOAD_TIMEOUT });
    await expect(page.getByTestId("map-ready")).toHaveText("true", { timeout: MAP_LOAD_TIMEOUT });
    await page.getByTestId("ref-read-state").click();
  });

  test("GPX-08: ref로 map binding/getAllFeature/toGeoJson을 조회할 수 있다", async ({ page }) => {
    await expect(page.getByTestId("map-bound")).toHaveText("true");
    await expect.poll(async () => readNumber(page, "feature-count")).toBeGreaterThan(0);
    await expect(page.getByTestId("geojson-type")).toHaveText("FeatureCollection");
  });

  test("GPX-09: ref.setStyle 후 getStyle 결과가 갱신된다", async ({ page }) => {
    await page.getByTestId("ref-set-style-green").click();
    await page.getByTestId("ref-read-state").click();

    await expect(page.getByTestId("style-stroke-color")).toHaveText("#16a34a");
  });

  test("GPX-10: ref.getFeatureById로 기존 feature를 찾을 수 있다", async ({ page }) => {
    await page.getByTestId("ref-find-feature-by-id").click();
    await expect(page.getByTestId("feature-by-id-found")).toHaveText("true");
  });

  test("GPX-11: ref.removeFeature 호출 시 feature count가 감소한다", async ({ page }) => {
    const before = await readNumber(page, "feature-count");

    await page.getByTestId("ref-remove-first").click();
    await page.getByTestId("ref-read-state").click();

    await expect.poll(async () => readNumber(page, "feature-count")).toBeLessThan(before);
  });

  test("GPX-12: ref.overrideStyle/revertStyle 호출 후에도 Data 인스턴스는 정상 상태다", async ({
    page
  }) => {
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
    await page.goto("/#/gpx/lifecycle");
    await expect(page.getByTestId("map-container")).toBeVisible({ timeout: MAP_LOAD_TIMEOUT });
    await expect(page.getByTestId("map-ready")).toHaveText("true", { timeout: MAP_LOAD_TIMEOUT });
  });

  test("GPX-13: 마운트 시 onDataReady, 언마운트 시 onDataDestroy가 호출된다", async ({ page }) => {
    await expect.poll(async () => readNumber(page, "data-ready-count")).toBeGreaterThanOrEqual(1);

    await page.getByTestId("toggle-gpx").click();

    await expect(page.getByTestId("show-gpx")).toHaveText("false");
    await expect.poll(async () => readNumber(page, "data-destroy-count")).toBeGreaterThanOrEqual(1);

    await page.getByTestId("read-state").click();
    await expect(page.getByTestId("instance-exists")).toHaveText("false");
  });

  test("GPX-14: 다시 마운트하면 onDataReady 카운트가 증가한다", async ({ page }) => {
    const beforeReady = await readNumber(page, "data-ready-count");

    await page.getByTestId("toggle-gpx").click();
    await page.getByTestId("toggle-gpx").click();

    await expect(page.getByTestId("show-gpx")).toHaveText("true");
    await expect
      .poll(async () => readNumber(page, "data-ready-count"))
      .toBeGreaterThan(beforeReady);
  });
});

/* ─── 6. error ─── */

test.describe("6. error", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/gpx/error");
    await expect(page.getByTestId("map-container")).toBeVisible({ timeout: MAP_LOAD_TIMEOUT });
    await expect(page.getByTestId("map-ready")).toHaveText("true", { timeout: MAP_LOAD_TIMEOUT });
  });

  test("GPX-15: 네트워크 실패 URL 로드 시 onDataError가 호출된다", async ({ page }) => {
    const beforeErrorCount = await readNumber(page, "error-count");

    await page.getByTestId("set-url-network-error").click();

    await expect
      .poll(async () => readNumber(page, "error-count"))
      .toBeGreaterThan(beforeErrorCount);
    await expect(page.getByTestId("last-error")).toContainText("Failed to fetch");
  });

  test("GPX-16: 잘못된 XML 로드 시 onDataError가 호출된다", async ({ page }) => {
    const beforeErrorCount = await readNumber(page, "error-count");

    await page.getByTestId("set-url-invalid-xml").click();

    await expect
      .poll(async () => readNumber(page, "error-count"))
      .toBeGreaterThan(beforeErrorCount);
    await expect(page.getByTestId("last-error")).toContainText("XML parse error");
  });

  test("GPX-17: 에러 이후 다른 valid URL로 전환하면 다시 features가 추가된다", async ({ page }) => {
    await page.getByTestId("set-url-invalid-xml").click();
    await expect.poll(async () => readNumber(page, "error-count")).toBeGreaterThan(0);

    const beforeFeaturesAdded = await readNumber(page, "features-added-count");

    await page.getByTestId("set-url-valid-b").click();
    await expect(page.getByTestId("url-state")).toHaveText("/gpx-b.gpx");

    await expect
      .poll(async () => readNumber(page, "features-added-count"))
      .toBeGreaterThan(beforeFeaturesAdded);
  });
});
