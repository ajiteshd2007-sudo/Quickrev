import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api.js';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [devResetLink, setDevResetLink] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setDevResetLink('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      setSuccess(data.message || 'Password reset link sent to your email.');
      if (data.resetLink) {
        setDevResetLink(data.resetLink);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="panel panel-narrow">
        <h2>Forgot Password</h2>
        <p style={{ color: 'var(--muted)', marginBottom: 20 }}>
          Enter your registered email address and we'll help you reset your password.
        </p>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {devResetLink && (
          <div className="alert alert-success" style={{ border: '2px dashed var(--success)', marginTop: 12, marginBottom: 20 }}>
            <strong>[Development Mode] Reset Link:</strong><br />
            <a href={devResetLink} style={{ textDecoration: 'underline', color: 'var(--purple-700)', wordBreak: 'break-all', display: 'inline-block', marginTop: 8 }}>
              Click here to Reset Password
            </a>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="e.g. name@example.com"
          />

          <button
            type="submit"
            className="btn btn-primary btn-full"
            style={{ marginTop: 24 }}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--muted)' }}>
          Remembered your password? <Link to="/login" style={{ color: 'var(--purple-600)', fontWeight: 700 }}>Log In</Link>
        </p>
      </div>
    </div>
  );
}
