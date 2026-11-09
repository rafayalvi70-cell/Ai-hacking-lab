import React, { useState } from 'react';
import {
  Server,
  Shield,
  ExternalLink,
  Copy,
  Check,
  X,
  AlertTriangle,
  Terminal,
  Cpu,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { soundEffects } from '../../utils/audio';

interface VulnerableVmGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VulnerableVmGuideModal: React.FC<VulnerableVmGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'metasploitable' | 'juiceshop' | 'dvwa' | 'networking'>('metasploitable');

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    soundEffects.playKeyClick();
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#0c1218] border border-emerald-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col cyber-glow"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#1b2734] bg-[#0a0f14] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30 uppercase">
                  Authorized Sandbox Setup
                </span>
                <span className="text-xs font-mono text-emerald-400">Host-Only / NAT Network</span>
              </div>
              <h2 className="text-lg font-bold font-mono text-slate-100">
                Local Vulnerable VM & Target Lab Setup Guide
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 py-2.5 bg-[#080d12] border-b border-[#192430] flex items-center gap-2 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => { soundEffects.playKeyClick(); setActiveTab('metasploitable'); }}
            className={`px-3 py-1.5 rounded-lg transition-colors shrink-0 ${
              activeTab === 'metasploitable'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Metasploitable 2 & 3 (Linux/Windows)
          </button>

          <button
            onClick={() => { soundEffects.playKeyClick(); setActiveTab('juiceshop'); }}
            className={`px-3 py-1.5 rounded-lg transition-colors shrink-0 ${
              activeTab === 'juiceshop'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            OWASP Juice Shop (Modern Web)
          </button>

          <button
            onClick={() => { soundEffects.playKeyClick(); setActiveTab('dvwa'); }}
            className={`px-3 py-1.5 rounded-lg transition-colors shrink-0 ${
              activeTab === 'dvwa'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            DVWA (PHP & SQLi Sandbox)
          </button>

          <button
            onClick={() => { soundEffects.playKeyClick(); setActiveTab('networking'); }}
            className={`px-3 py-1.5 rounded-lg transition-colors shrink-0 ${
              activeTab === 'networking'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            VirtualBox / VMware Isolation
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* TAB 1: METASPLOITABLE */}
          {activeTab === 'metasploitable' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#090e13] border border-[#192430] space-y-2">
                <h3 className="text-sm font-bold font-mono text-purple-400">
                  Metasploitable 2 VM (Rapid7)
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Metasploitable 2 is an intentionally vulnerable Ubuntu Linux virtual machine designed for testing network scanning, vulnerability assessment, and exploit tools in an isolated lab.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-[#080d12] border border-[#16212b] space-y-2">
                  <span className="text-xs font-mono text-emerald-400 font-bold block">
                    Step 1: Download & Extract
                  </span>
                  <p className="text-xs text-slate-400 font-sans">
                    Download the official VMDK image from SourceForge/Rapid7. Extract the ZIP archive onto your host machine with at least 10 GB free space.
                  </p>
                  <div className="p-2.5 rounded bg-[#05080b] border border-[#121a22] font-mono text-xs text-slate-300 flex items-center justify-between">
                    <span>https://sourceforge.net/projects/metasploitable/</span>
                    <button
                      onClick={() => handleCopy('https://sourceforge.net/projects/metasploitable/')}
                      className="text-slate-400 hover:text-emerald-400"
                    >
                      {copiedText?.includes('metasploitable') ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#080d12] border border-[#16212b] space-y-2">
                  <span className="text-xs font-mono text-emerald-400 font-bold block">
                    Step 2: VirtualBox / VMware Configuration
                  </span>
                  <ul className="text-xs font-mono text-slate-300 space-y-1.5 list-disc list-inside">
                    <li>Create VM: Type <code className="text-purple-300">Linux</code>, Version <code className="text-purple-300">Ubuntu (64-bit)</code></li>
                    <li>RAM: 1024 MB (1 GB) is sufficient.</li>
                    <li>Hard Disk: Select "Use an existing virtual hard disk file" and attach the extracted <code className="text-emerald-400">Metasploitable.vmdk</code>.</li>
                    <li><strong className="text-amber-400">CRITICAL NETWORK SETTING:</strong> Set Network Adapter 1 to <code className="text-emerald-300">Host-Only Adapter</code> or <code className="text-emerald-300">NAT Network</code> (e.g. <code>vboxnet0</code>). NEVER attach to Bridged on public Wi-Fi!</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-[#080d12] border border-[#16212b] space-y-2">
                  <span className="text-xs font-mono text-emerald-400 font-bold block">
                    Step 3: Default Credentials & IP Discovery
                  </span>
                  <div className="p-2.5 rounded bg-[#05080b] border border-[#121a22] font-mono text-xs text-slate-300 space-y-1">
                    <div><span className="text-slate-500">Username: </span><span className="text-emerald-400">msfadmin</span></div>
                    <div><span className="text-slate-500">Password: </span><span className="text-emerald-400">msfadmin</span></div>
                    <div><span className="text-slate-500">Find IP in VM: </span><span className="text-purple-300">ifconfig eth0</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: OWASP JUICE SHOP */}
          {activeTab === 'juiceshop' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#090e13] border border-[#192430] space-y-2">
                <h3 className="text-sm font-bold font-mono text-purple-400">
                  OWASP Juice Shop (Fast Docker Deployment)
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  The most modern, intentionally insecure web application for web security enthusiasts. Covers the entire OWASP Top 10 including Broken Object Level Authorization, XSS, and SQLi.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-[#080d12] border border-[#16212b] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-emerald-400 font-bold">
                      Run Instantly via Docker (in Kali VM)
                    </span>
                    <button
                      onClick={() => handleCopy('docker run -d --rm -p 3000:3000 bkimminich/juice-shop')}
                      className="text-xs font-mono text-slate-400 hover:text-emerald-400 flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Command</span>
                    </button>
                  </div>
                  <div className="p-3 rounded bg-[#05080b] border border-[#121a22] font-mono text-xs text-emerald-300">
                    $ docker run -d --rm -p 3000:3000 bkimminich/juice-shop
                  </div>
                  <p className="text-xs text-slate-400 font-sans">
                    Once running, open your browser inside Kali and visit <code className="text-purple-300">http://localhost:3000</code> or your lab IP.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#080d12] border border-[#16212b] space-y-2">
                  <span className="text-xs font-mono text-emerald-400 font-bold block">
                    Exercises with Burp Suite:
                  </span>
                  <ul className="text-xs font-mono text-slate-300 space-y-1.5 list-disc list-inside">
                    <li>Intercept login requests to examine JWT tokens and password hashes.</li>
                    <li>Exploit SQL injection on the search field: <code className="text-emerald-300">')) OR 1=1--</code></li>
                    <li>Solve the embedded Score Board challenge by inspecting <code className="text-purple-300">main.js</code> assets.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DVWA */}
          {activeTab === 'dvwa' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#090e13] border border-[#192430] space-y-2">
                <h3 className="text-sm font-bold font-mono text-purple-400">
                  Damn Vulnerable Web Application (DVWA)
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  A PHP/MySQL web application that offers variable difficulty settings (Low, Medium, High, Impossible) to practice progressive exploitation.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-[#080d12] border border-[#16212b] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-emerald-400 font-bold">
                      Run via Docker Container
                    </span>
                    <button
                      onClick={() => handleCopy('docker run --rm -it -p 8080:80 vulnerables/web-dvwa')}
                      className="text-xs font-mono text-slate-400 hover:text-emerald-400 flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Command</span>
                    </button>
                  </div>
                  <div className="p-3 rounded bg-[#05080b] border border-[#121a22] font-mono text-xs text-emerald-300">
                    $ docker run --rm -it -p 8080:80 vulnerables/web-dvwa
                  </div>
                  <p className="text-xs text-slate-400 font-sans">
                    Navigate to <code className="text-purple-300">http://localhost:8080/setup.php</code> and click "Create / Reset Database".
                  </p>
                  <div className="p-2.5 rounded bg-[#05080b] border border-[#121a22] font-mono text-xs text-slate-300">
                    Default login: <span className="text-emerald-400">admin</span> / <span className="text-emerald-400">password</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ISOLATION & NETWORKING */}
          {activeTab === 'networking' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#090e13] border border-[#192430] space-y-2">
                <h3 className="text-sm font-bold font-mono text-emerald-400 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Network Isolation Safety Rules</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  To prevent unauthorized packet transmission or exposing vulnerable systems to public networks, always configure your hypervisor network adapters using Host-Only or NAT Network.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-[#080d12] border border-[#16212b] space-y-2">
                  <h4 className="text-xs font-mono text-slate-200 font-bold">VirtualBox Isolation Checklist:</h4>
                  <ul className="text-xs font-mono text-slate-400 space-y-1.5 list-disc list-inside">
                    <li>Open VirtualBox File &gt; Tools &gt; Network Manager.</li>
                    <li>Create a <code className="text-emerald-400">Host-Only Network</code> (e.g. 192.168.56.1/24).</li>
                    <li>Attach Kali Adapter 1 to Host-Only Network.</li>
                    <li>Attach Metasploitable Adapter 1 to the same Host-Only Network.</li>
                    <li>Both VMs can communicate, but neither is visible to external devices.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-[#080d12] border border-[#16212b] space-y-2">
                  <h4 className="text-xs font-mono text-slate-200 font-bold">VMware Workstation / Fusion:</h4>
                  <ul className="text-xs font-mono text-slate-400 space-y-1.5 list-disc list-inside">
                    <li>Select VM &gt; Settings &gt; Network Adapter.</li>
                    <li>Choose <code className="text-purple-400">Host-only: A private network shared with the host (VMnet1)</code>.</li>
                    <li>Or choose <code className="text-purple-400">Custom (VMnet2-VMnet19)</code> to create a completely air-gapped laboratory network.</li>
                    <li>Verify communication: <code className="text-emerald-300">ping -c 3 &lt;target-ip&gt;</code></li>
                  </ul>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-red-950/20 border border-red-500/30 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-xs font-mono text-red-200">
                  <strong className="block text-red-300">Mandatory Safety Warning:</strong>
                  Never bridge Metasploitable or intentionally vulnerable servers to hotel, coffee shop, or office public Wi-Fi networks. Malicious actors on the local subnet could compromise the machine within seconds.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1b2734] bg-[#0a0f14] flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400">
            Use these setup steps alongside RAFAY HACKING LAB practice exercises.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs"
          >
            Done & Return to Labs
          </button>
        </div>
      </div>
    </div>
  );
};
