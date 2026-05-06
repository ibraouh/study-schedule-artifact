# Summer 2026 Study Planner

Interactive 14-week study planner for ESE 5420 (Stats for DS) and CIS 5450 (Big Data Analytics).

## Features

- Pre-populated schedule with default rhythm (CIS lectures Mon/Wed/Fri AM, ESE Tue/Thu AM, alternating HW evenings)
- All deadlines from both course syllabi marked on the calendar
- Drag-and-drop blocks between days to reschedule
- Click-to-edit any block's course, activity, duration, or notes
- Add custom blocks for non-school activities
- Mark blocks done; live tracking of hours completed
- Spike-week highlighting for exam/project crunches
- Data persists to browser localStorage

## Local development

```bash
npm install
npm run dev
```

Then visit http://localhost:5173

## Deploy to Vercel

```bash
npm install
vercel
```

Or push to GitHub and import in the Vercel dashboard.

## Notes

Storage is browser-local — your edits stay on the device/browser you use, but won't sync across devices. To get cross-device sync, you'd need to add a backend (Supabase is a clean fit).
