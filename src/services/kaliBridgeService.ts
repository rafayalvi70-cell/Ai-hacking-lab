/**
 * Kali Linux Companion Bridge Service
 * Optional client integration for local/remote Kali Linux daemon.
 * Default: DISABLED (Standalone Cloud Mode).
 */

export interface ToolCheckResult {
  installed: boolean;
  path?: string;
  version?: string;
  exitCode?: number;
  rawOutput?: string;
  checkedAt: string;
}

export interface CommandExecutionResult {
  success: boolean;
  exitCode: number;
  stdout: string;
  stderr: string;
}

class KaliBridgeService {
  private bridgeUrl: string = 'http://127.0.0.1:4444';
  private pairingToken: string = '';
  private enabled: boolean = false;

  constructor() {
    try {
      const storedEnabled = localStorage.getItem('rh_kali_bridge_enabled');
      this.enabled = storedEnabled === 'true';

      const storedUrl = localStorage.getItem('rh_kali_bridge_url');
      if (storedUrl) this.bridgeUrl = storedUrl;

      const storedToken = localStorage.getItem('rh_kali_pairing_token');
      if (storedToken) this.pairingToken = storedToken;
    } catch {
      this.enabled = false;
    }
  }

  public isBridgeEnabled(): boolean {
    return this.enabled;
  }

  public setBridgeEnabled(val: boolean) {
    this.enabled = val;
    try {
      localStorage.setItem('rh_kali_bridge_enabled', String(val));
    } catch {
      // ignore
    }
  }

  public setBridgeUrl(url: string) {
    this.bridgeUrl = url.replace(/\/$/, '');
    try {
      localStorage.setItem('rh_kali_bridge_url', this.bridgeUrl);
    } catch {
      // ignore
    }
  }

  public getBridgeUrl(): string {
    return this.bridgeUrl;
  }

  public setPairingToken(token: string) {
    this.pairingToken = token;
    try {
      localStorage.setItem('rh_kali_pairing_token', token);
    } catch {
      // ignore
    }
  }

  public getPairingToken(): string {
    return this.pairingToken;
  }

  /**
   * Check if daemon is running. Returns false immediately if bridge is disabled.
   */
  public async checkHealth(): Promise<boolean> {
    if (!this.enabled) {
      return false;
    }
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const res = await fetch(`${this.bridgeUrl}/health`, {
        method: 'GET',
        headers: this.pairingToken ? { 'X-Pairing-Token': this.pairingToken } : {},
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return res.ok;
    } catch {
      return false;
    }
  }

  /**
   * Check tool installation on host Kali machine
   */
  public async checkToolInstallation(binaryName: string): Promise<ToolCheckResult> {
    if (!this.enabled) {
      return {
        installed: false,
        checkedAt: new Date().toISOString(),
        rawOutput: 'Optional Kali companion bridge is currently disabled in Settings.',
      };
    }

    const cleanBinary = binaryName.split(' ')[0].toLowerCase().trim();
    try {
      const isLive = await this.checkHealth();
      if (!isLive) {
        return {
          installed: false,
          checkedAt: new Date().toISOString(),
          rawOutput: `Bridge daemon offline (${this.bridgeUrl})`,
        };
      }

      const res = await fetch(`${this.bridgeUrl}/api/check-tool`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.pairingToken ? { 'X-Pairing-Token': this.pairingToken } : {}),
        },
        body: JSON.stringify({ binary: cleanBinary }),
      });

      if (res.ok) {
        const data = await res.json();
        return {
          installed: !!data.installed,
          path: data.path || `/usr/bin/${cleanBinary}`,
          version: data.version || `${cleanBinary} (detected)`,
          exitCode: data.exitCode ?? 0,
          rawOutput: data.output || '',
          checkedAt: new Date().toISOString(),
        };
      }
    } catch {
      // Fallback
    }

    return {
      installed: false,
      checkedAt: new Date().toISOString(),
      rawOutput: 'Kali companion service unreachable.',
    };
  }

  /**
   * Execute command via bridge (requires explicit human confirmation & enabled bridge)
   */
  public async executeCommand(command: string): Promise<CommandExecutionResult> {
    if (!this.enabled) {
      return {
        success: false,
        exitCode: 1,
        stdout: '',
        stderr: 'Kali companion bridge is disabled. Enable it in Settings to execute local commands.',
      };
    }

    try {
      const res = await fetch(`${this.bridgeUrl}/api/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.pairingToken ? { 'X-Pairing-Token': this.pairingToken } : {}),
        },
        body: JSON.stringify({ command }),
      });

      if (res.ok) {
        const data = await res.json();
        return {
          success: data.exitCode === 0,
          exitCode: data.exitCode ?? 0,
          stdout: data.stdout || data.output || '',
          stderr: data.stderr || '',
        };
      }
    } catch (err: unknown) {
      const e = err as Error;
      return {
        success: false,
        exitCode: 1,
        stdout: '',
        stderr: e.message || 'Failed to connect to Kali companion daemon.',
      };
    }

    return {
      success: false,
      exitCode: 1,
      stdout: '',
      stderr: 'Kali companion daemon returned an error.',
    };
  }
}

export const kaliBridgeService = new KaliBridgeService();
