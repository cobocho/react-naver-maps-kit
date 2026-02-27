const NAVER_MAPS_SCRIPT_BASE_URL = "https://oapi.map.naver.com/openapi/v3/maps.js";
const NAVER_MAPS_SCRIPT_SELECTOR =
  'script[data-react-naver-maps-kit="true"], script[src*="oapi.map.naver.com/openapi/v3/maps.js"]';
const NAVER_MAPS_CALLBACK_NAME = "__reactNaverMapsKitOnJsContentLoaded";
const NAVER_MAPS_JS_CONTENT_LOADED_FLAG = "__reactNaverMapsKitJsContentLoaded";

type LegacyClientIdParam = "ncpClientId" | "govClientId" | "finClientId";

type Submodule = "geocoder" | "panorama" | "drawing" | "visualization" | "gl";

export interface LoadNaverMapsScriptOptions {
  ncpKeyId?: string;
  ncpClientId?: string;
  govClientId?: string;
  finClientId?: string;
  submodules?: Array<Submodule>;
  timeoutMs?: number;
  nonce?: string;
}

type BrowserWindow = Window & {
  naver?: {
    maps?: unknown;
  };
  navermap_authFailure?: () => void;
  __reactNaverMapsKitOnJsContentLoaded?: () => void;
  __reactNaverMapsKitJsContentLoaded?: boolean;
};

let inFlightLoad: Promise<void> | null = null;
let inFlightScriptUrl: string | null = null;

function getNaverMapsScripts(): HTMLScriptElement[] {
  if (typeof document === "undefined") {
    return [];
  }

  return Array.from(document.querySelectorAll<HTMLScriptElement>(NAVER_MAPS_SCRIPT_SELECTOR));
}

function setJsContentLoadedFlag(value: boolean): void {
  const browserWindow = window as BrowserWindow;
  browserWindow[NAVER_MAPS_JS_CONTENT_LOADED_FLAG] = value;
}

function isJsContentLoaded(): boolean {
  const browserWindow = window as BrowserWindow;
  return Boolean(browserWindow[NAVER_MAPS_JS_CONTENT_LOADED_FLAG]);
}

function ensureJsContentLoadedCallback(): void {
  const browserWindow = window as BrowserWindow;
  browserWindow[NAVER_MAPS_CALLBACK_NAME] = () => {
    setJsContentLoadedFlag(true);
  };
}

function resetNaverMapsRuntime(): void {
  const scripts = getNaverMapsScripts();
  scripts.forEach((script) => script.remove());

  const browserWindow = window as BrowserWindow;
  browserWindow.naver = undefined;

  try {
    delete (browserWindow as BrowserWindow & { naver?: unknown }).naver;
  } catch {
    // ignore delete failure
  }

  setJsContentLoadedFlag(false);
}

function getClientKey(options: LoadNaverMapsScriptOptions): { param: string; value: string } {
  if (options.ncpKeyId) {
    return { param: "ncpKeyId", value: options.ncpKeyId };
  }

  const legacyPairs: Array<{ param: LegacyClientIdParam; value?: string }> = [
    { param: "ncpClientId", value: options.ncpClientId },
    { param: "govClientId", value: options.govClientId },
    { param: "finClientId", value: options.finClientId }
  ];

  const legacy = legacyPairs.find((candidate) => Boolean(candidate.value));

  if (legacy?.value) {
    return { param: legacy.param, value: legacy.value };
  }

  throw new Error(
    "loadNaverMapsScript requires ncpKeyId. For backward compatibility, ncpClientId, govClientId, or finClientId can be provided."
  );
}

function isNaverMapsReady(submodules?: Array<Submodule>): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const browserWindow = window as BrowserWindow;
  const maps = browserWindow.naver?.maps as Record<string, unknown> | undefined;

  if (!maps) {
    return false;
  }

  if (submodules && submodules.length > 0) {
    if (!isJsContentLoaded()) {
      return false;
    }

    const submoduleMap: Record<Submodule, string> = {
      panorama: "Panorama",
      geocoder: "Service",
      drawing: "drawing",
      visualization: "visualization",
      gl: "gl"
    };

    for (const submodule of submodules) {
      // GL 모듈은 naver.maps.gl 객체 노출 시점이 환경에 따라 달라질 수 있어
      // SDK 루트 객체 준비 여부만 확인하고 상세 키 체크는 생략한다.
      if (submodule === "gl") {
        continue;
      }

      const key = submoduleMap[submodule];
      if (!maps[key]) {
        return false;
      }
    }
  }

  return true;
}

function createScriptUrl(options: LoadNaverMapsScriptOptions): string {
  const clientKey = getClientKey(options);
  const queryParts: string[] = [`${clientKey.param}=${encodeURIComponent(clientKey.value)}`];

  if (options.submodules && options.submodules.length > 0) {
    queryParts.push(`submodules=${options.submodules.join(",")}`);
  }

  queryParts.push(`callback=${NAVER_MAPS_CALLBACK_NAME}`);

  return `${NAVER_MAPS_SCRIPT_BASE_URL}?${queryParts.join("&")}`;
}

function validateSubmodules(submodules?: Array<Submodule>): void {
  if (!submodules || submodules.length <= 1) {
    return;
  }

  if (submodules.includes("gl")) {
    throw new Error("The 'gl' submodule cannot be loaded with other submodules.");
  }
}

