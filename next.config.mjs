/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Root layout lives in app/[lang], so unmatched URLs need a global 404.
    globalNotFound: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
