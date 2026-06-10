import { cn } from "@/lib/utils";
import { FieldProps } from "@/types";
import * as LucideIcons from "lucide-react";



export default function Field({
    label,
    iconName,
    htmlFor,
    children,
    className,
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
        </div>
    );
}