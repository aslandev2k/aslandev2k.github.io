import { useEffect, useState } from 'react'
import { sections } from '../data/content.ts'

type NavProps = { onOpenPalette: () => void }

export function Nav({ onOpenPalette }: NavProps) {
  const [shortcut, setShortcut] = useState('⌘K')

  useEffect(() => {
    if (!navigator.userAgent.includes('Mac')) setShortcut('Ctrl K')
  }, [])

  return (
    <header className="nav">
      <a className="nav-brand" href="#top" aria-label="Back to top">
        ntd<span>.</span>
      </a>
      <nav aria-label="Sections">
        <ul className="nav-links">
          {sections.map((section) => (
            <li key={section.id}>
              <a href={`#${section.id}`}>{section.label}</a>
            </li>
          ))}
        </ul>
      </nav>
      <button className="nav-command" type="button" onClick={onOpenPalette}>
        <span className="nav-command-label">Jump to</span>
        <kbd>{shortcut}</kbd>
      </button>
    </header>
  )
}
