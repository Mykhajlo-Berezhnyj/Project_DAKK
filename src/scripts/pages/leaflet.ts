import type { Map } from "leaflet";
import { fetchData } from "../core/api";
import { LEAFLET_QUERY, LEAFLET_SINGLE_QUERY } from "../service/query";
import { localization } from "../core/localization";
import type { Category } from "../type/project";
import { getPartsPath } from "../utils/getPartsPath";

interface ProjectLocation {
  projectName: string;
  slug: string;
  category: Category;
  location: { lat: number; lng: number };
}

interface GestureMapOptions extends L.MapOptions {
  gestureHandling?: boolean;
}

let map: Map;

const local = localization();

export function leaflet() {
  return {
    isLoad: false,

    async buildMap() {
      if (this.isLoad) return;
      this.isLoad = true;

      const { page, slug } = getPartsPath();
      const L = await import("leaflet");
      await import("leaflet-gesture-handling");
      await import("leaflet/dist/leaflet.css");
      await import("leaflet-gesture-handling/dist/leaflet-gesture-handling.css");

      const defaultIcon = L.icon({
        iconUrl: "/images/marker-icon.png",
        iconRetinaUrl: "/images/marker-icon-2x.png",
        shadowUrl: "/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      if (page === "project-single" && slug) {
        const project: ProjectLocation = await fetchData({
          query: LEAFLET_SINGLE_QUERY,
          options: {
            slug,
          },
        });

        if (project.location) {
          if (!map) {
            map = L.map("map", {
              center: [project.location.lat, project.location.lng],
              zoom: 12,
              gestureHandling: true,
              scrollWheelZoom: false,
            } as GestureMapOptions);
            L.Marker.prototype.options.icon = defaultIcon;

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
              attribution: "© OpenStreetMap contributors",
            }).addTo(map);
          } else {
            map.setView([project.location.lat, project.location.lng], 12);
          }

          L.marker([project.location.lat, project.location.lng])
            .addTo(map)
            .bindPopup(
              `<div style="text-align: center"><b>${project.projectName}</b><br></br><a href="${local.l(`/projects/${project.category.slug}/${project.slug}`)}">${local.t(local.projectsData.view)}</a></div>`,
            );
        }
      } else {
        if (!map) {
          map = L.map("map", {
            center: [50.4501, 30.5234],
            zoom: 12,
            gestureHandling: true,
            scrollWheelZoom: false,
          } as GestureMapOptions);
          L.Marker.prototype.options.icon = defaultIcon;

          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
          }).addTo(map);
        } else {
          map.setView([50.4501, 30.5234], 12);
        }

        const projects: ProjectLocation[] = await fetchData({
          query: LEAFLET_QUERY,
        });

        projects.forEach((p) => {
          if (p.location) {
            L.marker([p.location.lat, p.location.lng])
              .addTo(map)
              .bindPopup(
                `<b>${p.projectName}</b><br><a href="${local.l(`/projects/${p.category.slug}/${p.slug}`)}">${local.t(local.projectsData.view)}</a>`,
              );
          }
        });
      }
    },

    textMap() {
      const { page, slug } = getPartsPath();

      if (page === "project-single" && slug) {
        return {
          title: local.t(local.projectsData.mapTitle),
          text: local.t(local.projectsData.mapText),
        };
      } else {
        return {
          title: local.t(local.projectsData.mapsTitle),
          text: local.t(local.projectsData.mapsText),
        };
      }
    },
  };
}
