import { memo } from 'react'
import type { PlayerResult } from '@/types'

interface RankingScreenProps {
  rankings: PlayerResult[]
  currentResultDate: string | null
  onBack: () => void
}

const RANK_STYLES = [
  { icon: '👑', bg: 'bg-yellow-500/10', border: 'border-yellow-500/40', text: 'text-yellow-400' },
  { icon: '🥈', bg: 'bg-gray-400/10', border: 'border-gray-400/40', text: 'text-gray-300' },
  { icon: '🥉', bg: 'bg-amber-600/10', border: 'border-amber-600/40', text: 'text-amber-500' },
]

export const RankingScreen = memo(function RankingScreen({
  rankings,
  currentResultDate,
  onBack,
}: RankingScreenProps) {
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-lg mx-auto py-8 animate-slideUp">
        <h1 className="text-3xl font-bold text-center mb-8">🏆 명예의 전당</h1>

        {rankings.length === 0 ? (
          <div className="text-center text-gray-500 py-16">
            <p className="text-6xl mb-4">🏆</p>
            <p className="text-lg">아직 기록이 없습니다.</p>
            <p className="text-sm mt-1">퀴즈를 풀고 첫 기록을 남겨보세요!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {rankings.map((r, i) => {
              const rankStyle = RANK_STYLES[i]
              const isCurrent = currentResultDate !== null && r.date === currentResultDate

              return (
                <div
                  key={`${r.nickname}-${r.date}`}
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                    isCurrent
                      ? 'animate-highlight border-purple-500/60 bg-purple-500/10'
                      : rankStyle
                        ? `${rankStyle.bg} ${rankStyle.border}`
                        : 'bg-gray-800/50 border-gray-700/50'
                  }`}
                >
                  {/* Rank */}
                  <div className="w-10 text-center shrink-0">
                    {rankStyle ? (
                      <span className="text-2xl">{rankStyle.icon}</span>
                    ) : (
                      <span className="text-lg font-bold text-gray-500">{i + 1}</span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`font-semibold truncate ${rankStyle?.text ?? ''}`}>
                        {r.nickname}
                      </p>
                      {isCurrent && (
                        <span className="text-xs bg-purple-500/30 text-purple-300 px-2 py-0.5 rounded-full shrink-0">
                          나
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {r.correctCount}/{r.totalQuestions} 정답 · {r.accuracy}%
                    </p>
                  </div>

                  {/* Score + Date */}
                  <div className="text-right shrink-0">
                    <p className={`text-xl font-bold ${rankStyle?.text ?? 'text-purple-400'}`}>
                      {r.score.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(r.date).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="mt-8">
          <button
            onClick={onBack}
            className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 rounded-xl font-bold transition-colors focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 focus-visible:outline-none"
          >
            돌아가기
          </button>
        </div>
      </div>
    </div>
  )
})
