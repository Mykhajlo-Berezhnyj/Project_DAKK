import { defineConfig } from "vite";
import injectHTML from "vite-plugin-html-inject";
import { resolve } from "path";

const ROUTES = [
  { match: ["/projects", "/en/projects"], file: "/projects.html" },
  { match: ["/news", "/en/news"], file: "/news.html" },
  { match: ["/videos", "/en/videos"], file: "/videos.html" },
];

const DYNAMIC_ROUTES = [
  { prefix: ["/projects/", "/en/projects/"], file: "/project-single.html" },
  { prefix: ["/news/", "/en/news/"], file: "/news-single.html" },
];

export default defineConfig({
  base: "/",
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
  plugins: [
    injectHTML(),
    {
      name: "spa-fallback",

      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (!req.url) return next();
          const pathname = req.url.split("?")[0].replace(/\/$/, "") || "/";

          const staticRoute = ROUTES.find((r) => r.match.includes(pathname));
          if (staticRoute) {
            req.url = staticRoute.file;
            return next();
          }
  
          const dynamicRoute = DYNAMIC_ROUTES.find((r) =>
            r.prefix.some((p) => pathname.startsWith(p)),
          );
          if (dynamicRoute) {
            req.url = dynamicRoute.file;
            return next();
          }

          next();
        });
      },
    },
  ],
});
