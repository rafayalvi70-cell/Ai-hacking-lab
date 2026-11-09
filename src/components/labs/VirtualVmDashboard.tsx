import React, { useState, useEffect } from 'react';
import {
  Server,
  Monitor,
  CheckCircle2,
  XCircle,
  Play,
  Square,
  RotateCcw,
  ExternalLink,
  Terminal,
  RefreshCw,
  Cpu,
  Layers,
  FileText,
  AlertTriangle,
  Info,
  ChevronRight,
  Copy,
  Check,
  Shield,
  Zap,
  HardDrive,
  Trash2,
  X,
  BookOpen,
  Lock,
} from 'lucide-react';
import { Translations } from '../../data/translations';
import { PageId } from '../layout/Sidebar';
import { kaliBridgeService } from '../../services/kaliBridgeService';
import { soundEffects } from '../../utils/audio';

interface VirtualVmDashboardProps {
  t: Translations;
  onNavigate: (page: PageId, targetId?: string) => void;
}

interface DockerStatusResponse {
  available: boolean;
  daemonRunning: boolean;
  version?: string;
  message?: string;
  labs: {
    'juice-shop': {
      status: 'Online' | 'Offline';
      port: number;
      url: string;
      containerName: string;
    };
    dvwa: {
      status: 'Online' | 'Offline';
      port: number;
      url: string;
      containerName: string;
    };
    webgoat: {
      status: 'Online' | 'Offline';
      port: number;
      url: string;
      containerName: string;
    };
  };
}

interface GuidedStep {
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  targetUrl: string;
  commandSuggestion?: string;
  payloadExample?: string;
  remediationNote: string;
}

const JUICE_SHOP_STEPS: GuidedStep[] = [
  {
    title: '1. Reconnaissance & Hidden Score Board',
    category: 'Information Gathering',
    difficulty: 'Beginner',
    description: 'Find the hidden Score Board URL by inspecting client-side SPA bundle routes or testing path variations.',
    targetUrl: 'http://127.0.0.1:3001/#/score-board',
    commandSuggestion: 'gobuster dir -u http://127.0.0.1:3001 -w /usr/share/wordlists/dirb/common.txt',
    payloadExample: '/#/score-board',
    remediationNote: 'Disable client-side exposes of admin routes; implement proper route authentication middleware.',
  },
  {
    title: '2. SQL Injection Admin Auth Bypass',
    category: 'Injection Vulnerabilities',
    difficulty: 'Beginner',
    description: 'Bypass the login screen to sign into the Administrator account without knowing the password.',
    targetUrl: 'http://127.0.0.1:3001/#/login',
    commandSuggestion: 'sqlmap -u "http://127.0.0.1:3001/rest/user/login" --data=\'{"email":"","password":""}\'',
    payloadExample: "' OR 1=1 --",
    remediationNote: 'Use parameterized SQL queries / ORM prepared statements instead of string concatenation.',
  },
  {
    title: '3. DOM-Based Cross-Site Scripting (XSS)',
    category: 'Cross-Site Scripting',
    difficulty: 'Intermediate',
    description: 'Inject an arbitrary JavaScript payload into the search input box to execute script in victim context.',
    targetUrl: 'http://127.0.0.1:3001/#/search',
    payloadExample: '<iframe src="javascript:alert(`RH_JUICE_XSS`)">',
    remediationNote: 'Sanitize dynamic input with DOMPurify and set Content-Security-Policy (CSP) headers.',
  },
  {
    title: '4. Sensitive File Exposure & Backup Leak',
    category: 'Security Misconfiguration',
    difficulty: 'Intermediate',
    description: 'Examine public FTP directories and retrieve sensitive coupon file backups.',
    targetUrl: 'http://127.0.0.1:3001/ftp',
    commandSuggestion: 'curl -s http://127.0.0.1:3001/ftp/coupons_2013.md.bak',
    remediationNote: 'Restrict public web server access to backup files and enforce strict directory indexing rules.',
  },
];

