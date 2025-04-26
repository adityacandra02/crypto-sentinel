import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Insights from './pages/Insights';
import Watchlist from './pages/Watchlist';
import WatchlistInsight from './pages/WatchlistInsight';
import Summaries from './pages/Summaries';
import DebugSummaries from './pages/DebugSummaries'; // <-- ✅ New

function App() {
  return (
    <Router>
      <nav style={{ padding: '1rem', backgroundColor: '#1F2937' }}>
        <Link to="/" style={{ color: '#F9FAFB', marginRight: '1rem' }}>Dashboard</Link>
        <Link to="/insights" style={{ color: '#F9FAFB', marginRight: '1rem' }}>Insights</Link>
        <Link to="/watchlist" style={{ color: '#F9FAFB', marginRight: '1rem' }}>Watchlist</Link>
        <Link to="/watchlist-insight" style={{ color: '#F9FAFB', marginRight: '1rem' }}>Watchlist Insight</Link>
        <Link to="/summaries" style={{ color: '#F9FAFB', marginRight: '1rem' }}>Summaries</Link>
        <Link to="/debug-summaries" style={{ color: '#F9FAFB' }}>Debug</Link> {/* ✅ */}
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/watchlist-insight" element={<WatchlistInsight />} />
        <Route path="/summaries" element={<Summaries />} />
        <Route path="/debug-summaries" element={<DebugSummaries />} /> {/* ✅ */}
      </Routes>
    </Router>
  );
}

export default App;
