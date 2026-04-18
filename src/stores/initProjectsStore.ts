import Alpine from "alpinejs";
import { getProjects } from "../scripts/service/getProjects";
import type { ProjectsStore } from "../scripts/type/project";

export function initProjectsStore() {
  Alpine.store<"projects">("projects", {
    projects: [],
    isReady: false,
    isLoading: false,
    error: null,

    async init(forse = false) {
      if (!forse && (this.isReady || this.isLoading)) return;
      this.isLoading = true;

      try {
        this.projects = await getProjects();
        this.isReady = true;
      } catch (error) {
        if (error instanceof Error) {
          this.error = error.message;
        }
        this.error = "Unknown error";
      } finally {
        this.isLoading = false;
      }
    },
  } satisfies ProjectsStore);
}
