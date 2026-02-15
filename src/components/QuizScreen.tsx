import { useEffect, memo } from 'react'
import type { QuizQuestion, Category } from '@/types'
import { MAX_TIME } from '@/utils/scoring'

interface QuizScreenProps {
  question: QuizQuestion
  questionIndex: number
  totalInCategory: number
  globalIndex: number
  totalQuestions: number
  category: Category
  score: number
  timer: number
  answered: boolean
  selectedAnswer: number
  onAnswer: (index: number) => void
}

const CATEGORY_COLORS: Record<Category, { bg: string; text: string; border: string; hover: string }> = {
  '한국사': { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', hover: 'hover:border-red-500 hover:bg-red-500/10' },
  '과학': { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', hover: 'hover:border-blue-500 hover:bg-blue-500/10' },
  '지리': { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30', hover: 'hover:border-green-500 hover:bg-green-500/10' },
  '일반상식': { bg: 'bg-violet-500/20', text: 'text-violet-400', border: 'border-violet-500/30', hover: 'hover:border-violet-500 hover:bg-violet-500/10' },
}

const OPTION_LABELS = ['A', 'B', 'C', 'D'] as const

export const QuizScreen = memo(function QuizScreen({
  question,
  questionIndex,
  totalInCategory,
  globalIndex,
  totalQuestions,
  category,
  score,
  timer,
  answered,
  selectedAnswer,
  onAnswer,
}: QuizScreenProps) {
  const colors = CATEGORY_COLORS[category]
  const isCorrect = selectedAnswer === question.answer
  const timerRatio = timer / MAX_TIME
  const circumference = 2 * Math.PI * 22
  const isTimeout = answered && selectedAnswer === -1

  // Keyboard navigation: 1-4 to select answers
  useEffect(() => {
    if (answered) return
    const handleKeyDown = (e: KeyboardEvent) => {
      const idx = ['1', '2', '3', '4'].indexOf(e.key)
      if (idx !== -1) onAnswer(idx)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [answered, onAnswer])

  return (
    <div className="min-h-screen p-4 flex flex-col">
      <div className="max-w-2xl mx-auto w-full">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${colors.bg} ${colors.text} ${colors.border}`}>
            {category}
          </span>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">
              {questionIndex + 1}/{totalInCategory}
            </span>
            <span className="text-lg font-bold text-purple-400">
              {score.toLocaleString()}점
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-800 rounded-full h-2 mb-1">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((globalIndex + (answered ? 1 : 0)) / totalQuestions) * 100}%` }}
          />
        </div>
        <p className="text-gray-500 text-xs text-right mb-6">
          전체 {globalIndex + (answered ? 1 : 0)}/{totalQuestions}
        </p>

        {/* Timer */}
        <div className="flex justify-center mb-6">
          <div className={`relative w-16 h-16 ${timer <= 5 && !answered ? 'animate-pulse-ring' : ''}`}>
            <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="22" fill="none" stroke="#1f2937" strokeWidth="3" />
              <circle
                cx="24"
                cy="24"
                r="22"
                fill="none"
                stroke={timer <= 5 ? '#ef4444' : timer <= 10 ? '#eab308' : '#a855f7'}
                strokeWidth="3"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - timerRatio)}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <span className={`absolute inset-0 flex items-center justify-center font-bold text-lg ${timer <= 5 ? 'text-red-400' : 'text-white'}`}>
              {timer}
            </span>
          </div>
        </div>

        {/* Question */}
        <h2 className="text-lg sm:text-xl font-semibold mb-8 leading-relaxed text-center">
          {question.question}
        </h2>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {question.options.map((option, i) => {
            let btnClass =
              'w-full text-left px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 sm:gap-4 min-h-[48px] focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none'

            if (!answered) {
              btnClass += ` border-gray-700 bg-gray-800/80 ${colors.hover}`
            } else if (i === question.answer) {
              btnClass += ' border-green-500 bg-green-500/10 text-green-300'
            } else if (i === selectedAnswer) {
              btnClass += ' border-red-500 bg-red-500/10 text-red-300'
            } else {
              btnClass += ' border-gray-700/50 bg-gray-800/30 opacity-40'
            }

            return (
              <button
                key={i}
                onClick={() => onAnswer(i)}
                disabled={answered}
                className={btnClass}
              >
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                    answered && i === question.answer
                      ? 'bg-green-500 text-white'
                      : answered && i === selectedAnswer
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  {answered && i === question.answer
                    ? '✓'
                    : answered && i === selectedAnswer && i !== question.answer
                      ? '✗'
                      : OPTION_LABELS[i]}
                </span>
                <span className="flex-1 text-sm sm:text-base">{option}</span>
                {!answered && (
                  <span className="text-xs text-gray-600 font-mono shrink-0">{i + 1}</span>
                )}
              </button>
            )
          })}
        </div>

        {/* Explanation */}
        {answered && (
          <div className="animate-fadeIn">
            <div
              className={`p-4 rounded-xl border ${
                isTimeout
                  ? 'bg-yellow-500/10 border-yellow-500/30'
                  : isCorrect
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-red-500/10 border-red-500/30'
              }`}
            >
              <p className={`font-bold mb-1 ${
                isTimeout ? 'text-yellow-400' : isCorrect ? 'text-green-400' : 'text-red-400'
              }`}>
                {isTimeout ? '⏰ 시간 초과!' : isCorrect ? '✅ 정답!' : '❌ 오답!'}
              </p>
              <p className="text-gray-300 text-sm">{question.explanation}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
})
