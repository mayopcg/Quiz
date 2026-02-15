import { useState, useCallback } from 'react'
import type { PlayerResult } from '@/types'

const MAX_RANKINGS = 10

export function useRanking() {
  const [rankings, setRankings] = useState<PlayerResult[]>([])

  const addResult = useCallback((result: PlayerResult) => {
    setRankings((prev) =>
      [...prev, result]
        .sort((a, b) => b.score - a.score)
        .slice(0, MAX_RANKINGS),
    )
  }, [])

  return { rankings, addResult }
}
