import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  InfoWindow,
  Marker,
  NaverMap,
  NaverMapProvider,
  type InfoWindowRef,
  type MarkerRef,
  type NaverMapRef
} from "react-naver-maps-kit";

import { DEFAULT_CENTER, MARKER_POS_1, MARKER_POS_2, MARKER_POS_3, NCP_KEY_ID } from "../constants";

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

function readLatLng(mapRef: React.RefObject<NaverMapRef | null>): string {
  const center = mapRef.current?.getCenter();

  if (!center) {
    return "";
  }

  return JSON.stringify({ lat: center.y, lng: center.x });
}

function readInfoPosition(infoRef: React.RefObject<InfoWindowRef | null>): string {
  const pos = infoRef.current?.getPosition();

  if (!pos) {
    return "";
  }

  return JSON.stringify({ lat: pos.y, lng: pos.x });
}

function CommonLogs({
  mapReady,
  infoOpenCount,
  infoCloseCount,
  infoReadyCount,
  infoDestroyed,
  infoContent,
  infoPosition,
  mapCenter
}: {
  mapReady: boolean;
  infoOpenCount: number;
  infoCloseCount: number;
  infoReadyCount: number;
  infoDestroyed: boolean;
  infoContent: string;
  infoPosition: string;
  mapCenter: string;
}) {
  return (
    <>
      <span data-testid="map-ready">{String(mapReady)}</span>
      <span data-testid="info-open-count">{infoOpenCount}</span>
      <span data-testid="info-close-count">{infoCloseCount}</span>
      <span data-testid="info-ready-count">{infoReadyCount}</span>
      <span data-testid="info-destroyed">{String(infoDestroyed)}</span>
      <span data-testid="info-content">{infoContent}</span>
      <span data-testid="info-position">{infoPosition}</span>
      <span data-testid="map-center">{mapCenter}</span>
    </>
  );
}

/* ─── basic ─── */

function BasicPage() {
  const mapRef = useRef<NaverMapRef>(null);
  const infoRef = useRef<InfoWindowRef>(null);

  const [mapReady, setMapReady] = useState(false);
  const [openCount, setOpenCount] = useState(0);
  const [closeCount, setCloseCount] = useState(0);
  const [readyCount, setReadyCount] = useState(0);
  const [destroyed, setDestroyed] = useState(false);
  const [contentLog, setContentLog] = useState("");
  const [positionLog, setPositionLog] = useState("");
  const [centerLog, setCenterLog] = useState("");

  const readState = useCallback(() => {
    const content = infoRef.current?.getContent();
    setContentLog(typeof content === "string" ? content : content?.textContent ?? "");
    setPositionLog(readInfoPosition(infoRef));
    setCenterLog(readLatLng(mapRef));
  }, []);

  return (
    <ScenarioLayout
      buttons={<button data-testid="read-state" onClick={readState}>상태 읽기</button>}
      logs={
        <>
          <CommonLogs
            mapReady={mapReady}
            infoOpenCount={openCount}
            infoCloseCount={closeCount}
            infoReadyCount={readyCount}
            infoDestroyed={destroyed}
            infoContent={contentLog}
            infoPosition={positionLog}
            mapCenter={centerLog}
          />
          <span data-testid="basic-priority-content">children-first-content</span>
        </>
      }
      map={
        <NaverMapProvider ncpKeyId={NCP_KEY_ID} timeoutMs={15000}>
          <NaverMap
            ref={mapRef}
            data-testid="map-container"
            defaultCenter={DEFAULT_CENTER}
            defaultZoom={14}
            style={{ width: "100%", height: 500 }}
            onMapReady={() => setMapReady(true)}
          >
            <InfoWindow
              ref={infoRef}
              position={DEFAULT_CENTER}
              content="content-should-not-be-shown"
              visible={true}
              onOpen={() => setOpenCount((c) => c + 1)}
              onClose={() => setCloseCount((c) => c + 1)}
              onInfoWindowReady={() => setReadyCount((c) => c + 1)}
              onInfoWindowDestroy={() => setDestroyed(true)}
            >
              <div data-testid="info-content-node">children-first-content</div>
            </InfoWindow>
          </NaverMap>
        </NaverMapProvider>
      }
    />
  );
}

/* ─── visibility ─── */

