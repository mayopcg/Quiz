import { useState, useEffect, memo } from 'react'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts'
import type { PlayerResult, AnswerRecord, Category } from '@/types'
import { questions } from '@/data/questions'
import { MAX_TIME, MAX_TOTAL_SCORE } from '@/utils/scoring'

interface ResultScreenProps {
  result: PlayerResult
  answers: AnswerRecord[]
  onRestart: () => void
  onShowRanking: () => void
}

const CATEGORY_COLORS: Record<Category, string> = {
  '한국사': '#EF4444',
  '과학': '#3B82F6',
  '지리': '#22C55E',
  '일반상식': '#8B5CF6',
}

function getGrade(accuracy: number) {
  if (accuracy >= 90) return { emoji: '🏆', label: '상식왕', color: 'text-yellow-400', bg: 'from-yellow-400/20 to-yellow-600/20' }
  if (accuracy >= 70) return { emoji: '🥈', label: '상식 고수', color: 'text-gray-300', bg: 'from-gray-300/20 to-gray-500/20' }
  if (accuracy >= 50) return { emoji: '🥉', label: '상식 중수', color: 'text-amber-600', bg: 'from-amber-600/20 to-amber-800/20' }
  return { emoji: '📚', label: '더 공부해요', color: 'text-gray-400', bg: 'from-gray-500/20 to-gray-700/20' }
}

function useCountUp(target: number, duration = 1500) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    const start = performance.now()
    let raf: number
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4)
      setValue(Math.round(eased * target))
      if (progress < 1) raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return value
}

export const ResultScreen = memo(function ResultScreen({
  result,
  answers,
  onRestart,
  onShowRanking,
}: ResultScreenProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const displayScore = useCountUp(result.score)
  const grade = getGrade(result.accuracy)

  const totalSeconds = answers.reduce((sum, a) => sum + (MAX_TIME - a.timeRemaining), 0)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  const radarData = result.categoryScores.map((cs) => ({
    category: cs.category,
    점수율: cs.total > 0 ? Math.round((cs.correct / cs.total) * 100) : 0,
    fullMark: 100,
  }))

  const wrongAnswers = answers
    .filter((a) => !a.correct)
    .map((a) => {
      const question = questions.find((q) => q.id === a.questionId)
      return question ? { answer: a, question } : null
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto space-y-6 py-8 animate-slideUp">
        {/* Score + Grade */}
        <div className="text-center space-y-3">
          <p className="text-gray-400 text-lg">{result.nickname}님의 결과</p>
          <div className={`inline-block px-6 py-3 rounded-2xl bg-gradient-to-r ${grade.bg}`}>
            <span className="text-5xl">{grade.emoji}</span>
            <p className={`text-2xl font-bold mt-1 ${grade.color}`}>{grade.label}</p>
          </div>
          <div>
            <p className="text-5xl font-black tabular-nums">
              {displayScore.toLocaleString()}
              <span className="text-2xl text-gray-500">점</span>
            </p>
            <p className="text-gray-500 text-sm">/ {MAX_TOTAL_SCORE.toLocaleString()}</p>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-purple-400">{result.accuracy}%</p>
            <p className="text-gray-500 text-sm mt-1">정답률</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-green-400">
              {result.correctCount}/{result.totalQuestions}
            </p>
            <p className="text-gray-500 text-sm mt-1">정답 수</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-blue-400">
              {minutes}:{seconds.toString().padStart(2, '0')}
            </p>
            <p className="text-gray-500 text-sm mt-1">소요 시간</p>
          </div>
        </div>

        {/* Radar chart */}
        <div className="bg-gray-800 rounded-2xl p-4">
          <h3 className="text-lg font-semibold mb-2 text-center">카테고리별 성적</h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis
                dataKey="category"
                tick={({ x, y, payload }: { x: number; y: number; payload: { value: string } }) => (
                  <text
                    x={x}
                    y={y}
                    textAnchor="middle"
                    fill={CATEGORY_COLORS[payload.value as Category] ?? '#9ca3af'}
                    fontSize={13}
                    fontWeight={600}
                  >
                    {payload.value}
                  </text>
                )}
              />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 11 }} />
              <Radar dataKey="점수율" stroke="#a855f7" fill="#a855f7" fillOpacity={0.3} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Category score cards */}
        <div className="grid grid-cols-2 gap-3">
          {result.categoryScores.map((cs) => (
            <div key={cs.category} className="bg-gray-800 rounded-xl p-4 text-center">
              <p className="text-sm font-medium" style={{ color: CATEGORY_COLORS[cs.category] }}>
                {cs.category}
              </p>
              <p className="text-2xl font-bold mt-1">
                {cs.correct}/{cs.total}
              </p>
              <p className="text-sm text-gray-500">{cs.score.toLocaleString()}점</p>
            </div>
          ))}
        </div>

        {/* Wrong answer review */}
        {wrongAnswers.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">
              오답 리뷰 <span className="text-red-400">({wrongAnswers.length})</span>
            </h3>
            <div className="space-y-2">
              {wrongAnswers.map(({ answer: ans, question: q }) => {
                const isExpanded = expandedId === q.id
                return (
                  <div key={q.id} className="bg-gray-800 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : q.id)}
                      className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-750 transition-colors focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none"
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: CATEGORY_COLORS[q.category] }}
                      />
                      <span className="flex-1 text-sm leading-snug">{q.question}</span>
                      <span className={`text-gray-500 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                        ▼
                      </span>
                    </button>
                    {isExpanded && (
                      <div className="px-4 pb-4 space-y-2 animate-fadeIn">
                        <div className="flex items-start gap-2 text-sm">
                          <span className="text-red-400 shrink-0 font-medium">내 답:</span>
                          <span className="text-red-300">
                            {ans.selected === -1
                              ? '⏰ 시간 초과'
                              : q.options[ans.selected] ?? ''}
                          </span>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <span className="text-green-400 shrink-0 font-medium">정답:</span>
                          <span className="text-green-300">
                            {q.options[q.answer] ?? ''}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm bg-gray-700/50 rounded-lg p-3">
                          {q.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onRestart}
            className="flex-1 py-3.5 bg-purple-600 hover:bg-purple-700 rounded-xl font-bold transition-colors focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 focus-visible:outline-none"
          >
            다시 도전
          </button>
          <button
            onClick={onShowRanking}
            className="flex-1 py-3.5 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold transition-colors focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 focus-visible:outline-none"
          >
            순위표 보기
          </button>
        </div>
      </div>
    </div>
  )
})
