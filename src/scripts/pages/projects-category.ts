import Alpine from "alpinejs";
import { localization } from "../core/localization.ts";
import { getPartsPath } from "../utils/getPartsPath.ts";
import { redirect } from "../utils/redirect.ts";
import { bootstrap } from "./projects.ts";
import { leaflet } from "./leaflet.ts";
import type { Categories, CategoriesStore } from "../type/filters.ts";
import type { Project, ProjectsStore } from "../type/project.ts";

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
      this.category = validationProject("all");
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

export function validationProject(validation: "all"): Categories | undefined;

export function validationProject(validation: "single"): Project | undefined;

export function validationProject(validation: "all" | "single" = "all") {
  const { page, category, slug } = getPartsPath();
  const locale = localization();
  const url = `${locale.l("/projects")}`;

  if (page === "404") {
    redirect({ url, message: "projectPage" });
  }

  const found = (Alpine.store("categories") as CategoriesStore).list.find(
    (c) => c.slug === category,
  );

  if (!found) {
    redirect({ url, message: "projectPage" });
  } else if (found && validation === "all") {
    return found;
  }

  let project = (Alpine.store("projects") as ProjectsStore).projects.find(
    (p) => p.slug === slug,
  );
  if (!project) {
    redirect({ url, message: "projectPage" });
  }
  return project;
}
