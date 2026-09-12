/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow local images (no external domains needed for placeholder images)
    unoptimized: false,
  },
  // Strict mode for better development experience
  reactStrictMode: true,
};

export default nextConfig;
