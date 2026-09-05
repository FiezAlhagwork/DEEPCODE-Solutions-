import type { routing } from "@/i18n/routing";
import type messages from "./messages/ar.json";

// Makes every translation key and locale checked at build time instead of
// blowing up at runtime. `ar.json` is the source of truth for the shape;
// `en.json` must mirror it key for key.
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
