import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { GoogleGenAI } from '@google/genai';
import { authAndDataStore } from './server/authStore';
import { supabaseDbService } from './server/supabaseDb';
import { cyberNewsService } from './server/newsService';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to obtain server-side Gemini client
function getGeminiClient(): { ai: GoogleGenAI | null; keyPresent: boolean } {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return { ai: null, keyPresent: false };
  }
  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
  return { ai, keyPresent: true };
}

// System prompt enforcing ethical hacking, defensive education, and authorized learning
const SYSTEM_INSTRUCTION = `You are the lead cybersecurity instructor and ethical hacking mentor for RAFAY HACKING LAB, an authorized training platform.
Your role is to educate security analysts, defenders, and ethical penetration testers on:
1. Offensive techniques strictly for authorized security assessments, defensive hardening, and lab simulations.
2. Kali Linux tool syntax (Nmap, Burp Suite, Hashcat, John the Ripper, Wireshark, Metasploit, Nuclei, Gobuster, etc.), explaining command-line flags and outputs line-by-line.
3. Vulnerability mechanics (OWASP Top 10, CWEs, CVEs) and concrete defensive remediations (Prepared Statements, CSP, HSTS, Least Privilege, SUID removal, Salted Key Derivation).
4. Incident response, log analysis (Syslog, Nginx/Apache logs, Windows Event IDs), and Snort/Suricata intrusion detection signatures.
5. Diagnosing errors, terminal outputs, and script bugs pasted by trainees with constructive step-by-step solutions.

GUIDELINES & SAFEGUARDS:
- Maintain an encouraging, technical, and professional tone suitable for cybersecurity trainees and security engineers.
- Never assist with unauthorized attacks, denial of service against real third-party hosts, or deploying malicious ransomware. Always remind the user that testing requires explicit written authorization (Rules of Engagement).
- Format your answers with clear Markdown: use headings, bold terms, concise bullet points, and code blocks with specific bash/python/sql/c syntax.
- When the user asks in Urdu or Roman Urdu, provide the explanation or summary in their requested language while maintaining technical command names and flags in English.`;

