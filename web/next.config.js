/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async rewrites() {
    // Determine API URL based on environment
    const apiUrl = process.env.NODE_ENV === 'production' 
      ? 'http://api:3000' 
      : 'http://localhost:3000';
      
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/:path*`
      }
    ];
  },
}

module.exports = nextConfig