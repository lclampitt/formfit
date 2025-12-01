import React, { useMemo } from "react";

// Summary list of sleep logs + average hours
export default function SleepSummary({ sleepLog, onDeleteSleep }) {
  // Empty state
  if (!sleepLog.length) {
    return <p>No sleep entries logged yet.</p>;
  }

  // Sort newest first
  const sorted = sleepLog
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));

  // Compute overall average hours
  const avgHours = useMemo(() => {
    const total = sleepLog.reduce((sum, s) => sum + (s.hours || 0), 0);
    return (total / sleepLog.length).toFixed(1);
  }, [sleepLog]);

  return (
    <div>
      <p>
        Average sleep: <strong>{avgHours} hrs</strong> across{" "}
        {sleepLog.length} day(s).
      </p>

      {/* Simple vertical list of nights with a delete action */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          marginTop: "0.5rem",
        }}
      >
        {sorted.map((entry) => (
          <div
            key={entry.id}
            style={{
              border: "1px solid rgba(0,0,0,0.1)",
              padding: "0.5rem 0.75rem",
              borderRadius: "6px",
              background: "rgba(0,0,0,0.02)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <strong>{entry.date}</strong>{" "}
              <div>
                {entry.hours} hrs — {entry.quality}
              </div>
            </div>

            <button onClick={() => onDeleteSleep(entry.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
