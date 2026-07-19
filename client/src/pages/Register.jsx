import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="container">
      <div className="panel panel-narrow">
        <h2>Create your QuickRev account</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Full Name</label>
          <input type="text" id="name" name="name" value={form.name} onChange={handleChange} required />

          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" value={form.username} onChange={handleChange} required />

          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" value={form.email} onChange={handleChange} required />

          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" minLength={8} value={form.password} onChange={handleChange} required />

          <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: 24 }}>Sign Up</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 16, color: 'var(--muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--purple-600)', fontWeight: 700 }}>Log in</Link>
        </p>
      </div>
    </div>
  );
}
