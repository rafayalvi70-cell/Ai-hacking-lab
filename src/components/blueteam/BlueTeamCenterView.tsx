import React, { useState } from 'react';
import {
  ShieldCheck,
  Eye,
  Activity,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Search,
  Zap,
  Layers,
} from 'lucide-react';
import { Translations } from '../../data/translations';
import { PageId } from '../layout/Sidebar';
import { soundEffects } from '../../utils/audio';

interface BlueTeamCenterViewProps {
  t: Translations;
  onNavigate: (page: PageId, targetId?: string) => void;
}

interface LogAnalysisScenario {
  id: string;
  title: string;
  type: 'Log Triage' | 'PCAP Traffic' | 'IDS Alert' | 'Incident Response';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  logPayload: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const BlueTeamCenterView: React.FC<BlueTeamCenterViewProps> = ({ onNavigate }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState<Record<string, boolean>>({});

  const scenarios: LogAnalysisScenario[] = [
    {
      id: 'scen-1',
      title: 'Apache Auth Log Bruteforce Investigation',
      type: 'Log Triage',
      difficulty: 'Beginner',
      logPayload: `192.168.1.105 - - [08/Nov/2026:14:10:01] "POST /login.php HTTP/1.1" 401 532 "-" "Hydra"
192.168.1.105 - - [08/Nov/2026:14:10:02] "POST /login.php HTTP/1.1" 401 532 "-" "Hydra"
192.168.1.105 - - [08/Nov/2026:14:10:03] "POST /login.php HTTP/1.1" 200 4892 "-" "Hydra"`,
      question: 'Which IP address successfully compromised the login endpoint, and what tool was utilized?',
      options: [
        'IP 192.168.1.105 using Hydra (Status 200 OK on attempt 3)',
        'IP 192.168.1.1 using Metasploit',
        'Failed attack attempt; no compromise occurred',
      ],
      correctIndex: 0,
      explanation: 'The user agent string "Hydra" and HTTP status 200 OK on line 3 confirms successful authentication after two 401 unauthorized failures.',
    },
    {
      id: 'scen-2',
      title: 'Snort IDS SQL Injection Rule Match',
      type: 'IDS Alert',
      difficulty: 'Intermediate',
      logPayload: `[**] [1:1000001:1] SQL Injection Attempt - UNION SELECT Detected [**]
[Priority: 1] 11/08-14:22:15.109283 10.0.0.45:49182 -> 10.0.0.10:80
TCP TTL:64 TOS:0x0 ID:14290 IpLen:20 DslLen:485
GET /catalog.php?id=1%27%20UNION%20SELECT%20null,username,password%20FROM%20users-- HTTP/1.1`,
      question: 'What type of SQL injection attack vector is being executed against 10.0.0.10:80?',
      options: [
        'Time-Based Blind SQLi',
        'UNION-based SQL Injection dumping user credentials',
        'Out-of-band DNS Exfiltration',
      ],
      correctIndex: 1,
      explanation: 'The URI contains %20UNION%20SELECT%20null,username,password%20FROM%20users which is a classic UNION-based payload targeting table dumping.',
    },
  ];

  const handleSelectOption = (scenId: string, idx: number) => {
    soundEffects.playKeyClick();
    setSelectedAnswers({ ...selectedAnswers, [scenId]: idx });
    setShowResults({ ...showResults, [scenId]: true });
    if (idx === scenarios.find((s) => s.id === scenId)?.correctIndex) {
      soundEffects.playSuccess();
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#080d14] via-[#0b1828] to-[#070b10] border border-[#172535] p-6 lg:p-8 cyber-glow">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>BLUE TEAM & SOC OPERATIONS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-mono text-slate-100">
              Blue Team Defense Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-mono">
              Practice SIEM log triage, IDS rule analysis, PCAP packet inspection, and incident response investigation in simulated SOC environments.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#080e15] border border-emerald-500/30 font-mono text-xs space-y-1 text-slate-300 shrink-0">
            <div className="text-emerald-400 font-bold flex items-center gap-1.5">
              <Activity className="w-4 h-4" />
              <span>Defense Readiness: 92%</span>
            </div>
            <p className="text-[11px] text-slate-400">NOMINAL SOC STATUS</p>
          </div>
        </div>
      </div>

      {/* Scenarios Grid */}
      <div className="space-y-6">
        {scenarios.map((scen) => {
          const selected = selectedAnswers[scen.id];
          const isSubmitted = showResults[scen.id];
          const isCorrect = selected === scen.correctIndex;

          return (
            <div
              key={scen.id}
              className="p-6 rounded-2xl bg-[#080d12] border border-[#162230] space-y-4 font-mono text-xs"
            >
              <div className="flex items-center justify-between border-b border-[#141d27] pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {scen.type}
                  </span>
                  <h3 className="font-bold text-slate-100 text-base">{scen.title}</h3>
                </div>
                <span className="text-slate-400 text-[11px]">{scen.difficulty}</span>
              </div>

              {/* Raw Log Payload */}
              <div className="space-y-1.5">
                <span className="text-slate-400 text-[11px] uppercase font-bold">Raw Security Log / PCAP Sample:</span>
                <pre className="p-3.5 rounded-xl bg-[#05080b] border border-[#141d27] text-cyan-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap">
                  {scen.logPayload}
                </pre>
              </div>

              {/* Triage Question */}
              <div className="space-y-2 pt-2">
                <h4 className="font-bold text-slate-100 text-sm font-sans">{scen.question}</h4>

                <div className="space-y-2">
                  {scen.options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectOption(scen.id, oIdx)}
                      className={`w-full text-left p-3 rounded-xl border text-xs font-mono transition-all ${
                        selected === oIdx
                          ? isSubmitted && isCorrect
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                            : 'bg-red-500/20 text-red-300 border-red-500/40'
                          : 'bg-[#060a0f] border-[#141e29] hover:bg-[#0c131c] text-slate-300'
                      }`}
                    >
                      <span>{opt}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Result Explanation */}
              {isSubmitted && (
                <div
                  className={`p-3.5 rounded-xl border space-y-1 font-mono text-xs ${
                    isCorrect
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-red-950/20 border-red-500/40 text-red-300'
                  }`}
                >
                  <strong className="block font-bold">
                    {isCorrect ? 'Correct Triage Analysis!' : 'Incorrect Analysis'}
                  </strong>
                  <p className="font-sans text-xs text-slate-200">{scen.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
