import { UserProgress, SecurityReport, Language, ActivityLogItem } from '../types/cyber';

const STORAGE_KEY_PROGRESS = 'cyber_lab_user_progress_v3';
const STORAGE_KEY_LANG = 'cyber_lab_lang_v3';

const DEFAULT_PROGRESS: UserProgress = {
  xp: 450,
  level: 2,
  completedLabs: ['lab-01-subnet-recon', 'lab-02-http-headers-audit'],
  completedLessons: ['lin-101', 'lin-102', 'net-101'],
  bookmarkedTools: ['nmap', 'wireshark', 'hashcat', 'burpsuite'],
  completedMilestones: ['soc-m1', 'linux-m1'],
  streakDays: 5,
  lastActive: new Date().toISOString(),
  recentlyViewedTools: ['nmap', 'burpsuite', 'gobuster'],
  activityLogs: [
    {
      id: 'act-1',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      type: 'lab_complete',
      title: 'Lab 01 Completed',
      description: 'Completed Subnet Reconnaissance and earned 150 XP',
      xpEarned: 150,
    },
    {
      id: 'act-2',
      timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
      type: 'lesson_complete',
      title: 'Lesson Mastered: Linux CLI Fundamentals',
      description: 'Passed knowledge check quiz on command line filesystem navigation',
      xpEarned: 50,
    },
    {
      id: 'act-3',
      timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
      type: 'tool_view',
      title: 'Explored Nmap Network Scanner',
      description: 'Inspected syntax, safe command flags, and official documentation',
    },
  ],
  savedReports: [
    {
      id: 'rep-init-01',
      title: 'Missing Content-Security-Policy & Sensitive Cookies Missing HttpOnly',
      date: '2026-11-06',
      severity: 'Medium',
      asset: 'https://staging.internal-corp.local',
      cveOrCwe: 'CWE-1004 / CWE-1021',
      cvssScore: 5.4,
      description: 'Audit revealed that authentication session cookies were issued without the HttpOnly attribute and no Content-Security-Policy (CSP) was declared on the HTTP response.',
      impact: 'Allows malicious client scripts in the event of an XSS flaw to read document.cookie and exfiltrate user sessions.',
      stepsToReproduce: '1. Send GET request via curl -I to staging endpoint.\n2. Inspect Set-Cookie header.\n3. Note absence of HttpOnly and SameSite flags.',
      remediation: 'Configure web server and application middleware to append "; Secure; HttpOnly; SameSite=Strict" to all session cookies and inject a strict CSP header.',
      status: 'Validated',
    },
  ],
};

export function loadUserProgress(): UserProgress {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROGRESS);
    if (!raw) {
      saveUserProgress(DEFAULT_PROGRESS);
      return DEFAULT_PROGRESS;
    }
    const parsed = JSON.parse(raw) as Partial<UserProgress>;
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      completedLessons: parsed.completedLessons || DEFAULT_PROGRESS.completedLessons,
      recentlyViewedTools: parsed.recentlyViewedTools || DEFAULT_PROGRESS.recentlyViewedTools,
      activityLogs: parsed.activityLogs || DEFAULT_PROGRESS.activityLogs,
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function saveUserProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(progress));
  } catch {
    // ignore
  }
}

export function logActivity(item: Omit<ActivityLogItem, 'id' | 'timestamp'>): void {
  const current = loadUserProgress();
  const newItem: ActivityLogItem = {
    ...item,
    id: 'act-' + Date.now(),
    timestamp: new Date().toISOString(),
  };
  const updatedLogs = [newItem, ...(current.activityLogs || [])].slice(0, 30);
  saveUserProgress({ ...current, activityLogs: updatedLogs });
}

export function completeLabProgress(labId: string, xpReward: number): { addedXp: number; isNew: boolean } {
  const current = loadUserProgress();
  const alreadyCompleted = current.completedLabs.includes(labId);

  if (alreadyCompleted) {
    return { addedXp: 0, isNew: false };
  }

  const updatedLabs = [...current.completedLabs, labId];
  const newXp = current.xp + xpReward;
  const newLevel = Math.floor(newXp / 300) + 1;

  const updated: UserProgress = {
    ...current,
    xp: newXp,
    level: newLevel,
    completedLabs: updatedLabs,
    lastActive: new Date().toISOString(),
  };

  saveUserProgress(updated);
  logActivity({
    type: 'lab_complete',
    title: `Completed ${labId}`,
    description: `Earned ${xpReward} XP in practical cyber lab terminal`,
    xpEarned: xpReward,
  });

  return { addedXp: xpReward, isNew: true };
}

export function completeLessonProgress(lessonId: string, lessonTitle: string): { addedXp: number; isNew: boolean } {
  const current = loadUserProgress();
  const completedLessons = current.completedLessons || [];
  if (completedLessons.includes(lessonId)) {
    return { addedXp: 0, isNew: false };
  }

  const xpReward = 50;
  const newLessons = [...completedLessons, lessonId];
  const newXp = current.xp + xpReward;
  const newLevel = Math.floor(newXp / 300) + 1;

  saveUserProgress({
    ...current,
    xp: newXp,
    level: newLevel,
    completedLessons: newLessons,
    lastActive: new Date().toISOString(),
  });

  logActivity({
    type: 'lesson_complete',
    title: `Lesson: ${lessonTitle}`,
    description: `Completed roadmap theory, exercise, and knowledge check (+${xpReward} XP)`,
    xpEarned: xpReward,
  });

  return { addedXp: xpReward, isNew: true };
}

