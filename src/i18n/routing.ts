import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['pt', 'es', 'en'],
  
  // Used when no locale matches
  defaultLocale: 'pt',
  
  // Optional: Use no prefix for default locale
  // This will make Portuguese accessible at both / and /pt
  localePrefix: 'as-needed',
  
  // Optional: Define pathnames for different locales
  pathnames: {
    '/': '/',
    // Add more pathnames here if needed for specific routes
  }
});