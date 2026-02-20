import { defineConfig } from "vitepress";

export default defineConfig({
  lang: "ko-KR",
  title: "react-naver-maps-kit",
  description: "네이버 지도용 모던 React 툴킷",
  themeConfig: {
    nav: [
      { text: "Introduction", link: "/" },
      { text: "Guide", link: "/guide/getting-started" },
      { text: "API Reference", link: "/api/provider" },
      { text: "Troubleshooting", link: "/troubleshooting/common-issues" }
    ],
    sidebar: [
      {
        text: "Introduction",
        items: [{ text: "Overview", link: "/" }]
      },
      {
        text: "Guide",
        items: [
          { text: "Getting Started", link: "/guide/getting-started" },
          { text: "Core Composition", link: "/guide/provider-map-hook" },
          { text: "Integration Example", link: "/guide/live-component" }
        ]
      },
      {
        text: "API Reference",
        items: [
          { text: "NaverMapProvider", link: "/api/provider" },
          { text: "NaverMap", link: "/api/map" },
          { text: "Hooks", link: "/api/hooks" },
          { text: "loadNaverMapsScript", link: "/api/load-script" }
        ]
      },
      {
        text: "Troubleshooting",
        items: [{ text: "Common Issues", link: "/troubleshooting/common-issues" }]
      }
    ],
    socialLinks: [{ icon: "github", link: "https://github.com/cobocho/react-naver-maps-kit" }]
  }
});
