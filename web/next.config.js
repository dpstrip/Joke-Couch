/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async rewrites() {
    // Use the docker service name for server-side proxy
    return [
      {
        source: '/api/:path*',
        destination: 'http://joke-couch-api:3000/:path*'
      }
    ];
  },
}

module.exports = nextConfig