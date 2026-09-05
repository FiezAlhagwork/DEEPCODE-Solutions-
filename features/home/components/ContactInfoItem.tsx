import * as React from "react";
import * as LucideIcons from "lucide-react";
import { ContactInfoItemProps } from "@/features/home/types/Home";

export default function ContactInfoItem({
  iconName,
  title,
  detail,
}: ContactInfoItemProps) {
  const Icon = LucideIcons[iconName] as React.ComponentType<{
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
        <h3 className="text-lg font-medium text-white">{title}</h3>
      </div>
      <p className="ps-10 text-sm leading-relaxed text-muted-foreground">
        {detail}
      </p>
    </div>
  );
}
