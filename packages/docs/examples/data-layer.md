# 데이터 레이어

`GeoJson`, `Gpx`, `Kmz` 컴포넌트로 다양한 지리 데이터 파일을 지도에 표시하는 방법을 설명합니다.

## 라이브 데모

### GeoJSON
<DemoEmbed demo="geojson" height="400px" />

### GPX
<DemoEmbed demo="gpx" height="400px" />

## GeoJSON 렌더링

GeoJSON 데이터를 선언적으로 렌더링합니다:

```tsx
import { NaverMap, GeoJson, NaverMapProvider } from "react-naver-maps-kit";

function GeoJsonExample() {
  const geojson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { name: "서울 중심부" },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [126.97, 37.57],
              [126.99, 37.57],
              [126.99, 37.56],
              [126.97, 37.56],
              [126.97, 37.57]
            ]
          ]
        }
      }
    ]
  };

  return (
    <NaverMapProvider ncpKeyId={import.meta.env.VITE_NCP_KEY_ID}>
      <NaverMap
        center={{ lat: 37.566, lng: 126.978 }}
        zoom={13}
        style={{ width: "100%", height: "500px" }}
      >
        <GeoJson
          data={geojson}
          style={{
            strokeColor: "#4285F4",
            strokeWeight: 2,
            fillColor: "#4285F4",
            fillOpacity: 0.3
          }}
        />
      </NaverMap>
    </NaverMapProvider>
  );
}
```

### 외부 GeoJSON 파일 로드

```tsx
import { useState, useEffect } from "react";
import { NaverMap, GeoJson, NaverMapProvider } from "react-naver-maps-kit";
import type { GeoJsonProps } from "react-naver-maps-kit";

function ExternalGeoJsonExample() {
  const [data, setData] = useState<GeoJsonProps["data"] | null>(null);

  useEffect(() => {
    fetch("/seoul.geojson")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return (
    <NaverMapProvider ncpKeyId={import.meta.env.VITE_NCP_KEY_ID}>
      <NaverMap
        center={{ lat: 37.566, lng: 126.978 }}
        zoom={11}
        style={{ width: "100%", height: "500px" }}
      >
        {data && (
          <GeoJson
            data={data}
            style={{ strokeColor: "#03C75A", fillColor: "#03C75A", fillOpacity: 0.2 }}
          />
        )}
      </NaverMap>
    </NaverMapProvider>
  );
}
```

### Feature별 스타일링

`style`에 함수를 전달하면 Feature마다 다른 스타일을 적용할 수 있습니다:

```tsx
<GeoJson
  data={geojson}
  style={(feature) => {
    const population = feature.getProperty("population");
    return {
      fillColor: population > 500000 ? "#FF0000" : "#00FF00",
      fillOpacity: 0.4,
      strokeWeight: 1
    };
  }}
/>
```

## GPX 렌더링

GPX 파일 URL을 전달하면 자동으로 fetch하여 경로를 표시합니다:

```tsx
import { NaverMap, Gpx, NaverMapProvider } from "react-naver-maps-kit";

function GpxExample() {
  return (
    <NaverMapProvider ncpKeyId={import.meta.env.VITE_NCP_KEY_ID}>
      <NaverMap
        center={{ lat: 37.55, lng: 127.0 }}
        zoom={11}
        style={{ width: "100%", height: "500px" }}
      >
        <Gpx
          url="/bicycle.gpx"
          style={{
            strokeColor: "#FF5722",
            strokeWeight: 3,
            strokeOpacity: 0.9
          }}
          onFeaturesAdded={(features) => {
            console.log(`${features.length}개 Feature 로드 완료`);
          }}
          onDataError={(err) => {
            console.error("GPX 로드 실패:", err.message);
          }}
        />
      </NaverMap>
    </NaverMapProvider>
  );
}
```

## KMZ 렌더링

KMZ 파일은 ZIP 압축된 KML 파일입니다. URL을 전달하면 자동으로 다운로드, 압축 해제, KML 파싱을 처리합니다:

```tsx
import { NaverMap, Kmz, NaverMapProvider } from "react-naver-maps-kit";

function KmzExample() {
  return (
    <NaverMapProvider ncpKeyId={import.meta.env.VITE_NCP_KEY_ID}>
      <NaverMap
        center={{ lat: 37.566, lng: 126.978 }}
        zoom={8}
        style={{ width: "100%", height: "500px" }}
      >
        <Kmz
          url="/airspace.kmz"
          style={{
            strokeColor: "#9C27B0",
            strokeWeight: 2,
            fillColor: "#9C27B0",
            fillOpacity: 0.3
          }}
          onFeaturesAdded={(features) => {
            console.log(`${features.length}개 Feature 로드 완료`);
          }}
        />
      </NaverMap>
    </NaverMapProvider>
  );
}
```

## Ref로 데이터 제어

```tsx
import { useRef } from "react";
import { NaverMap, GeoJson, NaverMapProvider, type GeoJsonRef } from "react-naver-maps-kit";

function DataControlExample() {
  const geoJsonRef = useRef<GeoJsonRef>(null);

  const handleExport = () => {
    const exported = geoJsonRef.current?.toGeoJson();
    console.log("GeoJSON 내보내기:", exported);
  };

  const handleListFeatures = () => {
    const features = geoJsonRef.current?.getAllFeature();
    features?.forEach((feature) => {
      console.log(`Feature: ${feature.getId()}`);
    });
  };

  const handleHighlight = () => {
    const feature = geoJsonRef.current?.getFeatureById("my-feature");
    if (feature) {
      geoJsonRef.current?.overrideStyle(feature, {
        fillColor: "#FF0000",
        fillOpacity: 0.6
      });
    }
  };

  return (
    <div>
      <NaverMapProvider ncpKeyId={import.meta.env.VITE_NCP_KEY_ID}>
        <NaverMap
          center={{ lat: 37.566, lng: 126.978 }}
          zoom={13}
          style={{ width: "100%", height: "400px" }}
        >
          <GeoJson ref={geoJsonRef} data={geojson} />
        </NaverMap>
      </NaverMapProvider>

      <div>
        <button onClick={handleExport}>GeoJSON 내보내기</button>
        <button onClick={handleListFeatures}>Feature 목록</button>
        <button onClick={handleHighlight}>강조 표시</button>
      </div>
    </div>
  );
}
```

## 다음 단계

- [GeoJson API](/api/geo-json) - GeoJson 전체 Props
- [Gpx API](/api/gpx) - Gpx 전체 Props
- [Kmz API](/api/kmz) - Kmz 전체 Props
- [도형 그리기](/examples/shapes) - Circle, Polygon 등 도형 오버레이
