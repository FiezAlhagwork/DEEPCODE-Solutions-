"use client";

import { useState } from "react";
import { ImagePlus } from "lucide-react";

import { cn } from "@/lib/Utils";
import type { FileDropEvent, FileDropzoneProps } from "@/types/AdminUi";

// Drag-and-drop / click file picker. The backend takes images as real uploads
// (`multipart/form-data`), so the form needs a file control rather than the
// text field of URLs it used to have.
//
// Accessibility: the `<input type="file">` stays in the DOM as an `sr-only`
// peer instead of being hidden with `display:none`, so it keeps its place in
// the tab order and can still be opened from the keyboard; the visible label is
// styled from that peer's focus state.

export default function FileDropzone({
  id,
  label,
  hint,
  multiple = false,
  accept = "image/*",
  disabled = false,
  onFilesAdded,
  className,
  describedBy,
  invalid = false,
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  function handleDrop(event: FileDropEvent) {
    event.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const dropped = Array.from(event.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/"),
    );
    if (dropped.length > 0) onFilesAdded(multiple ? dropped : [dropped[0]]);
  }

  return (
    <div className={cn("flex flex-col", className)}>
      <input
        id={id}
        type="file"
        className="peer sr-only"
        multiple={multiple}
        accept={accept}
        disabled={disabled}
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        onChange={(event) => {
          const picked = Array.from(event.target.files ?? []);
          if (picked.length > 0) onFilesAdded(picked);
          // Lets the same file be picked again after being removed.
          event.target.value = "";
        }}
      />
      <label
        htmlFor={id}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed",
          "px-4 py-6 text-center transition-colors",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-primary/50",
          isDragging
            ? "border-primary/60 bg-primary/8"
            : "border-hairline-strong bg-surface-1 hover:border-primary/40 hover:bg-surface-3",
          invalid && "border-danger/60",
          disabled && "pointer-events-none opacity-50",
        )}
      >
        <span className="flex size-9 items-center justify-center rounded-full border border-hairline bg-surface-3 text-ink-faint">
          <ImagePlus className="size-4" aria-hidden />
        </span>
        <span className="text-xs font-medium text-ink">{label}</span>
        {hint && <span className="text-xs text-ink-faint">{hint}</span>}
      </label>
    </div>
  );
}
