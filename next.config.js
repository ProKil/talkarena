/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
    /**
   * Enable static exports for the App Router.
   *
   * @see https://nextjs.org/docs/app/building-your-application/deploying/static-exports
   */
    output: "export",

    /**
     * Set base path. This is the slug of your GitHub repository.
     *
     * @see https://nextjs.org/docs/app/api-reference/next-config-js/basePath
     */
    basePath: "",

    /**
     * Disable server-based image optimization. Next.js does not support
     * dynamic features with static exports.
     *
     * @see https://nextjs.org/docs/app/api-reference/components/image#unoptimized
     */
    images: {
      unoptimized: true,
    },
    webpack: (config, { dev, isServer }) => {
      // Your existing webpack modifications
    
      // Update your existing ignored regex
      const ignoredFilesRegex = /^((?:[^/]*(?:\/|$))*)(\.(git|next)|node_modules|\.#.*|\#.*\#|.*~|\.rej|\.orig|\.emacs\.desktop.*)(\/((?:[^/]*(?:\/|$))*)(?:$|\/))?/;
    
      // Apply to watchOptions
      config.watchOptions = {
        ...config.watchOptions,
        ignored: ignoredFilesRegex
      };
    
     return config;
    }
};

// export default nextConfig;

const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.jsx'
})

module.exports = withNextra(nextConfig)
