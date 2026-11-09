/**
 * RAFAY HACKING LAB — Cloud Docker Lab Manager Provider Interface (Phase 4)
 * Provider-neutral architecture supporting local Docker, Cloud Container Instances, or Guided Fallback.
 */

export interface LabDefinition {
  id: 'juice-shop' | 'dvwa' | 'webgoat';
  name: string;
  image: string;
  defaultPort: number;
  memoryLimit: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface LabSession {
  sessionId: string;
  labId: 'juice-shop' | 'dvwa' | 'webgoat';
  labName: string;
  targetUrl: string;
  status: 'running' | 'stopped' | 'starting' | 'error' | 'not_configured';
  allocatedMemory: string;
  createdAt: string;
  expiresAt?: string;
  message?: string;
}

export interface LabProvider {
  name: string;
  checkAvailability(): Promise<{ available: boolean; daemonRunning: boolean; message: string }>;
  createSession(labId: 'juice-shop' | 'dvwa' | 'webgoat'): Promise<LabSession>;
  getSessionStatus(labId: 'juice-shop' | 'dvwa' | 'webgoat'): Promise<LabSession>;
  getSessionLogs(labId: 'juice-shop' | 'dvwa' | 'webgoat'): Promise<string>;
  stopSession(labId: 'juice-shop' | 'dvwa' | 'webgoat'): Promise<boolean>;
  cleanupExpiredSessions(): Promise<number>;
}

export const LAB_CATALOGUE: Record<'juice-shop' | 'dvwa' | 'webgoat', LabDefinition> = {
  'juice-shop': {
    id: 'juice-shop',
    name: 'OWASP Juice Shop',
    image: 'bkimminich/juice-shop',
    defaultPort: 3001,
    memoryLimit: '512m',
    category: 'Modern SPA Security',
    difficulty: 'Beginner',
    description: 'Sophisticated intentionally insecure web application featuring OWASP Top 10 vulnerabilities (SQLi, XSS, Broken Access Control, CSRF).',
  },
  dvwa: {
    id: 'dvwa',
    name: 'Damn Vulnerable Web App (DVWA)',
    image: 'vulnerables/web-dvwa',
    defaultPort: 8080,
    memoryLimit: '512m',
    category: 'PHP/MySQL Exploitation',
    difficulty: 'Beginner',
    description: 'PHP/MySQL web app designed to test legal security assessment tools and practice manual parameter injection.',
  },
  webgoat: {
    id: 'webgoat',
    name: 'OWASP WebGoat',
    image: 'owasp/webgoat',
    defaultPort: 8088,
    memoryLimit: '512m',
    category: 'Enterprise Java Security',
    difficulty: 'Intermediate',
    description: 'Deliberately insecure application maintained by OWASP designed to teach web application security lessons step-by-step.',
  },
};

/**
 * Standard Backend API Lab Provider Implementation
 */
export class BackendApiLabProvider implements LabProvider {
  public name = 'Controlled Backend Lab Manager (Local / Serverless Adapter)';

  public async checkAvailability(): Promise<{ available: boolean; daemonRunning: boolean; message: string }> {
    try {
      const res = await fetch('/api/docker/status');
      if (res.ok) {
        const data = await res.json();
        return {
          available: !!data.available,
          daemonRunning: !!data.daemonRunning,
          message: data.message || (data.daemonRunning ? 'Host Docker daemon is active.' : 'Docker daemon inactive.'),
        };
      }
    } catch {
      // Fallback
    }
    return {
      available: false,
      daemonRunning: false,
      message: 'Cloud lab provider backend endpoint unavailable. Guided learning walkthroughs remain 100% functional.',
    };
  }

  public async createSession(labId: 'juice-shop' | 'dvwa' | 'webgoat'): Promise<LabSession> {
    const labDef = LAB_CATALOGUE[labId];
    try {
      const res = await fetch('/api/docker/start-lab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ labId }),
      });
      const data = await res.json();
      if (data.success) {
        return {
          sessionId: data.containerId || `session-${labId}-${Date.now()}`,
          labId,
          labName: labDef.name,
          targetUrl: data.url || `http://127.0.0.1:${labDef.defaultPort}`,
          status: 'running',
          allocatedMemory: labDef.memoryLimit,
          createdAt: new Date().toISOString(),
          message: data.message,
        };
      } else {
        return {
          sessionId: '',
          labId,
          labName: labDef.name,
          targetUrl: '',
          status: 'error',
          allocatedMemory: labDef.memoryLimit,
          createdAt: new Date().toISOString(),
          message: data.error || 'Failed to initialize container session.',
        };
      }
    } catch (err: unknown) {
      const e = err as Error;
      return {
        sessionId: '',
        labId,
        labName: labDef.name,
        targetUrl: '',
        status: 'not_configured',
        allocatedMemory: labDef.memoryLimit,
        createdAt: new Date().toISOString(),
        message: e.message || 'Cloud container provider unconfigured.',
      };
    }
  }

  public async getSessionStatus(labId: 'juice-shop' | 'dvwa' | 'webgoat'): Promise<LabSession> {
    const labDef = LAB_CATALOGUE[labId];
    const avail = await this.checkAvailability();

    if (!avail.daemonRunning) {
      return {
        sessionId: '',
        labId,
        labName: labDef.name,
        targetUrl: `http://127.0.0.1:${labDef.defaultPort}`,
        status: 'not_configured',
        allocatedMemory: labDef.memoryLimit,
        createdAt: new Date().toISOString(),
        message: 'Cloud Docker provider is not active on host.',
      };
    }

    try {
      const res = await fetch('/api/docker/status');
      const data = await res.json();
      const labInfo = data.labs?.[labId];
      const isOnline = labInfo?.status === 'Online';

      return {
        sessionId: labInfo?.containerName || `session-${labId}`,
        labId,
        labName: labDef.name,
        targetUrl: labInfo?.url || `http://127.0.0.1:${labDef.defaultPort}`,
        status: isOnline ? 'running' : 'stopped',
        allocatedMemory: labDef.memoryLimit,
        createdAt: new Date().toISOString(),
      };
    } catch {
      return {
        sessionId: '',
        labId,
        labName: labDef.name,
        targetUrl: '',
        status: 'error',
        allocatedMemory: labDef.memoryLimit,
        createdAt: new Date().toISOString(),
      };
    }
  }

  public async getSessionLogs(labId: 'juice-shop' | 'dvwa' | 'webgoat'): Promise<string> {
    try {
      const res = await fetch('/api/docker/container-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ labId }),
      });
      const data = await res.json();
      return data.logs || 'No recent container logs available.';
    } catch {
      return 'Cloud container provider unreachable.';
    }
  }

  public async stopSession(labId: 'juice-shop' | 'dvwa' | 'webgoat'): Promise<boolean> {
    try {
      const res = await fetch('/api/docker/stop-lab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ labId }),
      });
      const data = await res.json();
      return !!data.success;
    } catch {
      return false;
    }
  }

  public async cleanupExpiredSessions(): Promise<number> {
    // Backend automatically enforces single active lab & resource policies
    return 0;
  }
}

export const defaultLabProvider = new BackendApiLabProvider();