function VisibilityPage() {
  const mapRef = useRef<NaverMapRef>(null);
  const infoRef = useRef<InfoWindowRef>(null);

  const [mapReady, setMapReady] = useState(false);
  const [visible, setVisible] = useState(true);
  const [openCount, setOpenCount] = useState(0);
  const [closeCount, setCloseCount] = useState(0);
  const [readyCount, setReadyCount] = useState(0);
  const [destroyed, setDestroyed] = useState(false);
  const [contentLog, setContentLog] = useState("");
  const [positionLog, setPositionLog] = useState("");
  const [centerLog, setCenterLog] = useState("");

  const readState = useCallback(() => {
    const content = infoRef.current?.getContent();
    setContentLog(typeof content === "string" ? content : content?.textContent ?? "");
    setPositionLog(readInfoPosition(infoRef));
    setCenterLog(readLatLng(mapRef));
  }, []);

  return (
    <ScenarioLayout
      buttons={
        <>
          <button data-testid="toggle-visible" onClick={() => setVisible((v) => !v)}>
            visible 토글
          </button>
          <button data-testid="read-state" onClick={readState}>상태 읽기</button>
        </>
      }
      logs={
        <>
          <CommonLogs
            mapReady={mapReady}
            infoOpenCount={openCount}
            infoCloseCount={closeCount}
            infoReadyCount={readyCount}
            infoDestroyed={destroyed}
            infoContent={contentLog}
            infoPosition={positionLog}
            mapCenter={centerLog}
          />
          <span data-testid="visible-state">{String(visible)}</span>
        </>
      }
      map={
        <NaverMapProvider ncpKeyId={NCP_KEY_ID} timeoutMs={15000}>
          <NaverMap
            ref={mapRef}
            data-testid="map-container"
            defaultCenter={DEFAULT_CENTER}
            defaultZoom={14}
            style={{ width: "100%", height: 500 }}
            onMapReady={() => setMapReady(true)}
          >
            <InfoWindow
              ref={infoRef}
              position={DEFAULT_CENTER}
              visible={visible}
              onOpen={() => setOpenCount((c) => c + 1)}
              onClose={() => setCloseCount((c) => c + 1)}
              onInfoWindowReady={() => setReadyCount((c) => c + 1)}
              onInfoWindowDestroy={() => setDestroyed(true)}
            >
              <div data-testid="visibility-content">visibility-content</div>
            </InfoWindow>
          </NaverMap>
        </NaverMapProvider>
      }
    />
  );
}

/* ─── marker-link (marker + anchor) ─── */

const PLACES = [
  { id: 1, name: "서울시청", position: MARKER_POS_1 },
  { id: 2, name: "강남역", position: MARKER_POS_2 },
  { id: 3, name: "서울역", position: MARKER_POS_3 }
] as const;

