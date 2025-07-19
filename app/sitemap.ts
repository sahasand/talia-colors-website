import { MetadataRoute } from 'next'
import { routing } from '../src/i18n/routing'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://taliacolors.com'
  
  // Generate sitemap entries for all locales
  const sitemapEntries: MetadataRoute.Sitemap = []
  
  // Add main pages for each locale
  routing.locales.forEach(locale => {
    const localePrefix = locale === routing.defaultLocale ? '' : `/${locale}`
    
    // Main page
    sitemapEntries.push({
      url: `${baseUrl}${localePrefix}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    })
    
    // AI Color Picker section (if it becomes a separate page in the future)
    // Currently it's part of the main page, but included for future expansion
    sitemapEntries.push({
      url: `${baseUrl}${localePrefix}#ai-color-picker`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    })
    
    // Gallery section
    sitemapEntries.push({
      url: `${baseUrl}${localePrefix}#gallery`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  })
  
  return sitemapEntries
}