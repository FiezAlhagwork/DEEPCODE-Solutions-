import { useTranslations } from "next-intl";

import PendingScreen from "@/components/shared/PendingScreen";

// Covers the role lookup in `page.tsx` that runs for an already-signed-in
// visitor. Named copy here, unlike the neutral spinner one level up, because
// at this point there is exactly one thing being waited on.
export default function SignInLoading() {
  const t = useTranslations("common");

  return <PendingScreen message={t("checking")} />;
}
