import crypto from 'crypto';
import { supabaseDbService } from './supabaseDb';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: 'admin' | 'user';
  tier: 'free' | 'pro';
  createdAt: string;
}

export interface UserProgressData {
  userId: string;
  completedLessons: string[];
  completedMilestones: string[];
  bookmarkedTools: string[];
  ctfPoints: number;
  solvedCtfs: string[];
  certificates: {
    certId: string;
    courseName: string;
    issuedAt: string;
    score: number;
  }[];
  portfolioProjects: {
    id: string;
    title: string;
    category: string;
    date: string;
    summary: string;
  }[];
  updatedAt: string;
}

export interface CtfChallenge {
  id: string;
  title: string;
  category: 'Web Security' | 'Linux Fundamentals' | 'Cryptography' | 'Forensics' | 'Network Security';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  points: number;
  description: string;
  hint?: string;
  flagHash: string; // SHA-256 hash of valid flag
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  userId: string;
  userEmail: string;
  action: string;
  details: string;
  ipAddress?: string;
}

class AuthAndDataStore {
  private users: Map<string, UserAccount> = new Map();
  private userProgress: Map<string, UserProgressData> = new Map();
  private sessions: Map<string, string> = new Map(); // token -> userId
  private auditLogs: AuditLogItem[] = [];

  private ctfChallenges: Map<string, CtfChallenge> = new Map([
    [
      'ctf-web-1',
      {
        id: 'ctf-web-1',
        title: 'Hidden Admin Portal Secret',
        category: 'Web Security',
        difficulty: 'Beginner',
        points: 100,
        description: 'Inspect client-side JavaScript route bundles or directory paths to locate the admin secret flag.',
        hint: 'Check path variations or search for RH{...} in client assets.',
        flagHash: crypto.createHash('sha256').update('RH{JUICE_SCORE_BOARD_UNCOVERED_2026}').digest('hex'),
      },
    ],
    [
      'ctf-sqli-1',
      {
        id: 'ctf-sqli-1',
        title: 'SQL Injection Authentication Bypass',
        category: 'Web Security',
        difficulty: 'Beginner',
        points: 150,
        description: 'Bypass login authentication parameter using classic boolean SQL injection.',
        hint: "Use classic OR condition like ' OR 1=1 --",
        flagHash: crypto.createHash('sha256').update('RH{SQLI_AUTH_BYPASS_SUCCESS}').digest('hex'),
      },
    ],
    [
      'ctf-cmd-1',
      {
        id: 'ctf-cmd-1',
        title: 'Command Execution Parameter Escape',
        category: 'Linux Fundamentals',
        difficulty: 'Intermediate',
        points: 200,
        description: 'Escape parameter bounds in the ping diagnostic input form to read environment flag.',
        hint: 'Use semicolon (;) or pipe (|) chaining.',
        flagHash: crypto.createHash('sha256').update('RH{CMD_INJECTION_PASSWD_EXPOSED}').digest('hex'),
      },
    ],
    [
      'ctf-crypto-1',
      {
        id: 'ctf-crypto-1',
        title: 'Base64 & Hex Hybrid Decoding',
        category: 'Cryptography',
        difficulty: 'Beginner',
        points: 100,
        description: 'Decode the double-encoded payload: `Ukh7Q1JZUFRPMF9ERUNPREVEXzIwMjZ9`.',
        hint: 'Try standard Base64 decoding.',
        flagHash: crypto.createHash('sha256').update('RH{CRYPTO0_DECODED_2026}').digest('hex'),
      },
    ],
  ]);

