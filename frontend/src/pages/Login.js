import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaLeaf } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Login = () => {
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
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
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
          <h2 style={{ marginTop: '1rem', color: 'var(--primary-color)' }}>Welcome Back</h2>
          <p className="text-gray">Sign in to manage your campus green zones</p>
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
              placeholder="admin@campus.edu"
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
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p className="text-gray text-sm">
            Don't have an account? <Link to="/register" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
