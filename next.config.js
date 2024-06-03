/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.(glsl|vert|frag|fragment)$/,
      use: 'raw-loader',
      exclude: /node_modules/,
    })

    return config
  },
}

module.exports = nextConfig
