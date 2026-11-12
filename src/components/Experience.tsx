import { education, experience } from '../data/content.ts'

export function Experience() {
  return (
    <section className="chapter" id="experience" data-figure="page">
      <div className="panel">
        <p className="chapter-meta">
          <span className="chapter-index">CV</span>
          <span>Where the work happened</span>
        </p>
        <h2>Experience</h2>
        <ol className="roles">
          {experience.map((role) => (
            <li className="role" key={role.company}>
              <p className="role-meta">
                <span>{role.period}</span>
                <span>{role.place}</span>
              </p>
              <h3>
                {role.title} at{' '}
                {role.href ? (
                  <a href={role.href} target="_blank" rel="noreferrer">
                    {role.company}
                  </a>
                ) : (
                  role.company
                )}
              </h3>
              <ul className="lines">
                {role.lines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
        <h3 className="minor-heading">Education</h3>
        <ul className="education">
          {education.map((entry) => (
            <li key={entry.school}>
              <strong>{entry.school}</strong>
              <span className="education-period">{entry.period}</span>
              <span className="education-detail">{entry.detail}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
