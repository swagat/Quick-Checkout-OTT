import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Tv, Smartphone, ShieldCheck, HelpCircle, Laptop, Landmark } from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '../data';
import { SubscriptionPlan } from '../types';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (plan: SubscriptionPlan) => void;
  onAddLog: (message: string, type: 'info' | 'success' | 'warn') => void;
}

export default function SubscriptionModal({ isOpen, onClose, onSelectPlan, onAddLog }: SubscriptionModalProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<string>('premium-standard'); // Default to Standard Plan

  if (!isOpen) return null;

  const activePlan = SUBSCRIPTION_PLANS.find((p) => p.id === selectedPlanId)!;

  const handleProceed = () => {
    onAddLog(`Plan selected: ${activePlan.name} ($${activePlan.price}/${activePlan.billingPeriod})`, 'info');
    onSelectPlan(activePlan);
  };

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'mobile':
      case 'tablet':
        return <Smartphone className="h-4 w-4 text-gray-400" />;
      case 'laptop':
        return <Laptop className="h-4 w-4 text-gray-400" />;
      case 'tv':
      case 'consoles':
        return <Tv className="h-4 w-4 text-gray-400" />;
      default:
        return <Tv className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      {/* Outer Click Overlay */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className="relative z-10 w-full max-w-4xl rounded-none border border-zinc-800 bg-[#0a0a0a] text-white p-6 sm:p-8 shadow-2xl my-8"
      >
        {/* Background visual gradient */}
        <div className="absolute top-0 left-1/4 -mt-24 h-48 w-96 rounded-full bg-white/5 blur-3xl" />

        {/* Header */}
        <div className="text-center mb-8 relative">
          <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-400 bg-white/5 border border-white/20 px-3 py-1 rounded-none">
            Step 2 of 3: Plan Selection
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-4">
            Select Your Streaming Tier
          </h2>
          <p className="text-xs text-zinc-400 mt-2 max-w-md mx-auto font-light leading-relaxed">
            Get unlimited access to high-fidelity movies, series, and live streaming. No contract lock-ins. Cancel online anytime.
          </p>
        </div>

        {/* Plan Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isSelected = plan.id === selectedPlanId;
            return (
              <div
                key={plan.id}
                id={`plan-card-${plan.id}`}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`relative cursor-pointer rounded-none p-5 border flex flex-col justify-between transition-all duration-300 transform hover:scale-[1.01] ${
                  isSelected
                    ? 'bg-[#121212] border-white shadow-xl'
                    : 'bg-[#080808]/60 border-zinc-850 hover:border-zinc-700 hover:bg-[#0c0c0c]'
                }`}
              >
                {/* Popular Badge */}
                {plan.isPopular && (
                  <span className="absolute top-0 right-6 -translate-y-1/2 bg-white text-black font-bold text-[9px] tracking-widest uppercase px-3 py-1 rounded-none shadow-lg border border-neutral-300">
                    Recommended
                  </span>
                )}

                {/* Card Top */}
                <div>
                  <div className="flex items-center space-x-2">
                    <div className={`h-3.5 w-3.5 rounded-full border flex items-center justify-center ${isSelected ? 'border-white bg-white' : 'border-zinc-600'}`}>
                      {isSelected && <div className="h-1.5 w-1.5 bg-black rounded-full" />}
                    </div>
                    <h3 className="font-bold text-xs uppercase tracking-widest text-zinc-300">{plan.name}</h3>
                  </div>

                  <div className="mt-4">
                    <span className="text-3xl font-serif font-bold">${plan.price}</span>
                    <span className="text-zinc-500 text-xs font-semibold">/{plan.billingPeriod}</span>
                  </div>

                  {/* Quality & Resolution Info */}
                  <div className="mt-4 border-t border-b border-zinc-900 py-3 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500">Resolution</span>
                      <span className="font-semibold text-zinc-300">{plan.resolution}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500">Video Quality</span>
                      <span className="font-semibold text-zinc-300">{plan.videoQuality}</span>
                    </div>
                  </div>

                  {/* Features Checklist */}
                  <ul className="mt-4 space-y-2.5 text-xs">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <Check className="h-4 w-4 text-white shrink-0 mt-0.5" />
                        <span className="text-zinc-300 leading-tight font-light">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Bottom: Devices */}
                <div className="mt-6 pt-4 border-t border-zinc-900">
                  <span className="text-[9px] text-zinc-500 block uppercase tracking-widest font-bold mb-2">
                    Supported Devices
                  </span>
                  <div className="flex items-center space-x-2">
                    {plan.supportedDevices.map((device) => (
                      <div key={device} title={device} className="bg-white/5 p-1.5 rounded-none border border-white/5 hover:bg-white/10 transition">
                        {getDeviceIcon(device)}
                      </div>
                    ))}
                    <span className="text-[9px] text-zinc-400 font-medium truncate uppercase tracking-wider">
                      {plan.supportedDevices.join(', ')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Checkout Summary Area */}
        <div className="mt-8 border-t border-zinc-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-950 p-4 rounded-none border border-zinc-800">
          <div className="text-center sm:text-left">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Selected Plan:</span>
            <div className="flex items-baseline justify-center sm:justify-start space-x-2 mt-0.5">
              <span className="font-serif font-bold text-white text-lg">{activePlan.name}</span>
              <span className="text-sm font-semibold text-white/80">${activePlan.price}/{activePlan.billingPeriod}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-5 py-3 border border-zinc-800 hover:bg-white/5 rounded-none text-[10px] text-zinc-400 font-bold uppercase tracking-widest transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="proceed-checkout-btn"
              onClick={handleProceed}
              className="px-8 py-3.5 bg-white hover:bg-neutral-200 text-black rounded-none font-bold text-xs tracking-widest uppercase active:scale-98 transition-all cursor-pointer"
            >
              Proceed to Secure Checkout
            </button>
          </div>
        </div>

        {/* Security / Quality guarantee footer */}
        <div className="mt-4 flex items-center justify-center space-x-4 text-[10px] text-zinc-500 font-medium uppercase tracking-wider">
          <span className="flex items-center">
            <ShieldCheck className="h-3.5 w-3.5 text-zinc-400 mr-1" />
            256-bit Secure Encryption
          </span>
          <span>•</span>
          <span>No Lock-ins, Cancel Online Anytime</span>
        </div>
      </motion.div>
    </div>
  );
}
