import React, { useState } from 'react';
import {
  ShieldCheck,
  FlaskConical,
  Terminal,
  Bot,
  Wrench,
  Award,
  Flame,
  ArrowRight,
  Play,
  CheckCircle2,
  Lock,
  Compass,
  FileText,
  Eye,
  Zap,
  Wifi,
  Download,
  Folder,
  BookOpen,
  Clock,
  Trophy,
  Shield,
  Layers,
  Search,
  Crown,
} from 'lucide-react';
import { Translations } from '../../data/translations';
import { UserProgress } from '../../types/cyber';
import { PRACTICE_LABS_DATA } from '../../data/labsData';
import { KALI_TOOLS_DATA } from '../../data/toolsData';
import { PageId } from '../layout/Sidebar';
import { soundEffects } from '../../utils/audio';

interface DashboardViewProps {
  t: Translations;
  userProgress: UserProgress;
  onNavigate: (page: PageId, targetId?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userProgress,
  onNavigate,
}) => {
  // Popular 10 tools from reference image
  const popularTools = [
    { id: 'nmap', name: 'Nmap', category: 'Network Scanner', icon: <Eye className="w-7 h-7 text-cyan-400" />, color: 'hover:border-cyan-500/40' },
    { id: 'wireshark', name: 'Wireshark', category: 'Packet Analyzer', icon: <Layers className="w-7 h-7 text-blue-400" />, color: 'hover:border-blue-500/40' },
    { id: 'burpsuite', name: 'Burp Suite', category: 'Web Security', icon: <Zap className="w-7 h-7 text-amber-400" />, color: 'hover:border-amber-500/40' },
    { id: 'metasploit', name: 'Metasploit', category: 'Exploitation', icon: <Terminal className="w-7 h-7 text-purple-400" />, color: 'hover:border-purple-500/40' },
    { id: 'sqlmap', name: 'SQLmap', category: 'SQL Injection', icon: <Wrench className="w-7 h-7 text-red-400" />, color: 'hover:border-red-500/40' },
    { id: 'aircrack-ng', name: 'Aircrack-ng', category: 'Wireless', icon: <Wifi className="w-7 h-7 text-emerald-400" />, color: 'hover:border-emerald-500/40' },
    { id: 'john', name: 'John the Ripper', category: 'Password Audit', icon: <Shield className="w-7 h-7 text-red-500" />, color: 'hover:border-red-500/40' },
    { id: 'hydra', name: 'Hydra', category: 'Brute Force', icon: <Zap className="w-7 h-7 text-emerald-300" />, color: 'hover:border-emerald-500/40' },
    { id: 'nikto', name: 'Nikto', category: 'Web Scanner', icon: <Search className="w-7 h-7 text-red-400" />, color: 'hover:border-red-500/40' },
    { id: 'gobuster', name: 'Gobuster', category: 'Directory Fuzzing', icon: <Compass className="w-7 h-7 text-yellow-400" />, color: 'hover:border-yellow-500/40' },
  ];

  // Recent activity items
  const recentActivities = [
    { id: 1, type: 'completed', text: 'Completed: Nmap Basics', time: '2m ago', icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" /> },
    { id: 2, type: 'started', text: 'Started: Web Security Lab', time: '15m ago', icon: <Play className="w-4 h-4 text-cyan-400" /> },
    { id: 3, type: 'favorite', text: 'Added to Favorites: Burp Suite', time: '1h ago', icon: <Award className="w-4 h-4 text-purple-400" /> },
    { id: 4, type: 'achievement', text: 'Earned: Security Explorer Badge', time: '2h ago', icon: <Trophy className="w-4 h-4 text-amber-400" /> },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* 1. Hero Welcome Banner matching reference image */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#070e17] via-[#0c1624] to-[#080d14] border border-[#162536] p-6 lg:p-8 shadow-2xl cyber-glow">
        <div className="absolute -top-12 -right-12 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Left Hero Graphic & Content */}
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            {/* Hacker avatar icon */}
            <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-600/30 border border-cyan-500/40 flex items-center justify-center shrink-0 shadow-xl shadow-cyan-950/50">
              <Shield className="w-12 h-12 text-cyan-400" />
              <span className="absolute inset-0 flex items-center justify-center font-mono font-extrabold text-lg text-cyan-300">
                RH
              </span>
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-slate-100">
                  Welcome to <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">RAFAY HACKING LAB</span>
                </h1>
              </div>

              {/* Tagline Divider */}
              <div className="flex items-center justify-center md:justify-start gap-2 font-mono text-xs font-bold text-cyan-400 tracking-widest uppercase">
                <span>LEARN</span>
                <span className="text-slate-600">•</span>
                <span>PRACTICE</span>
                <span className="text-slate-600">•</span>
                <span>MASTER</span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 font-mono">
                Professional Cybersecurity Learning Platform
              </p>

              {/* Action Pills */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
                <button
                  onClick={() => onNavigate('tools')}
                  className="px-3 py-1.5 rounded-lg bg-[#0e1926] hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
                >
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>500 Tools</span>
                </button>

                <button
                  onClick={() => onNavigate('bridge')}
                  className="px-3 py-1.5 rounded-lg bg-[#0e1926] hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
                >
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Kali Terminal</span>
                </button>

                <button
                  onClick={() => onNavigate('mentor')}
                  className="px-3 py-1.5 rounded-lg bg-[#0e1926] hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
                >
                  <Bot className="w-3.5 h-3.5 text-amber-400" />
                  <span>AI Mentor</span>
                </button>

                <button
                  onClick={() => onNavigate('web_labs')}
                  className="px-3 py-1.5 rounded-lg bg-[#0e1926] hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
                >
                  <FlaskConical className="w-3.5 h-3.5 text-blue-400" />
                  <span>Practical Labs</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Hero Quote Box */}
          <div className="p-4 rounded-2xl bg-[#09111b]/80 border border-cyan-500/30 backdrop-blur-md flex items-center gap-3 shrink-0 max-w-xs shadow-lg">
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <p className="font-mono italic font-bold text-xs text-amber-300">
                "Hack the Skills, Not the Systems"
              </p>
              <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                Authorized Lab Environments Only
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top 4 Feature Cards Row matching reference image */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: 500 Tools */}
        <div
          onClick={() => onNavigate('tools')}
          className="p-5 rounded-2xl bg-[#090e15] border border-[#162230] hover:border-cyan-500/40 transition-all cursor-pointer group flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:scale-105 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-mono font-bold text-slate-100 text-sm group-hover:text-cyan-400 transition-colors">
                500 Tools
              </h3>
              <p className="text-[11px] font-mono text-slate-400">
                Complete Library + Command Guide
              </p>
            </div>
          </div>
          <div className="p-1.5 rounded-lg bg-[#121c27] text-slate-400 group-hover:text-cyan-400 group-hover:bg-cyan-500/20 transition-all">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Card 2: Kali Terminal */}
        <div
          onClick={() => onNavigate('bridge')}
          className="p-5 rounded-2xl bg-[#090e15] border border-[#162230] hover:border-emerald-500/40 transition-all cursor-pointer group flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition-transform">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-mono font-bold text-slate-100 text-sm group-hover:text-emerald-400 transition-colors">
                Kali Terminal
              </h3>
              <p className="text-[11px] font-mono text-slate-400">
                Connect Your Kali Linux
              </p>
            </div>
          </div>
          <div className="p-1.5 rounded-lg bg-[#121c27] text-slate-400 group-hover:text-emerald-400 group-hover:bg-emerald-500/20 transition-all">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Card 3: AI Mentor */}
        <div
          onClick={() => onNavigate('mentor')}
          className="p-5 rounded-2xl bg-[#090e15] border border-[#162230] hover:border-amber-500/40 transition-all cursor-pointer group flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-105 transition-transform">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-mono font-bold text-slate-100 text-sm group-hover:text-amber-400 transition-colors">
                AI Mentor
              </h3>
              <p className="text-[11px] font-mono text-slate-400">
                Ask • Learn • Get Help
              </p>
            </div>
          </div>
          <div className="p-1.5 rounded-lg bg-[#121c27] text-slate-400 group-hover:text-amber-400 group-hover:bg-amber-500/20 transition-all">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Card 4: Practical Labs */}
        <div
          onClick={() => onNavigate('web_labs')}
          className="p-5 rounded-2xl bg-[#090e15] border border-[#162230] hover:border-blue-500/40 transition-all cursor-pointer group flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:scale-105 transition-transform">
              <FlaskConical className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-mono font-bold text-slate-100 text-sm group-hover:text-blue-400 transition-colors">
                Practical Labs
              </h3>
              <p className="text-[11px] font-mono text-slate-400">
                Real-World Practice
              </p>
            </div>
          </div>
          <div className="p-1.5 rounded-lg bg-[#121c27] text-slate-400 group-hover:text-blue-400 group-hover:bg-blue-500/20 transition-all">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 3. Middle Grid: Popular Tools Grid + Learning Roadmap Gauge Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Popular Tools Grid (10 tools) */}
        <div className="lg:col-span-7 rounded-2xl bg-[#090e15] border border-[#162230] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#141d27] pb-3">
            <div className="flex items-center gap-2 font-mono text-sm font-bold text-slate-100">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Popular Tools</span>
            </div>
            <button
              onClick={() => onNavigate('tools')}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {popularTools.map((tool) => (
              <div
                key={tool.id}
                onClick={() => onNavigate('tools', tool.id)}
                className={`p-3.5 rounded-xl bg-[#0d141d] border border-[#192533] ${tool.color} transition-all cursor-pointer group text-center space-y-2 flex flex-col items-center justify-center`}
              >
                <div className="p-2 rounded-lg bg-[#131d2a] group-hover:scale-110 transition-transform">
                  {tool.icon}
                </div>
                <div>
                  <div className="font-mono text-xs font-bold text-slate-100 group-hover:text-cyan-300 transition-colors truncate max-w-[90px]">
                    {tool.name}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 truncate max-w-[90px]">
                    {tool.category}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Roadmap Gauge Box */}
        <div className="lg:col-span-5 rounded-2xl bg-[#090e15] border border-[#162230] p-6 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#141d27] pb-3">
            <div className="flex items-center gap-2 font-mono text-sm font-bold text-slate-100">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>Learning Roadmap</span>
            </div>
            <button
              onClick={() => onNavigate('learning')}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              <span>View Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            {/* Level Steps */}
            <div className="sm:col-span-7 space-y-3 font-mono text-xs">
              {/* Beginner */}
              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-emerald-400">Beginner Level</div>
                  <div className="text-[11px] text-slate-400">Linux Basics & Networking (Completed)</div>
                </div>
              </div>

              {/* Intermediate */}
              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded-full bg-cyan-500/20 text-cyan-400 shrink-0 mt-0.5">
                  <Play className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <div className="font-bold text-cyan-300">Intermediate Level</div>
                  <div className="text-[11px] text-slate-400">Security Tools & Labs (in progress)</div>
                </div>
              </div>

              {/* Advanced */}
              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded-full bg-slate-800 text-slate-500 shrink-0 mt-0.5">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-500">Advanced Level</div>
                  <div className="text-[11px] text-slate-600">Exploitation & Reporting (locked)</div>
                </div>
              </div>
            </div>

            {/* Gauge Ring 45% */}
            <div className="sm:col-span-5 flex flex-col items-center justify-center text-center">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-400"
                    strokeDasharray="45, 100"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute font-mono text-center">
                  <span className="text-xl font-extrabold text-slate-100">45%</span>
                  <span className="block text-[9px] text-slate-400 uppercase">Overall</span>
                </div>
              </div>
              <button
                onClick={() => onNavigate('learning')}
                className="mt-3 w-full py-1.5 px-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-mono text-xs font-bold transition-all shadow-md shadow-purple-950 flex items-center justify-center gap-1"
              >
                <span>Continue Learning</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Grid: Quick Actions + Recent Activity + Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quick Actions (6 Buttons) */}
        <div className="lg:col-span-4 rounded-2xl bg-[#090e15] border border-[#162230] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#141d27] pb-3 font-mono text-sm font-bold text-slate-100">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Quick Actions</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 font-mono text-xs">
            <button
              onClick={() => onNavigate('learning')}
              className="p-3 rounded-xl bg-[#0e1723] hover:bg-blue-600/20 border border-[#192738] hover:border-blue-500/40 text-slate-200 transition-all flex flex-col items-center justify-center gap-1.5 text-center group"
            >
              <BookOpen className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-semibold">Start Lesson</span>
            </button>

            <button
              onClick={() => onNavigate('bridge')}
              className="p-3 rounded-xl bg-[#0e1723] hover:bg-emerald-600/20 border border-[#192738] hover:border-emerald-500/40 text-slate-200 transition-all flex flex-col items-center justify-center gap-1.5 text-center group"
            >
              <Terminal className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-semibold">Open Terminal</span>
            </button>

            <button
              onClick={() => onNavigate('web_labs')}
              className="p-3 rounded-xl bg-[#0e1723] hover:bg-cyan-600/20 border border-[#192738] hover:border-cyan-500/40 text-slate-200 transition-all flex flex-col items-center justify-center gap-1.5 text-center group"
            >
              <FlaskConical className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-semibold">Try a Lab</span>
            </button>

            <button
              onClick={() => onNavigate('mentor')}
              className="p-3 rounded-xl bg-[#0e1723] hover:bg-purple-600/20 border border-[#192738] hover:border-purple-500/40 text-slate-200 transition-all flex flex-col items-center justify-center gap-1.5 text-center group"
            >
              <Bot className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-semibold">Ask AI Mentor</span>
            </button>

            <button
              onClick={() => onNavigate('reports')}
              className="p-3 rounded-xl bg-[#0e1723] hover:bg-amber-600/20 border border-[#192738] hover:border-amber-500/40 text-slate-200 transition-all flex flex-col items-center justify-center gap-1.5 text-center group"
            >
              <Folder className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-semibold">View Projects</span>
            </button>

            <button
              onClick={() => onNavigate('reports')}
              className="p-3 rounded-xl bg-[#0e1723] hover:bg-emerald-600/20 border border-[#192738] hover:border-emerald-500/40 text-slate-200 transition-all flex flex-col items-center justify-center gap-1.5 text-center group"
            >
              <Download className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-semibold">Download Report</span>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-4 rounded-2xl bg-[#090e15] border border-[#162230] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#141d27] pb-3 font-mono text-sm font-bold text-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Recent Activity</span>
            </div>
            <button
              onClick={() => onNavigate('portfolio')}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {recentActivities.map((act) => (
              <div key={act.id} className="flex items-center justify-between p-2.5 rounded-xl bg-[#0d141d] border border-[#182432]">
                <div className="flex items-center gap-2.5">
                  {act.icon}
                  <span className="text-slate-200 font-medium text-[11px]">{act.text}</span>
                </div>
                <span className="text-[10px] text-slate-400">{act.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Your Achievements */}
        <div className="lg:col-span-4 rounded-2xl bg-[#090e15] border border-[#162230] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#141d27] pb-3 font-mono text-sm font-bold text-slate-100">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span>Your Achievements</span>
            </div>
            <button
              onClick={() => onNavigate('portfolio')}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center font-mono">
            {/* Badge 1 */}
            <div className="p-2.5 rounded-xl bg-[#0d141d] border border-emerald-500/30 flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-200 leading-tight">First Lesson</span>
            </div>

            {/* Badge 2 */}
            <div className="p-2.5 rounded-xl bg-[#0d141d] border border-cyan-500/30 flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Terminal className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-200 leading-tight">Terminal Pro</span>
            </div>

            {/* Badge 3 */}
            <div className="p-2.5 rounded-xl bg-[#0d141d] border border-purple-500/30 flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-200 leading-tight">Lab Master</span>
            </div>

            {/* Badge 4 */}
            <div className="p-2.5 rounded-xl bg-[#0d141d] border border-amber-500/30 flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Crown className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-200 leading-tight">Top Learner</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
