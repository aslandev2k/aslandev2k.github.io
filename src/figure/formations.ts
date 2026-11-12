// Every figure on the page is the same set of dots in a different arrangement.
// A formation answers one question: where is dot `index` at `time`?
// Coordinates are stage units: x and y run from -1 to 1, y grows downward.
import { type AwardRank, awards, type FigureKey, skillGroups } from '../data/content.ts'

export const TONE = { ink: 0, blue: 1, red: 2, gold: 3 } as const
export type Tone = (typeof TONE)[keyof typeof TONE]

export type DotOut = { x: number; y: number; size: number; alpha: number; tone: Tone }
export type Label = { x: number; y: number; text: string }
export type Formation = {
  place: (index: number, time: number, out: DotOut) => void
  labels: Label[]
}

const TAU = Math.PI * 2
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5))
// Constants of the R2 low-discrepancy sequence: an even, grid-free fill.
const R2_X = 0.7548776662466927
const R2_Y = 0.5698402909980532
const LINE_WEIGHT = 42
const AREA_WEIGHT = 950

function smooth(value: number): number {
  const clamped = Math.min(1, Math.max(0, value))
  return clamped * clamped * (3 - 2 * clamped)
}

function createRandom(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let mixed = Math.imul(state ^ (state >>> 15), 1 | state)
    mixed = (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296
  }
}

// ---------------------------------------------------------------------------
// Plot: declare shapes with relative weights, then spend exactly `count` dots.
// ---------------------------------------------------------------------------

type Style = { tone?: Tone; alpha?: number; size?: number; group?: number }
type Emit = (x: number, y: number, q: number) => void
type Spec = { weight: number; style: Style; fill: (count: number, emit: Emit) => void }

type Points = {
  x: Float32Array
  y: Float32Array
  // Position of the dot inside its own shape, from 0 to 1.
  q: Float32Array
  alpha: Float32Array
  size: Float32Array
  tone: Tone[]
  group: Int16Array
  shape: Int16Array
}

const NO_GROUP = -1

