import React, { useState } from 'react';
import {
  Menu,
  Search,
  Volume2,
  VolumeX,
  Globe,
  Bell,
  Sparkles,
  ChevronDown,
  CheckCircle2,
  X,
} from 'lucide-react';
import { Language } from '../../types/cyber';
import { Translations } from '../../data/translations';
import { soundEffects } from '../../utils/audio';

interface TopNavProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  t: Translations;
  onOpenSearch: () => void;
  onToggleMobileMenu: () => void;
  onOpenProfile?: () => void;
  isAiLive: boolean;
  activeLabTitle?: string;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentLanguage,
  onLanguageChange,
  t,
  onOpenSearch,
  onToggleMobileMenu,
  onOpenProfile,
  isAiLive,
  activeLabTitle,
}) => {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(soundEffects.isEnabled());
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const notifications = [
    { id: 1, title: 'New Tool Added', desc: 'Aircrack-ng suite added to 500 Tools database', time: '5m ago' },
    { id: 2, title: 'Lab Mastery Streak', desc: 'Achieved 3-day continuous training streak', time: '1h ago' },
    { id: 3, title: 'AI Mentor Updated', desc: 'Gemini 3.8 Flash SDK initialized and ready', time: '2h ago' },
  ];

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEffects.setEnabled(next);
    if (next) soundEffects.playKeyClick();
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#070b10]/95 backdrop-blur-md border-b border-[#141c26] px-4 lg:px-8 flex items-center justify-between">
      {/* Left: Mobile Hamburger & Context Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {activeLabTitle ? (
          <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-slate-400">
            <span className="text-cyan-400 font-semibold">{t.nav.webLabs || 'Web Labs'}</span>
            <span>/</span>
            <span className="text-slate-200 truncate max-w-[200px] sm:max-w-[320px]">
              {activeLabTitle}
            </span>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 font-mono text-xs">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>RAFAY HACKING LAB ONLINE</span>
            </div>
          </div>
        )}
      </div>

      {/* Center: Search Bar matching reference image */}
      <div className="flex-1 max-w-lg mx-4 hidden md:block">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-4 py-2 rounded-xl bg-[#0b1118] border border-[#1a2634] hover:border-cyan-500/50 text-slate-400 hover:text-slate-200 text-xs font-mono transition-all group shadow-inner"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            <span className="text-slate-400">Search tools, commands, or topics...</span>
          </div>
          <kbd className="px-2 py-0.5 rounded-md bg-[#14202c] text-[10px] text-slate-400 border border-[#233547]">
            Ctrl + K
          </kbd>
        </button>
      </div>

      {/* Right: Controls, Language Selector, Notifications, User Avatar */}
      <div className="flex items-center gap-2.5">
        {/* Mobile Search Button */}
        <button
          onClick={onOpenSearch}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800"
          aria-label="Search tools and labs"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* AI Engine Status indicator */}
        <div
          title={isAiLive ? 'Gemini 3.8 Flash Active via Server Proxy' : 'Offline High-Fidelity Cyber Knowledge Base'}
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono border ${
            isAiLive
              ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">{isAiLive ? 'Gemini 3.8' : 'Offline KB'}</span>
          <span className={`w-1.5 h-1.5 rounded-full ${isAiLive ? 'bg-cyan-400' : 'bg-amber-400'} animate-pulse`} />
        </div>

        {/* Sound toggle button */}
        <button
          onClick={handleToggleSound}
          title={soundEnabled ? 'Terminal Audio FX On' : 'Terminal Audio FX Muted'}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors border border-[#1a2634]"
          aria-label="Toggle terminal audio feedback"
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-cyan-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {/* Language selector dropdown */}
        <div className="relative flex items-center">
          <div className="flex items-center gap-1.5 bg-[#0b1118] border border-[#1a2634] rounded-lg px-2.5 py-1 text-xs font-mono">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={currentLanguage}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              aria-label="Select interface language"
              className="bg-transparent text-slate-200 py-0.5 focus:outline-hidden cursor-pointer font-medium"
            >
              <option value="en" className="bg-[#0b1118] text-slate-200">
                English
              </option>
              <option value="ur" className="bg-[#0b1118] text-slate-200">
                اردو (Urdu)
              </option>
              <option value="roman_ur" className="bg-[#0b1118] text-slate-200">
                Roman Urdu
              </option>
            </select>
          </div>
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 rounded-lg bg-[#0b1118] hover:bg-[#14202c] border border-[#1a2634] text-slate-300 hover:text-slate-100 transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4 text-slate-300" />
            <span className="absolute -top-1 -end-1 w-4 h-4 rounded-full bg-cyan-500 text-slate-950 font-mono font-bold text-[10px] flex items-center justify-center">
              3
            </span>
          </button>

          {/* Notifications Dropdown Modal */}
          {isNotificationsOpen && (
            <div className="absolute end-0 mt-2 w-80 bg-[#0c1218] border border-[#1b2734] rounded-xl shadow-2xl p-4 z-50 space-y-3">
              <div className="flex items-center justify-between border-b border-[#172330] pb-2 font-mono text-xs">
                <span className="font-bold text-slate-100 flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-cyan-400" /> Notifications
                </span>
                <button
                  onClick={() => setIsNotificationsOpen(false)}
                  className="text-slate-500 hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2 font-mono text-xs">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2.5 rounded-lg bg-[#070b10] border border-[#16222e] space-y-1">
                    <div className="flex items-center justify-between text-slate-200 font-bold">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-slate-500">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar Badge matching reference image */}
        {onOpenProfile && (
          <button
            onClick={() => {
              soundEffects.playKeyClick();
              onOpenProfile();
            }}
            className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-[#0b1118] hover:bg-[#14202c] border border-[#1a2634] transition-all group"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white font-mono font-bold text-xs flex items-center justify-center shadow-xs">
              RA
            </div>
            <span className="hidden lg:inline text-xs font-mono font-bold text-slate-200 group-hover:text-cyan-400">
              Rafay Alvi
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden lg:inline" />
          </button>
        )}
      </div>
    </header>
  );
};
