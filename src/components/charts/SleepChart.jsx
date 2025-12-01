import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

// Simple line chart for sleep hours over time
export default function SleepChart({ sleepLog = [] }) {
  // If there’s no data yet, just show a hint
  if (!sleepLog.length) {
    return (
      <p style={{ color: "#9ca3af", fontSize: "0.9rem" }}>
        Add sleep entries to see this chart.
      </p>
    );
  }

  // Sort entries by date and map into Recharts-friendly format
  const data = sleepLog
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((entry) => ({
      date: entry.date,
      hours: Number(entry.hours),
    }));

  // Basic line chart, nothing fancy
  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="hours" dot />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
