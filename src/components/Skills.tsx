import { skillGroups } from '../data/content.ts'

export function Skills() {
  return (
    <section className="chapter" id="skills" data-figure="spiral">
      <div className="panel">
        <p className="chapter-meta">
          <span className="chapter-index">{skillGroups.length}</span>
          <span>Groups of tools, by layer</span>
        </p>
        <h2>Skills</h2>
        <dl className="skills">
          {skillGroups.map((group) => (
            <div className="skill-group" key={group.name}>
              <dt>{group.name}</dt>
              <dd>
                <ul className="tags">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
