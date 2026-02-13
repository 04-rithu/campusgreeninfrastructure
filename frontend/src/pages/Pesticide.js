import React, { useState, useEffect } from 'react';
import { FaFlask, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../api/axios';
import Loader from '../components/Loader';
import useZones from '../hooks/useZones';
import ActionButtons from '../components/ActionButtons';

const Pesticide = () => {
  const [tasks, setTasks] = useState([]);
  const { zones, loadingZones } = useZones();
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [formData, setFormData] = useState({
    zoneName: '',
    pesticideType: '',
    quantity: '',
    scheduleDate: ''
  });
  const [editingTask, setEditingTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    zoneName: '',
    pesticideType: '',
    quantity: '',
    scheduleDate: ''
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/pesticide');
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching pesticide tasks:', error);
      } finally {
        setLoadingTasks(false);
      }
    };
    fetchTasks();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/pesticide', formData);
      toast.success('Pesticide task scheduled!');
      fetchTasks();
      setFormData({
        zoneName: '',
        pesticideType: '',
        quantity: '',
        scheduleDate: ''
      });
    } catch (error) {
      toast.error('Failed to schedule task');
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await api.get('/pesticide');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching pesticide tasks:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await api.delete(`/pesticide/${id}`);
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
      zoneName: task.zoneName,
      pesticideType: task.pesticideType,
      quantity: task.quantity,
      scheduleDate: new Date(task.scheduleDate).toISOString().split('T')[0]
    });
    setShowModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/pesticide/${editingTask._id}`, editFormData);
      toast.success('Task updated successfully');
      setShowModal(false);
      setEditingTask(null);
      fetchTasks();
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  if (loadingTasks || loadingZones) return <Loader />;

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <FaFlask size={24} color="#7b1fa2" />
        <h2 style={{ color: '#7b1fa2' }}>Pesticide Application</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        <div className="card" style={{ height: 'fit-content' }}>
          <h3 className="mb-4">Record Usage</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Select Zone</label>
              <select
                name="zoneName"
                className="form-select"
                value={formData.zoneName}
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
              <label className="form-label">Pesticide Type</label>
              <input
                type="text"
                name="pesticideType"
                className="form-input"
                value={formData.pesticideType}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Quantity</label>
              <input
                type="text"
                name="quantity"
                className="form-input"
                value={formData.quantity}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Schedule Date</label>
              <input
                type="date"
                name="scheduleDate"
                className="form-input"
                value={formData.scheduleDate}
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
          <h3 className="mb-4">Application History</h3>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Zone</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.length > 0 ? (
                  tasks.map((task, index) => (
                    <tr key={index}>
                      <td>{new Date(task.scheduleDate).toLocaleDateString()}</td>
                      <td>{task.zoneName}</td>
                      <td>{task.pesticideType}</td>
                      <td>{task.quantity}</td>
                      <td>
                        <ActionButtons
                          onEdit={() => handleEdit(task)}
                          onDelete={() => handleDelete(task._id)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center' }}>No records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Pesticide Record</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
            </div>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label className="form-label">Zone</label>
                <select
                  className="form-select"
                  value={editFormData.zoneName}
                  onChange={(e) => setEditFormData({ ...editFormData, zoneName: e.target.value })}
                  required
                >
                  <option value="">Select Zone</option>
                  {zones.map(z => (
                    <option key={z._id} value={z.zoneName}>{z.zoneName}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Pesticide Type</label>
                <input
                  type="text"
                  className="form-input"
                  value={editFormData.pesticideType}
                  onChange={(e) => setEditFormData({ ...editFormData, pesticideType: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Quantity</label>
                <input
                  type="text"
                  className="form-input"
                  value={editFormData.quantity}
                  onChange={(e) => setEditFormData({ ...editFormData, quantity: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={editFormData.scheduleDate}
                  onChange={(e) => setEditFormData({ ...editFormData, scheduleDate: e.target.value })}
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

export default Pesticide;
