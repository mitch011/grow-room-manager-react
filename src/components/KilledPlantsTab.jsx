import React from 'react';

const KilledPlantsTab = ({ killedPlants, onResetKilledPlants }) => {
  return (
    <div className="killed-plants">
      <h3>Killed Plants</h3>
      <p>Total: <strong>{killedPlants.length}</strong></p>

      {killedPlants.length === 0 ? (
        <p>No killed plants recorded yet.</p>
      ) : (
        <ul id="killedPlantsList" style={{ marginTop: '10px' }}>
          {killedPlants.map((plant, index) => (
            <li key={index}>
              ID: <strong>{plant.id}</strong> — Table {plant.table + 1}, Light {plant.light + 1} — {plant.timestamp}
            </li>
          ))}
        </ul>
      )}

      <button onClick={onResetKilledPlants} className="secondary reset-killed-btn" style={{ marginTop: '15px' }}>
        Reset Killed Plants
      </button>
    </div>
  );
};

export default KilledPlantsTab;
