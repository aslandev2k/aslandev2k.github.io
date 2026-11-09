import { profile } from '../data/content.ts'

type ContactProps = { onCopyEmail: () => void }

export function Contact({ onCopyEmail }: ContactProps) {
  return (
    <section className="contact" id="contact">
      <p className="section-index">05</p>
      <h2>Hiring for a product team?</h2>
      <a className="contact-email" href={`mailto:${profile.email}`}>
        {profile.email}
      </a>
      <div className="hero-actions">
        <button className="button button-primary" type="button" onClick={onCopyEmail}>
          Copy email
        </button>
        <a className="button" href={profile.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
      </div>
      <footer className="footer">
        <span>{profile.location}</span>
        <a href={profile.repository} target="_blank" rel="noreferrer">
          Built with React and Vite. View source ↗
        </a>
      </footer>
    </section>
  )
}
