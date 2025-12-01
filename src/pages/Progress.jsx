import React, { useMemo } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  LineChart,
  Line,
} from "recharts";

function formatShortDate(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  }); // e.g. "Dec 1"
}

function getWeekStart(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;

  // Use Monday as week start (you could switch this to Sunday if you prefer)
  const day = d.getDay(); // 0–6
  const diffToMonday = (day + 6) % 7; // 0 if Monday, 6 if Sunday
  d.setDate(d.getDate() - diffToMonday);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const dayOfMonth = String(d.getDate()).padStart(2, "0");

  return {
    key: `${year}-${month}-${dayOfMonth}`, // stable key
    label: d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }), // "Nov 24"
  };
}

export default function Progress() {
  const [workouts, setWorkouts] = useLocalStorage("formfit_workouts", []);
  const [sleepLog, setSleepLog] = useLocalStorage("formfit_sleep", []);

  const handleClearAll = () => {
    if (
      window.confirm(
        "Clear all progress data (workouts and sleep)? This cannot be undone."
      )
    ) {
      setWorkouts([]);
      setSleepLog([]);
    }
  };

  // -------- Workouts per week (clean labels + colored bars) --------
  const workoutsPerWeek = useMemo(() => {
    if (!Array.isArray(workouts)) return [];

    const map = new Map();

    workouts.forEach((w) => {
      if (!w?.date) return;
      const info = getWeekStart(w.date);
      if (!info) return;

      const existing = map.get(info.key) || {
        weekKey: info.key,
        label: info.label,
        count: 0,
      };
      existing.count += 1;
      map.set(info.key, existing);
    });

    return Array.from(map.values()).sort((a, b) =>
      a.weekKey.localeCompare(b.weekKey)
    );
  }, [workouts]);

  // -------- Sleep over time (shorter date labels) --------
  const sleepSeries = useMemo(() => {
    if (!Array.isArray(sleepLog)) return [];
    return [...sleepLog]
      .filter((s) => s?.date && s?.hours != null)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((s) => ({
        date: s.date,
        hours: Number(s.hours),
      }));
  }, [sleepLog]);

  return (
    <div>
      <h1>Progress</h1>
      <p style={{ color: "#6b7280", maxWidth: "640px" }}>
        Visualize your workout consistency and sleep patterns over time.
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "1rem",
        }}
      >
        {(workouts.length > 0 || sleepLog.length > 0) && (
          <button type="button" className="primary-btn" onClick={handleClearAll}>
            Clear All Progress
          </button>
        )}
      </div>

      <h2>Activity Overview</h2>

      <div className="grid-2">
        {/* -------- Workouts per Week chart -------- */}
        <div className="block-card">
          <h3>Workouts per Week</h3>
          {workoutsPerWeek.length === 0 ? (
            <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>
              No workouts logged yet. Log a workout to see weekly trends here.
            </p>
          ) : (
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={workoutsPerWeek} margin={{ top: 10, right: 16, left: -10, bottom: 10 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="rgba(148,163,184,0.4)"
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    domain={[0, "dataMax + 1"]}
                  />
                  <RechartsTooltip
                    formatter={(value) => [`${value} workout(s)`, "Total"]}
                    labelFormatter={(label) => `Week starting ${label}`}
                  />
                  <Bar
                    dataKey="count"
                    fill="#ff6cab"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* -------- Sleep chart -------- */}
        <div className="block-card">
          <h3>Sleep Hours Over Time</h3>
          {sleepSeries.length === 0 ? (
            <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>
              No sleep logs yet. Add sleep entries to see your patterns here.
            </p>
          ) : (
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={sleepSeries}
                  margin={{ top: 10, right: 16, left: 0, bottom: 10 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="rgba(148,163,184,0.4)"
                  />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatShortDate}
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    minTickGap={16}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    domain={[0, "dataMax + 1"]}
                  />
                  <RechartsTooltip
                    labelFormatter={(label) => formatShortDate(label)}
                    formatter={(value) => [`${value} hrs`, "Sleep"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="hours"
                    stroke="#7366ff"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
