import DefaultTheme from "vitepress/theme";

import LiveNaverMapDemo from "./components/LiveNaverMapDemo.vue";

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component("LiveNaverMapDemo", LiveNaverMapDemo);
  }
};
