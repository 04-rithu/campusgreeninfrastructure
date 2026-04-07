import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaLeaf, FaWater, FaTrash, FaPlus, FaClock, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import api from '../api/axios';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

const UserDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        zones: 0,
        watering: 0,
        waste: 0
    });
    const [recentSuggestions, setRecentSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        zone: '',
        suggestion_type: '',
        description: ''
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [zonesRes, wateringRes, wasteRes, suggestionsRes] = await Promise.all([
                    api.get('/zones'),
                    api.get('/watering'),
                    api.get('/waste'),
                    api.get('/suggestions')
                ]);

                setStats({
                    zones: zonesRes.data.length || 0,
                    watering: wateringRes.data.length || 0,
                    waste: wasteRes.data.length || 0
                });

                setRecentSuggestions((suggestionsRes.data || []).slice(0, 5));
            } catch (error) {
                console.error('Error fetching user dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmitSuggestion = async (e) => {
        e.preventDefault();
        try {
            await api.post('/suggestions', formData);
            toast.success('Suggestion submitted successfully!');
            setShowModal(false);
            setFormData({ zone: '', suggestion_type: '', description: '' });
            // Refresh suggestions
            const res = await api.get('/suggestions');
            setRecentSuggestions((res.data || []).slice(0, 5));
        } catch (error) {
            toast.error('Failed to submit suggestion.');
        }
    };

    if (loading) return <Loader />;

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Resolved': return <FaCheckCircle color="#4caf50" title="Resolved" />;
            case 'Assigned': return <FaClock color="#2196f3" title="Assigned" />;
            default: return <FaExclamationCircle color="#ff9800" title="Pending" />;
        }
    };

    return (
        <div className="dashboard-container">
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ color: 'var(--primary-color)' }}>Welcome, {user?.name}</h1>
                <p className="text-gray">Campus Green Infrastructure - User Portal</p>
            </header>

            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="stat-icon" style={{ backgroundColor: 'rgba(76, 175, 80, 0.1)', color: '#4caf50', padding: '1rem', borderRadius: '12px' }}>
                        <FaLeaf size={24} />
                    </div>
                    <div>
                        <h3 className="text-gray text-sm">Campus Zones</h3>
                        <p className="stat-value" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.zones}</p>
                    </div>
                </div>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="stat-icon" style={{ backgroundColor: 'rgba(33, 150, 243, 0.1)', color: '#2196f3', padding: '1rem', borderRadius: '12px' }}>
                        <FaWater size={24} />
                    </div>
                    <div>
                        <h3 className="text-gray text-sm">Hydration Logs</h3>
                        <p className="stat-value" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.watering}</p>
                    </div>
                </div>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="stat-icon" style={{ backgroundColor: 'rgba(156, 39, 176, 0.1)', color: '#9c27b0', padding: '1rem', borderRadius: '12px' }}>
                        <FaTrash size={24} />
                    </div>
                    <div>
                        <h3 className="text-gray text-sm">Waste Records</h3>
                        <p className="stat-value" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.waste}</p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <section>
                    <div className="card" style={{ height: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem' }}>My Recent Suggestions</h2>
                            <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
                                <FaPlus style={{ marginRight: '0.5rem' }} /> New Suggestion
                            </button>
                        </div>
                        
                        {recentSuggestions.length > 0 ? (
                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Zone</th>
                                            <th>Type</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentSuggestions.map((s) => (
                                            <tr key={s._id}>
                                                <td>{new Date(s.date_submitted).toLocaleDateString()}</td>
                                                <td>{s.zone}</td>
                                                <td>{s.suggestion_type}</td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        {getStatusIcon(s.status)}
                                                        <span>{s.status}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
                                <p>No suggestions submitted yet.</p>
                            </div>
                        )}
                    </div>
                </section>

                <section>
                    <div className="card" style={{ height: 'fit-content', background: 'linear-gradient(135deg, var(--primary-color), var(--primary-light))', color: 'white' }}>
                        <h2 style={{ marginBottom: '1rem', color: 'white' }}>Green Tip</h2>
                        <p style={{ opacity: '0.9', lineHeight: '1.6' }}>
                            Proper mulching helps retain soil moisture and suppresses weeds. Ensure mulch is not touching the tree trunks to prevent rot!
                        </p>
                    </div>
                </section>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Submit New Suggestion</h3>
                            <button onClick={() => setShowModal(false)} className="close-btn">&times;</button>
                        </div>
                        <form onSubmit={handleSubmitSuggestion}>
                            <div className="form-group">
                                <label className="form-label">Zone</label>
                                <input 
                                    type="text" 
                                    name="zone" 
                                    className="form-input" 
                                    placeholder="e.g. North Gate, Main Garden" 
                                    value={formData.zone}
                                    onChange={handleInputChange}
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Suggestion Type</label>
                                <select 
                                    name="suggestion_type" 
                                    className="form-select"
                                    value={formData.suggestion_type}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select Type</option>
                                    <option value="Maintenance Issue">Maintenance Issue</option>
                                    <option value="New Planting">New Planting</option>
                                    <option value="Infrastructure Improvement">Infrastructure Improvement</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea 
                                    name="description" 
                                    className="form-input" 
                                    rows="4" 
                                    placeholder="Describe your suggestion or report an issue..."
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                ></textarea>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
