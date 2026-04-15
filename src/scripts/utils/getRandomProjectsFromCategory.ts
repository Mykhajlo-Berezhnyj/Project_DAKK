import type { CategorySlug, Project } from "../type/project";

export function getRandomProjectsFromCategory(
  grouped: Record<CategorySlug, Partial<Project>[]>,
) {
  return Object.entries(grouped).map(([category, projects]) => {
    const randomIndex = Math.floor(Math.random() * projects.length);

    return {
      category: category as CategorySlug,
      project: projects[randomIndex],
    };
  });
}
