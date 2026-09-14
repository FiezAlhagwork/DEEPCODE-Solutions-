import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Project images are uploaded to Cloudinary by the backend, and user
    // avatars come from Clerk. `next/image` throws on any remote host it
    // hasn't been told about, so these are declared before the admin panel
    // starts rendering real records.
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "img.clerk.com" },
    ],
  },
};

export default withNextIntl(nextConfig);
