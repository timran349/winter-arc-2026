import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import OnboardingModal from './components/OnboardingModal';

import {
  getProfile,
  saveProfile,
  getCommitments,
  saveCommitments,
  getCheckIns,
  saveCheckIns,
  saveSingleCheckIn,
  getWeeklyReviews,
  saveWeeklyReview,
  getSimulatedDay,
  saveSimulatedDay,
  loadDemoData,
  resetAllData,
  DEMO_PROFILE,
  DEMO_COMMITMENTS
} from './utils/storage';

export default function App() {
  const [userProfile, setUserProfile] = useState(null);
  const [commitments, setCommitments] = useState([]);
  const [checkIns, setCheckIns] = useState({});
  const [weeklyReviews, setWeeklyReviews] = useState([]);
  const [simulatedDay, setSimulatedDay] = useState(18);

  const [currentView, setCurrentView] = useState('dashboard'); // 'landing' | 'dashboard' | 'calendar' | 'progress' | 'reviews' | 'contract'
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Initialize Data on Mount
  useEffect(() => {
    let prof = getProfile();
    if (!prof) {
      // Seed default demo state on first load so user gets immediate interactive prototype
      loadDemoData();
      prof = getProfile();
    }

    setUserProfile(prof);
    setCommitments(getCommitments());
    setCheckIns(getCheckIns());
    setWeeklyReviews(getWeeklyReviews());
    setSimulatedDay(getSimulatedDay());
  }, []);

  // Time travel day override handler
  const handleSetSimulatedDay = (dayNum) => {
    setSimulatedDay(dayNum);
    saveSimulatedDay(dayNum);
  };

  // Reset demo state
  const handleResetDemo = () => {
    loadDemoData();
    setUserProfile(getProfile());
    setCommitments(getCommitments());
    setCheckIns(getCheckIns());
    setWeeklyReviews(getWeeklyReviews());
    setSimulatedDay(18);
    setCurrentView('dashboard');
  };

  // Onboarding completion handler
  const handleCompleteOnboarding = ({ name, startDate, duration, intention, commitments: selectedComms }) => {
    const newProfile = {
      id: 'usr_' + Date.now(),
      name,
      startDate,
      duration,
      intention,
      isOnboarded: true,
      createdAt: new Date().toISOString()
    };

    saveProfile(newProfile);
    saveCommitments(selectedComms);
    saveSimulatedDay(1);

    setUserProfile(newProfile);
    setCommitments(selectedComms);
    setCheckIns({});
    setWeeklyReviews([]);
    setSimulatedDay(1);

    setIsOnboardingOpen(false);
    setCurrentView('dashboard');
  };

  // Check-in save handler
  const handleSaveTodayCheckIn = (dateStr, completedIds) => {
    const updated = saveSingleCheckIn(dateStr, completedIds);
    setCheckIns({ ...updated });
  };

  const handleSavePastCheckIn = (dateStr, completedIds) => {
    const updated = saveSingleCheckIn(dateStr, completedIds);
    setCheckIns({ ...updated });
  };

  // Weekly review save handler
  const handleSaveReview = (reviewData) => {
    const updated = saveWeeklyReview(reviewData);
    setWeeklyReviews([...updated]);
  };

  return (
    <div className="min-h-screen bg-[#07080a] text-slate-100 flex flex-col font-sans selection:bg-sky-500/20 selection:text-sky-400">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        simulatedDay={simulatedDay}
        setSimulatedDay={handleSetSimulatedDay}
        onResetDemo={handleResetDemo}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        userProfile={userProfile}
      />

      {/* View Router Main Container */}
      <main className="flex-1">
        {currentView === 'landing' ? (
          <LandingPage
            onStartOnboarding={() => setIsOnboardingOpen(true)}
            onDemoExplore={() => setCurrentView('dashboard')}
          />
        ) : (
          <Dashboard
            userProfile={userProfile || DEMO_PROFILE}
            commitments={commitments.length > 0 ? commitments : DEMO_COMMITMENTS}
            checkIns={checkIns}
            weeklyReviews={weeklyReviews}
            simulatedDayNum={simulatedDay}
            currentView={currentView}
            setCurrentView={setCurrentView}
            onSaveTodayCheckIn={handleSaveTodayCheckIn}
            onSavePastCheckIn={handleSavePastCheckIn}
            onSaveWeeklyReview={handleSaveReview}
          />
        )}
      </main>

      {/* Onboarding Wizard Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onCompleteOnboarding={handleCompleteOnboarding}
      />

      {/* Footer */}
      <Footer onOpenOnboarding={() => setIsOnboardingOpen(true)} />
    </div>
  );
}
