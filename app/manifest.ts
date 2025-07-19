import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Talia Colors - AI Hair Color Recommendations',
    short_name: 'Talia Colors',
    description: 'Professional hair coloring with AI-powered color recommendations',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#8b5cf6',
    orientation: 'portrait',
    scope: '/',
    lang: 'pt-BR',
    categories: ['beauty', 'lifestyle', 'photography'],
    icons: [
      {
        src: '/favicon.ico',
        sizes: '32x32',
        type: 'image/x-icon',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    screenshots: [
      {
        src: '/screenshot-mobile.png',
        sizes: '390x844',
        type: 'image/png',
        form_factor: 'narrow'
      },
      {
        src: '/screenshot-desktop.png',
        sizes: '1200x800',
        type: 'image/png',
        form_factor: 'wide'
      }
    ]
  }
}