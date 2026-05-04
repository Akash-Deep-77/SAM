import { useState, useEffect } from 'react';
import { getSubjects, addSubject, deleteSubject, getClasses, getFacultyRequests } from '../../api';
import './Dashboard.css';

function AddSubjectModal({ onClose, onAdded }) {
  const [form, setForm] = useState({ subjectName: '', subjectCode: '', facultyAssigned: '', classes: [] });
  const [faculties, setFaculties] = useState([]);
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [fc, cl] = await Promise.all([
          getFacultyRequests('Approved'),
          getClasses()
        ]);
        setFaculties(fc.data.data || []);
        setClasses(cl.data.data || []);
      } catch {}
    })();
  }, []);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleClass = (id) => {
    setForm(prev => ({
      ...prev,
      classes: prev.classes.includes(id)
        ? prev.classes.filter(c => c !== id)
        : [...prev.classes, id]
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await addSubject(form);
      onAdded(data.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add subject.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 520 }}>
        <div className="modal-header">
          <h3>Add a new subject</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="form-group">
            <label>1. Subject Name</label>
            <input name="subjectName" value={form.subjectName} onChange={handle}
              placeholder="e.g. Data Structures" required />
          </div>
          <div className="form-group">
            <label>2. Subject Code</label>
            <input name="subjectCode" value={form.subjectCode} onChange={handle}
              placeholder="e.g. CS301" required />
          </div>
          <div className="form-group">
            <label>3. Taught by</label>
            <select name="facultyAssigned" value={form.facultyAssigned} onChange={handle} required>
              <option value="">Select faculty</option>
              {faculties.map(f => (
                <option key={f._id} value={f._id}>{f.name} ({f.facultyIdNumber})</option>
              ))}
            </select>
            {faculties.length === 0 && (
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                No approved faculty yet — faculty data loads once backend is ready
              </span>
            )}
          </div>
          <div className="form-group">
            <label>4. Assigned Class/Section (Optional)</label>
            {classes.length === 0 ? (
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>No classes available</span>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                {classes.map(c => (
                  <label key={c._id} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={form.classes.includes(c._id)}
                      onChange={() => toggleClass(c._id)}
                    />
                    Yr{c.year} · Sem{c.semester} · {c.branch}{c.section ? `-${c.section}` : ''}
                  </label>
                ))}
              </div>
            )}
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><span className="spinner" /> Adding…</> : 'Add Subject'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getSubjects();
        setSubjects(data.data || []);
      } catch {
        setError('Could not load subjects. Backend route may not be ready yet.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this subject?')) return;
    try {
      await deleteSubject(id);
      setSubjects(prev => prev.filter(s => s._id !== id));
    } catch {
      setError('Failed to delete subject.');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <p className="page-tagline">INSTITUTE MANAGEMENT</p>
          <h2>Subjects</h2>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Add Subject
        </button>
      </div>

      {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <span className="spinner" style={{ width: 28, height: 28 }} />
        </div>
      ) : subjects.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📚</span>
          <p>No subjects added yet</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>Add your first subject</button>
        </div>
      ) : (
        <div className="item-grid">
          {subjects.map(s => (
            <div key={s._id} className="item-card">
              <button className="item-card-del" onClick={() => handleDelete(s._id)}>✕</button>
              <div className="item-card-title">{s.subjectName}</div>
              <div className="item-card-sub">
                <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--green)', fontSize: 11, marginBottom: 4 }}>
                  {s.subjectCode}
                </div>
                <div>{s.facultyAssigned?.name || 'Faculty TBD'}</div>
                {s.classes?.length > 0 && <div>{s.classes.length} class(es) assigned</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <AddSubjectModal
          onClose={() => setShowModal(false)}
          onAdded={(sub) => setSubjects(prev => [...prev, sub])}
        />
      )}
    </div>
  );
}
