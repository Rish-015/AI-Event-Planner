import React, { useState } from 'react';
import PdfExportButton from './PdfExportButton';
import AuthModal from './AuthModal';
import { useAuth } from '../hooks/useAuth';

export default function Header({ hasPlan, onNewEvent }) {
  const { user, isLoggedIn, logout } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [initialAuthTab, setInitialAuthTab] = useState('login');

  const openLogin = () => {
    setInitialAuthTab('login');
    setAuthModalOpen(true);
  };

  const openSignup = () => {
    setInitialAuthTab('signup');
    setAuthModalOpen(true);
  };

  return (
    <>
      <header className="fixed top-0 w-full z-40 flex justify-between items-center px-gutter py-md bg-surface border-b border-outline-variant shadow-sm transition-all duration-300 h-[72px]">
        <div className="flex items-center gap-sm">
          <span 
            className="material-symbols-outlined text-primary text-[28px]" 
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {hasPlan ? 'event_available' : 'calendar_month'}
          </span>
          <h1 className="font-headline-lg text-headline-lg font-bold text-primary">
            AI Event Planner
          </h1>
        </div>
        
        <div className="flex items-center gap-md">
          {/* Header Actions when plan exists */}
          {hasPlan && (
            <>
              <PdfExportButton />
              <button 
                onClick={onNewEvent}
                className="bg-primary text-on-primary px-md py-[8px] rounded-lg font-label-md text-label-md hover:bg-primary-container transition-colors shadow-sm flex items-center gap-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                New Event
              </button>
            </>
          )}

          {/* User Auth Section */}
          {isLoggedIn ? (
            <div className="flex items-center gap-sm bg-surface-container-low border border-outline-variant rounded-lg p-1 pl-3">
              <div className="w-7 h-7 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xs">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="font-label-md text-label-md text-on-surface hidden sm:inline">
                {user.name}
              </span>
              <button
                onClick={logout}
                title="Log Out"
                className="p-1 text-on-surface-variant hover:text-error transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-xs">
              <button
                onClick={openLogin}
                className="border border-outline-variant text-on-surface hover:bg-surface-variant px-md py-[8px] rounded-lg font-label-md text-label-md transition-colors cursor-pointer"
              >
                Log In
              </button>
              <button
                onClick={openSignup}
                className="bg-primary text-on-primary hover:bg-primary-container px-md py-[8px] rounded-lg font-label-md text-label-md transition-colors shadow-sm cursor-pointer"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </header>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={initialAuthTab}
      />
    </>
  );
}
