import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

// group by week-of-year label like "W48 2025"
function getWeekKey(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d)) return "Unknown";

  const year = d.getFullYear();
  const start = new Date(year, 0, 1);
  const diffDays = Math.floor((d - start) / (1000 * 60 * 60 * 24));
  const week = Math.floor(diffDays / 7) + 1;

  return `W${week} ${year}`;
}

export default function WorkoutFrequencyChart({ workouts = [] }) {
  if (!workouts.length) {
    return (
      <p style={{ color: "#9ca3af", fontSize: "0.9rem" }}>
        Log some workouts to see this chart.
      </p>
    );
  }

  const counts = workouts.reduce((acc, w) => {
    const key = getWeekKey(w.date);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(counts).map(([week, count]) => ({
    week,
    count,
  }));

  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="week" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
