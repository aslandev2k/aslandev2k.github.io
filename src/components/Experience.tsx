import { education, experience } from '../data/content.ts'
import { SectionHeading } from './SectionHeading.tsx'

export function Experience() {
  return (
    <section className="section" id="experience">
      <SectionHeading index="02" title="Experience" />
      <ol className="timeline">
        {experience.map((role) => (
          <li key={role.company}>
            <div className="timeline-meta">
              <span>{role.period}</span>
              <span>{role.place}</span>
            </div>
            <div className="timeline-body">
              <h3>
                {role.title}
                <span className="timeline-at"> at </span>
                {role.href ? (
                  <a href={role.href} target="_blank" rel="noreferrer">
                    {role.company}
                  </a>
                ) : (
                  role.company
                )}
              </h3>
              <ul>
                {role.lines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
      <h3 className="subheading">Education</h3>
      <ul className="education">
        {education.map((entry) => (
          <li key={entry.school}>
            <span className="education-period">{entry.period}</span>
            <span className="education-school">{entry.school}</span>
            <span className="education-detail">{entry.detail}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
