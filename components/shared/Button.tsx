import type { ComponentProps, ReactNode } from "react";
import { Button as BaseButton } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

const isExternalHref = (href: string) => /^https?:\/\//i.test(href);

export type ButtonProps = Omit<ComponentProps<typeof BaseButton>, "asChild"> & {
  /**
   * Renders the button as a link instead of a `<button>`. Internal paths
   * (e.g. "/#contact", "/hosting/vps") go through the locale-aware `Link` so
   * they keep the current language; anything starting with http(s) is
   * treated as external and opens in a new tab.
   *
   * Only pass button-specific props (`type`, `disabled`, `form`, …) when
   * `href` is omitted — they don't apply to the rendered `<a>`.
   */
  href?: string;
  children?: ReactNode;
};

/**
 * The one button used across the whole site — for actions and for
 * navigation alike. Never hand-roll a styled `<a>`/`<Link>` or wrap
 * `<Button asChild>` around a `<Link>` yourself; reach for this instead and
 * pass `href` when the button should navigate.
 */
export default function Button({ href, children, ...props }: ButtonProps) {
  if (href === undefined) {
    return <BaseButton {...props}>{children}</BaseButton>;
  }

  if (isExternalHref(href)) {
    return (
      <BaseButton asChild {...props}>
        <a href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      </BaseButton>
    );
  }

  return (
    <BaseButton asChild {...props}>
      <Link href={href}>{children}</Link>
    </BaseButton>
  );
}
