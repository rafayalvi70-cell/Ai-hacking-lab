import React, { useState } from 'react';
import {
  Award,
  Shield,
  Download,
  Copy,
  Check,
  X,
  ExternalLink,
  Calendar,
  UserCheck,
  Terminal,
} from 'lucide-react';
import { soundEffects } from '../../utils/audio';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  userHandle: string;
  completedLessonsCount: number;
  completedLabsCount: number;
  totalXp: number;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  userHandle,
  completedLessonsCount,
  completedLabsCount,
  totalXp,
}) => {
  const [copiedHash, setCopiedHash] = useState(false);

  if (!isOpen) return null;

  const issueDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Deterministic certificate signature
  const rawData = `${userHandle.toUpperCase()}-CYBER-AI-LAB-${completedLabsCount}-LABS-${totalXp}-XP-2026`;
  const certId = `CAL-CERT-${Math.abs(
    rawData.split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
  ).toString(16).toUpperCase().padStart(8, '0')}`;

  const certHash = `sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`;

  const handleCopyVerification = () => {
    navigator.clipboard.writeText(`RAFAY HACKING LAB CERTIFICATE ID: ${certId}\nHASH: ${certHash}\nSTUDENT: ${userHandle}`);
    setCopiedHash(true);
    soundEffects.playSuccess();
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handlePrint = () => {
    soundEffects.playKeyClick();
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-[#0c1218] border border-emerald-500/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col cyber-glow p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Certificate Close */}
        <div className="flex items-center justify-between border-b border-[#1b2634] pb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-mono font-bold text-slate-200 uppercase tracking-wider">
              Academy Credential Verification
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Frame */}
        <div className="p-6 sm:p-8 rounded-xl bg-[#080d12] border-2 border-emerald-500/30 text-center space-y-5 relative overflow-hidden">
          {/* Subtle cyber background watermarks */}
          <div className="absolute top-2 left-2 text-[9px] font-mono text-emerald-500/20 select-none">
            RAFAY_HACKING_LAB::AUTHENTICATED_CRYPTOGRAPHY
          </div>
          <div className="absolute bottom-2 right-2 text-[9px] font-mono text-emerald-500/20 select-none">
            ID: {certId}
          </div>

          {/* Crest */}
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
            <Shield className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-mono uppercase text-emerald-400 font-semibold tracking-widest block">
              Certificate of Cybersecurity Proficiency
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-100">
              RAFAY HACKING LAB ACADEMY
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              This credential certifies that the ethical security practitioner
            </p>
          </div>

          {/* User Name */}
          <div className="py-2 px-6 inline-block rounded-lg bg-[#0e1720] border border-[#1e2f40]">
            <h1 className="text-xl sm:text-2xl font-bold font-mono text-emerald-300 tracking-wide">
              {userHandle}
            </h1>
          </div>

          <p className="text-xs text-slate-300 max-w-lg mx-auto font-sans leading-relaxed">
            has demonstrated competence across Kali Linux toolsets, ethical penetration testing methodologies,
            defensive threat mitigation, simulated lab environments, and safe application security.
          </p>

          {/* Stats Badges */}
          <div className="grid grid-cols-3 gap-2 max-w-md mx-auto pt-2 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-[#0d141b] border border-[#192532]">
              <span className="text-emerald-400 font-bold block text-sm">{completedLessonsCount}</span>
              <span className="text-slate-400 text-[10px]">Lessons Mastered</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0d141b] border border-[#192532]">
              <span className="text-purple-400 font-bold block text-sm">{completedLabsCount}</span>
              <span className="text-slate-400 text-[10px]">Labs Solved</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0d141b] border border-[#192532]">
              <span className="text-amber-400 font-bold block text-sm">{totalXp.toLocaleString()}</span>
              <span className="text-slate-400 text-[10px]">Earned XP</span>
            </div>
          </div>

          {/* Cryptographic Signature Footer */}
          <div className="pt-4 border-t border-[#16222e] flex flex-col sm:flex-row items-center justify-between text-left text-xs font-mono text-slate-400 gap-2">
            <div>
              <span className="text-slate-500 block text-[10px]">DATE ISSUED</span>
              <span className="text-slate-300">{issueDate}</span>
            </div>
            <div className="text-center sm:text-right">
              <span className="text-slate-500 block text-[10px]">VERIFICATION DIGEST</span>
              <span className="text-emerald-400 text-[11px] font-mono">{certId}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            onClick={handleCopyVerification}
            className="px-3.5 py-2 rounded-lg bg-[#14202c] hover:bg-[#1b2b3a] border border-[#223345] text-slate-300 font-mono text-xs flex items-center gap-1.5 transition-colors"
          >
            {copiedHash ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedHash ? 'Verification Copied!' : 'Copy Verification ID'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
            >
              <Download className="w-4 h-4" />
              <span>Print / Save Certificate</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
