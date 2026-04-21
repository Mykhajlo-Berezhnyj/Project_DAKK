import Alpine from "alpinejs";
import type { CategoriesStore } from "../scripts/type/filters";

export function initCategoriesStore() {
  Alpine.store<"categories">("categories", {
    list: [],
    isReady: false,

    set(data) {
      this.list = data;
      this.isReady = true;
    },
  } satisfies CategoriesStore);
}