function createPlot() {
  const specs: Spec[] = []

  function line(x1: number, y1: number, x2: number, y2: number, style: Style = {}, density = 1) {
    specs.push({
      weight: Math.hypot(x2 - x1, y2 - y1) * LINE_WEIGHT * density,
      style,
      fill(count, emit) {
        for (let step = 0; step < count; step++) {
          const along = count === 1 ? 0.5 : step / (count - 1)
          emit(x1 + (x2 - x1) * along, y1 + (y2 - y1) * along, along)
        }
      },
    })
  }

  function box(
    x: number,
    y: number,
    width: number,
    height: number,
    style: Style = {},
    density = 1,
  ) {
    line(x, y, x + width, y, style, density)
    line(x + width, y, x + width, y + height, style, density)
    line(x + width, y + height, x, y + height, style, density)
    line(x, y + height, x, y, style, density)
  }

  // Rows and columns, for small blocks that should read as solid cards.
  function grid(x: number, y: number, width: number, height: number, style: Style = {}) {
    specs.push({
      weight: width * height * AREA_WEIGHT,
      style,
      fill(count, emit) {
        if (count === 0) return
        const columns = Math.max(1, Math.round(Math.sqrt((count * width) / height)))
        const rows = Math.ceil(count / columns)
        for (let step = 0; step < count; step++) {
          const column = step % columns
          const row = Math.floor(step / columns)
          emit(
            x + ((column + 0.5) / columns) * width,
            y + ((row + 0.5) / rows) * height,
            count === 1 ? 0.5 : step / (count - 1),
          )
        }
      },
    })
  }

  function rect(
    x: number,
    y: number,
    width: number,
    height: number,
    style: Style = {},
    density = 1,
  ) {
    specs.push({
      weight: width * height * AREA_WEIGHT * density,
      style,
      fill(count, emit) {
        for (let step = 0; step < count; step++) {
          const u = (0.5 + step * R2_X) % 1
          const v = (0.5 + step * R2_Y) % 1
          emit(x + u * width, y + v * height, count === 1 ? 0.5 : step / (count - 1))
        }
      },
    })
  }

  function disc(cx: number, cy: number, radius: number, style: Style = {}, density = 1) {
    specs.push({
      weight: Math.PI * radius * radius * AREA_WEIGHT * density,
      style,
      fill(count, emit) {
        for (let step = 0; step < count; step++) {
          const reach = radius * Math.sqrt((step + 0.5) / count)
          const angle = step * GOLDEN_ANGLE
          emit(cx + reach * Math.cos(angle), cy + reach * Math.sin(angle), reach / radius)
        }
      },
    })
  }

  function ring(cx: number, cy: number, radius: number, style: Style = {}, density = 1) {
    specs.push({
      weight: TAU * radius * LINE_WEIGHT * density,
      style,
      fill(count, emit) {
        for (let step = 0; step < count; step++) {
          const turn = step / count
          emit(cx + radius * Math.cos(turn * TAU), cy + radius * Math.sin(turn * TAU), turn)
        }
      },
    })
  }

  function build(count: number): Points {
    const points: Points = {
      x: new Float32Array(count),
      y: new Float32Array(count),
      q: new Float32Array(count),
      alpha: new Float32Array(count),
      size: new Float32Array(count),
      tone: new Array<Tone>(count).fill(TONE.ink),
      group: new Int16Array(count).fill(NO_GROUP),
      shape: new Int16Array(count),
    }
    const totalWeight = specs.reduce((sum, spec) => sum + spec.weight, 0)
    if (totalWeight === 0) return points

    // Largest-remainder allocation, so the shares always add up to `count`.
    const exact = specs.map((spec) => (count * spec.weight) / totalWeight)
    const shares = exact.map((value) => Math.floor(value))
    let unassigned = count - shares.reduce((sum, share) => sum + share, 0)
    const byRemainder = exact
      .map((value, index) => ({ index, remainder: value - Math.floor(value) }))
      .sort((a, b) => b.remainder - a.remainder)
    for (const entry of byRemainder) {
      if (unassigned === 0) break
      shares[entry.index] += 1
      unassigned -= 1
    }

    let cursor = 0
    specs.forEach((spec, shapeIndex) => {
      spec.fill(shares[shapeIndex], (x, y, q) => {
        points.x[cursor] = x
        points.y[cursor] = y
        points.q[cursor] = q
        points.alpha[cursor] = spec.style.alpha ?? 0.85
        points.size[cursor] = spec.style.size ?? 1.15
        points.tone[cursor] = spec.style.tone ?? TONE.ink
        points.group[cursor] = spec.style.group ?? NO_GROUP
        points.shape[cursor] = shapeIndex
        cursor += 1
      })
    })
    return points
  }

  return { line, box, rect, grid, disc, ring, build }
}

type Animate = (index: number, time: number, out: DotOut) => void

function fromPoints(points: Points, animate?: Animate, labels: Label[] = []): Formation {
  return {
    labels,
    place(index, time, out) {
      out.x = points.x[index]
      out.y = points.y[index]
      out.size = points.size[index]
      out.alpha = points.alpha[index]
      out.tone = points.tone[index]
      animate?.(index, time, out)
    },
  }
}

// ---------------------------------------------------------------------------
// 01 Globe: organizations worldwide.
// ---------------------------------------------------------------------------

function createGlobe(count: number): Formation {
  const tilt = 0.38
  const cosTilt = Math.cos(tilt)
  const sinTilt = Math.sin(tilt)
  return {
    labels: [],
    place(index, time, out) {
      const height = 1 - (2 * (index + 0.5)) / count
      const ringRadius = Math.sqrt(1 - height * height)
      const angle = index * GOLDEN_ANGLE + time * 0.14
      const across = ringRadius * Math.cos(angle)
      const toward = ringRadius * Math.sin(angle)
      const depth = (height * sinTilt + toward * cosTilt + 1) / 2
      out.x = across * 0.9
      out.y = (height * cosTilt - toward * sinTilt) * 0.9
      out.alpha = 0.1 + 0.9 * depth * depth
      out.size = 0.6 + depth
      out.tone = TONE.ink
    },
  }
}

