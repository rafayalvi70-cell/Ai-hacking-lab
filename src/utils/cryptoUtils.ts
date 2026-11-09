// Pure JS/TS implementation of MD5 for offline browser support
function md5Cycle(x: number[], k: number[]) {
  let a = x[0], b = x[1], c = x[2], d = x[3];

  a = ff(a, b, c, d, k[0], 7, -680876936);
  d = ff(d, a, b, c, k[1], 12, -389564586);
  c = ff(c, d, a, b, k[2], 17, 606105819);
  b = ff(b, c, d, a, k[3], 22, -1044525330);
  a = ff(a, b, c, d, k[4], 7, -176418897);
  d = ff(d, a, b, c, k[5], 12, 1200080426);
  c = ff(c, d, a, b, k[6], 17, -1473231341);
  b = ff(b, c, d, a, k[7], 22, -45705983);
  a = ff(a, b, c, d, k[8], 7, 1770035416);
  d = ff(d, a, b, c, k[9], 12, -1958414417);
  c = ff(c, d, a, b, k[10], 17, -42063);
  b = ff(b, c, d, a, k[11], 22, -1990404162);
  a = ff(a, b, c, d, k[12], 7, 1804603682);
  d = ff(d, a, b, c, k[13], 12, -40341101);
  c = ff(c, d, a, b, k[14], 17, -1502002290);
  b = ff(b, c, d, a, k[15], 22, 1236535329);

  a = gg(a, b, c, d, k[1], 5, -165796510);
  d = gg(d, a, b, c, k[6], 9, -1069501632);
  c = gg(c, d, a, b, k[11], 14, 643717713);
  b = gg(b, c, d, a, k[0], 20, -373897302);
  a = gg(a, b, c, d, k[5], 5, -701558691);
  d = gg(d, a, b, c, k[10], 9, 38016083);
  c = gg(c, d, a, b, k[15], 14, -660478335);
  b = gg(b, c, d, a, k[4], 20, -405537848);
  a = gg(a, b, c, d, k[9], 5, 568446438);
  d = gg(d, a, b, c, k[14], 9, -1019803690);
  c = gg(c, d, a, b, k[3], 14, -187363961);
  b = gg(b, c, d, a, k[8], 20, 1163531501);
  a = gg(a, b, c, d, k[13], 5, -1444681467);
  d = gg(d, a, b, c, k[2], 9, -51403784);
  c = gg(c, d, a, b, k[7], 14, 1735328473);
  b = gg(b, c, d, a, k[12], 20, -1926607734);

  a = hh(a, b, c, d, k[5], 4, -378558);
  d = hh(d, a, b, c, k[8], 11, -2022574463);
  c = hh(c, d, a, b, k[11], 16, 1839030562);
  b = hh(b, c, d, a, k[14], 23, -35309556);
  a = hh(a, b, c, d, k[1], 4, -1530992060);
  d = hh(d, a, b, c, k[4], 11, 1272893353);
  c = hh(c, d, a, b, k[7], 16, -155497632);
  b = hh(b, c, d, a, k[10], 23, -1094730640);
  a = hh(a, b, c, d, k[13], 4, 681279174);
  d = hh(d, a, b, c, k[0], 11, -358537222);
  c = hh(c, d, a, b, k[3], 16, -722521979);
  b = hh(b, c, d, a, k[6], 23, 76029189);
  a = hh(a, b, c, d, k[9], 4, -640364487);
  d = hh(d, a, b, c, k[12], 11, -421815835);
  c = hh(c, d, a, b, k[15], 16, 530742520);
  b = hh(b, c, d, a, k[2], 23, -995338651);

  a = ii(a, b, c, d, k[0], 6, -198630844);
  d = ii(d, a, b, c, k[7], 10, 1126891415);
  c = ii(c, d, a, b, k[14], 15, -1416354905);
  b = ii(b, c, d, a, k[5], 21, -57434055);
  a = ii(a, b, c, d, k[12], 6, 1700485571);
  d = ii(d, a, b, c, k[3], 10, -1894986606);
  c = ii(c, d, a, b, k[10], 15, -1051523);
  b = ii(b, c, d, a, k[1], 21, -2054922799);
  a = ii(a, b, c, d, k[8], 6, 1873313359);
  d = ii(d, a, b, c, k[15], 10, -30611744);
  c = ii(c, d, a, b, k[6], 15, -1560198380);
  b = ii(b, c, d, a, k[13], 21, 1309151649);
  a = ii(a, b, c, d, k[4], 6, -145523070);
  d = ii(d, a, b, c, k[11], 10, -1120210379);
  c = ii(c, d, a, b, k[2], 15, 718787259);
  b = ii(b, c, d, a, k[9], 21, -343485551);

  x[0] = add32(a, x[0]);
  x[1] = add32(b, x[1]);
  x[2] = add32(c, x[2]);
  x[3] = add32(d, x[3]);
}

function cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
  a = add32(add32(a, q), add32(x, t));
  return add32((a << s) | (a >>> (32 - s)), b);
}
function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
  return cmn((b & c) | (~b & d), a, b, x, s, t);
}
function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
  return cmn((b & d) | (c & ~d), a, b, x, s, t);
}
function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
  return cmn(b ^ c ^ d, a, b, x, s, t);
}
function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
  return cmn(c ^ (b | ~d), a, b, x, s, t);
}
function add32(a: number, b: number) {
  return (a + b) & 0xffffffff;
}

