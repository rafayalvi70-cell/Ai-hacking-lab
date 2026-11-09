import React from 'react';
import {
  Award,
  ShieldCheck,
  Terminal,
  CheckCircle2,
  Download,
  Flame,
  Zap,
  BookOpen,
  Briefcase,
  Star,
  Share2,
} from 'lucide-react';
import { Translations } from '../../data/translations';
import { UserProgress } from '../../types/cyber';
import { soundEffects } from '../../utils/audio';

interface PortfolioViewProps {
  t: Translations;
  userProgress: UserProgress;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({ userProgress }) => {
  const currentLevelXp = userProgress.xp % 300;
  const levelProgressPercent = Math.min(100, Math.round((currentLevelXp / 300) * 100));

  const skillMatrix = [
    { name: 'Network Scanning & Recon', level: 92, category: 'Reconnaissance' },
    { name: 'Web Application Exploitation', level: 85, category: 'AppSec' },
    { name: 'Wireless Security & Auditing', level: 78, category: 'Wireless' },
    { name: 'Cryptography & Hash Cracking', level: 88, category: 'Crypto' },
    { name: 'Digital Forensics & Incident Response', level: 74, category: 'Forensics' },
    { name: 'Defensive Hardening & SIEM', level: 90, category: 'Blue Team' },
  ];

  const badgesList = [
    { id: 'b1', title: 'First Lab Solved', desc: 'Completed initial hands-on sandbox lab', icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />, unlocked: true },
    { id: 'b2', title: 'Terminal Veteran', desc: 'Executed 50+ sandboxed terminal commands', icon: <Terminal className="w-5 h-5 text-cyan-400" />, unlocked: true },
    { id: 'b3', title: 'Cyber Explorer', desc: 'Mastered 250+ Kali security tools', icon: <Star className="w-5 h-5 text-amber-400" />, unlocked: userProgress.bookmarkedTools.length >= 5 || true },
    { id: 'b4', title: 'Pentest Auditor', desc: 'Generated custom security assessment report', icon: <Award className="w-5 h-5 text-purple-400" />, unlocked: userProgress.savedReports.length > 0 },
    { id: 'b5', title: 'Streak Champion', desc: 'Maintained 3+ days of continuous cybersecurity training', icon: <Flame className="w-5 h-5 text-red-400" />, unlocked: userProgress.streakDays >= 3 },
    { id: 'b6', title: 'RH Lab Master', desc: 'Cleared advanced penetration testing roadmap', icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />, unlocked: userProgress.level >= 5 },
  ];

  const handleDownloadDossier = () => {
    soundEffects.playKeyClick();
    const content = `=====================================================
RAFAY HACKING LAB — SECURITY ANALYST DOSSIER
=====================================================
Candidate Handle: Rafay Alvi (Analyst Level ${userProgress.level})
Total XP Earned: ${userProgress.xp} XP
Active Training Streak: ${userProgress.streakDays} Days
Completed Labs: ${userProgress.completedLabs.length}
Bookmarked Tools: ${userProgress.bookmarkedTools.length}

SKILL COMPREHENSION MATRIX:
- Network Scanning & Recon: 92%
- Web Application Exploitation: 85%
- Wireless Security & Auditing: 78%
- Cryptography & Hash Cracking: 88%
- Digital Forensics: 74%
- Defensive Hardening: 90%

CERTIFICATE VERIFICATION HASH:
RH-CERT-${Math.random().toString(36).substring(2, 10).toUpperCase()}-2026

Issued by RAFAY HACKING LAB (LEARN • PRACTICE • MASTER)
=====================================================`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Rafay_Alvi_Cyber_Portfolio.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Portfolio Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0c141d] via-[#101926] to-[#080d12] border border-[#1b2b3a] p-6 lg:p-8 cyber-glow">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 border border-cyan-500/40 flex items-center justify-center font-mono font-bold text-2xl text-cyan-400 shadow-lg shadow-cyan-950/50">
              RA
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold font-mono text-slate-100">Rafay Alvi</h1>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">
                  PRO ANALYST
                </span>
              </div>
              <p className="text-xs font-mono text-slate-400 mt-0.5">
                Cybersecurity Researcher & Penetration Specialist • RAFAY HACKING LAB
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs font-mono text-slate-300">
                <span className="flex items-center gap-1 text-cyan-400">
                  <Zap className="w-3.5 h-3.5" /> Level {userProgress.level}
                </span>
                <span className="flex items-center gap-1 text-amber-400">
                  <Flame className="w-3.5 h-3.5" /> {userProgress.streakDays} Day Streak
                </span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <BookOpen className="w-3.5 h-3.5" /> {userProgress.completedLabs.length} Labs Solved
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={handleDownloadDossier}
              className="flex-1 md:flex-none px-4 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-950"
            >
              <Download className="w-4 h-4" />
              <span>Export Analyst Dossier</span>
            </button>
            <button
              onClick={() => {
                soundEffects.playKeyClick();
                navigator.clipboard.writeText(window.location.href);
              }}
              className="px-3 py-2.5 rounded-lg bg-[#14202c] hover:bg-[#1b2b3a] border border-[#233547] text-slate-300 font-mono text-xs flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Skill Matrix + Level Progression */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Skill Matrix */}
        <div className="lg:col-span-7 rounded-xl bg-[#0c1218] border border-[#1a2634] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#182432] pb-3">
            <div className="flex items-center gap-2 font-mono text-sm font-bold text-slate-100">
              <Briefcase className="w-4 h-4 text-cyan-400" />
              <span>Cybersecurity Competency Matrix</span>
            </div>
            <span className="text-xs font-mono text-slate-400">Practical Evaluation</span>
          </div>

          <div className="space-y-3.5 pt-1">
            {skillMatrix.map((skill, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-slate-200 font-medium">{skill.name}</span>
                  <span className="text-cyan-400 font-bold">{skill.level}%</span>
                </div>
                <div className="w-full h-2 bg-[#080d12] rounded-full overflow-hidden border border-[#16222e]">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Level Progression */}
        <div className="lg:col-span-5 rounded-xl bg-[#0c1218] border border-[#1a2634] p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#182432] pb-3 mb-4">
              <div className="flex items-center gap-2 font-mono text-sm font-bold text-slate-100">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>Analyst Rank & Progression</span>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold">LVL {userProgress.level}</span>
            </div>

            <div className="text-center py-4 space-y-2">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-center font-mono font-extrabold text-3xl text-emerald-400 cyber-glow">
                {userProgress.level}
              </div>
              <h3 className="font-mono text-base font-bold text-slate-100">Senior Cyber Security Analyst</h3>
              <p className="text-xs font-mono text-slate-400 max-w-xs mx-auto">
                Authorized threat hunter and ethical hacking practitioner on RAFAY HACKING LAB.
              </p>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>XP Progress</span>
                <span className="text-emerald-400">{currentLevelXp} / 300 XP</span>
              </div>
              <div className="w-full h-2.5 bg-[#080d12] rounded-full overflow-hidden border border-[#16222e]">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-300"
                  style={{ width: `${levelProgressPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#182432] flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Total Lifetime Experience</span>
            <span className="text-slate-100 font-bold">{userProgress.xp} XP</span>
          </div>
        </div>
      </div>

      {/* Badges & Achievements Grid */}
      <div className="rounded-xl bg-[#0c1218] border border-[#1a2634] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#182432] pb-3">
          <div className="flex items-center gap-2 font-mono text-sm font-bold text-slate-100">
            <Award className="w-4 h-4 text-purple-400" />
            <span>Earned Achievements & Badges</span>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {badgesList.filter((b) => b.unlocked).length} / {badgesList.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {badgesList.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                badge.unlocked
                  ? 'bg-[#0f1720] border-[#1c2937] hover:border-cyan-500/40'
                  : 'bg-[#080d12] border-[#151f2b] opacity-50'
              }`}
            >
              <div className="p-2.5 rounded-lg bg-[#14202c] border border-[#223345] shrink-0">
                {badge.icon}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-mono text-xs font-bold text-slate-100">{badge.title}</h4>
                  {badge.unlocked && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400">
                      UNLOCKED
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
