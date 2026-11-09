import { RoadmapPhase } from '../../types/cyber';

export const ROADMAP_PHASES_1_TO_4: RoadmapPhase[] = [
  // ==========================================
  // PHASE 1: LINUX FUNDAMENTALS & SHELL (10 Lessons)
  // ==========================================
  {
    id: 'phase-1-linux',
    phaseNumber: 1,
    title: 'Linux Fundamentals & Shell Navigation',
    badge: 'LINUX',
    description: 'Master the Linux operating system, Unix filesystem hierarchy, user privileges, file manipulation, and terminal text processing.',
    targetRole: 'Junior Linux Systems Analyst',
    level: 'Beginner',
    lessons: [
      {
        id: 'p1-l1',
        phaseId: 'phase-1-linux',
        lessonNumber: 1,
        title: 'The Unix Filesystem Hierarchy (FHS) & Navigation',
        estimatedMinutes: 25,
        difficulty: 'Beginner',
        prerequisites: ['Basic computer literacy'],
        theory: 'The Linux Filesystem Hierarchy Standard (FHS) organizes all storage under a single virtual root tree (/). Key directories include /etc (system configuration files), /var (dynamic logs and spools), /bin and /usr/bin (user executables), /sbin (administrative tools), /home (user personal spaces), and /dev (device nodes). Unlike Windows, drive letters do not exist; secondary drives and network shares are mounted onto empty directory paths.',
        stepByStep: [
          'Open the terminal emulator in Kali Linux.',
          'Verify your current working directory using "pwd".',
          'Explore directory contents with detailed permissions using "ls -la /".',
          'Navigate to system configuration files with "cd /etc".',
          'Return to user home directory using "cd ~" or bare "cd".'
        ],
        commands: [
          { cmd: 'pwd', explanation: 'Print working directory to locate current position in tree.' },
          { cmd: 'ls -la /etc', explanation: 'List all files including hidden dotfiles with permissions, owner, and size.' },
          { cmd: 'cd /var/log && ls -lh', explanation: 'Navigate to system log directory with human-readable file sizes.' }
        ],
        practicalExample: 'When analyzing a compromised Linux host, security analysts immediately check /var/log/auth.log to investigate remote SSH login attempts.',
        exercise: 'Navigate into /etc, locate the "hosts" configuration file, and inspect its contents using "cat /etc/hosts".',
        expectedResult: 'You should see the loopback IP mappings 127.0.0.1 localhost and local hostnames.',
        knowledgeCheck: [
          {
            question: 'Which directory in the Linux FHS contains system-wide configuration files?',
            options: ['/var', '/etc', '/bin', '/dev'],
            correctIndex: 1,
            explanation: '/etc is the designated directory for host-specific system configurations.'
          }
        ]
      },
      {
        id: 'p1-l2',
        phaseId: 'phase-1-linux',
        lessonNumber: 2,
        title: 'File Manipulation & Viewing Tools (cat, head, tail, less)',
        estimatedMinutes: 20,
        difficulty: 'Beginner',
        prerequisites: ['Navigation basics (cd, ls)'],
        theory: 'Everything in Unix is represented as a stream of bytes or a file. Efficiently reading and manipulating files without loading massive datasets into memory is a fundamental skill. "cat" concatenates and outputs entire files, "head" previews the top lines, "tail" views the bottom lines (vital with -f for live log following), and "less" allows interactive paginated reading.',
        stepByStep: [
          'Create a test workspace directory using "mkdir -p ~/lab1".',
          'Create text content using redirection "echo "Security Test" > ~/lab1/test.txt".',
          'Inspect the first 5 lines of a system log using "head -n 5 /var/log/syslog".',
          'View real-time updates to a log stream using "tail -f /var/log/syslog".',
          'Explore large configuration files using the interactive pager "less /etc/services".'
        ],
        commands: [
          { cmd: 'head -n 10 /etc/passwd', explanation: 'Display the first 10 accounts registered on the system.' },
          { cmd: 'tail -n 20 /var/log/auth.log', explanation: 'Display the 20 most recent authentication events.' }
        ],
        practicalExample: 'During a live brute-force attack on an SSH server, a security defender runs "tail -f /var/log/auth.log" to observe authentication failures in real time.',
        exercise: 'Pipe the first 30 lines of /etc/services into less and search for port 80.',
        expectedResult: 'The pager opens; typing "/http" highlights the http service assigned to port 80/tcp.',
        knowledgeCheck: [
          {
            question: 'Which tail flag enables continuous monitoring of new lines appended to a log file?',
            options: ['-c', '-n', '-f', '-v'],
            correctIndex: 2,
            explanation: 'The -f (follow) flag keeps the file open and streams newly written lines to stdout.'
          }
        ]
      },
      {
        id: 'p1-l3',
        phaseId: 'phase-1-linux',
        lessonNumber: 3,
        title: 'Linux Permissions & Octal Notation (chmod, chown)',
        estimatedMinutes: 30,
        difficulty: 'Beginner',
        prerequisites: ['File creation basics'],
        theory: 'Linux implements Discretionary Access Control (DAC) via three identity tiers: Owner (u), Group (g), and Others (o). Each tier has Read (4, r), Write (2, w), and Execute (1, x) bits. For example, 755 represents rwxr-xr-x (Owner can read/write/execute; Group and Others can only read and execute). Special permissions include SUID (4000), SGID (2000), and the Sticky Bit (1000).',
        stepByStep: [
          'Create a test script "touch script.sh".',
          'Inspect permissions using "ls -l script.sh".',
          'Add execution permissions using symbolic syntax "chmod +x script.sh".',
          'Change permissions using octal notation "chmod 700 script.sh" (only owner can read/write/execute).',
          'Inspect group and owner modification with "chown user:group script.sh".'
        ],
        commands: [
          { cmd: 'chmod 600 private.key', explanation: 'Restrict file access strictly to the owner (read & write only).' },
          { cmd: 'chmod 755 /usr/local/bin/custom_tool', explanation: 'Allow owner full control; all others read and execute.' }
        ],
        practicalExample: 'SSH rejects private keys that have loose permissions (such as 777 or 644). You must run "chmod 600 ~/.ssh/id_rsa" before SSH allows authentication.',
        exercise: 'Create a file named confidential.txt and configure it so only the owner can read and write it, while group and others have zero permissions.',
        expectedResult: '"ls -l confidential.txt" should display "-rw-------".',
        knowledgeCheck: [
          {
            question: 'What octal permission sets read and write for the owner, and read-only for group and others?',
            options: ['755', '644', '600', '777'],
            correctIndex: 1,
            explanation: 'Owner: 4+2=6; Group: 4; Others: 4; resulting in 644 (rw-r--r--).'
          }
        ]
      },
      {
        id: 'p1-l4',
        phaseId: 'phase-1-linux',
        lessonNumber: 4,
        title: 'User & Group Management, Sudoers, and SUID Auditing',
        estimatedMinutes: 30,
        difficulty: 'Intermediate',
        prerequisites: ['Linux permissions basics'],
        theory: 'User accounts are defined in /etc/passwd (UID, GID, home, shell) and password hashes reside in the privileged /etc/shadow. Administrative privilege delegation is configured via /etc/sudoers (edited exclusively with "visudo"). SUID binaries (Set User ID) execute with the privileges of the file owner (typically root). If a misconfigured utility like vim or nmap has SUID set, unprivileged users can elevate to root.',
        stepByStep: [
          'Examine the current user identity using "id" and "whoami".',
          'Read user records in /etc/passwd filtering for interactive shells with bash.',
          'Audit your sudo privileges using "sudo -l".',
          'Search for all SUID binaries on the filesystem using "find / -perm -u=s -type f 2>/dev/null".',
          'Cross-reference identified SUID binaries with GTFOBins.'
        ],
        commands: [
          { cmd: 'id', explanation: 'Displays real and effective UID, GID, and secondary groups.' },
          { cmd: 'sudo -l', explanation: 'Lists permitted and forbidden commands for the invoking user.' },
          { cmd: 'find / -perm -u=s -type f 2>/dev/null', explanation: 'Enumerate all executables with SetUID bit active.' }
        ],
        practicalExample: 'During penetration tests, running "find / -perm -u=s -type f" often reveals custom operational scripts left with SUID root permissions, granting immediate root access.',
        exercise: 'Run "id" in your terminal and identify your UID and group memberships.',
        expectedResult: 'Terminal outputs your UID (e.g. uid=1000 or uid=0 for root).',
        knowledgeCheck: [
          {
            question: 'Where are encrypted password hashes stored on modern Linux distributions?',
            options: ['/etc/passwd', '/etc/shadow', '/var/auth/shadow', '/etc/security'],
            correctIndex: 1,
            explanation: '/etc/shadow is restricted to root and contains one-way salted password hashes.'
          }
        ]
      },
      {
        id: 'p1-l5',
        phaseId: 'phase-1-linux',
        lessonNumber: 5,
        title: 'Text Processing Masterclass: grep, sed, and awk',
        estimatedMinutes: 35,
        difficulty: 'Intermediate',
        prerequisites: ['File manipulation basics'],
        theory: 'Security analysts constantly parse gigabytes of log telemetry. "grep" searches text using regular expressions; "sed" performs stream editing and search/replace transformations; "awk" is a complete pattern-scanning and field-processing language ideal for delimited tabular records (such as CSVs, web access logs, and netstat outputs).',
        stepByStep: [
          'Filter lines matching a pattern with "grep "Failed password" /var/log/auth.log".',
          'Invert matching lines to omit noise using "grep -v "CRON"".',
          'Extract specific columns using awk: "awk \'{print $1, $9}\' access.log".',
          'Perform inline text substitution with sed: "sed \'s/HTTP/HTTPS/g\' config.txt".',
          'Chain grep, awk, sort, and uniq to count unique attacking IP addresses.'
        ],
        commands: [
          { cmd: 'grep -E "([0-9]{1,3}\\.){3}[0-9]{1,3}" access.log', explanation: 'Extract all IPv4 addresses using regex.' },
          { cmd: 'awk -F: \'{print $1, $3}\' /etc/passwd', explanation: 'Extract username and UID using colon delimiter.' },
          { cmd: 'sort ip_list.txt | uniq -c | sort -nr', explanation: 'Deduplicate, count frequencies, and sort in descending order.' }
        ],
        practicalExample: 'A SOC analyst triages a web defacement by running: "awk \'{print $1}\' access.log | sort | uniq -c | sort -nr | head -n 10" to locate the top requesting IP.',
        exercise: 'Query /etc/passwd using awk to print usernames that have UID 0.',
        expectedResult: 'Outputs "root" (and any rogue backdoor accounts with UID 0).',
        knowledgeCheck: [
          {
            question: 'Which awk flag specifies a custom field delimiter like a colon or comma?',
            options: ['-d', '-F', '-s', '-t'],
            correctIndex: 1,
            explanation: 'The -F flag sets the input field separator (e.g. -F: or -F,).'
          }
        ]
      },
      {
        id: 'p1-l6',
        phaseId: 'phase-1-linux',
        lessonNumber: 6,
        title: 'Process Management, Daemons, and Systemd Security',
        estimatedMinutes: 25,
        difficulty: 'Beginner',
        prerequisites: ['Linux fundamentals'],
        theory: 'Programs in execution are represented as processes with a unique Process ID (PID). On modern Linux, Systemd (PID 1) manages initialization, background daemons, and cgroups. Managing processes with "ps", "top", "htop", "kill", and managing services via "systemctl" is vital for controlling server attack surfaces.',
        stepByStep: [
          'List all running processes with full arguments using "ps aux".',
          'Search for a specific daemon with "ps aux | grep nginx".',
          'Inspect system services state with "systemctl status ssh".',
          'Disable unneeded network services with "sudo systemctl disable --now service_name".',
          'Terminate rogue processes using "kill -9 <PID>".'
        ],
        commands: [
          { cmd: 'ps aux --sort=-%mem | head -n 10', explanation: 'Display the top 10 memory-consuming processes.' },
          { cmd: 'systemctl list-unit-files --type=service --state=enabled', explanation: 'Enumerate all services configured to start automatically on boot.' }
        ],
        practicalExample: 'When auditing a production server, security teams disable unnecessary legacy services (like telnet, rsh, or cups) using "systemctl disable --now".',
        exercise: 'Check if the SSH service is active on your machine using systemctl.',
        expectedResult: 'Terminal reports active (running) or inactive (dead).',
        knowledgeCheck: [
          {
            question: 'Which kill signal sends SIGKILL, forcing immediate, non-catchable process termination?',
            options: ['kill -1', 'kill -15', 'kill -9', 'kill -0'],
            correctIndex: 2,
            explanation: 'Signal 9 (SIGKILL) forces immediate kernel termination without allowing cleanup.'
          }
        ]
      },
      {
        id: 'p1-l7',
        phaseId: 'phase-1-linux',
        lessonNumber: 7,
        title: 'Networking from the Linux CLI (ip, ss, netstat, lsof)',
        estimatedMinutes: 30,
        difficulty: 'Intermediate',
        prerequisites: ['Networking fundamentals basics'],
        theory: 'Modern Linux deprecates ifconfig and netstat in favor of the "ip" and "ss" utilities from iproute2. Auditing which sockets are in the LISTEN state, identifying which process binds to which port, and tracking foreign socket connections are core blue team and incident response tasks.',
        stepByStep: [
          'Inspect IP addresses on all network interfaces using "ip addr show".',
          'Inspect the default routing gateway using "ip route show".',
          'Enumerate all listening TCP and UDP sockets with process names using "ss -tulnp".',
          'Map open network files and listening ports using "lsof -i :80".',
          'Verify DNS resolvers configured in /etc/resolv.conf.'
        ],
        commands: [
          { cmd: 'ip -br a', explanation: 'Brief overview of network interfaces and assigned IPs.' },
          { cmd: 'ss -tulnp', explanation: 'Display TCP/UDP listening ports, numerical format, with process PIDs.' },
          { cmd: 'lsof -i -P -n', explanation: 'List all open network sockets without resolving port or host names.' }
        ],
        practicalExample: 'During incident response, running "ss -tulnp" immediately reveals if an unauthorized backdoor shell is listening on a non-standard port like 4444.',
        exercise: 'Run "ss -tulnp" and identify the local IP and port of any listening services.',
        expectedResult: 'List showing State=LISTEN, Local Address:Port (e.g. 0.0.0.0:22 or 127.0.0.1:3000).',
        knowledgeCheck: [
          {
            question: 'Which modern command replaces netstat -tulnp for listing listening sockets on Linux?',
            options: ['ip link', 'ss -tulnp', 'route -n', 'traceroute'],
            correctIndex: 1,
            explanation: 'The ss (socket statistics) tool replaces the legacy netstat command.'
          }
        ]
      },
      {
        id: 'p1-l8',
        phaseId: 'phase-1-linux',
        lessonNumber: 8,
        title: 'Package Management & Kali Repositories (apt, dpkg)',
        estimatedMinutes: 20,
        difficulty: 'Beginner',
        prerequisites: ['Linux command line'],
        theory: 'Debian and Kali Linux use the Advanced Package Tool (APT) over dpkg. Understanding cryptographic repository signatures (/etc/apt/trusted.gpg.d), repository source lists (/etc/apt/sources.list), package verification, and preventing repository poisoning attacks is essential for maintaining a secure operating system.',
        stepByStep: [
          'Synchronize repository package indexes with "sudo apt update".',
          'Upgrade installed packages containing CVE patches with "sudo apt upgrade".',
          'Search for a security tool in repositories using "apt search <keyword>".',
          'Inspect installed package details using "dpkg -l | grep <name>".',
          'Verify package file integrity using "dpkg -V <package>".'
        ],
        commands: [
          { cmd: 'sudo apt update && sudo apt --dry-run upgrade', explanation: 'Check for available security updates without installing.' },
          { cmd: 'dpkg -S /usr/bin/nmap', explanation: 'Identify which package owns a specific binary on disk.' }
        ],
        practicalExample: 'Linux administrators configure "unattended-upgrades" to automatically install critical security CVE patches overnight without human intervention.',
        exercise: 'Use "dpkg -S /bin/ls" to determine which core package provides the ls command.',
        expectedResult: 'Terminal reports: "coreutils: /bin/ls".',
        knowledgeCheck: [
          {
            question: 'Which file contains the official repository URLs queried by apt update on Kali Linux?',
            options: ['/etc/apt/sources.list', '/etc/dpkg/dpkg.cfg', '/var/cache/apt/archives', '/etc/environment'],
            correctIndex: 0,
            explanation: '/etc/apt/sources.list dictates the package repositories APT connects to.'
          }
        ]
      },
      {
        id: 'p1-l9',
        phaseId: 'phase-1-linux',
        lessonNumber: 9,
        title: 'Archiving, Compression & Integrity Verification (tar, gzip, sha256sum)',
        estimatedMinutes: 20,
        difficulty: 'Beginner',
        prerequisites: ['CLI basics'],
        theory: 'Security operations require collecting evidence, bundling logs, and calculating cryptographic hashes to prove chain of custody. "tar" bundles files while preserving permissions; gzip/bzip2 compress archives; and sha256sum calculates cryptographic digests to detect tampering.',
        stepByStep: [
          'Create a forensic archive of a log directory: "tar -czvf incident_logs.tar.gz /var/log/nginx".',
          'Inspect contents of a tarball without extracting: "tar -tvf incident_logs.tar.gz".',
          'Calculate SHA-256 hash of the archive: "sha256sum incident_logs.tar.gz > evidence.sha256".',
          'Verify hash integrity against a manifest using "sha256sum -c evidence.sha256".'
        ],
        commands: [
          { cmd: 'tar -czvf backup.tar.gz /path/to/folder', explanation: 'Create compressed gzip tarball archive.' },
          { cmd: 'sha256sum file.iso', explanation: 'Generate 256-bit cryptographic SHA-256 hash digest.' }
        ],
        practicalExample: 'When seizing a hard disk image during a digital forensics investigation, calculating sha256sum immediately upon acquisition guarantees evidence has not been modified.',
        exercise: 'Create a text file, compute its sha256sum, modify a single character, and recompute the hash to observe the avalanche effect.',
        expectedResult: 'The 64-character hexadecimal hash changes completely due to cryptographic diffusion.',
        knowledgeCheck: [
          {
            question: 'Which tar flag enables gzip compression when creating an archive (.tar.gz)?',
            options: ['-x', '-z', '-j', '-v'],
            correctIndex: 1,
            explanation: '-z enables gzip compression (-j enables bzip2; -J enables xz).'
          }
        ]
      },
      {
        id: 'p1-l10',
        phaseId: 'phase-1-linux',
        lessonNumber: 10,
        title: 'Cron Jobs, Scheduled Tasks, and Persistence Auditing',
        estimatedMinutes: 25,
        difficulty: 'Intermediate',
        prerequisites: ['User permissions and text processing'],
        theory: 'Cron allows scheduling jobs using the five-field format (minute, hour, day of month, month, day of week). System crons reside in /etc/crontab, /etc/cron.*, and /var/spool/cron/crontabs. Attackers frequently use cron for persistence, while defenders use cron for automated log rotation and security scans.',
        stepByStep: [
          'List user scheduled cron jobs using "crontab -l".',
          'Inspect system-wide scheduled cron tasks in "/etc/crontab".',
          'Inspect drop-in hourly, daily, and monthly directories: "ls -la /etc/cron.*".',
          'Audit cron jobs for writable scripts owned by root.',
          'Review systemd timers as modern alternatives to cron using "systemctl list-timers".'
        ],
        commands: [
          { cmd: 'crontab -l', explanation: 'Display current user cron schedule.' },
          { cmd: 'ls -la /etc/cron.d /etc/cron.daily', explanation: 'Inspect system scheduled scripts.' }
        ],
        practicalExample: 'In many privilege escalation challenges, an administrator creates a root cron job executing a script located in a world-writable directory (/tmp or /dev/shm), allowing unprivileged users to modify it.',
        exercise: 'Read /etc/crontab and examine the standard five-field timing syntax.',
        expectedResult: 'You will see the m h dom mon dow user command header format.',
        knowledgeCheck: [
          {
            question: 'What does the cron timing expression "0 0 * * *" execute?',
            options: ['Every minute of every day', 'Every hour on the hour', 'Every midnight (00:00)', 'Every Sunday at noon'],
            correctIndex: 2,
            explanation: 'Minute 0, Hour 0, every day of month, every month, every day of week = Midnight.'
          }
        ]
      }
    ]
  },

  // ==========================================
  // PHASE 2: NETWORKING & PROTOCOLS (10 Lessons)
  // ==========================================
  {
    id: 'phase-2-networking',
    phaseNumber: 2,
    title: 'Computer Networking & Protocol Analysis',
    badge: 'NETWORKING',
    description: 'Deconstruct the OSI 7-layer model, TCP 3-way handshake, IP routing, Subnetting math, DNS hierarchy, HTTP/HTTPS, and packet inspection.',
    targetRole: 'Network Security Analyst',
    level: 'Beginner to Intermediate',
    lessons: [
      {
        id: 'p2-l1',
        phaseId: 'phase-2-networking',
        lessonNumber: 1,
        title: 'The OSI 7-Layer Model vs. TCP/IP Architecture',
        estimatedMinutes: 25,
        difficulty: 'Beginner',
        prerequisites: ['Networking basics'],
        theory: 'The Open Systems Interconnection (OSI) 7-layer model is the conceptual framework for network communication: 1. Physical (cables, RF), 2. Data Link (Ethernet frames, MAC addresses), 3. Network (IP packets, routing), 4. Transport (TCP segments, UDP datagrams), 5. Session, 6. Presentation (encryption/compression), and 7. Application (HTTP, DNS, SSH). The practical TCP/IP stack condenses this into Network Access, Internet, Transport, and Application layers.',
        stepByStep: [
          'Review each layer and its corresponding Protocol Data Unit (PDU): Frame -> Packet -> Segment -> Data.',
          'Map protocols to their native layers (Ethernet at L2, IP/ICMP at L3, TCP/UDP at L4, HTTP/DNS at L7).',
          'Understand encapsulation: as data travels down the stack, each layer prepends its header; as it ascends, headers are decapsulated.'
        ],
        commands: [
          { cmd: 'ip link show', explanation: 'Inspect Layer 2 physical and virtual link status.' },
          { cmd: 'ip route show', explanation: 'Inspect Layer 3 IP routing table decisions.' }
        ],
        practicalExample: 'A Layer 3 network firewall filters based on source/dest IP; a Layer 4 firewall filters on TCP/UDP ports; a Layer 7 Web Application Firewall (WAF) inspects payload content like SQL injection strings.',
        exercise: 'Identify which layer of the OSI model the TCP port number resides in.',
        expectedResult: 'Layer 4 (Transport Layer).',
        knowledgeCheck: [
          {
            question: 'What is the Protocol Data Unit (PDU) at Layer 2 (Data Link Layer)?',
            options: ['Packet', 'Segment', 'Frame', 'Bit'],
            correctIndex: 2,
            explanation: 'Layer 2 groups bits into Frames with source and destination MAC addresses.'
          }
        ]
      },
      {
        id: 'p2-l2',
        phaseId: 'phase-2-networking',
        lessonNumber: 2,
        title: 'The TCP 3-Way Handshake & Connection Teardown',
        estimatedMinutes: 25,
        difficulty: 'Intermediate',
        prerequisites: ['OSI model understanding'],
        theory: 'Transmission Control Protocol (TCP) provides reliable, ordered byte streams via connection establishment: 1. Client sends [SYN] (Synchronize) with an Initial Sequence Number (ISN). 2. Server replies with [SYN, ACK] acknowledging the ISN and presenting its own. 3. Client transmits [ACK] to complete connection. Teardown utilizes [FIN] and [ACK] flags, while anomalous or rejected connections receive [RST] (Reset).',
        stepByStep: [
          'Examine the TCP header: Source Port, Destination Port, Sequence Number, Ack Number, Flags (URG, ACK, PSH, RST, SYN, FIN), Window Size, Checksum.',
          'Understand how Nmap SYN scanning (-sS) works: it sends [SYN], receives [SYN, ACK] indicating open port, and immediately responds with [RST] instead of [ACK] to avoid completing the connection.'
        ],
        commands: [
          { cmd: 'tshark -i lo -f "tcp port 80" -c 5', explanation: 'Capture 5 TCP packets on local loopback.' }
        ],
        practicalExample: 'SYN Flood denial of service attacks exploit the 3-way handshake by transmitting thousands of SYN packets with spoofed source IPs, exhausting the server SYN backlog queue. Defenders deploy SYN Cookies to mitigate this.',
        exercise: 'State the flags transmitted in the second step of the TCP handshake.',
        expectedResult: 'SYN and ACK (SYN-ACK).',
        knowledgeCheck: [
          {
            question: 'Which flag is returned by a closed port when queried with a TCP SYN packet?',
            options: ['FIN', 'RST', 'PSH', 'URG'],
            correctIndex: 1,
            explanation: 'A closed port generates a TCP RST (Reset) packet in response to an unsolicited SYN.'
          }
        ]
      },
      {
        id: 'p2-l3',
        phaseId: 'phase-2-networking',
        lessonNumber: 3,
        title: 'IPv4 Subnetting, CIDR Math, and Supernetting',
        estimatedMinutes: 35,
        difficulty: 'Intermediate',
        prerequisites: ['Binary numbering basics'],
        theory: 'IPv4 addresses are 32-bit values written in dotted-decimal format (4 octets). Classless Inter-Domain Routing (CIDR) uses a prefix notation (e.g. /24) to denote how many bits represent the network prefix. The remaining bits denote host addresses. Number of usable hosts is 2^(32-prefix) - 2 (subtracting network and broadcast addresses). A /24 provides 254 usable hosts; a /28 provides 14 usable hosts.',
        stepByStep: [
          'Convert subnet masks to binary: 255.255.255.0 = 24 consecutive ones (/24).',
          'Calculate subnet boundaries for a /26 (netmask 255.255.255.192, 64-step increments).',
          'Identify Network Address (all host bits 0) and Broadcast Address (all host bits 1).',
          'Understand RFC 1918 Private IP spaces: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16.'
        ],
        commands: [
          { cmd: 'ipcalc 192.168.1.50/26', explanation: 'Calculate network, broadcast, and host ranges using CLI.' }
        ],
        practicalExample: 'Security architects segment corporate networks into separate subnets (e.g., DMZ on 10.0.1.0/24, Employees on 10.0.2.0/23) to apply firewall filtering policies between departments.',
        exercise: 'How many usable host IP addresses are available in a /29 subnet?',
        expectedResult: '6 usable hosts (2^3 = 8 - 2 = 6).',
        knowledgeCheck: [
          {
            question: 'What is the usable host count for a /28 IPv4 subnet?',
            options: ['16', '14', '30', '12'],
            correctIndex: 1,
            explanation: '32 - 28 = 4 host bits. 2^4 = 16. Minus network and broadcast = 14 usable hosts.'
          }
        ]
      },
      {
        id: 'p2-l4',
        phaseId: 'phase-2-networking',
        lessonNumber: 4,
        title: 'ARP Mechanics & Layer 2 Spoofing Defense',
        estimatedMinutes: 30,
        difficulty: 'Intermediate',
        prerequisites: ['OSI model'],
        theory: 'Address Resolution Protocol (ARP) translates Layer 3 IP addresses into Layer 2 physical MAC addresses. Because ARP is stateless and unauthenticated, devices accept unsolicited ARP replies. In an ARP Poisoning / Spoofing attack, an adversary tricks the victim into mapping the gateway IP to the attacker’s MAC address, creating a Man-in-the-Middle (MitM) position.',
        stepByStep: [
          'Examine local kernel ARP cache using "ip neigh show" or "arp -a".',
          'Observe ARP request broadcast (Who has 192.168.1.1? Tell 192.168.1.50).',
          'Observe unicast ARP response with MAC address.',
          'Understand defensive switch mitigations: Dynamic ARP Inspection (DAI) and DHCP Snooping.'
        ],
        commands: [
          { cmd: 'ip neigh show', explanation: 'Display current ARP neighbor cache table.' },
          { cmd: 'arping -c 2 192.168.1.1', explanation: 'Send Layer 2 ARP query to resolve MAC address.' }
        ],
        practicalExample: 'Enterprise switches configure Dynamic ARP Inspection (DAI), which validates ARP packets against the trusted DHCP binding database, dropping forged ARP replies automatically.',
        exercise: 'Inspect your local ARP cache using "ip neigh".',
        expectedResult: 'Outputs list of IP addresses, network device, and physical MAC addresses (e.g. 192.168.1.1 lladdr 00:11:22:33:44:55 REACHABLE).',
        knowledgeCheck: [
          {
            question: 'Which switch security feature validates ARP packets against a DHCP snooping database to prevent ARP poisoning?',
            options: ['Port Security', 'Dynamic ARP Inspection (DAI)', 'BPDU Guard', 'Spanning Tree'],
            correctIndex: 1,
            explanation: 'Dynamic ARP Inspection (DAI) inspects and drops malicious ARP packets on access ports.'
          }
        ]
      },
      {
        id: 'p2-l5',
        phaseId: 'phase-2-networking',
        lessonNumber: 5,
        title: 'DNS Resolution Lifecycle & Cache Poisoning Defense',
        estimatedMinutes: 30,
        difficulty: 'Intermediate',
        prerequisites: ['Networking fundamentals'],
        theory: 'Domain Name System (DNS) is the hierarchical directory of the internet. Resolution begins at Root nameservers (.), moves to Top-Level Domains (.com, .org), and resolves at Authoritative nameservers. Record types include A (IPv4), AAAA (IPv6), MX (Mail), TXT (SPF/DKIM), CNAME (Alias), and NS (Nameserver). Vulnerabilities include DNS Cache Poisoning (Kaminsky attack) and Zone Transfers (AXFR). Mitigations include DNSSEC and source port randomization.',
        stepByStep: [
          'Trace complete iterative DNS delegation from root with "dig example.com +trace".',
          'Query SPF and security policy records using "dig txt example.com".',
          'Attempt and understand why open DNS AXFR zone transfers are blocked.',
          'Understand DNSSEC cryptographic record signatures (RRSIG, DNSKEY, DS).'
        ],
        commands: [
          { cmd: 'dig example.com ANY +noall +answer', explanation: 'Query core DNS records.' },
          { cmd: 'dig @ns1.example.com example.com axfr', explanation: 'Test for unauthenticated zone transfer.' }
        ],
        practicalExample: 'Adversaries look for misconfigured DNS nameservers allowing full AXFR transfers, revealing all internal hostnames, VPN endpoints, and staging subdomains in a single command.',
        exercise: 'Query the authoritative nameservers for google.com using dig.',
        expectedResult: 'Returns NS records (e.g. ns1.google.com, ns2.google.com).',
        knowledgeCheck: [
          {
            question: 'Which DNS record type is commonly used to declare SPF and DMARC email security policies?',
            options: ['A', 'MX', 'TXT', 'CNAME'],
            correctIndex: 2,
            explanation: 'TXT records hold arbitrary text strings used for SPF, DKIM, and domain ownership tokens.'
          }
        ]
      },
      {
        id: 'p2-l6',
        phaseId: 'phase-2-networking',
        lessonNumber: 6,
        title: 'HTTP Protocol Internals, Verbs, and Status Codes',
        estimatedMinutes: 25,
        difficulty: 'Beginner',
        prerequisites: ['Web basics'],
        theory: 'Hypertext Transfer Protocol (HTTP) is the text-based application protocol powering the World Wide Web. Methods include GET (read), POST (submit), PUT (replace), DELETE (remove), PATCH (partial update), and OPTIONS (CORS preflight). Status codes are partitioned: 1xx (Informational), 2xx (Success), 3xx (Redirection), 4xx (Client Error), and 5xx (Server Error).',
        stepByStep: [
          'Analyze an HTTP request format: Request Line, Headers, Blank Line, Optional Body.',
          'Inspect raw HTTP responses using curl: "curl -v -I https://example.com".',
          'Understand statelessness and the role of the Set-Cookie and Cookie headers.',
          'Review dangerous HTTP methods like TRACE (cross-site tracing) and PUT on misconfigured servers.'
        ],
        commands: [
          { cmd: 'curl -I https://example.com', explanation: 'Fetch only the HTTP response headers.' },
          { cmd: 'curl -X OPTIONS https://example.com -i', explanation: 'Query supported HTTP methods via OPTIONS.' }
        ],
        practicalExample: 'Web security auditors verify that sensitive endpoints do not accept unintended verbs (e.g., testing if an administrative delete operation can be executed via GET instead of POST).',
        exercise: 'Use curl to inspect the response headers of an HTTPS site and locate the Server header.',
        expectedResult: 'Headers display HTTP status (200 OK) and Server identifier (e.g. cloudflare, nginx).',
        knowledgeCheck: [
          {
            question: 'Which HTTP status code signifies "403"?',
            options: ['Not Found', 'Unauthorized', 'Forbidden', 'Bad Request'],
            correctIndex: 2,
            explanation: '403 Forbidden means the server understood the request but refuses to authorize it.'
          }
        ]
      },
      {
        id: 'p2-l7',
        phaseId: 'phase-2-networking',
        lessonNumber: 7,
        title: 'TLS/SSL Handshake, Certificates, and Cryptography',
        estimatedMinutes: 35,
        difficulty: 'Intermediate',
        prerequisites: ['TCP handshake', 'HTTP basics'],
        theory: 'Transport Layer Security (TLS 1.3) encrypts network traffic to provide confidentiality, integrity, and server authentication. The handshake uses asymmetric cryptography (ECDHE) for ephemeral key exchange, X.509 digital certificates signed by Certificate Authorities (CAs) for authentication, and symmetric ciphers (AES-GCM, ChaCha20) for session encryption.',
        stepByStep: [
          'Examine the TLS 1.3 handshake: ClientHello (supported ciphers, key share) -> ServerHello (chosen cipher, key share, certificate) -> Finished -> Encrypted Traffic.',
          'Understand Public Key Infrastructure (PKI), root CAs, intermediate CAs, and Subject Alternative Names (SANs).',
          'Inspect certificate chains using openssl s_client.',
          'Identify deprecated weak ciphers (RC4, DES, CBC mode).'
        ],
        commands: [
          { cmd: 'openssl s_client -connect example.com:443 -servername example.com', explanation: 'Connect and dump X.509 certificate chain.' },
          { cmd: 'sslscan example.com', explanation: 'Audit supported TLS protocol versions and cipher suites.' }
        ],
        practicalExample: 'Attackers target legacy protocols like TLS 1.0/1.1 with padding oracle attacks (POODLE). Hardening standards like PCI-DSS strictly require disabling TLS versions below 1.2.',
        exercise: 'Run an SSL cipher audit against an authorized web server and verify TLS 1.3 is supported.',
        expectedResult: 'Output confirms TLSv1.3 with modern AEAD cipher (e.g., TLS_AES_256_GCM_SHA384).',
        knowledgeCheck: [
          {
            question: 'What cryptographic property ensures that past communications cannot be decrypted if the server private key is leaked in the future?',
            options: ['Digital Signature', 'Perfect Forward Secrecy (PFS)', 'Certificate Revocation', 'Chain of Custody'],
            correctIndex: 1,
            explanation: 'Perfect Forward Secrecy uses ephemeral Diffie-Hellman keys to protect past sessions.'
          }
        ]
      },
      {
        id: 'p2-l8',
        phaseId: 'phase-2-networking',
        lessonNumber: 8,
        title: 'UDP, ICMP, and Stateless Protocol Security',
        estimatedMinutes: 25,
        difficulty: 'Beginner',
        prerequisites: ['TCP/IP model'],
        theory: 'Unlike TCP, User Datagram Protocol (UDP) is stateless, connectionless, and unacknowledged, prioritizing low latency over reliability (used in DNS, DHCP, SNMP, NTP, VoIP). Because UDP does not verify source IPs with a handshake, it is heavily abused in Reflection & Amplification Denial-of-Service attacks (DNS/NTP amplification). Internet Control Message Protocol (ICMP) carries operational error notifications.',
        stepByStep: [
          'Compare TCP segment vs UDP datagram headers (UDP header is minimal: Source Port, Dest Port, Length, Checksum).',
          'Understand UDP amplification: an attacker sends a 60-byte DNS query with a spoofed victim IP to an open resolver, which replies with a 3,000-byte response directed at the victim (50x amplification).',
          'Examine ICMP error types: Echo Request/Reply (Type 8/0), Destination Unreachable (Type 3), Time Exceeded (Type 11).'
        ],
        commands: [
          { cmd: 'sudo nmap -sU -p 53,161 192.168.1.1', explanation: 'Perform UDP port scan against DNS and SNMP services.' }
        ],
        practicalExample: 'Network defenders configure Response Rate Limiting (RRL) on authoritative DNS servers to neutralize DNS reflection amplification attacks.',
        exercise: 'Explain why UDP port scanning is significantly slower than TCP SYN scanning in Nmap.',
        expectedResult: 'Open UDP ports rarely respond with packets, requiring Nmap to retransmit probes and wait for ICMP Port Unreachable timeouts.',
        knowledgeCheck: [
          {
            question: 'Why are UDP services like DNS and NTP commonly abused in Reflection DDoS attacks?',
            options: ['UDP uses 3-way handshakes', 'UDP allows IP spoofing without connection confirmation', 'UDP is always encrypted', 'UDP requires root authentication'],
            correctIndex: 1,
            explanation: 'Because UDP is connectionless, source IP addresses can be trivially spoofed in packets.'
          }
        ]
      },
      {
        id: 'p2-l9',
        phaseId: 'phase-2-networking',
        lessonNumber: 9,
        title: 'Packet Capture Fundamentals with Wireshark & TShark',
        estimatedMinutes: 35,
        difficulty: 'Intermediate',
        prerequisites: ['Networking protocols'],
        theory: 'Packet capture (PCAP) captures raw network frames directly off a network interface. Wireshark provides a graphical dissection tree, while TShark provides high-performance command-line analysis. Berkeley Packet Filters (BPF) filter packets prior to capture, while Display Filters filter parsed packets during analysis.',
        stepByStep: [
          'Understand capture filter (BPF) syntax: "tcp port 80 and host 10.0.0.1".',
          'Understand display filter syntax: "http.request.method == \"POST\"".',
          'Capture 10 packets via terminal: "tshark -i eth0 -c 10".',
          'Analyze an existing PCAP file: "tshark -r capture.pcap -q -z io,phs" (protocol hierarchy).',
          'Extract specific protocol fields (IPs, URIs, DNS queries) into clean tabular output.'
        ],
        commands: [
          { cmd: 'tshark -r traffic.pcap -Y "dns.flags.response == 1" -T fields -e dns.qry.name', explanation: 'Extract resolved domain names from PCAP.' },
          { cmd: 'tshark -r traffic.pcap -Y "http.response.code >= 400"', explanation: 'Filter all HTTP client and server errors.' }
        ],
        practicalExample: 'During malware analysis, an investigator runs TShark to extract all DNS queries generated by an infected VM, immediately locating the command-and-control (C2) domain.',
        exercise: 'Write a Wireshark display filter to find all TCP SYN packets with no ACK flag.',
        expectedResult: 'tcp.flags.syn == 1 && tcp.flags.ack == 0',
        knowledgeCheck: [
          {
            question: 'What is the difference between a capture filter and a display filter in Wireshark?',
            options: ['They are identical', 'Capture filters discard packets before capture; display filters filter parsed packets', 'Display filters require root access', 'Capture filters only work on UDP'],
            correctIndex: 1,
            explanation: 'Capture filters (BPF) drop packets at the kernel level; display filters hide packets in the GUI.'
          }
        ]
      },
      {
        id: 'p2-l10',
        phaseId: 'phase-2-networking',
        lessonNumber: 10,
        title: 'Network Defense: Firewalls, NAT, and DMZ Architecture',
        estimatedMinutes: 30,
        difficulty: 'Intermediate',
        prerequisites: ['Subnetting and protocols'],
        theory: 'Network security relies on Defense-in-Depth. Network Address Translation (NAT) maps internal RFC 1918 private IPs to public routable IPs. A Demilitarized Zone (DMZ) is a separate subnet hosting public-facing servers (web, mail) isolated by dual firewalls so a compromised web server cannot directly access internal Active Directory domain controllers.',
        stepByStep: [
          'Examine stateful packet inspection: tracking connection states (NEW, ESTABLISHED, RELATED, INVALID).',
          'Understand default-deny firewall posture: block all inbound and outbound traffic by default, explicitly whitelisting authorized ports.',
          'Review DMZ architecture: Internet -> Outer Firewall -> DMZ Subnet -> Inner Firewall -> Corporate LAN.',
          'Configure basic stateful firewall rules with iptables or UFW.'
        ],
        commands: [
          { cmd: 'sudo ufw default deny incoming', explanation: 'Enforce default drop for all incoming connections.' },
          { cmd: 'sudo ufw allow 22/tcp', explanation: 'Explicitly whitelist SSH administrative port.' },
          { cmd: 'sudo ufw status verbose', explanation: 'Display active stateful firewall policy.' }
        ],
        practicalExample: 'If a web server in a DMZ suffers a Remote Code Execution (RCE) compromise, the inner firewall prevents the attacker from opening connections to internal databases or file servers.',
        exercise: 'State the four connection states evaluated by a stateful Linux firewall.',
        expectedResult: 'NEW, ESTABLISHED, RELATED, INVALID.',
        knowledgeCheck: [
          {
            question: 'What is the primary architectural purpose of a Demilitarized Zone (DMZ)?',
            options: ['To speed up internet access', 'To isolate public-facing services from the private internal corporate network', 'To bypass firewall inspection', 'To replace encryption'],
            correctIndex: 1,
            explanation: 'A DMZ prevents a compromised external-facing server from directly pivoting into internal assets.'
          }
        ]
      }
    ]
  },

  // ==========================================
  // PHASE 3: PYTHON FOR SECURITY (10 Lessons)
  // ==========================================
  {
    id: 'phase-3-python',
    phaseNumber: 3,
    title: 'Python for Cyber Security & Automation',
    badge: 'PYTHON',
    description: 'Build custom port scanners, banner grabbers, web request engines, packet crafters with Scapy, and credential audit scripts.',
    targetRole: 'Security Automation Engineer',
    level: 'Intermediate',
    lessons: [
      {
        id: 'p3-l1',
        phaseId: 'phase-3-python',
        lessonNumber: 1,
        title: 'Python Sockets & Building a Simple TCP Port Scanner',
        estimatedMinutes: 30,
        difficulty: 'Intermediate',
        prerequisites: ['Python basics', 'TCP handshake'],
        theory: 'The Python "socket" standard library module provides low-level access to network interfaces. By attempting a socket.connect_ex() operation, a script sends a TCP SYN packet; if the function returns 0, the 3-way handshake succeeded and the port is OPEN. If an error code is returned, the port is closed or filtered.',
        stepByStep: [
          'Import the socket module in Python.',
          'Configure a socket object: socket.socket(socket.AF_INET, socket.SOCK_STREAM).',
          'Set a socket timeout: s.settimeout(0.5) to avoid hanging indefinitely on filtered ports.',
          'Loop across ports (e.g. 20 through 1024) and test connectivity.',
          'Gracefully close sockets after each check.'
        ],
        commands: [
          { cmd: 'python3 -c "import socket; s = socket.socket(); print(\'Socket created\')"', explanation: 'Test socket module import.' }
        ],
        practicalExample: 'Security engineers build custom socket scripts to verify port availability across internal containers without installing heavy external tools like Nmap.',
        exercise: 'Write a 10-line Python script that checks if port 80 and 443 are open on 127.0.0.1.',
        expectedResult: 'Script prints: "Port 80 is closed / Port 443 is closed" or "Open".',
        knowledgeCheck: [
          {
            question: 'What return code does socket.connect_ex() return when a TCP connection is successful?',
            options: ['-1', '0', '1', '200'],
            correctIndex: 1,
            explanation: 'connect_ex() returns 0 on success (matching C library convention).'
          }
        ]
      },
      {
        id: 'p3-l2',
        phaseId: 'phase-3-python',
        lessonNumber: 2,
        title: 'Building a Multi-Threaded Port Scanner in Python',
        estimatedMinutes: 35,
        difficulty: 'Intermediate',
        prerequisites: ['Python sockets'],
        theory: 'Serial port scanners checking 1,000 ports with a 1-second timeout can take over 15 minutes. By utilizing the concurrent.futures module (ThreadPoolExecutor) or the threading library, hundreds of ports can be queried simultaneously, completing scans in a few seconds.',
        stepByStep: [
          'Import concurrent.futures and socket.',
          'Define a scan_port(ip, port) worker function.',
          'Initialize a ThreadPoolExecutor with max_workers=50.',
          'Submit port scan tasks and print results as they complete.'
        ],
        commands: [
          { cmd: 'python3 -m py_compile scanner.py', explanation: 'Verify Python script syntax.' }
        ],
        practicalExample: 'Asset management automation teams run scheduled threaded Python scanners to alert on newly opened listening ports across cloud server fleets.',
        exercise: 'Execute a multi-threaded scanner script against localhost port range 1-1000.',
        expectedResult: 'Scan completes in under 3 seconds, printing all local listening ports.',
        knowledgeCheck: [
          {
            question: 'Which modern standard library module simplifies managing worker thread pools in Python?',
            options: ['multiprocessing', 'concurrent.futures', 'threading.old', 'asyncio.thread'],
            correctIndex: 1,
            explanation: 'concurrent.futures.ThreadPoolExecutor provides high-level thread pool execution.'
          }
        ]
      },
      {
        id: 'p3-l3',
        phaseId: 'phase-3-python',
        lessonNumber: 3,
        title: 'Automated Banner Grabbing & Service Version Detection',
        estimatedMinutes: 25,
        difficulty: 'Intermediate',
        prerequisites: ['Python sockets'],
        theory: 'Once a port is verified as open, services like SSH, FTP, SMTP, and HTTP emit introductory greeting banners. By connecting and reading the first buffer of bytes (s.recv(1024)), a Python script can extract daemon names and version numbers.',
        stepByStep: [
          'Establish a socket connection to an open port.',
          'For interactive services (FTP/SSH), call s.recv(1024) immediately.',
          'For HTTP services, transmit a probe: s.send(b"HEAD / HTTP/1.1\\r\\nHost: target\\r\\n\\r\\n").',
          'Decode bytes to string using utf-8 or latin-1 with error replacement.'
        ],
        commands: [
          { cmd: 'nc -nv 127.0.0.1 22', explanation: 'Manual verification of SSH banner grab using netcat.' }
        ],
        practicalExample: 'Software inventory auditors scrape banners to detect servers running vulnerable OpenSSH versions (e.g. OpenSSH 9.2p1 vulnerable to CVE-2024-6387 regreSSHion).',
        exercise: 'Connect to an SSH service and print the first line of the banner.',
        expectedResult: 'Banner output: "SSH-2.0-OpenSSH_9.x Debian...".',
        knowledgeCheck: [
          {
            question: 'What string does a web server return in its response header to identify its software?',
            options: ['User-Agent', 'Server', 'Host', 'Daemon'],
            correctIndex: 1,
            explanation: 'The Server HTTP response header identifies software like Apache or Nginx.'
          }
        ]
      },
      {
        id: 'p3-l4',
        phaseId: 'phase-3-python',
        lessonNumber: 4,
        title: 'HTTP Automation with Python Requests',
        estimatedMinutes: 30,
        difficulty: 'Beginner',
        prerequisites: ['Python basics', 'HTTP protocol'],
        theory: 'The third-party "requests" library is the gold standard for interacting with web applications and APIs in Python. It handles cookies, sessions, custom headers, SSL verification, proxies, and JSON serialization with an intuitive API.',
        stepByStep: [
          'Install requests: pip install requests.',
          'Send a GET request: resp = requests.get(url, headers={"User-Agent": "CyberLab"}).',
          'Inspect status codes, response headers, and cookies: resp.status_code, resp.headers.',
          'Send POST data: resp = requests.post(url, data={"user": "admin"}).',
          'Manage persistent session cookies with requests.Session().'
        ],
        commands: [
          { cmd: 'python3 -c "import requests; r = requests.get(\'https://httpbin.org/get\'); print(r.status_code)"', explanation: 'Test HTTP GET request in Python.' }
        ],
        practicalExample: 'Security teams write Python scripts using requests.Session() to automate logging into corporate portals and validating that security headers (HSTS, CSP) are present across thousands of URLs.',
        exercise: 'Write a script that queries a URL and prints all Set-Cookie header flags.',
        expectedResult: 'Prints cookie attributes (HttpOnly, Secure, SameSite).',
        knowledgeCheck: [
          {
            question: 'Which object in Python requests preserves cookies across multiple consecutive HTTP requests?',
            options: ['requests.CookieJar', 'requests.Session()', 'requests.Persistent()', 'requests.Connection()'],
            correctIndex: 1,
            explanation: 'requests.Session() persists cookies, authentication tokens, and TCP connections.'
          }
        ]
      },
      {
        id: 'p3-l5',
        phaseId: 'phase-3-python',
        lessonNumber: 5,
        title: 'Web Scraping & Link Extraction with BeautifulSoup',
        estimatedMinutes: 30,
        difficulty: 'Intermediate',
        prerequisites: ['Python requests', 'HTML basics'],
        theory: 'Automating reconnaissance requires parsing HTML to extract links (<a href>), form input fields (<input name>), and scripts (<script src>). The "beautifulsoup4" library parses HTML into navigable tree structures.',
        stepByStep: [
          'Install bs4: pip install beautifulsoup4.',
          'Fetch page HTML with requests.get().',
          'Parse page with BeautifulSoup: soup = BeautifulSoup(resp.text, "html.parser").',
          'Extract all links: [a["href"] for a in soup.find_all("a", href=True)].',
          'Extract all form actions and method types to map attack surfaces.'
        ],
        commands: [
          { cmd: 'python3 -c "from bs4 import BeautifulSoup; print(\'BS4 ready\')"', explanation: 'Verify BeautifulSoup installation.' }
        ],
        practicalExample: 'Bug bounty hunters build custom Python crawlers to find unlinked endpoints, comment blocks, and hidden input fields that automated scanners miss.',
        exercise: 'Scrape a web page and print all script sources ending in .js.',
        expectedResult: 'List of JavaScript bundle URLs.',
        knowledgeCheck: [
          {
            question: 'Which BeautifulSoup method finds all occurrences of a specific HTML tag?',
            options: ['soup.select_first()', 'soup.find_all()', 'soup.extract()', 'soup.get_tags()'],
            correctIndex: 1,
            explanation: 'soup.find_all("tag_name") returns a list of all matching HTML elements.'
          }
        ]
      },
      {
        id: 'p3-l6',
        phaseId: 'phase-3-python',
        lessonNumber: 6,
        title: 'Packet Crafting and Injection with Scapy',
        estimatedMinutes: 35,
        difficulty: 'Advanced',
        prerequisites: ['Python basics', 'TCP/IP headers'],
        theory: 'Scapy is an interactive packet manipulation library in Python. It allows stacking protocol layers using the division operator: packet = IP(dst="target")/TCP(dport=80, flags="S"). Scapy can send packets at Layer 3 (sr, sr1), Layer 2 (srp), and sniff packets from interfaces (sniff()).',
        stepByStep: [
          'Install Scapy: pip install scapy.',
          'Create an IP packet object: pkt = IP(dst="192.168.1.1")/ICMP().',
          'Send and receive a reply: reply = sr1(pkt, timeout=1).',
          'Create a TCP SYN probe: tcp_pkt = IP(dst="127.0.0.1")/TCP(dport=22, flags="S").',
          'Sniff network packets in Python: packets = sniff(count=5, filter="ip").'
        ],
        commands: [
          { cmd: 'sudo python3 -c "from scapy.all import IP, ICMP, sr1; p = sr1(IP(dst=\'127.0.0.1\')/ICMP(), timeout=1); print(p.summary())"', explanation: 'Send ICMP packet using Scapy.' }
        ],
        practicalExample: 'IDS signature engineers use Scapy to craft custom exploit simulation packets, verifying that Suricata or Snort rules fire without executing real malware.',
        exercise: 'Use Scapy to forge an ICMP packet with a custom payload string.',
        expectedResult: 'Packet transmits with custom data in the payload section.',
        knowledgeCheck: [
          {
            question: 'Which operator does Scapy use to stack network protocol layers together?',
            options: ['+', '|', '/', '>>'],
            correctIndex: 2,
            explanation: 'Scapy overloads the forward-slash (/) operator to layer protocols (e.g. IP()/TCP()).'
          }
        ]
      },
      {
        id: 'p3-l7',
        phaseId: 'phase-3-python',
        lessonNumber: 7,
        title: 'Building a Fast Hash Cracker in Python',
        estimatedMinutes: 30,
        difficulty: 'Intermediate',
        prerequisites: ['Cryptography hash basics'],
        theory: 'The Python "hashlib" library provides cryptographic hash functions (md5, sha1, sha256, sha512). A dictionary hash cracker reads words from a wordlist, computes the hash for each candidate, and compares it against the target hash.',
        stepByStep: [
          'Import hashlib.',
          'Define hash function: hashlib.sha256(candidate.encode()).hexdigest().',
          'Iterate through lines of a wordlist file.',
          'Strip whitespace and newlines: word.strip().',
          'Compare and print password when match occurs.'
        ],
        commands: [
          { cmd: 'python3 -c "import hashlib; print(hashlib.sha256(b\'password\').hexdigest())"', explanation: 'Generate SHA-256 hash in Python.' }
        ],
        practicalExample: 'Understanding how fast Python cracks unsalted hashes demonstrates why production applications must use bcrypt or Argon2 with computational work factors.',
        exercise: 'Write a Python script to crack the SHA-256 hash "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8".',
        expectedResult: 'Recovers plaintext: "password".',
        knowledgeCheck: [
          {
            question: 'Why must strings be converted to bytes using .encode() before hashing in hashlib?',
            options: ['Hashes only operate on raw byte sequences', 'To speed up CPU processing', 'Python syntax requires it', 'To prevent memory leaks'],
            correctIndex: 0,
            explanation: 'Cryptographic hash functions take byte arrays as input, not Unicode strings.'
          }
        ]
      },
      {
        id: 'p3-l8',
        phaseId: 'phase-3-python',
        lessonNumber: 8,
        title: 'Network Packet Sniffing and Traffic Analysis with Python',
        estimatedMinutes: 35,
        difficulty: 'Advanced',
        prerequisites: ['Scapy basics', 'Raw sockets'],
        theory: 'Python can capture live network packets either using Scapy’s sniff() function or raw sockets (socket.socket(socket.AF_PACKET, socket.SOCK_RAW, socket.ntohs(3))). Dissecting headers reveals IP addresses, protocol flags, and payload data.',
        stepByStep: [
          'Import sniff from scapy.all.',
          'Define a packet callback function: def process_packet(packet): ...',
          'Extract source and destination IP: packet[IP].src, packet[IP].dst.',
          'Filter for DNS queries and print requested domains.',
          'Execute: sniff(iface="eth0", filter="udp port 53", prn=process_packet, store=0).'
        ],
        commands: [
          { cmd: 'sudo python3 -c "from scapy.all import sniff; sniff(count=2, prn=lambda p: print(p.summary()))"', explanation: 'Capture 2 packets and print summaries.' }
        ],
        practicalExample: 'Security defenders run Python sniffers on IoT subnets to detect devices communicating with unexpected foreign IP addresses.',
        exercise: 'Write a 10-line Python script that sniffs network packets and prints every HTTP GET request path.',
        expectedResult: 'Displays requested URLs in real time.',
        knowledgeCheck: [
          {
            question: 'What does setting store=0 in Scapy sniff() prevent?',
            options: ['Packet transmission', 'Excessive memory consumption by not keeping packets in RAM', 'Network loops', 'File deletion'],
            correctIndex: 1,
            explanation: 'store=0 prevents Scapy from accumulating packets in memory during long captures.'
          }
        ]
      },
      {
        id: 'p3-l9',
        phaseId: 'phase-3-python',
        lessonNumber: 9,
        title: 'Building an SSH Audit and Automation Tool with Paramiko',
        estimatedMinutes: 30,
        difficulty: 'Intermediate',
        prerequisites: ['Python basics', 'SSH fundamentals'],
        theory: 'Paramiko is a pure-Python implementation of the SSHv2 protocol. It supports key-based authentication, command execution on remote hosts, and SFTP file transfers, making it essential for security hardening automation and auditing fleets of servers.',
        stepByStep: [
          'Install paramiko: pip install paramiko.',
          'Create an SSH client: client = paramiko.SSHClient().',
          'Configure host key policy: client.set_missing_host_key_policy(paramiko.AutoAddPolicy()).',
          'Connect with private key or credentials: client.connect(hostname, port, username, key_filename).',
          'Execute audit command: stdin, stdout, stderr = client.exec_command("uname -a").'
        ],
        commands: [
          { cmd: 'python3 -c "import paramiko; print(\'Paramiko installed\')"', explanation: 'Verify Paramiko installation.' }
        ],
        practicalExample: 'DevSecOps engineers write Paramiko scripts to audit /etc/ssh/sshd_config across 200 Linux hosts, automatically verifying that PermitRootLogin is set to "no".',
        exercise: 'Write a script that executes "uptime" over SSH and prints the output.',
        expectedResult: 'Prints server load average and system uptime.',
        knowledgeCheck: [
          {
            question: 'Which method executes a remote shell command on an authenticated Paramiko SSHClient?',
            options: ['client.run()', 'client.exec_command()', 'client.execute()', 'client.shell_send()'],
            correctIndex: 1,
            explanation: 'exec_command() returns three streams: stdin, stdout, and stderr.'
          }
        ]
      },
      {
        id: 'p3-l10',
        phaseId: 'phase-3-python',
        lessonNumber: 10,
        title: 'Parsing Security Logs & Building an Incident Alert Script',
        estimatedMinutes: 30,
        difficulty: 'Intermediate',
        prerequisites: ['Python regex (re)', 'Log formats'],
        theory: 'Automating security response requires parsing log feeds (Nginx, Apache, Syslog) to detect indicators of compromise (IoCs). Using Python’s "re" (regular expressions) module, scripts extract IP addresses, timestamps, and request URIs, alerting when failure thresholds are breached.',
        stepByStep: [
          'Import re and collections.defaultdict.',
          'Define regex pattern for IP and HTTP status: r\'^(\\S+) .* ".*" (\\d{3})\'.',
          'Read log file line by line.',
          'Count 404 or 401 errors per source IP.',
          'Trigger alert when an IP generates more than 50 errors in one minute (scanner detection).'
        ],
        commands: [
          { cmd: 'python3 -c "import re; m = re.search(r\'\\d+\', \'Port 8080\'); print(m.group())"', explanation: 'Test regex pattern matching in Python.' }
        ],
        practicalExample: 'A SOC engineer writes a lightweight Python daemon that tails /var/log/auth.log, automatically triggering an alert whenever an IP records more than 5 failed SSH logins.',
        exercise: 'Parse a sample access log file and print the IP that made the most requests.',
        expectedResult: 'Outputs: "Top IP: 192.168.1.100 with 45 requests".',
        knowledgeCheck: [
          {
            question: 'Which Python standard library module is used for regular expression matching?',
            options: ['regex_lib', 're', 'pattern', 'string_matcher'],
            correctIndex: 1,
            explanation: 'The re module is Python’s built-in regular expression engine.'
          }
        ]
      }
    ]
  },

  // ==========================================
  // PHASE 4: BASH SCRIPTING & AUTOMATION (10 Lessons)
  // ==========================================
  {
    id: 'phase-4-bash',
    phaseNumber: 4,
    title: 'Bash Scripting & Task Automation',
    badge: 'BASH',
    description: 'Automate security auditing workflows with Bash shell scripts, control structures, regex pipelines, signal handling, and cron jobs.',
    targetRole: 'Cyber Systems Automator',
    level: 'Beginner to Intermediate',
    lessons: [
      {
        id: 'p4-l1',
        phaseId: 'phase-4-bash',
        lessonNumber: 1,
        title: 'Bash Script Structure, Shebang, and Variables',
        estimatedMinutes: 20,
        difficulty: 'Beginner',
        prerequisites: ['Linux CLI basics'],
        theory: 'A Bash script is an executable text file containing commands executed by the Bourne-Again Shell (/bin/bash). The first line MUST be the shebang (#!/bin/bash), directing the kernel to the interpreter. Variables are assigned without spaces around "=" (VAR="value") and accessed using "$VAR". Best practice includes "set -euo pipefail" to catch unhandled errors.',
        stepByStep: [
          'Create a script file "audit.sh".',
          'Add shebang: "#!/bin/bash".',
          'Add defensive error settings: "set -euo pipefail".',
          'Declare variables: TARGET="192.168.1.1".',
          'Make script executable: "chmod +x audit.sh" and run with "./audit.sh".'
        ],
        commands: [
          { cmd: 'echo \'#!/bin/bash\' > test.sh && echo \'echo "Hello $USER"\' >> test.sh && chmod +x test.sh && ./test.sh', explanation: 'Create, chmod, and run simple script.' }
        ],
        practicalExample: 'Penetration testers maintain standardized Bash initialization scripts that configure network interfaces, start services, and set up project directories with a single command.',
        exercise: 'Create a script that prints your username, hostname, and current date.',
        expectedResult: 'Outputs system identity details cleanly.',
        knowledgeCheck: [
          {
            question: 'What is the purpose of "#!/bin/bash" on the first line of a script?',
            options: ['It is a comment', 'It tells the kernel which interpreter to use to execute the script', 'It compiles the script to binary', 'It grants root privileges'],
            correctIndex: 1,
            explanation: 'The shebang (#!/) specifies the absolute path to the binary interpreter.'
          }
        ]
      },
      {
        id: 'p4-l2',
        phaseId: 'phase-4-bash',
        lessonNumber: 2,
        title: 'Conditionals and Test Operators in Bash',
        estimatedMinutes: 25,
        difficulty: 'Beginner',
        prerequisites: ['Bash variables'],
        theory: 'Conditionals in Bash use "if [ condition ]; then ... fi" or the modern "[[ ... ]]". Common test operators include -f (file exists), -d (directory exists), -z (string is empty), -n (string is not empty), -eq (numerical equality), and == (string equality).',
        stepByStep: [
          'Test if a target IP was supplied: if [ -z "$1" ]; then echo "Usage: $0 <IP>"; exit 1; fi',
          'Check if a file exists: if [ -f "/etc/passwd" ]; then echo "Found"; fi',
          'Check if user is root: if [ "$EUID" -ne 0 ]; then echo "Run as root"; exit 1; fi',
          'Combine conditions using && and ||.'
        ],
        commands: [
          { cmd: '[ -f /etc/passwd ] && echo "Passwd file exists"', explanation: 'Inline conditional check using test operator.' }
        ],
        practicalExample: 'Security scripts verify whether they are running as root before executing raw socket scanners: "if [ \"$EUID\" -ne 0 ]; then echo \"Error: Sudo required\"; exit 1; fi".',
        exercise: 'Write a script that takes a filename as $1 and outputs whether the file exists or not.',
        expectedResult: 'Outputs "File exists" or "File not found".',
        knowledgeCheck: [
          {
            question: 'Which test operator checks if a file exists and is a regular file in Bash?',
            options: ['-d', '-e', '-f', '-s'],
            correctIndex: 2,
            explanation: '-f checks if a path exists and is a regular file (-d checks for directories).'
          }
        ]
      },
      {
        id: 'p4-l3',
        phaseId: 'phase-4-bash',
        lessonNumber: 3,
        title: 'Loops in Bash: for, while, and reading files line-by-line',
        estimatedMinutes: 25,
        difficulty: 'Beginner',
        prerequisites: ['Bash conditionals'],
        theory: '"for" loops iterate over words, lists, or number ranges (for ip in 192.168.1.{1..254}). "while read -r line" loops are the correct, robust method for processing wordlists and log files line-by-line without truncating spaces or backslashes.',
        stepByStep: [
          'Loop across a number range: for i in {1..10}; do echo $i; done',
          'Iterate across target hosts from a text file: while read -r host; do ping -c 1 "$host"; done < targets.txt',
          'Iterate over discovered files: for f in /var/log/*.log; do gzip "$f"; done'
        ],
        commands: [
          { cmd: 'for i in 80 443 8080; do echo "Checking port $i"; done', explanation: 'Simple for loop across port numbers.' }
        ],
        practicalExample: 'Security analysts write quick Bash loops to sweep a /24 subnet: "for i in {1..254}; do ping -c 1 -W 1 192.168.1.$i >/dev/null && echo \"192.168.1.$i ALIVE\"; done".',
        exercise: 'Write a for loop that creates 5 files named lab_test_1.txt through lab_test_5.txt.',
        expectedResult: 'Creates all five files in current directory.',
        knowledgeCheck: [
          {
            question: 'What is the recommended idiom in Bash to process a file line-by-line safely?',
            options: ['for line in $(cat file)', 'while read -r line; do ... done < file', 'loop through file', 'read lines from file'],
            correctIndex: 1,
            explanation: '"while read -r line" prevents word-splitting and preserves leading/trailing whitespace.'
          }
        ]
      },
      {
        id: 'p4-l4',
        phaseId: 'phase-4-bash',
        lessonNumber: 4,
        title: 'Command Substitution, Exit Codes, and Pipeline Redirection',
        estimatedMinutes: 25,
        difficulty: 'Intermediate',
        prerequisites: ['Bash basics'],
        theory: 'Every Linux command terminates with an Exit Code ($?): 0 indicates success, non-zero indicates an error. Command substitution uses "$(command)" to capture command output into a variable. Redirection operators manage streams: > (overwrite stdout), >> (append stdout), 2> (redirect stderr), 2>&1 (merge stderr into stdout), and | (pipe stdout to next command stdin).',
        stepByStep: [
          'Capture command output: CURRENT_USER="$(whoami)".',
          'Inspect previous exit code: echo "$?".',
          'Discard output completely: ping -c 1 1.1.1.1 >/dev/null 2>&1.',
          'Chain execution based on exit code: cmd1 && cmd2 (run cmd2 only if cmd1 succeeds); cmd1 || cmd2 (run cmd2 if cmd1 fails).'
        ],
        commands: [
          { cmd: 'DATE_STAMP="$(date +%Y%m%d)" && echo "Backup date: $DATE_STAMP"', explanation: 'Capture date command into variable.' }
        ],
        practicalExample: 'Security scripts suppress verbose terminal output during scans while checking exit status: "if ping -c 1 -W 1 $IP >/dev/null 2>&1; then echo \"$IP is up\"; fi".',
        exercise: 'Run a command that fails (like "ls /nonexistent_folder") and verify that "$?" outputs a non-zero number.',
        expectedResult: 'Terminal prints 2 (or non-zero).',
        knowledgeCheck: [
          {
            question: 'What special variable holds the exit status of the most recently executed foreground pipeline in Bash?',
            options: ['$$', '$!', '$?', '$#'],
            correctIndex: 2,
            explanation: '$? stores the exit status of the last executed command (0 = success).'
          }
        ]
      },
      {
        id: 'p4-l5',
        phaseId: 'phase-4-bash',
        lessonNumber: 5,
        title: 'Positional Parameters, Arguments, and getopts',
        estimatedMinutes: 30,
        difficulty: 'Intermediate',
        prerequisites: ['Bash variables and loops'],
        theory: 'Scripts accept command-line arguments: $0 (script name), $1-$9 (arguments), $# (count of arguments), and "$@" (array of all arguments). For professional CLI tools, "getopts" parses standard POSIX single-letter flags (e.g. -u <url>, -p <port>, -v for verbose).',
        stepByStep: [
          'Validate minimum argument count: if [ "$#" -lt 1 ]; then echo "Missing args"; exit 1; fi',
          'Parse flags with getopts: while getopts "t:p:v" opt; do case $opt in ... esac; done',
          'Handle unknown options with * case.'
        ],
        commands: [
          { cmd: 'bash -c \'echo "Script: $0, First arg: $1"\' test hello', explanation: 'Demonstrate positional parameter expansion.' }
        ],
        practicalExample: 'Security engineers package complex recon tools into clean CLI scripts accepting standard flags like "-t <target> -p <ports> -o <output>".',
        exercise: 'Write a script that accepts a target domain with -d and prints "Auditing: <domain>".',
        expectedResult: 'Running "./script.sh -d example.com" outputs "Auditing: example.com".',
        knowledgeCheck: [
          {
            question: 'Which variable represents the total number of positional parameters passed to a Bash script?',
            options: ['$@', '$#', '$*', '$?'],
            correctIndex: 1,
            explanation: '$# contains the integer count of arguments passed to the script.'
          }
        ]
      },
      {
        id: 'p4-l6',
        phaseId: 'phase-4-bash',
        lessonNumber: 6,
        title: 'Building an Automated Subnet Ping Sweep Script',
        estimatedMinutes: 35,
        difficulty: 'Intermediate',
        prerequisites: ['Bash loops and redirection'],
        theory: 'Combining loops, ping timeouts, background execution (&), and output redirection allows writing an ultra-fast pure-Bash ping sweeper that discovers live hosts on a /24 subnet without external dependencies.',
        stepByStep: [
          'Accept subnet prefix as $1 (e.g. 192.168.1).',
          'Loop across 1 through 254.',
          'Execute ping with a 1-second timeout in background (&).',
          'Wait for background jobs to finish with "wait".',
          'Output responding IP addresses.'
        ],
        commands: [
          { cmd: 'for ip in 127.0.0.{1..3}; do ping -c 1 -W 1 $ip >/dev/null && echo "$ip up" & done; wait', explanation: 'Parallel background ping sweep test.' }
        ],
        practicalExample: 'When landing on a restricted Linux container where Nmap and fping are absent, a penetration tester writes a 5-line Bash ping sweep script to map the internal subnet.',
        exercise: 'Run a 3-host background ping sweep against 127.0.0.1, 127.0.0.2, and 127.0.0.3.',
        expectedResult: 'All 3 loopback IPs report "up".',
        knowledgeCheck: [
          {
            question: 'Which Bash command pauses execution until all background child processes finish?',
            options: ['sleep', 'wait', 'hold', 'sync'],
            correctIndex: 1,
            explanation: 'The "wait" command blocks until all background jobs have terminated.'
          }
        ]
      },
      {
        id: 'p4-l7',
        phaseId: 'phase-4-bash',
        lessonNumber: 7,
        title: 'Building an Automated Port Scanner in Bash using /dev/tcp',
        estimatedMinutes: 30,
        difficulty: 'Intermediate',
        prerequisites: ['Bash loops and conditionals'],
        theory: 'Bash features a built-in virtual device path: /dev/tcp/<host>/<port>. Attempting to redirect output or open a file descriptor to this path causes Bash to open a TCP socket natively. If the redirect succeeds, the port is open; if it fails, the port is closed.',
        stepByStep: [
          'Open socket using exec: (echo > /dev/tcp/127.0.0.1/80) >/dev/null 2>&1',
          'Check exit code: if [ $? -eq 0 ]; then echo "Port 80 open"; fi',
          'Loop through standard ports: for port in 21 22 25 80 443; do ... done'
        ],
        commands: [
          { cmd: 'timeout 1 bash -c "cat < /dev/null > /dev/tcp/scanme.nmap.org/80" && echo "Port 80 is OPEN"', explanation: 'Native Bash TCP port probe.' }
        ],
        practicalExample: 'In restricted environments during CTFs or post-exploitation, native /dev/tcp scanning allows port enumeration without touching disk or compiling tools.',
        exercise: 'Test if port 22 is open on 127.0.0.1 using /dev/tcp.',
        expectedResult: 'Outputs OPEN if SSH is running, or closed.',
        knowledgeCheck: [
          {
            question: 'What pseudo-filesystem does Bash use to open native TCP socket connections?',
            options: ['/proc/net/tcp', '/dev/tcp/<host>/<port>', '/sys/class/net', '/dev/socket'],
            correctIndex: 1,
            explanation: 'Bash natively interprets /dev/tcp/<host>/<port> as a TCP socket.'
          }
        ]
      },
      {
        id: 'p4-l8',
        phaseId: 'phase-4-bash',
        lessonNumber: 8,
        title: 'Building an Automated Web Recon Pipeline in Bash',
        estimatedMinutes: 35,
        difficulty: 'Intermediate',
        prerequisites: ['Bash loops', 'curl and jq'],
        theory: 'Security analysts chain standalone tools into automated pipelines. A Bash script takes a domain, queries crt.sh certificate transparency logs for subdomains using curl and jq, probes discovered hosts for HTTP status with httpx, and pipes results into nuclei for vulnerability scanning.',
        stepByStep: [
          'Create directory structure for target domain.',
          'Fetch subdomains from crt.sh: curl -s "https://crt.sh/?q=%.$1&output=json" | jq -r \'.[].name_value\' | sort -u > subdomains.txt',
          'Filter out wildcard entries.',
          'Probe live web services using httpx.',
          'Log results into structured report folder.'
        ],
        commands: [
          { cmd: 'curl -s "https://crt.sh/?q=%.example.com&output=json" | head -n 10', explanation: 'Query certificate transparency API.' }
        ],
        practicalExample: 'Bug bounty hunters automate the entire reconnaissance lifecycle, triggering this script on new scope domains to discover assets within minutes of launch.',
        exercise: 'Write a script that queries crt.sh for a domain and outputs unique hostnames.',
        expectedResult: 'Outputs deduplicated list of subdomains found in TLS certificates.',
        knowledgeCheck: [
          {
            question: 'Which command-line utility is used to parse, filter, and extract JSON fields in Bash pipelines?',
            options: ['grep', 'jq', 'sed', 'awk'],
            correctIndex: 1,
            explanation: 'jq is the lightweight command-line JSON processor.'
          }
        ]
      },
      {
        id: 'p4-l9',
        phaseId: 'phase-4-bash',
        lessonNumber: 9,
        title: 'Signal Handling and Trap in Bash Scripts',
        estimatedMinutes: 25,
        difficulty: 'Intermediate',
        prerequisites: ['Bash scripting basics'],
        theory: 'When scripts create temporary files (/tmp/scan_XXXX.tmp) or run background processes, pressing Ctrl+C (SIGINT) can leave orphaned files and processes behind. The "trap" command intercepts signals (SIGINT, SIGTERM, EXIT) and executes a cleanup function before terminating.',
        stepByStep: [
          'Define a cleanup function: cleanup() { rm -f "$TEMP_FILE"; echo "Cleaned up"; }',
          'Register signal trap: trap cleanup SIGINT SIGTERM EXIT',
          'Create secure temporary file: TEMP_FILE="$(mktemp /tmp/audit_XXXXXX.txt)"',
          'Run script tasks safely knowing cleanup executes even on Ctrl+C.'
        ],
        commands: [
          { cmd: 'trap \'echo "Interrupted!"\' SIGINT', explanation: 'Register trap handler for Ctrl+C.' }
        ],
        practicalExample: 'Automated penetration testing scripts that spawn local proxy listeners or mount drives register trap handlers to unmount drives and terminate child processes on exit.',
        exercise: 'Write a script with a trap that prints "Exiting cleanly" whenever the script finishes.',
        expectedResult: 'Executing the script prints "Exiting cleanly" upon termination.',
        knowledgeCheck: [
          {
            question: 'Which signal does the terminal send to the foreground process group when the user presses Ctrl+C?',
            options: ['SIGHUP', 'SIGINT', 'SIGKILL', 'SIGSTOP'],
            correctIndex: 1,
            explanation: 'Ctrl+C generates a SIGINT (Signal Interrupt, signal 2).'
          }
        ]
      },
      {
        id: 'p4-l10',
        phaseId: 'phase-4-bash',
        lessonNumber: 10,
        title: 'Hardening & Linting Bash Scripts with ShellCheck',
        estimatedMinutes: 25,
        difficulty: 'Intermediate',
        prerequisites: ['Bash script authoring'],
        theory: 'Writing secure, production-grade Bash requires defensive habits: quoting all variables ("$VAR") to prevent word-splitting and globbing, using "set -euo pipefail", and running "shellcheck" to catch common bugs, syntax pitfalls, and security antipatterns.',
        stepByStep: [
          'Install ShellCheck: sudo apt install shellcheck.',
          'Run static analysis: shellcheck my_script.sh.',
          'Review warnings: SC2086 (quote variable), SC2002 (useless cat), SC2154 (unassigned variable).',
          'Incorporate defensive flags: set -e (exit on error), set -u (treat unset variables as error), set -o pipefail (fail if any pipe element fails).'
        ],
        commands: [
          { cmd: 'shellcheck --version', explanation: 'Check ShellCheck static analyzer version.' }
        ],
        practicalExample: 'In enterprise CI/CD repositories, git pre-commit hooks run shellcheck across all infrastructure scripts to reject unquoted variables that could permit command injection.',
        exercise: 'Run shellcheck against an unquoted variable script and observe the SC2086 warning.',
        expectedResult: 'ShellCheck highlights unquoted variable and suggests "$var".',
        knowledgeCheck: [
          {
            question: 'What does "set -u" enforce in a Bash script?',
            options: ['Enforces UTF-8 encoding', 'Treats unset or uninitialized variables as an immediate error', 'Runs script as unprivileged user', 'Enables unlimited recursion'],
            correctIndex: 1,
            explanation: 'set -u causes Bash to exit immediately if an undeclared variable is accessed.'
          }
        ]
      }
    ]
  }
];
