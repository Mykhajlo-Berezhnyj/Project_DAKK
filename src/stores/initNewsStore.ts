import Alpine from "alpinejs";
import type { NewsStore } from "../scripts/type/news";
import { init as initNews, newsStore, cutTextFn } from "../scripts/pages/news";

export function initNewsStore() {
  Alpine.store("news", newsStore as NewsStore);

  Alpine.data("news", () => ({
    init: initNews,
    cutText: cutTextFn,
  }));
}
