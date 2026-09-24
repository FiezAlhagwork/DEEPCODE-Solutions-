import { cn } from "@/lib/Utils";
import type { TextAreaProps } from "@/types/Kit";
import { fieldBase } from "./TextInput";

// Shares `fieldBase` with `TextInput` so a textarea and an input sitting next to
// each other in the same form have identical borders, focus rings and colours.
export default function TextArea({ className, ...props }: TextAreaProps) {
  return (
    <textarea
      {...props}
      className={cn(fieldBase, "min-h-24 resize-y py-2.5", className)}
    />
  );
}
