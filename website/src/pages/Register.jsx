import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerInstitute } from '../api';
import './Auth.css';

const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh'
];

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', representativeName: '', designation: '',
    email: '', address: '', city: '', state: '', password: '', confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match.');
    }
    if (form.password.length < 8) {
      return setError('Password must be at least 8 characters.');
    }
    setLoading(true);
    try {
      const { password, confirmPassword, ...payload } = form;
      const { data } = await registerInstitute({ ...payload, password });
      navigate('/register/success', { state: { institute: data.data } });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-shell">
      <div className="register-card">
        <div className="register-card-header">
          <div className="brand-mark">SAM</div>
          <h1>Create New Account</h1>
          <p>Register your institution to get started</p>
        </div>

        <form onSubmit={submit} className="register-form">
          <div className="form-group">
            <label>Institute Name</label>
            <input name="name" value={form.name} onChange={handle}
              placeholder="e.g. MIT College of Engineering" required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Representative Name</label>
              <input name="representativeName" value={form.representativeName} onChange={handle}
                placeholder="Full name" required />
            </div>
            <div className="form-group">
              <label>Designation</label>
              <input name="designation" value={form.designation} onChange={handle}
                placeholder="e.g. Principal" required />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input name="email" type="email" value={form.email} onChange={handle}
              placeholder="official@institute.edu" required />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input name="address" value={form.address} onChange={handle}
              placeholder="Street address" required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input name="city" value={form.city} onChange={handle}
                placeholder="City" required />
            </div>
            <div className="form-group">
              <label>State</label>
              <select name="state" value={form.state} onChange={handle} required>
                <option value="">Select state</option>
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Password</label>
              <input name="password" type="password" value={form.password} onChange={handle}
                placeholder="Min 8 characters" required />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handle}
                placeholder="Repeat password" required />
            </div>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <div className="register-actions">
            <Link to="/login" className="btn btn-secondary">Back</Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><span className="spinner" /> Registering…</> : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
