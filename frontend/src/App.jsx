import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import TaskManager from './components/TaskManager';

// IMPORT TOASTIFY
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
  };

  return (
    <Router>
      {/* GLOBAL TOAST CONTAINER (Dito lalabas ang notifications) */}
      <ToastContainer position="top-right" autoClose={3000} />
      
      <Routes>
        <Route 
          path="/" 
          element={token ? <TaskManager logout={handleLogout} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/login" 
          element={!token ? <Login setToken={setToken} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/register" 
          element={!token ? <Register /> : <Navigate to="/" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;