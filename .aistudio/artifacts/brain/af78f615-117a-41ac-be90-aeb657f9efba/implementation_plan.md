# CYBER AI LAB — Comprehensive Enterprise Upgrade Plan

An advanced cybersecurity education and authorized ethical hacking training platform inspired by modern Kali Linux operating environments, featuring a curated 200+ tool database, 12-phase/120-lesson roadmap, 30 practical hands-on cyber labs, a real-time streaming Gemini 3.8 Flash AI Cyber Mentor, advanced security utilities (IP/Subnet calculator, DNS resolver, HTTP header security auditor), and complete multilingual support (English, Urdu RTL, Roman Urdu).

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The platform is strictly scoped for authorized educational research, defensive hardening, and controlled lab simulations. No real network attacks or unauthorized penetration testing will be directed at external systems.

- **Confirmed Architectural Stance:**
  - **Tool Catalog:** 200+ genuinely distinct, categorized Kali Linux tool records stored in structured, partitioned TypeScript datasets with search, category filtering, difficulty tiers, favorites, recently viewed, and pagination.
  - **AI Cyber Mentor:** Server-side Express integration using `@google/genai` (model `gemini-3.8-flash`) with Server-Sent Events (SSE) streaming, conversation history, connection diagnostics, exact setup instructions when credentials are missing, and fallback knowledge base.
  - **Roadmap Curriculum:** 12 structured learning phases with 10 comprehensive lessons per phase (120 lessons total) featuring theoretical background, command breakdowns, practical walkthroughs, exercises, expected outputs, quizzes, and prerequisites.
  - **Practical Labs:** 30 authored, non-repetitive educational virtual labs spanning Linux, Networking, Python, Web Security, Forensics, Blue Team Monitoring, Packet Analysis, and Incident Response.
  - **Security Utilities:** Expanded suite adding an IP/Subnet CIDR calculator, DNS record learning simulator, HTTP header security auditor, plus existing hashing (SHA-256/512/1/MD5), encoding (Base64/Hex/URL/ROT13), and password entropy scoring.
  - **State & User Profile:** Persistent browser storage with profile import/export, bookmarks, completed lab tracking, recent activity feed, and sound FX.

---

## 1. Overview & Core Concept

**CYBER AI LAB** transforms cybersecurity learning into an immersive, authentic Kali Linux-inspired training experience. Students and security professionals can explore the entire Kali tool ecosystem, follow a rigorous 12-phase pathway from Linux basics to advanced red/blue operations, execute realistic commands inside 30 sandboxed simulated terminal environments, diagnose vulnerability artifacts with an AI mentor, and calculate subnetting/cryptographic properties on demand.

### Target Audience
- Junior to senior Security Analysts (SOC / Blue Team)
- Penetration Testers & Red Team Apprentices
- DevSecOps & Cloud Security Engineers
- University and certification candidates (Security+, CySA+, CEH, eJPT, OSCP)

---

## 2. User Experience & Visual Design

