import React from 'react';

/**
 * ComplianceTab
 *
 * Props:
 * - tasks (string[]): list of compliance tasks
 * - auditLog ({ timestamp: string, message: string }[]): audit entries
 */
const ComplianceTab = ({ tasks = [], auditLog = [] }) => {
  return (
    <div className="compliance-tab" style={{ padding: 20 }}>
      <h3>Compliance Tasks</h3>
      {tasks.length === 0 ? (
        <p>No compliance tasks available.</p>
      ) : (
        <ul>
          {tasks.map((task, idx) => (
            <li key={idx} style={{ marginBottom: '0.5em' }}>
              <input type="checkbox" checked={false} disabled /> {task}
            </li>
          ))}
        </ul>
      )}

      <h3 style={{ marginTop: 24 }}>Audit Log</h3>
      {auditLog.length === 0 ? (
        <p>No audit log entries.</p>
      ) : (
        <ul>
          {auditLog.map((entry, idx) => (
            <li key={idx} style={{ marginBottom: '0.5em' }}>
              <strong>{new Date(entry.timestamp).toLocaleString()}:</strong> {entry.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ComplianceTab;
