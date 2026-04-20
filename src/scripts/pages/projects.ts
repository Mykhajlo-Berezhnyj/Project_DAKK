import { filtersProjects, type Filter } from "../service/filters";
import type { CategorySlug, Project, ProjectsStore } from "../type/project";
import { getStartEnd } from "../utils/getStartEnd";
import Alpine from "alpinejs";
import { leaflet } from "./leaflet";
import type { LocaleStore } from "../type/lang";
import { getGroupByCategory } from "../utils/getGroupByCategory";
import { getRandomProjectsFromCategory } from "../utils/getRandomProjectsFromCategory";
import { animationEnter, waitTransition } from "../core/animations";
import { initCategoriesStore } from "../../stores/initCategoriesStore";
import { initProjectsStore } from "../../stores/initProjectsStore";

type CategoryGroup = {
  category: CategorySlug;
  project: Partial<Project>;
};

interface loadProjects {
  projects: Partial<Project>[];
  filtered: Partial<Project>[];
  currentFilters: Partial<Filter>;
  visible: Partial<Project>[];
  group: CategoryGroup[];
  page: number;
  perPage: number;
  hasMore: boolean;
  isLocking: boolean;
  isFirtstLoad: boolean;
  isReady: boolean;
  init: () => void;
  getFilters: () => void;
  load: (projects?: Partial<Project>[]) => void;
  reset: () => void;
  reload: () => void;
}

export function init() {
  initCategoriesStore();
  initProjectsStore();
  Alpine.data("filters", filtersProjects);
  Alpine.data("loadProjects", () => loadProjects());
  Alpine.data("leaflet", leaflet);
}

export function loadProjects(): loadProjects {
  return {
    projects: [],
    filtered: [],
    currentFilters: {},
    visible: [],
    group: [],
    page: 1,
    perPage: 6,
    hasMore: false,
    isLocking: false,
    isFirtstLoad: true,
    isReady: false,

    async init() {
      const store = Alpine.store("projects") as ProjectsStore;

      window.addEventListener("filters-changed", (e) => {
        this.currentFilters = (e as CustomEvent<Partial<Filter>>).detail;
        this.getFilters();
        if (this.isFirtstLoad) return;

        this.reload();
      });

      window.addEventListener("popstate", () => {
        this.reload();
      });

      Alpine.effect(() => {
        const isReady = store.isReady;
        if (!isReady || !this.isFirtstLoad) return;
        this.isReady = isReady;

        this.projects = store.projects;
        this.getFilters();
        this.load();
      });
    },

    getFilters() {
      const { search, status, category, city, order } = this.currentFilters;
      this.filtered = this.projects
        .filter((p) => !category || p.category?.slug === category)
        .filter((p) => !status || p.status === status)
        .filter((p) => !city || p.city?.name === city)
        .filter((p) => !search || p.searchIndex?.includes(search))
        .sort((a, b) => {
          const locale = (Alpine.store("locale") as LocaleStore).current;
          switch (order) {
            case "newest":
              return (
                new Date(b._createdAt ?? 0).getTime() -
                new Date(a._createdAt ?? 0).getTime()
              );
            case "oldest":
              return (
                new Date(a._createdAt ?? 0).getTime() -
                new Date(b._createdAt ?? 0).getTime()
              );
            case "nameAsc":
              return (a.projectName || "").localeCompare(
                b.projectName || "",
                locale,
              );
            case "nameDesc":
              return (b.projectName || "").localeCompare(
                a.projectName || "",
                locale,
              );
            default:
              return 0;
          }
        });
    },

    load() {
      if (this.isLocking || !this.isReady) return;
      if (!this.filtered?.length) return;
      const { start, end } = getStartEnd(this.page, this.perPage);

      if (this.currentFilters.mode === "all") {
        this.isLocking = true;
        const visibleCurrent = this.filtered.slice(start, end);
        this.visible = [...this.visible, ...visibleCurrent];

        this.hasMore = this.page * this.perPage < this.filtered.length;
        this.page++;
        this.isLocking = false;
        this.isFirtstLoad = false;
      } else {
        if (!this.projects.length) return;
        const grouped = getGroupByCategory(this.projects);
        this.group = getRandomProjectsFromCategory(grouped);
      }
    },

    async reload() {
      if (this.isFirtstLoad) {
        this.load();
        this.isFirtstLoad = false;
        return;
      } else {
        const items = document.querySelectorAll(".gallery-item");

        items.forEach((element) => {
          element.classList.add("reset");
        });

        await waitTransition(items[0]);
        items.forEach((element) => {
          element.classList.remove("reset");
        });
        this.reset();
        this.load();
        await new Promise((r) => requestAnimationFrame(r));
        animationEnter();
      }
    },

    reset() {
      this.page = 1;
      this.visible = [];
      this.hasMore = true;
      this.isLocking = false;
    },
  };
}
