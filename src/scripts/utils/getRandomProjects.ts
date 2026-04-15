import type { Project } from "../type/project";

export function getRandomProjects(
  projects: Partial<Project>[],
  count = 6,
): Partial<Project>[] {
  const sorted = [...projects].sort(() => Math.random() - 0.5);
  return sorted.slice(0, count)
}
