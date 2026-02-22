import type { AlgorithmContext, Cluster, ClusterAlgorithm, ItemRecord } from "../types";

interface GridAlgorithmOptions {
  readonly gridSize: number;
  readonly minClusterSize: number;
  readonly maxZoom: number;
}

const DEFAULT_OPTIONS: GridAlgorithmOptions = {
  gridSize: 60,
  minClusterSize: 2,
  maxZoom: 21
};

export class GridAlgorithm<TData> implements ClusterAlgorithm<TData> {
  private options: GridAlgorithmOptions;

  constructor(options?: Partial<GridAlgorithmOptions>) {
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

    const { gridSize } = this.options;
    const scale = Math.pow(2, ctx.zoom);
    const cellMap = new Map<string, ItemRecord<TData>[]>();

    for (const item of items) {
      const worldX = ((item.position.lng + 180) / 360) * scale;
      const latRad = (item.position.lat * Math.PI) / 180;
      const worldY = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * scale;

      const cellX = Math.floor((worldX * 256) / gridSize);
      const cellY = Math.floor((worldY * 256) / gridSize);
      const key = `${cellX}:${cellY}`;

      let cell = cellMap.get(key);
      if (!cell) {
        cell = [];
        cellMap.set(key, cell);
      }
      cell.push(item);
    }

    const clusters: Cluster<TData>[] = [];
    const points: ItemRecord<TData>[] = [];

    for (const [key, cellItems] of cellMap) {
      if (cellItems.length < this.options.minClusterSize) {
        points.push(...cellItems);
        continue;
      }

      let sumLat = 0;
      let sumLng = 0;
      let minLat = Infinity;
      let maxLat = -Infinity;
      let minLng = Infinity;
      let maxLng = -Infinity;

      for (const item of cellItems) {
        sumLat += item.position.lat;
        sumLng += item.position.lng;
        minLat = Math.min(minLat, item.position.lat);
        maxLat = Math.max(maxLat, item.position.lat);
        minLng = Math.min(minLng, item.position.lng);
        maxLng = Math.max(maxLng, item.position.lng);
      }

      clusters.push({
        id: `grid-${key}`,
        position: {
          lat: sumLat / cellItems.length,
          lng: sumLng / cellItems.length
        },
        count: cellItems.length,
        bounds: {
          south: minLat,
          north: maxLat,
          west: minLng,
          east: maxLng
        },
        items: cellItems
      });
    }

    return { clusters, points };
  }

  setOptions(options: unknown): void {
    if (typeof options === "object" && options !== null) {
      this.options = { ...this.options, ...(options as Partial<GridAlgorithmOptions>) };
    }
  }
}