function MarkerLinkPage() {
  const mapRef = useRef<NaverMapRef>(null);
  const markerRef = useRef<MarkerRef>(null);
  const infoRef = useRef<InfoWindowRef>(null);

  const [mapReady, setMapReady] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(1);
  const [showAnchorInfo, setShowAnchorInfo] = useState(false);
  const [openCount, setOpenCount] = useState(0);
  const [closeCount, setCloseCount] = useState(0);
  const [readyCount, setReadyCount] = useState(0);
  const [destroyed, setDestroyed] = useState(false);
  const [contentLog, setContentLog] = useState("");
  const [positionLog, setPositionLog] = useState("");
  const [centerLog, setCenterLog] = useState("");

  const selectedPlace = useMemo(() => PLACES.find((p) => p.id === selectedId) ?? null, [selectedId]);

  const readState = useCallback(() => {
    const content = infoRef.current?.getContent();
    setContentLog(typeof content === "string" ? content : content?.textContent ?? "");
    setPositionLog(readInfoPosition(infoRef));
    setCenterLog(readLatLng(mapRef));
  }, []);

  return (
    <ScenarioLayout
      buttons={
        <>
          <button data-testid="select-1" onClick={() => setSelectedId(1)}>1번 선택</button>
          <button data-testid="select-2" onClick={() => setSelectedId(2)}>2번 선택</button>
          <button data-testid="select-3" onClick={() => setSelectedId(3)}>3번 선택</button>
          <button data-testid="toggle-anchor-info" onClick={() => setShowAnchorInfo((v) => !v)}>
            anchor info 토글
          </button>
          <button data-testid="read-state" onClick={readState}>상태 읽기</button>
        </>
      }
      logs={
        <>
          <CommonLogs
            mapReady={mapReady}
            infoOpenCount={openCount}
            infoCloseCount={closeCount}
            infoReadyCount={readyCount}
            infoDestroyed={destroyed}
            infoContent={contentLog}
            infoPosition={positionLog}
            mapCenter={centerLog}
          />
          <span data-testid="selected-place">{selectedPlace?.name ?? ""}</span>
          <span data-testid="anchor-visible">{String(showAnchorInfo)}</span>
        </>
      }
      map={
        <NaverMapProvider ncpKeyId={NCP_KEY_ID} timeoutMs={15000}>
          <NaverMap
            ref={mapRef}
            data-testid="map-container"
            defaultCenter={DEFAULT_CENTER}
            defaultZoom={13}
            style={{ width: "100%", height: 500 }}
            onMapReady={() => setMapReady(true)}
          >
            {PLACES.map((place) => (
              <Marker key={place.id} position={place.position} onClick={() => setSelectedId(place.id)}>
                <div data-testid={`place-marker-${place.id}`} style={{ width: 20, height: 20, background: "#0ea5e9", color: "white", textAlign: "center", lineHeight: "20px", borderRadius: "50%" }}>
                  {place.id}
                </div>
              </Marker>
            ))}

            <Marker
              ref={markerRef}
              position={{ lat: DEFAULT_CENTER.lat + 0.01, lng: DEFAULT_CENTER.lng + 0.01 }}
              onClick={() => setShowAnchorInfo((v) => !v)}
            >
              <div data-testid="anchor-marker" style={{ width: 22, height: 22, background: "#f97316", color: "white", textAlign: "center", lineHeight: "22px", borderRadius: "50%" }}>
                A
              </div>
            </Marker>

            {selectedPlace && (
              <InfoWindow
                ref={infoRef}
                position={selectedPlace.position}
                visible={true}
                onOpen={() => setOpenCount((c) => c + 1)}
                onClose={() => setCloseCount((c) => c + 1)}
                onInfoWindowReady={() => setReadyCount((c) => c + 1)}
                onInfoWindowDestroy={() => setDestroyed(true)}
              >
                <div data-testid="selected-place-content">{selectedPlace.name}</div>
              </InfoWindow>
            )}

            <InfoWindow
              anchor={markerRef.current?.getInstance() ?? undefined}
              visible={showAnchorInfo}
              pixelOffset={{ x: 0, y: -40 }}
            >
              <div data-testid="anchor-info-content">anchor-linked-info</div>
            </InfoWindow>
          </NaverMap>
        </NaverMapProvider>
      }
    />
  );
}

/* ─── ref ─── */

function RefPage() {
  const mapRef = useRef<NaverMapRef>(null);
  const infoRef = useRef<InfoWindowRef>(null);

  const [mapReady, setMapReady] = useState(false);
  const [visible, setVisible] = useState(true);
  const [openCount, setOpenCount] = useState(0);
  const [closeCount, setCloseCount] = useState(0);
  const [readyCount, setReadyCount] = useState(0);
  const [destroyed, setDestroyed] = useState(false);
  const [contentLog, setContentLog] = useState("");
  const [positionLog, setPositionLog] = useState("");
  const [centerLog, setCenterLog] = useState("");

  const syncState = useCallback(() => {
    const content = infoRef.current?.getContent();
    setContentLog(typeof content === "string" ? content : content?.textContent ?? "");
    setPositionLog(readInfoPosition(infoRef));
    setCenterLog(readLatLng(mapRef));
  }, []);

  return (
    <ScenarioLayout
      buttons={
        <>
          <button
            data-testid="ref-set-content"
            onClick={() => {
              infoRef.current?.setContent("updated-by-ref-content");
            }}
          >
            content 변경
          </button>
          <button
            data-testid="ref-close"
            onClick={() => {
              infoRef.current?.close();
              setVisible(false);
            }}
          >
            close
          </button>
          <button
            data-testid="ref-open"
            onClick={() => {
              setVisible(true);
              const map = mapRef.current?.getInstance();
              if (map) {
                infoRef.current?.open(map, DEFAULT_CENTER);
              }
            }}
          >
            open
          </button>
          <button data-testid="read-state" onClick={syncState}>상태 읽기</button>
        </>
      }
      logs={
        <>
          <CommonLogs
            mapReady={mapReady}
            infoOpenCount={openCount}
            infoCloseCount={closeCount}
            infoReadyCount={readyCount}
            infoDestroyed={destroyed}
            infoContent={contentLog}
            infoPosition={positionLog}
            mapCenter={centerLog}
          />
          <span data-testid="visible-state">{String(visible)}</span>
        </>
      }
      map={
        <NaverMapProvider ncpKeyId={NCP_KEY_ID} timeoutMs={15000}>
          <NaverMap
            ref={mapRef}
            data-testid="map-container"
            defaultCenter={DEFAULT_CENTER}
            defaultZoom={14}
            style={{ width: "100%", height: 500 }}
            onMapReady={() => setMapReady(true)}
          >
            <InfoWindow
              ref={infoRef}
              position={DEFAULT_CENTER}
              visible={visible}
              onOpen={() => setOpenCount((c) => c + 1)}
              onClose={() => setCloseCount((c) => c + 1)}
              onInfoWindowReady={() => setReadyCount((c) => c + 1)}
              onInfoWindowDestroy={() => setDestroyed(true)}
            >
              <div data-testid="ref-content">initial-ref-content</div>
            </InfoWindow>
          </NaverMap>
        </NaverMapProvider>
      }
    />
  );
}

