import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from "@mdx-js/rollup";
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import rehypeSlug from 'rehype-slug';
import rehypeToc from "@stefanprobst/rehype-extract-toc";
import rehypeTocExport from "@stefanprobst/rehype-extract-toc/mdx";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { VitePWA } from "vite-plugin-pwa";
import remarkGfm from "remark-gfm";

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    "process.env": process.env,
  },
  plugins: [
    react(),
    // @ts-ignore
    mdx({
      remarkPlugins: [
        remarkFrontmatter,
        [remarkMdxFrontmatter, { name: "frontMatter" }],
        remarkGfm,
      ],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: "wrap",
            properties: { className: "heading-link" },
          },
        ],
        rehypeToc,
        rehypeTocExport,
      ],
    }),
    VitePWA({
      workbox: {
        globPatterns: ["**/*.!(mp4|m4a)"],
        maximumFileSizeToCacheInBytes: 5242880,
      },
      includeAssets: [
        "**/*.(js|html|svg|png|jpg|jpeg|eot|woff|woff2|ttf",
      ],
      manifest: {
        "short_name": "Pashto Grammar",
        "name": "LingDocs Pashto Grammar",
        "icons": [
          {
              "src": "icons/android-chrome-36x36.png",
              "sizes": "36x36",
              "type": "image/png"
          },
          {
              "src": "icons/android-chrome-48x48.png",
              "sizes": "48x48",
              "type": "image/png"
          },
          {
              "src": "icons/android-chrome-72x72.png",
              "sizes": "72x72",
              "type": "image/png"
          },
          {
              "src": "icons/android-chrome-96x96.png",
              "sizes": "96x96",
              "type": "image/png"
          },
          {
              "src": "icons/android-chrome-144x144.png",
              "sizes": "144x144",
              "type": "image/png"
          },
          {
              "src": "icons/android-chrome-192x192.png",
              "sizes": "192x192",
              "type": "image/png"
          },
          {
              "src": "icons/android-chrome-256x256.png",
              "sizes": "256x256",
              "type": "image/png"
          },
          {
              "src": "icons/android-chrome-384x384.png",
              "sizes": "384x384",
              "type": "image/png"
          },
          {
              "src": "icons/android-chrome-512x512.png",
              "sizes": "512x512",
              "type": "image/png"
          }
        ],
        "start_url": ".",
        "display": "minimal-ui",
        "theme_color": "#DEE1E6",
        "background_color": "#ffffff"
      },
    }),
  ],
});
