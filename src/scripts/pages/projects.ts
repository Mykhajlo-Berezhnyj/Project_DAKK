import { fetchData } from "../core/api";
import { type Filter } from "../service/filters";
import type { CategorySlug, Project } from "../type/project";
import { buildProjectQuery } from "../service/buildProjectsQuery";
import { animationEnter, waitTransition } from "../core/animations";

type CategoryGroup = {
  name: string;
  slug: CategorySlug;
  projects: Project;
};

interface LoadProjects {
  projects: Partial<Project>[];
  isLoading: boolean;
  error: unknown | null;
  hasMore: boolean;
  page: number;
  perPage: number;
  currentFilters: Partial<Filter>;
  categoryGroup: CategoryGroup[];
  isFirstLoad: boolean;
  isLocking: boolean;
  load: () => void;
  reload: () => void;
  reset: () => void;
  init: () => void;
}

export function loadProjects(): LoadProjects {
  return {
    projects: [],
    isLoading: false,
    error: null,
    hasMore: true,
    page: 1,
    perPage: 6,
    categoryGroup: [],
    currentFilters: {},
    isFirstLoad: true,
    isLocking: false,

    async init() {
      window.addEventListener("filters-changed", (e) => {
        this.currentFilters = (e as CustomEvent<Partial<Filter>>).detail;
        this.reload();
      });

      window.addEventListener("popstate", () => {
        this.reload();
      });
    },

    async reload() {
      if (this.isLocking) return;
      if (!this.isFirstLoad) {
        const items = document.querySelectorAll(".gallery-item");

        items.forEach((element) => {
          element.classList.add("reset");
        });

        await waitTransition(items[0]);
      }

      this.reset();
      await this.load();
      this.isFirstLoad = false;

      await new Promise((r) => requestAnimationFrame(r));

      animationEnter();
    },

    async load() {
      if (this.isLocking || !this.hasMore) return;
      this.isLoading = true;
      this.isLocking = true;
      this.error = null;

      try {
        const { query, options } = buildProjectQuery(
          this.currentFilters,
          this.page,
          this.perPage,
        );

        if (options.mode === "group") {
          const result = await fetchData<{ category: CategoryGroup[] }>({
            query,
            options,
          });
          const group = result.category;
          this.categoryGroup = group;
        } else {
          const result = await fetchData<{
            projects: Project[];
            total: number;
          }>({ query, options });
          const newProjects = result.projects;
          const total = result.total;

          this.projects = [...this.projects, ...newProjects];

          if (total < this.page * this.perPage) {
            this.hasMore = false;
          }
          this.page++;
        }
      } catch (err) {
        this.error =
          err instanceof Error ? err.message : "Something went wrong";
        this.hasMore = false;
      } finally {
        this.isLoading = false;
        this.isLocking = false;
      }
    },

    reset() {
      this.projects = [];
      this.isLoading = false;
      this.hasMore = true;
      this.page = 1;
      this.error = null;
    },
  };
}
