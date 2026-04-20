import Alpine from "alpinejs";
import { localization } from "../core/localization.ts";
import { getPartsPath } from "../utils/getPartsPath.ts";
import { redirect } from "../utils/redirect.ts";
import type { CategoriesStore } from "../type/project.ts";
import { filtersProjects } from "../service/filters.ts";
import { loadProjects } from "./projects.ts";
import { leaflet } from "./leaflet.ts";
import { initCategoriesStore } from "../../stores/initCategoriesStore.ts";
import { initProjectsStore } from "../../stores/initProjectsStore.ts";

export function init() {
  initCategoriesStore();
  initProjectsStore();
  Alpine.data("leaflet", leaflet);
  Alpine.data("filters", filtersProjects);
  Alpine.data("loadProjects", () => loadProjects());
  Alpine.data("pageCategoryProject", () => pageCategoryProject());
}

export function pageCategoryProject() {
  return {
    isReady: false,
    is404: false,

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
        }
      });
    },
  };
}
