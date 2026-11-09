import { Language } from '../types/cyber';

export interface Translations {
  appName: string;
  tagline: string;
  subtitle: string;
  nav: {
    dashboard: string;
    tools: string;
    learning: string;
    commandExplorer: string;
    kaliTerminal: string;
    webLabs: string;
    vmLabs: string;
    mentor: string;
    reports: string;
    portfolio: string;
    leaderboard: string;
    settings: string;
    labs?: string;
    roadmap?: string;
    utilities?: string;
    bridge?: string;
  };
  dashboard: {
    welcome: string;
    subheading: string;
    level: string;
    xp: string;
    streak: string;
    labsCompleted: string;
    toolsExplored: string;
    defenseReadiness: string;
    quickLaunch: string;
    continueLab: string;
    recommendedLessons: string;
    dailyChallenge: string;
    dailyChallengeDesc: string;
    startChallenge: string;
    recentActivity: string;
    terminalTitle: string;
  };
  mentor: {
    title: string;
    subtitle: string;
    liveMode: string;
    demoMode: string;
    inputPlaceholder: string;
    send: string;
    clearChat: string;
    disclaimer: string;
    demoNotice: string;
    suggestedQuestions: string;
    analyzing: string;
    logAnalyzerTab: string;
    chatTab: string;
    analyzeBtn: string;
    logPlaceholder: string;
  };
  tools: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    allCategories: string;
    riskLevel: string;
    safeCommands: string;
    defensiveUseCase: string;
    copyCommand: string;
    copied: string;
    officialDocs: string;
    bookmark: string;
    bookmarkedOnly: string;
    toolsCount: string;
    tryInLab: string;
  };
  labs: {
    title: string;
    subtitle: string;
    beginner: string;
    intermediate: string;
    advanced: string;
    startLab: string;
    resumeLab: string;
    completed: string;
    objectives: string;
    hints: string;
    showHint: string;
    flagInputPlaceholder: string;
    submitFlag: string;
    correctFlag: string;
    incorrectFlag: string;
    terminalHeader: string;
    defensiveTakeaway: string;
    simulationNotice: string;
    resetLab: string;
  };
  roadmap: {
    title: string;
    subtitle: string;
    skills: string;
    recommendedCerts: string;
    markCompleted: string;
    completed: string;
    targetRole: string;
  };
  utilities: {
    title: string;
    subtitle: string;
    encoderDecoder: string;
    hasher: string;
    passwordEntropy: string;
    reportGenerator: string;
    encode: string;
    decode: string;
    input: string;
    output: string;
    copy: string;
    hashType: string;
    calculateHash: string;
    entropyScore: string;
    passwordStrength: string;
    generateReport: string;
  };
  reports: {
    title: string;
    subtitle: string;
    savedReports: string;
    completedLabsAudit: string;
    exportMarkdown: string;
    exportJson: string;
    noReports: string;
    createReport: string;
    severity: string;
  };
  settings: {
    title: string;
    subtitle: string;
    language: string;
    soundEffects: string;
    soundEffectsDesc: string;
    aiStatus: string;
    aiStatusLive: string;
    aiStatusOffline: string;
    clearData: string;
    clearDataConfirm: string;
    about: string;
    version: string;
    ethicalDisclaimer: string;
  };
  common: {
    search: string;
    filter: string;
    close: string;
    save: string;
    cancel: string;
    viewDetails: string;
    copySuccess: string;
    authorizedOnly: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'RAFAY HACKING LAB',
    tagline: 'LEARN • PRACTICE • MASTER',
    subtitle: 'Professional Cybersecurity Learning Platform',
    nav: {
      dashboard: 'Dashboard',
      tools: '500 Tools',
      learning: 'Learning Center',
      commandExplorer: 'Command Explorer',
      kaliTerminal: 'Kali Terminal',
      webLabs: 'Web Labs',
      vmLabs: 'VM Labs',
      mentor: 'AI Mentor',
      reports: 'Projects & Reports',
      portfolio: 'Portfolio',
      leaderboard: 'Leaderboard',
      settings: 'Settings',
      labs: 'Web Labs',
      roadmap: 'Learning Center',
      utilities: 'Security Utilities',
      bridge: 'Kali Terminal',
    },
    dashboard: {
      welcome: 'Security Operations & Learning Console',
      subheading: 'Master authorized penetration testing, vulnerability assessment, and cyber defense in a safe virtual sandbox.',
      level: 'Analyst Level',
      xp: 'Earned XP',
      streak: 'Day Streak',
      labsCompleted: 'Labs Completed',
      toolsExplored: 'Tools Mastered',
      defenseReadiness: 'Defense Readiness',
      quickLaunch: 'Quick Terminal Launcher',
      continueLab: 'Resume Active Lab',
      recommendedLessons: 'Recommended Next Modules',
      dailyChallenge: 'Daily Defense Challenge',
      dailyChallengeDesc: 'Audit an Apache vhost configuration to identify missing HSTS and insecure SSL cipher suites.',
      startChallenge: 'Start Simulation',
      recentActivity: 'Recent Security Activities',
      terminalTitle: 'kali-sandbox@cyber-ai-lab:~$',
    },
    mentor: {
      title: 'AI Cyber Mentor',
      subtitle: 'Ask technical questions about Kali tools, penetration testing methodologies, log analysis, and safe vulnerability remediation.',
      liveMode: 'Gemini 3.8 Flash (Live Server)',
      demoMode: 'Offline Cyber Knowledge Base',
      inputPlaceholder: 'Ask about a Kali tool, attack vector, defense strategy, or CTF hint...',
      send: 'Transmit',
      clearChat: 'Clear History',
      disclaimer: 'Strictly for authorized education, defensive hardening, and lab simulations. Never target systems without explicit authorization.',
      demoNotice: 'Running in Offline Knowledge Base mode. To enable Live Gemini 3.8 Flash, configure GEMINI_API_KEY in the Secrets panel.',
      suggestedQuestions: 'Preset Inquiries & Topics',
      analyzing: 'AI Mentor is processing query...',
      logAnalyzerTab: 'Security Log & Rule Analyzer',
      chatTab: 'Conversational Mentor',
      analyzeBtn: 'Analyze Log / Header / Rule',
      logPlaceholder: 'Paste raw access log, Snort rule, HTTP response headers, or Nmap output here...',
    },
    tools: {
      title: 'Kali Tool Explorer',
      subtitle: 'Curated index of essential Kali Linux utilities with safe example commands, syntax flags, and defensive applications.',
      searchPlaceholder: 'Search tools by name, flag, or keyword (e.g., nmap, hashcat, brute force)...',
      allCategories: 'All Categories',
      riskLevel: 'Risk Level',
      safeCommands: 'Safe Example Commands',
      defensiveUseCase: 'Defensive & Audit Application',
      copyCommand: 'Copy Command',
      copied: 'Command Copied!',
      officialDocs: 'Kali Documentation',
      bookmark: 'Bookmark Tool',
      bookmarkedOnly: 'Bookmarked',
      toolsCount: 'Curated Tools Available',
      tryInLab: 'Practice in Lab',
    },
    labs: {
      title: 'Hands-on Practice Labs',
      subtitle: 'Safe, simulated environments to practice real-world recon, vulnerability discovery, cryptographic analysis, and defensive patching.',
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced',
      startLab: 'Launch Lab',
      resumeLab: 'Continue Lab',
      completed: 'Completed',
      objectives: 'Mission Objectives',
      hints: 'Security Clearance Hints',
      showHint: 'Reveal Hint',
      flagInputPlaceholder: 'Enter captured flag (e.g. FLAG{...})',
      submitFlag: 'Submit Flag',
      correctFlag: 'Challenge Solved! Flag Accepted.',
      incorrectFlag: 'Invalid Flag. Review command output and objectives.',
      terminalHeader: 'Virtual Sandboxed Shell (No real network egress)',
      defensiveTakeaway: 'Defensive Mitigation & Takeaway',
      simulationNotice: 'All targets are virtual simulations. No live network packets leave this sandbox.',
      resetLab: 'Reset Terminal',
    },
    roadmap: {
      title: 'Cybersecurity Learning Roadmap',
      subtitle: 'Structured pathways from junior analyst to certified red-team operator and cloud defense architect.',
      skills: 'Core Competencies',
      recommendedCerts: 'Industry Certifications',
      markCompleted: 'Mark Milestone Complete',
      completed: 'Completed',
      targetRole: 'Target Career Role',
    },
    utilities: {
      title: 'Security Utilities Suite',
      subtitle: 'Client-side cryptographic hashing, encoding/decoding, password entropy scoring, and penetration test report generation.',
      encoderDecoder: 'Encoder / Decoder',
      hasher: 'Crypto Hash Generator & Check',
      passwordEntropy: 'Password Entropy Calculator',
      reportGenerator: 'Security Report Generator',
      encode: 'Encode',
      decode: 'Decode',
      input: 'Input Text / Payload',
      output: 'Output Result',
      copy: 'Copy to Clipboard',
      hashType: 'Algorithm',
      calculateHash: 'Generate Hashes',
      entropyScore: 'Entropy (Bits)',
      passwordStrength: 'Resistance Evaluation',
      generateReport: 'Generate & Save Report',
    },
    reports: {
      title: 'Security Reports & Audits',
      subtitle: 'Exportable penetration testing findings, lab completion audits, and compliance documentation.',
      savedReports: 'Saved Vulnerability Reports',
      completedLabsAudit: 'Lab Completion Audit Log',
      exportMarkdown: 'Export as Markdown',
      exportJson: 'Export as JSON',
      noReports: 'No vulnerability reports created yet. Use the Security Utilities suite to create one.',
      createReport: 'Create New Finding',
      severity: 'Severity',
    },
    settings: {
      title: 'Platform Settings',
      subtitle: 'Configure language, sound fx, terminal aesthetics, and AI integration status.',
      language: 'Interface Language',
      soundEffects: 'Terminal Audio Feedback',
      soundEffectsDesc: 'Subtle retro terminal keystroke blips and success alerts (synthesized via Web Audio API).',
      aiStatus: 'AI Mentor Engine Status',
      aiStatusLive: 'Gemini 3.8 Flash Active via Server Proxy',
      aiStatusOffline: 'Running in High-Fidelity Local Knowledge Mode',
      clearData: 'Reset Local Learning Data',
      clearDataConfirm: 'Are you sure you want to reset your lab progress, bookmarks, and reports? This cannot be undone.',
      about: 'About RAFAY HACKING LAB',
      version: 'Version 2.4.0 (Enterprise Cyber Education Edition)',
      ethicalDisclaimer: 'Authorized Educational Use Only: All tools, commands, and exercises in this platform are designed strictly for authorized penetration testing, academic study, and defensive posture hardening. Scanning, probing, or exploiting unauthorized systems is illegal.',
    },
    common: {
      search: 'Search...',
      filter: 'Filter',
      close: 'Close',
      save: 'Save',
      cancel: 'Cancel',
      viewDetails: 'View Details',
      copySuccess: 'Copied!',
      authorizedOnly: 'Authorized Sandbox Only',
    },
  },
  ur: {
    appName: 'رافع ہیکنگ لیب',
    tagline: 'سیکھیں • مشق کریں • مہارت حاصل کریں',
    subtitle: 'پیشہ ورانہ سائبر سیکیورٹی تعلیمی پلیٹ فارم',
    nav: {
      dashboard: 'ڈیش بورڈ',
      tools: '500 ٹولز',
      learning: 'لرننگ سینٹر',
      commandExplorer: 'کمانڈ ایکسپلورر',
      kaliTerminal: 'کالی ٹرمینل',
      webLabs: 'ویب لیبز',
      vmLabs: 'وی ایم لیبز',
      mentor: 'اے آئی مینٹور',
      reports: 'پراجیکٹس اور رپورٹس',
      portfolio: 'پورٹ فولیو',
      leaderboard: 'لیڈر بورڈ',
      settings: 'ترتیبات',
      labs: 'ویب لیبز',
      roadmap: 'لرننگ سینٹر',
      utilities: 'سیکیورٹی یوٹیلیٹیز',
      bridge: 'کالی ٹرمینل',
    },
    dashboard: {
      welcome: 'سیکیورٹی آپریشنز اور لرننگ کنسول',
      subheading: 'محفوظ ورچوئل سینڈ باکس میں اخلاقی ہیکنگ، کمزوریوں کے تجزئیے اور سائبر دفاع میں مہارت حاصل کریں۔',
      level: 'سیکیورٹی لیول',
      xp: 'حاصل شدہ پوائنٹس',
      streak: 'مسلسل دن',
      labsCompleted: 'مکمل شدہ لیبز',
      toolsExplored: 'سیکھے گئے ٹولز',
      defenseReadiness: 'دفاعی تیاری',
      quickLaunch: 'کوئیک ٹرمینل لانچر',
      continueLab: 'جاری لیب مکمل کریں',
      recommendedLessons: 'تجویز کردہ اسباق',
      dailyChallenge: 'روزانہ کا سائبر چیلنج',
      dailyChallengeDesc: 'اپاچی سرور کنفیگریشن کا آڈٹ کریں اور سیکیورٹی خامیاں تلاش کریں۔',
      startChallenge: 'چیلنج شروع کریں',
      recentActivity: 'حالیہ سیکیورٹی سرگرمیاں',
      terminalTitle: 'kali-sandbox@cyber-ai-lab:~$',
    },
    mentor: {
      title: 'اے آئی سائبر مینٹور',
      subtitle: 'کالی ٹولز، پینیٹریشن ٹیسٹنگ، لاگ تجزیہ اور سیکیورٹی سدھار کے بارے میں سوالات پوچھیں۔',
      liveMode: 'جیمینائی 3.8 فلیش (لائیو سرور)',
      demoMode: 'آف لائن سائبر نالج بیس',
      inputPlaceholder: 'کالی ٹول، حملہ یا دفاعی حکمت عملی کے بارے میں سوال لکھیں...',
      send: 'ارسال کریں',
      clearChat: 'چیٹ صاف کریں',
      disclaimer: 'صرف اور صرف مجاز تعلیمی اور دفاعی مقاصد کے لیے۔ بغیر اجازت کسی سسٹم کو ہدف نہ بنائیں۔',
      demoNotice: 'آف لائن نالج بیس موڈ فعال ہے۔ لائیو جیمینائی فعال کرنے کے لیے سیکرٹس پینل میں GEMINI_API_KEY شامل کریں۔',
      suggestedQuestions: 'عام سوالات اور موضوعات',
      analyzing: 'مینٹور جواب تیار کر رہا ہے...',
      logAnalyzerTab: 'لاگ اور رولز کا تجزیہ',
      chatTab: 'گفتگو مینٹور',
      analyzeBtn: 'لاگ کا تجزیہ کریں',
      logPlaceholder: 'یہاں سرور لاگ، سنورٹ رول یا این میپ آؤٹ پٹ چسپاں کریں...',
    },
    tools: {
      title: 'کالی ٹولز ایکسپلورر',
      subtitle: 'کالی لینکس کے لازمی ٹولز کی جامع فہرست بمعہ محفوظ کمانڈز، وضاحتیں اور دفاعی استعمال۔',
      searchPlaceholder: 'ٹول کا نام یا کمانڈ تلاش کریں (مثال: nmap, hashcat)...',
      allCategories: 'تمام کیٹیگریز',
      riskLevel: 'خطرہ کی سطح',
      safeCommands: 'محفوظ مثالی کمانڈز',
      defensiveUseCase: 'دفاعی اور آڈٹ استعمال',
      copyCommand: 'کمانڈ کاپی کریں',
      copied: 'کمانڈ کاپی ہو گئی!',
      officialDocs: 'کالی دستاویزات',
      bookmark: 'بک مارک کریں',
      bookmarkedOnly: 'بک مارک شدہ',
      toolsCount: 'دستیاب مستند ٹولز',
      tryInLab: 'لیب میں آزمائیں',
    },
    labs: {
      title: 'عملی پریکٹس لیبز',
      subtitle: 'محفوظ سیمولیشن ماحول جہاں آپ نیٹ ورک اسکیننگ، خامیوں کی نشاندہی اور کرپٹوگرافی کی مشق کر سکتے ہیں۔',
      beginner: 'ابتدائی',
      intermediate: 'درمیانی',
      advanced: 'اعلیٰ',
      startLab: 'لیب شروع کریں',
      resumeLab: 'لیب جاری رکھیں',
      completed: 'مکمل',
      objectives: 'مشن کے مقاصد',
      hints: 'رہنمائی اور اشارے',
      showHint: 'اشارہ ظاہر کریں',
      flagInputPlaceholder: 'حاصل شدہ فلیگ درج کریں (مثال: FLAG{...})',
      submitFlag: 'فلیگ جمع کریں',
      correctFlag: 'شاباش! فلیگ درست ہے اور لیب مکمل ہو گئی۔',
      incorrectFlag: 'غلط فلیگ! کمانڈ کے آؤٹ پٹ کا دوبارہ جائزہ لیں۔',
      terminalHeader: 'ورچوئل ٹرمینل کنسول (محفوظ سینڈ باکس)',
      defensiveTakeaway: 'دفاعی سبق اور تدارک',
      simulationNotice: 'یہ تمام ٹارگٹس ورچوئل سیمولیشن ہیں۔ اس لیب سے باہر کوئی ٹریفک نہیں جاتی۔',
      resetLab: 'ٹرمینل ری سیٹ کریں',
    },
    roadmap: {
      title: 'سائبر سیکیورٹی تعلیمی روڈ میپ',
      subtitle: 'ابتدائی اینالسٹ سے سرٹیفائیڈ ایتھیکل ہیکر اور کلاؤڈ سیکیورٹی آرکیٹیکٹ تک کا راستہ۔',
      skills: 'اہم مہارتیں',
      recommendedCerts: 'تجویز کردہ اسناد',
      markCompleted: 'مکمل شدہ نشان زد کریں',
      completed: 'مکمل شدہ',
      targetRole: 'کیریئر ٹارگٹ',
    },
    utilities: {
      title: 'سیکیورٹی یوٹیلیٹیز سوٹ',
      subtitle: 'براؤزر میں کرپٹوگرافک ہیشنگ، ٹیکسٹ انکوڈنگ، پاس ورڈ مضبوطی اور پینٹیسٹ رپورٹ جنریٹر۔',
      encoderDecoder: 'انکوڈر / ڈیکوڈر',
      hasher: 'کرپٹو ہیش جنریٹر',
      passwordEntropy: 'پاس ورڈ طاقت اور اینٹروپی',
      reportGenerator: 'سیکیورٹی رپورٹ جنریٹر',
      encode: 'انکوڈ کریں',
      decode: 'ڈیکوڈ کریں',
      input: 'ان پٹ ٹیکسٹ',
      output: 'حاصل شدہ آؤٹ پٹ',
      copy: 'کاپی کریں',
      hashType: 'الگورتھم',
      calculateHash: 'ہیش بنائیں',
      entropyScore: 'اینٹروپی (بٹس)',
      passwordStrength: 'مضبوطی کی جانچ',
      generateReport: 'رپورٹ بنائیں اور محفوظ کریں',
    },
    reports: {
      title: 'سیکیورٹی رپورٹس اور آڈٹ',
      subtitle: 'پینیٹریشن ٹیسٹنگ کے نتائج، مکمل شدہ لیب ریکارڈز اور تفصیلی سیکیورٹی دستاویزات۔',
      savedReports: 'محفوظ شدہ سیکیورٹی رپورٹس',
      completedLabsAudit: 'مکمل شدہ لیبز کا ریکارڈ',
      exportMarkdown: 'مارک ڈاؤن میں ایکسپورٹ کریں',
      exportJson: 'جے ایس او این میں ایکسپورٹ کریں',
      noReports: 'ابھی تک کوئی رپورٹ نہیں بنائی گئی۔ سیکیورٹی یوٹیلیٹیز میں نئی رپورٹ بنائیں۔',
      createReport: 'نئی خامی درج کریں',
      severity: 'شدت',
    },
    settings: {
      title: 'پلیٹ فارم کی ترتیبات',
      subtitle: 'زبان، ٹرمینل کی آواز، تھیم اور اے آئی انجن کی حیثیت کی ترتیبات۔',
      language: 'زبان منتخب کریں',
      soundEffects: 'ٹرمینل آڈیو فیڈ بیک',
      soundEffectsDesc: 'ٹائپنگ کے دوران ہلکی ٹرمینل آوازیں اور کامیابی پر بیپ۔',
      aiStatus: 'اے آئی مینٹور کی صورتحال',
      aiStatusLive: 'جیمینائی 3.8 فلیش فعال ہے',
      aiStatusOffline: 'آف لائن ہائی فیڈلٹی نالج موڈ',
      clearData: 'تمام ڈیٹا ری سیٹ کریں',
      clearDataConfirm: 'کیا آپ واقعی اپنی تمام ترقی اور رپورٹس ختم کرنا چاہتے ہیں؟',
      about: 'سائبر اے آئی لیب کے متعلق',
      version: 'ورژن 2.4.0 (تعلیمی ایڈیشن)',
      ethicalDisclaimer: 'اخلاقی و قانونی انتباہ: اس پلیٹ فارم کے تمام ٹولز اور اسباق صرف قانونی تعلیمی مشق اور دفاعی تیاری کے لیے ہیں۔ غیر مجاز نظاموں کو ہیک کرنا جرم ہے۔',
    },
    common: {
      search: 'تلاش کریں...',
      filter: 'فلٹر',
      close: 'بند کریں',
      save: 'محفوظ کریں',
      cancel: 'منسوخ کریں',
      viewDetails: 'تفصیلات دیکھیں',
      copySuccess: 'کاپی ہو گیا!',
      authorizedOnly: 'صرف مجاز سینڈ باکس',
    },
  },
  roman_ur: {
    appName: 'RAFAY HACKING LAB',
    tagline: 'LEARN • PRACTICE • MASTER',
    subtitle: 'Professional Cybersecurity Learning Platform',
    nav: {
      dashboard: 'Dashboard',
      tools: '500 Tools',
      learning: 'Learning Center',
      commandExplorer: 'Command Explorer',
      kaliTerminal: 'Kali Terminal',
      webLabs: 'Web Labs',
      vmLabs: 'VM Labs',
      mentor: 'AI Mentor',
      reports: 'Projects & Reports',
      portfolio: 'Portfolio',
      leaderboard: 'Leaderboard',
      settings: 'Settings',
      labs: 'Web Labs',
      roadmap: 'Learning Center',
      utilities: 'Security Utilities',
      bridge: 'Kali Terminal',
    },
    dashboard: {
      welcome: 'Security Operations & Learning Console',
      subheading: 'Mahfooz virtual sandbox mein ethical hacking, vulnerability assessment aur cyber defense seekhein.',
      level: 'Analyst Level',
      xp: 'Kamaaye gaye XP',
      streak: 'Streak Days',
      labsCompleted: 'Labs Mukammal',
      toolsExplored: 'Tools Master Kiye',
      defenseReadiness: 'Defense Tayyari',
      quickLaunch: 'Quick Terminal Launcher',
      continueLab: 'Adhoori Lab Continue Karein',
      recommendedLessons: 'Agley Asbaaq',
      dailyChallenge: 'Aaj Ka Cyber Challenge',
      dailyChallengeDesc: 'Apache web server ki configuration audit karein aur missing security headers talaash karein.',
      startChallenge: 'Challenge Shuru Karein',
      recentActivity: 'Haaliya Security Sargarmiyan',
      terminalTitle: 'kali-sandbox@cyber-ai-lab:~$',
    },
    mentor: {
      title: 'AI Cyber Mentor',
      subtitle: 'Kali tools, penetration testing, logs analysis aur safe patching ke mutaliq sawal poochein.',
      liveMode: 'Gemini 3.8 Flash (Live Server)',
      demoMode: 'Offline Cyber Knowledge Base',
      inputPlaceholder: 'Kisi tool, attack ya defense ke baray mein poochein...',
      send: 'Bhejein',
      clearChat: 'Chat Saaf Karein',
      disclaimer: 'Sirf authorized education aur defensive security ke liye. Kisi unauthorised system par use na karein.',
      demoNotice: 'Abhi Offline Knowledge Base chal raha hai. Live Gemini enable karne ke liye Secrets panel mein GEMINI_API_KEY add karein.',
      suggestedQuestions: 'Ahem Sawalat & Mauzuaat',
      analyzing: 'AI Mentor jawab tayyar kar raha hai...',
      logAnalyzerTab: 'Security Log & Rule Analyzer',
      chatTab: 'Chat Mentor',
      analyzeBtn: 'Log Ka Tajziya Karein',
      logPlaceholder: 'Yahan raw server log, snort rule ya nmap output paste karein...',
    },
    tools: {
      title: 'Kali Tool Explorer',
      subtitle: 'Kali Linux ke zaroori tools ki fehrist safe commands, syntax flags aur defensive use cases ke sath.',
      searchPlaceholder: 'Tool ka naam ya keyword search karein (maslan nmap, hashcat)...',
      allCategories: 'Tamam Categories',
      riskLevel: 'Khatray Ka Level',
      safeCommands: 'Safe Example Commands',
      defensiveUseCase: 'Defensive & Audit Istemal',
      copyCommand: 'Command Copy Karein',
      copied: 'Command Copy Ho Gayi!',
      officialDocs: 'Kali Documentation',
      bookmark: 'Bookmark Karein',
      bookmarkedOnly: 'Sirf Bookmarked',
      toolsCount: 'Curated Tools Maujood',
      tryInLab: 'Lab Mein Check Karein',
    },
    labs: {
      title: 'Hands-on Practice Labs',
      subtitle: 'Mahfooz simulated environments jahan aap network recon, vulnerability hunt aur crypto cracking practice kar sakte hain.',
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced',
      startLab: 'Lab Shuru Karein',
      resumeLab: 'Lab Jari Rakhein',
      completed: 'Mukammal',
      objectives: 'Mission Objectives',
      hints: 'Madadgar Hints',
      showHint: 'Hint Dekhein',
      flagInputPlaceholder: 'Hasil shuda flag enter karein (maslan FLAG{...})',
      submitFlag: 'Flag Submit Karein',
      correctFlag: 'Zabardast! Flag theek hai aur lab mukammal ho gayi.',
      incorrectFlag: 'Ghalat flag. Command output dobara ghaur se dekhein.',
      terminalHeader: 'Virtual Sandboxed Shell (Real network egress nahi hai)',
      defensiveTakeaway: 'Defensive Sabaq & Hal',
      simulationNotice: 'Ye tamam targets simulated hain. Koi live traffic bahir nahi jati.',
      resetLab: 'Terminal Reset Karein',
    },
    roadmap: {
      title: 'Cybersecurity Learning Roadmap',
      subtitle: 'Junior analyst se certified ethical hacker aur cloud defense architect tak ka complete path.',
      skills: 'Zaroori Maharatain',
      recommendedCerts: 'Recommended Certifications',
      markCompleted: 'Mukammal Mark Karein',
      completed: 'Mukammal',
      targetRole: 'Target Career Role',
    },
    utilities: {
      title: 'Security Utilities Suite',
      subtitle: 'Browser-based cryptographic hashing, encoding/decoding, password strength test aur pentest report generator.',
      encoderDecoder: 'Encoder / Decoder',
      hasher: 'Crypto Hash Generator',
      passwordEntropy: 'Password Entropy Check',
      reportGenerator: 'Security Report Generator',
      encode: 'Encode Karein',
      decode: 'Decode Karein',
      input: 'Input Text',
      output: 'Nateeja Output',
      copy: 'Copy Karein',
      hashType: 'Algorithm',
      calculateHash: 'Hash Calculate Karein',
      entropyScore: 'Entropy (Bits)',
      passwordStrength: 'Strength Evaluation',
      generateReport: 'Report Banayein & Save Karein',
    },
    reports: {
      title: 'Security Reports & Audits',
      subtitle: 'Penetration testing findings, lab audit logs aur downloadable documentation.',
      savedReports: 'Saved Security Reports',
      completedLabsAudit: 'Completed Labs Ka Audit Log',
      exportMarkdown: 'Markdown Export Karein',
      exportJson: 'JSON Export Karein',
      noReports: 'Abhi tak koi report nahi banayi gayi. Utilities section se nayi report banayein.',
      createReport: 'Nayi Report Banayein',
      severity: 'Shiddat (Severity)',
    },
    settings: {
      title: 'Platform Settings',
      subtitle: 'Zuban, terminal audio feedback, theme aur AI engine ki settings.',
      language: 'Language Muntakhib Karein',
      soundEffects: 'Terminal Sound Effects',
      soundEffectsDesc: 'Keystroke click sounds aur lab complete hone par subtle alert (Web Audio API).',
      aiStatus: 'AI Mentor Engine Status',
      aiStatusLive: 'Gemini 3.8 Flash Active Hai',
      aiStatusOffline: 'High-Fidelity Offline Knowledge Base Mode',
      clearData: 'Local Learning Data Reset Karein',
      clearDataConfirm: 'Kya aap waqayi apna progress aur saved reports clear karna chahte hain?',
      about: 'RAFAY HACKING LAB Ke Baaray Mein',
      version: 'Version 2.4.0 (Educational Edition)',
      ethicalDisclaimer: 'Qanooni Hidayat: Is platform ke tamam tools aur labs sirf authorised learning aur defensive training ke liye hain. Kisi ki ijazat ke baghair attack karna jurm hai.',
    },
    common: {
      search: 'Search karein...',
      filter: 'Filter',
      close: 'Band karein',
      save: 'Save karein',
      cancel: 'Cancel',
      viewDetails: 'Tafseelat Dekhein',
      copySuccess: 'Copy Ho Gaya!',
      authorizedOnly: 'Sirf Authorized Sandbox',
    },
  },
};
