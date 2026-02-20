<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

const mountElementRef = ref<HTMLDivElement | null>(null);
const errorMessage = ref<string>("");

type ReactRootLike = {
  unmount: () => void;
};

let reactRoot: ReactRootLike | null = null;

onMounted(async () => {
  if (!mountElementRef.value) {
    return;
  }

  try {
    const [{ createElement }, { createRoot }, kit] = await Promise.all([
      import("react"),
      import("react-dom/client"),
      import("../../../../src/index.ts")
    ]);

    const { InfoWindow, Marker, NaverMap, NaverMapProvider, useNaverMap } = kit;

    function StatusPanel() {
      const { sdkError, sdkStatus } = useNaverMap();

      return createElement(
        "p",
        { className: "live-demo-status" },
        `SDK status: ${sdkStatus}${sdkError ? ` / error: ${sdkError.message}` : ""}`
      );
    }

    function LiveReactMapDemo() {
      const center = { lat: 37.3595704, lng: 127.105399 };
      const ncpKeyId = String(
        import.meta.env.VITE_NCP_KEY_ID ?? import.meta.env.VITE_NCP_CLIENT_ID ?? ""
      ).trim();

      if (!ncpKeyId) {
        return createElement(
          "p",
          { className: "live-demo-hint" },
          "VITE_NCP_KEY_ID 또는 VITE_NCP_CLIENT_ID를 설정하면 실시간 지도를 렌더링합니다."
        );
      }

      return createElement(
        NaverMapProvider,
        { ncpKeyId, timeoutMs: 10000 },
        createElement(
          "div",
          { className: "live-demo-shell" },
          createElement(StatusPanel),
          createElement(NaverMap, {
            center,
            mapTypeControl: true,
            scrollWheel: true,
            style: { width: "100%", height: "320px" },
            zoom: 10,
            zoomControl: true
          }),
          createElement(
            Marker,
            { position: center },
            createElement("span", { className: "live-demo-marker-chip" }, "KIT")
          ),
          createElement(
            InfoWindow,
            { position: center, visible: true },
            createElement(
              "div",
              { className: "live-demo-info-window" },
              createElement("strong", null, "react-naver-maps-kit"),
              createElement("p", null, "Marker + InfoWindow demo")
            )
          )
        )
      );
    }

    reactRoot = createRoot(mountElementRef.value);
    reactRoot.render(createElement(LiveReactMapDemo));
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : "Failed to mount live map demo.";
  }
});

onBeforeUnmount(() => {
  reactRoot?.unmount();
  reactRoot = null;
});
</script>

<template>
  <div class="live-demo-wrap">
    <div ref="mountElementRef" />
    <p v-if="errorMessage" class="live-demo-error">{{ errorMessage }}</p>
  </div>
</template>

<style scoped>
.live-demo-wrap {
  border: 1px solid #d8dee7;
  border-radius: 12px;
  padding: 12px;
  background: linear-gradient(180deg, #f9fbff 0%, #f4f7fb 100%);
}

.live-demo-error {
  margin-top: 10px;
  color: #bf1d2d;
  font-weight: 600;
}

:deep(.live-demo-shell) {
  display: grid;
  gap: 10px;
}

:deep(.live-demo-status) {
  margin: 0;
  font-size: 13px;
  color: #334155;
}

:deep(.live-demo-hint) {
  margin: 0;
  font-size: 13px;
  color: #475569;
}

:deep(.live-demo-marker-chip) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 24px;
  padding: 0 8px;
  border-radius: 999px;
  border: 1px solid #78350f;
  background: #fef3c7;
  color: #78350f;
  font-size: 11px;
  font-weight: 700;
}

:deep(.live-demo-info-window) {
  min-width: 160px;
  color: #0f172a;
  font-size: 12px;
}

:deep(.live-demo-info-window p) {
  margin: 4px 0 0;
}
</style>
