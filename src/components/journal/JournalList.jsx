import React, { useState } from "react";

export default function JournalList({ journal, onDeleteEntry, onUpdateEntry }) {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  if (!journal.length) {
    return <p>No journal entries yet.</p>;
  }

  const sorted = journal
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));

  const startEdit = (entry) => {
    setEditingId(entry.id);
    setEditTitle(entry.title);
    setEditContent(entry.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditContent("");
  };

  const saveEdit = (entry) => {
    onUpdateEntry({
      ...entry,
      title: editTitle.trim() || "Untitled",
      content: editContent.trim(),
    });
    cancelEdit();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        marginTop: "0.5rem",
      }}
    >
      {sorted.map((entry) => {
        const isEditing = entry.id === editingId;

        return (
          <div
            key={entry.id}
            style={{
              border: "1px solid rgba(0,0,0,0.1)",
              padding: "0.75rem 0.9rem",
              borderRadius: "6px",
              background: "rgba(0,0,0,0.02)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "0.75rem",
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.85rem", opacity: 0.7 }}>
                  {entry.date}
                </div>

                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      style={{
                        width: "100%",
                        margin: "0.25rem 0",
                      }}
                    />
                    <textarea
                      rows={3}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      style={{ width: "100%", marginTop: "0.25rem" }}
                    />
                  </>
                ) : (
                  <>
                    <h3 style={{ margin: "0.25rem 0" }}>{entry.title}</h3>
                    <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                      {entry.content}
                    </p>
                  </>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                }}
              >
                {isEditing ? (
                  <>
                    <button onClick={() => saveEdit(entry)}>Save</button>
                    <button onClick={cancelEdit}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(entry)}>Edit</button>
                    <button onClick={() => onDeleteEntry(entry.id)}>
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
