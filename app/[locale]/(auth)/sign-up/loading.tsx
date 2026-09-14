import { useTranslations } from "next-intl";

import PendingScreen from "@/components/shared/PendingScreen";

// Same role lookup as the sign-in route's — see the note there.
export default function SignUpLoading() {
  const t = useTranslations("common");

  return <PendingScreen message={t("checking")} />;
}
