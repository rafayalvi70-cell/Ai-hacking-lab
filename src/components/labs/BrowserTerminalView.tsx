import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal as TerminalIcon,
  HelpCircle,
  RotateCcw,
  Play,
  Copy,
  Check,
  Shield,
  Zap,
  Layers,
  Globe,
  Radio,
  BookOpen,
  Info,
  Server,
  Lock,
} from 'lucide-react';
import { Translations } from '../../data/translations';
import { Language } from '../../types/cyber';
import { soundEffects } from '../../utils/audio';
import { defaultSimulatedProvider, defaultCloudProvider } from '../../services/terminalProvider';

interface BrowserTerminalViewProps {
  t: Translations;
  language: Language;
}

interface CommandHistoryItem {
  command: string;
  output: string;
  isSimulated: boolean;
  explanationEn?: string;
  explanationUr?: string;
  explanationRomanUr?: string;
  timestamp: string;
}

interface GuidedExercise {
  id: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate';
  goal: string;
  targetCommand: string;
  explanationEn: string;
  explanationUr: string;
  explanationRomanUr: string;
}

const GUIDED_EXERCISES: GuidedExercise[] = [
  {
    id: 'linux-1',
    title: '1. Directory Navigation & Inspection',
    category: 'Linux Fundamentals',
    difficulty: 'Beginner',
    goal: 'List all files including hidden dotfiles in the training workspace.',
    targetCommand: 'ls -la',
    explanationEn: 'The `ls` command lists directory contents. `-l` uses long listing format, and `-a` reveals hidden files starting with a dot.',
    explanationUr: 'یہ کمانڈ ڈائریکٹری کے تمام پنہاں اور عام فائلیں تفصیلی فارمیٹ میں دکھاتی ہے۔',
    explanationRomanUr: 'Yeh command directory ki tamaam hidden aur normal files detailed format me dikhati hai.',
  },
  {
    id: 'net-1',
    title: '2. Port Reconnaissance with Nmap',
    category: 'Network Recon',
    difficulty: 'Beginner',
    goal: 'Scan open web ports (80, 443, 3001) on the target host 127.0.0.1.',
    targetCommand: 'nmap -sS -p 80,443,3001 127.0.0.1',
    explanationEn: 'The `-sS` flag performs a TCP SYN Stealth scan on target ports to identify active web services without full TCP handshake completion.',
    explanationUr: 'یہ سٹیلتھ پورٹ سکین کرکے دیکھتا ہے کہ کونسی سروسز ایکٹیو ہیں۔',
    explanationRomanUr: 'Yeh stealth port scan karke dekhta hai ke konsi services active hain.',
  },
  {
    id: 'web-1',
    title: '3. HTTP Header Inspection with Curl',
    category: 'Web Security',
    difficulty: 'Intermediate',
    goal: 'Fetch server response HTTP headers from local target web app.',
    targetCommand: 'curl -I http://127.0.0.1:3001',
    explanationEn: 'The `-I` flag sends an HTTP HEAD request to fetch only server headers (Server, Content-Type, Content-Security-Policy).',
    explanationUr: 'یہ کمانڈ سرف ویب سرور کا ہیڈر رسپانس دکھاتی ہے۔',
    explanationRomanUr: 'Yeh command sirf web server ka header response dikhati hai.',
  },
  {
    id: 'dns-1',
    title: '4. Domain Name Resolution (DNS)',
    category: 'Networking',
    difficulty: 'Beginner',
    goal: 'Query IP address records for target domain rafayhackinglab.local.',
    targetCommand: 'nslookup target.local',
    explanationEn: 'The `nslookup` command queries Domain Name System servers to resolve domain names to IPv4/IPv6 addresses.',
    explanationUr: 'یہ کمانڈ ڈومین کے آئی پی ایڈریس کی معلومات فراہم کرتی ہے۔',
    explanationRomanUr: 'Yeh command domain name ke IP address ki info nikaalti hai.',
  },
];

