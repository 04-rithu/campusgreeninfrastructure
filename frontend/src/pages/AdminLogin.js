import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUserShield } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AdminLogin = () => {
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
            if (user && user.role === 'admin') {
                toast.success('Admin Login successful!');
                navigate('/admin/dashboard');
            } else {
                toast.error('Access Denied: Not an Admin');
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
            backgroundColor: '#f0f2f5'
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <FaUserShield size={50} color="#1a73e8" />
                    <h2 style={{ marginTop: '1rem', color: '#202124' }}>Admin Portal</h2>
                    <p style={{ color: '#5f6368' }}>Secure access for system administrators</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Admin Email</label>
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
                        style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1a73e8', borderColor: '#1a73e8' }}
                        disabled={loading}
                    >
                        {loading ? 'Authenticating...' : 'Login as Admin'}
                    </button>
                </form>
                <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                     <Link to="/user/login" style={{ fontSize: '0.9rem', color: '#1a73e8' }}>Switch to User Login</Link>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
