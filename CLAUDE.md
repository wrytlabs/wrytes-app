# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is the Wrytes repository - an early-stage project for a Swiss AG company based in Zug, Switzerland specializing in software development, R&D, Bitcoin/Blockchain technology, and AI.

## Current State

The repository is in its initial planning phase with comprehensive documentation:
- `ideas/landingpage.md` - Detailed specifications for company landing page
- `ideas/project-setup-plan.md` - Complete implementation roadmap with dark theme design
- `ideas/Footer.tsx` - Example component showing the intended code structure

## Planned Technology Stack

**Core Technologies:**
- **Framework**: Next.js 13+ with Page Router (not App Router)
- **Language**: TypeScript with strict type checking
- **Styling**: Tailwind CSS with custom dark theme configuration
- **Fonts**: Inter (primary), Avenir (branding)
- **Animations**: Framer Motion for page transitions and interactions
- **Icons**: FontAwesome (solid, brands) with React integration
- **Forms**: React Hook Form with Zod validation

**Project Structure (When Implemented):**
```
/
├── pages/              # Next.js pages with Page Router
├── components/
│   ├── layout/        # Header, Footer, Layout
│   ├── sections/      # Hero, About, Services, Contact
│   └── ui/           # Button, Card, ContactForm
├── styles/           # Global CSS and Tailwind config
├── lib/             # Utilities and configurations
├── types/           # TypeScript definitions
└── public/          # Static assets
```

## Design System & Theme

**Dark Theme Implementation:**
- Primary background: `#1a1a1a` with gradient variations
- Card backgrounds: `#2a2a2a` with subtle gradients
- Accent colors: Orange (`#ff6b35`) and Gold (`#ffd700`)
- Typography: Clean Inter font with bold headings
- Shadows: Deep shadows for card elevation
- Rounded corners: xl (1rem) and 2xl (1.5rem)

**Tailwind Configuration:**
Custom color system defined in tailwind.config.ts with dark theme variables, custom animations (fade-in, slide-up, float), and extended shadows for card elevation.

## Development Commands (When Package.json Exists)

Based on the project setup plan, these commands will be available:
```bash
yarn dev          # Start development server
yarn build        # Build for production
yarn lint         # Run ESLint
yarn tsc --noEmit # TypeScript type checking
yarn format      # Format code with Prettier
```

## Implementation Guidelines

**Code Style:**
- Follow the existing Footer.tsx pattern for component structure
- Use TypeScript interfaces for props and data structures
- Implement responsive design with Tailwind's mobile-first approach
- Include proper ARIA labels and accessibility features
- Use Next.js Image component for optimized images

**Component Architecture:**
- Functional components with TypeScript interfaces
- Extract reusable UI components (Button, Card, etc.)
- Use composition pattern for layout components
- Implement proper error boundaries and loading states

**Performance Requirements:**
- Page load time < 3 seconds
- Lighthouse score > 90
- Optimized images with WebP/AVIF formats
- Code splitting by route
- Font preloading for custom fonts

## Company Context

**Business Focus:**
- Swiss precision and reliability in software development
- Bitcoin/Blockchain technology and tools
- AI & Machine Learning solutions
- Innovation & R&D in emerging technologies
- Option trading on Bitcoin for cashflow generation

**Brand Voice:**
- Professional, trustworthy, innovative
- Swiss reliability emphasis
- Technical expertise but accessible
- Confidence in financial technology solutions

## Environment Configuration

When implementing, use these environment variables:
```bash
NEXT_PUBLIC_LANDINGPAGE_URL=https://wrytes.io
NEXT_PUBLIC_APP_URL=https://app.wrytes.io
NEXT_PUBLIC_API_URL=https://api.wrytes.io
NEXT_PUBLIC_INDEXER_URL=https://indexer.wrytes.io
```

## Quality Standards

- WCAG 2.1 AA accessibility compliance
- Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- Mobile-first responsive design
- SEO optimization with proper meta tags and structured data
- TypeScript strict mode with no any types
- Professional Swiss design aesthetic with dark theme