export function md5(s: string): string {
  const n = s.length;
  const state = [1732584193, -271733879, -1732584194, 271733878];
  let i: number;
  for (i = 64; i <= s.length; i += 64) {
    md5Cycle(state, md5blk(s.substring(i - 64, i)));
  }
  s = s.substring(i - 64);
  const tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (i = 0; i < s.length; i++) {
    tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
  }
  tail[i >> 2] |= 0x80 << ((i % 4) << 3);
  if (i > 55) {
    md5Cycle(state, tail);
    for (i = 0; i < 16; i++) tail[i] = 0;
  }
  tail[14] = n * 8;
  md5Cycle(state, tail);

  let res = '';
  for (let j = 0; j < 4; j++) {
    for (let k = 0; k < 4; k++) {
      const byte = (state[j] >> (k * 8)) & 0xff;
      res += (byte < 16 ? '0' : '') + byte.toString(16);
    }
  }
  return res;
}

function md5blk(s: string): number[] {
  const md5blks: number[] = [];
  for (let i = 0; i < 64; i += 4) {
    md5blks[i >> 2] =
      s.charCodeAt(i) +
      (s.charCodeAt(i + 1) << 8) +
      (s.charCodeAt(i + 2) << 16) +
      (s.charCodeAt(i + 3) << 24);
  }
  return md5blks;
}

// Web Crypto Hash (SHA-256, SHA-512, SHA-1)
export async function computeCryptoHash(algorithm: 'SHA-256' | 'SHA-512' | 'SHA-1', text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Text Encoders / Decoders
export function encodeBase64(str: string): string {
  try {
    const bytes = new TextEncoder().encode(str);
    const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
    return btoa(binString);
  } catch {
    return 'Error: Unable to encode Base64';
  }
}

export function decodeBase64(str: string): string {
  try {
    const binString = atob(str.trim());
    const bytes = Uint8Array.from(binString, (m) => m.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return 'Error: Invalid Base64 input';
  }
}

export function encodeHex(str: string): string {
  const bytes = new TextEncoder().encode(str);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join(' ');
}

export function decodeHex(hexStr: string): string {
  try {
    const cleaned = hexStr.replace(/\s+/g, '');
    if (cleaned.length % 2 !== 0) return 'Error: Hex string must have an even length';
    const bytes = new Uint8Array(cleaned.length / 2);
    for (let i = 0; i < cleaned.length; i += 2) {
      bytes[i / 2] = parseInt(cleaned.substr(i, 2), 16);
    }
    return new TextDecoder().decode(bytes);
  } catch {
    return 'Error: Invalid Hex characters';
  }
}

export function rot13(str: string): string {
  return str.replace(/[a-zA-Z]/g, (c) => {
    const base = c <= 'Z' ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
  });
}

// Password Entropy Calculation
export interface PasswordAnalysis {
  entropy: number;
  strength: 'Very Weak' | 'Weak' | 'Moderate' | 'Strong' | 'Very Strong';
  color: string;
  crackTimeEstimate: string;
  hasLower: boolean;
  hasUpper: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  length: number;
  advice: string[];
}

export function analyzePasswordEntropy(password: string): PasswordAnalysis {
  if (!password) {
    return {
      entropy: 0,
      strength: 'Very Weak',
      color: '#ef4444',
      crackTimeEstimate: 'Instant',
      hasLower: false,
      hasUpper: false,
      hasNumber: false,
      hasSpecial: false,
      length: 0,
      advice: ['Enter a password to evaluate its resistance against brute-force attacks.'],
    };
  }

  const length = password.length;
  let poolSize = 0;

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);

  if (hasLower) poolSize += 26;
  if (hasUpper) poolSize += 26;
  if (hasNumber) poolSize += 10;
  if (hasSpecial) poolSize += 33;

  const entropy = Math.round(length * Math.log2(Math.max(poolSize, 1)));

  let strength: PasswordAnalysis['strength'] = 'Very Weak';
  let color = '#ef4444';
  let crackTimeEstimate = 'Instant';

  if (entropy < 28) {
    strength = 'Very Weak';
    color = '#ef4444';
    crackTimeEstimate = 'Few milliseconds';
  } else if (entropy < 36) {
    strength = 'Weak';
    color = '#f97316';
    crackTimeEstimate = 'Few seconds to minutes';
  } else if (entropy < 60) {
    strength = 'Moderate';
    color = '#eab308';
    crackTimeEstimate = 'Few hours to days';
  } else if (entropy < 80) {
    strength = 'Strong';
    color = '#10b981';
    crackTimeEstimate = 'Several years to decades';
  } else {
    strength = 'Very Strong';
    color = '#06b6d4';
    crackTimeEstimate = 'Centuries to Millennia';
  }

  const advice: string[] = [];
  if (length < 12) advice.push('Increase length to at least 14-16 characters.');
  if (!hasLower) advice.push('Include lowercase letters (a-z).');
  if (!hasUpper) advice.push('Include uppercase letters (A-Z).');
  if (!hasNumber) advice.push('Include numerical digits (0-9).');
  if (!hasSpecial) advice.push('Include symbols and punctuation ($#@%!).');
  if (advice.length === 0) {
    advice.push('Excellent passphrase! Meets OWASP and NIST 800-63B guidelines.');
  }

  return {
    entropy,
    strength,
    color,
    crackTimeEstimate,
    hasLower,
    hasUpper,
    hasNumber,
    hasSpecial,
    length,
    advice,
  };
}
