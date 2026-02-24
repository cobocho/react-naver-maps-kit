import { defineConfig } from "vitepress";

export default defineConfig({
  lang: "ko-KR",
  title: "React Naver Maps KIT",
  description: "네이버 지도를 React처럼 사용하세요",
  
  sitemap: {
    hostname: 'https://react-naver-maps-kit.pages.dev'
  },

  head: [
    ['meta', { name: 'google-site-verification', content: 'K4M9J0rfWktT9Hf766NXdXfYHRg27p8pvrC3vKdpUOA' }],
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    ['meta', { name: 'theme-color', content: '#03C75A' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'react-naver-maps-kit' }],
    ['meta', { property: 'og:description', content: '네이버 지도를 React처럼 사용하세요' }],
    ['meta', { property: 'og:image', content: 'https://github.com/user-attachments/assets/c2bd5bd6-eb67-4728-9806-1639c1445154' }],
  ],

  themeConfig: {
    logo: '/logo.png',
    
    nav: [
      { text: "가이드", link: "/guide/getting-started" },
      { text: "API", link: "/api/provider" },
      { 
        text: "v1.3.0", 
        items: [
          { text: 'Changelog', link: 'https://github.com/cobocho/react-naver-maps-kit/releases' },
          { text: 'npm', link: 'https://www.npmjs.com/package/react-naver-maps-kit' }
        ]
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: "시작하기",
          items: [
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
          text: "서브모듈",
          items: [
            { text: "Panorama (거리뷰)", link: "/guide/submodules/panorama" },
            { text: "Visualization (시각화)", link: "/guide/submodules/visualization" },
            { text: "Drawing (그리기)", link: "/guide/submodules/drawing" }
          ]
        },
        {
          text: "예시 프로젝트",
          items: [
            { text: "🏃 운동 기록 트래커", link: "https://react-naver-maps-kit-playground.pages.dev/projects/activity-tracker", target: "_blank" },
            { text: "🚕 실시간 택시 추적", link: "https://react-naver-maps-kit-playground.pages.dev/projects/taxi-tracker", target: "_blank" },
            { text: "🏠 부동산 매물 탐색", link: "https://react-naver-maps-kit-playground.pages.dev/projects/real-estate-explorer", target: "_blank" },
            { text: "📊 상권 분석 지도", link: "https://react-naver-maps-kit-playground.pages.dev/projects/commercial-area-analysis", target: "_blank" }
          ]
        },
        {
          text: "문제 해결",
          items: [
            { text: "자주 묻는 질문", link: "/troubleshooting/common-issues" }
          ]
        }
      ],
      '/examples/': [
        {
          text: "시작하기",
          items: [
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
          text: "서브모듈",
          items: [
            { text: "Panorama (거리뷰)", link: "/guide/submodules/panorama" },
            { text: "Visualization (시각화)", link: "/guide/submodules/visualization" },
            { text: "Drawing (그리기)", link: "/guide/submodules/drawing" }
          ]
        },
        {
          text: "예시 프로젝트",
          items: [
            { text: "🏃 운동 기록 트래커", link: "https://react-naver-maps-kit-playground.pages.dev/projects/activity-tracker", target: "_blank" },
            { text: "🚕 실시간 택시 추적", link: "https://react-naver-maps-kit-playground.pages.dev/projects/taxi-tracker", target: "_blank" },
            { text: "🏠 부동산 매물 탐색", link: "https://react-naver-maps-kit-playground.pages.dev/projects/real-estate-explorer", target: "_blank" },
            { text: "📊 상권 분석 지도", link: "https://react-naver-maps-kit-playground.pages.dev/projects/commercial-area-analysis", target: "_blank" }
          ]
        },
        {
          text: "문제 해결",
          items: [
            { text: "자주 묻는 질문", link: "/troubleshooting/common-issues" }
          ]
        }
      ],
      '/api/': [
        {
          text: "Provider & Hook",
          items: [
            { text: "NaverMapProvider", link: "/api/provider" },
            { text: "Hooks", link: "/api/hooks" },
            { text: "loadNaverMapsScript", link: "/api/load-script" }
          ]
        },
        {
          text: "지도",
          items: [
            { text: "NaverMap", link: "/api/map" }
          ]
        },
        {
          text: "오버레이",
          items: [
            { text: "Marker", link: "/api/marker" },
            { text: "MarkerClusterer", link: "/api/marker-clusterer" },
            { text: "InfoWindow", link: "/api/info-window" },
            { text: "Circle", link: "/api/circle" },
            { text: "Ellipse", link: "/api/ellipse" },
            { text: "Rectangle", link: "/api/rectangle" },
            { text: "Polygon", link: "/api/polygon" },
            { text: "Polyline", link: "/api/polyline" },
            { text: "GroundOverlay", link: "/api/ground-overlay" }
          ]
        },
        {
          text: "데이터 레이어",
          items: [
            { text: "GeoJson", link: "/api/geo-json" },
            { text: "Gpx", link: "/api/gpx" },
            { text: "Kmz", link: "/api/kmz" }
          ]
        },
        {
          text: "서브모듈",
          items: [
            { text: "Panorama", link: "/api/panorama" },
            { text: "FlightSpot", link: "/api/flight-spot" },
            { text: "HeatMap", link: "/api/heat-map" },
            { text: "DotMap", link: "/api/dot-map" },
            { text: "DrawingManager", link: "/api/drawing-manager" }
          ]
        }
      ],
      '/troubleshooting/': [
        {
          text: "시작하기",
          items: [
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
          text: "서브모듈",
          items: [
            { text: "Panorama (거리뷰)", link: "/guide/submodules/panorama" },
            { text: "Visualization (시각화)", link: "/guide/submodules/visualization" },
            { text: "Drawing (그리기)", link: "/guide/submodules/drawing" }
          ]
        },
        {
          text: "예시 프로젝트",
          items: [
            { text: "🏃 운동 기록 트래커", link: "https://react-naver-maps-kit-playground.pages.dev/projects/activity-tracker", target: "_blank" },
            { text: "🚕 실시간 택시 추적", link: "https://react-naver-maps-kit-playground.pages.dev/projects/taxi-tracker", target: "_blank" },
            { text: "🏠 부동산 매물 탐색", link: "https://react-naver-maps-kit-playground.pages.dev/projects/real-estate-explorer", target: "_blank" },
            { text: "📊 상권 분석 지도", link: "https://react-naver-maps-kit-playground.pages.dev/projects/commercial-area-analysis", target: "_blank" }
          ]
        },
        {
          text: "문제 해결",
          items: [
            { text: "자주 묻는 질문", link: "/troubleshooting/common-issues" }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/cobocho/react-naver-maps-kit" },
      { icon: "npm", link: "https://www.npmjs.com/package/react-naver-maps-kit" }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 cobocho'
    },

    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '검색',
            buttonAriaLabel: '검색'
          },
          modal: {
            noResultsText: '결과를 찾을 수 없습니다',
            resetButtonTitle: '검색어 지우기',
            footer: {
              selectText: '선택',
              navigateText: '이동'
            }
          }
        }
      }
    },

    editLink: {
      pattern: 'https://github.com/cobocho/react-naver-maps-kit/edit/main/packages/docs/:path',
      text: '이 페이지 수정하기'
    },

    lastUpdated: {
      text: '마지막 수정'
    },

    outline: {
      label: '목차'
    },

    docFooter: {
      prev: '이전',
      next: '다음'
    }
  }
});
