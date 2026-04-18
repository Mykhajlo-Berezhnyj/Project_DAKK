import type { Project } from "../type/project";

export function getTimelineDate(project: Partial<Project>): number {
  if (project.timeline?.yearEnd)
    return new Date(project.timeline.yearEnd).getTime();
  if (project.timeline?.yearStart)
    return new Date(project.timeline.yearStart).getTime();
  return 0;
}
