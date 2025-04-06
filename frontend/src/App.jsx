// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Insights from './pages/Insights';
import Watchlist from './pages/Watchlist';

function App() {
  return (
    <Router>
      <nav style={{
        padding: '1rem',
        backgroundColor: '#1F2937',
        display: 'flex',
        gap: '1rem',
        fontFamily: 'sans-serif'
      }}>
        <Link to="/" style={{ color: '#F9FAFB', textDecoration: 'none' }}>📊 Dashboard</Link>
        <Link to="/insights" style={{ color: '#F9FAFB', textDecoration: 'none' }}>🧠 Insights</Link>
        <Link to="/watchlist" style={{ color: '#F9FAFB', textDecoration: 'none' }}>🔎 Watchlist</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/watchlist" element={<Watchlist />} />
      </Routes>
    </Router>
  );
}

export default App;
