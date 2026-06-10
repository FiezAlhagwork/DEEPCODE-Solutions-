import { cn } from "@/lib/utils";
import { InputProps } from "@/types";
import { ComponentProps } from "react";



const inputBaseStyles =
  "w-full min-w-0 rounded-lg border border-white/5 bg-[#0B0A0E] px-4 py-3 text-sm text-foreground shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-primary/40 focus-visible:ring-primary/20 focus-visible:ring-[3px]";



export default function Input({
  className,
  type,
  ...props
}: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn("input-base", "h-11", className)}
      {...props}
    />
  );
}

export { inputBaseStyles };

