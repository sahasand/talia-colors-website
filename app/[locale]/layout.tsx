import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '../../src/i18n/routing';
import { Geist, Geist_Mono } from "next/font/google";
import Analytics from '../components/Analytics';
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  
  // Generate alternate language links for SEO with full domain
  const baseUrl = 'https://taliacolors.com';
  const alternateLanguages: Record<string, string> = {};
  routing.locales.forEach(loc => {
    const localePrefix = loc === routing.defaultLocale ? '' : `/${loc}`;
    alternateLanguages[loc] = `${baseUrl}${localePrefix}`;
  });
  
  const localePrefix = locale === routing.defaultLocale ? '' : `/${locale}`;
  
  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${baseUrl}${localePrefix}`,
      locale: locale,
      alternateLocale: routing.locales.filter(loc => loc !== locale),
      type: 'website',
      siteName: 'Talia Colors',
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: t('title'),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: [`${baseUrl}/og-image.jpg`],
    },
    alternates: {
      canonical: `${baseUrl}${localePrefix}`,
      languages: alternateLanguages,
    },
    other: {
      'content-language': locale,
    },
  };
}

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  
  // Enable static rendering
  setRequestLocale(locale);
  
  // Providing all messages to the client side
  const messages = await getMessages();
  
  return (
    <html lang={locale} className="overflow-x-hidden">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}>
        <Analytics GTM_ID={process.env.NEXT_PUBLIC_GTM_ID} />
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID || 'GTM-W7GMD83X'}`}
            height="0" 
            width="0" 
            style={{display: 'none', visibility: 'hidden'}}
          />
        </noscript>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
