import { cn } from "@/lib/Utils";
import { TextareaProps } from "@/features/home/types/Home";



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