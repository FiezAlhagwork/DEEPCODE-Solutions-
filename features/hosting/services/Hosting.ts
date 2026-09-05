import { api } from "@/lib/Api";
import type { Category, ProductsResponse, Type } from "../types/Hosting";

export const getProducts = async (type?: Type, category?: Category) => {
  const { data } = await api.get<ProductsResponse>("/reseller/products", {
    params: { type, category },
  });

  return data.data.data.products;
};
