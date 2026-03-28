import { fetchData } from "../core/api";
import type { Categories } from "./filters";
import { CATEGORY_QUERY } from "./query";

let categoriesCache: Categories[] | null;

export async function getCategories(): Promise<Categories[]> {
  if (categoriesCache) return categoriesCache;

  const cached = localStorage.getItem("categories");
  if (cached) {
    const parsed = JSON.parse(cached);
    categoriesCache = parsed;
    return parsed;
  }

  const result = await fetchData<Categories[]>({
    query: CATEGORY_QUERY,
  });

  categoriesCache = result;
  localStorage.setItem("categories", JSON.stringify(result));
  return result;
}
