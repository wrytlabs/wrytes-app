# Wrytes AG Landing Page

A modern, dark-themed landing page for Wrytes AG, showcasing Swiss precision in Bitcoin, Blockchain, and AI technologies.

## 🏗️ Tech Stack

- **Framework**: Next.js 15.4.5 with Page Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.4.17
- **Animations**: Framer Motion
- **Icons**: FontAwesome
- **Forms**: React Hook Form + Zod validation
- **Font**: Inter from Google Fonts

## 🎨 Design Features

- **Dark Theme**: Professional dark color scheme with orange/gold accents
- **Swiss Design**: Clean, minimalist layout with ample whitespace
- **Responsive**: Mobile-first design that works on all devices
- **Animations**: Smooth transitions and scroll-based animations
- **Accessibility**: WCAG 2.1 AA compliant

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Yarn (preferred package manager)

### Installation

1. **Install dependencies**
   ```bash
   yarn install
   ```

2. **Start development server**
   ```bash
   yarn dev
   ```

3. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

- `yarn dev` - Start development server with Turbopack
- `yarn build` - Create production build
- `yarn start` - Start production server
- `yarn lint` - Run ESLint
- `yarn lint:fix` - Fix ESLint errors automatically
- `yarn type-check` - Run TypeScript type checking
- `yarn format` - Format code with Prettier
- `yarn format:check` - Check code formatting
- `yarn analyze` - Analyze bundle size

## 🏗️ Project Structure

```
wrytes-landing/
├── components/
│   ├── layout/           # Layout components
│   │   ├── Header.tsx    # Navigation header
│   │   ├── Footer.tsx    # Site footer
│   │   └── Layout.tsx    # Main layout wrapper
│   ├── sections/         # Page sections
│   │   ├── Hero.tsx      # Hero section
│   │   ├── About.tsx     # About company
│   │   ├── Services.tsx  # Services showcase
│   │   └── Contact.tsx   # Contact section
│   └── ui/              # Reusable UI components
│       ├── Button.tsx    # Button component
│       ├── Card.tsx      # Card component
│       └── ContactForm.tsx # Contact form
├── lib/                 # Utilities and constants
│   ├── constants.ts     # App constants
│   └── utils.ts         # Utility functions
├── pages/               # Next.js pages
│   ├── _app.tsx         # App wrapper
│   ├── _document.tsx    # HTML document
│   ├── index.tsx        # Home page
│   └── 404.tsx          # 404 error page
├── styles/              # Global styles
│   └── globals.css      # Global CSS
├── types/               # TypeScript types
│   └── index.ts         # Type definitions
└── public/              # Static assets
```

## 🎨 Color Palette

- **Background**: `#1a1a1a` (dark-bg)
- **Cards**: `#2a2a2a` (dark-card)
- **Surface**: `#1f1f1f` (dark-surface)
- **Primary Text**: `#ffffff` (text-primary)
- **Secondary Text**: `#a0a0a0` (text-secondary)
- **Muted Text**: `#666666` (text-muted)
- **Orange Accent**: `#ff6b35` (accent-orange)
- **Gold Accent**: `#ffd700` (accent-gold)

## 📱 Sections

1. **Hero** - Company introduction with animated elements
2. **About** - Company overview and values
3. **Services** - Four main service areas with icons
4. **Contact** - Contact form and business information

## 🔧 Configuration

### Environment Variables

The `.env.local` file contains:

```bash
NEXT_PUBLIC_LANDINGPAGE_URL=https://wrytes.io
NEXT_PUBLIC_APP_URL=https://app.wrytes.io
NEXT_PUBLIC_API_URL=https://api.wrytes.io
NEXT_PUBLIC_INDEXER_URL=https://indexer.wrytes.io
```

### Tailwind Configuration

Custom dark theme configuration in `tailwind.config.ts` with:
- Extended color palette
- Custom animations
- Card shadows and effects
- Typography system

## 📈 Performance

- **Lighthouse Score**: 90+ target
- **Page Load Time**: < 3 seconds
- **Build Size**: Optimized with Next.js
- **Images**: WebP/AVIF format support

## 🌐 SEO Features

- Semantic HTML structure
- Meta tags and Open Graph
- Twitter Cards
- Canonical URLs
- Structured data ready

## 🚀 Deployment

### Production Build

```bash
yarn build
yarn start
```

### Build Analysis

```bash
yarn analyze
```

---

**Built with Swiss precision in Zug, Switzerland** 🇨🇭
