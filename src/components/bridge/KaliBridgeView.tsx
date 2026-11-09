import React, { useState, useEffect } from 'react';
import {
  Server,
  Shield,
  Terminal,
  Play,
  RotateCcw,
  Check,
  AlertTriangle,
  Copy,
  Lock,
  ExternalLink,
  Cpu,
  Layers,
  Clock,
  Radio,
  FileCode,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Translations } from '../../data/translations';
import { Language } from '../../types/cyber';
import { soundEffects } from '../../utils/audio';

interface KaliBridgeViewProps {
  t: Translations;
  language: Language;
}

export const KaliBridgeView: React.FC<KaliBridgeViewProps> = ({ t, language }) => {
  const [companionPort, setCompanionPort] = useState(4444);
  const [pairingToken, setPairingToken] = useState('kali-lab-secret-2026');
  const [allowedSubnet, setAllowedSubnet] = useState('127.0.0.1, 192.168.56.0/24, localhost');
  const [isConnected, setIsConnected] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [connectionMessage, setConnectionMessage] = useState<string | null>(null);

  // Command Execution State
  const [selectedCommand, setSelectedCommand] = useState('nmap -sS -p 22,80,443 127.0.0.1');
  const [targetHost, setTargetHost] = useState('127.0.0.1');
  const [userConfirmed, setUserConfirmed] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string>('');
  const [exitCode, setExitCode] = useState<number | null>(null);
  const [isSimulated, setIsSimulated] = useState<boolean>(true);

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<
    { id: string; timestamp: string; command: string; target: string; exitCode: number }[]
  >([]);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'console' | 'setup' | 'audit'>('console');

  const checkConnection = async () => {
    setIsChecking(true);
    soundEffects.playKeyClick();
    try {
      const res = await fetch('/api/bridge/test-connection');
      const data = await res.json();
      setIsConnected(!!data.connected);
      setConnectionMessage(data.message || (data.connected ? 'Connected to local Kali daemon.' : 'Companion offline.'));
      if (data.connected) {
        soundEffects.playSuccess();
      } else {
        soundEffects.playAlert();
      }
    } catch (err: unknown) {
      setIsConnected(false);
      setConnectionMessage('Could not reach backend bridge endpoint.');
      soundEffects.playAlert();
    } finally {
      setIsChecking(false);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects.playKeyClick();
    try {
      const res = await fetch('/api/bridge/configure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companionPort: Number(companionPort),
          pairingToken,
          allowedSubnet,
        }),
      });
      if (res.ok) {
        soundEffects.playSuccess();
        checkConnection();
      }
    } catch (err) {
      soundEffects.playAlert();
    }
  };

  const handleDisconnect = async () => {
    soundEffects.playKeyClick();
    try {
      await fetch('/api/bridge/disconnect', { method: 'POST' });
      setIsConnected(false);
      setConnectionMessage('Bridge pairing disconnected.');
      soundEffects.playKeyClick();
    } catch (err) {
      console.error(err);
    }
  };

  const handleExecuteCommand = async () => {
    if (!userConfirmed) {
      soundEffects.playAlert();
      return;
    }

    setIsExecuting(true);
    soundEffects.playKeyClick();
    setTerminalOutput('[-] Authenticating pairing token and dispatching command...\n');

    try {
      const res = await fetch('/api/bridge/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: selectedCommand,
          target: targetHost,
          userConfirmed: true,
        }),
      });

      const data = await res.json();
      setIsExecuting(false);

      if (data.error) {
        soundEffects.playAlert();
        setTerminalOutput(`[!] EXECUTION ERROR: ${data.message || data.error}\n`);
        setExitCode(1);
      } else {
        soundEffects.playSuccess();
        setTerminalOutput(data.stdout || data.stderr || '[Command returned without output]');
        setExitCode(data.exitCode ?? 0);
        setIsSimulated(!!data.isSimulated);

        setAuditLogs((prev) => [
          {
            id: `audit-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString(),
            command: selectedCommand,
            target: targetHost,
            exitCode: data.exitCode ?? 0,
          },
          ...prev,
        ]);
      }
    } catch (err: unknown) {
      setIsExecuting(false);
      soundEffects.playAlert();
      setTerminalOutput(`[!] Network error contacting bridge server.\n`);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    soundEffects.playKeyClick();
    setTimeout(() => setCopiedText(null), 2000);
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const sampleSafeCommands = [
    { title: 'Nmap Loopback Port Audit', cmd: 'nmap -sS -p 22,80,443 127.0.0.1' },
    { title: 'Check Active Network Sockets', cmd: 'ss -tulpn' },
    { title: 'Identify OS Kernel & Architecture', cmd: 'uname -a' },
    { title: 'Verify Kali Release Version', cmd: 'cat /etc/os-release' },
    { title: 'Local Ping Latency Test', cmd: 'ping -c 3 127.0.0.1' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Top Header Card */}
      <div className="p-5 rounded-xl bg-[#0c1218] border border-[#1b2634] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start md:items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 font-mono text-base font-bold shrink-0">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30 font-semibold">
                Local Companion Engine
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded border flex items-center gap-1 ${
                  isConnected
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                }`}
              >
                <Radio className={`w-3 h-3 ${isConnected ? 'animate-pulse' : ''}`} />
                <span>{isConnected ? 'Daemon Online (127.0.0.1:4444)' : 'Daemon Offline / Standby'}</span>
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-mono text-slate-100">
              Kali Linux Local Terminal Bridge
            </h1>
          </div>
        </div>

        {/* Quick Connection Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={checkConnection}
            disabled={isChecking}
            className="px-3.5 py-2 rounded-lg bg-[#14202c] hover:bg-[#1b2d3f] border border-[#233547] text-slate-300 font-mono text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
            <span>{isChecking ? 'Probing...' : 'Probe Local Daemon'}</span>
          </button>

          {isConnected && (
            <button
              onClick={handleDisconnect}
              className="px-3.5 py-2 rounded-lg bg-red-950/30 hover:bg-red-900/40 border border-red-500/40 text-red-300 font-mono text-xs transition-colors"
            >
              Disconnect
            </button>
          )}
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#0a0f14] border border-[#1b2734] font-mono text-xs">
        <button
          onClick={() => { soundEffects.playKeyClick(); setActiveTab('console'); }}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
            activeTab === 'console'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal className="w-4 h-4 text-purple-400" />
          <span>Interactive Execution Console</span>
        </button>

        <button
          onClick={() => { soundEffects.playKeyClick(); setActiveTab('setup'); }}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
            activeTab === 'setup'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCode className="w-4 h-4 text-emerald-400" />
          <span>Setup Guide & Daemon Script</span>
        </button>

        <button
          onClick={() => { soundEffects.playKeyClick(); setActiveTab('audit'); }}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
            activeTab === 'audit'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-4 h-4 text-amber-400" />
          <span>Security Audit Trail ({auditLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: INTERACTIVE CONSOLE */}
      {activeTab === 'console' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Configuration & Command Formulation Column */}
          <div className="lg:col-span-5 space-y-4">
            {/* Quick Command Selector */}
            <div className="p-4 rounded-xl bg-[#0c1218] border border-[#1b2634] space-y-3">
              <h3 className="text-xs font-mono text-emerald-400 uppercase font-bold tracking-wider flex items-center gap-2">
                <Zap className="w-3.5 h-3.5" />
                <span>Verified Diagnostic Presets</span>
              </h3>
              <div className="space-y-1.5">
                {sampleSafeCommands.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      soundEffects.playKeyClick();
                      setSelectedCommand(item.cmd);
                      setUserConfirmed(false);
                    }}
                    className="w-full text-left p-2.5 rounded-lg bg-[#080d12] hover:bg-[#121c27] border border-[#172330] hover:border-emerald-500/30 transition-all text-xs font-mono"
                  >
                    <span className="text-slate-200 block font-semibold">{item.title}</span>
                    <span className="text-emerald-400 text-[11px] truncate block">$ {item.cmd}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Target & Command Input Form */}
            <div className="p-4 rounded-xl bg-[#0c1218] border border-[#1b2634] space-y-3.5">
              <h3 className="text-xs font-mono text-purple-400 uppercase font-bold tracking-wider">
                Command Dispatch Parameters
              </h3>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-400 block">Authorized Lab Target</label>
                <input
                  type="text"
                  value={targetHost}
                  onChange={(e) => setTargetHost(e.target.value)}
                  placeholder="127.0.0.1 or 192.168.56.X"
                  className="w-full bg-[#080d12] border border-[#1b2634] rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-hidden focus:border-purple-500/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-400 block">Command String to Run</label>
                <textarea
                  rows={3}
                  value={selectedCommand}
                  onChange={(e) => {
                    setSelectedCommand(e.target.value);
                    setUserConfirmed(false);
                  }}
                  placeholder="nmap -sS -p 22,80 127.0.0.1"
                  className="w-full bg-[#080d12] border border-[#1b2634] rounded-lg p-2.5 text-xs font-mono text-emerald-300 focus:outline-hidden focus:border-purple-500/40"
                />
              </div>

              {/* Explicit User Confirmation Checkbox (PART 4 REQUIREMENT) */}
              <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/40 space-y-2">
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="userConfirmCheck"
                    checked={userConfirmed}
                    onChange={(e) => {
                      soundEffects.playKeyClick();
                      setUserConfirmed(e.target.checked);
                    }}
                    className="mt-0.5 rounded border-amber-500 text-purple-500 focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="userConfirmCheck" className="text-xs font-mono text-amber-200 cursor-pointer select-none">
                    <strong className="block text-amber-300">Mandatory Human Approval</strong>
                    I explicitly inspect and authorize execution of this exact command against the specified target.
                  </label>
                </div>
              </div>

              {/* Run Command Button */}
              <button
                onClick={handleExecuteCommand}
                disabled={!userConfirmed || isExecuting}
                className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/15"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{isExecuting ? 'Executing in Sandbox...' : 'Approve & Execute Command'}</span>
              </button>
            </div>
          </div>

          {/* Right Live Terminal Stream View */}
          <div className="lg:col-span-7 flex flex-col space-y-3">
            <div className="flex-1 rounded-xl bg-[#080d12] border border-[#1b2634] p-4 flex flex-col font-mono text-xs cyber-glow min-h-[380px]">
              {/* Terminal Title Bar */}
              <div className="flex items-center justify-between border-b border-[#16212b] pb-2.5 mb-3 text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                  <span className="text-[11px] text-slate-300 font-bold ps-1">
                    kali@virtualbox:~$ {selectedCommand.split(' ')[0]}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {exitCode !== null && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded border ${
                        exitCode === 0
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : 'bg-red-500/15 text-red-400 border-red-500/30'
                      }`}
                    >
                      Exit Code: {exitCode}
                    </span>
                  )}
                  <span className="text-[10px] text-slate-500">
                    {isSimulated ? '(Simulated Output)' : '(Live Kali Daemon Output)'}
                  </span>
                </div>
              </div>

              {/* Terminal Output Body */}
              <pre className="flex-1 overflow-x-auto text-emerald-300 whitespace-pre-wrap leading-relaxed select-text font-mono text-[11px]">
                {terminalOutput || (
                  <span className="text-slate-600">
                    Terminal idle. Select a command preset, check the mandatory approval box, and click
                    &quot;Approve &amp; Execute Command&quot; to inspect output.
                  </span>
                )}
              </pre>

              {/* Terminal Footer Info */}
              <div className="pt-2 mt-2 border-t border-[#141e28] flex items-center justify-between text-[10px] text-slate-500">
                <span>Safe Sandbox Constraint: 15s execution timeout enforced</span>
                <span>Connection: {isConnected ? 'Live Localhost Bridge' : 'Offline Preview Mode'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SETUP GUIDE & DAEMON SCRIPT */}
      {activeTab === 'setup' && (
        <div className="p-5 rounded-xl bg-[#0c1218] border border-[#1b2634] space-y-4 font-mono text-xs">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-100">
              How to Connect RAFAY HACKING LAB to Your Local VirtualBox Kali VM
            </h3>
            <p className="text-slate-400 text-xs font-sans">
              Browsers are sandboxed and cannot directly execute local shell commands. To safely enable live command
              execution from this interface into your Kali Linux VM, start our lightweight Python companion daemon.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-lg bg-[#080d12] border border-[#182533] space-y-2">
              <span className="text-emerald-400 font-bold block">1. Save Script to Kali VM</span>
              <p className="text-slate-400 font-sans text-xs">
                Copy the file <code className="text-purple-300">kali-bridge-daemon.py</code> into your Kali Linux home directory.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#080d12] border border-[#182533] space-y-2">
              <span className="text-emerald-400 font-bold block">2. Run Local Daemon</span>
              <p className="text-slate-400 font-sans text-xs">
                Execute in your Kali terminal: <code className="text-emerald-300">python3 kali-bridge-daemon.py</code>
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#080d12] border border-[#182533] space-y-2">
              <span className="text-emerald-400 font-bold block">3. Click Probe & Pair</span>
              <p className="text-slate-400 font-sans text-xs">
                Verify the status indicator turns green to execute user-approved commands in your Kali VM.
              </p>
            </div>
          </div>

          {/* Daemon Script Box */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-bold">Companion Daemon Source (kali-bridge-daemon.py)</span>
              <button
                onClick={() => handleCopy('python3 kali-bridge-daemon.py --token "kali-lab-secret-2026"')}
                className="px-2.5 py-1 rounded bg-[#14202c] hover:bg-[#1b2d3f] border border-[#233547] text-slate-300 text-xs flex items-center gap-1"
              >
                {copiedText?.includes('kali-bridge-daemon') ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Launch Command</span>
              </button>
            </div>

            <div className="p-3.5 rounded-lg bg-[#080d12] border border-[#16212b] text-slate-300 font-mono text-[11px] overflow-x-auto space-y-1">
              <div className="text-slate-500"># Start daemon inside your Kali Linux terminal:</div>
              <div className="text-emerald-400">$ chmod +x kali-bridge-daemon.py</div>
              <div className="text-emerald-400">$ python3 kali-bridge-daemon.py --token &quot;kali-lab-secret-2026&quot;</div>
            </div>
          </div>

          {/* Security & Isolation Callout */}
          <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-2">
            <h4 className="text-purple-300 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero-Exposure Architectural Guarantee</span>
            </h4>
            <p className="text-slate-300 text-xs font-sans leading-relaxed">
              The companion daemon binds strictly to <code className="text-emerald-300">127.0.0.1</code> and rejects all
              external interface connections. Destructive operating system commands (<code className="text-red-400">rm -rf</code>,{' '}
              <code className="text-red-400">mkfs</code>, disk overrides) are intercepted and rejected at the daemon layer.
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div className="p-5 rounded-xl bg-[#0c1218] border border-[#1b2634] space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-100">
              Approved Command Audit Log
            </h3>
            <span className="text-slate-400 text-xs">
              Every execution requires manual user consent before recording.
            </span>
          </div>

          {auditLogs.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-[#080d12] border border-[#182533] space-y-1 text-slate-400">
              <p>No commands executed during this session yet.</p>
              <p className="text-slate-500 text-[11px]">
                Executed commands and return codes will be permanently logged here for accountability.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-lg bg-[#080d12] border border-[#16212b] flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold">$ {log.command}</span>
                      <span className="text-[10px] text-slate-500">[{log.timestamp}]</span>
                    </div>
                    <span className="text-slate-400 text-[11px] block">Target: {log.target}</span>
                  </div>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded border ${
                      log.exitCode === 0
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : 'bg-red-500/15 text-red-400 border-red-500/30'
                    }`}
                  >
                    Exit {log.exitCode}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