export const BrowserTerminalView: React.FC<BrowserTerminalViewProps> = ({ language }) => {
  const [terminalMode, setTerminalMode] = useState<'simulated' | 'cloud_remote'>('simulated');
  const [inputCommand, setInputCommand] = useState('');
  const [history, setHistory] = useState<CommandHistoryItem[]>([
    {
      command: 'banner',
      output: `===============================================================
  RAFAY HACKING LAB — BROWSER TERMINAL (MODE A: GUIDED SIMULATOR)
  LEARN • PRACTICE • MASTER | 100% Standalone Cloud Execution
===============================================================
Type 'help' to view available commands & guided exercise shortcuts.`,
      isSimulated: true,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const [cmdHistoryList, setCmdHistoryList] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [cloudAvailable, setCloudAvailable] = useState<boolean>(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    defaultCloudProvider.isAvailable().then((res) => setCloudAvailable(res));
  }, []);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleSimulatedExecute = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    soundEffects.playKeyClick();
    setCmdHistoryList((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const parts = trimmed.split(' ');
    const mainCmd = parts[0].toLowerCase();
    const arg1 = parts[1] || '';

    let output = '';
    let expEn = '';
    let expUr = '';
    let expRomanUr = '';

    if (mainCmd === 'clear') {
      setHistory([]);
      setInputCommand('');
      return;
    } else if (mainCmd === 'help') {
      output = `RAFAY HACKING LAB — Educational Simulator Commands:
  - ls [-la]          : List directory files
  - cat <filename>    : Display file contents
  - pwd               : Print current working directory
  - whoami            : Print current user identity
  - nmap <target>     : Perform simulated port scan
  - nslookup <domain> : Query DNS record
  - curl <url>        : Fetch HTTP response headers
  - ping <host>       : Test ICMP echo ping latency
  - clear             : Clear terminal screen
  - help              : Show this help guide`;
      expEn = 'Help menu lists all available simulated commands.';
      expUr = 'یہ ہیلپ مینو تمام دستیاب کمانڈز کی فہرست دکھاتا ہے۔';
      expRomanUr = 'Yeh help menu tamaam available commands ki list dikhata hai.';
    } else if (mainCmd === 'ls') {
      if (trimmed.includes('-a') || trimmed.includes('-la')) {
        output = `drwxr-xr-x 4 student student 4096 Nov 09 10:00 .
drwxr-xr-x 3 student student 4096 Nov 09 09:30 ..
-rw-r--r-- 1 student student  240 Nov 09 09:45 .bashrc
-rw-r--r-- 1 student student 1024 Nov 09 09:50 README.txt
-rw-r--r-- 1 student student  512 Nov 09 09:55 network_config.json
-rwxr-xr-x 1 student student  320 Nov 09 10:00 port_scanner.py`;
      } else {
        output = `README.txt  network_config.json  port_scanner.py`;
      }
      expEn = 'Directory file listing retrieved.';
      expUr = 'ڈائریکٹری فائلوں کی لسٹ دکھائی جا رہی ہے۔';
      expRomanUr = 'Directory files ki list dikhai ja rahi hai.';
    } else if (mainCmd === 'cat') {
      if (arg1 === 'README.txt' || !arg1) {
        output = `=== RAFAY HACKING LAB — STUDENT GUIDE ===
Welcome to the cybersecurity practice sandbox.
Use Nmap, Curl, and Gobuster commands to analyze vulnerable targets.`;
      } else if (arg1.includes('passwd')) {
        output = `root:x:0:0:root:/root:/bin/bash
student:x:1000:1000:RH Trainee:/home/student:/bin/bash
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin`;
      } else if (arg1 === 'network_config.json') {
        output = `{\n  "subnet": "127.0.0.1/24",\n  "targets": ["Juice Shop (3001)", "DVWA (8080)", "WebGoat (8088)"]\n}`;
      } else {
        output = `cat: ${arg1}: No such file or directory`;
      }
      expEn = 'Inspected file contents.';
      expUr = 'فائل کا مواد دکھایا جا رہا ہے۔';
      expRomanUr = 'File ka content dikhaya ja raha hai.';
    } else if (mainCmd === 'pwd') {
      output = `/home/student/rafay-hacking-lab`;
      expEn = 'Current working directory path.';
    } else if (mainCmd === 'whoami') {
      output = `student (Ethical Hacker Trainee)`;
      expEn = 'Current authenticated student identity.';
    } else if (mainCmd === 'nmap') {
      output = `Starting Nmap 7.94 ( https://nmap.org )
Nmap scan report for 127.0.0.1
Host is up (0.00045s latency).
PORT     STATE SERVICE     VERSION
80/tcp   open  http        Nginx 1.24.0
443/tcp  open  https       OpenSSL 3.0.2
3001/tcp open  juice-shop  OWASP Juice Shop 16.0.0
8080/tcp open  http-proxy  DVWA 2.3.1
8088/tcp open  webgoat     OWASP WebGoat 2023.4

Nmap done: 1 IP address (1 host up) scanned in 0.85 seconds.`;
      expEn = 'Nmap port scan results showing active web application target ports.';
      expUr = 'این میپ سکین نے معلوم کیا کہ تمام مطلوبہ پورٹس ایکٹیو ہیں۔';
      expRomanUr = 'Nmap scan ne pata lagaya ke tamaam target ports active hain.';
    } else if (mainCmd === 'curl') {
      output = `HTTP/1.1 200 OK
Server: OWASP Juice Shop / Express
Content-Type: text/html; charset=utf-8
Content-Security-Policy: default-src 'self'
Access-Control-Allow-Origin: *
X-Content-Type-Options: nosniff
Date: ${new Date().toUTCString()}`;
      expEn = 'Retrieved target HTTP response headers.';
    } else if (mainCmd === 'nslookup' || mainCmd === 'dig') {
      output = `Server:		127.0.0.53
Address:	127.0.0.53#53

Name:	${arg1 || 'target.local'}
Address: 127.0.0.1`;
      expEn = 'DNS resolution mapping.';
    } else if (mainCmd === 'ping') {
      output = `PING 127.0.0.1 (127.0.0.1) 56(84) bytes of data.
64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.042 ms
64 bytes from 127.0.0.1: icmp_seq=2 ttl=64 time=0.038 ms
64 bytes from 127.0.0.1: icmp_seq=3 ttl=64 time=0.041 ms

--- 127.0.0.1 ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2045ms`;
      expEn = 'ICMP echo test succeeded with 0% packet loss.';
    } else {
      output = `bash: ${trimmed}: command not recognized in basic educational simulator mode.
Type 'help' to list supported learning commands or select a guided preset.`;
      expEn = 'Unrecognized command in basic educational sandbox mode.';
    }

    setHistory((prev) => [
      ...prev,
      {
        command: trimmed,
        output,
        isSimulated: true,
        explanationEn: expEn,
        explanationUr: expUr,
        explanationRomanUr: expRomanUr,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
    setInputCommand('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSimulatedExecute(inputCommand);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistoryList.length > 0) {
        const nextIdx = historyIndex + 1 < cmdHistoryList.length ? historyIndex + 1 : historyIndex;
        setHistoryIndex(nextIdx);
        setInputCommand(cmdHistoryList[cmdHistoryList.length - 1 - nextIdx] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputCommand(cmdHistoryList[cmdHistoryList.length - 1 - nextIdx] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputCommand('');
      }
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    soundEffects.playKeyClick();
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Top Header Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#080d14] via-[#0e1726] to-[#070b10] border border-[#172535] p-6 lg:p-8 cyber-glow">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold">
              <TerminalIcon className="w-4 h-4" />
              <span>CLOUD BROWSER TERMINAL ENGINE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-mono text-slate-100">
              Interactive Web Terminal & Simulator
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-mono">
              Practice Linux navigation, Nmap recon, and HTTP header audits directly inside your browser with 100% cloud standalone availability.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={() => {
                soundEffects.playKeyClick();
                setTerminalMode('simulated');
              }}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 font-bold transition-all ${
                terminalMode === 'simulated'
                  ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300'
                  : 'bg-[#090e15] border border-[#162230] text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Mode A: Guided Simulator (Free)</span>
            </button>

            <button
              onClick={() => {
                soundEffects.playKeyClick();
                setTerminalMode('cloud_remote');
              }}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 font-bold transition-all ${
                terminalMode === 'cloud_remote'
                  ? 'bg-purple-500/20 border border-purple-500/40 text-purple-300'
                  : 'bg-[#090e15] border border-[#162230] text-slate-400 hover:text-slate-200'
              }`}
            >
              <Server className="w-4 h-4 text-purple-400" />
              <span>Mode B: Cloud Remote Terminal</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODE A: GUIDED EDUCATIONAL SIMULATOR */}
      {terminalMode === 'simulated' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Guided Exercises Panel */}
          <div className="lg:col-span-4 space-y-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-[#0c1218] border border-[#1b2634] space-y-3">
              <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>Guided Practice Scenarios</span>
              </h3>
              <p className="text-[11px] font-sans text-slate-400 leading-relaxed">
                Click any exercise command to populate the browser terminal and learn the breakdown.
              </p>

              <div className="space-y-2.5">
                {GUIDED_EXERCISES.map((ex) => (
                  <div
                    key={ex.id}
                    className="p-3 rounded-lg bg-[#070b0e] border border-[#16222e] hover:border-cyan-500/40 space-y-2 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400">
                        {ex.category}
                      </span>
                      <span className="text-[10px] text-slate-400">{ex.difficulty}</span>
                    </div>

                    <h4 className="font-bold text-slate-200 text-xs">{ex.title}</h4>
                    <p className="text-[11px] font-sans text-slate-400">{ex.goal}</p>

                    <div className="pt-1 flex items-center justify-between">
                      <code className="text-cyan-300 text-[11px] font-mono">{ex.targetCommand}</code>
                      <button
                        onClick={() => {
                          setInputCommand(ex.targetCommand);
                          soundEffects.playKeyClick();
                        }}
                        className="px-2.5 py-1 rounded bg-[#121c27] hover:bg-cyan-500 hover:text-slate-950 text-slate-200 font-bold text-[10px] transition-all flex items-center gap-1"
                      >
                        <span>Use Cmd</span>
                        <Play className="w-3 h-3 fill-current" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Terminal Console */}
          <div className="lg:col-span-8 flex flex-col space-y-3">
            <div className="rounded-2xl bg-[#06090e] border border-[#172535] p-5 flex flex-col font-mono text-xs cyber-glow min-h-[500px]">
              {/* Title Bar */}
              <div className="flex items-center justify-between border-b border-[#141d27] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-3.5 h-3.5 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-500/80 inline-block" />
                  <span className="text-slate-300 font-bold ps-2">student@rafay-hacking-lab:~$</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold">
                    SIMULATED TRAINING OUTPUT
                  </span>

                  <button
                    onClick={() => {
                      setHistory([]);
                      soundEffects.playKeyClick();
                    }}
                    className="p-1.5 rounded-lg bg-[#121c27] hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                    title="Clear Output"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Terminal Logs Stream */}
              <div className="flex-1 overflow-y-auto space-y-4 pe-2">
                {history.map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    {item.command !== 'banner' && (
                      <div className="flex items-center gap-2 text-cyan-400 font-bold">
                        <span>student@rafay-hacking-lab:~$</span>
                        <span className="text-slate-100">{item.command}</span>
                      </div>
                    )}

                    <pre className="text-emerald-300 whitespace-pre-wrap leading-relaxed select-text font-mono text-[11px] bg-[#03060a] p-3 rounded-xl border border-[#121c27]">
                      {item.output}
                    </pre>

                    {item.explanationEn && (
                      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1 text-[11px] font-sans text-slate-300">
                        <div className="font-mono text-cyan-400 font-bold">Educational Breakdown:</div>
                        <div>{item.explanationEn}</div>
                        {language === 'ur' && item.explanationUr && (
                          <div className="text-cyan-300 font-semibold dir-rtl text-right pt-1 border-t border-slate-800">
                            {item.explanationUr}
                          </div>
                        )}
                        {language === 'roman_ur' && item.explanationRomanUr && (
                          <div className="text-cyan-300 italic pt-1 border-t border-slate-800">
                            {item.explanationRomanUr}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                <div ref={terminalEndRef} />
              </div>

              {/* Command Input Prompt */}
              <div className="pt-3 mt-3 border-t border-[#141d27] flex items-center gap-2">
                <span className="text-emerald-400 font-bold">$</span>
                <input
                  type="text"
                  value={inputCommand}
                  onChange={(e) => setInputCommand(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type command (e.g. nmap 127.0.0.1, ls -la, curl -I http://127.0.0.1:3001)..."
                  className="flex-1 bg-transparent border-none text-slate-100 font-mono text-xs focus:outline-hidden focus:ring-0 placeholder-slate-600"
                />
                <button
                  onClick={() => handleSimulatedExecute(inputCommand)}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition-all"
                >
                  <span>Execute</span>
                  <Play className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE B: REAL CLOUD REMOTE TERMINAL ADAPTER */}
      {terminalMode === 'cloud_remote' && (
        <div className="p-8 rounded-2xl bg-[#090e15] border border-[#162230] space-y-6 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-[#141d27] pb-4">
            <div className="space-y-1">
              <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
                <Server className="w-5 h-5 text-purple-400" />
                <span>Mode B: Ephemeral Cloud Remote Terminal</span>
              </h3>
              <p className="text-xs font-sans text-slate-400">
                Isolated remote container WebSocket adapter for real shell execution on cloud infrastructure.
              </p>
            </div>

            <span
              className={`px-3 py-1 rounded font-bold border ${
                cloudAvailable
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
              }`}
            >
              {cloudAvailable ? 'Cloud Provider Active' : 'Provider Adapter Unconfigured'}
            </span>
          </div>

          {!cloudAvailable ? (
            <div className="p-6 rounded-xl bg-[#05080c] border border-[#141d27] space-y-4">
              <div className="flex items-start gap-3 text-amber-400">
                <Info className="w-6 h-6 flex-shrink-0" />
                <div className="space-y-1 font-sans">
                  <h4 className="font-bold font-mono text-slate-100 text-sm">
                    Cloud Remote Terminal Provider Requirement
                  </h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Free serverless hosting does not include persistent Docker hosts or open SSH WebSockets. To enable real remote shell sessions, configure a WebSocket container provider adapter or continue using <strong>Mode A Guided Educational Simulator</strong>.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-[#0b121a] border border-[#182637] space-y-2">
                <div className="text-slate-200 font-bold">Required Environment Setup for Mode B:</div>
                <div className="p-2.5 rounded bg-[#03060a] text-cyan-300 font-mono text-[11px] break-all">
                  VITE_CLOUD_TERMINAL_WS_URL=wss://your-ephemeral-terminal-gateway.cloud/ws
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setTerminalMode('simulated')}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all"
                >
                  Switch Back to Mode A Guided Simulator (Free Mode)
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-emerald-400 font-bold">
              Connecting to active cloud remote terminal WebSocket session...
            </div>
          )}
        </div>
      )}
    </div>
  );
};
