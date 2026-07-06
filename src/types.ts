export interface Movie {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  duration: string;
  rating: string;
  year: string;
  genre: string[];
  bannerUrl: string;
  posterUrl: string;
  isPremium: boolean;
  videoUrl: string;
  cast: string[];
  director: string;
  matchScore: number;
}

export interface User {
  name: string;
  email: string;
  isSubscribed: boolean;
  planId: string | null;
  createdAt: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  billingPeriod: string;
  resolution: string;
  videoQuality: string;
  supportedDevices: string[];
  features: string[];
  isPopular?: boolean;
}

export type FlowStep =
  | 'browse'
  | 'details'
  | 'auth-name-email'
  | 'auth-password'
  | 'auth-success-new'
  | 'subscription-plans'
  | 'checkout'
  | 'payment-success'
  | 'player';

export interface LogEntry {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warn';
}

