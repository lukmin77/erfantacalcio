/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import('./src/env.js')

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  /**
   * If you are using `appDir` then you must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ['it'],
    defaultLocale: 'it',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'content.fantacalcio.it',
        port: '',
        pathname: '/web/campioncini/**',
      },
      {
        protocol: 'https',
        hostname: '6518wln9g69xjwcm.public.blob.vercel-storage.com',
        port: '',
        pathname: '/fotoprofili',
      },
      {
        protocol: 'https',
        hostname: '6518wln9g69xjwcm.public.blob.vercel-storage.com',
        port: '',
        pathname: '/voti',
      },
    ],
  },
  transpilePackages: ['@mui/x-charts'],
  /* distDir: 'dist',
  output: 'standalone' */
}

export default config