// ---------------------------------------------------------------------------
// 02 Board: a story map, with a frame that marks what is on screen.
// ---------------------------------------------------------------------------

function createBoard(count: number): Formation {
  const columnHeights = [9, 7, 10, 8, 9, 6]
  const pitchX = 0.31
  const pitchY = 0.155
  const cardWidth = 0.24
  const cardHeight = 0.1
  const top = -0.9
  const frameHeight = 0.64
  const frameGroup = 1
  const firstCardGroup = 10

  const plot = createPlot()
  const cardCenters: number[] = []
  columnHeights.forEach((storyCount, column) => {
    const left = (column - (columnHeights.length - 1) / 2) * pitchX - cardWidth / 2
    plot.grid(left, top, cardWidth, cardHeight, { tone: TONE.blue, alpha: 0.95, size: 1.25 })
    for (let row = 1; row <= storyCount; row++) {
      const y = top + row * pitchY + 0.03
      plot.grid(left, y, cardWidth, cardHeight, { group: firstCardGroup + cardCenters.length })
      cardCenters.push(y + cardHeight / 2)
    }
  })
  const frameStyle: Style = { tone: TONE.red, alpha: 1, size: 1.2, group: frameGroup }
  plot.box(-0.96, -frameHeight / 2, 1.92, frameHeight, frameStyle, 0.55)
  const points = plot.build(count)

  return fromPoints(points, (index, time, out) => {
    const group = points.group[index]
    if (group === NO_GROUP) return
    const frameCenter = 0.1 + 0.4 * Math.sin(time * 0.45)
    if (group === frameGroup) {
      out.y += frameCenter
      return
    }
    const onScreen =
      Math.abs(cardCenters[group - firstCardGroup] - frameCenter) < frameHeight / 2 - 0.03
    out.alpha = onScreen ? 0.95 : 0.2
    out.size = onScreen ? 1.3 : 1
  })
}

// ---------------------------------------------------------------------------
// 03 Hub: one account core, two products, events flowing both ways.
// ---------------------------------------------------------------------------

function createHub(count: number): Formation {
  const core = { x: 0, y: -0.42 }
  const products = [
    { x: -0.58, y: 0.5, name: 'TaskFord' },
    { x: 0.58, y: 0.5, name: 'AssetLoom' },
  ]
  const coreRingGroup = 1
  const firstLaneGroup = 10
  const lanes: { x1: number; y1: number; x2: number; y2: number }[] = []

  const plot = createPlot()
  plot.disc(core.x, core.y, 0.3, { alpha: 0.9 })
  plot.ring(core.x, core.y, 0.37, { tone: TONE.blue, alpha: 1, size: 1.3, group: coreRingGroup }, 2)
  for (const product of products) {
    plot.ring(product.x, product.y, 0.26, { alpha: 0.95, size: 1.25 }, 1.6)
    plot.disc(product.x, product.y, 0.2, { alpha: 0.4, size: 1 }, 0.7)

    const length = Math.hypot(product.x - core.x, product.y - core.y)
    const dirX = (product.x - core.x) / length
    const dirY = (product.y - core.y) / length
    const startX = core.x + dirX * 0.41
    const startY = core.y + dirY * 0.41
    const endX = product.x - dirX * 0.3
    const endY = product.y - dirY * 0.3
    const offsetX = -dirY * 0.035
    const offsetY = dirX * 0.035

    // Events pushed from the core down to the product.
    lanes.push({
      x1: startX + offsetX,
      y1: startY + offsetY,
      x2: endX + offsetX,
      y2: endY + offsetY,
    })
    plot.line(
      startX,
      startY,
      endX,
      endY,
      { tone: TONE.blue, size: 1.3, group: firstLaneGroup + lanes.length - 1 },
      1.5,
    )
    // Sign-in and payment handed from the product up to the core.
    lanes.push({
      x1: endX - offsetX,
      y1: endY - offsetY,
      x2: startX - offsetX,
      y2: startY - offsetY,
    })
    plot.line(
      endX,
      endY,
      startX,
      startY,
      { size: 1.15, group: firstLaneGroup + lanes.length - 1 },
      1.5,
    )
  }
  const points = plot.build(count)

  const labels: Label[] = [
    { x: core.x, y: core.y - 0.5, text: 'sign-in + billing core' },
    ...products.map((product) => ({ x: product.x, y: product.y + 0.38, text: product.name })),
  ]

  return fromPoints(
    points,
    (index, time, out) => {
      const group = points.group[index]
      if (group === coreRingGroup) {
        out.size = 1.3 + 0.3 * Math.sin(time * 2 + points.q[index] * TAU * 3)
        return
      }
      if (group < firstLaneGroup) return
      const lane = lanes[group - firstLaneGroup]
      const along = (points.q[index] + time * 0.11) % 1
      out.x = lane.x1 + (lane.x2 - lane.x1) * along
      out.y = lane.y1 + (lane.y2 - lane.y1) * along
      out.alpha = 0.95 * Math.sin(Math.PI * along)
    },
    labels,
  )
}

