import Alpine from "alpinejs";
import { getCategories } from "../service/getCategories";
import { getProjects } from "../service/getProjects";
import type { CategoriesStore, FiltersStore } from "../type/filters";
import type { ProjectsStore } from "../type/project";

export async function loadAllDataProjects() {
  const categoriesStore = Alpine.store("categories") as CategoriesStore;
  const filtersStore = Alpine.store("filters") as FiltersStore;
  const projectsStore = Alpine.store("projects") as ProjectsStore;

  projectsStore.setloading(true);

  const [categories, projects] = await Promise.all([
    getCategories(),
    getProjects(),
  ]);

  try {
    categoriesStore.set(categories);
    filtersStore.init();
    projectsStore.set(projects);
  } catch (err) {
    console.error(err);
    projectsStore.setError((err as Error).message);
  } finally {
    projectsStore.setloading(false);
  }
}
