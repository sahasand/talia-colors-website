# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Development**
- `npm run dev` - Start development server with Turbopack (fast bundler)
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

**Testing**
- No test framework configured yet

## Project Overview

This is a sophisticated hair colorist website featuring an AI-powered color recommendation system with full mobile responsiveness and multi-language support. The main application provides a complete user journey from photo upload through personalized color analysis and appointment booking, optimized for seamless experience across all devices from smartphones to desktops. The site is fully internationalized supporting Portuguese (default), Spanish, and English locales.

## Architecture

**Next.js 15 App Router Structure with Internationalization**
- Uses modern App Router architecture (not Pages Router) with next-intl for i18n
- `/app` directory contains all routes and layouts with locale-based routing
- `app/layout.tsx` - Root layout that redirects to default locale
- `app/page.tsx` - Root page that redirects to default locale (Portuguese)
- `app/[locale]/layout.tsx` - Localized layout with Geist font loading, metadata, and NextIntlClientProvider
- `app/[locale]/page.tsx` - Main localized page orchestrating all sections
- `app/globals.css` - Global styles with Tailwind CSS v4
- `src/i18n/routing.ts` - Internationalization routing configuration
- `messages/` - Translation files for pt.json, es.json, en.json

**Component Organization**
```
/app/components/
├── ErrorBoundary.tsx      # Global error boundary for error handling
├── ai/                    # AI Color Picker Workflow (Mobile-Optimized)
│   ├── AIColorPickerSection.tsx    # Main orchestrator with responsive design
│   ├── PhotoUpload.tsx             # File upload + camera capture, touch-friendly
│   ├── Questionnaire.tsx           # Multi-step style quiz, mobile-first layout
│   ├── AIProcessing.tsx            # Simulated AI analysis, responsive progress
│   ├── ColorRecommendations.tsx    # Results display, mobile-optimized
│   └── types.ts                    # Shared TypeScript interfaces
└── ui/                    # Reusable UI Components (Responsive & Internationalized)
    ├── HeroSectionSimple.tsx       # Active 3D carousel hero with advanced effects
    ├── HeroSection.tsx.broken       # Legacy hero component (backup)
    ├── LanguageSwitcher.tsx         # Locale switching component
    ├── SmartGalleryGrid.tsx         # Portfolio transformations, touch-optimized
    └── WhatsAppButton.tsx           # Reusable WhatsApp booking component
```

**Technology Stack**
- Next.js 15.3.5 with React 19 (latest versions)
- TypeScript with strict mode
- Tailwind CSS v4 (latest) with PostCSS and mobile-first responsive design
- Framer Motion 12.23.3 for animations with mobile optimizations
- next-intl 4.3.4 for internationalization and locale management
- Geist Sans and Geist Mono fonts via next/font
- Turbopack for fast development builds
- Advanced image optimization with AVIF/WebP support
- WebAssembly support for potential ML model integration
- Enhanced security headers and CORS configuration
- Mobile-first responsive utilities and touch-optimized interactions

## Key Features

**AI Color Picker Workflow (Core Feature)**
1. **Photo Upload**: Drag & drop + live camera capture with validation, mobile-optimized touch interface
2. **Style Questionnaire**: 6-step quiz (skin tone, lifestyle, maintenance, etc.) with mobile-friendly single-column layout
3. **AI Processing**: Realistic simulation with progress visualization, responsive across all devices
4. **Color Recommendations**: Intelligent single recommendation with booking integration, touch-optimized for mobile

**Mobile Experience Features**
- Fully responsive design with mobile-first approach
- Touch-friendly interface with 44px minimum touch targets
- Responsive typography scaling from mobile to desktop
- Mobile-optimized photo upload and camera capture
- Single-column layouts on mobile for better readability
- Context-aware button sizing and text content

