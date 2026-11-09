/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar, PageId } from './components/layout/Sidebar';
import { TopNav } from './components/layout/TopNav';
import { SearchModal } from './components/common/SearchModal';
import { DashboardView } from './components/dashboard/DashboardView';
import { MentorView } from './components/mentor/MentorView';
import { ToolExplorerView } from './components/tools/ToolExplorerView';
import { PracticeLabsView } from './components/labs/PracticeLabsView';
import { RoadmapView } from './components/roadmap/RoadmapView';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';
import { KaliBridgeView } from './components/bridge/KaliBridgeView';
import { CommandExplorerView } from './components/tools/CommandExplorerView';
import { LeaderboardView } from './components/leaderboard/LeaderboardView';
import { ProfileModal } from './components/common/ProfileModal';

// Ultimate Upgrade Modules
import { SmartCommandBuilderView } from './components/tools/SmartCommandBuilderView';
import { ScanResultAnalyzerView } from './components/analyzer/ScanResultAnalyzerView';
import { VirtualVmDashboard } from './components/labs/VirtualVmDashboard';
import { BrowserTerminalView } from './components/labs/BrowserTerminalView';
import { CtfChallengeCenterView } from './components/ctf/CtfChallengeCenterView';
import { BlueTeamCenterView } from './components/blueteam/BlueTeamCenterView';
import { CareerPortfolioView } from './components/portfolio/CareerPortfolioView';
import { KnowledgeBaseView } from './components/knowledge/KnowledgeBaseView';

import { translations } from './data/translations';
import { Language, UserProgress, SecurityReport } from './types/cyber';
import {
  loadUserProgress,
  toggleToolBookmark,
  toggleMilestone,
  resetAllData,
  loadStoredLanguage,
  saveStoredLanguage,
} from './utils/storage';
import { soundEffects } from './utils/audio';

