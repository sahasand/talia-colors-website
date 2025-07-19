'use client'

import { useTranslations } from 'next-intl'

interface SchemaProps {
  locale: string
}

export default function Schema({ }: SchemaProps) {
  const t = useTranslations('mainPage.sections.contact')
  const tMeta = useTranslations('metadata')
  
  // Local Business Schema for hair salon
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'HairSalon',
    '@id': 'https://taliacolors.com',
    name: 'Talia Colors',
    description: tMeta('description'),
    url: 'https://taliacolors.com',
    logo: 'https://taliacolors.com/logo.png',
    image: 'https://taliacolors.com/og-image.jpg',
    telephone: '+55 48 99169-053',
    email: 'contato@taliacolors.com',
    sameAs: [
      t('instagramUrl'),
      t('whatsappUrl')
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Florianópolis',
      addressRegion: 'SC',
      addressCountry: 'BR'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -27.5954,
      longitude: -48.5480
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '16:00'
      }
    ],
    priceRange: 'R$ 120-400',
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: -27.5954,
        longitude: -48.5480
      },
      geoRadius: '50000'
    }
  }

  // Service Schema for hair coloring services
  const servicesSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Hair Coloring Services',
    description: 'Professional hair coloring services by Talia Colors',
    itemListElement: [
      {
        '@type': 'Service',
        '@id': 'https://taliacolors.com/services/balayage',
        name: 'Balayage',
        description: 'Hand-painted highlights for natural-looking dimension',
        provider: {
          '@type': 'HairSalon',
          name: 'Talia Colors'
        },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'BRL',
          price: '180-250'
        }
      },
      {
        '@type': 'Service',
        '@id': 'https://taliacolors.com/services/full-color',
        name: 'Full Color',
        description: 'Complete hair color transformation',
        provider: {
          '@type': 'HairSalon',
          name: 'Talia Colors'
        },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'BRL',
          price: '120-180'
        }
      },
      {
        '@type': 'Service',
        '@id': 'https://taliacolors.com/services/highlights',
        name: 'Highlights',
        description: 'Professional highlighting techniques',
        provider: {
          '@type': 'HairSalon',
          name: 'Talia Colors'
        },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'BRL',
          price: '200-280'
        }
      },
      {
        '@type': 'Service',
        '@id': 'https://taliacolors.com/services/ai-color-consultation',
        name: 'AI Color Consultation',
        description: 'AI-powered personalized color recommendations',
        provider: {
          '@type': 'HairSalon',
          name: 'Talia Colors'
        },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'BRL',
          price: '0'
        }
      }
    ]
  }

  // Organization Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://taliacolors.com/#organization',
    name: 'Talia Colors',
    legalName: 'Talia Colors Hair Studio',
    url: 'https://taliacolors.com',
    logo: 'https://taliacolors.com/logo.png',
    description: tMeta('description'),
    foundingDate: '2023',
    founders: [
      {
        '@type': 'Person',
        name: 'Talia',
        jobTitle: 'Hair Colorist & Founder'
      }
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+55 48 99169-053',
      contactType: 'customer service',
      availableLanguage: ['Portuguese', 'Spanish', 'English']
    },
    sameAs: [
      t('instagramUrl'),
      t('whatsappUrl')
    ]
  }

  // Website Schema
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://taliacolors.com/#website',
    url: 'https://taliacolors.com',
    name: 'Talia Colors',
    description: tMeta('description'),
    publisher: {
      '@id': 'https://taliacolors.com/#organization'
    },
    inLanguage: [
      {
        '@type': 'Language',
        name: 'Portuguese',
        alternateName: 'pt'
      },
      {
        '@type': 'Language',
        name: 'Spanish',
        alternateName: 'es'
      },
      {
        '@type': 'Language',
        name: 'English',
        alternateName: 'en'
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  )
}