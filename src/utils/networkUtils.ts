import { SubnetCalculationResult, DnsRecordItem, HeaderAuditFinding } from '../types/cyber';

// IP / Subnet Calculator
export function calculateSubnet(ipStr: string, cidr: number): SubnetCalculationResult {
  const parts = ipStr.trim().split('.').map((p) => parseInt(p, 10));
  if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
    throw new Error('Invalid IPv4 address format. Expected format: X.X.X.X (e.g. 192.168.1.1)');
  }
  if (isNaN(cidr) || cidr < 0 || cidr > 32) {
    throw new Error('Invalid CIDR prefix. Must be an integer between 0 and 32.');
  }

  // Convert IP to 32-bit unsigned integer
  const ipInt = ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;

  // Mask calculation
  const maskInt = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
  const wildcardInt = (~maskInt) >>> 0;

  const networkInt = (ipInt & maskInt) >>> 0;
  const broadcastInt = (networkInt | wildcardInt) >>> 0;

  const intToIp = (num: number) => [
    (num >>> 24) & 255,
    (num >>> 16) & 255,
    (num >>> 8) & 255,
    num & 255,
  ].join('.');

  const netmask = intToIp(maskInt);
  const wildcardMask = intToIp(wildcardInt);
  const networkAddress = intToIp(networkInt);
  const broadcastAddress = intToIp(broadcastInt);

  let totalHosts = 0;
  let usableHosts = 0;
  let firstUsable = 'N/A';
  let lastUsable = 'N/A';

  if (cidr === 32) {
    totalHosts = 1;
    usableHosts = 1;
    firstUsable = networkAddress;
    lastUsable = networkAddress;
  } else if (cidr === 31) {
    totalHosts = 2;
    usableHosts = 2; // RFC 3021 point-to-point links
    firstUsable = networkAddress;
    lastUsable = broadcastAddress;
  } else {
    totalHosts = Math.pow(2, 32 - cidr);
    usableHosts = Math.max(0, totalHosts - 2);
    firstUsable = intToIp(networkInt + 1);
    lastUsable = intToIp(broadcastInt - 1);
  }

  // Class & Scope
  let ipClass = 'Unknown';
  if (parts[0] >= 1 && parts[0] <= 126) ipClass = 'Class A';
  else if (parts[0] === 127) ipClass = 'Loopback (127.0.0.0/8)';
  else if (parts[0] >= 128 && parts[0] <= 191) ipClass = 'Class B';
  else if (parts[0] >= 192 && parts[0] <= 223) ipClass = 'Class C';
  else if (parts[0] >= 224 && parts[0] <= 239) ipClass = 'Class D (Multicast)';
  else ipClass = 'Class E (Experimental)';

  let isPrivate = false;
  if (parts[0] === 10) isPrivate = true;
  else if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) isPrivate = true;
  else if (parts[0] === 192 && parts[1] === 168) isPrivate = true;

  const scope = isPrivate
    ? 'Private (RFC 1918)'
    : parts[0] === 127
    ? 'Loopback'
    : 'Public Routable';

  const binaryNetmask = maskInt.toString(2).padStart(32, '0').match(/.{8}/g)!.join('.');

  return {
    ip: parts.join('.'),
    cidr,
    netmask,
    networkAddress,
    broadcastAddress,
    firstUsable,
    lastUsable,
    totalHosts,
    usableHosts,
    wildcardMask,
    ipClass,
    scope,
    binaryNetmask,
  };
}

