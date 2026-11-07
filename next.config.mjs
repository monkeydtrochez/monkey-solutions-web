/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Root layout lives in app/[lang], so unmatched URLs need a global 404.
    globalNotFound: true,
  },
  // Dotted single-segment paths (/wp-login.php, /.env) skip the proxy. Once no
  // public file or route matched, send them to /sv so [slug] 404s them at
  // routing time. Otherwise they reach app/[lang] as a fake language and
  // render an on-demand 404 that is cached for a year.
  async rewrites() {
    return {
      afterFiles: [{ source: "/:file([^/]*\\.[^/]+)", destination: "/sv/:file" }],
    };
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
