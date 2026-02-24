import { useMemo } from "react";

export function useTaxiStats(taxis: Array<{ status: string; speed: number }>) {
  return useMemo(() => {
    const total = taxis.length;
    const idle = taxis.filter((t) => t.status === "idle").length;
    const moving = taxis.filter((t) => t.status === "moving").length;
    const assigned = taxis.filter((t) => t.status === "assigned").length;
    const avgSpeed = taxis.reduce((sum, t) => sum + t.speed, 0) / (total || 1);

    return { total, idle, moving, assigned, avgSpeed };
  }, [taxis]);
}
