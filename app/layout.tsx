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
    'Official website of CHANGKEER Botanical Atelier. Pure artisanal tisanes crafted from whole leaves, flowers, and archipelago botanicals for circadian wellness and mindful living.',
  keywords: [
    'changkeer',
    'herbal tea',
    'botanical tisane',
    '24 solar terms tea',
    'first bloom herbal tea',
    'seasonal herbal blends',
    'artisan tea atelier',
  ],
  authors: [{ name: 'CHANGKEER Botanical' }],
  openGraph: {
    title: 'CHANGKEER | More Than Tea. A Better You.',
    description:
      'Pure artisanal botanical tea infusions. Handcrafted from fine blossoms, herbs, and heritage botanicals.',
    url: 'https://changkeer.vercel.app',
    siteName: 'CHANGKEER',
    locale: 'en_US',
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
    <html lang="en" className={`h-full antialiased ${sans.variable} ${serif.variable}`}>
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
