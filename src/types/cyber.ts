export type Language = 'en' | 'ur' | 'roman_ur';

export type ToolCategory =
  | 'information_gathering'
  | 'osint'
  | 'network_discovery'
  | 'port_scanning'
  | 'service_enumeration'
  | 'web_applications'
  | 'vulnerability_analysis'
  | 'password_attacks'
  | 'wireless_attacks'
  | 'exploitation'
  | 'digital_forensics'
  | 'reverse_engineering'
  | 'malware_analysis'
  | 'traffic_analysis'
  | 'cloud_security'
  | 'active_directory'
  | 'defensive_security'
  | 'siem_monitoring'
  | 'linux_admin'
  | 'cryptography'
  // Backward compatibility aliases
  | 'network_scanning'
  | 'sniffing_spoofing'
  | 'post_exploitation'
  | 'forensics_defense'
  | 'reporting'
  | 'reporting_tools';

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type ToolDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface ToolCommandExample {
  id?: string;
  command: string;
  category: string;
  difficulty: ToolDifficulty;
  description: string;
  explanation: string;
  title?: string;
  requiredParameters?: string[];
  safeTarget?: string;
  authorizedWarning?: string;
  docsReference?: string;
  flagsExplained?: { flag: string; meaning: string }[];
  expectedOutput?: string;
  commonMistakes?: string;
  relatedCommands?: string[];
  isSafeForLab?: boolean;
}

export interface TroubleshootingItem {
  error: string;
  cause: string;
  solution: string;
}

export interface SafeLabExercise {
  title: string;
  objective: string;
  commandToRun: string;
  expectedResult: string;
}

export interface KaliTool {
  id: string;
  name: string;
  category: ToolCategory;
  subcategory?: string;
  purpose?: string;
  description: string;
  shortDescription: string;
  descriptionUr?: string;
  descriptionRomanUr?: string;
  installationMethod?: string;
  supportedOS?: ('Kali Linux' | 'Debian/Ubuntu' | 'Arch Linux' | 'Fedora/RHEL' | 'macOS' | 'Windows')[];
  syntax: string;
  parameterExplanations?: {
    param: string;
    explanation: string;
  }[];
  safeCommands: {
    command: string;
    description: string;
    explanation: string;
  }[];
  commandCategories?: string[];
  commandLibrary?: ToolCommandExample[];
  troubleshooting?: TroubleshootingItem[];
  labExercises?: SafeLabExercise[];
  prerequisites?: string[];
  difficulty?: ToolDifficulty;
  relatedTools?: string[];
  officialDocsUrl?: string;
  defensiveUseCase: string;
  tags: string[];
  riskLevel?: RiskLevel;
}

export type LabDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type LabCategory =
  | 'Linux & Systems'
  | 'Network Reconnaissance'
  | 'Web Application Security'
  | 'Cryptography & Passwords'
  | 'Packet & Traffic Analysis'
  | 'Defensive Monitoring & IDS'
  | 'Forensics & Malware Triage'
  | 'Incident Response & Auditing'
  | 'Linux Privilege & Auditing'
  | 'Web Security'
  | 'Database & Application Security'
  | 'Network Defense & Intrusion Detection'
  | 'Digital Forensics & Incident Response'
  | 'SOC Analyst & Threat Detection'
  | 'Vulnerability Management';

export interface LabObjective {
  id: string;
  title: string;
  completed?: boolean;
}

export interface PracticeLab {
  id: string;
  title: string;
  category: LabCategory | string;
  difficulty: LabDifficulty;
  estimatedMinutes: number;
  xpReward: number;
  overview: string;
  background?: string;
  prerequisites?: string[];
  targetEnvironment: string;
  authorizationNotice: string;
  detailedSteps?: string[];
  objectives: LabObjective[];
  hints: string[];
  flag: string;
  simulatedTerminal: {
    initialPrompt: string;
    filesystemHint?: string;
    availableCommands: Record<string, string>;
  };
  defensiveTakeaway: string;
  solutionExplanation?: string;
}

export interface LessonQuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex?: number;
  correctIndex?: number;
  explanation: string;
}

export interface RoadmapLesson {
  id: string;
  phaseId?: string | number;
  lessonNumber?: number;
  title: string;
  estimatedMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'beginner' | 'intermediate' | 'advanced';
  prerequisites?: string[];
  theory: string;
  steps?: string[];
  stepByStep?: string[];
  commands?: {
    command?: string;
    cmd?: string;
    explanation: string;
  }[];
  practicalExample: string;
  exercise: string;
  expectedResult: string;
  knowledgeCheck: LessonQuizQuestion | LessonQuizQuestion[];
}

export interface RoadmapPhase {
  id: string | number;
  phaseNumber?: number;
  title: string;
  badge: string;
  description: string;
  targetRole?: string;
  level: string;
  lessons: RoadmapLesson[];
}

export interface SecurityReport {
  id: string;
  title: string;
  date: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';
  asset: string;
  cveOrCwe: string;
  cvssScore: number;
  description: string;
  impact: string;
  stepsToReproduce: string;
  remediation: string;
  status: 'Draft' | 'Validated' | 'Remediated';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  isDemo?: boolean;
  category?: string;
}

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  type: 'lab_complete' | 'lesson_complete' | 'tool_view' | 'report_generated' | 'lab_completed' | 'lesson_completed' | 'tool_bookmarked' | 'report_saved';
  title: string;
  description?: string;
  xpAwarded?: number;
  xpEarned?: number;
}

export interface UserProgress {
  xp: number;
  level: number;
  completedLabs: string[];
  bookmarkedTools: string[];
  recentlyViewedTools?: string[];
  completedLessons?: string[];
  completedMilestones?: string[];
  streakDays: number;
  lastActive: string;
  savedReports: SecurityReport[];
  activityLogs?: ActivityLogItem[];
  activityLog?: ActivityLogItem[];
  userHandle?: string;
  avatarSeed?: string;
  completedTrainingLessons?: string[];
  completedTrainingCheckpoints?: Record<string, string[]> | any;
  trainingNotes?: Record<string, string>;
  portfolioProjects?: string[];
}

export interface SubnetCalculationResult {
  ip: string;
  cidr: number;
  netmask: string;
  networkAddress: string;
  broadcastAddress: string;
  firstUsable: string;
  lastUsable: string;
  totalHosts: number;
  usableHosts: number;
  wildcardMask: string;
  ipClass: string;
  scope: string;
  binaryNetmask: string;
}

export type SubnetResult = SubnetCalculationResult;

export interface DnsRecordItem {
  type: string;
  name: string;
  value: string;
  ttl: number;
  description?: string;
}

export type DnsRecordResult = DnsRecordItem;

export interface HeaderAuditFinding {
  header: string;
  present: boolean;
  value?: string;
  status: 'pass' | 'warning' | 'missing';
  impact: string;
  recommendation: string;
}

export interface HeaderAnalysisResult {
  score: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  findings: HeaderAuditFinding[];
}
