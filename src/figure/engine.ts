// Draws the dots. Each one chases the position its formation gives it, so
// switching formation makes the whole field flow from one figure to the next.
import type { FigureKey } from '../data/content.ts'
import { createFormation, type DotOut, type Formation, TONE } from './formations.ts'

export type DotEngine = {
  setFigure: (key: FigureKey) => void
  stop: () => void
}

const TAU = Math.PI * 2
const MAX_PIXEL_RATIO = 2
// Share of the stage's shorter side that a figure may fill.
const STAGE_FILL = 0.86
const POINTER_RADIUS = 110
const POINTER_PUSH = 46
const FADE_RATE = 0.12
// After a switch each dot travels at its own pace, then every dot locks on
// at one shared rate, so a moving figure keeps its exact shape.
const SETTLE_DELAY_SECONDS = 0.8
const SETTLE_SECONDS = 1.4
const LOCKED_FOLLOW = 0.38
const LABEL_DELAY_SECONDS = 0.5
const LABEL_FADE_SECONDS = 0.6

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function startDotEngine(
  canvas: HTMLCanvasElement,
  count: number,
  initial: FigureKey,
): DotEngine {
  const maybeContext = canvas.getContext('2d')
  if (!maybeContext) return { setFigure() {}, stop() {} }
  // Rebound so the functions declared below see the non-null type.
  const context: CanvasRenderingContext2D = maybeContext

  const styles = getComputedStyle(canvas)
  const readColor = (name: string, fallback: string) =>
    styles.getPropertyValue(name).trim() || fallback
  const palette: string[] = []
  palette[TONE.ink] = readColor('--dot-ink', '#16140f')
  palette[TONE.blue] = readColor('--dot-blue', '#2337ff')
  palette[TONE.red] = readColor('--dot-red', '#e03a1e')
  palette[TONE.gold] = readColor('--dot-gold', '#a8780a')
  const labelColor = readColor('--dot-label', '#5f5a50')
  const labelFont = `500 11px ${readColor('--mono', 'monospace')}`

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  let reducedMotion = motionQuery.matches

  const x = new Float32Array(count)
  const y = new Float32Array(count)
  const alpha = new Float32Array(count)
  const size = new Float32Array(count)
  const ease = new Float32Array(count)
  for (let index = 0; index < count; index++) {
    // A spread of speeds makes a transition arrive as a flow, not a block.
    ease[index] = 0.035 + 0.075 * Math.random()
  }

  const formations = new Map<FigureKey, Formation>()
  const formationFor = (key: FigureKey): Formation => {
    const cached = formations.get(key)
    if (cached) return cached
    const created = createFormation(key, count)
    formations.set(key, created)
    return created
  }

  let formation = formationFor(initial)
  let width = 0
  let height = 0
  let ratio = 1
  let canvasLeft = 0
  let canvasTop = 0
  let seeded = false
  let dirty = true
  let frameHandle = 0
  let startedAt = -1
  let previousSeconds = 0
  let switchedAt = 0
  let pointerActive = false
  let pointerX = 0
  let pointerY = 0
  const out: DotOut = { x: 0, y: 0, size: 1, alpha: 1, tone: TONE.ink }

  function resize() {
    const rect = canvas.getBoundingClientRect()
    width = rect.width
    height = rect.height
    canvasLeft = rect.left
    canvasTop = rect.top
    ratio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO)
    canvas.width = Math.round(width * ratio)
    canvas.height = Math.round(height * ratio)
    dirty = true
    if (!seeded && width > 0 && height > 0) {
      // Start scattered, so the first figure assembles in front of the visitor.
      for (let index = 0; index < count; index++) {
        x[index] = Math.random() * width
        y[index] = Math.random() * height
      }
      seeded = true
    }
  }

  function draw(now: number) {
    frameHandle = requestAnimationFrame(draw)
    if (!seeded) return
    if (reducedMotion && !dirty) return
    dirty = false

    const seconds = now / 1000
    if (startedAt < 0) {
      startedAt = seconds
      previousSeconds = seconds
      switchedAt = seconds
    }
    // Normalize easing to 60 frames a second, so fast displays do not rush.
    const frames = clamp((seconds - previousSeconds) * 60, 0.25, 3)
    previousSeconds = seconds
    const time = reducedMotion ? 0 : seconds - startedAt

    const centerX = width / 2
    const centerY = height / 2
    const radius = (Math.min(width, height) / 2) * STAGE_FILL
    const dotScale = clamp(radius / 300, 0.8, 1.5)
    const fade = reducedMotion ? 1 : 1 - (1 - FADE_RATE) ** frames
    const settled = clamp((seconds - switchedAt - SETTLE_DELAY_SECONDS) / SETTLE_SECONDS, 0, 1)
    const lock = settled * settled
    const repel = pointerActive && !reducedMotion

    context.setTransform(ratio, 0, 0, ratio, 0, 0)
    context.clearRect(0, 0, width, height)

    for (let index = 0; index < count; index++) {
      formation.place(index, time, out)
      let targetX = centerX + out.x * radius
      let targetY = centerY + out.y * radius

      if (repel) {
        const awayX = targetX - pointerX
        const awayY = targetY - pointerY
        const distance = Math.hypot(awayX, awayY)
        if (distance < POINTER_RADIUS && distance > 0.01) {
          const push = (1 - distance / POINTER_RADIUS) ** 2 * POINTER_PUSH
          targetX += (awayX / distance) * push
          targetY += (awayY / distance) * push
        }
      }

      // A dot that is invisible on both ends of its move can simply jump.
      const unseen = out.alpha < 0.02 && alpha[index] < 0.06
      if (reducedMotion || unseen) {
        x[index] = targetX
        y[index] = targetY
      } else {
        const pace = ease[index] + (LOCKED_FOLLOW - ease[index]) * lock
        const follow = 1 - (1 - pace) ** frames
        x[index] += (targetX - x[index]) * follow
        y[index] += (targetY - y[index]) * follow
      }
      alpha[index] += (out.alpha - alpha[index]) * fade
      size[index] += (out.size - size[index]) * fade
      if (alpha[index] < 0.01) continue

      context.globalAlpha = alpha[index]
      context.fillStyle = palette[out.tone]
      context.beginPath()
      context.arc(x[index], y[index], size[index] * dotScale, 0, TAU)
      context.fill()
    }

    if (formation.labels.length > 0) {
      const visible = reducedMotion
        ? 1
        : clamp((seconds - switchedAt - LABEL_DELAY_SECONDS) / LABEL_FADE_SECONDS, 0, 1)
      context.globalAlpha = visible
      context.fillStyle = labelColor
      context.font = labelFont
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      for (const label of formation.labels) {
        context.fillText(label.text, centerX + label.x * radius, centerY + label.y * radius)
      }
    }
    context.globalAlpha = 1
  }

  function handlePointerMove(event: PointerEvent) {
    if (event.pointerType === 'touch') return
    pointerActive = true
    pointerX = event.clientX - canvasLeft
    pointerY = event.clientY - canvasTop
  }

  function handlePointerLeave() {
    pointerActive = false
  }

  function handleMotionChange(event: MediaQueryListEvent) {
    reducedMotion = event.matches
    dirty = true
  }

  const observer = new ResizeObserver(resize)
  observer.observe(canvas)
  resize()
  window.addEventListener('pointermove', handlePointerMove, { passive: true })
  document.documentElement.addEventListener('pointerleave', handlePointerLeave)
  motionQuery.addEventListener('change', handleMotionChange)
  frameHandle = requestAnimationFrame(draw)

  return {
    setFigure(key) {
      const next = formationFor(key)
      if (next === formation) return
      formation = next
      switchedAt = previousSeconds
      dirty = true
    },
    stop() {
      cancelAnimationFrame(frameHandle)
      observer.disconnect()
      window.removeEventListener('pointermove', handlePointerMove)
      document.documentElement.removeEventListener('pointerleave', handlePointerLeave)
      motionQuery.removeEventListener('change', handleMotionChange)
    },
  }
}
