import React from 'react';

const StrainManager = ({
  strainInput,
  onStrainInputChange,
  onDistributeStrains,
  onResetStrainData,
  onExportStrainUsage
}) => {
  return (
    <div className="control-panel">
      <div className="control-group">
        <h3 style={{ width: '100%', marginBottom: '10px' }}>Strains</h3>

        <textarea
          id="strainInput"
          rows="5"
          style={{ width: '100%' }}
          placeholder={`Enter strain names with plant count, e.g.:\nStrain A: 100\nStrain B: 50`}
          value={strainInput}
          onChange={(e) => onStrainInputChange(e.target.value)}
        ></textarea>

        <button onClick={onDistributeStrains} className="distribute-btn">
          Distribute Strains
        </button>

        <button onClick={onResetStrainData} className="secondary reset-btn">
          Reset Strain Data
        </button>

        <button onClick={onExportStrainUsage} className="export-btn">
          Export to Excel
        </button>
      </div>
    </div>
  );
};

export default StrainManager;
