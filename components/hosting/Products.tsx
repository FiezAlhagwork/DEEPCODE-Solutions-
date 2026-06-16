"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useProducts } from "@/hooks/use-products";
import ProductList from "./ProductList";
import { ProductsProps } from "@/types/hosting";

export default function Products({ type, category, limit }: ProductsProps) {
  const { data: products = [], isLoading, error } = useProducts(type, category);
  const displayedProducts = limit ? products.slice(0, limit) : products;
  if (isLoading) {
    return (
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ">
        {Array.from({ length: limit ? limit : 8 }).map((_, index) => (
          <Skeleton key={index} className="h-100 rounded-3xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-destructive/30 bg-destructive/10 p-6 text-right text-sm text-destructive">
        حدث خطأ أثناء جلب الباقات: {error.message}
      </div>
    );
  }

  return (
    <div className="">
      <ProductList products={displayedProducts} />
    </div>
  );
}