// ---------------------------------------------------------------------------
// 04 Koi: seen from above, swimming a slow lap.
// ---------------------------------------------------------------------------

function createKoi(count: number): Formation {
  const BODY = 0
  const TAIL = 1
  const FIN_LEFT = 2
  const EYE = 4
  // Lengths along the fish, nose at the front. The body is drawn from above.
  const fishLength = 1.5
  const bodyShare = 0.8
  const turnRadius = 0.1

  // Half-width of the body from nose (0) to the base of the tail (1).
  const bodyHalfWidth = (along: number) =>
    0.022 * along + 0.15 * Math.sin(Math.PI * along ** 0.6) ** 0.9
  const maxBodyHalfWidth = 0.172

  const random = createRandom(7)
  const part = new Uint8Array(count)
  const along = new Float32Array(count)
  const across = new Float32Array(count)
  const tone: Tone[] = new Array<Tone>(count).fill(TONE.ink)
  const alpha = new Float32Array(count)
  const size = new Float32Array(count)

  for (let index = 0; index < count; index++) {
    const share = index / count
    size[index] = 1.05
    if (index < 2) {
      part[index] = EYE
      along[index] = 0.075
      across[index] = index === 0 ? -0.62 : 0.62
      alpha[index] = 1
      size[index] = 2.1
    } else if (share < 0.74) {
      // Rejection sampling keeps the dots evenly spread over the body area.
      let candidate = random()
      for (let attempt = 0; attempt < 40; attempt++) {
        if (random() * maxBodyHalfWidth <= bodyHalfWidth(candidate)) break
        candidate = random()
      }
      // One dot in six sits on the outline, so the silhouette stays crisp.
      const onEdge = index % 6 === 0
      const side = onEdge ? (random() < 0.5 ? -1 : 1) : random() * 2 - 1
      part[index] = BODY
      along[index] = candidate
      across[index] = side
      const patch = Math.sin(candidate * 9 + 1.2) + Math.cos(side * 2.4 + candidate * 6.1)
      const marked = !onEdge && (candidate < 0.12 || patch > 0.5)
      tone[index] = marked ? TONE.red : TONE.ink
      alpha[index] = marked ? 0.95 : onEdge ? 0.85 : 0.3
      size[index] = marked ? 1.35 : 1.05
    } else if (share < 0.88) {
      part[index] = TAIL
      along[index] = random()
      across[index] = random() * 2 - 1
      alpha[index] = 0.2 + 0.4 * Math.abs(across[index])
    } else {
      part[index] = FIN_LEFT + (index % 2)
      along[index] = random()
      across[index] = random()
      alpha[index] = 0.42
    }
  }

  return {
    labels: [],
    place(index, time, out) {
      const kind = part[index]
      // Position in the fish's own frame: `forward` runs nose to tail.
      let spine = along[index] * bodyShare
      let sideways = 0
      if (kind === BODY || kind === EYE) {
        sideways = across[index] * bodyHalfWidth(along[index])
      } else if (kind === TAIL) {
        spine = bodyShare + along[index] * (1 - bodyShare)
        sideways = across[index] * (0.024 + 0.17 * along[index] ** 1.25)
      } else {
        // A pectoral fin: a lobe swept back from the widest part of the body.
        const side = kind === FIN_LEFT ? -1 : 1
        const flap = 0.95 + 0.14 * Math.sin(time * 2.2)
        const lobe = 0.1 * Math.sin(Math.PI * along[index] ** 0.7)
        const out2 = along[index] * 0.27
        const spread = (across[index] - 0.5) * lobe
        spine = 0.27 * bodyShare + (out2 * Math.cos(flap) + spread * Math.sin(flap)) / fishLength
        sideways =
          side * (bodyHalfWidth(0.27) * 0.92 + out2 * Math.sin(flap) - spread * Math.cos(flap))
      }

      const heading = time * 0.2
      const wave = Math.sin(spine * 6.2 - time * 4) * (0.004 + 0.085 * spine * spine)
      const forward = (0.46 - spine) * fishLength
      // The body curves gently into the turn it is making.
      const lateral = sideways + wave + 0.16 * (spine - 0.3) ** 2
      const cosHeading = Math.cos(heading)
      const sinHeading = Math.sin(heading)

      out.x = turnRadius * sinHeading + forward * cosHeading - lateral * sinHeading
      out.y = -turnRadius * cosHeading + forward * sinHeading + lateral * cosHeading
      out.tone = tone[index]
      out.alpha = alpha[index]
      out.size = size[index]
    },
  }
}

