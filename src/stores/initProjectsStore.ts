import Alpine from "alpinejs";
import type { ProjectsStore } from "../scripts/type/project";

export function initProjectsStore() {
  Alpine.store<"projects">("projects", {
    projects: [],
    isReady: false,
    isLoading: false,
    error: null,

    set(data) {
      this.projects = data;
      this.isReady = true;
    },

    setError(error) {
      this.error = error;
    },

    setloading(isLoading) {
      this.isLoading = isLoading;
    },
  } satisfies ProjectsStore);
}
