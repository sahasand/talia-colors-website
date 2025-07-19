'use client'

import Script from 'next/script'

interface AnalyticsProps {
  GTM_ID?: string
}

export default function Analytics({ GTM_ID }: AnalyticsProps) {
  // Use provided GTM_ID or fallback to the specific container
  const containerId = GTM_ID || 'GTM-W7GMD83X'

  return (
    <>
      {/* Google Tag Manager */}
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${containerId}');
        `}
      </Script>
    </>
  )
}

// Utility function to track events via GTM dataLayer
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && 'dataLayer' in window) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).dataLayer.push({
      event: 'custom_event',
      event_action: action,
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Predefined events for the hair colorist business
export const trackBookingClick = (source: string) => {
  trackEvent('booking_click', 'engagement', source)
}

export const trackColorPickerStart = () => {
  trackEvent('color_picker_start', 'ai_interaction', 'photo_upload')
}

export const trackColorPickerComplete = (colorName: string) => {
  trackEvent('color_picker_complete', 'ai_interaction', colorName)
}

export const trackWhatsAppClick = (message_type: string) => {
  trackEvent('whatsapp_click', 'contact', message_type)
}

export const trackLanguageSwitch = (from_locale: string, to_locale: string) => {
  trackEvent('language_switch', 'navigation', `${from_locale}_to_${to_locale}`)
}