/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'pit-images.public.blob.vercel-storage.com',
            port: '',
          },
        ],
      }
};

export default nextConfig;
