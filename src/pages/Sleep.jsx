// src/pages/Sleep.jsx
import React from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import SleepForm from "../components/sleep/SleepForm.jsx";
import SleepSummary from "../components/sleep/SleepSummary.jsx";

// Page for logging and reviewing sleep entries
export default function Sleep() {
  const [sleepLog, setSleepLog] = useLocalStorage("formfit_sleep", []);

  // Add one sleep entry
  const handleAddSleep = (entry) => {
    setSleepLog([...sleepLog, entry]);
  };

  // Remove one entry from the log
  const handleDeleteSleep = (id) => {
    setSleepLog(sleepLog.filter((s) => s.id !== id));
  };

  // Clear entire sleep history
  const handleClearSleep = () => {
    if (
      window.confirm(
        "Clear all sleep entries? This cannot be undone."
      )
    ) {
      setSleepLog([]);
    }
  };

  return (
    <div>
      <h1>Sleep</h1>
      <p style={{ color: "#6b7280", marginBottom: "1rem" }}>
        Track your sleep hours and quality.
      </p>

      {/* Form for adding a new sleep record */}
      <SleepForm onAddSleep={handleAddSleep} />

      {/* Header + clear button for the history section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.5rem",
        }}
      >
        <h2 style={{ margin: 0 }}>Sleep History</h2>
        {sleepLog.length > 0 && (
          <button onClick={handleClearSleep}>Clear All</button>
        )}
      </div>

      {/* List + summary of all sleep entries */}
      <SleepSummary
        sleepLog={sleepLog}
        onDeleteSleep={handleDeleteSleep}
      />
    </div>
  );
}
