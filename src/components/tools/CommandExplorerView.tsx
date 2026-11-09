import React, { useState, useMemo } from 'react';
import {
  Terminal,
  Search,
  Copy,
  Check,
  Shield,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowRight,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Translations } from '../../data/translations';
import { getAllCommandsAcrossTools } from '../../data/commandLibraryData';
import { soundEffects } from '../../utils/audio';
import { PageId } from '../layout/Sidebar';

interface CommandExplorerViewProps {
  t: Translations;
  onNavigate: (page: PageId, targetId?: string) => void;
  onSelectTool: (toolId: string) => void;
}

export const CommandExplorerView: React.FC<CommandExplorerViewProps> = ({
  t,
  onNavigate,
  onSelectTool,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedToolFilter, setSelectedToolFilter] = useState<string>('all');
  const [safeOnly, setSafeOnly] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [expandedCmdId, setExpandedCmdId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  // Retrieve indexed command collection
  const allIndexedCommands = useMemo(() => {
    return getAllCommandsAcrossTools();
  }, []);

  // Collect unique tools and categories
  const { categories, toolsList } = useMemo(() => {
    const cats = new Set<string>();
    const tools = new Set<string>();

    allIndexedCommands.forEach((item) => {
      if (item.category) cats.add(item.category);
      if (item.toolName) tools.add(item.toolName);
    });

    return {
      categories: Array.from(cats).sort(),
      toolsList: Array.from(tools).sort(),
    };
  }, [allIndexedCommands]);

  // Filter commands
  const filteredItems = useMemo(() => {
    const q = search.toLowerCase().trim();
    return allIndexedCommands.filter((item) => {
      const matchesSearch =
        !q ||
        item.command.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.explanation.toLowerCase().includes(q) ||
        item.toolName.toLowerCase().includes(q) ||
        (item.flagsExplained && item.flagsExplained.some(
          (f: { flag: string; meaning: string }) =>
            f.flag.toLowerCase().includes(q) || f.meaning.toLowerCase().includes(q)
        ));

      const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesDiff = selectedDifficulty === 'all' || item.difficulty === selectedDifficulty;
      const matchesTool = selectedToolFilter === 'all' || item.toolName === selectedToolFilter;
      const matchesSafe = !safeOnly || item.isSafeForLab;

      return matchesSearch && matchesCat && matchesDiff && matchesTool && matchesSafe;
    });
  }, [allIndexedCommands, search, selectedCategory, selectedDifficulty, selectedToolFilter, safeOnly]);

  const totalPages = Math.ceil(filteredItems.length / pageSize) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  const handleCopy = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    soundEffects.playKeyClick();
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleAskMentor = (toolName: string, cmd: string) => {
    soundEffects.playKeyClick();
    onNavigate(
      'mentor',
      `Explain this cybersecurity command for ${toolName}: ${cmd}. Break down the flags, expected behavior, and ethical authorization checklist.`
    );
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Header */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#0c1218] border border-[#1b2634] space-y-3.5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Main search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search 11,000+ commands by flag (-sS, -A, -w), task, tool, or syntax..."
              className="w-full bg-[#080d12] border border-[#1a2634] focus:border-emerald-500/40 rounded-lg ps-9 pe-4 py-2.5 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-hidden"
            />
            {search && (
              <button
                onClick={() => {
                  setSearch('');
                  setCurrentPage(1);
                }}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Tool Filter Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={selectedToolFilter}
              onChange={(e) => {
                setSelectedToolFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#080d12] border border-[#1a2634] rounded-lg px-2.5 py-2 text-xs font-mono text-slate-200 focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Tools ({toolsList.length})</option>
              {toolsList.map((tName) => (
                <option key={tName} value={tName}>
                  {tName}
                </option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => {
                setSelectedDifficulty(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#080d12] border border-[#1a2634] rounded-lg px-2.5 py-2 text-xs font-mono text-slate-200 focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            {/* Safe Lab Only Checkbox */}
            <button
              onClick={() => {
                soundEffects.playKeyClick();
                setSafeOnly(!safeOnly);
                setCurrentPage(1);
              }}
              className={`px-3 py-2 rounded-lg font-mono text-xs flex items-center gap-1.5 border transition-all ${
                safeOnly
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-[#080d12] text-slate-400 border-[#1a2634] hover:text-slate-200'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Safe Lab Only</span>
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono scrollbar-none">
          <button
            onClick={() => {
              soundEffects.playKeyClick();
              setSelectedCategory('all');
              setCurrentPage(1);
            }}
            className={`px-2.5 py-1 rounded-md shrink-0 transition-colors border ${
              selectedCategory === 'all'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                : 'bg-[#080d12] text-slate-400 border-[#1a2634] hover:text-slate-200'
            }`}
          >
            All Categories ({allIndexedCommands.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                soundEffects.playKeyClick();
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded-md shrink-0 transition-colors border ${
                selectedCategory === cat
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                  : 'bg-[#080d12] text-slate-400 border-[#1a2634] hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
        <span>
          Showing {(currentPage - 1) * pageSize + 1} to{' '}
          {Math.min(currentPage * pageSize, filteredItems.length)} of {filteredItems.length} commands
        </span>
        <span className="text-emerald-400 font-semibold">
          Total Indexed: {allIndexedCommands.length.toLocaleString()} verified commands
        </span>
      </div>

      {/* Command Cards List */}
      <div className="space-y-3.5">
        {paginatedItems.map((item, idx) => {
          const isExpanded = expandedCmdId === item.id;
          return (
            <div
              key={item.id || idx}
              className="p-4 sm:p-5 rounded-xl bg-[#0c1218] border border-[#1a2634] hover:border-emerald-500/30 transition-all space-y-3"
            >
              {/* Header: Tool Name, Category, Badges */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => onSelectTool(item.toolId)}
                    className="font-mono text-xs font-bold text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1"
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>{item.toolName}</span>
                  </button>
                  <span className="text-slate-600 font-mono text-xs">/</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {item.category}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      item.difficulty === 'Beginner'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : item.difficulty === 'Intermediate'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}
                  >
                    {item.difficulty}
                  </span>
                  {item.isSafeForLab && (
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      <span>Safe For Lab</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <button
                    onClick={() => handleCopy(item.command)}
                    className="px-2.5 py-1 rounded-md bg-[#14202c] hover:bg-emerald-500 hover:text-slate-950 border border-[#233547] text-slate-300 text-xs font-mono flex items-center gap-1 transition-colors"
                  >
                    {copiedCmd === item.command ? (
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
                    onClick={() => handleAskMentor(item.toolName, item.command)}
                    className="px-2.5 py-1 rounded-md bg-[#14202c] hover:bg-[#1f3144] border border-[#233547] text-emerald-400 text-xs font-mono flex items-center gap-1 transition-colors"
                    title="Explain in AI Mentor"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Ask AI</span>
                  </button>

                  <button
                    onClick={() => onSelectTool(item.toolId)}
                    className="px-2.5 py-1 rounded-md bg-[#14202c] hover:bg-slate-700 border border-[#233547] text-slate-300 text-xs font-mono flex items-center gap-1 transition-colors"
                    title="Open full tool view"
                  >
                    <span>Inspect Tool</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Description */}
              <h4 className="text-sm font-bold text-slate-100 font-mono">
                {item.description}
              </h4>

              {/* Command Codebox */}
              <div className="p-3 rounded-lg bg-[#070b0e] border border-[#172330] font-mono text-xs text-emerald-300 flex items-center justify-between gap-2 overflow-x-auto">
                <span>$ {item.command}</span>
              </div>

              {/* Explanation */}
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {item.explanation}
              </p>

              {/* Expand Toggle */}
              <div className="pt-1">
                <button
                  onClick={() =>
                    setExpandedCmdId(expandedCmdId === item.id ? null : item.id || null)
                  }
                  className="text-[11px] font-mono text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
                >
                  <span>
                    {isExpanded
                      ? 'Hide Details & Output'
                      : 'View Flag Breakdown & Output'}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Collapsible Details */}
              {isExpanded && (
                <div className="space-y-3 pt-2 border-t border-[#172330]">
                  {item.flagsExplained && item.flagsExplained.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold tracking-wider">
                        Flags Breakdown
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {item.flagsExplained.map((f: { flag: string; meaning: string }, fi: number) => (
                          <div
                            key={fi}
                            className="p-2 rounded bg-[#070b0e] border border-[#16222e] text-xs font-mono"
                          >
                            <span className="text-emerald-400 font-bold block">{f.flag}</span>
                            <span className="text-slate-400 text-[11px]">{f.meaning}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {item.expectedOutput && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold tracking-wider">
                        Expected Terminal Output
                      </span>
                      <pre className="p-3 rounded bg-[#05080b] border border-[#141d27] font-mono text-[11px] text-slate-300 whitespace-pre-wrap overflow-x-auto">
                        {item.expectedOutput}
                      </pre>
                    </div>
                  )}

                  {item.commonMistakes && (
                    <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/30 text-xs font-mono text-amber-300 flex items-start gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
                      <div>
                        <span className="font-bold block">Avoid This Mistake:</span>
                        <span className="text-slate-300 font-sans text-xs">
                          {item.commonMistakes}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="p-12 text-center rounded-xl bg-[#0c1218] border border-[#1a2634] space-y-2">
          <Terminal className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="font-mono text-slate-300 text-sm">No commands matched your query</p>
          <p className="font-mono text-slate-500 text-xs">
            Try adjusting your search terms, selecting All Categories, or resetting filters.
          </p>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 rounded-xl bg-[#0c1218] border border-[#1b2634] font-mono text-xs text-slate-400">
          <div>
            Page {currentPage} of {totalPages} ({filteredItems.length} matching commands)
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundEffects.playKeyClick();
                setCurrentPage((p) => Math.max(1, p - 1));
              }}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-[#14202c] border border-[#223345] hover:bg-[#1b2b3a] disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-slate-200 font-bold px-2">Page {currentPage}</span>
            <button
              onClick={() => {
                soundEffects.playKeyClick();
                setCurrentPage((p) => Math.min(totalPages, p + 1));
              }}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg bg-[#14202c] border border-[#223345] hover:bg-[#1b2b3a] disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