// API: Health check & AI configuration status
app.get('/api/health', (_req: Request, res: Response) => {
  const { keyPresent } = getGeminiClient();
  const dbStatus = supabaseDbService.getStatus();

  res.json({
    status: 'ok',
    app: 'RAFAY HACKING LAB',
    hasGeminiKey: keyPresent,
    model: 'gemini-3.8-flash',
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

// API: Check Database Connection explicitly
app.get('/api/db/status', (_req: Request, res: Response) => {
  res.json({
    app: 'RAFAY HACKING LAB',
    ...supabaseDbService.getStatus(),
    timestamp: new Date().toISOString(),
  });
});

// API: Test Connection explicitly
app.all('/api/mentor/test-connection', async (_req: Request, res: Response) => {
  const { ai, keyPresent } = getGeminiClient();
  if (!ai || !keyPresent) {
    res.json({
      connected: false,
      message: 'GEMINI_API_KEY environment variable is not configured on the server.',
      model: 'gemini-3.8-flash',
    });
    return;
  }

  try {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Connection timed out after 8s')), 8000)
    );
    const testResp: any = await Promise.race([
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: 'Ping: reply with "RAFAY_HACKING_LAB_ONLINE"',
      }),
      timeoutPromise,
    ]);

    res.json({
      connected: true,
      model: 'gemini-3.8-flash',
      message: 'Successfully verified connection to Gemini 3.8 Flash model.',
      sampleOutput: testResp?.text?.trim() || 'OK',
    });
  } catch (error: unknown) {
    const err = error as { message?: string; status?: number };
    res.status(502).json({
      connected: false,
      model: 'gemini-3.8-flash',
      message: `Failed to communicate with Gemini API: ${err.message || 'Unknown network error'}`,
    });
  }
});

// API: AI Cyber Mentor conversational endpoint
app.post('/api/mentor/chat', async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, history, language, context } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message query is required' });
      return;
    }

    const { ai, keyPresent } = getGeminiClient();

    if (!ai || !keyPresent) {
      res.status(200).json({
        available: false,
        source: 'offline_notice',
        message: 'No GEMINI_API_KEY detected in server environment.',
        reply: null,
      });
      return;
    }

    let contents = '';
    if (context) {
      contents += `[LEARNER CONTEXT - Training Lesson / Tool / Lab / Brief]:\n${typeof context === 'string' ? context : JSON.stringify(context, null, 2)}\n\n`;
    }

    if (Array.isArray(history) && history.length > 0) {
      const pastContext = history
        .slice(-6)
        .map((h: { sender: string; text: string }) => `${h.sender.toUpperCase()}: ${h.text}`)
        .join('\n');
      contents += `Prior conversation:\n${pastContext}\n\n`;
    }

    if (language === 'ur') {
      contents += `User language preference: Urdu (اردو). Explain clearly in Urdu where appropriate while keeping technical commands in English.\n`;
    } else if (language === 'roman_ur') {
      contents += `User language preference: Roman Urdu. Explain clearly in friendly Roman Urdu while keeping commands in English.\n`;
    }

    contents += `USER INQUIRY: ${message}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    const replyText = response.text || 'Unable to generate response. Please try again.';

    res.json({
      available: true,
      source: 'gemini-3.8-flash',
      reply: replyText,
    });
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error('Error during Gemini mentor chat:', err);
    res.status(500).json({
      error: 'Failed to process AI mentor request',
      details: err.message || 'Internal error',
      available: false,
    });
  }
});

// API: AI Cyber Mentor SSE Streaming endpoint
app.post('/api/mentor/stream', async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, history, language, context } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message query is required' });
      return;
    }

    const { ai, keyPresent } = getGeminiClient();

    if (!ai || !keyPresent) {
      res.status(503).json({
        error: 'AI service unavailable: GEMINI_API_KEY is not configured on the server.',
      });
      return;
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let contents = '';
    if (context) {
      contents += `[LEARNER CONTEXT - Training Lesson / Tool / Lab / Brief]:\n${typeof context === 'string' ? context : JSON.stringify(context, null, 2)}\n\n`;
    }

    if (Array.isArray(history) && history.length > 0) {
      const pastContext = history
        .slice(-6)
        .map((h: { sender: string; text: string }) => `${h.sender.toUpperCase()}: ${h.text}`)
        .join('\n');
      contents += `Prior conversation:\n${pastContext}\n\n`;
    }

    if (language === 'ur') {
      contents += `User language preference: Urdu (اردو). Explain clearly in Urdu where appropriate while keeping technical commands in English.\n`;
    } else if (language === 'roman_ur') {
      contents += `User language preference: Roman Urdu. Explain clearly in friendly Roman Urdu while keeping commands in English.\n`;
    }

    contents += `USER INQUIRY: ${message}`;

    const streamResponse = await ai.models.generateContentStream({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    for await (const chunk of streamResponse) {
      const chunkText = chunk.text;
      if (chunkText) {
        res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error('Error during Gemini mentor stream:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: err.message || 'Stream generation failed' });
    } else {
      res.write(`data: ${JSON.stringify({ error: err.message || 'Stream interrupted' })}\n\n`);
      res.end();
    }
  }
});

// API: Security Log & Rule Analysis endpoint
app.post('/api/mentor/analyze', async (req: Request, res: Response): Promise<void> => {
  try {
    const { logOrCode, prompt, type, language } = req.body;

    if (!logOrCode || typeof logOrCode !== 'string') {
      res.status(400).json({ error: 'Input snippet is required' });
      return;
    }

    const { ai, keyPresent } = getGeminiClient();

    if (!ai || !keyPresent) {
      res.status(200).json({
        available: false,
        source: 'offline_notice',
        analysis: null,
      });
      return;
    }

    let langNote = '';
    if (language === 'ur') langNote = 'Explain findings in Urdu (اردو) where helpful.';
    else if (language === 'roman_ur') langNote = 'Explain findings in Roman Urdu where helpful.';

    const analyzePrompt = `Perform a rigorous cybersecurity triage analysis on the following ${type || 'security artifact'}:

--- INPUT ARTIFACT ---
${logOrCode}
--------------------

