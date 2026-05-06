import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2, Check, Clock, AlertCircle, BookOpen, Code2, RotateCcw, Edit3 } from 'lucide-react';

// ============================================================
// COURSE DATA — from Abe's syllabi & Canvas modules
// ============================================================

const COURSES = {
  ESE: {
    id: 'ESE',
    code: 'ESE 5420',
    name: 'Stats for DS',
    color: '#c2410c', // burnt orange
    accent: '#fed7aa',
  },
  CIS: {
    id: 'CIS',
    code: 'CIS 5450',
    name: 'Big Data Analytics',
    color: '#1e3a8a', // deep navy
    accent: '#bfdbfe',
  },
};

// Module → lecture minutes (from earlier analysis)
const ESE_MODULES = [
  { num: 1, title: 'Intro & Probability Review', lectureMin: 65 },
  { num: 2, title: 'Statistical Estimation & CLT', lectureMin: 53 },
  { num: 3, title: 'Confidence Intervals & Point Estimation', lectureMin: 63 },
  { num: 4, title: 'Method of Moments & MLE', lectureMin: 59 },
  { num: 5, title: 'MLE Properties, Large Sample Theory', lectureMin: 55 },
  { num: 6, title: 'Hypothesis Testing Intro', lectureMin: 69 },
  { num: 7, title: 'P-Value & Likelihood Ratio Test', lectureMin: 65 },
  { num: 8, title: 'Regression', lectureMin: 58 },
  { num: 9, title: 'Classification & Cross-Validation', lectureMin: 60 },
  { num: 10, title: 'LDA & QDA', lectureMin: 53 },
  { num: 11, title: 'Clustering & K-Means', lectureMin: 46 },
  { num: 12, title: 'Dimensionality Reduction, SVD, PCA', lectureMin: 67 },
  { num: 13, title: 'Statistical Learning Theory', lectureMin: 53 },
  { num: 14, title: 'PAC Learning & VC Dimension', lectureMin: 62 },
];

const CIS_MODULES = [
  { num: 1, title: 'Intro to Big Data; Data Wrangling', lectureMin: 84 },
  { num: 2, title: 'Combining Dataframes; Record Linking', lectureMin: 85 },
  { num: 3, title: 'Text Processing & Modeling', lectureMin: 124 },
  { num: 4, title: 'Computing over Data; Cluster Processing', lectureMin: 133 },
  { num: 5, title: 'Big Data & Cloud; Graph Data', lectureMin: 105 },
  { num: 6, title: 'PageRank, Matrices, Statistical Tests', lectureMin: 101 },
  { num: 7, title: 'Visualization & Data Ethics', lectureMin: 53 },
  { num: 8, title: 'Unsupervised ML', lectureMin: 100 },
  { num: 9, title: 'Classification & Regression', lectureMin: 112 },
  { num: 10, title: 'Better ML Models; Neural Networks', lectureMin: 117 },
  { num: 11, title: 'CNNs; Stream Processing', lectureMin: 114 },
  { num: 12, title: 'Tuple Streams; Time-Varying Data', lectureMin: 96 },
  { num: 13, title: 'Distributed Big Data; Persistence', lectureMin: 83 },
  { num: 14, title: 'Pulling Things Together / Midterm 2', lectureMin: 0 },
];

