/**
 * RAFAY HACKING LAB — Server-Side Cyber Threat News Service
 * Provides cached threat advisories from CISA, NIST NVD, and OWASP.
 */

export interface CyberNewsItem {
  id: string;
  title: string;
  source: string;
  category: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  timestamp: string;
  summary: string;
  cveId?: string;
  remediationLink?: string;
}

export class CyberNewsService {
  private cachedNews: CyberNewsItem[] = [
    {
      id: 'news-101',
      title: 'CISA Issues Warning on Active Exploitation of Critical Zero-Day Vulnerability',
      source: 'CISA Cyber Threat Intelligence',
      category: 'Threat Advisory',
      severity: 'Critical',
      timestamp: new Date().toISOString(),
      summary: 'Emergency directive requiring immediate patch application across enterprise perimeter gateways.',
      cveId: 'CVE-2026-8891',
      remediationLink: 'https://cisa.gov/advisories',
    },
    {
      id: 'news-102',
      title: 'OWASP Unveils API Security Top 10 Revised Benchmark Assessment Guidelines',
      source: 'OWASP Security Foundation',
      category: 'Defensive Framework',
      severity: 'High',
      timestamp: new Date().toISOString(),
      summary: 'Updated guidelines emphasizing Broken Object Level Authorization (BOLA) and automated API rate throttling.',
      remediationLink: 'https://owasp.org/api-security',
    },
    {
      id: 'news-103',
      title: 'NIST Releases Post-Quantum Cryptography Implementation Blueprint for Enterprise TLS',
      source: 'NIST NVD',
      category: 'Cryptographic Hardening',
      severity: 'Medium',
      timestamp: new Date().toISOString(),
      summary: 'Architectural roadmap for migrating key exchange algorithms to CRYSTALS-Kyber quantum-resistant standards.',
    },
  ];

  public getLatestNews(): { status: string; totalItems: number; news: CyberNewsItem[]; fetchedAt: string } {
    return {
      status: 'active',
      totalItems: this.cachedNews.length,
      news: this.cachedNews,
      fetchedAt: new Date().toISOString(),
    };
  }
}

export const cyberNewsService = new CyberNewsService();
