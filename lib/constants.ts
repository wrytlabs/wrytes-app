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
  tagline: 'Profit-driven innovation through proprietary Bitcoin strategies',
  description:
    'Swiss-based R&D company specializing in blockchain technology and software development. Our proprietary Bitcoin option trading strategies fund continuous research and innovation.',
  keywords:
    'Crypto Asset Management, Bitcoin Options Trading, Proprietary Trading, R&D, Switzerland, Zug, Profit-Driven, DeFi, Blockchain Technology, Software Development',
};

export const SOCIAL = {
  Github_user: 'https://github.com/wrytes_io',
  Twitter: 'https://twitter.com/wrytes_io',
  Telegram: 'https://t.me/wrytes_io',
};

export const SERVICES = [
  {
    id: 'crypto-asset-management',
    title: 'Proprietary Crypto Asset Management',
    description: 'Profit-driven yield generation using company assets only',
    features: [
      'Bitcoin option trading strategies',
      'Strategic P2P borrowing and lending strategies',
      'Arbitrage, liquidations and market inefficiency exploitation',
      'Strategic borrowing for operational payments',
      'Exclusively company-owned assets - never client funds',
    ],
  },
  {
    id: 'technical-services',
    title: 'Technical Services',
    description: 'Expert development services for clients and partners',
    features: [
      'Architecture design and game theory expertise',
      'Smart contract development and auditing',
      'DeFi project adapters and protocol connectors',
      'Backend systems and API integrations',
      'Automation frameworks and workflows',
    ],
  },
  {
    id: 'platform-development',
    title: 'Platform Development & Innovation',
    description: 'Proprietary tools and cutting-edge research',
    features: [
      'Proprietary blockchain tools and applications',
      'Cutting-edge technology research and prototyping',
      'Safety and monitoring tools, including custom actions',
      'Open-source contributions and community building',
      'Internal tooling for enhanced trading operations',
    ],
  },
  {
    id: 'strategic-partnerships',
    title: 'Strategic Partnerships & Capital Operations',
    description: 'Growth through partnerships and investments',
    features: [
      'Mergers, acquisitions, and strategic partnerships',
      'Resource alignment and mutual goal achievement',
      'Technology and expertise sharing agreements',
      'Capital raising for expansion initiatives',
      'Strategic investments in complementary projects',
    ],
  },
];
