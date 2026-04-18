import type { Filter } from "../type/filters";
import {
  BASE_GROUP_BY_CATEGORY_PROJECTS_QUERY,
  BASE_PROJECTS_QUERY,
  PROJECTS_FIELDS,
} from "./query";
import { getStartEnd } from "../utils/getStartEnd";
import { SORT_OPTIONS } from "../../data/sortOptions";

export function buildProjectQuery(
  filters: Partial<Filter>,
  page: number,
  perPage: number,
) {
  const { search, category, status, city, order, mode } = filters;
  const { start, end } = getStartEnd(page, perPage);
  const locale = filters.locale || "uk";
  const orderValue = SORT_OPTIONS[order || "newest"].replace("$locale", locale);

  if (mode === "group") {
    const query = `{"category": ${BASE_GROUP_BY_CATEGORY_PROJECTS_QUERY}}`
      .replace("$locale", locale)
      .replace("$order", orderValue);
    const options = { mode };
    return { query, options };
  } else {
    const query = `
{
  "projects": ${BASE_PROJECTS_QUERY}
    | order(${orderValue})
    [$start...$end]
    ${PROJECTS_FIELDS},

  "total": count(${BASE_PROJECTS_QUERY})
}
`;
    const options = {
      start,
      end,
      search: search,
      category,
      status,
      city,
      mode,
    };

    return { query, options };
  }
}
