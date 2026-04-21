import type { StatusItem } from "../../data/dictionary/statusLang";
import type { SortKey } from "../../data/sortOptions";
import type { CategorySlug, Status } from "./project";

export type Categories = {
  name: string;
  slug: CategorySlug;
};

export type Mode = "all" | "group";

export type CategoriesStore = {
  list: Categories[];
  isReady: boolean;
  set: (data: Categories[]) => void;
};

export interface Filter {
  status: Status | null;
  category: CategorySlug | null;
  city: string | null;
  search: string;
  order: SortKey;
  locale?: string;
  categories: Categories[];
  mode: Mode | null;
}

export interface FiltersStore extends Filter {
  init: () => void;
  paramsFromUrl: () => void;
  updateUrl: () => void;
  isActive: (item: StatusItem) => void;
}