/* ─── lifecycle ─── */

function LifecyclePage() {
  const mapRef = useRef<NaverMapRef>(null);
  const infoRef = useRef<InfoWindowRef>(null);

  const [mapReady, setMapReady] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const [openCount, setOpenCount] = useState(0);
  const [closeCount, setCloseCount] = useState(0);
  const [readyCount, setReadyCount] = useState(0);
  const [destroyed, setDestroyed] = useState(false);
  const [contentLog, setContentLog] = useState("");
  const [positionLog, setPositionLog] = useState("");
  const [centerLog, setCenterLog] = useState("");

  const readState = useCallback(() => {
    const content = infoRef.current?.getContent();
    setContentLog(typeof content === "string" ? content : content?.textContent ?? "");
    setPositionLog(readInfoPosition(infoRef));
    setCenterLog(readLatLng(mapRef));
  }, []);

  return (
    <ScenarioLayout
      buttons={
        <>
          <button data-testid="toggle-infowindow" onClick={() => setShowInfo((v) => !v)}>
            infowindow mount 토글
          </button>
          <button data-testid="read-state" onClick={readState}>상태 읽기</button>
        </>
      }
      logs={
        <>
          <CommonLogs
            mapReady={mapReady}
            infoOpenCount={openCount}
            infoCloseCount={closeCount}
            infoReadyCount={readyCount}
            infoDestroyed={destroyed}
            infoContent={contentLog}
            infoPosition={positionLog}
            mapCenter={centerLog}
          />
          <span data-testid="show-infowindow">{String(showInfo)}</span>
        </>
      }
      map={
        <NaverMapProvider ncpKeyId={NCP_KEY_ID} timeoutMs={15000}>
          <NaverMap
            ref={mapRef}
            data-testid="map-container"
            defaultCenter={DEFAULT_CENTER}
            defaultZoom={14}
            style={{ width: "100%", height: 500 }}
            onMapReady={() => setMapReady(true)}
          >
            {showInfo && (
              <InfoWindow
                ref={infoRef}
                position={DEFAULT_CENTER}
                visible={true}
                onOpen={() => setOpenCount((c) => c + 1)}
                onClose={() => setCloseCount((c) => c + 1)}
                onInfoWindowReady={() => setReadyCount((c) => c + 1)}
                onInfoWindowDestroy={() => setDestroyed(true)}
              >
                <div data-testid="lifecycle-content">lifecycle-content</div>
              </InfoWindow>
            )}
          </NaverMap>
        </NaverMapProvider>
      }
    />
  );
}

/* ─── options ─── */

