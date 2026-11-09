import React, { useState } from 'react';
import {
  Trophy,
  Flag,
  CheckCircle2,
  Lock,
  Flame,
  HelpCircle,
  Zap,
  Search,
  Shield,
  Key,
  Award,
} from 'lucide-react';
import { Translations } from '../../data/translations';
import { PageId } from '../layout/Sidebar';
import { soundEffects } from '../../utils/audio';

interface CtfChallengeCenterViewProps {
  t: Translations;
  onNavigate: (page: PageId, targetId?: string) => void;
}

interface CtfChallenge {
  id: string;
  title: string;
  category: 'Web Exploitation' | 'Cryptography' | 'Reverse Engineering' | 'Forensics' | 'OSINT' | 'Steganography';
  points: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  hint: string;
  flag: string;
}

export const CtfChallengeCenterView: React.FC<CtfChallengeCenterViewProps> = ({ onNavigate }) => {
  const [solvedChallenges, setSolvedChallenges] = useState<string[]>(['ctf-1']);
  const [revealedHints, setRevealedHints] = useState<string[]>([]);
  const [flagInputs, setFlagInputs] = useState<Record<string, string>>({});
  const [submissionFeedback, setSubmissionFeedback] = useState<Record<string, 'success' | 'error' | null>>({});

  const challenges: CtfChallenge[] = [
    {
      id: 'ctf-1',
      title: 'Hidden Base64 Cookie Payload',
      category: 'Web Exploitation',
      points: 100,
      difficulty: 'Beginner',
      description: 'The web application passes session tokens in Base64 format. Inspect the HTTP headers to decode the admin payload.',
      hint: 'Look at the Set-Cookie header. Base64 strings usually end with = or ==.',
      flag: 'RH{b4s364_d3c0d3d_3xp1o1t}',
    },
    {
      id: 'ctf-2',
      title: 'RSA Public Exponent Misconfiguration',
      category: 'Cryptography',
      points: 250,
      difficulty: 'Intermediate',
      description: 'An RSA public key uses a small exponent e=3 without padding. Calculate the 3rd root of the ciphertext to recover the flag.',
      hint: 'Use Python math.isqrt or gmpy2.iroot(c, 3).',
      flag: 'RH{rs4_sm4ll_3xp0n3nt_br0k3n}',
    },
    {
      id: 'ctf-3',
      title: 'Volatiliy Memory Dump Triage',
      category: 'Forensics',
      points: 300,
      difficulty: 'Intermediate',
      description: 'Inspect the RAM memory dump of an infected Windows workstation to extract the malicious process PID and command line.',
      hint: 'Run volatility -f mem.raw windows.pstree.Check PID 4820.',
      flag: 'RH{m3m0ry_f0r3ns1cs_p1d_4820}',
    },
    {
      id: 'ctf-4',
      title: 'GDB ELF Binary Buffer Overflow',
      category: 'Reverse Engineering',
      points: 400,
      difficulty: 'Advanced',
      description: 'Reverse engineer a 64-bit ELF binary using GDB/Ghidra to locate the stack overflow offset and jump to secret function win().',
      hint: 'Offset is 72 bytes. Check RBP overwrite and ret instruction alignment.',
      flag: 'RH{bllff3r_0v3rfl0w_r3t_2_w1n}',
    },
  ];

  const handleRevealHint = (id: string) => {
    soundEffects.playKeyClick();
    if (!revealedHints.includes(id)) {
      setRevealedHints([...revealedHints, id]);
    }
  };

  const handleSubmitFlag = (ch: CtfChallenge) => {
    soundEffects.playKeyClick();
    const val = (flagInputs[ch.id] || '').trim();
    if (val === ch.flag) {
      soundEffects.playSuccess();
      setSubmissionFeedback({ ...submissionFeedback, [ch.id]: 'success' });
      if (!solvedChallenges.includes(ch.id)) {
        setSolvedChallenges([...solvedChallenges, ch.id]);
      }
    } else {
      setSubmissionFeedback({ ...submissionFeedback, [ch.id]: 'error' });
    }
  };

  const totalPointsEarned = challenges
    .filter((c) => solvedChallenges.includes(c.id))
    .reduce((sum, c) => sum + c.points, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#080d14] via-[#0e1726] to-[#070b10] border border-[#172535] p-6 lg:p-8 cyber-glow">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold">
              <Trophy className="w-4 h-4" />
              <span>CAPTURE THE FLAG ACADEMY</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-mono text-slate-100">
              CTF Challenge Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-mono">
              Test your ethical hacking skills across Web Security, Cryptography, Binary Reverse Engineering, Digital Forensics, and OSINT.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#080e15] border border-amber-500/30 font-mono text-xs space-y-1 text-slate-300 shrink-0">
            <div className="text-amber-400 font-bold flex items-center gap-1.5">
              <Zap className="w-4 h-4 fill-current" />
              <span>{totalPointsEarned} CTF Points Solved</span>
            </div>
            <p className="text-[11px] text-slate-400">
              {solvedChallenges.length} / {challenges.length} Flags Captured
            </p>
          </div>
        </div>
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {challenges.map((ch) => {
          const isSolved = solvedChallenges.includes(ch.id);
          const isHintRevealed = revealedHints.includes(ch.id);
          const feedback = submissionFeedback[ch.id];

          return (
            <div
              key={ch.id}
              className={`p-6 rounded-2xl border space-y-4 font-mono text-xs flex flex-col justify-between transition-all ${
                isSolved
                  ? 'bg-gradient-to-b from-[#09151f] to-[#070b10] border-emerald-500/40 shadow-lg shadow-emerald-950/20'
                  : 'bg-[#080d12] border-[#162230] hover:border-amber-500/40'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {ch.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold text-xs">+{ch.points} PTS</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                        ch.difficulty === 'Beginner'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          : ch.difficulty === 'Intermediate'
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                          : 'bg-red-500/20 text-red-400 border-red-500/40'
                      }`}
                    >
                      {ch.difficulty}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Flag className={`w-5 h-5 ${isSolved ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <h3 className="font-bold text-slate-100 text-base">{ch.title}</h3>
                </div>

                <p className="text-slate-300 font-sans text-xs leading-relaxed">
                  {ch.description}
                </p>

                {/* Hint Drawer */}
                {isHintRevealed ? (
                  <div className="p-3 rounded-xl bg-[#05080c] border border-cyan-500/30 text-cyan-300 text-[11px]">
                    <strong className="text-cyan-400 block mb-0.5">Hint Unlocked (-10 PTS):</strong>
                    {ch.hint}
                  </div>
                ) : (
                  <button
                    onClick={() => handleRevealHint(ch.id)}
                    className="text-[11px] text-slate-400 hover:text-cyan-400 flex items-center gap-1 pt-1"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Need a Hint? (Reveal)</span>
                  </button>
                )}
              </div>

              {/* Flag Input Box */}
              <div className="pt-3 border-t border-[#141d27] space-y-2">
                {isSolved ? (
                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/40 text-emerald-400 font-bold flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> FLAG CAPTURED & ACCEPTED
                    </span>
                    <span className="text-[11px] text-slate-300">{ch.flag}</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={flagInputs[ch.id] || ''}
                        onChange={(e) => setFlagInputs({ ...flagInputs, [ch.id]: e.target.value })}
                        placeholder="Enter flag RH{...}"
                        className="flex-1 bg-[#05080c] border border-[#16222e] rounded-xl px-3 py-2 text-xs font-mono text-slate-100 focus:outline-hidden"
                      />
                      <button
                        onClick={() => handleSubmitFlag(ch)}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
                      >
                        Submit Flag
                      </button>
                    </div>

                    {feedback === 'error' && (
                      <span className="text-red-400 text-[11px] font-bold block">
                        Incorrect Flag! Review the description and hint carefully.
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
