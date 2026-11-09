import { type UIEvent, useState } from 'react'

const TOTAL_CARDS = 1000
const COLUMNS = 4
const ROW_HEIGHT = 64
const VIEWPORT_HEIGHT = 288
const OVERSCAN_ROWS = 1

const TOTAL_ROWS = TOTAL_CARDS / COLUMNS
const VISIBLE_ROWS = Math.ceil(VIEWPORT_HEIGHT / ROW_HEIGHT)
const STATUSES = ['todo', 'doing', 'review', 'done'] as const

function formatCardNumber(cardNumber: number): string {
  return `#${String(cardNumber).padStart(4, '0')}`
}

export function BoardDemo() {
  const [firstVisibleRow, setFirstVisibleRow] = useState(0)

  const startRow = Math.max(0, firstVisibleRow - OVERSCAN_ROWS)
  const endRow = Math.min(TOTAL_ROWS, firstVisibleRow + VISIBLE_ROWS + OVERSCAN_ROWS)
  const renderedRows = Array.from({ length: endRow - startRow }, (_, offset) => startRow + offset)
  const cardsInDom = renderedRows.length * COLUMNS

  function handleScroll(event: UIEvent<HTMLDivElement>) {
    setFirstVisibleRow(Math.floor(event.currentTarget.scrollTop / ROW_HEIGHT))
  }

  return (
    <figure className="board">
      <figcaption className="board-header">
        <span>Live demo: scroll the board</span>
        <span className="board-count">
          <strong>{cardsInDom}</strong> of {TOTAL_CARDS.toLocaleString('en-US')} cards in the DOM
        </span>
      </figcaption>
      <section
        className="board-viewport"
        style={{ height: VIEWPORT_HEIGHT }}
        onScroll={handleScroll}
        // biome-ignore lint/a11y/noNoninteractiveTabindex: a scrollable region must be reachable by keyboard
        tabIndex={0}
        aria-label="Scrollable board of 1,000 demo cards"
      >
        <div className="board-track" style={{ height: TOTAL_ROWS * ROW_HEIGHT }}>
          {renderedRows.map((row) => (
            <div
              className="board-row"
              key={row}
              style={{ height: ROW_HEIGHT, transform: `translateY(${row * ROW_HEIGHT}px)` }}
            >
              {Array.from({ length: COLUMNS }, (_, column) => {
                const cardNumber = row * COLUMNS + column + 1
                const status = STATUSES[(cardNumber * 7 + row) % STATUSES.length]
                return (
                  <div className="board-card" data-status={status} key={cardNumber}>
                    <span>{formatCardNumber(cardNumber)}</span>
                    <small>{status}</small>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </section>
      <p className="board-note">Written for this site to show the technique used in Product Go.</p>
    </figure>
  )
}