const DVWA_STEPS: GuidedStep[] = [
  {
    title: '1. Command Injection (Low Security)',
    category: 'Command Execution',
    difficulty: 'Beginner',
    description: 'Inject shell commands into the IP ping form to list system files and read environment secrets.',
    targetUrl: 'http://127.0.0.1:8080/vulnerabilities/exec/',
    payloadExample: '127.0.0.1; cat /etc/passwd',
    commandSuggestion: 'curl -d "ip=127.0.0.1%3B+cat+%2Fetc%2Fpasswd&Submit=Submit" http://127.0.0.1:8080/vulnerabilities/exec/',
    remediationNote: 'Avoid shell execution helpers like system() or exec(); use strict validation (escapeshellarg) or structured APIs.',
  },
  {
    title: '2. SQL Injection & User Database Dump',
    category: 'Database Exploitation',
    difficulty: 'Intermediate',
    description: 'Exploit the user ID lookup parameter to extract hashed password credentials from the database.',
    targetUrl: 'http://127.0.0.1:8080/vulnerabilities/sqli/',
    payloadExample: "%' UNION SELECT null, concat(user, ':', password) FROM users #",
    commandSuggestion: 'sqlmap -u "http://127.0.0.1:8080/vulnerabilities/sqli/?id=1&Submit=Submit" --cookie="PHPSESSID=...; security=low"',
    remediationNote: 'Always enforce prepared statements via PDO or MySQLi parameterized queries.',
  },
  {
    title: '3. Unrestricted File Upload Bypass',
    category: 'File Upload Flaws',
    difficulty: 'Intermediate',
    description: 'Bypass client and server file type restrictions to upload a PHP web shell to the server.',
    targetUrl: 'http://127.0.0.1:8080/vulnerabilities/upload/',
    payloadExample: 'shell.php -> Content-Type: image/jpeg',
    remediationNote: 'Rename uploaded files with random UUIDs, validate file mime headers, and store outside web root.',
  },
  {
    title: '4. Stored XSS (Guestbook Injection)',
    category: 'Cross-Site Scripting',
    difficulty: 'Beginner',
    description: 'Store a malicious JavaScript script in the Guestbook message field that executes for all subsequent visitors.',
    targetUrl: 'http://127.0.0.1:8080/vulnerabilities/xss_s/',
    payloadExample: '<script>document.body.innerHTML="<h1>DEFACED BY RH LAB</h1>"</script>',
    remediationNote: 'Encode HTML entities with htmlspecialchars() before rendering stored output.',
  },
];

const WEBGOAT_STEPS: GuidedStep[] = [
  {
    title: '1. WebGoat Authentication & Trainee Setup',
    category: 'Access Control',
    difficulty: 'Beginner',
    description: 'Register a local trainee account in OWASP WebGoat and access Java security lesson modules.',
    targetUrl: 'http://127.0.0.1:8088/WebGoat/login',
    payloadExample: 'username: student | password: RH_Goat_Password_2026',
    remediationNote: 'Enforce strong password policy requirements and salt user hashes with Argon2id.',
  },
  {
    title: '2. Java Parameterized Query Defenses',
    category: 'Secure Coding',
    difficulty: 'Intermediate',
    description: 'Learn how Java PreparedStatement prevents SQL injection compared to string concatenation.',
    targetUrl: 'http://127.0.0.1:8088/WebGoat/start.mvc#lesson/SqlInjection.lesson/3',
    commandSuggestion: 'PreparedStatement stmt = connection.prepareStatement("SELECT * FROM users WHERE userid = ?");',
    payloadExample: 'stmt.setString(1, userId);',
    remediationNote: 'Always use parameterized PreparedStatement binding for database queries.',
  },
  {
    title: '3. Cross-Site Scripting (XSS) Mitigation',
    category: 'Input Validation',
    difficulty: 'Intermediate',
    description: 'Practice identifying reflected XSS parameters and encoding HTML entities in Java servlets.',
    targetUrl: 'http://127.0.0.1:8088/WebGoat/start.mvc#lesson/CrossSiteScripting.lesson/1',
    payloadExample: '<script>alert(document.cookie)</script>',
    remediationNote: 'Use OWASP Java Encoder (Encode.forHtml) before outputting user input in JSP/servlets.',
  },
  {
    title: '4. Insecure Direct Object References (IDOR)',
    category: 'Broken Authorization',
    difficulty: 'Intermediate',
    description: 'Manipulate profile account ID parameters to test authorization checks across user sessions.',
    targetUrl: 'http://127.0.0.1:8088/WebGoat/start.mvc#lesson/IDOR.lesson/2',
    payloadExample: 'GET /WebGoat/service/profile/10002 -> IDOR lookup',
    remediationNote: 'Validate server-side session identity against target profile IDs for every request.',
  },
];

