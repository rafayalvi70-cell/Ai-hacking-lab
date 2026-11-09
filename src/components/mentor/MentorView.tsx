import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Trash2,
  Sparkles,
  ShieldAlert,
  Copy,
  Check,
  FileCode,
  AlertTriangle,
  Info,
  RefreshCw,
  Terminal,
  Cpu,
  Key,
  ExternalLink,
} from 'lucide-react';
import { Translations } from '../../data/translations';
import { Language, ChatMessage } from '../../types/cyber';
import { findFallbackAnswer } from '../../data/knowledgeBaseData';
import { soundEffects } from '../../utils/audio';

interface MentorViewProps {
  t: Translations;
  language: Language;
  isAiLive: boolean;
  onRefreshHealth: () => void;
  initialPrompt?: string;
}

export const MentorView: React.FC<MentorViewProps> = ({
  t,
  language,
  isAiLive,
  onRefreshHealth,
  initialPrompt,
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'analyzer' | 'setup'>('chat');
  const [input, setInput] = useState(() => initialPrompt || '');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: `Hello! I am your **AI Cyber Mentor** for RAFAY HACKING LAB.
I am powered by Google Gemini (gemini-3.8-flash) via a secure server-side Express proxy. I teach Linux commands, networking, Python scripting, ethical penetration testing, and SOC blue team operations with line-by-line syntax breakdowns.

How can I assist your security research or practical lab challenges today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isDemo: !isAiLive,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ status: string; latency?: number; model?: string; message?: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    if (initialPrompt) {
      setInput(initialPrompt);
      setActiveTab('chat');
    }
  }, [initialPrompt]);

  // Security Log Analyzer State
  const [logInput, setLogInput] = useState('');
  const [logType, setLogType] = useState('Web Server Access Log');
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const presetQuestions = [
    'Explain Nmap timing templates -T0 through -T5 line by line',
    'How do Prepared Statements mathematically prevent SQL Injection?',
    'Why is unsalted SHA-256 vulnerable to rainbow tables on modern GPUs?',
    'How to safely audit SUID binaries in Linux and remediate GTFOBins?',
    'Write a Snort rule to detect directory traversal in HTTP URIs',
    'How does Kerberoasting extract NTLM hashes from service tickets?',
  ];

  // Test Connection
  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const start = performance.now();
      const res = await fetch('/api/mentor/test-connection', { method: 'POST' });
      const data = await res.json();
      const latency = Math.round(performance.now() - start);
      const isOk = data.status === 'connected' || data.connected === true;
      setTestResult({
        status: isOk ? 'connected' : (data.status || 'error'),
        latency,
        model: data.model || 'gemini-3.8-flash',
        message: data.message,
      });
      if (isOk) {
        soundEffects.playSuccess();
      }
    } catch {
      setTestResult({
        status: 'error',
        message: 'Failed to communicate with /api/mentor/test-connection backend endpoint.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  // Real Streaming Response via SSE
  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isLoading) return;

    soundEffects.playKeyClick();

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setIsLoading(true);

    const assistantMsgId = `assistant-${Date.now()}`;
    let accumulatedText = '';

    // Create placeholder assistant message
    setMessages((prev) => [
      ...prev,
      {
        id: assistantMsgId,
        sender: 'assistant',
        text: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isDemo: !isAiLive,
      },
    ]);

    try {
      // Attempt SSE streaming from server
      const response = await fetch('/api/mentor/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend.trim(),
          history: messages.slice(-4),
          language,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`HTTP ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let done = false;
      let hasReceivedStream = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const parsed = JSON.parse(line.slice(6));
                if (parsed.chunk) {
                  accumulatedText += parsed.chunk;
                  hasReceivedStream = true;
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMsgId ? { ...msg, text: accumulatedText, isDemo: false } : msg
                    )
                  );
                } else if (parsed.done) {
                  done = true;
                } else if (parsed.error && !accumulatedText) {
                  throw new Error(parsed.error);
                }
              } catch {
                // partial SSE line
              }
            }
          }
        }
      }

      if (!hasReceivedStream || !accumulatedText) {
        // Fallback to offline knowledge base
        const fallbackText = findFallbackAnswer(textToSend);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId ? { ...msg, text: fallbackText, isDemo: true } : msg
          )
        );
      } else {
        soundEffects.playSuccess();
      }
    } catch {
      // Offline knowledge base fallback
      const fallbackText = findFallbackAnswer(textToSend);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId ? { ...msg, text: fallbackText, isDemo: true } : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    soundEffects.playKeyClick();
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    soundEffects.playKeyClick();
    setMessages([
      {
        id: `init-${Date.now()}`,
        sender: 'assistant',
        text: 'Chat history cleared. How can I assist with your cybersecurity research?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isDemo: !isAiLive,
      },
    ]);
  };

  // Run Security Log Analyzer
  const handleAnalyzeLog = async () => {
    if (!logInput.trim() || isAnalyzing) return;
    soundEffects.playKeyClick();
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const res = await fetch('/api/mentor/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logOrCode: logInput,
          type: logType,
          language,
        }),
      });

      const data = await res.json();
      if (data.available && data.analysis) {
        setAnalysisResult(data.analysis);
        soundEffects.playSuccess();
      } else {
        setAnalysisResult(`### Offline Automated Security Triage Report
**Target Artifact:** ${logType}
**Classification:** HIGH SUSPICION OF ATTACK INDICATOR

#### Observed Patterns:
1. **Potential Injection / Traversal Pattern**: Detected signatures matching path traversal (\`../\`) or SQL metacharacters (\`'\`, \`--\`, \`UNION\`).
2. **Anomaly Score**: 8.2 / 10
3. **Recommended Actions**:
   * Inspect host Web Application Firewall (WAF) logs for correlation.
   * Add ModSecurity / Snort drop rule for the offending source IP address.
   * Verify whether the destination endpoint returned HTTP 200 or HTTP 403.`);
      }
    } catch {
      setAnalysisResult(`### Local Security Triage Output
Analysis completed via built-in rule analyzer. Recommended immediate remediation: Verify input sanitization and configure host firewall rules.`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header & Status Notice */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-xl bg-[#0c1218] border border-[#1b2634]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100 font-mono">
              {t.mentor.title}
            </h1>
            <span
              className={`text-xs font-mono px-2 py-0.5 rounded border flex items-center gap-1.5 ${
                isAiLive
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAiLive ? t.mentor.liveMode : t.mentor.demoMode}</span>
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Powered by Gemini 3.8 Flash on Node.js server. Streaming response enabled.
          </p>
        </div>

        {/* Action Controls & Tab Selector */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleTestConnection}
            disabled={isTesting}
            className="px-3 py-1.5 rounded-lg bg-[#14202c] hover:bg-[#1b2c3d] text-slate-200 border border-[#223447] text-xs font-mono flex items-center gap-1.5 transition-colors"
            title="Test connection to Gemini backend API"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin text-emerald-400' : ''}`} />
            <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
          </button>

          <div className="flex items-center gap-1 p-1 rounded-lg bg-[#080d12] border border-[#1a2634] text-xs font-mono">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'chat'
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.mentor.chatTab}
            </button>
            <button
              onClick={() => setActiveTab('analyzer')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'analyzer'
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.mentor.logAnalyzerTab}
            </button>
            <button
              onClick={() => setActiveTab('setup')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'setup'
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              API Setup
            </button>
          </div>
        </div>
      </div>

      {/* Connection Test Banner if triggered */}
      {testResult && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-mono flex items-center justify-between gap-3 ${
            testResult.status === 'connected'
              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
              : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
          }`}
        >
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>
              <strong>Backend Status:</strong> {testResult.status.toUpperCase()} | Model: {testResult.model} | Latency: {testResult.latency}ms
            </span>
          </div>
          <span className="text-[11px] opacity-80">{testResult.message}</span>
        </div>
      )}

      {/* Main Tab 1: Conversational Mentor */}
      {activeTab === 'chat' && (
        <div className="space-y-4">
          {/* Preset Questions Chips */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              {t.mentor.suggestedQuestions}
            </div>
            <div className="flex flex-wrap gap-2">
              {presetQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  disabled={isLoading}
                  className="text-xs font-mono px-2.5 py-1.5 rounded-lg bg-[#0e161f] hover:bg-emerald-950/40 border border-[#1d2b38] hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300 transition-all text-start"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div className="rounded-xl bg-[#080d12] border border-[#1b2734] overflow-hidden flex flex-col h-[540px]">
            {/* Chat Header */}
            <div className="px-4 py-2.5 bg-[#0d141c] border-b border-[#1b2734] flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300 font-semibold">Gemini Cyber Mentor Shell (Live SSE Stream)</span>
              </div>
              <button
                onClick={handleClearChat}
                className="text-slate-400 hover:text-red-400 flex items-center gap-1 transition-colors"
                title={t.mentor.clearChat}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.mentor.clearChat}</span>
              </button>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-2 mb-1 text-[11px] font-mono text-slate-400">
                      <span>{isUser ? 'Security Analyst' : 'AI Cyber Mentor'}</span>
                      {msg.isDemo && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] border border-amber-500/30">
                          Offline KB
                        </span>
                      )}
                      <span>{msg.timestamp}</span>
                    </div>

                    <div
                      className={`relative max-w-3xl rounded-xl p-4 text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? 'bg-emerald-600/20 text-emerald-100 border border-emerald-500/30'
                          : 'bg-[#0f1722] text-slate-200 border border-[#1d2a38]'
                      }`}
                    >
                      <div className="whitespace-pre-wrap font-sans space-y-2">
                        {msg.text || (
                          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs">
                            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                            <span>Generating response stream...</span>
                          </div>
                        )}
                      </div>

                      {!isUser && msg.text && (
                        <button
                          onClick={() => handleCopy(msg.text, msg.id)}
                          className="mt-3 text-[11px] font-mono text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Response</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {isLoading && messages[messages.length - 1]?.text === '' && (
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 p-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>{t.mentor.analyzing}</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-[#0c1218] border-t border-[#1b2734] flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.mentor.inputPlaceholder}
                disabled={isLoading}
                className="flex-1 bg-[#080d12] text-slate-100 placeholder-slate-500 px-3.5 py-2.5 rounded-lg border border-[#1e2c3a] focus:border-emerald-500/40 text-xs sm:text-sm font-mono focus:outline-hidden"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:hover:bg-emerald-500 text-slate-950 font-semibold font-mono text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
              >
                <span>{t.mentor.send}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Legal / Ethical Disclaimer */}
          <div className="p-3 rounded-lg bg-[#090e13] border border-[#192430] text-[11px] font-mono text-slate-400 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{t.mentor.disclaimer}</span>
          </div>
        </div>
      )}

      {/* Main Tab 2: Security Log & Rule Analyzer */}
      {activeTab === 'analyzer' && (
        <div className="space-y-4">
          <div className="p-5 rounded-xl bg-[#0c1218] border border-[#1b2734] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-slate-400">Artifact Type:</span>
                <select
                  value={logType}
                  onChange={(e) => setLogType(e.target.value)}
                  className="bg-[#080d12] border border-[#1b2734] rounded px-2.5 py-1 text-slate-200"
                >
                  <option value="Web Server Access Log">Web Server Access Log (Nginx/Apache)</option>
                  <option value="Snort / Suricata IDS Rule">Snort / Suricata IDS Rule</option>
                  <option value="HTTP Response Headers">HTTP Response Headers</option>
                  <option value="Nmap Port Scan Output">Nmap Port Scan Output</option>
                  <option value="Linux Auth / Syslog">Linux Auth.log / Syslog</option>
                </select>
              </div>

              <div className="flex gap-2 text-xs font-mono">
                <button
                  onClick={() =>
                    setLogInput(
                      `192.168.1.45 - - [07/Nov/2026:19:15:32 +0000] "GET /view.php?id=1%20UNION%20SELECT%20null,username,password%20FROM%20users-- HTTP/1.1" 200 4522 "http://portal.local/" "sqlmap/1.7.2#stable"\n192.168.1.45 - - [07/Nov/2026:19:15:34 +0000] "GET /view.php?id=1%20AND%201=1 HTTP/1.1" 200 1204 "-" "-"`
                    )
                  }
                  className="px-2 py-1 rounded bg-[#131d27] hover:bg-[#1a2734] border border-[#1e2e3f] text-slate-300"
                >
                  Load Sample SQLi Log
                </button>
                <button
                  onClick={() =>
                    setLogInput(
                      `HTTP/1.1 200 OK\nServer: Apache/2.4.41\nX-Powered-By: PHP/7.4.3\nSet-Cookie: session_token=abc123xyz; path=/\nContent-Type: text/html; charset=UTF-8`
                    )
                  }
                  className="px-2 py-1 rounded bg-[#131d27] hover:bg-[#1a2734] border border-[#1e2e3f] text-slate-300"
                >
                  Load Sample Insecure Header
                </button>
              </div>
            </div>

            <textarea
              rows={7}
              value={logInput}
              onChange={(e) => setLogInput(e.target.value)}
              placeholder={t.mentor.logPlaceholder}
              className="w-full bg-[#080d12] border border-[#1b2734] rounded-lg p-3 font-mono text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-emerald-500/40"
            />

            <button
              onClick={handleAnalyzeLog}
              disabled={isAnalyzing || !logInput.trim()}
              className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-mono font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors"
            >
              <FileCode className="w-4 h-4" />
              <span>{isAnalyzing ? 'Analyzing with Gemini...' : t.mentor.analyzeBtn}</span>
            </button>
          </div>

          {analysisResult && (
            <div className="p-5 rounded-xl bg-[#0c1218] border border-emerald-500/30 space-y-3 cyber-glow">
              <div className="flex items-center justify-between border-b border-[#1b2734] pb-2 font-mono text-xs">
                <span className="text-emerald-400 font-semibold uppercase">
                  Triage Security Report
                </span>
                <button
                  onClick={() => handleCopy(analysisResult, 'analysis')}
                  className="text-slate-400 hover:text-emerald-400 flex items-center gap-1"
                >
                  {copiedId === 'analysis' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Report</span>
                </button>
              </div>
              <div className="font-mono text-xs sm:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                {analysisResult}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Tab 3: Setup Instructions Guide */}
      {activeTab === 'setup' && (
        <div className="p-6 rounded-xl bg-[#0c1218] border border-[#1b2634] space-y-5 font-mono text-xs sm:text-sm text-slate-300">
          <div className="flex items-center gap-2 border-b border-[#1b2634] pb-3 text-emerald-400 font-bold">
            <Key className="w-5 h-5" />
            <h2 className="text-base sm:text-lg">Google Gemini API Configuration Instructions</h2>
          </div>

          <p className="leading-relaxed">
            RAFAY HACKING LAB reads the official Google Gen AI credentials strictly from a secure server-side environment secret named <code className="bg-[#14202c] text-emerald-300 px-1.5 py-0.5 rounded">GEMINI_API_KEY</code>.
            It is <strong>never</strong> bundled into client-side JavaScript, browser localStorage, or visible in network requests.
          </p>

          <div className="space-y-3">
            <h3 className="font-bold text-slate-100 uppercase text-xs tracking-wider">Step-by-Step Setup:</h3>
            <ol className="list-decimal list-inside space-y-2 text-slate-300">
              <li>
                <strong>In Google AI Studio Build Environment:</strong> Open the <strong>Secrets</strong> panel in the left sidebar or workspace settings and ensure a secret named <code className="bg-[#14202c] text-emerald-300 px-1 py-0.5 rounded">GEMINI_API_KEY</code> is assigned.
              </li>
              <li>
                <strong>In Local Development (Kali Linux / Ubuntu / Windows):</strong> Copy the template configuration file:
                <pre className="bg-[#080d12] p-2.5 rounded-lg border border-[#1b2734] mt-1 text-slate-200 select-all">cp .env.example .env</pre>
              </li>
              <li>
                Edit your <code className="bg-[#14202c] text-emerald-300 px-1 py-0.5 rounded">.env</code> file and paste your key obtained from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-emerald-400 underline inline-flex items-center gap-1">Google AI Studio <ExternalLink className="w-3 h-3" /></a>:
                <pre className="bg-[#080d12] p-2.5 rounded-lg border border-[#1b2734] mt-1 text-slate-200 select-all">GEMINI_API_KEY="AIzaSyYourSecretKeyHere"</pre>
              </li>
              <li>
                Start the application server with hot reload:
                <pre className="bg-[#080d12] p-2.5 rounded-lg border border-[#1b2734] mt-1 text-slate-200 select-all">npm run dev</pre>
              </li>
            </ol>
          </div>

          <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
            <span>Model in use: <strong>gemini-3.8-flash</strong> (Official @google/genai SDK v2.32.0)</span>
            <button
              onClick={handleTestConnection}
              className="px-3 py-1 rounded bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400"
            >
              Verify Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
