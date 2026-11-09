import { type KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react'
import { featuredProjects, profile, sections } from '../data/content.ts'

type Command = { id: string; label: string; hint: string; run: () => void }

type CommandPaletteProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCopyEmail: () => void
}

function buildCommands(onCopyEmail: () => void): Command[] {
  const jumpTo = (id: string) => () => document.getElementById(id)?.scrollIntoView()
  const openExternal = (href: string) => () => window.open(href, '_blank', 'noreferrer')

  return [
    ...sections.map((section) => ({
      id: section.id,
      label: section.label,
      hint: 'Section',
      run: jumpTo(section.id),
    })),
    ...featuredProjects.map((project) => ({
      id: project.slug,
      label: project.name,
      hint: 'Project',
      run: jumpTo(project.slug),
    })),
    { id: 'copy-email', label: 'Copy email address', hint: 'Action', run: onCopyEmail },
    {
      id: 'github',
      label: 'Open GitHub profile',
      hint: 'Link',
      run: openExternal(profile.github),
    },
  ]
}

export function CommandPalette({ open, onOpenChange, onCopyEmail }: CommandPaletteProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  const commands = useMemo(() => buildCommands(onCopyEmail), [onCopyEmail])
  const normalizedQuery = query.trim().toLowerCase()
  const results = commands.filter((command) =>
    command.label.toLowerCase().includes(normalizedQuery),
  )

  useEffect(() => {
    function handleShortcut(event: globalThis.KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        onOpenChange(!open)
      }
    }
    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [open, onOpenChange])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      setQuery('')
      setActiveIndex(0)
      dialog.showModal()
    }
    if (!open && dialog.open) dialog.close()
  }, [open])

  function runCommand(command: Command) {
    onOpenChange(false)
    command.run()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (results.length === 0) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((index) => (index + 1) % results.length)
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => (index - 1 + results.length) % results.length)
    }
    if (event.key === 'Enter') {
      event.preventDefault()
      runCommand(results[activeIndex])
    }
  }

  return (
    <dialog
      className="palette"
      ref={dialogRef}
      aria-label="Jump to a section or action"
      onClose={() => onOpenChange(false)}
    >
      <input
        className="palette-input"
        type="text"
        placeholder="Jump to..."
        aria-label="Filter commands"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
          setActiveIndex(0)
        }}
        onKeyDown={handleKeyDown}
      />
      <ul className="palette-list">
        {results.map((command, index) => (
          <li key={command.id}>
            <button
              type="button"
              data-active={index === activeIndex}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => runCommand(command)}
            >
              <span>{command.label}</span>
              <small>{command.hint}</small>
            </button>
          </li>
        ))}
        {results.length === 0 ? <li className="palette-empty">No matches</li> : null}
      </ul>
      <form method="dialog" className="palette-footer">
        <span>Up and down to move, Enter to open</span>
        <button type="submit">Close</button>
      </form>
    </dialog>
  )
}
