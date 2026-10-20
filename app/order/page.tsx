import React, { Suspense } from 'react';
import { getPublishedProducts } from '@/lib/data/products';
import { OrderCatalogClient } from './OrderCatalogClient';

export const metadata = {
  title: 'Atelier Brew Bar | Order Pure Herbal Blends',
  description: 'Order fresh functional CHANGKEER herbal tea blends brewed table-side, takeaway, or delivered directly to you.',
};

export default async function OrderPage() {
  const products = await getPublishedProducts();

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAFAF8] text-neutral-900 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-xs uppercase tracking-widest text-neutral-500">Preparing Product Menu...</span>
        </div>
      </div>
    }>
      <OrderCatalogClient initialProducts={products} />
    </Suspense>
  );
}
