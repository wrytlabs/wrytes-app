# Wrytes Landing Page Project Setup Plan

## Project Overview
This plan outlines the complete setup for the Wrytes AG landing page based on the requirements in `landingpage.md` and the dark theme design inspiration from the provided screenshots.

## Design Philosophy
- **Style**: Modern dark theme with sophisticated gradients and clean typography
- **Color Palette**: Dark backgrounds with orange/gold accents and white text
- **Typography**: Inter font family for modern, clean text with Avenir for branding
- **Layout**: Card-based design with rounded corners and subtle shadows
- **Approach**: Mobile-first responsive design with dark theme optimization

## Phase 1: Project Initialization

### 1.1 Next.js Setup
```bash
npx create-next-app@latest wrytes-landing --typescript --tailwind --eslint --app=false --src-dir=false --import-alias="@/*"
cd wrytes-landing
```

### 1.2 Additional Dependencies
```bash
# Core dependencies
yarn add next@13 react react-dom typescript @types/react @types/node

# Styling and UI
yarn add tailwindcss postcss autoprefixer
yarn add @headlessui/react @heroicons/react
yarn add framer-motion # for animations

# Icons
yarn add @fortawesome/fontawesome-svg-core
yarn add @fortawesome/free-solid-svg-icons
yarn add @fortawesome/free-brands-svg-icons
yarn add @fortawesome/react-fontawesome

# Fonts and assets
yarn add next-font # for Inter and Avenir font loading
yarn add @next/font # for optimized font loading

# Forms and validation
yarn add react-hook-form @hookform/resolvers zod

# SEO and analytics
yarn add next-seo

# Development tools
yarn add -D @types/react-dom eslint-config-next prettier eslint-config-prettier
```

### 1.3 Project Structure
```
wrytes-landing/
├── pages/
│   ├── _app.tsx
│   ├── _document.tsx
│   ├── index.tsx
│   └── 404.tsx
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Layout.tsx
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Services.tsx
│   │   └── Contact.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       └── ContactForm.tsx
├── styles/
│   ├── globals.css
│   └── components.css
├── public/
│   ├── images/
│   └── icons/
├── lib/
│   ├── fonts.ts
│   └── utils.ts
└── types/
    └── index.ts
```

## Phase 2: Configuration Setup

### 2.1 Tailwind Configuration
```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'avenir': ['Avenir', 'sans-serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Dark theme colors based on screenshots
        'dark-bg': '#1a1a1a',
        'dark-card': '#2a2a2a',
        'dark-surface': '#1f1f1f',
        'accent-orange': '#ff6b35',
        'accent-gold': '#ffd700',
        'text-primary': '#ffffff',
        'text-secondary': '#a0a0a0',
        'text-muted': '#666666',
        'gradient-dark': 'linear-gradient(135deg, #1a1a1a 0%, #2d1b1b 100%)',
        'gradient-card': 'linear-gradient(135deg, #2a2a2a 0%, #3a2a2a 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.4)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
};

export default config;
```

### 2.2 TypeScript Configuration
```json
// tsconfig.json (enhance default)
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["components/*"],
      "@/lib/*": ["lib/*"],
      "@/types/*": ["types/*"]
    }
  }
}
```

### 2.3 Next.js Configuration
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    optimizeCss: true,
  },
}

