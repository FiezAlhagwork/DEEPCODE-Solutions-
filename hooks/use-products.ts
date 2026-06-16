import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/services/hosting";
import { Category, Type } from "@/types/hosting";

export const useProducts = (type?: Type, category?: Category) => {
  return useQuery({
    queryKey: ["products", type, category],
    queryFn: () => getProducts(type, category),
  });
};
