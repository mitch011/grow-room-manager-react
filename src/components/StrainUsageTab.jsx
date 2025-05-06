import React, { useMemo, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';

const StrainUsageTab = ({ strainAssignments, plantsPerLight, strainColors }) => {
  const exportRef = useRef();
  const [exportMode, setExportMode] = useState(false);

  // Determine owner of each light slot
  const slotWinners = useMemo(() => {
    const winners = {};
    Object.entries(strainAssignments).forEach(([key, { chunk }]) => {
      if (!Array.isArray(chunk)) return;
      const counts = {};
      chunk.forEach(name => { if (name) counts[name] = (counts[name] || 0) + 1; });
      const entries = Object.entries(counts);
      if (!entries.length) return;
      let maxCount = -Infinity;
      let winner = null;
      entries.forEach(([strain, cnt]) => {
        if (cnt > maxCount) {
          maxCount = cnt;
          winner = strain;
        }
      });
      if (winner) winners[key] = winner;
    });
    return winners;
  }, [strainAssignments]);

  // Total unique lights used
  const totalUniqueLights = useMemo(
    () => Object.keys(slotWinners).length,
    [slotWinners]
  );

  // Prepare summary and tableData
  const { summary, tableData } = useMemo(() => {
    const strainMap = {};
    Object.entries(strainAssignments).forEach(([key, { chunk }]) => {
      if (!Array.isArray(chunk)) return;
      const [tableIndex] = key.split('-').map(Number);
      const counts = {};
      chunk.forEach(name => { if (name) counts[name] = (counts[name] || 0) + 1; });
      Object.entries(counts).forEach(([strain, cnt]) => {
        if (!strainMap[strain]) strainMap[strain] = { totalPlants: 0, tables: {} };
        strainMap[strain].totalPlants += cnt;
        strainMap[strain].tables[tableIndex] = (strainMap[strain].tables[tableIndex] || 0) + cnt;
      });
    });

    const summaryArr = Object.entries(strainMap).map(([strain, info]) => ({
      strain,
      totalPlants: info.totalPlants,
      tablesSpanned: Object.keys(info.tables).length,
      lightsSpanned: Object.values(slotWinners).filter(w => w === strain).length,
      byTable: Object.entries(info.tables).map(([tbl, cnt]) => ({
        table: `Table ${+tbl + 1}`,
        plants: cnt,
        lights: Math.ceil(cnt / plantsPerLight)
      }))
    }));

    const tableNames = Array.from(new Set(summaryArr.flatMap(r => r.byTable.map(b => b.table))));
    const tableDataArr = tableNames.map(tableName => {
      const row = { table: tableName };
      summaryArr.forEach(r => {
        const tbl = r.byTable.find(b => b.table === tableName);
        row[r.strain] = tbl ? tbl.plants : 0;
      });
      return row;
    });
    return { summary: summaryArr, tableData: tableDataArr };
  }, [strainAssignments, plantsPerLight, slotWinners]);

  // Tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && Array.isArray(payload)) {
      const filtered = payload.filter(p => p.value > 0);
      if (!filtered.length) return null;
      return (
        <div style={{ background: '#fff', border: '1px solid #ccc', padding: 10 }}>
          <p style={{ margin: 0 }}>{label}</p>
          {filtered.map(p => (
            <p key={p.name} style={{ color: strainColors[p.name] }}> {p.name}: {p.value} </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!summary.length) {
    return <div style={{ padding: 20 }}>No strain distribution data to display.</div>;
  }

  // Export handlers
  const exportJSON = () => { /* original JSON export code */ };
  const exportCSV = () => { /* original CSV export code */ };

  const exportImage = () => {
    setExportMode(true);
    setTimeout(() => {
      html2canvas(exportRef.current).then(canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'strain_usage.png';
        link.click();
        setExportMode(false);
      });
    }, 100);
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>Strain Usage</h3>
      <div style={{ margin: '10px 0', padding: '8px', border: '1px solid #ccc', borderRadius: 4 }}>
        <strong>Total Lights Used:</strong> {totalUniqueLights}
      </div>

      <div ref={exportRef}>
        {/* Conditionally render hover info in columns when exporting */}
        {exportMode && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            {tableData.map(row => (
              <div key={row.table} style={{ textAlign: 'center', fontSize: '0.85rem' }}>
                <div>{row.table}</div>
                <div>{Object.entries(row)
                  .filter(([k, v]) => k !== 'table' && v > 0)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join(', ')}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Chart */}
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={tableData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="table" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {summary.map(r => (
                <Bar key={r.strain} dataKey={r.strain} stackId="a" fill={strainColors[r.strain]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Textual Summary Below */}
        {summary.map(r => (
          <div key={r.strain} style={{ marginBottom: 20, display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ display: 'inline-block', width: 16, height: 16, backgroundColor: strainColors[r.strain], borderRadius: '50%', marginRight: 8, marginTop: 4 }} />
            <div>
              <strong>{r.strain}: {r.totalPlants} plants used, spans {r.tablesSpanned} tables, {r.lightsSpanned} lights total</strong>
              <ul style={{ margin: '8px 0 0 0', paddingLeft: 20 }}>
                {r.byTable.map(b => (
                  <li key={b.table}>{b.table}: {b.lights} lights, {b.plants} plants</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20 }}>
        <button onClick={exportJSON}>Make JSON</button>
        <button onClick={exportCSV} style={{ marginLeft: 8 }}>Export CSV</button>
        <button onClick={exportImage} style={{ marginLeft: 8 }}>📥 Export Chart & Data</button>
      </div>
    </div>
  );
};

export default StrainUsageTab;
