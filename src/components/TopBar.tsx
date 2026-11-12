import { profile, sections } from '../data/content.ts'

export function TopBar() {
  return (
    <header className="top">
      <a className="brand" href="#top" aria-label="Back to top">
        ntd<span>.</span>
      </a>
      <nav aria-label="Sections">
        <ul className="top-links">
          {sections.map((section) => (
            <li key={section.id}>
              <a href={`#${section.id}`}>{section.label}</a>
            </li>
          ))}
        </ul>
      </nav>
      <a className="top-mail" href={`mailto:${profile.email}`}>
        Email
      </a>
    </header>
  )
}
