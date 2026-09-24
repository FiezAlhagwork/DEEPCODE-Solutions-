import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/Utils";
import type { SelectInputProps } from "@/types/Kit";
import { fieldBase } from "./TextInput";

// A styled native `<select>`. A custom listbox would mean managing focus,
// typeahead and mobile behaviour ourselves for no real gain — the native
// control already handles all of that, and on mobile it opens the OS picker.
//
// `className` sizes the WRAPPER, not the `<select>`: the chevron is positioned
// against the wrapper, so if the two had different widths the icon would drift
// away from the control.
export default function SelectInput({
  className,
  children,
  ...props
}: SelectInputProps) {
  return (
    <div className={cn("relative flex items-center", className ?? "w-full")}>
      <select
        {...props}
        className={cn(fieldBase, "h-9 w-full appearance-none pe-9")}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute inset-e-3 size-4 text-ink-faint"
      />
    </div>
  );
}
