export interface FallbackTopic {
  keywords: string[];
  title: string;
  category: string;
  response: string;
}

export const FALLBACK_KNOWLEDGE_TOPICS: FallbackTopic[] = [
  {
    keywords: ['nmap', 'port', 'scan', 'timing', '-t4', '-sv', 'syn', 'ping sweep'],
    title: 'Nmap Scanning Techniques & Timing Templates',
    category: 'Reconnaissance',
    response: `### Nmap Scanning Methodology & Safe Execution

Nmap (Network Mapper) is the quintessential tool for network exploration and security auditing.

#### 1. Core Scanning Flags:
* **\`-sS\` (TCP SYN Stealth Scan)**: Sends SYN packets without completing the 3-way handshake. Fast, quiet, and privileged.
* **\`-sT\` (TCP Connect Scan)**: Completes the full 3-way handshake. Used when unprivileged (non-root).
* **\`-sV\` (Service/Version Detection)**: Probes open ports to query application banners and determine daemon versions.
* **\`-sC\` (Default NSE Scripts)**: Runs safe, non-intrusive Lua scripts from the Nmap Scripting Engine.

#### 2. Timing Templates (\`-T0\` through \`-T5\`):
* \`-T0\` (Paranoid) / \`-T1\` (Sneaky): Very slow, serial probing designed to evade IDS/IPS detection.
* \`-T2\` (Polite): Slows down to consume less target bandwidth.
* \`-T3\` (Normal): Default speed balancing accuracy and latency.
* \`-T4\` (Aggressive): Recommended for reliable lab networks (sets lower timeout thresholds).
* \`-T5\` (Insane): Extremely fast, highly prone to packet dropping and false negatives.

#### Safe Example Command:
\`\`\`bash
# Safe service scan on authorized host
nmap -sV -sC -p 22,80,443 -oN audit_results.txt 192.168.1.100
\`\`\`

#### Defensive Remediation:
Deploy stateful firewalls (iptables/UFW), close unneeded listening daemons (\`systemctl disable --now <service>\`), and configure Port Knocking or VPN gates for administrative interfaces.`,
  },
  {
    keywords: ['sql', 'injection', 'sqli', 'parameterized', 'database', 'union', 'or 1=1'],
    title: 'SQL Injection (SQLi) Mechanics & Parameterized Defense',
    category: 'Web Security',
    response: `### Understanding SQL Injection & Robust Remediation

SQL Injection occurs when untrusted user input is directly concatenated into a dynamic SQL query without proper escaping or parameterization.

#### Vulnerable Pattern (PHP/PDO):
\`\`\`php
// DANGEROUS: String concatenation
$sql = "SELECT * FROM users WHERE email = '" . $_POST['email'] . "' AND password = '" . $_POST['password'] . "'";
$db->query($sql);
\`\`\`

When an attacker inputs \`admin@bank.com' OR '1'='1\`, the logical expression forces the database engine to evaluate the condition to \`TRUE\` for all rows, bypassing authentication.

#### Secure Remediation (Prepared Statements):
\`\`\`php
// SECURE: Parameterized Query
$stmt = $pdo->prepare('SELECT id, password_hash, role FROM users WHERE email = :email LIMIT 1');
$stmt->execute([':email' => $email]);
$user = $stmt->fetch();

if ($user && password_verify($password, $user['password_hash'])) {
    // Authentication successful
}
\`\`\`

#### Key Takeaway:
With Prepared Statements, the database driver transmits the query structure and user data over completely separate protocol phases. The database treats input strictly as literal values, never as executable code.`,
  },
  {
    keywords: ['hashcat', 'password', 'hash', 'cracking', 'john', 'bcrypt', 'argon2', 'salt'],
    title: 'Password Hashing Security & Cracking Analysis',
    category: 'Cryptography',
    response: `### Cryptographic Hashes vs Password KDFs

General-purpose cryptographic hashes (such as MD5, SHA-1, and SHA-256) were designed for digital signatures and data integrity, where high throughput is advantageous.

#### Why Fast Hashes Fail for Passwords:
Modern consumer GPUs can calculate over **1.4 Billion SHA-256 hashes per second**. A 6-character alphanumeric password hashed with plain SHA-256 can be cracked in seconds via brute-force or precomputed rainbow tables.

#### The Defense: Slow, Memory-Hard Key Derivation Functions (KDFs):
1. **Argon2id** (Winner of Password Hashing Competition):
   * Memory-hard: requires dedicated RAM per calculation, rendering GPU/ASIC attacks cost-prohibitive.
   * Configurable iterations, memory cost, and parallelism threads.
2. **bcrypt**:
   * Uses modified Blowfish key schedule with adaptive cost factor (\`2^cost\` rounds).
   * Automatically generates a cryptographically random 128-bit salt.

#### Safe Kali Command Example:
\`\`\`bash
# Benchmark SHA-256 hashing speed on local hardware
hashcat -b -m 1400

# Benchmark bcrypt speed
hashcat -b -m 3200
\`\`\`
Notice how bcrypt throughput drops from billions per second to a few thousand per second, stopping offline brute force attacks cold!`,
  },
  {
    keywords: ['suid', 'privilege', 'privesc', 'gtfobins', 'chmod', 'permissions', 'root'],
    title: 'Linux SUID Permission Auditing & Least Privilege',
    category: 'Linux Hardening',
    response: `### Linux SUID (Set User ID) Auditing

The SUID permission bit (octal 4000) instructs the Linux kernel to execute a binary with the permissions of the file owner (typically \`root\`) rather than the invoking user.

#### Auditing Command:
\`\`\`bash
# Find all SUID executables across the filesystem
find / -perm -u=s -type f 2>/dev/null
\`\`\`

#### The Risk of SUID Misconfiguration:
Utilities that can read files, write files, or execute shell commands (e.g. \`vim\`, \`find\`, \`cp\`, \`nmap\`, \`bash\`) should NEVER have the SUID bit set. An unprivileged user can exploit their built-in flags to read \`/etc/shadow\` or spawn a root shell (documented in the GTFOBins project).

#### Remediation:
\`\`\`bash
# Remove SUID permission from binary
chmod u-s /path/to/binary

# Remove world-writable permissions
chmod o-w /path/to/script
\`\`\`

Always deploy **Linux Capabilities** (\`setcap\`) instead of blanket SUID when a binary only requires a specific privilege (e.g., \`cap_net_raw\` for ping).`,
  },
  {
    keywords: ['burp', 'proxy', 'xss', 'csrf', 'idor', 'repeater', 'cookie'],
    title: 'Web Application Auditing with Burp Suite',
    category: 'Web Security',
    response: `### Intercepting Proxies & Web Application Testing

Burp Suite functions as a man-in-the-middle (MitM) HTTP/HTTPS proxy positioned between your browser and the web application.

#### Core Modules:
* **Proxy (HTTP History)**: Logs all requests and responses passing through the browser.
* **Repeater**: Allows you to modify individual HTTP headers, parameters, and bodies and re-send them to observe application state changes.
* **Intruder**: Automates customized attacks such as fuzzing input fields for unexpected server errors (500 Internal Server Error) or testing rate limits.
* **Decoder**: Rapidly encodes/decodes URL, Base64, Hex, and HTML entities.

#### Defensive Best Practices for Web APIs:
1. Validate tokens with \`HttpOnly; Secure; SameSite=Strict\` cookie flags.
2. Implement robust server-side authorization checks on every endpoint to prevent Insecure Direct Object References (IDOR).
3. Use Content-Security-Policy (CSP) headers to neutralize Cross-Site Scripting (XSS).`,
  },
  {
    keywords: ['wireshark', 'pcap', 'packet', 'sniffing', 'tcpdump', 'ids', 'snort'],
    title: 'Network Packet Analysis & Intrusion Detection (IDS)',
    category: 'Blue Team Defense',
    response: `### Network Traffic Inspection with TShark & Wireshark

Packet captures (PCAPs) provide undeniable forensic evidence of what occurred across physical and virtual network interfaces.

#### Key Wireshark Display Filters:
* \`http.request.method == "POST"\`: Displays all HTTP POST transmissions (e.g. logins or form submissions).
* \`dns.flags.response == 0\`: Filters outgoing DNS queries.
* \`tcp.flags.reset == 1\`: Locates TCP RST packets indicating closed ports or firewall drops.
* \`ip.addr == 192.168.1.100 && tcp.port == 443\`: Filters encrypted communications with a specific host.

#### Writing a Snort Detection Signature:
\`\`\`snort
alert tcp $EXTERNAL_NET any -> $HTTP_SERVERS 80 (
    msg:"ATTACK-RESPONSES /etc/passwd in HTTP response";
    content:"root:x:0:0:";
    classtype:successful-recon-limited;
    sid:2000001; rev:1;
)
\`\`\`

#### Defensive Application:
Network Security Monitoring (NSM) combines Zeek for metadata logging, Suricata for signature alerting, and full packet capture for deep incident triage.`,
  },
];

