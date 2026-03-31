import { fetchData } from "../core/api";
import { PREVIEW_PROJECTS_QUERY } from "../service/query";
import type { Project } from "../type/project";

export function projectsPrev(currentId: string) {
  return {
    projects: [] as Project[],
    visible: [] as Project[],
    current: 0,
    isMobileMatches: null as MediaQueryList | null,

    async init() {
      await this.load();
      this.isMobileMatches = window.matchMedia("(max-width: 767px)");
      this.updateVisible();
      this.isMobileMatches.addEventListener(
        "change",
        (e: MediaQueryListEvent) => {
          this.updateVisible(e.matches);
        },
      );
      console.log("🚀 ~ projectsPrev ~ visible:", this.visible);
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

    async load() {
      const seed = Date.now().toString();
      const result = await fetchData<Project[]>({
        query: PREVIEW_PROJECTS_QUERY,
        options: { currentId, seed },
      });
      this.projects = result;
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
