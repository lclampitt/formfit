import React from "react";

// Small dashboard card (optionally clickable)
export default function SummaryCard({ title, value, subtitle, onClick, className = "" }) {
  const clickable = Boolean(onClick);

  return (
    <div
      className={`summary-card ${clickable ? "clickable" : ""} ${className}`}
      onClick={onClick || undefined}
    >
      <div className="summary-card-title">{title}</div>
      <div className="summary-card-value">{value}</div>
      {subtitle && <div className="summary-card-subtitle">{subtitle}</div>}
    </div>
  );
}
