import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GeoJson, NaverMap, NaverMapProvider, type GeoJsonProps, type GeoJsonRef } from "react-naver-maps-kit";

import { DEFAULT_CENTER, NCP_KEY_ID } from "../constants";

function ScenarioLayout({
  buttons,
  logs,
  map
}: {
  buttons: React.ReactNode;
  logs: React.ReactNode;
  map: React.ReactNode;
}) {
  return (
    <div className="scenario-layout">
      <div className="scenario-actions">{buttons}</div>
      <div className="scenario-body">
        <div className="scenario-logs">{logs}</div>
        <div className="scenario-map">{map}</div>
      </div>
    </div>
  );
}

const INLINE_DATA_A: GeoJsonProps["data"] = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: "point-a",
      properties: { name: "point-a" },
      geometry: {
        type: "Point",
        coordinates: [126.978, 37.566]
      }
    },
    {
      type: "Feature",
      id: "polygon-a",
      properties: { name: "polygon-a" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [126.965, 37.57],
            [126.98, 37.58],
            [126.995, 37.57],
            [126.98, 37.555],
            [126.965, 37.57]
          ]
        ]
      }
    }
  ]
} as naver.maps.GeoJSON;

const INLINE_DATA_B: GeoJsonProps["data"] = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: "point-b",
      properties: { name: "point-b" },
      geometry: {
        type: "Point",
        coordinates: [127.0276, 37.4981]
      }
    }
  ]
} as naver.maps.GeoJSON;

function getFeatureCount(ref: React.RefObject<GeoJsonRef | null>) {
  return ref.current?.getAllFeature()?.length ?? 0;
}

function getGeoJsonFeatureCount(ref: React.RefObject<GeoJsonRef | null>) {
  const geojson = ref.current?.toGeoJson() as { type?: string; features?: unknown[] } | undefined;

  if (Array.isArray(geojson?.features)) {
    return geojson.features.length;
  }

  if (geojson?.type === "Feature") {
    return 1;
  }

  return 0;
}

