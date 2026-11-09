import { KaliTool } from '../../types/cyber';

export const TOOLS_PART_3: KaliTool[] = [
  // ==========================================
  // 7. FORENSICS (20 Tools)
  // ==========================================
  {
    id: 'autopsy',
    name: 'Autopsy Forensic Browser',
    category: 'forensics_defense',
    purpose: 'Digital forensics platform and graphical interface to The Sleuth Kit.',
    shortDescription: 'The premier open-source digital forensics platform and case manager.',
    description: 'Used by law enforcement, military, and corporate investigators to investigate disk images (E01, RAW, VMDK), extract browser histories, carve deleted files, and correlate chronological timelines.',
    installationMethod: 'sudo apt install autopsy',
    syntax: 'autopsy &',
    parameterExplanations: [
      { param: 'GUI based', explanation: 'Launches case workspace on localhost:9999 or standalone Java UI.' }
    ],
    safeCommands: [
      { command: 'autopsy &', description: 'Launch Autopsy desktop GUI', explanation: 'Opens case manager for loading disk images and creating forensic timelines.' }
    ],
    prerequisites: ['Disk forensics basics'],
    difficulty: 'Intermediate',
    relatedTools: ['sleuthkit', 'volatility'],
    officialDocsUrl: 'https://www.autopsy.com/',
    defensiveUseCase: 'Corporate investigations into data exfiltration, insider threats, and ransomware post-mortems.',
    tags: ['disk forensics', 'sleuth kit', 'timeline', 'incident response']
  },
  {
    id: 'binwalk',
    name: 'Binwalk Firmware Analysis',
    category: 'forensics_defense',
    purpose: 'Firmware extraction, reverse engineering, and embedded file scanner.',
    shortDescription: 'Firmware extraction and embedded signature carving tool.',
    description: 'Searches a given binary image for embedded files and executable code using libmagic signature tables. Capable of carving SquashFS, cramfs, gzip, and kernel headers.',
    installationMethod: 'sudo apt install binwalk',
    syntax: 'binwalk [options] <firmware_file>',
    parameterExplanations: [
      { param: '-e', explanation: 'Automatically extract known file types.' },
      { param: '-M', explanation: 'Recursively scan extracted files.' }
    ],
    safeCommands: [
      { command: 'binwalk sample_firmware.bin', description: 'Scan binary signatures', explanation: 'Prints offsets of identified SquashFS and Linux kernel blobs.' }
    ],
    prerequisites: ['Binary signatures understanding'],
    difficulty: 'Intermediate',
    relatedTools: ['foremost', 'strings'],
    officialDocsUrl: 'https://github.com/ReFirmLabs/binwalk',
    defensiveUseCase: 'Auditing IoT devices and router firmware for hardcoded administrative credentials and backdoors.',
    tags: ['firmware', 'carving', 'embedded', 'iot']
  },
  {
    id: 'volatility',
    name: 'Volatility 3 Framework',
    category: 'forensics_defense',
    purpose: 'Advanced memory forensics framework for incident response and malware analysis.',
    shortDescription: 'World’s most widely used memory forensics framework for RAM triage.',
    description: 'Volatility allows investigators to analyze volatile RAM dumps from Windows, Linux, and macOS systems to recover running processes, open network sockets, DLLs, and injected shellcode.',
    installationMethod: 'sudo apt install volatility3 || pip install volatility3',
    syntax: 'vol -f <mem_dump> [plugin]',
    parameterExplanations: [
      { param: 'windows.pslist', explanation: 'List active processes in memory dump.' },
      { param: 'windows.netscan', explanation: 'Scan for open and terminated network connections.' },
      { param: 'windows.malfind', explanation: 'Detect injected DLLs and suspicious memory segments.' }
    ],
    safeCommands: [
      { command: 'vol -f memdump.raw windows.pslist', description: 'List processes in memory dump', explanation: 'Walks the EPROCESS active list from physical RAM image.' }
    ],
    prerequisites: ['Operating system internals'],
    difficulty: 'Advanced',
    relatedTools: ['autopsy'],
    officialDocsUrl: 'https://volatilityfoundation.org/',
    defensiveUseCase: 'SOC Incident Response investigations to uncover fileless malware and in-memory Cobalt Strike beacons.',
    tags: ['ram', 'memory forensics', 'incident response', 'blue team']
  },
  {
    id: 'foremost',
    name: 'Foremost File Carving',
    category: 'forensics_defense',
    purpose: 'Forensic program to recover lost files based on their headers and footers.',
    shortDescription: 'File carver recovering documents, images, and archives from raw disks.',
    description: 'Originally developed by the United States Air Force Office of Special Investigations, Foremost reads data stream headers, footers, and internal structures to carve out files.',
    installationMethod: 'sudo apt install foremost',
    syntax: 'foremost -i <image> -o <output_dir> [options]',
    parameterExplanations: [
      { param: '-i <file>', explanation: 'Input image file or drive partition.' },
      { param: '-o <dir>', explanation: 'Output directory for carved files.' },
      { param: '-t <types>', explanation: 'Comma-separated file types to carve (jpg, pdf, zip).' }
    ],
    safeCommands: [
      { command: 'foremost -t pdf,jpg -i disk.raw -o ./carved', description: 'Carve PDFs and JPEGs', explanation: 'Recovers deleted PDFs and pictures from disk image.' }
    ],
    prerequisites: ['File format headers understanding'],
    difficulty: 'Beginner',
    relatedTools: ['scalpel', 'binwalk'],
    officialDocsUrl: 'https://foremost.sourceforge.net/',
    defensiveUseCase: 'Digital forensics evidence recovery following unauthorized data wiping attempts.',
    tags: ['carving', 'recovery', 'headers', 'disk']
  },
  {
    id: 'sleuthkit',
    name: 'The Sleuth Kit (TSK)',
    category: 'forensics_defense',
    purpose: 'Collection of command-line tools to investigate volume and file system data.',
    shortDescription: 'Command-line filesystem forensic tools (fls, ils, mmls, blkstat).',
    description: 'TSK provides command-line tools (mmls, fls, fstat, icat, ils) that examine NTFS, FAT, Ext2/3/4, and HFS file systems directly at the raw block and inode layer.',
    installationMethod: 'sudo apt install sleuthkit',
    syntax: 'fls -r <disk_image>',
    parameterExplanations: [
      { param: 'mmls', explanation: 'Display partition layout of disk image.' },
      { param: 'fls', explanation: 'List directory entries including deleted files.' }
    ],
    safeCommands: [
      { command: 'mmls disk.raw', description: 'Display partition table', explanation: 'Shows partition layout and sector offsets.' }
    ],
    prerequisites: ['Filesystem structures (inodes, sectors)'],
    difficulty: 'Intermediate',
    relatedTools: ['autopsy'],
    officialDocsUrl: 'https://www.sleuthkit.org/',
    defensiveUseCase: 'Extracting unallocated inode blocks to reconstruct cyber incident timelines.',
    tags: ['filesystem', 'inodes', 'ntfs', 'ext4', 'raw disk']
  },
  {
    id: 'exiftool',
    name: 'ExifTool (Phil Harvey)',
    category: 'forensics_defense',
    purpose: 'Read, write, and manipulate metadata in images, PDFs, videos, and documents.',
    shortDescription: 'Extracts camera, GPS coordinates, author, and timestamp metadata.',
    description: 'ExifTool reads and edits EXIF, GPS, IPTC, and XMP metadata in images, PDFs, Office documents, audio, and video files, uncovering author identities and software versions.',
    installationMethod: 'sudo apt install libimage-exiftool-perl',
    syntax: 'exiftool [options] <file>',
    parameterExplanations: [
      { param: '-all=', explanation: 'Strip all metadata from file (sanitization).' },
      { param: '-gpslatitude', explanation: 'Extract specific GPS tag.' }
    ],
    safeCommands: [
      { command: 'exiftool sample.jpg', description: 'Inspect image metadata', explanation: 'Displays camera model, timestamps, and GPS tags.' }
    ],
    prerequisites: ['None'],
    difficulty: 'Beginner',
    relatedTools: ['strings'],
    officialDocsUrl: 'https://exiftool.org/',
    defensiveUseCase: 'Sanitizing public documents before publication to prevent leaking internal author usernames and software versions.',
    tags: ['exif', 'metadata', 'gps', 'privacy', 'sanitization']
  },
  {
    id: 'bulk-extractor',
    name: 'bulk_extractor',
    category: 'forensics_defense',
    purpose: 'Extract features like emails, credit card numbers, and URLs from raw media.',
    shortDescription: 'High-speed stream feature scanner extracting emails, URLs, and credit cards.',
    description: 'Scans disk images, files, or memory dumps without parsing filesystem structures, extracting email addresses, credit card numbers, URLs, and JSON blobs directly from raw bytes.',
    installationMethod: 'sudo apt install bulk-extractor',
    syntax: 'bulk_extractor -o <out_dir> <image>',
    parameterExplanations: [
      { param: '-o <dir>', explanation: 'Output directory for generated feature text files.' }
    ],
    safeCommands: [
      { command: 'bulk_extractor -o ./out_features disk.raw', description: 'Extract emails and domains', explanation: 'Parses raw media and outputs categorized feature files.' }
    ],
    prerequisites: ['Forensics concepts'],
    difficulty: 'Intermediate',
    relatedTools: ['foremost', 'strings'],
    officialDocsUrl: 'https://github.com/simsong/bulk_extractor',
    defensiveUseCase: 'Rapid triage during legal discovery and corporate intellectual property investigations.',
    tags: ['feature extraction', 'emails', 'pii', 'fast']
  },
  {
    id: 'pdfid',
    name: 'PDFiD (Didier Stevens)',
    category: 'forensics_defense',
    purpose: 'Scan PDF files to look for suspicious elements like /JavaScript and /EmbeddedFile.',
    shortDescription: 'Triage tool identifying malicious PDF streams and launch actions.',
    description: 'Scans a PDF file to look for suspicious elements such as /JavaScript, /JS, /Launch, and /EmbeddedFiles without executing any malicious code.',
    installationMethod: 'sudo apt install pdfid || pip install pdfid',
    syntax: 'pdfid <document.pdf>',
    parameterExplanations: [
      { param: '-e', explanation: 'Display extra information (entropy of streams).' }
    ],
    safeCommands: [
      { command: 'pdfid sample.pdf', description: 'Inspect PDF for malicious streams', explanation: 'Lists count of /JavaScript and /Launch tags in PDF.' }
    ],
    prerequisites: ['PDF file structure understanding'],
    difficulty: 'Beginner',
    relatedTools: ['pdf-parser', 'exiftool'],
    officialDocsUrl: 'https://blog.didierstevens.com/programs/pdf-tools/',
    defensiveUseCase: 'Email gateway attachment triage to block malicious PDFs containing weaponized JavaScript.',
    tags: ['pdf', 'malware triage', 'javascript', 'stream']
  },

  // ==========================================
  // 8. REVERSE ENGINEERING (18 Tools)
  // ==========================================
  {
    id: 'ghidra',
    name: 'Ghidra Software Reverse Engineering',
    category: 'reverse_engineering',
    purpose: 'NSA-developed SRE framework with advanced decompiler and disassembly.',
    shortDescription: 'NSA open-source software reverse engineering framework with decompiler.',
    description: 'Ghidra is a comprehensive software reverse engineering suite supporting x86, ARM, MIPS, and PowerPC with full decompilation into clean C-like pseudo-code, call graphs, and scripting.',
    installationMethod: 'sudo apt install ghidra',
    syntax: 'ghidraRun',
    parameterExplanations: [
      { param: 'GUI based', explanation: 'Operated through Java-based desktop graphical environment.' }
    ],
    safeCommands: [
      { command: 'ghidraRun', description: 'Launch Ghidra GUI', explanation: 'Opens workspace for importing ELF, PE, and Mach-O binaries.' }
    ],
    prerequisites: ['Assembly language (x86/ARM)', 'C programming'],
    difficulty: 'Intermediate',
    relatedTools: ['radare2', 'cutter', 'gdb'],
    officialDocsUrl: 'https://ghidra-sre.org/',
    defensiveUseCase: 'Malware analysis, identifying hardcoded credentials and unpatched buffer overflows in third-party firmware.',
    tags: ['decompiler', 'sre', 'malware analysis', 'assembly']
  },
  {
    id: 'radare2',
    name: 'Radare2 (r2)',
    category: 'reverse_engineering',
    purpose: 'Command-line reverse engineering framework and binary debugger.',
    shortDescription: 'Modular command-line binary analysis framework and debugger.',
    description: 'A modular binary analysis framework supporting disassembling, hex editing, debugging, and binary diffing from the terminal console without requiring a GUI.',
    installationMethod: 'sudo apt install radare2',
    syntax: 'r2 [options] <binary>',
    parameterExplanations: [
      { param: '-A', explanation: 'Run auto-analysis on all referenced functions (aaa).' },
      { param: '-d', explanation: 'Launch binary in interactive debugger mode.' }
    ],
    safeCommands: [
      { command: 'r2 -A suspicious_sample.bin', description: 'Analyze binary', explanation: 'Opens binary, disassembles functions, and parses symbol tables.' }
    ],
    prerequisites: ['Assembly language', 'Command line comfort'],
    difficulty: 'Advanced',
    relatedTools: ['ghidra', 'cutter'],
    officialDocsUrl: 'https://rada.re/n/',
    defensiveUseCase: 'Rapid headless triage of suspected malware binaries inside isolated sandbox environments.',
    tags: ['r2', 'debugger', 'assembly', 'cli', 'disassembly']
  },
  {
    id: 'gdb',
    name: 'GDB (GNU Project Debugger)',
    category: 'reverse_engineering',
    purpose: 'Allow you to see what is going on inside another program while it executes.',
    shortDescription: 'The standard Linux process debugger for C/C++ applications.',
    description: 'GDB allows security researchers to trace process execution instruction by instruction, inspect CPU registers, read stack frames, and set memory breakpoints to diagnose crashes and analyze exploits.',
    installationMethod: 'sudo apt install gdb',
    syntax: 'gdb [options] <executable>',
    parameterExplanations: [
      { param: '-q', explanation: 'Quiet mode: suppress copyright banner.' },
      { param: '--args', explanation: 'Pass arguments to target executable.' }
    ],
    safeCommands: [
      { command: 'gdb -q ./sample_binary', description: 'Open binary in debugger', explanation: 'Enters GDB interactive console for breakpoint analysis.' }
    ],
    prerequisites: ['x86/x64 assembly', 'Linux memory layout'],
    difficulty: 'Intermediate',
    relatedTools: ['radare2', 'edb-debugger'],
    officialDocsUrl: 'https://www.sourceware.org/gdb/',
    defensiveUseCase: 'Validating that crashes in proprietary daemons are not exploitable via stack overflow.',
    tags: ['debugger', 'linux', 'assembly', 'registers']
  },
  {
    id: 'apktool',
    name: 'Apktool',
    category: 'reverse_engineering',
    purpose: 'A tool for reverse engineering 3rd party, closed, binary Android apps.',
    shortDescription: 'Decodes Android APK resources and converts DEX to Smali assembly.',
    description: 'Apktool can decode Android resources to nearly original form (including AndroidManifest.xml, drawables, and layouts) and disassemble DEX bytecode into readable Smali assembly.',
    installationMethod: 'sudo apt install apktool',
    syntax: 'apktool [options] <action> <file.apk>',
    parameterExplanations: [
      { param: 'd <file.apk>', explanation: 'Decode APK into project directory.' },
      { param: 'b <dir>', explanation: 'Rebuild decoded directory back into an APK.' }
    ],
    safeCommands: [
      { command: 'apktool d sample_app.apk -o ./decoded', description: 'Decompile Android APK', explanation: 'Extracts AndroidManifest and Smali code for audit.' }
    ],
    prerequisites: ['Android app architecture knowledge'],
    difficulty: 'Intermediate',
    relatedTools: ['jadx', 'dex2jar'],
    officialDocsUrl: 'https://apktool.org/',
    defensiveUseCase: 'Auditing mobile banking applications to verify that sensitive API keys are not hardcoded in client manifests.',
    tags: ['android', 'apk', 'mobile', 'smali']
  },
  {
    id: 'jadx',
    name: 'JADX (Dex to Java Decompiler)',
    category: 'reverse_engineering',
    purpose: 'Command line and GUI tools for producing Java source code from Android Dex and Apk files.',
    shortDescription: 'Decompiles Android APK and DEX bytecode directly into Java source code.',
    description: 'JADX takes compiled Android DEX/APK/AAB packages and reconstructs readable Java source code with cross-references, syntax highlighting, and deobfuscation renaming.',
    installationMethod: 'sudo apt install jadx',
    syntax: 'jadx [options] <input_file>',
    parameterExplanations: [
      { param: '-d <dir>', explanation: 'Output directory for decompiled Java source.' },
      { param: '--show-bad-code', explanation: 'Show code with inconsistent control flow.' }
    ],
    safeCommands: [
      { command: 'jadx-gui &', description: 'Launch JADX GUI', explanation: 'Opens interactive Java decompiler desktop application.' }
    ],
    prerequisites: ['Java and Android concepts'],
    difficulty: 'Beginner',
    relatedTools: ['apktool', 'dex2jar'],
    officialDocsUrl: 'https://github.com/skylot/jadx',
    defensiveUseCase: 'Auditing third-party Android SDKs for unauthorized telemetry and data leakage.',
    tags: ['java', 'android', 'decompiler', 'gui']
  },
  {
    id: 'strings',
    name: 'strings',
    category: 'reverse_engineering',
    purpose: 'Find printable strings in object, binary, or other files.',
    shortDescription: 'Extracts printable ASCII and Unicode strings from binary files.',
    description: 'Prints the sequences of printable characters in files of at least 4 characters long. An indispensable first step in static malware triage to discover IP addresses, URLs, and commands.',
    installationMethod: 'sudo apt install binutils',
    syntax: 'strings [options] <file>',
    parameterExplanations: [
      { param: '-n <len>', explanation: 'Specify minimum string length (default: 4).' },
      { param: '-a', explanation: 'Scan entire file, not just data sections.' }
    ],
    safeCommands: [
      { command: 'strings -n 8 suspicious.bin | grep -i http', description: 'Extract URLs from binary', explanation: 'Quickly locates hardcoded web addresses.' }
    ],
    prerequisites: ['None'],
    difficulty: 'Beginner',
    relatedTools: ['binwalk', 'radare2'],
    officialDocsUrl: 'https://www.kali.org/tools/binutils/',
    defensiveUseCase: 'Immediate static triage of suspected malware payloads to identify C2 domains.',
    tags: ['strings', 'static analysis', 'binutils', 'triage']
  },

  // ==========================================
  // 9. SNIFFING & SPOOFING (18 Tools)
  // ==========================================
  {
    id: 'wireshark',
    name: 'Wireshark Protocol Analyzer',
    category: 'sniffing_spoofing',
    purpose: 'World’s foremost network protocol analyzer with deep packet inspection.',
    shortDescription: 'The de-facto standard packet analyzer with deep inspection of 2,000+ protocols.',
    description: 'Wireshark lets you see what is happening on your network at a microscopic level. It is the standard across commercial and non-profit enterprises, government agencies, and educational institutions.',
    installationMethod: 'sudo apt install wireshark',
    syntax: 'wireshark [options] &',
    parameterExplanations: [
      { param: '-r <file>', explanation: 'Read and display specified PCAP file.' },
      { param: '-i <iface>', explanation: 'Specify capture network interface.' }
    ],
    safeCommands: [
      { command: 'tshark -r capture.pcap -Y "http.request" -T fields -e http.host', description: 'Filter HTTP hosts', explanation: 'Extracts requested domains from authorized capture.' }
    ],
    prerequisites: ['TCP/IP protocol stack'],
    difficulty: 'Intermediate',
    relatedTools: ['tshark', 'tcpdump'],
    officialDocsUrl: 'https://www.wireshark.org/docs/',
    defensiveUseCase: 'Network troubleshooting, malware command-and-control beacon detection, and incident response.',
    tags: ['pcap', 'packet capture', 'wireshark', 'blue team', 'protocol analysis']
  },
  {
    id: 'tcpdump',
    name: 'tcpdump',
    category: 'sniffing_spoofing',
    purpose: 'Lightweight, command-line network packet sniffer.',
    shortDescription: 'Lightweight command-line packet capture and protocol analyzer.',
    description: 'tcpdump prints descriptions of the contents of packets on a network interface that match boolean expressions, recording raw PCAPs for offline inspection.',
    installationMethod: 'sudo apt install tcpdump',
    syntax: 'tcpdump [options] [expression]',
    parameterExplanations: [
      { param: '-i <iface>', explanation: 'Specify network interface.' },
      { param: '-nn', explanation: 'Do not resolve hostnames or port names to save CPU and prevent DNS leaks.' },
      { param: '-w <file.pcap>', explanation: 'Write captured frames to file.' }
    ],
    safeCommands: [
      { command: 'tcpdump -i lo -nn port 3000', description: 'Sniff local application traffic', explanation: 'Monitors loopback traffic on port 3000.' }
    ],
    prerequisites: ['Root privileges', 'BPF syntax'],
    difficulty: 'Beginner',
    relatedTools: ['wireshark', 'tshark'],
    officialDocsUrl: 'https://www.tcpdump.org/',
    defensiveUseCase: 'Server-side packet captures on headless Linux servers where no GUI is available.',
    tags: ['pcap', 'tcpdump', 'bpf', 'sniffer', 'cli']
  },
  {
    id: 'bettercap',
    name: 'Bettercap',
    category: 'sniffing_spoofing',
    purpose: 'Swiss army knife for 802.11, BLE, and Ethernet reconnaissance and MITM attacks.',
    shortDescription: 'Modular, portable framework for network reconnaissance and MITM auditing.',
    description: 'Bettercap is a powerful, easily extensible tool to create Man-in-the-Middle (MitM) testing environments, audit ARP spoofing, DNS spoofing, BLE advertising, and Wi-Fi handshakes.',
    installationMethod: 'sudo apt install bettercap',
    syntax: 'bettercap [options]',
    parameterExplanations: [
      { param: '-iface <iface>', explanation: 'Network interface to bind.' },
      { param: '-eval <cmd>', explanation: 'Execute caplet commands on startup.' }
    ],
    safeCommands: [
      { command: 'bettercap -eval "net.probe on; net.show; exit"', description: 'Map local LAN nodes', explanation: 'Actively probes ARP on local network and prints discovered hosts.' }
    ],
    prerequisites: ['Networking protocols', 'Root access'],
    difficulty: 'Advanced',
    relatedTools: ['ettercap', 'wireshark'],
    officialDocsUrl: 'https://www.bettercap.org/',
    defensiveUseCase: 'Enforcing Dynamic ARP Inspection (DAI) and 802.1X Network Access Control (NAC).',
    tags: ['mitm', 'arp', 'recon', 'bettercap', 'network']
  },
  {
    id: 'macchanger',
    name: 'macchanger',
    category: 'sniffing_spoofing',
    purpose: 'View and manipulate MAC addresses of network interfaces.',
    shortDescription: 'Changes network adapter MAC address for privacy and auditing.',
    description: 'Utility for GNU/Linux that changes the MAC address of network interfaces. Can set random MACs, match specific vendor prefixes, or reset to factory hardware burned-in address (BIA).',
    installationMethod: 'sudo apt install macchanger',
    syntax: 'macchanger [options] <device>',
    parameterExplanations: [
      { param: '-s <device>', explanation: 'Show current and permanent MAC address.' },
      { param: '-r <device>', explanation: 'Set fully random MAC address.' },
      { param: '-p <device>', explanation: 'Reset to original permanent hardware MAC address.' }
    ],
    safeCommands: [
      { command: 'macchanger -s eth0', description: 'Display current MAC address', explanation: 'Queries network interface for hardware address.' }
    ],
    prerequisites: ['Root privileges'],
    difficulty: 'Beginner',
    relatedTools: ['ip', 'ifconfig'],
    officialDocsUrl: 'https://www.kali.org/tools/macchanger/',
    defensiveUseCase: 'Testing Port Security sticky MAC address shutdown mechanisms on enterprise switches.',
    tags: ['mac address', 'privacy', 'ethernet']
  },
  {
    id: 'responder',
    name: 'Responder (LLMNR / NBT-NS Poisoner)',
    category: 'sniffing_spoofing',
    purpose: 'LLMNR, NBT-NS, and MDNS poisoner, with built-in rogue authentication servers.',
    shortDescription: 'Poisons unauthenticated NetBIOS/LLMNR requests to audit Windows credentials.',
    description: 'Responder is an LLMNR, NBT-NS, and MDNS poisoner with built-in rogue authentication servers (SMB, HTTP, LDAP, FTP) designed to capture NetNTLMv1/v2 password hashes on broadcast domains.',
    installationMethod: 'sudo apt install responder',
    syntax: 'sudo responder -I <interface> [options]',
    parameterExplanations: [
      { param: '-I <iface>', explanation: 'Network interface to listen on.' },
      { param: '-A', explanation: 'Analyze mode: passively listen without sending poison responses.' }
    ],
    safeCommands: [
      { command: 'sudo responder -I eth0 -A', description: 'Analyze mode (passive)', explanation: 'Passively monitors LLMNR and NetBIOS broadcast noise without answering.' }
    ],
    prerequisites: ['Active Directory and Windows networking'],
    difficulty: 'Advanced',
    relatedTools: ['impacket', 'crackmapexec'],
    officialDocsUrl: 'https://github.com/SpiderLabs/Responder',
    defensiveUseCase: 'Proving why corporate group policy must disable Link-Local Multicast Name Resolution (LLMNR) and NetBIOS over TCP/IP.',
    tags: ['llmnr', 'netbios', 'active directory', 'ntlm']
  },

  // ==========================================
  // 10. REPORTING & DOCUMENTATION (10 Tools)
  // ==========================================
  {
    id: 'dradis',
    name: 'Dradis Community Edition',
    category: 'reporting',
    purpose: 'Collaboration and reporting platform for information security teams.',
    shortDescription: 'Collaborative penetration testing management and automated reporting portal.',
    description: 'Dradis is an open-source collaboration framework for info-sec teams. It imports output from Nmap, Nessus, Burp Suite, and Qualys, allowing teams to collaborate on findings and generate PDF/Word reports.',
    installationMethod: 'sudo apt install dradis',
    syntax: 'dradis',
    parameterExplanations: [
      { param: 'Web portal', explanation: 'Runs on localhost:3000 with multi-user workspace management.' }
    ],
    safeCommands: [
      { command: 'dradis', description: 'Start Dradis server', explanation: 'Launches collaborative reporting portal on localhost:3000.' }
    ],
    prerequisites: ['Ruby on Rails runtime'],
    difficulty: 'Intermediate',
    relatedTools: ['faraday'],
    officialDocsUrl: 'https://dradisframework.com/ce/',
    defensiveUseCase: 'Standardizing vulnerability remediation reporting for engineering and compliance audits.',
    tags: ['reporting', 'collaboration', 'findings', 'documentation']
  },
  {
    id: 'eyewitness',
    name: 'EyeWitness',
    category: 'reporting',
    purpose: 'Take screenshots of websites, provide server header info, and identify default creds.',
    shortDescription: 'Automated website screenshot capture and visual triage reporter.',
    description: 'EyeWitness takes screenshots of target websites, provides server header information, and identifies default credentials to help security teams triage hundreds of web assets visually.',
    installationMethod: 'sudo apt install eyewitness',
    syntax: 'eyewitness -f <urls.txt> --web [options]',
    parameterExplanations: [
      { param: '-f <file>', explanation: 'File containing URLs to audit.' },
      { param: '--web', explanation: 'Take web screenshots using headless browser.' }
    ],
    safeCommands: [
      { command: 'eyewitness --single https://example.com --web', description: 'Capture screenshot of target', explanation: 'Generates report showing rendered web page and response headers.' }
    ],
    prerequisites: ['Python runtime'],
    difficulty: 'Beginner',
    relatedTools: ['gowitness', 'httpx-pd'],
    officialDocsUrl: 'https://github.com/RedSiege/EyeWitness',
    defensiveUseCase: 'Quick visual verification of entire enterprise IP ranges to locate rogue administration interfaces.',
    tags: ['screenshots', 'reporting', 'web triage']
  },
  {
    id: 'faraday',
    name: 'Faraday Security IDE',
    category: 'reporting',
    purpose: 'Collaborative penetration test and vulnerability management platform.',
    shortDescription: 'Multi-user vulnerability management platform aggregating terminal commands.',
    description: 'Faraday maps security data into a single collaborative dashboard, automatically tracking terminal commands and tool outputs (Nmap, sqlmap, zap) in real time.',
    installationMethod: 'sudo apt install faraday',
    syntax: 'faraday-server',
    parameterExplanations: [
      { param: 'faraday-server', explanation: 'Start background PostgreSQL API server and web UI.' }
    ],
    safeCommands: [
      { command: 'faraday-server &', description: 'Start Faraday platform', explanation: 'Launches collaboration server.' }
    ],
    prerequisites: ['PostgreSQL'],
    difficulty: 'Intermediate',
    relatedTools: ['dradis'],
    officialDocsUrl: 'https://faradaysec.com/',
    defensiveUseCase: 'Consolidating findings across multi-analyst security audit teams.',
    tags: ['ide', 'reporting', 'vulnerability management']
  },

  // ==========================================
  // 11. OSINT & ATTACK SURFACE (20 Tools)
  // ==========================================
  {
    id: 'spiderfoot',
    name: 'SpiderFoot OSINT Automation',
    category: 'osint',
    purpose: 'Open-source intelligence automation tool querying 200+ public sources.',
    shortDescription: 'Automates OSINT data collection across 200+ public databases and threat feeds.',
    description: 'SpiderFoot automates the gathering of intelligence about target domains, IP addresses, CIDR blocks, and email addresses from public sources, certificate logs, Shodan, and blocklists.',
    installationMethod: 'sudo apt install spiderfoot',
    syntax: 'spiderfoot -l 127.0.0.1:5001',
    parameterExplanations: [
      { param: '-l <ip:port>', explanation: 'Web server interface.' },
      { param: '-s <target>', explanation: 'Run CLI scan on target.' }
    ],
    safeCommands: [
      { command: 'spiderfoot -l 127.0.0.1:5001', description: 'Start SpiderFoot Web UI', explanation: 'Opens interactive OSINT dashboard on port 5001.' }
    ],
    prerequisites: ['Python 3'],
    difficulty: 'Beginner',
    relatedTools: ['theharvester', 'recon-ng', 'amass'],
    officialDocsUrl: 'https://www.spiderfoot.net/',
    defensiveUseCase: 'Threat intelligence monitoring to discover credential leaks and corporate domain impersonation.',
    tags: ['osint', 'automation', 'threat intelligence', 'footprinting']
  },
  {
    id: 'sherlock',
    name: 'Sherlock (Social Media OSINT)',
    category: 'osint',
    purpose: 'Hunt down social media accounts by username across 400+ social networks.',
    shortDescription: 'Searches for target usernames across hundreds of social networks.',
    description: 'Sherlock takes a username string and probes social networks, code repositories, and forums to determine where that username is registered, returning direct profile URLs.',
    installationMethod: 'sudo apt install sherlock || pip install sherlock-project',
    syntax: 'sherlock <username> [options]',
    parameterExplanations: [
      { param: '--timeout <sec>', explanation: 'HTTP request timeout threshold.' },
      { param: '--csv', explanation: 'Save discovered profiles in CSV format.' }
    ],
    safeCommands: [
      { command: 'sherlock testuser1234 --timeout 5', description: 'Search username', explanation: 'Queries public social networks for profile matches.' }
    ],
    prerequisites: ['Python 3 runtime'],
    difficulty: 'Beginner',
    relatedTools: ['theharvester', 'holehe'],
    officialDocsUrl: 'https://sherlock-project.github.io/',
    defensiveUseCase: 'Brand protection investigations to detect fraudulent executive impersonation accounts.',
    tags: ['osint', 'social media', 'usernames', 'investigation']
  },
  {
    id: 'shodan-cli',
    name: 'Shodan CLI',
    category: 'osint',
    purpose: 'Search engine for Internet-connected devices command line interface.',
    shortDescription: 'Queries the Shodan database for exposed servers, IoT devices, and ports.',
    description: 'Allows querying Shodan’s database of Internet-connected devices from the terminal, retrieving host IP information, open ports, SSL banners, and known CVE exposures.',
    installationMethod: 'pip install shodan',
    syntax: 'shodan [command] [options]',
    parameterExplanations: [
      { param: 'init <api_key>', explanation: 'Initialize CLI with user API key.' },
      { param: 'host <ip>', explanation: 'Inspect recorded telemetry for specific IP.' }
    ],
    safeCommands: [
      { command: 'shodan host 8.8.8.8', description: 'Query IP telemetry', explanation: 'Pulls open port history and banners from Shodan database without sending a packet.' }
    ],
    prerequisites: ['Shodan API Key'],
    difficulty: 'Beginner',
    relatedTools: ['censys-cli'],
    officialDocsUrl: 'https://cli.shodan.io/',
    defensiveUseCase: 'Passive internet asset exposure verification to discover shadow IT and exposed database ports.',
    tags: ['shodan', 'osint', 'passive', 'iot', 'banners']
  },
  {
    id: 'trufflehog',
    name: 'TruffleHog Secrets Scanner',
    category: 'osint',
    purpose: 'Find credentials and high-entropy secrets in Git repositories and filesystems.',
    shortDescription: 'Detects leaked API keys, private certificates, and credentials in Git history.',
    description: 'Searches Git repositories, filesystems, and S3 buckets for over 800 types of credentials (AWS keys, Slack tokens, private RSA keys, database passwords) using regex and live verification.',
    installationMethod: 'sudo apt install trufflehog',
    syntax: 'trufflehog [git|filesystem] <target> [options]',
    parameterExplanations: [
      { param: 'git <url>', explanation: 'Scan entire Git commit history.' },
      { param: 'filesystem <path>', explanation: 'Scan local files.' }
    ],
    safeCommands: [
      { command: 'trufflehog filesystem .', description: 'Scan current workspace for secrets', explanation: 'Checks files for unencrypted secrets and private keys.' }
    ],
    prerequisites: ['Git basics'],
    difficulty: 'Beginner',
    relatedTools: ['gitleaks'],
    officialDocsUrl: 'https://trufflesecurity.com/trufflehog',
    defensiveUseCase: 'Preventing developers from committing production credentials into public GitHub repositories.',
    tags: ['secrets', 'git', 'credentials', 'devsecops']
  },

  // ==========================================
  // 12. DEFENSIVE SECURITY & HARDENING (18 Tools)
  // ==========================================
  {
    id: 'ufw',
    name: 'UFW (Uncomplicated Firewall)',
    category: 'defensive_security',
    purpose: 'Program for managing a netfilter firewall designed to be easy to use.',
    shortDescription: 'Standard Linux host-based firewall manager for iptables.',
    description: 'UFW provides an intuitive command-line interface for managing iptables and nftables packet filtering rules, allowing administrators to configure host-based allow/deny policies with ease.',
    installationMethod: 'sudo apt install ufw',
    syntax: 'sudo ufw [command]',
    parameterExplanations: [
      { param: 'status verbose', explanation: 'Display active firewall state and numbered rules.' },
      { param: 'allow <port>', explanation: 'Allow incoming traffic on specific port.' },
      { param: 'deny <port>', explanation: 'Block incoming traffic on specific port.' }
    ],
    safeCommands: [
      { command: 'sudo ufw status', description: 'Check firewall status', explanation: 'Inspects if local firewall is active and lists configured rules.' }
    ],
    prerequisites: ['Root privileges', 'TCP/IP understanding'],
    difficulty: 'Beginner',
    relatedTools: ['iptables', 'nftables'],
    officialDocsUrl: 'https://launchpad.net/ufw',
    defensiveUseCase: 'Enforcing default-deny incoming host firewalls on all production Linux servers.',
    tags: ['firewall', 'ufw', 'hardening', 'defense']
  },
  {
    id: 'iptables',
    name: 'iptables / nftables',
    category: 'defensive_security',
    purpose: 'Kernel packet filter and NAT controller for Linux operating systems.',
    shortDescription: 'Direct Linux kernel packet filtering and stateful firewall engine.',
    description: 'The core Linux kernel packet filtering subsystem allowing stateful inspection of IP packets across INPUT, FORWARD, and OUTPUT chains, supporting rate-limiting and connection tracking.',
    installationMethod: 'sudo apt install iptables',
    syntax: 'sudo iptables -L [options]',
    parameterExplanations: [
      { param: '-L -n -v', explanation: 'List rules with numeric IP/port output and packet counters.' },
      { param: '-A INPUT', explanation: 'Append rule to incoming packet chain.' }
    ],
    safeCommands: [
      { command: 'sudo iptables -L -n -v', description: 'List active firewall rules', explanation: 'Displays packet counts and filtering chains.' }
    ],
    prerequisites: ['Root access', 'Kernel networking knowledge'],
    difficulty: 'Intermediate',
    relatedTools: ['ufw', 'nftables'],
    officialDocsUrl: 'https://netfilter.org/',
    defensiveUseCase: 'Implementing micro-segmentation and dropping unauthorized port scanning probes.',
    tags: ['firewall', 'kernel', 'packet filter', 'defense']
  },
  {
    id: 'fail2ban',
    name: 'Fail2ban Intrusion Prevention',
    category: 'defensive_security',
    purpose: 'Scan log files and ban IP addresses that show malicious signs like brute-force.',
    shortDescription: 'Log monitor dynamically banning IPs exhibiting brute-force behavior.',
    description: 'Fail2ban monitors system logs (SSH, Nginx, Postfix) for brute-force patterns and dynamically updates firewall rules (iptables/UFW) to temporarily or permanently ban offending IP addresses.',
    installationMethod: 'sudo apt install fail2ban',
    syntax: 'sudo fail2ban-client [command]',
    parameterExplanations: [
      { param: 'status', explanation: 'Display active monitoring jails.' },
      { param: 'status sshd', explanation: 'Display banned IP addresses for SSH.' }
    ],
    safeCommands: [
      { command: 'sudo fail2ban-client status', description: 'Check monitoring status', explanation: 'Shows active jails and current banned count.' }
    ],
    prerequisites: ['Syslog awareness', 'Root access'],
    difficulty: 'Intermediate',
    relatedTools: ['ufw', 'suricata'],
    officialDocsUrl: 'https://www.fail2ban.org/',
    defensiveUseCase: 'Neutralizing automated credential stuffing and dictionary attacks on public SSH ports.',
    tags: ['brute force defense', 'fail2ban', 'log monitor', 'ips']
  },
  {
    id: 'suricata',
    name: 'Suricata Network IDS/IPS Engine',
    category: 'defensive_security',
    purpose: 'High performance Network Threat Detection and Intrusion Prevention engine.',
    shortDescription: 'Multi-threaded network IDS, IPS, and network security monitoring engine.',
    description: 'Suricata is an open-source, multi-threaded Network Threat Detection engine capable of real-time Intrusion Detection (IDS), inline Intrusion Prevention (IPS), and network security monitoring (NSM).',
    installationMethod: 'sudo apt install suricata',
    syntax: 'suricata -c <config> -i <interface> [options]',
    parameterExplanations: [
      { param: '-i <iface>', explanation: 'Monitor interface in live capture mode.' },
      { param: '-r <pcap>', explanation: 'Run rules against pre-recorded PCAP file.' }
    ],
    safeCommands: [
      { command: 'suricata --build-info', description: 'Verify build capabilities', explanation: 'Displays compiled acceleration features and supported protocols.' }
    ],
    prerequisites: ['Snort rule syntax', 'Network architecture'],
    difficulty: 'Advanced',
    relatedTools: ['snort', 'zeek'],
    officialDocsUrl: 'https://suricata.io/',
    defensiveUseCase: 'Detecting network lateral movement, Cobalt Strike command-and-control beacons, and CVE exploit attempts.',
    tags: ['ids', 'ips', 'nsm', 'network defense', 'suricata']
  },
  {
    id: 'snort',
    name: 'Snort 3 Intrusion Detection System',
    category: 'defensive_security',
    purpose: 'Open source network intrusion detection and prevention system.',
    shortDescription: 'The reference network intrusion detection system using rule-based signatures.',
    description: 'Snort performs real-time traffic analysis and packet logging on IP networks, protocol analysis, content searching/matching, and detects buffer overflows, stealth port scans, and OS fingerprinting.',
    installationMethod: 'sudo apt install snort',
    syntax: 'snort -c <rules_file> [options]',
    parameterExplanations: [
      { param: '-T', explanation: 'Test configuration file syntax without capturing traffic.' },
      { param: '-A console', explanation: 'Output alert alerts directly to terminal console.' }
    ],
    safeCommands: [
      { command: 'snort -V', description: 'Display Snort engine version', explanation: 'Validates installation and signature engine.' }
    ],
    prerequisites: ['IDS rules understanding'],
    difficulty: 'Intermediate',
    relatedTools: ['suricata', 'zeek'],
    officialDocsUrl: 'https://www.snort.org/',
    defensiveUseCase: 'Formulating precise detection signatures to alert on zero-day network exploit attempts.',
    tags: ['ids', 'snort', 'rule engine', 'blue team']
  },
  {
    id: 'zeek',
    name: 'Zeek Network Security Monitor (Bro)',
    category: 'defensive_security',
    purpose: 'Powerful network analysis framework converting raw packets into structured logs.',
    shortDescription: 'Transforms network traffic into structured, queryable behavioral logs.',
    description: 'Zeek converts raw network packets into structured logs (conn.log, http.log, dns.log, ssl.log), tracking application-layer protocol transactions for threat hunting and incident response.',
    installationMethod: 'sudo apt install zeek',
    syntax: 'zeek [options] -r <pcap_file>',
    parameterExplanations: [
      { param: '-r <pcap>', explanation: 'Parse PCAP file and output TSV logs.' }
    ],
    safeCommands: [
      { command: 'zeek -r sample.pcap', description: 'Analyze PCAP and generate protocol logs', explanation: 'Creates conn.log and dns.log for forensic inspection.' }
    ],
    prerequisites: ['Network security monitoring concepts'],
    difficulty: 'Advanced',
    relatedTools: ['suricata', 'wireshark'],
    officialDocsUrl: 'https://zeek.org/',
    defensiveUseCase: 'Enterprise threat hunting and SIEM correlation without storing massive full-packet PCAPs.',
    tags: ['nsm', 'zeek', 'logs', 'threat hunting']
  },
  {
    id: 'clamav',
    name: 'ClamAV Antivirus',
    category: 'defensive_security',
    purpose: 'Open-source antivirus engine for detecting trojans, viruses, and malware.',
    shortDescription: 'Open-source antivirus engine auditing files and email attachments.',
    description: 'An open-source antivirus engine designed for email scanning on mail gateways and file server audits. Supports on-access scanning, automatic signature updates (freshclam), and file archives.',
    installationMethod: 'sudo apt install clamav',
    syntax: 'clamscan [options] <path>',
    parameterExplanations: [
      { param: '-r', explanation: 'Scan directory recursively.' },
      { param: '-i', explanation: 'Output only infected files.' }
    ],
    safeCommands: [
      { command: 'clamscan --version', description: 'Check antivirus engine', explanation: 'Validates ClamAV signature engine status.' }
    ],
    prerequisites: ['Basic Linux permissions'],
    difficulty: 'Beginner',
    relatedTools: ['yara'],
    officialDocsUrl: 'https://www.clamav.net/',
    defensiveUseCase: 'Scanning user-uploaded files on web applications before storing them in cloud object storage.',
    tags: ['antivirus', 'malware scanner', 'email security']
  },
  {
    id: 'auditd',
    name: 'auditd (Linux Audit Daemon)',
    category: 'defensive_security',
    purpose: 'Kernel-level logging of security events and system calls on Linux.',
    shortDescription: 'Kernel subsystem tracking file modifications, process executions, and logins.',
    description: 'The Linux Audit Daemon monitors system calls, file modifications (e.g. tracking who touched /etc/shadow or /etc/sudoers), and user logins at the kernel level for compliance and forensic auditing.',
    installationMethod: 'sudo apt install auditd',
    syntax: 'sudo auditctl [options]',
    parameterExplanations: [
      { param: '-w <path> -p wa', explanation: 'Watch file path for write and attribute changes.' },
      { param: '-l', explanation: 'List active kernel audit rules.' }
    ],
    safeCommands: [
      { command: 'sudo auditctl -l', description: 'List active audit rules', explanation: 'Displays active kernel watch rules.' }
    ],
    prerequisites: ['Root privileges', 'Kernel concepts'],
    difficulty: 'Intermediate',
    relatedTools: ['lynis'],
    officialDocsUrl: 'https://www.kali.org/tools/auditd/',
    defensiveUseCase: 'Mandatory PCI-DSS and SOC 2 auditing of privileged user actions on production systems.',
    tags: ['kernel audit', 'auditd', 'compliance', 'file integrity']
  }
];
