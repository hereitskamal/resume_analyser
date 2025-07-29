/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        "*.pdf": ["file-loader"],
      },
    },
  },
  webpack: (config: { resolve: { alias: any; fallback: any; }; }, { isServer }: any) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "pdfjs-dist/build/pdf.worker.js": "pdfjs-dist/legacy/build/pdf.worker.min.js",
      };
    }

    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false,
    };

    return config;
  },
};

module.exports = nextConfig;

