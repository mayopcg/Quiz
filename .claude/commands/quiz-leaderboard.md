순위 시스템 관련 코드를 분석하고 현황을 보고해 주세요.

## 분석 대상 파일

- `src/hooks/useRanking.ts` — 순위 데이터 관리 훅
- `src/components/RankingScreen.tsx` — 순위 화면 UI
- `src/components/ResultScreen.tsx` — 결과 화면 (순위 연동)
- `src/hooks/useGameState.ts` — 게임 상태 (SHOW_RANKING 액션)
- `src/types/index.ts` — PlayerResult, CategoryScore 타입

## 작업 절차

### 1단계: 순위 시스템 구성 분석

위 파일들을 읽고 현재 순위 시스템의 구성을 분석합니다.

```
## 순위 시스템 현황

| 항목 | 현재 상태 |
|------|----------|
| 저장 방식 | (인메모리 / localStorage / 서버) |
| 최대 순위 수 | |
| 정렬 기준 | |
| 데이터 영속성 | (새로고침 시 유지 여부) |
| 동점 처리 | (처리 방식 또는 미구현) |
```

### 2단계: 데이터 흐름 추적

게임 종료부터 순위 등록까지의 데이터 흐름을 추적합니다.

```
## 데이터 흐름

1. 게임 종료 → (어떤 컴포넌트에서 어떤 함수 호출)
2. 결과 생성 → (PlayerResult 생성 경로)
3. 순위 등록 → (addResult 호출 위치)
4. 순위 표시 → (RankingScreen 렌더링 조건)
```

### 3단계: PlayerResult 필드 활용도

PlayerResult의 각 필드가 순위 시스템에서 어떻게 사용되는지 분석합니다.

```
## PlayerResult 필드 활용도

| 필드 | 타입 | 정렬 사용 | 화면 표시 | 미사용 |
|------|------|----------|----------|--------|
| nickname | string | | | |
| score | number | | | |
| correctCount | number | | | |
| totalQuestions | number | | | |
| accuracy | number | | | |
| date | string | | | |
| categoryScores | CategoryScore[] | | | |
```

### 4단계: UI 기능 점검

RankingScreen의 UI 기능을 점검합니다.

```
## UI 기능 점검

| 기능 | 구현 상태 | 비고 |
|------|----------|------|
| 순위 표시 (1~10위) | | |
| 상위 3위 스타일 구분 | | |
| 현재 플레이어 하이라이트 | | |
| 빈 상태 안내 | | |
| 돌아가기 버튼 | | |
| 접근성 (키보드/포커스) | | |
```

### 5단계: 개선 가능 사항

분석 결과를 바탕으로 개선할 수 있는 부분을 제안합니다. 각 제안에 구현 난이도(상/중/하)를 표기합니다.

```
## 개선 제안

| # | 제안 내용 | 난이도 | 설명 |
|---|----------|-------|------|
| 1 | | | |
```

개선 제안은 현재 코드에서 실제로 부족한 부분만 언급합니다. 과도한 기능 추가는 제안하지 않습니다.
