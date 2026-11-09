import React, { useState } from 'react';
import {
  Briefcase,
  FileText,
  Download,
  Copy,
  Check,
  Github,
  Award,
  Zap,
  BookOpen,
  Share2,
} from 'lucide-react';
import { Translations } from '../../data/translations';
import { UserProgress } from '../../types/cyber';
import { soundEffects } from '../../utils/audio';

interface CareerPortfolioViewProps {
  t: Translations;
  userProgress: UserProgress;
}

export const CareerPortfolioView: React.FC<CareerPortfolioViewProps> = ({ userProgress }) => {
  const [copiedReadme, setCopiedReadme] = useState(false);

  const githubReadmeTemplate = `<!-- RAFAY HACKING LAB — SECURITY PROFILE README -->
# Hi there, I'm Rafay Alvi 👋
### Cybersecurity Analyst & Penetration Testing Practitioner

[![RAFAY HACKING LAB](https://img.shields.io/badge/RAFAY_HACKING_LAB-Level_${userProgress.level}-cyan?style=for-the-badge&logo=shield)](https://github.com)
[![Streak](https://img.shields.io/badge/Training_Streak-${userProgress.streakDays}_Days-amber?style=for-the-badge&logo=flame)](https://github.com)

## 🛡️ Practical Skills & Competencies
- **Network Reconnaissance & Vulnerability Assessment:** Nmap, Wireshark, Masscan
- **Web Application Security:** Burp Suite, OWASP Juice Shop, SQLmap, Gobuster
- **Wireless Security & Hash Cracking:** Aircrack-ng, Hashcat, John the Ripper
- **SOC Operations & Incident Response:** SIEM log triage, Snort IDS, Volatility

## 📊 RAFAY HACKING LAB Academy Metrics
- **Analyst Level:** Level ${userProgress.level}
- **Total XP Earned:** ${userProgress.xp} XP
- **Hands-on Labs Cleared:** ${userProgress.completedLabs.length}
- **Verified Armory Tools:** 500 Curated Tools

---
*Generated automatically via RAFAY HACKING LAB (LEARN • PRACTICE • MASTER)*
`;

  const handleCopyReadme = () => {
    soundEffects.playKeyClick();
    navigator.clipboard.writeText(githubReadmeTemplate);
    setCopiedReadme(true);
    setTimeout(() => setCopiedReadme(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#080d14] via-[#0e1726] to-[#070b10] border border-[#172535] p-6 lg:p-8 cyber-glow">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold">
              <Briefcase className="w-4 h-4" />
              <span>CAREER & PORTFOLIO BUILDER</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-mono text-slate-100">
              Cybersecurity Portfolio & Resume Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-mono">
              Build your professional GitHub README, generate executive penetration test report templates, and showcase certified lab achievements.
            </p>
          </div>

          <button
            onClick={handleCopyReadme}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-cyan-950 shrink-0"
          >
            {copiedReadme ? <Check className="w-4 h-4 text-emerald-400" /> : <Github className="w-4 h-4" />}
            <span>{copiedReadme ? 'Copied GitHub README!' : 'Generate GitHub README'}</span>
          </button>
        </div>
      </div>

      {/* GitHub README Preview Card */}
      <div className="p-6 rounded-2xl bg-[#080d12] border border-[#162230] space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-[#141d27] pb-3">
          <span className="font-bold text-slate-100 text-sm flex items-center gap-2">
            <Github className="w-4 h-4 text-cyan-400" /> GitHub Profile README Markdown Template
          </span>
          <button
            onClick={handleCopyReadme}
            className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
          >
            <Copy className="w-3.5 h-3.5" /> Copy Code
          </button>
        </div>

        <pre className="p-4 rounded-xl bg-[#05080c] border border-[#141d27] text-slate-300 font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap">
          {githubReadmeTemplate}
        </pre>
      </div>
    </div>
  );
};
