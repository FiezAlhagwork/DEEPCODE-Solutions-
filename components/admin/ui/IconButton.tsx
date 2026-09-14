import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/Utils";
import type {
  IconButtonProps,
  IconButtonSize,
  IconButtonVariant,
} from "@/types/AdminUi";

// Square, icon-only control for table rows, the header and the sidebar.
// `aria-label` is required rather than optional: an icon with no text is
// invisible to a screen reader without one.

const base =
  "inline-flex shrink-0 items-center justify-center rounded-lg transition-colors " +
  "outline-none focus-visible:ring-2 focus-visible:ring-primary/50 " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0 " +
  "disabled:pointer-events-none disabled:opacity-50";

const variants: Record<IconButtonVariant, string> = {
  ghost: "text-ink-muted hover:bg-surface-3 hover:text-ink",
  outline:
    "border border-hairline-strong text-ink-muted hover:bg-surface-3 hover:text-ink",
  danger: "text-ink-muted hover:bg-danger/12 hover:text-danger",
};

const sizes: Record<IconButtonSize, string> = {
  sm: "size-7 [&_svg]:size-3.5",
  md: "size-9 [&_svg]:size-4",
};

export default function IconButton(props: IconButtonProps) {
  if (props.href !== undefined) {
    const {
      href,
      variant = "ghost",
      size = "md",
      className,
      children,
      ...rest
    } = props;
    return (
      <Link
        {...rest}
        href={href}
        className={cn(base, variants[variant], sizes[size], className)}
      >
        {children}
      </Link>
    );
  }

  const {
    variant = "ghost",
    size = "md",
    className,
    children,
    type = "button",
    ...rest
  } = props;
  return (
    <button
      {...rest}
      type={type}
      className={cn(base, variants[variant], sizes[size], className)}
    >
      {children}
    </button>
  );
}
