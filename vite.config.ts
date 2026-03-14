import { defineConfig } from "vite";
import injectHTML from "vite-plugin-html-inject";
import { resolve } from "path";

export default defineConfig({
  plugins: [injectHTML()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        about: resolve(__dirname, "about.html"),
        projects: resolve(__dirname, "projects.html"),
        "project-single": resolve(__dirname, "project-single.html"),
        news: resolve(__dirname, "news.html"),
        videos: resolve(__dirname, "videos.html"),
        contacts: resolve(__dirname, "contacts.html"),
      },
    },
  },
});