// Simulated DNS Learning Interface
export const SAMPLE_DNS_RECORDS: Record<string, DnsRecordItem[]> = {
  'cyberlab.local': [
    { type: 'A', name: 'cyberlab.local', value: '192.168.1.100', ttl: 300, description: 'IPv4 Host address for main server' },
    { type: 'AAAA', name: 'cyberlab.local', value: 'fe80::1ff:fe23:4567', ttl: 300, description: 'IPv6 Host address' },
    { type: 'CNAME', name: 'www.cyberlab.local', value: 'cyberlab.local', ttl: 3600, description: 'Canonical alias pointing to apex domain' },
    { type: 'MX', name: 'cyberlab.local', value: '10 mail.cyberlab.local', ttl: 1800, description: 'Mail exchange priority 10' },
    { type: 'TXT', name: 'cyberlab.local', value: 'v=spf1 mx ip4:192.168.1.0/24 -all', ttl: 3600, description: 'SPF policy for email spoof protection' },
    { type: 'NS', name: 'cyberlab.local', value: 'ns1.cyberlab.local', ttl: 86400, description: 'Authoritative primary nameserver' },
    { type: 'SOA', name: 'cyberlab.local', value: 'ns1.cyberlab.local admin.cyberlab.local 2026110701 7200 3600 1209600 300', ttl: 86400, description: 'Start of Authority parameters' },
  ],
  'bank.internal': [
    { type: 'A', name: 'bank.internal', value: '10.10.50.1', ttl: 60, description: 'Internal banking core gateway' },
    { type: 'A', name: 'vault.bank.internal', value: '10.10.50.5', ttl: 60, description: 'High-security financial database vault' },
    { type: 'TXT', name: 'bank.internal', value: 'v=spf1 -all; security-contact=security@bank.internal', ttl: 300, description: 'Strict SPF enforcement' },
    { type: 'CAA', name: 'bank.internal', value: '0 issue "letsencrypt.org"', ttl: 3600, description: 'Certificate Authority Authorization lock' },
  ],
  'secops.lab': [
    { type: 'A', name: 'secops.lab', value: '172.16.0.4', ttl: 300, description: 'Security Operations SIEM ingestor' },
    { type: 'PTR', name: '4.0.16.172.in-addr.arpa', value: 'secops.lab', ttl: 3600, description: 'Reverse DNS pointer record' },
    { type: 'TXT', name: 'secops.lab', value: 'dmarc=v=DMARC1; p=reject; rua=mailto:dmarc@secops.lab', ttl: 3600, description: 'DMARC strict reject policy' },
  ],
};

