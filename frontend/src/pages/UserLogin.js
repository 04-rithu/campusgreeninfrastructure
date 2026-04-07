import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';

const UserLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(email, password);
             const user = JSON.parse(localStorage.getItem('user'));
            if (user && user.role === 'user') {
                toast.success('User Login successful!');
                navigate('/user/dashboard');
            } else {
                toast.error('Access Denied: Not a standard user');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#e8f5e9'
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <FaUser size={50} color="#2e7d32" />
                    <h2 style={{ marginTop: '1rem', color: '#2e7d32' }}>User Portal</h2>
                    <p style={{ color: '#5f6368' }}>Access campus environmental data</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '0.75rem', backgroundColor: '#2e7d32', borderColor: '#2e7d32' }}
                        disabled={loading}
                    >
                        {loading ? 'Entering...' : 'Login as User'}
                    </button>
                </form>

            </div>
        </div>
    );
};

export default UserLogin;
