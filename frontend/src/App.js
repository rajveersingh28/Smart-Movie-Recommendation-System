import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Movies from './pages/Movies';
import Login from './pages/Login';
import Register from './pages/Register';
import Watchlist from './pages/Watchlist';
import Recommendations from './pages/Recommendations';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <Router>
      <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#141414', color: '#ffffff', fontFamily: 'sans-serif' }}>
        
        {/* Main Navigation Header */}
        <nav style={{ padding: '1rem 2rem', background: '#1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333' }}>
          <Link to="/" style={{ color: '#00ffff', textDecoration: 'none', fontSize: '1.4rem', fontWeight: 'bold' }}>🎬 SMART MOVIE RECOMMENDATION</Link>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link to="/movies" style={{ color: '#fff', marginLeft: '1.5rem', textDecoration: 'none', fontWeight: '500' }}>Browse Movies</Link>
            
            {currentUser ? (
              <>
                <Link to="/recommendations" style={{ color: '#fff', marginLeft: '1.5rem', textDecoration: 'none' }}>Recommendations</Link>
                <Link to="/watchlist" style={{ color: '#fff', marginLeft: '1.5rem', textDecoration: 'none' }}>My Watchlist</Link>
                <span style={{ marginLeft: '1.5rem', color: '#00ffff', fontSize: '0.95rem', fontWeight: 'bold' }}>👤 {currentUser.full_name}</span>
                <button onClick={handleLogout} style={{ marginLeft: '1.5rem', background: 'transparent', color: '#ff4444', border: '1px solid #ff4444', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" style={{ color: '#fff', marginLeft: '1.5rem', textDecoration: 'none' }}>Login</Link>
                <Link to="/register" style={{ marginLeft: '1.5rem', background: '#00ffff', color: '#000', padding: '6px 12px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' }}>Register</Link>
              </>
            )}
          </div>
        </nav>
        
        {/* Router Viewports */}
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={
              <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Find Your Next Favorite Movie</h1>
                <p style={{ color: '#aaa', fontSize: '1.1rem', marginBottom: '2rem' }}>A Relational Database Driven Smart Recommendation Engine.</p>
                <Link to="/movies" style={{ background: '#00ffff', color: '#000', padding: '12px 24px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' }}>Explore All Movies</Link>
              </div>
            } />
            <Route path="/movies" element={<Movies currentUserId={currentUser?.user_id} />} />
            <Route path="/login" element={<Login onLoginSuccess={setCurrentUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/watchlist" element={<Watchlist userId={currentUser?.user_id} />} />
            <Route path="/recommendations" element={<Recommendations userId={currentUser?.user_id} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer style={{ padding: '1.5rem', background: '#0a0a0a', color: '#555', textAlign: 'center', borderTop: '1px solid #222', fontSize: '0.9rem' }}>
          © 2026 College DBMS Project Submission
        </footer>
      </div>
    </Router>
  );
}

export default App;