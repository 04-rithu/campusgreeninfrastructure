import React, { useState, useEffect } from 'react';
import { FaCommentAlt, FaCheck, FaReply, FaSearch, FaDownload } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../api/axios';
import Loader from '../components/Loader';
import Pagination from '../components/Pagination';

const Suggestions = () => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;
    
    const [showModal, setShowModal] = useState(false);
    const [selectedSuggestion, setSelectedSuggestion] = useState(null);
    const [responseBody, setResponseBody] = useState('');
    const [statusBody, setStatusBody] = useState('');

    useEffect(() => {
        fetchSuggestions();
    }, []);

    const fetchSuggestions = async () => {
        try {
            const response = await api.get('/suggestions');
            setSuggestions(response.data);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            toast.error('Failed to load suggestions');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            await api.put(`/suggestions/${id}/status`, { status: newStatus });
            toast.success(`Status updated to ${newStatus}`);
            fetchSuggestions();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleAddResponse = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/suggestions/${selectedSuggestion._id}/response`, { admin_response: responseBody });
            toast.success('Response sent');
            setShowModal(false);
            setResponseBody('');
            fetchSuggestions();
        } catch (error) {
            toast.error('Failed to send response');
        }
    };

    const openResponseModal = (suggestion) => {
        setSelectedSuggestion(suggestion);
        setResponseBody(suggestion.admin_response || '');
        setStatusBody(suggestion.status);
        setShowModal(true);
    };

    const handleExport = async () => {
        try {
            const response = await api.get('/export/suggestions', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `suggestions_export_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            toast.error('Failed to export data');
        }
    };

    if (loading) return <Loader />;

    const filteredSuggestions = suggestions.filter(s => 
        (s.user_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
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
                <h2 style={{ color: 'var(--primary-color)' }}>Suggestion Management</h2>
            </div>

            <div className="card">
                <div className="flex justify-between items-center mb-4">
                    <h3>Incoming Requests</h3>
                    <div className="flex gap-2">
                        <button className="btn btn-outline flex items-center gap-2" onClick={handleExport}>
                            <FaDownload /> Export
                        </button>
                        <div style={{ position: 'relative' }}>
                            <FaSearch style={{ position: 'absolute', left: '10px', top: '12px', color: '#999' }} />
                            <input
                                type="text"
                                placeholder="Search suggestions..."
                                className="form-input"
                                style={{ paddingLeft: '35px', width: '300px' }}
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
                                <th>User</th>
                                <th>Zone</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRecords.length > 0 ? (
                                currentRecords.map((s) => (
                                    <tr key={s._id}>
                                        <td>{new Date(s.date_submitted).toLocaleString()}</td>
                                        <td>{s.user_name}</td>
                                        <td>{s.zone}</td>
                                        <td>{s.suggestion_type}</td>
                                        <td>
                                            <span className={`badge badge-${s.status.toLowerCase()}`}>
                                                {s.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button 
                                                    className="btn btn-sm btn-outline" 
                                                    title="Respond"
                                                    onClick={() => openResponseModal(s)}
                                                >
                                                    <FaReply />
                                                </button>
                                                {s.status !== 'Resolved' && (
                                                    <button 
                                                        className="btn btn-sm btn-success" 
                                                        title="Mark Resolved"
                                                        onClick={() => handleUpdateStatus(s._id, 'Resolved')}
                                                    >
                                                        <FaCheck />
                                                    </button>
                                                )}
                                            </div>
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
                    <div className="modal-content" style={{ maxWidth: '600px' }}>
                        <div className="modal-header">
                            <h3>Respond to Suggestion</h3>
                            <button onClick={() => setShowModal(false)} className="close-btn">&times;</button>
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <p><strong>From:</strong> {selectedSuggestion.user_name}</p>
                            <p><strong>Zone:</strong> {selectedSuggestion.zone}</p>
                            <p><strong>Type:</strong> {selectedSuggestion.suggestion_type}</p>
                            <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                                <strong>Description:</strong>
                                <p style={{ marginTop: '0.5rem' }}>{selectedSuggestion.description}</p>
                            </div>
                        </div>
                        <form onSubmit={handleAddResponse}>
                            <div className="form-group">
                                <label className="form-label">Status</label>
                                <select 
                                    className="form-select"
                                    value={statusBody}
                                    onChange={(e) => {
                                        setStatusBody(e.target.value);
                                        handleUpdateStatus(selectedSuggestion._id, e.target.value);
                                    }}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Assigned">Assigned</option>
                                    <option value="Resolved">Resolved</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Admin Response</label>
                                <textarea
                                    className="form-input"
                                    rows="4"
                                    placeholder="Write your response here..."
                                    value={responseBody}
                                    onChange={(e) => setResponseBody(e.target.value)}
                                    required
                                ></textarea>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Send Response</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Suggestions;
