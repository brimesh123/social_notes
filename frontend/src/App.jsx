// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import ProfileSearch from './components/ProfileSearch'; // NEW
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = 'https://social-notes-one.vercel.app/login';
  };

  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h2>Social Notes</h2>
          <nav>
            <Link to="/">Dashboard</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/search">Search Profiles</Link> {/* NEW Link */}
            <button onClick={handleLogout}>Logout</button>
          </nav>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/search"  // NEW Route for Profile Search
              element={
                <PrivateRoute>
                  <ProfileSearch />
                </PrivateRoute>
              }
            />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