export function queryDnsSimulator(domain: string, filterType?: string): DnsRecordItem[] {
  const cleanDomain = domain.trim().toLowerCase().replace(/^https?:\/\//, '').split('/')[0];
  const records = SAMPLE_DNS_RECORDS[cleanDomain];

  if (records) {
    if (filterType && filterType !== 'ALL') {
      return records.filter((r) => r.type === filterType);
    }
    return records;
  }

  // Fallback realistic synthesis for arbitrary domain entered by user
  const synthetic: DnsRecordItem[] = [
    { type: 'A', name: cleanDomain, value: '203.0.113.' + (Math.floor(Math.random() * 200) + 10), ttl: 300, description: 'Synthesized IPv4 address (learning simulation)' },
    { type: 'NS', name: cleanDomain, value: `ns1.${cleanDomain}`, ttl: 86400, description: 'Authoritative nameserver' },
    { type: 'MX', name: cleanDomain, value: `10 mail.${cleanDomain}`, ttl: 3600, description: 'Mail exchanger priority 10' },
    { type: 'TXT', name: cleanDomain, value: 'v=spf1 -all', ttl: 3600, description: 'Sender Policy Framework record' },
    { type: 'SOA', name: cleanDomain, value: `ns1.${cleanDomain} hostmaster.${cleanDomain} 2026110701 7200 3600 1209600 300`, ttl: 86400, description: 'Start of Authority' },
  ];

  if (filterType && filterType !== 'ALL') {
    return synthetic.filter((r) => r.type === filterType);
  }
  return synthetic;
}

// HTTP Header Security Analyzer
export function analyzeHttpHeaders(rawHeaders: string): {
  score: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  findings: HeaderAuditFinding[];
} {
  const lines = rawHeaders.split('\n');
  const headerMap = new Map<string, string>();

  for (const line of lines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim().toLowerCase();
      const val = line.slice(colonIdx + 1).trim();
      headerMap.set(key, val);
    }
  }

  const findings: HeaderAuditFinding[] = [];
  let score = 100;

  // 1. Strict-Transport-Security (HSTS)
  const hsts = headerMap.get('strict-transport-security');
  if (!hsts) {
    score -= 25;
    findings.push({
      header: 'Strict-Transport-Security',
      present: false,
      status: 'missing',
      impact: 'Allows SSL-stripping man-in-the-middle attacks downgrading HTTPS connections to plaintext HTTP.',
      recommendation: 'Add header: Strict-Transport-Security: max-age=31536000; includeSubDomains; preload',
    });
  } else {
    findings.push({
      header: 'Strict-Transport-Security',
      present: true,
      value: hsts,
      status: 'pass',
      impact: 'Enforces HTTPS exclusively across client browsers.',
      recommendation: 'Configured properly.',
    });
  }

  // 2. Content-Security-Policy (CSP)
  const csp = headerMap.get('content-security-policy');
  if (!csp) {
    score -= 30;
    findings.push({
      header: 'Content-Security-Policy',
      present: false,
      status: 'missing',
      impact: 'Leaves the application vulnerable to Cross-Site Scripting (XSS) and unauthorized script injection.',
      recommendation: 'Add header: Content-Security-Policy: default-src \'self\'; object-src \'none\'; script-src \'self\';',
    });
  } else if (csp.includes('unsafe-inline') || csp.includes('*')) {
    score -= 15;
    findings.push({
      header: 'Content-Security-Policy',
      present: true,
      value: csp,
      status: 'warning',
      impact: 'CSP contains unsafe wildcards or unsafe-inline directives that diminish XSS protection.',
      recommendation: 'Remove \'unsafe-inline\' and utilize nonces or strict hashes for inline scripts.',
    });
  } else {
    findings.push({
      header: 'Content-Security-Policy',
      present: true,
      value: csp,
      status: 'pass',
      impact: 'Restricts script execution origins and prevents unauthorized content injection.',
      recommendation: 'Robust CSP policy detected.',
    });
  }

  // 3. X-Frame-Options
  const xfo = headerMap.get('x-frame-options');
  if (!xfo && (!csp || !csp.includes('frame-ancestors'))) {
    score -= 15;
    findings.push({
      header: 'X-Frame-Options',
      present: false,
      status: 'missing',
      impact: 'Page can be embedded in malicious iframes, enabling UI Redressing / Clickjacking attacks.',
      recommendation: 'Add header: X-Frame-Options: DENY or SAMEORIGIN (or use CSP frame-ancestors).',
    });
  } else {
    findings.push({
      header: 'X-Frame-Options',
      present: true,
      value: xfo || 'Protected via CSP frame-ancestors',
      status: 'pass',
      impact: 'Prevents unauthorized framing of application pages.',
      recommendation: 'Configured.',
    });
  }

  // 4. X-Content-Type-Options
  const xcto = headerMap.get('x-content-type-options');
  if (!xcto || !xcto.toLowerCase().includes('nosniff')) {
    score -= 15;
    findings.push({
      header: 'X-Content-Type-Options',
      present: !!xcto,
      value: xcto,
      status: xcto ? 'warning' : 'missing',
      impact: 'Allows browsers to MIME-sniff response content, causing uploaded text/images to execute as HTML/JS.',
      recommendation: 'Add header: X-Content-Type-Options: nosniff',
    });
  } else {
    findings.push({
      header: 'X-Content-Type-Options',
      present: true,
      value: xcto,
      status: 'pass',
      impact: 'Disables browser MIME type sniffing.',
      recommendation: 'Configured properly.',
    });
  }

  // 5. Referrer-Policy
  const refPol = headerMap.get('referrer-policy');
  if (!refPol) {
    score -= 10;
    findings.push({
      header: 'Referrer-Policy',
      present: false,
      status: 'missing',
      impact: 'Referer header may leak full URLs containing sensitive query parameters to third-party domains.',
      recommendation: 'Add header: Referrer-Policy: strict-origin-when-cross-origin',
    });
  } else {
    findings.push({
      header: 'Referrer-Policy',
      present: true,
      value: refPol,
      status: 'pass',
      impact: 'Protects privacy by limiting path parameters passed to cross-origin destinations.',
      recommendation: 'Configured.',
    });
  }

  // 6. Information Leakage Headers (Server, X-Powered-By)
  const server = headerMap.get('server');
  const poweredBy = headerMap.get('x-powered-by');
  if (poweredBy || (server && /\d/.test(server))) {
    score -= 10;
    findings.push({
      header: 'Information Disclosure (Server / X-Powered-By)',
      present: true,
      value: `${server ? `Server: ${server} ` : ''}${poweredBy ? `X-Powered-By: ${poweredBy}` : ''}`,
      status: 'warning',
      impact: 'Exposes detailed backend framework and daemon version numbers, aiding attacker reconnaissance.',
      recommendation: 'Remove X-Powered-By and configure server banner to generic tokens (e.g. Server: web).',
    });
  }

  score = Math.max(0, Math.min(100, score));

  let grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
  if (score >= 95) grade = 'A+';
  else if (score >= 85) grade = 'A';
  else if (score >= 70) grade = 'B';
  else if (score >= 55) grade = 'C';
  else if (score >= 40) grade = 'D';

  return { score, grade, findings };
}
