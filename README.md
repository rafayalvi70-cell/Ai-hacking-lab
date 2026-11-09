# RAFAY HACKING LAB
## LEARN • PRACTICE • MASTER
### Professional Cybersecurity Learning Platform

RAFAY HACKING LAB is a professional cybersecurity learning, ethical hacking, and practical training platform. Built with React 19, TypeScript, Tailwind CSS, Express, and Google Gemini (`gemini-3.8-flash` via official `@google/genai` TypeScript SDK).

---

## 🛡️ Core Capabilities & Modules

### 1. 500 Cybersecurity Tools Armory
- Curated database of 500 genuine cybersecurity tools across 20 canonical categories.
- Detailed command libraries (20–50+ commands per tool with flags, expected output, and common mistakes).
- **Smart Tool Installer:** Executable availability detection via `kaliBridgeService`, verified Kali APT package manager commands (`sudo apt install`), official GitHub repository clone & build instructions, and dependency management.

2. **Smart Command Builder**
   - Interactive syntax generator for Nmap, Gobuster, SQLmap, Hydra, Aircrack-ng, and Nikto.
   - Option flag toggles with live explanations and copy/execute approval triggers.

3. **Virtual Cyber Lab Dashboard**
   - Local companion daemon connectivity (`http://127.0.0.1:4444`).
   - Local target VM management: OWASP Juice Shop, Metasploitable 2/3, DVWA, and VirtualBox subnet topology (`192.168.56.0/24`).

4. **Scan Result Analyzer**
   - Import raw Nmap XML / TXT output and HTTP header dumps.
   - Parse open ports, services, and CVE signatures organized by CVSS risk levels (Critical, High, Medium, Low).
   - Export Markdown (`.MD`) penetration testing audit reports.

5. **CTF Challenge Center**
   - Web Exploitation, Cryptography, Reverse Engineering, and Forensics challenges.
   - Progressive hint drawers (-10 PTS), flag validation (`RH{...}`), and XP rewards.

6. **Blue Team Security Center**
   - Log triage (Apache access logs, SSH auth logs, Snort IDS SQLi rule matches), packet inspection, and incident response analysis.

7. **AI Cybersecurity Copilot**
   - Server-side Express proxy (`/api/mentor/chat`) using `@google/genai` and `gemini-3.8-flash`.
   - Multilingual support: English, Urdu (RTL `dir="rtl"`), and Roman Urdu.
   - Free-first architecture: Offline Knowledge Base fallback if API credentials are not set.

8. **Career & Portfolio Center**
   - Security Analyst Resume Dossier and GitHub Profile README generator (`<!-- RAFAY HACKING LAB -->`).

9. **Knowledge Base & Notes Vault**
   - Personal cyber notebook backed by browser `localStorage`.

---

## 🚀 Quick Start & Setup

### Prerequisites
- Node.js v18+ and npm
- (Optional) Local Kali Linux VM or VirtualBox setup for companion bridge mode

### 1. Clone & Install
```bash
git clone https://github.com/rafayalvi/rafay-hacking-lab.git
cd rafay-hacking-lab
npm install
```

### 2. Environment Configuration
```bash
cp .env.example .env
# Set GEMINI_API_KEY="your-api-key" (Optional: platform runs in offline KB mode without key)
```

### 3. Launch Development Server
```bash
npm run dev
# Server listening on http://localhost:3000
```

---

## 🧪 Build & Lint Verification
```bash
npm run lint
npm run build
```

---

## 📜 Ethical & Legal Disclaimer
Authorized Educational Use Only: All tools, commands, and exercises in RAFAY HACKING LAB are designed strictly for authorized penetration testing, academic study, and defensive posture hardening. Scanning, probing, or exploiting unauthorized systems without explicit authorization is illegal.
