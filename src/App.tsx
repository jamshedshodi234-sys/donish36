/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { HomeHero } from './components/HomeView/HomeHero';
import { TeacherHub } from './components/TeacherView/TeacherHub';
import { StudentAssistant } from './components/StudentView/StudentAssistant';
import { AIChat } from './components/ChatView/AIChat';
import { ContestDemo } from './components/DemoShowcase/ContestDemo';
import { SchedulePlanner } from './components/WeeklySchedule/SchedulePlanner';
import { ProjectDocs } from './components/OfficialDocs/ProjectDocs';
import { StatsView } from './components/StatsView/StatsView';
import { SupabaseModal } from './components/SupabaseModal';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { activeTab } = useApp();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSupabaseOpen, setIsSupabaseOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar 
        onOpenAuth={() => setIsAuthOpen(true)} 
        onOpenSupabase={() => setIsSupabaseOpen(true)} 
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'home' && <HomeHero onOpenAuth={() => setIsAuthOpen(true)} />}
        {activeTab === 'teacher' && <TeacherHub />}
        {activeTab === 'student' && <StudentAssistant />}
        {activeTab === 'chat' && <AIChat />}
        {activeTab === 'demo' && <ContestDemo />}
        {activeTab === 'schedule' && <SchedulePlanner />}
        {activeTab === 'docs' && <ProjectDocs />}
        {activeTab === 'stats' && <StatsView />}
      </main>

      <Footer />

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <SupabaseModal isOpen={isSupabaseOpen} onClose={() => setIsSupabaseOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}
