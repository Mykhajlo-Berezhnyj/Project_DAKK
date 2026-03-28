import type { StatusItem } from "../../data/dictionary/statusLang";
import { SORT_OPTIONS, type SortKey } from "../../data/sortOptions";
import { fetchData } from "../core/api";
import type { CategorySlug, Status, StatusLang } from "../type/project";
import { getLocaleFromURL } from "../utils/getLocaleFromURL";
import { getPartsPath } from "../utils/getPartsPath";
import { CATEGORY_QUERY } from "./query";

export type Categories = {
  name: string;
  slug: CategorySlug;
};

type Mode = "group" | "all" | null;

export interface Filter {
  status: Status | null;
  category: CategorySlug | null;
  city: string | null;
  search: string;
  order: SortKey;
  locale?: string;
  categories: Categories[];
  mode: Mode;
}

export interface FiltersProjects extends Filter {
  paramsFromUrl: () => void;
  updateUrl: () => void;
  setStatus: (status: StatusLang) => void;
  init: () => void;
  dispatch: () => void;
  setOrder: (order: SortKey) => void;
  isActive: (item: StatusItem) => void;
}

export function filtersProjects(): FiltersProjects {
  return {
    status: null,
    category: null,
    city: null,
    search: "",
    mode: null,
    order: "newest",
    locale: getLocaleFromURL(),
    categories: [],

    async init() {
      const result = await fetchData<Categories[]>({
        query: CATEGORY_QUERY,
        options: { locale: this.locale },
      });

      this.categories = result;
      this.paramsFromUrl();
      queueMicrotask(() => this.dispatch());
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

      if (categoryFromUrl) {
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

    dispatch() {
      window.dispatchEvent(
        new CustomEvent("filters-changed", {
          detail: {
            category: this.category,
            status: this.status,
            city: this.city,
            search: this.search,
            order: this.order,
            locale: this.locale,
            mode: this.mode,
          } satisfies Partial<Filter>,
        }),
      );
    },

    setStatus(status: StatusLang) {
      this.status = status === "all" ? null : status;
      this.mode = "all";
      this.updateUrl();
      this.dispatch();
    },

    // setMode(mode) {
    //   if (mode === "group") {
    //     this.mode = mode;
    //     this.category = null;
    //     this.status = null;
    //   } else {
    //     this.mode = "all";
    //   }
    //   this.updateUrl();
    //   this.dispatch();
    // },

    setOrder(order) {
      if (order in SORT_OPTIONS) {
        this.order = order;
      } else {
        this.order = "newest";
      }
      this.updateUrl();
      this.dispatch();
    },
  };
}
