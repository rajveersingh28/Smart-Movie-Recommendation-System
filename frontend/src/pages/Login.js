import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';

function Login({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        authAPI.login({ username, password })
            .then(response => {
                if (response.data.status === "success") {
                    // Lift user state up globally to keep the session alive
                    onLoginSuccess(response.data.user);
                    navigate('/movies');
                } else {
                    setError(response.data.message || "Invalid credentials.");
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Login error:", err);
                setError(err.response?.data?.message || "Connection to authentication server failed.");
                setLoading(false);
            });
    };

    return (
        <div style={{ padding: '4rem 2rem', maxWidth: '400px', margin: '0 auto', background: '#1c1c1c', borderRadius: '8px', marginTop: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
            <h2 style={{ marginBottom: '1.5rem', textAlign: 'center', color: '#00ffff' }}>User Login</h2>
            {error && <div style={{ background: 'rgba(255, 68, 68, 0.2)', color: '#ff4444', padding: '10px', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.9rem', border: '1px solid #ff4444' }}>{error}</div>}
            
            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '1.2rem' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#aaa' }}>Username</label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)}
                        required 
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #333', background: '#2a2a2a', color: '#fff', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#aaa' }}>Password</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #333', background: '#2a2a2a', color: '#fff', boxSizing: 'border-box' }}
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ width: '100%', padding: '12px', background: '#00ffff', color: '#000', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
                >
                    {loading ? 'Authenticating...' : 'Sign In'}
                </button>
            </form>
            <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: '#aaa' }}>
                New to the system? <Link to="/register" style={{ color: '#00ffff', textDecoration: 'none' }}>Create an account here</Link>
            </p>
        </div>
    );
}

export default Login;