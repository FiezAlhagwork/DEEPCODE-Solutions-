import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../services/Hosting";
import { productKeys } from "../QueryKeys";
import type { Category, Type } from "../types/Hosting";

export const useProducts = (type?: Type, category?: Category) => {
  return useQuery({
    queryKey: productKeys.list(type, category),
    queryFn: () => getProducts(type, category),
  });
};