module.exports = nextConfig
```

### 2.4 App Configuration
```typescript
// app.config.ts
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
```

**Purpose**: Centralized configuration management for all app-related settings including API endpoints, URLs, and environment variables.

## Phase 3: Component Development Plan

### 3.1 Layout Components
1. **Header/Navigation**
   - Dark theme with clean typography
   - Logo with accent dot (orange/gold)
   - Minimal navigation links in uppercase
   - Prominent CTA button with external link icon
   - Rounded corners and subtle shadows

2. **Footer**
   - Dark background with gradient
   - Company information in muted text
   - Location (Zug, Switzerland)
   - Simple links with hover effects

### 3.2 Page Sections (in order)
1. **Hero Section**
   - Dark gradient background with subtle patterns
   - Company name "Wrytes" in large, bold typography
   - Tagline: "Innovating at the intersection of Bitcoin, Blockchain & AI technologies"
   - Value proposition with Swiss precision emphasis
   - Prominent CTA button with arrow icon
   - Centered layout with ample whitespace

2. **About Section**
   - Dark card-based layout
   - Company overview with clean typography
   - Location emphasis (Zug, Switzerland) in accent color
   - Core values and approach in structured cards
   - Focus areas presented in rounded containers

3. **Services Section**
   - Four service cards with dark backgrounds and rounded corners:
     - Software Development
     - Innovation & R&D
     - Bitcoin & Blockchain
     - AI & Machine Learning
   - Cards with subtle shadows and hover effects
   - Modern icons with accent colors
   - Gradient backgrounds for depth

4. **Contact Section**
   - Dark theme contact form with validation
   - Company location in accent color
   - Professional styling with rounded corners
   - Gradient backgrounds for visual appeal

### 3.3 Shared Components
1. **Button Component**
   - Dark theme with rounded corners
   - Primary: Dark background with white text and accent colors
   - Secondary: Transparent with border
   - Hover effects with shadow elevation
   - Arrow icons for external links
   - Accessibility compliance

2. **Card Component**
   - Dark backgrounds with gradient overlays
   - Rounded corners (xl and 2xl)
   - Subtle shadows with hover elevation
   - Consistent spacing and typography
   - Accent color highlights

3. **Contact Form**
   - Dark theme form with validation
   - Rounded input fields with subtle borders
   - Professional styling with accent colors
   - Loading states with dark theme
   - Error states with accent colors

4. **Footer Component Example**
```typescript
// components/layout/Footer.tsx
import React from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faTelegram, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import Link from 'next/link';

// Mock SOCIAL object for example purposes
const SOCIAL = {
	Github_user: 'https://github.com/wrytes',
	Twitter: 'https://twitter.com/wrytes',
	Telegram: 'https://t.me/wrytes'
};

interface FooterItemProps {
	link: string;
	text: string;
	icon: IconProp;
}

export function FooterItem({ link, text, icon }: FooterItemProps) {
	return (
		<Link href={link} target="_blank" rel="noreferrer" className="flex gap-1 hover:opacity-70 transition-opacity">
			<FontAwesomeIcon icon={icon} className="w-6 h-6 text-text-secondary hover:text-accent-orange" />
			<div className="hidden sm:block text-text-secondary hover:text-accent-orange">{text}</div>
		</Link>
	);
}

