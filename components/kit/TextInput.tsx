import { cn } from "@/lib/Utils";
import type { TextInputProps } from "@/types/Kit";

// Compact admin field. Deliberately not `.input-base` from globals.css — that
// recipe is `px-4 py-3` for the marketing contact form, which is far too tall
// for a dashboard toolbar or a form with a dozen fields.
export const fieldBase =
  "w-full min-w-0 rounded-lg border border-hairline-strong bg-surface-1 " +
  "px-3 text-sm text-ink transition-colors outline-none " +
  "placeholder:text-ink-faint " +
  "focus-visible:border-primary/50 focus-visible:bg-surface-3 " +
  "focus-visible:ring-2 focus-visible:ring-primary/20 " +
  "disabled:cursor-not-allowed disabled:opacity-50 " +
  "aria-[invalid=true]:border-danger/60 aria-[invalid=true]:ring-danger/20";

export default function TextInput({
  className,
  icon: Icon,
  ...props
}: TextInputProps) {
  const input = (
    <input
      {...props}
      className={cn(fieldBase, "h-9", Icon && "ps-9", className)}
    />
  );

  if (!Icon) return input;

  return (
    <div className="relative flex w-full items-center">
      <Icon
        aria-hidden
        className="pointer-events-none absolute inset-s-3 size-4 text-ink-faint"
      />
      {input}
    </div>
  );
}
