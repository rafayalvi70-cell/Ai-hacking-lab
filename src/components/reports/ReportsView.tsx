import React, { useState } from 'react';
import {
  FileText,
  Download,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Award,
  Eye,
  X,
  Copy,
  Check,
} from 'lucide-react';
import { Translations } from '../../data/translations';
import { SecurityReport, UserProgress } from '../../types/cyber';
import { PRACTICE_LABS_DATA } from '../../data/labsData';
import { deleteSecurityReport } from '../../utils/storage';
import { soundEffects } from '../../utils/audio';

interface ReportsViewProps {
  t: Translations;
  userProgress: UserProgress;
  onRefreshReports: () => void;
  onNavigateToUtilities: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  t,
  userProgress,
  onRefreshReports,
  onNavigateToUtilities,
}) => {
  const [activeReport, setActiveReport] = useState<SecurityReport | null>(null);
  const [copiedMd, setCopiedMd] = useState(false);

  const handleDelete = (id: string) => {
    soundEffects.playKeyClick();
    deleteSecurityReport(id);
    onRefreshReports();
    if (activeReport?.id === id) setActiveReport(null);
  };

  const exportAllAsJson = () => {
    soundEffects.playKeyClick();
    const data = {
      exportDate: new Date().toISOString(),
      platform: 'RAFAY HACKING LAB',
      user: {
        level: userProgress.level,
        xp: userProgress.xp,
        completedLabsCount: userProgress.completedLabs.length,
      },
      reports: userProgress.savedReports,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rafay-hacking-lab-audit-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAllAsMarkdown = () => {
    soundEffects.playKeyClick();
    let md = `# RAFAY HACKING LAB - SECURITY AUDIT DOSSIER\n\n`;
    md += `**Export Timestamp:** ${new Date().toUTCString()}\n`;
    md += `**Analyst Rank:** Level ${userProgress.level} (${userProgress.xp} XP)\n`;
    md += `**Completed Lab Missions:** ${userProgress.completedLabs.length} / ${PRACTICE_LABS_DATA.length}\n\n`;
    md += `---\n\n## 1. Saved Vulnerability Findings\n\n`;

    if (userProgress.savedReports.length === 0) {
      md += `*No findings recorded.*\n\n`;
    } else {
      userProgress.savedReports.forEach((r, idx) => {
        md += `### Finding 0${idx + 1}: ${r.title}\n`;
        md += `* **Severity:** ${r.severity} (CVSS ${r.cvssScore})\n`;
        md += `* **Asset:** \`${r.asset}\`\n`;
        md += `* **Identifier:** ${r.cveOrCwe}\n`;
        md += `* **Status:** ${r.status}\n\n`;
        md += `#### Technical Description\n${r.description}\n\n`;
        md += `#### Steps to Reproduce\n\`\`\`\n${r.stepsToReproduce}\n\`\`\`\n\n`;
        md += `#### Remediation Guidance\n${r.remediation}\n\n---\n\n`;
      });
    }

    md += `## 2. Completed Virtual Labs Record\n\n`;
    userProgress.completedLabs.forEach((id) => {
      const lab = PRACTICE_LABS_DATA.find((l) => l.id === id);
      if (lab) {
        md += `* [x] **${lab.title}** (${lab.difficulty}) - +${lab.xpReward} XP\n`;
      }
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cyber-ai-lab-report-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getSeverityBadge = (sev: SecurityReport['severity']) => {
    switch (sev) {
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
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-[#0c1218] border border-[#1b2634]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100 font-mono">
              {t.reports.title}
            </h1>
          </div>
          <p className="text-xs text-slate-400">{t.reports.subtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportAllAsMarkdown}
            className="px-3 py-1.5 rounded-lg bg-[#14202c] hover:bg-[#1b2c3d] text-slate-200 border border-[#233547] text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.reports.exportMarkdown}</span>
          </button>
          <button
            onClick={exportAllAsJson}
            className="px-3 py-1.5 rounded-lg bg-[#14202c] hover:bg-[#1b2c3d] text-slate-200 border border-[#233547] text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t.reports.exportJson}</span>
          </button>
        </div>
      </div>

      {/* Grid: Saved Findings & Completed Lab Audits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Saved Vulnerability Findings */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>{t.reports.savedReports} ({userProgress.savedReports.length})</span>
            </h3>
            <button
              onClick={onNavigateToUtilities}
              className="text-xs font-mono text-emerald-400 hover:text-emerald-300"
            >
              + {t.reports.createReport}
            </button>
          </div>

          {userProgress.savedReports.length === 0 ? (
            <div className="p-8 rounded-xl bg-[#0c1218] border border-[#1b2634] text-center space-y-2">
              <FileText className="w-6 h-6 text-slate-600 mx-auto" />
              <p className="text-xs font-mono text-slate-400">{t.reports.noReports}</p>
              <button
                onClick={onNavigateToUtilities}
                className="mt-2 px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 text-xs font-mono font-semibold"
              >
                Open Generator
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {userProgress.savedReports.map((report) => (
                <div
                  key={report.id}
                  className="p-4 rounded-xl bg-[#0c1218] border border-[#1b2634] hover:border-emerald-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getSeverityBadge(report.severity)}`}>
                        {report.severity}
                      </span>
                      <span className="text-xs font-mono text-slate-400">{report.date}</span>
                      <span className="text-xs font-mono text-slate-500">| {report.cveOrCwe}</span>
                    </div>

                    <h4 className="text-sm font-bold font-mono text-slate-200 group-hover:text-emerald-300 transition-colors">
                      {report.title}
                    </h4>

                    <div className="text-xs text-slate-400 font-mono truncate max-w-md">
                      Asset: <span className="text-slate-300">{report.asset}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setActiveReport(report)}
                      className="px-3 py-1.5 rounded-lg bg-[#14202c] hover:bg-[#1a2d3f] border border-[#233547] text-slate-200 text-xs font-mono flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-emerald-400" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => handleDelete(report.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete report"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed Labs Audit Log */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="font-mono text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-cyan-400" />
            <span>{t.reports.completedLabsAudit}</span>
          </h3>

          <div className="p-4 rounded-xl bg-[#0c1218] border border-[#1b2634] space-y-3">
            {userProgress.completedLabs.length === 0 ? (
              <p className="text-xs font-mono text-slate-400 text-center py-4">
                No labs completed yet. Launch a practice lab to earn XP!
              </p>
            ) : (
              userProgress.completedLabs.map((id) => {
                const lab = PRACTICE_LABS_DATA.find((l) => l.id === id);
                if (!lab) return null;
                return (
                  <div
                    key={lab.id}
                    className="p-3 rounded-lg bg-[#080d12] border border-[#172330] flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="text-xs font-bold font-mono text-slate-200 line-clamp-1">
                        {lab.title}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                        {lab.difficulty} • {lab.category}
                      </div>
                    </div>
                    <div className="text-xs font-mono text-emerald-400 shrink-0 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>+{lab.xpReward} XP</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Detailed Report View Modal */}
      {activeReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div
            className="relative w-full max-w-3xl max-h-[90vh] bg-[#0c1218] border border-emerald-500/40 rounded-2xl shadow-2xl overflow-y-auto cyber-glow p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-[#1b2634] pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getSeverityBadge(activeReport.severity)}`}>
                    {activeReport.severity}
                  </span>
                  <span className="text-xs font-mono text-slate-400">CVSS {activeReport.cvssScore}</span>
                  <span className="text-xs font-mono text-slate-400">• {activeReport.date}</span>
                </div>
                <h2 className="text-lg font-bold font-mono text-slate-100">
                  {activeReport.title}
                </h2>
              </div>
              <button
                onClick={() => setActiveReport(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono text-emerald-400 uppercase">Target Asset</span>
              <div className="p-2.5 rounded bg-[#080d12] border border-[#1b2734] font-mono text-xs text-slate-200">
                {activeReport.asset}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono text-emerald-400 uppercase">Description</span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {activeReport.description}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono text-emerald-400 uppercase">Steps to Reproduce (PoC)</span>
              <pre className="p-3 rounded bg-[#080d12] border border-[#1b2734] font-mono text-xs text-slate-200 whitespace-pre-wrap">
                {activeReport.stepsToReproduce}
              </pre>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono text-emerald-400 uppercase">Remediation Guidance</span>
              <div className="p-3 rounded bg-emerald-950/20 border border-emerald-500/30 text-xs sm:text-sm text-slate-200 font-sans leading-relaxed">
                {activeReport.remediation}
              </div>
            </div>

            <div className="pt-3 border-t border-[#1b2634] flex justify-end">
              <button
                onClick={() => setActiveReport(null)}
                className="px-4 py-2 rounded-lg bg-[#14202c] hover:bg-[#1b2c3d] text-slate-200 text-xs font-mono"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
