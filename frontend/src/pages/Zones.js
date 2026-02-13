import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaTree } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../api/axios';
import Loader from '../components/Loader';

const Zones = () => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    zoneName: '',
    greenCover: '',
    requiredGreenCover: '',
    waterSource: ''
  });

  useEffect(() => {
    fetchZones();
  }, []);

  const fetchZones = async () => {
    try {
      const response = await api.get('/zones');
      setZones(response.data);
    } catch (error) {
      console.error('Error fetching zones:', error);
      // toast.error('Failed to load zones'); // Uncomment if backend is ready
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Basic validation
      if (!formData.zoneName || !formData.greenCover || !formData.requiredGreenCover) {
        toast.error('Please fill in all required fields');
        return;
      }

      await api.post('/zones', formData);
      toast.success('Zone added successfully!');
      fetchZones(); // Refresh list
      setFormData({
        zoneName: '',
        greenCover: '',
        requiredGreenCover: '',
        waterSource: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add zone');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this zone?')) {
      try {
        await api.delete(`/zones/${id}`);
        toast.success('Zone deleted');
        fetchZones();
      } catch (error) {
        toast.error('Failed to delete zone');
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <FaTree size={24} color="var(--primary-color)" />
        <h2 style={{ color: 'var(--primary-color)' }}>Zone Management</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Add Zone Form */}
        <div className="card" style={{ height: 'fit-content' }}>
          <h3 className="mb-4">Add New Zone</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Zone Name</label>
              <input
                type="text"
                name="zoneName"
                className="form-input"
                value={formData.zoneName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Current Green Cover (%)</label>
              <input
                type="number"
                name="greenCover"
                className="form-input"
                value={formData.greenCover}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Required Green Cover (%)</label>
              <input
                type="number"
                name="requiredGreenCover"
                className="form-input"
                value={formData.requiredGreenCover}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Water Source</label>
              <input
                type="text"
                name="waterSource"
                className="form-input"
                value={formData.waterSource}
                onChange={handleInputChange}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <FaPlus style={{ marginRight: '0.5rem' }} /> Add Zone
            </button>
          </form>
        </div>

        {/* Zones List */}
        <div className="card">
          <h3 className="mb-4">Existing Zones</h3>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Zone Name</th>
                  <th>Green Cover</th>
                  <th>Required</th>
                  <th>Water Source</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {zones.length > 0 ? (
                  zones.map((zone) => (
                    <tr key={zone._id || zone.id}>
                      <td>{zone.zoneName}</td>
                      <td>
                        <span style={{
                          color: zone.greenCover >= zone.requiredGreenCover ? 'var(--primary-color)' : 'var(--danger-color)',
                          fontWeight: 'bold'
                        }}>
                          {zone.greenCover}%
                        </span>
                      </td>
                      <td>{zone.requiredGreenCover}%</td>
                      <td>{zone.waterSource || 'N/A'}</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                          onClick={() => handleDelete(zone._id || zone.id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No zones found. Add one to get started.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Zones;
