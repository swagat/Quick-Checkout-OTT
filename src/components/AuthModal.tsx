import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, User, Lock, ArrowRight, ShieldCheck, Sparkles, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { MOCK_EXISTING_USERS } from '../data';
import { User as UserType } from '../types';

interface AuthModalProps {
  movieTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserType, isNewUser: boolean, generatedPassword?: string) => void;
  // To allow showing log messages in our live logger panel
  onAddLog: (message: string, type: 'info' | 'success' | 'warn') => void;
}

export default function AuthModal({ movieTitle, isOpen, onClose, onAuthSuccess, onAddLog }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Modal screen states: 'input-name-email' | 'password-prompt' | 'new-account-success'
  const [currentStep, setCurrentStep] = useState<'input-name-email' | 'password-prompt' | 'new-account-success'>('input-name-email');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [generatedPass, setGeneratedPass] = useState('');
  const [existingUserInfo, setExistingUserInfo] = useState<any | null>(null);

  if (!isOpen) return null;

  // Step 1: Submit Name & Email
  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setErrorMessage('');
    onAddLog(`Initiating frictionless flow for: ${email}`, 'info');

    setTimeout(() => {
      // Check if email already exists in mock database
      const existingUser = MOCK_EXISTING_USERS.find(
        (u) => u.email.toLowerCase() === email.toLowerCase().trim()
      );

      if (existingUser) {
        // EXISTING USER BRANCH: Prompt for password
        onAddLog(`Registered email detected: ${email}. Prompting for password authentication.`, 'info');
        setExistingUserInfo(existingUser);
        setCurrentStep('password-prompt');
      } else {
        // NEW USER BRANCH: Auto-create account in background
        const generated = generateRandomPassword();
        setGeneratedPass(generated);
        onAddLog(`Unregistered email. Background-creating secure account for ${name || 'User'}...`, 'info');
        
        // Generate a random password, trigger background creation
        const newUser: UserType = {
          name: name.trim() || 'Valued Streamer',
          email: email.trim().toLowerCase(),
          isSubscribed: false,
          planId: null,
          createdAt: new Date().toISOString()
        };
        
        onAddLog(`Background account successfully created! Secure password generated.`, 'success');
        onAddLog(`Auto-logging in: ${newUser.email}`, 'success');
        onAddLog(`Frictionless credentials notification queued for: ${newUser.email}`, 'info');
        
        onAuthSuccess(newUser, true, generated);
      }
      setIsLoading(false);
    }, 1200);
  };

  // Step 2: Submit Password (for existing users)
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    setTimeout(() => {
      if (password === existingUserInfo?.password || password === 'password123' || password === '123456') {
        const authenticatedUser: UserType = {
          name: existingUserInfo.name,
          email: existingUserInfo.email,
          isSubscribed: existingUserInfo.isSubscribed,
          planId: existingUserInfo.planId,
          createdAt: new Date().toISOString()
        };
        onAddLog(`Existing account authenticated successfully! User: ${authenticatedUser.email}`, 'success');
        onAuthSuccess(authenticatedUser, false);
      } else {
        onAddLog(`Authentication failed for ${existingUserInfo?.email}: Invalid password.`, 'warn');
        setErrorMessage('Incorrect password. Please try again (Hint: use password123)');
      }
      setIsLoading(false);
    }, 1000);
  };

  // Step 3: Complete New User confirmation
  const handleNewUserContinue = () => {
    if (existingUserInfo) {
      onAuthSuccess(existingUserInfo, true, generatedPass);
    }
  };

  // Helper: Secure password generator
  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let pass = '';
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      {/* Outer Click Overlay to Close */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        transition={{ type: 'spring', duration: 0.4 }}
        className="relative z-10 w-full max-w-md overflow-hidden rounded-none border border-zinc-800 bg-[#0a0a0a] text-white p-6 sm:p-8 shadow-2xl"
      >
        {/* Background Visual Flare */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 h-40 w-40 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 h-40 w-40 rounded-full bg-white/5 blur-3xl" />

        {/* Header Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-10 w-10 rounded-none bg-white/10 text-white mb-2 border border-white/15">
            <Sparkles className="h-5 w-5 text-white animate-pulse" />
          </div>
          <h2 className="text-2xl font-serif font-bold tracking-tight text-white">
            Unlock Instant Playback
          </h2>
          <p className="text-xs text-zinc-400 mt-1.5 font-light">
            Sign up or sign in seamlessly without interrupting your stream of <strong className="text-white font-medium">"{movieTitle}"</strong>
          </p>
        </div>

        {/* Flow Screens rendering using AnimatePresence */}
        <AnimatePresence mode="wait">
          
          {/* STEP 1: Name and Email form */}
          {currentStep === 'input-name-email' && (
            <motion.form
              key="step-name-email"
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 5 }}
              onSubmit={handleInitialSubmit}
              className="space-y-5"
            >
              {/* Friction Warning */}
              <div className="rounded-none bg-zinc-900 border border-zinc-800 p-3.5 flex items-start space-x-2.5">
                <ShieldCheck className="h-4.5 w-4.5 text-zinc-300 shrink-0 mt-0.5" />
                <span className="text-[11px] text-zinc-300 leading-tight font-light">
                  <strong className="font-semibold text-white">Prestige Gateway:</strong> Fill in your details below and our service will handle the rest instantly. No email confirmation wait times, no tedious forms.
                </span>
              </div>

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest block">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-500">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="e.g. swagatmishra@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#12121c] border border-zinc-800 rounded-none py-3 pl-11 pr-4 text-sm text-white placeholder-zinc-600 focus:border-white focus:outline-none transition-all"
                  />
                </div>
                <p className="text-[10px] text-zinc-500 italic">
                  Try <strong className="text-white">swagatmishra@gmail.com</strong> to simulate an existing user flow!
                </p>
              </div>

              {/* Name Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest block">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-500">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Swagat Mishra"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#12121c] border border-zinc-800 rounded-none py-3 pl-11 pr-4 text-sm text-white placeholder-zinc-600 focus:border-white focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white hover:bg-neutral-200 text-black rounded-none py-3.5 font-bold text-xs tracking-widest uppercase active:scale-98 transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Authenticating Gateway...</span>
                  </>
                ) : (
                  <>
                    <span>Next: Instant Account Creation</span>
                    <ArrowRight className="h-3.5 w-3.5 text-black" />
                  </>
                )}
              </button>
            </motion.form>
          )}

          {/* STEP 2: Password prompt (Existing Users) */}
          {currentStep === 'password-prompt' && (
            <motion.form
              key="step-password"
              initial={{ opacity: 0, x: 5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -5 }}
              onSubmit={handlePasswordSubmit}
              className="space-y-5"
            >
              <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-none text-center">
                <span className="text-xs text-white font-bold tracking-wider uppercase block">Welcome Back, {existingUserInfo?.name}!</span>
                <span className="text-[10px] text-zinc-400 block mt-0.5">Your email {email} is registered with us</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest block">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-500">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoFocus
                    placeholder="Enter your account password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#12121c] border border-zinc-800 rounded-none py-3 pl-11 pr-10 text-sm text-white placeholder-zinc-600 focus:border-white focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-500 italic">
                    Hint: Use <strong className="text-white">password123</strong>
                  </span>
                  <button 
                    type="button"
                    onClick={() => setPassword('password123')}
                    className="text-[10px] text-zinc-300 font-medium hover:underline cursor-pointer"
                  >
                    Auto-fill
                  </button>
                </div>
              </div>

              {errorMessage && (
                <div className="flex items-center space-x-1.5 text-xs text-red-400 bg-red-950/10 border border-red-900/20 p-2.5 rounded-none">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="pt-2 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep('input-name-email')}
                  className="w-1/3 bg-transparent border border-zinc-800 hover:bg-white/5 text-zinc-300 rounded-none py-3 font-bold text-[10px] tracking-widest uppercase transition cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-2/3 bg-white hover:bg-neutral-200 text-black rounded-none py-3 font-bold text-[10px] tracking-widest uppercase transition flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {isLoading ? (
                    <span className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full" />
                  ) : (
                    <>
                      <span>Sign In & Continue</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          )}

          {/* STEP 3: Auto login confirmation (New Users) */}
          {currentStep === 'new-account-success' && (
            <motion.div
              key="step-success"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-5 text-center py-4"
            >
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-none bg-zinc-900 text-white border border-zinc-800">
                <CheckCircle2 className="h-8 w-8 animate-bounce" />
              </div>
              
              <div className="space-y-1.5">
                <h3 className="text-xl font-serif font-bold text-white">Prestige Account Provisioned!</h3>
                <p className="text-xs text-zinc-400 font-light">
                  Welcome, <strong className="text-white font-medium">{name}</strong>. Your membership credentials have been configured and logged in.
                </p>
              </div>

              {/* Autogenerated details preview */}
              <div className="rounded-none bg-zinc-950 border border-zinc-800 p-4 space-y-2.5 text-left">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 uppercase tracking-widest text-[9px] font-bold">Email Address</span>
                  <span className="text-zinc-300 font-mono text-[11px]">{email}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 uppercase tracking-widest text-[9px] font-bold">Secure Password</span>
                  <span className="text-white font-mono text-[11px] font-bold bg-white/10 border border-white/10 px-2 py-0.5 rounded-none">
                    {generatedPass}
                  </span>
                </div>
                <div className="border-t border-zinc-900 pt-2.5 mt-2">
                  <span className="text-[10px] text-zinc-500 leading-tight block">
                    ✉️ We have dispatched an email containing these credentials so you can log in on your television or console device later.
                  </span>
                </div>
              </div>

              <div className="rounded-none bg-zinc-900 border border-zinc-800 p-3">
                <p className="text-[11px] text-zinc-300 leading-tight font-light">
                  ⚡ <strong>Premium Access:</strong> AuraStream requires an active subscription. Let's select your prestige plan to begin immediate playback!
                </p>
              </div>

              <button
                onClick={handleNewUserContinue}
                className="w-full bg-white hover:bg-neutral-200 text-black rounded-none py-3.5 font-bold text-xs tracking-widest uppercase transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Select Your Plan</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </div>
  );
}
