import Alpine from "alpinejs";
import { localization } from "../core/localization.ts";
import { getPartsPath } from "../utils/getPartsPath.ts";
import { redirect } from "../utils/redirect.ts";
import { bootstrap } from "./projects.ts";
import { leaflet } from "./leaflet.ts";
import type { Categories, CategoriesStore } from "../type/filters.ts";

export async function init() {
  Alpine.data("pageCategoryProject", () => pageCategoryProject());

  Alpine.data("leaflet", leaflet);
}

export function pageCategoryProject() {
  return {
    is404: false,
    category: undefined as Categories | undefined,

    async init() {
      await bootstrap();
      const { category } = getPartsPath();
      const locale = localization();

      const found = (Alpine.store("categories") as CategoriesStore).list.find(
        (c) => c.slug === category,
      );

      if (!found) {
        this.is404 = true;
        const url = `${locale.l("/projects")}`;
        redirect({ url, time: 5 });
      } else {
        this.setSeo();
        this.category = found;
      }
    },

    setSeo() {
      const locale = localization();
      document.title = `${locale.t(locale.projectsData.titleHead)} ${locale.t(
        locale.projectsData.page,
      )} — ${this.category?.name}`;

      const meta = document.querySelector('meta[name="description"]');
      const description = this.category
        ? `${locale.t(locale.projectsData.descriptionHeadCategories)} — ${
            this.category.name
          }`
        : locale.t(locale.projectsData.descriptionHead);
      if (meta) {
        meta.setAttribute("content", description);
      }
    },
  };
}
