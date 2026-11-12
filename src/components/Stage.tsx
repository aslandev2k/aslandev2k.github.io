import { type FigureKey, figureCaptions, figureKeys } from '../data/content.ts'
import { DotField } from '../figure/DotField.tsx'

// The fixed half of the page where the dots live. It is decoration for the
// text beside it, so assistive technology skips it.
export function Stage({ figure }: { figure: FigureKey }) {
  const number = String(figureKeys.indexOf(figure) + 1).padStart(2, '0')

  return (
    <div className="stage" aria-hidden="true">
      <DotField figure={figure} />
      <p className="stage-caption" key={figure}>
        <span>
          Fig. {number} of {figureKeys.length}
        </span>{' '}
        {figureCaptions[figure]}
      </p>
    </div>
  )
}
