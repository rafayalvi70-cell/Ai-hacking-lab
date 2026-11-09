import { KaliTool } from '../../types/cyber';

export const TOOLS_PART_1: KaliTool[] = [
  // ==========================================
  // 1. INFORMATION GATHERING (26 Tools)
  // ==========================================
  {
    id: 'nmap',
    name: 'Nmap (Network Mapper)',
    category: 'information_gathering',
    purpose: 'Network discovery, port enumeration, and service vulnerability scanning.',
    shortDescription: 'The industry-standard network discovery and security auditing scanner.',
    description: 'Nmap is the premier open-source utility for network exploration and security auditing. It uses raw IP packets to discover live hosts, open ports, service versions, operating systems, and firewall configurations.',
    installationMethod: 'sudo apt install nmap',
    syntax: 'nmap [Scan Type...] [Options] {target specification}',
    parameterExplanations: [
      { param: '-sS', explanation: 'TCP SYN stealth scan (half-open, does not complete handshake).' },
      { param: '-sV', explanation: 'Probe open ports to determine service and version info.' },
      { param: '-sC', explanation: 'Execute default safe scripts from the Nmap Scripting Engine (NSE).' },
      { param: '-p-', explanation: 'Scan all 65,535 TCP ports instead of top 1,000.' },
      { param: '-oN <file>', explanation: 'Save standard human-readable output to file.' }
    ],
    safeCommands: [
      { command: 'nmap -sV -sC -p 22,80,443 scanme.nmap.org', description: 'Safe service banner grab', explanation: 'Gathers version headers and runs non-intrusive NSE scripts on authorized test host.' },
      { command: 'nmap -sn 192.168.1.0/24', description: 'Ping sweep subnet discovery', explanation: 'Identifies active network nodes on local subnet without touching TCP/UDP ports.' }
    ],
    prerequisites: ['Basic TCP/IP knowledge', 'Root/sudo for raw socket SYN scans'],
    difficulty: 'Beginner',
    relatedTools: ['masscan', 'rustscan', 'zmap'],
    officialDocsUrl: 'https://nmap.org/book/man.html',
    defensiveUseCase: 'Regular network asset inventory audits to detect unauthorized exposed services.',
    tags: ['port scan', 'network', 'recon', 'nse', 'service detection']
  },
  {
    id: 'whois',
    name: 'Whois Client',
    category: 'information_gathering',
    purpose: 'Query domain ownership, registrar records, and ASN network allocations.',
    shortDescription: 'Queries domain name registries and IP allocation blocks.',
    description: 'A client for the WHOIS directory service that queries regional Internet registries (RIRs like ARIN, RIPE, APNIC) to obtain registrant contact info, name servers, and IP block assignments.',
    installationMethod: 'sudo apt install whois',
    syntax: 'whois [options] <domain_or_ip>',
    parameterExplanations: [
      { param: '-h <host>', explanation: 'Specify a custom WHOIS server to query.' },
      { param: '-p <port>', explanation: 'Specify custom port number for query.' }
    ],
    safeCommands: [
      { command: 'whois example.com', description: 'Domain registry lookup', explanation: 'Fetches registrar and nameserver information for example.com.' },
      { command: 'whois 8.8.8.8', description: 'IP Autonomous System lookup', explanation: 'Retrieves CIDR block and organization allocation data.' }
    ],
    prerequisites: ['Basic DNS knowledge'],
    difficulty: 'Beginner',
    relatedTools: ['dig', 'dnsrecon'],
    officialDocsUrl: 'https://www.kali.org/tools/whois/',
    defensiveUseCase: 'Detecting domain typosquatting and identifying ownership of malicious phishing infrastructure.',
    tags: ['dns', 'whois', 'osint', 'passive recon']
  },
  {
    id: 'dig',
    name: 'Dig (Domain Information Groper)',
    category: 'information_gathering',
    purpose: 'Flexible DNS query tool for nameserver verification and zone queries.',
    shortDescription: 'Queries DNS nameservers for specific resource records.',
    description: 'Part of the BIND utilities, dig queries DNS nameservers for A, AAAA, MX, TXT, CNAME, and SOA records with comprehensive diagnostic telemetry.',
    installationMethod: 'sudo apt install dnsutils',
    syntax: 'dig [@server] [-p port] [type] [domain]',
    parameterExplanations: [
      { param: '@server', explanation: 'Direct the query to a specific DNS resolver IP.' },
      { param: 'ANY', explanation: 'Query all available record types simultaneously.' },
      { param: '+trace', explanation: 'Follow hierarchical iterative delegation from root servers.' },
      { param: '+short', explanation: 'Provide clean, scriptable output without header noise.' }
    ],
    safeCommands: [
      { command: 'dig example.com ANY +noall +answer', description: 'Query core DNS records', explanation: 'Fetches clean list of configured records.' },
      { command: 'dig -x 1.1.1.1', description: 'Reverse PTR query', explanation: 'Translates IP to its canonical PTR hostname.' }
    ],
    prerequisites: ['DNS record types understanding'],
    difficulty: 'Beginner',
    relatedTools: ['host', 'nslookup', 'dnsenum'],
    officialDocsUrl: 'https://www.kali.org/tools/bind9/',
    defensiveUseCase: 'Verifying proper SPF, DKIM, and DMARC TXT records to prevent email spoofing.',
    tags: ['dns', 'txt', 'mx', 'resolver']
  },
  {
    id: 'amass',
    name: 'OWASP Amass',
    category: 'information_gathering',
    purpose: 'In-depth attack surface mapping and external asset discovery.',
    shortDescription: 'Comprehensive OSINT asset mapping and subdomain discovery.',
    description: 'OWASP Amass performs network mapping of attack surfaces and external asset discovery using active reconnaissance and passive open source intelligence (OSINT).',
    installationMethod: 'sudo apt install amass',
    syntax: 'amass enum [options] -d <domain>',
    parameterExplanations: [
      { param: '-passive', explanation: 'Collect data strictly via public OSINT without contacting target directly.' },
      { param: '-active', explanation: 'Perform active zone walks and TLS certificate grabs.' },
      { param: '-o <file>', explanation: 'Output discovered assets to text file.' }
    ],
    safeCommands: [
      { command: 'amass enum -passive -d example.com', description: 'Passive subdomain enumeration', explanation: 'Queries search engines, web archives, and certificate transparency logs.' }
    ],
    prerequisites: ['Attack surface concepts'],
    difficulty: 'Intermediate',
    relatedTools: ['sublist3r', 'theharvester', 'subfinder'],
    officialDocsUrl: 'https://github.com/owasp-amass/amass',
    defensiveUseCase: 'Identifying forgotten cloud subdomains, shadow IT, and dangling CNAME takeover vulnerabilities.',
    tags: ['subdomains', 'osint', 'attack surface', 'owasp']
  },
  {
    id: 'theharvester',
    name: 'theHarvester',
    category: 'information_gathering',
    purpose: 'Gather emails, names, subdomains, IPs, and URLs from public search sources.',
    shortDescription: 'Passive OSINT reconnaissance tool for public footprinting.',
    description: 'A passive reconnaissance tool designed for initial penetration testing stages to catalog public employee exposure, email accounts, and virtual hosts across search engines and PGP key servers.',
    installationMethod: 'sudo apt install theharvester',
    syntax: 'theHarvester -d <domain> -b <source> [options]',
    parameterExplanations: [
      { param: '-d <domain>', explanation: 'Target corporate domain to audit.' },
      { param: '-b <source>', explanation: 'Data sources (e.g. duckduckgo, crtsh, certspotter, all).' },
      { param: '-l <limit>', explanation: 'Limit number of results to fetch per source.' }
    ],
    safeCommands: [
      { command: 'theHarvester -d example.com -b duckduckgo,certspotter -l 100', description: 'Search DuckDuckGo & Certspotter', explanation: 'Gathers exposed names and emails passively.' }
    ],
    prerequisites: ['OSINT awareness'],
    difficulty: 'Beginner',
    relatedTools: ['amass', 'recon-ng', 'sherlock'],
    officialDocsUrl: 'https://www.kali.org/tools/theharvester/',
    defensiveUseCase: 'Measuring organizational exposure to spear-phishing campaigns.',
    tags: ['osint', 'email harvesting', 'passive recon']
  },
  {
    id: 'dnsenum',
    name: 'DNSenum',
    category: 'information_gathering',
    purpose: 'Enumerate DNS information and discover unlisted subdomains via wordlists.',
    shortDescription: 'Performs DNS scraping, AXFR zone transfer checks, and brute-force discovery.',
    description: 'A Perl script to enumerate DNS information of a domain and discover non-contiguous IP blocks. Features automated AXFR zone transfer tests and dictionary brute-forcing.',
    installationMethod: 'sudo apt install dnsenum',
    syntax: 'dnsenum [options] <domain>',
    parameterExplanations: [
      { param: '--enum', explanation: 'Run standard full shortcut enumeration.' },
      { param: '-f <wordlist>', explanation: 'Subdomain dictionary wordlist for brute-force.' },
      { param: '--subfile <file>', explanation: 'Save valid discovered subdomains to file.' }
    ],
    safeCommands: [
      { command: 'dnsenum --noreverse example.com', description: 'DNS enumeration without PTR scan', explanation: 'Checks NS, MX, and tests for open zone transfers.' }
    ],
    prerequisites: ['DNS architecture'],
    difficulty: 'Intermediate',
    relatedTools: ['fierce', 'dnsrecon'],
    officialDocsUrl: 'https://github.com/fwaeytens/dnsenum',
    defensiveUseCase: 'Preventing unauthorized full AXFR DNS zone transfers to untrusted hosts.',
    tags: ['dns', 'axfr', 'zone transfer', 'subdomains']
  },
  {
    id: 'dnsrecon',
    name: 'DNSRecon',
    category: 'information_gathering',
    purpose: 'Advanced DNS reconnaissance and zone transfer testing script in Python.',
    shortDescription: 'Multi-threaded DNS enumeration and SRV record resolver.',
    description: 'A Python tool that performs comprehensive DNS auditing including checking for wildcard resolution, TLD expansion, SPF and TXT evaluation, and SRV record discovery.',
    installationMethod: 'sudo apt install dnsrecon',
    syntax: 'dnsrecon -d <domain> [options]',
    parameterExplanations: [
      { param: '-d <domain>', explanation: 'Target domain to interrogate.' },
      { param: '-t <type>', explanation: 'Enumeration type (std, rvl, brt, srv, axfr).' }
    ],
    safeCommands: [
      { command: 'dnsrecon -d example.com -t std', description: 'Standard DNS enumeration', explanation: 'Validates SOA, NS, A, AAAA, MX, and TXT records.' }
    ],
    prerequisites: ['DNS knowledge'],
    difficulty: 'Beginner',
    relatedTools: ['dnsenum', 'dig'],
    officialDocsUrl: 'https://github.com/darkoperator/dnsrecon',
    defensiveUseCase: 'Auditing SRV records to verify that VoIP and Kerberos servers are not exposed.',
    tags: ['dns', 'recon', 'srv', 'records']
  },
  {
    id: 'fierce',
    name: 'Fierce DNS Scanner',
    category: 'information_gathering',
    purpose: 'Locate contiguous non-contiguous IP address space and subdomains.',
    shortDescription: 'Lightweight DNS reconnaissance scanner for corporate networks.',
    description: 'Fierce is a semi-lightweight scanner that helps locate non-contiguous IP space and hostnames against specified domains using DNS queries.',
    installationMethod: 'sudo apt install fierce',
    syntax: 'fierce --domain <domain> [options]',
    parameterExplanations: [
      { param: '--domain', explanation: 'Domain to test.' },
      { param: '--subdomain-file', explanation: 'Custom wordlist for subdomain fuzzing.' }
    ],
    safeCommands: [
      { command: 'fierce --domain example.com', description: 'Basic scan', explanation: 'Probes root nameservers and tests zone transfer compliance.' }
    ],
    prerequisites: ['Networking fundamentals'],
    difficulty: 'Beginner',
    relatedTools: ['dnsenum', 'sublist3r'],
    officialDocsUrl: 'https://github.com/mschwager/fierce',
    defensiveUseCase: 'Verifying that internal hostnames do not resolve on public DNS servers.',
    tags: ['dns', 'recon', 'subdomains']
  },
  {
    id: 'masscan',
    name: 'Masscan',
    category: 'information_gathering',
    purpose: 'Asynchronous TCP port scanner capable of scanning entire subnets in seconds.',
    shortDescription: 'Ultra-fast asynchronous internet-scale port scanner.',
    description: 'Masscan is an industrial-scale asynchronous TCP port scanner that transmits SYN packets without maintaining state, capable of scanning large IP ranges at millions of packets per second.',
    installationMethod: 'sudo apt install masscan',
    syntax: 'masscan [range] -p[ports] [options]',
    parameterExplanations: [
      { param: '-p<ports>', explanation: 'Ports to scan (e.g. -p80,443 or -p0-65535).' },
      { param: '--rate <pps>', explanation: 'Transmit rate in packets per second (throttling).' }
    ],
    safeCommands: [
      { command: 'masscan 192.168.1.0/24 -p80,443 --rate=100', description: 'Throttled local subnet scan', explanation: 'Scans internal subnet with strict packet rate limits.' }
    ],
    prerequisites: ['Raw socket permissions', 'Network bandwidth awareness'],
    difficulty: 'Advanced',
    relatedTools: ['nmap', 'zmap'],
    officialDocsUrl: 'https://github.com/robertdavidgraham/masscan',
    defensiveUseCase: 'Rapidly verifying perimeter firewall coverage across massive enterprise CIDR blocks.',
    tags: ['port scan', 'asynchronous', 'fast scan']
  },
  {
    id: 'rustscan',
    name: 'RustScan',
    category: 'information_gathering',
    purpose: 'Modern ultra-fast port scanner that automatically pipes open ports into Nmap.',
    shortDescription: 'Rust-based port discovery engine integrated with Nmap.',
    description: 'RustScan uses asynchronous Rust sockets to identify open ports in under 3 seconds, then automatically invokes Nmap with targeted flags against only the discovered ports.',
    installationMethod: 'cargo install rustscan || sudo apt install rustscan',
    syntax: 'rustscan -a <target> [options] -- <nmap-flags>',
    parameterExplanations: [
      { param: '-a <target>', explanation: 'Target IP address or CIDR range.' },
      { param: '-b <batch>', explanation: 'Socket batch size for concurrency tuning.' }
    ],
    safeCommands: [
      { command: 'rustscan -a 127.0.0.1 -- -sV', description: 'Scan localhost and grab versions', explanation: 'Finds open local ports and runs Nmap version detection.' }
    ],
    prerequisites: ['Nmap installed'],
    difficulty: 'Intermediate',
    relatedTools: ['nmap', 'masscan'],
    officialDocsUrl: 'https://github.com/RustScan/RustScan',
    defensiveUseCase: 'Accelerating vulnerability assessment cycles during scheduled maintenance windows.',
    tags: ['rust', 'fast', 'nmap integration', 'port scan']
  },
  {
    id: 'sublist3r',
    name: 'Sublist3r',
    category: 'information_gathering',
    purpose: 'Enumerate subdomains of websites using OSINT and multiple search engines.',
    shortDescription: 'Multi-engine Python subdomain enumerator.',
    description: 'Sublist3r is a Python tool designed to enumerate subdomains using search engines (Google, Yahoo, Bing, Baidu, Ask) as well as Netcraft, Virustotal, and passive DNS repositories.',
    installationMethod: 'sudo apt install sublist3r',
    syntax: 'sublist3r -d <domain> [options]',
    parameterExplanations: [
      { param: '-d <domain>', explanation: 'Target domain to enumerate.' },
      { param: '-t <threads>', explanation: 'Number of concurrent threads.' },
      { param: '-o <file>', explanation: 'Output file for results.' }
    ],
    safeCommands: [
      { command: 'sublist3r -d example.com -t 10', description: 'Enumerate subdomains', explanation: 'Queries search engines for indexed hostnames.' }
    ],
    prerequisites: ['Python 3 runtime'],
    difficulty: 'Beginner',
    relatedTools: ['amass', 'theharvester'],
    officialDocsUrl: 'https://github.com/aboul3la/Sublist3r',
    defensiveUseCase: 'Cataloging public web assets to prevent unauthorized shadow IT proliferation.',
    tags: ['subdomains', 'osint', 'passive']
  },
  {
    id: 'dmitry',
    name: 'DMitry (Deepmagic Information Gathering)',
    category: 'information_gathering',
    purpose: 'All-in-one information gathering tool written in C for fast footprinting.',
    shortDescription: 'Fast C-based host footprinting and sub-search utility.',
    description: 'DMitry gathers as much information as possible about a host including base WHOIS, Netcraft uptime data, subdomains, email addresses, and TCP port status in a single pass.',
    installationMethod: 'sudo apt install dmitry',
    syntax: 'dmitry [options] <host>',
    parameterExplanations: [
      { param: '-w', explanation: 'Perform standard WHOIS lookup.' },
      { param: '-i', explanation: 'Perform IP WHOIS lookup.' },
      { param: '-e', explanation: 'Search for email addresses.' },
      { param: '-s', explanation: 'Search for possible subdomains.' }
    ],
    safeCommands: [
      { command: 'dmitry -winse example.com', description: 'Complete passive footprint', explanation: 'Collects WHOIS, Netcraft, subdomains, and emails.' }
    ],
    prerequisites: ['Basic CLI familiarity'],
    difficulty: 'Beginner',
    relatedTools: ['whois', 'theharvester'],
    officialDocsUrl: 'https://www.kali.org/tools/dmitry/',
    defensiveUseCase: 'Rapid reconnaissance triage during initial incident analysis.',
    tags: ['osint', 'footprint', 'whois', 'c']
  },
  {
    id: 'wafw00f',
    name: 'Wafw00f',
    category: 'information_gathering',
    purpose: 'Identify and fingerprint Web Application Firewalls (WAF) protecting a website.',
    shortDescription: 'Fingerprints over 100 commercial and open-source WAFs.',
    description: 'Sends normal and provocative HTTP requests to analyze HTTP response headers, cookie signatures, and blocking page responses to identify Cloudflare, AWS WAF, Imperva, Akamai, ModSecurity, and others.',
    installationMethod: 'sudo apt install wafw00f',
    syntax: 'wafw00f <url> [options]',
    parameterExplanations: [
      { param: '-a', explanation: 'Test all WAF signatures instead of stopping at first hit.' },
      { param: '-v', explanation: 'Verbose output showing triggering headers.' }
    ],
    safeCommands: [
      { command: 'wafw00f https://example.com', description: 'Identify target WAF', explanation: 'Safely probes target and reports if a WAF is filtering requests.' }
    ],
    prerequisites: ['HTTP protocol concepts'],
    difficulty: 'Beginner',
    relatedTools: ['whatweb', 'nikto'],
    officialDocsUrl: 'https://github.com/EnableSecurity/wafw00f',
    defensiveUseCase: 'Verifying that Web Application Firewalls are active and properly inspecting traffic.',
    tags: ['waf', 'fingerprint', 'web security', 'headers']
  },
  {
    id: 'whatweb',
    name: 'WhatWeb',
    category: 'information_gathering',
    purpose: 'Next-generation web scanner identifying technologies, CMSs, and plugins.',
    shortDescription: 'Identifies content management systems, analytics packages, and web frameworks.',
    description: 'WhatWeb recognizes web technologies including CMS platforms (WordPress, Drupal), blog packages, JavaScript libraries, web servers, and embedded devices using over 1,800 plugins.',
    installationMethod: 'sudo apt install whatweb',
    syntax: 'whatweb [options] <target>',
    parameterExplanations: [
      { param: '-a 1', explanation: 'Stealthy passive scan (single HTTP request).' },
      { param: '-a 3', explanation: 'Aggressive scan with deep plugin queries.' },
      { param: '--log-brief=<file>', explanation: 'Log concise 1-line summary per target.' }
    ],
    safeCommands: [
      { command: 'whatweb -a 1 https://example.com', description: 'Passive technology fingerprint', explanation: 'Inspects response headers, cookies, and meta tags.' }
    ],
    prerequisites: ['Web architectures knowledge'],
    difficulty: 'Beginner',
    relatedTools: ['wafw00f', 'nikto'],
    officialDocsUrl: 'https://github.com/urbanadventurer/WhatWeb',
    defensiveUseCase: 'Auditing exposed web applications to find outdated libraries with known CVEs.',
    tags: ['fingerprint', 'cms', 'technologies', 'web']
  },
  {
    id: 'recon-ng',
    name: 'Recon-ng Framework',
    category: 'information_gathering',
    purpose: 'Full-featured modular reconnaissance framework with database backend.',
    shortDescription: 'Metasploit-like interactive framework for OSINT operations.',
    description: 'A modular web reconnaissance framework with independent modules, database interaction, built-in convenience functions, and interactive CLI commands.',
    installationMethod: 'sudo apt install recon-ng',
    syntax: 'recon-ng [options]',
    parameterExplanations: [
      { param: '-w <workspace>', explanation: 'Load or create a distinct investigation workspace.' },
      { param: '-r <resource>', explanation: 'Execute automated commands from a batch file.' }
    ],
    safeCommands: [
      { command: 'recon-ng -w lab_audit', description: 'Launch workspace', explanation: 'Starts interactive shell with local SQLite storage.' }
    ],
    prerequisites: ['API keys for public engines', 'OSINT workflow'],
    difficulty: 'Intermediate',
    relatedTools: ['theharvester', 'spiderfoot'],
    officialDocsUrl: 'https://github.com/lanmaster53/recon-ng',
    defensiveUseCase: 'Structured threat intelligence correlation for enterprise attack surface tracking.',
    tags: ['osint', 'framework', 'database', 'modules']
  },
  {
    id: 'snmpcheck',
    name: 'snmpcheck',
    category: 'information_gathering',
    purpose: 'Enumerate devices via Simple Network Management Protocol (SNMP).',
    shortDescription: 'Queries SNMP agents on network devices to extract system details.',
    description: 'Queries SNMP devices with common community strings (public, private) to extract hardware info, running processes, open network interfaces, user accounts, and routing tables.',
    installationMethod: 'sudo apt install snmpcheck',
    syntax: 'snmpcheck -t <target> [options]',
    parameterExplanations: [
      { param: '-t <target>', explanation: 'Target IP address.' },
      { param: '-c <community>', explanation: 'SNMP community string (default: public).' }
    ],
    safeCommands: [
      { command: 'snmpcheck -t 192.168.1.1 -c public', description: 'Enumerate router via SNMP', explanation: 'Pulls system MIB values from local test router.' }
    ],
    prerequisites: ['SNMP protocol basics'],
    difficulty: 'Intermediate',
    relatedTools: ['onesixtyone', 'nmap'],
    officialDocsUrl: 'https://www.kali.org/tools/snmpcheck/',
    defensiveUseCase: 'Detecting default SNMP v1/v2c community strings and migrating to encrypted SNMPv3.',
    tags: ['snmp', 'network', 'enumeration', 'router']
  },
  {
    id: 'onesixtyone',
    name: 'onesixtyone',
    category: 'information_gathering',
    purpose: 'Fast SNMP scanner that bruteforces community strings across networks.',
    shortDescription: 'Ultra-fast SNMP community string scanner.',
    description: 'An efficient scanner that sends SNMP requests to discover valid community strings across multiple hosts at high speed.',
    installationMethod: 'sudo apt install onesixtyone',
    syntax: 'onesixtyone [options] <ip_or_range>',
    parameterExplanations: [
      { param: '-c <dict>', explanation: 'Dictionary file containing community strings.' },
      { param: '-i <file>', explanation: 'File with target IP addresses.' }
    ],
    safeCommands: [
      { command: 'onesixtyone -c /usr/share/wordlists/metasploit/snmp_default_pass.txt 192.168.1.1', description: 'Test default strings', explanation: 'Tests if gateway uses default SNMP strings.' }
    ],
    prerequisites: ['SNMP awareness'],
    difficulty: 'Beginner',
    relatedTools: ['snmpcheck'],
    officialDocsUrl: 'https://github.com/trailofbits/onesixtyone',
    defensiveUseCase: 'Auditing switches and PDUs for legacy SNMP community string misconfigurations.',
    tags: ['snmp', 'fast scan', 'community string']
  },
  {
    id: 'ike-scan',
    name: 'ike-scan',
    category: 'information_gathering',
    purpose: 'Discover and fingerprint IPsec VPN gateways.',
    shortDescription: 'Probes and audits IPsec IKE VPN daemons.',
    description: 'Sends IKE packets to target gateways to detect presence, discover transform attributes (DES, 3DES, AES), and detect Aggressive Mode vulnerabilities.',
    installationMethod: 'sudo apt install ike-scan',
    syntax: 'ike-scan [options] <target>',
    parameterExplanations: [
      { param: '-A', explanation: 'Initiate IKE Aggressive Mode handshake.' },
      { param: '-M', explanation: 'Display multi-line formatted transform payload details.' }
    ],
    safeCommands: [
      { command: 'ike-scan -M 192.168.1.1', description: 'Query VPN endpoint', explanation: 'Extracts supported IPsec encryption and hash algorithms.' }
    ],
    prerequisites: ['IPsec and IKE understanding'],
    difficulty: 'Intermediate',
    relatedTools: ['nmap'],
    officialDocsUrl: 'https://github.com/royhills/ike-scan',
    defensiveUseCase: 'Eliminating IKE Aggressive Mode with pre-shared keys (PSK) susceptible to offline cracking.',
    tags: ['vpn', 'ipsec', 'ike', 'crypto audit']
  },
  {
    id: 'fping',
    name: 'fping',
    category: 'information_gathering',
    purpose: 'Send ICMP ECHO probes to determine live hosts on subnets rapidly.',
    shortDescription: 'High-performance round-robin ICMP ping sweep tool.',
    description: 'Unlike standard ping, fping sends parallel round-robin ECHO requests to multiple targets, making it ideal for fast subnet ping sweeps.',
    installationMethod: 'sudo apt install fping',
    syntax: 'fping [options] [targets...]',
    parameterExplanations: [
      { param: '-a', explanation: 'Show only alive systems that respond.' },
      { param: '-g', explanation: 'Generate target list from CIDR block.' }
    ],
    safeCommands: [
      { command: 'fping -a -g 192.168.1.0/24 2>/dev/null', description: 'Sweep local subnet for live hosts', explanation: 'Prints IP addresses of responding machines.' }
    ],
    prerequisites: ['ICMP knowledge'],
    difficulty: 'Beginner',
    relatedTools: ['nmap', 'ping'],
    officialDocsUrl: 'https://fping.org/',
    defensiveUseCase: 'Validating that internal network segments respond properly to health probes.',
    tags: ['icmp', 'ping sweep', 'subnet discovery']
  },
  {
    id: 'arping',
    name: 'arping',
    category: 'information_gathering',
    purpose: 'Discover hosts on the local Layer 2 broadcast domain via ARP requests.',
    shortDescription: 'Layer 2 ARP ping utility for local network discovery.',
    description: 'Sends ARP requests to target hosts. Because ARP is required for Layer 2 communications, firewalls that block ICMP cannot block ARP responses on the local subnet.',
    installationMethod: 'sudo apt install arping',
    syntax: 'arping [options] <target>',
    parameterExplanations: [
      { param: '-c <count>', explanation: 'Number of ARP packets to send.' },
      { param: '-I <interface>', explanation: 'Network interface to transmit from.' }
    ],
    safeCommands: [
      { command: 'arping -c 2 -I eth0 192.168.1.1', description: 'ARP ping gateway', explanation: 'Resolves MAC address and measures Layer 2 round-trip time.' }
    ],
    prerequisites: ['Layer 2 Ethernet awareness'],
    difficulty: 'Beginner',
    relatedTools: ['netdiscover', 'fping'],
    officialDocsUrl: 'https://github.com/ThomasHabets/arping',
    defensiveUseCase: 'Detecting IP conflicts and identifying rogue hosts on local VLANs.',
    tags: ['arp', 'layer2', 'mac address', 'network']
  },
  {
    id: 'netdiscover',
    name: 'Netdiscover',
    category: 'information_gathering',
    purpose: 'Active and passive ARP reconnaissance tool for wireless and switched LANs.',
    shortDescription: 'Inspects ARP traffic to map local networks and manufacturer MACs.',
    description: 'Uses ARP requests or passive listening to discover live hosts on switched or wireless local networks, matching MAC prefixes to known hardware vendors.',
    installationMethod: 'sudo apt install netdiscover',
    syntax: 'netdiscover [options]',
    parameterExplanations: [
      { param: '-r <range>', explanation: 'Scan specific IP range (e.g. 192.168.1.0/24).' },
      { param: '-p', explanation: 'Passive mode: listen silently without transmitting ARP packets.' }
    ],
    safeCommands: [
      { command: 'netdiscover -p', description: 'Passive ARP listening', explanation: 'Silently catalogues broadcasting network devices.' }
    ],
    prerequisites: ['Root privileges', 'Local network access'],
    difficulty: 'Beginner',
    relatedTools: ['arping', 'nmap'],
    officialDocsUrl: 'https://www.kali.org/tools/netdiscover/',
    defensiveUseCase: 'Rogue device detection on corporate wireless networks without creating active traffic.',
    tags: ['arp', 'passive', 'lan discovery', 'mac']
  },
  {
    id: 'traceroute',
    name: 'Traceroute / Traceroute6',
    category: 'information_gathering',
    purpose: 'Trace packet network hops and latency to a remote destination.',
    shortDescription: 'Measures round-trip time across intermediate network routing hops.',
    description: 'Prints the route that packets take to network hosts by incrementing the IP packet Time-To-Live (TTL) field and analyzing ICMP Time Exceeded messages.',
    installationMethod: 'sudo apt install traceroute',
    syntax: 'traceroute [options] <host>',
    parameterExplanations: [
      { param: '-T', explanation: 'Use TCP SYN packets instead of UDP datagrams.' },
      { param: '-I', explanation: 'Use ICMP ECHO datagrams.' },
      { param: '-p <port>', explanation: 'Specify destination port.' }
    ],
    safeCommands: [
      { command: 'traceroute -T -p 443 8.8.8.8', description: 'TCP traceroute to port 443', explanation: 'Traces network path using standard HTTPS port to bypass UDP filtering.' }
    ],
    prerequisites: ['Routing and TTL understanding'],
    difficulty: 'Beginner',
    relatedTools: ['tcptraceroute', 'mtr'],
    officialDocsUrl: 'https://www.kali.org/tools/traceroute/',
    defensiveUseCase: 'Analyzing transit routing paths and detecting BGP hijacking anomalies.',
    tags: ['routing', 'hops', 'ttl', 'network diagnostics']
  },
  {
    id: 'mtr',
    name: 'MTR (My Traceroute)',
    category: 'information_gathering',
    purpose: 'Real-time diagnostic tool combining traceroute and ping into interactive UI.',
    shortDescription: 'Interactive real-time routing path and packet loss diagnostic tool.',
    description: 'MTR investigates network connections by sending packets with purposely low TTLs, sampling response times, and continuously measuring packet loss per hop.',
    installationMethod: 'sudo apt install mtr',
    syntax: 'mtr [options] <host>',
    parameterExplanations: [
      { param: '--report', explanation: 'Produce static formatted report and exit.' },
      { param: '-c <count>', explanation: 'Number of pings to send per hop.' }
    ],
    safeCommands: [
      { command: 'mtr --report -c 10 1.1.1.1', description: 'Run 10-packet path audit', explanation: 'Prints average latency and loss for each routing node.' }
    ],
    prerequisites: ['Network diagnostics'],
    difficulty: 'Beginner',
    relatedTools: ['traceroute', 'ping'],
    officialDocsUrl: 'https://www.bitwizard.nl/mtr/',
    defensiveUseCase: 'Pinpointing ISP packet drops and upstream latency degradation.',
    tags: ['traceroute', 'packet loss', 'diagnostics']
  },
  {
    id: 'sslscan',
    name: 'sslscan',
    category: 'information_gathering',
    purpose: 'Fast SSL/TLS cipher suite and certificate vulnerability scanner.',
    shortDescription: 'Audits TLS protocol versions, weak ciphers, and certificate chains.',
    description: 'Queries SSL/TLS services to discover supported cipher suites, SSLv2/v3 support, Heartbleed, ROBOT, TLS 1.3 compliance, and certificate expiration dates.',
    installationMethod: 'sudo apt install sslscan',
    syntax: 'sslscan [options] <host:port>',
    parameterExplanations: [
      { param: '--no-failed', explanation: 'Show only accepted/supported cipher suites.' },
      { param: '--show-certificate', explanation: 'Dump detailed X.509 certificate fields.' }
    ],
    safeCommands: [
      { command: 'sslscan --no-failed https://example.com', description: 'Audit accepted TLS ciphers', explanation: 'Identifies if weak CBC or RC4 ciphers are enabled.' }
    ],
    prerequisites: ['TLS cryptography basics'],
    difficulty: 'Beginner',
    relatedTools: ['testssl', 'sslyze'],
    officialDocsUrl: 'https://github.com/rbsec/sslscan',
    defensiveUseCase: 'Verifying PCI-DSS compliance by confirming that TLS 1.0 and 1.1 are disabled.',
    tags: ['tls', 'ssl', 'ciphers', 'crypto audit']
  },
  {
    id: 'testssl',
    name: 'testssl.sh',
    category: 'information_gathering',
    purpose: 'Comprehensive command-line tool checking SSL/TLS ciphers and vulnerabilities.',
    shortDescription: 'Extensive bash script testing SSL/TLS servers for known flaws.',
    description: 'Checks any service on any port for support of TLS/SSL ciphers, protocols, and cryptographic flaws (POODLE, Heartbleed, DROWN, LOGJAM, BEAST, CCS injection).',
    installationMethod: 'sudo apt install testssl.sh',
    syntax: 'testssl [options] <URI>',
    parameterExplanations: [
      { param: '--fast', explanation: 'Skip non-critical tests for faster execution.' },
      { param: '--severity LOW', explanation: 'Filter out informational notices.' }
    ],
    safeCommands: [
      { command: 'testssl --fast https://example.com', description: 'Fast TLS assessment', explanation: 'Evaluates certificate validity and major TLS vulnerabilities.' }
    ],
    prerequisites: ['TLS knowledge'],
    difficulty: 'Intermediate',
    relatedTools: ['sslscan', 'sslyze'],
    officialDocsUrl: 'https://testssl.sh/',
    defensiveUseCase: 'Validating server hardening against historical SSL/TLS protocol downgrade attacks.',
    tags: ['tls', 'heartbleed', 'ssl', 'compliance']
  },
  {
    id: 'nbtscan',
    name: 'NBTscan',
    category: 'information_gathering',
    purpose: 'Scan IP networks for NetBIOS name information on Windows systems.',
    shortDescription: 'Discovers Windows hostnames, workgroups, and MAC addresses via NetBIOS.',
    description: 'NBTscan sends NetBIOS status queries to each address in a supplied range, cataloging responding computer names, logged-in usernames, workgroup names, and MAC addresses.',
    installationMethod: 'sudo apt install nbtscan',
    syntax: 'nbtscan [options] <targets>',
    parameterExplanations: [
      { param: '-r', explanation: 'Use local port 137 for queries (improves NAT traversal).' },
      { param: '-v', explanation: 'Verbose output showing all NetBIOS resource records.' }
    ],
    safeCommands: [
      { command: 'nbtscan 192.168.1.0/24', description: 'Sweep subnet for NetBIOS names', explanation: 'Prints computer and domain names of active Windows hosts.' }
    ],
    prerequisites: ['NetBIOS and SMB understanding'],
    difficulty: 'Beginner',
    relatedTools: ['nmap', 'enum4linux'],
    officialDocsUrl: 'https://www.kali.org/tools/nbtscan/',
    defensiveUseCase: 'Identifying legacy Windows NT/XP systems with insecure NetBIOS name resolution enabled.',
    tags: ['netbios', 'smb', 'windows', 'enumeration']
  },

  // ==========================================
  // 2. VULNERABILITY ANALYSIS (20 Tools)
  // ==========================================
  {
    id: 'nikto',
    name: 'Nikto Web Vulnerability Scanner',
    category: 'vulnerability_analysis',
    purpose: 'Web server scanner for dangerous files, outdated server software, and misconfigurations.',
    shortDescription: 'Scans web servers for over 6,700 dangerous files and security headers.',
    description: 'Nikto examines web servers for potentially dangerous files, outdated server software, missing security headers, default configuration files, and multiple index files.',
    installationMethod: 'sudo apt install nikto',
    syntax: 'nikto -h <target> [options]',
    parameterExplanations: [
      { param: '-h <target>', explanation: 'Target host, domain, or IP.' },
      { param: '-p <port>', explanation: 'Target port (default 80).' },
      { param: '-Tuning <options>', explanation: 'Selective scan tests (e.g. 1=misconfig, 2=files).' },
      { param: '-Format <fmt>', explanation: 'Output format (htm, txt, csv, json).' }
    ],
    safeCommands: [
      { command: 'nikto -h http://127.0.0.1:8080 -Tuning 1', description: 'Misconfiguration audit', explanation: 'Scans local development server for missing security headers.' }
    ],
    prerequisites: ['Web server basics'],
    difficulty: 'Beginner',
    relatedTools: ['nuclei', 'wapiti'],
    officialDocsUrl: 'https://cirt.net/Nikto2',
    defensiveUseCase: 'Pre-production verification of web servers to prevent accidental deployment of debug files.',
    tags: ['web scanner', 'cgi', 'headers', 'misconfig']
  },
  {
    id: 'nuclei',
    name: 'Nuclei (ProjectDiscovery)',
    category: 'vulnerability_analysis',
    purpose: 'Fast and customizable vulnerability scanner based on community YAML templates.',
    shortDescription: 'High-speed template-based scanner for CVEs and misconfigurations.',
    description: 'Nuclei sends requests across targets based on community-driven YAML templates, resulting in low false positives and fast scanning for CVEs, exposed panels, and cloud misconfigurations.',
    installationMethod: 'sudo apt install nuclei',
    syntax: 'nuclei -u <target> -t <templates> [options]',
    parameterExplanations: [
      { param: '-u <url>', explanation: 'Target URL to scan.' },
      { param: '-tags <tags>', explanation: 'Execute specific template tags (e.g. cve, misconfig).' },
      { param: '-severity <levels>', explanation: 'Filter template severity (info, low, medium, high, critical).' }
    ],
    safeCommands: [
      { command: 'nuclei -u https://example.com -tags misconfig,headers -severity info,low', description: 'Audit security headers', explanation: 'Validates CSP, HSTS, and CORS settings with zero risk.' }
    ],
    prerequisites: ['YAML template concepts'],
    difficulty: 'Intermediate',
    relatedTools: ['nikto', 'jaeles'],
    officialDocsUrl: 'https://docs.projectdiscovery.io/tools/nuclei/',
    defensiveUseCase: 'Automated CI/CD regression testing to ensure patched CVEs remain closed.',
    tags: ['yaml', 'cve', 'fast scanner', 'templates']
  },
  {
    id: 'lynis',
    name: 'Lynis Security Auditing',
    category: 'vulnerability_analysis',
    purpose: 'Battle-tested security auditing and hardening tool for Unix/Linux systems.',
    shortDescription: 'System hardening scanner auditing configs, kernels, and compliance.',
    description: 'Lynis scans the host operating system for installed packages, kernel parameters, open network ports, file permissions, PAM configurations, and generates a Hardening Index with remediation guides.',
    installationMethod: 'sudo apt install lynis',
    syntax: 'lynis audit system [options]',
    parameterExplanations: [
      { param: '--quick', explanation: 'Execute audit without user confirmation prompts.' },
      { param: 'show warnings', explanation: 'Display high-priority compliance warnings.' }
    ],
    safeCommands: [
      { command: 'lynis audit system --quick', description: 'Perform standard system hardening audit', explanation: 'Safely evaluates local OS configurations.' }
    ],
    prerequisites: ['Linux sysadmin basics'],
    difficulty: 'Beginner',
    relatedTools: ['chkrootkit', 'rkhunter'],
    officialDocsUrl: 'https://cisofy.com/lynis/',
    defensiveUseCase: 'Benchmarking Linux servers against CIS Benchmarks and ISO 27001 requirements.',
    tags: ['linux hardening', 'audit', 'compliance', 'cis benchmark']
  },
  {
    id: 'openvas',
    name: 'OpenVAS / Greenbone Vulnerability Management (GVM)',
    category: 'vulnerability_analysis',
    purpose: 'Full-featured enterprise vulnerability scanner and manager.',
    shortDescription: 'Enterprise vulnerability scanner with daily-updated feed of 50,000+ tests.',
    description: 'An open-source vulnerability scanner that audits unpatched software, weak credentials, and misconfigured daemons across networks with structured reporting and remediation workflows.',
    installationMethod: 'sudo apt install gvm',
    syntax: 'gvm-cli [options]',
    parameterExplanations: [
      { param: 'gvm-setup', explanation: 'Initialize and synchronize the Greenbone Community Feed.' },
      { param: 'gvm-start', explanation: 'Start background scanner daemons and web portal.' }
    ],
    safeCommands: [
      { command: 'gvm-check-setup', description: 'Verify scanner health', explanation: 'Validates that feed sync and database daemons are operational.' }
    ],
    prerequisites: ['PostgreSQL', 'Significant RAM/CPU resources'],
    difficulty: 'Advanced',
    relatedTools: ['nessus', 'nexpose'],
    officialDocsUrl: 'https://www.greenbone.net/en/community-edition/',
    defensiveUseCase: 'Quarterly vulnerability assessments mandated by cybersecurity insurance and SOC 2.',
    tags: ['vulnerability management', 'enterprise', 'gvm', 'compliance']
  },
  {
    id: 'cve-search',
    name: 'cve-search',
    category: 'vulnerability_analysis',
    purpose: 'Import CVE and CPE datasets into local database for offline vulnerability lookup.',
    shortDescription: 'Local offline search engine for National Vulnerability Database (NVD).',
    description: 'Imports CVE vulnerability data, CPE product dictionary, and CWE classifications into local MongoDB, enabling offline queries without external network requests.',
    installationMethod: 'git clone https://github.com/cve-search/cve-search.git',
    syntax: 'python3 ./bin/search.py -c <cve>',
    parameterExplanations: [
      { param: '-c <cve>', explanation: 'Search by specific CVE identifier.' },
      { param: '-p <vendor:product>', explanation: 'Search vulnerabilities affecting specific software product.' }
    ],
    safeCommands: [
      { command: 'python3 ./bin/search.py -c CVE-2021-44228', description: 'Query Log4j vulnerability details', explanation: 'Fetches CVSS score and advisory text offline.' }
    ],
    prerequisites: ['Python 3', 'MongoDB instance'],
    difficulty: 'Intermediate',
    relatedTools: ['searchsploit'],
    officialDocsUrl: 'https://github.com/cve-search/cve-search',
    defensiveUseCase: 'Automated vulnerability lookup in air-gapped security operations centers.',
    tags: ['cve', 'nvd', 'offline', 'database']
  },
  {
    id: 'wapiti',
    name: 'Wapiti',
    category: 'vulnerability_analysis',
    purpose: 'Black-box web application vulnerability auditor.',
    shortDescription: 'Scans web pages by injecting payloads and detecting anomalies.',
    description: 'Wapiti crawls the scripts and forms of a web application to inject payloads and inspect for SQL injection, XSS, XXE, Command Execution, SSRF, and file inclusion flaws.',
    installationMethod: 'sudo apt install wapiti',
    syntax: 'wapiti -u <url> [options]',
    parameterExplanations: [
      { param: '-u <url>', explanation: 'Target base URL to audit.' },
      { param: '-m <modules>', explanation: 'Select modules (e.g. xss, sql, file, blindsql).' }
    ],
    safeCommands: [
      { command: 'wapiti -u http://localhost:8080 -m xss', description: 'Test local endpoint for XSS', explanation: 'Injects safe XSS probes and logs reflected parameters.' }
    ],
    prerequisites: ['Web security basics'],
    difficulty: 'Intermediate',
    relatedTools: ['nikto', 'zap'],
    officialDocsUrl: 'https://wapiti-scanner.github.io/',
    defensiveUseCase: 'DAST testing inside staging environments before deploying web features.',
    tags: ['dast', 'web vulnerability', 'black box', 'xss']
  },
  {
    id: 'flawfinder',
    name: 'Flawfinder',
    category: 'vulnerability_analysis',
    purpose: 'Static Application Security Testing (SAST) tool for C/C++ source code.',
    shortDescription: 'Scans C/C++ source code for security flaws like buffer overflows.',
    description: 'Flawfinder searches C/C++ source code for functions with well-known security risks (e.g., strcpy, sprintf, gets) and produces a prioritized report with CWE mappings.',
    installationMethod: 'sudo apt install flawfinder',
    syntax: 'flawfinder [options] <source_path>',
    parameterExplanations: [
      { param: '--minlevel=<n>', explanation: 'Set minimum risk level threshold (1-5).' },
      { param: '--html', explanation: 'Format audit report as HTML.' }
    ],
    safeCommands: [
      { command: 'flawfinder --minlevel=3 ./src', description: 'Audit C/C++ source code', explanation: 'Scans local code directory and flags dangerous function calls.' }
    ],
    prerequisites: ['Basic C/C++ understanding'],
    difficulty: 'Beginner',
    relatedTools: ['cppcheck', 'semgrep'],
    officialDocsUrl: 'https://dwheeler.com/flawfinder/',
    defensiveUseCase: 'Secure code review in CI pipelines to prevent memory corruption vulnerabilities.',
    tags: ['sast', 'c', 'cpp', 'buffer overflow', 'code review']
  },
  {
    id: 'semgrep',
    name: 'Semgrep',
    category: 'vulnerability_analysis',
    purpose: 'Fast, open-source static analysis engine for finding bugs and enforcing standards.',
    shortDescription: 'Lightweight SAST tool with expressive semantic rules for 30+ languages.',
    description: 'Semgrep analyzes source code without compilation, matching syntax trees against patterns written in code syntax (Python, JS, Go, Java, C) to enforce security rules and catch OWASP flaws.',
    installationMethod: 'pip install semgrep || sudo apt install semgrep',
    syntax: 'semgrep [options] --config <ruleset> <path>',
    parameterExplanations: [
      { param: '--config auto', explanation: 'Run standard recommended rules for detected languages.' },
      { param: '--config p/owasp-top-ten', explanation: 'Run OWASP Top 10 security ruleset.' }
    ],
    safeCommands: [
      { command: 'semgrep --config auto ./src', description: 'Scan source code', explanation: 'Scans repository for security antipatterns and hardcoded secrets.' }
    ],
    prerequisites: ['Source code familiarity'],
    difficulty: 'Intermediate',
    relatedTools: ['flawfinder', 'bandit'],
    officialDocsUrl: 'https://semgrep.dev/',
    defensiveUseCase: 'Blocking pull requests that introduce SQL injection or insecure deserialization.',
    tags: ['sast', 'code review', 'owasp', 'devsecops']
  },
  {
    id: 'bandit',
    name: 'Bandit',
    category: 'vulnerability_analysis',
    purpose: 'Security linter designed to find common security issues in Python code.',
    shortDescription: 'AST-based static analyzer for Python applications.',
    description: 'Bandit parses Python code into an Abstract Syntax Tree (AST) and evaluates plugins against AST nodes to detect insecure usage of eval(), shell=True, weak hashes, and hardcoded passwords.',
    installationMethod: 'pip install bandit || sudo apt install bandit',
    syntax: 'bandit -r <directory> [options]',
    parameterExplanations: [
      { param: '-r', explanation: 'Scan directory recursively.' },
      { param: '-ll', explanation: 'Report only medium and high severity findings.' }
    ],
    safeCommands: [
      { command: 'bandit -r ./my_app -ll', description: 'Audit Python application', explanation: 'Identifies risky Python functions and insecure crypto usage.' }
    ],
    prerequisites: ['Python basics'],
    difficulty: 'Beginner',
    relatedTools: ['semgrep', 'safety'],
    officialDocsUrl: 'https://bandit.readthedocs.io/',
    defensiveUseCase: 'Mandatory Python linting step in DevSecOps build pipelines.',
    tags: ['python', 'sast', 'security linter', 'devsecops']
  },
  {
    id: 'trivy',
    name: 'Trivy (Aqua Security)',
    category: 'vulnerability_analysis',
    purpose: 'Comprehensive vulnerability and misconfiguration scanner for containers and IaC.',
    shortDescription: 'Scans container images, filesystems, and Terraform files for CVEs.',
    description: 'Trivy scans container images, Git repositories, virtual machine filesystems, and Infrastructure-as-Code (Terraform, Kubernetes YAML) for known OS/language package vulnerabilities and secrets.',
    installationMethod: 'sudo apt install trivy',
    syntax: 'trivy [image|fs|repo] <target> [options]',
    parameterExplanations: [
      { param: 'image <name>', explanation: 'Scan Docker container image.' },
      { param: 'fs <path>', explanation: 'Scan local directory filesystem.' },
      { param: '--severity HIGH,CRITICAL', explanation: 'Filter results to actionable severities.' }
    ],
    safeCommands: [
      { command: 'trivy fs --severity HIGH,CRITICAL .', description: 'Scan current project dependencies', explanation: 'Reports known package CVEs in lockfiles.' }
    ],
    prerequisites: ['Container basics'],
    difficulty: 'Intermediate',
    relatedTools: ['dockle', 'grype'],
    officialDocsUrl: 'https://trivy.dev/',
    defensiveUseCase: 'Stopping vulnerable container images from deploying into Kubernetes clusters.',
    tags: ['containers', 'docker', 'cve', 'devsecops', 'sbom']
  },
  {
    id: 'chkrootkit',
    name: 'chkrootkit',
    category: 'vulnerability_analysis',
    purpose: 'Locally check for signs of a rootkit on Unix-like operating systems.',
    shortDescription: 'Shell script inspecting system binaries for rootkit modifications.',
    description: 'chkrootkit checks system binaries (ps, netstat, ls, top) for known rootkit modifications, inspects kernel module anomalies, and checks for deleted files holding open sockets.',
    installationMethod: 'sudo apt install chkrootkit',
    syntax: 'sudo chkrootkit [options]',
    parameterExplanations: [
      { param: '-q', explanation: 'Quiet mode: display only infected/compromised items.' }
    ],
    safeCommands: [
      { command: 'sudo chkrootkit -q', description: 'Scan local system for rootkits', explanation: 'Audits core binaries against known signatures.' }
    ],
    prerequisites: ['Root privileges'],
    difficulty: 'Beginner',
    relatedTools: ['rkhunter', 'lynis'],
    officialDocsUrl: 'http://www.chkrootkit.org/',
    defensiveUseCase: 'Regular host integrity checks to detect hidden kernel modules or backdoored system utilities.',
    tags: ['rootkit', 'malware', 'host integrity', 'linux']
  },
  {
    id: 'rkhunter',
    name: 'Rootkit Hunter (rkhunter)',
    category: 'vulnerability_analysis',
    purpose: 'Scan for rootkits, backdoors, and local exploits by hashing system binaries.',
    shortDescription: 'Checks file SHA-256 hashes against known good baseline database.',
    description: 'Compares SHA-256 hashes of critical system binaries against a known good database, searches for hidden directories in /dev, and checks for suspicious string patterns in kernel modules.',
    installationMethod: 'sudo apt install rkhunter',
    syntax: 'sudo rkhunter [options]',
    parameterExplanations: [
      { param: '--check', explanation: 'Perform complete system scan.' },
      { param: '--propupd', explanation: 'Update file property baseline database.' }
    ],
    safeCommands: [
      { command: 'sudo rkhunter --check --sk', description: 'Run audit skipping keypresses', explanation: 'Audits core binaries and hidden files.' }
    ],
    prerequisites: ['Root privileges'],
    difficulty: 'Intermediate',
    relatedTools: ['chkrootkit', 'lynis'],
    officialDocsUrl: 'https://rkhunter.sourceforge.net/',
    defensiveUseCase: 'Incident response triage after an unauthenticated breach alert.',
    tags: ['rootkit', 'integrity', 'hashes', 'hardening']
  },
  {
    id: 'legion',
    name: 'Legion Recon & Vuln Tool',
    category: 'vulnerability_analysis',
    purpose: 'Semi-automated network reconnaissance and vulnerability discovery GUI.',
    shortDescription: 'Modular graphical penetration testing framework succeeding Sparta.',
    description: 'Legion provides a graphical interface that coordinates Nmap, Nikto, hydra, and SSL scanners to discover hosts, map open ports, and automatically test discovered services.',
    installationMethod: 'sudo apt install legion',
    syntax: 'legion',
    parameterExplanations: [
      { param: 'GUI based', explanation: 'Operated through Qt graphical workspace.' }
    ],
    safeCommands: [
      { command: 'legion &', description: 'Launch graphical interface', explanation: 'Opens GUI workspace for target management.' }
    ],
    prerequisites: ['GUI environment'],
    difficulty: 'Beginner',
    relatedTools: ['nmap', 'nikto'],
    officialDocsUrl: 'https://github.com/GoVanguard/legion',
    defensiveUseCase: 'Rapid visual mapping of laboratory network topologies.',
    tags: ['gui', 'recon', 'scanner', 'integrated']
  },
  {
    id: 'golismero',
    name: 'Golismero Framework',
    category: 'vulnerability_analysis',
    purpose: 'Open-source framework for security testing consolidating results from other tools.',
    shortDescription: 'Plugin-based vulnerability audit framework aggregating tool feeds.',
    description: 'Golismero coordinates scanners (Nmap, Nikto, OpenVAS, DNS tools) and combines their output into a unified vulnerability database to eliminate duplicate findings.',
    installationMethod: 'sudo apt install golismero',
    syntax: 'golismero scan <target> [options]',
    parameterExplanations: [
      { param: 'scan <target>', explanation: 'Target IP, hostname, or CIDR.' },
      { param: '-o <file>', explanation: 'Output unified report.' }
    ],
    safeCommands: [
      { command: 'golismero scan 127.0.0.1 -o report.html', description: 'Scan localhost and create report', explanation: 'Runs multiple audit plugins and generates summary.' }
    ],
    prerequisites: ['Python runtime'],
    difficulty: 'Intermediate',
    relatedTools: ['nikto', 'openvas'],
    officialDocsUrl: 'https://github.com/golismero/golismero',
    defensiveUseCase: 'Correlating vulnerability data across disparate scanners.',
    tags: ['framework', 'aggregator', 'correlation']
  },
  {
    id: 'unix-privesc-check',
    name: 'unix-privesc-check',
    category: 'vulnerability_analysis',
    purpose: 'Shell script checking for local privilege escalation vectors on Unix systems.',
    shortDescription: 'Audits file permissions, sudo rules, and cron jobs for privesc flaws.',
    description: 'A shell script that checks file permissions, group writable directories in $PATH, cron configurations, and misconfigured sudoers rules to identify local privilege escalation paths.',
    installationMethod: 'sudo apt install unix-privesc-check',
    syntax: 'unix-privesc-check standard',
    parameterExplanations: [
      { param: 'standard', explanation: 'Run standard permission and configuration checks.' },
      { param: 'detailed', explanation: 'Run deeper inspection including running daemon configurations.' }
    ],
    safeCommands: [
      { command: 'unix-privesc-check standard > audit.txt', description: 'Audit local system privileges', explanation: 'Logs potential privilege escalation vectors to file.' }
    ],
    prerequisites: ['Linux user account'],
    difficulty: 'Beginner',
    relatedTools: ['linpeas', 'lynis'],
    officialDocsUrl: 'https://github.com/pentestmonkey/unix-privesc-check',
    defensiveUseCase: 'Hardening multi-user Linux workstations against insider lateral movement.',
    tags: ['privesc', 'linux', 'permissions', 'audit']
  },
  {
    id: 'linpeas',
    name: 'LinPEAS (Privilege Escalation Awesome Script)',
    category: 'vulnerability_analysis',
    purpose: 'Search for possible paths to escalate privileges on Linux/Unix hosts.',
    shortDescription: 'Comprehensive color-coded Linux privilege escalation enumeration script.',
    description: 'LinPEAS inspects system environment, processes, cron jobs, network interfaces, sudo privileges, SUID binaries, capabilities, and file permissions, highlighting 99% probable privesc paths in red/yellow.',
    installationMethod: 'curl -L https://github.com/peass-ng/PEASS-ng/releases/latest/download/linpeas.sh | sh',
    syntax: './linpeas.sh [options]',
    parameterExplanations: [
      { param: '-s', explanation: 'Stealth mode: bypass certain noisy tests.' },
      { param: '-a', explanation: 'Run all available checks including container inspection.' }
    ],
    safeCommands: [
      { command: './linpeas.sh -q > privesc_report.txt', description: 'Run audit quietly and save to file', explanation: 'Audits host configurations for privilege escalation vectors.' }
    ],
    prerequisites: ['Bash shell'],
    difficulty: 'Intermediate',
    relatedTools: ['unix-privesc-check', 'winpeas'],
    officialDocsUrl: 'https://github.com/peass-ng/PEASS-ng/tree/master/linPEAS',
    defensiveUseCase: 'Auditing server gold images before deploying to production cloud infrastructure.',
    tags: ['privesc', 'linux', 'suid', 'enumeration']
  },
  {
    id: 'winpeas',
    name: 'WinPEAS (Windows Privilege Escalation Script)',
    category: 'vulnerability_analysis',
    purpose: 'Search for privilege escalation paths on Windows systems.',
    shortDescription: 'Windows privilege escalation audit executable and PowerShell script.',
    description: 'Audits Windows services, unquoted service paths, always install elevated, stored credentials, token privileges (SeImpersonate), and registry autorun entries.',
    installationMethod: 'Download from PEASS-ng repository',
    syntax: 'winPEASx64.exe [options]',
    parameterExplanations: [
      { param: 'quiet', explanation: 'Suppress banners and format output cleanly.' },
      { param: 'systeminfo', explanation: 'Display OS build and hotfix patch baseline.' }
    ],
    safeCommands: [
      { command: 'winPEASx64.exe quiet systeminfo', description: 'Audit Windows patch level', explanation: 'Checks for missing security updates and dangerous service rights.' }
    ],
    prerequisites: ['Windows OS environment'],
    difficulty: 'Intermediate',
    relatedTools: ['linpeas', 'seatbelt'],
    officialDocsUrl: 'https://github.com/peass-ng/PEASS-ng/tree/master/winPEAS',
    defensiveUseCase: 'Verifying that Windows GPO policies enforce least-privilege service account configurations.',
    tags: ['windows', 'privesc', 'services', 'registry']
  },
  {
    id: 'checksec',
    name: 'checksec',
    category: 'vulnerability_analysis',
    purpose: 'Check binary hardening properties such as RELRO, Stack Canaries, and NX.',
    shortDescription: 'Audits Linux ELF binaries for compile-time security mitigations.',
    description: 'Examines executable ELF binaries to report whether modern compiler defenses (ASLR/PIE, Stack Canaries, No-Execute NX, Full RELRO, and Fortify Source) were enabled during build.',
    installationMethod: 'sudo apt install checksec',
    syntax: 'checksec --file=<binary_path>',
    parameterExplanations: [
      { param: '--file=<file>', explanation: 'Target ELF executable binary.' },
      { param: '--dir=<dir>', explanation: 'Audit all binaries inside directory.' }
    ],
    safeCommands: [
      { command: 'checksec --file=/bin/ls', description: 'Check security mitigations on /bin/ls', explanation: 'Inspects PIE, Stack Canary, and NX protection.' }
    ],
    prerequisites: ['ELF binary format understanding'],
    difficulty: 'Beginner',
    relatedTools: ['radare2', 'gdb'],
    officialDocsUrl: 'https://github.com/slimm609/checksec.sh',
    defensiveUseCase: 'Verifying that production software builds compile with all exploit mitigation flags.',
    tags: ['binary hardening', 'aslr', 'nx', 'stack canary', 'elf']
  },
  {
    id: 'cve-bin-tool',
    name: 'cve-bin-tool',
    category: 'vulnerability_analysis',
    purpose: 'Binary vulnerability scanner checking for known CVEs in software dependencies.',
    shortDescription: 'Scans compiled binaries and firmware for unpatched software libraries.',
    description: 'Scans binaries and firmware images to detect embedded components (e.g., outdated OpenSSL, curl, zlib) and queries the National Vulnerability Database for associated CVEs.',
    installationMethod: 'pip install cve-bin-tool',
    syntax: 'cve-bin-tool <directory_or_binary> [options]',
    parameterExplanations: [
      { param: '-f <format>', explanation: 'Output format (json, csv, html).' },
      { param: '--nvd-api-key', explanation: 'Accelerate CVE database updates.' }
    ],
    safeCommands: [
      { command: 'cve-bin-tool /usr/local/bin', description: 'Scan installed binaries for CVEs', explanation: 'Identifies third-party binaries built with vulnerable libraries.' }
    ],
    prerequisites: ['Python 3 runtime'],
    difficulty: 'Intermediate',
    relatedTools: ['trivy', 'binwalk'],
    officialDocsUrl: 'https://github.com/intel/cve-bin-tool',
    defensiveUseCase: 'Auditing embedded IoT device firmware for ancient vulnerable C libraries.',
    tags: ['firmware', 'cve', 'iot', 'binary audit']
  },
  {
    id: 'testssl-cli',
    name: 'SSLyze',
    category: 'vulnerability_analysis',
    purpose: 'Fast and powerful SSL/TLS scanning library for Python.',
    shortDescription: 'Python-based TLS scanner auditing certificate chains and cipher weaknesses.',
    description: 'SSLyze analyzes the SSL/TLS configuration of a server by connecting to it, checking for support of old SSLv2/SSLv3 protocols, weak 40-bit/56-bit ciphers, and verifying trust anchors.',
    installationMethod: 'pip install sslyze',
    syntax: 'sslyze <host:port> [options]',
    parameterExplanations: [
      { param: '--regular', explanation: 'Perform standard regular set of tests.' },
      { param: '--json_out=<file>', explanation: 'Save structured telemetry to JSON.' }
    ],
    safeCommands: [
      { command: 'sslyze example.com:443', description: 'Scan HTTPS endpoint', explanation: 'Pulls full certificate chain and supported TLS versions.' }
    ],
    prerequisites: ['Python runtime', 'TLS concepts'],
    difficulty: 'Intermediate',
    relatedTools: ['sslscan', 'testssl'],
    officialDocsUrl: 'https://github.com/nabla-c0d3/sslyze',
    defensiveUseCase: 'Continuous TLS certificate expiration and cipher deprecation monitoring.',
    tags: ['tls', 'ssl', 'python', 'audit']
  }
];
