# Study Planner — Project Notes

A React + Vite single-page app for Abe's UPenn summer 2026 schedule (ESE 5420 + CIS 5450). Hosted on Vercel, persisted to Upstash Redis. The whole app is essentially [src/StudyPlanner.jsx](src/StudyPlanner.jsx) — a deliberately monolithic component with inline `<style>`.

## Stack

- React 18 + Vite, no router, no state library
- `lucide-react` for icons
- `@upstash/redis` for persistence
- Vercel serverless function at [api/schedule.js](api/schedule.js) — single GET/PUT endpoint reading/writing one JSON blob under key `summer2026-schedule`
- Reads env vars `KV_REST_API_URL` / `KV_REST_API_TOKEN` (auto-injected by the Vercel marketplace Upstash integration). Falls back to `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` if those names are used instead.
- Frontend keeps a `localStorage` cache for fast paint + offline fallback. Server saves are debounced 600ms; `beforeunload` flushes via `sendBeacon`.

## Schedule data model

A block looks like:
```js
{
  id, slot, course, activity, detail, duration, done, originalDate,
  // optional, set by generator or user:
  lectureNum, hwNum, quizNum, link, optional, spike, custom,
}
```

- `slot`: `'morning' | 'evening' | 'weekend' | 'custom'` — primary sort key (lectures before homework before push before custom). `originalDate` is the secondary sort key so overdue work floats to the top within each slot group.
- `originalDate` is the day the block was first generated for; used for sort tiebreaks AND for falling back to derive `hwNum`/`quizNum` when those fields aren't on legacy persisted blocks.
- `course`: `'ESE' | 'CIS' | 'BOTH'`. Friday catch-up blocks use `BOTH`.
- `link`: optional manual URL. Wins over auto-derived links.

## Course links

Canvas IDs live in [src/StudyPlanner.jsx](src/StudyPlanner.jsx) under the **COURSE LINK CONFIG** section. The patterns:

- **CIS lectures + HWs are sequential** — `cisLectureUrl(n)` and `cisHwUrl(n)` use arithmetic on a base ID. CIS HW0 is a special case (one ID below the formula's base).
- **ESE lectures, HWs, quizzes are non-sequential** — explicit `ESE_LECTURE_IDS`, `ESE_HW_IDS`, `ESE_QUIZ_IDS` lookup tables.
- **CIS quizzes have no auto-link** (topic-named, random IDs). Set per-block manually.
- **Deadline pills** (the colored exam/HW/project labels at the top of each day) become clickable links via `deriveDeadlineLink(deadline)` when a URL is known.

### Coverage gaps as of 2026-05-06

These tasks have **no Canvas page** (group exists in Canvas but is empty / not yet published) — they render as plain non-clickable pills:

- ESE Exam 1 (6/26–6/28), Exam 2 (8/7–8/9)
- CIS Midterm 1 (6/18–6/21), Midterm 2 (8/7–8/9)
- CIS Honorlock Practice (6/11)
- CIS Project Mid-Check (7/26) — no assignment exists, only Proposal + Final do

If/when these get published, ask the user to run the same browser-Claude prompt pattern to fetch the URLs and add them to the link config.

## Visual conventions

- Body font is `'AppDigits', system-fonts` — `AppDigits` is a `@font-face` with `unicode-range: U+0030-0039, U+002E` pointing at JetBrains Mono. So digits + decimal points everywhere render in the coding font automatically.
- `.mono` class — full JetBrains Mono, used for number+unit pairs like `1.5h`, `(1.5 hr)`. Whole span renders mono so the unit doesn't mismatch.
- `.no-mono` class — explicit sans-serif override. Used on the activity name span so labels like `HW1` render uniformly (without the digit override mismatch).
- Title uses Space Grotesk 700.
- Block type tag (`LEC` / `HW` / `QUIZ` / `PUSH`) leads the header row before the course label.
- Border style on each block encodes type: solid (lecture), dashed (homework), dotted (quiz), double (push).
- Deadline pill colors: red (exam), purple (homework), teal (project) — chosen to avoid colliding with course palettes (ESE = burnt orange, CIS = navy).

## Workflow

- Default branch is `main`. **Direct push to main is hook-blocked** — even `git cherry-pick` onto main + push is blocked. Route everything through PRs.
- `gh` CLI is authenticated as `ibraouh` with `repo` scope. Use `gh pr create` + `gh pr merge <n> --merge` to ship changes.
- Vercel auto-deploys main to production. Feature branches get preview deploys.
- Worktrees in use — primary working tree is `.claude/worktrees/sad-gauss-912037` on branch `claude/sad-gauss-912037`. Main worktree is at the parent directory.
- The repo is `ibraouh/study-schedule-artifact` on GitHub.

## Pending / things to consider next

- Wire late-semester homework blocks (after the last HW deadline) to fall back to the previous HW.
- Make Friday catch-up blocks link to the current week's ESE quiz.
- Project deliverable URLs for CIS Proposal + Final are in `CIS_PROJECT_LINKS` and wired into deadline pills, but if you ever surface the project as its own block type, reuse those constants.