  constructor() {
    // Seed default admin account securely (Username: admin@rafayhackinglab.com)
    const adminSalt = crypto.randomBytes(16).toString('hex');
    const adminHash = this.hashPassword('AdminRHPass2026!', adminSalt);
    const adminId = 'user-admin-01';

    this.users.set(adminId, {
      id: adminId,
      name: 'Rafay Alvi (Lab Director)',
      email: 'admin@rafayhackinglab.com',
      passwordHash: adminHash,
      salt: adminSalt,
      role: 'admin',
      tier: 'pro',
      createdAt: new Date().toISOString(),
    });

    this.userProgress.set(adminId, {
      userId: adminId,
      completedLessons: ['lesson-1', 'lesson-2', 'lesson-3'],
      completedMilestones: ['m1', 'm2'],
      bookmarkedTools: ['nmap', 'wireshark', 'burp_suite'],
      ctfPoints: 550,
      solvedCtfs: ['ctf-web-1', 'ctf-sqli-1', 'ctf-crypto-1'],
      certificates: [
        {
          certId: 'RH-CERT-2026-X892F',
          courseName: 'Certified Cyber Penetration Tester Fundamentals',
          issuedAt: new Date().toISOString(),
          score: 98,
        },
      ],
      portfolioProjects: [
        {
          id: 'proj-1',
          title: 'Automated Port & Vulnerability Assessment',
          category: 'Network Recon',
          date: '2026-11-09',
          summary: 'Executed authorized Nmap scans and authored executive remediation report.',
        },
      ],
      updatedAt: new Date().toISOString(),
    });

    this.logAudit('SYSTEM', 'admin@rafayhackinglab.com', 'INITIALIZE', 'Cloud Auth and DB Store Initialized');
  }

  public hashPassword(password: string, salt: string): string {
    return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  }

