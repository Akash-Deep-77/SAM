import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';

export default function ForgotPassword() {
  const [form, setForm] = useState({ instId: '', email: '' });
  const [submitted, setSubmitted] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    // TODO: wire up to backend forgot-password endpoint
    setSubmitted(true);
  };

  return (
    <div className="simple-auth-shell">
      <div className="simple-auth-card">
        <span className="brand-mark">SAM</span>

        {!submitted ? (
          <>
            <h2>Forgot Password?</h2>
            <p className="subtitle">
              Enter your Institute ID and registered email. We'll send you a reset link.
            </p>

            <form onSubmit={submit} className="simple-auth-form">
              <div className="form-group">
                <label>Institute ID</label>
                <input name="instId" value={form.instId} onChange={handle}
                  placeholder="e.g. MIT1234" required />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input name="email" type="email" value={form.email} onChange={handle}
                  placeholder="registered@institute.edu" required />
              </div>

              <div className="simple-auth-actions">
                <Link to="/login" className="btn btn-secondary">Back</Link>
                <button type="submit" className="btn btn-primary">Send OTP</button>
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
            }}>✉</div>
            <h2 style={{ marginBottom: 8 }}>Check your email</h2>
            <p className="subtitle">
              We've sent a password reset OTP to <strong>{form.email}</strong>.
              Please check your inbox.
            </p>
            <div className="alert alert-success" style={{ marginBottom: 20 }}>
              OTP sent successfully (UI only — backend pending)
            </div>
            <Link to="/reset-password" className="btn btn-primary" style={{ width: '100%', display: 'flex' }}>
              Enter OTP &amp; Reset
            </Link>
          </div>
        )}

        <Link to="/login" className="back-link">
          ← Back to Login
        </Link>
      </div>
    </div>
  );
}
