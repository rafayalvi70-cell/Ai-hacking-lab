import React, { useState, useEffect } from 'react';
import {
  Download,
  Terminal,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Copy,
  Check,
  Shield,
  AlertTriangle,
  RefreshCw,
  Server,
  Play,
  HelpCircle,
  Trash2,
  Cpu,
  Layers,
  Lock,
} from 'lucide-react';
import { KaliTool } from '../../types/cyber';
import { getToolInstallationInfo, ToolInstallationDetails } from '../../data/installerData';
import { kaliBridgeService, ToolCheckResult, CommandExecutionResult } from '../../services/kaliBridgeService';
import { soundEffects } from '../../utils/audio';

interface SmartInstallerTabProps {
  tool: KaliTool;
  onNavigateToBridge: () => void;
}

export const SmartInstallerTab: React.FC<SmartInstallerTabProps> = ({ tool, onNavigateToBridge }) => {
  const installInfo: ToolInstallationDetails = getToolInstallationInfo(tool);

  const [checkStatus, setCheckStatus] = useState<ToolCheckResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<'apt' | 'github'>('apt');

  // Execution modal state
  const [isExecuteModalOpen, setIsExecuteModalOpen] = useState(false);
  const [cmdToExecute, setCmdToExecute] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [execOutput, setExecOutput] = useState<CommandExecutionResult | null>(null);
  const [userConfirmedSudo, setUserConfirmedSudo] = useState(false);

  // Auto-check installation status on mount
  useEffect(() => {
    handleCheckStatus();
  }, [tool.id]);

  const handleCheckStatus = async () => {
    setIsChecking(true);
    soundEffects.playKeyClick();
    const result = await kaliBridgeService.checkToolInstallation(installInfo.binaryName);
    setCheckStatus(result);
    setIsChecking(false);
  };

  const handleCopyCommands = (commands: string[], label: string) => {
    const text = commands.join('\n');
    navigator.clipboard.writeText(text);
    setCopiedSection(label);
    soundEffects.playKeyClick();
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleOpenExecuteModal = (cmd: string) => {
    soundEffects.playKeyClick();
    setCmdToExecute(cmd);
    setExecOutput(null);
    setUserConfirmedSudo(false);
    setIsExecuteModalOpen(true);
  };

  const handleConfirmAndRun = async () => {
    if (cmdToExecute.includes('sudo') && !userConfirmedSudo) {
      alert('Please check the authorization box before executing sudo commands.');
      return;
    }

    setIsExecuting(true);
    soundEffects.playKeyClick();
    const res = await kaliBridgeService.executeCommand(cmdToExecute);
    setExecOutput(res);
    setIsExecuting(false);

    if (res.success) {
      soundEffects.playSuccess();
      handleCheckStatus(); // re-verify
    }
  };

  return (
    <div className="space-y-5 font-sans">
      {/* 1. Tool Status Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#090e15] border border-[#162230] space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl border flex items-center justify-center font-mono shrink-0 ${
                checkStatus?.installed
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
              }`}
            >
              {checkStatus?.installed ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <Download className="w-6 h-6" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-mono text-base font-bold text-slate-100">{tool.name} Installation Status</h3>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${
                    checkStatus?.installed
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}
                >
                  {checkStatus?.installed ? 'Installed' : 'Package Available'}
                </span>
              </div>

              <div className="text-xs font-mono text-slate-400 mt-0.5 flex flex-wrap items-center gap-3">
                {checkStatus?.path && (
                  <span>Path: <code className="text-cyan-400">{checkStatus.path}</code></span>
                )}
                {checkStatus?.version && (
                  <span>Version: <code className="text-emerald-400">{checkStatus.version}</code></span>
                )}
                {!checkStatus?.installed && (
                  <span>Binary: <code className="text-slate-300">{installInfo.binaryName}</code></span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={handleCheckStatus}
              disabled={isChecking}
              className="px-3 py-1.5 rounded-lg bg-[#121c27] hover:bg-[#1a293a] border border-[#1e2d3d] text-slate-300 hover:text-slate-100 font-mono text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin text-cyan-400' : ''}`} />
              <span>{isChecking ? 'Scanning Kali...' : 'Re-check Status'}</span>
            </button>
          </div>
        </div>

        {/* Bridge Offline Warning */}
        {checkStatus && !checkStatus.installed && checkStatus.rawOutput?.includes('offline') && (
          <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 font-mono text-xs text-amber-300 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <div className="space-y-1">
              <span className="font-bold block">Local Kali Companion Daemon Offline</span>
              <p className="text-slate-300 text-[11px] font-sans">
                To check live binaries and execute installation commands directly on your local Kali VM, launch our companion daemon.
              </p>
              <button
                onClick={onNavigateToBridge}
                className="text-cyan-400 hover:underline font-mono text-xs flex items-center gap-1 pt-0.5"
              >
                <Server className="w-3.5 h-3.5" />
                <span>Open Kali Terminal Bridge Setup</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. Installation Method Selector */}
      <div className="p-1 bg-[#090e15] border border-[#162230] rounded-xl flex items-center gap-1 font-mono text-xs">
        <button
          onClick={() => { soundEffects.playKeyClick(); setSelectedMethod('apt'); }}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 font-bold transition-all ${
            selectedMethod === 'apt'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>Option 1: Kali APT Package ({installInfo.apt_package_name})</span>
        </button>

        <button
          onClick={() => { soundEffects.playKeyClick(); setSelectedMethod('github'); }}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 font-bold transition-all ${
            selectedMethod === 'github'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ExternalLink className="w-4 h-4 text-purple-400" />
          <span>Option 2: Official GitHub Source</span>
        </button>
      </div>

      {/* 3. Method Details Box */}
      {selectedMethod === 'apt' ? (
        /* APT SECTION */
        <div className="p-5 rounded-2xl bg-[#090e15] border border-[#162230] space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-[#141d27] pb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>APT Package Manager</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  RECOMMENDED
                </span>
              </h4>
              <p className="text-slate-400 text-[11px] font-sans mt-0.5">
                Official package indexed in Kali Linux rolling repositories.
              </p>
            </div>

            <button
              onClick={() => handleCopyCommands(installInfo.install_commands.apt, 'apt')}
              className="px-3 py-1.5 rounded-lg bg-[#121c27] hover:bg-emerald-500 hover:text-slate-950 border border-[#1e2d3d] text-slate-300 font-bold flex items-center gap-1.5 transition-colors"
            >
              {copiedSection === 'apt' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy APT Commands</span>
                </>
              )}
            </button>
          </div>

          {/* Commands Codebox */}
          <div className="space-y-2">
            <span className="text-[11px] text-slate-400 uppercase font-bold">Standard Installation Sequence:</span>
            <div className="p-3.5 rounded-xl bg-[#05080c] border border-[#141d27] text-emerald-300 space-y-1.5 overflow-x-auto">
              {installInfo.install_commands.apt.map((cmd, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <span>$ {cmd}</span>
                  <button
                    onClick={() => handleOpenExecuteModal(cmd)}
                    className="opacity-0 group-hover:opacity-100 px-2 py-0.5 rounded bg-[#121c27] hover:bg-emerald-500 hover:text-slate-950 text-slate-300 text-[10px] flex items-center gap-1 transition-all"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Execute</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Additional APT Actions: Update & Uninstall */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-[#0d141d] border border-[#182432] space-y-1.5">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Update Command:</span>
              <div className="text-cyan-300 font-mono text-[11px]">
                $ {installInfo.update_commands[0]}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#0d141d] border border-[#182432] space-y-1.5">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Uninstall Command:</span>
              <div className="text-red-400 font-mono text-[11px]">
                $ {installInfo.uninstall_commands[0]}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* GITHUB SECTION */
        <div className="p-5 rounded-2xl bg-[#090e15] border border-[#162230] space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-[#141d27] pb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>Official GitHub Repository</span>
                {installInfo.repository_verified && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">
                    VERIFIED SOURCE
                  </span>
                )}
              </h4>
              <a
                href={installInfo.official_repository_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline text-[11px] font-mono flex items-center gap-1 mt-0.5"
              >
                <span>{installInfo.official_repository_url}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <button
              onClick={() => handleCopyCommands(installInfo.install_commands.github, 'github')}
              className="px-3 py-1.5 rounded-lg bg-[#121c27] hover:bg-purple-500 hover:text-white border border-[#1e2d3d] text-slate-300 font-bold flex items-center gap-1.5 transition-colors"
            >
              {copiedSection === 'github' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Git Commands</span>
                </>
              )}
            </button>
          </div>

          {/* Git Clone & Build Sequence */}
          <div className="space-y-2">
            <span className="text-[11px] text-slate-400 uppercase font-bold">Verified Clone & Build Procedure:</span>
            <div className="p-3.5 rounded-xl bg-[#05080c] border border-[#141d27] text-purple-300 space-y-1.5 overflow-x-auto">
              {installInfo.install_commands.github.map((cmd, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <span>$ {cmd}</span>
                  <button
                    onClick={() => handleOpenExecuteModal(cmd)}
                    className="opacity-0 group-hover:opacity-100 px-2 py-0.5 rounded bg-[#121c27] hover:bg-purple-500 hover:text-white text-slate-300 text-[10px] flex items-center gap-1 transition-all"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Execute</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Dependencies & Verification Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Dependencies */}
        <div className="p-4 rounded-2xl bg-[#090e15] border border-[#162230] space-y-2.5 font-mono text-xs">
          <h4 className="text-slate-400 uppercase font-bold text-[11px]">Required Dependencies</h4>
          <div className="flex flex-wrap gap-1.5">
            {installInfo.dependencies.map((dep, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-md bg-[#121c27] border border-[#1d2b3a] text-slate-200">
                {dep}
              </span>
            ))}
          </div>
        </div>

        {/* Verification Command */}
        <div className="p-4 rounded-2xl bg-[#090e15] border border-[#162230] space-y-2.5 font-mono text-xs">
          <h4 className="text-slate-400 uppercase font-bold text-[11px]">Verification Command</h4>
          <div className="p-2.5 rounded-lg bg-[#05080c] border border-[#141d27] text-emerald-400 font-bold flex items-center justify-between">
            <span>$ {installInfo.verification_commands[0]}</span>
            <button
              onClick={() => handleCopyCommands(installInfo.verification_commands, 'ver')}
              className="text-slate-400 hover:text-emerald-400"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 5. Execution Approval Modal */}
      {isExecuteModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs"
          onClick={() => setIsExecuteModalOpen(false)}
        >
          <div
            className="relative w-full max-w-xl bg-[#0a0f14] border border-cyan-500/40 rounded-2xl shadow-2xl p-6 space-y-5 font-mono text-xs cyber-glow"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#182432] pb-3">
              <div className="flex items-center gap-2 font-bold text-slate-100 text-sm">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span>Explicit Human Authorization Required</span>
              </div>
              <button
                onClick={() => setIsExecuteModalOpen(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-slate-400 text-[11px]">Command Scheduled for Execution:</span>
              <div className="p-3 rounded-xl bg-[#05080c] border border-[#16222e] text-emerald-300 font-bold">
                $ {cmdToExecute}
              </div>
            </div>

            {cmdToExecute.includes('sudo') && (
              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-300 space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Sudo Privilege Execution Warning</span>
                </div>
                <p className="text-[11px] font-sans text-slate-300">
                  This command requests elevated privileges. Verify the target package before proceeding.
                </p>
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={userConfirmedSudo}
                    onChange={(e) => setUserConfirmedSudo(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-cyan-400 focus:ring-0 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-200">
                    I explicitly authorize this command on my local Kali machine
                  </span>
                </label>
              </div>
            )}

            {/* Live Execution Output Stream */}
            {execOutput && (
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Terminal Output Log:</span>
                <pre className="p-3 rounded-xl bg-[#05080b] border border-[#141d27] text-[11px] text-slate-300 max-h-40 overflow-y-auto whitespace-pre-wrap">
                  {execOutput.stdout || execOutput.stderr || 'Command finished with status code ' + execOutput.exitCode}
                </pre>
              </div>
            )}

            {/* Modal Controls */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsExecuteModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-[#14202c] border border-[#223547] text-slate-300 hover:text-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAndRun}
                disabled={isExecuting || (cmdToExecute.includes('sudo') && !userConfirmedSudo)}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold transition-all shadow-md shadow-cyan-950 disabled:opacity-40 flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isExecuting ? 'Executing Command...' : 'Authorize & Run'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
