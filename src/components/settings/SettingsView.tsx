import React, { useState } from 'react';
import {
  Settings,
  Globe,
  Volume2,
  VolumeX,
  Sparkles,
  Trash2,
  ShieldAlert,
  Info,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { Translations } from '../../data/translations';
import { Language } from '../../types/cyber';
import { soundEffects } from '../../utils/audio';

interface SettingsViewProps {
  t: Translations;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isAiLive: boolean;
  onResetAllData: () => void;
  onRefreshHealth: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  t,
  language,
  onLanguageChange,
  isAiLive,
  onResetAllData,
  onRefreshHealth,
}) => {
  const [soundEnabled, setSoundEnabled] = useState(soundEffects.isEnabled());
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const handleToggleSound = (enabled: boolean) => {
    setSoundEnabled(enabled);
    soundEffects.setEnabled(enabled);
    if (enabled) soundEffects.playKeyClick();
  };

  const handleConfirmReset = () => {
    soundEffects.playAlert();
    onResetAllData();
    setShowResetConfirm(false);
    setResetDone(true);
    setTimeout(() => setResetDone(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="p-5 rounded-xl bg-[#0c1218] border border-[#1b2634] space-y-1">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-emerald-400" />
          <h1 className="text-xl sm:text-2xl font-bold text-slate-100 font-mono">
            {t.settings.title}
          </h1>
        </div>
        <p className="text-xs text-slate-400">{t.settings.subtitle}</p>
      </div>

      {resetDone && (
        <div className="p-3.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Local learning data and lab records successfully reset to defaults.</span>
        </div>
      )}

      {/* Language Configuration */}
      <div className="p-5 rounded-xl bg-[#0c1218] border border-[#1b2634] space-y-4">
        <div className="flex items-center gap-2 text-sm font-mono font-bold text-slate-200">
          <Globe className="w-4 h-4 text-emerald-400" />
          <span>{t.settings.language}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'en', label: 'English (Default)', note: 'Standard cybersecurity terminology' },
            { id: 'ur', label: 'اردو (Urdu RTL)', note: 'دائیں سے بائیں ترتیب اور مکمل اردو' },
            { id: 'roman_ur', label: 'Roman Urdu', note: 'Aasan Roman Urdu me security seekhein' },
          ].map((l) => {
            const isSelected = language === l.id;
            return (
              <button
                key={l.id}
                onClick={() => {
                  soundEffects.playKeyClick();
                  onLanguageChange(l.id as Language);
                }}
                className={`p-3.5 rounded-xl text-start transition-all border ${
                  isSelected
                    ? 'bg-emerald-500/15 border-emerald-500/50 text-slate-100 cyber-glow'
                    : 'bg-[#080d12] border-[#1b2634] text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="font-mono text-sm font-bold">{l.label}</div>
                <div className="text-[11px] text-slate-400 mt-1">{l.note}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Terminal Audio Feedback */}
      <div className="p-5 rounded-xl bg-[#0c1218] border border-[#1b2634] space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-sm font-mono font-bold text-slate-200">
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
              <span>{t.settings.soundEffects}</span>
            </div>
            <p className="text-xs text-slate-400 max-w-xl">
              {t.settings.soundEffectsDesc}
            </p>
          </div>

          <button
            onClick={() => handleToggleSound(!soundEnabled)}
            className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${
              soundEnabled ? 'bg-emerald-500 justify-end' : 'bg-slate-800 justify-start'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-slate-950 shadow-md" />
          </button>
        </div>
      </div>

      {/* AI Cyber Mentor Server Integration Status */}
      <div className="p-5 rounded-xl bg-[#0c1218] border border-[#1b2634] space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-sm font-mono font-bold text-slate-200">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>{t.settings.aiStatus}</span>
            </div>
            <p className="text-xs text-slate-400">
              {isAiLive ? t.settings.aiStatusLive : t.settings.aiStatusOffline}
            </p>
          </div>

          <button
            onClick={onRefreshHealth}
            className="px-3 py-1.5 rounded-lg bg-[#14202c] hover:bg-[#1a2d3f] border border-[#233547] text-slate-300 text-xs font-mono flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Probe Engine</span>
          </button>
        </div>

        <div className="p-3 rounded-lg bg-[#080d12] border border-[#17222d] font-mono text-xs text-slate-400 space-y-1">
          <div>Architecture: Full-Stack Express Server (Node.js) + Vite SPA</div>
          <div>Model Target: gemini-3.8-flash (via @google/genai SDK on server)</div>
          <div>API Key Management: Secured server-side via process.env.GEMINI_API_KEY</div>
        </div>
      </div>

      {/* Ethical Hacking Disclaimer */}
      <div className="p-5 rounded-xl bg-[#0c1218] border border-amber-500/20 space-y-2 text-xs font-mono">
        <div className="flex items-center gap-2 text-amber-400 font-bold">
          <ShieldAlert className="w-4 h-4" />
          <span>Rules of Engagement & Ethical Hacking Code</span>
        </div>
        <p className="text-slate-300 leading-relaxed font-sans text-xs">
          {t.settings.ethicalDisclaimer}
        </p>
      </div>

      {/* Reset Data Section */}
      <div className="p-5 rounded-xl bg-[#0c1218] border border-red-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-mono font-bold text-red-400 flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            <span>{t.settings.clearData}</span>
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Reset all completed labs, bookmarks, milestones, and locally saved audit reports.
          </p>
        </div>

        <button
          onClick={() => setShowResetConfirm(true)}
          className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 text-xs font-mono font-semibold transition-colors shrink-0"
        >
          Reset All Data
        </button>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[#0c1218] border border-red-500/40 rounded-xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-red-400 font-mono font-bold text-base">
              <AlertTriangle className="w-5 h-5" />
              <span>Confirm Data Reset</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {t.settings.clearDataConfirm}
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 rounded-lg bg-[#14202c] text-slate-300 text-xs font-mono"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-semibold"
              >
                Yes, Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Platform Version Footer */}
      <div className="text-center font-mono text-[11px] text-slate-600 pt-4">
        {t.settings.about} • {t.settings.version}
      </div>
    </div>
  );
};
