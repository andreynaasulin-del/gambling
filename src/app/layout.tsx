import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

// ============================================
// 🔧 НАСТРОЙКИ ANALYTICS - ЗАМЕНИ НА СВОИ ID
// ============================================
const GTM_ID = "GTM-XXXXXXX"; // Google Tag Manager ID
const FB_PIXEL_ID = "XXXXXXXXXXXXXXX"; // Facebook Pixel ID
const GA_ID = "G-XXXXXXXXXX"; // Google Analytics 4 ID (опционально)
// ============================================

export const metadata: Metadata = {
  title: "1WIN VIP | Exclusive Bonus +500%",
  description: "Private access to 1WIN VIP bonuses. Get +500% on first deposit + 70 free spins. New players only.",
  robots: "noindex, nofollow",
  openGraph: {
    title: "1WIN VIP | Exclusive Bonus +500%",
    description: "Get +500% on first deposit + 70 free spins",
    type: "website",
    locale: "en_US",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000B18",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link rel="preload" href="/1win-logo.png" as="image" />

        {/* Google Tag Manager */}
        {GTM_ID && GTM_ID !== "GTM-XXXXXXX" && (
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');`}
          </Script>
        )}

        {/* Google Analytics 4 */}
        {GA_ID && GA_ID !== "G-XXXXXXXXXX" && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');`}
            </Script>
          </>
        )}

        {/* Facebook Pixel */}
        {FB_PIXEL_ID && FB_PIXEL_ID !== "XXXXXXXXXXXXXXX" && (
          <Script id="fb-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${FB_PIXEL_ID}');
            fbq('track', 'PageView');`}
          </Script>
        )}
      </head>
      <body className="antialiased" style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale'
      }}>
        {/* GTM noscript fallback */}
        {GTM_ID && GTM_ID !== "GTM-XXXXXXX" && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}

        {/* FB Pixel noscript fallback */}
        {FB_PIXEL_ID && FB_PIXEL_ID !== "XXXXXXXXXXXXXXX" && (
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        )}

        {children}
      </body>
    </html>
  );
}
