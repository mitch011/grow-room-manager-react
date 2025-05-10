import React, { useState, useEffect } from 'react';

export default function Modal({
  isOpen,
  onClose,
  tableIndex,
  lightIndex,
  slot = { chunk: [], plantIds: [] },
  strainColors = {},
  plantsPerLight = 0,
  onSave,
  shouldCloseOnOverlayClick = true,
  shouldCloseOnEsc = true,
}) {
  const [localPlantIds, setLocalPlantIds] = useState([]);

  // Sync slot data when opening
  useEffect(() => {
    if (isOpen) {
      setLocalPlantIds([...slot.plantIds]);
    }
  }, [isOpen, slot.plantIds]);

  // Escape key handling
  useEffect(() => {
    if (!isOpen || !shouldCloseOnEsc) return;
    const handleKey = e => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, shouldCloseOnEsc, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = () => shouldCloseOnOverlayClick && onClose();
  const handleSave = () => {
    onSave(tableIndex, lightIndex, localPlantIds);
    onClose();
  };

  // Inline styles to override any CSS issues
  const chunkArray = Array.isArray(slot.chunk) ? slot.chunk : [];
  const plantIdsArray = Array.isArray(slot.plantIds) ? slot.plantIds : [];

  const backdropStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '16px',
    overflow: 'auto'
  };

  const contentStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    width: '100%',
    maxWidth: '360px',
    boxSizing: 'border-box',
    position: 'relative'
  };

  const gridStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    margin: '12px 0'
  };

  const inputBaseStyle = {
    flex: '0 0 calc(50% - 8px)',
    minWidth: '0',
    padding: '6px',
    border: 'none',
    borderRadius: '4px',
    textAlign: 'center',
    fontSize: '0.9rem',
    color: '#fff',
    boxSizing: 'border-box'
  };

  return (
    <div style={backdropStyle} onClick={handleOverlayClick}>
      <div style={contentStyle} onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 8, right: 8, background: 'transparent', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}
        >×</button>
        <h3 style={{ margin: '0 0 8px' }}>Edit Plant IDs</h3>
        <p style={{ margin: '0 0 12px', fontSize: '0.9rem', color: '#333' }}>
          Table {tableIndex + 1}, Light {lightIndex + 1}
        </p>

        <div style={gridStyle}>
          {Array.from({ length: plantsPerLight }).map((_, i) => {
            const strainEntry = chunkArray[i];
            const style = { ...inputBaseStyle };
            if (Array.isArray(strainEntry) && strainEntry.length === 2) {
              const c1 = strainColors[strainEntry[0]] || '#888';
              const c2 = strainColors[strainEntry[1]] || '#888';
              style.backgroundImage = `linear-gradient(45deg, ${c1} 50%, ${c2} 50%)`;
            } else if (strainEntry) {
              style.backgroundColor = strainColors[strainEntry] || '#888';
            } else {
              style.backgroundColor = '#eee';
              style.color = '#000';
            }
            return (
              <input
                key={i}
                type="text"
                placeholder={`ID ${i + 1}`}
                value={localPlantIds[i] || ''}
                onChange={e => {
                  const updated = [...localPlantIds];
                  updated[i] = e.target.value;
                  setLocalPlantIds(updated);
                }}
                title={slot.plantIds ? slot.plantIds.join(', ') : ''}
                style={style}
              />
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button
            onClick={onClose}
            style={{ padding: '6px 12px', border: 'none', borderRadius: '4px', background: '#ddd', cursor: 'pointer' }}
          >Cancel</button>
          <button
            onClick={handleSave}
            style={{ padding: '6px 12px', border: 'none', borderRadius: '4px', background: '#0070f3', color: '#fff', cursor: 'pointer' }}
          >Save</button>
        </div>
      </div>
    </div>
  );
}
