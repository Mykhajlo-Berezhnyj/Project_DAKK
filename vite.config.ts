import { defineConfig } from "vite";
import injectHTML from "vite-plugin-html-inject";
import { resolve } from "path";

const ROUTES = [
  { match: ["/", "/en"], file: "/index.html" },
  {
    match: ["/projects", "/en/projects", "/en/projects/"],
    file: "/projects.html",
  },
  { match: ["/news", "/en/news"], file: "/news.html" },
  { match: ["/videos", "/en/videos"], file: "/videos.html" },
  { match: ["/about", "/en/about"], file: "/about.html" },
  { match: ["/contacts", "/en/contacts"], file: "/contacts.html" },
];

const DYNAMIC_ROUTES = [
  {
    segment: "projects",
    depth2: "/projects-category.html",
    depth3: "/project-single.html",
    moreDepth: "/projects.html",
  },
  {
    segment: "news",
    depth2: "/news.html",
    depth3: "/news.html",
    moreDepth: "/news.html",
  },
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
        "projects-category": resolve(__dirname, "projects-category.html"),
        news: resolve(__dirname, "news.html"),
        "news-single": resolve(__dirname, "news-single.html"),
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

          const parts = pathname
            .replace(/^\/en/, "")
            .split("/")
            .filter(Boolean);
          const dynamic = DYNAMIC_ROUTES.find((r) => r.segment === parts[0]);

          if (dynamic) {
            if (parts.length === 2 && dynamic.depth2) {
              req.url = dynamic.depth2;
              return next();
            }
            if (
              parts.length >= 2 &&
              dynamic.segment === "news" &&
              dynamic.depth2
            ) {
              req.url = dynamic.depth2;
              return next();
            }
            if (
              parts.length >= 3 &&
              dynamic.segment === "projects" &&
              dynamic.depth3
            ) {
              req.url = dynamic.depth3;
              return next();
            }
            // res.writeHead(302, { Location: `/${dynamic.segment}` });
            // res.end();
            // return;
          }
         return next();
        });
      },
    },
  ],
});
