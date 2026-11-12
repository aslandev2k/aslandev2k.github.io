import { useCallback, useEffect, useState } from 'react'
import { Awards } from './components/Awards.tsx'
import { Chapter } from './components/Chapter.tsx'
import { Contact } from './components/Contact.tsx'
import { Experience } from './components/Experience.tsx'
import { Hero } from './components/Hero.tsx'
import { Skills } from './components/Skills.tsx'
import { Stage } from './components/Stage.tsx'
import { TopBar } from './components/TopBar.tsx'
import { profile, projects } from './data/content.ts'
import { useActiveFigure } from './hooks/useActiveFigure.ts'

const TOAST_DURATION_MS = 2000

export function App() {
  const figure = useActiveFigure()
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
      <a className="skip-link" href={`#${projects[0].slug}`}>
        Skip to work
      </a>
      <div className="progress" aria-hidden="true" />
      <TopBar />
      <Stage figure={figure} />
      <main className="rail">
        <Hero />
        {projects.map((project, index) => (
          <Chapter key={project.slug} project={project} index={index} />
        ))}
        <Experience />
        <Skills />
        <Awards />
        <Contact onCopyEmail={copyEmail} />
      </main>
      <output className="toast" data-visible={copied}>
        {copied ? 'Email copied' : ''}
      </output>
    </>
  )
}
