import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api.js';

export default function Friends() {
  const [friends, setFriends] = useState([]);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadFriends = () => api.get('/friends').then((res) => setFriends(res.data.friends));

  useEffect(() => { loadFriends(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const { data } = await api.post('/friends', { username });
      setSuccess(data.message);
      setUsername('');
      loadFriends();
    } catch (err) {
      setError(err.response?.data?.error || 'No user found with that username.');
    }
  };

  return (
    <div className="container">
      <h2 style={{ marginTop: 32 }}>Friends</h2>
      <p className="section-sub" style={{ textAlign: 'left', margin: '0 0 24px' }}>
        Add friends by username to see their topic headings and study together.
      </p>

      <div className="panel">
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label htmlFor="friend_username">Add by Username</label>
            <input type="text" id="friend_username" placeholder="e.g. sankar_s" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginBottom: 2 }}>Add Friend</button>
        </form>
      </div>

      <div className="panel" style={{ marginBottom: 60 }}>
        <h3>Your Friends ({friends.length})</h3>
        {friends.map((f) => (
          <div className="friend-row" key={f.user_id}>
            <div>
              <strong>{f.name}</strong>
              <div className="meta" style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>@{f.username}</div>
            </div>
            <Link to={`/friends/${f.user_id}`} className="btn btn-outline">View Topics</Link>
          </div>
        ))}
        {friends.length === 0 && <p style={{ color: 'var(--muted)' }}>No friends added yet.</p>}
      </div>
    </div>
  );
}
