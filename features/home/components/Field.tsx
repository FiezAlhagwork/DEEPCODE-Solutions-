import { cn } from "@/lib/Utils";
import { FieldProps } from "@/features/home/types/Home";
import * as LucideIcons from "lucide-react";

// The public contact form's label + control + message trio. The hint and the
// error share one slot and swap, with ids the control points at through
// `aria-describedby` (`<htmlFor>-hint` / `<htmlFor>-error`).
export default function Field({
  label,
  iconName,
  htmlFor,
  children,
  className,
  error,
  hint,
}: FieldProps) {
  const IconComponent = LucideIcons[iconName] as LucideIcons.LucideIcon;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label
        htmlFor={htmlFor}
        className="flex items-center gap-2 text-sm text-muted-foreground"
      >
        {IconComponent && (
          <IconComponent
            className="size-4 shrink-0 text-primary"
            strokeWidth={2}
            aria-hidden
          />
        )}

        <span>{label}</span>
      </label>

      {children}

      {error ? (
        <p id={`${htmlFor}-error`} className="text-xs text-red-400">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${htmlFor}-hint`} className="text-xs text-muted-foreground/80">
            {hint}
          </p>
        )
      )}
    </div>
  );
}
