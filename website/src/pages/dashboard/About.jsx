import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getInstituteProfile } from '../../api';
import './Dashboard.css';

export default function About() {
  const { institute: cached } = useAuth();
  const [inst, setInst] = useState(cached);
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    if (cached) return;
    (async () => {
      try {
        const { data } = await getInstituteProfile();
        setInst(data.data);
      } catch {
        setInst(cached);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const copy = (text) => navigator.clipboard?.writeText(text);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
      <span className="spinner" style={{ width: 28, height: 28 }} />
    </div>
  );

  if (!inst) return (
    <div className="empty-state">
      <span className="empty-icon">ℹ️</span>
      <p>Could not load institute information</p>
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <p className="page-tagline">INSTITUTE MANAGEMENT</p>
          <h2>About</h2>
        </div>
      </div>

      {/* Stats row */}
      <div className="about-grid">
        <div className="about-stat-card">
          <div className="about-stat-label">Total Classes</div>
          <div className="about-stat-value green">
            {inst.classes?.length ?? '—'}
          </div>
        </div>
        <div className="about-stat-card">
          <div className="about-stat-label">Registered Faculties</div>
          <div className="about-stat-value purple">
            {inst.faculty?.length ?? '—'}
          </div>
        </div>
        <div className="about-stat-card">
          <div className="about-stat-label">Institute ID</div>
          <div className="about-stat-value" style={{ fontSize: 16 }}>
            {inst.instId || '—'}
          </div>
        </div>
        <div className="about-stat-card">
          <div className="about-stat-label">Institute ID-S</div>
          <div className="about-stat-value" style={{ fontSize: 16 }}>
            {inst.instIdS || '—'}
          </div>
        </div>
      </div>

      {/* Detail card */}
      <div className="about-detail-card">
        <h3>Institute Details</h3>

        <div className="about-detail-row">
          <span className="about-detail-label">Institute Name</span>
          <span className="about-detail-value">{inst.name?.toUpperCase()}</span>
        </div>
        <div className="about-detail-row">
          <span className="about-detail-label">Representative</span>
          <span className="about-detail-value" style={{ textTransform: 'capitalize' }}>
            {inst.representativeName}
          </span>
        </div>
        <div className="about-detail-row">
          <span className="about-detail-label">Designation</span>
          <span className="about-detail-value" style={{ textTransform: 'capitalize' }}>
            {inst.designation}
          </span>
        </div>
        <div className="about-detail-row">
          <span className="about-detail-label">Email</span>
          <span className="about-detail-value">{inst.email}</span>
        </div>
        <div className="about-detail-row">
          <span className="about-detail-label">Address</span>
          <span className="about-detail-value">{inst.address}, {inst.city}, {inst.state}</span>
        </div>
        <div className="about-detail-row">
          <span className="about-detail-label">Institute ID</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="about-detail-value mono">{inst.instId}</span>
            <button
              onClick={() => copy(inst.instId)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 14 }}
              title="Copy"
            >⎘</button>
          </div>
        </div>
        <div className="about-detail-row">
          <span className="about-detail-label">Institute ID-S</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="about-detail-value mono">{inst.instIdS}</span>
            <button
              onClick={() => copy(inst.instIdS)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 14 }}
              title="Copy"
            >⎘</button>
          </div>
        </div>
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 16, lineHeight: 1.6 }}>
        📌 Share <strong>Institute ID-S</strong> with faculty members so they can join your institute via the SAM mobile app.
      </p>
    </div>
  );
}
