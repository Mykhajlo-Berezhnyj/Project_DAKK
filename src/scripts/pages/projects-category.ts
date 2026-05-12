import Alpine from "alpinejs";
import { localization } from "../core/localization.ts";
import { getPartsPath } from "../utils/getPartsPath.ts";
import { redirect } from "../utils/redirect.ts";
import { bootstrap } from "./projects.ts";
import { leaflet } from "./leaflet.ts";
import type { Categories, CategoriesStore } from "../type/filters.ts";
import type { Project, ProjectsStore } from "../type/project.ts";
import { fetchData } from "../core/api.ts";
import { CATEGORY_QUERY, PROJECT_QUERY } from "../service/query.ts";

export async function init() {
  Alpine.data("pageCategoryProject", () => pageCategoryProject());

  Alpine.data("leaflet", leaflet);
}

export function pageCategoryProject() {
  return {
    is404: false,
    category: undefined as Categories | undefined,

    async init() {
      await bootstrap();
      const category = await validationProject("all");
      if (!category) return;
      this.category = category;
      this.setSeo();
    },

    setSeo() {
      const locale = localization();
      document.title = `${locale.t(locale.projectsData.titleHead)} ${locale.t(
        locale.projectsData.page,
      )} — ${this.category?.name}`;

      const meta = document.querySelector('meta[name="description"]');
      const description = this.category
        ? `${locale.t(locale.projectsData.descriptionHeadCategories)} — ${
            this.category.name
          }`
        : locale.t(locale.projectsData.descriptionHead);
      if (meta) {
        meta.setAttribute("content", description);
      }
    },
  };
}

export async function validationProject(
  validation: "all",
): Promise<Categories | undefined>;

export async function validationProject(
  validation: "single",
): Promise<Project | undefined>;

export async function validationProject(validation: "all" | "single" = "all") {
  const { page, category, slug } = getPartsPath();
  const locale = localization();
  const url = `${locale.l("/projects")}`;

  if (page === "404") {
    redirect({ url, message: "projectPage" });
  }

  let found = (Alpine.store("categories") as CategoriesStore).list.find(
    (c) => c.slug === category,
  );

  if (found && validation === "all") {
    return found;
  } else if (!found) {
    const cat = await fetchData<Categories[]>({ query: CATEGORY_QUERY });
    if (!cat) return redirect({ url, message: "projectPage" });
    found = cat.find((c) => c.slug === category);
    if (!found) {
      return redirect({ url, message: "projectPage" });
    } else if (validation === "all") {
      return found;
    }
  }

  let project = (Alpine.store("projects") as ProjectsStore).projects.find(
    (p) => p.slug === slug,
  );
  if (project) return project;

  try {
    project = await fetchData<Project>({
      query: PROJECT_QUERY,
      options: { slug },
    });

    if (project) return project;
  } catch (e) {
    console.error("Error loading project: ", e);
  } finally {
    return redirect({ url, message: "projectPage" });
  }
}
