import { Loader2 } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/Utils";
import type {
  ButtonProps,
  ButtonSize,
  ButtonVariant,
} from "@/types/AdminUi";

// The admin panel's own button, deliberately NOT `components/ui/button.tsx`:
// that one is a marketing CTA (`px-8 py-6 text-base`, `max-md:w-full`) built
// for the landing page, and it makes every control in a dense dashboard look
// oversized. Sizes here are the ones a data UI actually needs.

const base =
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg font-medium " +
  "whitespace-nowrap transition-colors outline-none " +
  "focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-surface-0 " +
  "disabled:pointer-events-none disabled:opacity-50 " +
  "[&_svg]:pointer-events-none [&_svg]:shrink-0";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-accent",
  secondary: "bg-surface-3 text-ink hover:bg-hairline-strong",
  outline:
    "border border-hairline-strong bg-transparent text-ink hover:bg-surface-3",
  ghost: "bg-transparent text-ink-muted hover:bg-surface-3 hover:text-ink",
  danger: "bg-danger/12 text-danger hover:bg-danger/20",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs [&_svg]:size-3.5",
  md: "h-9 px-4 text-sm [&_svg]:size-4",
};

const isExternalHref = (href: string) => /^https?:\/\//i.test(href);

export default function Button(props: ButtonProps) {
  if (props.href !== undefined) {
    const {
      href,
      variant = "secondary",
      size = "md",
      className,
      children,
      ...rest
    } = props;
    const classes = cn(base, variants[variant], sizes[size], className);

    if (isExternalHref(href)) {
      return (
        <a
          {...rest}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
        >
          {children}
        </a>
      );
    }

    return (
      <Link {...rest} href={href} className={classes}>
        {children}
      </Link>
    );
  }

  const {
    variant = "secondary",
    size = "md",
    className,
    children,
    loading = false,
    disabled,
    type = "button",
    ...rest
  } = props;

  return (
    <button
      {...rest}
      type={type}
      disabled={disabled || loading}
      className={cn(base, variants[variant], sizes[size], className)}
    >
      {loading && <Loader2 className="animate-spin" aria-hidden />}
      {children}
    </button>
  );
}
