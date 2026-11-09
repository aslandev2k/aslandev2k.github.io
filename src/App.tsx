import { useCallback, useEffect, useState } from 'react'
import { Awards } from './components/Awards.tsx'
import { CommandPalette } from './components/CommandPalette.tsx'
import { Contact } from './components/Contact.tsx'
import { Experience } from './components/Experience.tsx'
import { Hero } from './components/Hero.tsx'
import { Nav } from './components/Nav.tsx'
import { Skills } from './components/Skills.tsx'
import { Work } from './components/Work.tsx'
import { profile } from './data/content.ts'

const TOAST_DURATION_MS = 2000

export function App() {
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyEmail = useCallback(() => {
    void navigator.clipboard.writeText(profile.email).then(() => setCopied(true))
  }, [])

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), TOAST_DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [copied])

  return (
    <>
      <a className="skip-link" href="#work">
        Skip to work
      </a>
      <Nav onOpenPalette={() => setPaletteOpen(true)} />
      <main>
        <Hero />
        <Work />
        <Experience />
        <Skills />
        <Awards />
        <Contact onCopyEmail={copyEmail} />
      </main>
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} onCopyEmail={copyEmail} />
      <output className="toast" data-visible={copied}>
        {copied ? 'Email copied' : ''}
      </output>
    </>
  )
}