// ---------------------------------------------------------------------------
// 05 Schedule: a week of time slots, with attendance moving through it.
// ---------------------------------------------------------------------------

function createSchedule(count: number): Formation {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const slots = 6
  const pitchX = 0.26
  const pitchY = 0.25
  const cellWidth = 0.21
  const cellHeight = 0.2
  const left = -(days.length * pitchX) / 2 + (pitchX - cellWidth) / 2
  const top = -0.6
  const firstCellGroup = 10

  const plot = createPlot()
  const labels: Label[] = []
  // Which cells hold a class, and the order attendance visits them in.
  const visitOrder: number[] = []
  const booked: boolean[] = []
  days.forEach((day, column) => {
    const x = left + column * pitchX
    plot.line(x, top - 0.07, x + cellWidth, top - 0.07, { tone: TONE.blue, alpha: 1, size: 1.3 }, 2)
    labels.push({ x: x + cellWidth / 2, y: top - 0.17, text: day })
    for (let slot = 0; slot < slots; slot++) {
      const cell = column * slots + slot
      booked[cell] = (column * 3 + slot * 5 + column * slot) % 5 < 2
      if (booked[cell]) visitOrder.push(cell)
      plot.rect(x, top + slot * pitchY, cellWidth, cellHeight, { group: firstCellGroup + cell })
    }
  })
  const points = plot.build(count)

  return fromPoints(
    points,
    (index, time, out) => {
      const group = points.group[index]
      if (group < firstCellGroup) return
      const cell = group - firstCellGroup
      if (!booked[cell]) {
        out.alpha = 0.16
        out.size = 0.95
        return
      }
      const current = visitOrder[Math.floor(time / 1.4) % visitOrder.length]
      if (cell === current) {
        out.tone = TONE.blue
        out.alpha = 1
        out.size = 1.45
      }
    },
    labels,
  )
}

// ---------------------------------------------------------------------------
// 06 Tiers: an application climbs four levels of review.
// ---------------------------------------------------------------------------

