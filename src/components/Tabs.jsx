// src/components/Tabs.jsx
import React from "react";

export default function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div className="tabs">
      {tabs.map((tab, idx) => (
        <button
          key={tab.id ?? idx}                    // ← unique key prop
          className={tab === activeTab ? "active" : ""}
          onClick={() => onChange(tab)}
        >
          {tab.label ?? tab}
        </button>
      ))}
    </div>
  );
}
