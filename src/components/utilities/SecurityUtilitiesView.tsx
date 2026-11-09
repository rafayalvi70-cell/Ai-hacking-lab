import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Binary,
  Hash,
  Shield,
  FileText,
  Copy,
  Check,
  ArrowRightLeft,
  Trash2,
  Save,
  CheckCircle2,
  AlertTriangle,
  Network,
  Globe,
  SlidersHorizontal,
} from 'lucide-react';
import { Translations } from '../../data/translations';
import {
  computeCryptoHash,
  md5,
  encodeBase64,
  decodeBase64,
  encodeHex,
  decodeHex,
  rot13,
  analyzePasswordEntropy,
} from '../../utils/cryptoUtils';
import { calculateSubnet, queryDnsSimulator, analyzeHttpHeaders } from '../../utils/networkUtils';
import { saveSecurityReport } from '../../utils/storage';
import { SecurityReport, SubnetCalculationResult, DnsRecordItem } from '../../types/cyber';
import { soundEffects } from '../../utils/audio';

interface SecurityUtilitiesViewProps {
  t: Translations;
  onReportSaved: (report: SecurityReport) => void;
}

export const SecurityUtilitiesView: React.FC<SecurityUtilitiesViewProps> = ({
  t,
  onReportSaved,
}) => {
  const [activeTab, setActiveTab] = useState<'encoder' | 'hasher' | 'entropy' | 'subnet' | 'dns' | 'headers' | 'report'>('encoder');

  // Encoder / Decoder State
  const [codecAlgo, setCodecAlgo] = useState<'base64' | 'hex' | 'url' | 'rot13'>('base64');
  const [codecMode, setCodecMode] = useState<'encode' | 'decode'>('encode');
  const [codecInput, setCodecInput] = useState('CYBER_AI_LAB{authorized_security_analyst}');
  const [codecOutput, setCodecOutput] = useState('');
  const [copiedCodec, setCopiedCodec] = useState(false);

  // Hash Generator State
  const [hashInput, setHashInput] = useState('Password123!_SecureLab');
  const [hashes, setHashes] = useState({
    sha256: '',
    sha512: '',
    sha1: '',
    md5: '',
  });
  const [checksumToCompare, setChecksumToCompare] = useState('');
  const [checksumMatch, setChecksumMatch] = useState<boolean | null>(null);
  const [copiedHashKey, setCopiedHashKey] = useState<string | null>(null);

  // Password Entropy State
  const [passInput, setPassInput] = useState('Admin@Security2026!');

  // IP / Subnet Calculator State
  const [subnetIp, setSubnetIp] = useState('192.168.1.100');
  const [subnetCidr, setSubnetCidr] = useState(24);
  const [subnetResult, setSubnetResult] = useState<SubnetCalculationResult | null>(null);
  const [subnetError, setSubnetError] = useState<string | null>(null);

  // DNS Inspector State
  const [dnsDomain, setDnsDomain] = useState('cyberlab.local');
  const [dnsFilter, setDnsFilter] = useState('ALL');
  const [dnsResults, setDnsResults] = useState<DnsRecordItem[]>([]);

  // HTTP Header Auditor State
  const [rawHeadersInput, setRawHeadersInput] = useState(`HTTP/1.1 200 OK
Server: Apache/2.4.57 (Debian)
Date: Sat, 07 Nov 2026 19:30:00 GMT
Content-Type: text/html; charset=UTF-8
Set-Cookie: session_id=abc123xyz; Path=/
X-Powered-By: PHP/8.2.1`);
  const [headerAuditResult, setHeaderAuditResult] = useState(analyzeHttpHeaders(rawHeadersInput));

  // Report Generator State
  const [reportForm, setReportForm] = useState<Omit<SecurityReport, 'id' | 'date'>>({
    title: 'Missing HTTP Strict Transport Security (HSTS) and Secure Cookie Flags',
    severity: 'Medium',
    asset: 'https://api.internal-sandbox.local/v1/auth',
    cveOrCwe: 'CWE-319 / CWE-614',
    cvssScore: 5.3,
    description: 'During a security audit, the authentication endpoint was observed issuing session tokens without enforcing the HSTS header or the Secure and HttpOnly flags on the cookies.',
    impact: 'Attackers situated in a man-in-the-middle network position could intercept unencrypted credentials or steal authentication cookies via XSS script execution.',
    stepsToReproduce: '1. Send a request to https://api.internal-sandbox.local/v1/auth.\n2. Observe Set-Cookie: token=xyz; Path=/ without HttpOnly or Secure.\n3. Note lack of Strict-Transport-Security in HTTP headers.',
    remediation: '1. Inject header: Strict-Transport-Security: max-age=31536000; includeSubDomains; preload\n2. Add flags: Set-Cookie: token=...; Secure; HttpOnly; SameSite=Strict',
    status: 'Validated',
  });
  const [reportSavedMessage, setReportSavedMessage] = useState(false);

  // Recalculate Encoder / Decoder Output
  useEffect(() => {
    if (!codecInput) {
      setCodecOutput('');
      return;
    }
    try {
      if (codecMode === 'encode') {
        if (codecAlgo === 'base64') setCodecOutput(encodeBase64(codecInput));
        else if (codecAlgo === 'hex') setCodecOutput(encodeHex(codecInput));
        else if (codecAlgo === 'url') setCodecOutput(encodeURIComponent(codecInput));
        else if (codecAlgo === 'rot13') setCodecOutput(rot13(codecInput));
      } else {
        if (codecAlgo === 'base64') setCodecOutput(decodeBase64(codecInput));
        else if (codecAlgo === 'hex') setCodecOutput(decodeHex(codecInput));
        else if (codecAlgo === 'url') setCodecOutput(decodeURIComponent(codecInput));
        else if (codecAlgo === 'rot13') setCodecOutput(rot13(codecInput));
      }
    } catch {
      setCodecOutput(codecMode === 'decode' ? `Error: Invalid ${codecAlgo.toUpperCase()} string to decode` : 'Error processing input');
    }
  }, [codecInput, codecAlgo, codecMode]);

  // Recalculate Hashes
  useEffect(() => {
    let isCancelled = false;
    const runHashes = async () => {
      if (!hashInput) {
        setHashes({ sha256: '', sha512: '', sha1: '', md5: '' });
        return;
      }
      const s256 = await computeCryptoHash('SHA-256', hashInput);
      const s512 = await computeCryptoHash('SHA-512', hashInput);
      const s1 = await computeCryptoHash('SHA-1', hashInput);
      const m = md5(hashInput);

      if (!isCancelled) {
        setHashes({ sha256: s256, sha512: s512, sha1: s1, md5: m });
      }
    };
    runHashes();
    return () => {
      isCancelled = true;
    };
  }, [hashInput]);

  // Subnet Calculation Effect
  useEffect(() => {
    try {
      const res = calculateSubnet(subnetIp, subnetCidr);
      setSubnetResult(res);
      setSubnetError(null);
    } catch (err: unknown) {
      setSubnetResult(null);
      setSubnetError(err instanceof Error ? err.message : 'Invalid subnet parameter');
    }
  }, [subnetIp, subnetCidr]);

  // DNS Inspector Effect
  useEffect(() => {
    setDnsResults(queryDnsSimulator(dnsDomain, dnsFilter));
  }, [dnsDomain, dnsFilter]);

  // Header Auditor Effect
  useEffect(() => {
    setHeaderAuditResult(analyzeHttpHeaders(rawHeadersInput));
  }, [rawHeadersInput]);

  // Compare Checksum
  useEffect(() => {
    if (!checksumToCompare.trim()) {
      setChecksumMatch(null);
      return;
    }
    const clean = checksumToCompare.trim().toLowerCase();
    const match =
      clean === hashes.sha256.toLowerCase() ||
      clean === hashes.sha512.toLowerCase() ||
      clean === hashes.sha1.toLowerCase() ||
      clean === hashes.md5.toLowerCase();
    setChecksumMatch(match);
  }, [checksumToCompare, hashes]);

  const handleDecode = () => {
    soundEffects.playKeyClick();
    setCodecMode('decode');
  };

  const handleSwapCodec = () => {
    soundEffects.playKeyClick();
    const prevOutput = codecOutput;
    setCodecMode((prev) => (prev === 'encode' ? 'decode' : 'encode'));
    setCodecInput(prevOutput);
  };

  const handleCopyText = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    soundEffects.playKeyClick();
    if (type === 'codec') {
      setCopiedCodec(true);
      setTimeout(() => setCopiedCodec(false), 2000);
    } else {
      setCopiedHashKey(type);
      setTimeout(() => setCopiedHashKey(null), 2000);
    }
  };

  const entropyData = analyzePasswordEntropy(passInput);

  const handleSaveReport = (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects.playSuccess();
    const newReport: SecurityReport = {
      ...reportForm,
      id: `rep-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };

    saveSecurityReport(newReport);
    onReportSaved(newReport);
    setReportSavedMessage(true);
    setTimeout(() => setReportSavedMessage(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-xl bg-[#0c1218] border border-[#1b2634]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100 font-mono">
              {t.utilities.title}
            </h1>
          </div>
          <p className="text-xs text-slate-400">{t.utilities.subtitle}</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-1 p-1 rounded-lg bg-[#080d12] border border-[#1a2634] text-xs font-mono">
          <button
            onClick={() => { soundEffects.playKeyClick(); setActiveTab('encoder'); }}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'encoder' ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.utilities.encoderDecoder}
          </button>
          <button
            onClick={() => { soundEffects.playKeyClick(); setActiveTab('hasher'); }}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'hasher' ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.utilities.hasher}
          </button>
          <button
            onClick={() => { soundEffects.playKeyClick(); setActiveTab('entropy'); }}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'entropy' ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.utilities.passwordEntropy}
          </button>
          <button
            onClick={() => { soundEffects.playKeyClick(); setActiveTab('subnet'); }}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'subnet' ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Subnet Calculator
          </button>
          <button
            onClick={() => { soundEffects.playKeyClick(); setActiveTab('dns'); }}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'dns' ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            DNS Inspector
          </button>
          <button
            onClick={() => { soundEffects.playKeyClick(); setActiveTab('headers'); }}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'headers' ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            HTTP Header Auditor
          </button>
          <button
            onClick={() => { soundEffects.playKeyClick(); setActiveTab('report'); }}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'report' ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.utilities.reportGenerator}
          </button>
        </div>
      </div>

      {/* Tab 1: Text Encoder & Decoder */}
      {activeTab === 'encoder' && (
        <div className="p-5 rounded-xl bg-[#0c1218] border border-[#1b2634] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1b2634] pb-3">
            <div className="flex flex-wrap items-center gap-3">
              {/* Mode Toggle */}
              <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[#080d12] border border-[#1a2634] text-xs font-mono">
                <button
                  onClick={() => { soundEffects.playKeyClick(); setCodecMode('encode'); }}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    codecMode === 'encode'
                      ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Encode
                </button>
                <button
                  onClick={() => { soundEffects.playKeyClick(); setCodecMode('decode'); }}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    codecMode === 'decode'
                      ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Decode
                </button>
              </div>

              {/* Algorithm Selector */}
              <div className="flex items-center gap-1.5 font-mono text-xs">
                {(['base64', 'hex', 'url', 'rot13'] as const).map((algo) => (
                  <button
                    key={algo}
                    onClick={() => {
                      soundEffects.playKeyClick();
                      setCodecAlgo(algo);
                    }}
                    className={`px-2.5 py-1 rounded uppercase font-semibold transition-colors ${
                      codecAlgo === algo
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-[#080d12] text-slate-400 border border-[#1a2634]'
                    }`}
                  >
                    {algo}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSwapCodec}
                className="px-3 py-1.5 rounded-lg bg-[#14202c] hover:bg-[#1a2c3d] text-slate-200 border border-[#233547] text-xs font-mono flex items-center gap-1.5"
                title="Swap Input & Output"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Swap & Invert</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                {t.utilities.input}
              </label>
              <textarea
                rows={8}
                value={codecInput}
                onChange={(e) => setCodecInput(e.target.value)}
                placeholder="Type or paste payload text..."
                className="w-full bg-[#080d12] border border-[#1b2734] rounded-lg p-3 font-mono text-xs text-slate-200 focus:outline-hidden focus:border-emerald-500/40"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
                  {t.utilities.output} ({codecAlgo})
                </label>
                <button
                  onClick={() => handleCopyText(codecOutput, 'codec')}
                  className="text-xs font-mono text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
                >
                  {copiedCodec ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{t.utilities.copy}</span>
                    </>
                  )}
                </button>
              </div>
              <textarea
                readOnly
                rows={8}
                value={codecOutput}
                className="w-full bg-[#080d12] border border-[#1b2734] rounded-lg p-3 font-mono text-xs text-emerald-300 focus:outline-hidden"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Cryptographic Hasher */}
      {activeTab === 'hasher' && (
        <div className="p-5 rounded-xl bg-[#0c1218] border border-[#1b2634] space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Input Payload to Hash (Web Crypto API)
            </label>
            <input
              type="text"
              value={hashInput}
              onChange={(e) => setHashInput(e.target.value)}
              placeholder="Enter text to generate cryptographic hashes..."
              className="w-full bg-[#080d12] border border-[#1b2734] rounded-lg px-3.5 py-2.5 font-mono text-xs sm:text-sm text-slate-200 focus:outline-hidden focus:border-emerald-500/40"
            />
          </div>

          <div className="space-y-2.5">
            {[
              { label: 'SHA-256 (NIST Standard)', val: hashes.sha256, key: 'sha256' },
              { label: 'SHA-512 (High Security)', val: hashes.sha512, key: 'sha512' },
              { label: 'SHA-1 (Legacy / Deprecated)', val: hashes.sha1, key: 'sha1' },
              { label: 'MD5 (Checksums Only / Insecure for Passwords)', val: hashes.md5, key: 'md5' },
            ].map((item) => (
              <div
                key={item.key}
                className="p-3 rounded-lg bg-[#080d12] border border-[#192430] flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-xs"
              >
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">
                    {item.label}
                  </span>
                  <span className="text-slate-200 break-all select-all">{item.val || '—'}</span>
                </div>

                <button
                  onClick={() => handleCopyText(item.val, item.key)}
                  className="px-2.5 py-1 rounded bg-[#131d27] hover:bg-[#1b2938] text-slate-300 shrink-0 flex items-center gap-1 self-start sm:self-auto"
                >
                  {copiedHashKey === item.key ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>Copy</span>
                </button>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#1b2734] space-y-2">
            <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
              Checksum Verification Check (Paste known hash to compare)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={checksumToCompare}
                onChange={(e) => setChecksumToCompare(e.target.value)}
                placeholder="Paste expected MD5/SHA-256 checksum..."
                className="flex-1 bg-[#080d12] border border-[#1b2734] rounded-lg px-3 py-2 font-mono text-xs text-slate-200 focus:outline-hidden"
              />
              {checksumMatch !== null && (
                <div
                  className={`px-3 py-2 rounded-lg font-mono text-xs flex items-center gap-1.5 ${
                    checksumMatch
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-red-500/20 text-red-300 border border-red-500/40'
                  }`}
                >
                  {checksumMatch ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>MATCH VERIFIED</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <span>MISMATCH</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Password Entropy & Strength */}
      {activeTab === 'entropy' && (
        <div className="p-5 rounded-xl bg-[#0c1218] border border-[#1b2634] space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Test Password / Passphrase
            </label>
            <input
              type="text"
              value={passInput}
              onChange={(e) => setPassInput(e.target.value)}
              placeholder="Enter password..."
              className="w-full bg-[#080d12] border border-[#1b2734] rounded-lg px-3.5 py-2.5 font-mono text-sm text-slate-100 focus:outline-hidden focus:border-emerald-500/40"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-lg bg-[#080d12] border border-[#18232e]">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">
                {t.utilities.entropyScore}
              </span>
              <span className="text-2xl font-bold font-mono text-emerald-400">
                {entropyData.entropy} bits
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-[#080d12] border border-[#18232e]">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">
                Resistance Rating
              </span>
              <span
                className="text-lg font-bold font-mono"
                style={{ color: entropyData.color }}
              >
                {entropyData.strength}
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-[#080d12] border border-[#18232e]">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">
                Estimated Crack Time
              </span>
              <span className="text-xs font-bold font-mono text-slate-200 mt-1 block">
                {entropyData.crackTimeEstimate}
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-[#080d12] border border-[#18232e]">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">
                Character Length
              </span>
              <span className="text-2xl font-bold font-mono text-slate-200">
                {entropyData.length}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            {[
              { label: 'Lowercase (a-z)', valid: entropyData.hasLower },
              { label: 'Uppercase (A-Z)', valid: entropyData.hasUpper },
              { label: 'Numbers (0-9)', valid: entropyData.hasNumber },
              { label: 'Special ($#@%)', valid: entropyData.hasSpecial },
            ].map((c, i) => (
              <div
                key={i}
                className={`p-2 rounded border flex items-center gap-1.5 ${
                  c.valid
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                    : 'bg-slate-900 text-slate-500 border-slate-800'
                }`}
              >
                {c.valid ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <span className="w-3.5 h-3.5 block" />}
                <span>{c.label}</span>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-lg bg-[#090e13] border border-[#18232e] space-y-1 text-xs font-mono">
            <span className="text-emerald-400 uppercase text-[10px] font-semibold block">
              NIST 800-63B & OWASP Recommendations:
            </span>
            <ul className="list-disc list-inside text-slate-300 space-y-0.5">
              {entropyData.advice.map((adv, i) => (
                <li key={i}>{adv}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Tab 4: Subnet Calculator */}
      {activeTab === 'subnet' && (
        <div className="p-5 rounded-xl bg-[#0c1218] border border-[#1b2634] space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">IPv4 Address</label>
              <input
                type="text"
                value={subnetIp}
                onChange={(e) => setSubnetIp(e.target.value)}
                placeholder="e.g. 192.168.1.100"
                className="w-full bg-[#080d12] border border-[#1b2734] rounded-lg px-3.5 py-2 font-mono text-sm text-slate-200 focus:outline-hidden focus:border-emerald-500/40"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">CIDR Prefix (/{subnetCidr})</label>
              <input
                type="number"
                min={0}
                max={32}
                value={subnetCidr}
                onChange={(e) => setSubnetCidr(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-[#080d12] border border-[#1b2734] rounded-lg px-3.5 py-2 font-mono text-sm text-slate-200 focus:outline-hidden focus:border-emerald-500/40"
              />
            </div>
          </div>

          {subnetError && (
            <div className="p-3 rounded-lg bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-mono">
              {subnetError}
            </div>
          )}

          {subnetResult && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-[#080d12] border border-[#18232e]">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Network Address</span>
                  <span className="text-sm font-bold font-mono text-emerald-400">{subnetResult.networkAddress}/{subnetResult.cidr}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#080d12] border border-[#18232e]">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Subnet Mask</span>
                  <span className="text-sm font-bold font-mono text-slate-200">{subnetResult.netmask}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#080d12] border border-[#18232e]">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Usable Host Range</span>
                  <span className="text-xs font-bold font-mono text-slate-200 break-all">{subnetResult.firstUsable} - {subnetResult.lastUsable}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#080d12] border border-[#18232e]">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Usable Hosts</span>
                  <span className="text-sm font-bold font-mono text-emerald-300">{subnetResult.usableHosts.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-[#080d12] border border-[#18232e] grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                <div><span className="text-slate-500">Broadcast Address:</span> <span className="text-slate-200 font-bold">{subnetResult.broadcastAddress}</span></div>
                <div><span className="text-slate-500">Wildcard Mask:</span> <span className="text-slate-200 font-bold">{subnetResult.wildcardMask}</span></div>
                <div><span className="text-slate-500">IP Scope:</span> <span className="text-slate-200 font-bold">{subnetResult.scope}</span></div>
                <div><span className="text-slate-500">Address Class:</span> <span className="text-slate-200 font-bold">{subnetResult.ipClass}</span></div>
                <div className="md:col-span-2"><span className="text-slate-500">Binary Mask:</span> <span className="text-emerald-300">{subnetResult.binaryNetmask}</span></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 5: DNS Inspector */}
      {activeTab === 'dns' && (
        <div className="p-5 rounded-xl bg-[#0c1218] border border-[#1b2634] space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">Domain to Query</label>
              <input
                type="text"
                value={dnsDomain}
                onChange={(e) => setDnsDomain(e.target.value)}
                placeholder="e.g. cyberlab.local or bank.internal"
                className="w-full bg-[#080d12] border border-[#1b2734] rounded-lg px-3.5 py-2 font-mono text-xs text-slate-200 focus:outline-hidden focus:border-emerald-500/40"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">Record Type</label>
              <select
                value={dnsFilter}
                onChange={(e) => setDnsFilter(e.target.value)}
                className="w-full bg-[#080d12] border border-[#1b2734] rounded-lg px-3 py-2 font-mono text-xs text-slate-200"
              >
                <option value="ALL">ALL (Any Record)</option>
                <option value="A">A (IPv4)</option>
                <option value="AAAA">AAAA (IPv6)</option>
                <option value="MX">MX (Mail Exchange)</option>
                <option value="TXT">TXT (SPF / DMARC)</option>
                <option value="NS">NS (Nameserver)</option>
                <option value="SOA">SOA (Authority)</option>
                <option value="CNAME">CNAME (Alias)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            {dnsResults.map((rec, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-[#080d12] border border-[#18232e] flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                      {rec.type}
                    </span>
                    <span className="text-slate-400 text-xs">{rec.name}</span>
                    <span className="text-slate-600 text-[10px]">TTL {rec.ttl}s</span>
                  </div>
                  <div className="text-slate-200 break-all select-all">{rec.value}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{rec.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: HTTP Header Auditor */}
      {activeTab === 'headers' && (
        <div className="p-5 rounded-xl bg-[#0c1218] border border-[#1b2634] space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
              Paste Raw HTTP Response Headers to Audit
            </label>
            <textarea
              rows={6}
              value={rawHeadersInput}
              onChange={(e) => setRawHeadersInput(e.target.value)}
              placeholder="Paste raw HTTP response headers..."
              className="w-full bg-[#080d12] border border-[#1b2734] rounded-lg p-3 font-mono text-xs text-slate-200 focus:outline-hidden focus:border-emerald-500/40"
            />
          </div>

          {/* Audit Score Card */}
          <div className="p-4 rounded-lg bg-[#080d12] border border-[#18232e] flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-slate-400 block uppercase">Security Compliance Score</span>
              <span className="text-2xl font-bold font-mono text-emerald-400">{headerAuditResult.score} / 100</span>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-slate-400 block uppercase">Posture Grade</span>
              <span className={`text-2xl font-bold font-mono ${
                headerAuditResult.grade.startsWith('A') ? 'text-emerald-400' : headerAuditResult.grade === 'B' ? 'text-blue-400' : 'text-amber-400'
              }`}>
                {headerAuditResult.grade}
              </span>
            </div>
          </div>

          {/* Findings List */}
          <div className="space-y-2">
            {headerAuditResult.findings.map((f, i) => (
              <div
                key={i}
                className={`p-3.5 rounded-lg border font-mono text-xs space-y-1 ${
                  f.status === 'pass'
                    ? 'bg-emerald-500/5 border-emerald-500/20'
                    : f.status === 'warning'
                    ? 'bg-amber-500/5 border-amber-500/20'
                    : 'bg-red-500/5 border-red-500/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">{f.header}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    f.status === 'pass' ? 'bg-emerald-500/20 text-emerald-300' : f.status === 'warning' ? 'bg-amber-500/20 text-amber-300' : 'bg-red-500/20 text-red-300'
                  }`}>
                    {f.status}
                  </span>
                </div>
                {f.value && <div className="text-slate-400 text-[11px] truncate">Current: {f.value}</div>}
                <div className="text-slate-300 text-[11px]">{f.impact}</div>
                <div className="text-emerald-400 text-[11px] font-semibold">{f.recommendation}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 7: Security Report Generator */}
      {activeTab === 'report' && (
        <form onSubmit={handleSaveReport} className="p-5 rounded-xl bg-[#0c1218] border border-[#1b2634] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1b2634] pb-3">
            <div>
              <h3 className="font-mono text-sm font-bold text-slate-100">
                Authorized Penetration Testing Vulnerability Template
              </h3>
              <p className="text-xs text-slate-400">
                Document findings following professional reporting standards.
              </p>
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{t.utilities.generateReport}</span>
            </button>
          </div>

          {reportSavedMessage && (
            <div className="p-3 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Vulnerability report successfully saved to platform Reports & Audits repository!</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-mono text-slate-400">Finding Title</label>
              <input
                type="text"
                value={reportForm.title}
                onChange={(e) => setReportForm({ ...reportForm, title: e.target.value })}
                className="w-full bg-[#080d12] border border-[#1b2734] rounded-lg px-3 py-2 font-mono text-xs text-slate-200 focus:outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400">Severity</label>
              <select
                value={reportForm.severity}
                onChange={(e) => setReportForm({ ...reportForm, severity: e.target.value as SecurityReport['severity'] })}
                className="w-full bg-[#080d12] border border-[#1b2634] rounded-lg px-3 py-2 font-mono text-xs text-slate-200"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
                <option value="Info">Info</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400">Affected Asset / URL</label>
              <input
                type="text"
                value={reportForm.asset}
                onChange={(e) => setReportForm({ ...reportForm, asset: e.target.value })}
                className="w-full bg-[#080d12] border border-[#1b2734] rounded-lg px-3 py-2 font-mono text-xs text-slate-200 focus:outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400">CWE / CVE Identifier & CVSS</label>
              <input
                type="text"
                value={reportForm.cveOrCwe}
                onChange={(e) => setReportForm({ ...reportForm, cveOrCwe: e.target.value })}
                className="w-full bg-[#080d12] border border-[#1b2734] rounded-lg px-3 py-2 font-mono text-xs text-slate-200 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-400">Description & Technical Analysis</label>
            <textarea
              rows={3}
              value={reportForm.description}
              onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
              className="w-full bg-[#080d12] border border-[#1b2734] rounded-lg p-2.5 font-mono text-xs text-slate-200 focus:outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-400">Steps to Reproduce (PoC)</label>
            <textarea
              rows={3}
              value={reportForm.stepsToReproduce}
              onChange={(e) => setReportForm({ ...reportForm, stepsToReproduce: e.target.value })}
              className="w-full bg-[#080d12] border border-[#1b2734] rounded-lg p-2.5 font-mono text-xs text-slate-200 focus:outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-400">Remediation Guidance</label>
            <textarea
              rows={3}
              value={reportForm.remediation}
              onChange={(e) => setReportForm({ ...reportForm, remediation: e.target.value })}
              className="w-full bg-[#080d12] border border-[#1b2734] rounded-lg p-2.5 font-mono text-xs text-slate-200 focus:outline-hidden"
            />
          </div>
        </form>
      )}
    </div>
  );
};
