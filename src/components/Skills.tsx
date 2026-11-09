import { skillGroups } from '../data/content.ts'
import { SectionHeading } from './SectionHeading.tsx'

export function Skills() {
  return (
    <section className="section" id="skills">
      <SectionHeading index="03" title="Skills" />
      <dl className="skills">
        {skillGroups.map((group) => (
          <div key={group.name}>
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
    </section>
  )
}