// Helper to parse route and target item from window.location.hash
function parseLocationHash(): { page: PageId; targetId?: string } {
  const hash = window.location.hash.replace(/^#\/?/, '').trim();
  if (!hash) return { page: 'dashboard' };

  const parts = hash.split('/');
  const validPages: PageId[] = [
    'dashboard',
    'tools',
    'command_builder',
    'command_explorer',
    'learning',
    'bridge',
    'web_labs',
    'vm_labs',
    'ctf',
    'blueteam',
    'analyzer',
    'mentor',
    'reports',
    'portfolio',
    'knowledge',
    'leaderboard',
    'settings',
    'roadmap',
    'labs',
    'utilities',
  ];

  const pageCandidate = parts[0] as PageId;
  if (validPages.includes(pageCandidate)) {
    return {
      page: pageCandidate,
      targetId: parts[1] || undefined,
    };
  }
  return { page: 'dashboard' };
}

export default function App() {
  const initialRoute = parseLocationHash();
  const [activePage, setActivePage] = useState<PageId>(initialRoute.page);
  const [targetItemId, setTargetItemId] = useState<string | undefined>(initialRoute.targetId);
  const [language, setLanguage] = useState<Language>(() => loadStoredLanguage());
  const [userProgress, setUserProgress] = useState<UserProgress>(() => loadUserProgress());
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAiLive, setIsAiLive] = useState<boolean>(false);

  // Synchronize route with browser history / hashchange
  useEffect(() => {
    const handleHashChange = () => {
      const { page, targetId } = parseLocationHash();
      setActivePage(page);
      setTargetItemId(targetId);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Synchronize document dir and language attribute
  useEffect(() => {
    saveStoredLanguage(language);
    if (language === 'ur') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ur');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', language === 'roman_ur' ? 'en' : 'en');
    }
  }, [language]);

  // Check server health and Gemini API availability
  const checkHealth = async () => {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setIsAiLive(!!data.hasGeminiKey);
      } else {
        setIsAiLive(false);
      }
    } catch {
      setIsAiLive(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  // Global Ctrl+K shortcut
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  const t = translations[language];

  const handleNavigate = (page: PageId, targetId?: string) => {
    soundEffects.playKeyClick();
    const newHash = targetId ? `#/${page}/${targetId}` : `#/${page}`;
    if (window.location.hash !== newHash) {
      window.location.hash = newHash;
    }
    setActivePage(page);
    setTargetItemId(targetId);
  };

  const handleBookmarkToggle = (toolId: string) => {
    toggleToolBookmark(toolId);
    setUserProgress(loadUserProgress());
  };

  const handleMilestoneToggle = (id: string) => {
    toggleMilestone(id);
    setUserProgress(loadUserProgress());
  };

  const handleLabCompleted = (_labId: string, _addedXp: number) => {
    setUserProgress(loadUserProgress());
  };

  const handleReset = () => {
    resetAllData();
    setUserProgress(loadUserProgress());
  };

  return (
    <div className="min-h-screen bg-[#06090e] text-[#e2e8f0] flex flex-col lg:flex-row cyber-grid">
      {/* Sidebar */}
      <Sidebar
        activePage={activePage}
        setActivePage={(page) => handleNavigate(page)}
        t={t}
        userProgress={userProgress}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation */}
        <TopNav
          currentLanguage={language}
          onLanguageChange={setLanguage}
          t={t}
          onOpenSearch={() => setIsSearchOpen(true)}
          onToggleMobileMenu={() => setIsMobileSidebarOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          isAiLive={isAiLive}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
          {activePage === 'dashboard' && (
            <DashboardView
              t={t}
              userProgress={userProgress}
              onNavigate={handleNavigate}
            />
          )}

          {activePage === 'tools' && (
            <ToolExplorerView
              t={t}
              bookmarkedTools={userProgress.bookmarkedTools}
              recentlyViewedTools={userProgress.recentlyViewedTools}
              onToggleBookmark={handleBookmarkToggle}
              onNavigate={handleNavigate}
              selectedToolId={targetItemId}
            />
          )}

          {activePage === 'command_builder' && (
            <SmartCommandBuilderView
              t={t}
              onNavigate={handleNavigate}
            />
          )}

          {(activePage === 'learning' || activePage === 'roadmap') && (
            <RoadmapView
              t={t}
              completedMilestones={userProgress.completedMilestones || []}
              completedLessons={userProgress.completedLessons || []}
              onToggleMilestone={handleMilestoneToggle}
              onLessonCompleted={() => setUserProgress(loadUserProgress())}
              selectedLessonId={targetItemId}
              onNavigate={handleNavigate}
            />
          )}

          {activePage === 'command_explorer' && (
            <CommandExplorerView
              t={t}
              onNavigate={handleNavigate}
              onSelectTool={(toolId) => handleNavigate('tools', toolId)}
            />
          )}

          {activePage === 'browser_terminal' && (
            <BrowserTerminalView
              t={t}
              language={language}
            />
          )}

          {activePage === 'bridge' && (
            <KaliBridgeView
              t={t}
              language={language}
            />
          )}

          {(activePage === 'vm_labs' || activePage === 'web_labs' || activePage === 'labs') && (
            <VirtualVmDashboard
              t={t}
              onNavigate={handleNavigate}
            />
          )}

          {activePage === 'ctf' && (
            <CtfChallengeCenterView
              t={t}
              onNavigate={handleNavigate}
            />
          )}

          {activePage === 'blueteam' && (
            <BlueTeamCenterView
              t={t}
              onNavigate={handleNavigate}
            />
          )}

          {activePage === 'analyzer' && (
            <ScanResultAnalyzerView
              t={t}
              onNavigate={handleNavigate}
            />
          )}

          {activePage === 'mentor' && (
            <MentorView
              t={t}
              language={language}
              isAiLive={isAiLive}
              onRefreshHealth={checkHealth}
              initialPrompt={targetItemId}
            />
          )}

          {activePage === 'reports' && (
            <ReportsView
              t={t}
              userProgress={userProgress}
              onRefreshReports={() => setUserProgress(loadUserProgress())}
              onNavigateToUtilities={() => handleNavigate('analyzer')}
            />
          )}

          {activePage === 'portfolio' && (
            <CareerPortfolioView
              t={t}
              userProgress={userProgress}
            />
          )}

          {activePage === 'knowledge' && (
            <KnowledgeBaseView
              t={t}
              onNavigate={handleNavigate}
            />
          )}

          {activePage === 'leaderboard' && (
            <LeaderboardView
              t={t}
              userProgress={userProgress}
            />
          )}

          {activePage === 'settings' && (
            <SettingsView
              t={t}
              language={language}
              onLanguageChange={setLanguage}
              isAiLive={isAiLive}
              onResetAllData={handleReset}
              onRefreshHealth={checkHealth}
            />
          )}
        </main>
      </div>

      {/* Profile Modal */}
      {isProfileOpen && (
        <ProfileModal
          progress={userProgress}
          onClose={() => setIsProfileOpen(false)}
          onStateUpdated={() => setUserProgress(loadUserProgress())}
        />
      )}

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
        t={t}
      />
    </div>
  );
}
