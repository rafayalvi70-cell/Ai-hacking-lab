/**
 * RAFAY HACKING LAB — Remote & Guided Terminal Provider Architecture
 * Mode A: Guided Learning Terminal (Educational Simulator)
 * Mode B: Real Remote Browser Terminal (Cloud WebSocket/SSH Adapter)
 */

export interface TerminalSession {
  sessionId: string;
  providerName: string;
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
  websocketUrl?: string;
  expiresAt?: string;
  message?: string;
}

export interface RemoteTerminalProvider {
  name: string;
  isAvailable(): Promise<boolean>;
  createSession(userId?: string): Promise<TerminalSession>;
  sendInput(sessionId: string, input: string): Promise<void>;
  terminateSession(sessionId: string): Promise<void>;
}

/**
 * Mode A: Educational Terminal Simulator Provider (100% Free & Standalone)
 */
export class StandaloneSimulatedTerminalProvider implements RemoteTerminalProvider {
  public name = 'Guided Educational Simulator (Free Cloud Mode)';

  public async isAvailable(): Promise<boolean> {
    return true; // Always available out-of-the-box
  }

  public async createSession(): Promise<TerminalSession> {
    return {
      sessionId: `sim-term-${Date.now()}`,
      providerName: this.name,
      status: 'connected',
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
      message: 'Connected to Guided Educational Terminal Simulator.',
    };
  }

  public async sendInput(_sessionId: string, _input: string): Promise<void> {
    // Input handled client-side safely without eval
  }

  public async terminateSession(_sessionId: string): Promise<void> {
    // Clean up
  }
}

/**
 * Mode B: Cloud Remote Terminal Provider Adapter Interface
 * Replace with real WebSocket / Cloud Container URL when configured.
 */
export class CloudRemoteTerminalProvider implements RemoteTerminalProvider {
  public name = 'Cloud Ephemeral Container Terminal';
  private endpointUrl: string | null = null;

  constructor(endpointUrl?: string) {
    this.endpointUrl = endpointUrl || (import.meta as any).env?.VITE_CLOUD_TERMINAL_WS_URL || null;
  }

  public async isAvailable(): Promise<boolean> {
    return !!this.endpointUrl;
  }

  public async createSession(userId?: string): Promise<TerminalSession> {
    if (!this.endpointUrl) {
      return {
        sessionId: '',
        providerName: this.name,
        status: 'error',
        message: 'Cloud remote terminal provider unconfigured. Set VITE_CLOUD_TERMINAL_WS_URL in environment.',
      };
    }

    try {
      const res = await fetch('/api/terminal/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userId || 'anonymous' }),
      });
      const data = await res.json();
      return {
        sessionId: data.sessionId,
        providerName: this.name,
        status: 'connected',
        websocketUrl: data.websocketUrl,
        expiresAt: data.expiresAt,
      };
    } catch {
      return {
        sessionId: '',
        providerName: this.name,
        status: 'error',
        message: 'Failed to establish cloud remote terminal session.',
      };
    }
  }

  public async sendInput(sessionId: string, input: string): Promise<void> {
    if (!sessionId) return;
    await fetch(`/api/terminal/session/${sessionId}/input`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input }),
    });
  }

  public async terminateSession(sessionId: string): Promise<void> {
    if (!sessionId) return;
    await fetch(`/api/terminal/session/${sessionId}/terminate`, {
      method: 'POST',
    });
  }
}

export const defaultSimulatedProvider = new StandaloneSimulatedTerminalProvider();
export const defaultCloudProvider = new CloudRemoteTerminalProvider();
