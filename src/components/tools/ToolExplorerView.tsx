import React, { useState, useMemo } from 'react';
import {
  Terminal,
  Search,
  Bookmark,
  ExternalLink,
  Copy,
  Check,
  Shield,
  HelpCircle,
  FlaskConical,
  X,
  Clock,
  ChevronLeft,
  ChevronRight,
  Filter,
  Layers,
} from 'lucide-react';
import { Translations } from '../../data/translations';
import { KaliTool, ToolCategory, RiskLevel } from '../../types/cyber';
import { KALI_TOOLS_DATA } from '../../data/toolsData';
import { addRecentlyViewedTool } from '../../utils/storage';
import { soundEffects } from '../../utils/audio';
import { PageId } from '../layout/Sidebar';
import { ToolDetailView } from './ToolDetailView';
import { CommandExplorerView } from './CommandExplorerView';

interface ToolExplorerViewProps {
  t: Translations;
  bookmarkedTools: string[];
  recentlyViewedTools?: string[];
  onToggleBookmark: (toolId: string) => void;
  onNavigate: (page: PageId, targetId?: string) => void;
  selectedToolId?: string;
}

export const ToolExplorerView: React.FC<ToolExplorerViewProps> = ({
  t,
  bookmarkedTools,
  recentlyViewedTools = [],
  onToggleBookmark,
  onNavigate,
  selectedToolId,
}) => {
  const [activeTab, setActiveTab] = useState<'armory' | 'commands'>('armory');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const [showRecentlyViewedOnly, setShowRecentlyViewedOnly] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 18;

  const [activeModalTool, setActiveModalTool] = useState<KaliTool | null>(() => {
    if (selectedToolId) {
      return KALI_TOOLS_DATA.find((t) => t.id === selectedToolId) || null;
    }
    return null;
  });

  // Sync modal when selectedToolId prop updates
  React.useEffect(() => {
    if (selectedToolId) {
      const tool = KALI_TOOLS_DATA.find((t) => t.id === selectedToolId);
      if (tool) {
        setActiveModalTool(tool);
        addRecentlyViewedTool(tool.id);
      }
    }
  }, [selectedToolId]);

  const categories: { id: ToolCategory | 'all'; label: string }[] = [
    { id: 'all', label: t.tools.allCategories },
    { id: 'information_gathering', label: 'Information Gathering' },
    { id: 'network_scanning', label: 'Network Scanning' },
    { id: 'vulnerability_analysis', label: 'Vulnerability Analysis' },
    { id: 'web_applications', label: 'Web Applications' },
    { id: 'password_attacks', label: 'Password Auditing' },
    { id: 'wireless_attacks', label: 'Wireless Security' },
    { id: 'exploitation', label: 'Exploitation Frameworks' },
    { id: 'digital_forensics', label: 'Digital Forensics' },
    { id: 'reverse_engineering', label: 'Reverse Engineering' },
    { id: 'malware_analysis', label: 'Malware Analysis' },
    { id: 'sniffing_spoofing', label: 'Sniffing & Spoofing' },
    { id: 'traffic_analysis', label: 'Traffic Analysis' },
    { id: 'post_exploitation', label: 'Post Exploitation' },
    { id: 'linux_admin', label: 'Linux Admin' },
    { id: 'cloud_security', label: 'Cloud Security' },
    { id: 'active_directory', label: 'Active Directory' },
    { id: 'defensive_security', label: 'Defensive Security' },
    { id: 'reporting_tools', label: 'Reporting & Docs' },
    { id: 'osint', label: 'OSINT' },
  ];

  const filteredTools = useMemo(() => {
    const q = search.toLowerCase().trim();
    return KALI_TOOLS_DATA.filter((tool) => {
      const matchesSearch =
        !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.syntax.toLowerCase().includes(q) ||
        (tool.purpose && tool.purpose.toLowerCase().includes(q)) ||
        tool.tags.some((tag) => tag.toLowerCase().includes(q));

      const matchesCat = selectedCategory === 'all' || tool.category === selectedCategory;
      const matchesRisk = selectedRisk === 'all' || tool.riskLevel === selectedRisk;
      const matchesBookmark = !showBookmarkedOnly || bookmarkedTools.includes(tool.id);
      const matchesRecent = !showRecentlyViewedOnly || recentlyViewedTools.includes(tool.id);

      return matchesSearch && matchesCat && matchesRisk && matchesBookmark && matchesRecent;
    });
  }, [search, selectedCategory, selectedRisk, showBookmarkedOnly, showRecentlyViewedOnly, bookmarkedTools, recentlyViewedTools]);

  const totalPages = Math.ceil(filteredTools.length / pageSize) || 1;
  const paginatedTools = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTools.slice(start, start + pageSize);
  }, [filteredTools, currentPage, pageSize]);

  const handleSelectTool = (tool: KaliTool) => {
    soundEffects.playKeyClick();
    addRecentlyViewedTool(tool.id);
    setActiveModalTool(tool);
    onNavigate('tools', tool.id);
  };

  const handleCloseModal = () => {
    soundEffects.playKeyClick();
    setActiveModalTool(null);
    onNavigate('tools');
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
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top View Selector: Tools Armory vs Advanced Command Explorer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#0c1218] border border-[#1b2634]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundEffects.playKeyClick();
              setActiveTab('armory');
            }}
            className={`px-4 py-2 rounded-lg font-mono text-xs flex items-center gap-2 transition-all ${
              activeTab === 'armory'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
                : 'bg-[#080d12] text-slate-300 border border-[#1a2634] hover:text-white hover:border-slate-700'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Tools Armory ({KALI_TOOLS_DATA.length} Tools)</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playKeyClick();
              setActiveTab('commands');
            }}
            className={`px-4 py-2 rounded-lg font-mono text-xs flex items-center gap-2 transition-all ${
              activeTab === 'commands'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
                : 'bg-[#080d12] text-slate-300 border border-[#1a2634] hover:text-white hover:border-slate-700'
            }`}
          >
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Advanced Command Explorer (11,000+ Commands)</span>
          </button>
        </div>

        {/* Quick Filter Buttons (only on Armory tab) */}
        {activeTab === 'armory' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundEffects.playKeyClick();
                setShowRecentlyViewedOnly(!showRecentlyViewedOnly);
                setShowBookmarkedOnly(false);
                setCurrentPage(1);
              }}
              className={`px-3 py-2 rounded-lg font-mono text-xs flex items-center gap-1.5 border transition-all ${
                showRecentlyViewedOnly
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-[#080d12] text-slate-400 border-[#1a2634] hover:text-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Recent ({recentlyViewedTools.length})</span>
            </button>

            <button
              onClick={() => {
                soundEffects.playKeyClick();
                setShowBookmarkedOnly(!showBookmarkedOnly);
                setShowRecentlyViewedOnly(false);
                setCurrentPage(1);
              }}
              className={`px-3 py-2 rounded-lg font-mono text-xs flex items-center gap-1.5 border transition-all ${
                showBookmarkedOnly
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-[#080d12] text-slate-400 border-[#1a2634] hover:text-slate-200'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${showBookmarkedOnly ? 'fill-current' : ''}`} />
              <span>{t.tools.bookmarkedOnly} ({bookmarkedTools.length})</span>
            </button>
          </div>
        )}
      </div>

      {/* Conditionally Render Command Explorer or Tools Grid */}
      {activeTab === 'commands' ? (
        <CommandExplorerView
          t={t}
          onNavigate={onNavigate}
          onSelectTool={(toolId) => {
            const tool = KALI_TOOLS_DATA.find((item) => item.id === toolId);
            if (tool) handleSelectTool(tool);
          }}
        />
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-[#0c1218] border border-[#1b2634]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-100 font-mono">
                  {t.tools.title}
                </h1>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {filteredTools.length} {t.tools.toolsCount} (Total Database: {KALI_TOOLS_DATA.length} Tools)
                </span>
              </div>
              <p className="text-xs text-slate-400">{t.tools.subtitle}</p>
            </div>
          </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#0c1218] border border-[#1b2634] space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={t.tools.searchPlaceholder}
              className="w-full bg-[#080d12] border border-[#1a2634] focus:border-emerald-500/40 rounded-lg ps-9 pe-4 py-2 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-hidden"
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

          {/* Risk Level Filter */}
          <div className="flex items-center gap-1 bg-[#080d12] border border-[#1a2634] rounded-lg px-2.5 py-1 text-xs font-mono">
            <Shield className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedRisk}
              onChange={(e) => {
                setSelectedRisk(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-slate-200 py-1 pe-2 focus:outline-hidden cursor-pointer"
            >
              <option value="all" className="bg-[#0c1218]">All Risk Levels</option>
              <option value="Low" className="bg-[#0c1218]">Low Risk (Recon/Defense)</option>
              <option value="Medium" className="bg-[#0c1218]">Medium Risk</option>
              <option value="High" className="bg-[#0c1218]">High Risk</option>
              <option value="Critical" className="bg-[#0c1218]">Critical Exploitation</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills (Horizontal scrollable) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono scrollbar-none">
          {categories.map((c) => {
            const isSelected = selectedCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => {
                  soundEffects.playKeyClick();
                  setSelectedCategory(c.id);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded-md shrink-0 transition-colors border ${
                  isSelected
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                    : 'bg-[#080d12] text-slate-400 border-[#1a2634] hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tools Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedTools.map((tool) => {
          const isBookmarked = bookmarkedTools.includes(tool.id);
          return (
            <div
              key={tool.id}
              onClick={() => handleSelectTool(tool)}
              className="rounded-xl bg-[#0c1218] border border-[#1a2634] hover:border-emerald-500/40 p-5 flex flex-col justify-between transition-all group cyber-glow-hover cursor-pointer"
            >
              <div>
                {/* Top: Badges & Bookmark */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded border ${getRiskBadgeColor(tool.riskLevel)}`}>
                    {tool.riskLevel} Risk
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      soundEffects.playKeyClick();
                      onToggleBookmark(tool.id);
                    }}
                    title={isBookmarked ? 'Remove bookmark' : 'Bookmark tool'}
                    className={`p-1.5 rounded-md border transition-colors ${
                      isBookmarked
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        : 'bg-[#080d12] text-slate-500 border-[#1a2634] hover:text-slate-200'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Title & Short Description */}
                <h3 className="text-base font-bold text-slate-100 font-mono group-hover:text-emerald-300 transition-colors mb-1.5">
                  {tool.name}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                  {tool.shortDescription}
                </p>

                {/* Syntax snippet preview */}
                <div className="p-2.5 rounded-lg bg-[#080d12] border border-[#16212b] font-mono text-[11px] text-slate-300 truncate mb-3">
                  <span className="text-emerald-400">$ </span>
                  <span>{tool.syntax}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-[#16212b] flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">
                  {tool.category.replace('_', ' ')}
                </span>
                <button
                  onClick={() => handleSelectTool(tool)}
                  className="px-3 py-1.5 rounded-lg bg-[#14202c] hover:bg-emerald-500 hover:text-slate-950 border border-[#233547] text-slate-200 font-mono text-xs font-semibold transition-all"
                >
                  Inspect & Commands
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 rounded-xl bg-[#0c1218] border border-[#1b2634] font-mono text-xs text-slate-400">
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredTools.length)} of {filteredTools.length} tools
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundEffects.playKeyClick();
                setCurrentPage((p) => Math.max(1, p - 1));
              }}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-[#14202c] border border-[#223345] hover:bg-[#1b2b3a] disabled:opacity-30 disabled:hover:bg-[#14202c]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-slate-200 font-bold px-2">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => {
                soundEffects.playKeyClick();
                setCurrentPage((p) => Math.min(totalPages, p + 1));
              }}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg bg-[#14202c] border border-[#223345] hover:bg-[#1b2b3a] disabled:opacity-30 disabled:hover:bg-[#14202c]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {filteredTools.length === 0 && (
        <div className="p-12 text-center rounded-xl bg-[#0c1218] border border-[#1a2634] space-y-2">
          <Terminal className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="font-mono text-slate-300 text-sm">No tools matched your active filters</p>
          <p className="font-mono text-slate-500 text-xs">
            Try resetting category or search criteria.
          </p>
        </div>
      )}

          {/* End of Armory Tab */}
        </>
      )}

      {/* Modern Tool Detail Inspector View */}
      {activeModalTool && (
        <ToolDetailView
          tool={activeModalTool}
          onClose={handleCloseModal}
          isBookmarked={bookmarkedTools.includes(activeModalTool.id)}
          onToggleBookmark={onToggleBookmark}
          onNavigate={onNavigate}
          t={t}
        />
      )}
    </div>
  );
};
