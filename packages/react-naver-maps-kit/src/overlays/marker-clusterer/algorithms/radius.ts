import type { AlgorithmContext, Cluster, ClusterAlgorithm, ItemRecord } from "../types";

interface RadiusAlgorithmOptions {
  readonly radius: number;
  readonly minClusterSize: number;
  readonly maxZoom: number;
}

const DEFAULT_OPTIONS: RadiusAlgorithmOptions = {
  radius: 60,
  minClusterSize: 2,
  maxZoom: 21
};

function toWorldPixel(lat: number, lng: number, zoom: number): { x: number; y: number } {
  const scale = Math.pow(2, zoom) * 256;
  const x = ((lng + 180) / 360) * scale;
  const latRad = (lat * Math.PI) / 180;
  const y = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * scale;
  return { x, y };
}

function pixelDistance(a: { x: number; y: number }, b: { x: number; y: number }): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export class RadiusAlgorithm<TData> implements ClusterAlgorithm<TData> {
  private options: RadiusAlgorithmOptions;

  constructor(options?: Partial<RadiusAlgorithmOptions>) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  cluster(
    items: readonly ItemRecord<TData>[],
    ctx: AlgorithmContext
  ): {
    readonly clusters: readonly Cluster<TData>[];
    readonly points: readonly ItemRecord<TData>[];
  } {
    if (ctx.zoom >= this.options.maxZoom) {
      return { clusters: [], points: items };
    }

    const { radius } = this.options;
    const used = new Set<string | number>();
    const clusters: Cluster<TData>[] = [];
    const points: ItemRecord<TData>[] = [];

    const pixelPositions = items.map((item) =>
      toWorldPixel(item.position.lat, item.position.lng, ctx.zoom)
    );

    for (let i = 0; i < items.length; i++) {
      if (used.has(items[i].id)) continue;

      const center = pixelPositions[i];
      const group: ItemRecord<TData>[] = [items[i]];
      used.add(items[i].id);

      for (let j = i + 1; j < items.length; j++) {
        if (used.has(items[j].id)) continue;
        if (pixelDistance(center, pixelPositions[j]) <= radius) {
          group.push(items[j]);
          used.add(items[j].id);
        }
      }

      if (group.length < this.options.minClusterSize) {
        points.push(...group);
        continue;
      }

      let sumLat = 0;
      let sumLng = 0;
      let minLat = Infinity;
      let maxLat = -Infinity;
      let minLng = Infinity;
      let maxLng = -Infinity;

      for (const item of group) {
        sumLat += item.position.lat;
        sumLng += item.position.lng;
        minLat = Math.min(minLat, item.position.lat);
        maxLat = Math.max(maxLat, item.position.lat);
        minLng = Math.min(minLng, item.position.lng);
        maxLng = Math.max(maxLng, item.position.lng);
      }

      const avgLat = sumLat / group.length;
      const avgLng = sumLng / group.length;

      clusters.push({
        id: `radius-${avgLat.toFixed(6)}-${avgLng.toFixed(6)}-${group.length}`,
        position: { lat: avgLat, lng: avgLng },
        count: group.length,
        bounds: { south: minLat, north: maxLat, west: minLng, east: maxLng },
        items: group
      });
    }

    return { clusters, points };
  }

  setOptions(options: unknown): void {
    if (typeof options === "object" && options !== null) {
      this.options = { ...this.options, ...(options as Partial<RadiusAlgorithmOptions>) };
    }
  }
}
