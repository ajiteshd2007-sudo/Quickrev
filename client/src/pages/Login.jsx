import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid username/email or password.');
    }
  };

  return (
    <div className="container">
      <div className="panel panel-narrow">
        <h2>Welcome back</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username or Email</label>
          <input type="text" id="username" name="username" value={form.username} onChange={handleChange} required />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 16, marginBottom: 6 }}>
            <label htmlFor="password" style={{ margin: 0 }}>Password</label>
            <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: 'var(--purple-600)', fontWeight: 700 }}>Forgot Password?</Link>
          </div>
          <input type="password" id="password" name="password" value={form.password} onChange={handleChange} required />

          <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: 24 }}>Log In</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 16, color: 'var(--muted)' }}>
          New to QuickRev? <Link to="/register" style={{ color: 'var(--purple-600)', fontWeight: 700 }}>Sign up free</Link>
        </p>
      </div>
    </div>
  );
}
