// const withPWA = require('next-pwa');

module.exports = {
  images: {
    domains: ['i.ibb.co', 'user-images.githubusercontent.com', 'is1-ssl.mzstatic.com'],
  },
  output: 'standalone',
  reactStrictMode: false,
  swcMinify: true,
  typescript: {
    tsconfigPath: 'tsconfig.json',
  },
};
