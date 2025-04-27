import React from 'react';

const GrowthPhaseTab = ({
  currentPhase,
  phaseStartDate,
  onPhaseChange,
  onPhaseDateChange
}) => {
  const calculateDaysInPhase = () => {
    if (!phaseStartDate) return 0;
    const start = new Date(phaseStartDate);
    const now = new Date();
    const diff = now - start;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="growth-phase">
      <h3>Growth Phase Management</h3>

      <div className="control-group">
        <label>Current Phase:</label>
        <select
          id="growthPhaseSelect"
          value={currentPhase}
          onChange={(e) => onPhaseChange(e.target.value)}
        >
          <option value="veg">Vegetative</option>
          <option value="flower">Flowering</option>
          <option value="harvest">Harvest</option>
        </select>

        <label>Phase Start Date:</label>
        <input
          type="date"
          id="phaseStartDate"
          value={phaseStartDate || ''}
          onChange={(e) => onPhaseDateChange(e.target.value)}
        />

        <button onClick={() => {}} disabled style={{ opacity: 0.6 }}>
          Update Phase
        </button>
      </div>

      <div id="phaseInfoDisplay" style={{ marginTop: '20px' }}>
        <p><strong>Current Phase:</strong> {currentPhase || '--'}</p>
        <p><strong>Days in Phase:</strong> {calculateDaysInPhase()}</p>
        <p><strong>Phase Started:</strong> {phaseStartDate || '--'}</p>
      </div>
    </div>
  );
};

export default GrowthPhaseTab;