// Deadlines from both syllabi (date format: YYYY-MM-DD)
const DEADLINES = [
  // ESE 5420
  { date: '2026-05-11', course: 'ESE', label: 'HW1 + Quiz 1 due', type: 'hw' },
  { date: '2026-05-18', course: 'ESE', label: 'HW2 + Quiz 2 due', type: 'hw' },
  { date: '2026-05-26', course: 'ESE', label: 'HW3 + Quiz 3 due', type: 'hw' },
  { date: '2026-06-01', course: 'ESE', label: 'HW4 + Quiz 4 due', type: 'hw' },
  { date: '2026-06-08', course: 'ESE', label: 'HW5 + Quiz 5 due', type: 'hw' },
  { date: '2026-06-15', course: 'ESE', label: 'HW6 + Quiz 6 due', type: 'hw' },
  { date: '2026-06-22', course: 'ESE', label: 'HW7 + Quiz 7 due', type: 'hw' },
  { date: '2026-06-26', course: 'ESE', label: 'Exam 1 available', type: 'exam' },
  { date: '2026-06-28', course: 'ESE', label: 'Exam 1 DUE', type: 'exam' },
  { date: '2026-06-29', course: 'ESE', label: 'Quiz 8 due', type: 'quiz' },
  { date: '2026-07-06', course: 'ESE', label: 'HW8 + Quiz 9 due', type: 'hw' },
  { date: '2026-07-13', course: 'ESE', label: 'HW9 + Quiz 10 due', type: 'hw' },
  { date: '2026-07-20', course: 'ESE', label: 'HW10 + Quiz 11 due', type: 'hw' },
  { date: '2026-07-27', course: 'ESE', label: 'HW11 + Quiz 12 due', type: 'hw' },
  { date: '2026-08-03', course: 'ESE', label: 'Quiz 13 due', type: 'quiz' },
  { date: '2026-08-07', course: 'ESE', label: 'Exam 2 available', type: 'exam' },
  { date: '2026-08-09', course: 'ESE', label: 'Exam 2 DUE', type: 'exam' },
  // CIS 5450
  { date: '2026-05-12', course: 'CIS', label: 'HW0 due', type: 'hw' },
  { date: '2026-05-26', course: 'CIS', label: 'HW1 due', type: 'hw' },
  { date: '2026-05-29', course: 'CIS', label: 'HW1 Extra Credit due', type: 'hw' },
  { date: '2026-06-09', course: 'CIS', label: 'HW2 due', type: 'hw' },
  { date: '2026-06-11', course: 'CIS', label: 'Honorlock Practice Exam opens', type: 'exam' },
  { date: '2026-06-18', course: 'CIS', label: 'Midterm 1 opens', type: 'exam' },
  { date: '2026-06-21', course: 'CIS', label: 'Midterm 1 DUE', type: 'exam' },
  { date: '2026-06-23', course: 'CIS', label: 'HW3 due; Project assigned', type: 'hw' },
  { date: '2026-07-07', course: 'CIS', label: 'HW4 due', type: 'hw' },
  { date: '2026-07-13', course: 'CIS', label: 'Project Proposal due', type: 'project' },
  { date: '2026-07-21', course: 'CIS', label: 'HW5 due', type: 'hw' },
  { date: '2026-07-26', course: 'CIS', label: 'Project Mid-Check due', type: 'project' },
  { date: '2026-08-07', course: 'CIS', label: 'Midterm 2 opens', type: 'exam' },
  { date: '2026-08-08', course: 'CIS', label: 'Course Project DUE', type: 'project' },
  { date: '2026-08-09', course: 'CIS', label: 'Midterm 2 DUE', type: 'exam' },
];

// ============================================================
// DATE UTILITIES
// ============================================================

const SEMESTER_START = new Date('2026-05-04T00:00:00'); // Monday
const SEMESTER_END = new Date('2026-08-09T23:59:59');

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function fmtDate(date) {
  return date.toISOString().split('T')[0];
}

