import "./css/main.css";
import { localization } from "./scripts/core/localization";
import Alpine from "alpinejs";
import { getLocaleFromURL } from "./scripts/utils/getLocaleFromURL";
import { setLocaleUrl } from "./scripts/utils/setLocaleUrl";
import intersect from "@alpinejs/intersect";
import type { Lang, LocaleStore } from "./scripts/type/lang";
import { renderMenu } from "./scripts/core/menu";
import type { CategoriesStore, ProjectsStore } from "./scripts/type/project";


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

Alpine.plugin(intersect);

Alpine.store("locale", {
  current: getLocaleFromURL(),

  set(locale: Lang) {
    ((this.current = locale), setLocaleUrl(locale));
    (Alpine.store("categories") as CategoriesStore).list = [];
    (Alpine.store("projects") as ProjectsStore).projects = [];
  },
} as LocaleStore);

window.Alpine = Alpine;
