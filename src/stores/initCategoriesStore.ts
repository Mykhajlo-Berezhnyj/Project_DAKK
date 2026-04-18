import Alpine from "alpinejs";
import { getCategories } from "../scripts/service/getCategories";
import type { CategoriesStore } from "../scripts/type/filters";

export function initCategoriesStore() {
  Alpine.store<"categories">("categories", {
    list: [],
    isReady: false,

    async init() {
      if (this.isReady) return;
      this.list = await getCategories();
      this.isReady = true;
    },
  } satisfies CategoriesStore);
}
