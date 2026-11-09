import { profile, stats } from '../data/content.ts'

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-main">
        <h1 className="hero-name">
          <span>{profile.firstLine}</span>
          <span>{profile.secondLine}</span>
        </h1>
        <dl className="spec">
          <div>
            <dt>Role</dt>
            <dd>{profile.role}</dd>
          </div>
          <div>
            <dt>Stack</dt>
            <dd>{profile.stack}</dd>
          </div>
          <div>
            <dt>Based in</dt>
            <dd>{profile.location}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd className="spec-status">{profile.status}</dd>
          </div>
        </dl>
      </div>
      <div className="hero-pitch">
        <p>{profile.positioning}</p>
        <div className="hero-actions">
          <a className="button button-primary" href={`mailto:${profile.email}`}>
            Email me
          </a>
          <a className="button" href="#work">
            See the work
          </a>
          <a className="button" href={profile.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </div>
      <ul className="stats">
        {stats.map((stat) => (
          <li key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
