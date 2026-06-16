import { api } from "@/lib/api";
import type { Category, ProductsResponse, Type } from "@/types/hosting";

export const getProducts = async (type?: Type, category?: Category) => {
  const { data } = await api.get<ProductsResponse>("/reseller/products", {
    params: { type, category },
  });

  return data.data.data.products;
};
