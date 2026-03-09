/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // Cloudinary şəkilləri üçün bunu da əlavə et
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
