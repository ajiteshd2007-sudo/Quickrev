const team = ['Ajitesh D', 'Sankar S', 'Aswin Kumar U', 'Yuvaraj V'];

export default function About() {
  return (
    <div className="container">
      <section style={{ padding: '56px 0 24px', textAlign: 'center' }}>
        <h1>About QuickRev</h1>
        <p className="section-sub">
          We built QuickRev because self-study revision was broken — scattered notes, no feedback loop,
          and no easy way to turn material into practice questions.
        </p>
      </section>

      <div className="panel">
        <h3>Our Mission</h3>
        <p style={{ color: 'var(--muted)' }}>
          QuickRev turns raw study material into an adaptive revision engine. Upload a note, and the platform
          generates practice questions, organizes them by topic, and helps you study smarter with friends —
          instead of studying alone.
        </p>
      </div>

      <section style={{ margin: '48px 0 60px' }}>
        <h2 className="section-title">Project Team</h2>
        <div className="team-grid">
          {team.map((member) => (
            <div className="team-card" key={member}>
              <div className="avatar">{member.charAt(0)}</div>
              <strong>{member}</strong>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
