import React, { useState, useEffect } from 'react';
import { FaTrash, FaPlus, FaDownload } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../api/axios';
import Loader from '../components/Loader';
import useZones from '../hooks/useZones';
import ActionButtons from '../components/ActionButtons';
import Pagination from '../components/Pagination';
import { useAuth } from '../context/AuthContext';

const Waste = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';
    const [tasks, setTasks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;
    const { zones, loadingZones } = useZones();
    
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const [loadingTasks, setLoadingTasks] = useState(true);
    const [formData, setFormData] = useState({
        zone: '',
        waste_amount: '',
        collection_date: ''
    });
    const [editingTask, setEditingTask] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editFormData, setEditFormData] = useState({
        zone: '',
        waste_amount: '',
        collection_date: ''
    });

    const fetchTasks = async () => {
        try {
            const response = await api.get('/waste');
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching waste tasks:', error);
        } finally {
            setLoadingTasks(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/waste', formData);
            toast.success('Waste collection scheduled!');
            fetchTasks();
            setFormData({
                zone: '',
                waste_amount: '',
                collection_date: ''
            });
        } catch (error) {
            toast.error('Failed to schedule task');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this record?")) {
            try {
                await api.delete(`/waste/${id}`);
                toast.success('Task deleted successfully');
                setTasks(tasks.filter(task => task._id !== id));
            } catch (error) {
                toast.error('Failed to delete task');
            }
        }
    };

    const handleEdit = (task) => {
        setEditingTask(task);
        setEditFormData({
            zone: task.zone,
            waste_amount: task.waste_amount,
            collection_date: new Date(task.collection_date).toISOString().split('T')[0]
        });
        setShowModal(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/waste/${editingTask._id}`, editFormData);
            toast.success('Task updated successfully');
            setShowModal(false);
            setEditingTask(null);
            fetchTasks();
        } catch (error) {
            toast.error('Failed to update task');
        }
    };

    const handleExport = async () => {
        try {
            const response = await api.get('/export/waste', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `waste_export_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            toast.error('Failed to export data');
        }
    };

    if (loadingTasks || loadingZones) return <Loader />;

    const filteredTasks = tasks.filter(task => 
      (task.zone || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredTasks.length / recordsPerPage);
    const currentRecords = filteredTasks.slice(
        (currentPage - 1) * recordsPerPage,
        currentPage * recordsPerPage
    );

    return (
        <div>
            <div className="flex items-center gap-2 mb-4">
                <FaTrash size={24} color="#7b1fa2" />
                <h2 style={{ color: '#7b1fa2' }}>Waste Collection</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                    <div className="card" style={{ height: 'fit-content' }}>
                        <h3 className="mb-4">Schedule Collection</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Select Zone</label>
                                <select
                                    name="zone"
                                    className="form-select"
                                    value={formData.zone}
                                    onChange={handleInputChange}
                                    required
                                    disabled={zones.length === 0}
                                >
                                    <option value="">{zones.length > 0 ? "Select a zone" : "No zones available"}</option>
                                    {zones.map(z => (
                                        <option key={z._id} value={z.zoneName}>{z.zoneName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Amount (e.g., kg, bags)</label>
                                <input
                                    type="text"
                                    name="waste_amount"
                                    className="form-input"
                                    value={formData.waste_amount}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Schedule Date</label>
                                <input
                                    type="date"
                                    name="collection_date"
                                    className="form-input"
                                    value={formData.collection_date}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', backgroundColor: '#7b1fa2' }}>
                                <FaPlus style={{ marginRight: '0.5rem' }} /> Record
                            </button>
                        </form>
                    </div>

                <div className="card">
                    <div className="flex justify-between items-center mb-4">
                        <h3>Collection History</h3>
                        <div className="flex gap-2">
                            {isAdmin && (
                                <button className="btn btn-outline flex items-center gap-2" onClick={handleExport}>
                                    <FaDownload /> Export
                                </button>
                            )}
                            <input
                                type="text"
                                placeholder="Search by Zone..."
                                className="form-input"
                                style={{ width: '250px' }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Zone</th>
                                    <th>Amount</th>
                                    {isAdmin && <th>Audit Info</th>}
                                    {isAdmin && <th>Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {currentRecords.length > 0 ? (
                                    currentRecords.map((task, index) => (
                                        <tr key={task._id || index}>
                                            <td>{new Date(task.collection_date).toLocaleDateString()}</td>
                                            <td>{task.zone}</td>
                                            <td>{task.waste_amount}</td>
                                            {isAdmin && (
                                                <td style={{ fontSize: '0.85rem', color: '#666' }}>
                                                    <div style={{ marginBottom: '2px' }}>Added: <strong>{new Date(task.createdAt).toLocaleString()}</strong></div>
                                                    {task.enteredBy && <div>by {task.enteredBy}</div>}
                                                    {task.editedBy && <div style={{ marginTop: '4px' }}>Edited by <strong>{task.editedBy}</strong> at {new Date(task.updatedAt).toLocaleString()}</div>}
                                                </td>
                                            )}
                                            {isAdmin && (
                                                <td>
                                                    <ActionButtons
                                                        onEdit={() => handleEdit(task)}
                                                        onDelete={() => handleDelete(task._id)}
                                                    />
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={isAdmin ? "5" : "3"} style={{ textAlign: 'center' }}>No waste collection records found.</td>
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
            </div>

            {showModal && isAdmin && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Edit Waste Record</h3>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
                        </div>
                        <form onSubmit={handleUpdate}>
                            <div className="form-group">
                                <label className="form-label">Zone</label>
                                <select
                                    className="form-select"
                                    value={editFormData.zone}
                                    onChange={(e) => setEditFormData({ ...editFormData, zone: e.target.value })}
                                    required
                                >
                                    <option value="">Select Zone</option>
                                    {zones.map(z => (
                                        <option key={z._id} value={z.zoneName}>{z.zoneName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Amount</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={editFormData.waste_amount}
                                    onChange={(e) => setEditFormData({ ...editFormData, waste_amount: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Date</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    value={editFormData.collection_date}
                                    onChange={(e) => setEditFormData({ ...editFormData, collection_date: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Waste;
