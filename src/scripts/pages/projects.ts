import type { CategorySlug, Project, ProjectsStore } from "../type/project";
import Alpine from "alpinejs";
import { leaflet } from "./leaflet";
import type { LocaleStore } from "../type/lang";
import { getGroupByCategory } from "../utils/getGroupByCategory";
import { getRandomProjectsFromCategory } from "../utils/getRandomProjectsFromCategory";
import { animationEnter, waitTransition } from "../core/animations";
import type { FiltersStore } from "../type/filters";
import { initProjectsStore } from "../../stores/initProjectsStore";
import { initFiltersStore } from "../../stores/initFiltersStore";
import { getTimelineDate } from "../utils/getTimelineDate";

type CategoryGroup = {
  category: CategorySlug;
  project: Partial<Project>;
};

interface loadProjects {
  projects: Partial<Project>[];
  filtered: Partial<Project>[];
  visible: Partial<Project>[];
  group: CategoryGroup[];
  page: number;
  perPage: number;
  hasMore: boolean;
  isLocking: boolean;
  isFirstLoad: boolean;
  init: () => void;
  setFilters: () => void;
  load: (projects?: Partial<Project>[]) => void;
  reset: () => void;
  reload: () => void;
}

export function init() {
  initFiltersStore();
  initProjectsStore();
  Alpine.data("loadProjects", () => loadProjects());
  Alpine.data("leaflet", leaflet);
}

export function loadProjects(): loadProjects {
  return {
    projects: [],
    filtered: [],
    visible: [],
    group: [],
    page: 1,
    perPage: 6,
    hasMore: false,
    isLocking: false,
    isFirstLoad: true,

    async init() {
      const store = Alpine.store("projects") as ProjectsStore;
      await store.init();
      await (Alpine.store("filters") as FiltersStore).init();
      this.projects = [...store.projects];
      this.setFilters();
      this.load();
      (this as any).$watch(
        () => (Alpine.store("locale") as LocaleStore).current,
        async () => {
          await store.init(true);
          this.projects = [...store.projects];
          this.setFilters();
          this.reload();
        },
      );
    },

    setFilters() {
      const { search, status, category, city, order } = Alpine.store(
        "filters",
      ) as FiltersStore;
      this.filtered = this.projects
        .filter((p) => !category || p.category?.slug === category)
        .filter((p) => !status || p.status === status)
        .filter((p) => !city || p.city?.name === city)
        .filter((p) => !search || p.searchIndex?.includes(search))
        .sort((a, b) => {
          const locale = (Alpine.store("locale") as LocaleStore).current;
          switch (order) {
            case "newest":
              return getTimelineDate(b) - getTimelineDate(a);
            case "oldest":
              return getTimelineDate(a) - getTimelineDate(b);
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

    async load() {
      if (this.isLocking) return;
      if ((Alpine.store("filters") as FiltersStore).mode === "group") {
        if (!this.projects.length) return;
        const grouped = getGroupByCategory(this.projects);
        this.group = getRandomProjectsFromCategory(grouped);
      } else {
        if (!this.filtered?.length) return;
        this.isLocking = true;
        this.visible = this.filtered.slice(0, this.page * this.perPage);

        this.hasMore = this.page * this.perPage < this.filtered.length;
        this.page++;
        this.isLocking = false;
        this.isFirstLoad = false;
      }
    },

    async reload() {
      if (this.isFirstLoad) {
        this.load();
        this.isFirstLoad = false;
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