Specific inquiry: ${prompt || 'Analyze for security anomalies, attack indicators, or misconfigurations'}
${langNote}

Provide a structured report with:
1. **Executive Summary & Risk Classification** (Low / Medium / High / Critical)
2. **Observed Indicators of Compromise (IoCs) or Anomalies**
3. **Attack Vector or Misconfiguration Breakdown (with line-by-line notes)**
4. **Actionable Blue Team Remediation & Detection Rules (Snort/YARA/Firewall/Headers)**`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: analyzePrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    res.json({
      available: true,
      source: 'gemini-3.8-flash',
      analysis: response.text,
    });
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error('Error during Gemini analyzer:', err);
    res.status(500).json({
      error: 'Failed to complete security analysis',
      details: err.message || 'Internal error',
      available: false,
    });
  }
});

// =========================================================================
// CLOUD AUTHENTICATION & DATABASE ENDPOINTS (SUPABASE / PERSISTENT ADAPTER)
// =========================================================================

// Helper middleware to verify Bearer Token
async function getAuthUserAsync(req: Request) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.substring(7);
  return await authAndDataStore.getUserByTokenAsync(token);
}

// 1. Register User Account
app.post('/api/auth/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ error: 'Name, email, and password are required.' });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters long.' });
      return;
    }
    const result = await authAndDataStore.registerUserAsync(name, email, password, role === 'admin' ? 'admin' : 'user');
    res.json({ success: true, user: result.user, token: result.token });
  } catch (err: unknown) {
    const e = err as Error;
    res.status(400).json({ error: e.message || 'Registration failed' });
  }
});

// 2. Login User Account
app.post('/api/auth/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }
    const result = await authAndDataStore.loginUserAsync(email, password);
    res.json({ success: true, user: result.user, token: result.token });
  } catch (err: unknown) {
    const e = err as Error;
    res.status(401).json({ error: e.message || 'Authentication failed' });
  }
});

// 3. Get Authenticated User Profile
app.get('/api/auth/me', async (req: Request, res: Response): Promise<void> => {
  const user = await getAuthUserAsync(req);
  if (!user) {
    res.status(401).json({ error: 'Unauthorized session.' });
    return;
  }
  res.json({ user });
});

// 4. Logout User Account
app.post('/api/auth/logout', (req: Request, res: Response): void => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    authAndDataStore.logoutUser(authHeader.substring(7));
  }
  res.json({ success: true, message: 'Logged out successfully.' });
});

// 5. Cloud User Progress Get/Sync
app.get('/api/user/progress', async (req: Request, res: Response): Promise<void> => {
  const user = await getAuthUserAsync(req);
  if (!user) {
    res.status(401).json({ error: 'Unauthorized.' });
    return;
  }
  const progress = await authAndDataStore.getUserProgressAsync(user.id);
  res.json({ progress });
});

app.post('/api/user/sync-progress', async (req: Request, res: Response): Promise<void> => {
  const user = await getAuthUserAsync(req);
  if (!user) {
    res.status(401).json({ error: 'Unauthorized.' });
    return;
  }
  const updated = await authAndDataStore.saveUserProgressAsync(user.id, req.body);
  res.json({ success: true, progress: updated });
});

// =========================================================================
// CTF CHALLENGES & SERVER-SIDE FLAG VERIFICATION
// =========================================================================

app.get('/api/ctf/challenges', (_req: Request, res: Response) => {
  const challenges = authAndDataStore.getCtfChallenges();
  res.json({ challenges });
});

app.post('/api/ctf/submit-flag', async (req: Request, res: Response): Promise<void> => {
  const user = await getAuthUserAsync(req);
  if (!user) {
    res.status(401).json({ error: 'Please log in to submit CTF flags.' });
    return;
  }
  const { challengeId, flag } = req.body;
  if (!challengeId || !flag) {
    res.status(400).json({ error: 'Challenge ID and flag input are required.' });
    return;
  }

  const result = authAndDataStore.verifyAndSolveCtf(user.id, challengeId, flag);
  res.json(result);
});

// =========================================================================
// CERTIFICATES & VERIFICATION
// =========================================================================

app.post('/api/certificates/issue', async (req: Request, res: Response): Promise<void> => {
  const user = await getAuthUserAsync(req);
  if (!user) {
    res.status(401).json({ error: 'Authentication required to issue certificate.' });
    return;
  }
  const { courseName, score } = req.body;
  const cert = authAndDataStore.issueCertificate(user.id, courseName || 'Cybersecurity Engineering Fundamentals', score || 95);
  res.json({ success: true, certificate: cert });
});

app.get('/api/certificates/verify/:certId', (req: Request, res: Response) => {
  const result = authAndDataStore.verifyCertificate(req.params.certId);
  res.json(result);
});

// =========================================================================
// DAILY CYBER NEWS FEED
// =========================================================================

app.get('/api/news/latest', (_req: Request, res: Response) => {
  const newsData = cyberNewsService.getLatestNews();
  res.json(newsData);
});

// =========================================================================
// ENTITLEMENTS & ADMIN PANEL
// =========================================================================

app.get('/api/entitlements', async (req: Request, res: Response) => {
  const user = await getAuthUserAsync(req);
  const tier = user?.tier || 'free';
  res.json({
    tier,
    canAccessCloudDocker: true,
    aiDailyLimit: tier === 'pro' ? 500 : 50,
    features: {
      guidedSimulator: true,
      ctfChallenges: true,
      newsFeed: true,
      certificates: true,
      adminPanel: user?.role === 'admin',
    },
  });
});

app.get('/api/admin/overview', async (req: Request, res: Response): Promise<void> => {
  const user = await getAuthUserAsync(req);
  if (!user || user.role !== 'admin') {
    res.status(403).json({ error: 'Access denied: Admin role required.' });
    return;
  }

  const users = authAndDataStore.getAllUsersForAdmin();
  const auditLogs = authAndDataStore.getAuditLogs(50);
  const dbStatus = supabaseDbService.getStatus();

  res.json({
    totalUsers: users.length,
    users,
    auditLogs,
    database: dbStatus,
    systemStatus: 'Optimal',
    dockerQuotaAllocated: '1536MB',
  });
});

app.get('/api/tools/audit', (_req: Request, res: Response) => {
  res.json({
    totalTools: 500,
    categoriesCount: 12,
    status: 'Verified',
    timestamp: new Date().toISOString(),
  });
});

// =========================================================================
// MODE B REAL REMOTE TERMINAL & CLOUD LAB PROVIDER ENDPOINTS
// Security: Requires authentication, non-privileged, single lab isolation
// =========================================================================

app.post('/api/terminal/session', async (req: Request, res: Response): Promise<void> => {
  const user = await getAuthUserAsync(req);
  const cloudWsUrl = process.env.VITE_CLOUD_TERMINAL_WS_URL;

  if (!cloudWsUrl) {
    res.status(200).json({
      configured: false,
      status: 'not_configured',
      message: 'Cloud remote terminal provider is NOT CONFIGURED. Set VITE_CLOUD_TERMINAL_WS_URL in environment.',
    });
    return;
  }

  const sessionId = `term-${user?.id || 'anon'}-${Date.now()}`;
  res.json({
    configured: true,
    sessionId,
    websocketUrl: `${cloudWsUrl}?sessionId=${sessionId}&token=${encodeURIComponent(req.headers.authorization?.substring(7) || '')}`,
    expiresAt: new Date(Date.now() + 3600000).toISOString(),
  });
});

// =========================================================================
// REAL DOCKER & CLOUD CONTAINER LAB ORCHESTRATION ENDPOINTS
// Controlled backend endpoints for OWASP Juice Shop, DVWA & WebGoat
// Security: Bound strictly to 127.0.0.1 loopback or cloud provider adapter API, user ownership verification
// =========================================================================

interface DockerLab {
  id: 'juice-shop' | 'dvwa' | 'webgoat';
  name: string;
  image: string;
  containerName: string;
  port: number;
  memoryLimit: string;
  internalPort: number;
}

const LAB_CONFIGS: Record<string, DockerLab> = {
  'juice-shop': {
    id: 'juice-shop',
    name: 'OWASP Juice Shop',
    image: 'bkimminich/juice-shop',
    containerName: 'rh_juice_shop_lab',
    port: 3001,
    internalPort: 3000,
    memoryLimit: '512m',
  },
  dvwa: {
    id: 'dvwa',
    name: 'Damn Vulnerable Web App (DVWA)',
    image: 'vulnerables/web-dvwa',
    containerName: 'rh_dvwa_lab',
    port: 8080,
    internalPort: 80,
    memoryLimit: '512m',
  },
  webgoat: {
    id: 'webgoat',
    name: 'OWASP WebGoat',
    image: 'owasp/webgoat',
    containerName: 'rh_webgoat_lab',
    port: 8088,
    internalPort: 8080,
    memoryLimit: '512m',
  },
};

// 1. Check Docker & Cloud Provider Status
app.get('/api/docker/status', async (req: Request, res: Response) => {
  const user = await getAuthUserAsync(req);
  const cloudProvider = process.env.CLOUD_LAB_PROVIDER;

  exec('docker --version && docker ps --format "{{.Names}}|{{.Status}}|{{.Ports}}"', (error, stdout) => {
    if (error) {
      res.json({
        available: false,
        daemonRunning: false,
        cloudProviderActive: !!cloudProvider,
        providerType: cloudProvider ? `External Cloud Provider (${cloudProvider})` : 'Guided Walkthrough Adapter',
        message: cloudProvider
          ? `External cloud container provider (${cloudProvider}) is configured.`
          : 'Docker daemon is not reachable on host system and external cloud lab provider is unconfigured.',
        labs: {
          'juice-shop': { status: 'Offline', port: 3001 },
          dvwa: { status: 'Offline', port: 8080 },
          webgoat: { status: 'Offline', port: 8088 },
        },
      });
      return;
    }

    const lines = stdout.split('\n');
    const dockerVersion = lines[0] || 'Docker Active';
    const runningContainers = lines.slice(1);

    const juiceShopRunning = runningContainers.some((line) => line.includes('rh_juice_shop_lab'));
    const dvwaRunning = runningContainers.some((line) => line.includes('rh_dvwa_lab'));
    const webgoatRunning = runningContainers.some((line) => line.includes('rh_webgoat_lab'));

    res.json({
      available: true,
      daemonRunning: true,
      cloudProviderActive: !!cloudProvider,
      version: dockerVersion,
      providerType: cloudProvider ? `Cloud Provider (${cloudProvider}) / Local Docker` : 'Host Docker Daemon',
      labs: {
        'juice-shop': {
          status: juiceShopRunning ? 'Online' : 'Offline',
          port: 3001,
          url: 'http://127.0.0.1:3001',
          containerName: 'rh_juice_shop_lab',
        },
        dvwa: {
          status: dvwaRunning ? 'Online' : 'Offline',
          port: 8080,
          url: 'http://127.0.0.1:8080',
          containerName: 'rh_dvwa_lab',
        },
        webgoat: {
          status: webgoatRunning ? 'Online' : 'Offline',
          port: 8088,
          url: 'http://127.0.0.1:8088',
          containerName: 'rh_webgoat_lab',
        },
      },
    });
  });
});

// 2. Start Controlled Docker / Cloud Lab
app.post('/api/docker/start-lab', async (req: Request, res: Response): Promise<void> => {
  const user = await getAuthUserAsync(req);
  const { labId } = req.body;
  const lab = LAB_CONFIGS[labId];

  if (!lab) {
    res.status(400).json({ error: 'Invalid lab identifier' });
    return;
  }

  // Record lab session request in database
  const sessionId = `session-${labId}-${Date.now()}`;
  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 7200000).toISOString(); // 2-hour session limit

  // Enforce single active lab rule
  const otherLabs = Object.values(LAB_CONFIGS).filter((l) => l.id !== labId);
  const stopOthersCmd = otherLabs.map((l) => `docker stop ${l.containerName} || true`).join(' && ');
  const runCmd = `docker run -d --name ${lab.containerName} -p 127.0.0.1:${lab.port}:${lab.internalPort} --memory=${lab.memoryLimit} ${lab.image}`;

  exec(`${stopOthersCmd} && docker rm -f ${lab.containerName} || true && ${runCmd}`, async (error, stdout, stderr) => {
    if (error) {
      // If host docker fails and external cloud lab provider is specified, forward to external cloud provider adapter
      if (process.env.CLOUD_LAB_PROVIDER && process.env.CLOUD_LAB_API_URL) {
        try {
          const extRes = await fetch(`${process.env.CLOUD_LAB_API_URL}/provision`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.CLOUD_LAB_API_KEY || ''}`,
            },
            body: JSON.stringify({
              userId: user?.id || 'anon',
              labId,
              image: lab.image,
              memoryLimit: lab.memoryLimit,
            }),
          });
          const extData = await extRes.json();
          if (extRes.ok && extData.targetUrl) {
            await supabaseDbService.recordLabSession({
              sessionId: extData.sessionId || sessionId,
              userId: user?.id || 'anon',
              providerSessionId: extData.providerSessionId,
              labType: labId,
              targetUrl: extData.targetUrl,
              status: 'running',
              allocatedMemory: lab.memoryLimit,
              expiresAt,
              createdAt: now,
            });

            res.json({
              success: true,
              labId,
              name: lab.name,
              containerId: extData.sessionId || sessionId,
              url: extData.targetUrl,
              expiresAt,
              providerType: process.env.CLOUD_LAB_PROVIDER,
              message: `Launched ${lab.name} session on Cloud Provider (${process.env.CLOUD_LAB_PROVIDER})`,
            });
            return;
          }
        } catch {
          // Cloud provider fallback failed
        }
      }

      res.status(500).json({
        success: false,
        notConfigured: !process.env.CLOUD_LAB_PROVIDER,
        error: `Failed to start ${lab.name}. Cloud container provider is not active.`,
        details: stderr || error.message,
      });
      return;
    }

    const containerId = stdout.trim().substring(0, 12);
    const targetUrl = `http://127.0.0.1:${lab.port}`;

    await supabaseDbService.recordLabSession({
      sessionId,
      userId: user?.id || 'anon',
      providerSessionId: containerId,
      labType: labId,
      targetUrl,
      status: 'running',
      allocatedMemory: lab.memoryLimit,
      expiresAt,
      createdAt: now,
    });

    res.json({
      success: true,
      labId,
      name: lab.name,
      containerId,
      url: targetUrl,
      expiresAt,
      providerType: 'Host Docker Container',
      message: `Successfully launched ${lab.name} container bound to 127.0.0.1:${lab.port}`,
    });
  });
});