**3D Interactive Hero Carousel (Featured) - Advanced Visual Effects**
- **Circular Rotation System**: True 3D carousel where all 11 images physically rotate through circular positions
- **Dynamic Position Calculation**: Mathematical algorithm positions images on responsive 3D circles
- **All Images Featured**: Every transformation gets prominent front-center display time with enhanced scaling
- **Hybrid Auto/Manual System**: Auto-rotates every 4 seconds with intelligent pause/resume
- **Multi-Control Interface**: Click images, navigation arrows, swipe gestures (mobile)
- **Smart Interaction**: Pauses auto-rotation on user interaction, resumes after 10 seconds
- **Touch-Optimized**: Enhanced haptic feedback, conflict prevention, optimized touch targets
- **Visual-Only Interface**: Clean, text-free design with intuitive discovery-based controls
- **Mobile-Optimized 3D Circles**: Mobile (90px radius), Tablet (180px radius), Desktop (260px radius) - all with 11 images
- **Smooth Transitions**: 1.5-second spring physics for natural movement between positions
- **Advanced Visual Effects**:
  - **Glassmorphism Design**: Frosted glass borders with backdrop blur effects
  - **Dynamic Ambient Lighting**: Background gradients shift with active image colors
  - **Color-Matched Glows**: Active images emit glowing rings matching their color palette
  - **Enhanced Depth Shadows**: Multi-layered shadow system with color-coordinated effects
  - **Sophisticated Hover States**: 3D tilt animations with spring physics (rotateY: 15°, rotateX: 10°)
- **Premium Button Effects**: Morphing backgrounds, pulsing rings, animated sparkles on hover

**Additional Features**
- Portfolio gallery with touch-optimized interactions
- WhatsApp booking integration throughout with mobile-friendly messaging
- Cross-device consistency with progressive enhancement
- Multi-language support with language switcher (Portuguese, Spanish, English)
- SEO-optimized metadata with locale-specific content
- Error boundaries for robust error handling

## Code Patterns & Conventions

**React Patterns**
- Functional components with hooks throughout
- Client-side components marked with `'use client'`
- Server-side components for internationalization with async/await patterns
- Proper state management for multi-step workflows
- Resource cleanup with useEffect hooks
- Error boundaries for component-level error handling

**TypeScript Patterns**
- Comprehensive interface definitions in `types.ts`
- Type-safe prop passing between components
- Union types for workflow steps and categories
- Strict mode enabled for build-time error catching

**Animation Patterns**
- Framer Motion for all animations with mobile performance considerations
- Consistent entrance/exit transitions across all screen sizes
- Staggered animations with appropriate delays
- Micro-interactions for enhanced UX
- Reduced motion support for mobile performance and accessibility

**Responsive Design Patterns**
- Mobile-first breakpoint strategy (sm: 640px, md: 768px, lg: 1024px, xl: 1280px)
- Progressive enhancement from mobile to desktop
- Touch-friendly minimum sizing (44px touch targets)
- Conditional content rendering for optimal mobile UX
- Responsive typography with proper scaling ratios
- Flexible grid systems that adapt to screen size

**Performance Optimizations**
- Proper memory cleanup for blob URLs and camera streams
- Blob URL lifecycle managed by AIColorPickerSection (not PhotoUpload) to prevent premature cleanup
- Next.js Image component for optimized image loading with responsive sizing
- Suspense boundaries for loading states
- Efficient re-renders with proper dependency arrays and React Hook optimizations
- Mobile-specific performance optimizations (reduced shadows, optimized animations)
- Touch interaction debouncing for better mobile performance
- Responsive image loading with appropriate sizes for different devices
- **React Performance Patterns:**
  - `useMemo` for expensive calculations (questions array, top recommendations)
  - `useCallback` for event handlers and utility functions to prevent unnecessary re-renders
  - Proper dependency arrays to ensure optimal memoization
  - Hook ordering compliance to follow Rules of Hooks
  - Memoized component functions for complex UI components

## Development Notes