function BasicPage() {
  const geoJsonRef = useRef<GeoJsonRef>(null);

  const [mapReady, setMapReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [data, setData] = useState<GeoJsonProps["data"] | null>(null);
  const [strokeColor, setStrokeColor] = useState("#2563eb");

  const [dataReadyCount, setDataReadyCount] = useState(0);
  const [featuresAddedCount, setFeaturesAddedCount] = useState(0);
  const [lastAddedLength, setLastAddedLength] = useState(0);
  const [featureCount, setFeatureCount] = useState(0);
  const [mapBound, setMapBound] = useState("false");
  const [styleStrokeColor, setStyleStrokeColor] = useState("");
  const [geojsonType, setGeojsonType] = useState("");
  const [lastError, setLastError] = useState("");

  useEffect(() => {
    let alive = true;

    fetch("/seoul.geojson")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch seoul.geojson: ${res.status}`);
        }
        return res.json();
      })
      .then((json) => {
        if (!alive) {
          return;
        }

        setData(json as naver.maps.GeoJSON);
      })
      .catch((error) => {
        if (!alive) {
          return;
        }

        setFetchError(error instanceof Error ? error.message : String(error));
      })
      .finally(() => {
        if (alive) {
          setLoading(false);
        }
      });

    return () => {
      alive = false;
    };
  }, []);

  const style = useMemo(
    () => ({
      strokeColor,
      fillColor: strokeColor,
      fillOpacity: 0.2,
      strokeWeight: 2,
      strokeOpacity: 0.9
    }),
    [strokeColor]
  );

  const readState = useCallback(() => {
    const currentStyle = geoJsonRef.current?.getStyle() as { strokeColor?: string } | undefined;
    const geojson = geoJsonRef.current?.toGeoJson() as { type?: string } | undefined;

    setFeatureCount(getFeatureCount(geoJsonRef));
    setMapBound(geoJsonRef.current?.getMap() ? "true" : "false");
    setStyleStrokeColor(String(currentStyle?.strokeColor ?? ""));
    setGeojsonType(String(geojson?.type ?? ""));
  }, []);

  return (
    <ScenarioLayout
      buttons={
        <>
          <button data-testid="set-stroke-blue" onClick={() => setStrokeColor("#2563eb")}>
            stroke blue
          </button>
          <button data-testid="set-stroke-red" onClick={() => setStrokeColor("#ef4444")}>
            stroke red
          </button>
          <button data-testid="read-state" onClick={readState}>
            상태 읽기
          </button>
        </>
      }
      logs={
        <>
          <span data-testid="map-ready">{String(mapReady)}</span>
          <span data-testid="loading">{String(loading)}</span>
          <span data-testid="fetch-error">{fetchError}</span>
          <span data-testid="data-ready-count">{dataReadyCount}</span>
          <span data-testid="features-added-count">{featuresAddedCount}</span>
          <span data-testid="last-added-length">{lastAddedLength}</span>
          <span data-testid="feature-count">{featureCount}</span>
          <span data-testid="map-bound">{mapBound}</span>
          <span data-testid="style-stroke-color">{styleStrokeColor}</span>
          <span data-testid="geojson-type">{geojsonType}</span>
          <span data-testid="last-error">{lastError}</span>
        </>
      }
      map={
        <NaverMapProvider ncpKeyId={NCP_KEY_ID} timeoutMs={15000}>
          <NaverMap
            data-testid="map-container"
            defaultCenter={DEFAULT_CENTER}
            defaultZoom={11}
            style={{ width: "100%", height: 500 }}
            onMapReady={() => setMapReady(true)}
          >
            {data && (
              <GeoJson
                ref={geoJsonRef}
                data={data}
                style={style}
                onDataReady={() => setDataReadyCount((v) => v + 1)}
                onFeaturesAdded={(features) => {
                  setFeaturesAddedCount((v) => v + 1);
                  setLastAddedLength(features.length);
                }}
                onDataError={(error) => setLastError(error.message)}
              />
            )}
          </NaverMap>
        </NaverMapProvider>
      }
    />
  );
}

function DataSwitchPage() {
  const geoJsonRef = useRef<GeoJsonRef>(null);

  const [mapReady, setMapReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [seoulData, setSeoulData] = useState<GeoJsonProps["data"] | null>(null);
  const [data, setData] = useState<GeoJsonProps["data"] | null>(null);
  const [dataState, setDataState] = useState("loading");

  const [featuresAddedCount, setFeaturesAddedCount] = useState(0);
  const [lastAddedLength, setLastAddedLength] = useState(0);
  const [featureCount, setFeatureCount] = useState(0);
  const [geojsonFeatureCount, setGeojsonFeatureCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);

  useEffect(() => {
    let alive = true;

    fetch("/seoul.geojson")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch seoul.geojson: ${res.status}`);
        }
        return res.json();
      })
      .then((json) => {
        if (!alive) {
          return;
        }

        const next = json as naver.maps.GeoJSON;
        setSeoulData(next);
        setData(next);
        setDataState("seoul");
      })
      .catch(() => {
        if (!alive) {
          return;
        }

        setData(INLINE_DATA_A);
        setDataState("inline-a");
      })
      .finally(() => {
        if (alive) {
          setLoading(false);
        }
      });

    return () => {
      alive = false;
    };
  }, []);

  const readState = useCallback(() => {
    setFeatureCount(getFeatureCount(geoJsonRef));
    setGeojsonFeatureCount(getGeoJsonFeatureCount(geoJsonRef));
  }, []);

  return (
    <ScenarioLayout
      buttons={
        <>
          <button
            data-testid="set-data-seoul"
            onClick={() => {
              if (!seoulData) {
                return;
              }

              setData(seoulData);
              setDataState("seoul");
            }}
          >
            data seoul
          </button>
          <button
            data-testid="set-data-inline-a"
            onClick={() => {
              setData(INLINE_DATA_A);
              setDataState("inline-a");
            }}
          >
            data inline a
          </button>
          <button
            data-testid="set-data-inline-b"
            onClick={() => {
              setData(INLINE_DATA_B);
              setDataState("inline-b");
            }}
          >
            data inline b
          </button>
          <button data-testid="read-state" onClick={readState}>
            상태 읽기
          </button>
        </>
      }
      logs={
        <>
          <span data-testid="map-ready">{String(mapReady)}</span>
          <span data-testid="loading">{String(loading)}</span>
          <span data-testid="data-state">{dataState}</span>
          <span data-testid="features-added-count">{featuresAddedCount}</span>
          <span data-testid="last-added-length">{lastAddedLength}</span>
          <span data-testid="feature-count">{featureCount}</span>
          <span data-testid="geojson-feature-count">{geojsonFeatureCount}</span>
          <span data-testid="error-count">{errorCount}</span>
        </>
      }
      map={
        <NaverMapProvider ncpKeyId={NCP_KEY_ID} timeoutMs={15000}>
          <NaverMap
            data-testid="map-container"
            defaultCenter={DEFAULT_CENTER}
            defaultZoom={11}
            style={{ width: "100%", height: 500 }}
            onMapReady={() => setMapReady(true)}
          >
            {data && (
              <GeoJson
                ref={geoJsonRef}
                data={data}
                onFeaturesAdded={(features) => {
                  setFeaturesAddedCount((v) => v + 1);
                  setLastAddedLength(features.length);
                }}
                onDataError={() => setErrorCount((v) => v + 1)}
              />
            )}
          </NaverMap>
        </NaverMapProvider>
      }
    />
  );
}

