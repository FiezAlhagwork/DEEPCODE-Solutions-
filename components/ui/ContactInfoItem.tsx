import * as React from "react";
import * as LucideIcons from "lucide-react";
import { ContactInfoItemProps } from "@/types";

export default function ContactInfoItem({ item }: ContactInfoItemProps) {
  const Icon = LucideIcons[item.iconName] as React.ComponentType<{
    className?: string;
    strokeWidth?: number;
    "aria-hidden"?: boolean;
  }>;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {Icon && (
          <Icon
            className="size-7 shrink-0 text-white
            "
            strokeWidth={2}
            aria-hidden
          />
        )}
        <h3 className="text-lg font-medium text-white">{item.title}</h3>
      </div>
      <p className="pr-10 text-sm leading-relaxed text-muted-foreground">
        {item.detail}
      </p>
    </div>
  );
}
