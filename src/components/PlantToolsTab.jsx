import React, { useState } from 'react';

const PlantToolsTab = ({
  onLookupPlantId,
  onKillPlant,
  onMovePlant,
  onShowAllPlantIds
}) => {
  const [lookupId, setLookupId] = useState('');
  const [killId, setKillId] = useState('');
  const [moveId, setMoveId] = useState('');

  const handleLookup = () => {
    if (lookupId.trim()) {
      onLookupPlantId(lookupId.trim());
      setLookupId('');
    }
  };

  const handleKill = () => {
    if (killId.trim()) {
      onKillPlant(killId.trim());
      setKillId('');
    }
  };

  const handleMove = () => {
    if (moveId.trim()) {
      onMovePlant(moveId.trim());
      setMoveId('');
    }
  };

  return (
    <div className="plant-tools">
      <h3>Plant ID Tools</h3>
      <div className="control-group">
        <input
          type="text"
          placeholder="Plant ID to find"
          value={lookupId}
          onChange={(e) => setLookupId(e.target.value)}
        />
        <button onClick={handleLookup} className="lookup-btn">Find Plant</button>

        <input
          type="text"
          placeholder="Plant ID to kill"
          value={killId}
          onChange={(e) => setKillId(e.target.value)}
        />
        <button onClick={handleKill} className="secondary kill-btn">Kill Plant</button>

        <input
          type="text"
          placeholder="Plant ID to move"
          value={moveId}
          onChange={(e) => setMoveId(e.target.value)}
        />
        <button onClick={handleMove} className="move-btn">Move Plant</button>

        <button onClick={onShowAllPlantIds} className="show-ids-btn">Show All IDs</button>
      </div>
    </div>
  );
};

export default PlantToolsTab;
