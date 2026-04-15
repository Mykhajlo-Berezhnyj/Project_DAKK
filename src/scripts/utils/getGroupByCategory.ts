import type { CategorySlug, Project } from "../type/project";

export function getGroupByCategory(projects: Partial<Project>[]) {
  return projects.reduce(
    (acc, p) => {
      const category = p.category?.slug;
      if (!category) return acc;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(p);
      return acc;
    },
    {} as Record<CategorySlug, Partial<Project>[]>,
  );
}