function EventPage() {
  const geoJsonRef = useRef<GeoJsonRef>(null);

  const [mapReady, setMapReady] = useState(false);
  const [eventLog, setEventLog] = useState<string[]>([]);
  const [featureCount, setFeatureCount] = useState(0);

  const appendLog = useCallback((label: string) => {
    setEventLog((prev) => [...prev, label]);
  }, []);

  const triggerPointerEvent = useCallback(
    (
      eventName:
        | "click"
        | "dblclick"
        | "rightclick"
        | "mousedown"
        | "mouseup"
        | "mouseover"
        | "mouseout"
    ) => {
      const data = geoJsonRef.current?.getInstance();

      if (!data) {
        return;
      }

      naver.maps.Event.trigger(data, eventName, {} as naver.maps.PointerEvent);
    },
    []
  );

  const triggerAddFeature = useCallback(() => {
    geoJsonRef.current?.getInstance()?.addGeoJson(
      {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            id: `extra-${Date.now()}`,
            properties: { name: "extra" },
            geometry: {
              type: "Point",
              coordinates: [126.989, 37.567]
            }
          }
        ]
      } as naver.maps.GeoJSON,
      true
    );
  }, []);

  const triggerRemoveFeature = useCallback(() => {
    const instance = geoJsonRef.current?.getInstance();
    const features = instance?.getAllFeature() ?? [];

    if (!instance || features.length === 0) {
      return;
    }

    instance.removeFeature(features[features.length - 1]);
  }, []);

  const triggerPropertyChanged = useCallback(() => {
    const feature = geoJsonRef.current?.getAllFeature()?.[0];

    if (!feature) {
      return;
    }

    feature.setProperty("e2e-property", Date.now());
  }, []);

  const readState = useCallback(() => {
    setFeatureCount(getFeatureCount(geoJsonRef));
  }, []);

  return (
    <ScenarioLayout
      buttons={
        <>
          <button data-testid="trigger-click" onClick={() => triggerPointerEvent("click")}>click</button>
          <button data-testid="trigger-dblclick" onClick={() => triggerPointerEvent("dblclick")}>dblclick</button>
          <button data-testid="trigger-rightclick" onClick={() => triggerPointerEvent("rightclick")}>rightclick</button>
          <button data-testid="trigger-mousedown" onClick={() => triggerPointerEvent("mousedown")}>mousedown</button>
          <button data-testid="trigger-mouseup" onClick={() => triggerPointerEvent("mouseup")}>mouseup</button>
          <button data-testid="trigger-mouseover" onClick={() => triggerPointerEvent("mouseover")}>mouseover</button>
          <button data-testid="trigger-mouseout" onClick={() => triggerPointerEvent("mouseout")}>mouseout</button>
          <button data-testid="trigger-addfeature" onClick={triggerAddFeature}>addfeature</button>
          <button data-testid="trigger-removefeature" onClick={triggerRemoveFeature}>removefeature</button>
          <button data-testid="trigger-property-changed" onClick={triggerPropertyChanged}>property_changed</button>
          <button data-testid="read-state" onClick={readState}>상태 읽기</button>
          <button data-testid="clear-log" onClick={() => setEventLog([])}>로그 비우기</button>
        </>
      }
      logs={
        <>
          <span data-testid="map-ready">{String(mapReady)}</span>
          <span data-testid="event-count">{eventLog.length}</span>
          <span data-testid="event-log">{JSON.stringify(eventLog)}</span>
          <span data-testid="feature-count">{featureCount}</span>
        </>
      }
      map={
        <NaverMapProvider ncpKeyId={NCP_KEY_ID} timeoutMs={15000}>
          <NaverMap
            data-testid="map-container"
            defaultCenter={DEFAULT_CENTER}
            defaultZoom={12}
            style={{ width: "100%", height: 500 }}
            onMapReady={() => setMapReady(true)}
          >
            <GeoJson
              ref={geoJsonRef}
              data={INLINE_DATA_A}
              onAddFeature={() => appendLog("addfeature")}
              onRemoveFeature={() => appendLog("removefeature")}
              onPropertyChanged={() => appendLog("property_changed")}
              onClick={() => appendLog("click")}
              onDblClick={() => appendLog("dblclick")}
              onRightClick={() => appendLog("rightclick")}
              onMouseDown={() => appendLog("mousedown")}
              onMouseUp={() => appendLog("mouseup")}
              onMouseOver={() => appendLog("mouseover")}
              onMouseOut={() => appendLog("mouseout")}
            />
          </NaverMap>
        </NaverMapProvider>
      }
    />
  );
}

