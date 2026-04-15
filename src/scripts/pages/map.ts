// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import { fetchData } from "../core/api";
// import { LEAFLET_QUERY } from "../service/query";
// import { localization } from "../core/localization";

// export const map = L.map("map").setView([50.4501, 30.5234], 12);

// L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//   attribution: "© OpenStreetMap contributors",
// }).addTo(map);

// export interface ProjectLocation {
//   name: string;
//   slug: string;
//   location: { lat: number; lng: number };
// }

// const local = localization();

// export async function init() {
//   const projects: ProjectLocation[] = await fetchData({
//     query: LEAFLET_QUERY,
//   });

//   projects.forEach((p) => {
//     if (p.location) {
//       L.marker([p.location.lat, p.location.lng])
//         .addTo(map)
//         .bindPopup(
//           `<b>${p.name}</b><br></br><a href="${local.l(`/projects/${p.slug}`)}">Переглянути</a>`,
//         );
//     }
//   });
// }
