import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import { Plus_Jakarta_Sans, Cormorant_Garamond } from 'next/font/google';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScrollRevealProvider } from '@/components/ui/ScrollRevealProvider';
import { CartProvider } from '@/lib/context/CartContext';
import { CartDrawer } from '@/components/order/CartDrawer';
import './globals.css';

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'CHANGKEER | More Than Tea. A Better You.',
    template: '%s | CHANGKEER',
  },
  description:
    'Website resmi teh herbal CHANGKEER. Racikan herbal murni dari daun, bunga, dan rempah nusantara untuk menemani kebugaran alami dan ketenangan sejati.',
  keywords: [
    'changkeer',
    'teh herbal',
    'herbal tea',
    'tisane',
    '24 solar terms tea',
    'first bloom herbal tea',
    'teh herbal musiman nusantara',
    'teh kesehatan nusantara',
  ],
  authors: [{ name: 'CHANGKEER Botanical' }],
  openGraph: {
    title: 'CHANGKEER | More Than Tea. A Better You.',
    description:
      'Racikan teh herbal murni tanpa kompromi. Diramu dari tanaman rempah dan kelopak bunga terbaik nusantara.',
    url: 'https://changkeer.vercel.app',
    siteName: 'CHANGKEER',
    locale: 'id_ID',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`h-full antialiased ${sans.variable} ${serif.variable}`}>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <CartProvider>
          <ScrollRevealProvider>
            <Suspense fallback={null}>
              <Navbar />
            </Suspense>
            <main className="flex-1">{children}</main>
            <Suspense fallback={null}>
              <Footer />
            </Suspense>
            <CartDrawer />
          </ScrollRevealProvider>
        </CartProvider>
      </body>
    </html>
  );
}