function OptionsPage() {
  const mapRef = useRef<NaverMapRef>(null);
  const infoRef = useRef<InfoWindowRef>(null);

  const [mapReady, setMapReady] = useState(false);
  const [position, setPosition] = useState(MARKER_POS_1);
  const [maxWidth, setMaxWidth] = useState(220);
  const [borderWidth, setBorderWidth] = useState(1);
  const [anchorSkew, setAnchorSkew] = useState(false);
  const [zIndex, setZIndex] = useState(1);
  const [content, setContent] = useState("option-content-1");

  const [openCount, setOpenCount] = useState(0);
  const [closeCount, setCloseCount] = useState(0);
  const [readyCount, setReadyCount] = useState(0);
  const [destroyed, setDestroyed] = useState(false);
  const [contentLog, setContentLog] = useState("");
  const [positionLog, setPositionLog] = useState("");
  const [centerLog, setCenterLog] = useState("");

  const [positionChangedCount, setPositionChangedCount] = useState(0);
  const [contentChangedCount, setContentChangedCount] = useState(0);
  const [zIndexChangedCount, setZIndexChangedCount] = useState(0);

  const [optMaxWidth, setOptMaxWidth] = useState("");
  const [optBorderWidth, setOptBorderWidth] = useState("");
  const [optAnchorSkew, setOptAnchorSkew] = useState("");
  const [optPosition, setOptPosition] = useState("");

  const readState = useCallback(() => {
    const contentValue = infoRef.current?.getContent();
    setContentLog(typeof contentValue === "string" ? contentValue : contentValue?.textContent ?? "");
    setPositionLog(readInfoPosition(infoRef));
    setCenterLog(readLatLng(mapRef));

    const maxWidthValue = infoRef.current?.getOptions("maxWidth");
    const borderWidthValue = infoRef.current?.getOptions("borderWidth");
    const anchorSkewValue = infoRef.current?.getOptions("anchorSkew");
    const pos = infoRef.current?.getPosition();

    setOptMaxWidth(String(maxWidthValue));
    setOptBorderWidth(String(borderWidthValue));
    setOptAnchorSkew(String(anchorSkewValue));
    setOptPosition(pos ? JSON.stringify({ lat: pos.y, lng: pos.x }) : "");
  }, []);

  return (
    <ScenarioLayout
      buttons={
        <>
          <button data-testid="set-max-width-320" onClick={() => setMaxWidth(320)}>maxWidth 320</button>
          <button data-testid="set-border-width-4" onClick={() => setBorderWidth(4)}>borderWidth 4</button>
          <button data-testid="toggle-anchor-skew" onClick={() => setAnchorSkew((v) => !v)}>anchorSkew 토글</button>
          <button data-testid="move-position-2" onClick={() => setPosition(MARKER_POS_2)}>위치2 이동</button>
          <button data-testid="set-content-2" onClick={() => setContent("option-content-2")}>content2 설정</button>
          <button data-testid="set-zindex-777" onClick={() => setZIndex(777)}>zIndex 777</button>
          <button data-testid="read-state" onClick={readState}>상태 읽기</button>
        </>
      }
      logs={
        <>
          <CommonLogs
            mapReady={mapReady}
            infoOpenCount={openCount}
            infoCloseCount={closeCount}
            infoReadyCount={readyCount}
            infoDestroyed={destroyed}
            infoContent={contentLog}
            infoPosition={positionLog}
            mapCenter={centerLog}
          />
          <span data-testid="evt-position-changed-count">{positionChangedCount}</span>
          <span data-testid="evt-content-changed-count">{contentChangedCount}</span>
          <span data-testid="evt-zindex-changed-count">{zIndexChangedCount}</span>
          <span data-testid="opt-max-width">{optMaxWidth}</span>
          <span data-testid="opt-border-width">{optBorderWidth}</span>
          <span data-testid="opt-anchor-skew">{optAnchorSkew}</span>
          <span data-testid="opt-position">{optPosition}</span>
        </>
      }
      map={
        <NaverMapProvider ncpKeyId={NCP_KEY_ID} timeoutMs={15000}>
          <NaverMap
            ref={mapRef}
            data-testid="map-container"
            defaultCenter={DEFAULT_CENTER}
            defaultZoom={14}
            style={{ width: "100%", height: 500 }}
            onMapReady={() => setMapReady(true)}
          >
            <InfoWindow
              ref={infoRef}
              position={position}
              visible={true}
              maxWidth={maxWidth}
              borderWidth={borderWidth}
              anchorSkew={anchorSkew}
              zIndex={zIndex}
              content={content}
              onOpen={() => setOpenCount((c) => c + 1)}
              onClose={() => setCloseCount((c) => c + 1)}
              onInfoWindowReady={() => setReadyCount((c) => c + 1)}
              onInfoWindowDestroy={() => setDestroyed(true)}
              onPositionChanged={() => setPositionChangedCount((c) => c + 1)}
              onContentChanged={() => setContentChangedCount((c) => c + 1)}
              onZIndexChanged={() => setZIndexChangedCount((c) => c + 1)}
            />
          </NaverMap>
        </NaverMapProvider>
      }
    />
  );
}

