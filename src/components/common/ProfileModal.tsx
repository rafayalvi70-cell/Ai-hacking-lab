import React, { useState } from 'react';
import {
  User,
  Shield,
  Award,
  Zap,
  Download,
  Upload,
  RotateCcw,
  X,
  Clock,
  CheckCircle2,
  Terminal,
  Activity,
} from 'lucide-react';
import { UserProgress } from '../../types/cyber';
import { exportUserStateJson, importUserStateJson, resetAllData } from '../../utils/storage';
import { soundEffects } from '../../utils/audio';
import { CertificateModal } from './CertificateModal';

interface ProfileModalProps {
  progress: UserProgress;
  onClose: () => void;
  onStateUpdated: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  progress,
  onClose,
  onStateUpdated,
}) => {
  const [importJson, setImportJson] = useState('');
  const [showImportBox, setShowImportBox] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);

  const handleExport = () => {
    soundEffects.playKeyClick();
    const data = exportUserStateJson();
    navigator.clipboard.writeText(data);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2500);
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects.playKeyClick();
    const success = importUserStateJson(importJson);
    if (success) {
      soundEffects.playSuccess();
      setImportStatus('State successfully restored!');
      onStateUpdated();
      setTimeout(() => {
        setShowImportBox(false);
        setImportStatus(null);
      }, 1500);
    } else {
      soundEffects.playAlert();
      setImportStatus('Error: Invalid JSON state format.');
    }
  };

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleConfirmReset = () => {
    soundEffects.playKeyClick();
    resetAllData();
    onStateUpdated();
    setShowResetConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div
        className="relative w-full max-w-2xl bg-[#0c1218] border border-emerald-500/40 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh] cyber-glow p-6 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1b2734] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-mono text-slate-100">
                Security Analyst Dossier
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Level {progress.level} Specialist • Clearance Status: Active
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
          <div className="p-3.5 rounded-xl bg-[#080d12] border border-[#1b2634]">
            <span className="text-[10px] text-slate-500 uppercase block">Total Experience</span>
            <span className="text-xl font-bold text-emerald-400">{progress.xp} XP</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#080d12] border border-[#1b2634]">
            <span className="text-[10px] text-slate-500 uppercase block">Current Tier</span>
            <span className="text-xl font-bold text-cyan-400">Level {progress.level}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#080d12] border border-[#1b2634]">
            <span className="text-[10px] text-slate-500 uppercase block">Labs Solved</span>
            <span className="text-xl font-bold text-slate-200">{progress.completedLabs.length} / 30</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#080d12] border border-[#1b2634]">
            <span className="text-[10px] text-slate-500 uppercase block">Lessons Mastered</span>
            <span className="text-xl font-bold text-emerald-300">{progress.completedLessons?.length || 0} / 120</span>
          </div>
        </div>

        {/* Recent Audit & Activity Log */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 uppercase font-semibold">
            <Activity className="w-3.5 h-3.5" />
            <span>Telemetry & Activity Log</span>
          </div>

          <div className="p-3 rounded-xl bg-[#080d12] border border-[#1b2634] max-h-48 overflow-y-auto space-y-2 font-mono text-xs">
            {progress.activityLogs && progress.activityLogs.length > 0 ? (
              progress.activityLogs.map((log) => (
                <div key={log.id} className="p-2 rounded bg-[#0d141d] border border-[#172330] flex items-start justify-between gap-2">
                  <div>
                    <div className="text-slate-200 font-bold">{log.title}</div>
                    <div className="text-[11px] text-slate-400">{log.description}</div>
                  </div>
                  <div className="text-right shrink-0">
                    {log.xpEarned && <span className="text-emerald-400 font-bold block">+{log.xpEarned} XP</span>}
                    <span className="text-[10px] text-slate-500">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-slate-500 py-4">No recent activity logged yet.</div>
            )}
          </div>
        </div>

        {/* State Export / Import */}
        <div className="p-4 rounded-xl bg-[#080d12] border border-[#1b2634] space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-slate-200 font-bold">Persistence Management</h4>
              <p className="text-[11px] text-slate-400">Export or import your lab progress across devices</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExport}
                className="px-3 py-1.5 rounded-lg bg-[#14202c] hover:bg-[#1a2d3e] text-slate-200 border border-[#223547] flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{copyFeedback ? 'Copied to Clipboard!' : 'Export State'}</span>
              </button>
              <button
                onClick={() => setShowImportBox(!showImportBox)}
                className="px-3 py-1.5 rounded-lg bg-[#14202c] hover:bg-[#1a2d3e] text-slate-200 border border-[#223547] flex items-center gap-1.5 transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Import State</span>
              </button>
            </div>
          </div>

          {showImportBox && (
            <form onSubmit={handleImportSubmit} className="space-y-2 pt-2 border-t border-[#1b2634]">
              <textarea
                rows={4}
                value={importJson}
                onChange={(e) => setImportJson(e.target.value)}
                placeholder="Paste exported user progress JSON string..."
                className="w-full bg-[#05080b] border border-[#1e2e3f] rounded-lg p-2.5 text-xs text-slate-200 focus:outline-hidden"
              />
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400"
                >
                  Confirm Restore
                </button>
                {importStatus && (
                  <span className={`text-xs ${importStatus.includes('Error') ? 'text-red-400' : 'text-emerald-400'}`}>
                    {importStatus}
                  </span>
                )}
              </div>
            </form>
          )}

          {/* Certificate View Button */}
          <div className="pt-2 border-t border-[#1b2634] flex items-center justify-between">
            <div>
              <span className="text-slate-200 font-bold block">Academic Credential</span>
              <span className="text-slate-400 text-[11px]">Generate official cryptographic certificate of proficiency</span>
            </div>
            <button
              onClick={() => {
                soundEffects.playKeyClick();
                setShowCertModal(true);
              }}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 transition-colors"
            >
              <Award className="w-4 h-4 text-emerald-400" />
              <span>View Certificate</span>
            </button>
          </div>
        </div>

        {/* Certificate Modal */}
        <CertificateModal
          isOpen={showCertModal}
          onClose={() => setShowCertModal(false)}
          userHandle={progress.userHandle || 'ETHICAL-OPERATOR'}
          completedLessonsCount={(progress.completedLessons || []).length}
          completedLabsCount={progress.completedLabs.length}
          totalXp={progress.xp}
        />

        {/* Danger Zone: Reset Data */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#1b2734]">
          {showResetConfirm ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-amber-400">Confirm reset all progress?</span>
              <button
                onClick={handleConfirmReset}
                className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold"
              >
                Yes, Reset
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="text-xs font-mono text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Laboratory Progress to Defaults</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#14202c] text-slate-300 hover:text-white font-mono text-xs font-semibold"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