### Design Language & Anti-Slop Discipline
- **Canvas:** Ultra-dark charcoal/black canvas (`#080c0f`, `#0d141b`) with emerald green (`#10b981`) and cyber cyan (`#06b6d4`) accents.
- **Top Bar Contract:** Clean 3-zone layout with brand wordmark, quick links, search trigger (`Ctrl + K`), audio toggle, and active language dropdown.
- **Zero-Pill Metadata:** Clean unboxed typographic metadata with subtle bullet (`·`) and forward-slash (`/`) separators.
- **Multilingual Support:** English, Urdu (with dynamic document `dir="rtl"` and Urdu typography), and Roman Urdu.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  CYBER.AI LAB [Kali SecOps]    [Search Tools & Labs]   [🔊]  [🌐 EN/UR/RU]   │
├──────────────┬──────────────────────────────────────────────────────────────┤
│ ❖ Dashboard  │ ┌──────────────────────────────────────────────────────────┐ │
│ 🤖 AI Mentor │ │ Active Track: SOC Blue Team (Phase 11/12) · Level 4      │ │
│ 💻 Kali DB   │ └──────────────────────────────────────────────────────────┘ │
│ 🧪 Labs (30) │ ┌───────────────────┐ ┌───────────────────┐ ┌──────────────┐ │
│ 🗺️ Roadmap   │ │ 200+ Kali Tools   │ │ 30 Practical Labs │ │ 120 Lessons  │ │
│ 🔧 Utilities │ └───────────────────┘ └───────────────────┘ └──────────────┘ │
│ 📑 Reports   │ ┌─────────────────────────────────┐ ┌──────────────────────┐ │
│ ⚙️ Settings  │ │ Sandboxed Kali Shell (Terminal) │ │ Active Lab Mission   │ │
│              │ │ student@kali-sandbox:~$ _       │ │ Objective 1/4        │ │
│              │ └─────────────────────────────────┘ └──────────────────────┘ │
└──────────────┴──────────────────────────────────────────────────────────────┘
```

---

## 3. Key Product Decisions & Implementation Phases

### Phase 1: Kali Linux Tool Database (200+ Curated Records)
- Build a structured catalog of 200+ authentic Kali Linux tools across 12 official categories:
  1. *Information Gathering* (Nmap, Whois, Dig, Amass, theHarvester, Recon-ng, Sublist3r, Dmitry, Masscan, DNSenum, Fierce, etc.)
  2. *Vulnerability Analysis* (Nikto, Nuclei, OpenVAS, Lynis, Legion, Wapiti, Golismero, Flawfinder, etc.)
  3. *Web Application Security* (Burp Suite, OWASP ZAP, sqlmap, Gobuster, Wfuzz, Dirb, Commix, WhatWeb, Skipfish, etc.)
  4. *Password Auditing* (Hashcat, John the Ripper, Hydra, Medusa, Ophcrack, Cewl, Crunch, Ncrack, Patator, etc.)
  5. *Wireless Security* (Aircrack-ng, Kismet, Wifite, Reaver, Fern Wifi Cracker, Airgeddon, Bully, etc.)
  6. *Exploitation Frameworks* (Metasploit, Searchsploit, Armitage, BeEF, Routersploit, ExploitDB, etc.)
  7. *Forensics & Incident Response* (Autopsy, Binwalk, Volatility, Foremost, Sleuth Kit, Scalpel, Guymager, etc.)
  8. *Reverse Engineering* (Ghidra, Radare2, IDA Free, GDB, OllyDbg, APKTool, Jadx, strings, etc.)
  9. *Sniffing & Spoofing* (Wireshark, TShark, tcpdump, Bettercap, Ettercap, MITMproxy, Macchanger, etc.)
  10. *Reporting & Documentation* (Dradis, Faraday, MagicTree, Eyewitness, Serpico, CherryTree, etc.)
  11. *OSINT & Attack Surface* (SpiderFoot, Maltego, Shodan CLI, Censys CLI, Sherlock, Photon, OSINT-Framework, etc.)
  12. *Defensive Security & Hardening* (Fail2ban, UFW, ClamAV, Suricata, Zeek, Snort, OSSEC, Wazuh agent, etc.)
- Add pagination (12/24 items per page), favorites system, recently viewed stack, and full-screen drawer detail view.

### Phase 2: Real Gemini AI Cyber Mentor Upgrade
- **Server API:** Add `/api/mentor/stream` (SSE streaming) and `/api/mentor/test-connection` using `GoogleGenAI` with `gemini-3.8-flash`.
- **Secret Hygiene:** Ensure `process.env.GEMINI_API_KEY` is exclusively accessed in `server.ts`.
- **Diagnostic Setup State:** If `GEMINI_API_KEY` is missing or default, render a clean step-by-step setup guide with copyable `.env` and AI Studio Secrets instructions.
- **Multilingual System Prompt:** Teaches ethical hacking, explains command outputs line-by-line, and adapts to English, Urdu, or Roman Urdu queries.

### Phase 3: Complete 12-Phase / 120-Lesson Roadmap
- Author a 12-phase curriculum with 10 comprehensive lessons per phase:
  1. *Phase 1:* Linux Fundamentals & Shell Navigation (CLI, permissions, grep/sed/awk, process management, packages)
  2. *Phase 2:* Computer Networking & Protocols (OSI 7 layers, TCP/UDP sockets, ARP, DNS, DHCP, routing, TLS 1.3)
  3. *Phase 3:* Python for Cyber Automation (Sockets, scapy, requests, port scanning scripts, brute-force algorithms)
  4. *Phase 4:* Bash Scripting & Task Automation (Loops, pipes, regex, automated recon pipelines, cron security)
  5. *Phase 5:* Web Application Security (OWASP Top 10, SQLi, XSS, CSRF, IDOR, SSRF, JWT security)
  6. *Phase 6:* Network Security & Defense (Firewalls, iptables, UFW, VPNs, zero-trust network access)
  7. *Phase 7:* Active & Passive Reconnaissance (OSINT, DNS reconnaissance, port sweeping, banner grabbing)
  8. *Phase 8:* Vulnerability Assessment & Management (CVE/CWE scoring, CVSS v3.1, scanning methodologies, patch triage)
  9. *Phase 9:* Penetration Testing Methodologies (PTES standard, red team workflows, privilege escalation)
  10. *Phase 10:* Digital Forensics & Incident Response (Memory triage, disk carving, PCAP forensics, chain of custody)
  11. *Phase 11:* SOC Analyst & Blue Team Operations (SIEM correlation, log analysis, Snort/Suricata rules, threat hunting)
  12. *Phase 12:* Bug Bounty & Security Reporting (Executive summaries, vulnerability reproduction, remediation advice)
- Each lesson includes prerequisites, deep theory, CLI examples, hands-on exercises, knowledge check quizzes, and persistent progress.

### Phase 4: 30 Authoritative Practical Cyber Labs
- 30 distinct, non-repetitive educational simulations across 8 practical categories:
  - Linux System Auditing (SUID, Sudoers, SSH hardening, Cron jobs)
  - Network Reconnaissance (Nmap subnet sweeps, DNS zone transfers, ARP discovery)
  - Web Security Labs (SQL Injection, Stored XSS, Insecure Cookies/Headers, IDOR authorization bypass, Path Traversal)
  - Cryptography & Passwords (Hashcat dictionary attacks, Salt defense, HMAC verification, Symmetric vs Asymmetric)
  - Network Packet Inspection (PCAP triage with TShark, Wireshark filters, rogue DHCP detection)
  - Defensive Monitoring (Snort intrusion detection rules, Auth.log brute-force detection, WebDMZ access log triage)
  - Forensics & Malware Triage (Memory volatility inspection, File carving with Binwalk)
  - Incident Response & Reporting (NIST 800-61 breach containment, CVSS vulnerability dossier formulation)
- Real virtual terminal engine with command history, autocomplete hints, live objective checking, and flag verification (`FLAG{...}`).

### Phase 5: Expanded Security Utilities Suite
1. **IP & Subnet Calculator:** CIDR visualizer (/8 to /32), network IP, broadcast IP, usable host range, wildcard mask, and binary representation.
2. **DNS Record Learning Interface:** Interactive simulator for querying A, AAAA, MX, TXT, CNAME, PTR, and NS records with DNS header inspection.
3. **HTTP Header Security Auditor:** Paste HTTP response headers to evaluate CSP, HSTS, X-Frame-Options, Cache-Control, and cookie flags with a letter-grade security score (A+ to F).
4. **Cryptographic Hasher & Verifier:** SHA-256, SHA-512, SHA-1, MD5 with checksum verification.
5. **Text Encoder / Decoder:** Base64, Hex, URL, ROT13, and Binary.
6. **Password Entropy & Hardening Evaluator:** Shannon entropy calculation, brute-force crack time estimates, and OWASP recommendations.
7. **Vulnerability Report Generator:** Exportable Markdown and JSON reports.

### Phase 6: User Profile, Activity History & Testing
- Profile management with Analyst XP, Level, Activity Log, and State Export/Import (JSON).
- Sound effects toggle (Web Audio API).
- Verification tests for endpoints, tools filter, roadmap tracking, and utilities.

---

## 4. Technical Architecture & System Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             REACT SPA CLIENT                                │
│                                                                             │
│  ┌───────────────────────┐  ┌──────────────────────┐  ┌──────────────────┐  │
│  │   200+ Kali Tools     │  │  12-Phase Roadmap    │  │ 30 Hands-On Labs │  │
│  │  (Search/Filter/Page) │  │  (120 Lessons/Quiz)  │  │ (Virtual Shell)  │  │
│  └───────────────────────┘  └──────────────────────┘  └──────────────────┘  │
│  ┌───────────────────────┐  ┌──────────────────────┐  ┌──────────────────┐  │
│  │   Security Utilities  │  │   Profile & Reports  │  │ Settings & Lang  │  │
│  │ (Subnet, DNS, Hasher) │  │   (Export/Import)    │  │ (EN / UR / RU)   │  │
│  └───────────────────────┘  └──────────────────────┘  └──────────────────┘  │
│                                      │                                      │
│                        Local State & Indexed Storage                        │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTP / SSE Stream
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                        NODE.JS EXPRESS SERVER (Port 3000)                   │
│                                                                             │
│   GET  /api/health            --> Health & GEMINI_API_KEY presence check    │
│   POST /api/mentor/chat       --> Full Gemini 3.8 Flash multi-turn response │
│   POST /api/mentor/stream     --> Real-time SSE streaming generation        │
│   POST /api/mentor/analyze    --> Security log & rule triage                │
│   GET  /api/mentor/diagnostics--> Model & connection validation             │
│                                      │                                      │
│                          @google/genai SDK (v2.32)                          │
│                                      │                                      │
│                         Google Gemini 3.8 Flash                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Verification & Testing Plan

1. **Compilation & Linting:** Run `npm run lint` (`tsc --noEmit`) and `npm run build` (`vite build`) ensuring zero errors.
2. **Server Health Probe:** Verify `/api/health` and `/api/mentor/chat` responses via local curl tests.
3. **Tool Database Verification:** Assert that at least 200 distinct tool objects exist in the data catalog with valid metadata and categories.
4. **Roadmap Curriculum Verification:** Assert that all 12 phases exist with exactly 10 authored lessons per phase (total 120 lessons).
5. **Lab Engine Verification:** Verify all 30 practical labs execute simulated commands and validate flags.
6. **Utility Correctness:** Validate IP/subnet calculation math, DNS simulation outputs, and cryptographic hash verification.
7. **Multilingual Layout:** Verify English (LTR), Urdu (RTL with Noto Nastaliq Urdu font), and Roman Urdu.
