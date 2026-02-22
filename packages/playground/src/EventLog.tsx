import type { LogEntry } from "./useEventLog.ts";

export function EventLog({
  entries,
  onClear,
}: {
  entries: LogEntry[];
  onClear: () => void;
}) {
  return (
    <div className="event-log">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className="event-log-title">Event Log</div>
        <button className="btn btn-danger" onClick={onClear} style={{ fontSize: 11, padding: "2px 8px" }}>
          Clear
        </button>
      </div>
      <div className="event-log-list">
        {entries.length === 0 && <div style={{ color: "#aaa" }}>No events yet</div>}
        {entries.map((e, i) => (
          <div key={i} className="entry">
            <span className="time">{e.time}</span>
            {e.message}
          </div>
        ))}
      </div>
    </div>
  );
}
