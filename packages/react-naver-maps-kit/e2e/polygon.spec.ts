import { expect, test } from "@playwright/test";

import { POLYGON_PATHS_1, POLYGON_PATHS_2, POLYGON_PATHS_3 } from "./app/constants";

const MAP_LOAD_TIMEOUT = 20_000;

type LatLngLiteral = {
  lat: number;
  lng: number;
};

type PathLiteral = LatLngLiteral[];
type PathsLiteral = PathLiteral[];

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

function expectPathClose(actual: PathLiteral, expected: PathLiteral, precision = 2): void {
  expect(actual.length).toBeGreaterThanOrEqual(expected.length);

  expected.forEach((point, index) => {
    expect(actual[index].lat).toBeCloseTo(point.lat, precision);
    expect(actual[index].lng).toBeCloseTo(point.lng, precision);
  });
}

function expectPathsClose(actual: PathsLiteral, expected: PathsLiteral, precision = 2): void {
  expect(actual.length).toBeGreaterThanOrEqual(1);
  expect(expected.length).toBeGreaterThanOrEqual(1);

  expectPathClose(actual[0], expected[0], precision);
}

/* ─── 1. 렌더링/생성/정리 (스모크) ─── */

test.describe("1. 렌더링/생성/정리 (스모크)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/polygon/smoke");
  });

  test("P-01: 기본 Polygon 렌더링 + onPolygonReady 호출", async ({ page }) => {
    await expect(page.getByTestId("map-container")).toBeVisible({ timeout: MAP_LOAD_TIMEOUT });

    await expect
      .poll(async () => Number(await page.getByTestId("polygon-ready-count").textContent()))
      .toBeGreaterThanOrEqual(1);
  });

  test("P-02: 언마운트 시 onPolygonDestroy 호출 + 치명 에러 없음", async ({ page }) => {
    await expect(page.getByTestId("map-container")).toBeVisible({ timeout: MAP_LOAD_TIMEOUT });
    await expect
      .poll(async () => Number(await page.getByTestId("polygon-ready-count").textContent()))
      .toBeGreaterThanOrEqual(1);

    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await page.getByTestId("toggle-polygon").click();
    await expect(page.getByTestId("show-polygon")).toHaveText("false");
    await expect(page.getByTestId("polygon-destroyed")).toHaveText("true");

    const criticalErrors = consoleErrors.filter(
      (err) => !err.includes("naver") && !err.includes("favicon")
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test("P-03: map prop 미지정 시 context map에 바인딩된다", async ({ page }) => {
    await expect(page.getByTestId("map-container")).toBeVisible({ timeout: MAP_LOAD_TIMEOUT });
    await expect
      .poll(async () => Number(await page.getByTestId("polygon-ready-count").textContent()))
      .toBeGreaterThanOrEqual(1);

    await page.getByTestId("read-map-binding").click();
    await expect(page.getByTestId("map-bound")).toHaveText("true");
    await expect(page.getByTestId("map-equals")).toHaveText("true");
  });

  test("P-04: 재마운트 시 onPolygonReady 카운트가 증가한다", async ({ page }) => {
    await expect(page.getByTestId("map-container")).toBeVisible({ timeout: MAP_LOAD_TIMEOUT });
    const before = Number(await page.getByTestId("polygon-ready-count").textContent());

    await page.getByTestId("toggle-polygon").click();
    await page.getByTestId("toggle-polygon").click();

    await expect
      .poll(async () => Number(await page.getByTestId("polygon-ready-count").textContent()))
      .toBeGreaterThan(before);
  });
});

/* ─── 2. paths/options 반영 ─── */

test.describe("2. paths/options 반영", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/polygon/paths-options");
    await expect(page.getByTestId("map-ready")).toHaveText("true", { timeout: MAP_LOAD_TIMEOUT });
  });

  test("P-05: paths 변경이 getPaths에 반영된다", async ({ page }) => {
    await page.getByTestId("set-paths-2").click();
    await page.getByTestId("read-state").click();

    const paths = parseJson<PathsLiteral>(await page.getByTestId("opt-paths").textContent());
    expectPathsClose(paths, POLYGON_PATHS_2);
  });

  test("P-06: 빠른 연속 paths 변경 시 최종 paths로 수렴한다", async ({ page }) => {
    await page.getByTestId("rapid-paths").click();

    await expect
      .poll(async () => {
        await page.getByTestId("read-state").click();
        const text = await page.getByTestId("opt-paths").textContent();
        if (!text) return false;

        const paths = JSON.parse(text) as PathsLiteral;
        if (paths.length === 0 || paths[0].length < POLYGON_PATHS_3[0].length) {
          return false;
        }

        return POLYGON_PATHS_3[0].every(
          (point, index) =>
            Math.abs(paths[0][index].lat - point.lat) < 0.01 &&
            Math.abs(paths[0][index].lng - point.lng) < 0.01
        );
      })
      .toBe(true);
  });

  test("P-07: visible 토글이 반영된다", async ({ page }) => {
    await page.getByTestId("toggle-visible").click();
    await page.getByTestId("read-state").click();
    await expect(page.getByTestId("opt-visible")).toHaveText("false");

    await page.getByTestId("toggle-visible").click();
    await page.getByTestId("read-state").click();
    await expect(page.getByTestId("opt-visible")).toHaveText("true");
  });

  test("P-08: clickable 토글이 반영된다", async ({ page }) => {
    await page.getByTestId("toggle-clickable").click();
    await page.getByTestId("read-state").click();
    await expect(page.getByTestId("opt-clickable")).toHaveText("false");

    await page.getByTestId("toggle-clickable").click();
    await page.getByTestId("read-state").click();
    await expect(page.getByTestId("opt-clickable")).toHaveText("true");
  });

  test("P-09: zIndex 변경이 반영된다", async ({ page }) => {
    await page.getByTestId("set-zindex-999").click();
    await page.getByTestId("read-state").click();
    await expect(page.getByTestId("opt-zindex")).toHaveText("999");

    await page.getByTestId("set-zindex-1").click();
    await page.getByTestId("read-state").click();
    await expect(page.getByTestId("opt-zindex")).toHaveText("1");
  });

  test("P-10: fillColor/fillOpacity 변경이 반영된다", async ({ page }) => {
    await page.getByTestId("set-fill-red").click();
    await page.getByTestId("set-fill-opacity-08").click();
    await page.getByTestId("read-state").click();

    expect(parseColor(await page.getByTestId("opt-fill-color").textContent())).toBe("#ff0000");
    await expect(page.getByTestId("opt-fill-opacity")).toHaveText("0.8");
  });

  test("P-11: strokeColor/strokeOpacity/strokeWeight 변경이 반영된다", async ({ page }) => {
    await page.getByTestId("set-stroke-green").click();
    await page.getByTestId("set-stroke-opacity-04").click();
    await page.getByTestId("set-stroke-weight-6").click();
    await page.getByTestId("read-state").click();

    expect(parseColor(await page.getByTestId("opt-stroke-color").textContent())).toBe("#00aa00");
    await expect(page.getByTestId("opt-stroke-opacity")).toHaveText("0.4");
    await expect(page.getByTestId("opt-stroke-weight")).toHaveText("6");
  });

  test("P-12: strokeStyle/strokeLineCap/strokeLineJoin 변경이 반영된다", async ({ page }) => {
    await page.getByTestId("set-stroke-style-shortdash").click();
    await page.getByTestId("set-linecap-butt").click();
    await page.getByTestId("set-linejoin-bevel").click();
    await page.getByTestId("read-state").click();

    await expect(page.getByTestId("opt-stroke-style")).toContainText("short");
    await expect(page.getByTestId("opt-stroke-linecap")).toContainText("butt");
    await expect(page.getByTestId("opt-stroke-linejoin")).toContainText("bevel");
  });

  test("P-13: path/paths/clickable/visible/zIndex changed 이벤트가 발생한다", async ({ page }) => {
    const pathBefore = Number(await page.getByTestId("evt-path-changed-count").textContent());
    const pathsBefore = Number(await page.getByTestId("evt-paths-changed-count").textContent());
    const clickableBefore = Number(
      await page.getByTestId("evt-clickable-changed-count").textContent()
    );
    const visibleBefore = Number(await page.getByTestId("evt-visible-changed-count").textContent());
    const zIndexBefore = Number(await page.getByTestId("evt-zindex-changed-count").textContent());

    await page.getByTestId("set-paths-2").click();
    await page.getByTestId("toggle-clickable").click();
    await page.getByTestId("toggle-visible").click();
    await page.getByTestId("set-zindex-999").click();

    await expect
      .poll(async () => Number(await page.getByTestId("evt-path-changed-count").textContent()))
      .toBeGreaterThan(pathBefore);
    await expect
      .poll(async () => Number(await page.getByTestId("evt-paths-changed-count").textContent()))
      .toBeGreaterThan(pathsBefore);
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

  test("P-14: fill/stroke changed 이벤트가 발생한다", async ({ page }) => {
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

  test("P-15: strokeLineCap/strokeLineJoin/strokeStyle changed 이벤트가 발생한다", async ({
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

  test("P-16: getAreaSize는 양수를 반환한다", async ({ page }) => {
    await page.getByTestId("read-state").click();

    const areaSize = Number(await page.getByTestId("opt-area-size").textContent());
    expect(areaSize).toBeGreaterThan(0);
  });
});

/* ─── 3. 포인터 이벤트 ─── */

test.describe("3. 포인터 이벤트", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/polygon/events");
    await expect(page.getByTestId("map-ready")).toHaveText("true", { timeout: MAP_LOAD_TIMEOUT });
    await page.getByTestId("clear-log").click();
  });

  test("P-17: onClick 이벤트가 호출된다", async ({ page }) => {
    await page.getByTestId("trigger-click").click();

    await expect
      .poll(async () => {
        const log = parseJson<string[]>(await page.getByTestId("event-log").textContent());
        return log.includes("click");
      })
      .toBe(true);
  });

  test("P-18: onDblClick/onRightClick 이벤트가 호출된다", async ({ page }) => {
    await page.getByTestId("trigger-dblclick").click();
    await page.getByTestId("trigger-rightclick").click();

    await expect
      .poll(async () => {
        const log = parseJson<string[]>(await page.getByTestId("event-log").textContent());
        return log.includes("dblclick") && log.includes("rightclick");
      })
      .toBe(true);
  });

  test("P-19: onMouseOver/onMouseOut 이벤트가 호출된다", async ({ page }) => {
    await page.getByTestId("trigger-mouseover").click();
    await page.getByTestId("trigger-mouseout").click();

    await expect
      .poll(async () => {
        const log = parseJson<string[]>(await page.getByTestId("event-log").textContent());
        return log.includes("mouseover") && log.includes("mouseout");
      })
      .toBe(true);
  });

  test("P-20: onMouseDown/onMouseMove/onMouseUp 이벤트가 호출된다", async ({ page }) => {
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

  test("P-21: onTouchStart/onTouchMove/onTouchEnd 이벤트가 호출된다", async ({ page }) => {
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

  test("P-22: onMapChanged 이벤트가 호출된다", async ({ page }) => {
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
    await page.goto("/#/polygon/ref");
    await expect(page.getByTestId("map-ready")).toHaveText("true", { timeout: MAP_LOAD_TIMEOUT });
  });

  test("P-23: ref.setPath()로 단일 path를 변경할 수 있다", async ({ page }) => {
    await page.getByTestId("ref-set-path-2").click();
    await page.getByTestId("ref-read-state").click();

    const path = parseJson<PathLiteral>(await page.getByTestId("ref-path").textContent());
    expectPathClose(path, POLYGON_PATHS_2[0]);
  });

  test("P-24: ref.setPaths()로 다중 paths를 변경할 수 있다", async ({ page }) => {
    await page.getByTestId("ref-set-paths-3").click();
    await page.getByTestId("ref-read-state").click();

    const paths = parseJson<PathsLiteral>(await page.getByTestId("ref-paths").textContent());
    expectPathsClose(paths, POLYGON_PATHS_3);
  });

  test("P-25: ref.setClickable()로 clickable을 변경할 수 있다", async ({ page }) => {
    await page.getByTestId("ref-set-clickable-true").click();
    await page.getByTestId("ref-read-state").click();
    await expect(page.getByTestId("ref-clickable")).toHaveText("true");

    await page.getByTestId("ref-set-clickable-false").click();
    await page.getByTestId("ref-read-state").click();
    await expect(page.getByTestId("ref-clickable")).toHaveText("false");
  });

  test("P-26: ref.setVisible()로 visible을 변경할 수 있다", async ({ page }) => {
    await page.getByTestId("ref-set-visible-false").click();
    await page.getByTestId("ref-read-state").click();
    await expect(page.getByTestId("ref-visible")).toHaveText("false");

    await page.getByTestId("ref-set-visible-true").click();
    await page.getByTestId("ref-read-state").click();
    await expect(page.getByTestId("ref-visible")).toHaveText("true");
  });

  test("P-27: ref.setZIndex()로 zIndex를 변경할 수 있다", async ({ page }) => {
    await page.getByTestId("ref-set-zindex-555").click();
    await page.getByTestId("ref-read-state").click();

    await expect(page.getByTestId("ref-zindex")).toHaveText("555");
  });

  test("P-28: ref.setOptions()로 옵션을 부분 업데이트할 수 있다", async ({ page }) => {
    await page.getByTestId("ref-set-options").click();
    await page.getByTestId("ref-read-state").click();

    await expect(page.getByTestId("ref-zindex")).toHaveText("777");
    await expect(page.getByTestId("ref-clickable")).toHaveText("true");
  });

  test("P-29: ref.setStyles()로 style을 업데이트할 수 있다", async ({ page }) => {
    await page.getByTestId("ref-set-styles").click();
    await page.getByTestId("ref-read-state").click();

    expect(parseColor(await page.getByTestId("ref-fill-color").textContent())).toBe("#ff00ff");
    expect(parseColor(await page.getByTestId("ref-stroke-color").textContent())).toBe("#ff00ff");
  });

  test("P-30: ref.setMap(null/map) 호출 후 map 바인딩이 유지된다", async ({ page }) => {
    await page.getByTestId("ref-set-map-null").click();
    await page.getByTestId("ref-read-state").click();
    await expect(page.getByTestId("ref-map-bound")).toHaveText("true");

    await page.getByTestId("ref-set-map-instance").click();
    await page.getByTestId("ref-read-state").click();
    await expect(page.getByTestId("ref-map-bound")).toHaveText("true");
  });

  test("P-31: ref.getPath/getPaths/getAreaSize/getDrawingRect/getElement/getBounds가 유효값을 반환한다", async ({
    page
  }) => {
    await page.getByTestId("ref-read-state").click();

    const path = parseJson<PathLiteral>(await page.getByTestId("ref-path").textContent());
    const paths = parseJson<PathsLiteral>(await page.getByTestId("ref-paths").textContent());
    const bounds = parseJson<BoundsLiteral>(await page.getByTestId("ref-bounds").textContent());

    expectPathClose(path, POLYGON_PATHS_1[0]);
    expectPathsClose(paths, POLYGON_PATHS_1);
    expect(Number(await page.getByTestId("ref-area-size").textContent())).toBeGreaterThan(0);
    await expect(page.getByTestId("ref-drawing-rect-exists")).toHaveText("true");
    await expect(page.getByTestId("ref-element-exists")).toHaveText("true");
    expect(bounds.north).toBeGreaterThan(bounds.south);
    expect(bounds.east).toBeGreaterThan(bounds.west);
  });

  test("P-32: ref.getOptions/getPanes/getProjection이 유효값을 반환한다", async ({ page }) => {
    await page.getByTestId("ref-read-state").click();

    await expect(page.getByTestId("ref-options-exists")).toHaveText("true");
    await expect(page.getByTestId("ref-panes-exists")).toHaveText("true");
    await expect(page.getByTestId("ref-projection-exists")).toHaveText("true");
  });

  test("P-33: map_changed 이벤트 카운트가 증가한다", async ({ page }) => {
    const before = Number(await page.getByTestId("map-changed-count").textContent());

    await page.getByTestId("ref-trigger-map-changed").click();

    await expect
      .poll(async () => Number(await page.getByTestId("map-changed-count").textContent()))
      .toBeGreaterThan(before);
  });
});

/* ─── 5. 복수 Polygon / 동적 추가·제거 ─── */

test.describe("5. 복수 Polygon / 동적 추가·제거", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/polygon/multiple");
    await expect(page.getByTestId("map-ready")).toHaveText("true", { timeout: MAP_LOAD_TIMEOUT });
  });

  test("P-34: Polygon 3개가 기본 렌더링된다", async ({ page }) => {
    await expect(page.getByTestId("polygon-count")).toHaveText("3");

    await expect
      .poll(async () => Number(await page.getByTestId("polygon-ready-count").textContent()))
      .toBeGreaterThanOrEqual(3);
  });

  test("P-35: Polygon 동적 추가 시 카운트가 증가한다", async ({ page }) => {
    const before = Number(await page.getByTestId("polygon-ready-count").textContent());

    await page.getByTestId("add-polygon").click();
    await expect(page.getByTestId("polygon-count")).toHaveText("4");

    await expect
      .poll(async () => Number(await page.getByTestId("polygon-ready-count").textContent()))
      .toBeGreaterThan(before);
  });

  test("P-36: Polygon 동적 제거 시 destroy 콜백이 발생한다", async ({ page }) => {
    await page.getByTestId("remove-last-polygon").click();
    await expect(page.getByTestId("polygon-count")).toHaveText("2");

    await expect
      .poll(async () => Number(await page.getByTestId("polygon-destroy-count").textContent()))
      .toBeGreaterThanOrEqual(1);
  });

  test("P-37: 첫 Polygon visible 토글이 반영된다", async ({ page }) => {
    await expect(page.getByTestId("first-visible")).toHaveText("true");

    await page.getByTestId("toggle-first-visible").click();
    await expect(page.getByTestId("first-visible")).toHaveText("false");
  });

  test("P-38: 둘째 Polygon zIndex 변경이 반영된다", async ({ page }) => {
    await expect(page.getByTestId("second-zindex")).toHaveText("2");

    await page.getByTestId("set-second-zindex").click();
    await expect(page.getByTestId("second-zindex")).toHaveText("555");
  });
});
