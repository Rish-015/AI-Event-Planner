import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function AuthModal({ isOpen, onClose, initialTab = 'login' }) {
  const { login, signup } = useAuth();
  const [tab, setTab] = useState(initialTab);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);

  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError(null);
    if (!loginEmail || !loginPassword) {
      setError('Please enter both email and password.');
      return;
    }
    login(loginEmail, loginPassword);
    onClose();
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setError(null);
    if (!signupName || !signupEmail || !signupPassword) {
      setError('Please fill in all required fields.');
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!termsAgreed) {
      setError('You must agree to the Terms and Privacy Policy.');
      return;
    }
    signup(signupName, signupEmail, signupPassword);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-md bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-[400px]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 p-1 text-outline hover:text-on-surface transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Card Container */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-lg p-lg w-full flex flex-col items-center">
          {/* Brand Header */}
          <div className="flex items-center gap-sm mb-md">
            <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              calendar_month
            </span>
            <span className="font-headline-lg text-headline-lg text-primary font-bold">
              AI Event Planner
            </span>
          </div>

          {/* Inline Error Message */}
          {error && (
            <div className="w-full mb-md p-xs px-sm bg-error-container text-on-error-container text-body-md rounded-md flex items-center gap-xs">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span className="text-[13px]">{error}</span>
            </div>
          )}

          {tab === 'login' ? (
            /* Login View */
            <div className="w-full flex flex-col items-center">
              <h1 className="font-headline-xl text-headline-xl text-on-surface mb-xl text-center w-full">
                Welcome Back
              </h1>
              <form onSubmit={handleLoginSubmit} className="w-full flex flex-col gap-md">
                {/* Email Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-outline">mail</span>
                  </div>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full pl-xl pr-sm py-sm bg-surface-container-lowest border border-outline-variant rounded-DEFAULT focus:ring-[3px] focus:ring-primary-container/20 focus:border-primary font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant transition-colors"
                  />
                </div>

                {/* Password Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-outline">lock</span>
                  </div>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full pl-xl pr-sm py-sm bg-surface-container-lowest border border-outline-variant rounded-DEFAULT focus:ring-[3px] focus:ring-primary-container/20 focus:border-primary font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant transition-colors"
                  />
                </div>

                {/* Forgot Password */}
                <div className="flex justify-end w-full">
                  <a className="font-body-sm text-body-sm text-primary hover:text-primary-fixed-dim transition-colors" href="#forgot">
                    Forgot password?
                  </a>
                </div>

                {/* Log In Button */}
                <button
                  type="submit"
                  className="w-full bg-primary text-on-primary font-label-md text-label-md py-md rounded-lg hover:bg-surface-tint transition-colors mt-sm shadow-sm hover:shadow-md mb-lg cursor-pointer"
                >
                  Log In
                </button>
              </form>

              {/* Footer */}
              <p className="font-body-md text-body-md text-on-surface-variant text-center w-full">
                Don't have an account?{' '}
                <button
                  onClick={() => { setTab('signup'); setError(null); }}
                  className="text-primary hover:text-primary-fixed-dim transition-colors font-semibold cursor-pointer underline"
                >
                  Sign up
                </button>
              </p>
            </div>
          ) : (
            /* Signup View */
            <div className="w-full">
              <div className="mb-lg text-center">
                <h2 className="font-headline-md text-headline-md text-on-surface mb-sm">
                  Create Your Account
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant text-[13px]">
                  Start organizing your events with intelligent precision.
                </p>
              </div>

              <form onSubmit={handleSignupSubmit} className="space-y-md w-full">
                {/* Full Name Field */}
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="name">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-on-surface-variant text-[20px]">person</span>
                    </div>
                    <input
                      id="name"
                      type="text"
                      required
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="John Doe"
                      className="block w-full pl-10 pr-3 py-2 border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="signup-email">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-on-surface-variant text-[20px]">mail</span>
                    </div>
                    <input
                      id="signup-email"
                      type="email"
                      required
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="block w-full pl-10 pr-3 py-2 border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="signup-password">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-on-surface-variant text-[20px]">lock</span>
                    </div>
                    <input
                      id="signup-password"
                      type="password"
                      required
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="••••••••"
                      className="block w-full pl-10 pr-3 py-2 border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="confirm-password">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-on-surface-variant text-[20px]">lock</span>
                    </div>
                    <input
                      id="confirm-password"
                      type="password"
                      required
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="block w-full pl-10 pr-3 py-2 border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start mt-md">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      type="checkbox"
                      required
                      checked={termsAgreed}
                      onChange={(e) => setTermsAgreed(e.target.checked)}
                      className="h-4 w-4 text-primary focus:ring-primary-container border-outline-variant rounded cursor-pointer"
                    />
                  </div>
                  <div className="ml-2 text-sm">
                    <label className="font-body-md text-body-md text-on-surface-variant text-[12px]" htmlFor="terms">
                      I agree to the{' '}
                      <a className="font-label-md text-label-md text-primary hover:underline" href="#terms">
                        Terms
                      </a>{' '}
                      &{' '}
                      <a className="font-label-md text-label-md text-primary hover:underline" href="#privacy">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-lg">
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm font-label-md text-label-md text-on-primary bg-primary hover:bg-primary-container focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors cursor-pointer"
                  >
                    Sign Up
                  </button>
                </div>
              </form>

              <div className="mt-lg text-center">
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Already have an account?{' '}
                  <button
                    onClick={() => { setTab('login'); setError(null); }}
                    className="font-label-md text-label-md text-primary hover:underline cursor-pointer"
                  >
                    Log in
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
