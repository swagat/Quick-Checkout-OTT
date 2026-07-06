import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Sparkles, Info, ArrowRight, ShieldCheck, Zap, Laptop, Landmark, Heart } from 'lucide-react';

import { Movie, User, SubscriptionPlan, LogEntry } from './types';
import { MOVIES } from './data';
import Header from './components/Header';
import MovieHero from './components/MovieHero';
import AuthModal from './components/AuthModal';
import SubscriptionModal from './components/SubscriptionModal';
import CheckoutModal from './components/CheckoutModal';
import VideoPlayer from './components/VideoPlayer';

export default function App() {
  const [activeMovie, setActiveMovie] = useState<Movie>(MOVIES[0]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  
  // Modal toggles
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  // Helper to log server actions
  const addLog = (message: string, type: 'info' | 'success' | 'warn' = 'info') => {
    const now = new Date();
    const timestamp = now.toTimeString().split(' ')[0];
    setLogs((prev) => [{ timestamp, message, type }, ...prev]);
  };

  // Load user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('aura_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCurrentUser(parsed);
        addLog(`Restored active session for user: ${parsed.email}`, 'info');
      } catch (err) {
        console.error('Failed parsing stored user:', err);
      }
    } else {
      addLog('No active user session found. Initialized in Guest Mode.', 'info');
    }
  }, []);

  const handlePlayMovie = (movie: Movie) => {
    addLog(`User clicked "Watch Now" on title: "${movie.title}"`, 'info');
    
    // 1. If NOT premium content, play instantly
    if (!movie.isPremium) {
      addLog(`"${movie.title}" is Free Content. Launching player immediately with zero friction.`, 'success');
      setShowSuccessOverlay(false);
      setIsPlayerOpen(true);
      return;
    }

    // 2. If Premium: Check auth state
    if (!currentUser) {
      addLog(`"${movie.title}" is Premium. Opening zero-friction name/email authentication modal.`, 'info');
      setIsAuthModalOpen(true);
    } else {
      // User logged in, check subscription
      if (currentUser.isSubscribed) {
        addLog(`Subscriber detected (${currentUser.email}). Bypassing subscription checks. Unlocking stream.`, 'success');
        setShowSuccessOverlay(false);
        setIsPlayerOpen(true);
      } else {
        addLog(`Active user (${currentUser.email}) is not subscribed. Opening subscription plans.`, 'info');
        setIsSubscriptionModalOpen(true);
      }
    }
  };

  const handleAuthSuccess = (authenticatedUser: User, isNewUser: boolean, generatedPassword?: string) => {
    setCurrentUser(authenticatedUser);
    localStorage.setItem('aura_user', JSON.stringify(authenticatedUser));
    setIsAuthModalOpen(false);

    if (isNewUser) {
      addLog(`New user registered and auto-logged in: ${authenticatedUser.email}`, 'success');
      // Set chosen plan logic or transition directly to subscription
      setIsSubscriptionModalOpen(true);
    } else {
      addLog(`Existing user signed in: ${authenticatedUser.email}`, 'success');
      if (authenticatedUser.isSubscribed) {
        addLog('Existing active subscription found! Preparing stream play...', 'success');
        setIsPlayerOpen(true);
      } else {
        addLog('No active subscription found for existing user. Opening plans...', 'info');
        setIsSubscriptionModalOpen(true);
      }
    }
  };

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setIsSubscriptionModalOpen(false);
    setIsCheckoutModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    if (!currentUser || !selectedPlan) return;

    const updatedUser: User = {
      ...currentUser,
      isSubscribed: true,
      planId: selectedPlan.id
    };

    setCurrentUser(updatedUser);
    localStorage.setItem('aura_user', JSON.stringify(updatedUser));
    setIsCheckoutModalOpen(false);
    
    addLog(`Stripe Transaction authorized: $${selectedPlan.price} charged.`, 'success');
    addLog(`Subscription Tier "${selectedPlan.name}" activated for ${updatedUser.email}.`, 'success');

    // Trigger player with successful payment success screen overlay
    setShowSuccessOverlay(true);
    setIsPlayerOpen(true);
  };

  const handleLogout = () => {
    if (currentUser) {
      addLog(`User ${currentUser.email} logged out. Resetting session context.`, 'warn');
    }
    setCurrentUser(null);
    localStorage.removeItem('aura_user');
    setIsPlayerOpen(false);
  };

  const handleResetPrototype = () => {
    localStorage.removeItem('aura_user');
    setCurrentUser(null);
    setSelectedPlan(null);
    setIsAuthModalOpen(false);
    setIsSubscriptionModalOpen(false);
    setIsCheckoutModalOpen(false);
    setIsPlayerOpen(false);
    setLogs([]);
    addLog('Prototype state successfully reset. Back to original guest baseline!', 'success');
  };

  const handleSelectMovie = (movie: Movie) => {
    setActiveMovie(movie);
    addLog(`Swapped active display title to: "${movie.title}"`, 'info');
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-gray-100 flex flex-col justify-between font-sans selection:bg-red-500 selection:text-white">
      
      {/* Premium Navigation Header */}
      <Header
        user={currentUser}
        onLogout={handleLogout}
        onResetPrototype={handleResetPrototype}
        onNavigateHome={() => setIsPlayerOpen(false)}
      />

      {/* Main Container */}
      <main className="flex-1 relative pb-16">
        
        {/* Onboarding Welcome Callout Banner */}
        <div id="demo-banner" className="bg-gradient-to-r from-red-600/10 via-[#121218] to-red-600/5 border-b border-white/5 py-3 px-4">
          <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-start space-x-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-600/20 text-red-400 font-bold border border-red-500/30">
                ★
              </span>
              <p className="text-gray-300 leading-snug">
                <strong>Prototype Walkthrough:</strong> AuraStream showcases a friction-optimized conversion pipeline. Try clicking <strong>"Watch Now"</strong> on Cyberpunk Odyssey. Input any email or use <strong className="text-red-400 underline decoration-dotted">swagatmishra@gmail.com</strong> to test an existing account experience!
              </p>
            </div>
            
            <div className="flex items-center space-x-3 shrink-0">
              <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center">
                <Zap className="h-3 w-3 fill-emerald-400/20 mr-1 animate-pulse" />
                Frictionless Flow Engaged
              </span>
            </div>
          </div>
        </div>

        {/* Cinematic Movie Details Showcase */}
        <MovieHero
          movie={activeMovie}
          allMovies={MOVIES}
          onPlayMovie={handlePlayMovie}
          onSelectMovie={handleSelectMovie}
        />

        {/* Modals & Overlays Render Pipeline */}
        
        {/* STEP 2: Zero-Friction Name & Email Sign Up/Sign In Modal */}
        <AnimatePresence>
          {isAuthModalOpen && (
            <AuthModal
              movieTitle={activeMovie.title}
              isOpen={isAuthModalOpen}
              onClose={() => {
                setIsAuthModalOpen(false);
                addLog('Authentication modal dismissed by user.', 'warn');
              }}
              onAuthSuccess={handleAuthSuccess}
              onAddLog={addLog}
            />
          )}
        </AnimatePresence>

        {/* STEP 4: Subscription Plans Selection Modal */}
        <AnimatePresence>
          {isSubscriptionModalOpen && (
            <SubscriptionModal
              isOpen={isSubscriptionModalOpen}
              onClose={() => {
                setIsSubscriptionModalOpen(false);
                addLog('Subscription plans modal dismissed by user.', 'warn');
              }}
              onSelectPlan={handleSelectPlan}
              onAddLog={addLog}
            />
          )}
        </AnimatePresence>

        {/* STEP 5: Secure Checkout Modal */}
        <AnimatePresence>
          {isCheckoutModalOpen && selectedPlan && (
            <CheckoutModal
              plan={selectedPlan}
              user={currentUser}
              isOpen={isCheckoutModalOpen}
              onClose={() => {
                setIsCheckoutModalOpen(false);
                addLog('Checkout modal dismissed by user.', 'warn');
              }}
              onPaymentSuccess={handlePaymentSuccess}
              onAddLog={addLog}
            />
          )}
        </AnimatePresence>

        {/* STEP 6 & 7: Successful Payment Countdown & HTML5 Video Auto-Play Screen */}
        <AnimatePresence>
          {isPlayerOpen && (
            <VideoPlayer
              movie={activeMovie}
              showSuccessOverlay={showSuccessOverlay}
              onClose={() => {
                setIsPlayerOpen(false);
                setShowSuccessOverlay(false);
                addLog(`Exited full-screen video player for: ${activeMovie.title}`, 'info');
              }}
              onAddLog={addLog}
            />
          )}
        </AnimatePresence>



      </main>

      {/* Footer Details */}
      <footer className="border-t border-white/5 bg-[#07070a] py-6 px-4">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-gray-400">AURA STREAM</span>
            <span>•</span>
            <span>Seamless Conversion Funnel Showcase</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>Made with</span>
            <Heart className="h-3 w-3 text-red-500 fill-red-500" />
            <span>for frictionless media distribution</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
