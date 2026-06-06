import { featuresData } from "@/constant";
import FeaturesList from "./ui/FeaturesList";

const Features = () => {
  return (
    <section
      aria-label="من نحن"
      className="relative w-full px-6 py-10 md:py-20 bg-transparent"
      dir="rtl"
    >
      <div className="relative z-10 mx-auto grid max-w-6xl  items-center ">
        <FeaturesList features={featuresData} />
      </div>
    </section>
  );
};

export default Features;
