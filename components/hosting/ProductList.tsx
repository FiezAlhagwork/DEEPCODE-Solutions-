import { Product, ProductListProps } from "@/types/hosting";
import { motion } from "motion/react";
import ProductCard from "./ProductCard";

const ProductList = ({ products }: ProductListProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 "
    >
      {products.map((product: Product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </motion.div>
  );
};

export default ProductList;
