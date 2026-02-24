import { defineConfig } from "vitepress";

export default defineConfig({
  lang: "ko-KR",
  title: "react-naver-maps-kit",
  description: "네이버 지도용 모던 React 툴킷",
  themeConfig: {
    nav: [
      { text: "홈", link: "/" },
      { text: "가이드", link: "/guide/getting-started" },
      { text: "예제", link: "/examples/markers" },
      { text: "API", link: "/api/provider" }
    ],
    sidebar: [
      {
        text: "시작하기",
        items: [
          { text: "개요", link: "/" },
          { text: "설치 및 설정", link: "/guide/getting-started" },
          { text: "핵심 개념", link: "/guide/core-concepts" }
        ]
      },
      {
        text: "예제",
        items: [
          { text: "마커 표시하기", link: "/examples/markers" },
          { text: "정보 창 띄우기", link: "/examples/info-window" },
          { text: "도형 그리기", link: "/examples/shapes" },
          { text: "마커 클러스터링", link: "/examples/clustering" },
          { text: "데이터 레이어", link: "/examples/data-layer" },
          { text: "지도 컨트롤", link: "/examples/controls" }
        ]
      },
      {
        text: "API Reference",
        items: [
          { text: "NaverMapProvider", link: "/api/provider" },
          { text: "NaverMap", link: "/api/map" },
          { text: "Marker", link: "/api/marker" },
          { text: "MarkerClusterer", link: "/api/marker-clusterer" },
          { text: "InfoWindow", link: "/api/info-window" },
          { text: "Circle", link: "/api/circle" },
          { text: "Ellipse", link: "/api/ellipse" },
          { text: "GroundOverlay", link: "/api/ground-overlay" },
          { text: "Polygon", link: "/api/polygon" },
          { text: "Polyline", link: "/api/polyline" },
          { text: "Rectangle", link: "/api/rectangle" },
          { text: "GeoJson", link: "/api/geo-json" },
          { text: "Gpx", link: "/api/gpx" },
          { text: "Kmz", link: "/api/kmz" },
          { text: "Hooks", link: "/api/hooks" },
          { text: "loadNaverMapsScript", link: "/api/load-script" }
        ]
      },
      {
        text: "서브모듈",
        items: [
          { text: "Panorama", link: "/guide/submodules/panorama" },
          { text: "Visualization", link: "/guide/submodules/visualization" },
          { text: "Drawing", link: "/guide/submodules/drawing" }
        ]
      },
      {
        text: "문제 해결",
        items: [{ text: "자주 묻는 질문", link: "/troubleshooting/common-issues" }]
      }
    ],
    socialLinks: [{ icon: "github", link: "https://github.com/cobocho/react-naver-maps-kit" }]
  }
});
