import React from 'react';
import { ProductForm } from '@/components/admin/ProductForm';
import { getCategories } from '@/lib/data/categories';

export default async function NewProductPage() {
  const categories = await getCategories('product');

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-border">
        <h1 className="text-2xl font-black uppercase tracking-tight text-foreground">
          TAMBAH PRODUK BARU
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Formulir penambahan varian teh herbal ke basis data CHANGKEER.
        </p>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}
