import { useCallback, useState } from "react";

export interface LogEntry {
  time: string;
  message: string;
}

export function useEventLog(maxEntries = 30) {
  const [entries, setEntries] = useState<LogEntry[]>([]);

  const log = useCallback(
    (message: string) => {
      const time = new Date().toLocaleTimeString("ko-KR", { hour12: false });
      setEntries((prev) => [{ time, message }, ...prev].slice(0, maxEntries));
    },
    [maxEntries]
  );

  const clear = useCallback(() => setEntries([]), []);

  return { entries, log, clear };
}
