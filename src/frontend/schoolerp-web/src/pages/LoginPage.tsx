import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { AuthResponse } from '../types';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data } = await api.post<AuthResponse>('/auth/login', { username, password });
            login(data);
            navigate('/students');
        } catch (err) {
            setError('Invalid login credentials');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ padding: '2rem', border: '1px solid #ddd', borderRadius: '8px', width: '300px' }}>
                <h2 style={{ textAlign: 'center' }}>SchoolERP Login</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                        />
                    </div>
                    <button type="submit" style={{ width: '100%', padding: '0.75rem', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
