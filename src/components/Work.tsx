import {
  compactProject,
  featuredProjects,
  type Project,
  type ProjectVisual,
  publicSectorProjects,
} from '../data/content.ts'
import { BoardDemo } from './BoardDemo.tsx'
import { ContractTree } from './ContractTree.tsx'
import { SectionHeading } from './SectionHeading.tsx'

const visuals: Record<ProjectVisual, () => React.JSX.Element> = {
  board: BoardDemo,
  contract: ContractTree,
}

function ProjectBody({ project }: { project: Project }) {
  return (
    <div className="project-body">
      <p className="project-kind">{project.kind}</p>
      <h3>{project.name}</h3>
      <p className="project-summary">{project.summary}</p>
      {project.stat ? <p className="project-stat">{project.stat}</p> : null}
      <ul className="project-lines">
        {project.lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <ul className="tags" aria-label="Technologies">
        {project.stack.map((tech) => (
          <li key={tech}>{tech}</li>
        ))}
      </ul>
      <p className="project-links">
        {project.links.map((link) => (
          <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
            {link.label}
            <span aria-hidden="true"> ↗</span>
          </a>
        ))}
      </p>
    </div>
  )
}

function FeaturedProject({ project }: { project: Project }) {
  const Visual = project.visual ? visuals[project.visual] : null

  return (
    <article className="project project-featured" id={project.slug}>
      <ProjectBody project={project} />
      {Visual ? (
        <div className="project-visual">
          <Visual />
        </div>
      ) : null}
    </article>
  )
}

export function Work() {
  return (
    <section className="section" id="work">
      <SectionHeading
        index="01"
        title="Selected work"
        note="Products people use, and what was built for them."
      />
      {featuredProjects.map((project) => (
        <FeaturedProject key={project.slug} project={project} />
      ))}
      <div className="project-pair">
        {publicSectorProjects.map((project) => (
          <article className="project" id={project.slug} key={project.slug}>
            <ProjectBody project={project} />
          </article>
        ))}
      </div>
      <article className="project project-compact" id={compactProject.slug}>
        <ProjectBody project={compactProject} />
      </article>
    </section>
  )
}
