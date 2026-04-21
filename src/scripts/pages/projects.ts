import type { CategorySlug, Project, ProjectsStore } from "../type/project";
import { leaflet } from "./leaflet";
import type { LocaleStore } from "../type/lang";
import { getGroupByCategory } from "../utils/getGroupByCategory";
import { getRandomProjectsFromCategory } from "../utils/getRandomProjectsFromCategory";
import { animationEnter } from "../core/animations";
import { initProjectsStore } from "../../stores/initProjectsStore";
import { initFiltersStore } from "../../stores/initFiltersStore";
import { getTimelineDate } from "../utils/getTimelineDate";
import { initCategoriesStore } from "../../stores/initCategoriesStore";

import { loadAllDataProjects } from "../service/loadAllDataProjects";
import type { FiltersStore } from "../type/filters";
import Alpine from "alpinejs";

type CategoryGroup = {
  category: CategorySlug;
  project: Partial<Project>;
};

interface loadProjects {
  page: number;
  perPage: number;
  isFirstLoad: boolean;
  init: () => void;
  reload: () => void;
  loadMore: () => void;

  get filtered(): Partial<Project>[];
  get visible(): Partial<Project>[];
  get hasMore(): boolean;
  get group(): CategoryGroup[] | undefined;
}

export async function bootstrap() {
  initCategoriesStore();
  initFiltersStore();
  initProjectsStore();
  Alpine.data("loadProjects", () => loadProjects());
  await loadAllDataProjects();
}

export function init() {
  bootstrap();
  Alpine.data("leaflet", leaflet);
}

export function loadProjects(): loadProjects {
  return {
    page: 1,
    perPage: 6,
    isFirstLoad: true,

    init() {
      let currentLocale: string | null = null;
      Alpine.effect(async () => {
        const locale = (Alpine.store("locale") as LocaleStore).current;

        if (locale === currentLocale) return;
        currentLocale = locale;
        await loadAllDataProjects();
      });
      (this as any).$watch(
        () => {
          const filter = Alpine.store("filters") as FiltersStore;
          return [
            filter.search,
            filter.category,
            filter.city,
            filter.mode,
            filter.order,
            filter.locale,
          ];
        },
        () => (Alpine.store("filters") as FiltersStore).updateUrl(),
      );
    },

    get filtered() {
      const { search, status, category, city, order } = Alpine.store(
        "filters",
      ) as FiltersStore;
      return (Alpine.store("projects") as ProjectsStore).projects
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

    get visible() {
      return this.filtered.slice(0, this.page * this.perPage);
    },

    loadMore() {
      this.isFirstLoad = true;
      this.page++;
    },

    get hasMore() {
      return this.visible.length < this.filtered.length;
    },

    get group() {
      if ((Alpine.store("filters") as FiltersStore).mode !== "group") return;
      if ((Alpine.store("projects") as ProjectsStore).projects.length === 0)
        return;
      const grouped = getGroupByCategory(
        (Alpine.store("projects") as ProjectsStore).projects,
      );
      return getRandomProjectsFromCategory(grouped);
    },

    async reload() {
      if (this.isFirstLoad) {
        this.isFirstLoad = false;
        return;
      } else {
        this.page = 1;
        await Alpine.nextTick();
        animationEnter();
      }
    },
  };
}
