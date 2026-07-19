import { useState } from 'react';
import api from '../api.js';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/contact', form);
      setSent(true);
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="container">
      <section style={{ padding: '56px 0 24px', textAlign: 'center' }}>
        <h1>Contact Us</h1>
        <p className="section-sub">Questions, feedback, or bug reports — we'd love to hear from you.</p>
      </section>

      <div className="contact-grid" style={{ marginBottom: 60 }}>
        <div className="panel" style={{ margin: 0 }}>
          <h3>Send a Message</h3>
          {sent && <div className="alert alert-success">Thanks! Your message has been noted — we'll get back to you soon.</div>}
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" value={form.name} onChange={handleChange} required />

            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={form.email} onChange={handleChange} required />

            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" value={form.message} onChange={handleChange} required />

            <button type="submit" className="btn btn-primary" style={{ marginTop: 16 }}>Send Message</button>
          </form>
        </div>

        <div className="panel" style={{ margin: 0 }}>
          <h3>Reach Us Directly</h3>
          <p style={{ color: 'var(--muted)' }}>Project Team · QuickRev</p>
          <p>📧 <a href="mailto:projectteam672736@gmail.com" style={{ color: 'var(--purple-600)', fontWeight: 700 }}>projectteam672736@gmail.com</a></p>
          <p>📞 <a href="tel:+916383874330" style={{ color: 'var(--purple-600)', fontWeight: 700 }}>+91 63838 74330</a></p>
          <p>📞 <a href="tel:+918778034787" style={{ color: 'var(--purple-600)', fontWeight: 700 }}>+91 87780 34787</a></p>
          <hr style={{ border: 'none', borderTop: '1px solid var(--lavender-300)', margin: '20px 0' }} />
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Team: Ajitesh D, Sankar S, Aswin Kumar U, Yuvaraj V</p>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>M.Sc. Software Systems, Coimbatore Institute of Technology</p>
        </div>
      </div>
    </div>
  );
}
