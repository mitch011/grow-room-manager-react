import React, { useState, useEffect, useMemo } from 'react';

const PestPressureManager = ({ currentRoom, tables, lightsPerTable, plantsPerLight }) => {
  // Build a single-room structure for the current grow room
  const initialRooms = useMemo(() => [{
    id: currentRoom,
    name: currentRoom,
    tables: Array.from({ length: tables }).map((_, i) => ({
      id: `table${i+1}`,
      name: `Table ${i+1}`,
      pestPressure: 0,
      lightsCount: lightsPerTable[i] || 0
    }))
  }], [currentRoom, tables, lightsPerTable]);

  const [rooms, setRooms] = useState(initialRooms);
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem(`ppm_logs_${currentRoom}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem(`ppm_tasks_${currentRoom}`);
    return saved ? JSON.parse(saved) : [];
  });

  // Persist logs & tasks per room
  useEffect(() => {
    localStorage.setItem(`ppm_logs_${currentRoom}`, JSON.stringify(logs));
  }, [logs, currentRoom]);
  useEffect(() => {
    localStorage.setItem(`ppm_tasks_${currentRoom}`, JSON.stringify(tasks));
  }, [tasks, currentRoom]);

  const handlePressureChange = (tableId, value) => {
    setRooms(rs => rs.map(r => {
      return {
        ...r,
        tables: r.tables.map(t =>
          t.id === tableId ? { ...t, pestPressure: Number(value) } : t
        )
      };
    }));
  };

  const getIPMRecommendations = pressure => {
    if (pressure < 20) return ['No action — monitor weekly', 'Maintain strict hygiene'];
    if (pressure < 50) return ['Deploy sticky traps', 'Introduce predatory mites'];
    if (pressure < 80) return ['Apply biological control', 'Improve airflow & lower humidity'];
    return ['Consider targeted pesticide', 'Rotate active ingredients'];
  };

  const addLog = entry => setLogs(ls => [...ls, { id: Date.now(), date: new Date().toISOString(), ...entry }]);
  const addTask = t => setTasks(ts => [...ts, { id: Date.now(), completed: false, ...t }]);
  const toggleTask = id => setTasks(ts => ts.map(t => t.id === id ? { ...t, completed: !t.completed } : t));

  return (
    <div style={{ padding: 20 }}>
      <h3>Pest Pressure — {currentRoom}</h3>
      {rooms[0].tables.map(table => (
        <div key={table.id} style={{ marginBottom: 12, border: '1px solid #ccc', borderRadius: 4, padding: 8 }}>
          <strong>{table.name}</strong>
          <div style={{ margin: '8px 0' }}>
            <input
              type="number"
              min="0"
              max="100"
              value={table.pestPressure}
              onChange={e => handlePressureChange(table.id, e.target.value)}
              style={{ width: '60px' }}
            /> %
          </div>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {getIPMRecommendations(table.pestPressure).map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </div>
      ))}

      {/* Usage Logger */}
      <section style={{ marginTop: 24 }}>
        <h4>Usage Logger</h4>
        <UsageForm tables={rooms[0].tables} onSubmit={addLog} />
        <UsageTable logs={logs} />
      </section>

      {/* Task Manager */}
      <section style={{ marginTop: 24 }}>
        <h4>Task Manager</h4>
        <TaskForm tables={rooms[0].tables} onSubmit={addTask} />
        <TaskList tasks={tasks} onToggle={toggleTask} />
      </section>
    </div>
  );
};

// Sub-components
const UsageForm = ({ tables, onSubmit }) => {
  const [tableId, setTableId] = useState(tables[0]?.id || '');
  const [item, setItem] = useState('');
  const [qty, setQty] = useState('');
  const [person, setPerson] = useState('');

  const submit = e => {
    e.preventDefault();
    if (!item || !qty || !person) return;
    onSubmit({ tableId, item, qty, person });
    setItem(''); setQty(''); setPerson('');
  };

  return (
    <form onSubmit={submit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <select value={tableId} onChange={e => setTableId(e.target.value)}>
        {tables.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
      </select>
      <input placeholder="Item" value={item} onChange={e => setItem(e.target.value)} />
      <input placeholder="Qty" value={qty} onChange={e => setQty(e.target.value)} />
      <input placeholder="By" value={person} onChange={e => setPerson(e.target.value)} />
      <button type="submit">Log</button>
    </form>
  );
};

const UsageTable = ({ logs }) => (
  <table style={{ width: '100%', marginTop: 8, borderCollapse: 'collapse' }}>
    <thead>
      <tr><th>Date</th><th>Table</th><th>Item</th><th>Qty</th><th>By</th></tr>
    </thead>
    <tbody>
      {logs.map(l => (
        <tr key={l.id}>
          <td>{new Date(l.date).toLocaleString()}</td>
          <td>{l.tableId}</td>
          <td>{l.item}</td>
          <td>{l.qty}</td>
          <td>{l.person}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const TaskForm = ({ tables, onSubmit }) => {
  const [tableId, setTableId] = useState(tables[0]?.id || '');
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState('');

  const submit = e => {
    e.preventDefault();
    if (!desc || !date) return;
    onSubmit({ tableId, description: desc, due: date });
    setDesc(''); setDate('');
  };

  return (
    <form onSubmit={submit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <select value={tableId} onChange={e => setTableId(e.target.value)}>
        {tables.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
      </select>
      <input placeholder="Task" value={desc} onChange={e => setDesc(e.target.value)} />
      <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      <button type="submit">Add</button>
    </form>
  );
};

const TaskList = ({ tasks, onToggle }) => (
  <ul style={{ marginTop: 8, listStyle: 'none', padding: 0 }}>
    {tasks.map(t => (
      <li key={t.id} style={{ marginBottom: 4 }}>
        <label>
          <input type="checkbox" checked={t.completed} onChange={() => onToggle(t.id)} /> <strong style={{ textDecoration: t.completed ? 'line-through' : 'none' }}>{t.description}</strong> <em>({t.tableId}, due {t.due})</em>
        </label>
      </li>
    ))}
  </ul>
);

export default PestPressureManager;
