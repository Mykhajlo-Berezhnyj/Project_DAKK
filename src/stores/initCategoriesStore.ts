import Alpine from "alpinejs";
import { getCategories } from "../scripts/service/getCategories";
import type { CategoriesStore } from "../scripts/type/project";

export function initCategoriesStore() {
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
}