**Styling**
- Font variables available as `--font-geist-sans` and `--font-geist-mono`
- Dark mode support built into CSS with media queries
- Gradient-based color system for brand consistency
- Custom CSS properties for theming
- Mobile-first responsive utilities in globals.css
- Touch-optimized interaction styles
- Responsive container padding and spacing
- Mobile-specific scrollbar optimizations

**State Management**
- Local component state (no global state management)
- Photo and questionnaire data passed through props
- Step-based workflow with clear progression
- Form validation and error handling

**Integration Points**
- WhatsApp booking with pre-filled messages and locale-specific contact information
- Camera API for selfie capture with enhanced permissions
- File system API for photo uploads
- Responsive image handling for user photos
- Advanced image optimization pipeline (AVIF, WebP formats)
- Cross-Origin security policies for AI/ML integrations
- WebAssembly support for future ML model deployment
- next-intl for server-side translations and client-side locale switching
- Static generation with locale-specific routes and metadata

**Important Notes**
- Hot reload enabled for instant development feedback
- All React components should be functional components with TypeScript
- Image optimization warnings for blob URLs are expected (user-uploaded content)
- Memory management is critical for camera and file operations
- Blob URLs created in PhotoUpload persist until AIColorPickerSection cleanup to ensure image loads in ColorRecommendations
- **Current Hero Images**: Uses 1a.png through 11a.png (11 total images) - older img1-6.png and transform1-3.png are legacy backups
- **Active Hero Component**: HeroSectionSimple.tsx is the current implementation with advanced effects
- **Mobile Viewport Priority**: All layout optimizations prioritize mobile-first design with viewport constraint handling

## Business Logic

**AI Color Analysis Simulation**
- Sophisticated filtering based on questionnaire responses
- Confidence scoring and suitability matching
- Single "perfect" recommendation approach (highest confidence)
- Realistic processing delays for better UX

**User Journey**
1. Hero section engagement with responsive carousel and touch interactions
2. AI color picker interaction optimized for mobile photo upload and questionnaire
3. Portfolio gallery browsing with touch-friendly grid and hover states
4. Direct booking via WhatsApp with mobile-optimized messaging

**Mobile User Experience Considerations**
- Seamless photo upload from mobile camera or gallery
- Touch-friendly questionnaire with single-column layout
- Responsive progress indicators and step navigation
- Mobile-optimized booking flow with pre-filled WhatsApp messages

**3D Carousel Technical Implementation**
- **Dynamic Position Algorithm**: `calculateImagePosition(imageIndex, totalImages, currentIndex)` using trigonometric functions
- **Circular Mathematics**: `angle = (relativeIndex / totalImages) * Math.PI * 2` for precise positioning
- **Mobile-Optimized Responsive Scaling**: 
  - Mobile: radiusX: 90px, radiusZ: 70px, baseScale: 0.6
  - Tablet: radiusX: 180px, radiusZ: 135px, baseScale: 0.75  
  - Desktop: radiusX: 260px, radiusZ: 195px, baseScale: 0.8
- **Spring Physics**: 1.5-second transitions with stiffness: 60, damping: 25 for natural movement
- **Memory Management**: `useCallback` for position calculator, proper dependency arrays for optimization
- **Touch Integration**: Velocity-based haptic feedback, conflict prevention, enhanced touch targets
- **Viewport Optimization**: Compressed spacing and sizing for mobile viewport constraints
- **Enhanced Visual Effects Implementation**:
  - Dynamic background gradients following active image colors
  - Multi-layer shadow systems with color coordination
  - Glassmorphism effects with backdrop-filter: blur(10px)
  - Sophisticated hover animations with 3D transforms

**Key Integrations**
- WhatsApp Business for appointment booking with locale-specific contact information
- Instagram for social media presence with locale-specific handles
- Camera permissions for selfie capture
- File validation and processing for uploads
- Multi-language content management through JSON translation files

