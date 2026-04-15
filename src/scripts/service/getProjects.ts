import Alpine from "alpinejs";
import { fetchData } from "../core/api";
import type { Project } from "../type/project";
import { PROJECT_All_QUERY } from "./query";
import type { LocaleStore } from "../type/lang";

let cashedProjects: Project[] | null;
export const CASHE_TTL = 24 * 60 * 60 * 1000;

export async function getProjects(): Promise<Project[]> {
  if (cashedProjects) return cashedProjects;
  const locale = (Alpine.store("locale") as LocaleStore).current;

  const cashed = localStorage.getItem(`projects_${locale}`);
  if (cashed) {
    const { data, timestamp } = JSON.parse(cashed);
    if (Date.now() - timestamp > CASHE_TTL) {
      cashedProjects = data;
      return data;
    }
  }

  const query = PROJECT_All_QUERY;

  const projects = await fetchData<Project[]>({ query });
  try {
    localStorage.setItem(
      `projects_locale`,
      JSON.stringify({
        data: projects,
        timestamp: Date.now(),
      }),
    );
  } catch (error) {}
  cashedProjects = projects;
  return projects;
}
