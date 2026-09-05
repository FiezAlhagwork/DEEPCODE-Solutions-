import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-aware replacements for next/link and next/navigation. Always import
// Link and the navigation hooks from here so the active locale prefix is kept.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
