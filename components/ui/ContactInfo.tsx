import { contactInfoItems } from "@/constant";
import ContactInfoItem from "./ContactInfoItem";

export default function ContactInfo() {
  return (
    <div className="flex flex-col gap-8 text-right">
      <h2 className="text-2xl font-semibold text-primary md:text-3xl">
        معلومات الاتصال
      </h2>

      <div className="flex flex-col gap-13">
        {contactInfoItems.map((item) => (
          <ContactInfoItem key={item.title} item={item} />
        ))}
      </div>
    </div>
  );
}
