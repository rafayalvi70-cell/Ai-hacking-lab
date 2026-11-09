/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TrainingTrackLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type TrainingSectionId =
  | 'courses'
  | 'command-lab'
  | 'web-labs'
  | 'vm-setup'
  | 'freelance'
  | 'portfolio';

export interface TrainingCommandExample {
  command: string;
  expectedOutput: string;
  explanation: string;
  flagsBreakdown: { flag: string; purpose: string }[];
}

export interface TrainingQuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface TrainingCheckpoint {
  id: string;
  task: string;
  verificationHint: string;
}

export interface TrainingLesson {
  id: string;
  courseId: string;
  trackLevel: TrainingTrackLevel;
  title: string;
  estimatedMinutes: number;
  prerequisites: string[];
  learningObjectives: string[];
  overview: string;
  theory: string;
  architectureDiagram?: string;
  commandExamples: TrainingCommandExample[];
  handsOnExercise: string;
  checkpoints: TrainingCheckpoint[];
  hints: string[];
  answerExplanation: string;
  xpReward: number;
  quiz: TrainingQuizQuestion[];
}

export interface TrainingCourse {
  id: string;
  title: string;
  trackLevel: TrainingTrackLevel;
  badge: string;
  description: string;
  targetRole: string;
  lessons: TrainingLesson[];
}

export interface CommandLabPreset {
  id: string;
  name: string;
  tool: string;
  category: 'Network Recon' | 'Web Assessment' | 'Password Auditing' | 'Traffic Analysis' | 'Host Privilege';
  command: string;
  simulatedOutput: string;
  explanation: string;
  lineByLineExplanation: { linePattern: string; commentary: string }[];
  defensiveTakeaway: string;
  safeAlternatives: string;
}

export interface WebSecurityLabExercise {
  id: string;
  title: string;
  targetPlatform: string;
  targetUrl: string;
  vulnerabilityType: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  learningObjectives: string[];
  scenarioOverview: string;
  detailedSteps: string[];
  hints: string[];
  expectedResult: string;
  remediationCode: { language: string; vulnerableSnippet: string; secureSnippet: string; explanation: string };
  simulatedBrowserAction: {
    requestMethod: 'GET' | 'POST' | 'PUT';
    endpoint: string;
    samplePayload?: string;
    sampleHeaders?: Record<string, string>;
    simulatedResponseCode: number;
    simulatedResponseBody: string;
  };
}

export interface LocalVmStep {
  stepNumber: number;
  title: string;
  objective: string;
  instructions: string[];
  hostCommands?: string[];
  guestCommands?: string[];
  expectedTerminalOutput?: string;
  safetyVerification: string;
}

export interface FreelanceClientBrief {
  id: string;
  title: string;
  clientName: string;
  clientIndustry: string;
  scopeOfWork: {
    inScope: string[];
    outOfScope: string[];
    authorizedWindow: string;
    ipRanges: string[];
  };
  rulesOfEngagementNotice: string;
  deliverablesChecklist: string[];
  evidenceChecklist: string[];
  targetVulnerabilities: string[];
  severityGuidelines: string;
  suggestedFeeRange: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  completionDate: string;
  clientOrLabTarget: string;
  executiveSummary: string;
  findingsCount: { critical: number; high: number; medium: number; low: number };
  evidenceArtifacts: string[];
  readmeMarkdown: string;
  status: 'Verified' | 'In Progress';
}
