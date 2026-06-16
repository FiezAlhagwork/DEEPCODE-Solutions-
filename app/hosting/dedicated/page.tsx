import HostingHero from "@/components/hosting/HostingHero";
import Products from "@/components/hosting/Products";

const page = () => {
  return (
    <div className="relative overflow-hidden px-6 py-14 bg-[#0D0D0E] ">
      <div className="mx-auto  max-w-7xl  ">
        <HostingHero
          badge="Dedicated Servers"
          title="خوادم مخصصة بأداء فائق "
          description="احصل على سيرفر مخصص بالكامل بموارد حصرية، أداء ثابت، ومرونة عالية لتشغيل التطبيقات والمشاريع ذات الأحمال الكبيرة."
        />

        <Products type="kvm" category="dedicated" />
      </div>
    </div>
  );
};

export default page;
