export type ConfigEnv = {
  verbose: boolean;
  app: string;
  api: string;
  indexer: string;
};

export const CONFIG: ConfigEnv = {
  verbose: false,
  app: process.env.NEXT_PUBLIC_APP_URL || 'https://app.wrytes.io',
  api: process.env.NEXT_PUBLIC_API_URL || 'https://api.wrytes.io',
  indexer: process.env.NEXT_PUBLIC_INDEXER_URL || 'https://indexer.wrytes.io',
};

export const COMPANY = {
  name: 'Wrytes AG',
  location: 'Zug, Switzerland',
  tagline: 'Software Development & Distributed Ledger Technologies & AI',
  shortDescription:
    'Swiss R&D company specializing in developing and deploying Software Solutions for Distributed Ledger Technologies and AI.',
  description:
    'We develop cutting-edge tools and adapters/integrations from smart contracts to APIs and applications, with expertise in accounting automation, governance overlays, and advanced transaction systems. Independent revenue through Proprietary Asset Management funds our continuous innovation.',
  keywords:
    'Software Development, Distributed Ledger Technologies, AI, Full-Stack Development, Smart Contracts, APIs, Automation, Governance Tools, DAO Management, Transaction Systems, Switzerland, Zug, R&D, DeFi, Blockchain Technology',
};

export const SOCIAL = {
  Github_user: 'https://github.com/wrytes_io',
  Twitter: 'https://twitter.com/wrytes_io',
  Telegram: 'https://t.me/wrytes_io',
};

export const SERVICES = [
  {
    id: 'technical-services',
    title: 'Technical Services',
    description: 'Expert development services for clients and partners',
    features: [
      'Architecture design and system integration',
      'Smart contract development and auditing',
      'Distributed ledger adapters and protocol connectors',
      'Backend systems and API integrations',
      'Automation frameworks and workflows',
    ],
  },
  {
    id: 'platform-development',
    title: 'Platform Development & Innovation',
    description: 'Proprietary tools and cutting-edge research',
    features: [
      'Cutting-edge research and prototyping',
      'Distributed ledger tools and applications',
      'Safety and monitoring systems',
      'Open-source contributions and community building',
      'Business tools for enhanced operations',
    ],
  },
  {
    id: 'strategic-partnerships',
    title: 'Strategic Partnerships & Capital Operations',
    description: 'Growth through partnerships and investments',
    features: [
      'Strategic partnerships in technology projects',
      'Resource alignment and shared objectives',
      'Technology and expertise sharing agreements',
      'Investment opportunities and joint ventures',
      'Expansion initiatives and market development',
    ],
  },
  {
    id: 'crypto-asset-management',
    title: 'Proprietary Asset Management',
    description: 'Independent revenue generation funding R&D operations',
    features: [
      'Bitcoin-based revenue strategies',
      'Strategic yield optimization approaches',
      'Market inefficiency identification and exploitation',
      'Operational financing through strategic positions',
      'Exclusively company-owned assets',
    ],
  },
];
