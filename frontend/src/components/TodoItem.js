import React, { useState } from 'react';

const TodoItem = ({ todo, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [loading, setLoading] = useState(false);

  const handleToggleComplete = async () => {
    setLoading(true);
    await onUpdate(todo.id, { completed: !todo.completed });
    setLoading(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditTitle(todo.title);
  };

  const handleUpdate = async () => {
    if (!editTitle.trim()) return;
    
    setLoading(true);
    const result = await onUpdate(todo.id, { title: editTitle });
    if (result.success) {
      setIsEditing(false);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      setLoading(true);
      await onDelete(todo.id);
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleUpdate();
    }
  };

  return (
    <li className="todo-item">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggleComplete}
        disabled={loading}
      />
      
      {isEditing ? (
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onKeyPress={handleKeyPress}
          className="edit-input"
          autoFocus
        />
      ) : (
        <span className={`todo-title ${todo.completed ? 'completed' : ''}`}>
          {todo.title}
        </span>
      )}
      
      {isEditing ? (
        <button onClick={handleUpdate} className="edit-btn" disabled={loading}>
          Save
        </button>
      ) : (
        <button onClick={handleEdit} className="edit-btn" disabled={loading}>
          Edit
        </button>
      )}
      
      <button onClick={handleDelete} className="delete-btn" disabled={loading}>
        Delete
      </button>
    </li>
  );
};

export default TodoItem;