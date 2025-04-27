import React from 'react';

const ControlPanel = ({
  tables,
  lightsPerTable,
  plantsPerLight,
  onTablesChange,
  onLightsPerTableChange,
  onPlantsPerLightChange,
  onGenerateLayout
}) => {
  return (
    <div className="control-panel">
      <div className="control-group">
        <label>Tables:</label>
        <input
          type="number"
          value={tables}
          min="1"
          onChange={(e) => onTablesChange(parseInt(e.target.value, 10))}
        />

        <label>Lights per Table:</label>
        <input
          type="number"
          value={lightsPerTable}
          min="1"
          onChange={(e) => onLightsPerTableChange(parseInt(e.target.value, 10))}
        />

        <label>Plants per Light:</label>
        <input
          type="number"
          value={plantsPerLight}
          min="1"
          onChange={(e) => onPlantsPerLightChange(parseInt(e.target.value, 10))}
        />

        <button onClick={onGenerateLayout} className="generate-btn">
          Generate Layout
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
