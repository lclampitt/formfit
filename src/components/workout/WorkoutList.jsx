// src/components/workout/WorkoutList.jsx
import React from "react";

export default function WorkoutList({ workouts = [], onDeleteWorkout }) {
  if (!workouts.length) {
    return (
      <p style={{ color: "#6b7280", marginTop: "1rem" }}>
        No workouts logged yet. Use the form above to save your first
        session.
      </p>
    );
  }

  const sorted = [...workouts].sort((a, b) =>
    b.date.localeCompare(a.date)
  );

  return (
    <section className="workout-history">
      <h2>Workout History</h2>

      {sorted.map((session) => (
        <div
          key={session.id}
          className="block-card workout-session-card"
        >
          <div className="workout-session-header">
            <div className="workout-session-title">
              <span className="workout-session-date">
                {session.date}
              </span>
              <span className="workout-session-name">
                {" "}
                — {session.name || "Workout"}
              </span>
            </div>
            {onDeleteWorkout && (
              <button
                type="button"
                onClick={() => onDeleteWorkout(session.id)}
              >
                Delete
              </button>
            )}
          </div>

          <table className="workout-table">
            <thead>
              <tr>
                <th>Exercise</th>
                <th>Sets</th>
                <th>Reps</th>
                <th>Weight (lbs)</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {(session.exercises || []).map((ex) => (
                <tr key={ex.id}>
                  <td>{ex.name}</td>
                  <td>{ex.sets ?? "—"}</td>
                  <td>{ex.reps ?? "—"}</td>
                  <td>{ex.weight ?? "—"}</td>
                  <td>{ex.notes || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </section>
  );
}