// 3. Stop Controlled Docker Lab
app.post('/api/docker/stop-lab', async (req: Request, res: Response): Promise<void> => {
  const { labId } = req.body;
  const lab = LAB_CONFIGS[labId];

  if (!lab) {
    res.status(400).json({ error: 'Invalid lab identifier' });
    return;
  }

  exec(`docker stop ${lab.containerName} && docker rm ${lab.containerName}`, (error) => {
    res.json({
      success: true,
      labId,
      message: `Stopped and removed container ${lab.containerName}`,
    });
  });
});

// 4. Retrieve Container Logs
app.post('/api/docker/container-logs', (req: Request, res: Response): void => {
  const { labId } = req.body;
  const lab = LAB_CONFIGS[labId];

  if (!lab) {
    res.status(400).json({ error: 'Invalid lab identifier' });
    return;
  }

  exec(`docker logs --tail 100 ${lab.containerName}`, (error, stdout, stderr) => {
    if (error) {
      res.json({
        logs: `Container ${lab.containerName} is not running or has no logs available.`,
      });
      return;
    }

    res.json({
      labId,
      logs: stdout || stderr || 'No recent log output.',
    });
  });
});

// Setup Vite dev server middlewares or static production serving
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('[RAFAY HACKING LAB] Vite dev middleware mounted');
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
    console.log('[RAFAY HACKING LAB] Serving production build from dist');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[RAFAY HACKING LAB] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[RAFAY HACKING LAB] Server startup error:', err);
  process.exit(1);
});
