import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';

function Register() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', full_name: '', age: '', gender: 'Male' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        authAPI.register(formData)
            .then(response => {
                if (response.data.status === "success") {
                    setSuccess("Registration completely successful! Redirecting to login...");
                    setTimeout(() => navigate('/login'), 2000);
                } else {
                    setError(response.data.message || "Registration failed.");
                }
            })
            .catch(err => {
                setError(err.response?.data?.message || "Database entry execution encountered an error.");
            });
    };

    return (
        <div style={{ padding: '3rem 2rem', maxWidth: '450px', margin: '0 auto', background: '#1c1c1c', borderRadius: '8px', marginTop: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
            <h2 style={{ marginBottom: '1.5rem', textAlign: 'center', color: '#00ffff' }}>Create Account</h2>
            {error && <div style={{ background: 'rgba(255,68,68,0.2)', color: '#ff4444', padding: '10px', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.9rem', border: '1px solid #ff4444' }}>{error}</div>}
            {success && <div style={{ background: 'rgba(0,255,255,0.2)', color: '#00ffff', padding: '10px', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.9rem', border: '1px solid #00ffff' }}>{success}</div>}
            
            <form onSubmit={handleRegister}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem', color: '#aaa' }}>Username</label>
                        <input type="text" name="username" required onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #333', background: '#2a2a2a', color: '#fff' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem', color: '#aaa' }}>Full Name</label>
                        <input type="text" name="full_name" required onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #333', background: '#2a2a2a', color: '#fff' }} />
                    </div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem', color: '#aaa' }}>Email Address</label>
                    <input type="email" name="email" required onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #333', background: '#2a2a2a', color: '#fff' }} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem', color: '#aaa' }}>Password</label>
                    <input type="password" name="password" required onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #333', background: '#2a2a2a', color: '#fff' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem', color: '#aaa' }}>Age</label>
                        <input type="number" name="age" required onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #333', background: '#2a2a2a', color: '#fff' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem', color: '#aaa' }}>Gender</label>
                        <select name="gender" onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #333', background: '#2a2a2a', color: '#fff' }}>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>
                <button type="submit" style={{ width: '100%', padding: '12px', background: '#00ffff', color: '#000', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Register System User</button>
            </form>
        </div>
    );
}

export default Register;