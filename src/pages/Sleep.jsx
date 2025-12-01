// src/pages/Sleep.jsx
import React from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import SleepForm from "../components/sleep/SleepForm.jsx";
import SleepSummary from "../components/sleep/SleepSummary.jsx";

export default function Sleep() {
  const [sleepLog, setSleepLog] = useLocalStorage("formfit_sleep", []);

  const handleAddSleep = (entry) => {
    setSleepLog([...sleepLog, entry]);
  };

  const handleDeleteSleep = (id) => {
    setSleepLog(sleepLog.filter((s) => s.id !== id));
  };

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

      <SleepForm onAddSleep={handleAddSleep} />

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

      <SleepSummary
        sleepLog={sleepLog}
        onDeleteSleep={handleDeleteSleep}
      />
    </div>
  );
}
