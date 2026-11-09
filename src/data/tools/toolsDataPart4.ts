import { KaliTool } from '../../types/cyber';

export const TOOLS_PART_4: KaliTool[] = [
  // Additional Information Gathering & Recon (15 Tools)
  {
    id: 'arp-scan',
    name: 'arp-scan',
    category: 'information_gathering',
    purpose: 'ARP scanning and fingerprinting tool for local IPv4 subnets.',
    shortDescription: 'Fast Layer 2 ARP scanner identifying devices and hardware vendors.',
    description: 'Sends ARP requests to every IP in the specified subnet to discover live hosts and resolves MAC addresses against the IEEE OUI database to identify device manufacturers.',
    installationMethod: 'sudo apt install arp-scan',
    syntax: 'sudo arp-scan [options] <target>',
    parameterExplanations: [
      { param: '-l', explanation: 'Scan current local subnet derived from network interface.' },
      { param: '-I <iface>', explanation: 'Specify network interface to use.' }
    ],
    safeCommands: [
      { command: 'sudo arp-scan -l', description: 'Scan local network', explanation: 'Discovers active hosts on local broadcast domain.' }
    ],
    prerequisites: ['Root privileges'],
    difficulty: 'Beginner',
    relatedTools: ['arping', 'netdiscover'],
    officialDocsUrl: 'https://github.com/royhills/arp-scan',
    defensiveUseCase: 'Identifying rogue wireless bridges or IoT sensors connected to corporate Ethernet drops.',
    tags: ['arp', 'layer2', 'mac', 'recon']
  },
  {
    id: 'massdns',
    name: 'MassDNS',
    category: 'information_gathering',
    purpose: 'High-performance stub resolver for bulk DNS lookups.',
    shortDescription: 'Resolves millions of domain names concurrently using raw sockets.',
    description: 'MassDNS is a high-performance DNS stub resolver capable of resolving over 350,000 names per second using public resolvers, designed for large-scale reconnaissance.',
    installationMethod: 'sudo apt install massdns',
    syntax: 'massdns -r <resolvers.txt> [options] <domains.txt>',
    parameterExplanations: [
      { param: '-r <file>', explanation: 'List of trusted DNS resolvers.' },
      { param: '-t A', explanation: 'Resolve specific DNS record type.' }
    ],
    safeCommands: [
      { command: 'massdns -r /usr/share/massdns/lists/resolvers.txt -t A domains.txt', description: 'Bulk resolve domain list', explanation: 'Rapidly queries A records.' }
    ],
    prerequisites: ['DNS knowledge'],
    difficulty: 'Intermediate',
    relatedTools: ['dig', 'dnsrecon'],
    officialDocsUrl: 'https://github.com/blechschmidt/massdns',
    defensiveUseCase: 'Verifying large corporate DNS zone consistency during migration.',
    tags: ['dns', 'fast', 'high-throughput']
  },
  {
    id: 'dnstracer',
    name: 'dnstracer',
    category: 'information_gathering',
    purpose: 'Trace a chain of DNS authority from root servers down to target.',
    shortDescription: 'Traces DNS delegations from root servers to authoritative nameservers.',
    description: 'Determines where a given Domain Name Server (DNS) gets its information from and follows the chain of DNS delegations back to the root nameservers.',
    installationMethod: 'sudo apt install dnstracer',
    syntax: 'dnstracer [options] <domain>',
    parameterExplanations: [
      { param: '-s <server>', explanation: 'Root server to start query from.' }
    ],
    safeCommands: [
      { command: 'dnstracer example.com', description: 'Trace DNS authority', explanation: 'Maps DNS delegation hierarchy.' }
    ],
    prerequisites: ['DNS architecture'],
    difficulty: 'Beginner',
    relatedTools: ['dig'],
    officialDocsUrl: 'https://www.kali.org/tools/dnstracer/',
    defensiveUseCase: 'Verifying that DNS delegations are not pointing to abandoned nameservers.',
    tags: ['dns', 'trace', 'root servers']
  },
  {
    id: 'enum4linux-ng',
    name: 'enum4linux-ng',
    category: 'information_gathering',
    purpose: 'Next-generation tool for enumerating information from Windows and Samba systems.',
    shortDescription: 'Rewritten Python utility enumerating users, shares, and policies via SMB.',
    description: 'A modern Python rewrite of enum4linux that extracts user lists, group memberships, share permissions, password policies, and OS versions via SMB/RPC.',
    installationMethod: 'sudo apt install enum4linux-ng',
    syntax: 'enum4linux-ng [options] <target>',
    parameterExplanations: [
      { param: '-A', explanation: 'Perform all enumeration checks.' },
      { param: '-U', explanation: 'Enumerate local and domain user accounts.' }
    ],
    safeCommands: [
      { command: 'enum4linux-ng -U 192.168.1.10', description: 'Enumerate SMB users', explanation: 'Queries SMB endpoint for active user accounts.' }
    ],
    prerequisites: ['SMB and RPC fundamentals'],
    difficulty: 'Intermediate',
    relatedTools: ['crackmapexec', 'smbmap'],
    officialDocsUrl: 'https://github.com/cddmp/enum4linux-ng',
    defensiveUseCase: 'Disabling anonymous SMB null sessions (RestrictAnonymous) across Windows servers.',
    tags: ['smb', 'windows', 'samba', 'active directory']
  },
  {
    id: 'smbmap',
    name: 'SMBMap',
    category: 'information_gathering',
    purpose: 'SMB share enumeration tool designed to search drives across an entire domain.',
    shortDescription: 'Enumerates SMB share permissions (READ/WRITE) across hosts.',
    description: 'Allows penetration testers and auditors to inspect share drive permissions across an entire subnet, listing files and permissions on administrative shares (C$, ADMIN$).',
    installationMethod: 'sudo apt install smbmap',
    syntax: 'smbmap -H <host> [options]',
    parameterExplanations: [
      { param: '-H <host>', explanation: 'Target host or CIDR subnet.' },
      { param: '-u <user> -p <pass>', explanation: 'Credentials for authenticated share auditing.' }
    ],
    safeCommands: [
      { command: 'smbmap -H 192.168.1.10', description: 'Audit public shares', explanation: 'Inspects if null sessions allow reading file shares.' }
    ],
    prerequisites: ['SMB protocol knowledge'],
    difficulty: 'Beginner',
    relatedTools: ['enum4linux-ng', 'crackmapexec'],
    officialDocsUrl: 'https://github.com/ShawnDEvans/smbmap',
    defensiveUseCase: 'Ensuring network file shares enforce least-privilege NTFS permissions.',
    tags: ['smb', 'shares', 'permissions', 'windows']
  },

  // Additional Web Application Security (15 Tools)
  {
    id: 'paramspider',
    name: 'ParamSpider',
    category: 'web_applications',
    purpose: 'Mining parameters from dark corners of Web Archives for bug hunters.',
    shortDescription: 'Harvests URL parameters from WayBack Machine and Common Crawl.',
    description: 'Queries internet archive repositories (Wayback, AlienVault, CommonCrawl) to extract historically logged parameters for a domain to feed into XSS and SQLi fuzzers.',
    installationMethod: 'git clone https://github.com/devanshbatham/ParamSpider.git',
    syntax: 'python3 paramspider.py -d <domain>',
    parameterExplanations: [
      { param: '-d <domain>', explanation: 'Target domain to search.' }
    ],
    safeCommands: [
      { command: 'python3 paramspider.py -d example.com', description: 'Extract archived parameters', explanation: 'Gathers historical query parameters passively.' }
    ],
    prerequisites: ['Python 3 runtime'],
    difficulty: 'Beginner',
    relatedTools: ['gau', 'waybackurls'],
    officialDocsUrl: 'https://github.com/devanshbatham/ParamSpider',
    defensiveUseCase: 'Auditing whether deprecated or abandoned parameters still execute in current APIs.',
    tags: ['parameters', 'wayback', 'osint', 'web']
  },
  {
    id: 'gau',
    name: 'GetAllURLs (gau)',
    category: 'web_applications',
    purpose: 'Fetch known URLs from AlienVault Open Threat Exchange, Wayback, and Common Crawl.',
    shortDescription: 'Fetches historical URLs from open threat intelligence archives.',
    description: 'GetAllURLs queries AlienVault OTX, the Wayback Machine, and Common Crawl to discover known endpoints, subdomains, and file paths without touching the target server.',
    installationMethod: 'go install github.com/lc/gau/v2/cmd/gau@latest',
    syntax: 'gau <domain> [options]',
    parameterExplanations: [
      { param: '--subs', explanation: 'Include subdomains of target.' }
    ],
    safeCommands: [
      { command: 'gau --subs example.com', description: 'Query historical endpoints', explanation: 'Pulls archive records for target domain.' }
    ],
    prerequisites: ['Go runtime'],
    difficulty: 'Beginner',
    relatedTools: ['paramspider', 'katana'],
    officialDocsUrl: 'https://github.com/lc/gau',
    defensiveUseCase: 'Discovering forgotten staging endpoints indexed in public archives.',
    tags: ['urls', 'archives', 'passive', 'web recon']
  },
  {
    id: 'linkfinder',
    name: 'LinkFinder',
    category: 'web_applications',
    purpose: 'Python script that finds endpoints and secrets in JavaScript files.',
    shortDescription: 'Extracts endpoints, API routes, and hidden URLs from JavaScript files.',
    description: 'Uses jsbeautifier and Python regular expressions to parse minified JavaScript files in web applications, extracting API endpoints and internal URLs.',
    installationMethod: 'git clone https://github.com/GerbenJavado/LinkFinder.git',
    syntax: 'python linkfinder.py -i <input_js> [options]',
    parameterExplanations: [
      { param: '-i <url_or_file>', explanation: 'Input JS URL or local file.' },
      { param: '-o cli', explanation: 'Output formatted results to terminal.' }
    ],
    safeCommands: [
      { command: 'python3 linkfinder.py -i https://example.com/app.js -o cli', description: 'Parse JS for endpoints', explanation: 'Discovers API routes inside compiled client script.' }
    ],
    prerequisites: ['JavaScript basics'],
    difficulty: 'Beginner',
    relatedTools: ['katana'],
    officialDocsUrl: 'https://github.com/GerbenJavado/LinkFinder',
    defensiveUseCase: 'Verifying that internal API routes and staging domains are not bundled in production JavaScript.',
    tags: ['javascript', 'endpoints', 'api routes', 'code audit']
  },
  {
    id: 'skipfish',
    name: 'Skipfish Web Application Scanner',
    category: 'web_applications',
    purpose: 'Fully automated, high-speed active web application security reconnaissance tool.',
    shortDescription: 'High-speed C-based active web application security scanner.',
    description: 'Skipfish performs an automated security check by executing recursive crawl and dictionary-based probes, producing an interactive HTML report mapping the site structure and security issues.',
    installationMethod: 'sudo apt install skipfish',
    syntax: 'skipfish -o <out_dir> <url>',
    parameterExplanations: [
      { param: '-o <dir>', explanation: 'Output report directory.' }
    ],
    safeCommands: [
      { command: 'skipfish -o ./report http://127.0.0.1:3000', description: 'Scan local server', explanation: 'Audits local development server for common web flaws.' }
    ],
    prerequisites: ['Web security basics'],
    difficulty: 'Intermediate',
    relatedTools: ['nikto', 'zap'],
    officialDocsUrl: 'https://code.google.com/archive/p/skipfish/',
    defensiveUseCase: 'Rapid pre-release security validation for web applications.',
    tags: ['web scanner', 'dast', 'automated audit']
  },
  {
    id: 'wpscan',
    name: 'WPScan WordPress Security Scanner',
    category: 'web_applications',
    purpose: 'Black box WordPress vulnerability scanner for themes, plugins, and core.',
    shortDescription: 'Audits WordPress installations for vulnerable plugins and users.',
    description: 'WPScan tests WordPress installations for security vulnerabilities, enumerating installed themes, plugins, user accounts, and checking versions against the WPScan vulnerability database.',
    installationMethod: 'sudo apt install wpscan',
    syntax: 'wpscan --url <url> [options]',
    parameterExplanations: [
      { param: '--enumerate u', explanation: 'Enumerate WordPress user accounts.' },
      { param: '--enumerate vp', explanation: 'Enumerate vulnerable installed plugins only.' }
    ],
    safeCommands: [
      { command: 'wpscan --url http://my-wp-test.local --enumerate vp', description: 'Audit vulnerable plugins', explanation: 'Checks installed plugins against vulnerability database.' }
    ],
    prerequisites: ['WordPress architecture awareness'],
    difficulty: 'Beginner',
    relatedTools: ['nikto', 'whatweb'],
    officialDocsUrl: 'https://wpscan.com/',
    defensiveUseCase: 'Ensuring corporate marketing blogs keep WordPress core and third-party plugins patched.',
    tags: ['wordpress', 'cms', 'plugins', 'vulnerability audit']
  },
  {
    id: 'joomscan',
    name: 'JoomScan (OWASP Joomla Scanner)',
    category: 'web_applications',
    purpose: 'Vulnerability scanner for Joomla CMS installations.',
    shortDescription: 'Audits Joomla CMS for core and component vulnerabilities.',
    description: 'An open-source vulnerability scanner detecting version misconfigurations, vulnerable components, and admin panels on Joomla CMS portals.',
    installationMethod: 'sudo apt install joomscan',
    syntax: 'joomscan -u <url>',
    parameterExplanations: [
      { param: '-u <url>', explanation: 'Target Joomla URL.' }
    ],
    safeCommands: [
      { command: 'joomscan -u http://joomla-test.local', description: 'Scan Joomla installation', explanation: 'Identifies outdated Joomla components.' }
    ],
    prerequisites: ['CMS concepts'],
    difficulty: 'Beginner',
    relatedTools: ['wpscan', 'droopescan'],
    officialDocsUrl: 'https://github.com/OWASP/joomscan',
    defensiveUseCase: 'Identifying vulnerable legacy Joomla modules.',
    tags: ['joomla', 'cms', 'web audit']
  },
  {
    id: 'droopescan',
    name: 'Droopescan',
    category: 'web_applications',
    purpose: 'Plugin-based scanner for CMSs (Drupal, Silverstripe, WordPress).',
    shortDescription: 'Audits Drupal and SilverStripe CMS installations for unpatched modules.',
    description: 'Droopescan is a Python scanner that identifies versions, installed plugins, and configuration issues on Drupal, SilverStripe, and Moodle web installations.',
    installationMethod: 'sudo apt install droopescan || pip install droopescan',
    syntax: 'droopescan scan [drupal|silverstripe] -u <url>',
    parameterExplanations: [
      { param: 'scan drupal', explanation: 'Scan Drupal CMS target.' }
    ],
    safeCommands: [
      { command: 'droopescan scan drupal -u http://drupal-test.local', description: 'Audit Drupal installation', explanation: 'Checks installed modules and Drupal core version.' }
    ],
    prerequisites: ['CMS knowledge'],
    difficulty: 'Beginner',
    relatedTools: ['wpscan'],
    officialDocsUrl: 'https://github.com/droope/droopescan',
    defensiveUseCase: 'Patch management verification across corporate Drupal enterprise sites.',
    tags: ['drupal', 'cms', 'audit']
  },

  // Additional Password & Credential Tools (15 Tools)
  {
    id: 'crowbar',
    name: 'Crowbar',
    category: 'password_attacks',
    purpose: 'Brute force tool leveraging SSH private keys and NLA RDP authentication.',
    shortDescription: 'Audits SSH private keys and RDP Network Level Authentication.',
    description: 'Crowbar is designed to brute force protocols not supported by Hydra, focusing on testing SSH private keys and Windows RDP with Network Level Authentication (NLA).',
    installationMethod: 'sudo apt install crowbar',
    syntax: 'crowbar [options]',
    parameterExplanations: [
      { param: '-b rdp', explanation: 'Target Windows RDP service.' },
      { param: '-b sshkey', explanation: 'Test SSH private key against target.' }
    ],
    safeCommands: [
      { command: 'crowbar -b rdp -s 192.168.1.10/32 -u admin -c pass.txt', description: 'Audit RDP authentication', explanation: 'Tests NLA authentication resilience.' }
    ],
    prerequisites: ['RDP and SSH protocols'],
    difficulty: 'Intermediate',
    relatedTools: ['hydra'],
    officialDocsUrl: 'https://github.com/q安-crowbar/crowbar',
    defensiveUseCase: 'Enforcing RDP Network Level Authentication and account lockout thresholds.',
    tags: ['rdp', 'ssh key', 'brute force', 'credentials']
  },
  {
    id: 'rsmangler',
    name: 'RSMangler',
    category: 'password_attacks',
    purpose: 'Take a wordlist and mangle it using permutations and common patterns.',
    shortDescription: 'Generates password permutations using common leetspeak and year patterns.',
    description: 'Takes an initial list of keywords and mangles them with numbers, years (2020-2026), leetspeak substitutions (@ for a, 3 for e, 1 for i), and reverse strings.',
    installationMethod: 'sudo apt install rsmangler',
    syntax: 'rsmangler -f <wordlist> [options]',
    parameterExplanations: [
      { param: '-f <file>', explanation: 'Input seed keyword list.' }
    ],
    safeCommands: [
      { command: 'rsmangler -f seed_words.txt > mangled.txt', description: 'Generate mangled wordlist', explanation: 'Creates variations incorporating years and symbols.' }
    ],
    prerequisites: ['CLI basics'],
    difficulty: 'Beginner',
    relatedTools: ['crunch', 'cewl'],
    officialDocsUrl: 'https://github.com/digininja/RSMangler',
    defensiveUseCase: 'Testing password filtering rules against predictable company name substitutions.',
    tags: ['wordlist', 'mangling', 'permutations']
  },
  {
    id: 'wordlistctl',
    name: 'wordlistctl',
    category: 'password_attacks',
    purpose: 'CLI tool to fetch, search, and manage wordlists from open repositories.',
    shortDescription: 'Package manager for security wordlists and dictionaries.',
    description: 'Allows security analysts to search, download, and decompress curated wordlists (SecLists, RockYou, Kaonashi) directly from the terminal.',
    installationMethod: 'sudo apt install wordlistctl',
    syntax: 'wordlistctl [search|fetch] <query>',
    parameterExplanations: [
      { param: 'search <query>', explanation: 'Search online wordlist repository.' },
      { param: 'fetch <name>', explanation: 'Download wordlist locally.' }
    ],
    safeCommands: [
      { command: 'wordlistctl search passwords', description: 'Search wordlists', explanation: 'Finds available curated dictionaries.' }
    ],
    prerequisites: ['Internet access'],
    difficulty: 'Beginner',
    relatedTools: ['crunch'],
    officialDocsUrl: 'https://github.com/blackarch/wordlistctl',
    defensiveUseCase: 'Maintaining standardized wordlists for enterprise password compliance testing.',
    tags: ['wordlist', 'seclists', 'dictionary manager']
  },
  {
    id: 'cupp',
    name: 'CUPP (Common User Passwords Profiler)',
    category: 'password_attacks',
    purpose: 'Generate targeted password dictionaries based on personal profile information.',
    shortDescription: 'Generates targeted wordlists based on target profiling (names, birthdays).',
    description: 'Interactive Python wizard that asks for target details (first name, partner, child, pet, birthday, company) and creates permutation dictionaries.',
    installationMethod: 'git clone https://github.com/Mebus/cupp.git',
    syntax: 'python3 cupp.py -i',
    parameterExplanations: [
      { param: '-i', explanation: 'Launch interactive questionnaire mode.' }
    ],
    safeCommands: [
      { command: 'python3 cupp.py -h', description: 'Display CUPP options', explanation: 'Lists dictionary profiling options.' }
    ],
    prerequisites: ['Python runtime'],
    difficulty: 'Beginner',
    relatedTools: ['cewl', 'rsmangler'],
    officialDocsUrl: 'https://github.com/Mebus/cupp',
    defensiveUseCase: 'Educating employees on why personal details (birthdays, pet names) make weak passwords.',
    tags: ['profiling', 'wordlist', 'targeted dictionary']
  },
  {
    id: 'mentalist',
    name: 'Mentalist',
    category: 'password_attacks',
    purpose: 'Graphical tool for custom wordlist generation based on cognitive heuristics.',
    shortDescription: 'GUI-based custom wordlist builder chaining rules and substitutions.',
    description: 'Mentalist is a visual wordlist generator that allows security auditors to build chains of base words, substitutions, suffixes, and prefixes with graphical node editing.',
    installationMethod: 'Download from Mentalist repository',
    syntax: 'mentalist',
    parameterExplanations: [
      { param: 'GUI based', explanation: 'Desktop application for building rule pipelines.' }
    ],
    safeCommands: [
      { command: 'mentalist &', description: 'Launch Mentalist GUI', explanation: 'Starts visual wordlist builder.' }
    ],
    prerequisites: ['Desktop GUI'],
    difficulty: 'Beginner',
    relatedTools: ['crunch', 'cewl'],
    officialDocsUrl: 'https://github.com/sc0tfree/mentalist',
    defensiveUseCase: 'Simulating complex human password creation heuristics for audit testing.',
    tags: ['gui', 'wordlist', 'heuristics']
  },

  // Additional Wireless & RF Tools (10 Tools)
  {
    id: 'airgeddon',
    name: 'Airgeddon',
    category: 'wireless_attacks',
    purpose: 'Multi-use bash script for Linux systems to audit wireless networks.',
    shortDescription: 'All-in-one bash menu framework orchestrating Wi-Fi audit tools.',
    description: 'Airgeddon coordinates Aircrack-ng, wash, reaver, bully, and hostapd in an interactive menu system to audit 802.11 WEP, WPA, WPA2, and WPA3 wireless networks.',
    installationMethod: 'sudo apt install airgeddon',
    syntax: 'sudo airgeddon',
    parameterExplanations: [
      { param: 'Interactive menu', explanation: 'Console menu providing structured audit workflows.' }
    ],
    safeCommands: [
      { command: 'sudo airgeddon', description: 'Launch Airgeddon shell', explanation: 'Checks for installed wireless dependencies and enters menu.' }
    ],
    prerequisites: ['Wi-Fi adapter in monitor mode', 'Root access'],
    difficulty: 'Intermediate',
    relatedTools: ['aircrack-ng', 'wifite'],
    officialDocsUrl: 'https://github.com/v1s1t0r1sh3r3/airgeddon',
    defensiveUseCase: 'Auditing corporate enterprise WPA2-Enterprise configurations for downgrade flaws.',
    tags: ['wifi', 'menu', 'wpa2', 'airgeddon']
  },
  {
    id: 'bully',
    name: 'Bully WPS Implementation',
    category: 'wireless_attacks',
    purpose: 'Implementation of the WPS brute force attack, written in C.',
    shortDescription: 'Fast, native C implementation of the WPS PIN brute force attack.',
    description: 'An independent implementation of WPS brute-force auditing written in C that operates directly on packet injection and sniffing without external dependencies.',
    installationMethod: 'sudo apt install bully',
    syntax: 'sudo bully <interface> -b <bssid> [options]',
    parameterExplanations: [
      { param: '-b <bssid>', explanation: 'Target access point MAC address.' }
    ],
    safeCommands: [
      { command: 'sudo bully wlan0mon -b 00:11:22:33:44:55', description: 'Audit WPS PIN', explanation: 'Tests WPS PIN negotiation resilience.' }
    ],
    prerequisites: ['Monitor mode interface'],
    difficulty: 'Intermediate',
    relatedTools: ['reaver', 'pixiewps'],
    officialDocsUrl: 'https://github.com/aanarchyy/bully',
    defensiveUseCase: 'Auditing WPS lockout resilience under active probe conditions.',
    tags: ['wps', 'wifi', 'c', 'injection']
  },
  {
    id: 'eaphammer',
    name: 'EAPHammer',
    category: 'wireless_attacks',
    purpose: 'Targeted evil twin attacks against WPA2-Enterprise networks.',
    shortDescription: 'Specialized toolkit for auditing WPA2-Enterprise RADIUS configurations.',
    description: 'EAPHammer tests WPA2-Enterprise networks for insecure EAP configurations (PEAP, EAP-TTLS), rogue AP trust, and GTC credential downgrading.',
    installationMethod: 'sudo apt install eaphammer || git clone https://github.com/s0lst1c3/eaphammer.git',
    syntax: 'sudo ./eaphammer [options]',
    parameterExplanations: [
      { param: '--essid <ssid>', explanation: 'Target network name.' },
      { param: '--channel <n>', explanation: 'Channel number.' }
    ],
    safeCommands: [
      { command: 'sudo ./eaphammer --help', description: 'Display EAP audit modes', explanation: 'Lists WPA2-Enterprise testing flags.' }
    ],
    prerequisites: ['Wireless interface supporting AP mode'],
    difficulty: 'Advanced',
    relatedTools: ['hostapd-mana'],
    officialDocsUrl: 'https://github.com/s0lst1c3/eaphammer',
    defensiveUseCase: 'Enforcing server certificate validation in Enterprise Wi-Fi client profiles.',
    tags: ['wpa2-enterprise', 'eap', 'radius', 'wifi defense']
  },
  {
    id: 'ubertooth-util',
    name: 'Ubertooth Tools',
    category: 'wireless_attacks',
    purpose: 'Open source 2.4 GHz wireless development platform suitable for Bluetooth experimentation.',
    shortDescription: 'Hardware capture and packet inspection utility for Bluetooth / BLE.',
    description: 'Utilities for the Great Scott Gadgets Ubertooth One hardware platform, enabling passive packet sniffing and spectrum analysis of 2.4 GHz Bluetooth and Bluetooth Low Energy (BLE) transmissions.',
    installationMethod: 'sudo apt install ubertooth',
    syntax: 'ubertooth-scan [options]',
    parameterExplanations: [
      { param: '-s', explanation: 'Perform Bluetooth inquiry scan.' }
    ],
    safeCommands: [
      { command: 'ubertooth-util -v', description: 'Check hardware firmware version', explanation: 'Verifies communication with connected Ubertooth device.' }
    ],
    prerequisites: ['Ubertooth One hardware dongle'],
    difficulty: 'Advanced',
    relatedTools: ['kismet', 'wireshark'],
    officialDocsUrl: 'https://greatscottgadgets.com/ubertoothone/',
    defensiveUseCase: 'Auditing medical devices and smart locks for unencrypted BLE peripheral traffic.',
    tags: ['bluetooth', 'ble', 'hardware', 'rf']
  },

  // Additional Exploitation & Active Directory (15 Tools)
  {
    id: 'evil-winrm',
    name: 'Evil-WinRM',
    category: 'exploitation',
    purpose: 'The ultimate WinRM shell for hacking/pentesting Windows machines.',
    shortDescription: 'Interactive Windows Remote Management (WinRM) shell in Ruby.',
    description: 'Evil-WinRM provides an interactive command shell for managing Windows systems over WinRM (port 5985/5986), supporting Kerberos authentication, Pass-the-Hash, and in-memory PowerShell script execution.',
    installationMethod: 'sudo apt install evil-winrm || gem install evil-winrm',
    syntax: 'evil-winrm -i <ip> -u <user> -p <pass> [options]',
    parameterExplanations: [
      { param: '-i <ip>', explanation: 'Target Windows host IP.' },
      { param: '-H <hash>', explanation: 'NTLM hash for Pass-the-Hash authentication.' }
    ],
    safeCommands: [
      { command: 'evil-winrm -i 192.168.1.10 -u Administrator -p "Password123!"', description: 'Connect via WinRM', explanation: 'Establishes authenticated remote management session.' }
    ],
    prerequisites: ['WinRM enabled on target'],
    difficulty: 'Intermediate',
    relatedTools: ['impacket', 'crackmapexec'],
    officialDocsUrl: 'https://github.com/Hackplayers/evil-winrm',
    defensiveUseCase: 'Disabling WinRM on end-user workstations and restricting management traffic to secure jump hosts.',
    tags: ['winrm', 'windows', 'powershell', 'post exploitation']
  },
  {
    id: 'bloodhound',
    name: 'BloodHound',
    category: 'exploitation',
    purpose: 'Six Degrees of Domain Admin: graph analysis for Active Directory domain relationships.',
    shortDescription: 'Graph analysis platform mapping attack paths in Active Directory.',
    description: 'BloodHound uses graph theory to reveal the hidden and unintended relationships within an Active Directory environment, identifying shortest attack paths to Domain Admins.',
    installationMethod: 'sudo apt install bloodhound',
    syntax: 'bloodhound &',
    parameterExplanations: [
      { param: 'Neo4j backend', explanation: 'Uses graph database to model users, groups, and ACLs.' }
    ],
    safeCommands: [
      { command: 'bloodhound &', description: 'Start BloodHound visualizer', explanation: 'Opens desktop graph explorer connecting to Neo4j.' }
    ],
    prerequisites: ['Neo4j database service'],
    difficulty: 'Advanced',
    relatedTools: ['impacket', 'crackmapexec'],
    officialDocsUrl: 'https://github.com/BloodHoundAD/BloodHound',
    defensiveUseCase: 'Eliminating excessive Access Control Lists (ACLs) and Tier 0 lateral movement paths.',
    tags: ['active directory', 'graph theory', 'bloodhound', 'neo4j', 'blue team']
  },
  {
    id: 'armitage',
    name: 'Armitage GUI for Metasploit',
    category: 'exploitation',
    purpose: 'Graphical cyber attack management tool for Metasploit Framework.',
    shortDescription: 'Visual team collaboration GUI client for Metasploit.',
    description: 'Armitage visualizes targets, recommends exploits, and exposes the advanced post-exploitation capabilities in the Metasploit Framework in an interactive graphical canvas.',
    installationMethod: 'sudo apt install armitage',
    syntax: 'armitage',
    parameterExplanations: [
      { param: 'GUI based', explanation: 'Connects to local or remote msfrpcd daemon.' }
    ],
    safeCommands: [
      { command: 'armitage', description: 'Launch Armitage GUI', explanation: 'Connects to local Metasploit RPC server.' }
    ],
    prerequisites: ['PostgreSQL and Metasploit installed'],
    difficulty: 'Beginner',
    relatedTools: ['metasploit'],
    officialDocsUrl: 'http://www.fastandeasyhacking.com/',
    defensiveUseCase: 'Visualizing network attack paths during multi-host defensive cyber exercises.',
    tags: ['gui', 'metasploit', 'visualization', 'team']
  },

  // Additional Forensics & Reverse Engineering (15 Tools)
  {
    id: 'scalpel',
    name: 'Scalpel File Carving',
    category: 'forensics_defense',
    purpose: 'Frugal, high performance file carver based on Foremost 0.69.',
    shortDescription: 'Fast, memory-efficient file carver for disk images.',
    description: 'Scalpel is a fast file carver that reads a database of header and footer definitions to extract files from disk images and raw block devices while consuming minimal RAM.',
    installationMethod: 'sudo apt install scalpel',
    syntax: 'scalpel [options] -c <config> -o <out_dir> <image>',
    parameterExplanations: [
      { param: '-c <config>', explanation: 'Configuration file defining file headers to carve.' },
      { param: '-o <dir>', explanation: 'Output directory.' }
    ],
    safeCommands: [
      { command: 'scalpel -c /etc/scalpel/scalpel.conf -o ./carved disk.img', description: 'Carve files from disk', explanation: 'Extracts configured file types from image.' }
    ],
    prerequisites: ['Forensics header basics'],
    difficulty: 'Intermediate',
    relatedTools: ['foremost'],
    officialDocsUrl: 'https://github.com/sleuthkit/scalpel',
    defensiveUseCase: 'Recovering deleted files during digital forensics evidence triage.',
    tags: ['carving', 'forensics', 'recovery']
  },
  {
    id: 'guymager',
    name: 'Guymager Forensic Imager',
    category: 'forensics_defense',
    purpose: 'Forensic imager for media acquisition with multi-threaded verification.',
    shortDescription: 'High-speed graphical forensic disk imaging and verification tool.',
    description: 'Guymager is a free forensic imager for media acquisition on Linux, creating bit-by-bit raw (dd) and Expert Witness Format (EWF/E01) images with simultaneous MD5 and SHA-256 hash calculations.',
    installationMethod: 'sudo apt install guymager',
    syntax: 'sudo guymager',
    parameterExplanations: [
      { param: 'GUI based', explanation: 'Graphical disk cloning and hashing interface.' }
    ],
    safeCommands: [
      { command: 'sudo guymager &', description: 'Launch forensic imager', explanation: 'Opens acquisition interface for connected storage drives.' }
    ],
    prerequisites: ['Root privileges', 'Storage drive access'],
    difficulty: 'Beginner',
    relatedTools: ['dcfldd', 'autopsy'],
    officialDocsUrl: 'https://guymager.sourceforge.io/',
    defensiveUseCase: 'Creating cryptographically verified forensic clones that preserve legal chain of custody.',
    tags: ['forensics', 'disk imaging', 'e01', 'sha256 verification']
  },
  {
    id: 'dcfldd',
    name: 'dcfldd (Enhanced Forensic dd)',
    category: 'forensics_defense',
    purpose: 'Enhanced version of GNU dd with on-the-fly hashing and progress displays.',
    shortDescription: 'Forensic dd variant computing live cryptographic hashes during copy.',
    description: 'Originally developed at the DoD Computer Forensics Lab, dcfldd writes to multiple outputs simultaneously, calculates on-the-fly SHA-256 hashes, and provides real-time progress indicators.',
    installationMethod: 'sudo apt install dcfldd',
    syntax: 'dcfldd if=<source> of=<dest> [options]',
    parameterExplanations: [
      { param: 'hash=sha256', explanation: 'Calculate live SHA-256 hash during copying.' },
      { param: 'hashwindow=100M', explanation: 'Calculate piecewise hashes every 100 MB.' }
    ],
    safeCommands: [
      { command: 'dcfldd if=disk.raw of=copy.raw hash=sha256', description: 'Clone disk with live SHA-256 hash', explanation: 'Copies image and calculates hash simultaneously.' }
    ],
    prerequisites: ['Linux block devices knowledge'],
    difficulty: 'Intermediate',
    relatedTools: ['guymager'],
    officialDocsUrl: 'https://dcfldd.sourceforge.net/',
    defensiveUseCase: 'Preserving disk image integrity in strict forensic laboratory procedures.',
    tags: ['dd', 'forensics', 'hashing', 'disk clone']
  },
  {
    id: 'strace',
    name: 'strace',
    category: 'reverse_engineering',
    purpose: 'Diagnostic, debugging and instructional userspace utility for Linux.',
    shortDescription: 'Intercepts and records system calls made by a process.',
    description: 'strace monitors and intercepts system calls (open, read, write, connect, execve) and signals received by a process, providing insight into application behavior without source code.',
    installationMethod: 'sudo apt install strace',
    syntax: 'strace [options] <command>',
    parameterExplanations: [
      { param: '-e trace=<calls>', explanation: 'Filter specific system calls (e.g. -e trace=network).' },
      { param: '-f', explanation: 'Follow child processes created by fork/clone.' }
    ],
    safeCommands: [
      { command: 'strace -e trace=openat ls', description: 'Trace files opened by ls', explanation: 'Displays file access system calls in real time.' }
    ],
    prerequisites: ['Linux system call knowledge'],
    difficulty: 'Beginner',
    relatedTools: ['ltrace', 'gdb'],
    officialDocsUrl: 'https://strace.io/',
    defensiveUseCase: 'Monitoring untrusted binaries in an isolated sandbox to detect unauthorized file manipulation.',
    tags: ['system calls', 'debugging', 'linux', 'trace']
  },
  {
    id: 'ltrace',
    name: 'ltrace',
    category: 'reverse_engineering',
    purpose: 'Intercept and record dynamic library calls called by executed process.',
    shortDescription: 'Tracks shared dynamic library (libc) calls made by programs.',
    description: 'ltrace intercepts and records dynamic library calls (e.g. strcmp, malloc, getenv, printf) made by an executed program and can trace the signals received.',
    installationMethod: 'sudo apt install ltrace',
    syntax: 'ltrace [options] <command>',
    parameterExplanations: [
      { param: '-s <len>', explanation: 'Maximum string length to display.' },
      { param: '-e <filter>', explanation: 'Filter specific library functions.' }
    ],
    safeCommands: [
      { command: 'ltrace ls', description: 'Trace dynamic library calls', explanation: 'Displays libc calls executed by binary.' }
    ],
    prerequisites: ['C shared libraries understanding'],
    difficulty: 'Beginner',
    relatedTools: ['strace', 'gdb'],
    officialDocsUrl: 'https://www.kali.org/tools/ltrace/',
    defensiveUseCase: 'Catching plaintext password comparisons in proprietary authentication binaries.',
    tags: ['library calls', 'libc', 'reverse engineering']
  },
  {
    id: 'cutter',
    name: 'Cutter (Rizin / Radare2 GUI)',
    category: 'reverse_engineering',
    purpose: 'Free and open-source reverse engineering framework powered by Rizin.',
    shortDescription: 'Modern, intuitive graphical user interface for Rizin and Radare2.',
    description: 'Cutter provides an intuitive Qt interface for reverse engineering, featuring interactive decompilation, disassembly graph views, hex editing, and debugging without command-line complexity.',
    installationMethod: 'Download from Cutter release page',
    syntax: 'cutter <binary>',
    parameterExplanations: [
      { param: 'GUI based', explanation: 'Desktop application with interactive decompiler tabs.' }
    ],
    safeCommands: [
      { command: 'cutter &', description: 'Launch Cutter GUI', explanation: 'Opens graphical reverse engineering environment.' }
    ],
    prerequisites: ['Reverse engineering concepts'],
    difficulty: 'Intermediate',
    relatedTools: ['radare2', 'ghidra'],
    officialDocsUrl: 'https://cutter.re/',
    defensiveUseCase: 'Malware triage for analysts who prefer graphical disassembly flowcharts over terminal consoles.',
    tags: ['gui', 'decompiler', 'disassembly', 'reverse engineering']
  },

  // Additional Defensive Security & Hardening (10 Tools)
  {
    id: 'modsecurity',
    name: 'OWASP ModSecurity Core Rule Set (CRS)',
    category: 'defensive_security',
    purpose: 'Open-source, cross-platform Web Application Firewall (WAF) engine.',
    shortDescription: 'Open-source web application firewall ruleset stopping OWASP Top 10.',
    description: 'ModSecurity integrates with Apache, Nginx, and IIS to inspect HTTP traffic in real time, enforcing strict rule sets to block SQL injection, cross-site scripting, and remote code execution.',
    installationMethod: 'sudo apt install libapache2-mod-security2',
    syntax: 'SecRule <variable> <operator> <action>',
    parameterExplanations: [
      { param: 'SecRuleEngine On', explanation: 'Enable active blocking mode in Apache/Nginx configuration.' }
    ],
    safeCommands: [
      { command: 'apache2ctl -M | grep security', description: 'Verify ModSecurity module', explanation: 'Confirms WAF module is loaded into web server.' }
    ],
    prerequisites: ['Web server administration'],
    difficulty: 'Intermediate',
    relatedTools: ['suricata', 'snort'],
    officialDocsUrl: 'https://coreruleset.org/',
    defensiveUseCase: 'Defending legacy web applications from zero-day exploits while patches are developed.',
    tags: ['waf', 'modsecurity', 'owasp', 'defense']
  },
  {
    id: 'tripwire',
    name: 'Tripwire Open Source',
    category: 'defensive_security',
    purpose: 'Host-based intrusion detection system for file integrity monitoring (FIM).',
    shortDescription: 'File integrity monitoring (FIM) tool detecting unauthorized file modifications.',
    description: 'Tripwire creates a cryptographic baseline of system files and alerts administrators whenever critical configuration files (/etc, /bin, /sbin) are modified, added, or deleted.',
    installationMethod: 'sudo apt install tripwire',
    syntax: 'sudo tripwire --check',
    parameterExplanations: [
      { param: '--check', explanation: 'Scan filesystem against cryptographic baseline.' },
      { param: '--init', explanation: 'Generate new cryptographic baseline database.' }
    ],
    safeCommands: [
      { command: 'sudo tripwire --check', description: 'Audit file integrity', explanation: 'Reports file additions and modifications against baseline.' }
    ],
    prerequisites: ['Root privileges', 'Cryptographic signing'],
    difficulty: 'Intermediate',
    relatedTools: ['auditd', 'aide'],
    officialDocsUrl: 'https://github.com/Tripwire/tripwire-open-source',
    defensiveUseCase: 'Mandatory PCI-DSS Section 11.5 file integrity monitoring compliance.',
    tags: ['fim', 'integrity', 'hashing', 'host defense']
  },
  {
    id: 'wazuh-agent',
    name: 'Wazuh Open Source XDR & SIEM',
    category: 'defensive_security',
    purpose: 'Unified XDR and SIEM platform for threat detection and compliance monitoring.',
    shortDescription: 'Unified enterprise open-source SIEM agent for threat detection.',
    description: 'Wazuh collects telemetry, monitors file integrity, detects rootkits, audits system configurations, and streams alerts to centralized SIEM clusters for real-time incident response.',
    installationMethod: 'curl -s https://packages.wazuh.com/key/GPG-KEY-WAZUH | sudo gpg --dearmor -o /etc/apt/keyrings/wazuh.gpg',
    syntax: 'sudo /var/ossec/bin/wazuh-control [command]',
    parameterExplanations: [
      { param: 'status', explanation: 'Check status of running agent daemons.' }
    ],
    safeCommands: [
      { command: 'sudo systemctl status wazuh-agent', description: 'Check Wazuh agent health', explanation: 'Validates SIEM agent connection to central manager.' }
    ],
    prerequisites: ['Central Wazuh server'],
    difficulty: 'Intermediate',
    relatedTools: ['zeek', 'suricata'],
    officialDocsUrl: 'https://wazuh.com/',
    defensiveUseCase: 'Centralized Security Operations Center (SOC) logging and incident correlation across thousands of nodes.',
    tags: ['siem', 'xdr', 'soc', 'blue team', 'defense']
  }
];
