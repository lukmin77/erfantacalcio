import * as React from 'react'
import { useChristmas } from './christmasLogic'
import useJanuary from './january'

export type SeasonalVariant = 'christmas' | 'january' | null

export function useSeasonal(isXs: boolean) {
  // determine month first, then call hooks with active flag
  const month = React.useMemo(() => {
    try {
      return new Date().getMonth()
    } catch (e) {
      return -1
    }
  }, [])

  switch (month) {
    case 11:
      const christmas = useChristmas(isXs, true)
      return {
        active: christmas.isChristmasMode,
        canvasRef: christmas.canvasRef,
        variant: 'christmas' as SeasonalVariant,
      }
    case 0:
      const january = useJanuary(isXs, true)
      return {
        active: january.isJanuaryMode,
        canvasRef: january.canvasRef,
        variant: 'january' as SeasonalVariant,
      }
    default:
      const ref = React.useRef<HTMLCanvasElement | null>(null)
      return { active: false, canvasRef: ref, variant: null as SeasonalVariant }
  }
}

export default useSeasonal
