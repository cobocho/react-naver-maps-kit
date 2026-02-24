import type { Property, District, SearchParams } from "../types";

const PROPERTY_TYPES: Property["type"][] = ["apartment", "villa", "officetel", "house"];
const GU_NAMES = [
  "강남구",
  "강동구",
  "강북구",
  "강서구",
  "관악구",
  "광진구",
  "구로구",
  "금천구",
  "노원구",
  "도봉구",
  "동대문구",
  "동작구",
  "마포구",
  "서대문구",
  "서초구",
  "성동구",
  "성북구",
  "송파구",
  "양천구",
  "영등포구",
  "용산구",
  "은평구",
  "종로구",
  "중구",
  "중랑구"
];
const DONG_NAMES = [
  "역삼동",
  "삼성동",
  "대치동",
  "청담동",
  "논현동",
  "신사동",
  "압구정동",
  "도곡동",
  "개포동",
  "일원동",
  "수서동",
  "세곡동",
  "자곡동",
  "율현동",
  "강일동",
  "상일동",
  "명일동",
  "고덕동",
  "암사동",
  "천호동",
  "성내동",
  "길동",
  "둔촌동",
  "미아동",
  "번동",
  "수유동",
  "우이동",
  "창동",
  "월계동",
  "공릉동",
  "하계동",
  "상계동",
  "중계동",
  "방학동",
  "쌍문동",
  "도봉동",
  "장안동",
  "이문동",
  "회기동",
  "전농동",
  "답십리동",
  "장안동",
  "용신동",
  "제기동",
  "신설동",
  "회기동",
  "휘경동",
  "흥인동",
  "신당동",
  "황학동",
  "다산동",
  "을지로",
  "청구동",
  "약수동",
  "삼선동",
  "동선동",
  "돈암동",
  "안암동",
  "보문동",
  "정릉동",
  "길음동",
  "종암동",
  "하월곡동",
  "장위동",
  "석관동",
  "성북동",
  "동소문동",
  "삼선동",
  "한남동",
  "이촌동",
  "한강로",
  "이태원동",
  "용산동",
  "원효로",
  "문배동",
  "신계동",
  "청파동",
  "효창동",
  "도원동",
  "용문동",
  "청담동",
  "마장동",
  "사근동",
  "행당동",
  "왕십리동",
  "도선동",
  "금호동",
  "옥수동",
  "성수동",
  "서초동",
  "잠원동",
  "반포동",
  "방배동",
  "양재동",
  "우면동",
  "원지동",
  "신원동",
  "내곡동",
  "염곡동",
  "율현동",
  "학동",
  "논현동",
  "신사동",
  "합정동",
  "당인동",
  "서교동",
  "동교동",
  "연남동",
  "성산동",
  "망원동",
  "상수동",
  "하중동",
  "신수동",
  "창전동",
  "서강동",
  "대흥동",
  "염리동",
  "신공덕동",
  "공덕동",
  "도화동",
  "용강동",
  "토정동",
  "마포동",
  "아현동",
  "염리동",
  "신수동",
  "현석동",
  "신정동",
  "목동",
  "신월동"
];

function generateMockProperties(count: number): Property[] {
  const properties: Property[] = [];
  const centerLat = 37.5665;
  const centerLng = 126.978;
  const latSpread = 0.14;
  const lngSpread = 0.22;

  for (let i = 0; i < count; i++) {
    const type = PROPERTY_TYPES[Math.floor(Math.random() * PROPERTY_TYPES.length)];
    const gu = GU_NAMES[Math.floor(Math.random() * GU_NAMES.length)];
    const dong = DONG_NAMES[Math.floor(Math.random() * DONG_NAMES.length)];
    const streetNum = Math.floor(Math.random() * 100) + 1;
    const detailNum = Math.floor(Math.random() * 200) + 1;

    const basePrice =
      type === "apartment"
        ? 150000
        : type === "villa"
          ? 80000
          : type === "officetel"
            ? 70000
            : 120000;
    const priceVariation = Math.floor(Math.random() * 300000) - 100000;
    const price = Math.max(20000, basePrice + priceVariation);

    const baseArea =
      type === "apartment" ? 35 : type === "villa" ? 25 : type === "officetel" ? 20 : 30;
    const area = baseArea + Math.floor(Math.random() * 40);

    properties.push({
      id: String(i + 1),
      lat: centerLat + (Math.random() - 0.5) * latSpread * 2,
      lng: centerLng + (Math.random() - 0.5) * lngSpread * 2,
      price,
      type,
      area,
      rooms: Math.floor(Math.random() * 5) + 1,
      bathrooms: Math.floor(Math.random() * 3) + 1,
      floor: Math.floor(Math.random() * 30) + 1,
      address: `서울 ${gu} ${dong} ${streetNum}-${detailNum}`,
      imageUrl: `https://picsum.photos/seed/prop${i}/200/150`,
      isFavorite: Math.random() < 0.08
    });
  }

  return properties;
}

export const mockProperties: Property[] = generateMockProperties(500);

// 학군/행정구역 Polygon 데이터
export const mockDistricts: District[] = [
  {
    id: "school-1",
    name: "역삼초등학교 학구",
    type: "school",
    paths: [
      { lat: 37.522, lng: 127.042 },
      { lat: 37.522, lng: 127.052 },
      { lat: 37.514, lng: 127.052 },
      { lat: 37.514, lng: 127.042 }
    ]
  },
  {
    id: "school-2",
    name: "개포초등학교 학구",
    type: "school",
    paths: [
      { lat: 37.518, lng: 127.05 },
      { lat: 37.518, lng: 127.06 },
      { lat: 37.51, lng: 127.06 },
      { lat: 37.51, lng: 127.05 }
    ]
  },
  {
    id: "admin-1",
    name: "역삼동",
    type: "admin",
    paths: [
      { lat: 37.525, lng: 127.04 },
      { lat: 37.525, lng: 127.055 },
      { lat: 37.508, lng: 127.055 },
      { lat: 37.508, lng: 127.04 }
    ]
  }
];

// 지연 시뮬레이션
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Bounds 기반 매물 검색 (Mock)
export async function searchProperties(params: SearchParams): Promise<Property[]> {
  await delay(500 + Math.random() * 500);

  const { bounds, priceRange } = params;

  return mockProperties.filter((property) => {
    // Bounds 체크
    const inBounds =
      property.lat >= bounds.sw.lat &&
      property.lat <= bounds.ne.lat &&
      property.lng >= bounds.sw.lng &&
      property.lng <= bounds.ne.lng;

    // 가격 필터
    const inPriceRange = property.price >= priceRange.min && property.price <= priceRange.max;

    return inBounds && inPriceRange;
  });
}
