import { KaliTool } from '../../types/cyber';

export const TOOLS_PART_2: KaliTool[] = [
  // ==========================================
  // 3. WEB APPLICATION SECURITY (25 Tools)
  // ==========================================
  {
    id: 'burpsuite',
    name: 'Burp Suite (Community / Professional)',
    category: 'web_applications',
    purpose: 'Integrated platform for auditing and attacking web application security.',
    shortDescription: 'The premier HTTP intercepting proxy, repeater, and vulnerability scanner.',
    description: 'Acts as an HTTP intercepting proxy that lets security engineers view, modify, and repeat web browser requests and responses in real time. Features Repeater, Intruder, Decoder, and Collaborator.',
    installationMethod: 'sudo apt install burpsuite',
    syntax: 'burpsuite &',
    parameterExplanations: [
      { param: '127.0.0.1:8080', explanation: 'Default local HTTP proxy listening interface.' }
    ],
    safeCommands: [
      { command: 'burpsuite &', description: 'Launch GUI proxy on 127.0.0.1:8080', explanation: 'Starts HTTP proxy listener for browser interception.' }
    ],
    prerequisites: ['HTTP protocol', 'Browser proxy setup'],
    difficulty: 'Intermediate',
    relatedTools: ['zap', 'mitmproxy'],
    officialDocsUrl: 'https://portswigger.net/burp',
    defensiveUseCase: 'Auditing API authentication tokens, testing authorization bypass (IDOR), and input sanitization.',
    tags: ['proxy', 'repeater', 'http', 'api testing', 'owasp']
  },
  {
    id: 'sqlmap',
    name: 'sqlmap',
    category: 'web_applications',
    purpose: 'Automatic SQL injection detection and database takeover tool.',
    shortDescription: 'Automates detection and exploitation of SQL injection flaws.',
    description: 'sqlmap detects and exploits SQL injection flaws across Boolean-based blind, Time-based blind, Error-based, UNION query-based, and stacked queries on MySQL, PostgreSQL, Oracle, MSSQL, and SQLite.',
    installationMethod: 'sudo apt install sqlmap',
    syntax: 'sqlmap -u "<url>" [options]',
    parameterExplanations: [
      { param: '-u <url>', explanation: 'Target URL with query parameters to test.' },
      { param: '--batch', explanation: 'Never ask for user input, use default behavior.' },
      { param: '--banner', explanation: 'Retrieve DBMS banner only (safe audit mode).' },
      { param: '--dbs', explanation: 'Enumerate DBMS databases.' }
    ],
    safeCommands: [
      { command: 'sqlmap -u "http://lab.local/search.php?id=1" --batch --banner', description: 'Safe banner grab on authorized lab', explanation: 'Verifies SQL injection without extracting user table data.' }
    ],
    prerequisites: ['SQL query concepts'],
    difficulty: 'Intermediate',
    relatedTools: ['commix', 'nosqlmap'],
    officialDocsUrl: 'https://sqlmap.org/',
    defensiveUseCase: 'Verifying that user-supplied input parameters are safely bound inside Prepared Statements.',
    tags: ['sqli', 'database', 'injection', 'owasp top 10']
  },
  {
    id: 'gobuster',
    name: 'Gobuster',
    category: 'web_applications',
    purpose: 'High-speed directory, file, DNS, and VHost brute-forcing tool written in Go.',
    shortDescription: 'High-speed Go-based directory, DNS, and virtual host brute-forcer.',
    description: 'Gobuster uses wordlists to locate hidden URIs, directories, backup files (.bak, .old), and virtual hosts on web servers rapidly.',
    installationMethod: 'sudo apt install gobuster',
    syntax: 'gobuster dir -u <url> -w <wordlist> [options]',
    parameterExplanations: [
      { param: 'dir', explanation: 'Directory and file discovery mode.' },
      { param: 'vhost', explanation: 'Virtual host enumeration mode.' },
      { param: '-x <exts>', explanation: 'Comma-separated file extensions to search (e.g. php,txt,html).' }
    ],
    safeCommands: [
      { command: 'gobuster dir -u http://127.0.0.1:3000 -w /usr/share/wordlists/dirb/common.txt -x html,txt', description: 'Scan local server', explanation: 'Discovers endpoints using standard dictionary.' }
    ],
    prerequisites: ['Wordlists understanding'],
    difficulty: 'Beginner',
    relatedTools: ['ffuf', 'feroxbuster', 'dirb'],
    officialDocsUrl: 'https://github.com/OJ/gobuster',
    defensiveUseCase: 'Discovering forgotten backup directories, exposed .git folders, and unlinked admin panels.',
    tags: ['directory brute', 'vhost', 'recon', 'wordlist']
  },
  {
    id: 'ffuf',
    name: 'ffuf (Fast Web Fuzzer)',
    category: 'web_applications',
    purpose: 'Extremely fast web fuzzer written in Go.',
    shortDescription: 'High-throughput HTTP fuzzer for parameters, directories, and headers.',
    description: 'ffuf is a blazing fast web fuzzer designed to fuzz HTTP methods, paths, GET/POST parameters, headers, and JSON payloads with custom filtering rules (filter by size, words, code, regex).',
    installationMethod: 'sudo apt install ffuf',
    syntax: 'ffuf -u <url_with_FUZZ> -w <wordlist> [options]',
    parameterExplanations: [
      { param: 'FUZZ', explanation: 'Keyword in URL/body replaced by wordlist lines.' },
      { param: '-fc <code>', explanation: 'Filter out specific HTTP status codes (e.g. -fc 404).' },
      { param: '-mc <code>', explanation: 'Match only specific status codes (e.g. -mc 200,301).' }
    ],
    safeCommands: [
      { command: 'ffuf -u http://127.0.0.1:3000/FUZZ -w /usr/share/wordlists/dirb/common.txt -mc 200', description: 'Fuzz endpoints on localhost', explanation: 'Tests valid HTTP 200 routes.' }
    ],
    prerequisites: ['HTTP status codes knowledge'],
    difficulty: 'Intermediate',
    relatedTools: ['gobuster', 'wfuzz'],
    officialDocsUrl: 'https://github.com/ffuf/ffuf',
    defensiveUseCase: 'Fuzzing APIs for unexpected HTTP status code leakages.',
    tags: ['fuzzing', 'go', 'fast', 'api']
  },
  {
    id: 'wfuzz',
    name: 'Wfuzz',
    category: 'web_applications',
    purpose: 'Flexible Python tool designed for bruteforcing web applications.',
    shortDescription: 'Modular web application fuzzer supporting multi-point payload injections.',
    description: 'Wfuzz allows injecting multiple payload wordlists into arbitrary HTTP request components (headers, cookies, POST data, URLs) with response filtering by characters, words, and response codes.',
    installationMethod: 'sudo apt install wfuzz',
    syntax: 'wfuzz -c -z file,<wordlist> --hc 404 <url_with_FUZZ>',
    parameterExplanations: [
      { param: '-z file,<dict>', explanation: 'Specify payload generator and dictionary file.' },
      { param: '--hc <code>', explanation: 'Hide responses matching specified HTTP status code.' }
    ],
    safeCommands: [
      { command: 'wfuzz -c -z file,/usr/share/wordlists/dirb/common.txt --hc 404 http://127.0.0.1:3000/FUZZ', description: 'Scan localhost endpoints', explanation: 'Fuzzes URLs hiding 404 responses.' }
    ],
    prerequisites: ['Python runtime'],
    difficulty: 'Intermediate',
    relatedTools: ['ffuf', 'gobuster'],
    officialDocsUrl: 'https://github.com/xmendez/wfuzz',
    defensiveUseCase: 'Validating rate-limiting and WAF blocking effectiveness under parameter fuzzing.',
    tags: ['fuzzing', 'python', 'parameters', 'headers']
  },
  {
    id: 'feroxbuster',
    name: 'Feroxbuster',
    category: 'web_applications',
    purpose: 'Simple, fast, recursive content discovery tool written in Rust.',
    shortDescription: 'Recursive content discovery engine with automated link extraction.',
    description: 'A recursive content discovery tool written in Rust that automatically detects wildcards, parses responses for new URLs, handles rate-limits, and recurses into discovered directories.',
    installationMethod: 'sudo apt install feroxbuster',
    syntax: 'feroxbuster -u <url> [options]',
    parameterExplanations: [
      { param: '-w <wordlist>', explanation: 'Path to wordlist.' },
      { param: '-d <depth>', explanation: 'Maximum recursion directory depth.' }
    ],
    safeCommands: [
      { command: 'feroxbuster -u http://127.0.0.1:3000 -d 1', description: 'Shallow recursive scan', explanation: 'Discovers first-level routes safely.' }
    ],
    prerequisites: ['Rust runtime (optional)'],
    difficulty: 'Intermediate',
    relatedTools: ['gobuster', 'ffuf'],
    officialDocsUrl: 'https://github.com/epi052/feroxbuster',
    defensiveUseCase: 'Mapping comprehensive route coverage on corporate microservices.',
    tags: ['rust', 'recursive', 'directory brute']
  },
  {
    id: 'zap',
    name: 'OWASP ZAP (Zed Attack Proxy)',
    category: 'web_applications',
    purpose: 'Open-source web application security scanner and proxy.',
    shortDescription: 'OWASP integrated web application vulnerability scanner and proxy.',
    description: 'OWASP ZAP is designed for developers and security analysts to automatically find security vulnerabilities in web applications during development and testing phases.',
    installationMethod: 'sudo apt install zaproxy',
    syntax: 'zaproxy &',
    parameterExplanations: [
      { param: '-cmd', explanation: 'Run in non-GUI headless command-line mode.' },
      { param: '-quickurl <url>', explanation: 'Perform quick automated baseline scan on URL.' }
    ],
    safeCommands: [
      { command: 'zaproxy &', description: 'Launch ZAP GUI', explanation: 'Starts proxy interface on 127.0.0.1:8080.' }
    ],
    prerequisites: ['Java JRE'],
    difficulty: 'Beginner',
    relatedTools: ['burpsuite', 'nikto'],
    officialDocsUrl: 'https://www.zaproxy.org/',
    defensiveUseCase: 'Automated DAST baseline scanning inside continuous integration (CI) workflows.',
    tags: ['owasp', 'dast', 'proxy', 'automated scan']
  },
  {
    id: 'commix',
    name: 'Commix',
    category: 'web_applications',
    purpose: 'Automated command injection exploitation and detection tool.',
    shortDescription: 'Tests and audits web applications for OS Command Injection flaws.',
    description: 'Commix automates the detection and exploitation of command injection vulnerabilities across web applications, testing for classic, blind, and time-based OS command injection.',
    installationMethod: 'sudo apt install commix',
    syntax: 'commix -u "<url>" [options]',
    parameterExplanations: [
      { param: '-u <url>', explanation: 'Target URL with injectable parameter.' },
      { param: '--batch', explanation: 'Run in unattended automated mode.' }
    ],
    safeCommands: [
      { command: 'commix -u "http://lab.local/ping.php?host=127.0.0.1" --batch', description: 'Test ping endpoint for OS injection', explanation: 'Verifies command injection vulnerabilities.' }
    ],
    prerequisites: ['OS command execution concepts'],
    difficulty: 'Advanced',
    relatedTools: ['sqlmap'],
    officialDocsUrl: 'https://github.com/commixproject/commix',
    defensiveUseCase: 'Ensuring system commands are invoked through safe APIs without shell execution.',
    tags: ['command injection', 'cwe-78', 'rce']
  },
  {
    id: 'dirb',
    name: 'DIRB Web Content Scanner',
    category: 'web_applications',
    purpose: 'Web content scanner looking for hidden web objects based on dictionary attacks.',
    shortDescription: 'Classic dictionary-based web path auditor.',
    description: 'DIRB is a classic content scanner that launches dictionary-based attacks against web servers, analyzing response codes to catalog accessible hidden directories and files.',
    installationMethod: 'sudo apt install dirb',
    syntax: 'dirb <url> [wordlist] [options]',
    parameterExplanations: [
      { param: '-r', explanation: 'Do not search recursively into subdirectories.' },
      { param: '-z <delay>', explanation: 'Add millisecond delay between requests.' }
    ],
    safeCommands: [
      { command: 'dirb http://127.0.0.1:3000 /usr/share/wordlists/dirb/common.txt -r', description: 'Non-recursive local path scan', explanation: 'Identifies standard routes on local server.' }
    ],
    prerequisites: ['CLI basics'],
    difficulty: 'Beginner',
    relatedTools: ['gobuster', 'dirbuster'],
    officialDocsUrl: 'https://www.kali.org/tools/dirb/',
    defensiveUseCase: 'Checking for publicly accessible sensitive files such as phpinfo.php and config.bak.',
    tags: ['content scan', 'directories', 'wordlist']
  },
  {
    id: 'subfinder',
    name: 'Subfinder (ProjectDiscovery)',
    category: 'web_applications',
    purpose: 'Fast passive subdomain enumeration tool discovery engine.',
    shortDescription: 'Passive subdomain discovery tool using curated online APIs.',
    description: 'Subfinder is built for passive subdomain discovery using dozens of passive sources (VirusTotal, Censys, Shodan, BinaryEdge, SecurityTrails) without touching the target network.',
    installationMethod: 'sudo apt install subfinder',
    syntax: 'subfinder -d <domain> [options]',
    parameterExplanations: [
      { param: '-d <domain>', explanation: 'Target domain to analyze.' },
      { param: '-silent', explanation: 'Display only discovered subdomains in clean output.' }
    ],
    safeCommands: [
      { command: 'subfinder -d example.com -silent', description: 'Passive discovery', explanation: 'Fetches known subdomains without transmitting packets to target.' }
    ],
    prerequisites: ['OSINT awareness'],
    difficulty: 'Beginner',
    relatedTools: ['amass', 'theharvester'],
    officialDocsUrl: 'https://docs.projectdiscovery.io/tools/subfinder/',
    defensiveUseCase: 'Monitoring organization attack surface for unauthorized newly spun subdomains.',
    tags: ['subdomains', 'passive', 'osint', 'fast']
  },
  {
    id: 'httpx-pd',
    name: 'httpx (ProjectDiscovery)',
    category: 'web_applications',
    purpose: 'Multi-purpose HTTP toolkit allowing to run multiple probers at once.',
    shortDescription: 'High-speed HTTP probe checking status codes, titles, and technologies.',
    description: 'httpx takes a list of hosts and probes them across HTTP and HTTPS ports, resolving titles, status codes, server headers, TLS certificates, and redirects at massive scale.',
    installationMethod: 'sudo apt install httpx-toolkit',
    syntax: 'httpx -u <url_or_list> [options]',
    parameterExplanations: [
      { param: '-title', explanation: 'Display HTML page titles in output.' },
      { param: '-status-code', explanation: 'Display HTTP response code (200, 301, 403, 500).' },
      { param: '-tech-detect', explanation: 'Detect web technologies (Wappalyzer integration).' }
    ],
    safeCommands: [
      { command: 'echo "https://example.com" | httpx -title -status-code', description: 'Probe target endpoint', explanation: 'Safely extracts page title and HTTP status code.' }
    ],
    prerequisites: ['CLI piping'],
    difficulty: 'Beginner',
    relatedTools: ['whatweb', 'curl'],
    officialDocsUrl: 'https://docs.projectdiscovery.io/tools/httpx/',
    defensiveUseCase: 'Quickly verifying the operational health and status of thousands of web assets.',
    tags: ['http probe', 'status code', 'fast', 'recon']
  },
  {
    id: 'arjun',
    name: 'Arjun (HTTP Parameter Discovery)',
    category: 'web_applications',
    purpose: 'Find hidden HTTP GET & POST query parameters.',
    shortDescription: 'Finds undocumented HTTP parameters using heuristic dictionary injection.',
    description: 'Arjun detects hidden HTTP parameters on web endpoints by injecting wordlists into parameters and observing changes in HTTP status codes, body length, and response reflections.',
    installationMethod: 'sudo apt install arjun || pip install arjun',
    syntax: 'arjun -u <url> [options]',
    parameterExplanations: [
      { param: '-u <url>', explanation: 'Target URL endpoint.' },
      { param: '-m <method>', explanation: 'HTTP method to test (GET, POST, JSON).' }
    ],
    safeCommands: [
      { command: 'arjun -u "http://127.0.0.1:3000/api/view"', description: 'Discover hidden parameters', explanation: 'Tests endpoint for debug parameters like ?debug=1 or ?admin=true.' }
    ],
    prerequisites: ['Web parameters concept'],
    difficulty: 'Intermediate',
    relatedTools: ['paramspider', 'ffuf'],
    officialDocsUrl: 'https://github.com/s0md3v/Arjun',
    defensiveUseCase: 'Identifying forgotten debug parameters that bypass security checks in production APIs.',
    tags: ['parameters', 'api', 'debug', 'web audit']
  },
  {
    id: 'katana',
    name: 'Katana Web Crawler',
    category: 'web_applications',
    purpose: 'Next-generation crawling and spidering framework for web applications.',
    shortDescription: 'High-speed web crawler parsing JavaScript, forms, and endpoints.',
    description: 'Katana crawls web applications using both standard HTTP requests and headless browser automation, extracting links, endpoints, script files, and forms.',
    installationMethod: 'sudo apt install katana',
    syntax: 'katana -u <url> [options]',
    parameterExplanations: [
      { param: '-d <depth>', explanation: 'Maximum crawl depth.' },
      { param: '-jc', explanation: 'Enable JavaScript file parsing for endpoints.' }
    ],
    safeCommands: [
      { command: 'katana -u https://example.com -d 1', description: 'Crawl top-level endpoints', explanation: 'Extracts links from homepage safely.' }
    ],
    prerequisites: ['Web crawler understanding'],
    difficulty: 'Intermediate',
    relatedTools: ['gospider', 'hakrawler'],
    officialDocsUrl: 'https://docs.projectdiscovery.io/tools/katana/',
    defensiveUseCase: 'Mapping total attack surface before conducting web vulnerability audits.',
    tags: ['crawler', 'spider', 'javascript endpoints', 'fast']
  },
  {
    id: 'jwt-tool',
    name: 'jwt_tool',
    category: 'web_applications',
    purpose: 'Toolkit for validating, forging, and attacking JSON Web Tokens (JWT).',
    shortDescription: 'Audits JSON Web Tokens for cryptographic flaws (alg:none, weak HMAC).',
    description: 'A Python toolkit designed to test, crack, and forge JSON Web Tokens (JWT). Checks for "none" algorithm vulnerabilities, weak HMAC secrets, key confusion attacks, and spoofed claims.',
    installationMethod: 'git clone https://github.com/ticarpi/jwt_tool.git',
    syntax: 'python3 jwt_tool.py <token> [options]',
    parameterExplanations: [
      { param: '-t <token>', explanation: 'Target JWT string to analyze.' },
      { param: '-C -d <dict>', explanation: 'Bruteforce HMAC secret key using dictionary.' }
    ],
    safeCommands: [
      { command: 'python3 jwt_tool.py eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... -d', description: 'Decode JWT header and claims', explanation: 'Decodes token contents without modifying claims.' }
    ],
    prerequisites: ['JWT standard basics'],
    difficulty: 'Intermediate',
    relatedTools: ['burpsuite'],
    officialDocsUrl: 'https://github.com/ticarpi/jwt_tool',
    defensiveUseCase: 'Verifying that authentication microservices reject unsigned tokens with alg=none.',
    tags: ['jwt', 'tokens', 'crypto', 'authentication']
  },
  {
    id: 'corsy',
    name: 'Corsy',
    category: 'web_applications',
    purpose: 'CORS (Cross-Origin Resource Sharing) misconfiguration scanner.',
    shortDescription: 'Scans web endpoints for insecure CORS Origin reflection policies.',
    description: 'Corsy analyzes HTTP response headers to detect insecure Cross-Origin Resource Sharing (CORS) configurations, such as Origin reflection, arbitrary origin allowance, and null origin trust with credentials.',
    installationMethod: 'pip install corsy || git clone https://github.com/s0md3v/Corsy.git',
    syntax: 'python3 corsy.py -u <url> [options]',
    parameterExplanations: [
      { param: '-u <url>', explanation: 'Target web endpoint.' },
      { param: '-headers <str>', explanation: 'Custom headers for authenticated tests.' }
    ],
    safeCommands: [
      { command: 'python3 corsy.py -u https://example.com', description: 'Test CORS policy', explanation: 'Checks if server allows arbitrary external origins to read responses.' }
    ],
    prerequisites: ['CORS mechanism basics'],
    difficulty: 'Beginner',
    relatedTools: ['burpsuite'],
    officialDocsUrl: 'https://github.com/s0md3v/Corsy',
    defensiveUseCase: 'Preventing unauthorized third-party origins from extracting sensitive user data via CORS.',
    tags: ['cors', 'origin', 'web security', 'headers']
  },
  {
    id: 'xsser',
    name: 'XSSer',
    category: 'web_applications',
    purpose: 'Automatic framework to detect, exploit, and report XSS vulnerabilities.',
    shortDescription: 'Framework for detecting Cross-Site Scripting (XSS) injection flaws.',
    description: 'XSSer crawls target websites and prepares advanced injection vectors to test parameters for stored, reflected, and DOM-based Cross-Site Scripting vulnerabilities.',
    installationMethod: 'sudo apt install xsser',
    syntax: 'xsser -u <url> [options]',
    parameterExplanations: [
      { param: '-u <url>', explanation: 'Target URL with parameters.' },
      { param: '--auto', explanation: 'Automatically test default safe XSS vectors.' }
    ],
    safeCommands: [
      { command: 'xsser -u "http://lab.local/search?q=test" --auto', description: 'Audit search parameter for XSS', explanation: 'Tests if user input is properly HTML-escaped.' }
    ],
    prerequisites: ['HTML and JS fundamentals'],
    difficulty: 'Intermediate',
    relatedTools: ['burpsuite', 'dsss'],
    officialDocsUrl: 'https://github.com/epsylon/xsser',
    defensiveUseCase: 'Enforcing Context-Aware Output Encoding to completely eliminate XSS vulnerabilities.',
    tags: ['xss', 'injection', 'javascript', 'owasp']
  },
  {
    id: 'dsss',
    name: 'DSSS (Damn Small SQLi Scanner)',
    category: 'web_applications',
    purpose: 'Ultra-lightweight Python SQL injection vulnerability scanner in under 100 lines.',
    shortDescription: 'Minimalist Python SQL injection scanner for rapid audits.',
    description: 'DSSS is an educational and minimalist SQL injection scanner supporting GET and POST parameters, testing for basic error and boolean-based vulnerabilities in under 100 lines of Python.',
    installationMethod: 'git clone https://github.com/stamparm/DSSS.git',
    syntax: 'python3 dsss.py -u "<url>"',
    parameterExplanations: [
      { param: '-u <url>', explanation: 'Target URL with query parameter.' }
    ],
    safeCommands: [
      { command: 'python3 dsss.py -u "http://lab.local/item?id=1"', description: 'Scan parameter for SQLi', explanation: 'Safely probes parameter for database error responses.' }
    ],
    prerequisites: ['Python basics'],
    difficulty: 'Beginner',
    relatedTools: ['sqlmap'],
    officialDocsUrl: 'https://github.com/stamparm/DSSS',
    defensiveUseCase: 'Demonstrating the fundamental mechanics of automated SQL injection detection.',
    tags: ['sqli', 'minimalist', 'python', 'education']
  },
  {
    id: 'nosqlmap',
    name: 'NoSQLMap',
    category: 'web_applications',
    purpose: 'Automated pentesting tool for exploiting NoSQL database weaknesses (MongoDB).',
    shortDescription: 'Automates injection attacks against MongoDB and CouchDB.',
    description: 'NoSQLMap targets NoSQL web applications and database systems, testing for PHP/Node.js MongoDB injection ($ne, $regex) and default unauthenticated database access.',
    installationMethod: 'git clone https://github.com/codingo/NoSQLMap.git',
    syntax: 'python nosqlmap.py',
    parameterExplanations: [
      { param: 'Interactive CLI', explanation: 'Menu driven interface for selecting targets and databases.' }
    ],
    safeCommands: [
      { command: 'python nosqlmap.py', description: 'Launch interactive shell', explanation: 'Starts NoSQL testing interface.' }
    ],
    prerequisites: ['NoSQL concepts'],
    difficulty: 'Intermediate',
    relatedTools: ['sqlmap'],
    officialDocsUrl: 'https://github.com/codingo/NoSQLMap',
    defensiveUseCase: 'Validating that query objects passed to MongoDB do not accept unsanitized BSON operators ($where, $ne).',
    tags: ['nosql', 'mongodb', 'injection', 'database']
  },
  {
    id: 'gospider',
    name: 'GoSpider',
    category: 'web_applications',
    purpose: 'Fast web spider written in Go with support for subdomains and sitemaps.',
    shortDescription: 'High-speed concurrent web crawler for bug bounty reconnaissance.',
    description: 'GoSpider crawls websites concurrently, parsing robots.txt, sitemaps, HTML links, and JavaScript files to uncover hidden endpoints and parameters.',
    installationMethod: 'go install github.com/jaeles-project/gospider@latest',
    syntax: 'gospider -s <site> [options]',
    parameterExplanations: [
      { param: '-s <url>', explanation: 'Site URL to crawl.' },
      { param: '-c <threads>', explanation: 'Concurrency level.' }
    ],
    safeCommands: [
      { command: 'gospider -s https://example.com -d 1', description: 'Spider target domain', explanation: 'Collects endpoints with strict depth limit.' }
    ],
    prerequisites: ['Go runtime'],
    difficulty: 'Intermediate',
    relatedTools: ['katana', 'hakrawler'],
    officialDocsUrl: 'https://github.com/jaeles-project/gospider',
    defensiveUseCase: 'Auditing robots.txt and sitemaps to verify that administrative portals are not referenced.',
    tags: ['spider', 'go', 'crawler', 'recon']
  },
  {
    id: 'hakrawler',
    name: 'hakrawler',
    category: 'web_applications',
    purpose: 'Simple, fast web crawler designed for easy pipeline integration.',
    shortDescription: 'Pipelined web crawler designed to feed URLs into tools like httpx.',
    description: 'Takes a list of URLs from stdin and crawls them to discover endpoints and assets, designed to be chained in Unix pipelines with subfinder and httpx.',
    installationMethod: 'go install github.com/hakluke/hakrawler@latest',
    syntax: 'echo <url> | hakrawler [options]',
    parameterExplanations: [
      { param: '-depth <n>', explanation: 'Crawl depth.' },
      { param: '-plain', explanation: 'Output clean plaintext without ANSI colors.' }
    ],
    safeCommands: [
      { command: 'echo "https://example.com" | hakrawler -depth 1', description: 'Crawl homepage', explanation: 'Extracts links cleanly for piping.' }
    ],
    prerequisites: ['CLI pipeline basics'],
    difficulty: 'Beginner',
    relatedTools: ['katana', 'gospider'],
    officialDocsUrl: 'https://github.com/hakluke/hakrawler',
    defensiveUseCase: 'Automated asset discovery for web application inventory systems.',
    tags: ['crawler', 'pipeline', 'recon']
  },

  // ==========================================
  // 4. PASSWORD AUDITING (20 Tools)
  // ==========================================
  {
    id: 'hashcat',
    name: 'Hashcat',
    category: 'password_attacks',
    purpose: 'World’s fastest password recovery utility leveraging GPU compute.',
    shortDescription: 'GPU-accelerated password recovery supporting 350+ hash types.',
    description: 'Hashcat is a state-of-the-art password recovery tool supporting over 350 hash types including MD5, SHA-256, NTLM, bcrypt, Argon2, and WPA handshakes using CPU or GPU acceleration.',
    installationMethod: 'sudo apt install hashcat',
    syntax: 'hashcat [options] <hash_or_file> <wordlist_or_mask>',
    parameterExplanations: [
      { param: '-m <code>', explanation: 'Hash type mode (e.g. 0=MD5, 1000=NTLM, 1400=SHA256, 3200=bcrypt).' },
      { param: '-a <code>', explanation: 'Attack mode (0=dictionary, 3=brute-force mask, 1=combination).' },
      { param: '-b', explanation: 'Run hardware performance benchmark.' }
    ],
    safeCommands: [
      { command: 'hashcat -b -m 1400', description: 'Benchmark SHA-256 cracking speed', explanation: 'Tests GPU/CPU hashing throughput in Megahashes/sec safely.' },
      { command: 'hashcat -m 0 -a 0 sample_hash.txt wordlist.txt', description: 'Dictionary attack on MD5', explanation: 'Recovers password from test wordlist.' }
    ],
    prerequisites: ['Cryptography hash knowledge', 'OpenCL/CUDA drivers'],
    difficulty: 'Intermediate',
    relatedTools: ['john', 'ophcrack'],
    officialDocsUrl: 'https://hashcat.net/hashcat/',
    defensiveUseCase: 'Active Directory password audits to discover weak employee passwords and enforce robust minimum password length policies.',
    tags: ['hash cracking', 'gpu', 'passwords', 'wordlist']
  },
  {
    id: 'john',
    name: 'John the Ripper (JtR)',
    category: 'password_attacks',
    purpose: 'Fast password cracker designed to detect weak Unix/Windows passwords.',
    shortDescription: 'Flexible password security auditing tool with custom mangling rules.',
    description: 'John the Ripper is an open-source password security auditing tool with support for custom mangling rules, zip/rar archives, SSH private keys, and hundreds of cipher types.',
    installationMethod: 'sudo apt install john',
    syntax: 'john [options] [hashfile]',
    parameterExplanations: [
      { param: '--wordlist=<file>', explanation: 'Path to wordlist dictionary.' },
      { param: '--format=<fmt>', explanation: 'Specify hash format (e.g. raw-md5, sha512crypt).' },
      { param: '--show', explanation: 'Display recovered plaintext passwords.' }
    ],
    safeCommands: [
      { command: 'john --wordlist=/usr/share/wordlists/rockyou.txt hashes.txt', description: 'Run wordlist crack', explanation: 'Audits password hashes against common dictionary.' }
    ],
    prerequisites: ['Hash format knowledge'],
    difficulty: 'Intermediate',
    relatedTools: ['hashcat', 'hydra'],
    officialDocsUrl: 'https://www.openwall.com/john/',
    defensiveUseCase: 'Auditing Linux /etc/shadow files for compliance with password policy guidelines.',
    tags: ['passwords', 'hash cracking', 'unix', 'rules']
  },
  {
    id: 'hydra',
    name: 'THC-Hydra',
    category: 'password_attacks',
    purpose: 'Parallelized network login cracker supporting numerous protocols.',
    shortDescription: 'Fast network authentication audit tool supporting SSH, FTP, HTTP, RDP.',
    description: 'Hydra is a fast network authentication test tool supporting over 50 protocols (SSH, FTP, HTTP-POST, RDP, SMB, MySQL) to test account lockout mechanisms and password resilience.',
    installationMethod: 'sudo apt install hydra',
    syntax: 'hydra -l <user> -P <passlist> <target> <service> [options]',
    parameterExplanations: [
      { param: '-l <user>', explanation: 'Single username to test.' },
      { param: '-L <file>', explanation: 'File containing list of usernames.' },
      { param: '-P <file>', explanation: 'File containing passwords to test.' },
      { param: '-t <tasks>', explanation: 'Number of parallel tasks (rate throttling).' }
    ],
    safeCommands: [
      { command: 'hydra -l admin -P small_wordlist.txt 127.0.0.1 ssh -t 2', description: 'Throttled test on local SSH', explanation: 'Tests local server with 2 threads to verify fail2ban triggering.' }
    ],
    prerequisites: ['Network protocols awareness'],
    difficulty: 'Intermediate',
    relatedTools: ['medusa', 'ncrack'],
    officialDocsUrl: 'https://github.com/vanhauser-thc/thc-hydra',
    defensiveUseCase: 'Testing fail2ban, rate-limiting, and Multi-Factor Authentication (MFA) enforcement on perimeter services.',
    tags: ['network login', 'brute force', 'ssh', 'auth audit']
  },
  {
    id: 'medusa',
    name: 'Medusa Network Login Auditing',
    category: 'password_attacks',
    purpose: 'Speedy, parallel, modular login brute-forcer for network services.',
    shortDescription: 'Parallel, modular login auditor for network protocols.',
    description: 'Medusa is designed to be a speedy, massively parallel, modular network brute-forcer supporting HTTP, SSH, FTP, Telnet, POP3, and SMB with thread-based parallel testing.',
    installationMethod: 'sudo apt install medusa',
    syntax: 'medusa -h <host> -u <user> -P <passlist> -M <module>',
    parameterExplanations: [
      { param: '-h <host>', explanation: 'Target host IP.' },
      { param: '-M <module>', explanation: 'Protocol module (e.g. ssh, ftp, http).' }
    ],
    safeCommands: [
      { command: 'medusa -h 127.0.0.1 -u testuser -P wordlist.txt -M ftp', description: 'Test local FTP authentication', explanation: 'Audits FTP account security.' }
    ],
    prerequisites: ['Authentication concepts'],
    difficulty: 'Intermediate',
    relatedTools: ['hydra', 'ncrack'],
    officialDocsUrl: 'https://www.kali.org/tools/medusa/',
    defensiveUseCase: 'Validating account lockout policies after consecutive failed login attempts.',
    tags: ['auth audit', 'medusa', 'network brute force']
  },
  {
    id: 'ncrack',
    name: 'Ncrack (Network Authentication Cracker)',
    category: 'password_attacks',
    purpose: 'High-speed network authentication cracking tool by the Nmap team.',
    shortDescription: 'Network authentication tool built on Nmap’s dynamic timing engine.',
    description: 'Ncrack is designed to help companies secure their networks by proactively testing all network hosts and services for weak passwords using dynamic rate-adaptation algorithms.',
    installationMethod: 'sudo apt install ncrack',
    syntax: 'ncrack [options] <target:service>',
    parameterExplanations: [
      { param: '-T<0-5>', explanation: 'Timing template from paranoid to aggressive.' },
      { param: '--user <user>', explanation: 'Target username.' }
    ],
    safeCommands: [
      { command: 'ncrack -p 22 127.0.0.1:22', description: 'Audit local SSH port', explanation: 'Tests SSH authentication with dynamic rate throttling.' }
    ],
    prerequisites: ['Networking fundamentals'],
    difficulty: 'Intermediate',
    relatedTools: ['hydra', 'nmap'],
    officialDocsUrl: 'https://nmap.org/ncrack/',
    defensiveUseCase: 'Proactive enterprise credential auditing across large subnets.',
    tags: ['nmap', 'authentication', 'rate adaptation']
  },
  {
    id: 'cewl',
    name: 'CeWL (Custom Word List Generator)',
    category: 'password_attacks',
    purpose: 'Spider a target URL and generate custom dictionary wordlists from webpage terms.',
    shortDescription: 'Generates targeted password wordlists from corporate websites.',
    description: 'CeWL crawls a specified URL to a given depth and extracts unique words, writing a targeted custom dictionary that reflects corporate jargon, employee names, and industry keywords.',
    installationMethod: 'sudo apt install cewl',
    syntax: 'cewl [options] <url>',
    parameterExplanations: [
      { param: '-d <depth>', explanation: 'Spider depth (default 2).' },
      { param: '-m <min_len>', explanation: 'Minimum word length to include (e.g. -m 8).' },
      { param: '-w <file>', explanation: 'Write generated wordlist to file.' }
    ],
    safeCommands: [
      { command: 'cewl -d 1 -m 8 -w custom_dict.txt https://example.com', description: 'Generate targeted dictionary', explanation: 'Creates 8+ character wordlist from website text.' }
    ],
    prerequisites: ['Ruby runtime'],
    difficulty: 'Beginner',
    relatedTools: ['crunch', 'hashcat'],
    officialDocsUrl: 'https://github.com/digininja/CeWL',
    defensiveUseCase: 'Demonstrating how attackers create targeted dictionaries based on public website vocabulary.',
    tags: ['wordlist', 'crawler', 'custom dictionary']
  },
  {
    id: 'crunch',
    name: 'Crunch Wordlist Generator',
    category: 'password_attacks',
    purpose: 'Generate custom wordlists based on character sets and length permutations.',
    shortDescription: 'Generates wordlists based on custom character patterns and lengths.',
    description: 'Crunch can generate wordlists using numbers, letters, symbols, or custom patterns (@ for lowercase, , for uppercase, % for numbers, ^ for symbols), calculating wordlist size prior to generation.',
    installationMethod: 'sudo apt install crunch',
    syntax: 'crunch <min> <max> [charset] [options]',
    parameterExplanations: [
      { param: '<min> <max>', explanation: 'Minimum and maximum word length.' },
      { param: '-t <pattern>', explanation: 'Pattern template (@=lower, ,=upper, %=digit, ^=symbol).' }
    ],
    safeCommands: [
      { command: 'crunch 8 8 -t Pass%%%% -o sample.txt', description: 'Generate patterned wordlist', explanation: 'Creates wordlist for Pass0000 through Pass9999.' }
    ],
    prerequisites: ['Disk space awareness'],
    difficulty: 'Beginner',
    relatedTools: ['cewl', 'hashcat'],
    officialDocsUrl: 'https://sourceforge.net/projects/crunch-wordlist/',
    defensiveUseCase: 'Creating specific test vectors to verify password complexity filter rules.',
    tags: ['wordlist', 'generator', 'permutations']
  },
  {
    id: 'ophcrack',
    name: 'Ophcrack (Rainbow Table Cracker)',
    category: 'password_attacks',
    purpose: 'Crack Windows LM/NTLM password hashes using precomputed rainbow tables.',
    shortDescription: 'Windows LM and NTLM password cracker based on rainbow tables.',
    description: 'Ophcrack uses precomputed rainbow tables to crack LM and NTLM hashes in seconds by trading storage space for computation time.',
    installationMethod: 'sudo apt install ophcrack',
    syntax: 'ophcrack [options]',
    parameterExplanations: [
      { param: '-g', explanation: 'Disable graphical interface and run in terminal.' },
      { param: '-d <dir>', explanation: 'Directory containing rainbow tables.' }
    ],
    safeCommands: [
      { command: 'ophcrack -g', description: 'Launch CLI mode', explanation: 'Starts rainbow table lookup console.' }
    ],
    prerequisites: ['Rainbow tables dataset'],
    difficulty: 'Beginner',
    relatedTools: ['hashcat', 'john'],
    officialDocsUrl: 'https://ophcrack.sourceforge.io/',
    defensiveUseCase: 'Understanding why Microsoft deprecated unsalted LM hashes and why slow KDFs are required.',
    tags: ['rainbow tables', 'ntlm', 'windows']
  },
  {
    id: 'fcrackzip',
    name: 'fcrackzip',
    category: 'password_attacks',
    purpose: 'Fast, modular ZIP archive password cracker.',
    shortDescription: 'Recovers forgotten passwords on encrypted ZIP archives.',
    description: 'A fast password recovery tool written in C that supports dictionary attacks and brute-force permutation attacks against password-protected legacy ZIP files.',
    installationMethod: 'sudo apt install fcrackzip',
    syntax: 'fcrackzip [options] <archive.zip>',
    parameterExplanations: [
      { param: '-u', explanation: 'Unzip: test password with unzip to eliminate false positives.' },
      { param: '-D -p <dict>', explanation: 'Dictionary attack mode using specified wordlist.' }
    ],
    safeCommands: [
      { command: 'fcrackzip -u -D -p wordlist.txt test.zip', description: 'Crack protected test ZIP', explanation: 'Tests dictionary words against archive.' }
    ],
    prerequisites: ['C compiler/runtime'],
    difficulty: 'Beginner',
    relatedTools: ['john', 'hashcat'],
    officialDocsUrl: 'https://www.kali.org/tools/fcrackzip/',
    defensiveUseCase: 'Demonstrating the vulnerability of standard ZipCrypto and advocating for AES-256 encrypted containers.',
    tags: ['zip', 'archive', 'passwords', 'encryption']
  },
  {
    id: 'pdfcrack',
    name: 'pdfcrack',
    category: 'password_attacks',
    purpose: 'Command line tool for recovering passwords and content from PDF files.',
    shortDescription: 'Recovers user and owner passwords from encrypted PDF documents.',
    description: 'Supports brute-force and dictionary attacks on password-protected PDF files, handling standard security handler revisions 2, 3, 4, 5, and 6.',
    installationMethod: 'sudo apt install pdfcrack',
    syntax: 'pdfcrack -f <document.pdf> [options]',
    parameterExplanations: [
      { param: '-f <file>', explanation: 'Target encrypted PDF document.' },
      { param: '-w <wordlist>', explanation: 'Dictionary wordlist to test.' }
    ],
    safeCommands: [
      { command: 'pdfcrack -f sample.pdf -w wordlist.txt', description: 'Audit sample PDF password', explanation: 'Tests dictionary words against encrypted PDF.' }
    ],
    prerequisites: ['PDF security basics'],
    difficulty: 'Beginner',
    relatedTools: ['john'],
    officialDocsUrl: 'https://pdfcrack.sourceforge.net/',
    defensiveUseCase: 'Auditing sensitive corporate PDF exports to verify strong passphrase usage.',
    tags: ['pdf', 'passwords', 'documents']
  },
  {
    id: 'hashid',
    name: 'hashid',
    category: 'password_attacks',
    purpose: 'Identify the algorithm used to generate a given cryptographic hash.',
    shortDescription: 'Identifies over 220 hash types with Hashcat and John the Ripper mode codes.',
    description: 'Analyzes the character length, character set, and format of a hash string to identify possible algorithms (e.g. MD5, SHA-256, NTLM, bcrypt, Argon2) and outputs their exact Hashcat -m flags.',
    installationMethod: 'sudo apt install hashid',
    syntax: 'hashid [options] <hash_string>',
    parameterExplanations: [
      { param: '-m', explanation: 'Show corresponding Hashcat mode flag.' },
      { param: '-j', explanation: 'Show corresponding John the Ripper format flag.' }
    ],
    safeCommands: [
      { command: 'hashid -m 5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', description: 'Identify SHA-256 hash', explanation: 'Outputs hash algorithm and Hashcat mode -m 1400.' }
    ],
    prerequisites: ['None'],
    difficulty: 'Beginner',
    relatedTools: ['hash-identifier'],
    officialDocsUrl: 'https://github.com/psypanda/hashID',
    defensiveUseCase: 'Identifying hash types extracted during authorized Active Directory audits.',
    tags: ['hash identification', 'algorithm', 'hashcat mode']
  },

  // ==========================================
  // 5. WIRELESS SECURITY (18 Tools)
  // ==========================================
  {
    id: 'aircrack-ng',
    name: 'Aircrack-ng Suite',
    category: 'wireless_attacks',
    purpose: 'Complete suite of tools to assess Wi-Fi network security.',
    shortDescription: 'The de-facto standard 802.11 Wi-Fi monitoring and key auditing suite.',
    description: 'Includes airmon-ng (monitor mode), airodump-ng (packet capture), aireplay-ng (packet injection), and aircrack-ng (WPA/WPA2-PSK key recovery from 4-way EAPOL handshakes).',
    installationMethod: 'sudo apt install aircrack-ng',
    syntax: 'aircrack-ng [options] <.cap_file>',
    parameterExplanations: [
      { param: '-w <wordlist>', explanation: 'Dictionary wordlist to test against captured 4-way handshake.' },
      { param: '-b <bssid>', explanation: 'Access point BSSID MAC address.' }
    ],
    safeCommands: [
      { command: 'airmon-ng check kill', description: 'Stop interfering processes', explanation: 'Terminates wpa_supplicant before monitor mode.' },
      { command: 'airodump-ng wlan0mon', description: 'Passive Wi-Fi spectrum monitoring', explanation: 'Passively listens to beacons to catalog local SSIDs.' }
    ],
    prerequisites: ['Compatible Wi-Fi adapter with monitor mode support'],
    difficulty: 'Intermediate',
    relatedTools: ['wifite', 'kismet'],
    officialDocsUrl: 'https://www.aircrack-ng.org/',
    defensiveUseCase: 'Detecting rogue access points (Evil Twins) and weak WPA-TKIP deployments.',
    tags: ['wifi', '802.11', 'wpa2', 'monitor mode', 'handshake']
  },
  {
    id: 'kismet',
    name: 'Kismet Wireless',
    category: 'wireless_attacks',
    purpose: 'Wireless network detector, sniffer, and intrusion detection system.',
    shortDescription: 'Passive wireless detector and IDS for Wi-Fi, Bluetooth, and SDR.',
    description: 'Kismet works with Wi-Fi, Bluetooth, and SDR hardware to passively detect wireless devices, log PCAPs, and alert on rogue APs without transmitting any RF signals.',
    installationMethod: 'sudo apt install kismet',
    syntax: 'kismet -c <interface>',
    parameterExplanations: [
      { param: '-c <source>', explanation: 'Capture source (e.g. -c wlan0).' }
    ],
    safeCommands: [
      { command: 'kismet -c wlan0', description: 'Launch passive web UI', explanation: 'Passively listens to 802.11 frames on localhost:2501.' }
    ],
    prerequisites: ['Wi-Fi adapter'],
    difficulty: 'Intermediate',
    relatedTools: ['aircrack-ng'],
    officialDocsUrl: 'https://www.kismetwireless.net/',
    defensiveUseCase: 'Wireless Intrusion Detection System (WIDS) defending sensitive corporate facilities.',
    tags: ['wids', 'passive', 'bluetooth', 'rf', 'sniffing']
  },
  {
    id: 'wifite',
    name: 'Wifite2',
    category: 'wireless_attacks',
    purpose: 'Automated wireless network auditing tool designed for Linux.',
    shortDescription: 'Automates wireless auditing using Aircrack-ng, Reaver, and Pyrit.',
    description: 'Wifite is a Python script that automates the process of auditing multiple wireless networks using WEP, WPA-PSK (WPA1/WPA2), and WPS PIN vulnerabilities.',
    installationMethod: 'sudo apt install wifite',
    syntax: 'sudo wifite [options]',
    parameterExplanations: [
      { param: '--wpa', explanation: 'Only target WPA-encrypted networks.' },
      { param: '--wps', explanation: 'Only test WPS-enabled access points.' }
    ],
    safeCommands: [
      { command: 'sudo wifite --wpa', description: 'Scan for WPA networks', explanation: 'Catalogs nearby access points with authorization warnings.' }
    ],
    prerequisites: ['Wireless card with injection support', 'Root privileges'],
    difficulty: 'Intermediate',
    relatedTools: ['aircrack-ng', 'reaver'],
    officialDocsUrl: 'https://github.com/derv82/wifite2',
    defensiveUseCase: 'Verifying that legacy Wi-Fi Protected Setup (WPS) is permanently disabled on company routers.',
    tags: ['wifi', 'wps', 'wpa', 'automated']
  },
  {
    id: 'reaver',
    name: 'Reaver',
    category: 'wireless_attacks',
    purpose: 'Brute force attack against Wi-Fi Protected Setup (WPS) registrar PINs.',
    shortDescription: 'Audits Wi-Fi Protected Setup (WPS) PIN vulnerabilities.',
    description: 'Reaver performs a brute-force attack against an Access Point’s Wi-Fi Protected Setup (WPS) PIN. Because WPS validates the 8-digit PIN in two separate 4-digit halves, it can be tested in 11,000 attempts.',
    installationMethod: 'sudo apt install reaver',
    syntax: 'reaver -i <interface> -b <bssid> [options]',
    parameterExplanations: [
      { param: '-i <iface>', explanation: 'Monitor mode interface.' },
      { param: '-b <bssid>', explanation: 'Target access point BSSID MAC.' }
    ],
    safeCommands: [
      { command: 'wash -i wlan0mon', description: 'Scan for WPS-enabled routers', explanation: 'Passively lists access points broadcasting WPS beacons.' }
    ],
    prerequisites: ['Wireless monitor interface'],
    difficulty: 'Advanced',
    relatedTools: ['bully', 'pixiewps'],
    officialDocsUrl: 'https://github.com/t6x/reaver-wps-fork-t6x',
    defensiveUseCase: 'Verifying complete disabling of WPS across enterprise access points.',
    tags: ['wps', 'wifi', 'pin', 'reaver']
  },
  {
    id: 'pixiewps',
    name: 'Pixiewps',
    category: 'wireless_attacks',
    purpose: 'Offline WPS PIN calculation exploiting low or non-existent PRNG entropy.',
    shortDescription: 'Offline Pixie Dust WPS attack exploiting weak Access Point random generators.',
    description: 'Pixiewps exploits low or non-existent entropy in the pseudo-random number generator (PRNG) of certain wireless chipset manufacturers (Ralink, Broadcom, Realtek) to recover WPS PINs in seconds.',
    installationMethod: 'sudo apt install pixiewps',
    syntax: 'pixiewps [options]',
    parameterExplanations: [
      { param: '-e <pke>', explanation: 'Enrollee public key.' },
      { param: '-r <pkr>', explanation: 'Registrar public key.' },
      { param: '-s <e-hash1>', explanation: 'Enrollee Hash 1.' }
    ],
    safeCommands: [
      { command: 'pixiewps --help', description: 'Display required crypto parameters', explanation: 'Lists PRNG seed analysis options.' }
    ],
    prerequisites: ['EAP-WPS message capture'],
    difficulty: 'Advanced',
    relatedTools: ['reaver', 'bully'],
    officialDocsUrl: 'https://github.com/wiire-a/pixiewps',
    defensiveUseCase: 'Demonstrating the dangers of weak PRNG implementations in embedded firmware.',
    tags: ['wps', 'prng', 'pixie dust', 'entropy']
  },

  // ==========================================
  // 6. EXPLOITATION FRAMEWORKS (18 Tools)
  // ==========================================
  {
    id: 'metasploit',
    name: 'Metasploit Framework (MSF)',
    category: 'exploitation',
    purpose: 'The world’s most widely used penetration testing platform.',
    shortDescription: 'Modular penetration testing framework with 2,300+ exploits.',
    description: 'Metasploit provides thousands of verified exploit modules, payloads, and auxiliary scanners. It helps security teams verify vulnerabilities, manage security assessments, and improve defensive posture.',
    installationMethod: 'sudo apt install metasploit-framework',
    syntax: 'msfconsole [options]',
    parameterExplanations: [
      { param: '-q', explanation: 'Quiet mode: suppress startup ASCII banner.' },
      { param: '-r <script>', explanation: 'Execute resource script file automatically.' }
    ],
    safeCommands: [
      { command: 'msfconsole -q', description: 'Launch console quietly', explanation: 'Starts Metasploit prompt without banner.' },
      { command: 'use auxiliary/scanner/portscan/tcp', description: 'Select safe port scanner', explanation: 'Demonstrates modular auxiliary scanner architecture without firing exploits.' }
    ],
    prerequisites: ['TCP/IP', 'Vulnerability concepts'],
    difficulty: 'Intermediate',
    relatedTools: ['searchsploit', 'armitage'],
    officialDocsUrl: 'https://docs.metasploit.com/',
    defensiveUseCase: 'Proof-of-Concept validation to demonstrate that a critical CVE is exploitable before deploying patches.',
    tags: ['exploit', 'msf', 'payload', 'auxiliary']
  },
  {
    id: 'searchsploit',
    name: 'SearchSploit (Exploit-DB CLI)',
    category: 'exploitation',
    purpose: 'Command-line search tool for Exploit-Database offline repository.',
    shortDescription: 'Offline search engine for thousands of published exploit PoCs.',
    description: 'Allows penetration testers to perform offline searches through thousands of published exploits, paper write-ups, and vulnerability advisories from the Exploit-DB archive.',
    installationMethod: 'sudo apt install exploitdb',
    syntax: 'searchsploit [options] <query>',
    parameterExplanations: [
      { param: '-p <id>', explanation: 'Display local filesystem path of exploit script.' },
      { param: '-m <id>', explanation: 'Mirror/copy exploit file to current directory.' }
    ],
    safeCommands: [
      { command: 'searchsploit apache 2.4.49', description: 'Search known exploits for Apache', explanation: 'Locates path traversal CVE-2021-41773 advisories offline.' }
    ],
    prerequisites: ['None'],
    difficulty: 'Beginner',
    relatedTools: ['cve-search'],
    officialDocsUrl: 'https://www.exploit-db.com/searchsploit',
    defensiveUseCase: 'Verifying if versions detected during software inventory have public exploit code available in the wild.',
    tags: ['exploit-db', 'offline', 'advisories', 'cve']
  },
  {
    id: 'beef',
    name: 'BeEF (Browser Exploitation Framework)',
    category: 'exploitation',
    purpose: 'Penetration testing tool focusing on client-side browser vectors.',
    shortDescription: 'Client-side attack framework targeting web browser hooks.',
    description: 'Focuses on client-side attacks against web browsers. Once a target executes a hooked JavaScript payload (often via XSS), BeEF controls the browser to demonstrate client-side security risks.',
    installationMethod: 'sudo apt install beef-xss',
    syntax: 'sudo beef-xss',
    parameterExplanations: [
      { param: 'hook.js', explanation: 'JavaScript hook payload served on port 3000.' }
    ],
    safeCommands: [
      { command: 'sudo beef-xss', description: 'Launch BeEF control server', explanation: 'Starts local UI on 127.0.0.1:3000/ui/panel.' }
    ],
    prerequisites: ['XSS concepts', 'Ruby runtime'],
    difficulty: 'Advanced',
    relatedTools: ['burpsuite', 'metasploit'],
    officialDocsUrl: 'https://beefproject.com/',
    defensiveUseCase: 'Demonstrating the real business impact of Stored XSS flaws to executive stakeholders.',
    tags: ['client-side', 'xss', 'browser', 'hook']
  },
  {
    id: 'routersploit',
    name: 'RouterSploit',
    category: 'exploitation',
    purpose: 'Exploitation framework dedicated to embedded devices and routers.',
    shortDescription: 'Modular framework testing vulnerabilities in IoT and embedded devices.',
    description: 'An open-source exploitation framework dedicated to embedded devices, offering modules for routers, cameras, and switches to test for default credentials and known firmware CVEs.',
    installationMethod: 'sudo apt install routersploit || git clone https://github.com/threat9/routersploit.git',
    syntax: 'rsf.py',
    parameterExplanations: [
      { param: 'use scanners/autopwn', explanation: 'Automatically scan and test target for known vulnerabilities.' }
    ],
    safeCommands: [
      { command: 'python3 rsf.py', description: 'Launch RouterSploit console', explanation: 'Starts modular CLI shell.' }
    ],
    prerequisites: ['Python 3 runtime'],
    difficulty: 'Intermediate',
    relatedTools: ['metasploit'],
    officialDocsUrl: 'https://github.com/threat9/routersploit',
    defensiveUseCase: 'Auditing office routers and IP cameras for hardcoded administrative backdoors.',
    tags: ['iot', 'routers', 'embedded', 'firmware']
  },
  {
    id: 'crackmapexec',
    name: 'CrackMapExec (CME) / NetExec',
    category: 'exploitation',
    purpose: 'Swiss army knife for pentesting Active Directory environments.',
    shortDescription: 'Automates post-exploitation and credential testing in Active Directory networks.',
    description: 'CrackMapExec automates assessing the security of large Active Directory networks, probing SMB, WinRM, WMI, LDAP, and MSSQL, checking credentials without tripping noisy locks.',
    installationMethod: 'sudo apt install crackmapexec',
    syntax: 'crackmapexec <protocol> <target> [options]',
    parameterExplanations: [
      { param: 'smb <ip>', explanation: 'Audit SMB protocol on target.' },
      { param: '-u <user> -p <pass>', explanation: 'Validate credentials.' },
      { param: '--pass-the-hash', explanation: 'Authenticate using NTLM hash directly.' }
    ],
    safeCommands: [
      { command: 'crackmapexec smb 192.168.1.0/24', description: 'Enumerate SMB hosts', explanation: 'Discovers Windows machines and checks SMB signing status.' }
    ],
    prerequisites: ['Active Directory concepts'],
    difficulty: 'Advanced',
    relatedTools: ['impacket', 'bloodhound'],
    officialDocsUrl: 'https://github.com/Pennyw0rth/NetExec',
    defensiveUseCase: 'Enforcing SMB Signing and identifying workstations where local administrative credentials are reused.',
    tags: ['active directory', 'smb', 'windows', 'post exploitation']
  },
  {
    id: 'impacket',
    name: 'Impacket Library & Scripts',
    category: 'exploitation',
    purpose: 'Collection of Python classes for working with network protocols (SMB, Kerberos, MSRPC).',
    shortDescription: 'Core Python library implementing low-level Windows network protocols.',
    description: 'Impacket includes command-line scripts (secretsdump.py, psexec.py, wmiexec.py, GetNPUsers.py) to audit Windows network protocols, Kerberos tickets, and NTDS.dit hashes.',
    installationMethod: 'sudo apt install python3-impacket',
    syntax: 'python3 -m impacket.<script> [options]',
    parameterExplanations: [
      { param: 'secretsdump.py', explanation: 'Dump hashes from SAM or NTDS.dit.' },
      { param: 'GetNPUsers.py', explanation: 'Query AS-REP roasting eligible accounts.' }
    ],
    safeCommands: [
      { command: 'impacket-GetNPUsers domain.local/ -usersfile users.txt -format hashcat -no-pass', description: 'Audit AS-REP roasting vulnerability', explanation: 'Queries Kerberos KDC for accounts without Kerberos preauthentication required.' }
    ],
    prerequisites: ['Active Directory & Kerberos'],
    difficulty: 'Advanced',
    relatedTools: ['crackmapexec', 'bloodhound'],
    officialDocsUrl: 'https://github.com/fortra/impacket',
    defensiveUseCase: 'Enforcing Kerberos Preauthentication (Do not require Kerberos preauthentication = false) on all domain accounts.',
    tags: ['kerberos', 'impacket', 'as-rep', 'active directory']
  }
];
