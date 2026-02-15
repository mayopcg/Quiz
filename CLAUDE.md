# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # install dependencies
npm run dev          # start Vite dev server (http://localhost:5173)
npm run build        # type-check then build for production
npm run preview      # preview production build locally
npm run lint         # run ESLint
```

## Architecture

React + TypeScript SPA built with Vite. Korean general knowledge quiz game (상식왕 퀴즈) with 40 questions across 4 categories, Tailwind CSS styling, Recharts for result visualization.

### Game flow

`start` → `playing` → `category-transition` → (repeat ×4 categories) → `result` ↔ `ranking`

The `GameState` type drives which screen renders in `App.tsx` via a switch statement. No router.

### State management

`useGameState` hook uses `useReducer` with actions: `START_GAME`, `TICK_TIMER`, `ANSWER_QUESTION`, `NEXT_QUESTION`, `CHANGE_CATEGORY`, `RESET_GAME`, `SHOW_RANKING`, `SHOW_RESULT`.

Side effects handled via `useEffect` inside the hook:
- Timer: 1-second interval countdown (20s per question)
- Auto-wrong on timeout (timer reaches 0)
- Auto-advance 1.5s after answering

All dispatch wrapper functions are stabilized with `useCallback`.

### Scoring

- Correct: 100 base + (remaining seconds × 5) time bonus
- Wrong/timeout: 0 points
- Max per question: 200, max total: 8,000
- Grades: S(90%+)=상식왕, A(70%+)=상식 고수, B(50%+)=상식 중수, D(<50%)=더 공부해요

### Ranking

In-memory only (React state, no localStorage). Top 10 by score, sorted descending. Resets on page reload.

### Key files

- **`src/types/index.ts`** — All types: `QuizQuestion`, `Category`, `GameState`, `AnswerRecord`, `PlayerResult`, `CategoryScore`
- **`src/data/questions.ts`** — 40 questions (10 per category), `CATEGORIES` array
- **`src/hooks/useGameState.ts`** — Core game logic via useReducer + side effects
- **`src/hooks/useRanking.ts`** — In-memory top 10 ranking
- **`src/utils/scoring.ts`** — Score calculation constants
- **`src/components/`** — `StartScreen`, `QuizScreen`, `CategoryTransitionScreen`, `ResultScreen`, `RankingScreen`

### Category colors

한국사=#EF4444, 과학=#3B82F6, 지리=#22C55E, 일반상식=#8B5CF6

### Accessibility & UX

- Keyboard navigation: 1-4 keys to select answers during quiz
- Focus-visible ring styles on all interactive elements
- Browser back prevention during active game (popstate + beforeunload)
- Double-click prevention: buttons disabled after answering, reducer guards against duplicate answers
- Components wrapped with `React.memo` where beneficial

## Conventions

- Path alias: `@/` maps to `src/` (configured in `tsconfig.json` and `vite.config.ts`)
- Strict TypeScript: `noUnusedLocals`, `noUnusedParameters`, `noUncheckedIndexedAccess`
- Styling: Tailwind CSS utility classes only
- Custom animations in `src/index.css`: `animate-fadeIn`, `animate-slideUp`, `animate-pulse-ring`, `animate-highlight`
- All quiz content is in Korean

## 퀴즈 문제 교차 검증 가이드라인

모든 문제 작성 시 확인 사항
1. 정답이 하나뿐인가?
  - 다른 해석 가능 시 조건 명시
2. 최상급 표현에 기준이 있는가?
  - 가장 큰, 최초의 등 표현에 측정 기준 명시
3. 시간과 범위가 명확한가?
  - 변할 수 있는 정보는 시점 명시
  - 지리적, 분류적 범위 한정
4. 교차 검증했는가?
  - 의심스러운 정보는 시점 명시
  - 논란 있는 내용은 주류 학설 기준