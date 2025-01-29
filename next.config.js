/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sjc.microlink.io',
        port: '',
        pathname: '/**',
      },
    ],
  },
  typescript: {
    // !! WARN !!
    // 在生产环境中不建议这样做
    // 这里仅为了开发方便而临时忽略类型错误
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig 