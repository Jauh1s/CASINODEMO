/** Static export so the site can be hosted on GitHub Pages. */
const basePath = process.env.BASE_PATH || "";
/** @type {import("next").NextConfig} */
module.exports = { reactStrictMode: true, output: "export", trailingSlash: true, basePath, images: { unoptimized: true } };
