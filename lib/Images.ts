import type { CompressImageOptions } from "@/types/Shared";

/**
 * Shrinks and re-encodes a picked image to WebP in the browser, before it is
 * ever uploaded.
 *
 * This exists because of a measured failure, not as a micro-optimisation: the
 * link between this backend and Cloudinary is slow and unstable, and a 4 MB
 * phone photo spent ~35 seconds being written before the connection was reset
 * (`write ECONNRESET`), losing the whole save. The same photo at 1920px in
 * WebP is a few hundred KB, which is the difference between an upload that
 * finishes and one that gets cut off part-way.
 *
 * Deliberately never throws for a file it can't handle — an SVG, an animated
 * GIF, a decode failure, a browser without WebP encoding — it returns the
 * original instead. Refusing to upload a valid image because we couldn't
 * shrink it would be a worse outcome than uploading it whole.
 */

/** Formats that either can't be drawn to a canvas or would lose something in the process. */
const PASS_THROUGH_TYPES = ["image/svg+xml", "image/gif"];

export const compressImage = async (
  file: File,
  { maxEdge = 1920, quality = 0.82 }: CompressImageOptions = {},
): Promise<File> => {
  if (!file.type.startsWith("image/") || PASS_THROUGH_TYPES.includes(file.type)) {
    return file;
  }

  try {
    // `imageOrientation: "from-image"` applies the EXIF rotation phone photos
    // carry; without it a portrait shot is re-encoded lying on its side.
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });

    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) {
      bitmap.close();
      return file;
    }

    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/webp", quality);
    });

    // A browser that can't encode WebP hands back `null`, or a PNG so simple
    // that WebP is larger — either way the original is the better upload.
    if (!blob || blob.size >= file.size) return file;

    const name = file.name.replace(/\.[^.]+$/, "") + ".webp";
    return new File([blob], name, { type: "image/webp", lastModified: Date.now() });
  } catch {
    return file;
  }
};
