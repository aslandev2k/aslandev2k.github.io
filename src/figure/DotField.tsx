import { useEffect, useRef } from 'react'
import { dotCount, type FigureKey } from '../data/content.ts'
import { type DotEngine, startDotEngine } from './engine.ts'

export function DotField({ figure }: { figure: FigureKey }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<DotEngine | null>(null)
  const figureRef = useRef(figure)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const engine = startDotEngine(canvas, dotCount, figureRef.current)
    engineRef.current = engine
    return () => {
      engine.stop()
      engineRef.current = null
    }
  }, [])

  useEffect(() => {
    figureRef.current = figure
    engineRef.current?.setFigure(figure)
  }, [figure])

  return <canvas className="stage-canvas" ref={canvasRef} />
}
