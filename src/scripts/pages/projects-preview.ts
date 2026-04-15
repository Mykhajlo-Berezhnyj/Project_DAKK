import Alpine from "alpinejs";
import type { Project, ProjectsStore } from "../type/project";
import { getRandomProjects } from "../utils/getRandomProjects";

export function projectsPrev() {
  return {
    projects: [] as Partial<Project>[],
    visible: [] as Partial<Project>[],
    current: 0,
    isMobileMatches: null as MediaQueryList | null,

    init() {
      const store = Alpine.store("projects") as ProjectsStore;

      Alpine.effect(() => {
        if (!store.isReady || store.projects.length === 0) return;
        const projects = store.projects;
        this.projects = getRandomProjects(projects);

        this.isMobileMatches = window.matchMedia("(max-width: 767px)");
        this.updateVisible();
        this.isMobileMatches.addEventListener(
          "change",
          (e: MediaQueryListEvent) => {
            this.updateVisible(e.matches);
          },
        );
      });
    },

    updateVisible(eventMatches?: boolean) {
      if (!this.isMobileMatches) return;
      const matches = eventMatches ?? this.isMobileMatches.matches;
      this.visible = matches
        ? [this.projects[this.current]]
        : [
            this.projects[this.current],
            this.projects[(this.current + 1) % this.projects.length],
          ];
    },

    next() {
      this.current = (this.current + 1) % this.projects.length;
      this.updateVisible();
    },

    prev() {
      this.current =
        (this.current - 1 + this.projects.length) % this.projects.length;
      this.updateVisible();
    },
  };
}
