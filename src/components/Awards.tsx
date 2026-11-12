import { awards } from '../data/content.ts'

export function Awards() {
  return (
    <section className="chapter" id="awards" data-figure="medals">
      <div className="panel">
        <p className="chapter-meta">
          <span className="chapter-index">{awards.length}</span>
          <span>Algorithm contests, 2016 to 2020</span>
        </p>
        <h2>Competitive programming</h2>
        <ol className="awards">
          {awards.map((award) => (
            <li className="award" key={`${award.year} ${award.title} ${award.contest}`}>
              <span className="award-year">{award.year}</span>
              <strong className="award-title">{award.title}</strong>
              <span className="award-contest">{award.contest}</span>
              {award.proof ? (
                <a className="award-proof" href={award.proof.href} target="_blank" rel="noreferrer">
                  {award.proof.label}
                  <span aria-hidden="true"> ↗</span>
                </a>
              ) : null}
            </li>
          ))}
        </ol>
        <p className="fine-print">Linked evidence is in Vietnamese.</p>
      </div>
    </section>
  )
}
