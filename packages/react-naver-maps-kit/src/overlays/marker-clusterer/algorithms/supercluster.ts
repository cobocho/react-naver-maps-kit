import Supercluster from "supercluster";

import type { AlgorithmContext, Cluster, ClusterAlgorithm, ItemRecord } from "../types";

interface SuperclusterAlgorithmOptions {
  readonly radius: number;
  readonly minZoom: number;
  readonly maxZoom: number;
  readonly extent: number;
  readonly nodeSize: number;
}

const DEFAULT_OPTIONS: SuperclusterAlgorithmOptions = {
  radius: 60,
  minZoom: 0,
  maxZoom: 16,
  extent: 512,
  nodeSize: 64
};

interface PointProperties<TData> {
  itemId: string | number;
  data: TData;
  markerOptions?: Readonly<Partial<naver.maps.MarkerOptions>>;
}

export class SuperclusterAlgorithm<TData> implements ClusterAlgorithm<TData> {
  private options: SuperclusterAlgorithmOptions;
  private index: Supercluster<PointProperties<TData>, Supercluster.AnyProps>;
  private itemMap: Map<string | number, ItemRecord<TData>> = new Map();
  private dirty = true;

  constructor(options?: Partial<SuperclusterAlgorithmOptions>) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.index = new Supercluster({
      radius: this.options.radius,
      minZoom: this.options.minZoom,
      maxZoom: this.options.maxZoom,
      extent: this.options.extent,
      nodeSize: this.options.nodeSize
    });
  }

  cluster(
    items: readonly ItemRecord<TData>[],
    ctx: AlgorithmContext
  ): {
    readonly clusters: readonly Cluster<TData>[];
    readonly points: readonly ItemRecord<TData>[];
  } {
    if (this.dirty || this.itemMap.size !== items.length) {
      this.load(items);
    }

    const { south, west, north, east } = ctx.bounds;
    const rawClusters = this.index.getClusters([west, south, east, north], Math.floor(ctx.zoom));

    const clusters: Cluster<TData>[] = [];
    const singlePoints: ItemRecord<TData>[] = [];

    for (const feature of rawClusters) {
      const [lng, lat] = feature.geometry.coordinates;
      const props = feature.properties;

      if ("cluster" in props && props.cluster === true) {
        const clusterProps = props as Supercluster.ClusterProperties & Supercluster.AnyProps;
        const clusterId = feature.id;
        const leaves = this.getLeaves(clusterId);

        let minLat = Infinity;
        let maxLat = -Infinity;
        let minLng = Infinity;
        let maxLng = -Infinity;

        for (const leaf of leaves) {
          minLat = Math.min(minLat, leaf.position.lat);
          maxLat = Math.max(maxLat, leaf.position.lat);
          minLng = Math.min(minLng, leaf.position.lng);
          maxLng = Math.max(maxLng, leaf.position.lng);
        }

        clusters.push({
          id: `sc-${String(clusterId)}`,
          position: { lat, lng },
          count: clusterProps.point_count,
          bounds: { south: minLat, north: maxLat, west: minLng, east: maxLng },
          items: leaves
        });
      } else {
        const pointProps = props as PointProperties<TData>;
        const item = this.itemMap.get(pointProps.itemId);
        if (item) {
          singlePoints.push(item);
        }
      }
    }

    return { clusters, points: singlePoints };
  }

  setOptions(options: unknown): void {
    if (typeof options === "object" && options !== null) {
      const next = { ...this.options, ...(options as Partial<SuperclusterAlgorithmOptions>) };
      this.options = next;
      this.index = new Supercluster({
        radius: next.radius,
        minZoom: next.minZoom,
        maxZoom: next.maxZoom,
        extent: next.extent,
        nodeSize: next.nodeSize
      });
      this.dirty = true;
    }
  }

  destroy(): void {
    this.itemMap.clear();
  }

  private load(items: readonly ItemRecord<TData>[]): void {
    this.itemMap.clear();

    const features: Array<Supercluster.PointFeature<PointProperties<TData>>> = [];

    for (const item of items) {
      this.itemMap.set(item.id, item);
      features.push({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [item.position.lng, item.position.lat]
        },
        properties: {
          itemId: item.id,
          data: item.data,
          markerOptions: item.markerOptions
        }
      });
    }

    this.index.load(features);
    this.dirty = false;
  }

  private getLeaves(clusterId: number | string | undefined): ItemRecord<TData>[] {
    if (clusterId === undefined) return [];

    const numericId = typeof clusterId === "string" ? parseInt(clusterId, 10) : clusterId;
    if (typeof numericId !== "number" || isNaN(numericId)) return [];

    const leaves = this.index.getLeaves(numericId, Infinity);
    const result: ItemRecord<TData>[] = [];

    for (const leaf of leaves) {
      const props = leaf.properties as PointProperties<TData>;
      const item = this.itemMap.get(props.itemId);
      if (item) {
        result.push(item);
      }
    }

    return result;
  }
}
