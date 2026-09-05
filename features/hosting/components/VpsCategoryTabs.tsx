"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Products from "./Products";
import { VPS_CATEGORIES } from "../constants/Hosting";
import type { Category } from "../types/Hosting";

export default function VpsCategoryTabs() {
  const [category, setCategory] = useState<Category>("ryzen_vps");

  return (
    <>
      <Tabs
        className="flex justify-center items-center pb-10"
        value={category}
        onValueChange={(value) => setCategory(value as Category)}
      >
        <TabsList>
          {VPS_CATEGORIES.map((item) => (
            <TabsTrigger key={item.value} value={item.value}>
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Products type="kvm" category={category} />
    </>
  );
}