function createTiers(count: number): Formation {
  const levels = [8, 4, 2, 1]
  const levelY = [0.68, 0.26, -0.16, -0.58]
  const blockWidth = 0.17
  const blockHeight = 0.12
  const dossierGroup = 200
  const cycleSeconds = 8
  const nodeX = (level: number, slot: number) => -0.9 + ((slot + 0.5) * 1.8) / levels[level]
  const nodeGroup = (level: number, slot: number) => level * 10 + slot

  const plot = createPlot()
  levels.forEach((slotCount, level) => {
    for (let slot = 0; slot < slotCount; slot++) {
      const x = nodeX(level, slot)
      const y = levelY[level]
      plot.rect(x - blockWidth / 2, y - blockHeight / 2, blockWidth, blockHeight, {
        group: nodeGroup(level, slot),
        alpha: 0.8,
      })
      if (level + 1 < levels.length) {
        plot.line(
          x,
          y - blockHeight / 2 - 0.02,
          nodeX(level + 1, slot >> 1),
          levelY[level + 1] + blockHeight / 2 + 0.02,
          { alpha: 0.3, size: 0.95 },
          0.7,
        )
      }
    }
  })
  plot.disc(0, 0, 0.055, { tone: TONE.red, alpha: 1, size: 1.4, group: dossierGroup }, 5)
  const points = plot.build(count)

  const labels: Label[] = [
    { x: 0, y: levelY[0] + 0.2, text: 'local units' },
    { x: 0, y: levelY[3] - 0.2, text: 'provincial council' },
  ]

  return fromPoints(
    points,
    (index, time, out) => {
      const group = points.group[index]
      if (group === NO_GROUP) return
      const leaf = (Math.floor(time / cycleSeconds) * 3) % levels[0]
      // Three hops up, then a pause at the council while it votes.
      const phase = ((time % cycleSeconds) / cycleSeconds) * 4.6
      const hop = Math.min(3, Math.floor(phase))

      if (group === dossierGroup) {
        const next = Math.min(3, hop + 1)
        const progress = hop < 3 ? smooth(phase - hop) : 0
        const fromX = nodeX(hop, leaf >> hop)
        const toX = nodeX(next, leaf >> next)
        out.x += fromX + (toX - fromX) * progress
        out.y += levelY[hop] + (levelY[next] - levelY[hop]) * progress
        return
      }

      const level = Math.floor(group / 10)
      const slot = group % 10
      const reviewed = level <= hop && slot === leaf >> level
      if (!reviewed) return
      out.tone = TONE.blue
      out.alpha = 1
      if (level === 3 && hop === 3) out.size = 1.3 + 0.25 * Math.sin(time * 5)
    },
    labels,
  )
}

// ---------------------------------------------------------------------------
// 07 Wireframe: a screen and a flowchart, drawn stroke by stroke.
// ---------------------------------------------------------------------------

function createWireframe(count: number): Formation {
  type Stroke = [x1: number, y1: number, x2: number, y2: number]
  const strokes: Stroke[] = []
  const stroke = (x1: number, y1: number, x2: number, y2: number) => {
    strokes.push([x1, y1, x2, y2])
  }
  const frame = (x: number, y: number, width: number, height: number) => {
    stroke(x, y, x + width, y)
    stroke(x + width, y, x + width, y + height)
    stroke(x + width, y + height, x, y + height)
    stroke(x, y + height, x, y)
  }

  // The screen: window, title bar, sidebar, image placeholder, text, button.
  frame(-0.92, -0.62, 1.22, 1.24)
  stroke(-0.92, -0.48, 0.3, -0.48)
  stroke(-0.6, -0.48, -0.6, 0.62)
  stroke(-0.86, -0.36, -0.66, -0.36)
  stroke(-0.86, -0.26, -0.66, -0.26)
  stroke(-0.86, -0.16, -0.7, -0.16)
  frame(-0.5, -0.38, 0.7, 0.43)
  stroke(-0.5, -0.38, 0.2, 0.05)
  stroke(-0.5, 0.05, 0.2, -0.38)
  stroke(-0.5, 0.17, 0.2, 0.17)
  stroke(-0.5, 0.27, 0.05, 0.27)
  stroke(-0.5, 0.37, 0.12, 0.37)
  frame(-0.5, 0.46, 0.28, 0.09)
  // The flowchart: step, decision, step, step.
  frame(0.46, -0.86, 0.44, 0.18)
  stroke(0.68, -0.68, 0.68, -0.5)
  stroke(0.68, -0.5, 0.92, -0.26)
  stroke(0.92, -0.26, 0.68, -0.02)
  stroke(0.68, -0.02, 0.44, -0.26)
  stroke(0.44, -0.26, 0.68, -0.5)
  stroke(0.68, -0.02, 0.68, 0.2)
  frame(0.46, 0.2, 0.44, 0.2)
  stroke(0.68, 0.4, 0.68, 0.6)
  frame(0.46, 0.6, 0.44, 0.2)

  const plot = createPlot()
  const strokeStart: number[] = []
  const strokeLength: number[] = []
  let drawn = 0
  for (const [x1, y1, x2, y2] of strokes) {
    plot.line(x1, y1, x2, y2)
    const length = Math.hypot(x2 - x1, y2 - y1)
    strokeStart.push(drawn)
    strokeLength.push(length)
    drawn += length
  }
  const points = plot.build(count)

  return fromPoints(points, (index, time, out) => {
    const shape = points.shape[index]
    const order = (strokeStart[shape] + points.q[index] * strokeLength[shape]) / drawn
    // The pen runs past the end, so the finished drawing holds for a moment.
    const pen = (time * 0.16) % 1.4
    if (order > pen) {
      out.alpha = 0.13
      out.size = 0.95
      return
    }
    out.alpha = 0.92
    if (pen - order < 0.012) {
      out.tone = TONE.red
      out.size = 1.9
    }
  })
}

