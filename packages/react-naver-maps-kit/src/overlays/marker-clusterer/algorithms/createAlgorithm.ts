import type { BuiltInAlgorithmConfig, ClusterAlgorithm } from "../types";
import { GridAlgorithm } from "./grid";
import { RadiusAlgorithm } from "./radius";
import { SuperclusterAlgorithm } from "./supercluster";

export function isBuiltInConfig(
  value: BuiltInAlgorithmConfig | ClusterAlgorithm<unknown>
): value is BuiltInAlgorithmConfig {
  return "type" in value && typeof (value as BuiltInAlgorithmConfig).type === "string";
}

function omitUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(obj)) {
    if (obj[key] !== undefined) {
      result[key] = obj[key];
    }
  }
  return result as Partial<T>;
}

export function createAlgorithm<TData>(config: BuiltInAlgorithmConfig): ClusterAlgorithm<TData> {
  switch (config.type) {
    case "grid":
      return new GridAlgorithm<TData>(
        omitUndefined({
          gridSize: config.gridSize,
          minClusterSize: config.minClusterSize,
          maxZoom: config.maxZoom
        })
      );
    case "radius":
      return new RadiusAlgorithm<TData>(
        omitUndefined({
          radius: config.radius,
          minClusterSize: config.minClusterSize,
          maxZoom: config.maxZoom
        })
      );
    case "supercluster":
      return new SuperclusterAlgorithm<TData>(
        omitUndefined({
          radius: config.radius,
          minZoom: config.minZoom,
          maxZoom: config.maxZoom,
          extent: config.extent,
          nodeSize: config.nodeSize
        })
      );
  }
}
