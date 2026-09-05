import type { Category } from "../types/Hosting";

// Provider brand names — deliberately not translated.
export const VPS_CATEGORIES: ReadonlyArray<{
  value: Category;
  label: string;
}> = [
  { value: "ryzen_vps", label: "Ryzen" },
  { value: "xeon_vps", label: "Xeon" },
  { value: "epyc_vps", label: "EPYC" },
  { value: "ryzen_gen2_vps", label: "Gen 2" },
  { value: "ipv6_only", label: "IPv6" },
];
