import Image from "next/image";

import { cn } from "@/lib/Utils";
import type { AvatarProps } from "@/types/Kit";

// Falls back to initials when the account has no `imageUrl` — which is the
// normal case for users invited by email who never uploaded a picture.
// `icon` overrides that fallback for placeholders that have no real person
// behind them yet, where initials would be derived from a UI label rather than
// a name (the header's account chip is the case that matters today).

const sizes = {
  sm: { box: "size-7 text-[0.625rem]", px: 28 },
  md: { box: "size-9 text-xs", px: 36 },
} as const;

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Avatar({
  name,
  imageUrl,
  icon: Icon,
  size = "md",
  className,
}: AvatarProps) {
  const { box, px } = sizes[size];

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden",
        "rounded-full border border-hairline-strong bg-surface-3",
        "font-semibold text-ink-muted select-none",
        box,
        className,
      )}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={name}
          width={px}
          height={px}
          className="size-full object-cover"
        />
      ) : Icon ? (
        <Icon className="size-4" aria-hidden />
      ) : (
        <span aria-hidden>{initialsOf(name)}</span>
      )}
    </span>
  );
}
