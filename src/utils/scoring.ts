export const MAX_TIME = 20
export const MAX_SCORE_PER_QUESTION = 200
export const BASE_SCORE = 100
export const TIME_BONUS_PER_SECOND = 5
export const MAX_TOTAL_SCORE = 8000

export function calculateScore(correct: boolean, timeRemaining: number): number {
  if (!correct) return 0
  return BASE_SCORE + Math.max(0, timeRemaining) * TIME_BONUS_PER_SECOND
}
