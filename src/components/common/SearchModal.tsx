import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Terminal, FlaskConical, Wrench, Compass, ArrowRight } from 'lucide-react';
import { KALI_TOOLS_DATA } from '../../data/toolsData';
import { PRACTICE_LABS_DATA } from '../../data/labsData';
import { searchLessons } from '../../data/roadmapData';
import { PageId } from '../layout/Sidebar';
import { Translations } from '../../data/translations';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: PageId, targetId?: string) => void;
  t: Translations;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  t,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  const matchedTools = cleanQuery
    ? KALI_TOOLS_DATA.filter(
        (t) =>
          t.name.toLowerCase().includes(cleanQuery) ||
          t.category.toLowerCase().includes(cleanQuery) ||
          t.tags.some((tag) => tag.toLowerCase().includes(cleanQuery))
      ).slice(0, 5)
    : [];

  const matchedLabs = cleanQuery
    ? PRACTICE_LABS_DATA.filter(
        (l) =>
          l.title.toLowerCase().includes(cleanQuery) ||
          l.category.toLowerCase().includes(cleanQuery) ||
          l.difficulty.toLowerCase().includes(cleanQuery)
      ).slice(0, 4)
    : [];

  const matchedLessons = cleanQuery
    ? searchLessons(cleanQuery).slice(0, 4)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-xs">
      <div
        className="relative w-full max-w-2xl bg-[#0c1218] border border-emerald-500/30 rounded-xl shadow-2xl overflow-hidden cyber-glow"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#1b2734] bg-[#090e13]">
          <Search className="w-5 h-5 text-emerald-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.tools.searchPlaceholder}
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm font-mono focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs font-mono text-slate-400 bg-slate-800 rounded hover:bg-slate-700"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!cleanQuery && (
            <div className="text-xs font-mono text-slate-400 py-6 text-center">
              <p className="text-slate-300 font-semibold mb-2">Quick Navigation Shortcuts</p>
              <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
                <button
                  onClick={() => {
                    onNavigate('tools');
                    onClose();
                  }}
                  className="px-2.5 py-1.5 rounded bg-[#131d27] border border-[#1f2f3e] hover:border-emerald-500/40 text-slate-300 flex items-center gap-1.5"
                >
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Kali Tools</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate('labs');
                    onClose();
                  }}
                  className="px-2.5 py-1.5 rounded bg-[#131d27] border border-[#1f2f3e] hover:border-emerald-500/40 text-slate-300 flex items-center gap-1.5"
                >
                  <FlaskConical className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Practice Labs</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate('utilities');
                    onClose();
                  }}
                  className="px-2.5 py-1.5 rounded bg-[#131d27] border border-[#1f2f3e] hover:border-emerald-500/40 text-slate-300 flex items-center gap-1.5"
                >
                  <Wrench className="w-3.5 h-3.5 text-amber-400" />
                  <span>Security Utilities</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate('roadmap');
                    onClose();
                  }}
                  className="px-2.5 py-1.5 rounded bg-[#131d27] border border-[#1f2f3e] hover:border-emerald-500/40 text-slate-300 flex items-center gap-1.5"
                >
                  <Compass className="w-3.5 h-3.5 text-purple-400" />
                  <span>Learning Roadmap</span>
                </button>
              </div>
            </div>
          )}

          {/* Matched Kali Tools */}
          {matchedTools.length > 0 && (
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                <span>Kali Linux Tools ({matchedTools.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchedTools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => {
                      onNavigate('tools', tool.id);
                      onClose();
                    }}
                    className="w-full text-start p-2.5 rounded-lg bg-[#111922] hover:bg-emerald-950/30 border border-[#1c2937] hover:border-emerald-500/40 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-200 group-hover:text-emerald-300 font-mono">
                        {tool.name}
                      </div>
                      <div className="text-xs text-slate-400 line-clamp-1">
                        {tool.shortDescription}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Practice Labs */}
          {matchedLabs.length > 0 && (
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5" />
                <span>Practice Labs ({matchedLabs.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchedLabs.map((lab) => (
                  <button
                    key={lab.id}
                    onClick={() => {
                      onNavigate('labs', lab.id);
                      onClose();
                    }}
                    className="w-full text-start p-2.5 rounded-lg bg-[#111922] hover:bg-cyan-950/30 border border-[#1c2937] hover:border-cyan-500/40 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-200 group-hover:text-cyan-300 font-mono">
                        {lab.title}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="text-emerald-400 font-mono">+{lab.xpReward} XP</span>
                        <span>•</span>
                        <span>{lab.difficulty}</span>
                        <span>•</span>
                        <span>{lab.estimatedMinutes} mins</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Roadmap Lessons */}
          {matchedLessons.length > 0 && (
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-purple-400 mb-2 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                <span>Roadmap Lessons ({matchedLessons.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchedLessons.map((item) => (
                  <button
                    key={item.lesson.id}
                    onClick={() => {
                      onNavigate('roadmap', item.lesson.id);
                      onClose();
                    }}
                    className="w-full text-start p-2.5 rounded-lg bg-[#111922] hover:bg-purple-950/30 border border-[#1c2937] hover:border-purple-500/40 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-200 group-hover:text-purple-300 font-mono">
                        {item.lesson.title}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="text-purple-400 font-mono">{item.phase.title}</span>
                        <span>•</span>
                        <span>~{item.lesson.estimatedMinutes} mins</span>
                        <span>•</span>
                        <span className="capitalize">{item.lesson.difficulty}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {cleanQuery && matchedTools.length === 0 && matchedLabs.length === 0 && matchedLessons.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-sm font-mono">
              <p>No tools, labs, or lessons match &quot;{query}&quot;</p>
              <p className="text-xs text-slate-500 mt-1">
                Try searching for &quot;nmap&quot;, &quot;sqli&quot;, &quot;hashcat&quot;, &quot;linux&quot;, or &quot;recon&quot;
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