## File Structure & Assets

**Public Assets**
```
/public/
├── 1a.png - 11a.png    # 11 Hero carousel transformation images (primary)
├── img1.png - img6.png # Legacy transformation images (backup)
└── SVG icons (next.svg, vercel.svg, etc.)
```

**Internationalization Assets**
```
/messages/
├── pt.json             # Portuguese translations (default locale)
├── es.json             # Spanish translations
└── en.json             # English translations
```

**Source Structure**
```
/src/i18n/
└── routing.ts          # Internationalization routing configuration
```

**Current Website Sections (All Internationalized)**
1. **Language Switcher**: Fixed position language selector for Portuguese, Spanish, and English
2. **Hero Section**: Revolutionary 3D carousel design with advanced visual effects, glassmorphism UI, dynamic ambient lighting, and mobile-optimized viewport layout
3. **AI Color Picker**: Complete workflow with photo upload and analysis, mobile-first design with touch-friendly interface and sophisticated button animations
4. **Smart Gallery**: Portfolio transformations with responsive grid and touch-optimized interactions
5. **Footer**: Branded footer with WhatsApp and Instagram integration, mobile-friendly button layout

## Configuration & Optimization

**Next.js Configuration**
- WebVitals attribution for performance monitoring
- Advanced image optimization with multiple formats
- WebAssembly experiments enabled for ML models
- Enhanced security headers including camera permissions
- TypeScript strict mode configuration
- Webpack fallbacks for AI library compatibility
- next-intl plugin for internationalization with static generation
- Locale-specific routing with 'as-needed' prefix strategy
- SEO-optimized metadata generation for each locale

**Performance Features**
- Turbopack for lightning-fast development
- Image optimization with AVIF/WebP formats
- Responsive image sizing for all devices with mobile-first approach
- Suspense boundaries for loading states
- Core Web Vitals optimization with mobile performance focus
- Mobile-specific CSS optimizations and reduced motion support
- Touch interaction performance optimizations
- Efficient responsive breakpoint handling

## Known Issues & Solutions

**Image Loading in AI Workflow (RESOLVED)**
- Fixed: User photo failing to load in ColorRecommendations component
- Solution: Moved blob URL cleanup from PhotoUpload to AIColorPickerSection
- Ensures image persists through entire workflow until proper cleanup

**React Hook Dependencies (RESOLVED)**
- Fixed: ESLint warnings about missing dependencies in useEffect, useCallback, and useMemo
- Solution: Added proper dependency arrays to all hooks
- Ensures optimal performance and prevents memory leaks

**Performance Optimization (RESOLVED)**
- Fixed: Unnecessary re-renders and expensive calculations on every render
- Solution: Implemented comprehensive memoization with useMemo and useCallback
- Optimized all AI workflow components for better performance

**3D Carousel Implementation (RESOLVED)**
- Fixed: Static positioning issue - background images never came to front
- Solution: Implemented dynamic circular rotation with mathematical position calculation
- Features: True 3D carousel rotation, all images featured, touch optimization, haptic feedback
- UI: Clean, text-free interface with visual-only interaction discovery
- Performance: Spring physics transitions, responsive circle sizing, touch conflict prevention

**Type Safety & Error Handling (RESOLVED)**
- Fixed: Missing null checks and type guards throughout components
- Solution: Added comprehensive error boundaries and null safety checks
- Enhanced user experience with proper error states and fallbacks

**Mobile Viewport Optimization (RESOLVED)**
- Fixed: Hero button getting cut off on mobile browsers due to viewport overflow
- Solution: Implemented intelligent layout compression with aggressive spacing reduction
- Features: Mobile-optimized carousel sizing (h-64→h-60), reduced circle radius (100px→90px), compressed margins
- Result: Button fully visible with proper clearance across all mobile devices

