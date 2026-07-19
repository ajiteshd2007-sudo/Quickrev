import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api.js';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError('Reset token is missing from the URL.');
      return;
    }

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post('/auth/reset-password', {
        token,
        password: form.password,
      });
      setSuccess(data.message || 'Password has been reset successfully.');
      setForm({ password: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password. The link may have expired or is invalid.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="panel panel-narrow">
        <h2>Reset Password</h2>
        <p style={{ color: 'var(--muted)', marginBottom: 20 }}>
          Please choose a secure new password for your account.
        </p>

        {error && <div className="alert alert-error">{error}</div>}
        {success && (
          <div className="alert alert-success">
            {success}
            <div style={{ marginTop: 12 }}>
              <Link to="/login" className="btn btn-primary btn-full" style={{ display: 'block', textAlign: 'center' }}>
                Go to Login
              </Link>
            </div>
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit}>
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Min 8 characters"
            />

            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Re-enter new password"
            />

            <button
              type="submit"
              className="btn btn-primary btn-full"
              style={{ marginTop: 24 }}
              disabled={loading}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--muted)' }}>
          Back to <Link to="/login" style={{ color: 'var(--purple-600)', fontWeight: 700 }}>Log In</Link>
        </p>
      </div>
    </div>
  );
}
