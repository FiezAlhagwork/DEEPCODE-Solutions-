import { cn } from "@/lib/Utils";
import type { InputProps } from "@/features/home/types/Home";

export default function Input({ className, type, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn("input-base", "h-11", className)}
      {...props}
    />
  );
}
