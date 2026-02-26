import React, { useCallback, useMemo, useRef, useState } from "react";
import { Gpx, NaverMap, NaverMapProvider, type GpxRef } from "react-naver-maps-kit";

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

function getFeatureCount(ref: React.RefObject<GpxRef | null>) {
  return ref.current?.getAllFeature()?.length ?? 0;
}

function readGeoJsonFeatureCount(ref: React.RefObject<GpxRef | null>) {
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
  const gpxRef = useRef<GpxRef>(null);

  const [mapReady, setMapReady] = useState(false);
  const [strokeColor, setStrokeColor] = useState("#ef4444");

  const [dataReadyCount, setDataReadyCount] = useState(0);
  const [featuresAddedCount, setFeaturesAddedCount] = useState(0);
  const [lastAddedLength, setLastAddedLength] = useState(0);
  const [featureCount, setFeatureCount] = useState(0);
  const [styleStrokeColor, setStyleStrokeColor] = useState("");
  const [geojsonType, setGeojsonType] = useState("");
  const [lastError, setLastError] = useState("");

  const style = useMemo(
    () => ({
      strokeColor,
      strokeWeight: 4,
      strokeOpacity: 0.9,
      fillColor: strokeColor,
      fillOpacity: 0.25
    }),
    [strokeColor]
  );

  const readState = useCallback(() => {
    const currentStyle = gpxRef.current?.getStyle() as { strokeColor?: string } | undefined;

    setFeatureCount(getFeatureCount(gpxRef));
    setStyleStrokeColor(String(currentStyle?.strokeColor ?? ""));
    setGeojsonType(
      String((gpxRef.current?.toGeoJson() as { type?: string } | undefined)?.type ?? "")
    );
  }, []);

  return (
    <ScenarioLayout
      buttons={
        <>
          <button data-testid="set-stroke-red" onClick={() => setStrokeColor("#ef4444")}>
            stroke red
          </button>
          <button data-testid="set-stroke-blue" onClick={() => setStrokeColor("#2563eb")}>
            stroke blue
          </button>
          <button data-testid="read-state" onClick={readState}>
            상태 읽기
          </button>
        </>
      }
      logs={
        <>
          <span data-testid="map-ready">{String(mapReady)}</span>
          <span data-testid="data-ready-count">{dataReadyCount}</span>
          <span data-testid="features-added-count">{featuresAddedCount}</span>
          <span data-testid="last-added-length">{lastAddedLength}</span>
          <span data-testid="feature-count">{featureCount}</span>
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
            defaultZoom={12}
            style={{ width: "100%", height: 500 }}
            onMapReady={() => setMapReady(true)}
          >
            <Gpx
              ref={gpxRef}
              url="/gpx-a.gpx"
              style={style}
              onDataReady={() => setDataReadyCount((v) => v + 1)}
              onFeaturesAdded={(features) => {
                setFeaturesAddedCount((v) => v + 1);
                setLastAddedLength(features?.length ?? 0);
              }}
              onDataError={(error) => setLastError(error.message)}
            />
          </NaverMap>
        </NaverMapProvider>
      }
    />
  );
}

function UrlSwitchPage() {
  const gpxRef = useRef<GpxRef>(null);

  const [mapReady, setMapReady] = useState(false);
  const [url, setUrl] = useState("/gpx-a.gpx");

  const [featuresAddedCount, setFeaturesAddedCount] = useState(0);
  const [lastAddedLength, setLastAddedLength] = useState(0);
  const [featureCount, setFeatureCount] = useState(0);
  const [geojsonFeatureCount, setGeojsonFeatureCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);

  const readState = useCallback(() => {
    setFeatureCount(getFeatureCount(gpxRef));
    setGeojsonFeatureCount(readGeoJsonFeatureCount(gpxRef));
  }, []);

  return (
    <ScenarioLayout
      buttons={
        <>
          <button data-testid="set-url-a" onClick={() => setUrl("/gpx-a.gpx")}>
            url a
          </button>
          <button data-testid="set-url-b" onClick={() => setUrl("/gpx-b.gpx")}>
            url b
          </button>
          <button data-testid="read-state" onClick={readState}>
            상태 읽기
          </button>
        </>
      }
      logs={
        <>
          <span data-testid="map-ready">{String(mapReady)}</span>
          <span data-testid="url-state">{url}</span>
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
            defaultZoom={12}
            style={{ width: "100%", height: 500 }}
            onMapReady={() => setMapReady(true)}
          >
            <Gpx
              ref={gpxRef}
              url={url}
              onFeaturesAdded={(features) => {
                setFeaturesAddedCount((v) => v + 1);
                setLastAddedLength(features?.length ?? 0);
              }}
              onDataError={() => setErrorCount((v) => v + 1)}
            />
          </NaverMap>
        </NaverMapProvider>
      }
    />
  );
}

