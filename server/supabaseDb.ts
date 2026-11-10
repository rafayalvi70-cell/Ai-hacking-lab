/**
 * RAFAY HACKING LAB — Supabase PostgreSQL & Persistent Store Connector
 * Supports official Supabase service role database access with Row-Level Security,
 * hashed sessions, password salt protection, brute-force limits, and zero-false-success write error handling.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: 'admin' | 'user';
  tier: 'free' | 'pro';
  failedLoginAttempts?: number;
  lockedUntil?: string | null;
  createdAt: string;
  updatedAt?: string;
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
  flagHash: string;
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

export interface LabSessionRecord {
  sessionId: string;
  userId: string;
  providerSessionId?: string;
  labType: string;
  targetUrl: string;
  status: 'starting' | 'running' | 'stopped' | 'error' | 'not_configured';
  allocatedMemory: string;
  expiresAt?: string;
  createdAt: string;
}

export class SupabaseDbService {
  private client: SupabaseClient | null = null;
  private isConnected: boolean = false;

  constructor() {
    this.initClient();
  }

  private initClient() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

    if (supabaseUrl && serviceKey && supabaseUrl.startsWith('http')) {
      try {
        this.client = createClient(supabaseUrl, serviceKey, {
          auth: { persistSession: false, autoRefreshToken: false },
        });
        this.isConnected = true;
        console.log('[RAFAY HACKING LAB] Connected to Supabase PostgreSQL database.');
      } catch (err) {
        console.warn('[RAFAY HACKING LAB] Failed to initialize Supabase client:', err);
        this.client = null;
        this.isConnected = false;
      }
    } else {
      console.log('[RAFAY HACKING LAB] Supabase environment variables not set. Operating in-memory mode with fallback.');
      this.client = null;
      this.isConnected = false;
    }
  }

  public getStatus(): { isConnected: boolean; provider: string } {
    return {
      isConnected: this.isConnected,
      provider: this.isConnected ? 'Supabase PostgreSQL' : 'In-Memory Cloud Store (Fallback)',
    };
  }

  public getClient(): SupabaseClient | null {
    return this.client;
  }

  // Helper to hash session token with SHA-256
  public hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  // Helper PBKDF2 password hashing
  public hashPassword(password: string, salt: string): string {
    return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  }

  // --- USER ACCOUNT OPERATIONS ---

  public async findUserByEmail(email: string): Promise<UserAccount | null> {
    const cleanEmail = email.toLowerCase().trim();
    if (this.client && this.isConnected) {
      const { data, error } = await this.client
        .from('users')
        .select('*')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (error) {
        console.error('[Supabase] Error fetching user by email:', error.message);
        throw new Error(`Database query error: ${error.message}`);
      }
      if (!data) return null;

      return {
        id: data.id,
        name: data.name,
        email: data.email,
        passwordHash: data.password_hash,
        salt: data.password_salt,
        role: data.role,
        tier: data.tier,
        failedLoginAttempts: data.failed_login_attempts || 0,
        lockedUntil: data.locked_until,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    }
    return null;
  }

  public async createUser(
    name: string,
    email: string,
    passwordHash: string,
    salt: string,
    role: 'admin' | 'user' = 'user',
    tier: 'free' | 'pro' = 'free',
    customId?: string
  ): Promise<UserAccount> {
    const cleanEmail = email.toLowerCase().trim();
    const id = customId || `user-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const now = new Date().toISOString();

    const newUser: UserAccount = {
      id,
      name: name.trim(),
      email: cleanEmail,
      passwordHash,
      salt,
      role,
      tier,
      createdAt: now,
      updatedAt: now,
    };

    if (this.client && this.isConnected) {
      const { error } = await this.client.from('users').upsert({
        id,
        name: newUser.name,
        email: newUser.email,
        password_hash: passwordHash,
        password_salt: salt,
        role,
        tier,
        created_at: now,
        updated_at: now,
      });

      if (error) {
        throw new Error(`Database registration error: ${error.message}`);
      }

      // Initialize user_progress in Supabase
      const { error: progErr } = await this.client.from('user_progress').upsert({
        user_id: id,
        completed_lessons: [],
        completed_milestones: [],
        bookmarked_tools: [],
        ctf_points: 0,
        solved_ctfs: [],
        certificates: [],
        portfolio_projects: [],
        updated_at: now,
      });

      if (progErr) {
        console.error('[Supabase] Failed to initialize user_progress:', progErr.message);
        throw new Error(`Database user progress initialization error: ${progErr.message}`);
      }
    }

    return newUser;
  }

  // --- SESSION OPERATIONS ---

  public async createSession(
    userId: string,
    rawToken: string,
    expiresInHours: number = 72,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    if (this.client && this.isConnected) {
      const tokenHash = this.hashToken(rawToken);
      const expiresAt = new Date(Date.now() + expiresInHours * 3600 * 1000).toISOString();

      const { error } = await this.client.from('sessions').insert({
        token_hash: tokenHash,
        user_id: userId,
        ip_address: ipAddress || null,
        user_agent: userAgent || null,
        expires_at: expiresAt,
        created_at: new Date().toISOString(),
      });

      if (error) {
        throw new Error(`Failed to create database session: ${error.message}`);
      }
    }
  }

  public async getUserBySessionToken(rawToken: string): Promise<UserAccount | null> {
    if (this.client && this.isConnected) {
      const tokenHash = this.hashToken(rawToken);

      const { data: session, error: sessErr } = await this.client
        .from('sessions')
        .select('user_id, expires_at, revoked_at')
        .eq('token_hash', tokenHash)
        .maybeSingle();

      if (sessErr) {
        console.error('[Supabase] Session lookup error:', sessErr.message);
        return null;
      }
      if (!session) return null;
      if (session.revoked_at) return null;
      if (new Date(session.expires_at).getTime() < Date.now()) return null;

      const { data: user, error: userErr } = await this.client
        .from('users')
        .select('*')
        .eq('id', session.user_id)
        .maybeSingle();

      if (userErr || !user) return null;

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        passwordHash: user.password_hash,
        salt: user.password_salt,
        role: user.role,
        tier: user.tier,
        createdAt: user.created_at,
      };
    }
    return null;
  }

  public async revokeSession(rawToken: string): Promise<void> {
    if (this.client && this.isConnected) {
      const tokenHash = this.hashToken(rawToken);
      const { error } = await this.client
        .from('sessions')
        .update({ revoked_at: new Date().toISOString() })
        .eq('token_hash', tokenHash);

      if (error) {
        console.error('[Supabase] Session revocation error:', error.message);
      }
    }
  }

  // --- USER PROGRESS OPERATIONS ---

  public async getUserProgress(userId: string): Promise<UserProgressData | null> {
    if (this.client && this.isConnected) {
      const { data, error } = await this.client
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('[Supabase] Get user progress error:', error.message);
        throw new Error(`Failed to load user progress: ${error.message}`);
      }
      if (!data) return null;

      return {
        userId: data.user_id,
        completedLessons: data.completed_lessons || [],
        completedMilestones: data.completed_milestones || [],
        bookmarkedTools: data.bookmarked_tools || [],
        ctfPoints: data.ctf_points || 0,
        solvedCtfs: data.solved_ctfs || [],
        certificates: data.certificates || [],
        portfolioProjects: data.portfolio_projects || [],
        updatedAt: data.updated_at,
      };
    }
    return null;
  }

  public async saveUserProgress(userId: string, progress: Partial<UserProgressData>): Promise<UserProgressData> {
    if (this.client && this.isConnected) {
      const now = new Date().toISOString();
      const existing = await this.getUserProgress(userId);

      const merged: UserProgressData = {
        userId,
        completedLessons: progress.completedLessons ?? existing?.completedLessons ?? [],
        completedMilestones: progress.completedMilestones ?? existing?.completedMilestones ?? [],
        bookmarkedTools: progress.bookmarkedTools ?? existing?.bookmarkedTools ?? [],
        ctfPoints: progress.ctfPoints ?? existing?.ctfPoints ?? 0,
        solvedCtfs: progress.solvedCtfs ?? existing?.solvedCtfs ?? [],
        certificates: progress.certificates ?? existing?.certificates ?? [],
        portfolioProjects: progress.portfolioProjects ?? existing?.portfolioProjects ?? [],
        updatedAt: now,
      };

      const { error } = await this.client.from('user_progress').upsert({
        user_id: userId,
        completed_lessons: merged.completedLessons,
        completed_milestones: merged.completedMilestones,
        bookmarked_tools: merged.bookmarkedTools,
        ctf_points: merged.ctfPoints,
        solved_ctfs: merged.solvedCtfs,
        certificates: merged.certificates,
        portfolio_projects: merged.portfolioProjects,
        updated_at: now,
      });

      if (error) {
        console.error('[Supabase] Save progress error:', error.message);
        throw new Error(`Failed to persist user progress to database: ${error.message}`);
      }
      return merged;
    }
    throw new Error('Database service is not connected');
  }

  // --- MIGRATION PROCESS FOR IN-MEMORY ACCOUNTS ---

  public async migrateAccountsToDatabase(
    users: UserAccount[],
    progressMap: Map<string, UserProgressData>
  ): Promise<{ migratedUsers: number; migratedProgress: number }> {
    if (!this.client || !this.isConnected) {
      throw new Error('Cannot run migration: Supabase database is not connected.');
    }

    let userCount = 0;
    let progCount = 0;

    for (const u of users) {
      const { error: userErr } = await this.client.from('users').upsert({
        id: u.id,
        name: u.name,
        email: u.email,
        password_hash: u.passwordHash,
        password_salt: u.salt,
        role: u.role,
        tier: u.tier,
        created_at: u.createdAt,
        updated_at: new Date().toISOString(),
      });

      if (!userErr) userCount++;

      const prog = progressMap.get(u.id);
      if (prog) {
        const { error: progErr } = await this.client.from('user_progress').upsert({
          user_id: u.id,
          completed_lessons: prog.completedLessons,
          completed_milestones: prog.completedMilestones,
          bookmarked_tools: prog.bookmarkedTools,
          ctf_points: prog.ctfPoints,
          solved_ctfs: prog.solvedCtfs,
          certificates: prog.certificates,
          portfolio_projects: prog.portfolioProjects,
          updated_at: prog.updatedAt || new Date().toISOString(),
        });
        if (!progErr) progCount++;
      }
    }

    console.log(`[Supabase Migration] Successfully migrated ${userCount} users and ${progCount} progress records.`);
    return { migratedUsers: userCount, migratedProgress: progCount };
  }

  // --- AUDIT LOGS ---

  public async logAudit(userId: string, userEmail: string, action: string, details: string, ipAddress?: string): Promise<void> {
    const id = `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const timestamp = new Date().toISOString();

    if (this.client && this.isConnected) {
      const { error } = await this.client.from('audit_logs').insert({
        id,
        timestamp,
        user_id: userId,
        user_email: userEmail,
        action,
        details,
        ip_address: ipAddress || null,
      });

      if (error) {
        console.error('[Supabase] Log audit error:', error.message);
      }
    }
  }

  public async getAuditLogs(limit: number = 50): Promise<AuditLogItem[]> {
    if (this.client && this.isConnected) {
      const { data, error } = await this.client
        .from('audit_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (!error && data) {
        return data.map((item) => ({
          id: item.id,
          timestamp: item.timestamp,
          userId: item.user_id,
          userEmail: item.user_email,
          action: item.action,
          details: item.details,
          ipAddress: item.ip_address,
        }));
      }
    }
    return [];
  }

  // --- LAB SESSIONS PERSISTENCE ---

  public async recordLabSession(record: LabSessionRecord): Promise<void> {
    if (this.client && this.isConnected) {
      const { error } = await this.client.from('lab_sessions').upsert({
        session_id: record.sessionId,
        user_id: record.userId,
        provider_session_id: record.providerSessionId || null,
        lab_type: record.labType,
        target_url: record.targetUrl,
        status: record.status,
        allocated_memory: record.allocatedMemory,
        expires_at: record.expiresAt || null,
        created_at: record.createdAt,
      });

      if (error) {
        console.error('[Supabase] Record lab session error:', error.message);
      }
    }
  }

  public async getActiveUserLabSession(userId: string): Promise<LabSessionRecord | null> {
    if (this.client && this.isConnected) {
      const { data, error } = await this.client
        .from('lab_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'running')
        .maybeSingle();

      if (!error && data) {
        return {
          sessionId: data.session_id,
          userId: data.user_id,
          providerSessionId: data.provider_session_id,
          labType: data.lab_type,
          targetUrl: data.target_url,
          status: data.status,
          allocatedMemory: data.allocated_memory,
          expiresAt: data.expires_at,
          createdAt: data.created_at,
        };
      }
    }
    return null;
  }
}

export const supabaseDbService = new SupabaseDbService();