function fmtShort(date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function fmtDay(date) {
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Monday = start
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getAllWeeks() {
  const weeks = [];
  let cursor = getWeekStart(SEMESTER_START);
  let weekNum = 1;
  while (cursor <= SEMESTER_END) {
    weeks.push({
      num: weekNum,
      start: new Date(cursor),
      end: addDays(cursor, 6),
    });
    cursor = addDays(cursor, 7);
    weekNum++;
  }
  return weeks;
}

// ============================================================
// DEFAULT SCHEDULE GENERATOR
// Matches the strategy discussed:
//  - Mornings (1.5 hr): lectures - alternate CIS/ESE/CIS/ESE/CIS
//  - Evenings (1.5 hr): homework on whichever has nearest deadline
//  - Weekends: light, only during spike weeks
// ============================================================

function getModuleForWeek(weekNum, courseId) {
  // Both courses have ~14 modules over the 14-15 week semester
  const modules = courseId === 'ESE' ? ESE_MODULES : CIS_MODULES;
  const moduleIdx = Math.min(weekNum - 1, modules.length - 1);
  return modules[moduleIdx];
}

function getDeadlinesInWeek(weekStart) {
  const weekEnd = addDays(weekStart, 6);
  return DEADLINES.filter(d => {
    const dDate = new Date(d.date + 'T00:00:00');
    return dDate >= weekStart && dDate <= weekEnd;
  });
}

function generateDefaultSchedule() {
  const schedule = {};
  const weeks = getAllWeeks();

  weeks.forEach((week, weekIdx) => {
    const weekNum = weekIdx + 1;
    const eseModule = getModuleForWeek(weekNum, 'ESE');
    const cisModule = getModuleForWeek(weekNum, 'CIS');
    const weekDeadlines = getDeadlinesInWeek(week.start);

    // Identify spike weeks for weekend bumps
    const hasExam = weekDeadlines.some(d => d.type === 'exam' || d.type === 'project');
    const hwCount = weekDeadlines.filter(d => d.type === 'hw').length;
    const isSpike = hasExam || hwCount >= 2;

    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const day = addDays(week.start, dayOffset);
      const dateKey = fmtDate(day);
      const dayOfWeek = day.getDay(); // 0=Sun, 1=Mon... 6=Sat
      const blocks = [];

      // Weekday pattern: Mon-Fri
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        // Morning lecture: alternate Mon/Wed/Fri = CIS, Tue/Thu = ESE
        // (CIS gets 3 mornings because it has 70% more lecture content)
        const isCISMorning = dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5;
        const morningCourse = isCISMorning ? 'CIS' : 'ESE';
        const morningModule = isCISMorning ? cisModule : eseModule;

        blocks.push({
          id: `${dateKey}-am`,
          slot: 'morning',
          course: morningCourse,
          activity: 'Lectures',
          detail: `Module ${morningModule.num}: ${morningModule.title}`,
          duration: 1.5,
          done: false,
          originalDate: dateKey,
        });

        // Evening homework: alternate too, but bias toward course with nearest deadline
        const eveningCourse = dayOfWeek === 5 ? null : (isCISMorning ? 'ESE' : 'CIS');
        const eveningModule = eveningCourse === 'CIS' ? cisModule : eseModule;

        if (dayOfWeek === 5) {
          // Friday evening: light - quizzes or off
          blocks.push({
            id: `${dateKey}-pm`,
            slot: 'evening',
            course: 'BOTH',
            activity: 'Quizzes / Catch-up',
            detail: 'Light: weekly quizzes, review notes, or rest',
            duration: 1.0,
            done: false,
            optional: true,
            originalDate: dateKey,
          });
        } else {
          blocks.push({
            id: `${dateKey}-pm`,
            slot: 'evening',
            course: eveningCourse,
            activity: 'Homework',
            detail: `${eveningCourse === 'ESE' ? 'ESE' : 'CIS'} HW work`,
            duration: 1.5,
            done: false,
            originalDate: dateKey,
          });
        }
      }

      // Weekends: minimum, only on spike weeks
      if ((dayOfWeek === 6 || dayOfWeek === 0) && isSpike) {
        // Saturday on spike weeks
        if (dayOfWeek === 6) {
          const focus = weekDeadlines.find(d => d.type === 'exam' || d.type === 'project')?.course
                     || weekDeadlines.find(d => d.type === 'hw')?.course
                     || 'CIS';
          blocks.push({
            id: `${dateKey}-spike`,
            slot: 'weekend',
            course: focus,
            activity: 'Spike Week Push',
            detail: 'Catch up on whichever has the nearest deadline',
            duration: 3.0,
            done: false,
            spike: true,
            originalDate: dateKey,
          });
        }
      }

      schedule[dateKey] = blocks;
    }
  });

  return schedule;
}

// ============================================================
// MAIN COMPONENT
// ============================================================

const STORAGE_KEY = 'summer2026-schedule';

function backfillOriginalDate(parsed) {
  Object.keys(parsed).forEach(dateKey => {
    parsed[dateKey] = (parsed[dateKey] || []).map(b =>
      b.originalDate ? b : { ...b, originalDate: dateKey }
    );
  });
  return parsed;
}

