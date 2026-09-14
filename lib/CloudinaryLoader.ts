import type { ImageLoaderProps } from "next/image";

/**
 * Builds a Cloudinary delivery URL that already carries the size and format
 * the browser needs, so `next/image` hands the URL straight to the browser
 * instead of fetching the original through its own optimizer.
 *
 * That round trip is what this avoids, and it was breaking images outright:
 * Next hardcodes a 7-second cap on fetching a remote image
 * (`AbortSignal.timeout(7000)` in `image-optimizer.js`, not configurable), and
 * on this network the full-size original measured 374 KB / 9.0s — past the cap,
 * so the request 504'd and the image simply never appeared. Asking Cloudinary
 * for the size actually being rendered brings the same picture down to 8.7 KB
 * in 2.0s. Resizing is what an image CDN is for; doing it twice was the bug.
 *
 * Anything that isn't a Cloudinary delivery URL is returned untouched, so the
 * loader is safe to attach to an `<Image>` whose `src` might be a blob preview.
 */

const DELIVERY_ORIGIN = "https://res.cloudinary.com/";
const UPLOAD_SEGMENT = "/image/upload/";

export const cloudinaryLoader = ({ src, width, quality }: ImageLoaderProps): string => {
  if (!src.startsWith(DELIVERY_ORIGIN)) return src;

  const segment = src.indexOf(UPLOAD_SEGMENT);
  if (segment === -1) return src;

  const head = src.slice(0, segment + UPLOAD_SEGMENT.length);
  const tail = src.slice(segment + UPLOAD_SEGMENT.length);

  // `c_limit` only ever scales down — a thumbnail request must not blow a
  // small image up. `f_auto` serves WebP/AVIF to browsers that accept them.
  const transforms = `f_auto,q_${quality ?? "auto"},c_limit,w_${width}`;

  return `${head}${transforms}/${tail}`;
};