  public async registerUserAsync(
    name: string,
    email: string,
    password: string,
    role: 'admin' | 'user' = 'user'
  ): Promise<{ user: Omit<UserAccount, 'passwordHash' | 'salt'>; token: string }> {
    const cleanEmail = email.toLowerCase().trim();

    // Check Supabase first if connected
    const existingSupabase = await supabaseDbService.findUserByEmail(cleanEmail);
    if (existingSupabase) {
      throw new Error('An account with this email address already exists.');
    }

    // Check memory store
    for (const u of this.users.values()) {
      if (u.email === cleanEmail) {
        throw new Error('An account with this email address already exists.');
      }
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = this.hashPassword(password, salt);

    // Save user via Supabase service if connected
    let newUser: UserAccount;
    if (supabaseDbService.getStatus().isConnected) {
      const created = await supabaseDbService.createUser(name, cleanEmail, passwordHash, salt, role, 'free');
      newUser = {
        id: created.id,
        name: created.name,
        email: created.email,
        passwordHash: created.passwordHash,
        salt: created.salt,
        role: created.role,
        tier: created.tier,
        createdAt: created.createdAt,
      };
    } else {
      const id = `user-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      newUser = {
        id,
        name: name.trim(),
        email: cleanEmail,
        passwordHash,
        salt,
        role,
        tier: 'free',
        createdAt: new Date().toISOString(),
      };
    }

    this.users.set(newUser.id, newUser);

    const initialProgress: UserProgressData = {
      userId: newUser.id,
      completedLessons: [],
      completedMilestones: [],
      bookmarkedTools: [],
      ctfPoints: 0,
      solvedCtfs: [],
      certificates: [],
      portfolioProjects: [],
      updatedAt: new Date().toISOString(),
    };
    this.userProgress.set(newUser.id, initialProgress);

    const token = crypto.randomBytes(32).toString('hex');
    this.sessions.set(token, newUser.id);

    // Persist session to Supabase
    await supabaseDbService.createSession(newUser.id, token, 72);

    this.logAudit(newUser.id, cleanEmail, 'USER_REGISTER', `New ${role} account registered`);

    const { passwordHash: _, salt: __, ...userPublic } = newUser;
    return { user: userPublic, token };
  }

  // Synchronous wrapper for backwards compatibility
  public registerUser(name: string, email: string, password: string, role: 'admin' | 'user' = 'user'): { user: Omit<UserAccount, 'passwordHash' | 'salt'>; token: string } {
    const cleanEmail = email.toLowerCase().trim();
    for (const u of this.users.values()) {
      if (u.email === cleanEmail) {
        throw new Error('An account with this email address already exists.');
      }
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = this.hashPassword(password, salt);
    const id = `user-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const newUser: UserAccount = {
      id,
      name: name.trim(),
      email: cleanEmail,
      passwordHash,
      salt,
      role,
      tier: 'free',
      createdAt: new Date().toISOString(),
    };

    this.users.set(id, newUser);

    this.userProgress.set(id, {
      userId: id,
      completedLessons: [],
      completedMilestones: [],
      bookmarkedTools: [],
      ctfPoints: 0,
      solvedCtfs: [],
      certificates: [],
      portfolioProjects: [],
      updatedAt: new Date().toISOString(),
    });

    const token = crypto.randomBytes(32).toString('hex');
    this.sessions.set(token, id);

    // Async sync to Supabase in background
    if (supabaseDbService.getStatus().isConnected) {
      supabaseDbService.createUser(name, cleanEmail, passwordHash, salt, role, 'free')
        .then((dbUser) => supabaseDbService.createSession(dbUser.id, token))
        .catch((err) => console.error('[Supabase] Sync create user error:', err));
    }

    this.logAudit(id, cleanEmail, 'USER_REGISTER', `New ${role} account registered`);

    const { passwordHash: _, salt: __, ...userPublic } = newUser;
    return { user: userPublic, token };
  }

  public async loginUserAsync(email: string, password: string): Promise<{ user: Omit<UserAccount, 'passwordHash' | 'salt'>; token: string }> {
    const cleanEmail = email.toLowerCase().trim();
    let targetUser: UserAccount | null = null;

    // Try Supabase first if connected
    if (supabaseDbService.getStatus().isConnected) {
      const dbUser = await supabaseDbService.findUserByEmail(cleanEmail);
      if (dbUser) {
        targetUser = {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          passwordHash: dbUser.passwordHash,
          salt: dbUser.salt,
          role: dbUser.role,
          tier: dbUser.tier,
          createdAt: dbUser.createdAt,
        };
      }
    }

    // Fallback to memory
    if (!targetUser) {
      for (const u of this.users.values()) {
        if (u.email === cleanEmail) {
          targetUser = u;
          break;
        }
      }
    }

    if (!targetUser) {
      throw new Error('Invalid email address or password.');
    }

    const inputHash = this.hashPassword(password, targetUser.salt);
    if (crypto.timingSafeEqual(Buffer.from(inputHash), Buffer.from(targetUser.passwordHash))) {
      const token = crypto.randomBytes(32).toString('hex');
      this.sessions.set(token, targetUser.id);
      this.users.set(targetUser.id, targetUser);

      // Persist session to Supabase
      await supabaseDbService.createSession(targetUser.id, token, 72);

      this.logAudit(targetUser.id, cleanEmail, 'USER_LOGIN', 'User authenticated successfully');

      const { passwordHash: _, salt: __, ...userPublic } = targetUser;
      return { user: userPublic, token };
    } else {
      this.logAudit(targetUser.id, cleanEmail, 'LOGIN_FAILED', 'Invalid password attempt');
      throw new Error('Invalid email address or password.');
    }
  }

  public loginUser(email: string, password: string): { user: Omit<UserAccount, 'passwordHash' | 'salt'>; token: string } {
    const cleanEmail = email.toLowerCase().trim();
    let targetUser: UserAccount | null = null;

    for (const u of this.users.values()) {
      if (u.email === cleanEmail) {
        targetUser = u;
        break;
      }
    }

    if (!targetUser) {
      throw new Error('Invalid email address or password.');
    }

    const inputHash = this.hashPassword(password, targetUser.salt);
    if (crypto.timingSafeEqual(Buffer.from(inputHash), Buffer.from(targetUser.passwordHash))) {
      const token = crypto.randomBytes(32).toString('hex');
      this.sessions.set(token, targetUser.id);

      if (supabaseDbService.getStatus().isConnected) {
        supabaseDbService.createSession(targetUser.id, token, 72).catch(() => {});
      }

      this.logAudit(targetUser.id, cleanEmail, 'USER_LOGIN', 'User authenticated successfully');

      const { passwordHash: _, salt: __, ...userPublic } = targetUser;
      return { user: userPublic, token };
    } else {
      this.logAudit(targetUser.id, cleanEmail, 'LOGIN_FAILED', 'Invalid password attempt');
      throw new Error('Invalid email address or password.');
    }
  }

  public async getUserByTokenAsync(token: string): Promise<Omit<UserAccount, 'passwordHash' | 'salt'> | null> {
    // Check Supabase first if connected
    if (supabaseDbService.getStatus().isConnected) {
      const dbUser = await supabaseDbService.getUserBySessionToken(token);
      if (dbUser) {
        const { passwordHash: _, salt: __, ...userPublic } = dbUser;
        return userPublic;
      }
    }

    // Check memory session
    return this.getUserByToken(token);
  }

  public getUserByToken(token: string): Omit<UserAccount, 'passwordHash' | 'salt'> | null {
    const userId = this.sessions.get(token);
    if (!userId) return null;
    const u = this.users.get(userId);
    if (!u) return null;
    const { passwordHash: _, salt: __, ...userPublic } = u;
    return userPublic;
  }

  public logoutUser(token: string) {
    const userId = this.sessions.get(token);
    if (userId) {
      const u = this.users.get(userId);
      this.logAudit(userId, u?.email || 'unknown', 'USER_LOGOUT', 'User signed out');
      this.sessions.delete(token);
    }
    if (supabaseDbService.getStatus().isConnected) {
      supabaseDbService.revokeSession(token).catch(() => {});
    }
  }

  public async getUserProgressAsync(userId: string): Promise<UserProgressData> {
    if (supabaseDbService.getStatus().isConnected) {
      const dbProgress = await supabaseDbService.getUserProgress(userId);
      if (dbProgress) {
        this.userProgress.set(userId, dbProgress);
        return dbProgress;
      }
    }
    return this.getUserProgress(userId);
  }

  public getUserProgress(userId: string): UserProgressData {
    let prog = this.userProgress.get(userId);
    if (!prog) {
      prog = {
        userId,
        completedLessons: [],
        completedMilestones: [],
        bookmarkedTools: [],
        ctfPoints: 0,
        solvedCtfs: [],
        certificates: [],
        portfolioProjects: [],
        updatedAt: new Date().toISOString(),
      };
      this.userProgress.set(userId, prog);
    }
    return prog;
  }

  public async saveUserProgressAsync(userId: string, data: Partial<UserProgressData>): Promise<UserProgressData> {
    const current = this.getUserProgress(userId);
    const updated: UserProgressData = {
      ...current,
      ...data,
      userId,
      updatedAt: new Date().toISOString(),
    };
    this.userProgress.set(userId, updated);

    if (supabaseDbService.getStatus().isConnected) {
      await supabaseDbService.saveUserProgress(userId, updated);
    }

    return updated;
  }

  public saveUserProgress(userId: string, data: Partial<UserProgressData>): UserProgressData {
    const current = this.getUserProgress(userId);
    const updated: UserProgressData = {
      ...current,
      ...data,
      userId,
      updatedAt: new Date().toISOString(),
    };
    this.userProgress.set(userId, updated);

    if (supabaseDbService.getStatus().isConnected) {
      supabaseDbService.saveUserProgress(userId, updated).catch(() => {});
    }

    return updated;
  }

  public verifyAndSolveCtf(userId: string, challengeId: string, inputFlag: string): { success: boolean; points: number; message: string; totalPoints: number } {
    const challenge = this.ctfChallenges.get(challengeId);
    if (!challenge) {
      return { success: false, points: 0, message: 'Invalid CTF challenge ID', totalPoints: 0 };
    }

    const prog = this.getUserProgress(userId);
    if (prog.solvedCtfs.includes(challengeId)) {
      return { success: false, points: 0, message: 'You have already solved this challenge!', totalPoints: prog.ctfPoints };
    }

    const cleanInput = inputFlag.trim();
    const inputHash = crypto.createHash('sha256').update(cleanInput).digest('hex');

    if (crypto.timingSafeEqual(Buffer.from(inputHash), Buffer.from(challenge.flagHash))) {
      prog.solvedCtfs.push(challengeId);
      prog.ctfPoints += challenge.points;
      prog.updatedAt = new Date().toISOString();
      this.userProgress.set(userId, prog);

      if (supabaseDbService.getStatus().isConnected) {
        supabaseDbService.saveUserProgress(userId, prog).catch(() => {});
      }

      const u = this.users.get(userId);
      this.logAudit(userId, u?.email || 'unknown', 'CTF_SOLVED', `Solved challenge ${challenge.title} (+${challenge.points} pts)`);

      return {
        success: true,
        points: challenge.points,
        message: `Correct Flag! +${challenge.points} Points Earned.`,
        totalPoints: prog.ctfPoints,
      };
    } else {
      return {
        success: false,
        points: 0,
        message: 'Incorrect flag. Check formatting and try again.',
        totalPoints: prog.ctfPoints,
      };
    }
  }

  public issueCertificate(userId: string, courseName: string, score: number): { certId: string; courseName: string; issuedAt: string; score: number } {
    const certId = `RH-CERT-${new Date().getFullYear()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const certObj = {
      certId,
      courseName,
      issuedAt: new Date().toISOString(),
      score,
    };

    const prog = this.getUserProgress(userId);
    prog.certificates.push(certObj);
    this.userProgress.set(userId, prog);

    if (supabaseDbService.getStatus().isConnected) {
      supabaseDbService.saveUserProgress(userId, prog).catch(() => {});
    }

    const u = this.users.get(userId);
    this.logAudit(userId, u?.email || 'unknown', 'CERT_ISSUED', `Certificate ${certId} issued for ${courseName}`);

    return certObj;
  }

  public verifyCertificate(certId: string): { valid: boolean; certificate?: any; user?: string } {
    for (const [userId, prog] of this.userProgress.entries()) {
      const match = prog.certificates.find((c) => c.certId.toUpperCase() === certId.toUpperCase());
      if (match) {
        const u = this.users.get(userId);
        return {
          valid: true,
          certificate: match,
          user: u ? u.name : 'Verified Student',
        };
      }
    }
    return { valid: false };
  }

  public getCtfChallenges(): Omit<CtfChallenge, 'flagHash'>[] {
    return Array.from(this.ctfChallenges.values()).map(({ flagHash: _, ...rest }) => rest);
  }

  public logAudit(userId: string, userEmail: string, action: string, details: string, ipAddress?: string) {
    const item: AuditLogItem = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      userId,
      userEmail,
      action,
      details,
      ipAddress,
    };
    this.auditLogs.unshift(item);
    if (this.auditLogs.length > 500) {
      this.auditLogs = this.auditLogs.slice(0, 500);
    }

    if (supabaseDbService.getStatus().isConnected) {
      supabaseDbService.logAudit(userId, userEmail, action, details, ipAddress).catch(() => {});
    }
  }

  public getAuditLogs(limit: number = 100): AuditLogItem[] {
    return this.auditLogs.slice(0, limit);
  }

  public getAllUsersForAdmin(): Omit<UserAccount, 'passwordHash' | 'salt'>[] {
    return Array.from(this.users.values()).map(({ passwordHash: _, salt: __, ...userPublic }) => userPublic);
  }
}

export const authAndDataStore = new AuthAndDataStore();
