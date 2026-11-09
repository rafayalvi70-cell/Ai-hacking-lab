import React, { useState, useMemo } from 'react';
import {
  Compass,
  CheckCircle2,
  Clock,
  Award,
  ChevronRight,
  Shield,
  Layers,
  Sparkles,
  BookOpen,
  Check,
  X,
  Search,
  ArrowRight,
  Terminal,
} from 'lucide-react';
import { Translations } from '../../data/translations';
import { RoadmapPhase, RoadmapLesson } from '../../types/cyber';
import { ALL_ROADMAP_PHASES, TOTAL_LESSON_COUNT, findLessonById, findNextLesson } from '../../data/roadmapData';
import { completeLessonProgress } from '../../utils/storage';
import { soundEffects } from '../../utils/audio';
import { PageId } from '../layout/Sidebar';

interface RoadmapViewProps {
  t: Translations;
  completedMilestones: string[];
  completedLessons?: string[];
  onToggleMilestone: (id: string) => void;
  onLessonCompleted?: (lessonId: string) => void;
  selectedLessonId?: string;
  onNavigate?: (page: PageId, targetId?: string) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  t,
  completedMilestones,
  completedLessons = [],
  onToggleMilestone,
  onLessonCompleted,
  selectedLessonId,
  onNavigate,
}) => {
  const [activePhaseId, setActivePhaseId] = useState<string | number>(1);
  const [lessonSearch, setLessonSearch] = useState('');
  const [activeLesson, setActiveLesson] = useState<{ lesson: RoadmapLesson; phase: RoadmapPhase } | null>(null);

  // Quiz state inside lesson modal
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizSuccess, setQuizSuccess] = useState<boolean>(false);

  const activePhase = ALL_ROADMAP_PHASES.find((p) => String(p.id) === String(activePhaseId)) || ALL_ROADMAP_PHASES[0];

  const completedInCurrentPhase = activePhase.lessons.filter((l) =>
    completedLessons.includes(l.id)
  ).length;

  const totalLessonsCompleted = completedLessons.length;
  const overallProgressPercent = Math.round((totalLessonsCompleted / TOTAL_LESSON_COUNT) * 100);

  const filteredLessons = useMemo(() => {
    if (!lessonSearch.trim()) return activePhase.lessons;
    const q = lessonSearch.toLowerCase().trim();
    return activePhase.lessons.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.theory.toLowerCase().includes(q) ||
        l.exercise.toLowerCase().includes(q)
    );
  }, [activePhase, lessonSearch]);

  // Sync selectedLessonId when navigated from global search or URL
  React.useEffect(() => {
    if (selectedLessonId) {
      const match = findLessonById(selectedLessonId);
      if (match) {
        setActivePhaseId(match.phase.id);
        setActiveLesson(match);
        setSelectedQuizAnswer(null);
        setQuizSubmitted(false);
        setQuizSuccess(false);
      }
    }
  }, [selectedLessonId]);

  const handleOpenLesson = (lesson: RoadmapLesson, phase: RoadmapPhase) => {
    soundEffects.playKeyClick();
    setActiveLesson({ lesson, phase });
    setSelectedQuizAnswer(null);
    setQuizSubmitted(false);
    setQuizSuccess(false);
    if (onNavigate) {
      onNavigate('roadmap', lesson.id);
    }
  };

  const handleCloseLesson = () => {
    soundEffects.playKeyClick();
    setActiveLesson(null);
    if (onNavigate) {
      onNavigate('roadmap');
    }
  };

  const getQuizData = (lesson: RoadmapLesson) => {
    const kc = lesson.knowledgeCheck;
    if (Array.isArray(kc)) {
      const q = kc[0];
      return {
        question: q.question,
        options: q.options,
        correctIndex: q.correctAnswerIndex !== undefined ? q.correctAnswerIndex : q.correctIndex ?? 0,
        explanation: q.explanation,
      };
    }
    return {
      question: kc.question,
      options: kc.options,
      correctIndex: kc.correctAnswerIndex !== undefined ? kc.correctAnswerIndex : kc.correctIndex ?? 0,
      explanation: kc.explanation,
    };
  };

  const handleVerifyQuiz = () => {
    if (!activeLesson || selectedQuizAnswer === null) return;
    const quiz = getQuizData(activeLesson.lesson);
    const isCorrect = selectedQuizAnswer === quiz.correctIndex;
    setQuizSubmitted(true);
    setQuizSuccess(isCorrect);

    if (isCorrect) {
      soundEffects.playSuccess();
      completeLessonProgress(activeLesson.lesson.id, activeLesson.lesson.title);
      if (onLessonCompleted) {
        onLessonCompleted(activeLesson.lesson.id);
      }
    } else {
      soundEffects.playKeyClick();
    }
  };

  const handleNextLesson = () => {
    if (!activeLesson) return;
    const next = findNextLesson(activeLesson.lesson.id);
    if (next) {
      soundEffects.playKeyClick();
      setActivePhaseId(next.phase.id);
      setActiveLesson(next);
      setSelectedQuizAnswer(null);
      setQuizSubmitted(false);
      setQuizSuccess(false);
      if (onNavigate) {
        onNavigate('roadmap', next.lesson.id);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-[#0c1218] border border-[#1b2634]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Compass className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100 font-mono">
              {t.roadmap.title}
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              12 Phases • 120 Curated Lessons
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Progressive cybersecurity engineering roadmap with step-by-step theory, safe practical exercises, and knowledge checks.
          </p>
        </div>

        <div className="p-3 rounded-lg bg-[#080d12] border border-[#17222d] text-end shrink-0 font-mono">
          <div className="text-xs text-slate-400">Curriculum Progress</div>
          <div className="text-lg font-bold text-emerald-400">
            {totalLessonsCompleted} / {TOTAL_LESSON_COUNT} ({overallProgressPercent}%)
          </div>
        </div>
      </div>

      {/* 12 Phases Navigation Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
        {ALL_ROADMAP_PHASES.map((phase) => {
          const isSelected = phase.id === activePhaseId;
          const completedCount = phase.lessons.filter((l) => completedLessons.includes(l.id)).length;
          const isPhaseDone = completedCount === phase.lessons.length;

          return (
            <button
              key={phase.id}
              onClick={() => {
                soundEffects.playKeyClick();
                setActivePhaseId(phase.id);
                setLessonSearch('');
              }}
              className={`p-3 rounded-xl text-start transition-all border flex flex-col justify-between ${
                isSelected
                  ? 'bg-emerald-950/30 border-emerald-500/50 cyber-glow'
                  : 'bg-[#0c1218] border-[#1b2634] hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                      isSelected
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {phase.badge}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {completedCount}/10
                  </span>
                </div>
                <h3
                  className={`text-xs font-bold font-mono line-clamp-2 ${
                    isSelected ? 'text-emerald-300' : 'text-slate-200'
                  }`}
                >
                  {phase.title}
                </h3>
              </div>

              <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#17222d] text-[10px] text-slate-500 font-mono">
                <span className="capitalize">{phase.level}</span>
                {isPhaseDone && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Phase Banner */}
      <div className="p-5 rounded-xl bg-[#0c1218] border border-[#1b2634] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono uppercase text-emerald-400 font-semibold">
                Phase {activePhase.id.toString().padStart(2, '0')}:
              </span>
              <h2 className="text-lg font-mono text-slate-100 font-bold">
                {activePhase.title}
              </h2>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans max-w-3xl">
              {activePhase.description}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute start-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={lessonSearch}
                onChange={(e) => setLessonSearch(e.target.value)}
                placeholder="Search lessons in phase..."
                className="bg-[#080d12] border border-[#1a2634] rounded-lg ps-8 pe-3 py-1.5 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-emerald-500/40"
              />
            </div>
          </div>
        </div>

        {/* Phase progress bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Phase Completion</span>
            <span>{completedInCurrentPhase} / 10 Lessons</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-300"
              style={{ width: `${(completedInCurrentPhase / 10) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Lessons List in Active Phase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredLessons.map((lesson, idx) => {
          const isDone = completedLessons.includes(lesson.id);
          return (
            <div
              key={lesson.id}
              onClick={() => handleOpenLesson(lesson, activePhase)}
              className={`p-4 rounded-xl border transition-all cursor-pointer group flex flex-col justify-between ${
                isDone
                  ? 'bg-emerald-950/15 border-emerald-500/30'
                  : 'bg-[#0c1218] border-[#1b2634] hover:border-emerald-500/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-[#131d27] border border-[#1e2d3b] text-emerald-400 font-mono text-[11px] font-bold flex items-center justify-center">
                      {(idx + 1).toString().padStart(2, '0')}
                    </span>
                    <span className="text-[10px] font-mono uppercase text-slate-400 px-1.5 py-0.2 rounded bg-slate-800">
                      {lesson.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>~{lesson.estimatedMinutes}m</span>
                    {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-400 ms-1" />}
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-100 font-mono group-hover:text-emerald-300 transition-colors mb-1.5">
                  {lesson.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {lesson.theory}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-[#16212b] flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500 text-[11px]">
                  {(lesson.steps || lesson.stepByStep || []).length} learning steps
                </span>
                <span className="text-emerald-400 group-hover:underline flex items-center gap-1">
                  <span>Start Lesson</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lesson Full Screen Modal */}
      {activeLesson && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs"
          onClick={handleCloseLesson}
        >
          <div
            className="relative w-full max-w-4xl max-h-[92vh] bg-[#0c1218] border border-emerald-500/40 rounded-2xl shadow-2xl overflow-y-auto cyber-glow p-6 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[#1b2634] pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1 text-xs font-mono">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold uppercase">
                    {activeLesson.phase.title}
                  </span>
                  <span className="text-slate-400">~{activeLesson.lesson.estimatedMinutes} minutes</span>
                  <span className="text-slate-400 capitalize">• {activeLesson.lesson.difficulty}</span>
                </div>
                <h2 className="text-xl font-bold font-mono text-slate-100">
                  {activeLesson.lesson.title}
                </h2>
              </div>

              <button
                onClick={handleCloseLesson}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Theory Breakdown */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-bold">
                1. Core Engineering Theory & Mechanics
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans bg-[#080d12] p-4 rounded-xl border border-[#1b2734]">
                {activeLesson.lesson.theory}
              </p>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-bold">
                2. Step-by-Step Practical Implementation
              </h4>
              <div className="space-y-1.5">
                {(activeLesson.lesson.steps || activeLesson.lesson.stepByStep || []).map((st, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-[#080d12] border border-[#192430] flex items-start gap-2.5 font-sans text-xs text-slate-300"
                  >
                    <span className="w-5 h-5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{st}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Terminal Commands */}
            {activeLesson.lesson.commands && activeLesson.lesson.commands.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-bold">
                  3. Key Command Syntax & Parameter Explanations
                </h4>
                <div className="space-y-2">
                  {activeLesson.lesson.commands.map((cmd, i) => (
                    <div key={i} className="p-3 rounded-lg bg-[#080d12] border border-[#192430] space-y-1 font-mono text-xs">
                      <div className="text-emerald-300 select-all">$ {cmd.command || cmd.cmd}</div>
                      <div className="text-[11px] text-slate-400 font-sans">{cmd.explanation}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Practical Example & Exercise */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-sans text-xs">
              <div className="p-3.5 rounded-lg bg-[#080d12] border border-[#18232e] space-y-1">
                <span className="text-emerald-400 font-mono uppercase text-[10px] font-bold block">
                  Practical Real-World Example
                </span>
                <p className="text-slate-300 leading-relaxed">{activeLesson.lesson.practicalExample}</p>
              </div>

              <div className="p-3.5 rounded-lg bg-[#080d12] border border-[#18232e] space-y-1">
                <span className="text-cyan-400 font-mono uppercase text-[10px] font-bold block">
                  Hands-On Exercise & Expected Result
                </span>
                <p className="text-slate-300 leading-relaxed mb-1">{activeLesson.lesson.exercise}</p>
                <p className="text-[11px] text-slate-400 italic">Expected: {activeLesson.lesson.expectedResult}</p>
              </div>
            </div>

            {/* Knowledge Check Quiz */}
            {(() => {
              const quiz = getQuizData(activeLesson.lesson);
              return (
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-emerald-400 font-bold uppercase flex items-center gap-1.5">
                      <Award className="w-4 h-4" />
                      <span>Knowledge Check (Pass to Earn 50 XP)</span>
                    </span>
                    {completedLessons.includes(activeLesson.lesson.id) && (
                      <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Completed</span>
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-mono text-slate-100 font-semibold">
                    {quiz.question}
                  </p>

                  <div className="space-y-1.5">
                    {quiz.options.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        onClick={() => setSelectedQuizAnswer(optIdx)}
                        className={`w-full text-start p-2.5 rounded-lg font-mono text-xs transition-colors border flex items-center justify-between ${
                          selectedQuizAnswer === optIdx
                            ? 'bg-emerald-500/20 text-emerald-200 border-emerald-500/50'
                            : 'bg-[#080d12] text-slate-300 border-[#1a2634] hover:bg-[#121c27]'
                        }`}
                      >
                        <span>{opt}</span>
                        {selectedQuizAnswer === optIdx && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={handleVerifyQuiz}
                      disabled={selectedQuizAnswer === null}
                      className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-mono font-bold text-xs"
                    >
                      Verify Answer & Complete
                    </button>

                    {quizSubmitted && (
                      <div
                        className={`text-xs font-mono px-3 py-1.5 rounded border ${
                          quizSuccess
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-red-500/20 text-red-300 border-red-500/40'
                        }`}
                      >
                        {quizSuccess ? 'Correct! +50 XP Earned' : 'Incorrect. Review explanation below.'}
                      </div>
                    )}
                  </div>

                  {quizSubmitted && (
                    <div className="p-3 rounded-lg bg-[#080d12] text-xs font-mono text-slate-300 border border-[#1b2734]">
                      <strong>Explanation:</strong> {quiz.explanation}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Modal Bottom: Next Lesson Navigation */}
            <div className="flex items-center justify-between pt-3 border-t border-[#1b2734]">
              <button
                onClick={() => setActiveLesson(null)}
                className="px-3 py-1.5 rounded-lg bg-[#14202c] text-slate-300 hover:text-white font-mono text-xs"
              >
                Close
              </button>

              <button
                onClick={handleNextLesson}
                className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs flex items-center gap-1.5"
              >
                <span>Next Lesson in Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
