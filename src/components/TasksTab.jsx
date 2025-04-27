import React, { useState } from 'react';

const TasksTab = ({ tasks, onAddTask, onToggleTaskComplete, onDeleteTask }) => {
  const [newTaskText, setNewTaskText] = useState('');

  const handleAddTask = () => {
    const trimmed = newTaskText.trim();
    if (trimmed !== '') {
      onAddTask(trimmed);
      setNewTaskText('');
    }
  };

  return (
    <div className="tasks-tab">
      <h3>Tasks</h3>

      <div className="control-group">
        <input
          type="text"
          placeholder="New Task..."
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAddTask();
          }}
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>

      {tasks.length === 0 ? (
        <p>No tasks yet. Add some above!</p>
      ) : (
        <ul id="taskList" style={{ marginTop: '10px' }}>
          {tasks.map((task, index) => (
            <li
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid #eee',
                textDecoration: task.completed ? 'line-through' : 'none',
                color: task.completed ? '#888' : '#000'
              }}
            >
              <span
                style={{ cursor: 'pointer' }}
                onClick={() => onToggleTaskComplete(index)}
              >
                {task.text}
              </span>

              <button
                onClick={() => onDeleteTask(index)}
                style={{
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TasksTab;
