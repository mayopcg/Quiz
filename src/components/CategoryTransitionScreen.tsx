import { useEffect, useState } from 'react'
import type { CategoryScore, Category } from '@/types'

interface CategoryTransitionScreenProps {
  completedScore: CategoryScore
  nextCategory: Category | null
  onContinue: () => void
}

const CATEGORY_EMOJI: Record<Category, string> = {
  '한국사': '📜',
  '과학': '🔬',
  '지리': '🌍',
  '일반상식': '💡',
}

const CATEGORY_COLORS: Record<Category, string> = {
  '한국사': '#EF4444',
  '과학': '#3B82F6',
  '지리': '#22C55E',
  '일반상식': '#8B5CF6',
}

export function CategoryTransitionScreen({
  completedScore,
  nextCategory,
  onContinue,
}: CategoryTransitionScreenProps) {
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval)
          onContinue()
          return 0
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [onContinue])

  const percentage = completedScore.total > 0
    ? Math.round((completedScore.correct / completedScore.total) * 100)
    : 0
  const circumference = 2 * Math.PI * 52

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="max-w-md w-full text-center space-y-8 animate-slideUp">
        {/* Completed category */}
        <div>
          <p className="text-6xl mb-4">{CATEGORY_EMOJI[completedScore.category]}</p>
          <h2 className="text-2xl font-bold mb-2">{completedScore.category} 완료!</h2>
          <p className="text-gray-400">
            {completedScore.correct} / {completedScore.total} 정답
          </p>
          <p className="text-lg font-semibold text-purple-400 mt-1">
            {completedScore.score.toLocaleString()}점
          </p>
        </div>

        {/* Score circle */}
        <div className="relative w-36 h-36 mx-auto">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="#1f2937" strokeWidth="8" />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke={percentage >= 70 ? '#22c55e' : percentage >= 40 ? '#eab308' : '#ef4444'}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - percentage / 100)}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold">
            {percentage}%
          </span>
        </div>

        {/* Next category preview */}
        {nextCategory && (
          <div
            className="bg-gray-800 rounded-xl p-5 border"
            style={{ borderColor: CATEGORY_COLORS[nextCategory] + '40' }}
          >
            <p className="text-gray-400 text-sm mb-2">다음 카테고리</p>
            <p className="text-2xl font-bold" style={{ color: CATEGORY_COLORS[nextCategory] }}>
              {CATEGORY_EMOJI[nextCategory]} {nextCategory}
            </p>
          </div>
        )}

        {/* Continue button with countdown */}
        <button
          onClick={onContinue}
          className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 rounded-xl font-bold text-lg transition-colors"
        >
          계속하기 ({countdown})
        </button>
      </div>
    </div>
  )
}
