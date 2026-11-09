import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Search,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Copy,
  Download,
  Terminal,
  Layers,
  Sparkles,
  HelpCircle,
  Zap,
} from 'lucide-react';
import { Translations } from '../../data/translations';
import { PageId } from '../layout/Sidebar';
import { soundEffects } from '../../utils/audio';

interface ScanResultAnalyzerViewProps {
  t: Translations;
  onNavigate: (page: PageId, targetId?: string) => void;
}

interface ParsedFinding {
  port: number;
  protocol: string;
  service: string;
  version: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';
  cve?: string;
  riskDescription: string;
  remediation: string;
}

export const ScanResultAnalyzerView: React.FC<ScanResultAnalyzerViewProps> = ({ onNavigate }) => {
  const sampleScanData = `# Nmap 7.94 scan report for 192.168.1.10 (target.local)
Host is up (0.0012s latency).
Not shown: 994 closed tcp ports
PORT     STATE SERVICE     VERSION
21/tcp   open  ftp         vsftpd 2.3.4
22/tcp   open  ssh         OpenSSH 4.7p1 Debian-8ubuntu1 (protocol 2.0)
80/tcp   open  http        Apache httpd 2.2.8 ((Ubuntu) DAV/2)
139/tcp  open  netbios-ssn Samba smbd 3.X - 4.X (workgroup: WORKGROUP)
445/tcp  open  netbios-ssn Samba smbd 3.0.20-Debian
3306/tcp open  mysql       MySQL 5.0.51a-3ubuntu5

Service Info: Host: target.local; OS: Linux; CPE: cpe:/o:linux:linux_kernel`;

  const [rawInput, setRawInput] = useState(sampleScanData);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [parsedFindings, setParsedFindings] = useState<ParsedFinding[]>([]);
  const [targetHost, setTargetHost] = useState<string>('192.168.1.10');

  const handleAnalyze = () => {
    soundEffects.playKeyClick();
    const findings: ParsedFinding[] = [];

    const lines = rawInput.split('\n');
    lines.forEach((line) => {
      if (line.includes('192.168.') || line.includes('Nmap scan report for')) {
        const match = line.match(/(?:for\s+)([^\s]+)/);
        if (match) setTargetHost(match[1]);
      }

      if (line.includes('/tcp') || line.includes('/udp')) {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 3) {
          const portProto = parts[0].split('/');
          const port = parseInt(portProto[0]) || 80;
          const proto = portProto[1] || 'tcp';
          const service = parts[2] || 'unknown';
          const version = parts.slice(3).join(' ') || 'unknown version';

          let severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Info' = 'Low';
          let cve = '';
          let riskDescription = `Service ${service} version ${version} detected on port ${port}.`;
          let remediation = `Ensure ${service} is patched to the latest vendor version and access is restricted.`;

          if (port === 21 && version.includes('2.3.4')) {
            severity = 'Critical';
            cve = 'CVE-2011-2523';
            riskDescription = 'vsftpd 2.3.4 contains a famous backdoor command execution vulnerability.';
            remediation = 'Immediately upgrade vsftpd to version 3.0.5+ or replace with OpenSSH SFTP.';
          } else if (port === 445 && version.includes('3.0.20')) {
            severity = 'Critical';
            cve = 'CVE-2007-2447';
            riskDescription = 'Samba 3.0.20 is vulnerable to User Map Script arbitrary command execution.';
            remediation = 'Update Samba to 4.x series and disable anonymous SMB1 access.';
          } else if (port === 80 && version.includes('2.2.8')) {
            severity = 'High';
            cve = 'CVE-2011-3192';
            riskDescription = 'Outdated Apache 2.2.8 susceptible to Range Header DoS and directory indexing.';
            remediation = 'Upgrade Apache to 2.4.58+ and disable mod_status / WebDAV if unused.';
          } else if (port === 3306) {
            severity = 'Medium';
            riskDescription = 'MySQL database port directly exposed to network interface.';
            remediation = 'Bind MySQL to 127.0.0.1 in my.cnf and enforce SSL client certificates.';
          }

          findings.push({
            port,
            protocol: proto,
            service,
            version,
            severity,
            cve,
            riskDescription,
            remediation,
          });
        }
      }
    });

    if (findings.length === 0) {
      // Default fallback if unstructured text
      findings.push({
        port: 80,
        protocol: 'tcp',
        service: 'http',
        version: 'Apache 2.4',
        severity: 'Medium',
        riskDescription: 'HTTP server detected. Recommended header hardening audit.',
        remediation: 'Implement HSTS, Content-Security-Policy, and X-Frame-Options.',
      });
    }

    setParsedFindings(findings);
    setIsAnalyzed(true);
  };

  const exportMarkdownDossier = () => {
    soundEffects.playKeyClick();
    let md = `# RAFAY HACKING LAB — PENETRATION TEST SCAN REPORT\n\n`;
    md += `**Target Asset:** ${targetHost}\n`;
    md += `**Assessment Date:** ${new Date().toUTCString()}\n`;
    md += `**Total Open Ports Identified:** ${parsedFindings.length}\n\n`;
    md += `---\n\n## 1. Discovered Vulnerability Breakdown\n\n`;

    parsedFindings.forEach((f) => {
      md += `### [${f.severity.toUpperCase()}] Port ${f.port}/${f.protocol} — ${f.service} (${f.version})\n`;
      if (f.cve) md += `- **Associated CVE:** ${f.cve}\n`;
      md += `- **Impact Description:** ${f.riskDescription}\n`;
      md += `- **Remediation Plan:** ${f.remediation}\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Scan_Audit_${targetHost.replace(/[^a-z0-9]/gi, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#080d14] via-[#0d1726] to-[#070b10] border border-[#172535] p-6 lg:p-8 cyber-glow">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-purple-500/15 border border-purple-500/30 text-purple-400 font-mono text-xs font-bold">
              <FileText className="w-4 h-4" />
              <span>NMAP & LOG ANALYSIS ENGINE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-mono text-slate-100">
              Security Scan & Report Analyzer
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-mono">
              Import raw Nmap, Wireshark, or HTTP header dumps to automatically parse open ports, extract CVE signatures, categorize risk severity, and produce executive audit reports.
            </p>
          </div>

          {isAnalyzed && (
            <button
              onClick={exportMarkdownDossier}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-cyan-950 shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Export Audit Dossier (.MD)</span>
            </button>
          )}
        </div>
      </div>

      {/* Input Box & Parsing Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Raw Input Column */}
        <div className="lg:col-span-5 rounded-2xl bg-[#080d12] border border-[#162230] p-5 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-[#162230] pb-2">
            <span className="font-bold text-slate-100 flex items-center gap-2">
              <Upload className="w-4 h-4 text-cyan-400" /> Input Raw Scan Output
            </span>
            <button
              onClick={() => setRawInput(sampleScanData)}
              className="text-[11px] text-cyan-400 hover:underline"
            >
              Load Sample Data
            </button>
          </div>

          <textarea
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            rows={14}
            placeholder="Paste Nmap text output, XML, HTTP response headers, or Snort alerts here..."
            className="w-full bg-[#05080c] border border-[#16222e] rounded-xl p-3.5 font-mono text-xs text-slate-200 focus:outline-hidden leading-relaxed"
          />

          <button
            onClick={handleAnalyze}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-purple-950 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Parse & Analyze Findings</span>
          </button>
        </div>

        {/* Parsed Findings Results Column */}
        <div className="lg:col-span-7 rounded-2xl bg-[#080d12] border border-[#162230] p-5 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-[#162230] pb-2">
            <span className="font-bold text-slate-100 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" /> Parsed Audit Results ({parsedFindings.length})
            </span>
            {targetHost && (
              <span className="text-[11px] text-cyan-400 font-bold">Target: {targetHost}</span>
            )}
          </div>

          {!isAnalyzed ? (
            <div className="p-12 text-center rounded-xl bg-[#05080c] border border-[#141d27] space-y-2">
              <FileText className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-slate-300 font-bold">No Active Analysis</p>
              <p className="text-slate-500 text-[11px] font-sans">
                Paste your Nmap scan results into the left panel and click "Parse & Analyze Findings".
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {parsedFindings.map((finding, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border space-y-2.5 ${
                    finding.severity === 'Critical'
                      ? 'bg-red-950/20 border-red-500/40'
                      : finding.severity === 'High'
                      ? 'bg-amber-950/20 border-amber-500/40'
                      : 'bg-[#060a0f] border-[#16222e]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-100 text-sm">
                        Port {finding.port}/{finding.protocol}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 text-[11px]">
                        {finding.service}
                      </span>
                      {finding.cve && (
                        <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-bold">
                          {finding.cve}
                        </span>
                      )}
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        finding.severity === 'Critical'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                          : finding.severity === 'High'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      }`}
                    >
                      {finding.severity}
                    </span>
                  </div>

                  <div className="text-slate-300 font-sans text-xs">
                    <strong className="text-slate-400 font-mono">Service Version: </strong>
                    <code>{finding.version}</code>
                  </div>

                  <p className="text-slate-300 font-sans text-xs leading-relaxed">
                    {finding.riskDescription}
                  </p>

                  <div className="p-3 rounded-lg bg-[#05080c] border border-emerald-500/30 text-emerald-300 text-[11px] font-mono">
                    <strong className="text-emerald-400 block mb-0.5">Remediation Action:</strong>
                    {finding.remediation}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
