import { dotCount, formatCount, profile } from '../data/content.ts'

type ContactProps = { onCopyEmail: () => void }

export function Contact({ onCopyEmail }: ContactProps) {
  return (
    <section className="chapter contact" id="contact" data-figure="envelope">
      <div className="panel">
        <p className="chapter-meta">
          <span className="chapter-index">{profile.status}</span>
          <span>{profile.location}</span>
        </p>
        <h2>Say hello.</h2>
        <a className="contact-mail" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
        <div className="actions">
          <button className="button button-primary" type="button" onClick={onCopyEmail}>
            Copy email
          </button>
          <a className="button" href={profile.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
        <footer className="colophon">
          <p>Every figure on this page is drawn live from the same {formatCount(dotCount)} dots.</p>
          <p>
            Built with React, TypeScript and one canvas.{' '}
            <a href={profile.repository} target="_blank" rel="noreferrer">
              Source on GitHub
              <span aria-hidden="true"> ↗</span>
            </a>
          </p>
        </footer>
      </div>
    </section>
  )
}
