import { fetchData } from "../core/api";
import { PROJECT_QUERY } from "../service/query";
import type { Project } from "../type/project";
import { getStartEnd } from "../utils/getStartEnd";

/* export function init() {} */

export function loadSingleProject() {
    return {
        project: null as Partial<Project> | null,
        isLoading: false,

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
            const slug = window.location.pathname.split("/").pop();
             

            try {
                this.project = await fetchData<Project>({
                    query: PROJECT_QUERY,
                    options: { slug },
                });
                console.log("🚀 ~ loadProjects ~ project:", this.project);
            } catch (e) {
                console.error("Error loading project: ", e)
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

