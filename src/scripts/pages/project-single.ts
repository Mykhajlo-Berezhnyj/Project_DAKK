import Alpine from "alpinejs";
import { fetchData } from "../core/api";
import { PROJECT_QUERY } from "../service/query";
import type { Project } from "../type/project";
import { getPartsPath } from "../utils/getPartsPath";
import { projectsPrev } from "./projects-preview";
import { leaflet } from "./leaflet";
import { psGallery } from "../utils/psGallery";
import { bootstrap } from "./projects";
import { validationProject } from "./projects-category";

export function init() {
  Alpine.data("loadSingleProject", () => loadSingleProject());
  Alpine.data("projectsPrev", projectsPrev);
  Alpine.data("leaflet", leaflet);
}

// type ActiveImage = string | null;

export function loadSingleProject() {
  return {
    project: null as Partial<Project> | null,
    isLoading: false,
    galleryData: psGallery(),
    //For Gallery
    //     activeImage: null as ActiveImage,

    async init() {
      await bootstrap();
      const project = validationProject("single");
      if (project) {
        this.project = project;
      } else {
        // this.reset();
        await this.load();
      }
      if (this.project?.photo?.length) {
        this.galleryData.setPhotos(this.project.photo);
        console.log("photos:", this.project?.photo);
      }
    },

    async load() {
      if (this.isLoading) return;
      this.isLoading = true;

      //real
      // const slug = window.location.pathname.split("/").pop();

      const { slug } = getPartsPath();

      try {
        this.project = await fetchData<Project>({
          query: PROJECT_QUERY,
          options: { slug },
        });
        console.log("🚀 ~ loadProjects ~ project:", this.project);
      } catch (e) {
        console.error("Error loading project: ", e);
      } finally {
        this.isLoading = false;
      }

      // end test
    },

    // reset() {
    //   this.project = null;
    //   this.isLoading = false;
    //   this.galleryData = psGallery();
    // },
  };
}
