import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const features = [
  { icon: '🤖', title: 'AI Question Generator', text: "Paste any passage or note and get exam-style MCQ, short-answer, and flashcard pairs, auto-tagged by difficulty." },
  { icon: '🗂️', title: 'Topic Organization', text: 'Every topic has its own heading and subject, so your material stays structured by course and unit.' },
  { icon: '👥', title: 'Friend-Based Study', text: 'Add friends by username, see their topic headings, and stay accountable together.' },
  { icon: '📊', title: 'Revision Dashboard', text: "Track how many topics and flashcards you've built up, all in a single home screen." },
  { icon: '🔒', title: 'Secure by Design', text: 'JWT auth, hashed passwords, and rate-limited AI endpoints keep your data safe.' },
  { icon: '⚡', title: 'Fast & Simple', text: 'No clutter — add a topic, paste your notes, and get flashcards in seconds.' },
];

export default function Home() {
  const { user } = useAuth();
  return (
    <div className="container">
      <section className="hero">
        <h1>Turn Your Notes Into<br />Smart Flashcards</h1>
        <p>QuickRev uses AI to generate exam-style questions from your notes, tracks the topics you're weak in, and lets you revise with friends — all in one place.</p>
        <div className="hero-actions">
          {user ? (
            <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary">Get Started Free</Link>
              <Link to="/login" className="btn btn-outline">Log In</Link>
            </>
          )}
        </div>
      </section>

      <section id="features">
        <h2 className="section-title">Core Features</h2>
        <p className="section-sub">Everything you need to go from scattered notes to exam-ready mastery.</p>
        <div className="feature-grid">
          {features.map((f) => (
            <div className="feature-card" key={f.title}>
              <div className="icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
