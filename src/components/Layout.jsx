import React from 'react';

const Layout = ({
  tables,
  lightsPerTable,
  strainAssignments,
  onLightClick
}) => {
  return (
    <div className="layout-container">
      {Array.from({ length: tables }, (_, tableIndex) => (
        <div className="table-container" key={tableIndex}>
          <div className="table-header">
            <label>Table {tableIndex + 1} Lights:</label>
            <input
              type="number"
              value={lightsPerTable}
              min="1"
              readOnly
              disabled
            />
          </div>

          <div className="table" data-table-index={tableIndex}>
            {Array.from({ length: lightsPerTable }, (_, lightIndex) => (
              <div
                key={lightIndex}
                className="light"
                data-light-index={lightIndex}
                style={{
                  backgroundColor:
                    strainAssignments?.[`${tableIndex}-${lightIndex}`]?.color || '',
                }}
                onClick={() => onLightClick(tableIndex, lightIndex)}
              >
                {strainAssignments?.[`${tableIndex}-${lightIndex}`]?.strainName || ''}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Layout;
