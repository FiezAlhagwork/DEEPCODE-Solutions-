"use client";

import { useRef, type ChangeEvent } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import Avatar from "@/components/kit/Avatar";
import Button from "@/components/kit/Button";
import { useUpdateAccountImage } from "../../hooks/UseAccount";
import type { AccountAvatarFieldProps } from "../../types/Account";

// A hidden `<input type="file">` behind a button rather than `FileDropzone`:
// that component is a drop target sized for a cover image or a gallery, and an
// avatar is a single small control beside a picture.
export default function AccountAvatarField({
  name,
  imageUrl,
  hasImage,
}: AccountAvatarFieldProps) {
  const t = useTranslations("admin.account");
  const inputRef = useRef<HTMLInputElement>(null);
  const updateImage = useUpdateAccountImage();

  function onPick(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    // Cleared unconditionally so picking the *same* file again still fires a
    // change event — otherwise a retry after a failed upload does nothing.
    event.target.value = "";
    if (file) updateImage.mutate(file);
  }

  return (
    <div className="flex flex-wrap items-center gap-5">
      <Avatar name={name} imageUrl={imageUrl} size="lg" />

      <div className="flex min-w-0 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            loading={updateImage.isPending}
            onClick={() => inputRef.current?.click()}
          >
            <ImagePlus aria-hidden />
            {t("changePhoto")}
          </Button>

          {/* Nothing to remove while Clerk is serving its own generated
              avatar — the button would take the picture back to what is
              already on screen. */}
          {hasImage && (
            <Button
              variant="ghost"
              size="sm"
              disabled={updateImage.isPending}
              onClick={() => updateImage.mutate(null)}
            >
              <Trash2 aria-hidden />
              {t("removePhoto")}
            </Button>
          )}
        </div>

        <p className="text-xs text-ink-faint">{t("photoHint")}</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        aria-label={t("changePhoto")}
        onChange={onPick}
      />
    </div>
  );
}
