import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ otp: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match.');
    if (form.password.length < 8) return setError('Password must be at least 8 characters.');
    // TODO: wire up to backend reset-password endpoint
    setDone(true);
  };

  return (
    <div className="simple-auth-shell">
      <div className="simple-auth-card">
        <span className="brand-mark">SAM</span>

        {!done ? (
          <>
            <h2>Reset Password</h2>
            <p className="subtitle">Enter the OTP sent to your email and choose a new password.</p>

            <form onSubmit={submit} className="simple-auth-form">
              <div className="form-group">
                <label>OTP Code</label>
                <input name="otp" value={form.otp} onChange={handle}
                  placeholder="6-digit code" maxLength={6} required />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input name="password" type="password" value={form.password} onChange={handle}
                  placeholder="Min 8 characters" required />
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handle}
                  placeholder="Repeat new password" required />
              </div>

              {error && <div className="alert alert-error">{error}</div>}

              <div className="simple-auth-actions">
                <Link to="/forgot-password" className="btn btn-secondary">Back</Link>
                <button type="submit" className="btn btn-primary">Reset Password</button>
              </div>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center', paddingTop: 8 }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'var(--green-glow)', border: '2px solid var(--green)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, margin: '0 auto 16px'
            }}>✓</div>
            <h2 style={{ marginBottom: 8 }}>Password Reset!</h2>
            <p className="subtitle">Your password has been changed successfully.</p>
            <button className="btn btn-primary" style={{ width: '100%' }}
              onClick={() => navigate('/login')}>
              Back to Login
            </button>
          </div>
        )}

        <Link to="/login" className="back-link">← Back to Login</Link>
      </div>
    </div>
  );
}
