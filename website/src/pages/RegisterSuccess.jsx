import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import './Auth.css';

export default function RegisterSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.institute) return <Navigate to="/register" replace />;

  const { name, instId, instIdS } = state.institute;

  const copy = (text) => navigator.clipboard?.writeText(text);

  return (
    <div className="success-shell">
      <div className="success-card">
        <div className="success-icon">✓</div>
        <h2>Registration Successful!</h2>
        <p className="subtitle">
          <strong>{name}</strong> has been successfully registered in SAM.
          Save your Institute IDs — you'll need them to log in and share with faculty.
        </p>

        <div className="id-box">
          <div className="id-row">
            <span className="id-label">Institute ID</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="id-value">{instId}</span>
              <button
                onClick={() => copy(instId)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 13 }}
                title="Copy"
              >⎘</button>
            </div>
          </div>
          <div className="id-row">
            <span className="id-label">Institute ID-S</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="id-value">{instIdS}</span>
              <button
                onClick={() => copy(instIdS)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 13 }}
                title="Copy"
              >⎘</button>
            </div>
          </div>
        </div>

        <p className="success-notice">
          📌 <strong>Institute ID-S</strong> is used by faculty to join your institute via the mobile app. Keep it safe and share it only with your staff.
        </p>

        <button className="btn btn-primary" style={{ width: '100%' }}
          onClick={() => navigate('/login')}>
          Go to Login
        </button>
      </div>
    </div>
  );
}
