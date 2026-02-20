const NAVER_MAPS_SCRIPT_BASE_URL = "https://oapi.map.naver.com/openapi/v3/maps.js";

type LegacyClientIdParam = "ncpClientId" | "govClientId" | "finClientId";

type Submodule = "geocoder" | "panorama" | "drawing" | "visualization";

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
};

let inFlightLoad: Promise<void> | null = null;
let inFlightScriptUrl: string | null = null;

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

function isNaverMapsReady(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const browserWindow = window as BrowserWindow;

  return Boolean(browserWindow.naver?.maps);
}

function createScriptUrl(options: LoadNaverMapsScriptOptions): string {
  const clientKey = getClientKey(options);
  const params = new URLSearchParams();

  params.set(clientKey.param, clientKey.value);

  if (options.submodules && options.submodules.length > 0) {
    params.set("submodules", options.submodules.join(","));
  }

  return `${NAVER_MAPS_SCRIPT_BASE_URL}?${params.toString()}`;
}

function waitForNaverMapsReady(timeoutMs: number): Promise<void> {
  return new Promise((resolve, reject) => {
    if (isNaverMapsReady()) {
      resolve();
      return;
    }

    const startedAt = Date.now();
    const intervalId = setInterval(() => {
      if (isNaverMapsReady()) {
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

  if (isNaverMapsReady()) {
    return Promise.resolve();
  }

  const scriptUrl = createScriptUrl(options);

  if (inFlightLoad && inFlightScriptUrl === scriptUrl) {
    return inFlightLoad;
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
        waitForNaverMapsReady(timeoutMs)
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

      waitForNaverMapsReady(timeoutMs)
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
