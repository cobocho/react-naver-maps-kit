<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  demo: string;
  height?: string;
}>();

const PLAYGROUND_URL = "https://react-naver-maps-kit-playground.pages.dev";

const iframeSrc = computed(() => `${PLAYGROUND_URL}/embed/${props.demo}`);
const iframeHeight = computed(() => props.height ?? "500px");
</script>

<template>
  <div class="demo-embed-container">
    <iframe
      :src="iframeSrc"
      :style="{ height: iframeHeight }"
      frameborder="0"
      allow="geolocation"
      loading="lazy"
    />
    <div class="demo-embed-footer">
      <a :href="`${PLAYGROUND_URL}/demo/${demo}`" target="_blank" rel="noopener">
        Playground에서 열기 ↗
      </a>
    </div>
  </div>
</template>

<style scoped>
.demo-embed-container {
  margin: 16px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
  background: #f5f5f7;
}

.demo-embed-container iframe {
  width: 100%;
  display: block;
  border: none;
}

.demo-embed-footer {
  padding: 8px 12px;
  background: var(--vp-c-bg-soft);
  border-top: 1px solid var(--vp-c-divider);
  font-size: 13px;
}

.demo-embed-footer a {
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.demo-embed-footer a:hover {
  text-decoration: underline;
}
</style>
