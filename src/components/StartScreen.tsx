import { useState } from 'react'

interface StartScreenProps {
  onStart: (nickname: string) => void
  onShowRanking: () => void
}

const CATEGORY_INFO = [
  { name: '한국사', color: '#EF4444', icon: '📜', desc: '고조선부터 현대사까지' },
  { name: '과학', color: '#3B82F6', icon: '🔬', desc: '물리·화학·생물·지구과학' },
  { name: '지리', color: '#22C55E', icon: '🌍', desc: '한국 지리 + 세계 지리' },
  { name: '일반상식', color: '#8B5CF6', icon: '💡', desc: '문화·스포츠·IT·경제' },
]

export function StartScreen({ onStart, onShowRanking }: StartScreenProps) {
  const [name, setName] = useState('')
  const trimmed = name.trim()
  const isValid = trimmed.length >= 2 && trimmed.length <= 10

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isValid) onStart(trimmed)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-lg space-y-8 animate-slideUp">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl font-black mb-3 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            상식왕 퀴즈
          </h1>
          <p className="text-gray-400 text-lg">당신의 상식을 테스트하세요!</p>
        </div>

        {/* Rules card */}
        <div className="bg-gray-800 rounded-2xl p-5 space-y-4">
          <h2 className="font-bold text-lg text-center">게임 규칙</h2>

          <div className="grid grid-cols-2 gap-3">
            {CATEGORY_INFO.map((cat) => (
              <div
                key={cat.name}
                className="rounded-lg p-3 border border-gray-700 text-center"
                style={{ borderColor: cat.color + '40' }}
              >
                <p className="text-2xl mb-1">{cat.icon}</p>
                <p className="font-semibold text-sm" style={{ color: cat.color }}>
                  {cat.name}
                </p>
                <p className="text-gray-500 text-xs mt-0.5">{cat.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div className="bg-gray-700/50 rounded-lg p-2.5">
              <p className="text-white font-bold text-lg">40</p>
              <p className="text-gray-400">문제</p>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-2.5">
              <p className="text-white font-bold text-lg">20초</p>
              <p className="text-gray-400">제한시간</p>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-2.5">
              <p className="text-white font-bold text-lg">8,000</p>
              <p className="text-gray-400">최대점수</p>
            </div>
          </div>

          <p className="text-xs text-gray-500 text-center">
            정답 100점 + 남은 시간 보너스 (초당 5점, 최대 100점)
          </p>
        </div>

        {/* Nickname input */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="닉네임 (2~10자)"
              maxLength={10}
              className="w-full px-4 py-3.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-center text-lg"
            />
            {trimmed.length > 0 && trimmed.length < 2 && (
              <p className="text-red-400 text-xs mt-1 text-center">2자 이상 입력해주세요</p>
            )}
          </div>
          <button
            type="submit"
            disabled={!isValid}
            className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:text-gray-500 rounded-xl font-bold text-lg transition-colors"
          >
            게임 시작
          </button>
        </form>

        <button
          onClick={onShowRanking}
          className="w-full text-center text-gray-400 hover:text-purple-400 transition-colors py-2"
        >
          순위표 보기
        </button>
      </div>
    </div>
  )
}
