import Alpine from "alpinejs";
import { localization } from "../core/localization.ts";
import { getPartsPath } from "../utils/getPartsPath.ts";
import { redirect } from "../utils/redirect.ts";
import type { CategoriesStore } from "../type/project.ts";
import { init as leaflet } from "./leaflet.ts";

export function pageCategoryProject() {
  return {
    isReady: false,
    is404: false,

    async init() {
      const { category } = getPartsPath();
      const locale = localization();

      const store = await (Alpine.store("categories") as CategoriesStore);

      const iValid = store.list.some((c) => c.slug === category);

      if (!iValid) {
        this.is404 = true;
        this.isReady = true;
        const url = `${locale.l("/projects")}`;

        redirect({ url, time: 5 });
      } else {
        this.isReady = true;
        queueMicrotask(() => leaflet());
      }
    },
  };
}