function EventPage() {
  const gpxRef = useRef<GpxRef>(null);

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
      const data = gpxRef.current?.getInstance();

      if (!data) {
        return;
      }

      naver.maps.Event.trigger(data, eventName, {} as naver.maps.PointerEvent);
    },
    []
  );

  const triggerAddFeature = useCallback(() => {
    const data = gpxRef.current?.getInstance();

    if (!data) {
      return;
    }

    data.addGeoJson(
      {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            id: `extra-${Date.now()}`,
            properties: { kind: "extra" },
            geometry: {
              type: "Point",
              coordinates: [126.985, 37.565]
            }
          }
        ]
      } as naver.maps.GeoJSON,
      true
    );
  }, []);

  const triggerRemoveFeature = useCallback(() => {
    const data = gpxRef.current?.getInstance();

    if (!data) {
      return;
    }

    const features = data.getAllFeature();

    if (features.length === 0) {
      return;
    }

    data.removeFeature(features[features.length - 1]);
  }, []);

  const triggerPropertyChanged = useCallback(() => {
    const feature = gpxRef.current?.getAllFeature()?.[0];

    if (!feature) {
      return;
    }

    feature.setProperty("e2e-property", Date.now());
  }, []);

  const readState = useCallback(() => {
    setFeatureCount(getFeatureCount(gpxRef));
  }, []);

  return (
    <ScenarioLayout
      buttons={
        <>
          <button data-testid="trigger-click" onClick={() => triggerPointerEvent("click")}>
            click
          </button>
          <button data-testid="trigger-dblclick" onClick={() => triggerPointerEvent("dblclick")}>
            dblclick
          </button>
          <button
            data-testid="trigger-rightclick"
            onClick={() => triggerPointerEvent("rightclick")}
          >
            rightclick
          </button>
          <button data-testid="trigger-mousedown" onClick={() => triggerPointerEvent("mousedown")}>
            mousedown
          </button>
          <button data-testid="trigger-mouseup" onClick={() => triggerPointerEvent("mouseup")}>
            mouseup
          </button>
          <button data-testid="trigger-mouseover" onClick={() => triggerPointerEvent("mouseover")}>
            mouseover
          </button>
          <button data-testid="trigger-mouseout" onClick={() => triggerPointerEvent("mouseout")}>
            mouseout
          </button>
          <button data-testid="trigger-addfeature" onClick={triggerAddFeature}>
            addfeature
          </button>
          <button data-testid="trigger-removefeature" onClick={triggerRemoveFeature}>
            removefeature
          </button>
          <button data-testid="trigger-property-changed" onClick={triggerPropertyChanged}>
            property_changed
          </button>
          <button data-testid="read-state" onClick={readState}>
            상태 읽기
          </button>
          <button data-testid="clear-log" onClick={() => setEventLog([])}>
            로그 비우기
          </button>
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
            <Gpx
              ref={gpxRef}
              url="/gpx-a.gpx"
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

function RefPage() {
  const gpxRef = useRef<GpxRef>(null);

  const [mapReady, setMapReady] = useState(false);
  const [featureCount, setFeatureCount] = useState(0);
  const [mapBound, setMapBound] = useState("");
  const [styleStrokeColor, setStyleStrokeColor] = useState("");
  const [featureByIdFound, setFeatureByIdFound] = useState(false);
  const [geojsonType, setGeojsonType] = useState("");

  const readState = useCallback(() => {
    const style = gpxRef.current?.getStyle() as { strokeColor?: string } | undefined;
    const geojson = gpxRef.current?.toGeoJson() as { type?: string } | undefined;

    setFeatureCount(getFeatureCount(gpxRef));
    setMapBound(gpxRef.current?.getMap() ? "true" : "false");
    setStyleStrokeColor(String(style?.strokeColor ?? ""));
    setGeojsonType(String(geojson?.type ?? ""));
  }, []);

  const setStyleGreen = useCallback(() => {
    gpxRef.current?.setStyle({
      strokeColor: "#16a34a",
      strokeWeight: 5,
      strokeOpacity: 1
    });
  }, []);

  const removeFirstFeature = useCallback(() => {
    const first = gpxRef.current?.getAllFeature()?.[0];

    if (!first) {
      return;
    }

    gpxRef.current?.removeFeature(first);
  }, []);

  const overrideFirstFeature = useCallback(() => {
    const first = gpxRef.current?.getAllFeature()?.[0];

    if (!first) {
      return;
    }

    gpxRef.current?.overrideStyle(first, {
      strokeColor: "#f97316",
      strokeWeight: 7,
      strokeOpacity: 1
    });
  }, []);

  const revertFirstFeature = useCallback(() => {
    const first = gpxRef.current?.getAllFeature()?.[0];

    if (!first) {
      return;
    }

    gpxRef.current?.revertStyle(first);
  }, []);

  const findFeatureById = useCallback(() => {
    const first = gpxRef.current?.getAllFeature()?.[0];

    if (!first) {
      setFeatureByIdFound(false);
      return;
    }

    const found = gpxRef.current?.getFeatureById(first.getId());
    setFeatureByIdFound(Boolean(found));
  }, []);

  return (
    <ScenarioLayout
      buttons={
        <>
          <button data-testid="ref-read-state" onClick={readState}>
            상태 읽기
          </button>
          <button data-testid="ref-set-style-green" onClick={setStyleGreen}>
            setStyle green
          </button>
          <button data-testid="ref-remove-first" onClick={removeFirstFeature}>
            remove first
          </button>
          <button data-testid="ref-override-first" onClick={overrideFirstFeature}>
            override first
          </button>
          <button data-testid="ref-revert-first" onClick={revertFirstFeature}>
            revert first
          </button>
          <button data-testid="ref-find-feature-by-id" onClick={findFeatureById}>
            find by id
          </button>
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
            <Gpx ref={gpxRef} url="/gpx-a.gpx" />
          </NaverMap>
        </NaverMapProvider>
      }
    />
  );
}

function LifecyclePage() {
  const gpxRef = useRef<GpxRef>(null);

  const [mapReady, setMapReady] = useState(false);
  const [showGpx, setShowGpx] = useState(true);
  const [dataReadyCount, setDataReadyCount] = useState(0);
  const [dataDestroyCount, setDataDestroyCount] = useState(0);
  const [instanceExists, setInstanceExists] = useState(false);

  const readState = useCallback(() => {
    setInstanceExists(Boolean(gpxRef.current?.getInstance()));
  }, []);

  return (
    <ScenarioLayout
      buttons={
        <>
          <button data-testid="toggle-gpx" onClick={() => setShowGpx((v) => !v)}>
            gpx 토글
          </button>
          <button data-testid="read-state" onClick={readState}>
            상태 읽기
          </button>
        </>
      }
      logs={
        <>
          <span data-testid="map-ready">{String(mapReady)}</span>
          <span data-testid="show-gpx">{String(showGpx)}</span>
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
            {showGpx && (
              <Gpx
                ref={gpxRef}
                url="/gpx-a.gpx"
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
  const [mapReady, setMapReady] = useState(false);
  const [url, setUrl] = useState("/gpx-a.gpx");

  const [featuresAddedCount, setFeaturesAddedCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [lastError, setLastError] = useState("");

  return (
    <ScenarioLayout
      buttons={
        <>
          <button data-testid="set-url-valid" onClick={() => setUrl("/gpx-a.gpx")}>
            valid a
          </button>
          <button data-testid="set-url-valid-b" onClick={() => setUrl("/gpx-b.gpx")}>
            valid b
          </button>
          <button
            data-testid="set-url-network-error"
            onClick={() => setUrl("http://127.0.0.1:1/gpx-unreachable.gpx")}
          >
            network error
          </button>
          <button data-testid="set-url-invalid-xml" onClick={() => setUrl("/gpx-invalid.gpx")}>
            invalid xml
          </button>
        </>
      }
      logs={
        <>
          <span data-testid="map-ready">{String(mapReady)}</span>
          <span data-testid="url-state">{url}</span>
          <span data-testid="features-added-count">{featuresAddedCount}</span>
          <span data-testid="error-count">{errorCount}</span>
          <span data-testid="last-error">{lastError}</span>
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
            <Gpx
              url={url}
              onFeaturesAdded={() => setFeaturesAddedCount((v) => v + 1)}
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

export const gpxRoutes: Record<string, React.FC> = {
  "/gpx/basic": BasicPage,
  "/gpx/url-switch": UrlSwitchPage,
  "/gpx/events": EventPage,
  "/gpx/ref": RefPage,
  "/gpx/lifecycle": LifecyclePage,
  "/gpx/error": ErrorPage
};
