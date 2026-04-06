import Alpine from "alpinejs";
import type { NewsStore, New } from "../type/news";

export function getPost() {
  const newsStore = Alpine.store("news") as NewsStore;
  const currentId = newsStore.getCurrentPublication();
  const currentPost = newsStore
    .getNews()
    .find((item: New) => item._id === currentId);

  return currentPost || null;
}

export function resetCurrentPost() {
  const newsStore = Alpine.store("news") as NewsStore;

  newsStore.setCurrentPublication(null);
  newsStore.setPublicationStatus(false);
}
