import React from 'react';

const StrainUsageTab = ({ strainUsage }) => {
  if (!strainUsage || Object.keys(strainUsage).length === 0) {
    return (
      <div>
        <p>No strain usage data available.</p>
      </div>
    );
  }

  return (
    <div id="strainUsageDisplay">
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Strain Name</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Plants Assigned</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(strainUsage).map(([strainName, plantCount]) => (
            <tr key={strainName}>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>{strainName}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>{plantCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StrainUsageTab;
