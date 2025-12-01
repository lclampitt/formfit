// src/pages/Journal.jsx
import React from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import JournalForm from "../components/journal/JournalForm.jsx";
import JournalList from "../components/journal/JournalList.jsx";

export default function Journal() {
  const [journal, setJournal] = useLocalStorage("formfit_journal", []);

  const handleAddEntry = (entry) => {
    setJournal([...journal, entry]);
  };

  const handleDeleteEntry = (id) => {
    setJournal(journal.filter((j) => j.id !== id));
  };

  const handleUpdateEntry = (updated) => {
    setJournal(journal.map((j) => (j.id === updated.id ? updated : j)));
  };

  const handleClearJournal = () => {
    if (
      window.confirm(
        "Clear all journal entries? This cannot be undone."
      )
    ) {
      setJournal([]);
    }
  };

  return (
    <div>
      <h1>Daily Journal</h1>
      <p style={{ color: "#6b7280", marginBottom: "1rem" }}>
        Write short reflections or goals for your day.
      </p>

      <JournalForm onAddEntry={handleAddEntry} />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.5rem",
        }}
      >
        <h2 style={{ margin: 0 }}>Entries</h2>
        {journal.length > 0 && (
          <button onClick={handleClearJournal}>Clear All</button>
        )}
      </div>

      <JournalList
        journal={journal}
        onDeleteEntry={handleDeleteEntry}
        onUpdateEntry={handleUpdateEntry}
      />
    </div>
  );
}
