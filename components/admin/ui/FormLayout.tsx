import { cn } from "@/lib/Utils";
import type {
  FormActionsProps,
  FormLayoutProps,
  FormSectionProps,
} from "@/types/AdminUi";

// The editing layout used by the project and category forms: a wide content
// column plus a narrower settings column, the arrangement Shopify/Strapi use.
// Keeping status/category/order beside the text — instead of below it — means
// they stay visible while writing, and the page stops being one long scroll.

export function FormLayout({ aside, children, className }: FormLayoutProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 items-start gap-4",
        aside && "lg:grid-cols-[minmax(0,1fr)_19rem]",
        className,
      )}
    >
      <div className="flex min-w-0 flex-col gap-4">{children}</div>
      {aside && <div className="flex flex-col gap-4">{aside}</div>}
    </div>
  );
}

export function FormSection({
  title,
  description,
  children,
  className,
}: FormSectionProps) {
  return (
    <section
      className={cn(
        "rounded-xl border border-hairline bg-surface-2",
        className,
      )}
    >
      <div className="border-b border-hairline px-5 py-3.5">
        <h2 className="text-sm font-semibold text-ink">{title}</h2>
        {description && (
          <p className="mt-0.5 text-xs text-ink-faint">{description}</p>
        )}
      </div>
      <div className="flex flex-col gap-4 p-5">{children}</div>
    </section>
  );
}

/**
 * Action bar that stays reachable while scrolling a long form, so "save" is
 * never a scroll away. It sticks to the bottom of the viewport rather than
 * using negative margins to break out of the page padding.
 */
export function FormActions({ children }: FormActionsProps) {
  return (
    <div className="sticky bottom-4 z-20 flex flex-wrap items-center justify-end gap-2 rounded-xl border border-hairline-strong bg-surface-2/95 p-3 shadow-lg backdrop-blur-md">
      {children}
    </div>
  );
}
