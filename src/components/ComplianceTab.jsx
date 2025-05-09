import React from 'react';

const ComplianceTab = ({ tasks, auditLog }) => {
  return (
    <div>
      <h3>Compliance Tasks Tab</h3>

      <div style={{ marginBottom: '30px' }}>
        <h4>Tasks</h4>
        {tasks.length > 0 ? (
          <ul>
            {tasks.map((task, idx) => (
              <li key={idx}>
                {task.completed ? '✅' : '⬜'} {task.name} - {task.dueDate}
              </li>
            ))}
          </ul>
        ) : (
          <p>No tasks added yet.</p>
        )}
      </div>

      <div>
        <h4>Audit Log</h4>
        {auditLog.length > 0 ? (
          <ul>
            {auditLog.map((log, idx) => (
              <li key={idx}>
                {new Date(log.timestamp).toLocaleString()} - {log.action}
              </li>
            ))}
          </ul>
        ) : (
          <p>No audit log entries yet.</p>
        )}
      </div>
    </div>
  );
};

export default ComplianceTab;
