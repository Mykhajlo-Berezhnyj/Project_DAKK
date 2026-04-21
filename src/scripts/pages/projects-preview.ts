import Alpine from "alpinejs";
import type { Project, ProjectsStore } from "../type/project";
import { getRandomProjects } from "../utils/getRandomProjects";

export function projectsPrev() {
  return {
    projects: [] as Partial<Project>[],
    visible: [] as Partial<Project>[],
    current: 0,
    isMobileMatches: null as MediaQueryList | null,
    step: 1,

    init() {
      const store = Alpine.store("projects") as ProjectsStore;

      Alpine.effect(() => {
        if (!store.isReady || store.projects.length === 0) return;
        const projects = store.projects;
  
        if (this.projects.length === 0) {
          this.projects = getRandomProjects(projects);
        }
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
      this.step = matches ? 1 : 2;
    },

    async next() {
      const index = (this.current + this.step) % this.projects.length;
      this.visible = [...this.visible, this.projects[index]];
      await Alpine.nextTick();
      const items = document.querySelectorAll(".item-prev");
      items.forEach((el) => el.classList.add("next"));

      await Promise.race([
        new Promise<void>((resolve) =>
          items[0]?.addEventListener("transitionend", () => resolve(), {
            once: true,
          }),
        ),
        new Promise((resolve) => setTimeout(resolve, 350)),
      ]);

      this.current = (this.current + 1) % this.projects.length;
      items.forEach((el) => el.classList.remove("next"));
    },

    async prev() {
      this.current =
        (this.current - 1 + this.projects.length) % this.projects.length;
      this.updateVisible();
      await Alpine.nextTick();
      const index = (this.current + 1) % this.projects.length;
      this.visible = [...this.visible, this.projects[index]];
      await Alpine.nextTick();

      const items = document.querySelectorAll(".item-prev");
      items.forEach((el) => el.classList.add("prev"));

      await new Promise<void>((resolve) =>
        items[0]?.addEventListener("transitionend", () => resolve(), {
          once: true,
        }),
      );

      items.forEach((el) => el.classList.remove("prev"));
    },
  };
}
