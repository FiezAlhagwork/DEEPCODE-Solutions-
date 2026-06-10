import { cn } from "@/lib/utils";
import { TextareaProps } from "@/types";



export default function Textarea({
    className,
    ...props
}: TextareaProps) {
    return (
        <textarea
            data-slot="textarea"
            className={cn(
                "input-base",
                "min-h-32 resize-none",
                className
            )}
            {...props}
        />
    );
}