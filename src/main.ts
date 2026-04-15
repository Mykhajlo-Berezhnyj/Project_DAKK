import "./css/main.css";
import { localization } from "./scripts/core/localization";
import Alpine from "alpinejs";
import { getLocaleFromURL } from "./scripts/utils/getLocaleFromURL";
import { setLocaleUrl } from "./scripts/utils/setLocaleUrl";
import intersect from "@alpinejs/intersect";
import type { Lang, LocaleStore } from "./scripts/type/lang";
import { renderMenu } from "./scripts/core/menu";
import { getCategories } from "./scripts/service/getCategories";
import type { CategoriesStore, ProjectsStore } from "./scripts/type/project";
import { getProjects } from "./scripts/service/getProjects";


interface PageModule {
  init: () => void;
}

const routes: Record<string, () => Promise<PageModule>> = {
  // map: () => import("./scripts/pages/map"),
  home: () => import("./scripts/pages/home"),
  news: () => import("./scripts/pages/news"),
  projects: () => import("./scripts/pages/projects"),
  video: () => import("./scripts/pages/video"),
  "project-single": () => import("./scripts/pages/project-single"),
  "projects-category": () => import("./scripts/pages/projects-category"),
};

const page = document.body.dataset.page;

if (page && routes[page]) {
  routes[page]()
    .then((module) => {
      module.init();
      Alpine.start();
    })
    .catch((err) => {
      console.error("Failed to load the page script:", err);
    });
} else {
  Alpine.start();
}

Alpine.data("localization", localization);
Alpine.data("renderMenu", renderMenu);
// Alpine.data("leaflet", leaflet);

Alpine.plugin(intersect);

Alpine.store("locale", {
  current: getLocaleFromURL(),

  set(locale: Lang) {
    ((this.current = locale), setLocaleUrl(locale));
    (Alpine.store("categories") as CategoriesStore).list = [];
    (Alpine.store("projects") as ProjectsStore).projects = [];
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

document.addEventListener("alpine:init", () => {
  Alpine.store("projects", {
    projects: [],
    isReady: false,
    isLoading: false,
    error: null,

    async init() {
      if (this.isReady || this.isLoading) return;
      this.isLoading = true;

      try {
        this.projects = await getProjects();
        this.isReady = true;
      } catch (error) {
        if (error instanceof Error) {
          this.error = error.message;
        }
        this.error = "Unknown error";
      } finally {
        this.isLoading = false;
      }
    },
  } as ProjectsStore);
});

window.Alpine = Alpine;