export default function StudyPlanner() {
  const allWeeks = useMemo(() => getAllWeeks(), []);
  const [currentWeekIdx, setCurrentWeekIdx] = useState(0);
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(true);
  const [editingBlock, setEditingBlock] = useState(null);
  const [draggedBlock, setDraggedBlock] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [syncStatus, setSyncStatus] = useState('idle'); // 'idle' | 'saving' | 'error'

  const saveTimerRef = useRef(null);
  const inFlightRef = useRef(null);

  // Load: fetch from server, fall back to localStorage cache, then to fresh defaults.
  useEffect(() => {
    let cancelled = false;
    async function load() {
      // Paint quickly from cache if present.
      let cached = null;
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) cached = backfillOriginalDate(JSON.parse(stored));
      } catch (e) {
        console.error('Cache read failed:', e);
      }
      if (cached && !cancelled) setSchedule(cached);

      try {
        const res = await fetch('/api/schedule');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const { schedule: remote } = await res.json();
        if (cancelled) return;

        if (remote && typeof remote === 'object') {
          const filled = backfillOriginalDate(remote);
          setSchedule(filled);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(filled));
        } else if (!cached) {
          // Empty DB and no cache — seed with defaults and push.
          const fresh = generateDefaultSchedule();
          setSchedule(fresh);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
          queueSave(fresh);
        }
      } catch (e) {
        console.error('Server load failed, using cache:', e);
        if (!cached && !cancelled) {
          const fresh = generateDefaultSchedule();
          setSchedule(fresh);
          try { localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh)); } catch {}
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  async function pushToServer(snapshot) {
    setSyncStatus('saving');
    try {
      const res = await fetch('/api/schedule', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schedule: snapshot }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSyncStatus('idle');
    } catch (e) {
      console.error('Server save failed:', e);
      setSyncStatus('error');
    }
  }

  function queueSave(snapshot) {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      inFlightRef.current = pushToServer(snapshot);
    }, 600);
  }

  // Optimistic local update + cache + debounced server save.
  const saveSchedule = (newSchedule) => {
    setSchedule(newSchedule);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSchedule));
    } catch (e) {
      console.error('Cache write failed:', e);
    }
    queueSave(newSchedule);
  };

  // Flush pending save on tab close so the last edit isn't lost.
  useEffect(() => {
    const flush = () => {
      if (!saveTimerRef.current) return;
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
      try {
        const blob = new Blob(
          [JSON.stringify({ schedule })],
          { type: 'application/json' }
        );
        navigator.sendBeacon?.('/api/schedule', blob);
      } catch (e) {
        console.error('Beacon flush failed:', e);
      }
    };
    window.addEventListener('beforeunload', flush);
    return () => window.removeEventListener('beforeunload', flush);
  }, [schedule]);

  const currentWeek = allWeeks[currentWeekIdx];
  const weekDays = useMemo(() => {
    if (!currentWeek) return [];
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = addDays(currentWeek.start, i);
      days.push({
        date: day,
        dateKey: fmtDate(day),
        blocks: schedule[fmtDate(day)] || [],
        deadlines: DEADLINES.filter(d => d.date === fmtDate(day)),
      });
    }
    return days;
  }, [currentWeek, schedule]);

  const weekHours = useMemo(() => {
    let cis = 0, ese = 0;
    weekDays.forEach(d => {
      d.blocks.forEach(b => {
        if (b.course === 'CIS') cis += b.duration;
        else if (b.course === 'ESE') ese += b.duration;
        else if (b.course === 'BOTH') { cis += b.duration / 2; ese += b.duration / 2; }
      });
    });
    return { cis, ese, total: cis + ese };
  }, [weekDays]);

  const completedHours = useMemo(() => {
    let done = 0;
    weekDays.forEach(d => {
      d.blocks.forEach(b => {
        if (b.done) done += b.duration;
      });
    });
    return done;
  }, [weekDays]);

  const toggleDone = (dateKey, blockId) => {
    const newSchedule = { ...schedule };
    newSchedule[dateKey] = (newSchedule[dateKey] || []).map(b =>
      b.id === blockId ? { ...b, done: !b.done } : b
    );
    saveSchedule(newSchedule);
  };

  const deleteBlock = (dateKey, blockId) => {
    const newSchedule = { ...schedule };
    newSchedule[dateKey] = (newSchedule[dateKey] || []).filter(b => b.id !== blockId);
    saveSchedule(newSchedule);
  };

  const addBlock = (dateKey) => {
    const newBlock = {
      id: `${dateKey}-custom-${Date.now()}`,
      slot: 'custom',
      course: 'CIS',
      activity: 'Study',
      detail: 'New block',
      duration: 1.0,
      done: false,
      custom: true,
      originalDate: dateKey,
    };
    const newSchedule = { ...schedule };
    newSchedule[dateKey] = [...(newSchedule[dateKey] || []), newBlock];
    saveSchedule(newSchedule);
    setEditingBlock({ dateKey, blockId: newBlock.id });
  };

  const updateBlock = (dateKey, blockId, updates) => {
    const newSchedule = { ...schedule };
    newSchedule[dateKey] = (newSchedule[dateKey] || []).map(b =>
      b.id === blockId ? { ...b, ...updates } : b
    );
    saveSchedule(newSchedule);
  };

  const handleDragStart = (dateKey, block) => {
    setDraggedBlock({ dateKey, block });
  };

  const handleDrop = (targetDateKey) => {
    if (!draggedBlock || draggedBlock.dateKey === targetDateKey) {
      setDraggedBlock(null);
      return;
    }
    const newSchedule = { ...schedule };
    const movedBlock = {
      ...draggedBlock.block,
      id: `${targetDateKey}-moved-${Date.now()}`,
      originalDate: draggedBlock.block.originalDate || draggedBlock.dateKey,
    };
    newSchedule[draggedBlock.dateKey] = (newSchedule[draggedBlock.dateKey] || [])
      .filter(b => b.id !== draggedBlock.block.id);
    const targetBlocks = [...(newSchedule[targetDateKey] || []), movedBlock];
    targetBlocks.sort((a, b) => {
      const aDate = a.originalDate || targetDateKey;
      const bDate = b.originalDate || targetDateKey;
      return aDate.localeCompare(bDate);
    });
    newSchedule[targetDateKey] = targetBlocks;
    saveSchedule(newSchedule);
    setDraggedBlock(null);
  };

  const resetWeek = () => {
    setConfirmAction({
      title: 'Reset this week?',
      message: 'This will replace this week\'s schedule with the defaults. Your edits to other weeks stay untouched.',
      onConfirm: () => {
        const fresh = generateDefaultSchedule();
        const newSchedule = { ...schedule };
        weekDays.forEach(d => {
          newSchedule[d.dateKey] = fresh[d.dateKey] || [];
        });
        saveSchedule(newSchedule);
      },
    });
  };

  const resetAll = () => {
    setConfirmAction({
      title: 'Reset the entire summer?',
      message: 'This wipes every change you\'ve made across all 15 weeks and goes back to the original defaults. There\'s no undo.',
      onConfirm: () => {
        const fresh = generateDefaultSchedule();
        saveSchedule(fresh);
      },
      destructive: true,
    });
  };

  // Aggregate stats across whole semester
  const semesterStats = useMemo(() => {
    let totalCIS = 0, totalESE = 0, doneCIS = 0, doneESE = 0;
    let totalBlocks = 0, doneBlocks = 0;
    Object.values(schedule).forEach(blocks => {
      blocks.forEach(b => {
        totalBlocks++;
        if (b.done) doneBlocks++;
        if (b.course === 'CIS') { totalCIS += b.duration; if (b.done) doneCIS += b.duration; }
        else if (b.course === 'ESE') { totalESE += b.duration; if (b.done) doneESE += b.duration; }
      });
    });
    return { totalCIS, totalESE, doneCIS, doneESE, totalBlocks, doneBlocks };
  }, [schedule]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f1e8', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif' }}>
        <div style={{ color: '#6b6660', fontSize: '14px' }}>Loading…</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f1e8',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
      color: '#2d2a26',
      padding: '24px 16px 48px',
    }}>
      <style>{`
        .planner-root {
          max-width: 1280px;
          margin: 0 auto;
        }

        .day-cell {
          background: #fdfbf5;
          border: 1px solid #2d2a26;
          min-height: 220px;
          padding: 10px;
          position: relative;
          transition: all 0.15s ease;
        }
        .day-cell.drag-over {
          background: #fff8e8;
          box-shadow: inset 0 0 0 3px #2d2a26;
        }
        .day-cell.weekend {
          background: #f0ebde;
        }
        .day-cell.today {
          background: #fff5d4;
          box-shadow: inset 0 0 0 2px #c2410c;
        }
        .study-block {
          padding: 8px 10px;
          margin: 6px 0;
          cursor: grab;
          font-size: 12px;
          line-height: 1.4;
          position: relative;
          transition: transform 0.1s ease, box-shadow 0.1s ease;
          border: 1px solid #2d2a26;
        }
        .study-block:hover {
          transform: translateX(2px);
          box-shadow: 3px 3px 0 #2d2a26;
        }
        .study-block.done {
          opacity: 0.45;
          text-decoration: line-through;
        }
        .study-block.dragging { opacity: 0.3; }

        .deadline-pill {
          font-size: 10px;
          padding: 2px 6px;
          margin: 2px 0;
          font-weight: 600;
          display: inline-block;
        }

        .btn {
          font-size: 13px;
          padding: 6px 12px;
          border: 1px solid #2d2a26;
          background: #fdfbf5;
          color: #2d2a26;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.1s ease;
          border-radius: 4px;
          font-family: inherit;
        }
        .btn:hover {
          background: #2d2a26;
          color: #f5f1e8;
        }
        .btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .btn:disabled:hover {
          background: #fdfbf5;
          color: #2d2a26;
        }
        .btn-primary {
          background: #2d2a26;
          color: #f5f1e8;
        }
        .btn-primary:hover {
          background: #c2410c;
          border-color: #c2410c;
        }

        .label-tiny {
          font-size: 11px;
          color: #6b6660;
          font-weight: 500;
        }

        input.inline-edit, select.inline-edit {
          font-family: inherit;
          font-size: 12px;
          padding: 3px 6px;
          border: 1px solid #2d2a26;
          background: #fff;
          width: 100%;
          margin: 3px 0;
          border-radius: 3px;
        }

        @media (max-width: 900px) {
          .week-grid { grid-template-columns: 1fr !important; }
          .day-cell { min-height: 120px; }
        }
      `}</style>

      <div className="planner-root">
        {/* HEADER */}
        <header style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 600, margin: 0, lineHeight: 1.1 }}>
                Summer 2026 Study Planner
              </h1>
              <div style={{ fontSize: '13px', color: '#6b6660', marginTop: '4px' }}>
                ESE 5420 · Stats for DS &nbsp;|&nbsp; CIS 5450 · Big Data Analytics
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '12px', color: '#6b6660' }}>
              <div>{fmtShort(SEMESTER_START)} → {fmtShort(SEMESTER_END)}</div>
              <div style={{ marginTop: '2px', color: syncStatus === 'error' ? '#c44' : '#6b6660' }}>
                {syncStatus === 'saving' ? 'Saving…' : syncStatus === 'error' ? 'Offline (saved locally)' : 'Synced'}
              </div>
            </div>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid #2d2a26', marginTop: '16px' }}/>
        </header>

        {/* SEMESTER STATS BAR */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0', border: '1px solid #2d2a26', marginBottom: '24px' }}>
          <StatCell label="This Week" value={`${weekHours.total.toFixed(1)}h`} sub={`${completedHours.toFixed(1)}h done`} />
          <StatCell label="ESE 5420" value={`${weekHours.ese.toFixed(1)}h`} sub="this week" color={COURSES.ESE.color} />
          <StatCell label="CIS 5450" value={`${weekHours.cis.toFixed(1)}h`} sub="this week" color={COURSES.CIS.color} />
          <StatCell label="Total Logged" value={`${(semesterStats.doneCIS + semesterStats.doneESE).toFixed(0)}h`} sub={`of ${(semesterStats.totalCIS + semesterStats.totalESE).toFixed(0)}h`} />
          <StatCell label="Tasks Done" value={`${semesterStats.doneBlocks}`} sub={`of ${semesterStats.totalBlocks}`} />
        </div>

        {/* WEEK NAVIGATION */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button className="btn" onClick={() => setCurrentWeekIdx(Math.max(0, currentWeekIdx - 1))} disabled={currentWeekIdx === 0}>
              <ChevronLeft size={14} style={{ verticalAlign: 'middle' }}/> Prev
            </button>
            <div style={{ padding: '0 8px' }}>
              <div className="label-tiny">
                Week {currentWeek?.num} of {allWeeks.length}
              </div>
              <div style={{ fontSize: '17px', fontWeight: 600 }}>
                {currentWeek && fmtShort(currentWeek.start)} — {currentWeek && fmtShort(currentWeek.end)}
              </div>
            </div>
            <button className="btn" onClick={() => setCurrentWeekIdx(Math.min(allWeeks.length - 1, currentWeekIdx + 1))} disabled={currentWeekIdx === allWeeks.length - 1}>
              Next <ChevronRight size={14} style={{ verticalAlign: 'middle' }}/>
            </button>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn" onClick={() => setShowStats(!showStats)}>
              {showStats ? 'Hide' : 'Show'} Overview
            </button>
            <button className="btn" onClick={resetWeek}>
              <RotateCcw size={12} style={{ verticalAlign: 'middle' }}/> Reset Week
            </button>
            <button className="btn" onClick={resetAll}>
              Reset All
            </button>
          </div>
        </div>

        {/* SEMESTER OVERVIEW (collapsible) */}
        {showStats && (
          <div style={{ border: '1px solid #2d2a26', marginBottom: '16px', padding: '16px', background: '#fdfbf5' }}>
            <div className="label-tiny" style={{ marginBottom: '12px' }}>
              Semester at a glance
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '4px' }}>
              {allWeeks.map((w, idx) => {
                const wDeadlines = getDeadlinesInWeek(w.start);
                const hasExam = wDeadlines.some(d => d.type === 'exam');
                const hasProject = wDeadlines.some(d => d.type === 'project');
                const hwCount = wDeadlines.filter(d => d.type === 'hw').length;
                const isSpike = hasExam || hasProject || hwCount >= 2;
                return (
                  <button
                    key={idx}
                    onClick={() => { setCurrentWeekIdx(idx); setShowStats(false); }}
                    style={{
                      padding: '8px 4px',
                      border: idx === currentWeekIdx ? '2px solid #c2410c' : '1px solid #2d2a26',
                      background: isSpike ? '#fef3c7' : '#fdfbf5',
                      cursor: 'pointer',
                      fontSize: '11px',
                      textAlign: 'center',
                      fontFamily: 'inherit',
                      borderRadius: '3px',
                    }}
                    title={`Week ${idx + 1}`}
                  >
                    <div style={{ fontWeight: 600 }}>W{idx + 1}</div>
                    <div style={{ fontSize: '10px', color: '#6b6660' }}>{fmtShort(w.start)}</div>
                    {isSpike && <div style={{ marginTop: '2px' }}>⚡</div>}
                  </button>
                );
              })}
            </div>
            <div style={{ fontSize: '11px', marginTop: '12px', color: '#6b6660' }}>
              ⚡ = spike week (exam, project, or 2+ assignments due)
            </div>
          </div>
        )}

        {/* WEEK GRID */}
        <div className="week-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', border: '1px solid #2d2a26', borderRight: 'none', borderBottom: 'none' }}>
          {weekDays.map((day, idx) => {
            const isWeekend = day.date.getDay() === 0 || day.date.getDay() === 6;
            const isToday = fmtDate(day.date) === fmtDate(new Date());
            const isDragOver = draggedBlock && draggedBlock.dateKey !== day.dateKey;

            return (
              <div
                key={day.dateKey}
                className={`day-cell ${isWeekend ? 'weekend' : ''} ${isToday ? 'today' : ''}`}
                style={{ borderRight: '1px solid #2d2a26', borderBottom: '1px solid #2d2a26' }}
                onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('drag-over'); }}
                onDragLeave={(e) => e.currentTarget.classList.remove('drag-over')}
                onDrop={(e) => { e.preventDefault(); e.currentTarget.classList.remove('drag-over'); handleDrop(day.dateKey); }}
              >
                {/* Day header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#6b6660', fontWeight: 500 }}>
                      {fmtDay(day.date)}
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 600, lineHeight: 1 }}>
                      {day.date.getDate()}
                    </div>
                  </div>
                  <button
                    onClick={() => addBlock(day.dateKey)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', opacity: 0.5 }}
                    title="Add block"
                  >
                    <Plus size={14}/>
                  </button>
                </div>

                {/* Deadlines */}
                {day.deadlines.map((dl, dlIdx) => (
                  <div
                    key={dlIdx}
                    className="deadline-pill"
                    style={{
                      background: dl.type === 'exam' ? '#fee2e2' : dl.type === 'project' ? '#fef3c7' : '#dbeafe',
                      borderLeft: `3px solid ${dl.type === 'exam' ? '#dc2626' : dl.type === 'project' ? '#d97706' : COURSES[dl.course].color}`,
                      color: '#1c1917',
                      width: '100%',
                    }}
                  >
                    <AlertCircle size={9} style={{ verticalAlign: 'middle', marginRight: '3px' }}/>
                    {dl.course} · {dl.label}
                  </div>
                ))}

                {/* Study blocks */}
                {day.blocks.map(block => (
                  <BlockCard
                    key={block.id}
                    block={block}
                    dateKey={day.dateKey}
                    onToggle={() => toggleDone(day.dateKey, block.id)}
                    onDelete={() => deleteBlock(day.dateKey, block.id)}
                    onUpdate={(updates) => updateBlock(day.dateKey, block.id, updates)}
                    onDragStart={() => handleDragStart(day.dateKey, block)}
                    isEditing={editingBlock?.blockId === block.id}
                    setEditing={(v) => setEditingBlock(v ? { dateKey: day.dateKey, blockId: block.id } : null)}
                  />
                ))}

                {day.blocks.length === 0 && !isWeekend && (
                  <div style={{ fontSize: '11px', color: '#6b6660', opacity: 0.5, marginTop: '20px', textAlign: 'center' }}>
                    — open —
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* LEGEND / NOTES */}
        <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          <div style={{ border: '1px solid #2d2a26', padding: '14px', background: '#fdfbf5' }}>
            <div className="label-tiny" style={{ marginBottom: '8px' }}>
              How to use
            </div>
            <ul style={{ fontSize: '13px', lineHeight: 1.6, paddingLeft: '16px', margin: 0 }}>
              <li><strong>Click</strong> the checkbox to mark a block done</li>
              <li><strong>Drag</strong> blocks between days to reschedule</li>
              <li><strong>Click</strong> the pencil icon to edit a block</li>
              <li><strong>+</strong> adds a custom block to any day</li>
              <li>Changes save automatically</li>
            </ul>
          </div>
          <div style={{ border: '1px solid #2d2a26', padding: '14px', background: '#fdfbf5' }}>
            <div className="label-tiny" style={{ marginBottom: '8px' }}>
              Default rhythm
            </div>
            <div style={{ fontSize: '13px', lineHeight: 1.6 }}>
              <div><strong>Mornings:</strong> Lectures (1.5 hr) — CIS Mon/Wed/Fri, ESE Tue/Thu</div>
              <div><strong>Evenings:</strong> Homework (1.5 hr) — alternate course</div>
              <div><strong>Friday PM:</strong> Light catch-up</div>
              <div><strong>Weekends:</strong> Off — except spike weeks</div>
            </div>
          </div>
          <div style={{ border: '1px solid #2d2a26', padding: '14px', background: '#fdfbf5' }}>
            <div className="label-tiny" style={{ marginBottom: '8px' }}>
              Course key
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ display: 'inline-block', width: '14px', height: '14px', background: COURSES.ESE.color, border: '1px solid #2d2a26' }}/>
              <span style={{ fontSize: '13px' }}><strong>ESE 5420</strong> · Stats for DS · Hassani</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ display: 'inline-block', width: '14px', height: '14px', background: COURSES.CIS.color, border: '1px solid #2d2a26' }}/>
              <span style={{ fontSize: '13px' }}><strong>CIS 5450</strong> · Big Data · Ives & Zheng</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '11px', color: '#6b6660', opacity: 0.5 }}>
          Built for Abe · Summer 2026
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmAction && (
        <div
          onClick={() => setConfirmAction(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(45, 42, 38, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '16px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fdfbf5',
              border: '1px solid #2d2a26',
              maxWidth: '420px',
              width: '100%',
              padding: '24px',
              borderRadius: '4px',
            }}
          >
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
              {confirmAction.title}
            </h3>
            <p style={{ marginTop: '12px', marginBottom: '24px', fontSize: '13px', color: '#4a4540', lineHeight: 1.5 }}>
              {confirmAction.message}
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button className="btn" onClick={() => setConfirmAction(null)}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                style={confirmAction.destructive ? { background: '#c2410c', borderColor: '#c2410c' } : {}}
                onClick={() => {
                  confirmAction.onConfirm();
                  setConfirmAction(null);
                }}
              >
                {confirmAction.destructive ? 'Reset Everything' : 'Reset'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// SUB-COMPONENTS
// ============================================================

function StatCell({ label, value, sub, color }) {
  return (
    <div style={{
      padding: '14px 16px',
      borderRight: '1px solid #2d2a26',
      background: '#fdfbf5',
      position: 'relative',
    }}>
      <div style={{ fontSize: '11px', color: '#6b6660', fontWeight: 500, marginBottom: '4px' }}>
        {label}
      </div>
      <div style={{ fontSize: '24px', fontWeight: 600, color: color || '#2d2a26', lineHeight: 1 }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: '11px', color: '#6b6660', marginTop: '3px' }}>
          {sub}
        </div>
      )}
    </div>
  );
}