export const VirtualVmDashboard: React.FC<VirtualVmDashboardProps> = ({ onNavigate }) => {
  const [isDaemonConnected, setIsDaemonConnected] = useState(false);
  const [isCheckingDaemon, setIsCheckingDaemon] = useState(false);
  const [dockerStatus, setDockerStatus] = useState<DockerStatusResponse | null>(null);
  const [isLoadingDocker, setIsLoadingDocker] = useState(false);
  const [activeTab, setActiveTab] = useState<'docker' | 'topology' | 'guides'>('docker');
  const [selectedLabGuide, setSelectedLabGuide] = useState<'juice-shop' | 'dvwa' | 'webgoat'>('juice-shop');
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Modals state
  const [logModalContainer, setLogModalContainer] = useState<{ labId: 'juice-shop' | 'dvwa' | 'webgoat'; name: string } | null>(null);
  const [containerLogs, setContainerLogs] = useState<string>('');
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  const [resetConfirmLab, setResetConfirmLab] = useState<{ labId: 'juice-shop' | 'dvwa' | 'webgoat'; name: string } | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const checkDaemon = async () => {
    setIsCheckingDaemon(true);
    soundEffects.playKeyClick();
    const live = await kaliBridgeService.checkHealth();
    setIsDaemonConnected(live);
    setIsCheckingDaemon(false);
  };

  const checkDockerStatus = async () => {
    setIsLoadingDocker(true);
    try {
      const res = await fetch('/api/docker/status');
      if (res.ok) {
        const data: DockerStatusResponse = await res.json();
        setDockerStatus(data);
      }
    } catch {
      setDockerStatus({
        available: false,
        daemonRunning: false,
        message: 'Could not communicate with local Express server for Docker status.',
        labs: {
          'juice-shop': { status: 'Offline', port: 3001, url: 'http://127.0.0.1:3001', containerName: 'rh_juice_shop_lab' },
          dvwa: { status: 'Offline', port: 8080, url: 'http://127.0.0.1:8080', containerName: 'rh_dvwa_lab' },
          webgoat: { status: 'Offline', port: 8088, url: 'http://127.0.0.1:8088', containerName: 'rh_webgoat_lab' },
        },
      });
    } finally {
      setIsLoadingDocker(false);
    }
  };

  useEffect(() => {
    checkDaemon();
    checkDockerStatus();
  }, []);

  const handleStartLab = async (labId: 'juice-shop' | 'dvwa' | 'webgoat') => {
    soundEffects.playKeyClick();
    setIsLoadingDocker(true);
    setActionMessage({ text: `Launching container for ${labId}...`, type: 'info' });
    try {
      const res = await fetch('/api/docker/start-lab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ labId }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage({ text: data.message, type: 'success' });
        soundEffects.playSuccess();
      } else {
        setActionMessage({ text: data.error || 'Failed to start lab.', type: 'error' });
      }
    } catch (err: unknown) {
      const e = err as Error;
      setActionMessage({ text: e.message || 'Error connecting to Docker server endpoint.', type: 'error' });
    } finally {
      await checkDockerStatus();
    }
  };

  const handleStopLab = async (labId: 'juice-shop' | 'dvwa' | 'webgoat') => {
    soundEffects.playKeyClick();
    setIsLoadingDocker(true);
    setActionMessage({ text: `Stopping container for ${labId}...`, type: 'info' });
    try {
      const res = await fetch('/api/docker/stop-lab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ labId }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage({ text: data.message, type: 'success' });
      } else {
        setActionMessage({ text: data.error || 'Failed to stop lab.', type: 'error' });
      }
    } catch (err: unknown) {
      const e = err as Error;
      setActionMessage({ text: e.message || 'Error executing stop lab action.', type: 'error' });
    } finally {
      await checkDockerStatus();
    }
  };

  const handleResetLab = async () => {
    if (!resetConfirmLab) return;
    setIsResetting(true);
    soundEffects.playKeyClick();
    try {
      const res = await fetch('/api/docker/reset-lab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ labId: resetConfirmLab.labId }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage({ text: data.message, type: 'success' });
        soundEffects.playSuccess();
      } else {
        setActionMessage({ text: data.error || 'Failed to reset lab.', type: 'error' });
      }
    } catch (err: unknown) {
      const e = err as Error;
      setActionMessage({ text: e.message || 'Error resetting lab container.', type: 'error' });
    } finally {
      setIsResetting(false);
      setResetConfirmLab(null);
      await checkDockerStatus();
    }
  };

  const fetchLogs = async (labId: 'juice-shop' | 'dvwa' | 'webgoat', name: string) => {
    soundEffects.playKeyClick();
    setLogModalContainer({ labId, name });
    setIsLoadingLogs(true);
    try {
      const res = await fetch('/api/docker/container-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ labId }),
      });
      const data = await res.json();
      setContainerLogs(data.logs || 'No log output returned.');
    } catch {
      setContainerLogs('Failed to retrieve logs from backend server.');
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    soundEffects.playSuccess();
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const isJuiceShopOnline = dockerStatus?.labs?.['juice-shop']?.status === 'Online';
  const isDvwaOnline = dockerStatus?.labs?.dvwa?.status === 'Online';
  const isWebGoatOnline = dockerStatus?.labs?.webgoat?.status === 'Online';
  const activeLabCount = (isJuiceShopOnline ? 1 : 0) + (isDvwaOnline ? 1 : 0) + (isWebGoatOnline ? 1 : 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Action Notification Alert */}
      {actionMessage && (
        <div
          className={`p-4 rounded-xl font-mono text-xs flex items-center justify-between border transition-all ${
            actionMessage.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : actionMessage.type === 'error'
              ? 'bg-red-500/10 border-red-500/30 text-red-400'
              : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
          }`}
        >
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 flex-shrink-0" />
            <span>{actionMessage.text}</span>
          </div>
          <button
            onClick={() => setActionMessage(null)}
            className="hover:opacity-80 p-1 text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#080d14] via-[#0e1726] to-[#070b10] border border-[#172535] p-6 lg:p-8 cyber-glow">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold">
              <Monitor className="w-4 h-4" />
              <span>DOCKER LAB ORCHESTRATION & TARGET MANAGER</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-mono text-slate-100">
              Virtual Target & Docker Environment
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-mono">
              Manage local vulnerable container targets (OWASP Juice Shop, DVWA), review live memory limits, and inspect network topologies for ethical penetration testing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                checkDockerStatus();
                checkDaemon();
              }}
              disabled={isLoadingDocker || isCheckingDaemon}
              className="px-4 py-2 rounded-xl bg-[#121c27] hover:bg-[#1a293a] border border-[#1e2d3d] text-slate-200 font-mono text-xs font-bold flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingDocker || isCheckingDaemon ? 'animate-spin text-cyan-400' : ''}`} />
              <span>{isLoadingDocker ? 'Scanning Containers...' : 'Refresh Status'}</span>
            </button>

            <button
              onClick={() => onNavigate('bridge')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-cyan-950"
            >
              <Server className="w-4 h-4" />
              <span>Kali Daemon Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Resource Monitor & Safety Bar */}
      <div className="p-4 rounded-xl bg-[#090e15] border border-[#162230] grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-[#0d141f] border border-[#182637]">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <div>
            <div className="text-[11px] text-slate-400">Host Docker Engine</div>
            <div className="font-bold text-slate-100 flex items-center gap-2">
              {dockerStatus?.daemonRunning ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{dockerStatus.version || 'Active & Ready'}</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="text-amber-400">Standby / Daemon Inactive</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg bg-[#0d141f] border border-[#182637]">
          <HardDrive className="w-5 h-5 text-purple-400" />
          <div>
            <div className="text-[11px] text-slate-400">Memory Allocation Policy</div>
            <div className="font-bold text-slate-100 flex items-center gap-1">
              <span className="text-purple-400">512MB / Container</span>
              <span className="text-[10px] text-slate-400">(Single Active Lab)</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg bg-[#0d141f] border border-[#182637]">
          <Shield className="w-5 h-5 text-emerald-400" />
          <div>
            <div className="text-[11px] text-slate-400">Network Binding Safety</div>
            <div className="font-bold text-emerald-400 flex items-center gap-1">
              <span>127.0.0.1 (Loopback Only)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#172535] pb-2 font-mono text-xs font-bold">
        <button
          onClick={() => setActiveTab('docker')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
            activeTab === 'docker'
              ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-300'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#0c141f]'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>Real Docker Environments ({activeLabCount} Active)</span>
        </button>

        <button
          onClick={() => setActiveTab('guides')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
            activeTab === 'guides'
              ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-300'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#0c141f]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Guided Lab Walkthroughs</span>
        </button>

        <button
          onClick={() => setActiveTab('topology')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
            activeTab === 'topology'
              ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-300'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#0c141f]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Subnet Topology & Architecture</span>
        </button>
      </div>

      {/* TAB 1: REAL DOCKER TARGETS */}
      {activeTab === 'docker' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* OWASP Juice Shop Card */}
            <div className="p-6 rounded-2xl bg-[#090e15] border border-[#162230] space-y-4 font-mono text-xs flex flex-col justify-between hover:border-cyan-500/40 transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                    REAL DOCKER CONTAINER
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded border uppercase flex items-center gap-1.5 ${
                      isJuiceShopOnline
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : 'bg-red-500/20 text-red-400 border-red-500/40'
                    }`}
                  >
                    {isJuiceShopOnline ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>RUNNING (PORT 3001)</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5 text-red-400" />
                        <span>STOPPED</span>
                      </>
                    )}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-slate-100 text-base">OWASP Juice Shop</h3>
                  <p className="text-xs font-sans text-slate-400 leading-relaxed">
                    Most modern and sophisticated intentionally insecure web application. Includes XSS, SQLi, Broken Auth, CSRF, and Sensitive Data Exposure challenges.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#05080c] border border-[#141d27] space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Docker Image:</span>
                    <span className="text-cyan-400 font-bold">bkimminich/juice-shop</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Target Address:</span>
                    <span className="text-slate-200">http://127.0.0.1:3001</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Allocated RAM:</span>
                    <span className="text-purple-400 font-bold">512 MB</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#141d27] space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {isJuiceShopOnline ? (
                    <button
                      onClick={() => handleStopLab('juice-shop')}
                      disabled={isLoadingDocker}
                      className="w-full py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 font-bold flex items-center justify-center gap-2 transition-all"
                    >
                      <Square className="w-4 h-4 text-red-400 fill-current" />
                      <span>Stop Container</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStartLab('juice-shop')}
                      disabled={isLoadingDocker}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-950"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Launch Container</span>
                    </button>
                  )}

                  <a
                    href="http://127.0.0.1:3001"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-2.5 rounded-xl text-center font-bold flex items-center justify-center gap-2 transition-all ${
                      isJuiceShopOnline
                        ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30'
                        : 'bg-slate-800/50 border border-slate-700/50 text-slate-500 pointer-events-none'
                    }`}
                  >
                    <span>Open Target</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <button
                    onClick={() => fetchLogs('juice-shop', 'OWASP Juice Shop')}
                    className="text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Container Logs</span>
                  </button>

                  <button
                    onClick={() => setResetConfirmLab({ labId: 'juice-shop', name: 'OWASP Juice Shop' })}
                    className="text-slate-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Lab State</span>
                  </button>
                </div>
              </div>
            </div>

            {/* DVWA Card */}
            <div className="p-6 rounded-2xl bg-[#090e15] border border-[#162230] space-y-4 font-mono text-xs flex flex-col justify-between hover:border-cyan-500/40 transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                    REAL DOCKER CONTAINER
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded border uppercase flex items-center gap-1.5 ${
                      isDvwaOnline
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : 'bg-red-500/20 text-red-400 border-red-500/40'
                    }`}
                  >
                    {isDvwaOnline ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>RUNNING (PORT 8080)</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5 text-red-400" />
                        <span>STOPPED</span>
                      </>
                    )}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-slate-100 text-base">Damn Vulnerable Web App (DVWA)</h3>
                  <p className="text-xs font-sans text-slate-400 leading-relaxed">
                    PHP/MySQL web application created to test legal vulnerability assessment tools and practice manual web penetration testing.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#05080c] border border-[#141d27] space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Docker Image:</span>
                    <span className="text-cyan-400 font-bold">vulnerables/web-dvwa</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Target Address:</span>
                    <span className="text-slate-200">http://127.0.0.1:8080</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Allocated RAM:</span>
                    <span className="text-purple-400 font-bold">512 MB</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#141d27] space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {isDvwaOnline ? (
                    <button
                      onClick={() => handleStopLab('dvwa')}
                      disabled={isLoadingDocker}
                      className="w-full py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 font-bold flex items-center justify-center gap-2 transition-all"
                    >
                      <Square className="w-4 h-4 text-red-400 fill-current" />
                      <span>Stop Container</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStartLab('dvwa')}
                      disabled={isLoadingDocker}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-950"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Launch Container</span>
                    </button>
                  )}

                  <a
                    href="http://127.0.0.1:8080"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-2.5 rounded-xl text-center font-bold flex items-center justify-center gap-2 transition-all ${
                      isDvwaOnline
                        ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30'
                        : 'bg-slate-800/50 border border-slate-700/50 text-slate-500 pointer-events-none'
                    }`}
                  >
                    <span>Open Target</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <button
                    onClick={() => fetchLogs('dvwa', 'DVWA')}
                    className="text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Container Logs</span>
                  </button>

                  <button
                    onClick={() => setResetConfirmLab({ labId: 'dvwa', name: 'DVWA' })}
                    className="text-slate-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Lab State</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SIMULATED / EXTERNAL VM CARDS */}
          <div className="space-y-3">
            <h3 className="font-bold font-mono text-slate-200 text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Simulated & Companion Virtual Targets</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Metasploitable 2 VM */}
              <div className="p-5 rounded-2xl bg-[#090e15] border border-[#162230] space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/15 border border-purple-500/30 text-purple-300">
                    VIRTUALBOX / VM LAB
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    <span>SIMULATED SUB-NET</span>
                  </span>
                </div>

                <h4 className="font-bold text-slate-100 text-sm">Metasploitable 2 VM Target</h4>
                <p className="text-[11px] font-sans text-slate-400 leading-relaxed">
                  Intentionally vulnerable Linux distribution designed for Metasploit, Nmap, and Hydra exploits in VirtualBox.
                </p>

                <div className="pt-2 border-t border-[#141d27] flex items-center justify-between text-[11px]">
                  <span className="text-cyan-400">192.168.56.101:21</span>
                  <button
                    onClick={() => onNavigate('web_labs')}
                    className="px-3 py-1 rounded bg-[#121c27] hover:bg-cyan-500 hover:text-slate-950 text-slate-200 font-bold transition-all flex items-center gap-1"
                  >
                    <span>Practice Lab Scenario</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Kali Companion Daemon */}
              <div className="p-5 rounded-2xl bg-[#090e15] border border-[#162230] space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                    LOCAL COMPANION DAEMON
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${
                      isDaemonConnected
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : 'bg-red-500/20 text-red-400 border-red-500/40'
                    }`}
                  >
                    {isDaemonConnected ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    <span>{isDaemonConnected ? 'DAEMON ONLINE' : 'DISCONNECTED'}</span>
                  </span>
                </div>

                <h4 className="font-bold text-slate-100 text-sm">Kali Linux Bridge Node</h4>
                <p className="text-[11px] font-sans text-slate-400 leading-relaxed">
                  Enables safe, human-approved terminal execution of Nmap, Wireshark, Gobuster, and Hydra directly from browser UI.
                </p>

                <div className="pt-2 border-t border-[#141d27] flex items-center justify-between text-[11px]">
                  <span className="text-cyan-400">127.0.0.1:4444</span>
                  <button
                    onClick={() => onNavigate('bridge')}
                    className="px-3 py-1 rounded bg-[#121c27] hover:bg-slate-700 text-slate-300 font-bold transition-all"
                  >
                    Manage Pair Key
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GUIDED LAB WALKTHROUGHS */}
      {activeTab === 'guides' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs font-bold">
            <span className="text-slate-400">Select Vulnerable Target:</span>
            <button
              onClick={() => setSelectedLabGuide('juice-shop')}
              className={`px-4 py-2 rounded-xl transition-all ${
                selectedLabGuide === 'juice-shop'
                  ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300'
                  : 'bg-[#090e15] border border-[#162230] text-slate-400 hover:text-slate-200'
              }`}
            >
              OWASP Juice Shop (4 Exercises)
            </button>
            <button
              onClick={() => setSelectedLabGuide('dvwa')}
              className={`px-4 py-2 rounded-xl transition-all ${
                selectedLabGuide === 'dvwa'
                  ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300'
                  : 'bg-[#090e15] border border-[#162230] text-slate-400 hover:text-slate-200'
              }`}
            >
              DVWA Guided Exploits (4 Exercises)
            </button>
            <button
              onClick={() => setSelectedLabGuide('webgoat')}
              className={`px-4 py-2 rounded-xl transition-all ${
                selectedLabGuide === 'webgoat'
                  ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300'
                  : 'bg-[#090e15] border border-[#162230] text-slate-400 hover:text-slate-200'
              }`}
            >
              OWASP WebGoat (4 Exercises)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(selectedLabGuide === 'juice-shop'
              ? JUICE_SHOP_STEPS
              : selectedLabGuide === 'dvwa'
              ? DVWA_STEPS
              : WEBGOAT_STEPS
            ).map((step, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#090e15] border border-[#162230] space-y-4 font-mono text-xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                      {step.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        step.difficulty === 'Beginner'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {step.difficulty}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-100 text-sm">{step.title}</h3>
                  <p className="text-xs font-sans text-slate-400 leading-relaxed">{step.description}</p>

                  {step.payloadExample && (
                    <div className="space-y-1">
                      <div className="text-[11px] text-slate-400 font-bold">Attack Payload Example:</div>
                      <div className="p-2.5 rounded-lg bg-[#05080c] border border-[#141d27] font-mono text-cyan-300 break-all flex items-center justify-between">
                        <span>{step.payloadExample}</span>
                        <button
                          onClick={() => handleCopy(step.payloadExample!, idx * 10)}
                          className="p-1 hover:text-cyan-400 text-slate-500 transition-colors"
                        >
                          {copiedIndex === idx * 10 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {step.commandSuggestion && (
                    <div className="space-y-1">
                      <div className="text-[11px] text-slate-400 font-bold">Kali Command Suggestion:</div>
                      <div className="p-2.5 rounded-lg bg-[#05080c] border border-[#141d27] font-mono text-slate-200 break-all flex items-center justify-between">
                        <span>{step.commandSuggestion}</span>
                        <button
                          onClick={() => handleCopy(step.commandSuggestion!, idx * 10 + 1)}
                          className="p-1 hover:text-cyan-400 text-slate-500 transition-colors"
                        >
                          {copiedIndex === idx * 10 + 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-emerald-400/90 text-[11px] font-sans">
                    <span className="font-bold font-mono text-emerald-400">Blue Team Remediation: </span>
                    {step.remediationNote}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#141d27] flex items-center justify-between text-[11px]">
                  <a
                    href={step.targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-[#121c27] hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 font-bold transition-all flex items-center gap-1.5"
                  >
                    <span>Launch Step Target</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => onNavigate('bridge')}
                    className="px-3 py-1.5 rounded-lg bg-[#121c27] hover:bg-slate-700 text-slate-300 font-bold flex items-center gap-1.5"
                  >
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Run in Kali Terminal</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SUBNET TOPOLOGY & ARCHITECTURE */}
      {activeTab === 'topology' && (
        <div className="p-6 rounded-2xl bg-[#090e15] border border-[#162230] space-y-6 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-[#141d27] pb-4">
            <div>
              <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                <span>Isolated Cyber Lab Network Topology</span>
              </h3>
              <p className="text-xs font-sans text-slate-400">
                Strict 127.0.0.1 host loopback binding & host-only virtual adapter segregation.
              </p>
            </div>
            <span className="px-3 py-1 rounded bg-slate-800 text-cyan-400 font-bold">Subnet: 127.0.0.1 / 192.168.56.0/24</span>
          </div>

          <div className="p-6 rounded-xl bg-[#05080c] border border-[#141d27] grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            {/* Host Browser */}
            <div className="p-4 rounded-xl bg-[#0b121a] border border-blue-500/30 space-y-2">
              <div className="w-10 h-10 mx-auto rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold font-mono">
                BROWSER
              </div>
              <div className="font-bold text-slate-100">RAFAY HACKING LAB</div>
              <div className="text-[11px] text-blue-400">http://localhost:3000</div>
            </div>

            {/* Docker Engine */}
            <div className="p-4 rounded-xl bg-[#0b121a] border border-cyan-500/30 space-y-2">
              <div className="w-10 h-10 mx-auto rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold font-mono">
                DOCKER
              </div>
              <div className="font-bold text-slate-100">Local Docker Engine</div>
              <div className="text-[11px] text-cyan-400">127.0.0.1:3001 & 8080</div>
            </div>

            {/* Kali Daemon */}
            <div className="p-4 rounded-xl bg-[#0b121a] border border-emerald-500/30 space-y-2">
              <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold font-mono">
                DAEMON
              </div>
              <div className="font-bold text-slate-100">Kali Companion Daemon</div>
              <div className="text-[11px] text-emerald-400">127.0.0.1:4444</div>
            </div>

            {/* Subnet Target */}
            <div className="p-4 rounded-xl bg-[#0b121a] border border-purple-500/30 space-y-2">
              <div className="w-10 h-10 mx-auto rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold font-mono">
                SUBNET
              </div>
              <div className="font-bold text-slate-100">Host-Only VM Targets</div>
              <div className="text-[11px] text-purple-400">192.168.56.101</div>
            </div>
          </div>
        </div>
      )}

      {/* CONTAINER LOGS MODAL */}
      {logModalContainer && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#090e17] border border-[#172535] rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl space-y-4 p-6 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#141d27] pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-slate-100 text-sm">Container Output Logs — {logModalContainer.name}</h3>
              </div>
              <button
                onClick={() => setLogModalContainer(null)}
                className="p-1 hover:text-slate-200 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#04070a] border border-[#141d27] h-80 overflow-y-auto text-slate-300 font-mono leading-relaxed whitespace-pre-wrap select-text">
              {isLoadingLogs ? (
                <div className="flex items-center justify-center h-full gap-2 text-cyan-400">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Fetching latest stdout/stderr logs...</span>
                </div>
              ) : (
                containerLogs
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => fetchLogs(logModalContainer.labId, logModalContainer.name)}
                className="px-4 py-2 rounded-xl bg-[#121c27] hover:bg-[#1a293a] border border-[#1e2d3d] text-slate-200 font-bold flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4 text-cyan-400" />
                <span>Refresh Logs</span>
              </button>

              <button
                onClick={() => setLogModalContainer(null)}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESET LAB CONFIRMATION MODAL */}
      {resetConfirmLab && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#090e17] border border-[#172535] rounded-2xl w-full max-w-md p-6 font-mono text-xs space-y-4">
            <div className="flex items-center gap-3 text-amber-400">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <h3 className="font-bold text-slate-100 text-sm">Reset Container Database?</h3>
            </div>

            <p className="text-slate-400 font-sans text-xs leading-relaxed">
              This action will destroy the existing running container for <strong className="text-slate-200">{resetConfirmLab.name}</strong> and restart a clean instance. All lab challenge states inside the container will reset.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setResetConfirmLab(null)}
                disabled={isResetting}
                className="px-4 py-2 rounded-xl bg-[#121c27] border border-[#1e2d3d] text-slate-300 font-bold"
              >
                Cancel
              </button>

              <button
                onClick={handleResetLab}
                disabled={isResetting}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-2 disabled:opacity-50"
              >
                {isResetting ? <RefreshCw className="w-4 h-4 animate-spin text-slate-950" /> : <RotateCcw className="w-4 h-4" />}
                <span>{isResetting ? 'Resetting Container...' : 'Confirm Reset'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
