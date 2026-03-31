import L from "leaflet";
import type { Map } from "leaflet";
import "leaflet/dist/leaflet.css";
import { fetchData } from "../core/api";
import { LEAFLET_QUERY, LEAFLET_SINGLE_QUERY } from "../service/query";
import { localization } from "../core/localization";
import type { Category } from "../type/project";

let map: Map;

const defaultIcon = L.icon({
  iconUrl: "/images/marker-icon.png",
  iconRetinaUrl: "/images/marker-icon-2x.png",
  shadowUrl: "/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface ProjectLocation {
  projectName: string;
  slug: string;
  category: Category;
  location: { lat: number; lng: number };
}

const local = localization();

export async function init() {
  if (!map) {
    map = L.map("map").setView([50.4501, 30.5234], 12);

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

export async function leaflet(slug: string) {
  const project: ProjectLocation = await fetchData({
    query: LEAFLET_SINGLE_QUERY,
    options: {
      slug,
    },
  });

  if (project.location) {
    if (!map) {
      map = L.map("map").setView(
        [project.location.lat, project.location.lng],
        12,
      );
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
}
