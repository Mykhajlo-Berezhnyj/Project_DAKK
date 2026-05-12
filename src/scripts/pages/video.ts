import Alpine from "alpinejs";
import type { VideoStore } from "../type/video";
import { fetchData } from "../core/api";
import { VIDEOS_QUERY } from "../service/query";

export const videoStore: VideoStore = {
  items: [],
  isItemOpened: false,
  openedItemId: null,

  get openedVideo() {
    return this.items.find((item) => item._id === this.openedItemId) || null;
  },

  get embedUrl() {
    if (!this.openedVideo?.videoUrl) return "";
    try {
      const url = new URL(this.openedVideo.videoUrl);
      if (url.hostname === "www.youtube.com" && url.pathname === "/watch") {
        const videoId = url.searchParams.get("v");
        return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
      }
      if (
        url.hostname === "drive.google.com" &&
        url.pathname.includes("/view")
      ) {
        return this.openedVideo.videoUrl.replace("/view", "/preview");
      }
      return this.openedVideo.videoUrl;
    } catch (error) {
      console.error("Invalid video URL:", this.openedVideo.videoUrl, error);
      return "";
    }
  },

  getVideos() {
    return this.items;
  },

  openModal(id) {
    this.openedItemId = id;
    this.isItemOpened = true;
    document.body.style.overflow = "hidden";
  },

  closeModal() {
    this.isItemOpened = false;
    this.openedItemId = null;
    document.body.style.overflow = "";
  },
};

export function init() {
  Alpine.store("videos", videoStore);

  const store = Alpine.store("videos") as VideoStore;

  fetchData({
    query: VIDEOS_QUERY,
    options: {
      start: 0,
      end: 10,
    },
  })
    .then((data: any) => {
      store.items = [...data.videos];
      console.log(videoStore.items);
    })
    .catch((err) => {
      console.error("Failed to load video:", err);
    });
}
