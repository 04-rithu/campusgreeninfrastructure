import React, { useState, useEffect } from 'react';
import { FaCommentAlt, FaPlus, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../api/axios';
import Loader from '../components/Loader';
import Pagination from '../components/Pagination';

const UserSuggestions = () => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;
    
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        zone: '',
        suggestion_type: '',
        description: ''
    });

    useEffect(() => {
        fetchSuggestions();
    }, []);

    const fetchSuggestions = async () => {
        try {
            const response = await api.get('/suggestions');
            setSuggestions(response.data);
        } catch (error) {
            console.error('Error fetching user suggestions:', error);
            toast.error('Failed to load suggestions');
        } finally {
            setLoading(false);
        }
    };

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
            fetchSuggestions();
            setCurrentPage(1);
        } catch (error) {
            toast.error('Failed to submit suggestion.');
        }
    };

    if (loading) return <Loader />;

    const filteredSuggestions = suggestions.filter(s => 
        (s.zone || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.suggestion_type || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredSuggestions.length / recordsPerPage);
    const currentRecords = filteredSuggestions.slice(
        (currentPage - 1) * recordsPerPage,
        currentPage * recordsPerPage
    );

    return (
        <div>
            <div className="flex items-center gap-2 mb-4">
                <FaCommentAlt size={24} color="var(--primary-color)" />
                <h2 style={{ color: 'var(--primary-color)' }}>My Suggestions</h2>
            </div>

            <div className="card">
                <div className="flex justify-between items-center mb-4">
                    <h3>My Suggestion History</h3>
                    <div className="flex gap-2">
                        <button className="btn btn-primary flex items-center gap-2" onClick={() => setShowModal(true)}>
                            <FaPlus /> New Suggestion
                        </button>
                        <div style={{ position: 'relative' }}>
                            <FaSearch style={{ position: 'absolute', left: '10px', top: '12px', color: '#999' }} />
                            <input
                                type="text"
                                placeholder="Search suggestions..."
                                className="form-input"
                                style={{ paddingLeft: '35px', width: '250px' }}
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            />
                        </div>
                    </div>
                </div>

                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Zone</th>
                                <th>Type</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Admin Response</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRecords.length > 0 ? (
                                currentRecords.map((s) => (
                                    <tr key={s._id}>
                                        <td>{new Date(s.date_submitted).toLocaleString()}</td>
                                        <td>{s.zone}</td>
                                        <td>{s.suggestion_type}</td>
                                        <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={s.description}>
                                            {s.description}
                                        </td>
                                        <td>
                                            <span className={`badge badge-${s.status.toLowerCase()}`}>
                                                {s.status}
                                            </span>
                                        </td>
                                        <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={s.admin_response || 'Pending'}>
                                            {s.admin_response ? s.admin_response : <span className="text-gray text-sm">Pending</span>}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center' }}>No suggestions found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
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

export default UserSuggestions;
