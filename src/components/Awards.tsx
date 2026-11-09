import { awards } from '../data/content.ts'
import { SectionHeading } from './SectionHeading.tsx'

export function Awards() {
  return (
    <section className="section" id="awards">
      <SectionHeading
        index="04"
        title="Competitive programming"
        note="Algorithm contests, from high school to ICPC. Linked evidence is in Vietnamese."
      />
      <ol className="awards">
        {awards.map((award) => (
          <li key={`${award.year}-${award.contest}`}>
            <span className="award-year">{award.year}</span>
            <span className="award-title">{award.title}</span>
            <span className="award-contest">{award.contest}</span>
            <a href={award.proof.href} target="_blank" rel="noreferrer">
              {award.proof.label}
              <span aria-hidden="true"> ↗</span>
            </a>
          </li>
        ))}
      </ol>
    </section>
  )
}
