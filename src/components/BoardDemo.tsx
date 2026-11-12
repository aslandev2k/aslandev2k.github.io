import { type ChangeEvent, type UIEvent, useEffect, useRef, useState } from 'react'

// A working miniature of two techniques from Product Go, written for this
// site: only the columns on screen exist in the DOM, and a card move shows at
// once while its save runs in the background, rolling back if the save fails.

const TOTAL_CARDS = 1000
const CARDS_PER_COLUMN = 4
const COLUMN_WIDTH = 128
// Enough columns to cover the widest layout of the board.
const VISIBLE_COLUMNS = 6
const OVERSCAN_COLUMNS = 1
const SAVE_DELAY_MS = 900

const TOTAL_COLUMNS = TOTAL_CARDS / CARDS_PER_COLUMN
const STATUSES = ['todo', 'doing', 'review', 'done'] as const

type Status = (typeof STATUSES)[number]

function cardLabel(card: number): string {
  return `#${String(card).padStart(4, '0')}`
}

function initialStatus(card: number): Status {
  return STATUSES[(card * 7 + Math.floor((card - 1) / CARDS_PER_COLUMN)) % STATUSES.length]
}

function nextStatus(status: Status): Status {
  return STATUSES[(STATUSES.indexOf(status) + 1) % STATUSES.length]
}

export function BoardDemo() {
  const [firstColumn, setFirstColumn] = useState(0)
  const [moved, setMoved] = useState<Record<number, Status>>({})
  const [saving, setSaving] = useState<ReadonlySet<number>>(new Set())
  const [failNextSave, setFailNextSave] = useState(false)
  const [message, setMessage] = useState('Click a card to move it to the next status.')
  const viewportRef = useRef<HTMLDivElement>(null)
  const timersRef = useRef(new Set<number>())

  useEffect(() => {
    const timers = timersRef.current
    return () => {
      for (const timer of timers) window.clearTimeout(timer)
    }
  }, [])

  const startColumn = Math.max(0, firstColumn - OVERSCAN_COLUMNS)
  const endColumn = Math.min(TOTAL_COLUMNS, firstColumn + VISIBLE_COLUMNS + OVERSCAN_COLUMNS)
  const renderedColumns = Array.from(
    { length: endColumn - startColumn },
    (_, offset) => startColumn + offset,
  )
  const cardsInDom = renderedColumns.length * CARDS_PER_COLUMN

  function handleScroll(event: UIEvent<HTMLDivElement>) {
    setFirstColumn(Math.floor(event.currentTarget.scrollLeft / COLUMN_WIDTH))
  }

  function handleSlider(event: ChangeEvent<HTMLInputElement>) {
    const column = Number(event.currentTarget.value)
    setFirstColumn(column)
    if (viewportRef.current) viewportRef.current.scrollLeft = column * COLUMN_WIDTH
  }

  function moveCard(card: number) {
    if (saving.has(card)) return
    const before = moved[card] ?? initialStatus(card)
    const after = nextStatus(before)
    const saveWillFail = failNextSave

    // The screen changes first. The save follows.
    setMoved((current) => ({ ...current, [card]: after }))
    setSaving((current) => new Set(current).add(card))
    setFailNextSave(false)
    setMessage(`Moved ${cardLabel(card)} to ${after}. Saving in the background.`)

    const timer = window.setTimeout(() => {
      timersRef.current.delete(timer)
      setSaving((current) => {
        const next = new Set(current)
        next.delete(card)
        return next
      })
      if (saveWillFail) {
        setMoved((current) => ({ ...current, [card]: before }))
        setMessage(`Save failed. ${cardLabel(card)} rolled back to ${before}.`)
      } else {
        setMessage(`Saved ${cardLabel(card)} as ${after}.`)
      }
    }, SAVE_DELAY_MS)
    timersRef.current.add(timer)
  }

  return (
    <figure className="board">
      <figcaption className="board-header">
        <span>Try it: scroll sideways, click a card to move it</span>
        <span className="board-count">
          <strong>{cardsInDom}</strong> of {TOTAL_CARDS.toLocaleString('en-US')} cards drawn right
          now
        </span>
      </figcaption>
      <div className="board-viewport" ref={viewportRef} onScroll={handleScroll}>
        <div className="board-track" style={{ width: TOTAL_COLUMNS * COLUMN_WIDTH }}>
          {renderedColumns.map((column) => (
            <div
              className="board-column"
              key={column}
              style={{ width: COLUMN_WIDTH, transform: `translateX(${column * COLUMN_WIDTH}px)` }}
            >
              {Array.from({ length: CARDS_PER_COLUMN }, (_, row) => {
                const card = column * CARDS_PER_COLUMN + row + 1
                const status = moved[card] ?? initialStatus(card)
                const isSaving = saving.has(card)
                return (
                  <button
                    className="board-card"
                    type="button"
                    key={card}
                    data-status={status}
                    data-saving={isSaving}
                    aria-label={`Card ${cardLabel(card)}, ${status}. Move to ${nextStatus(status)}.`}
                    onClick={() => moveCard(card)}
                  >
                    <span>{cardLabel(card)}</span>
                    <small>{isSaving ? `${status}, saving` : status}</small>
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="board-controls">
        <input
          className="board-slider"
          type="range"
          min={0}
          max={TOTAL_COLUMNS - VISIBLE_COLUMNS}
          value={Math.min(firstColumn, TOTAL_COLUMNS - VISIBLE_COLUMNS)}
          onChange={handleSlider}
          aria-label="Scroll the board"
        />
        <label className="board-fail">
          <input
            type="checkbox"
            checked={failNextSave}
            onChange={(event) => setFailNextSave(event.currentTarget.checked)}
          />
          Make the next save fail
        </label>
        <output className="board-message">{message}</output>
      </div>
      <p className="board-note">
        A small copy written for this site. It shows two techniques from Product Go: draw only the
        cards on screen, and show a move before its save finishes.
      </p>
    </figure>
  )
}
