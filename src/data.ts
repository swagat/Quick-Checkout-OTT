import { Movie, SubscriptionPlan } from './types';

export const MOVIES: Movie[] = [
  {
    id: 'cyberpunk-odyssey',
    title: 'Cyberpunk Odyssey',
    tagline: 'In the shadow of artificial gods, humanity reboots.',
    description: 'A brilliant cybernetic mercenary uncovers a massive corporate conspiracy that threatens to rewrite human consciousness. Trapped in the neon canyons of Neo-Tokyo, they must partner with an outlaw AI to orchestrate the ultimate digital heist.',
    category: 'Sci-Fi Thriller',
    duration: '2h 14m',
    rating: 'PG-13',
    year: '2026',
    genre: ['Cyberpunk', 'Sci-Fi', 'Action', 'Thriller'],
    bannerUrl: 'https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop',
    isPremium: true,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', // we can use standard public sample videos
    cast: ['Alex Mercer', 'Evelyn Cole', 'Hiroshi Tanaka'],
    director: 'Denis Villeneuve',
    matchScore: 98
  },
  {
    id: 'astra-void',
    title: 'Astra Void',
    tagline: 'Where gravity ends, the voyage begins.',
    description: 'During a deep space exploration mission to the edge of the observable universe, a pioneer crew encounters an ancient celestial anomaly that warps time, testing their sanity and the boundaries of cosmic physics.',
    category: 'Epic Sci-Fi',
    duration: '2h 45m',
    rating: 'PG-13',
    year: '2025',
    genre: ['Sci-Fi', 'Adventure', 'Drama'],
    bannerUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=600&auto=format&fit=crop',
    isPremium: true,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    cast: ['Christian Bale', 'Jessica Chastain', 'David Oyelowo'],
    director: 'Christopher Nolan',
    matchScore: 95
  },
  {
    id: 'valor-legend',
    title: 'Chronicles of Eldoria',
    tagline: 'The embers of magic still burn.',
    description: 'An ancient guardian must awaken from a century of slumber to guide an unlikely group of young heroes across a shifting landscape of mythical beasts, deep-seated alliances, and rising dark magic.',
    category: 'Fantasy Adventure',
    duration: '2h 08m',
    rating: 'PG',
    year: '2025',
    genre: ['Fantasy', 'Adventure', 'Action'],
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600&auto=format&fit=crop',
    isPremium: true,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    cast: ['Saoirse Ronan', 'Ian McKellen', 'Dev Patel'],
    director: 'Peter Jackson',
    matchScore: 92
  },
  {
    id: 'neon-noir',
    title: 'The Tokyo Syndicate',
    tagline: 'Honesty is a luxury. Survival is a full-time job.',
    description: 'An undercover detective in Tokyo becomes entangled with the city\'s most dangerous syndicate while investigating the disappearance of a tech billionaire\'s daughter, blurring the line between justice and betrayal.',
    category: 'Crime Thriller',
    duration: '1h 56m',
    rating: 'R',
    year: '2026',
    genre: ['Crime', 'Thriller', 'Noir'],
    bannerUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=600&auto=format&fit=crop',
    isPremium: true,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    cast: ['Ken Watanabe', 'Florence Pugh', 'Andrew Koji'],
    director: 'Michael Mann',
    matchScore: 89
  },
  {
    id: 'echoes-of-silence',
    title: 'Arctic Whisper',
    tagline: 'Some secrets are best left frozen.',
    description: 'A glaciologist working at an isolated research outpost in Greenland discovers deep-frozen radio signals dating back to the 1940s, leading to a suspenseful investigation under the midnight sun.',
    category: 'Mystery Drama',
    duration: '1h 42m',
    rating: 'PG',
    year: '2024',
    genre: ['Mystery', 'Drama', 'Free Content'],
    bannerUrl: 'https://images.unsplash.com/photo-1517783999520-f068d7431a60?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1482862549707-f63cb32c5fd9?q=80&w=600&auto=format&fit=crop',
    isPremium: false,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    cast: ['Alicia Vikander', 'Mads Mikkelsen'],
    director: 'Robert Eggers',
    matchScore: 86
  }
];

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'premium-basic',
    name: 'Basic Stream',
    price: 6.99,
    billingPeriod: 'month',
    resolution: '1080p Full HD',
    videoQuality: 'Great',
    supportedDevices: ['Mobile', 'Tablet', 'Laptop'],
    features: [
      'Ad-supported content streams',
      'Watch on 1 device at a time',
      'Unlimited movies & TV shows',
      'Cancel anytime online'
    ]
  },
  {
    id: 'premium-standard',
    name: 'Standard Stream',
    price: 13.99,
    billingPeriod: 'month',
    resolution: '1080p Full HD',
    videoQuality: 'Excellent',
    supportedDevices: ['Mobile', 'Tablet', 'Laptop', 'TV'],
    features: [
      '100% Ad-Free streaming',
      'Watch on 2 devices simultaneously',
      'Unlimited downloads for offline play',
      'Immersive audio options'
    ],
    isPopular: true
  },
  {
    id: 'premium-ultra',
    name: 'Ultra Premium',
    price: 19.99,
    billingPeriod: 'month',
    resolution: '4K Ultra HD + HDR',
    videoQuality: 'Cinematic',
    supportedDevices: ['Mobile', 'Tablet', 'Laptop', 'TV', 'Consoles'],
    features: [
      'Ad-free with cinematic Dolby Vision',
      'Watch on 4 devices simultaneously',
      'Dolby Atmos spatial surround sound',
      'Priority access to direct-to-OTT releases'
    ]
  }
];

// Pre-registered users to demonstrate password prompt
export const MOCK_EXISTING_USERS = [
  {
    email: 'swagatmishra@gmail.com',
    name: 'Swagat Mishra',
    password: 'password123',
    isSubscribed: false,
    planId: null
  },
  {
    email: 'user@example.com',
    name: 'Alex Rivera',
    password: 'password123',
    isSubscribed: true,
    planId: 'premium-standard'
  },
  {
    email: 'unsubscribed@example.com',
    name: 'Jane Smith',
    password: 'password123',
    isSubscribed: false,
    planId: null
  }
];
