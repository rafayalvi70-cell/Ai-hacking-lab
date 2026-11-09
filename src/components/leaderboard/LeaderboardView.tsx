import React, { useState } from 'react';
import {
  Trophy,
  Flame,
  Award,
  Zap,
  Search,
  Filter,
  CheckCircle2,
  Crown,
} from 'lucide-react';
import { Translations } from '../../data/translations';
import { UserProgress } from '../../types/cyber';

interface LeaderboardViewProps {
  t: Translations;
  userProgress: UserProgress;
}

interface LeaderboardUser {
  rank: number;
  name: string;
  handle: string;
  level: number;
  xp: number;
  streak: number;
  labsCleared: number;
  badge: string;
  avatar: string;
  isCurrentUser?: boolean;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ userProgress }) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'weekly' | 'alltime'>('alltime');
  const [search, setSearch] = useState('');

  const leaderboardData: LeaderboardUser[] = [
    { rank: 1, name: 'Zain Malik', handle: '@zain_sec', level: 12, xp: 3840, streak: 14, labsCleared: 28, badge: 'Grandmaster Auditor', avatar: 'ZM' },
    { rank: 2, name: 'Ayesha Khan', handle: '@ayesha_cyber', level: 11, xp: 3420, streak: 11, labsCleared: 25, badge: 'Red Team Lead', avatar: 'AK' },
    { rank: 3, name: 'Rafay Alvi', handle: '@rafay_alvi', level: userProgress.level, xp: Math.max(userProgress.xp, 2980), streak: userProgress.streakDays, labsCleared: Math.max(userProgress.completedLabs.length, 18), badge: 'Pro Analyst', avatar: 'RA', isCurrentUser: true },
    { rank: 4, name: 'Tariq Hussain', handle: '@tariq_h', level: 9, xp: 2650, streak: 8, labsCleared: 16, badge: 'Exploit Developer', avatar: 'TH' },
    { rank: 5, name: 'Hamza Sheikh', handle: '@hamza_s', level: 8, xp: 2410, streak: 6, labsCleared: 14, badge: 'NetSec Specialist', avatar: 'HS' },
    { rank: 6, name: 'Fatima Zahra', handle: '@fz_defense', level: 8, xp: 2320, streak: 9, labsCleared: 13, badge: 'Crypto Analyst', avatar: 'FZ' },
    { rank: 7, name: 'Bilal Ahmed', handle: '@bilal_kali', level: 7, xp: 2100, streak: 5, labsCleared: 12, badge: 'Lab Master', avatar: 'BA' },
    { rank: 8, name: 'Usman Farooq', handle: '@usman_sec', level: 7, xp: 1950, streak: 4, labsCleared: 11, badge: 'WebSec Hunter', avatar: 'UF' },
    { rank: 9, name: 'Sana Rehman', handle: '@sana_r', level: 6, xp: 1780, streak: 7, labsCleared: 10, badge: 'Security Researcher', avatar: 'SR' },
    { rank: 10, name: 'Omar Khalid', handle: '@omar_k', level: 6, xp: 1620, streak: 3, labsCleared: 9, badge: 'AppSec Practitioner', avatar: 'OK' },
  ];

  const filteredLeaderboard = leaderboardData.filter((u) =>
    search ? u.name.toLowerCase().includes(search.toLowerCase()) || u.handle.toLowerCase().includes(search.toLowerCase()) : true
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0c141d] via-[#121c29] to-[#080d12] border border-[#1b2b3a] p-6 lg:p-8 cyber-glow">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-400 font-mono text-xs">
              <Trophy className="w-4 h-4" />
              <span>GLOBAL ANALYST STANDINGS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-mono text-slate-100">
              RAFAY HACKING LAB Leaderboard
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed font-sans">
              Compete with top cybersecurity analysts across hands-on lab clears, tool mastery, and daily training streaks.
            </p>
          </div>

          {/* Current User Rank Card */}
          <div className="p-4 rounded-xl bg-[#080d12] border border-[#1d2b3a] flex items-center gap-4 w-full md:w-auto font-mono">
            <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 text-center shrink-0">
              <Crown className="w-6 h-6 mx-auto mb-1" />
              <span className="text-xs font-bold block">RANK #3</span>
            </div>
            <div>
              <div className="text-xs text-slate-400">Your Current Placement</div>
              <div className="text-slate-100 font-bold text-sm">Rafay Alvi (@rafay_alvi)</div>
              <div className="text-xs text-cyan-400 mt-0.5">
                {userProgress.xp} XP • {userProgress.completedLabs.length} Labs Solved
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 2nd Place */}
        <div className="p-5 rounded-xl bg-[#0c1218] border border-[#1a2634] relative overflow-hidden flex flex-col justify-between order-2 md:order-1">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-slate-400/15 text-slate-300 border border-slate-400/30">
              #2 Silver Rank
            </span>
            <Award className="w-6 h-6 text-slate-300" />
          </div>
          <div className="space-y-1">
            <h3 className="font-mono font-bold text-slate-100 text-base">{leaderboardData[1].name}</h3>
            <p className="font-mono text-xs text-slate-400">{leaderboardData[1].handle}</p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#182432] flex items-center justify-between font-mono text-xs text-slate-300">
            <span>{leaderboardData[1].xp} XP</span>
            <span className="text-slate-400">{leaderboardData[1].labsCleared} Labs</span>
          </div>
        </div>

        {/* 1st Place */}
        <div className="p-6 rounded-xl bg-gradient-to-b from-[#121f2d] to-[#0c131c] border-2 border-amber-500/50 relative overflow-hidden flex flex-col justify-between order-1 md:order-2 shadow-xl shadow-amber-950/20">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>#1 Gold Champion</span>
            </span>
            <Trophy className="w-7 h-7 text-amber-400" />
          </div>
          <div className="space-y-1">
            <h3 className="font-mono font-bold text-slate-100 text-lg">{leaderboardData[0].name}</h3>
            <p className="font-mono text-xs text-amber-400">{leaderboardData[0].handle}</p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#1e2f42] flex items-center justify-between font-mono text-xs font-bold text-amber-300">
            <span>{leaderboardData[0].xp} XP</span>
            <span>{leaderboardData[0].labsCleared} Labs Cleared</span>
          </div>
        </div>

        {/* 3rd Place */}
        <div className="p-5 rounded-xl bg-[#0c1218] border border-[#1a2634] relative overflow-hidden flex flex-col justify-between order-3">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-amber-700/20 text-amber-400 border border-amber-600/30">
              #3 Bronze Rank
            </span>
            <Award className="w-6 h-6 text-amber-600" />
          </div>
          <div className="space-y-1">
            <h3 className="font-mono font-bold text-slate-100 text-base">{leaderboardData[2].name}</h3>
            <p className="font-mono text-xs text-cyan-400">{leaderboardData[2].handle}</p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#182432] flex items-center justify-between font-mono text-xs text-slate-300">
            <span>{leaderboardData[2].xp} XP</span>
            <span className="text-slate-400">{leaderboardData[2].labsCleared} Labs</span>
          </div>
        </div>
      </div>

      {/* Leaderboard Table Box */}
      <div className="rounded-xl bg-[#0c1218] border border-[#1a2634] p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search analysts by name or handle..."
              className="w-full bg-[#080d12] border border-[#1a2634] rounded-lg ps-9 pe-4 py-2 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as any)}
              className="bg-[#080d12] border border-[#1a2634] rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-hidden cursor-pointer"
            >
              <option value="alltime">All-Time XP Rankings</option>
              <option value="weekly">This Week's Sprints</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-[#182432] text-slate-400 text-[11px] uppercase">
                <th className="py-3 px-3">Rank</th>
                <th className="py-3 px-3">Security Analyst</th>
                <th className="py-3 px-3">Level</th>
                <th className="py-3 px-3">Streak</th>
                <th className="py-3 px-3">Labs Cleared</th>
                <th className="py-3 px-3 text-right">Total XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#16222e]">
              {filteredLeaderboard.map((user) => (
                <tr
                  key={user.rank}
                  className={`hover:bg-[#111a24] transition-colors ${
                    user.isCurrentUser ? 'bg-cyan-950/20 border-s-4 border-s-cyan-400' : ''
                  }`}
                >
                  <td className="py-3 px-3 font-bold text-slate-300">
                    {user.rank === 1 ? (
                      <span className="text-amber-400 flex items-center gap-1">
                        <Crown className="w-4 h-4" /> #1
                      </span>
                    ) : user.rank === 2 ? (
                      <span className="text-slate-300">#2</span>
                    ) : user.rank === 3 ? (
                      <span className="text-amber-600">#3</span>
                    ) : (
                      `#${user.rank}`
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#14202c] border border-[#223345] text-cyan-400 font-bold flex items-center justify-center text-xs">
                        {user.avatar}
                      </div>
                      <div>
                        <div className="font-bold text-slate-100 flex items-center gap-1.5">
                          <span>{user.name}</span>
                          {user.isCurrentUser && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                              YOU
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400">{user.handle}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-[#14202c] text-cyan-400 border border-[#223345]">
                      Lvl {user.level}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-amber-400 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" /> {user.streak}d
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      {user.labsCleared}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-slate-100">
                    <span className="flex items-center justify-end gap-1 text-emerald-400">
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      {user.xp.toLocaleString()} XP
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
