// src/pages/Dashboard.jsx
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";
import SummaryCard from "../components/SummaryCard.jsx";
import SectionHeader from "../components/SectionHeader.jsx";

// helper: compute current streak from an array of date strings "YYYY-MM-DD"
function computeStreak(dates) {
  if (!dates.length) return 0;

  const unique = Array.from(new Set(dates));
  const sortedDesc = unique.sort().reverse(); // newest → oldest

  const parse = (s) => new Date(`${s}T00:00:00`);

  let streak = 1;
  let prev = parse(sortedDesc[0]);

  for (let i = 1; i < sortedDesc.length; i++) {
    const current = parse(sortedDesc[i]);
    const diffDays = Math.round((prev - current) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      streak++;
      prev = current;
    } else {
      break;
    }
  }

  return streak;
}

// helper: date string for today + offset in days
function getDateStr(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

// helper: is a date within last N days (0 = today)
function withinLastNDays(dateStr, n) {
  const d = new Date(`${dateStr}T00:00:00`);
  const today = new Date();
  const diffDays = (today - d) / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= n;
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [workouts] = useLocalStorage("formfit_workouts", []);
  const [sleepLog] = useLocalStorage("formfit_sleep", []);
  const [journal] = useLocalStorage("formfit_journal", []);

  // localStorage for manual checklist toggles, keyed by date
  const [checklistByDate, setChecklistByDate] = useLocalStorage(
    "formfit_daily_checklist",
    {}
  );

  const lastWorkout = workouts[workouts.length - 1] || null;
  const latestJournal = journal[journal.length - 1] || null;

  const avgSleep = useMemo(() => {
    if (!sleepLog.length) return null;
    const total = sleepLog.reduce((sum, s) => sum + (s.hours || 0), 0);
    return (total / sleepLog.length).toFixed(1);
  }, [sleepLog]);

  const workoutStreak = computeStreak(workouts.map((w) => w.date));
  const sleepStreak = computeStreak(sleepLog.map((s) => s.date));
  const journalStreak = computeStreak(journal.map((j) => j.date));

  // ===== Today checklist =====
  const todayStr = getDateStr(0);
  const yesterdayStr = getDateStr(-1);

  const didWorkoutToday = workouts.some((w) => w.date === todayStr);
  const loggedSleepLastNight = sleepLog.some(
    (s) => s.date === yesterdayStr
  );
  const wroteJournalToday = journal.some((j) => j.date === todayStr);

  // effective checklist state for today:
  const defaultTodayChecklist = {
    workout: didWorkoutToday,
    sleep: loggedSleepLastNight,
    journal: wroteJournalToday,
  };

  const todayChecklist =
    checklistByDate[todayStr] || defaultTodayChecklist;

  const toggleChecklist = (field) => {
    setChecklistByDate((prev) => {
      const existing = prev[todayStr] || defaultTodayChecklist;
      const updatedToday = {
        ...existing,
        [field]: !existing[field],
      };
      return {
        ...prev,
        [todayStr]: updatedToday,
      };
    });
  };

  // ===== This week snapshot (last 7 days including today) =====
  const recentWorkouts = workouts.filter((w) =>
    withinLastNDays(w.date, 6)
  );
  const recentSleep = sleepLog.filter((s) => withinLastNDays(s.date, 6));
  const recentJournal = journal.filter((j) =>
    withinLastNDays(j.date, 6)
  );

  const weeklyAvgSleep =
    recentSleep.length > 0
      ? (
          recentSleep.reduce((sum, s) => sum + (s.hours || 0), 0) /
          recentSleep.length
        ).toFixed(1)
      : null;

  return (
    <div>
      <h1>Dashboard</h1>
      <p style={{ color: "#6b7280", marginBottom: "1.2rem" }}>
        Overview of your workouts, sleep, and daily reflections.
      </p>

      {/* Summary cards row */}
      <div className="dashboard-summary-row">
        <SummaryCard
          title="Last Workout"
          value={lastWorkout ? lastWorkout.date : "No workouts yet"}
          subtitle={
            lastWorkout
              ? `${lastWorkout.exercises.length} exercise(s) · Streak: ${workoutStreak} day(s)`
              : "Log a workout to start a streak"
          }
          onClick={() => navigate("/workouts")}
          className="summary-card--orange"
        />

        <SummaryCard
          title="Average Sleep"
          value={avgSleep ? `${avgSleep} hrs` : "—"}
          subtitle={
            sleepLog.length
              ? `Based on ${sleepLog.length} day(s) · Streak: ${sleepStreak} day(s)`
              : "Add sleep entries to start a streak"
          }
          onClick={() => navigate("/sleep")}
          className="summary-card--purple"
        />

        <SummaryCard
          title="Latest Journal"
          value={latestJournal ? latestJournal.title : "No entries yet"}
          subtitle={
            latestJournal
              ? `${latestJournal.date} · Streak: ${journalStreak} day(s)`
              : "Write a reflection to start a streak"
          }
          onClick={() => navigate("/journal")}
          className="summary-card--green"
        />
      </div>

      {/* Today + Weekly snapshot grid */}
      <SectionHeader title="Today" />

      <div className="dashboard-today-grid">
        {/* Today checklist */}
        <div className="block-card dashboard-card-anim">
          <h2 style={{ marginTop: 0, marginBottom: "0.5rem" }}>
            Daily Checklist
          </h2>
          <ul className="checklist-list">
            <li
              className="checklist-item checklist-click"
              onClick={() => toggleChecklist("workout")}
            >
              <span className="checklist-icon">
                {todayChecklist.workout ? "✅" : "⬜"}
              </span>
              <span>
                Log a workout for <strong>today</strong>.
              </span>
            </li>
            <li
              className="checklist-item checklist-click"
              onClick={() => toggleChecklist("sleep")}
            >
              <span className="checklist-icon">
                {todayChecklist.sleep ? "✅" : "⬜"}
              </span>
              <span>
                Track <strong>last night’s sleep</strong>.
              </span>
            </li>
            <li
              className="checklist-item checklist-click"
              onClick={() => toggleChecklist("journal")}
            >
              <span className="checklist-icon">
                {todayChecklist.journal ? "✅" : "⬜"}
              </span>
              <span>
                Write a <strong>journal entry</strong> for today.
              </span>
            </li>
          </ul>
        </div>

        {/* Weekly snapshot */}
        <div className="block-card dashboard-card-anim">
          <h2 style={{ marginTop: 0, marginBottom: "0.5rem" }}>
            This Week
          </h2>
          <div className="weekly-summary-grid">
            <div>
              <div className="weekly-label">Workouts</div>
              <div className="weekly-value">
                {recentWorkouts.length}
              </div>
              <div className="weekly-sub">last 7 days</div>
            </div>
            <div>
              <div className="weekly-label">Avg Sleep</div>
              <div className="weekly-value">
                {weeklyAvgSleep ? `${weeklyAvgSleep} hrs` : "—"}
              </div>
              <div className="weekly-sub">
                based on {recentSleep.length} night(s)
              </div>
            </div>
            <div>
              <div className="weekly-label">Journal</div>
              <div className="weekly-value">
                {recentJournal.length}
              </div>
              <div className="weekly-sub">entries this week</div>
            </div>
          </div>
        </div>
      </div>

      {/* Getting started tips */}
      <SectionHeader title="Getting Started" />

      <div className="block-card dashboard-card-anim">
        <ul
          style={{
            color: "#6b7280",
            fontSize: "0.95rem",
            paddingLeft: "1.2rem",
            margin: 0,
          }}
        >
          <li>
            Log a workout on the <strong>Workouts</strong> page.
          </li>
          <li>
            Track tonight’s sleep on the <strong>Sleep</strong> page.
          </li>
          <li>
            Write a short reflection on the <strong>Journal</strong> page.
          </li>
        </ul>
      </div>
    </div>
  );
}
