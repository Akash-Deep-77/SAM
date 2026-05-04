import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ instIdS: '', email: '', password: '' });
  const [useEmail, setUseEmail] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = useEmail
        ? { email: form.email, password: form.password }
        : { instIdS: form.instIdS, password: form.password };
      await login(payload);
      navigate('/dashboard/faculties');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-brand">
        <div className="auth-brand-inner">
          <div className="brand-logo">SAM</div>
          <p className="brand-sub">Systematic Attendance Manager</p>
          <p className="brand-desc">
            Manage your institution's attendance seamlessly. Built for admins, designed for everyone.
          </p>
          <div className="brand-chips">
            <span className="chip">Faculty Management</span>
            <span className="chip">Smart Timetables</span>
            <span className="chip">Real-time Tracking</span>
          </div>
          <a href="#" className="download-app-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z"/><path d="M8 12l4 4 4-4M12 8v8"/></svg>
            Download the app
          </a>
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-card">
          <div className="auth-card-header">
            <h1>Welcome back</h1>
            <p>Sign in to your institute account</p>
          </div>

          <div className="login-toggle">
            <button
              className={!useEmail ? 'active' : ''}
              onClick={() => setUseEmail(false)}
              type="button"
            >Institute ID-S</button>
            <button
              className={useEmail ? 'active' : ''}
              onClick={() => setUseEmail(true)}
              type="button"
            >Email</button>
          </div>

          <form onSubmit={submit} className="auth-form">
            {!useEmail ? (
              <div className="form-group">
                <label>Institute ID-S</label>
                <input
                  name="instIdS"
                  value={form.instIdS}
                  onChange={handle}
                  placeholder="e.g. MIT123456"
                  required
                  autoFocus
                />
              </div>
            ) : (
              <div className="form-group">
                <label>Email Address</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handle}
                  placeholder="institute@example.com"
                  required
                  autoFocus
                />
              </div>
            )}

            <div className="form-group">
              <label>Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handle}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="auth-forgot">
              <Link to="/forgot-password">Forgotten Password?</Link>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
              {loading ? <><span className="spinner" /> Signing in…</> : 'Log In'}
            </button>
          </form>

          <p className="auth-switch">
            New User? <Link to="/register">Create New Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
