import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',      // Disallow API routes
          '/_next/',    // Disallow Next.js internals
          '/favicon.ico',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
        ],
      },
    ],
    sitemap: 'https://taliacolors.com/sitemap.xml',
    host: 'https://taliacolors.com',
  }
}