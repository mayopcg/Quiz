export type Category = '한국사' | '과학' | '지리' | '일반상식'

export interface QuizQuestion {
  id: number
  category: Category
  question: string
  options: [string, string, string, string]
  answer: number
  explanation: string
}

export type GameState = 'start' | 'playing' | 'category-transition' | 'result' | 'ranking'

export interface CategoryScore {
  category: Category
  correct: number
  total: number
  score: number
}

export interface AnswerRecord {
  questionId: number
  selected: number
  correct: boolean
  score: number
  timeRemaining: number
}

export interface PlayerResult {
  nickname: string
  score: number
  correctCount: number
  totalQuestions: number
  accuracy: number
  date: string
  categoryScores: CategoryScore[]
}
