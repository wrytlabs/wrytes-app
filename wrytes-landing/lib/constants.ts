export type ConfigEnv = {
  verbose: boolean;
  landing: string;
  app: string;
  api: string;
  indexer: string;
};

export const CONFIG: ConfigEnv = {
  verbose: false,
  landing: process.env.NEXT_PUBLIC_LANDINGPAGE_URL || 'https://wrytes.io',
  app: process.env.NEXT_PUBLIC_APP_URL || 'https://app.wrytes.io',
  api: process.env.NEXT_PUBLIC_API_URL || 'https://api.wrytes.io',
  indexer: process.env.NEXT_PUBLIC_INDEXER_URL || 'https://indexer.wrytes.io',
};

export const COMPANY = {
  name: 'Wrytes AG',
  location: 'Zug, Switzerland',
  tagline: 'Innovating at the intersection of Bitcoin, Blockchain & AI technologies',
  description: 'Swiss precision in software development, R&D, Bitcoin/Blockchain technology, and AI solutions.',
};

export const SOCIAL = {
  Github_user: 'https://github.com/wrytes',
  Twitter: 'https://twitter.com/wrytes',
  Telegram: 'https://t.me/wrytes',
};

export const SERVICES = [
  {
    id: 'software-development',
    title: 'Software Development',
    description: 'Custom software solutions across various sectors',
    features: [
      'Building innovative tools and applications',
      'Development of new technologies and platforms',
      'Sector-specific software solutions',
    ],
  },
  {
    id: 'innovation-rd',
    title: 'Innovation & R&D',
    description: 'Research and development in emerging technologies',
    features: [
      'Creation of innovative tools and frameworks',
      'Prototyping and proof-of-concept development',
      'Technology consulting and strategy',
    ],
  },
  {
    id: 'bitcoin-blockchain',
    title: 'Bitcoin & Blockchain',
    description: 'Bitcoin-related software and tools',
    features: [
      'Blockchain development and integration',
      'Cryptocurrency solutions',
      'DeFi and financial technology applications',
    ],
  },
  {
    id: 'ai-ml',
    title: 'AI & Machine Learning',
    description: 'AI development and integration',
    features: [
      'Machine learning solutions',
      'Data analytics and insights',
      'Intelligent automation tools',
    ],
  },
];