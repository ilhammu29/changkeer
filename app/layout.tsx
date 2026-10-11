import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import './globals.css';

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
    'jahe merah serai',
    'rosella mint',
    'chamomile lavender',
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
};

import React, { Suspense } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>
        <main className="flex-1">{children}</main>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </body>
    </html>
  );
}
