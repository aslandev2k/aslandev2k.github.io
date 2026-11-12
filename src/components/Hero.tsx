import { profile } from '../data/content.ts'

export function Hero() {
  return (
    <section className="hero" id="top" data-figure="globe">
      <div className="hero-head">
        <p className="eyebrow">
          {profile.role}
          <span aria-hidden="true"> / </span>
          {profile.location}
        </p>
        <h1 className="hero-name">
          <span>{profile.firstLine}</span>
          <em>{profile.secondLine}</em>
        </h1>
      </div>
      <div className="hero-window" aria-hidden="true" />
      <div className="hero-foot">
        <p className="hero-pitch">{profile.positioning}</p>
        <div className="actions">
          <a className="button button-primary" href={`mailto:${profile.email}`}>
            Email me
          </a>
          <a className="button" href={profile.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <span className="status">{profile.status}</span>
        </div>
        <ul className="hero-facts">
          {profile.facts.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
        <p className="hero-note">{profile.dotNote}</p>
      </div>
    </section>
  )
}
