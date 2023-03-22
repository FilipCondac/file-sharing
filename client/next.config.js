/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
};

module.exports = {
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.node = {
        fs: "empty",
      };
    }

    return config;
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

// eslint-disable-next-line no-undef
module.exports = nextConfig;
