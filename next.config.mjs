/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: {
    position: "top-right",
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
