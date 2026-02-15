import { useReducer, useEffect, useMemo, useCallback } from 'react'
import type { GameState, Category, CategoryScore, AnswerRecord, PlayerResult } from '@/types'
import { questions, CATEGORIES } from '@/data/questions'
import { calculateScore, MAX_TIME } from '@/utils/scoring'

interface QuizState {
  gameState: GameState
  nickname: string
  currentQuestionIndex: number
  score: number
  answers: AnswerRecord[]
  timer: number
  answered: boolean
  selectedAnswer: number
}

type Action =
  | { type: 'START_GAME'; nickname: string }
  | { type: 'ANSWER_QUESTION'; selected: number }
  | { type: 'NEXT_QUESTION' }
  | { type: 'CHANGE_CATEGORY' }
  | { type: 'RESET_GAME' }
  | { type: 'TICK_TIMER' }
  | { type: 'SHOW_RANKING' }
  | { type: 'SHOW_RESULT' }

const initialState: QuizState = {
  gameState: 'start',
  nickname: '',
  currentQuestionIndex: 0,
  score: 0,
  answers: [],
  timer: MAX_TIME,
  answered: false,
  selectedAnswer: -1,
}

function reducer(state: QuizState, action: Action): QuizState {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...initialState,
        gameState: 'playing',
        nickname: action.nickname,
        timer: MAX_TIME,
      }

    case 'TICK_TIMER':
      if (state.answered || state.timer <= 0) return state
      return { ...state, timer: state.timer - 1 }

    case 'ANSWER_QUESTION': {
      if (state.answered) return state
      const question = questions[state.currentQuestionIndex]
      if (!question) return state
      const correct = action.selected === question.answer
      const scoreGained = calculateScore(correct, state.timer)
      const record: AnswerRecord = {
        questionId: question.id,
        selected: action.selected,
        correct,
        score: scoreGained,
        timeRemaining: state.timer,
      }
      return {
        ...state,
        answered: true,
        selectedAnswer: action.selected,
        score: state.score + scoreGained,
        answers: [...state.answers, record],
      }
    }

    case 'NEXT_QUESTION': {
      const nextIndex = state.currentQuestionIndex + 1
      if (nextIndex >= questions.length) {
        return { ...state, gameState: 'result' }
      }
      const currentCat = Math.floor(state.currentQuestionIndex / 10)
      const nextCat = Math.floor(nextIndex / 10)
      if (nextCat !== currentCat) {
        return { ...state, gameState: 'category-transition' }
      }
      return {
        ...state,
        currentQuestionIndex: nextIndex,
        timer: MAX_TIME,
        answered: false,
        selectedAnswer: -1,
      }
    }

    case 'CHANGE_CATEGORY': {
      const nextIndex = state.currentQuestionIndex + 1
      return {
        ...state,
        gameState: 'playing',
        currentQuestionIndex: nextIndex,
        timer: MAX_TIME,
        answered: false,
        selectedAnswer: -1,
      }
    }

    case 'RESET_GAME':
      return initialState

    case 'SHOW_RANKING':
      return { ...state, gameState: 'ranking' }

    case 'SHOW_RESULT':
      return { ...state, gameState: 'result' }

    default:
      return state
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Timer tick
  useEffect(() => {
    if (state.gameState !== 'playing' || state.answered) return
    const interval = setInterval(() => dispatch({ type: 'TICK_TIMER' }), 1000)
    return () => clearInterval(interval)
  }, [state.gameState, state.answered])

  // Auto wrong on timeout
  useEffect(() => {
    if (state.gameState === 'playing' && !state.answered && state.timer <= 0) {
      dispatch({ type: 'ANSWER_QUESTION', selected: -1 })
    }
  }, [state.timer, state.gameState, state.answered])

  // Auto advance 1.5s after answering
  useEffect(() => {
    if (!state.answered) return
    const timeout = setTimeout(() => dispatch({ type: 'NEXT_QUESTION' }), 1500)
    return () => clearTimeout(timeout)
  }, [state.answered, state.currentQuestionIndex])

  const currentQuestion = questions[state.currentQuestionIndex] ?? null
  const currentCategory: Category = currentQuestion?.category ?? CATEGORIES[0]
  const categoryQuestionIndex = state.currentQuestionIndex % 10

  const categoryScores: CategoryScore[] = useMemo(() => {
    return CATEGORIES.map((category) => {
      const catQuestions = questions.filter((q) => q.category === category)
      const catAnswers = state.answers.filter((a) =>
        catQuestions.some((q) => q.id === a.questionId),
      )
      const correct = catAnswers.filter((a) => a.correct).length
      const totalScore = catAnswers.reduce((sum, a) => sum + a.score, 0)
      return { category, correct, total: catAnswers.length, score: totalScore }
    })
  }, [state.answers])

  const completedCategoryIndex = Math.floor(state.currentQuestionIndex / 10)
  const completedCategoryScore = categoryScores[completedCategoryIndex] ?? null
  const nextCategory: Category | null =
    completedCategoryIndex + 1 < CATEGORIES.length
      ? (CATEGORIES[completedCategoryIndex + 1] ?? null)
      : null

  const getResult = useCallback((): PlayerResult => {
    const correctCount = state.answers.filter((a) => a.correct).length
    return {
      nickname: state.nickname,
      score: state.score,
      correctCount,
      totalQuestions: questions.length,
      accuracy: Math.round((correctCount / questions.length) * 100),
      date: new Date().toISOString(),
      categoryScores,
    }
  }, [state.nickname, state.score, state.answers, categoryScores])

  const startGame = useCallback(
    (nickname: string) => dispatch({ type: 'START_GAME', nickname }),
    [],
  )
  const submitAnswer = useCallback(
    (selected: number) => dispatch({ type: 'ANSWER_QUESTION', selected }),
    [],
  )
  const continueToNextCategory = useCallback(
    () => dispatch({ type: 'CHANGE_CATEGORY' }),
    [],
  )
  const resetGame = useCallback(() => dispatch({ type: 'RESET_GAME' }), [])
  const showRanking = useCallback(() => dispatch({ type: 'SHOW_RANKING' }), [])
  const showResult = useCallback(() => dispatch({ type: 'SHOW_RESULT' }), [])

  return {
    gameState: state.gameState,
    nickname: state.nickname,
    currentQuestion,
    currentCategory,
    categoryQuestionIndex,
    currentQuestionIndex: state.currentQuestionIndex,
    totalQuestions: questions.length,
    score: state.score,
    timer: state.timer,
    answered: state.answered,
    selectedAnswer: state.selectedAnswer,
    answers: state.answers,
    categoryScores,
    completedCategoryScore,
    nextCategory,
    getResult,
    startGame,
    submitAnswer,
    continueToNextCategory,
    resetGame,
    showRanking,
    showResult,
  }
}