**Advanced Visual Effects Implementation (RESOLVED)**
- Fixed: Basic carousel design lacking premium visual appeal
- Solution: Implemented sophisticated glassmorphism design system with dynamic effects
- Features: Color-matched ambient lighting, morphing button backgrounds, sparkle animations, multi-layer shadows
- Result: Premium UI design matching modern design standards while maintaining performance

**Button Effects Consistency (RESOLVED)**
- Fixed: Inconsistent animation systems between hero and AI section buttons
- Solution: Unified button animation system with matching visual effects
- Features: 3D hover transforms (rotateY: 15°, rotateX: 10°), pulsing rings, sparkle effects, morphing backgrounds
- Result: Cohesive user experience across all interactive elements

**Security & Performance**
- CORS headers configured for AI/ML integrations
- Camera permissions properly configured with mobile camera API support
- Content Security Policy for SVG handling
- Webpack optimizations for AI libraries

**Mobile Responsiveness & Touch Optimization (ENHANCED)**
- All components fully responsive across mobile, tablet, and desktop
- Touch-friendly interface with minimum 44px touch targets
- Mobile-first CSS with progressive enhancement
- Responsive typography and spacing optimized for small screens
- Cross-device testing validated for seamless functionality
- Mobile-specific performance optimizations and reduced motion support
- **Advanced Mobile Viewport Optimization**: Compressed layout spacing and element sizing for optimal button visibility
- **Intelligent Layout Compression**: Dynamic spacing reduction on mobile to prevent UI cutoff
- **3D Carousel Mobile Adaptation**: Reduced image sizes and circle radius for mobile viewport constraints

## Internationalization Guidelines

**Supported Locales**
- Portuguese (pt) - Default locale, accessible at / and /pt
- Spanish (es) - Accessible at /es
- English (en) - Accessible at /en

**Translation Management**
- All UI text stored in JSON files under /messages/
- Server-side translations using getTranslations from next-intl
- Client-side translations via NextIntlClientProvider
- SEO metadata localized for each language
- Locale-specific contact information and social media links

**Routing Strategy**
- Uses 'as-needed' locale prefix (default locale has no prefix)
- Static generation for all locale combinations
- Automatic locale detection and fallback to Portuguese
- Type-safe translation keys with TypeScript integration

## Mobile Responsiveness Guidelines

**Responsive Breakpoints**
- Mobile: < 640px (sm) - Primary mobile phones
- Tablet: 640px - 1024px (md, lg) - Tablets and small laptops
- Desktop: > 1024px (xl) - Desktop and large screens

**Touch Interaction Standards**
- Minimum 44px touch targets for all interactive elements
- Optimized spacing for thumb navigation
- Context-aware button sizing (smaller on mobile, larger on desktop)
- Touch-friendly drag and drop for photo upload
- **3D Carousel Touch Gestures**: Left/right swipe navigation with 50px threshold and velocity-based haptic feedback
- **Image Selection**: Direct tap-to-select with visual feedback and 8px invisible padding for larger touch areas
- **Touch Conflict Prevention**: preventDefault, touchAction:none, webkit optimizations for smooth interaction
- **Haptic Feedback**: Smart vibration (10ms start, 15-30ms swipe, 15ms selection) on supported devices

**Mobile-First Implementation Strategy**
- All components designed mobile-first with progressive enhancement
- Single-column layouts on mobile, multi-column on larger screens
- Responsive typography scaling from mobile to desktop
- Conditional content rendering for optimal mobile UX
- Touch-optimized animations and interactions

**Performance Considerations for Mobile**
- Reduced motion support for better mobile performance
- Optimized image loading with responsive sizing
- Touch interaction debouncing
- Mobile-specific CSS optimizations
- Efficient responsive breakpoint handling
- **Viewport Constraint Management**: Aggressive spacing compression for mobile layout optimization
- **3D Effect Performance**: Optimized carousel sizing and positioning for mobile hardware
- **Advanced Animation Optimization**: Glassmorphism and visual effects optimized for mobile performance