# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build (type-checks + compile)
npm run start    # Start production server
npm run lint     # ESLint
```

## Architecture

**Tech stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, html2canvas

**Three-page flow:**
- `/` (app/page.tsx) — Start screen: name/grade input, stores to `localStorage`
- `/game` (app/game/page.tsx) — Game loop: cycles through 6 scenes with story → choices → feedback state machine
- `/report` (app/report/page.tsx) — Results: reads `localStorage`, renders report card, exports PNG via html2canvas

**Game data lives entirely in `data/scenes.ts`** — all 6 scenes (1부~6부), each with story paragraphs, two choices (one correct, one wrong), feedback text, and a lesson. `GameResult` type is also exported from here.

**State flow:** `localStorage` keys `playerName`, `playerGrade`, and `gameResults` (JSON array of `GameResult`) connect the three pages. No global state manager; each page reads/writes localStorage on mount.

**Colors:** Each scene has a `color` object (`primary`, `light`, `text`, `border` as hex strings) used via `style={}` props — not Tailwind dynamic classes — to avoid purge issues.

## Deployment

Deploy to Vercel: connect the repo and Vercel auto-detects Next.js. No environment variables required.

## Content

The 6 scenes map to the 6 AI ethics principles from the source MD files:
| 부 | Principle | Color |
|----|-----------|-------|
| 1부 | AI와 우리의 약속 (할루시네이션/비판적 사고) | Blue |
| 2부 | AI의 주도성 (사고의 위임 방지) | Purple |
| 3부 | AI의 합목적성 (재미 vs 목적) | Green |
| 4부 | AI의 포용성 (디지털 격차, 친구 돕기) | Pink |
| 5부 | AI의 안전성 (개인정보 보호) | Amber |
| 6부 | AI의 투명성 (AI 사용 솔직히 밝히기) | Teal |

To change game content, edit `data/scenes.ts` only. To add scenes, append to the `scenes` array and update progress calculations if needed.
