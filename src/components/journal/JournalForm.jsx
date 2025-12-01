import React, { useState } from "react";

// Simple form for creating a single journal entry
export default function JournalForm({ onAddEntry }) {
  const today = new Date().toISOString().slice(0, 10);

  // Local form state
  const [date, setDate] = useState(today);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Build an entry object and send it up to the parent
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const entry = {
      id: crypto.randomUUID(),
      date,
      title: title.trim() || "Untitled",
      content: content.trim(),
    };

    onAddEntry(entry);
    setTitle("");
    setContent("");
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      {/* Top row: date + title */}
      <div className="form-row-inline">
        <label>
          Date
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <label>
          Title
          <input
            type="text"
            placeholder="Today’s reflection"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
      </div>

      {/* Main textarea for the reflection */}
      <div className="form-row">
        <label>
          Reflection
          <textarea
            rows={4}
            placeholder="How was your day? How did your training go?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </label>
      </div>

      <button type="submit" className="primary-btn">
        Add Entry
      </button>
    </form>
  );
}
