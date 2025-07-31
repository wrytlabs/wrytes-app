# Wrytes Landing Page Project Setup Plan

## Project Overview
This plan outlines the complete setup for the Wrytes AG landing page based on the requirements in `landingpage.md`.

## Phase 1: Project Initialization

### 1.1 Next.js Setup
```bash
npx create-next-app@latest wrytes-landing --typescript --tailwind --eslint --app=false --src-dir=false --import-alias="@/*"
cd wrytes-landing
```

### 1.2 Additional Dependencies
```bash
# Core dependencies
npm install next@13 react react-dom typescript @types/react @types/node

# Styling and UI
npm install tailwindcss postcss autoprefixer
npm install @headlessui/react @heroicons/react
npm install framer-motion # for animations

# Fonts and assets
npm install next-font # for Avenir font loading

# Forms and validation
npm install react-hook-form @hookform/resolvers zod

# SEO and analytics
npm install next-seo

# Development tools
npm install -D @types/react-dom eslint-config-next prettier eslint-config-prettier
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
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'avenir': ['Avenir', 'sans-serif'],
      },
      colors: {
        'swiss-blue': '#0066CC',
        'swiss-green': '#00AA55',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
      },
    },
  },
  plugins: [],
}
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

## Phase 3: Component Development Plan

### 3.1 Layout Components
1. **Header/Navigation**
   - Minimal navigation menu
   - Smooth scroll links to sections
   - Mobile-responsive hamburger menu

2. **Footer**
   - Company information
   - Location (Zug, Switzerland)
   - Simple links

### 3.2 Page Sections (in order)
1. **Hero Section**
   - Company name "Wrytes" with prominent typography
   - Tagline: "Innovating at the intersection of Bitcoin, Blockchain & AI technologies"
   - Value proposition highlighting Swiss precision
   - Primary CTA button
   - Subtle gradient background with animation

2. **About Section**
   - Company overview
   - Location emphasis (Zug, Switzerland)
   - Core values and approach
   - Focus areas presentation

3. **Services Section**
   - Four service cards with hover effects:
     - Software Development
     - Innovation & R&D
     - Bitcoin & Blockchain
     - AI & Machine Learning
   - Interactive cards with modern icons

4. **Contact Section**
   - Contact form with validation
   - Company location
   - Professional styling

### 3.3 Shared Components
1. **Button Component**
   - Primary and secondary variants
   - Hover effects and transitions
   - Accessibility compliance

2. **Card Component**
   - Service cards with hover effects
   - Consistent spacing and shadows

3. **Contact Form**
   - Form validation with react-hook-form + zod
   - Professional styling
   - Loading states

## Phase 4: Implementation Details

### 4.1 Typography System
- Primary: Avenir font family
- Font weights: 300, 400, 600, 700
- Clear hierarchy for headings and body text
- Responsive typography scaling

### 4.2 Color System
- Primary: Black (#000000)
- Secondary: White (#FFFFFF)
- Accent: Swiss Blue (#0066CC) or Swiss Green (#00AA55)
- Grays for subtle elements

### 4.3 Animation Strategy
- Framer Motion for page transitions
- CSS transitions for hover effects
- Subtle entrance animations for sections
- Smooth scroll behavior

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

## Phase 6: Deployment Preparation

### 6.1 Production Build
```bash
npm run build
npm run start
```

### 6.2 Environment Configuration
- Environment variables for contact form
- Analytics configuration
- Performance monitoring setup

### 6.3 Success Metrics Validation
- Page load time < 3 seconds
- Mobile responsiveness verified
- Conversion paths tested
- Professional appearance confirmed

## Development Timeline
- **Week 1**: Project setup and configuration
- **Week 2**: Layout and hero section development
- **Week 3**: About and services sections
- **Week 4**: Contact section and form implementation
- **Week 5**: Testing, optimization, and deployment preparation

## Key Commands for Development
```bash
# Development
npm run dev

# Build
npm run build

# Linting
npm run lint

# Type checking
npx tsc --noEmit
```

This plan provides a comprehensive roadmap for creating the Wrytes landing page that meets all specified requirements while maintaining Swiss design principles and technical excellence.