// ---------------------------------------------------------------------------
// 08 Page: a one-page CV, with a reader skimming down it.
// ---------------------------------------------------------------------------

function createPage(count: number): Formation {
  const lineLengths = [1, 0.92, 0.78, 0.97, 0.6]
  const left = -0.48
  const fullWidth = 0.96
  const firstLineGroup = 10

  const plot = createPlot()
  plot.box(-0.62, -0.9, 1.24, 1.8, { alpha: 0.55, size: 1 })
  plot.line(left, -0.74, left + 0.56, -0.74, { alpha: 1, size: 1.7 }, 3)
  plot.line(left, -0.64, left + 0.36, -0.64, { alpha: 0.55 })
  let lineCount = 0
  for (let y = -0.48; y < 0.82; y += 0.085) {
    const isHeading = lineCount % 5 === 0
    const length = isHeading ? 0.3 : fullWidth * lineLengths[lineCount % lineLengths.length]
    const style: Style = isHeading
      ? { tone: TONE.blue, alpha: 1, size: 1.4, group: firstLineGroup + lineCount }
      : { alpha: 0.5, group: firstLineGroup + lineCount }
    plot.line(left, y, left + length, y, style, isHeading ? 2 : 1)
    lineCount += 1
  }
  const points = plot.build(count)

  return fromPoints(points, (index, time, out) => {
    const group = points.group[index]
    if (group < firstLineGroup) return
    if (group - firstLineGroup !== Math.floor(time * 1.6) % lineCount) return
    out.alpha = 1
    out.size = 1.5
  })
}

// ---------------------------------------------------------------------------
// 09 Spiral: one arm per skill group.
// ---------------------------------------------------------------------------

function createSpiral(count: number): Formation {
  const arms = skillGroups.length
  return {
    labels: [],
    place(index, time, out) {
      const reach = Math.sqrt((index + 0.5) / count)
      const angle = index * GOLDEN_ANGLE + time * 0.04
      const breath = 1 + 0.02 * Math.sin(time * 0.9 + reach * 6)
      const lit = index % arms === Math.floor(time / 2.2) % arms
      out.x = 0.93 * reach * breath * Math.cos(angle)
      out.y = 0.93 * reach * breath * Math.sin(angle)
      out.tone = lit ? TONE.blue : TONE.ink
      out.alpha = lit ? 1 : 0.5
      out.size = (lit ? 1.15 : 0.85) + 0.5 * reach
    },
  }
}

// ---------------------------------------------------------------------------
// 10 Medals: one per award, the two headline results drawn large.
// ---------------------------------------------------------------------------

