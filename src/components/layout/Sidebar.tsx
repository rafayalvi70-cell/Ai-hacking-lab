import React from 'react';
import {
  LayoutDashboard,
  Bot,
  Terminal,
  FlaskConical,
  Compass,
  FileText,
  Settings,
  Shield,
  X,
  ChevronRight,
  Flame,
  Award,
  Server,
  Globe,
  Monitor,
  Briefcase,
  Trophy,
  Code2,
  Crown,
  ArrowRight,
  Sliders,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';
import { Translations } from '../../data/translations';
import { UserProgress } from '../../types/cyber';

export type PageId =
  | 'dashboard'
  | 'tools'
  | 'learning'
  | 'command_explorer'
  | 'browser_terminal'
  | 'bridge'
  | 'web_labs'
  | 'vm_labs'
  | 'mentor'
  | 'reports'
  | 'portfolio'
  | 'leaderboard'
  | 'settings'
  | 'command_builder'
  | 'ctf'
  | 'blueteam'
  | 'analyzer'
  | 'knowledge'
  | 'roadmap'
  | 'labs'
  | 'utilities';

interface SidebarProps {
  activePage: PageId;
  setActivePage: (page: PageId) => void;
  t: Translations;
  userProgress: UserProgress;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  setActivePage,
  t,
  userProgress,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  // Canonical 12 Section Navigation Bar as requested in Task 4 & Reference UI
  const navItems: { id: PageId; label: string; icon: React.ReactNode; badge?: string; badgeColor?: string }[] = [
    {
      id: 'dashboard',
      label: t.nav.dashboard || 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'tools',
      label: t.nav.tools || '500 Tools',
      icon: <Terminal className="w-4 h-4 text-cyan-400" />,
      badge: 'NEW',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    },
    {
      id: 'learning',
      label: t.nav.learning || 'Learning Center',
      icon: <Compass className="w-4 h-4 text-emerald-400" />,
    },
    {
      id: 'command_explorer',
      label: t.nav.commandExplorer || 'Command Explorer',
      icon: <Code2 className="w-4 h-4" />,
    },
    {
      id: 'browser_terminal',
      label: 'Browser Terminal',
      icon: <Terminal className="w-4 h-4 text-emerald-400" />,
      badge: 'Cloud Mode',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    },
    {
      id: 'bridge',
      label: t.nav.kaliTerminal || 'Kali Terminal',
      icon: <Server className="w-4 h-4 text-slate-400" />,
      badge: 'Optional',
    },
    {
      id: 'web_labs',
      label: t.nav.webLabs || 'Web Labs',
      icon: <Globe className="w-4 h-4 text-blue-400" />,
    },
    {
      id: 'vm_labs',
      label: t.nav.vmLabs || 'VM Labs',
      icon: <Monitor className="w-4 h-4 text-purple-400" />,
    },
    {
      id: 'mentor',
      label: t.nav.mentor || 'AI Mentor',
      icon: <Bot className="w-4 h-4 text-amber-400" />,
      badge: 'AI 3.8',
    },
    {
      id: 'reports',
      label: t.nav.reports || 'Projects & Reports',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: 'portfolio',
      label: t.nav.portfolio || 'Portfolio',
      icon: <Briefcase className="w-4 h-4 text-cyan-400" />,
    },
    {
      id: 'leaderboard',
      label: t.nav.leaderboard || 'Leaderboard',
      icon: <Trophy className="w-4 h-4 text-yellow-400" />,
    },
    {
      id: 'settings',
      label: t.nav.settings || 'Settings',
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  const handleNavClick = (id: PageId) => {
    setActivePage(id);
    setIsMobileOpen(false);
  };

  const isSelected = (id: PageId) => {
    if (activePage === id) return true;
    if (id === 'web_labs' && activePage === 'labs') return true;
    if (id === 'learning' && activePage === 'roadmap') return true;
    return false;
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed lg:sticky top-0 start-0 z-50 h-screen w-64 bg-[#070b10] border-e border-[#141c26] flex flex-col transition-transform duration-200 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 rtl:translate-x-full rtl:lg:translate-x-0'
        }`}
      >
        {/* Header / Brand Logo */}
        <div className="p-4 border-b border-[#141c26] flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('dashboard')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 border border-cyan-500/40 text-cyan-400 shadow-md shadow-cyan-950/50">
              <Shield className="w-5 h-5 text-cyan-400" />
              <span className="absolute inset-0 flex items-center justify-center font-mono font-bold text-xs text-cyan-300">
                RH
              </span>
            </div>
            <div>
              <div className="flex flex-col">
                <span className="font-mono font-extrabold text-sm tracking-wide text-slate-100 flex items-center gap-1">
                  RAFAY <span className="text-cyan-400">HACKING LAB</span>
                </span>
                <span className="text-[9px] font-mono tracking-widest text-cyan-400 uppercase font-semibold">
                  LEARN • PRACTICE • MASTER
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-slate-100 hover:bg-slate-800"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto scrollbar-thin">
          {navItems.map((item) => {
            const active = isSelected(item.id);
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono font-medium transition-all group ${
                  active
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-500/40 shadow-xs shadow-cyan-950'
                    : 'text-slate-300 hover:text-slate-100 hover:bg-[#0e1620] hover:border-slate-800 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`transition-colors ${
                      active ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-400'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                        item.badgeColor || 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {active && <ChevronRight className="w-3.5 h-3.5 text-cyan-400 rtl:rotate-180" />}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Pro Upgrade / Quick Tools Banner */}
        <div className="p-3 m-3 rounded-xl bg-gradient-to-b from-[#0f1722] to-[#0a0f16] border border-[#1b2a3a] space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>Pro Lab Workstation</span>
          </div>
          <p className="text-[11px] font-sans text-slate-400 leading-tight">
            Interactive Command Builder & CTF Center
          </p>
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <button
              onClick={() => handleNavClick('command_builder')}
              className="py-1 px-2 rounded-lg bg-[#121c27] hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 font-mono text-[10px] font-bold transition-all text-center border border-[#1e2d3d]"
            >
              Builder
            </button>
            <button
              onClick={() => handleNavClick('ctf')}
              className="py-1 px-2 rounded-lg bg-[#121c27] hover:bg-amber-500 hover:text-slate-950 text-amber-300 font-mono text-[10px] font-bold transition-all text-center border border-[#1e2d3d]"
            >
              CTF Hub
            </button>
          </div>
        </div>

        {/* User Mini Bar */}
        <div className="p-3 border-t border-[#141c26] bg-[#090e14] flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-xs">
              RA
            </div>
            <div>
              <div className="text-slate-200 font-bold text-[11px]">Rafay Alvi</div>
              <div className="text-slate-400 text-[10px]">Lvl {userProgress.level} • {userProgress.xp} XP</div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
            <Flame className="w-3 h-3" />
            <span>{userProgress.streakDays}d</span>
          </div>
        </div>
      </aside>
    </>
  );
};
