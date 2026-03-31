import { fetchData } from "../core/api";
import { PROJECT_QUERY } from "../service/query";
import type { Project } from "../type/project";
import { leaflet } from "./leaflet";
import { getPartsPath } from "../utils/getPartsPath";

export function init() {
  const data = getPartsPath();
  if (!data?.slug) {
    document.body.innerHTML =
      "<h1 style='text-align:center'>404 — Нічого не знайдено</h1>";
    return;
  } else {
    leaflet(data.slug);
  }
}

type ActiveImage = string | null;

export function loadSingleProject() {
  return {
    project: null as Partial<Project> | null,
    isLoading: false,

    //For Gallery
    activeImage: null as ActiveImage,

    openImage(img: string) {
      this.activeImage = img;
    },

    closeImage() {
      this.activeImage = null;
    },

    async init() {
      this.reset();
      if (this.isLoading) return;
      await this.load();
    },

    async load() {
      if (this.isLoading) return;
      this.isLoading = true;

      // test
      /*  const slug = "central-park"; */

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

    reset() {
      this.project = null;
      this.isLoading = false;
    },
  };
}
