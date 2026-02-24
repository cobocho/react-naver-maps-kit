import DefaultTheme from "vitepress/theme";

import LiveNaverMapDemo from "./components/LiveNaverMapDemo.vue";
import DemoEmbed from "./components/DemoEmbed.vue";

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component("LiveNaverMapDemo", LiveNaverMapDemo);
    app.component("DemoEmbed", DemoEmbed);
  }
};
