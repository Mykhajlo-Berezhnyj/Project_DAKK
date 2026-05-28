export const SORT_OPTIONS = {
  newest: "_createdAt desc",
  oldest: "_createdAt asc",

  nameAsc: "coalesce(projectName[$locale], projectName.uk) asc",
  nameDesc: "coalesce(projectName[$locale], projectName.uk) desc",

  areaAsc: "area asc",
  areaDesc: "area desc",

  cityAsc: "coalesce(city->name[$locale], city->name.uk) asc",
  cityDesc: "coalesce(city->name[$locale], city->name.uk) desc",
} as const;

export type SortKey = keyof typeof SORT_OPTIONS;

export type SortValue = (typeof SORT_OPTIONS)[SortKey];

export type SortOptions = typeof SORT_OPTIONS;
