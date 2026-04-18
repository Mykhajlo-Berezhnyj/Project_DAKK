import Alpine from "alpinejs";
import { fetchData } from "../core/api";
import type { Categories } from "../type/filters";
import { CASHE_TTL } from "./getProjects";
import { CATEGORY_QUERY } from "./query";
import type { Lang, LocaleStore } from "../type/lang";

let categoriesCache: Partial<Record<Lang, Categories[]>> = {};

export async function getCategories(): Promise<Categories[]> {
  const locale = (Alpine.store("locale") as LocaleStore).current;
  if (categoriesCache[locale]) return categoriesCache[locale];

  const cached = localStorage.getItem(`categories_${locale}`);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CASHE_TTL) {
      categoriesCache[locale] = data;
      return data;
    }
  }

  const result = await fetchData<Categories[]>({
    query: CATEGORY_QUERY,
  });

  categoriesCache[locale] = result;
  localStorage.setItem(
    `categories_${locale}`,
    JSON.stringify({ data: result, timestamp: Date.now() }),
  );
  return result;
}
