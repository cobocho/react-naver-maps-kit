# Geocoder 서브모듈

Geocoder 서브모듈은 좌표 체계 간 변환 메서드와 주소 검색 API를 제공합니다.

## 개요

Geocoder 모듈은 다음 기능을 제공합니다:

- **좌표-주소 변환**: 좌표를 주소로 변환 (Reverse Geocoding)
- **주소-좌표 변환**: 주소를 좌표로 변환 (Geocoding)
- **좌표계 변환**: 다양한 좌표 체계 간 변환

## 서브모듈 로드

`NaverMapProvider`의 `submodules` prop을 통해 로드합니다:

```tsx
import { NaverMapProvider } from "react-naver-maps-kit";

function App() {
  return (
    <NaverMapProvider ncpKeyId={import.meta.env.VITE_NCP_KEY_ID} submodules={["geocoder"]}>
      {/* 앱 컴포넌트 */}
    </NaverMapProvider>
  );
}
```

## 주요 API

### naver.maps.Service

Geocoder 서비스의 핵심 네임스페이스입니다.

#### Geocoding (주소 → 좌표)

```tsx
naver.maps.Service.geocode(
  {
    query: "불정로 6" // 검색할 주소
  },
  (status, response) => {
    if (status === naver.maps.Service.Status.OK) {
      const result = response.v2; // 검색 결과
      console.log(result.addresses);
    }
  }
);
```

#### Reverse Geocoding (좌표 → 주소)

```tsx
naver.maps.Service.reverseGeocode(
  {
    coords: new naver.maps.LatLng(37.3595704, 127.105399),
    orders: [
      naver.maps.Service.OrderType.ADDR, // 지번 주소
      naver.maps.Service.OrderType.ROAD_ADDR // 도로명 주소
    ].join(",")
  },
  (status, response) => {
    if (status === naver.maps.Service.Status.OK) {
      const result = response.v2; // 변환 결과
      console.log(result.results);
    }
  }
);
```

### naver.maps.TransCoord

좌표계 변환 유틸리티입니다.

```tsx
// TM128 → LatLng 변환
const latLng = naver.maps.TransCoord.fromTM128ToLatLng(new naver.maps.Point(311975, 544423));

// LatLng → TM128 변환
const tm128 = naver.maps.TransCoord.fromLatLngToTM128(new naver.maps.LatLng(37.5666, 126.9784));
```

## 지원 좌표계

| 좌표계       | 설명              | 용도           |
| ------------ | ----------------- | -------------- |
| `LatLng`     | WGS84 위도/경도   | 일반 지도 좌표 |
| `TM128`      | TM128 좌표계      | 카테고리 검색  |
| `UTMK`       | UTM-K 좌표계      | 공간 정보      |
| `UTMK_NAVER` | 네이버 전용 UTM-K | 네이버 내부    |

## 활용 예제

### 주소 검색 후 마커 표시

```tsx
import { NaverMap, Marker, NaverMapProvider, useNaverMap } from "react-naver-maps-kit";
import { useState, useCallback } from "react";

function AddressSearch() {
  const { sdkStatus } = useNaverMap();
  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(null);

  const searchAddress = useCallback(
    (query: string) => {
      if (sdkStatus !== "ready") return;

      naver.maps.Service.geocode({ query }, (status, response) => {
        if (status === naver.maps.Service.Status.OK) {
          const address = response.v2.addresses[0];
          setMarker({
            lat: parseFloat(address.y),
            lng: parseFloat(address.x)
          });
        }
      });
    },
    [sdkStatus]
  );

  return (
    <div>
      <input
        type="text"
        placeholder="주소를 입력하세요"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            searchAddress((e.target as HTMLInputElement).value);
          }
        }}
      />
      {marker && (
        <NaverMap center={marker} zoom={15} style={{ width: "100%", height: "400px" }}>
          <Marker position={marker} />
        </NaverMap>
      )}
    </div>
  );
}
```

### 클릭한 위치의 주소 표시

```tsx
import { NaverMap, NaverMapProvider, useNaverMap } from "react-naver-maps-kit";
import { useState, useCallback } from "react";

function MapWithAddress() {
  const { sdkStatus } = useNaverMap();
  const [address, setAddress] = useState<string>("");

  const handleMapClick = useCallback(
    (e: naver.maps.PointerEvent) => {
      if (sdkStatus !== "ready") return;

      naver.maps.Service.reverseGeocode(
        {
          coords: e.coord,
          orders: naver.maps.Service.OrderType.ROAD_ADDR
        },
        (status, response) => {
          if (status === naver.maps.Service.Status.OK) {
            const result = response.v2.results[0];
            if (result) {
              setAddress(result.region.area1.name + " " + result.region.area2.name);
            }
          }
        }
      );
    },
    [sdkStatus]
  );

  return (
    <div>
      <p>주소: {address}</p>
      <NaverMap
        center={{ lat: 37.5665, lng: 126.978 }}
        zoom={12}
        style={{ width: "100%", height: "400px" }}
        onClick={handleMapClick}
      />
    </div>
  );
}
```

## 상태 코드

| 상태               | 설명            |
| ------------------ | --------------- |
| `OK`               | 요청 성공       |
| `ERROR`            | 서버 오류       |
| `INVALID_REQUEST`  | 잘못된 요청     |
| `OVER_QUERY_LIMIT` | 쿼리 한도 초과  |
| `REQUEST_DENIED`   | 요청 거부       |
| `UNKNOWN_ERROR`    | 알 수 없는 오류 |

## 참고

- [공식 Geocoder 문서](https://navermaps.github.io/maps.js.ncp/docs/tutorial-Geocoder.html)
- [공식 Geocoding API 문서](https://navermaps.github.io/maps.js.ncp/docs/tutorial-Geocoder-Geocoding.html)
