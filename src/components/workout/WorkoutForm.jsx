// src/components/workout/WorkoutForm.jsx
import React, { useState } from "react";

export default function WorkoutForm({ onAddWorkout }) {
  const today = new Date().toISOString().slice(0, 10);

  const [date, setDate] = useState(today);
  const [workoutName, setWorkoutName] = useState("");
  const [exerciseName, setExerciseName] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");

  const [exercises, setExercises] = useState([]);

  const handleAddExercise = (e) => {
    e.preventDefault();

    if (!exerciseName.trim()) return;

    const exercise = {
      id: crypto.randomUUID(),
      name: exerciseName.trim(),
      sets: sets ? Number(sets) : null,
      reps: reps ? Number(reps) : null,
      weight: weight ? Number(weight) : null,
      notes: notes.trim() || "",
    };

    setExercises([...exercises, exercise]);

    // clear exercise fields only
    setExerciseName("");
    setSets("");
    setReps("");
    setWeight("");
    setNotes("");
  };

  const handleRemoveExercise = (id) => {
    setExercises(exercises.filter((ex) => ex.id !== id));
  };

  const handleSaveWorkout = (e) => {
    e.preventDefault();
    if (!exercises.length) return;

    const session = {
      id: crypto.randomUUID(),
      date,
      name: workoutName.trim() || "Workout",
      exercises,
    };

    onAddWorkout(session);

    // reset builder, keep date
    setWorkoutName("");
    setExercises([]);
  };

  return (
    <form className="form-card workout-builder" onSubmit={handleSaveWorkout}>
      <h2 className="workout-builder-title">Log a Workout</h2>

      {/* Top row: date + workout name */}
      <div className="form-row-inline workout-builder-top">
        <label>
          Date
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <label className="workout-name-field">
          Workout Name
          <input
            type="text"
            placeholder="e.g. Push Day, Pull Day, Legs"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
          />
        </label>
      </div>

      {/* Exercise inputs */}
      <div className="form-row">
        <label>
          Exercise
          <input
            type="text"
            placeholder="e.g. Bench Press, Lat Pulldowns"
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
          />
        </label>
      </div>

      <div className="form-row-inline">
        <label>
          Sets
          <input
            type="number"
            min="1"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
          />
        </label>
        <label>
          Reps
          <input
            type="number"
            min="1"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
          />
        </label>
        <label>
          Weight (lbs)
          <input
            type="number"
            min="0"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </label>
      </div>

      <div className="form-row">
        <label>
          Notes
          <textarea
            rows={2}
            placeholder="Optional: tempo, rest, how it felt..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </label>
      </div>

      <div className="workout-builder-actions">
        <button
          type="button"
          className="secondary-btn"
          onClick={handleAddExercise}
        >
          Add Exercise
        </button>
        <button
          type="submit"
          className="primary-btn"
          disabled={!exercises.length}
        >
          Save Workout
        </button>
      </div>

      {/* Current exercises table */}
      {exercises.length > 0 && (
        <div className="workout-current-list">
          <h3>Current Workout</h3>
          <table className="workout-table">
            <thead>
              <tr>
                <th>Exercise</th>
                <th>Sets</th>
                <th>Reps</th>
                <th>Weight (lbs)</th>
                <th>Notes</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {exercises.map((ex) => (
                <tr key={ex.id}>
                  <td>{ex.name}</td>
                  <td>{ex.sets ?? "—"}</td>
                  <td>{ex.reps ?? "—"}</td>
                  <td>{ex.weight ?? "—"}</td>
                  <td>{ex.notes || "—"}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleRemoveExercise(ex.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </form>
  );
}
