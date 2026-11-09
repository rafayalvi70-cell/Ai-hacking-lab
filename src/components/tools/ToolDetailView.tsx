import React, { useState, useMemo } from 'react';
import {
  Terminal,
  Bookmark,
  ExternalLink,
  Copy,
  Check,
  Shield,
  HelpCircle,
  FlaskConical,
  X,
  Search,
  AlertTriangle,
  BookOpen,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Download,
  Layers,
} from 'lucide-react';
import { Translations } from '../../data/translations';
import { KaliTool, RiskLevel, ToolDifficulty } from '../../types/cyber';
import { getToolCommandLibrary, getToolTroubleshooting, getToolLabExercises } from '../../data/commandLibraryData';
import { soundEffects } from '../../utils/audio';
import { PageId } from '../layout/Sidebar';
import { SmartInstallerTab } from './SmartInstallerTab';

interface ToolDetailViewProps {
  tool: KaliTool;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (toolId: string) => void;
  onNavigate: (page: PageId, targetId?: string) => void;
  t: Translations;
}

export const ToolDetailView: React.FC<ToolDetailViewProps> = ({
  tool,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onNavigate,
  t,
}) => {
  const [activeTab, setActiveTab] = useState<'commands' | 'overview' | 'installation' | 'troubleshooting' | 'labs'>('commands');
  const [commandSearch, setCommandSearch] = useState('');
  const [selectedCmdCategory, setSelectedCmdCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [expandedCmdId, setExpandedCmdId] = useState<string | null>(null);
  const [selectedLang, setSelectedLang] = useState<'en' | 'ur' | 'roman_ur'>('en');

  // Retrieve 20+ specialized commands, troubleshooting, and lab exercises
  const allCommands = useMemo(() => getToolCommandLibrary(tool), [tool]);
  const troubleshootingList = useMemo(() => getToolTroubleshooting(tool), [tool]);
  const labExercises = useMemo(() => getToolLabExercises(tool), [tool]);

  // Unique command categories for filtering
  const commandCategories = useMemo(() => {
    const cats = new Set<string>();
    allCommands.forEach((c) => {
      if (c.category) cats.add(c.category);
    });
    return Array.from(cats);
  }, [allCommands]);

  // Filtered commands
  const filteredCommands = useMemo(() => {
    const q = commandSearch.toLowerCase().trim();
    return allCommands.filter((cmd) => {
      const matchesSearch =
        !q ||
        cmd.command.toLowerCase().includes(q) ||
        cmd.description.toLowerCase().includes(q) ||
        cmd.explanation.toLowerCase().includes(q) ||
        cmd.flagsExplained?.some((f) => f.flag.toLowerCase().includes(q) || f.meaning.toLowerCase().includes(q));

      const matchesCat = selectedCmdCategory === 'all' || cmd.category === selectedCmdCategory;
      const matchesDiff = selectedDifficulty === 'all' || cmd.difficulty === selectedDifficulty;

      return matchesSearch && matchesCat && matchesDiff;
    });
  }, [allCommands, commandSearch, selectedCmdCategory, selectedDifficulty]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    soundEffects.playKeyClick();
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleAskMentor = (cmdText: string) => {
    soundEffects.playKeyClick();
    onClose();
    onNavigate('mentor', `Explain the cybersecurity purpose, flags, and ethical considerations of this command: ${cmdText}`);
  };

  const getRiskBadgeColor = (risk?: RiskLevel) => {
    switch (risk) {
      case 'Critical':
        return 'bg-red-500/15 text-red-400 border-red-500/30';
      case 'High':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Medium':
        return 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl max-h-[92vh] bg-[#0a0f14] border border-emerald-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col cyber-glow"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-5 border-b border-[#1b2734] bg-[#0c141d] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono text-base font-bold shrink-0">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded border ${getRiskBadgeColor(tool.riskLevel)}`}>
                  {tool.riskLevel || 'Medium'} Risk
                </span>
                <span className="text-xs font-mono text-slate-400 uppercase bg-[#070b0e] px-2 py-0.5 rounded border border-[#172330]">
                  {tool.category.replace(/_/g, ' ')}
                </span>
                <span className="text-xs font-mono text-emerald-400">
                  {allCommands.length} Commands Available
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-slate-100 flex items-center gap-2">
                <span>{tool.name}</span>
                {tool.purpose && (
                  <span className="text-xs font-normal text-slate-400 hidden md:inline">
                    — {tool.purpose}
                  </span>
                )}
              </h2>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={() => onToggleBookmark(tool.id)}
              className={`p-2 rounded-lg border font-mono text-xs flex items-center gap-1.5 transition-colors ${
                isBookmarked
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'bg-[#14202c] text-slate-400 border-[#223547] hover:text-slate-200'
              }`}
              title={isBookmarked ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">{isBookmarked ? 'Favorited' : 'Favorite'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <div className="px-5 py-2.5 bg-[#080d12] border-b border-[#192430] flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <button
              onClick={() => { soundEffects.playKeyClick(); setActiveTab('commands'); }}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                activeTab === 'commands'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>Command Library ({allCommands.length})</span>
            </button>

            <button
              onClick={() => { soundEffects.playKeyClick(); setActiveTab('overview'); }}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                activeTab === 'overview'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>Overview & Syntax</span>
            </button>

            <button
              onClick={() => { soundEffects.playKeyClick(); setActiveTab('installation'); }}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                activeTab === 'installation'
                  ? 'bg-[#14202c] text-cyan-300 border border-cyan-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Installation & GitHub</span>
            </button>

            <button
              onClick={() => { soundEffects.playKeyClick(); setActiveTab('troubleshooting'); }}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                activeTab === 'troubleshooting'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Troubleshooting ({troubleshootingList.length})</span>
            </button>

            <button
              onClick={() => { soundEffects.playKeyClick(); setActiveTab('labs'); }}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                activeTab === 'labs'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5 text-purple-400" />
              <span>Safe Lab Exercises ({labExercises.length})</span>
            </button>
          </div>

          {tool.officialDocsUrl && (
            <a
              href={tool.officialDocsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-slate-400 hover:text-emerald-400 flex items-center gap-1 shrink-0"
            >
              <span>Official Docs</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* Modal Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* TAB 1: Command Library */}
          {activeTab === 'commands' && (
            <div className="space-y-4">
              {/* Search & Filter Controls within Commands */}
              <div className="p-3.5 rounded-xl bg-[#0c141c] border border-[#1b2837] space-y-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={commandSearch}
                      onChange={(e) => setCommandSearch(e.target.value)}
                      placeholder="Search within this tool's command library by flag, task, or description..."
                      className="w-full bg-[#070b0f] border border-[#1a2634] focus:border-emerald-500/40 rounded-lg ps-9 pe-4 py-2 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-hidden"
                    />
                    {commandSearch && (
                      <button
                        onClick={() => setCommandSearch('')}
                        className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className="bg-[#070b0f] border border-[#1a2634] rounded-lg px-2.5 py-2 text-xs font-mono text-slate-200 focus:outline-hidden cursor-pointer"
                    >
                      <option value="all">All Difficulties</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                {/* Category Pills */}
                {commandCategories.length > 0 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono scrollbar-none">
                    <button
                      onClick={() => { soundEffects.playKeyClick(); setSelectedCmdCategory('all'); }}
                      className={`px-2.5 py-1 rounded-md shrink-0 border transition-colors ${
                        selectedCmdCategory === 'all'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                          : 'bg-[#070b0f] text-slate-400 border-[#1a2634] hover:text-slate-200'
                      }`}
                    >
                      All Categories ({allCommands.length})
                    </button>
                    {commandCategories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => { soundEffects.playKeyClick(); setSelectedCmdCategory(cat); }}
                        className={`px-2.5 py-1 rounded-md shrink-0 border transition-colors ${
                          selectedCmdCategory === cat
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                            : 'bg-[#070b0f] text-slate-400 border-[#1a2634] hover:text-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Commands List Cards */}
              <div className="space-y-3">
                {filteredCommands.length === 0 ? (
                  <div className="p-8 text-center rounded-xl bg-[#0c1218] border border-[#1a2634] space-y-1">
                    <p className="font-mono text-slate-300 text-sm">No commands matched your filter criteria.</p>
                    <p className="font-mono text-slate-500 text-xs">Try clearing the search query or selecting All Categories.</p>
                  </div>
                ) : (
                  filteredCommands.map((cmd, idx) => {
                    const isExpanded = expandedCmdId === cmd.id || (filteredCommands.length <= 4);
                    return (
                      <div
                        key={cmd.id || idx}
                        className="rounded-xl bg-[#0c1218] border border-[#1a2634] hover:border-emerald-500/30 transition-all p-4 space-y-3"
                      >
                        {/* Top: Description & Category */}
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                                {cmd.category}
                              </span>
                              <span
                                className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                                  cmd.difficulty === 'Beginner'
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                    : cmd.difficulty === 'Intermediate'
                                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                    : 'bg-red-500/10 text-red-400 border-red-500/20'
                                }`}
                              >
                                {cmd.difficulty}
                              </span>
                              {cmd.isSafeForLab && (
                                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                                  <Shield className="w-3 h-3" />
                                  <span>Safe For Labs</span>
                                </span>
                              )}
                            </div>
                            <h4 className="text-sm font-bold text-slate-100 font-mono">
                              {cmd.description}
                            </h4>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => handleCopy(cmd.command)}
                              className="px-2.5 py-1 rounded-md bg-[#14202c] hover:bg-emerald-500 hover:text-slate-950 border border-[#233547] text-slate-300 text-xs font-mono flex items-center gap-1 transition-colors"
                              title="Copy command"
                            >
                              {copiedText === cmd.command ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-emerald-400">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => handleAskMentor(cmd.command)}
                              className="px-2.5 py-1 rounded-md bg-[#14202c] hover:bg-[#1e3044] border border-[#233547] text-emerald-400 text-xs font-mono flex items-center gap-1 transition-colors"
                              title="Explain this command in AI Mentor"
                            >
                              <HelpCircle className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">AI Explain</span>
                            </button>
                          </div>
                        </div>

                        {/* Executable Command Block */}
                        <div className="p-3 rounded-lg bg-[#070b0e] border border-[#172330] font-mono text-xs text-emerald-300 flex items-center justify-between gap-2 overflow-x-auto">
                          <span>$ {cmd.command}</span>
                        </div>

                        {/* Explanation */}
                        <p className="text-xs text-slate-300 font-sans leading-relaxed">
                          {cmd.explanation}
                        </p>

                        {/* Toggle flag details button */}
                        <div className="pt-1">
                          <button
                            onClick={() => setExpandedCmdId(expandedCmdId === cmd.id ? null : cmd.id || null)}
                            className="text-[11px] font-mono text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
                          >
                            <span>{isExpanded ? 'Hide Technical Breakdown & Output' : 'View Flags & Expected Output'}</span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        {/* Collapsible Details: Flags breakdown, expected output & common mistakes */}
                        {isExpanded && (
                          <div className="space-y-3 pt-2 border-t border-[#172330]">
                            {/* Flags breakdown */}
                            {cmd.flagsExplained && cmd.flagsExplained.length > 0 && (
                              <div className="space-y-1.5">
                                <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold tracking-wider">
                                  Option & Flag Breakdown
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {cmd.flagsExplained.map((f, fi) => (
                                    <div key={fi} className="p-2 rounded bg-[#070b0e] border border-[#16222e] text-xs font-mono">
                                      <span className="text-emerald-400 font-bold block">{f.flag}</span>
                                      <span className="text-slate-400 text-[11px]">{f.meaning}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Expected terminal output */}
                            {cmd.expectedOutput && (
                              <div className="space-y-1">
                                <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold tracking-wider">
                                  Expected Terminal Output
                                </span>
                                <pre className="p-3 rounded bg-[#05080b] border border-[#141d27] font-mono text-[11px] text-slate-300 whitespace-pre-wrap overflow-x-auto">
                                  {cmd.expectedOutput}
                                </pre>
                              </div>
                            )}

                            {/* Common Mistakes */}
                            {cmd.commonMistakes && (
                              <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/30 text-xs font-mono text-amber-300 flex items-start gap-2">
                                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
                                <div>
                                  <span className="font-bold block">Common Trainee Mistake:</span>
                                  <span className="text-slate-300 font-sans text-xs">{cmd.commonMistakes}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Overview & Syntax */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* Detailed Description */}
              <div className="p-5 rounded-xl bg-[#0c141c] border border-[#1b2837] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-bold">
                    Overview & Engineering Description
                  </h4>

                  {/* Independent Language Selector */}
                  <div className="flex items-center gap-1 bg-[#080d12] border border-[#1b2634] p-0.5 rounded-lg text-[11px] font-mono">
                    <button
                      onClick={() => setSelectedLang('en')}
                      className={`px-2 py-0.5 rounded ${selectedLang === 'en' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      EN
                    </button>
                    <button
                      onClick={() => setSelectedLang('ur')}
                      className={`px-2 py-0.5 rounded ${selectedLang === 'ur' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      اردو (RTL)
                    </button>
                    <button
                      onClick={() => setSelectedLang('roman_ur')}
                      className={`px-2 py-0.5 rounded ${selectedLang === 'roman_ur' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      Roman Urdu
                    </button>
                  </div>
                </div>

                {/* Localized Content */}
                {selectedLang === 'ur' ? (
                  <p className="text-sm text-slate-200 leading-relaxed font-sans text-right" dir="rtl">
                    {tool.descriptionUr || `${tool.name} کالی لینکس کا تصدیق شدہ سیکیورٹی اور ایتھیکل ہیکنگ ٹول ہے۔ ${tool.description}`}
                  </p>
                ) : selectedLang === 'roman_ur' ? (
                  <p className="text-sm text-slate-200 leading-relaxed font-sans">
                    {tool.descriptionRomanUr || `${tool.name} Kali Linux ka certified tool hai cybersecurity aur ethical testing ke liye. ${tool.description}`}
                  </p>
                ) : (
                  <p className="text-sm text-slate-300 leading-relaxed font-sans">
                    {tool.description}
                  </p>
                )}

                {tool.purpose && (
                  <div className="p-3 rounded-lg bg-[#070b0e] border border-[#172330] text-xs font-mono text-slate-300">
                    <span className="text-emerald-400 font-bold">Core Purpose: </span>
                    {tool.purpose}
                  </div>
                )}
              </div>

              {/* Installation Method */}
              {tool.installationMethod && (
                <div className="p-4 rounded-xl bg-[#0c141c] border border-[#1b2837] space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-bold">
                      Installation / Package Manager Syntax
                    </h4>
                    <button
                      onClick={() => handleCopy(tool.installationMethod || '')}
                      className="text-xs font-mono text-slate-400 hover:text-emerald-400 flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Install</span>
                    </button>
                  </div>
                  <div className="p-3 rounded-lg bg-[#070b0e] border border-[#172330] font-mono text-xs text-slate-200">
                    <span className="text-emerald-400">$ </span>
                    {tool.installationMethod}
                  </div>
                </div>
              )}

              {/* Basic Syntax */}
              <div className="p-4 rounded-xl bg-[#0c141c] border border-[#1b2837] space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-bold">
                    Standard Invocation Syntax
                  </h4>
                  <button
                    onClick={() => handleCopy(tool.syntax)}
                    className="text-xs font-mono text-slate-400 hover:text-emerald-400 flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Syntax</span>
                  </button>
                </div>
                <div className="p-3 rounded-lg bg-[#070b0e] border border-[#172330] font-mono text-xs text-emerald-300">
                  <span>{tool.syntax}</span>
                </div>
              </div>

              {/* Prerequisites & Related Tools */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#0c141c] border border-[#1b2837] space-y-2">
                  <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider font-bold">
                    Prerequisites & Permissions
                  </h4>
                  {tool.prerequisites && tool.prerequisites.length > 0 ? (
                    <ul className="space-y-1 text-xs font-mono text-slate-300">
                      {tool.prerequisites.map((req, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-500 font-mono">Standard non-privileged user access.</p>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-[#0c141c] border border-[#1b2837] space-y-2">
                  <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider font-bold">
                    Related Security Tools
                  </h4>
                  {tool.relatedTools && tool.relatedTools.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {tool.relatedTools.map((rel, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-md bg-[#070b0e] border border-[#1b2837] text-xs font-mono text-slate-300"
                        >
                          {rel}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 font-mono">Stand-alone utility.</p>
                  )}
                </div>
              </div>

              {/* Defensive Security Use Case */}
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1.5">
                <h4 className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
                  <Shield className="w-4 h-4" />
                  <span>Defensive Security & Blue Team Application</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                  {tool.defensiveUseCase}
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: Smart Kali Tool Installer */}
          {activeTab === 'installation' && (
            <SmartInstallerTab
              tool={tool}
              onNavigateToBridge={() => {
                onClose();
                onNavigate('bridge');
              }}
            />
          )}

          {/* TAB 3: Common Errors & Troubleshooting */}
          {activeTab === 'troubleshooting' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#0c141c] border border-[#1b2837]">
                <h4 className="text-xs font-mono text-amber-400 uppercase tracking-wider font-bold mb-1">
                  Common Execution Errors & Diagnostic Fixes
                </h4>
                <p className="text-xs text-slate-400">
                  Known pitfalls encountered when executing {tool.name} in virtualized labs and enterprise networks.
                </p>
              </div>

              <div className="space-y-3">
                {troubleshootingList.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#0c1218] border border-[#1a2634] space-y-2.5"
                  >
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-mono font-bold text-red-300 block">
                          Error Signature:
                        </span>
                        <code className="text-xs font-mono text-slate-200 bg-[#070b0e] px-2 py-0.5 rounded border border-[#172330] inline-block mt-1">
                          {item.error}
                        </code>
                      </div>
                    </div>

                    <div className="text-xs font-sans text-slate-300">
                      <strong className="text-slate-400 font-mono">Root Cause: </strong>
                      {item.cause}
                    </div>

                    <div className="p-3 rounded-lg bg-[#070b0e] border border-emerald-500/30 text-xs font-mono text-emerald-300">
                      <span className="text-emerald-400 font-bold block mb-1">Recommended Solution:</span>
                      {item.solution}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Safe Lab Exercises */}
          {activeTab === 'labs' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#0c141c] border border-[#1b2837]">
                <h4 className="text-xs font-mono text-purple-400 uppercase tracking-wider font-bold mb-1">
                  Authorized Safe Lab Exercises (Loopback & Isolated Subnet)
                </h4>
                <p className="text-xs text-slate-400">
                  Self-contained educational exercises designed to practice {tool.name} without violating boundaries.
                </p>
              </div>

              <div className="space-y-3">
                {labExercises.map((ex, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#0c1218] border border-[#1a2634] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold font-mono text-slate-200">
                        {ex.title}
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">
                        Authorized Lab
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 font-sans">
                      <strong className="text-slate-400 font-mono">Objective: </strong>
                      {ex.objective}
                    </div>

                    <div className="p-3 rounded-lg bg-[#070b0e] border border-[#16222e] font-mono text-xs text-emerald-300 flex items-center justify-between gap-2">
                      <span>$ {ex.commandToRun}</span>
                      <button
                        onClick={() => handleCopy(ex.commandToRun)}
                        className="text-slate-400 hover:text-emerald-400"
                        title="Copy exercise command"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-xs text-slate-400 font-mono">
                      <strong className="text-slate-500">Expected Result: </strong>
                      {ex.expectedResult}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Sticky Actions */}
        <div className="p-4 border-t border-[#1b2734] bg-[#0c141d] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onNavigate('mentor', `Explain the cybersecurity architecture, common use cases, and safe testing practices for the tool: ${tool.name}`);
              }}
              className="px-3.5 py-1.5 rounded-lg bg-[#14202c] hover:bg-[#1a2d3e] border border-[#223547] text-slate-200 font-mono text-xs flex items-center gap-1.5 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ask AI Mentor About {tool.name}</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onNavigate('labs');
              }}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Practice in Sandbox</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
