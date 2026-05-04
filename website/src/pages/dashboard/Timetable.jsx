import { useState, useEffect } from 'react';
import { getTimetable, addTimetableEntry, deleteTimetableEntry, getClasses, getSubjects, getFacultyRequests } from '../../api';
import './Dashboard.css';

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const PERIODS = ['I','II','III','IV','V','VI','VII','VIII'];

function AddLectureModal({ classId, day, period, onClose, onAdded, subjects, faculties }) {
  const [form, setForm] = useState({ startTime: '', endTime: '', subject: '', faculty: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        classId,
        day,
        lecture: {
          order: period,
          startTime: form.startTime,
          endTime: form.endTime,
          details: { subject: form.subject, faculty: form.faculty }
        }
      };
      const { data } = await addTimetableEntry(payload);
      onAdded(data.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add lecture.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>Add Lecture · {day} · Period {period}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="form-group">
              <label>Start Time</label>
              <input name="startTime" value={form.startTime} onChange={handle}
                placeholder="e.g. 09:00 AM" required />
            </div>
            <div className="form-group">
              <label>End Time</label>
              <input name="endTime" value={form.endTime} onChange={handle}
                placeholder="e.g. 10:00 AM" required />
            </div>
          </div>
          <div className="form-group">
            <label>Subject</label>
            <select name="subject" value={form.subject} onChange={handle} required>
              <option value="">Select subject</option>
              {subjects.map(s => <option key={s._id} value={s._id}>{s.subjectName} ({s.subjectCode})</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Faculty</label>
            <select name="faculty" value={form.faculty} onChange={handle} required>
              <option value="">Select faculty</option>
              {faculties.map(f => <option key={f._id} value={f._id}>{f.name}</option>)}
            </select>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><span className="spinner" /> Adding…</> : 'Add Lecture'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Timetable() {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [timetable, setTimetable] = useState([]);   // array of timetable docs
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null);          // { day, period }

  // Load supporting data
  useEffect(() => {
    (async () => {
      try {
        const [cl, sub, fac] = await Promise.all([
          getClasses(),
          getSubjects(),
          getFacultyRequests('Approved')
        ]);
        setClasses(cl.data.data || []);
        setSubjects(sub.data.data || []);
        setFaculties(fac.data.data || []);
      } catch {}
    })();
  }, []);

  // Load timetable when class selected
  useEffect(() => {
    if (!selectedClass) return;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await getTimetable(selectedClass);
        setTimetable(data.data || []);
      } catch {
        setError('Could not load timetable. Backend route may not be ready yet.');
        setTimetable([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedClass]);

  // Build lookup: day -> period -> entry
  const lookup = {};
  timetable.forEach(doc => {
    doc.lectures?.forEach(lec => {
      if (!lookup[doc.day]) lookup[doc.day] = {};
      lookup[doc.day][lec.order] = { ...lec, timetableId: doc._id };
    });
  });

  const handleAdded = (newDoc) => {
    setTimetable(prev => {
      const existing = prev.find(d => d._id === newDoc._id);
      return existing
        ? prev.map(d => d._id === newDoc._id ? newDoc : d)
        : [...prev, newDoc];
    });
  };

  const handleDelete = async (timetableId, period) => {
    if (!confirm('Remove this lecture?')) return;
    try {
      await deleteTimetableEntry(timetableId);
      setTimetable(prev => prev.map(d =>
        d._id === timetableId
          ? { ...d, lectures: d.lectures.filter(l => l.order !== period) }
          : d
      ));
    } catch {
      setError('Failed to remove lecture.');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <p className="page-tagline">INSTITUTE MANAGEMENT</p>
          <h2>Timetable</h2>
        </div>
      </div>

      <div style={{ marginBottom: 22, display: 'flex', alignItems: 'center', gap: 12 }}>
        <select
          value={selectedClass}
          onChange={e => setSelectedClass(e.target.value)}
          style={{
            background: 'var(--bg-elevated)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)', padding: '9px 14px',
            color: 'var(--text-primary)', fontFamily: 'var(--font-body)',
            fontSize: 14, outline: 'none', minWidth: 220
          }}
        >
          <option value="">Select a class to view timetable</option>
          {classes.map(c => (
            <option key={c._id} value={c._id}>
              Year {c.year} · Sem {c.semester} · {c.branch}{c.section ? `-${c.section}` : ''}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}

      {!selectedClass ? (
        <div className="empty-state">
          <span className="empty-icon">🗓️</span>
          <p>Select a class above to view or edit its timetable</p>
        </div>
      ) : loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <span className="spinner" style={{ width: 28, height: 28 }} />
        </div>
      ) : (
        <div className="timetable-wrapper">
          <div className="timetable-grid">
            {/* Header */}
            <div className="timetable-head">
              <div className="tt-head-cell">Period</div>
              {DAYS.map(d => (
                <div key={d} className="tt-head-cell">{d.slice(0,3)}</div>
              ))}
            </div>

            {/* Rows per period */}
            {PERIODS.map(period => (
              <div key={period} className="timetable-row">
                <div className="tt-period-label">{period}</div>
                {DAYS.map(day => {
                  const entry = lookup[day]?.[period];
                  return (
                    <div key={day} className="tt-cell">
                      {entry ? (
                        <div className="tt-entry" style={{ position: 'relative' }}>
                          <div className="tt-entry-subject">
                            {entry.details?.subject?.subjectCode || 'Subject'}
                          </div>
                          <div className="tt-entry-faculty">
                            {entry.details?.faculty?.name || 'Faculty'}
                          </div>
                          <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 2 }}>
                            {entry.startTime}–{entry.endTime}
                          </div>
                          <button
                            onClick={() => handleDelete(entry.timetableId, period)}
                            style={{
                              position: 'absolute', top: 2, right: 2,
                              background: 'none', border: 'none',
                              cursor: 'pointer', color: 'var(--text-muted)',
                              fontSize: 10, padding: '1px 3px', borderRadius: 3
                            }}
                            title="Remove"
                          >✕</button>
                        </div>
                      ) : (
                        <button
                          className="tt-add-btn"
                          title={`Add lecture for ${day} Period ${period}`}
                          onClick={() => setModal({ day, period })}
                        >+</button>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {modal && (
        <AddLectureModal
          classId={selectedClass}
          day={modal.day}
          period={modal.period}
          subjects={subjects}
          faculties={faculties}
          onClose={() => setModal(null)}
          onAdded={handleAdded}
        />
      )}
    </div>
  );
}
