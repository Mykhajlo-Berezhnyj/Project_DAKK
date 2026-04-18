import Alpine from "alpinejs";
import { localization } from "../core/localization.ts";
import { getPartsPath } from "../utils/getPartsPath.ts";
import { redirect } from "../utils/redirect.ts";
import { loadProjects } from "./projects.ts";
import { leaflet } from "./leaflet.ts";
import { initCategoriesStore } from "../../stores/initCategoriesStore.ts";
import { initProjectsStore } from "../../stores/initProjectsStore.ts";
import type { Categories, CategoriesStore } from "../type/filters.ts";
import { initFiltersStore } from "../../stores/initFiltersStore.ts";

export function init() {
  initCategoriesStore();
  initProjectsStore();
  initFiltersStore();
  Alpine.data("leaflet", leaflet);
  Alpine.data("loadProjects", () => loadProjects());
  Alpine.data("pageCategoryProject", () => pageCategoryProject());
}

export function pageCategoryProject() {
  return {
    isReady: false,
    is404: false,
    category: undefined as Categories | undefined,

    async init() {
      const { category } = getPartsPath();
      const locale = localization();
      const store = await (Alpine.store("categories") as CategoriesStore);

      Alpine.effect(() => {
        if (!store.isReady) return;

        const isValid = store.list.some((c) => c.slug === category);

        if (!isValid) {
          this.is404 = true;
          this.isReady = true;
          const url = `${locale.l("/projects")}`;

          redirect({ url, time: 5 });
        } else {
          this.isReady = true;
          this.category = store.list.find((c) => c.slug === category);
          this.setSeo();
        }
      });
    },

    setSeo() {
      const locale = localization();
      document.title = `${locale.t(locale.projectsData.titleHead)} ${locale.t(locale.projectsData.page)} — ${this.category?.name}`;

      const meta = document.querySelector('meta[name="description"]');
      const description = this.category
        ? `${locale.t(locale.projectsData.descriptionHeadCategories)} — ${this.category.name}`
        : locale.t(locale.projectsData.descriptionHead);
      if (meta) {
        meta.setAttribute("content", description);
      }
    },
  };
}
