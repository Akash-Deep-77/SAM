import { useState, useEffect } from 'react';
import { getFacultyRequests, updateFacultyStatus } from '../../api';
import './Dashboard.css';

const FILTERS = ['Pending', 'Approved', 'Rejected'];

export default function Faculties() {
  const [filter, setFilter] = useState('Pending');
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(null);

  const load = async (status) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await getFacultyRequests(status);
      setFaculty(data.data || []);
    } catch {
      setError('Could not load faculty data. Backend route may not be ready yet.');
      setFaculty([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(filter); }, [filter]);

  const updateStatus = async (facultyId, status) => {
    setProcessing(facultyId);
    try {
      await updateFacultyStatus(facultyId, status);
      setFaculty(prev => prev.filter(f => f._id !== facultyId));
    } catch {
      setError('Failed to update status. Please try again.');
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <p className="page-tagline">INSTITUTE MANAGEMENT</p>
          <h2>Faculties</h2>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div className="filter-tabs">
          {FILTERS.map(f => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >{f}</button>
          ))}
        </div>
      </div>

      {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <span className="spinner" style={{ width: 28, height: 28 }} />
        </div>
      ) : faculty.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">👥</span>
          <p>No {filter.toLowerCase()} faculty requests</p>
        </div>
      ) : (
        <div className="request-list">
          {faculty.map(f => (
            <div key={f._id} className="request-card">
              <div className="request-info">
                <div className="request-name">{f.name}</div>
                <div className="request-meta">
                  <span>🪪 {f.facultyIdNumber}</span>
                  <span>✉ {f.email}</span>
                  <span>⚧ {f.gender}</span>
                </div>
              </div>

              <span className={`badge badge-${filter.toLowerCase()}`}>{filter}</span>

              {filter === 'Pending' && (
                <div className="request-actions">
                  <button
                    className="btn btn-primary"
                    style={{ padding: '7px 14px', fontSize: 12 }}
                    disabled={processing === f._id}
                    onClick={() => updateStatus(f._id, 'Approved')}
                  >
                    {processing === f._id ? <span className="spinner" /> : 'Approve'}
                  </button>
                  <button
                    className="btn btn-danger"
                    style={{ padding: '7px 14px', fontSize: 12 }}
                    disabled={processing === f._id}
                    onClick={() => updateStatus(f._id, 'Rejected')}
                  >Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