function DistrictClickPage() {
  const geoJsonRef = useRef<GeoJsonRef>(null);

  const [mapReady, setMapReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [data, setData] = useState<GeoJsonProps["data"] | null>(null);
  const [featureCount, setFeatureCount] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [clickedGu, setClickedGu] = useState("");

  useEffect(() => {
    let alive = true;

    fetch("/seoul.geojson")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch seoul.geojson: ${res.status}`);
        }
        return res.json();
      })
      .then((json) => {
        if (!alive) {
          return;
        }

        setData(json as naver.maps.GeoJSON);
      })
      .catch((error) => {
        if (!alive) {
          return;
        }

        setFetchError(error instanceof Error ? error.message : String(error));
      })
      .finally(() => {
        if (alive) {
          setLoading(false);
        }
      });

    return () => {
      alive = false;
    };
  }, []);

  const readState = useCallback(() => {
    setFeatureCount(getFeatureCount(geoJsonRef));
  }, []);

  const triggerGuClick = useCallback((guName: string) => {
    const instance = geoJsonRef.current?.getInstance();
    const feature = geoJsonRef
      .current
      ?.getAllFeature()
      ?.find((candidate) => String(candidate.getProperty("SIG_KOR_NM")) === guName);

    if (!instance || !feature) {
      return;
    }

    naver.maps.Event.trigger(
      instance,
      "click",
      { feature } as unknown as naver.maps.PointerEvent
    );
  }, []);

  return (
    <ScenarioLayout
      buttons={
        <>
          <button data-testid="trigger-gu-jongno" onClick={() => triggerGuClick("종로구")}>
            click 종로구
          </button>
          <button data-testid="trigger-gu-gangnam" onClick={() => triggerGuClick("강남구")}>
            click 강남구
          </button>
          <button data-testid="read-state" onClick={readState}>상태 읽기</button>
        </>
      }
      logs={
        <>
          <span data-testid="map-ready">{String(mapReady)}</span>
          <span data-testid="loading">{String(loading)}</span>
          <span data-testid="fetch-error">{fetchError}</span>
          <span data-testid="feature-count">{featureCount}</span>
          <span data-testid="click-count">{clickCount}</span>
          <span data-testid="clicked-gu">{clickedGu}</span>
        </>
      }
      map={
        <NaverMapProvider ncpKeyId={NCP_KEY_ID} timeoutMs={15000}>
          <NaverMap
            data-testid="map-container"
            defaultCenter={DEFAULT_CENTER}
            defaultZoom={11}
            style={{ width: "100%", height: 500 }}
            onMapReady={() => setMapReady(true)}
          >
            {data && (
              <GeoJson
                ref={geoJsonRef}
                data={data}
                onClick={(event) => {
                  const feature = (event as unknown as { feature?: naver.maps.Feature }).feature;
                  const guName = feature ? String(feature.getProperty("SIG_KOR_NM") ?? "") : "";

                  setClickCount((v) => v + 1);
                  setClickedGu(guName);
                }}
              />
            )}
          </NaverMap>
        </NaverMapProvider>
      }
    />
  );
}

function RefPage() {
  const geoJsonRef = useRef<GeoJsonRef>(null);

  const [mapReady, setMapReady] = useState(false);
  const [featureCount, setFeatureCount] = useState(0);
  const [mapBound, setMapBound] = useState("false");
  const [styleStrokeColor, setStyleStrokeColor] = useState("");
  const [featureByIdFound, setFeatureByIdFound] = useState(false);
  const [geojsonType, setGeojsonType] = useState("");

  const readState = useCallback(() => {
    const style = geoJsonRef.current?.getStyle() as { strokeColor?: string } | undefined;
    const geojson = geoJsonRef.current?.toGeoJson() as { type?: string } | undefined;

    setFeatureCount(getFeatureCount(geoJsonRef));
    setMapBound(geoJsonRef.current?.getMap() ? "true" : "false");
    setStyleStrokeColor(String(style?.strokeColor ?? ""));
    setGeojsonType(String(geojson?.type ?? ""));
  }, []);

  const setStyleGreen = useCallback(() => {
    geoJsonRef.current?.setStyle({
      strokeColor: "#16a34a",
      fillColor: "#16a34a",
      fillOpacity: 0.25,
      strokeWeight: 4,
      strokeOpacity: 1
    });
  }, []);

  const removeFirstFeature = useCallback(() => {
    const first = geoJsonRef.current?.getAllFeature()?.[0];

    if (!first) {
      return;
    }

    geoJsonRef.current?.removeFeature(first);
  }, []);

  const overrideFirstFeature = useCallback(() => {
    const first = geoJsonRef.current?.getAllFeature()?.[0];

    if (!first) {
      return;
    }

    geoJsonRef.current?.overrideStyle(first, {
      strokeColor: "#f97316",
      fillColor: "#f97316",
      fillOpacity: 0.5,
      strokeWeight: 6,
      strokeOpacity: 1
    });
  }, []);

  const revertFirstFeature = useCallback(() => {
    const first = geoJsonRef.current?.getAllFeature()?.[0];

    if (!first) {
      return;
    }

    geoJsonRef.current?.revertStyle(first);
  }, []);

  const findFeatureById = useCallback(() => {
    const found = geoJsonRef.current?.getFeatureById("point-a");
    setFeatureByIdFound(Boolean(found));
  }, []);

  return (
    <ScenarioLayout
      buttons={
        <>
          <button data-testid="ref-read-state" onClick={readState}>상태 읽기</button>
          <button data-testid="ref-set-style-green" onClick={setStyleGreen}>setStyle green</button>
          <button data-testid="ref-remove-first" onClick={removeFirstFeature}>remove first</button>
          <button data-testid="ref-override-first" onClick={overrideFirstFeature}>override first</button>
          <button data-testid="ref-revert-first" onClick={revertFirstFeature}>revert first</button>
          <button data-testid="ref-find-feature-by-id" onClick={findFeatureById}>find by id</button>
        </>
      }
      logs={
        <>
          <span data-testid="map-ready">{String(mapReady)}</span>
          <span data-testid="feature-count">{featureCount}</span>
          <span data-testid="map-bound">{mapBound}</span>
          <span data-testid="style-stroke-color">{styleStrokeColor}</span>
          <span data-testid="feature-by-id-found">{String(featureByIdFound)}</span>
          <span data-testid="geojson-type">{geojsonType}</span>
        </>
      }
      map={
        <NaverMapProvider ncpKeyId={NCP_KEY_ID} timeoutMs={15000}>
          <NaverMap
            data-testid="map-container"
            defaultCenter={DEFAULT_CENTER}
            defaultZoom={12}
            style={{ width: "100%", height: 500 }}
            onMapReady={() => setMapReady(true)}
          >
            <GeoJson ref={geoJsonRef} data={INLINE_DATA_A} />
          </NaverMap>
        </NaverMapProvider>
      }
    />
  );
}

function LifecyclePage() {
  const geoJsonRef = useRef<GeoJsonRef>(null);

  const [mapReady, setMapReady] = useState(false);
  const [showGeoJson, setShowGeoJson] = useState(true);
  const [dataReadyCount, setDataReadyCount] = useState(0);
  const [dataDestroyCount, setDataDestroyCount] = useState(0);
  const [instanceExists, setInstanceExists] = useState(false);

  const readState = useCallback(() => {
    setInstanceExists(Boolean(geoJsonRef.current?.getInstance()));
  }, []);

  return (
    <ScenarioLayout
      buttons={
        <>
          <button data-testid="toggle-geojson" onClick={() => setShowGeoJson((v) => !v)}>
            geojson 토글
          </button>
          <button data-testid="read-state" onClick={readState}>상태 읽기</button>
        </>
      }
      logs={
        <>
          <span data-testid="map-ready">{String(mapReady)}</span>
          <span data-testid="show-geojson">{String(showGeoJson)}</span>
          <span data-testid="data-ready-count">{dataReadyCount}</span>
          <span data-testid="data-destroy-count">{dataDestroyCount}</span>
          <span data-testid="instance-exists">{String(instanceExists)}</span>
        </>
      }
      map={
        <NaverMapProvider ncpKeyId={NCP_KEY_ID} timeoutMs={15000}>
          <NaverMap
            data-testid="map-container"
            defaultCenter={DEFAULT_CENTER}
            defaultZoom={12}
            style={{ width: "100%", height: 500 }}
            onMapReady={() => setMapReady(true)}
          >
            {showGeoJson && (
              <GeoJson
                ref={geoJsonRef}
                data={INLINE_DATA_A}
                onDataReady={() => setDataReadyCount((v) => v + 1)}
                onDataDestroy={() => setDataDestroyCount((v) => v + 1)}
              />
            )}
          </NaverMap>
        </NaverMapProvider>
      }
    />
  );
}

function ErrorPage() {
  const geoJsonRef = useRef<GeoJsonRef>(null);
  const originalAddGeoJsonRef = useRef<((...args: unknown[]) => unknown) | null>(null);

  const [mapReady, setMapReady] = useState(false);
  const [data, setData] = useState<GeoJsonProps["data"]>(INLINE_DATA_A);
  const [dataState, setDataState] = useState("a");

  const [errorCount, setErrorCount] = useState(0);
  const [lastError, setLastError] = useState("");
  const [featureCount, setFeatureCount] = useState(0);
  const [patchedError, setPatchedError] = useState(false);

  const readState = useCallback(() => {
    setFeatureCount(getFeatureCount(geoJsonRef));
  }, []);

  const patchAddGeoJsonError = useCallback(() => {
    const instance = geoJsonRef.current?.getInstance();

    if (!instance || originalAddGeoJsonRef.current) {
      return;
    }

    originalAddGeoJsonRef.current = (instance as unknown as { addGeoJson: (...args: unknown[]) => unknown })
      .addGeoJson;

    (instance as unknown as { addGeoJson: (...args: unknown[]) => unknown }).addGeoJson = () => {
      throw new Error("Forced addGeoJson error for e2e");
    };

    setPatchedError(true);
  }, []);

  const restoreAddGeoJson = useCallback(() => {
    const instance = geoJsonRef.current?.getInstance();

    if (!instance || !originalAddGeoJsonRef.current) {
      return;
    }

    (instance as unknown as { addGeoJson: (...args: unknown[]) => unknown }).addGeoJson =
      originalAddGeoJsonRef.current;
    originalAddGeoJsonRef.current = null;
    setPatchedError(false);
  }, []);

  return (
    <ScenarioLayout
      buttons={
        <>
          <button data-testid="patch-add-geojson-error" onClick={patchAddGeoJsonError}>
            patch addGeoJson error
          </button>
          <button data-testid="restore-add-geojson-error" onClick={restoreAddGeoJson}>
            restore addGeoJson
          </button>
          <button
            data-testid="set-data-a"
            onClick={() => {
              setData(INLINE_DATA_A);
              setDataState("a");
            }}
          >
            data a
          </button>
          <button
            data-testid="set-data-b"
            onClick={() => {
              setData(INLINE_DATA_B);
              setDataState("b");
            }}
          >
            data b
          </button>
          <button data-testid="read-state" onClick={readState}>상태 읽기</button>
        </>
      }
      logs={
        <>
          <span data-testid="map-ready">{String(mapReady)}</span>
          <span data-testid="data-state">{dataState}</span>
          <span data-testid="patched-error">{String(patchedError)}</span>
          <span data-testid="error-count">{errorCount}</span>
          <span data-testid="last-error">{lastError}</span>
          <span data-testid="feature-count">{featureCount}</span>
        </>
      }
      map={
        <NaverMapProvider ncpKeyId={NCP_KEY_ID} timeoutMs={15000}>
          <NaverMap
            data-testid="map-container"
            defaultCenter={DEFAULT_CENTER}
            defaultZoom={12}
            style={{ width: "100%", height: 500 }}
            onMapReady={() => setMapReady(true)}
          >
            <GeoJson
              ref={geoJsonRef}
              data={data}
              onDataError={(error) => {
                setErrorCount((v) => v + 1);
                setLastError(error.message);
              }}
            />
          </NaverMap>
        </NaverMapProvider>
      }
    />
  );
}

export const geoJsonRoutes: Record<string, React.FC> = {
  "/geojson/basic": BasicPage,
  "/geojson/data-switch": DataSwitchPage,
  "/geojson/events": EventPage,
  "/geojson/district-click": DistrictClickPage,
  "/geojson/ref": RefPage,
  "/geojson/lifecycle": LifecyclePage,
  "/geojson/error": ErrorPage
};
