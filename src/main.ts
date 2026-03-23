import "./css/main.css";
import { localization } from "./scripts/core/localization";
import Alpine from "alpinejs";
import { loadProjects } from "./scripts/pages/projects";
import { loadSingleProject } from "./scripts/pages/project-single";
import { filtersProjects } from "./scripts/service/filters";
import { getLocaleFromURL } from "./scripts/utils/getLocaleFromURL";
import { setLocaleUrl } from "./scripts/utils/setLocaleUrl";
import intersect from "@alpinejs/intersect";
import type { Lang, LocaleStore } from "./scripts/type/lang";

interface PageModule {
  init: () => void;
}

const routes: Record<string, () => Promise<PageModule>> = {
  map: () => import("./scripts/pages/map"),
  home: () => import("./scripts/pages/home"),
  news: () => import("./scripts/pages/news"),
  // projects: () => import("./scripts/pages/projects"),
  video: () => import("./scripts/pages/video"),
  "project-single": () => import("./scripts/pages/project-single"),
};

const page = document.body.dataset.page;

if (page && routes[page]) {
  routes[page]()
    .then((module) => {
      module.init();
    })
    .catch((err) => {
      console.error("Failed to load the page script:", err);
    });
}

Alpine.data("localization", () => localization());
Alpine.data("filters", () => filtersProjects());
Alpine.data("loadProjects", () => loadProjects(filtersProjects()));
Alpine.data("loadSingleProject", () => loadSingleProject());

Alpine.plugin(intersect);

Alpine.store("locale", {
  current: getLocaleFromURL(),

  set(locale: Lang) {
    ((this.current = locale), setLocaleUrl(locale));
  },
} as LocaleStore);

window.Alpine = Alpine;
Alpine.start();
