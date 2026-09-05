import { useTranslations } from "next-intl";
import { featureItems } from "@/features/home/constants/Home";
import FeaturesList from "./FeaturesList";

const Features = () => {
  const t = useTranslations("features");

  return (
    <section
      id="features"
      aria-label={t("sectionLabel")}
      className="relative w-full px-6 py-10 md:py-20 bg-transparent"
    >
      <div className="relative z-10 mx-auto grid max-w-6xl  items-center ">
        <FeaturesList features={featureItems} />
      </div>
    </section>
  );
};

export default Features;
