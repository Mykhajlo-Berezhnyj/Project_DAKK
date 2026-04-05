// import "./css/main.css";
import { localization } from "./scripts/core/localization";
import Alpine from "alpinejs";
import { loadProjects } from "./scripts/pages/projects";
import { loadSingleProject } from "./scripts/pages/project-single";
import { filtersProjects } from "./scripts/service/filters";
import { getLocaleFromURL } from "./scripts/utils/getLocaleFromURL";
import { setLocaleUrl } from "./scripts/utils/setLocaleUrl";
import intersect from "@alpinejs/intersect";
import type { Lang, LocaleStore } from "./scripts/type/lang";
import { renderMenu } from "./scripts/core/menu";
import { getCategories } from "./scripts/service/getCategories";
import type { CategoriesStore } from "./scripts/type/project";
import { pageCategoryProject } from "./scripts/pages/projects-category";
import { projectsPrev } from "./scripts/pages/projects-preview";
import { leaflet } from "./scripts/pages/leaflet";

interface PageModule {
  init: () => void;
}

const routes: Record<string, () => Promise<PageModule>> = {
  map: () => import("./scripts/pages/map"),
  home: () => import("./scripts/pages/home"),
  news: () => import("./scripts/pages/news"),
  video: () => import("./scripts/pages/video"),
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

Alpine.data("localization", localization);
Alpine.data("filters", filtersProjects);
Alpine.data("loadProjects", () => loadProjects());
Alpine.data("loadSingleProject", () => loadSingleProject());
Alpine.data("renderMenu", renderMenu);
Alpine.data("pageCategoryProject", () => pageCategoryProject());
Alpine.data("projectsPrev", projectsPrev);
Alpine.data("leaflet", leaflet);

Alpine.plugin(intersect);

Alpine.store("locale", {
  current: getLocaleFromURL(),

  set(locale: Lang) {
    ((this.current = locale), setLocaleUrl(locale));
  },
} as LocaleStore);

document.addEventListener("alpine:init", () => {
  Alpine.store("categories", {
    list: [],
    isReady: false,

    async init() {
      if (this.isReady) return;
      this.list = await getCategories();
      this.isReady = true;
    },
  } as CategoriesStore);
});

window.Alpine = Alpine;
Alpine.start();
