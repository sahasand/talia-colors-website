# CLAUDE.md

Project snapshot for Claude Code (claude.ai/code).

## Commands

- `npm run dev` - Development server with Turbopack
- `npm run build` - Build production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Stack

- **Framework**: Next.js 15.3.5, React 19, TypeScript
- **Styling**: Tailwind CSS v4, Framer Motion 12.23.3
- **I18n**: next-intl 4.3.4 (pt, es, en)
- **Fonts**: Geist Sans/Mono via next/font

## Architecture

```
/app/
├── layout.tsx                      # Root redirect to locale
├── [locale]/
│   ├── layout.tsx                 # Localized layout with providers
│   └── page.tsx                   # Main page orchestrator
├── components/
│   ├── ai/                       # AI Color Picker Workflow
│   │   ├── AIColorPickerSection.tsx
│   │   ├── PhotoUpload.tsx
│   │   ├── Questionnaire.tsx
│   │   ├── AIProcessing.tsx
│   │   └── ColorRecommendations.tsx
│   └── ui/
│       ├── HeroSectionSimple.tsx  # 3D carousel hero
│       ├── LanguageSwitcher.tsx
│       ├── SmartGalleryGrid.tsx   # Portfolio gallery
│       ├── TrustSection.tsx       # Trust indicators
│       └── WhatsAppButton.tsx
/messages/                          # Translation files (pt/es/en.json)
/public/                           # Images (1a-11a.png)
/src/i18n/routing.ts              # I18n config
```

## Features

1. **3D Hero Carousel**: 11 images with circular rotation, auto/manual controls, touch gestures, glassmorphism effects
2. **AI Color Picker**: Photo upload → 6-step questionnaire → AI processing → Personalized recommendation → WhatsApp booking
3. **Trust Section**: 4 benefit cards with animated icons and effects
4. **Gallery Grid**: Touch-optimized portfolio transformations
5. **Mobile-First**: 44px touch targets, responsive breakpoints (sm:640px, md:768px, lg:1024px, xl:1280px)
6. **SEO**: Schema.org markup, localized metadata, optimized for Florianópolis region

## Business Context

Professional at-home hair coloring service website for Florianópolis, Brazil. Converts visitors into WhatsApp bookings.

## Key Patterns

- Functional components with hooks
- Client components marked with `'use client'`
- Server components for i18n with async/await
- Framer Motion for all animations
- Mobile-first responsive design
- `useMemo`/`useCallback` for performance
- Blob URL lifecycle managed by parent components
- Error boundaries for robust error handling

## Performance

- Turbopack for fast dev builds
- Next.js Image optimization with AVIF/WebP
- Suspense boundaries for loading states
- Touch interaction debouncing
- Reduced motion support for accessibility

## Current State

- Main branch deployed
- All features functional
- SEO optimized
- Full mobile responsiveness
- Three language support active

## Deployment

- GitHub repository: https://github.com/sahasand/talia-colors-website
- Auto-deployed to Vercel: https://vercel.com/sahasands-projects/talia-colors-website