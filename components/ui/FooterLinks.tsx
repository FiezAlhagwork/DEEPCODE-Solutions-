import { footerNavLinks } from "@/constant";

export default function FooterLinks() {
  return (
    <div className="flex flex-col gap-4 text-right">
      <h3 className="text-base font-semibold text-white">روابط سريعة</h3>

      <ul className="flex flex-col gap-3">
        {footerNavLinks.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}