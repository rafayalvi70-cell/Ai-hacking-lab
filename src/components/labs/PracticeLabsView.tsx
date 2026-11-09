import React, { useState, useEffect, useRef } from 'react';
import {
  FlaskConical,
  CheckCircle2,
  Clock,
  Award,
  AlertCircle,
  HelpCircle,
  Play,
  ArrowLeft,
  RotateCcw,
  Send,
  ShieldCheck,
  ChevronDown,
  Terminal,
  Lock,
  Server,
} from 'lucide-react';
import { Translations } from '../../data/translations';
import { PracticeLab, LabDifficulty } from '../../types/cyber';
import { ALL_PRACTICE_LABS } from '../../data/labsData';
import { completeLabProgress } from '../../utils/storage';
import { soundEffects } from '../../utils/audio';
import { PageId } from '../layout/Sidebar';
import { VulnerableVmGuideModal } from './VulnerableVmGuideModal';

interface PracticeLabsViewProps {
  t: Translations;
  completedLabs: string[];
  onLabCompleted: (labId: string, addedXp: number) => void;
  selectedLabId?: string;
  onNavigate?: (page: PageId, targetId?: string) => void;
}

export const PracticeLabsView: React.FC<PracticeLabsViewProps> = ({
  t,
  completedLabs,
  onLabCompleted,
  selectedLabId,
  onNavigate,
}) => {
  const [activeLab, setActiveLab] = useState<PracticeLab | null>(() => {
    if (selectedLabId) {
      return ALL_PRACTICE_LABS.find((l) => l.id === selectedLabId) || null;
    }
    return null;
  });

  // Synchronize activeLab when selectedLabId changes dynamically
  useEffect(() => {
    if (selectedLabId) {
      const match = ALL_PRACTICE_LABS.find((l) => l.id === selectedLabId);
      if (match) {
        setActiveLab(match);
      }
    } else {
      setActiveLab(null);
    }
  }, [selectedLabId]);

  const [difficultyFilter, setDifficultyFilter] = useState<'All' | LabDifficulty>('All');
  const [showVmGuideModal, setShowVmGuideModal] = useState(false);

  // Terminal state for active lab
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [cmdInput, setCmdInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Hints state
  const [revealedHints, setRevealedHints] = useState<number[]>([]);

  // Flag submission state
  const [flagInput, setFlagInput] = useState('');
  const [submissionFeedback, setSubmissionFeedback] = useState<{
    status: 'success' | 'error' | null;
    message: string;
  }>({ status: null, message: '' });

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const terminalInputRef = useRef<HTMLInputElement>(null);

  // Initialize terminal when activeLab changes
  useEffect(() => {
    if (activeLab) {
      setTerminalLogs([
        `[+] INITIALIZING VIRTUAL ENVIRONMENT: ${activeLab.targetEnvironment}`,
        `[+] Authorized Sandbox: Packet routing isolated to virtual tap0`,
        `[+] Type "help" to list available simulated tools.`,
        `----------------------------------------------------------------`,
      ]);
      setRevealedHints([]);
      setFlagInput('');
      setSubmissionFeedback({ status: null, message: '' });
      setCmdHistory([]);
      setHistoryIndex(-1);
    }
  }, [activeLab]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  const handleLaunchLab = (lab: PracticeLab) => {
    soundEffects.playKeyClick();
    setActiveLab(lab);
    if (onNavigate) {
      onNavigate('labs', lab.id);
    }
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rawCmd = cmdInput.trim();
    if (!rawCmd || !activeLab) return;

    soundEffects.playKeyClick();

    const newLogs = [...terminalLogs, `${activeLab.simulatedTerminal.initialPrompt} ${rawCmd}`];
    const available = activeLab.simulatedTerminal.availableCommands;

    // Check exact command match or normalized match
    let matchedOutput: string | null = null;

    if (rawCmd.toLowerCase() === 'clear') {
      setTerminalLogs([]);
      setCmdInput('');
      return;
    }

    if (available[rawCmd]) {
      matchedOutput = available[rawCmd];
    } else {
      // Check partial or case-insensitive match
      const lower = rawCmd.toLowerCase();
      const key = Object.keys(available).find((k) => k.toLowerCase() === lower);
      if (key) {
        matchedOutput = available[key];
      }
    }

    if (matchedOutput) {
      newLogs.push(matchedOutput);
    } else {
      newLogs.push(
        `bash: ${rawCmd}: command not configured in this simulated sandbox. Type "help" to see available commands.`
      );
    }

    setTerminalLogs(newLogs);
    setCmdHistory((prev) => [...prev, rawCmd]);
    setHistoryIndex(-1);
    setCmdInput('');
  };

  // Keyboard navigation for history (Up/Down arrow)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIdx = historyIndex === -1 ? cmdHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setCmdInput(cmdHistory[nextIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= cmdHistory.length) {
        setHistoryIndex(-1);
        setCmdInput('');
      } else {
        setHistoryIndex(nextIdx);
        setCmdInput(cmdHistory[nextIdx]);
      }
    }
  };

  const handleRevealHint = (index: number) => {
    soundEffects.playKeyClick();
    if (!revealedHints.includes(index)) {
      setRevealedHints((prev) => [...prev, index]);
    }
  };

  const handleFlagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLab || !flagInput.trim()) return;

    soundEffects.playKeyClick();
    const cleanSubmitted = flagInput.trim();

    if (cleanSubmitted === activeLab.flag) {
      soundEffects.playSuccess();
      const result = completeLabProgress(activeLab.id, activeLab.xpReward);
      onLabCompleted(activeLab.id, result.addedXp);
      setSubmissionFeedback({
        status: 'success',
        message: `${t.labs.correctFlag} +${activeLab.xpReward} XP awarded!`,
      });
    } else {
      soundEffects.playAlert();
      setSubmissionFeedback({
        status: 'error',
        message: t.labs.incorrectFlag,
      });
    }
  };

  const handleResetTerminal = () => {
    soundEffects.playKeyClick();
    if (activeLab) {
      setTerminalLogs([
        `[+] RESETTING SIMULATED HOST: ${activeLab.targetEnvironment}`,
        `[+] Type "help" to view sandbox commands.`,
      ]);
    }
  };

  const filteredLabs = ALL_PRACTICE_LABS.filter((l) =>
    difficultyFilter === 'All' ? true : l.difficulty === difficultyFilter
  );

  // Render Lab List View
  if (!activeLab) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-[#0c1218] border border-[#1b2634]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-100 font-mono">
                {t.labs.title}
              </h1>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                {completedLabs.length} / {ALL_PRACTICE_LABS.length} Solved
              </span>
            </div>
            <p className="text-xs text-slate-400">{t.labs.subtitle}</p>
          </div>

          {/* Header Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                soundEffects.playKeyClick();
                setShowVmGuideModal(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 font-mono text-xs flex items-center gap-1.5 transition-colors"
            >
              <Server className="w-3.5 h-3.5" />
              <span>Local Vulnerable VM Setup Guide</span>
            </button>

            {/* Difficulty Filter Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-lg bg-[#080d12] border border-[#1a2634] text-xs font-mono">
              {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((tier) => (
                <button
                  key={tier}
                  onClick={() => {
                    soundEffects.playKeyClick();
                    setDifficultyFilter(tier);
                  }}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    difficultyFilter === tier
                      ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Labs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLabs.map((lab) => {
            const isCompleted = completedLabs.includes(lab.id);
            const difficultyColor =
              lab.difficulty === 'Beginner'
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                : lab.difficulty === 'Intermediate'
                ? 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30'
                : 'bg-red-500/15 text-red-400 border-red-500/30';

            return (
              <div
                key={lab.id}
                onClick={() => handleLaunchLab(lab)}
                className={`rounded-xl bg-[#0c1218] border transition-all p-5 flex flex-col justify-between group cursor-pointer ${
                  isCompleted
                    ? 'border-emerald-500/40 bg-emerald-950/10'
                    : 'border-[#1a2634] hover:border-emerald-500/40'
                }`}
              >
                <div>
                  {/* Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded border ${difficultyColor}`}>
                      {lab.difficulty}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-emerald-400">+{lab.xpReward} XP</span>
                      {isCompleted && (
                        <div className="flex items-center gap-1 text-xs text-emerald-400 font-mono">
                          <CheckCircle2 className="w-4 h-4 fill-emerald-500/20" />
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-100 font-mono group-hover:text-emerald-300 transition-colors mb-2">
                    {lab.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                    {lab.overview}
                  </p>

                  <div className="p-2.5 rounded-lg bg-[#080d12] border border-[#16212b] text-[11px] font-mono text-slate-400 space-y-1 mb-4">
                    <div className="text-slate-500 uppercase text-[9px]">Target Host</div>
                    <div className="text-slate-200 truncate">{lab.targetEnvironment}</div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#16212b] flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-slate-500 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>~{lab.estimatedMinutes} mins</span>
                  </div>

                  <button
                    onClick={() => handleLaunchLab(lab)}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs shadow-emerald-950"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isCompleted ? t.labs.resumeLab : t.labs.startLab}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Local Vulnerable VM Setup Guide Modal */}
        <VulnerableVmGuideModal
          isOpen={showVmGuideModal}
          onClose={() => setShowVmGuideModal(false)}
        />
      </div>
    );
  }

  // Active Lab Workspace
  const isLabCompleted = completedLabs.includes(activeLab.id);

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-12">
      {/* Active Lab Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#0c1218] border border-[#1b2634]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundEffects.playKeyClick();
              setActiveLab(null);
              if (onNavigate) {
                onNavigate('labs');
              }
            }}
            className="p-2 rounded-lg bg-[#080d12] hover:bg-[#15202c] border border-[#1a2634] text-slate-300 transition-colors"
            title="Return to Lab Index"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                {activeLab.difficulty}
              </span>
              <span className="text-xs font-mono text-slate-400">
                +{activeLab.xpReward} XP Reward
              </span>
            </div>
            <h1 className="text-lg font-bold font-mono text-slate-100">
              {activeLab.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isLabCompleted && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{t.labs.completed}</span>
            </div>
          )}
          <button
            onClick={handleResetTerminal}
            className="px-3 py-1.5 rounded-lg bg-[#14202c] hover:bg-[#1a2a3a] border border-[#233547] text-slate-300 text-xs font-mono flex items-center gap-1.5"
            title={t.labs.resetLab}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.labs.resetLab}</span>
          </button>
        </div>
      </div>

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Briefing, Objectives, Hints & Flag Submission */}
        <div className="lg:col-span-5 space-y-4">
          {/* Mission Briefing */}
          <div className="p-4 rounded-xl bg-[#0c1218] border border-[#1b2634] space-y-3">
            <h3 className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
              Scenario Briefing
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {activeLab.overview}
            </p>

            <div className="p-2.5 rounded bg-[#080d12] border border-[#18232e] text-[11px] font-mono text-slate-400">
              <span className="text-slate-500">Notice: </span>
              <span className="text-slate-300">{activeLab.authorizationNotice}</span>
            </div>
          </div>

          {/* Mission Objectives Checklist */}
          <div className="p-4 rounded-xl bg-[#0c1218] border border-[#1b2634] space-y-3">
            <h3 className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
              {t.labs.objectives}
            </h3>
            <div className="space-y-2">
              {activeLab.objectives.map((obj, i) => (
                <div
                  key={obj.id}
                  className="p-2.5 rounded-lg bg-[#080d12] border border-[#16212c] flex items-start gap-2.5 text-xs font-mono text-slate-300"
                >
                  <span className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                    {i + 1}
                  </span>
                  <span>{obj.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Progressive Hints Accordion */}
          <div className="p-4 rounded-xl bg-[#0c1218] border border-[#1b2634] space-y-2.5">
            <h3 className="text-xs font-mono text-amber-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{t.labs.hints}</span>
            </h3>

            <div className="space-y-2">
              {activeLab.hints.map((hint, idx) => {
                const isRevealed = revealedHints.includes(idx);
                return (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-[#080d12] border border-[#192430] text-xs font-mono"
                  >
                    {isRevealed ? (
                      <p className="text-slate-200">{hint}</p>
                    ) : (
                      <button
                        onClick={() => handleRevealHint(idx)}
                        className="w-full flex items-center justify-between text-slate-400 hover:text-amber-300 transition-colors"
                      >
                        <span>Hint #{idx + 1} (Click to Reveal)</span>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Flag Submission Form */}
          <div className="p-4 rounded-xl bg-[#0c1218] border border-emerald-500/30 space-y-3 cyber-glow">
            <h3 className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              <span>Challenge Flag Verification</span>
            </h3>

            <form onSubmit={handleFlagSubmit} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={flagInput}
                  onChange={(e) => setFlagInput(e.target.value)}
                  placeholder={t.labs.flagInputPlaceholder}
                  className="flex-1 bg-[#080d12] border border-[#1e2d3b] focus:border-emerald-500/50 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3 h-3" />
                  <span>{t.labs.submitFlag}</span>
                </button>
              </div>

              {submissionFeedback.status && (
                <div
                  className={`p-2.5 rounded-lg text-xs font-mono flex items-center gap-2 ${
                    submissionFeedback.status === 'success'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-red-500/20 text-red-300 border border-red-500/40'
                  }`}
                >
                  {submissionFeedback.status === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  )}
                  <span>{submissionFeedback.message}</span>
                </div>
              )}
            </form>

            {/* Defensive Takeaway */}
            <div className="pt-2 border-t border-[#18232e] text-[11px] font-sans text-slate-400 leading-normal">
              <span className="text-emerald-400 font-mono font-semibold block mb-0.5">
                {t.labs.defensiveTakeaway}:
              </span>
              {activeLab.defensiveTakeaway}
            </div>
          </div>
        </div>

        {/* Right Column: Virtual Kali Terminal Console */}
        <div className="lg:col-span-7 flex flex-col h-[650px] rounded-xl bg-[#080d12] border border-[#1c2937] overflow-hidden cyber-glow">
          {/* Terminal Title Bar */}
          <div className="px-4 py-2.5 bg-[#0d141b] border-b border-[#1c2937] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-xs font-mono text-slate-300 ms-2">
                {activeLab.simulatedTerminal.initialPrompt}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>ISOLATED SHELL</span>
            </div>
          </div>

          {/* Terminal Output Screen */}
          <div
            onClick={() => terminalInputRef.current?.focus()}
            className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-1 text-slate-200 select-text cursor-text"
          >
            {terminalLogs.map((log, index) => (
              <div
                key={index}
                className={
                  log.startsWith('student@') || log.startsWith('analyst@') || log.startsWith('trainee@') || log.startsWith('pentester@') || log.startsWith('cryptanalyst@') || log.startsWith('blueteam@')
                    ? 'text-emerald-400 font-semibold'
                    : log.includes('FLAG{')
                    ? 'text-yellow-300 bg-yellow-500/10 p-1 rounded font-bold'
                    : log.startsWith('[+]')
                    ? 'text-cyan-300'
                    : log.startsWith('[-]')
                    ? 'text-red-400'
                    : 'text-slate-300 whitespace-pre-wrap'
                }
              >
                {log}
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>

          {/* Terminal Command Line Input */}
          <form
            onSubmit={handleCommandSubmit}
            className="p-3 bg-[#0c1218] border-t border-[#1c2937] flex items-center gap-2 font-mono text-xs"
          >
            <span className="text-emerald-400 font-semibold shrink-0">
              {activeLab.simulatedTerminal.initialPrompt}
            </span>
            <input
              ref={terminalInputRef}
              type="text"
              value={cmdInput}
              onChange={(e) => setCmdInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type command (e.g. 'help', 'nmap', 'curl')..."
              className="flex-1 bg-transparent text-slate-100 placeholder-slate-600 focus:outline-hidden"
              autoFocus
            />
            <button
              type="submit"
              className="px-3 py-1 rounded bg-[#172330] hover:bg-emerald-500 hover:text-slate-950 text-slate-300 font-semibold transition-colors"
            >
              Execute
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
