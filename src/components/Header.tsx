import React from 'react';
import { Play, Sparkles, RefreshCw, User, LogOut, CheckCircle2 } from 'lucide-react';
import { User as UserType } from '../types';

interface HeaderProps {
  user: UserType | null;
  onLogout: () => void;
  onResetPrototype: () => void;
  onNavigateHome: () => void;
}

export default function Header({ user, onLogout, onResetPrototype, onNavigateHome }: HeaderProps) {
  return (
    <header id="header-container" className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#050505]/80 backdrop-blur-md px-4 py-3 lg:px-8">
      <div id="header-content" className="mx-auto flex max-w-7xl items-center justify-between">
        
        {/* Brand Logo in Sophisticated Dark Serif Italic style */}
        <div 
          id="brand-logo" 
          onClick={onNavigateHome}
          className="flex cursor-pointer items-center space-x-3 transition hover:opacity-90"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-md">
            <Play className="h-4.5 w-4.5 fill-black text-black" />
          </div>
          <span className="font-serif italic text-3xl font-bold tracking-tighter text-white">
            AuraStream
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav id="desktop-nav" className="hidden md:flex items-center space-x-8 text-xs font-medium tracking-widest uppercase text-white/60">
          <button onClick={onNavigateHome} className="hover:text-white transition cursor-pointer">Home</button>
          <button className="hover:text-white transition cursor-not-allowed opacity-50">Cinema</button>
          <button className="hover:text-white transition cursor-not-allowed opacity-50">Series</button>
          <button className="hover:text-white transition cursor-not-allowed opacity-50">Originals</button>
          <span className="flex items-center space-x-1 rounded-full bg-white/10 border border-white/20 px-2 py-0.5 text-[9px] text-zinc-300 font-normal">
            <span className="h-1 w-1 rounded-full bg-red-600 animate-pulse"></span>
            <span>Live Premiere</span>
          </span>
        </nav>

        {/* Prototype & User controls */}
        <div id="user-controls" className="flex items-center space-x-3">
          
          {/* Quick Prototype Reset */}
          <button
            id="reset-proto-btn"
            onClick={onResetPrototype}
            title="Reset prototype state for a fresh run"
            className="flex items-center space-x-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs text-gray-300 hover:bg-white/10 hover:text-white active:scale-95 transition"
          >
            <RefreshCw className="h-3 w-3" />
            <span className="hidden sm:inline">Reset Sandbox</span>
          </button>

          {/* User Status / Account menu */}
          {user ? (
            <div id="user-profile-badge" className="flex items-center space-x-2 pl-2 border-l border-white/10">
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-xs font-semibold text-white truncate max-w-[120px]">{user.name}</span>
                <span className="text-[10px] text-gray-400 flex items-center justify-end space-x-1">
                  {user.isSubscribed ? (
                    <>
                      <CheckCircle2 className="h-2.5 w-2.5 text-emerald-400" />
                      <span className="text-emerald-400">Prestige Tier</span>
                    </>
                  ) : (
                    <span className="text-amber-400">Free Access</span>
                  )}
                </span>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-850 text-white border border-white/10">
                <span className="text-xs font-bold uppercase">{user.name.charAt(0)}</span>
              </div>
              <button
                id="sign-out-btn"
                onClick={onLogout}
                title="Sign out of prototype"
                className="p-1 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div id="guest-indicator" className="flex items-center space-x-2 pl-2 border-l border-white/10">
              <span className="hidden lg:inline text-xs text-gray-400 font-medium bg-white/5 px-2.5 py-1 rounded-full">
                Guest Mode
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-gray-300">
                <User className="h-4 w-4" />
              </div>
            </div>
          )}
        </div>
        
      </div>
    </header>
  );
}
