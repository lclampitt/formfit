import React, { useState } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";

export default function WorkoutLogger() {
  const [workouts, setWorkouts] = useLocalStorage("formfit_workouts", []);

  const [workoutDate, setWorkoutDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [workoutName, setWorkoutName] = useState("");
  const [exercises, setExercises] = useState([]);
  const [newExercise, setNewExercise] = useState("");
  const [message, setMessage] = useState("");
  const [editingWorkoutId, setEditingWorkoutId] = useState(null);
  const [expanded, setExpanded] = useState({});

  // === Exercise & set management ===

  const addExercise = () => {
    if (!newExercise.trim()) return;
    setExercises([
      ...exercises,
      {
        name: newExercise.trim(),
        sets: [{ weight: "", reps: "", notes: "" }],
      },
    ]);
    setNewExercise("");
  };

  const addSet = (exerciseIndex) => {
    const updated = [...exercises];
    updated[exerciseIndex].sets.push({ weight: "", reps: "", notes: "" });
    setExercises(updated);
  };

  const handleSetChange = (exerciseIndex, setIndex, field, value) => {
    const updated = [...exercises];
    updated[exerciseIndex].sets[setIndex][field] = value;
    setExercises(updated);
  };

  const deleteExercise = (exerciseIndex) => {
    setExercises(exercises.filter((_, idx) => idx !== exerciseIndex));
  };

  // === Save / update workouts in localStorage ===

  const saveWorkout = () => {
    if (!workoutName.trim() || exercises.length === 0) {
      setMessage("⚠️ Please enter a workout name and add at least one exercise.");
      return;
    }

    const workoutData = {
      id: editingWorkoutId || crypto.randomUUID(),
      date: workoutDate,
      name: workoutName.trim(),
      exercises,
    };

    let updated;
    if (editingWorkoutId) {
      // update existing
      updated = workouts.map((w) =>
        w.id === editingWorkoutId ? workoutData : w
      );
      setMessage("✅ Workout updated!");
      setEditingWorkoutId(null);
    } else {
      // new workout
      updated = [...workouts, workoutData];
      setMessage("✅ Workout saved!");
    }

    setWorkouts(updated);

    // reset editor
    setWorkoutName("");
    setExercises([]);
  };

  const editWorkout = (workout) => {
    setWorkoutDate(workout.date);
    setWorkoutName(workout.name);
    setExercises(workout.exercises || []);
    setEditingWorkoutId(workout.id);
    setMessage("✏️ Editing workout...");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearAllWorkouts = () => {
    if (!workouts.length) return;
    if (window.confirm("Clear all workouts? This cannot be undone.")) {
      setWorkouts([]);
      setExpanded({});
    }
  };

  const deleteWorkout = (id) => {
    if (window.confirm("Delete this workout?")) {
      setWorkouts(workouts.filter((w) => w.id !== id));
      setExpanded((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const sortedHistory = [...workouts].sort((a, b) =>
    b.date.localeCompare(a.date)
  );

  return (
    <div className="workout-logger">
      <h1 className="workout-title">Workout Logger</h1>
      <p className="workout-subtext">
        Track sets, reps, and weight for your training sessions.
      </p>

      {/* Top: date + workout name */}
      <div className="workout-header">
        <div>
          <label>Date:</label>
          <input
            type="date"
            value={workoutDate}
            onChange={(e) => setWorkoutDate(e.target.value)}
          />
        </div>
        <div className="workout-header-name">
          <label>Workout Name:</label>
          <input
            type="text"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            placeholder="e.g. Push Day, Lower Body, Full Body"
          />
        </div>
      </div>

      {/* Add exercise row */}
      <div className="exercise-adder">
        <input
          type="text"
          value={newExercise}
          onChange={(e) => setNewExercise(e.target.value)}
          placeholder="Add an exercise..."
        />
        <button type="button" onClick={addExercise}>
          Add
        </button>
      </div>

      {/* Exercise blocks with sets table */}
      {exercises.map((ex, i) => (
        <div key={i} className="exercise-block block-card">
          <div className="exercise-header">
            <h3>{ex.name}</h3>
            <button
              type="button"
              className="secondary-btn danger-btn"
              onClick={() => deleteExercise(i)}
            >
              Trash
            </button>
          </div>

          <table className="sets-table">
            <thead>
              <tr>
                <th>Set</th>
                <th>Weight (lbs)</th>
                <th>Reps</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {ex.sets.map((set, j) => (
                <tr key={j}>
                  <td>{j + 1}</td>
                  <td>
                    <input
                      type="number"
                      value={set.weight}
                      onChange={(e) =>
                        handleSetChange(i, j, "weight", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={set.reps}
                      onChange={(e) =>
                        handleSetChange(i, j, "reps", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={set.notes}
                      onChange={(e) =>
                        handleSetChange(i, j, "notes", e.target.value)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            type="button"
            className="add-set-btn secondary-btn"
            onClick={() => addSet(i)}
          >
            + Add Set
          </button>
        </div>
      ))}

      {message && <p className="workout-message">{message}</p>}

      <button className="primary-btn save-btn" type="button" onClick={saveWorkout}>
        {editingWorkoutId ? "Update Workout" : "Save Workout"}
      </button>

      {/* History */}
      <div className="history-header-row">
        <h2 className="history-title">Workout History</h2>
        {sortedHistory.length > 0 && (
          <button
            type="button"
            className="secondary-btn"
            onClick={clearAllWorkouts}
          >
            Clear All
          </button>
        )}
      </div>

      {sortedHistory.length === 0 && (
        <p style={{ color: "#6b7280", textAlign: "center" }}>
          No workouts logged yet.
        </p>
      )}

      {sortedHistory.map((workout) => (
        <div key={workout.id} className="history-card block-card">
          <div
            className="history-header"
            onClick={() => toggleExpand(workout.id)}
          >
            <span>
              {workout.date} — <strong>{workout.name}</strong>
            </span>
            <div className="history-header-actions">
              <button
                type="button"
                className="secondary-btn small-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  editWorkout(workout);
                }}
              >
                Edit
              </button>
              <button
                type="button"
                className="secondary-btn small-btn danger-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteWorkout(workout.id);
                }}
              >
                Delete
              </button>
              <span className="history-toggle">
                {expanded[workout.id] ? "▲" : "▼"}
              </span>
            </div>
          </div>

          {expanded[workout.id] && (
            <div className="history-body">
              {workout.exercises?.map((ex, idx) => (
                <div key={idx} className="history-exercise">
                  <h4>{ex.name}</h4>
                  <table className="sets-table">
                    <thead>
                      <tr>
                        <th>Set</th>
                        <th>Weight (lbs)</th>
                        <th>Reps</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ex.sets.map((set, j) => (
                        <tr key={j}>
                          <td>{j + 1}</td>
                          <td>{set.weight}</td>
                          <td>{set.reps}</td>
                          <td>{set.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
