import { useRef, useEffect, useCallback } from 'react'
import { useGameState } from '@/hooks/useGameState'
import { useRanking } from '@/hooks/useRanking'
import { StartScreen } from '@/components/StartScreen'
import { QuizScreen } from '@/components/QuizScreen'
import { CategoryTransitionScreen } from '@/components/CategoryTransitionScreen'
import { ResultScreen } from '@/components/ResultScreen'
import { RankingScreen } from '@/components/RankingScreen'

export default function App() {
  const game = useGameState()
  const { rankings, addResult } = useRanking()
  const resultSaved = useRef(false)
  const lastResultDate = useRef<string | null>(null)

  // Browser back prevention during game
  useEffect(() => {
    if (game.gameState === 'start') return

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
    }

    window.history.pushState(null, '', window.location.href)
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href)
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('popstate', handlePopState)
    }
  }, [game.gameState])

  const handleShowResult = useCallback(() => {
    if (!resultSaved.current) {
      const result = game.getResult()
      lastResultDate.current = result.date
      addResult(result)
      resultSaved.current = true
    }
  }, [game.getResult, addResult])

  const handleRestart = useCallback(() => {
    resultSaved.current = false
    lastResultDate.current = null
    game.resetGame()
  }, [game.resetGame])

  const handleStart = useCallback(
    (name: string) => {
      resultSaved.current = false
      lastResultDate.current = null
      game.startGame(name)
    },
    [game.startGame],
  )

  const handleRankingBack = useCallback(() => {
    if (game.answers.length > 0) {
      game.showResult()
    } else {
      game.resetGame()
    }
  }, [game.answers.length, game.showResult, game.resetGame])

  switch (game.gameState) {
    case 'start':
      return <StartScreen onStart={handleStart} onShowRanking={game.showRanking} />

    case 'playing':
      if (!game.currentQuestion) return null
      return (
        <QuizScreen
          question={game.currentQuestion}
          questionIndex={game.categoryQuestionIndex}
          totalInCategory={10}
          globalIndex={game.currentQuestionIndex}
          totalQuestions={game.totalQuestions}
          category={game.currentCategory}
          score={game.score}
          timer={game.timer}
          answered={game.answered}
          selectedAnswer={game.selectedAnswer}
          onAnswer={game.submitAnswer}
        />
      )

    case 'category-transition':
      if (!game.completedCategoryScore) return null
      return (
        <CategoryTransitionScreen
          completedScore={game.completedCategoryScore}
          nextCategory={game.nextCategory}
          onContinue={game.continueToNextCategory}
        />
      )

    case 'result': {
      handleShowResult()
      return (
        <ResultScreen
          result={game.getResult()}
          answers={game.answers}
          onRestart={handleRestart}
          onShowRanking={game.showRanking}
        />
      )
    }

    case 'ranking':
      return (
        <RankingScreen
          rankings={rankings}
          currentResultDate={lastResultDate.current}
          onBack={handleRankingBack}
        />
      )
  }
}