function waitForNaverMapsReady(timeoutMs: number, submodules?: Array<Submodule>): Promise<void> {
  return new Promise((resolve, reject) => {
    if (isNaverMapsReady(submodules)) {
      resolve();
      return;
    }

    const startedAt = Date.now();
    const intervalId = setInterval(() => {
      if (isNaverMapsReady(submodules)) {
        clearInterval(intervalId);
        resolve();
        return;
      }

      if (Date.now() - startedAt >= timeoutMs) {
        clearInterval(intervalId);
        reject(new Error(`Timed out after ${timeoutMs}ms while waiting for window.naver.maps.`));
      }
    }, 50);
  });
}

function attachAuthFailureHandler(reject: (error: Error) => void): () => void {
  const browserWindow = window as BrowserWindow;
  const previousAuthFailure = browserWindow.navermap_authFailure;

  browserWindow.navermap_authFailure = () => {
    reject(
      new Error("Naver Maps authentication failed. Check your client key and allowed domains.")
    );

    if (previousAuthFailure) {
      previousAuthFailure();
    }
  };

  return () => {
    browserWindow.navermap_authFailure = previousAuthFailure;
  };
}

export function loadNaverMapsScript(options: LoadNaverMapsScriptOptions): Promise<void> {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return Promise.reject(new Error("loadNaverMapsScript can only run in a browser environment."));
  }

  validateSubmodules(options.submodules);
  ensureJsContentLoadedCallback();
  const scriptUrl = createScriptUrl(options);

  if (inFlightLoad && inFlightScriptUrl && inFlightScriptUrl !== scriptUrl) {
    return inFlightLoad
      .catch(() => undefined)
      .then(() => loadNaverMapsScript(options));
  }

  if (inFlightLoad && inFlightScriptUrl === scriptUrl) {
    return inFlightLoad;
  }

  const existingScripts = getNaverMapsScripts();
  const hasDifferentScript = existingScripts.some((script) => script.src !== scriptUrl);

  if (hasDifferentScript) {
    resetNaverMapsRuntime();
    inFlightLoad = null;
    inFlightScriptUrl = null;
  }

  if (isNaverMapsReady(options.submodules)) {
    return Promise.resolve();
  }

  const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${scriptUrl}"]`);

  if (existingScript) {
    const trackedPromise = new Promise<void>((resolve, reject) => {
      const existingScriptWithState = existingScript as HTMLScriptElement & { readyState?: string };
      const timeoutMs = options.timeoutMs ?? 10000;
      const restoreAuthFailure = attachAuthFailureHandler(reject);
      const timeoutId = setTimeout(() => {
        restoreAuthFailure();
        reject(new Error(`Timed out after ${timeoutMs}ms while waiting for Naver Maps script.`));
      }, timeoutMs);

      const cleanup = () => {
        clearTimeout(timeoutId);
        restoreAuthFailure();
      };

      const handleReady = () => {
        waitForNaverMapsReady(timeoutMs, options.submodules)
          .then(() => {
            cleanup();
            resolve();
          })
          .catch((error) => {
            cleanup();
            reject(error instanceof Error ? error : new Error("Naver Maps is not ready."));
          });
      };

      const onLoad = () => {
        handleReady();
      };

      const onError = () => {
        cleanup();
        reject(new Error("Failed to load Naver Maps script."));
      };

      if (existingScript.dataset.reactNaverMapsKitLoaded === "true") {
        handleReady();
        return;
      }

      if (
        existingScriptWithState.readyState === "loaded" ||
        existingScriptWithState.readyState === "complete"
      ) {
        handleReady();
        return;
      }

      existingScript.addEventListener("load", onLoad, { once: true });
      existingScript.addEventListener("error", onError, { once: true });
    }).finally(() => {
      inFlightLoad = null;
      inFlightScriptUrl = null;
    });

    inFlightLoad = trackedPromise;
    inFlightScriptUrl = scriptUrl;
    return trackedPromise;
  }

  const trackedPromise = new Promise<void>((resolve, reject) => {
    const timeoutMs = options.timeoutMs ?? 10000;
    const script = document.createElement("script");
    setJsContentLoadedFlag(false);
    const restoreAuthFailure = attachAuthFailureHandler(reject);
    const timeoutId = setTimeout(() => {
      cleanup();
      script.remove();
      reject(new Error(`Timed out after ${timeoutMs}ms while loading Naver Maps script.`));
    }, timeoutMs);

    const cleanup = () => {
      script.removeEventListener("load", onLoad);
      script.removeEventListener("error", onError);
      clearTimeout(timeoutId);
      restoreAuthFailure();
    };

    const onLoad = () => {
      script.dataset.reactNaverMapsKitLoaded = "true";

      waitForNaverMapsReady(timeoutMs, options.submodules)
        .then(() => {
          cleanup();
          resolve();
        })
        .catch((error) => {
          cleanup();
          reject(error instanceof Error ? error : new Error("Naver Maps is not ready."));
        });
    };

    const onError = () => {
      cleanup();
      reject(new Error("Failed to load Naver Maps script."));
    };

    script.src = scriptUrl;
    script.setAttribute("data-react-naver-maps-kit", "true");
    script.type = "text/javascript";
    script.async = true;
    script.defer = true;

    if (options.nonce) {
      script.nonce = options.nonce;
    }

    script.addEventListener("load", onLoad);
    script.addEventListener("error", onError);

    document.head.append(script);
  }).finally(() => {
    inFlightLoad = null;
    inFlightScriptUrl = null;
  });

  inFlightLoad = trackedPromise;
  inFlightScriptUrl = scriptUrl;

  return trackedPromise;
}