function createMedals(count: number): Formation {
  const slots = [
    { x: -0.44, y: -0.22, radius: 0.26 },
    { x: 0.44, y: -0.22, radius: 0.26 },
    { x: -0.62, y: 0.6, radius: 0.16 },
    { x: 0, y: 0.6, radius: 0.16 },
    { x: 0.62, y: 0.6, radius: 0.16 },
  ]
  const rankStyle: Record<AwardRank, Style> = {
    gold: { tone: TONE.gold, alpha: 0.95, size: 1.25 },
    second: { tone: TONE.ink, alpha: 0.85, size: 1.2 },
    consolation: { tone: TONE.ink, alpha: 0.4, size: 1.05 },
  }

  const plot = createPlot()
  const labels: Label[] = []
  const medals = awards.slice(0, slots.length).map((award, index) => ({ award, ...slots[index] }))
  medals.forEach(({ award, x, y, radius }, index) => {
    const style: Style = { ...rankStyle[award.rank], group: index }
    const hangY = y - radius * 2.1
    plot.disc(x, y, radius, style)
    plot.ring(x, y, radius * 1.13, { ...style, alpha: 1 }, 1.4)
    plot.line(x - radius * 0.55, hangY, x - radius * 0.12, y - radius * 1.13, {
      tone: TONE.blue,
      group: index,
    })
    plot.line(x + radius * 0.55, hangY, x + radius * 0.12, y - radius * 1.13, {
      tone: TONE.blue,
      group: index,
    })
    labels.push({ x, y: y + radius * 1.13 + 0.11, text: award.year })
  })
  const points = plot.build(count)

  return fromPoints(
    points,
    (index, time, out) => {
      const medal = medals[points.group[index]]
      if (!medal) return
      // Each medal swings a little from the top of its ribbon.
      const pivotY = medal.y - medal.radius * 2.1
      const swing = 0.06 * Math.sin(time * 1.2 + points.group[index] * 1.3)
      const armX = out.x - medal.x
      const armY = out.y - pivotY
      out.x = medal.x + armX * Math.cos(swing) - armY * Math.sin(swing)
      out.y = pivotY + armX * Math.sin(swing) + armY * Math.cos(swing)
    },
    labels,
  )
}

// ---------------------------------------------------------------------------
// 11 Envelope: the way to reach him.
// ---------------------------------------------------------------------------

function createEnvelope(count: number): Formation {
  const sealGroup = 1
  const plot = createPlot()
  plot.box(-0.8, -0.5, 1.6, 1, { alpha: 1, size: 1.3 })
  plot.rect(-0.8, -0.5, 1.6, 1, { alpha: 0.14, size: 0.95 }, 0.5)
  plot.line(-0.8, -0.5, 0, 0.08, { tone: TONE.blue, alpha: 1, size: 1.3 }, 1.4)
  plot.line(0.8, -0.5, 0, 0.08, { tone: TONE.blue, alpha: 1, size: 1.3 }, 1.4)
  plot.line(-0.8, 0.5, -0.2, -0.07, { alpha: 0.4 })
  plot.line(0.8, 0.5, 0.2, -0.07, { alpha: 0.4 })
  plot.disc(0, 0.08, 0.07, { tone: TONE.red, alpha: 1, size: 1.35, group: sealGroup }, 3)
  const points = plot.build(count)

  return fromPoints(points, (index, time, out) => {
    out.y += 0.03 * Math.sin(time * 0.9)
    if (points.group[index] === sealGroup) out.size = 1.35 + 0.3 * Math.sin(time * 2.4)
  })
}

const creators: Record<FigureKey, (count: number) => Formation> = {
  globe: createGlobe,
  board: createBoard,
  hub: createHub,
  koi: createKoi,
  schedule: createSchedule,
  tiers: createTiers,
  wireframe: createWireframe,
  page: createPage,
  spiral: createSpiral,
  medals: createMedals,
  envelope: createEnvelope,
}

export function createFormation(key: FigureKey, count: number): Formation {
  return creators[key](count)
}
