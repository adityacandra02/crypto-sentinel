import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Insights from './pages/Insights';
import Watchlist from './pages/Watchlist';
import WatchlistInsight from './pages/WatchlistInsight'; 
import Summaries from './pages/Summaries'; // ⬅️ Import this page


function App() {
  return (
    <Router>
      <nav style={{ padding: '1rem', backgroundColor: '#1F2937' }}>
        <Link to="/" style={{ color: '#F9FAFB', marginRight: '1rem' }}>Dashboard</Link>
        <Link to="/insights" style={{ color: '#F9FAFB', marginRight: '1rem' }}>Insights</Link>
        <Link to="/watchlist" style={{ color: '#F9FAFB', marginRight: '1rem' }}>Watchlist</Link>
        <Link to="/watchlist-insight" style={{ color: '#F9FAFB' }}>Watchlist Insight</Link> {/* ⬅️ Add this */}
        <Link to="/summaries" style={{ color: '#F9FAFB', marginLeft: '1rem' }}>Summaries</Link> {/* ⬅️ Add this */}
      </nav>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/watchlist-insight" element={<WatchlistInsight />} />
        <Route path="/summaries" element={<Summaries />} /> 
      </Routes>
    </Router>
  );
}

export default App;
