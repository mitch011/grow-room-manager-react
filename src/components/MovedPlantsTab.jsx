import React from 'react';

const MovedPlantsTab = ({ movedPlants, onResetMovedPlants }) => {
  return (
    <div className="moved-plants">
      <h3>Moved Plants</h3>
      <p>Total: <strong>{movedPlants.length}</strong></p>

      {movedPlants.length === 0 ? (
        <p>No moved plants recorded yet.</p>
      ) : (
        <ul id="movedPlantsList" style={{ marginTop: '10px' }}>
          {movedPlants.map((plant, index) => (
            <li key={index}>
              ID: <strong>{plant.id}</strong> — Moved from Table {plant.fromTable + 1}, Light {plant.fromLight + 1}
              {' → '}Table {plant.toTable + 1}, Light {plant.toLight + 1} — {plant.timestamp}
            </li>
          ))}
        </ul>
      )}

      <button onClick={onResetMovedPlants} className="secondary reset-moved-btn" style={{ marginTop: '15px' }}>
        Reset Moved Plants
      </button>
    </div>
  );
};

export default MovedPlantsTab;