export function addRecentlyViewedTool(toolId: string): void {
  const current = loadUserProgress();
  const list = current.recentlyViewedTools || [];
  const filtered = list.filter((id) => id !== toolId);
  const updated = [toolId, ...filtered].slice(0, 10);
  saveUserProgress({ ...current, recentlyViewedTools: updated });
}

export function toggleToolBookmark(toolId: string): boolean {
  const current = loadUserProgress();
  const isBookmarked = current.bookmarkedTools.includes(toolId);
  const updated = isBookmarked
    ? current.bookmarkedTools.filter((id) => id !== toolId)
    : [...current.bookmarkedTools, toolId];

  saveUserProgress({ ...current, bookmarkedTools: updated });
  return !isBookmarked;
}

export function toggleMilestone(milestoneId: string): boolean {
  const current = loadUserProgress();
  const milestones = current.completedMilestones || [];
  const isCompleted = milestones.includes(milestoneId);
  const updated = isCompleted
    ? milestones.filter((id) => id !== milestoneId)
    : [...milestones, milestoneId];

  const xpDelta = isCompleted ? -50 : 50;
  const newXp = Math.max(0, current.xp + xpDelta);
  const newLevel = Math.floor(newXp / 300) + 1;

  saveUserProgress({
    ...current,
    xp: newXp,
    level: newLevel,
    completedMilestones: updated,
  });

  return !isCompleted;
}

export function saveSecurityReport(report: SecurityReport): void {
  const current = loadUserProgress();
  const existingIdx = current.savedReports.findIndex((r) => r.id === report.id);
  let updatedReports: SecurityReport[];

  if (existingIdx >= 0) {
    updatedReports = [...current.savedReports];
    updatedReports[existingIdx] = report;
  } else {
    updatedReports = [report, ...current.savedReports];
  }

  saveUserProgress({ ...current, savedReports: updatedReports });
  logActivity({
    type: 'report_generated',
    title: `Vulnerability Report: ${report.title}`,
    description: `Saved assessment findings for target asset ${report.asset}`,
  });
}

export function deleteSecurityReport(reportId: string): void {
  const current = loadUserProgress();
  saveUserProgress({
    ...current,
    savedReports: current.savedReports.filter((r) => r.id !== reportId),
  });
}

export function completeTrainingLesson(lessonId: string, title: string, addedXp: number): void {
  const current = loadUserProgress();
  const currentCompleted = current.completedTrainingLessons || [];
  if (currentCompleted.includes(lessonId)) return;

  const newXp = current.xp + addedXp;
  const newLevel = Math.floor(newXp / 300) + 1;
  const updatedCompleted = [...currentCompleted, lessonId];

  saveUserProgress({
    ...current,
    xp: newXp,
    level: newLevel,
    completedTrainingLessons: updatedCompleted,
  });

  logActivity({
    type: 'lesson_complete',
    title: `Training Mastered: ${title}`,
    description: `Passed practical exercises & quiz checkpoints, earning +${addedXp} XP`,
    xpEarned: addedXp,
  });
}

export function toggleTrainingCheckpoint(lessonId: string, checkpointId: string): boolean {
  const current = loadUserProgress();
  const allCheckpoints = current.completedTrainingCheckpoints || {};
  const currentLessonCheckpoints = allCheckpoints[lessonId] || [];

  let updatedList: string[];
  let isNowChecked: boolean;

  if (currentLessonCheckpoints.includes(checkpointId)) {
    updatedList = currentLessonCheckpoints.filter((id: string) => id !== checkpointId);
    isNowChecked = false;
  } else {
    updatedList = [...currentLessonCheckpoints, checkpointId];
    isNowChecked = true;
  }

  saveUserProgress({
    ...current,
    completedTrainingCheckpoints: {
      ...allCheckpoints,
      [lessonId]: updatedList,
    },
  });

  return isNowChecked;
}

export function saveTrainingNote(lessonId: string, noteText: string): void {
  const current = loadUserProgress();
  const notes = current.trainingNotes || {};
  saveUserProgress({
    ...current,
    trainingNotes: {
      ...notes,
      [lessonId]: noteText,
    },
  });
}

export function addPortfolioProject(projectId: string, title: string): void {
  const current = loadUserProgress();
  const existing = current.portfolioProjects || [];
  if (existing.includes(projectId)) return;

  saveUserProgress({
    ...current,
    portfolioProjects: [...existing, projectId],
  });

  logActivity({
    type: 'report_saved',
    title: `Portfolio Entry Created: ${title}`,
    description: `Added verified mission evidence to security analyst portfolio dossier`,
  });
}

export function resetAllData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY_PROGRESS);
  localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(DEFAULT_PROGRESS));
}

export function exportUserStateJson(): string {
  const current = loadUserProgress();
  return JSON.stringify(current, null, 2);
}

export function importUserStateJson(jsonStr: string): boolean {
  try {
    const parsed = JSON.parse(jsonStr) as UserProgress;
    if (typeof parsed.xp === 'number' && Array.isArray(parsed.completedLabs)) {
      saveUserProgress({ ...DEFAULT_PROGRESS, ...parsed });
      return true;
    }
  } catch {
    // invalid JSON
  }
  return false;
}

export function loadStoredLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  try {
    const lang = localStorage.getItem(STORAGE_KEY_LANG) as Language;
    if (lang === 'en' || lang === 'ur' || lang === 'roman_ur') return lang;
  } catch {
    // fallback
  }
  return 'en';
}

export function saveStoredLanguage(lang: Language): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_LANG, lang);
  } catch {
    // ignore
  }
}
