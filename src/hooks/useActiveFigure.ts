import { useEffect, useState } from 'react'
import { type FigureKey, figureKeys } from '../data/content.ts'

// A section takes over the stage once its top edge has passed this share of
// the viewport height.
const TRIGGER_LINE = 0.62

function isFigureKey(value: string | undefined): value is FigureKey {
  return figureKeys.some((key) => key === value)
}

// Follows the scroll position and reports which section's figure is on stage.
export function useActiveFigure(): FigureKey {
  const [active, setActive] = useState<FigureKey>(figureKeys[0])

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      const line = window.innerHeight * TRIGGER_LINE
      let current: FigureKey = figureKeys[0]
      for (const section of document.querySelectorAll<HTMLElement>('[data-figure]')) {
        const key = section.dataset.figure
        if (isFigureKey(key) && section.getBoundingClientRect().top <= line) current = key
      }
      setActive(current)
    }

    const schedule = () => {
      if (frame === 0) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  return active
}
