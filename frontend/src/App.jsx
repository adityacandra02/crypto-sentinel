import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';

function App() {
  const navStyle = {
    display: 'flex',
    gap: '1rem',
    backgroundColor: '#1F2937',
    padding: '1rem 2rem',
    fontSize: '1rem'
  };

  const linkStyle = {
    color: '#D1D5DB',
    textDecoration: 'none',
    paddingBottom: '4px',
    borderBottom: '2px solid transparent'
  };

  const activeStyle = {
    color: '#FFFFFF',
    borderBottom: '2px solid #3B82F6'
  };

  return (
    <Router>
      <nav style={navStyle}>
        <NavLink to="/" end style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>
          Dashboard
        </NavLink>
        <NavLink to="/insights" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>
          Insights
        </NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
       </Routes>
    </Router>
  );
}

export default App;
