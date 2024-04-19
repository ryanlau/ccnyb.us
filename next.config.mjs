/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.SUPABASE_URL,
        pathname: "/storage/v1/object/public/predictions/**",
      },
    ],
  },
};

export default nextConfig;
