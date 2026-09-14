import { cn } from "@/lib/Utils";
import type { FormFieldProps } from "@/types/AdminUi";

// One field wrapper for the whole admin panel. The old forms repeated a
// label/input/error trio eleven times by hand, and none of them wired the error
// to the control — a screen reader read the input with no idea it was invalid.
//
// `htmlFor` is required: the caller owns the control, so it also owns its id.
// The derived `describedBy` is handed back through a render prop so the input
// can point at the hint and the error without the caller reassembling the ids.

export default function Field({
  htmlFor,
  label,
  hint,
  error,
  required = false,
  className,
  children,
}: FormFieldProps) {
  const hintId = hint ? `${htmlFor}-hint` : undefined;
  const errorId = error ? `${htmlFor}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="text-xs font-medium text-ink-muted"
      >
        {label}
        {required && (
          <span aria-hidden className="ms-1 text-danger">
            *
          </span>
        )}
      </label>

      {typeof children === "function"
        ? children({
            id: htmlFor,
            "aria-describedby": describedBy,
            "aria-invalid": error ? true : undefined,
          })
        : children}

      {hint && !error && (
        <p id={hintId} className="text-xs text-ink-faint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
