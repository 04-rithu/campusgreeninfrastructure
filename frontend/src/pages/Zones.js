import React, { useState, useEffect } from 'react';
import { FaPlus, FaTree, FaDownload } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../api/axios';
import Loader from '../components/Loader';
import ActionButtons from '../components/ActionButtons';
import Pagination from '../components/Pagination';

const Zones = ({ viewOnly = false }) => {
  const [zones, setZones] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const [formData, setFormData] = useState({
    zoneName: '',
    currentGreenCover: '',
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
      if (!formData.zoneName || !formData.currentGreenCover || !formData.requiredGreenCover) {
        toast.error('Please fill in all required fields');
        return;
      }

      await api.post('/zones', formData);
      toast.success('Zone added successfully!');
      fetchZones();
      setFormData({
        zoneName: '',
        currentGreenCover: '',
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

  const handleExport = async () => {
    try {
      const response = await api.get('/export/zones', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `zones_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  if (loading) return <Loader />;

  const filteredZones = zones.filter(zone => 
    (zone.zoneName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredZones.length / recordsPerPage);
  const currentRecords = filteredZones.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <FaTree size={24} color="var(--primary-color)" />
        <h2 style={{ color: 'var(--primary-color)' }}>{viewOnly ? 'Campus Green Cover' : 'Zone Management'}</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: viewOnly ? '1fr' : '1fr 2fr', gap: '2rem' }}>
        {!viewOnly && (
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
                  name="currentGreenCover"
                  className="form-input"
                  value={formData.currentGreenCover}
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
        )}

        {/* Zones List */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3>{viewOnly ? 'Campus Zones' : 'Existing Zones'}</h3>
            <div className="flex gap-2">
              {!viewOnly && (
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
                  <th>Zone Name</th>
                  <th>Green Cover</th>
                  <th>Required</th>
                  <th>Water Source</th>
                  {!viewOnly && <th>Added On</th>}
                  {!viewOnly && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {currentRecords.length > 0 ? (
                  currentRecords.map((zone) => (
                    <tr key={zone._id || zone.id}>
                      <td>{zone.zoneName}</td>
                      <td>
                        <span style={{
                          color: zone.currentGreenCover >= zone.requiredGreenCover ? 'var(--primary-color)' : 'var(--danger-color)',
                          fontWeight: 'bold'
                        }}>
                          {zone.currentGreenCover}%
                        </span>
                      </td>
                      <td>{zone.requiredGreenCover}%</td>
                      <td>{zone.waterSource || 'N/A'}</td>
                      {!viewOnly && (
                        <td style={{ fontSize: '0.85rem', color: '#666' }}>
                          {zone.createdAt ? new Date(zone.createdAt).toLocaleString() : 'N/A'}
                        </td>
                      )}
                      {!viewOnly && (
                        <td>
                          <ActionButtons 
                            onDelete={() => handleDelete(zone._id || zone.id)}
                            onEdit={null}
                          />
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={viewOnly ? "4" : "6"} style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No zones found.</td>
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
    </div>
  );
};

export default Zones;
