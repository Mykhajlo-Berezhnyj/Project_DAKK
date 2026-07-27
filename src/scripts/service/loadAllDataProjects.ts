import Alpine from "alpinejs";
import type { CategoriesStore, FiltersStore } from "../type/filters";
import type { Project, ProjectsStore } from "../type/project";
import { getCashed } from "./getCashed";
import { fetchData } from "../core/api";
import { LEAFLET_QUERY, PROJECT_All_QUERY } from "./query";
import type { ProjectLocation } from "../pages/leaflet";

export async function loadAllDataProjects() {
  const categoriesStore = Alpine.store("categories") as CategoriesStore;
  const filtersStore = Alpine.store("filters") as FiltersStore;
  const projectsStore = Alpine.store("projects") as ProjectsStore;

  projectsStore.setloading(true);

  const [projects] = await Promise.all([
    // getCashed("categories", () =>
    //   fetchData<Categories[]>({
    //     query: CATEGORY_QUERY,
    //     options: { locale },
    //   }),
    // ),
    getCashed("projects", () =>
      fetchData<Project[]>({ query: PROJECT_All_QUERY }),
    ),
    getCashed("locations", () =>
      fetchData<ProjectLocation[]>({
        query: LEAFLET_QUERY,
      }),
    ),
  ]);

  const categories = [
    ...new Map(
      projects
        ?.filter((p) => p.category)
        .map((p) => [
          p.category.slug,
          { name: p.category.name, slug: p.category.slug },
        ]),
    ).values(),
  ];
  console.log("🚀 ~ loadAllDataProjects ~ categories:", categories);

  try {
    if (categories) {
      categoriesStore.set(categories);
    }
    filtersStore.init();
    if (projects) {
      projectsStore.set(projects);
    }
  } catch (err) {
    console.error(err);
    projectsStore.setError((err as Error).message);
  } finally {
    projectsStore.setloading(false);
  }
}
