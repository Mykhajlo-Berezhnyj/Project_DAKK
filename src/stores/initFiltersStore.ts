import Alpine from "alpinejs";
import type { CategoriesStore, FiltersStore } from "../scripts/type/filters";
import { getPartsPath } from "../scripts/utils/getPartsPath";
import type { CategorySlug } from "../scripts/type/project";
import { SORT_OPTIONS, type SortKey } from "../data/sortOptions";
import type { LocaleStore } from "../scripts/type/lang";

export function initFiltersStore() {
  Alpine.store<"filters">("filters", {
    status: null,
    category: null,
    city: null,
    search: "",
    mode: null,
    order: "newest",
    locale: "uk",
    categories: [],

    async init() {
      this.paramsFromUrl();
    },

    isActive(item) {
      return (
        this.mode !== "group" &&
        ((item.key === "all" && !this.status) || item.key === this.status)
      );
    },

    paramsFromUrl() {
      const params = new URLSearchParams(window.location.search);
      this.search = params.get("search") || "";
      this.city = params.get("city") || null;
      const modeFromUrl = params.get("mode");
      this.mode = modeFromUrl === "group" ? "group" : "all";
      const statusFromUrl = params.get("status") || null;

      if (
        statusFromUrl === "concept" ||
        statusFromUrl === "in-progress" ||
        statusFromUrl === "completed"
      ) {
        this.status = statusFromUrl;
      } else {
        this.status = null;
      }

      const { category: categoryFromUrl } = getPartsPath();

      if (
        (Alpine.store("categories") as CategoriesStore).isReady &&
        categoryFromUrl &&
        (Alpine.store("categories") as CategoriesStore).list.find(
          (c) => c.slug === categoryFromUrl,
        )
      ) {
        this.category = categoryFromUrl as CategorySlug;
        this.mode = "all";
      } else {
        this.category = null;
      }

      const orderFromParams = params.get("order");
      if (orderFromParams && orderFromParams in SORT_OPTIONS) {
        this.order = orderFromParams as SortKey;
      } else {
        this.order = "newest";
      }
      this.locale = (Alpine.store("locale") as LocaleStore).current;
    },

    updateUrl() {
      const params = new URLSearchParams();

      const buildParams = (key: string, value: string | null | undefined) => {
        if (value === null || value === "" || value === undefined) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      };

      buildParams("status", this.status);
      buildParams("search", this.search);
      buildParams("city", this.city);
      buildParams("order", this.order);
      buildParams("mode", this.mode);

      const newUrl =
        window.location.pathname +
        "?" +
        params.toString() +
        window.location.hash;

      window.history.replaceState({}, "", newUrl);
    },
  } satisfies FiltersStore);
}
