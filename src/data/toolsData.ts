import { KaliTool, ToolCategory, ToolDifficulty } from '../types/cyber';
import { TOOLS_PART_1 } from './tools/toolsDataPart1';
import { TOOLS_PART_2 } from './tools/toolsDataPart2';
import { TOOLS_PART_3 } from './tools/toolsDataPart3';
import { TOOLS_PART_4 } from './tools/toolsDataPart4';
import { TOOLS_PART_5 } from './tools/toolsDataPart5';
import { TOOLS_PART_6 } from './tools/toolsDataPart6';
import { TOOLS_PART_7 } from './tools/toolsDataPart7';

// Combine and deduplicate across parts
const rawCombined: KaliTool[] = [
  ...TOOLS_PART_1,
  ...TOOLS_PART_2,
  ...TOOLS_PART_3,
  ...TOOLS_PART_4,
  ...TOOLS_PART_5,
  ...TOOLS_PART_6,
  ...TOOLS_PART_7,
];

// Ensure distinct tools by unique ID
const seenIds = new Set<string>();
export const KALI_TOOLS_DATA: KaliTool[] = rawCombined.filter((tool) => {
  if (seenIds.has(tool.id)) {
    return false;
  }
  seenIds.add(tool.id);
  return true;
});

// Category labels and display helpers
export const TOOL_CATEGORIES: { id: ToolCategory | 'all'; label: string; count: number }[] = [
  { id: 'all', label: 'All Categories', count: KALI_TOOLS_DATA.length },
  {
    id: 'information_gathering',
    label: 'Information Gathering',
    count: KALI_TOOLS_DATA.filter((t) => t.category === 'information_gathering').length,
  },
  {
    id: 'vulnerability_analysis',
    label: 'Vulnerability Analysis',
    count: KALI_TOOLS_DATA.filter((t) => t.category === 'vulnerability_analysis').length,
  },
  {
    id: 'web_applications',
    label: 'Web Application Security',
    count: KALI_TOOLS_DATA.filter((t) => t.category === 'web_applications').length,
  },
  {
    id: 'password_attacks',
    label: 'Password Auditing',
    count: KALI_TOOLS_DATA.filter((t) => t.category === 'password_attacks').length,
  },
  {
    id: 'wireless_attacks',
    label: 'Wireless Security',
    count: KALI_TOOLS_DATA.filter((t) => t.category === 'wireless_attacks').length,
  },
  {
    id: 'exploitation',
    label: 'Exploitation Frameworks',
    count: KALI_TOOLS_DATA.filter((t) => t.category === 'exploitation').length,
  },
  {
    id: 'forensics_defense',
    label: 'Forensics',
    count: KALI_TOOLS_DATA.filter((t) => t.category === 'forensics_defense').length,
  },
  {
    id: 'reverse_engineering',
    label: 'Reverse Engineering',
    count: KALI_TOOLS_DATA.filter((t) => t.category === 'reverse_engineering').length,
  },
  {
    id: 'sniffing_spoofing',
    label: 'Sniffing & Spoofing',
    count: KALI_TOOLS_DATA.filter((t) => t.category === 'sniffing_spoofing').length,
  },
  {
    id: 'reporting',
    label: 'Reporting',
    count: KALI_TOOLS_DATA.filter((t) => t.category === 'reporting').length,
  },
  {
    id: 'osint',
    label: 'OSINT & Recon',
    count: KALI_TOOLS_DATA.filter((t) => t.category === 'osint').length,
  },
  {
    id: 'defensive_security',
    label: 'Defensive Security',
    count: KALI_TOOLS_DATA.filter((t) => t.category === 'defensive_security').length,
  },
];

export function searchTools(
  query: string,
  category: ToolCategory | 'all' = 'all',
  difficulty: ToolDifficulty | 'all' = 'all',
  bookmarkedOnly: boolean = false,
  bookmarkedIds: string[] = []
): KaliTool[] {
  const cleanQ = query.toLowerCase().trim();

  return KALI_TOOLS_DATA.filter((tool) => {
    if (category !== 'all' && tool.category !== category) return false;
    if (difficulty !== 'all' && tool.difficulty !== difficulty) return false;
    if (bookmarkedOnly && !bookmarkedIds.includes(tool.id)) return false;

    if (!cleanQ) return true;

    return (
      tool.name.toLowerCase().includes(cleanQ) ||
      (tool.purpose && tool.purpose.toLowerCase().includes(cleanQ)) ||
      tool.description.toLowerCase().includes(cleanQ) ||
      tool.syntax.toLowerCase().includes(cleanQ) ||
      tool.tags.some((tag) => tag.toLowerCase().includes(cleanQ))
    );
  });
}