export default function Footer() {
	return (
		<footer className="bg-dark-bg border-t border-dark-card py-8">
			<div className="container mx-auto px-4">
				<div className="flex flex-col items-center gap-6">
					<div className="text-text-muted text-sm">
						© 2024 Wrytes AG. Zug, Switzerland
					</div>
					<ul className="flex items-center justify-center gap-8">
						<li>
							<FooterItem link={SOCIAL.Github_user} text="Github" icon={faGithub} />
						</li>
						<li>
							<FooterItem link={SOCIAL.Twitter} text="Twitter" icon={faXTwitter} />
						</li>
						<li>
							<FooterItem link={SOCIAL.Telegram} text="Telegram" icon={faTelegram} />
						</li>
					</ul>
				</div>
			</div>
		</footer>
	);
}
```

## Phase 4: Implementation Details

### 4.1 Typography System
- Primary: Inter font family for modern, clean look
- Secondary: Avenir font family for brand elements
- Font weights: 300, 400, 600, 700, 900
- Clear hierarchy with large, bold headings
- Uppercase navigation and labels
- Responsive typography scaling
- Accent colors for important text elements

### 4.2 Color System
- **Primary Background**: Dark theme (#1a1a1a) with gradient variations
- **Card Backgrounds**: Dark gray (#2a2a2a) with subtle gradients
- **Text Colors**: 
  - Primary: White (#ffffff)
  - Secondary: Light gray (#a0a0a0)
  - Muted: Dark gray (#666666)
- **Accent Colors**: 
  - Orange (#ff6b35) for highlights and CTAs
  - Gold (#ffd700) for important numbers and headings
- **Gradients**: Dark reddish-brown gradients for depth
- **Shadows**: Deep shadows for card elevation

### 4.3 Animation Strategy
- Framer Motion for page transitions
- CSS transitions for hover effects with shadow elevation
- Subtle entrance animations for sections
- Smooth scroll behavior
- Floating animations for background elements
- Card hover effects with shadow transitions
- Button hover states with scale effects

### 4.4 Performance Optimization
- Image optimization with Next.js Image component
- Font preloading for Avenir
- Code splitting by route
- CSS optimization with Tailwind purging

## Phase 5: Quality Assurance

### 5.1 Testing Strategy
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Mobile responsiveness testing
- Accessibility testing with screen readers
- Performance testing with Lighthouse

### 5.2 SEO Implementation
- Meta tags for all pages
- Structured data markup
- Open Graph tags for social sharing
- Semantic HTML structure

### 5.3 Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Proper ARIA labels
- Color contrast verification

## Phase 6: Visual Design Implementation

### 6.1 Dark Theme Implementation
- **Background**: Dark gradient backgrounds (#1a1a1a to #2d1b1b)
- **Cards**: Dark gray surfaces (#2a2a2a) with rounded corners
- **Typography**: Clean Inter font with bold headings and muted body text
- **Accents**: Orange (#ff6b35) and gold (#ffd700) for highlights
- **Shadows**: Deep shadows for card elevation and depth

### 6.2 Layout Patterns from Screenshots
- **Header**: Clean navigation with logo and prominent CTA button
- **Hero**: Centered layout with large typography and arrow CTAs
- **Cards**: Rounded containers with gradient backgrounds and shadows
- **Metrics**: Bold numbers in accent colors with descriptive text below
- **Sections**: Structured content blocks with clear visual hierarchy

### 6.3 Interactive Elements
- **Buttons**: Dark backgrounds with white text and arrow icons
- **Hover Effects**: Shadow elevation and subtle scale animations
- **Navigation**: Uppercase text with clean spacing
- **Forms**: Dark theme inputs with rounded corners

### 6.4 Environment Variables
```bash
# .env.local
NEXT_PUBLIC_LANDINGPAGE_URL=https://wrytes.io
NEXT_PUBLIC_APP_URL=https://app.wrytes.io
NEXT_PUBLIC_API_URL=https://api.wrytes.io
NEXT_PUBLIC_INDEXER_URL=https://indexer.wrytes.io
```

## Phase 7: Deployment Preparation

### 7.1 Production Build
```bash
yarn build
yarn start
```

### 7.2 Environment Configuration
- Environment variables for contact form
- Analytics configuration
- Performance monitoring setup

### 7.3 Success Metrics Validation
- Page load time < 3 seconds
- Mobile responsiveness verified
- Conversion paths tested
- Professional appearance confirmed

## Development Timeline
- **Week 1**: Project setup, configuration, and dark theme implementation
- **Week 2**: Layout components and hero section with dark theme styling
- **Week 3**: About and services sections with card-based design
- **Week 4**: Contact section, form implementation, and interactive elements
- **Week 5**: Testing, optimization, performance tuning, and deployment preparation

## Quality Assurance Checklist
- [ ] Dark theme consistency across all components
- [ ] Responsive design on all devices
- [ ] Accessibility compliance (WCAG 2.1 AA)
- [ ] Performance optimization (Lighthouse score > 90)
- [ ] Cross-browser compatibility
- [ ] SEO implementation and meta tags
- [ ] Contact form functionality
- [ ] Social media links integration

## Key Commands for Development
```bash
# Development
yarn dev

# Build
yarn build

# Linting
yarn lint

# Type checking
yarn tsc --noEmit

# Format code
yarn format

# Run tests
yarn test

# Analyze bundle
yarn analyze
```

## File Structure Summary
```
wrytes-landing/
├── pages/                    # Next.js pages
├── components/               # React components
│   ├── layout/              # Layout components
│   ├── sections/            # Page sections
│   └── ui/                  # Reusable UI components
├── styles/                  # Global styles
├── public/                  # Static assets
├── lib/                     # Utilities and configurations
├── types/                   # TypeScript type definitions
├── app.config.ts           # App configuration
├── tailwind.config.ts      # Tailwind configuration
├── next.config.js          # Next.js configuration
└── tsconfig.json           # TypeScript configuration
```

This plan provides a comprehensive roadmap for creating the Wrytes landing page that meets all specified requirements while maintaining Swiss design principles and technical excellence.