import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import TodoForm from './TodoForm';
import TodoItem from './TodoItem';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/todos`);
      setTodos(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (title) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/todos`, { title });
      setTodos([response.data, ...todos]);
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Failed to add todo' };
    }
  };

  const updateTodo = async (id, updates) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/todos/${id}`, updates);
      setTodos(todos.map(todo => todo.id === id ? response.data : todo));
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Failed to update todo' };
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/todos/${id}`);
      setTodos(todos.filter(todo => todo.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Failed to delete todo' };
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="container">
        <div className="todo-container">
          <p>Loading todos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="todo-container">
        <div className="todo-header">
          <h1>My Todos</h1>
          <div>
            <span style={{ marginRight: '15px', color: '#666' }}>Welcome, {user?.email}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <TodoForm onAdd={addTodo} />
        
        {todos.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999', marginTop: '30px' }}>
            No todos yet. Add one above!
          </p>
        ) : (
          <ul className="todo-list">
            {todos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onUpdate={updateTodo}
                onDelete={deleteTodo}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TodoList;