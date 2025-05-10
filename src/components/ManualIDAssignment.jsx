// src/components/ManualIDAssignment.jsx

import React, { useState, useEffect, useMemo } from 'react';

/**
 * ManualIDAssignment
 *
 * Props:
 * - tables (number)
 * - lightsPerTable (number[])
 * - plantsPerLight (number)
 * - strainAssignments (object)
 * - availableIDsByStrain (object): { [strain]: maxAvailable }
 * - onAssign(tableIdx, lightIdx, plantIds)
 * - onLoadStrainIDs(strain, ids[]) (optional)
 */
const ManualIDAssignment = ({
  tables,
  lightsPerTable,
  plantsPerLight,
  strainAssignments,
  availableIDsByStrain = {},
  onAssign,
  onLoadStrainIDs = (s, ids) => console.log('Loaded strain IDs', s, ids),
}) => {
  // Slot-level state
  const [tableIdx, setTableIdx] = useState(0);
  const [lightIdx, setLightIdx] = useState(0);
  const [assignMode, setAssignMode] = useState('twoRows'); // 'twoRows' or 'fullTable'
  const [rowGroup, setRowGroup] = useState('first');       // 'first' or 'second'
  const [inputIDs, setInputIDs] = useState([]);

  // Batch input UI state for slot
  const [showBatchInput, setShowBatchInput] = useState(false);
  const [batchText, setBatchText] = useState('');

  // Strain-level batch state
  const strainList = Object.keys(availableIDsByStrain);
  const [selectedStrain, setSelectedStrain] = useState(strainList[0] || '');
  const [showStrainBatchInput, setShowStrainBatchInput] = useState(false);
  const [strainBatchText, setStrainBatchText] = useState('');

  const perGroup = Math.ceil(plantsPerLight / 2);
  const maxCount = assignMode === 'twoRows' ? perGroup : plantsPerLight;

  // Initialize inputIDs whenever slot or mode changes
  useEffect(() => {
    setInputIDs(Array(maxCount).fill(''));
  }, [assignMode, tableIdx, lightIdx, maxCount]);

  // Helper to count non-empty entries
  const countMap = arr =>
    arr.reduce((acc, v) => {
      if (!v) return acc;
      acc[v] = (acc[v] || 0) + 1;
      return acc;
    }, {});

  // Guidance counts for the selected light’s chunk
  const { firstCounts, secondCounts } = useMemo(() => {
    const chunk = strainAssignments?.[`${tableIdx}-${lightIdx}`]?.chunk || [];
    return {
      firstCounts: countMap(chunk.slice(0, perGroup)),
      secondCounts: countMap(chunk.slice(perGroup)),
    };
  }, [strainAssignments, tableIdx, lightIdx, perGroup]);

  // Collect IDs used elsewhere to prevent duplicates
  const existingOthers = useMemo(() => {
    const all = [];
    Object.entries(strainAssignments).forEach(([key, slot]) => {
      if (key === `${tableIdx}-${lightIdx}`) return;
      (slot.plantIds || []).forEach(id => id && all.push(id));
    });
    return new Set(all);
  }, [strainAssignments, tableIdx, lightIdx]);

  // Validate inputs: non-empty, unique, not used elsewhere
  const { validFlags, allValid } = useMemo(() => {
    const flags = inputIDs.map(id => Boolean(id) && !existingOthers.has(id));
    const unique = new Set(inputIDs.filter(Boolean)).size === inputIDs.filter(Boolean).length;
    return { validFlags: flags, allValid: flags.every(Boolean) && unique };
  }, [inputIDs, existingOthers]);

  const filledCount = inputIDs.filter(id => id).length;

  const handleIDChange = (idx, val) => {
    setInputIDs(prev => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
  };

  // Load batch IDs into the slot inputs
  const loadBatch = () => {
    const lines = batchText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (lines.length > maxCount) {
      alert(`Only first ${maxCount} IDs will be used.`);
    }
    const limited = lines.slice(0, maxCount);
    const padded = [...limited, ...Array(maxCount - limited.length).fill('')];
    setInputIDs(padded);
    setShowBatchInput(false);
    setBatchText('');
  };

  // Load batch at strain level
  const loadStrainBatch = () => {
    const maxStrain = availableIDsByStrain[selectedStrain] || 0;
    const lines = strainBatchText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (lines.length > maxStrain) {
      alert(`Only first ${maxStrain} IDs will be used for ${selectedStrain}.`);
    }
    const limited = lines.slice(0, maxStrain);
    onLoadStrainIDs(selectedStrain, limited);
    setShowStrainBatchInput(false);
    setStrainBatchText('');
  };

  // Commit the assignment to parent
  const handleAssign = () => {
    if (!allValid) return;
    const key = `${tableIdx}-${lightIdx}`;
    const existing = strainAssignments[key]?.plantIds || Array(plantsPerLight).fill('');
    const newPlantIds = [...existing];
    const start = assignMode === 'twoRows' && rowGroup === 'second' ? perGroup : 0;
    inputIDs.forEach((id, i) => {
      if (start + i < newPlantIds.length) newPlantIds[start + i] = id;
    });
    onAssign(tableIdx, lightIdx, newPlantIds);
  };

  return (
    <div style={{ padding: 16, border: '1px solid #ddd', borderRadius: 8 }}>
      <h4>Manual ID Assignment</h4>

      {/* Strain-level batch input */}
      {strainList.length > 0 && (
        <div style={{ margin: '8px 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <label>
            Strain:{' '}
            <select value={selectedStrain} onChange={e => setSelectedStrain(e.target.value)}>
              {strainList.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
          <button onClick={() => setShowStrainBatchInput(true)}>
            Batch Strain IDs (max {availableIDsByStrain[selectedStrain] || 0})
          </button>
        </div>
      )}

      {/* Table & Light selectors */}
      <div style={{ display: 'flex', gap: '1rem' }}>
        <label>
          Table:{' '}
          <select value={tableIdx} onChange={e => setTableIdx(+e.target.value)}>
            {Array.from({ length: tables }).map((_, i) => (
              <option key={i} value={i}>Table {i + 1}</option>
            ))}
          </select>
        </label>
        <label>
          Light:{' '}
          <select value={lightIdx} onChange={e => setLightIdx(+e.target.value)}>
            {Array.from({ length: lightsPerTable[tableIdx] || 0 }).map((_, i) => (
              <option key={i} value={i}>Light {i + 1}</option>
            ))}
          </select>
        </label>
      </div>

      {/* Mode selection */}
      <div style={{ marginTop: 12 }}>
        <label>
          <input
            type="radio"
            name="mode"
            value="twoRows"
            checked={assignMode === 'twoRows'}
            onChange={() => setAssignMode('twoRows')}
          />{' '}
          Two Rows
        </label>
        <label style={{ marginLeft: 16 }}>
          <input
            type="radio"
            name="mode"
            value="fullTable"
            checked={assignMode === 'fullTable'}
            onChange={() => setAssignMode('fullTable')}
          />{' '}
          Full Slot
        </label>
      </div>

      {/* Row group selector */}
      {assignMode === 'twoRows' && (
        <div style={{ margin: '8px 0' }}>
          <label>
            <input
              type="radio"
              name="group"
              value="first"
              checked={rowGroup === 'first'}
              onChange={() => setRowGroup('first')}
            />{' '}
            Rows 1–{perGroup}
          </label>
          <label style={{ marginLeft: 16 }}>
            <input
              type="radio"
              name="group"
              value="second"
              checked={rowGroup === 'second'}
              onChange={() => setRowGroup('second')}
            />{' '}
            Rows {perGroup + 1}–{plantsPerLight}
          </label>
        </div>
      )}

      {/* Auto-split guidance */}
      {assignMode === 'twoRows' && (
        <div style={{ marginBottom: 12, padding: 8, background: '#fafafa', borderRadius: 4 }}>
          <strong>Suggested:</strong>{' '}
          1–{perGroup}: {Object.entries(firstCounts).map(([s, c]) => `${c}×${s}`).join(', ') || 'None'};{' '}
          {perGroup + 1}–{plantsPerLight}: {Object.entries(secondCounts).map(([s, c]) => `${c}×${s}`).join(', ') || 'None'}
        </div>
      )}

      {/* Progress & batch */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: 8 }}>
        <div>
          {filledCount}/{maxCount} IDs
        </div>
        <button onClick={() => setShowBatchInput(true)}>Batch Input</button>
      </div>

      {/* Batch modals */}
      {showBatchInput && (
        <div style={{ position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.3)', display:'flex', justifyContent:'center', alignItems:'center' }}>
          <div style={{ background:'#fff', padding:16, borderRadius:8, width:'80%', maxWidth:400 }}>
            <h4>Batch Slot Input (max {maxCount})</h4>
            <textarea
              value={batchText}
              onChange={e => setBatchText(e.target.value)}
              rows={8}
              style={{ width:'100%' }}
              placeholder="Scan or paste one ID per line"
            />
            <div style={{ marginTop:8, textAlign:'right' }}>
              <button onClick={() => setShowBatchInput(false)}>Cancel</button>
              <button onClick={loadBatch} style={{ marginLeft:8 }}>Load</button>
            </div>
          </div>
        </div>
      )}

      {showStrainBatchInput && (
        <div style={{ position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.3)', display:'flex', justifyContent:'center', alignItems:'center' }}>
          <div style={{ background:'#fff', padding:16, borderRadius:8, width:'80%', maxWidth:400 }}>
            <h4>Batch Strain IDs (max {availableIDsByStrain[selectedStrain] || 0})</h4>
            <textarea
              value={strainBatchText}
              onChange={e => setStrainBatchText(e.target.value)}
              rows={8}
              style={{ width:'100%' }}
              placeholder="Scan or paste one ID per line"
            />
            <div style={{ marginTop:8, textAlign:'right' }}>
              <button onClick={() => setShowStrainBatchInput(false)}>Cancel</button>
              <button onClick={loadStrainBatch} style={{ marginLeft:8 }}>Load</button>
            </div>
          </div>
        </div>
      )}

      {/* ID inputs */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
        {inputIDs.map((id, idx) => (
          <input
            key={idx}
            value={id}
            onChange={e => handleIDChange(idx, e.target.value)}
            placeholder={`ID ${idx + 1}`}
            style={{
              width: 60,
              padding: '4px 6px',
              border: validFlags[idx] ? '1px solid green' : '1px solid red'
            }}
          />
        ))}
      </div>

      <button
        onClick={handleAssign}
        disabled={!allValid}
        style={{ marginTop: 12 }}
      >
        Assign IDs
      </button>
    </div>
  );
};

export default ManualIDAssignment;
