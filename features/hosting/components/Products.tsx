"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import RequestModal from "@/features/requests/components/RequestModal";
import { useProducts } from "@/features/hosting/hooks/UseProducts";
import { usePathname, useRouter } from "@/i18n/navigation";
import ProductList from "./ProductList";
import type { Product, ProductsProps } from "@/features/hosting/types/Hosting";

/** The query parameter that reopens the order modal after a sign-in detour. */
const ORDER_PARAM = "order";

export default function Products({ type, category, limit }: ProductsProps) {
  const t = useTranslations("hosting");
  const { data: products = [], isLoading, error } = useProducts(type, category);
  const displayedProducts = limit ? products.slice(0, limit) : products;

  // `useSearchParams` from `next/navigation` rather than `@/i18n/navigation`:
  // next-intl only wraps the hooks that deal in pathnames, and reading the
  // query string has no locale in it to get wrong.
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [selected, setSelected] = useState<Product | null>(null);

  // Which product the modal shows: the one just clicked, otherwise the one
  // named by `?order=` — which is how a visitor sent to sign in comes back to
  // the modal they left. Derived on every render rather than copied into state
  // by an effect. It searches every product, not just the ones displayed after
  // `limit`, and a page with several lists (the home page has two) only opens
  // it in the list that actually holds that product.
  const orderId = searchParams.get(ORDER_PARAM);
  const open =
    selected ??
    (orderId ? (products.find((product) => product.id === orderId) ?? null) : null);

  function close() {
    setSelected(null);
    // Drop `?order=` too, or the modal would reopen on the next render — and
    // on a reload.
    if (orderId) router.replace(pathname, { scroll: false });
  }

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
      <div className="rounded-3xl border border-destructive/30 bg-destructive/10 p-6 text-start text-sm text-destructive">
        {t("loadError", { message: error.message })}
      </div>
    );
  }

  return (
    <div className="">
      <ProductList products={displayedProducts} onOrder={setSelected} />
      <RequestModal product={open} onClose={close} onSubmitted={close} />
    </div>
  );
}