function BlockCard({ block, dateKey, onToggle, onDelete, onUpdate, onDragStart, isEditing, setEditing }) {
  const courseColor = block.course === 'BOTH' ? '#6b7280' : (COURSES[block.course]?.color || '#6b7280');
  const courseAccent = block.course === 'BOTH' ? '#e5e7eb' : (COURSES[block.course]?.accent || '#e5e7eb');

  if (isEditing) {
    return (
      <div className="study-block" style={{ background: '#fff', borderColor: '#c2410c', borderWidth: '2px' }}>
        <select
          className="inline-edit"
          value={block.course}
          onChange={(e) => onUpdate({ course: e.target.value })}
        >
          <option value="CIS">CIS 5450</option>
          <option value="ESE">ESE 5420</option>
          <option value="BOTH">Both / Other</option>
        </select>
        <input
          className="inline-edit"
          value={block.activity}
          onChange={(e) => onUpdate({ activity: e.target.value })}
          placeholder="Activity"
        />
        <input
          className="inline-edit"
          value={block.detail}
          onChange={(e) => onUpdate({ detail: e.target.value })}
          placeholder="Detail"
        />
        <input
          className="inline-edit"
          type="number"
          step="0.25"
          min="0.25"
          max="8"
          value={block.duration}
          onChange={(e) => onUpdate({ duration: parseFloat(e.target.value) || 0.5 })}
          placeholder="Hours"
        />
        <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
          <button className="btn btn-primary" style={{ flex: 1, padding: '4px' }} onClick={() => setEditing(false)}>Done</button>
          <button className="btn" style={{ padding: '4px 8px' }} onClick={onDelete} title="Delete">
            <Trash2 size={11}/>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`study-block ${block.done ? 'done' : ''}`}
      draggable
      onDragStart={onDragStart}
      style={{
        background: courseAccent,
        borderLeft: `4px solid ${courseColor}`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '4px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '10px', fontWeight: 600, color: courseColor }}>
              {block.course === 'BOTH' ? 'Both' : block.course} · {block.duration}h
            </span>
            {block.spike && <span style={{ fontSize: '10px' }}>⚡</span>}
            {block.optional && <span style={{ fontSize: '10px', color: '#6b6660' }}>opt</span>}
          </div>
          <div style={{ fontWeight: 600, fontSize: '12px', marginTop: '2px' }}>
            {block.activity}
          </div>
          <div style={{ fontSize: '11px', color: '#4a4540', marginTop: '1px', lineHeight: 1.3 }}>
            {block.detail}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <button
            onClick={onToggle}
            style={{
              width: '18px', height: '18px',
              border: '1.5px solid #2d2a26',
              background: block.done ? '#2d2a26' : '#fff',
              cursor: 'pointer',
              padding: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            title={block.done ? 'Mark undone' : 'Mark done'}
          >
            {block.done && <Check size={11} color="#fff" strokeWidth={3}/>}
          </button>
          <button
            onClick={() => setEditing(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '1px', opacity: 0.5 }}
            title="Edit"
          >
            <Edit3 size={11}/>
          </button>
        </div>
      </div>
    </div>
  );
}
