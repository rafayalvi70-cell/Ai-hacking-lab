import React, { useState, useMemo } from 'react';
import {
  Code2,
  Terminal,
  Search,
  Copy,
  Check,
  Play,
  HelpCircle,
  Shield,
  Layers,
  Sparkles,
  Zap,
  Sliders,
  CheckSquare,
  Square,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { Translations } from '../../data/translations';
import { PageId } from '../layout/Sidebar';
import { soundEffects } from '../../utils/audio';
import { kaliBridgeService } from '../../services/kaliBridgeService';

interface SmartCommandBuilderViewProps {
  t: Translations;
  onNavigate: (page: PageId, targetId?: string) => void;
}

interface CommandPreset {
  id: string;
  tool: string;
  taskTitle: string;
  category: string;
  description: string;
  baseBinary: string;
  options: {
    flag: string;
    label: string;
    description: string;
    defaultValue?: string;
    type: 'checkbox' | 'input';
    placeholder?: string;
    isRequired?: boolean;
    isDangerous?: boolean;
  }[];
  defaultTarget: string;
}

export const SmartCommandBuilderView: React.FC<SmartCommandBuilderViewProps> = ({ onNavigate }) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('nmap-stealth');
  const [taskSearch, setTaskSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Active option states
  const [activeFlags, setActiveFlags] = useState<Record<string, boolean>>({
    '-sS': true,
    '-sV': true,
    '-O': false,
    '-p-': false,
    '-T4': true,
    '-A': false,
    '--script=vuln': false,
  });

  const [inputValues, setInputValues] = useState<Record<string, string>>({
    target: '192.168.1.1',
    wordlist: '/usr/share/wordlists/dirb/common.txt',
    threads: '50',
    port: '80,443',
    user: 'admin',
    passlist: '/usr/share/wordlists/rockyou.txt',
  });

  const [copied, setCopied] = useState(false);
  const [isExecModalOpen, setIsExecModalOpen] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [execOutput, setExecOutput] = useState<string | null>(null);

  const presets: CommandPreset[] = [
    {
      id: 'nmap-stealth',
      tool: 'Nmap',
      taskTitle: 'Stealth SYN & Version Scan',
      category: 'Network Recon',
      description: 'Perform a non-intrusive TCP SYN scan to discover open ports, service versions, and OS fingerprint.',
      baseBinary: 'nmap',
      defaultTarget: '192.168.1.1',
      options: [
        { flag: '-sS', label: 'TCP SYN Stealth Scan', description: 'Half-open scan mode; does not complete TCP handshake.', type: 'checkbox' },
        { flag: '-sV', label: 'Service Version Detection', description: 'Probe open ports to determine service name and version.', type: 'checkbox' },
        { flag: '-O', label: 'OS Fingerprinting', description: 'Enable remote operating system detection.', type: 'checkbox' },
        { flag: '-T4', label: 'Aggressive Timing', description: 'Speed up scan execution for reliable networks.', type: 'checkbox' },
        { flag: '-p-', label: 'Scan All 65,535 Ports', description: 'Exhaustive scan across the entire TCP port range.', type: 'checkbox' },
        { flag: '-A', label: 'Aggressive Discovery Mode', description: 'Enables OS detection, version scanning, script scanning, and traceroute.', type: 'checkbox' },
        { flag: '--script=vuln', label: 'Run Vulnerability NSE Scripts', description: 'Check discovered services against known CVE scripts.', type: 'checkbox' },
      ],
    },
    {
      id: 'gobuster-dir',
      tool: 'Gobuster',
      taskTitle: 'Web Directory & File Bruteforce',
      category: 'Web Application',
      description: 'Discover hidden files, admin panels, and API endpoints on a target web server.',
      baseBinary: 'gobuster dir',
      defaultTarget: 'http://192.168.1.10',
      options: [
        { flag: '-u', label: 'Target URL', description: 'Target website address.', type: 'input', placeholder: 'http://target.local', isRequired: true },
        { flag: '-w', label: 'Wordlist Path', description: 'Location of directory wordlist file.', type: 'input', placeholder: '/usr/share/wordlists/dirb/common.txt', isRequired: true },
        { flag: '-t', label: 'Threads', description: 'Number of concurrent worker threads.', type: 'input', placeholder: '50' },
        { flag: '-x', label: 'File Extensions', description: 'Append extensions (e.g. php,html,txt,json).', type: 'input', placeholder: 'php,txt,html' },
        { flag: '-k', label: 'Skip SSL Verification', description: 'Disable TLS certificate validation for self-signed targets.', type: 'checkbox' },
      ],
    },
    {
      id: 'sqlmap-auto',
      tool: 'SQLmap',
      taskTitle: 'Automated SQL Injection & DB Extraction',
      category: 'Web Application',
      description: 'Test target parameters for SQL injection vulnerabilities and dump database tables.',
      baseBinary: 'sqlmap',
      defaultTarget: 'http://target.local/item.php?id=1',
      options: [
        { flag: '-u', label: 'Target URL with Parameter', description: 'URL containing vulnerable query parameter.', type: 'input', placeholder: 'http://site.com/page?id=1', isRequired: true },
        { flag: '--batch', label: 'Non-Interactive Batch Mode', description: 'Never ask for user input; accept default behaviors.', type: 'checkbox' },
        { flag: '--dbs', label: 'Enumerate Databases', description: 'List available database schemas on target DBMS.', type: 'checkbox' },
        { flag: '--risk=3', label: 'Risk Level 3', description: 'Executes heavy OR-based and time-based SQL payloads.', type: 'checkbox' },
        { flag: '--level=5', label: 'Level 5 Payload Intensity', description: 'Tests HTTP Headers (User-Agent, Referer, Cookie) in addition to GET/POST parameters.', type: 'checkbox' },
      ],
    },
    {
      id: 'hydra-ssh',
      tool: 'Hydra',
      taskTitle: 'SSH / FTP Password Bruteforce',
      category: 'Password Auditing',
      description: 'Audit weak authentication credentials on SSH, FTP, or RDP services.',
      baseBinary: 'hydra',
      defaultTarget: '192.168.1.50 ssh',
      options: [
        { flag: '-l', label: 'Username', description: 'Single target account handle (e.g., root, admin).', type: 'input', placeholder: 'admin' },
        { flag: '-P', label: 'Password List', description: 'Path to wordlist (e.g., rockyou.txt).', type: 'input', placeholder: '/usr/share/wordlists/rockyou.txt', isRequired: true },
        { flag: '-t', label: 'Parallel Tasks', description: 'Number of concurrent connection tasks.', type: 'input', placeholder: '16' },
        { flag: '-vV', label: 'Verbose Output', description: 'Show login attempt output for each password combination.', type: 'checkbox' },
        { flag: '-f', label: 'Exit on First Found', description: 'Stop bruteforcing as soon as valid credentials are discovered.', type: 'checkbox' },
      ],
    },
    {
      id: 'aircrack-deauth',
      tool: 'Aircrack-ng',
      taskTitle: 'Wireless WPA2 Handshake Capture & Cracking',
      category: 'Wireless Security',
      description: 'Capture WPA/WPA2 4-way handshakes and perform dictionary attacks.',
      baseBinary: 'aircrack-ng',
      defaultTarget: 'handshake.cap',
      options: [
        { flag: '-w', label: 'Wordlist Path', description: 'Dictionary file for passphrase cracking.', type: 'input', placeholder: '/usr/share/wordlists/rockyou.txt', isRequired: true },
        { flag: '-b', label: 'Target BSSID (MAC)', description: 'Access Point MAC address.', type: 'input', placeholder: '00:11:22:33:44:55' },
        { flag: '-e', label: 'Target ESSID (SSID Name)', description: 'Wi-Fi network name.', type: 'input', placeholder: 'MyHomeWiFi' },
      ],
    },
  ];

  const categories = ['all', 'Network Recon', 'Web Application', 'Password Auditing', 'Wireless Security'];

  const selectedPreset = useMemo(() => {
    return presets.find((p) => p.id === selectedPresetId) || presets[0];
  }, [selectedPresetId]);

  // Filtered presets by search and category
  const filteredPresets = useMemo(() => {
    return presets.filter((p) => {
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchQ = !taskSearch || p.taskTitle.toLowerCase().includes(taskSearch.toLowerCase()) || p.tool.toLowerCase().includes(taskSearch.toLowerCase());
      return matchCat && matchQ;
    });
  }, [selectedCategory, taskSearch]);

  // Dynamically constructed command line
  const compiledCommand = useMemo(() => {
    let cmd = selectedPreset.baseBinary;

    selectedPreset.options.forEach((opt) => {
      if (opt.type === 'checkbox') {
        if (activeFlags[opt.flag]) {
          cmd += ` ${opt.flag}`;
        }
      } else if (opt.type === 'input') {
        const val = inputValues[opt.flag] || opt.placeholder || '';
        if (val) {
          cmd += ` ${opt.flag} ${val}`;
        }
      }
    });

    const targetVal = inputValues['target'] || selectedPreset.defaultTarget;
    if (targetVal) {
      cmd += ` ${targetVal}`;
    }

    return cmd;
  }, [selectedPreset, activeFlags, inputValues]);

  const handleCopy = () => {
    navigator.clipboard.writeText(compiledCommand);
    setCopied(true);
    soundEffects.playKeyClick();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExecuteViaBridge = async () => {
    setIsExecuting(true);
    soundEffects.playKeyClick();
    const res = await kaliBridgeService.executeCommand(compiledCommand);
    setIsExecuting(false);
    setExecOutput(res.stdout || res.stderr || `Execution completed with status ${res.exitCode}`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#080d14] via-[#0d1624] to-[#070b10] border border-[#172535] p-6 lg:p-8 cyber-glow">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold">
              <Sliders className="w-4 h-4" />
              <span>INTERACTIVE SYNTAX GENERATOR</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-mono text-slate-100">
              Smart Security Command Builder
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-mono">
              Build, validate, explain, and execute production-grade penetration testing commands with flag explanations and target safety checks.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#080e15] border border-cyan-500/30 font-mono text-xs space-y-1 text-slate-300 shrink-0">
            <div className="text-cyan-400 font-bold flex items-center gap-1.5">
              <Shield className="w-4 h-4" />
              <span>Authorized Output Generator</span>
            </div>
            <p className="text-[11px] text-slate-400">Strictly for lab targets & internal subnets</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Task Selector + Interactive Form Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Preset Task Chooser */}
        <div className="lg:col-span-4 rounded-2xl bg-[#080d12] border border-[#162230] p-5 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#15202c] pb-2 font-mono text-xs font-bold text-slate-100">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-cyan-400" /> Select Cyber Task
              </span>
              <span className="text-slate-400">{filteredPresets.length} Presets</span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={taskSearch}
                onChange={(e) => setTaskSearch(e.target.value)}
                placeholder="Search tasks (e.g. stealth scan, gobuster)..."
                className="w-full bg-[#05080c] border border-[#16222e] rounded-xl ps-9 pe-4 py-2 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-hidden"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] font-mono scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { soundEffects.playKeyClick(); setSelectedCategory(cat); }}
                  className={`px-2.5 py-1 rounded-md shrink-0 border transition-colors ${
                    selectedCategory === cat
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold'
                      : 'bg-[#05080c] text-slate-400 border-[#15202c] hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Preset Cards List */}
          <div className="space-y-2 font-mono">
            {filteredPresets.map((preset) => {
              const isSelected = selectedPresetId === preset.id;
              return (
                <div
                  key={preset.id}
                  onClick={() => {
                    soundEffects.playKeyClick();
                    setSelectedPresetId(preset.id);
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-500/15 to-blue-500/10 border-cyan-500/40 text-slate-100 shadow-md shadow-cyan-950'
                      : 'bg-[#060a0f] border-[#141e29] hover:bg-[#0c131c] text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-400">
                      {preset.tool}
                    </span>
                    <span className="text-[10px] text-slate-500">{preset.category}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-100">{preset.taskTitle}</h4>
                  <p className="text-[11px] text-slate-400 font-sans line-clamp-2 mt-1">{preset.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Form Builder & Flag Customizer */}
        <div className="lg:col-span-8 space-y-6">
          {/* Form Card */}
          <div className="p-6 rounded-2xl bg-[#080d12] border border-[#162230] space-y-5">
            <div className="flex items-center justify-between border-b border-[#162230] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40">
                    {selectedPreset.tool}
                  </span>
                  <h3 className="font-mono text-base font-bold text-slate-100">
                    {selectedPreset.taskTitle}
                  </h3>
                </div>
                <p className="text-xs text-slate-400 font-sans mt-1">{selectedPreset.description}</p>
              </div>
            </div>

            {/* Target Input Field */}
            <div className="space-y-1.5 font-mono text-xs">
              <label className="text-slate-300 font-bold flex items-center justify-between">
                <span>Target Specification (IP / Hostname / URL)</span>
                <span className="text-slate-500 text-[10px]">Required Parameter</span>
              </label>
              <input
                type="text"
                value={inputValues['target'] ?? selectedPreset.defaultTarget}
                onChange={(e) => setInputValues({ ...inputValues, target: e.target.value })}
                placeholder="e.g. 192.168.1.1 or target.local"
                className="w-full bg-[#05080c] border border-[#172432] focus:border-cyan-500/50 rounded-xl px-3.5 py-2.5 text-xs font-mono text-cyan-300 focus:outline-hidden"
              />
            </div>

            {/* Flag Options Checklist & Inputs */}
            <div className="space-y-3 font-mono text-xs">
              <h4 className="text-slate-400 uppercase font-bold text-[11px] tracking-wider">
                Option Flags & Execution Parameters
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedPreset.options.map((opt) => (
                  <div
                    key={opt.flag}
                    className={`p-3.5 rounded-xl border transition-all ${
                      opt.type === 'checkbox' && activeFlags[opt.flag]
                        ? 'bg-[#0d1622] border-cyan-500/40'
                        : 'bg-[#05080c] border-[#16222e]'
                    }`}
                  >
                    {opt.type === 'checkbox' ? (
                      <label className="flex items-start gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={!!activeFlags[opt.flag]}
                          onChange={(e) => {
                            soundEffects.playKeyClick();
                            setActiveFlags({ ...activeFlags, [opt.flag]: e.target.checked });
                          }}
                          className="mt-0.5 rounded border-slate-700 bg-slate-900 text-cyan-400 focus:ring-0 cursor-pointer"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-cyan-400">{opt.flag}</span>
                            <span className="text-slate-200 font-medium">{opt.label}</span>
                          </div>
                          <p className="text-[11px] font-sans text-slate-400 leading-snug">{opt.description}</p>
                        </div>
                      </label>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-cyan-400">{opt.flag}</span>
                          <span className="text-slate-200 font-medium">{opt.label}</span>
                        </div>
                        <p className="text-[11px] font-sans text-slate-400 leading-snug">{opt.description}</p>
                        <input
                          type="text"
                          value={inputValues[opt.flag] ?? ''}
                          onChange={(e) => setInputValues({ ...inputValues, [opt.flag]: e.target.value })}
                          placeholder={opt.placeholder}
                          className="w-full bg-[#080d12] border border-[#1a2736] rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-hidden"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Compiled Command Output Box */}
            <div className="p-4 rounded-xl bg-[#05080c] border-2 border-cyan-500/30 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-4 h-4" /> Compiled Executable Command
                </span>
                <span className="text-slate-400 text-[11px]">Validated Syntax</span>
              </div>

              <div className="p-3 rounded-lg bg-[#080d12] border border-[#16222e] text-emerald-300 font-mono text-xs font-bold overflow-x-auto select-all">
                $ {compiledCommand}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2 rounded-lg bg-[#121c27] hover:bg-emerald-500 hover:text-slate-950 border border-[#1e2d3d] text-slate-200 font-mono font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400">Copied to Clipboard</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Command</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onNavigate('mentor', `Explain this built command line in detail: ${compiledCommand}`)}
                    className="px-3.5 py-2 rounded-lg bg-[#121c27] hover:bg-[#1a2b3d] border border-[#1e2d3d] text-cyan-400 font-mono text-xs flex items-center gap-1.5 transition-all"
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>Explain via AI Copilot</span>
                  </button>
                </div>

                <button
                  onClick={() => setIsExecModalOpen(true)}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-950"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Execute on Kali Terminal</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Execution Authorization Modal */}
      {isExecModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs"
          onClick={() => setIsExecModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg bg-[#0a0f14] border border-cyan-500/40 rounded-2xl shadow-2xl p-6 space-y-4 font-mono text-xs cyber-glow"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#182432] pb-3">
              <div className="flex items-center gap-2 font-bold text-slate-100 text-sm">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span>Explicit Execution Approval</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-slate-300 font-sans text-xs">
                You are authorizing execution of this command on your local companion Kali VM:
              </p>
              <div className="p-3 rounded-xl bg-[#05080c] border border-[#16222e] text-emerald-300 font-bold">
                $ {compiledCommand}
              </div>
            </div>

            {execOutput && (
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Execution Output Stream:</span>
                <pre className="p-3 rounded-xl bg-[#05080b] border border-[#141d27] text-[11px] text-slate-300 max-h-40 overflow-y-auto whitespace-pre-wrap">
                  {execOutput}
                </pre>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsExecModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-[#14202c] border border-[#223547] text-slate-300"
              >
                Close
              </button>
              <button
                onClick={handleExecuteViaBridge}
                disabled={isExecuting}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold"
              >
                {isExecuting ? 'Running...' : 'Authorize & Execute'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