export function findFallbackAnswer(query: string): string {
  const lower = query.toLowerCase();

  for (const item of FALLBACK_KNOWLEDGE_TOPICS) {
    if (item.keywords.some((kw) => lower.includes(kw))) {
      return item.response;
    }
  }

  // General fallback response
  return `### Authorized Cybersecurity Guidance

You inquired about: **"${query}"**

#### Fundamental Ethical Hacking & Defensive Principles:
1. **Explicit Authorization**: Always ensure you have a signed Rules of Engagement (RoE) document or operate strictly inside isolated lab sandboxes before executing any security tests.
2. **Defense in Depth**: Rely on layered security controls (Perimeter Firewalls, Endpoint Detection & Response, Least-Privilege IAM, Parameterized Queries, and Automated Patching).
3. **Structured Methodology**: Follow industry frameworks like **PTES (Penetration Testing Execution Standard)** and **MITRE ATT&CK** to systematically categorize techniques and defensive mitigations.

#### Relevant Kali Linux Utilities for this Domain:
* **Nmap**: Network mapping, host discovery, and port enumeration (\`nmap -sV <target>\`).
* **Burp Suite**: Web proxy, request tampering, and API security auditing.
* **Wireshark / TShark**: Packet inspection and intrusion detection analysis.
* **Lynis**: Linux operating system hardening and CIS benchmark auditing.

*Tip: You can test these techniques safely in our **Practice Labs** section or lookup detailed flag syntax in the **Kali Tool Explorer**.*`;
}
