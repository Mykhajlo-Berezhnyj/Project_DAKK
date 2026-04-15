import { fetchData } from "../core/api";
import type { Categories } from "./filters";
import { CASHE_TTL } from "./getProjects";
import { CATEGORY_QUERY } from "./query";

let categoriesCache: Categories[] | null;

export async function getCategories(): Promise<Categories[]> {
  if (categoriesCache) return categoriesCache;

  const cached = localStorage.getItem("categories");
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CASHE_TTL) {
      categoriesCache = data;
      return data;
    }
  }

  const result = await fetchData<Categories[]>({
    query: CATEGORY_QUERY,
  });

  categoriesCache = result;
  localStorage.setItem(
    "categories",
    JSON.stringify({ data: result, timestamp: Date.now() }),
  );
  return result;
}
