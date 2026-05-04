import { useState, useEffect } from 'react';
import { getClasses, addClass, deleteClass } from '../../api';
import './Dashboard.css';

function AddClassModal({ onClose, onAdded }) {
  const [form, setForm] = useState({ year: '', semester: '', branch: '', section: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        year: Number(form.year),
        semester: Number(form.semester),
        branch: form.branch,
        section: form.section || undefined,
      };
      const { data } = await addClass(payload);
      onAdded(data.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add class.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>Add a new class</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="form-group">
              <label>Year</label>
              <select name="year" value={form.year} onChange={handle} required>
                <option value="">Select</option>
                {[1,2,3,4].map(y => <option key={y} value={y}>Year {y}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Semester</label>
              <select name="semester" value={form.semester} onChange={handle} required>
                <option value="">Select</option>
                {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Sem {s}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Branch</label>
            <input name="branch" value={form.branch} onChange={handle}
              placeholder="e.g. CSE, IT, MECH" required />
          </div>
          <div className="form-group">
            <label>Section (Optional)</label>
            <input name="section" value={form.section} onChange={handle}
              placeholder="e.g. A, B, C" />
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><span className="spinner" /> Adding…</> : 'Add Class'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getClasses();
        setClasses(data.data || []);
      } catch {
        setError('Could not load classes. Backend route may not be ready yet.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this class?')) return;
    try {
      await deleteClass(id);
      setClasses(prev => prev.filter(c => c._id !== id));
    } catch {
      setError('Failed to delete class.');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <p className="page-tagline">INSTITUTE MANAGEMENT</p>
          <h2>Classes</h2>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Add Class
        </button>
      </div>

      {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <span className="spinner" style={{ width: 28, height: 28 }} />
        </div>
      ) : classes.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🏫</span>
          <p>No classes added yet</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>Add your first class</button>
        </div>
      ) : (
        <div className="item-grid">
          {classes.map(c => (
            <div key={c._id} className="item-card">
              <button className="item-card-del" onClick={() => handleDelete(c._id)}>✕</button>
              <div className="item-card-title">
                Year {c.year} · Sem {c.semester}
              </div>
              <div className="item-card-sub">
                <div>{c.branch}{c.section ? ` — Section ${c.section}` : ''}</div>
                <div style={{ marginTop: 4 }}>{c.studentsEnrolled?.length || 0} students</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <AddClassModal
          onClose={() => setShowModal(false)}
          onAdded={(cls) => setClasses(prev => [...prev, cls])}
        />
      )}
    </div>
  );
}
