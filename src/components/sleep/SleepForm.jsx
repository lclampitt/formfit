import React, { useState } from "react";

export default function SleepForm({ onAddSleep }) {
  const today = new Date().toISOString().slice(0, 10);

  const [date, setDate] = useState(today);
  const [hours, setHours] = useState("");
  const [quality, setQuality] = useState("Good");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!hours) return;

    const entry = {
      id: crypto.randomUUID(),
      date,
      hours: Number(hours),
      quality,
    };

    onAddSleep(entry);
    setHours("");
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>
          Date
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
      </div>

      <div className="form-row-inline">
        <label>
          Hours slept
          <input
            type="number"
            min="0"
            step="0.25"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />
        </label>

        <label>
          Quality
          <select
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
          >
            <option>Poor</option>
            <option>Okay</option>
            <option>Good</option>
            <option>Great</option>
          </select>
        </label>
      </div>

      <button type="submit" className="primary-btn">
        Add Sleep Entry
      </button>
    </form>
  );
}
