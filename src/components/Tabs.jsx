import React, { useState } from 'react';

const Tabs = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.key || '');

  const handleTabClick = (key) => {
    setActiveTab(key);
  };

  return (
    <div className="tab-container">
      <div className="tab-buttons">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => handleTabClick(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tabs.map((tab) => (
        <div
          key={tab.key}
          id={tab.key}
          className={`tab-content ${activeTab === tab.key ? 'active' : ''}`}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
};

export default Tabs;
