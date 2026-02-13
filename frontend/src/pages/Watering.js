import React, { useState, useEffect } from 'react';
import { FaTint, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../api/axios';
import Loader from '../components/Loader';
import useZones from '../hooks/useZones';
import ActionButtons from '../components/ActionButtons';

const Watering = () => {
  const [tasks, setTasks] = useState([]);
  const { zones, loadingZones } = useZones();
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [formData, setFormData] = useState({
    zoneName: '',
    task: '',
    scheduleDate: '',
    waterAmount: ''
  });
  const [editingTask, setEditingTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    zoneName: '',
    task: '',
    scheduleDate: '',
    waterAmount: ''
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/watering');
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching watering tasks:', error);
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
      await api.post('/watering', formData);
      toast.success('Watering task scheduled!');
      fetchTasks();
      setFormData({
        zoneName: '',
        task: '',
        scheduleDate: '',
        waterAmount: ''
      });
    } catch (error) {
      toast.error('Failed to schedule task');
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await api.get('/watering');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching watering tasks:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await api.delete(`/watering/${id}`);
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
      task: task.task,
      scheduleDate: new Date(task.scheduleDate).toISOString().split('T')[0],
      waterAmount: task.waterAmount
    });
    setShowModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/watering/${editingTask._id}`, editFormData);
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
        <FaTint size={24} color="#0288d1" />
        <h2 style={{ color: '#0288d1' }}>Watering Schedule</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        <div className="card" style={{ height: 'fit-content' }}>
          <h3 className="mb-4">Schedule Watering</h3>
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
              <label className="form-label">Task Description</label>
              <input
                type="text"
                name="task"
                className="form-input"
                value={formData.task}
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
            <div className="form-group">
              <label className="form-label">Water Amount (Liters)</label>
              <input
                type="text"
                name="waterAmount"
                className="form-input"
                value={formData.waterAmount}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', backgroundColor: '#0288d1' }}>
              <FaPlus style={{ marginRight: '0.5rem' }} /> Schedule
            </button>
          </form>
        </div>

        <div className="card">
          <h3 className="mb-4">Upcoming Tasks</h3>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Zone</th>
                  <th>Task</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.length > 0 ? (
                  tasks.map((task, index) => (
                    <tr key={index}>
                      <td>{new Date(task.scheduleDate).toLocaleDateString()}</td>
                      <td>{task.zoneName}</td>
                      <td>{task.task}</td>
                      <td>{task.waterAmount}</td>
                      <td><span className="btn" style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', backgroundColor: '#e1f5fe', color: '#0277bd', cursor: 'default' }}>Scheduled</span></td>
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
                    <td colSpan="6" style={{ textAlign: 'center' }}>No watering tasks scheduled.</td>
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
              <h3>Edit Watering Task</h3>
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
                <label className="form-label">Task Description</label>
                <input
                  type="text"
                  className="form-input"
                  value={editFormData.task}
                  onChange={(e) => setEditFormData({ ...editFormData, task: e.target.value })}
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
              <div className="form-group">
                <label className="form-label">Water Amount</label>
                <input
                  type="text"
                  className="form-input"
                  value={editFormData.waterAmount}
                  onChange={(e) => setEditFormData({ ...editFormData, waterAmount: e.target.value })}
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

export default Watering;
