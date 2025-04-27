// src/components/RoomSelector.jsx
import React, { useState, useEffect } from 'react';

const RoomSelector = ({ rooms, currentRoom, onSelectRoom, onAddRoom, onRemoveRoom }) => {
  const [newRoomName, setNewRoomName] = useState('');

  const handleAddRoom = () => {
    if (newRoomName.trim() !== '') {
      onAddRoom(newRoomName.trim());
      setNewRoomName('');
    }
  };

  const handleRemoveRoom = () => {
    if (window.confirm(`Are you sure you want to delete room "${currentRoom}"?`)) {
      onRemoveRoom(currentRoom);
    }
  };

  return (
    <div className="room-selector">
      <label>Current Room:</label>
      <select value={currentRoom} onChange={(e) => onSelectRoom(e.target.value)}>
        {Object.keys(rooms).map((room) => (
          <option key={room} value={room}>{room}</option>
        ))}
      </select>

      <input
        type="text"
        placeholder="New room name"
        value={newRoomName}
        onChange={(e) => setNewRoomName(e.target.value)}
      />

      <button onClick={handleAddRoom}>Add Room</button>
      <button onClick={handleRemoveRoom} className="secondary">Remove Room</button>
    </div>
  );
};

export default RoomSelector;
