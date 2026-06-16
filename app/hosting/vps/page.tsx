"use client";
import HostingHero from "@/components/hosting/HostingHero";
import Products from "@/components/hosting/Products";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Category } from "@/types/hosting";
import { useState } from "react";

const page = () => {
  const [category, setCategory] = useState<Category>("ryzen_vps");
  return (
    <div className="relative overflow-hidden px-6 py-14 bg-[#0D0D0E] ">
      <div className="mx-auto  max-w-7xl  ">
        <HostingHero
          badge="VPS Hosting"
          title="خوادم VPS سريعة وآمنة"
          description="اختر الباقة المناسبة لموقعك أو تطبيقك مع أداء عالي وإدارة سهلة."
        />
        <Tabs
          className="flex justify-center items-center pb-10"
          value={category}
          onValueChange={setCategory}
        >
          <TabsList>
            <TabsTrigger value="ryzen_vps">Ryzen</TabsTrigger>

            <TabsTrigger value="xeon_vps">Xeon</TabsTrigger>

            <TabsTrigger value="epyc_vps">EPYC</TabsTrigger>

            <TabsTrigger value="ryzen_gen2_vps">Gen 2</TabsTrigger>

            <TabsTrigger value="ipv6_only">IPv6</TabsTrigger>
          </TabsList>
        </Tabs>

        <Products type="kvm" category={category} />
      </div>
    </div>
  );
};

export default page;
