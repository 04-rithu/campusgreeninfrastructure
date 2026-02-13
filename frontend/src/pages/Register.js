import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaLeaf } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await register(name, email, password);
            toast.success('Registration successful! Please login.');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed.');
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
            backgroundColor: 'var(--bg-color)'
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <FaLeaf size={40} color="var(--primary-color)" />
                    <h2 style={{ marginTop: '1rem', color: 'var(--primary-color)' }}>Create Account</h2>
                    <p className="text-gray">Join the Green Infrastructure Planner</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            className="form-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="John Doe"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="user@campus.edu"
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
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '0.75rem' }}
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <p className="text-gray text-sm">
                        Already have an account? <Link to="/" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Login here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
