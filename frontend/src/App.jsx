import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Insights from './pages/Insights';

function App() {
  return (
    <Router>
      <nav style={{ padding: '1rem', backgroundColor: '#1F2937' }}>
        <Link to="/" style={{ color: '#F9FAFB', marginRight: '1rem' }}>Dashboard</Link>
        <Link to="/insights" style={{ color: '#F9FAFB' }}>Insights</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/insights" element={<Insights />} />
      </Routes>
    </Router>
  );
}

export default App;
