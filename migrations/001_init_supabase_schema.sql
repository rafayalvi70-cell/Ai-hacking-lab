-- =========================================================================
-- RAFAY HACKING LAB — SUPABASE POSTGRESQL DATABASE MIGRATION (IDEMPOTENT, HARDENED & VERSIONED)
-- Migration 001: Core Schema, CTF Flag Security, Migration Versioning & Zero-Trust RLS Policies
-- Brand: RAFAY HACKING LAB (LEARN • PRACTICE • MASTER)
-- =========================================================================

BEGIN;

-- Enable UUID & Crypto extensions if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 0. SCHEMA MIGRATION VERSION TRACKING
CREATE TABLE IF NOT EXISTS public.schema_migrations (
  version INT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Preserve original applied_at timestamp on re-runs
INSERT INTO public.schema_migrations (version, name)
VALUES (1, '001_init_supabase_schema_v3_3')
ON CONFLICT (version) DO NOTHING;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  role VARCHAR(32) NOT NULL DEFAULT 'user',
  tier VARCHAR(32) NOT NULL DEFAULT 'free',
  failed_login_attempts INT DEFAULT 0,
  locked_until TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- 2. SESSIONS TABLE (Storing SHA-256 hashed session tokens with expiration & revocation)
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_hash VARCHAR(128) UNIQUE NOT NULL,
  user_id VARCHAR(64) NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  ip_address VARCHAR(45) NULL,
  user_agent TEXT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_token_hash ON public.sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.sessions(user_id);

-- 3. USER PROGRESS TABLE
CREATE TABLE IF NOT EXISTS public.user_progress (
  user_id VARCHAR(64) PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  completed_lessons JSONB NOT NULL DEFAULT '[]'::jsonb,
  completed_milestones JSONB NOT NULL DEFAULT '[]'::jsonb,
  bookmarked_tools JSONB NOT NULL DEFAULT '[]'::jsonb,
  ctf_points INT NOT NULL DEFAULT 0,
  solved_ctfs JSONB NOT NULL DEFAULT '[]'::jsonb,
  certificates JSONB NOT NULL DEFAULT '[]'::jsonb,
  portfolio_projects JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_progress_ctf_points ON public.user_progress(ctf_points DESC);

-- 4. CTF SUBMISSIONS TABLE (Non-destructive: Preserves flag_submitted while adding flag_hash)
CREATE TABLE IF NOT EXISTS public.ctf_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(64) NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  challenge_id VARCHAR(64) NOT NULL,
  score INT NOT NULL DEFAULT 0,
  flag_submitted TEXT NULL,
  flag_hash VARCHAR(64) NULL,
  is_correct BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Idempotent non-destructive column migration & historical data hashing
DO $$
BEGIN
  -- Add flag_hash if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'ctf_submissions' AND column_name = 'flag_hash'
  ) THEN
    ALTER TABLE public.ctf_submissions ADD COLUMN flag_hash VARCHAR(64) NULL;
  END IF;

  -- Populate flag_hash for existing records with flag_submitted without dropping historical column
  UPDATE public.ctf_submissions 
  SET flag_hash = encode(digest(trim(flag_submitted), 'sha256'), 'hex')
  WHERE flag_hash IS NULL AND flag_submitted IS NOT NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_ctf_sub_user ON public.ctf_submissions(user_id, challenge_id);

-- 5. CERTIFICATES TABLE
CREATE TABLE IF NOT EXISTS public.certificates (
  certificate_id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  course_name VARCHAR(255) NOT NULL,
  score INT NOT NULL DEFAULT 0,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  verification_status VARCHAR(32) NOT NULL DEFAULT 'VERIFIED'
);

CREATE INDEX IF NOT EXISTS idx_certificates_user ON public.certificates(user_id);

-- 6. PORTFOLIO PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.portfolio_projects (
  project_id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  summary TEXT NULL,
  date VARCHAR(32) NULL,
  visibility VARCHAR(32) NOT NULL DEFAULT 'private',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_portfolio_user ON public.portfolio_projects(user_id);

-- 7. LAB SESSIONS TABLE (Cloud Docker & Container Labs Management)
CREATE TABLE IF NOT EXISTS public.lab_sessions (
  session_id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  provider_session_id VARCHAR(128) NULL,
  lab_type VARCHAR(64) NOT NULL,
  target_url TEXT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'starting',
  allocated_memory VARCHAR(32) NOT NULL DEFAULT '512m',
  expires_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lab_sessions_user ON public.lab_sessions(user_id, status);

-- 8. USAGE RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.usage_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(64) NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  resource_type VARCHAR(64) NOT NULL,
  usage_amount INT NOT NULL DEFAULT 1,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_usage_user ON public.usage_records(user_id, resource_type);

-- 9. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id VARCHAR(64) PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id VARCHAR(64) NULL,
  user_email VARCHAR(255) NULL,
  action VARCHAR(64) NOT NULL,
  details TEXT NULL,
  ip_address VARCHAR(45) NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON public.audit_logs(timestamp DESC);

-- =========================================================================
-- ZERO-TRUST ROW LEVEL SECURITY (RLS) POLICIES
-- Direct anonymous & direct authenticated access via Supabase REST API is DENIED across all tables.
-- All data access is routed exclusively through authenticated server backend service role
-- which enforces application-level authentication & authorization checks.
-- =========================================================================

ALTER TABLE public.schema_migrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ctf_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Idempotent RLS Policy Cleanup
DROP POLICY IF EXISTS "Deny Direct Anon Access" ON public.certificates;
DROP POLICY IF EXISTS "Public users can view public certificates for verification" ON public.certificates;

COMMIT;
