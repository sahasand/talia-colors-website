import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '../../src/i18n/routing';
import HeroSection from '../components/ui/HeroSection';
import SmartGalleryGrid from '../components/ui/SmartGalleryGrid';
import AIColorPickerSection from '../components/ai/AIColorPickerSection';
import LanguageSwitcher from '../components/ui/LanguageSwitcher';
import { ErrorBoundary } from '../components/ErrorBoundary';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function Home({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Enable static rendering
  setRequestLocale(locale);
  
  const t = await getTranslations('mainPage');
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-cyan-50">
      {/* Language Switcher */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>

      {/* Revolutionary Hero Section with AI Try-On */}
      <section className="relative min-h-[85vh] sm:min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-purple-600/10 to-pink-600/10 animate-pulse" />
        <HeroSection />
      </section>

      {/* AI Color Picker Section */}
      <ErrorBoundary fallback={
        <div className="py-24 text-center">
          <p className="text-gray-600">Unable to load AI Color Picker. Please refresh the page.</p>
        </div>
      }>
        <AIColorPickerSection />
      </ErrorBoundary>

      {/* Smart Portfolio Gallery with Streaming */}
      <section className="py-24 bg-pink-100/90 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-4">
              {t('sections.inspiration.title')}
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto px-4 sm:px-0">
              {t('sections.inspiration.description')}
            </p>
          </div>
          <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          }>
            <SmartGalleryGrid />
          </Suspense>
        </div>
      </section>


      {/* Elegant Footer */}
      <footer className="relative bg-gradient-to-br from-purple-600/20 via-pink-500/20 to-cyan-500/20 text-gray-800 py-12 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-cyan-600/10 animate-pulse" />
        
        {/* Floating Particles */}
        <div className="absolute top-6 left-1/4 w-2 h-2 bg-pink-500/40 rounded-full animate-float" />
        <div className="absolute top-8 right-1/3 w-1 h-1 bg-purple-500/50 rounded-full animate-float" style={{animationDelay: '1s'}} />
        <div className="absolute bottom-8 left-1/3 w-3 h-3 bg-cyan-500/30 rounded-full animate-float" style={{animationDelay: '2s'}} />
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center">
          <h3 className="text-2xl sm:text-3xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent">
              {t('sections.footer.brandName')}
            </span>
          </h3>
          <p className="text-base sm:text-lg mb-6 sm:mb-8 text-gray-700 font-light tracking-wide max-w-md mx-auto px-4 sm:px-0">
            {t('sections.footer.tagline')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
            <a 
              href={t('sections.contact.whatsappUrl')}
              className="group relative px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full border border-purple-300/30 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1 backdrop-blur-sm w-full sm:w-auto max-w-xs sm:max-w-none"
            >
              <span className="relative z-10 text-purple-700 group-hover:text-purple-800 transition-colors duration-300 font-medium text-sm sm:text-base">
                {t('sections.footer.whatsappButton')}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/30 group-hover:to-pink-600/30 rounded-full transition-all duration-300" />
            </a>
            <a 
              href={t('sections.contact.instagramUrl')}
              className="group relative px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-pink-600/20 to-cyan-600/20 rounded-full border border-pink-300/30 hover:border-pink-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20 hover:-translate-y-1 backdrop-blur-sm w-full sm:w-auto max-w-xs sm:max-w-none"
            >
              <span className="relative z-10 text-pink-700 group-hover:text-pink-800 transition-colors duration-300 font-medium text-sm sm:text-base">
                {t('sections.footer.instagramButton')}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600/0 to-cyan-600/0 group-hover:from-pink-600/30 group-hover:to-cyan-600/30 rounded-full transition-all duration-300" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
