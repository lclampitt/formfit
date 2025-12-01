import React from "react";

// Simple reusable section title
export default function SectionHeader({ title }) {
  return (
    <h2 style={{ marginTop: "1.5rem", marginBottom: "0.75rem" }}>
      {title}
    </h2>
  );
}
