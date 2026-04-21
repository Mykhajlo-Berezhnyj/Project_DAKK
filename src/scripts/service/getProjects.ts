import Alpine from "alpinejs";
import { fetchData } from "../core/api";
import type { Project } from "../type/project";
import { PROJECT_All_QUERY } from "./query";
import type { Lang, LocaleStore } from "../type/lang";

let cashedProjects: Partial<Record<Lang, Project[]>> = {};
export const CASHE_TTL = 24 * 60 * 60 * 1000;

export async function getProjects(): Promise<Project[]> {
  const locale = (Alpine.store("locale") as LocaleStore).current;
  if (cashedProjects[locale]) return cashedProjects[locale];

  const cashed = localStorage.getItem(`projects_${locale}`);
  if (cashed) {
    try {
      const { data, timestamp } = JSON.parse(cashed);
      if (
        Array.isArray(data) &&
        typeof timestamp === "number" &&
        Date.now() - timestamp < CASHE_TTL
      ) {
        cashedProjects[locale] = data;
        return data;
      } else {
        localStorage.removeItem(`projects_${locale}`);
      }
    } catch (error) {
      localStorage.removeItem(`projects_${locale}`);
    }
  }

  const query = PROJECT_All_QUERY;

  try {
    const projects = await fetchData<Project[]>({ query });

    if (!Array.isArray(projects)) {
      throw new Error("Invalid projects response");
    }

    localStorage.setItem(
      `projects_${locale}`,
      JSON.stringify({
        data: projects,
        timestamp: Date.now(),
      }),
    );

    cashedProjects[locale] = projects;
    return projects;
  } catch (error) {
    throw error;
  }
}
