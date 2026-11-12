import type { Project, ProjectDemo } from '../data/content.ts'
import { BoardDemo } from './BoardDemo.tsx'

const demos: Record<ProjectDemo, () => React.JSX.Element> = {
  board: BoardDemo,
}

type ChapterProps = { project: Project; index: number }

// One project: the text on the rail, while the stage draws its figure.
export function Chapter({ project, index }: ChapterProps) {
  const Demo = project.demo ? demos[project.demo] : null

  return (
    <section className="chapter" id={project.slug} data-figure={project.figure}>
      <div className="panel">
        <p className="chapter-meta">
          <span className="chapter-index">{String(index + 1).padStart(2, '0')}</span>
          <span>{project.kind}</span>
          <span className="chapter-context">{project.context}</span>
        </p>
        <h2>{project.name}</h2>
        <p className="chapter-summary">{project.summary}</p>
        {project.stat ? <p className="chapter-stat">{project.stat}</p> : null}
        <ul className="lines">
          {project.lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        {Demo ? <Demo /> : null}
        <ul className="tags" aria-label="Technologies">
          {project.stack.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
        <p className="links">
          {project.links.map((link) => (
            <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
              {link.label}
              <span aria-hidden="true"> ↗</span>
            </a>
          ))}
        </p>
      </div>
    </section>
  )
}
