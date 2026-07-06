import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CreditCard, ShieldCheck, Lock, Sparkles, CheckCircle2, Calendar, HelpCircle, ArrowRight, Heart } from 'lucide-react';
import { SubscriptionPlan, User } from '../types';

interface CheckoutModalProps {
  plan: SubscriptionPlan;
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
  onAddLog: (message: string, type: 'info' | 'success' | 'warn') => void;
}

export default function CheckoutModal({ plan, user, isOpen, onClose, onPaymentSuccess, onAddLog }: CheckoutModalProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState(user?.name || '');
  
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Formatter for Card Number (adds spaces every 4 digits)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    const matches = value.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      setCardNumber(parts.join(' '));
    } else {
      setCardNumber(value);
    }
  };

  // Formatter for Expiry Date (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      setExpiry(`${value.slice(0, 2)}/${value.slice(2)}`);
    } else {
      setExpiry(value);
    }
  };

  // Formatter for CVV (3 digits)
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 3) value = value.slice(0, 3);
    setCvv(value);
  };

  // Auto fill mock sandbox card details for easy evaluation
  const handleAutoFill = () => {
    onAddLog('Simulating secure Sandbox auto-fill payload.', 'info');
    setCardNumber('4111 2222 3333 4444');
    setExpiry('12/28');
    setCvv('789');
    setCardName(user?.name || 'Swagat Mishra');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !expiry || !cvv || !cardName) {
      setError('Please complete all security fields.');
      return;
    }

    setIsLoading(true);
    setError('');
    
    // Simulate multi-stage processing logs
    onAddLog(`Initiating payment pipeline through integrated Stripe proxy: $${plan.price}`, 'info');
    setLoadingStep('Securing transmission with SSL/TLS...');
    
    setTimeout(() => {
      setLoadingStep('Authorizing card with transaction bank...');
      onAddLog('Pre-authorizing temporary card tokens...', 'info');
      
      setTimeout(() => {
        setLoadingStep('Finalizing premium subscription details...');
        onAddLog('Payment authorized successfully. Transmitting subscription record.', 'success');
        
        setTimeout(() => {
          setIsLoading(false);
          onPaymentSuccess();
        }, 1000);
      }, 1200);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      {/* Outer Overlay */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-none border border-zinc-800 bg-[#0a0a0a] text-white shadow-2xl p-6 sm:p-8"
      >
        {/* Visual Background Flare */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 h-48 w-48 rounded-full bg-white/5 blur-3xl" />

        {/* Loading Spinner Screen */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-zinc-800 border-t-white animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Lock className="h-5 w-5 text-white" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-serif font-bold text-white">Authorizing Subscription</h3>
              <p className="text-xs text-zinc-400 font-mono animate-pulse">{loadingStep}</p>
              <p className="text-[10px] text-zinc-500 max-w-xs mx-auto leading-normal">
                Please do not close this window. Your secure transaction is being verified over our encrypted prestige proxies.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Header */}
            <div className="text-center relative">
              <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-none inline-flex items-center">
                <ShieldCheck className="h-3 w-3 mr-1" />
                Secure Checkout Gateway
              </span>
              <h2 className="text-2xl font-serif font-bold text-white mt-4">
                Complete Premium Order
              </h2>
              <p className="text-xs text-zinc-400 mt-1.5 font-light">
                Secure transaction for <strong className="text-white font-medium">{user?.email}</strong>. Playback begins automatically.
              </p>
            </div>

            {/* Quick Demo Fill Indicator */}
            <div className="flex items-center justify-between p-3.5 rounded-none bg-zinc-900 border border-zinc-800">
              <div className="flex items-start space-x-2">
                <Sparkles className="h-4.5 w-4.5 text-zinc-400 shrink-0 mt-0.5" />
                <div className="text-left">
                  <span className="text-xs font-semibold text-white block leading-tight">Prestige Test Sandbox</span>
                  <span className="text-[10px] text-zinc-400 block mt-0.5 leading-tight">Use any fake card details or click auto-fill to instantly process!</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAutoFill}
                className="shrink-0 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-bold text-[9px] tracking-widest uppercase px-3 py-1.5 rounded-none transition cursor-pointer"
              >
                Auto-fill
              </button>
            </div>

            {/* Order Summary Recap Card */}
            <div className="rounded-none bg-zinc-950 border border-zinc-850 p-4 flex items-center justify-between">
              <div>
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Streaming Access</span>
                <h4 className="text-sm font-bold text-gray-200 mt-0.5">{plan.name}</h4>
                <p className="text-[10px] text-zinc-500 leading-none mt-1">Renews monthly. Cancel online.</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-serif font-bold text-white">${plan.price}</span>
                <span className="text-zinc-500 text-xs">/mo</span>
              </div>
            </div>

            {/* Fields Grid */}
            <div className="space-y-4">
              {/* Cardholder Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest block">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Swagat Mishra"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full bg-[#12121c] border border-zinc-800 rounded-none py-3 px-4 text-sm text-white placeholder-zinc-600 focus:border-white focus:outline-none transition-all"
                />
              </div>

              {/* Card Number */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest block">
                  Card Number
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-500">
                    <CreditCard className="h-4.5 w-4.5" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="4111 2222 3333 4444"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    className="w-full bg-[#12121c] border border-zinc-800 rounded-none py-3 pl-11 pr-4 text-sm text-white placeholder-zinc-600 focus:border-white focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Expiry & CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest block">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={handleExpiryChange}
                    className="w-full bg-[#12121c] border border-zinc-800 rounded-none py-3 px-4 text-sm text-white placeholder-zinc-600 focus:border-white focus:outline-none text-center transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest block">
                    Security CVV
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="CVV"
                    value={cvv}
                    onChange={handleCvvChange}
                    className="w-full bg-[#12121c] border border-zinc-800 rounded-none py-3 px-4 text-sm text-white placeholder-zinc-600 focus:border-white focus:outline-none text-center transition-all font-mono"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="text-xs text-red-400 bg-red-950/10 border border-red-900/20 p-2.5 rounded-none text-center font-medium">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex items-center space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 bg-transparent border border-zinc-800 hover:bg-white/5 rounded-none py-3.5 text-[10px] text-zinc-400 font-bold uppercase tracking-widest transition cursor-pointer"
              >
                Go Back
              </button>
              <button
                type="submit"
                className="w-2/3 bg-white hover:bg-neutral-200 text-black rounded-none py-3.5 font-bold text-xs tracking-widest uppercase active:scale-98 transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Authorize & Pay ${plan.price}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Security Logos */}
            <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
              <span className="flex items-center">
                <Lock className="h-3 w-3 mr-1" />
                PCI-DSS Secure
              </span>
              <div className="flex items-center space-x-2.5">
                <span>VISA</span>
                <span>•</span>
                <span>MC</span>
                <span>•</span>
                <span>STRIPE</span>
              </div>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
