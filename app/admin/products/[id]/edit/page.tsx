import React from 'react';
import { notFound } from 'next/navigation';
import { ProductForm } from '@/components/admin/ProductForm';
import { getAllProductsAdmin } from '@/lib/data/products';
import { getCategories } from '@/lib/data/categories';

export const dynamic = 'force-dynamic';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const [products, categories] = await Promise.all([
    getAllProductsAdmin(),
    getCategories('product'),
  ]);

  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-border">
        <h1 className="text-2xl font-black uppercase tracking-tight text-foreground">
          EDIT PRODUK: {product.name}
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Perbarui rincian, harga, formula, atau status publikasi.
        </p>
      </div>

      <ProductForm initialData={product} categories={categories} />
    </div>
  );
}
