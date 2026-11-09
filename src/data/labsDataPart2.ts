import { PracticeLab } from '../types/cyber';

export const PRACTICE_LABS_PART2: PracticeLab[] = [
  {
    id: 'lab-11-linux-cron-privesc',
    title: 'Lab 11: Linux Scheduled Tasks & Cron Job Privilege Escalation',
    category: 'Linux Privilege & Auditing',
    difficulty: 'Intermediate',
    estimatedMinutes: 20,
    xpReward: 250,
    overview: 'Inspect system-wide cron jobs in /etc/crontab. Discover a backup script running as root with insecure world-writable permissions, modify the script safely, and read the administrative verification flag.',
    authorizationNotice: 'Authorized Simulation: Low-privilege user trainee.',
    targetEnvironment: 'Virtual OS: Linux Debian 12 [User: trainee]',
    objectives: [
      { id: 'obj-1', title: 'Inspect /etc/crontab for root-scheduled tasks' },
      { id: 'obj-2', title: 'Check permissions on /usr/local/bin/cleanup.sh' },
      { id: 'obj-3', title: 'Execute simulated task to capture the root audit flag' }
    ],
    hints: ['Run: cat /etc/crontab', 'Check file permissions: ls -l /usr/local/bin/cleanup.sh'],
    flag: 'FLAG{insecure_cron_permissions_remediated_2026}',
    simulatedTerminal: {
      initialPrompt: 'trainee@kali-sandbox:~$',
      availableCommands: {
        'help': 'Commands: cat <file>, ls -la <path>, /usr/local/bin/cleanup.sh, clear',
        'cat /etc/crontab': `SHELL=/bin/sh
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
* * * * * root /usr/local/bin/cleanup.sh`,
        'ls -la /usr/local/bin/cleanup.sh': '-rwxrwxrwx 1 root root 142 Nov 07 12:00 /usr/local/bin/cleanup.sh',
        'cat /usr/local/bin/cleanup.sh': `#!/bin/bash
# System cleanup routine
echo "Cleaning temp directories..."
# Audit flag available for system integrity:
echo "FLAG{insecure_cron_permissions_remediated_2026}" > /tmp/cron_audit.flag`,
        '/usr/local/bin/cleanup.sh': `Cleaning temp directories...
[Root Execution Verified]: FLAG{insecure_cron_permissions_remediated_2026}`,
        'cat /tmp/cron_audit.flag': 'FLAG{insecure_cron_permissions_remediated_2026}'
      }
    },
    defensiveTakeaway: 'Ensure all scripts referenced in crontabs are owned by root and have strict file permissions (chmod 700 or 755), never 777.'
  },
  {
    id: 'lab-12-dns-zone-transfer-axfr',
    title: 'Lab 12: DNS Reconnaissance & Misconfigured AXFR Zone Transfer',
    category: 'Network Reconnaissance',
    difficulty: 'Beginner',
    estimatedMinutes: 15,
    xpReward: 200,
    overview: 'An authoritative enterprise nameserver is misconfigured to permit unrestricted DNS zone transfers (AXFR). Use dig to dump the entire internal DNS zone and uncover hidden staging and admin hostnames.',
    authorizationNotice: 'Authorized DNS Intelligence Simulation.',
    targetEnvironment: 'Nameserver: ns1.corp-internal.lab [IP: 192.168.1.53]',
    objectives: [
      { id: 'obj-1', title: 'Query nameserver for SOA record using dig' },
      { id: 'obj-2', title: 'Execute full zone transfer with dig AXFR' },
      { id: 'obj-3', title: 'Locate TXT verification record containing flag' }
    ],
    hints: ['Run: dig @192.168.1.53 corp-internal.lab AXFR'],
    flag: 'FLAG{dns_axfr_restrict_to_secondary_nameservers}',
    simulatedTerminal: {
      initialPrompt: 'analyst@kali-sandbox:~$',
      availableCommands: {
        'help': 'Commands: dig <options>, nslookup <domain>, clear',
        'dig @192.168.1.53 corp-internal.lab SOA': `;; ANSWER SECTION:
corp-internal.lab.    3600    IN    SOA    ns1.corp-internal.lab. admin.corp-internal.lab. 2026110701 3600 1800 604800 86400`,
        'dig @192.168.1.53 corp-internal.lab AXFR': `; <<>> DiG 9.18 <<>> @192.168.1.53 corp-internal.lab AXFR
corp-internal.lab.    3600 IN SOA ns1.corp-internal.lab. admin.corp-internal.lab. 2026110701 3600 1800 604800 86400
corp-internal.lab.    3600 IN NS  ns1.corp-internal.lab.
gw.corp-internal.lab. 3600 IN A   192.168.1.1
dc.corp-internal.lab. 3600 IN A   192.168.1.10
dev.corp-internal.lab 3600 IN A   192.168.1.42
audit.corp-internal.lab. 3600 IN TXT "FLAG{dns_axfr_restrict_to_secondary_nameservers}"
corp-internal.lab.    3600 IN SOA ns1.corp-internal.lab. admin.corp-internal.lab. 2026110701 3600 1800 604800 86400`
      }
    },
    defensiveTakeaway: 'Always configure `allow-transfer { none; };` or restrict AXFR transfers specifically to trusted secondary nameserver IP addresses in BIND/named configuration.'
  },
  {
    id: 'lab-13-smb-null-session-enumeration',
    title: 'Lab 13: Windows SMB Null Session & Anonymous Share Enumeration',
    category: 'Network Reconnaissance',
    difficulty: 'Intermediate',
    estimatedMinutes: 20,
    xpReward: 250,
    overview: 'Audit an internal file server running Samba/SMB on port 445. Test for unauthenticated null session access using smbclient to discover an unsecured network share containing compliance documentation.',
    authorizationNotice: 'Authorized Internal Audit Simulation.',
    targetEnvironment: 'SMB Host: 192.168.1.25 [Simulated File Server]',
    objectives: [
      { id: 'obj-1', title: 'List available SMB shares anonymously with smbclient -L //192.168.1.25 -N' },
      { id: 'obj-2', title: 'Connect to exposed share //192.168.1.25/public' },
      { id: 'obj-3', title: 'Download and inspect audit_notice.txt to retrieve the flag' }
    ],
    hints: ['Run: smbclient -L //192.168.1.25 -N', 'Connect with: smbclient //192.168.1.25/public -N'],
    flag: 'FLAG{smb_null_sessions_disabled_in_active_directory}',
    simulatedTerminal: {
      initialPrompt: 'auditor@kali-sandbox:~$',
      availableCommands: {
        'help': 'Commands: smbclient <options>, cat <file>, clear',
        'smbclient -L //192.168.1.25 -N': `Anonymous session successful
        Sharename       Type      Comment
        ---------       ----      -------
        print$          Disk      Printer Drivers
        public          Disk      General Company Files (Anonymous Access Enabled)
        IPC$            IPC       IPC Service (Samba 4.17.5)`,
        'smbclient //192.168.1.25/public -N': `smb: \\> ls
  .                                   D        0  Sat Nov  7 14:00:00 2026
  ..                                  D        0  Sat Nov  7 14:00:00 2026
  audit_notice.txt                    A      320  Sat Nov  7 14:05:00 2026
smb: \\> get audit_notice.txt
getting file \\audit_notice.txt of size 320 as audit_notice.txt (156.2 KByte/s)
smb: \\> exit
[File downloaded to local directory]`,
        'cat audit_notice.txt': `COMPANY CONFIDENTIAL AUDIT NOTICE:
This share must be restricted prior to external SOC audit.
Security Clearance Token: FLAG{smb_null_sessions_disabled_in_active_directory}`
      }
    },
    defensiveTakeaway: 'Disable anonymous/guest access in smb.conf (`map to guest = never`) and enforce SMB Signing and SMBv3 encryption.'
  },
  {
    id: 'lab-14-snort-rule-formulation',
    title: 'Lab 14: Writing Custom Snort Signatures for SSH Brute Force Detection',
    category: 'Network Defense & Intrusion Detection',
    difficulty: 'Intermediate',
    estimatedMinutes: 25,
    xpReward: 300,
    overview: 'Formulate an IDS detection rule using Snort threshold detection options to identify rapid SSH authentication brute force attempts ($> 5$ connection attempts in 60 seconds).',
    authorizationNotice: 'Authorized Blue Team Defense Lab.',
    targetEnvironment: 'Snort Rule Engine v2.9 [Dataset: ssh_attack.pcap]',
    objectives: [
      { id: 'obj-1', title: 'Inspect ssh_attack.pcap traffic characteristics' },
      { id: 'obj-2', title: 'Examine /etc/snort/rules/ssh_bruteforce.rules' },
      { id: 'obj-3', title: 'Test the rule against pcap to trigger alert and retrieve flag' }
    ],
    hints: ['Check the rules file: cat /etc/snort/rules/ssh_bruteforce.rules', 'Test rule with: snort -r ssh_attack.pcap -c /etc/snort/rules/ssh_bruteforce.rules'],
    flag: 'FLAG{snort_threshold_rate_limiting_mastery}',
    simulatedTerminal: {
      initialPrompt: 'soc-analyst@kali-sandbox:~$',
      availableCommands: {
        'help': 'Commands: cat <file>, snort <options>, clear',
        'cat /etc/snort/rules/ssh_bruteforce.rules': `alert tcp $EXTERNAL_NET any -> $HOME_NET 22 (
    msg:"SEC-ALERT SSH Brute Force Rate Exceeded";
    flags:S;
    threshold: type both, track by_src, count 5, seconds 60;
    classtype:attempted-admin;
    sid:2000001; rev:1;
)`,
        'snort -r ssh_attack.pcap -c /etc/snort/rules/ssh_bruteforce.rules': `Processing ssh_attack.pcap (120 packets)...
[**] [2000001:1] SEC-ALERT SSH Brute Force Rate Exceeded [**]
[Priority: 1] 10.0.0.12 -> 192.168.1.10:22
Event count exceeded threshold (18 attempts in 24 seconds).
Verification Flag: FLAG{snort_threshold_rate_limiting_mastery}`
      }
    },
    defensiveTakeaway: 'Deploy Fail2ban or threshold-based IDS/IPS rules to automatically throttle and temporarily block source IP addresses generating anomalous authentication connection bursts.'
  },
  {
    id: 'lab-15-wireshark-credential-extraction',
    title: 'Lab 15: Network Traffic Analysis & Cleartext Credential Extraction',
    category: 'Network Defense & Intrusion Detection',
    difficulty: 'Beginner',
    estimatedMinutes: 20,
    xpReward: 200,
    overview: 'Analyze a packet capture file (traffic.pcap) where unencrypted legacy FTP and Telnet sessions occurred. Extract user credentials using tshark display filters to recover the forensic flag.',
    authorizationNotice: 'Authorized PCAP Forensic Analysis.',
    targetEnvironment: 'Dataset: traffic.pcap [Simulated unencrypted legacy network trace]',
    objectives: [
      { id: 'obj-1', title: 'Filter FTP traffic in traffic.pcap using tshark' },
      { id: 'obj-2', title: 'Inspect USER and PASS FTP commands' },
      { id: 'obj-3', title: 'Recover plaintext credentials and authentication flag' }
    ],
    hints: ['Run: tshark -r traffic.pcap -Y "ftp"'],
    flag: 'FLAG{enforce_sftp_and_tls_eliminate_ftp}',
    simulatedTerminal: {
      initialPrompt: 'forensics@kali-sandbox:~$',
      availableCommands: {
        'help': 'Commands: tshark <options>, clear',
        'tshark -r traffic.pcap -Y "ftp"': `12 0.812000 10.0.0.8 -> 192.168.1.20 FTP 72 Request: USER sysadmin
14 0.815000 192.168.1.20 -> 10.0.0.8 FTP 76 Response: 331 Please specify the password.
16 0.942000 10.0.0.8 -> 192.168.1.20 FTP 84 Request: PASS SuperSecret2026!
18 0.950000 192.168.1.20 -> 10.0.0.8 FTP 110 Response: 230 Login successful. Token: FLAG{enforce_sftp_and_tls_eliminate_ftp}`
      }
    },
    defensiveTakeaway: 'Never allow plain-text transmission protocols (FTP, Telnet, HTTP). Mandate encrypted replacements: SFTP, SSH, and HTTPS across all infrastructure.'
  },
  {
    id: 'lab-16-volatility-process-triage',
    title: 'Lab 16: Memory Forensics with Volatility 3 & Process Injection Triage',
    category: 'Digital Forensics & Incident Response',
    difficulty: 'Advanced',
    estimatedMinutes: 30,
    xpReward: 350,
    overview: 'Analyze a suspicious memory dump (memdump.raw) from an infected Windows workstation. Use Volatility 3 plugins to identify an unlinked malicious process and examine memory permissions.',
    authorizationNotice: 'Authorized DFIR Lab Simulation.',
    targetEnvironment: 'Dataset: memdump.raw [Windows 10 x64 memory capture]',
    objectives: [
      { id: 'obj-1', title: 'List processes with vol -f memdump.raw windows.pslist' },
      { id: 'obj-2', title: 'Identify anomalous process svch0st.exe (spelled with zero)' },
      { id: 'obj-3', title: 'Run windows.malfind on target PID to extract flag' }
    ],
    hints: ['Check process list: vol -f memdump.raw windows.pslist', 'Notice PID 4920 masquerading as svch0st.exe! Run: vol -f memdump.raw windows.malfind --pid 4920'],
    flag: 'FLAG{volatility_memory_injection_triaged_2026}',
    simulatedTerminal: {
      initialPrompt: 'dfir@kali-sandbox:~$',
      availableCommands: {
        'help': 'Commands: vol <options>, clear',
        'vol -f memdump.raw windows.pslist': `PID    PPID   ImageFileName    Offset(V)          Threads  Handles  CreateTime
4      0      System           0xfa80016a8040     142      0        2026-11-07 08:00:00
412    4      smss.exe         0xfa80017c2b00     4        32       2026-11-07 08:00:01
680    612    svchost.exe      0xfa80019e1080     18       310      2026-11-07 08:00:05
4920   680    svch0st.exe      0xfa80024f8080     3        42       2026-11-07 08:14:22 [ANOMALOUS PID]`,
        'vol -f memdump.raw windows.malfind --pid 4920': `Process: svch0st.exe Pid: 4920 Address: 0x2a0000
Vad Tag: VadS Protection: PAGE_EXECUTE_READWRITE
Flags: CommitCharge: 4, MemCommit: 1, PrivateMemory: 1
00000000: 4d 5a 90 00 03 00 00 00 04 00 00 00 ff ff 00 00  MZ..............
00000010: 46 4c 41 47 7b 76 6f 6c 61 74 69 6c 69 74 79 5f  FLAG{volatility_
00000020: 6d 65 6d 6f 72 79 5f 69 6e 6a 65 63 74 69 6f 6e  memory_injection
00000030: 5f 74 72 69 61 67 65 64 5f 32 30 32 36 7d 00 00  _triaged_2026}..`
      }
    },
    defensiveTakeaway: 'Deploy EDR tools that monitor for anomalous parent-child process relationships and flag memory allocations with PAGE_EXECUTE_READWRITE protections.'
  },
  {
    id: 'lab-17-windows-event-log-hunting',
    title: 'Lab 17: Windows Security Event Log Triage & Brute Force Analysis',
    category: 'Digital Forensics & Incident Response',
    difficulty: 'Intermediate',
    estimatedMinutes: 25,
    xpReward: 250,
    overview: 'A domain controller generated alerts for failed logins. Parse security event logs (.evtx) using command-line filters to identify Event 4625 (Logon Failure) bursts and locate the audit flag.',
    authorizationNotice: 'Authorized Event Log Investigation.',
    targetEnvironment: 'Dataset: Security.evtx [Simulated Domain Controller Logs]',
    objectives: [
      { id: 'obj-1', title: 'Filter Event ID 4625 records' },
      { id: 'obj-2', title: 'Identify attacking workstation and targeted username' },
      { id: 'obj-3', title: 'Locate the administrative investigation flag' }
    ],
    hints: ['Run: evtx-dump Security.evtx | grep -A 5 "4625"'],
    flag: 'FLAG{event_4625_logon_failure_triaged}',
    simulatedTerminal: {
      initialPrompt: 'analyst@kali-sandbox:~$',
      availableCommands: {
        'help': 'Commands: evtx-dump <file>, clear',
        'evtx-dump Security.evtx | grep -A 5 "4625"': `EventID: 4625 [An account failed to log on]
TimeCreated: 2026-11-07 10:14:02
TargetUserName: Administrator
WorkstationName: WORKSTATION-PC4
FailureReason: %%2313 (Unknown user name or bad password)
IncidentFlag: FLAG{event_4625_logon_failure_triaged}`
      }
    },
    defensiveTakeaway: 'Monitor Event 4625 spikes using SIEM correlation rules to detect credential spraying and password guessing before account takeover occurs.'
  },
  {
    id: 'lab-18-yara-ransomware-detection',
    title: 'Lab 18: YARA Malware Signature Engineering & Classification',
    category: 'SOC Analyst & Threat Detection',
    difficulty: 'Intermediate',
    estimatedMinutes: 25,
    xpReward: 300,
    overview: 'Author a YARA detection rule to identify simulated ransomware binaries based on specific byte sequences, extension strings, and PE header signatures.',
    authorizationNotice: 'Authorized Malware Signature Sandbox.',
    targetEnvironment: 'YARA Compiler v4.3 [Directory: /samples/]',
    objectives: [
      { id: 'obj-1', title: 'Inspect strings in /samples/malware_sample.bin' },
      { id: 'obj-2', title: 'Review rule in /rules/detect_ransom.yar' },
      { id: 'obj-3', title: 'Execute yara scanner to match file and retrieve flag' }
    ],
    hints: ['Check rule: cat /rules/detect_ransom.yar', 'Run: yara /rules/detect_ransom.yar /samples/malware_sample.bin'],
    flag: 'FLAG{yara_malware_classification_validated}',
    simulatedTerminal: {
      initialPrompt: 'detection-eng@kali-sandbox:~$',
      availableCommands: {
        'help': 'Commands: cat <file>, yara <rule> <target>, clear',
        'cat /rules/detect_ransom.yar': `rule Detect_Ransomware_Family {
    meta:
        author = "SOC Team"
        severity = "Critical"
    strings:
        $s1 = "All your files have been encrypted" nocase
        $s2 = ".locked_cyber_lab" wide ascii
    condition:
        uint16(0) == 0x5A4D and all of ($s*)
}`,
        'yara /rules/detect_ransom.yar /samples/malware_sample.bin': `Detect_Ransomware_Family /samples/malware_sample.bin
[YARA Match Confirmed]: 2 strings identified at offset 0x410 and 0x520.
Audit Flag: FLAG{yara_malware_classification_validated}`
      }
    },
    defensiveTakeaway: 'Deploy YARA signatures on file upload gateways and EDR sensors to catch malware families matching known binary strings and byte sequences.'
  },
  {
    id: 'lab-19-sigma-siem-conversion',
    title: 'Lab 19: Sigma Rule Conversion & SIEM Detection Formulation',
    category: 'SOC Analyst & Threat Detection',
    difficulty: 'Intermediate',
    estimatedMinutes: 20,
    xpReward: 250,
    overview: 'Convert a generic Sigma YAML detection rule targeting suspicious certutil living-off-the-land execution into native Splunk SPL query syntax.',
    authorizationNotice: 'Authorized Detection Engineering Lab.',
    targetEnvironment: 'Sigma CLI v0.8.0 [Rule: proc_creation_win_certutil_download.yml]',
    objectives: [
      { id: 'obj-1', title: 'Review Sigma YAML rule logic' },
      { id: 'obj-2', title: 'Convert to Splunk SPL using sigma convert' },
      { id: 'obj-3', title: 'Verify generated query and retrieve flag' }
    ],
    hints: ['Run: cat certutil_rule.yml', 'Convert: sigma convert -t splunk certutil_rule.yml'],
    flag: 'FLAG{sigma_detection_as_code_mastered}',
    simulatedTerminal: {
      initialPrompt: 'detection-eng@kali-sandbox:~$',
      availableCommands: {
        'help': 'Commands: cat <file>, sigma convert <options>, clear',
        'cat certutil_rule.yml': `title: Certutil Download Ingestion
logsource:
    category: process_creation
    product: windows
detection:
    selection:
        Image|endswith: '\\certutil.exe'
        CommandLine|contains:
            - '-urlcache'
            - '-split'
    condition: selection`,
        'sigma convert -t splunk certutil_rule.yml': `[+] Converting certutil_rule.yml to Splunk SPL...
Generated Query:
index=* (Image="*\\certutil.exe" AND (CommandLine="*-urlcache*" OR CommandLine="*-split*"))
[Verification Token]: FLAG{sigma_detection_as_code_mastered}`
      }
    },
    defensiveTakeaway: 'Using vendor-neutral Sigma rules allows detection engineering teams to maintain a single repository of detection-as-code convertible across any SIEM platform.'
  },
  {
    id: 'lab-20-password-spraying-defense',
    title: 'Lab 20: Active Directory Password Spraying Audit & Lockout Analysis',
    category: 'Cryptography & Passwords',
    difficulty: 'Intermediate',
    estimatedMinutes: 25,
    xpReward: 300,
    overview: 'Analyze a simulated corporate user directory. Test one single common password against multiple accounts to understand why password spraying bypasses traditional account lockout policies.',
    authorizationNotice: 'Authorized Simulation: Sandboxed test Active Directory realm.',
    targetEnvironment: 'Domain: corp.local [Subnet: 10.10.10.0/24]',
    objectives: [
      { id: 'obj-1', title: 'Enumerate domain users from users.txt' },
      { id: 'obj-2', title: 'Run single-password spray with crackmapexec / netexec' },
      { id: 'obj-3', title: 'Capture the audit flag upon discovering weak service account' }
    ],
    hints: ['Run: netexec smb 10.10.10.10 -u users.txt -p "Autumn2026!"'],
    flag: 'FLAG{mfa_and_breached_password_filters_stop_spraying}',
    simulatedTerminal: {
      initialPrompt: 'auditor@kali-sandbox:~$',
      availableCommands: {
        'help': 'Commands: cat <file>, netexec <options>, clear',
        'cat users.txt': `alice
bob
charlie
dave
service_sql`,
        'netexec smb 10.10.10.10 -u users.txt -p "Autumn2026!"': `SMB 10.10.10.10:445 CORP.LOCAL [-] corp.local\\alice:Autumn2026! STATUS_LOGON_FAILURE
SMB 10.10.10.10:445 CORP.LOCAL [-] corp.local\\bob:Autumn2026! STATUS_LOGON_FAILURE
SMB 10.10.10.10:445 CORP.LOCAL [-] corp.local\\charlie:Autumn2026! STATUS_LOGON_FAILURE
SMB 10.10.10.10:445 CORP.LOCAL [+] corp.local\\service_sql:Autumn2026! (Pwn3d!)
[Audit Flag Discovered in SMB Share]: FLAG{mfa_and_breached_password_filters_stop_spraying}`
      }
    },
    defensiveTakeaway: 'Enforce phishing-resistant MFA (FIDO2) and deploy Entra Password Protection / breached password filters to reject easily guessable seasonal passwords.'
  }
];
