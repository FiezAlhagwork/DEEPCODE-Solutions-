export type Product = {
  id: string;
  name: string;
  description: string;
  type: string;
  category: string;
  base_price: number;
  your_price: number;
  discount: number;
  billing_cycle: string;
  specifications: {
    slots: string;
    cpu: string;
    memory: string;
    storage: string;
    bandwidth: string;
    ddos: string;
    location: string;
    backup: string;
    support: string;
  };
  stock: string;
};

export type ProductsResponse = {
  success: boolean;
  data: {
    success: boolean;
    timestamp: string;
    data: {
      products: Product[];
      total: number;
    };
  };
};

export interface ProductCardProps {
  product: Product;
}

export interface ProductListProps {
  products: Product[];
}

export type HostingHeroProps = {
  badge: string;
  title: string;
  description: string;
};
export type Type = "kvm" | "game_server";
export type Category =
  | "minecraft"
  | "rust"
  | "other"
  | "ryzen_vps"
  | "xeon_vps"
  | "epyc_vps"
  | "sale_2025"
  | "ipv6_only"
  | "ryzen_gen2_vps"
  | "dedicated";
export type ProductsProps = {
  type: Type;
  category?: Category;
  limit?:number
};
