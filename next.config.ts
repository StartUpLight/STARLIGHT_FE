/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'kr.object.ncloudstorage.com',
        pathname: '/**',
      },
      {
        hostname: 'starlight-s3.kr.object.ncloudstorage.com',
        pathname: '/**',
      },
      {
        hostname: 'k.kakaocdn.net',
        pathname: '/**',
      },
      {
        hostname: 'img1.kakaocdn.net',
        pathname: '/**',
      },
    ],
    qualities: [60, 75, 90, 100],
  },

  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  webpack(config: any) {
    const assetRule = config.module.rules.find((r: any) =>
      r?.test?.test?.('.svg')
    );
    if (assetRule) {
      assetRule.exclude = /\.svg$/i;
    }

    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgo: true,
            svgoConfig: {
              plugins: [
                {
                  name: 'preset-default',
                  params: { overrides: { removeViewBox: false } },
                },
              ],
            },
            dimensions: false,
          },
        },
      ],
    });

    return config;
  },
};

export default nextConfig;