/* ─── autopan ─── */

const EDGE_POSITION = { lat: DEFAULT_CENTER.lat + 0.02, lng: DEFAULT_CENTER.lng + 0.08 };

function AutoPanPage() {
  const mapRef = useRef<NaverMapRef>(null);
  const infoRef = useRef<InfoWindowRef>(null);

  const [mapReady, setMapReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const [disableAutoPan, setDisableAutoPan] = useState(false);
  const [autoPanPadding, setAutoPanPadding] = useState({ x: 20, y: 20 });

  const [openCount, setOpenCount] = useState(0);
  const [closeCount, setCloseCount] = useState(0);
  const [readyCount, setReadyCount] = useState(0);
  const [destroyed, setDestroyed] = useState(false);
  const [contentLog, setContentLog] = useState("");
  const [positionLog, setPositionLog] = useState("");
  const [centerLog, setCenterLog] = useState("");

  const readState = useCallback(() => {
    const content = infoRef.current?.getContent();
    setContentLog(typeof content === "string" ? content : content?.textContent ?? "");
    setPositionLog(readInfoPosition(infoRef));
    setCenterLog(readLatLng(mapRef));
  }, []);

  const resetCenter = useCallback(() => {
    mapRef.current?.setCenter(DEFAULT_CENTER);
  }, []);

  return (
    <ScenarioLayout
      buttons={
        <>
          <button data-testid="open-info" onClick={() => setVisible(true)}>open</button>
          <button data-testid="close-info" onClick={() => setVisible(false)}>close</button>
          <button data-testid="disable-autopan-true" onClick={() => setDisableAutoPan(true)}>disableAutoPan=true</button>
          <button data-testid="disable-autopan-false" onClick={() => setDisableAutoPan(false)}>disableAutoPan=false</button>
          <button data-testid="set-padding-20" onClick={() => setAutoPanPadding({ x: 20, y: 20 })}>padding 20</button>
          <button data-testid="set-padding-140" onClick={() => setAutoPanPadding({ x: 140, y: 140 })}>padding 140</button>
          <button data-testid="reset-center" onClick={resetCenter}>center reset</button>
          <button data-testid="read-state" onClick={readState}>상태 읽기</button>
        </>
      }
      logs={
        <>
          <CommonLogs
            mapReady={mapReady}
            infoOpenCount={openCount}
            infoCloseCount={closeCount}
            infoReadyCount={readyCount}
            infoDestroyed={destroyed}
            infoContent={contentLog}
            infoPosition={positionLog}
            mapCenter={centerLog}
          />
          <span data-testid="disable-autopan-state">{String(disableAutoPan)}</span>
          <span data-testid="autopan-padding-state">{JSON.stringify(autoPanPadding)}</span>
          <span data-testid="visible-state">{String(visible)}</span>
        </>
      }
      map={
        <NaverMapProvider ncpKeyId={NCP_KEY_ID} timeoutMs={15000}>
          <NaverMap
            ref={mapRef}
            data-testid="map-container"
            defaultCenter={DEFAULT_CENTER}
            defaultZoom={15}
            style={{ width: "100%", height: 500 }}
            onMapReady={() => setMapReady(true)}
          >
            <InfoWindow
              ref={infoRef}
              position={EDGE_POSITION}
              visible={visible}
              disableAutoPan={disableAutoPan}
              autoPanPadding={autoPanPadding}
              onOpen={() => setOpenCount((c) => c + 1)}
              onClose={() => setCloseCount((c) => c + 1)}
              onInfoWindowReady={() => setReadyCount((c) => c + 1)}
              onInfoWindowDestroy={() => setDestroyed(true)}
            >
              <div data-testid="autopan-content">auto-pan-content</div>
            </InfoWindow>
          </NaverMap>
        </NaverMapProvider>
      }
    />
  );
}

/* ─── 라우트 export ─── */

export const infoWindowRoutes: Record<string, React.FC> = {
  "/info-window/basic": BasicPage,
  "/info-window/visibility": VisibilityPage,
  "/info-window/marker-link": MarkerLinkPage,
  "/info-window/ref": RefPage,
  "/info-window/lifecycle": LifecyclePage,
  "/info-window/options": OptionsPage,
  "/info-window/autopan": AutoPanPage
};
