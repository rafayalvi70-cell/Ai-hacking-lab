import { KaliTool } from '../../types/cyber';

export const TOOLS_PART_5: KaliTool[] = [
  {
    id: 'hping3',
    name: 'hping3 (Packet Generator & Analyzer)',
    category: 'information_gathering',
    purpose: 'Custom TCP/IP packet assembler and protocol analyzer.',
    shortDescription: 'Command-line oriented TCP/IP packet assembler and fuzzer.',
    description: 'hping3 is a network tool able to send custom TCP/IP packets and to display target replies like ping program does with ICMP replies. Handles fragmentation, firewall testing, and port discovery.',
    installationMethod: 'sudo apt install hping3',
    syntax: 'sudo hping3 [options] <target>',
    parameterExplanations: [
      { param: '-S', explanation: 'Set SYN flag on packets.' },
      { param: '-p <port>', explanation: 'Target destination port.' },
      { param: '-c <count>', explanation: 'Number of packets to transmit.' }
    ],
    safeCommands: [
      { command: 'sudo hping3 -S -p 80 -c 3 127.0.0.1', description: 'Test local port with SYN packet', explanation: 'Sends 3 custom TCP SYN probes to localhost port 80.' }
    ],
    prerequisites: ['Raw socket privileges', 'TCP packet flags understanding'],
    difficulty: 'Intermediate',
    relatedTools: ['nmap', 'nping'],
    officialDocsUrl: 'https://github.com/antirez/hping',
    defensiveUseCase: 'Firewall rule verification and MTU path discovery.',
    tags: ['packet generator', 'tcp', 'syn', 'firewall test']
  },
  {
    id: 'urlcrazy',
    name: 'URLCrazy',
    category: 'information_gathering',
    purpose: 'Generate and test domain typos and variations to detect typo-squatting.',
    shortDescription: 'Generates domain name typos and brand impersonation variations.',
    description: 'URLCrazy generates and resolves domain typos (character omission, repetition, transposition, homoglyphs) to discover phishing sites and brand infringement.',
    installationMethod: 'sudo apt install urlcrazy',
    syntax: 'urlcrazy [options] <domain>',
    parameterExplanations: [
      { param: '-i', explanation: 'Show only domain variants that currently resolve to IP addresses.' }
    ],
    safeCommands: [
      { command: 'urlcrazy -i example.com', description: 'Check resolving typo domains', explanation: 'Searches for registered domain variations.' }
    ],
    prerequisites: ['DNS knowledge'],
    difficulty: 'Beginner',
    relatedTools: ['whois'],
    officialDocsUrl: 'https://github.com/urbanadventurer/urlcrazy',
    defensiveUseCase: 'Proactive registration of organizational domain typos to prevent corporate phishing.',
    tags: ['typosquatting', 'phishing defense', 'osint', 'domains']
  },
  {
    id: 'smtp-user-enum',
    name: 'smtp-user-enum',
    category: 'information_gathering',
    purpose: 'Username guessing tool primarily for SMTP services.',
    shortDescription: 'Enumerates valid email accounts on SMTP mail daemons.',
    description: 'Queries SMTP daemons using VRFY, EXPN, or RCPT TO commands to verify whether usernames exist on the target mail server without sending actual emails.',
    installationMethod: 'sudo apt install smtp-user-enum',
    syntax: 'smtp-user-enum -M <mode> -u <user> -t <target>',
    parameterExplanations: [
      { param: '-M <mode>', explanation: 'Method: VRFY, EXPN, or RCPT.' },
      { param: '-U <file>', explanation: 'File containing candidate usernames.' }
    ],
    safeCommands: [
      { command: 'smtp-user-enum -M VRFY -u admin -t 127.0.0.1', description: 'Test username on local mail server', explanation: 'Checks if admin mailbox exists.' }
    ],
    prerequisites: ['SMTP protocol basics'],
    difficulty: 'Intermediate',
    relatedTools: ['swaks', 'nmap'],
    officialDocsUrl: 'https://www.kali.org/tools/smtp-user-enum/',
    defensiveUseCase: 'Disabling SMTP VRFY and EXPN commands in Postfix/Sendmail to prevent user enumeration.',
    tags: ['smtp', 'enumeration', 'email', 'mail server']
  },
  {
    id: 'swaks',
    name: 'Swaks (Swiss Army Knife for SMTP)',
    category: 'information_gathering',
    purpose: 'Featureful, flexible, scriptable, transaction-oriented SMTP test tool.',
    shortDescription: 'Command-line SMTP transaction tester for email deliverability.',
    description: 'Swaks is an all-purpose tool for testing SMTP servers, allowing granular control over HELO/EHLO headers, authentication, STARTTLS encryption, and MIME attachments.',
    installationMethod: 'sudo apt install swaks',
    syntax: 'swaks --to <recipient> --from <sender> --server <server> [options]',
    parameterExplanations: [
      { param: '--tls', explanation: 'Require TLS encryption for communication.' },
      { param: '--auth', explanation: 'Test SMTP authentication credentials.' }
    ],
    safeCommands: [
      { command: 'swaks --to test@example.com --from test@example.com --server 127.0.0.1 -q quit', description: 'Test local SMTP greeting banner', explanation: 'Connects and verifies banner without sending email.' }
    ],
    prerequisites: ['Email protocols'],
    difficulty: 'Beginner',
    relatedTools: ['smtp-user-enum'],
    officialDocsUrl: 'https://jetmore.org/john/code/swaks/',
    defensiveUseCase: 'Verifying mandatory TLS enforcement and SPF/DKIM validation on email gateways.',
    tags: ['smtp', 'email test', 'tls', 'mail']
  },
  {
    id: 'dnsmap',
    name: 'dnsmap',
    category: 'information_gathering',
    purpose: 'Scan for subdomains using brute forcing techniques during infrastructure audits.',
    shortDescription: 'C-based subdomain brute-forcer with built-in dictionary.',
    description: 'dnsmap is a fast C utility that iterates through an internal or external wordlist to resolve existing subdomains, identifying intranet servers and staging portals.',
    installationMethod: 'sudo apt install dnsmap',
    syntax: 'dnsmap <domain> [options]',
    parameterExplanations: [
      { param: '-w <wordlist>', explanation: 'Custom wordlist for subdomain search.' },
      { param: '-r <file>', explanation: 'Save resolved results to text file.' }
    ],
    safeCommands: [
      { command: 'dnsmap example.com -r results.txt', description: 'Map subdomains', explanation: 'Resolves standard subdomains and saves hits.' }
    ],
    prerequisites: ['DNS knowledge'],
    difficulty: 'Beginner',
    relatedTools: ['dnsenum', 'amass'],
    officialDocsUrl: 'https://github.com/makefu/dnsmap',
    defensiveUseCase: 'Identifying unlinked legacy subdomains before they can be taken over.',
    tags: ['dns', 'subdomains', 'c', 'brute force']
  },
  {
    id: 'amap',
    name: 'Amap (Application Mapper)',
    category: 'information_gathering',
    purpose: 'Identify applications running on specific ports despite non-standard port numbers.',
    shortDescription: 'Next-generation tool for service identification on non-standard ports.',
    description: 'Amap sends trigger packets and compares response banners against a signature database to identify daemons even when run on non-standard ports (e.g. SSH on port 443).',
    installationMethod: 'sudo apt install amap',
    syntax: 'amap [options] <target> <port>',
    parameterExplanations: [
      { param: '-b', explanation: 'Print ASCII banner responses.' },
      { param: '-q', explanation: 'Do not report closed or unresponsive ports.' }
    ],
    safeCommands: [
      { command: 'amap -b 127.0.0.1 22', description: 'Identify service banner', explanation: 'Probes local port 22 and matches signature.' }
    ],
    prerequisites: ['Service banners awareness'],
    difficulty: 'Intermediate',
    relatedTools: ['nmap'],
    officialDocsUrl: 'https://www.kali.org/tools/amap/',
    defensiveUseCase: 'Catching rogue proxy daemons listening on disguised standard ports.',
    tags: ['service detection', 'banner', 'application mapping']
  },
  {
    id: 'dsniff',
    name: 'dsniff',
    category: 'sniffing_spoofing',
    purpose: 'Collection of tools for network auditing and password sniffing.',
    shortDescription: 'Passively extracts plaintext passwords from network traffic.',
    description: 'dsniff passively listens to network traffic on local interfaces to extract plaintext credentials transmitted over unencrypted protocols (FTP, Telnet, HTTP, POP, IMAP).',
    installationMethod: 'sudo apt install dsniff',
    syntax: 'sudo dsniff [options]',
    parameterExplanations: [
      { param: '-i <iface>', explanation: 'Network interface to listen on.' },
      { param: '-m', explanation: 'Enable automatic protocol analysis.' }
    ],
    safeCommands: [
      { command: 'sudo dsniff -i lo', description: 'Monitor local loopback', explanation: 'Listens for unencrypted protocols on localhost.' }
    ],
    prerequisites: ['Root access', 'Networking concepts'],
    difficulty: 'Intermediate',
    relatedTools: ['tcpdump', 'wireshark'],
    officialDocsUrl: 'https://www.monkey.org/~dugsong/dsniff/',
    defensiveUseCase: 'Demonstrating why legacy unencrypted protocols (Telnet, cleartext HTTP) must be replaced with SSH and HTTPS.',
    tags: ['sniffing', 'passwords', 'plaintext', 'audit']
  },
  {
    id: 'arpspoof',
    name: 'arpspoof',
    category: 'sniffing_spoofing',
    purpose: 'Intercept packets on a switched LAN using ARP cache poisoning.',
    shortDescription: 'Sends gratuitous ARP replies to redirect LAN traffic for auditing.',
    description: 'Part of the dsniff package, arpspoof redirects packets from a target host on the LAN intended for the default gateway towards the auditor’s host by forging ARP responses.',
    installationMethod: 'sudo apt install dsniff',
    syntax: 'sudo arpspoof -i <interface> -t <target> <gateway>',
    parameterExplanations: [
      { param: '-i <iface>', explanation: 'Network interface.' },
      { param: '-t <target>', explanation: 'Target host IP to intercept.' }
    ],
    safeCommands: [
      { command: 'sudo arpspoof -h', description: 'Display command syntax', explanation: 'Lists ARP redirection flags.' }
    ],
    prerequisites: ['Layer 2 networking knowledge', 'Root access'],
    difficulty: 'Advanced',
    relatedTools: ['bettercap', 'ettercap'],
    officialDocsUrl: 'https://www.monkey.org/~dugsong/dsniff/',
    defensiveUseCase: 'Verifying that network switches have Dynamic ARP Inspection (DAI) and DHCP Snooping enabled.',
    tags: ['arp poisoning', 'mitm', 'layer2', 'spoofing']
  },
  {
    id: 'ettercap',
    name: 'Ettercap',
    category: 'sniffing_spoofing',
    purpose: 'Comprehensive suite for man in the middle attacks on switched LANs.',
    shortDescription: 'Multi-purpose sniffer/interceptor for switched LAN networks.',
    description: 'Features sniffing of live connections, content filtering on the fly, active and passive dissection of many protocols, and network poisoning capabilities.',
    installationMethod: 'sudo apt install ettercap-text-only',
    syntax: 'sudo ettercap -T [options]',
    parameterExplanations: [
      { param: '-T', explanation: 'Text-only console mode.' },
      { param: '-q', explanation: 'Quiet mode: suppress packet hex dumps.' }
    ],
    safeCommands: [
      { command: 'sudo ettercap -T -q --version', description: 'Verify installation', explanation: 'Displays compiled dissector versions.' }
    ],
    prerequisites: ['Root privileges'],
    difficulty: 'Intermediate',
    relatedTools: ['bettercap', 'wireshark'],
    officialDocsUrl: 'https://www.ettercap-project.org/',
    defensiveUseCase: 'Testing VLAN isolation and switch security defenses against broadcast storming.',
    tags: ['mitm', 'sniffer', 'dissectors', 'network']
  },
  {
    id: 'mitmproxy',
    name: 'mitmproxy',
    category: 'sniffing_spoofing',
    purpose: 'An interactive SSL/TLS-capable intercepting HTTP proxy.',
    shortDescription: 'Terminal-based interactive intercepting HTTP/HTTPS proxy.',
    description: 'A console-based HTTP and HTTPS proxy with an interactive terminal interface, Python scripting engine, and WebSocket inspection capabilities.',
    installationMethod: 'sudo apt install mitmproxy',
    syntax: 'mitmproxy [options]',
    parameterExplanations: [
      { param: '-p <port>', explanation: 'Proxy listen port (default 8080).' }
    ],
    safeCommands: [
      { command: 'mitmproxy --version', description: 'Check proxy version', explanation: 'Validates Python SSL proxy engine.' }
    ],
    prerequisites: ['Python runtime'],
    difficulty: 'Intermediate',
    relatedTools: ['burpsuite', 'zap'],
    officialDocsUrl: 'https://mitmproxy.org/',
    defensiveUseCase: 'Debugging mobile app API communications and verifying certificate pinning.',
    tags: ['proxy', 'https', 'terminal', 'python']
  },
  {
    id: 'yersinia',
    name: 'Yersinia Network Protocol Auditor',
    category: 'sniffing_spoofing',
    purpose: 'Framework for performing attacks against Layer 2 network protocols.',
    shortDescription: 'Audits Layer 2 protocols (STP, CDP, DTP, HSRP, VTP, 802.1Q).',
    description: 'Yersinia is a network tool designed to take advantage of some weaknesses in different Layer 2 protocols (Spanning Tree Protocol, Cisco Discovery Protocol, Dynamic Trunking Protocol, VLAN Trunking Protocol).',
    installationMethod: 'sudo apt install yersinia',
    syntax: 'sudo yersinia -I [options]',
    parameterExplanations: [
      { param: '-I', explanation: 'Interactive curses terminal interface.' }
    ],
    safeCommands: [
      { command: 'sudo yersinia -h', description: 'Display protocol options', explanation: 'Lists supported Layer 2 protocols.' }
    ],
    prerequisites: ['Root access', 'Layer 2 switch architecture'],
    difficulty: 'Advanced',
    relatedTools: ['bettercap'],
    officialDocsUrl: 'https://github.com/tomac/yersinia',
    defensiveUseCase: 'Enforcing BPDU Guard, Root Guard, and disabling DTP on switch access ports.',
    tags: ['layer2', 'stp', 'vlan', 'cdp', 'switch defense']
  },
  {
    id: 'cherrytree',
    name: 'CherryTree Note Taking',
    category: 'reporting',
    purpose: 'Hierarchical note-taking application for pentest documentation.',
    shortDescription: 'Hierarchical rich-text note organizer with syntax highlighting.',
    description: 'A hierarchical note-taking application featuring rich text formatting, syntax highlighting for 50+ languages, password-protected SQLite encryption, and image attachments.',
    installationMethod: 'sudo apt install cherrytree',
    syntax: 'cherrytree [file.ctb]',
    parameterExplanations: [
      { param: 'file.ctb', explanation: 'Target encrypted note database.' }
    ],
    safeCommands: [
      { command: 'cherrytree &', description: 'Launch CherryTree GUI', explanation: 'Opens notes organizer.' }
    ],
    prerequisites: ['Desktop environment'],
    difficulty: 'Beginner',
    relatedTools: ['dradis'],
    officialDocsUrl: 'https://www.giuspen.net/cherrytree/',
    defensiveUseCase: 'Maintaining standardized, encrypted assessment evidence during security engagements.',
    tags: ['notes', 'reporting', 'documentation', 'encryption']
  },
  {
    id: 'pipal',
    name: 'Pipal Password Analytics',
    category: 'reporting',
    purpose: 'Password list statistical analyzer for Active Directory audits.',
    shortDescription: 'Analyzes password lists to output length, character set, and word statistics.',
    description: 'A password analysis tool in Ruby that processes password lists and generates comprehensive statistics (top base words, character distributions, common year suffixes, length distribution).',
    installationMethod: 'git clone https://github.com/digininja/pipal.git',
    syntax: 'ruby pipal.rb <password_file>',
    parameterExplanations: [
      { param: '<file>', explanation: 'Plaintext cracked password list.' }
    ],
    safeCommands: [
      { command: 'ruby pipal.rb -h', description: 'Display analysis options', explanation: 'Lists statistical breakdown flags.' }
    ],
    prerequisites: ['Ruby runtime'],
    difficulty: 'Beginner',
    relatedTools: ['hashcat'],
    officialDocsUrl: 'https://github.com/digininja/pipal',
    defensiveUseCase: 'Generating executive reports detailing employee password creation patterns.',
    tags: ['passwords', 'statistics', 'analytics', 'reporting']
  },
  {
    id: 'photon',
    name: 'Photon OSINT Crawler',
    category: 'osint',
    purpose: 'Incredibly fast crawler designed for OSINT reconnaissance.',
    shortDescription: 'Fast Python OSINT crawler extracting emails, keys, files, and subdomains.',
    description: 'Photon crawls targets to extract emails, social media handles, Amazon S3 buckets, subdomains, secret keys, PDF documents, and external links.',
    installationMethod: 'git clone https://github.com/s0md3v/Photon.git',
    syntax: 'python3 photon.py -u <target> [options]',
    parameterExplanations: [
      { param: '-u <url>', explanation: 'Target website.' },
      { param: '-l <level>', explanation: 'Crawl depth level.' }
    ],
    safeCommands: [
      { command: 'python3 photon.py -u https://example.com -l 1', description: 'Crawl homepage for OSINT', explanation: 'Collects emails and external links safely.' }
    ],
    prerequisites: ['Python 3'],
    difficulty: 'Beginner',
    relatedTools: ['theharvester'],
    officialDocsUrl: 'https://github.com/s0md3v/Photon',
    defensiveUseCase: 'Discovering accidentally linked S3 buckets and sensitive documents on public portals.',
    tags: ['osint', 'crawler', 'emails', 's3 buckets']
  },
  {
    id: 'phoneinfoga',
    name: 'PhoneInfoga',
    category: 'osint',
    purpose: 'Advanced information gathering and OSINT framework for phone numbers.',
    shortDescription: 'Information gathering tool for phone numbers and carrier validation.',
    description: 'Collects standard information (country, area code, carrier, line type) and searches Google search dorks to identify reputation and social footprint linked to phone numbers.',
    installationMethod: 'sudo apt install phoneinfoga || curl -sSL https://raw.githubusercontent.com/sundowndev/phoneinfoga/master/support/scripts/install | bash',
    syntax: 'phoneinfoga scan -n <number>',
    parameterExplanations: [
      { param: 'scan -n <num>', explanation: 'Phone number in E.164 international format.' }
    ],
    safeCommands: [
      { command: 'phoneinfoga version', description: 'Check version', explanation: 'Validates CLI installation.' }
    ],
    prerequisites: ['Go runtime'],
    difficulty: 'Beginner',
    relatedTools: ['sherlock'],
    officialDocsUrl: 'https://github.com/sundowndev/phoneinfoga',
    defensiveUseCase: 'Investigating fraudulent phone numbers used in SMS phishing (Smishing) campaigns.',
    tags: ['phone', 'osint', 'carrier', 'telecom']
  },
  {
    id: 'gitleaks',
    name: 'Gitleaks',
    category: 'osint',
    purpose: 'Audit Git repositories for secrets, passwords, and API keys.',
    shortDescription: 'SAST tool protecting Git repos by detecting hardcoded secrets.',
    description: 'Gitleaks is a SAST tool for detecting and preventing hardcoded secrets like passwords, API keys, and tokens in Git repositories, commit histories, and pull requests.',
    installationMethod: 'sudo apt install gitleaks',
    syntax: 'gitleaks [detect|protect] [options]',
    parameterExplanations: [
      { param: 'detect', explanation: 'Scan repository commit history for secrets.' },
      { param: '--source <path>', explanation: 'Target repository path.' }
    ],
    safeCommands: [
      { command: 'gitleaks detect --source . -v', description: 'Audit current repository', explanation: 'Scans commit log for high-entropy tokens.' }
    ],
    prerequisites: ['Git repository'],
    difficulty: 'Beginner',
    relatedTools: ['trufflehog'],
    officialDocsUrl: 'https://github.com/gitleaks/gitleaks',
    defensiveUseCase: 'Pre-commit hook enforcing that no developer pushes API secrets to GitHub.',
    tags: ['git', 'secrets', 'keys', 'devsecops']
  },
  {
    id: 'apparmor-utils',
    name: 'AppArmor Security Profiles',
    category: 'defensive_security',
    purpose: 'Mandatory Access Control (MAC) system restricting program capabilities.',
    shortDescription: 'Linux kernel Mandatory Access Control confining programs.',
    description: 'AppArmor supplements standard Unix discretionary access controls (DAC) by confining programs to a limited set of files, network sockets, and capabilities using path-based profiles.',
    installationMethod: 'sudo apt install apparmor-utils',
    syntax: 'sudo aa-status [options]',
    parameterExplanations: [
      { param: 'aa-status', explanation: 'Display loaded security profiles and enforcement mode.' },
      { param: 'aa-enforce <profile>', explanation: 'Switch profile to strict blocking mode.' }
    ],
    safeCommands: [
      { command: 'sudo aa-status', description: 'Check AppArmor confinement status', explanation: 'Lists all confined daemons and enforce/complain modes.' }
    ],
    prerequisites: ['Root privileges', 'Linux kernel MAC support'],
    difficulty: 'Intermediate',
    relatedTools: ['selinux-basics'],
    officialDocsUrl: 'https://apparmor.net/',
    defensiveUseCase: 'Confining web servers (Nginx/Apache) so that remote exploit payloads cannot access /etc/shadow.',
    tags: ['apparmor', 'mac', 'kernel hardening', 'defense']
  },
  {
    id: 'selinux-basics',
    name: 'SELinux (Security-Enhanced Linux)',
    category: 'defensive_security',
    purpose: 'Kernel security architecture providing Type Enforcement and Multi-Level Security.',
    shortDescription: 'Fine-grained label-based Mandatory Access Control for Linux.',
    description: 'SELinux defines access controls for the applications, processes, and files on a system using security contexts (user:role:type:level) to prevent unauthorized privilege transitions.',
    installationMethod: 'sudo apt install selinux-basics',
    syntax: 'sestatus [options]',
    parameterExplanations: [
      { param: 'sestatus', explanation: 'View current SELinux status (Enforcing, Permissive, Disabled).' }
    ],
    safeCommands: [
      { command: 'sestatus', description: 'Check SELinux operational mode', explanation: 'Queries kernel for active policy state.' }
    ],
    prerequisites: ['Root access', 'SELinux kernel support'],
    difficulty: 'Advanced',
    relatedTools: ['apparmor-utils'],
    officialDocsUrl: 'https://github.com/SELinuxProject/selinux',
    defensiveUseCase: 'Enforcing strict Type Enforcement policies to prevent compromised web daemons from reading arbitrary files.',
    tags: ['selinux', 'mac', 'type enforcement', 'security kernel']
  },
  {
    id: 'scapy-cli',
    name: 'Scapy Interactive Packet Manipulator',
    category: 'defensive_security',
    purpose: 'Powerful interactive packet manipulation program and library in Python.',
    shortDescription: 'Interactive Python packet craft, dissect, and injection engine.',
    description: 'Scapy can forge or decode packets of a wide number of protocols, send them on the wire, capture them, match requests and replies, and handle tasks like network scanning, tracerouting, and probing.',
    installationMethod: 'sudo apt install python3-scapy',
    syntax: 'sudo scapy',
    parameterExplanations: [
      { param: 'Interactive prompt', explanation: 'Python shell with direct packet objects (IP()/TCP()).' }
    ],
    safeCommands: [
      { command: 'sudo scapy -c "ls(TCP)"', description: 'Inspect TCP header specification', explanation: 'Prints fields and default values of TCP protocol headers.' }
    ],
    prerequisites: ['Python', 'TCP/IP headers'],
    difficulty: 'Advanced',
    relatedTools: ['wireshark', 'tcpdump'],
    officialDocsUrl: 'https://scapy.net/',
    defensiveUseCase: 'Crafting custom regression test probes to verify intrusion detection system signature triggers.',
    tags: ['scapy', 'packet craft', 'python', 'custom packets']
  }
];
